/**
 * REDIS CACHE SERVICE
 * =============================================================================
 * In-memory LRU cache with optional Redis backing via ioredis.
 * Falls back gracefully to pure in-memory Map when Redis is unavailable.
 *
 * USE CASES:
 *   - Market data cache (60-second TTL) — avoids hammering external APIs
 *   - Rate limiting per API key / IP address
 *   - Session state for WebSocket clients
 *   - Signal deduplication (prevent duplicate signal IDs)
 *
 * ARCHITECTURE:
 *   Layer 1 — In-memory Map (L1): sub-millisecond, process-local
 *   Layer 2 — Redis (L2): milliseconds, shared across processes/replicas
 *   When Redis not configured: L1 only (single-process mode)
 *
 * ENVIRONMENT:
 *   REDIS_URL — Redis connection string (redis://... or rediss://...)
 *               If absent → in-memory mode, no Redis required
 */

// ── Types ─────────────────────────────────────────────────────────────────────

interface CacheEntry<T = unknown> {
  value:      T;
  expires_at: number;   // Unix ms
  created_at: number;
  hits:       number;
}

interface RateLimitEntry {
  count:      number;
  window_end: number;   // Unix ms
}

interface CacheStats {
  mode:          'redis' | 'memory';
  l1_size:       number;
  hits:          number;
  misses:        number;
  hit_rate_pct:  number;
  evictions:     number;
  redis_enabled: boolean;
  uptime_ms:     number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_TTL_MS    = 60_000;          // 60 seconds (market data)
const LONG_TTL_MS       = 300_000;         // 5 minutes  (NLP scores, COT)
const SIGNAL_TTL_MS     = 3_600_000;       // 1 hour     (deduplication)
const RATE_WINDOW_MS    = 60_000;          // 1-minute rate limit window
const MAX_L1_ENTRIES    = 2_000;           // Evict LRU when exceeded
const CLEANUP_INTERVAL  = 30_000;          // Sweep expired entries every 30s

// ── RedisCache Service ────────────────────────────────────────────────────────

export class RedisCacheService {

  private l1 = new Map<string, CacheEntry>();
  private rateLimits = new Map<string, RateLimitEntry>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private redis: any = null;
  private redisEnabled = false;
  private stats = { hits: 0, misses: 0, evictions: 0 };
  private startedAt = Date.now();
  private cleanupTimer?: ReturnType<typeof setInterval>;

  constructor() {
    this.initRedis();
    this.startCleanup();
  }

  // ── Initialisation ──────────────────────────────────────────────────────────

  private async initRedis(): Promise<void> {
    const url = process.env.REDIS_URL;
    if (!url) {
      console.log('[RedisCache] REDIS_URL not set — running in in-memory mode');
      return;
    }

    try {
      // Dynamic import so server still starts without ioredis installed
      const { default: Redis } = await import('ioredis');
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 3,
        enableReadyCheck:     true,
        lazyConnect:          false,
        connectTimeout:       5_000,
      });

      this.redis.on('connect',   () => {
        this.redisEnabled = true;
        console.log('[RedisCache] Redis connected');
      });
      this.redis.on('error',     (err: Error) => console.warn('[RedisCache] Redis error:', err.message));
      this.redis.on('close',     () => {
        this.redisEnabled = false;
        console.warn('[RedisCache] Redis disconnected — falling back to L1');
      });

      await this.redis.ping();
      this.redisEnabled = true;
    } catch (err) {
      console.warn('[RedisCache] Redis unavailable — in-memory mode only:', (err as Error).message);
      this.redis         = null;
      this.redisEnabled  = false;
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => this.sweepExpired(), CLEANUP_INTERVAL);
    if (this.cleanupTimer.unref) this.cleanupTimer.unref(); // Don't prevent process exit
  }

  private sweepExpired(): void {
    const now = Date.now();
    let evicted = 0;
    for (const [key, entry] of this.l1.entries()) {
      if (entry.expires_at <= now) {
        this.l1.delete(key);
        evicted++;
      }
    }
    if (evicted > 0) this.stats.evictions += evicted;

    // Also enforce max size via LRU: delete oldest if over limit
    if (this.l1.size > MAX_L1_ENTRIES) {
      const toDelete = this.l1.size - MAX_L1_ENTRIES;
      let deleted = 0;
      for (const key of this.l1.keys()) {
        if (deleted >= toDelete) break;
        this.l1.delete(key);
        deleted++;
        this.stats.evictions++;
      }
    }
  }

  // ── Core GET / SET ──────────────────────────────────────────────────────────

  async get<T = unknown>(key: string): Promise<T | null> {
    // L1 check
    const l1Entry = this.l1.get(key);
    if (l1Entry) {
      if (l1Entry.expires_at > Date.now()) {
        l1Entry.hits++;
        this.stats.hits++;
        return l1Entry.value as T;
      }
      this.l1.delete(key);
    }

    // L2 Redis check
    if (this.redisEnabled && this.redis) {
      try {
        const raw = await this.redis.get(key);
        if (raw) {
          const parsed = JSON.parse(raw) as { value: T; expires_at: number };
          if (parsed.expires_at > Date.now()) {
            // Populate L1 for next hit
            this.l1.set(key, {
              value:      parsed.value,
              expires_at: parsed.expires_at,
              created_at: Date.now(),
              hits:       1,
            });
            this.stats.hits++;
            return parsed.value;
          }
        }
      } catch (err) {
        // Redis read failure — degrade silently
      }
    }

    this.stats.misses++;
    return null;
  }

  async set<T = unknown>(key: string, value: T, ttlMs = DEFAULT_TTL_MS): Promise<void> {
    const expires_at = Date.now() + ttlMs;

    // Write to L1
    this.l1.set(key, { value, expires_at, created_at: Date.now(), hits: 0 });

    // Write to L2 Redis
    if (this.redisEnabled && this.redis) {
      try {
        const payload = JSON.stringify({ value, expires_at });
        await this.redis.set(key, payload, 'PX', ttlMs);
      } catch {
        // Redis write failure — L1 still holds value
      }
    }
  }

  async del(key: string): Promise<void> {
    this.l1.delete(key);
    if (this.redisEnabled && this.redis) {
      try { await this.redis.del(key); } catch { /* ignore */ }
    }
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }

  // ── Typed Cache Helpers ─────────────────────────────────────────────────────

  /** Cache market data (60-second TTL) */
  async getMarketData<T>(symbol: string, assetClass: string): Promise<T | null> {
    return this.get<T>(`market:${assetClass}:${symbol}`);
  }

  async setMarketData<T>(symbol: string, assetClass: string, data: T): Promise<void> {
    await this.set(`market:${assetClass}:${symbol}`, data, DEFAULT_TTL_MS);
  }

  /** Cache NLP/COT scores (5-minute TTL) */
  async getNLPScore(source: string): Promise<unknown> {
    return this.get(`nlp:${source}`);
  }

  async setNLPScore(source: string, score: unknown): Promise<void> {
    await this.set(`nlp:${source}`, score, LONG_TTL_MS);
  }

  /** Signal deduplication (1-hour TTL) */
  async hasSignal(signalId: string): Promise<boolean> {
    return this.has(`sig:${signalId}`);
  }

  async markSignal(signalId: string): Promise<void> {
    await this.set(`sig:${signalId}`, 1, SIGNAL_TTL_MS);
  }

  // ── Rate Limiting ───────────────────────────────────────────────────────────

  /**
   * Token-bucket rate limiter.
   * @param identifier — API key, IP, or user ID
   * @param limit      — max requests per window
   * @param windowMs   — window size in milliseconds
   * @returns { allowed, remaining, reset_at }
   */
  async checkRateLimit(
    identifier: string,
    limit:      number = 60,
    windowMs:   number = RATE_WINDOW_MS,
  ): Promise<{ allowed: boolean; remaining: number; reset_at: number }> {
    const key = `rl:${identifier}`;
    const now = Date.now();

    // Try Redis-based rate limit first (atomic increment)
    if (this.redisEnabled && this.redis) {
      try {
        const rlKey     = `rl2:${identifier}`;
        const count     = await this.redis.incr(rlKey);
        const reset_at  = now + windowMs;

        if (count === 1) {
          // First request in window — set expiry
          await this.redis.pexpire(rlKey, windowMs);
        }

        const allowed   = count <= limit;
        const remaining = Math.max(0, limit - count);
        return { allowed, remaining, reset_at };
      } catch {
        // Fall through to memory-based
      }
    }

    // In-memory rate limit
    const entry = this.rateLimits.get(key);
    if (!entry || entry.window_end <= now) {
      // New window
      const newEntry: RateLimitEntry = { count: 1, window_end: now + windowMs };
      this.rateLimits.set(key, newEntry);
      return { allowed: true, remaining: limit - 1, reset_at: newEntry.window_end };
    }

    entry.count++;
    const allowed   = entry.count <= limit;
    const remaining = Math.max(0, limit - entry.count);
    return { allowed, remaining, reset_at: entry.window_end };
  }

  /** Express middleware for rate limiting */
  middleware(limit = 60, windowMs = RATE_WINDOW_MS, keyFn?: (req: any) => string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: any, res: any, next: any) => {
      const identifier = keyFn
        ? keyFn(req)
        : (req.headers['x-api-key'] as string) || req.ip || 'anonymous';

      const { allowed, remaining, reset_at } = await this.checkRateLimit(identifier, limit, windowMs);

      res.set('X-RateLimit-Limit',     String(limit));
      res.set('X-RateLimit-Remaining', String(remaining));
      res.set('X-RateLimit-Reset',     String(Math.ceil(reset_at / 1000)));

      if (!allowed) {
        return res.status(429).json({
          error:          'Rate limit exceeded',
          limit,
          reset_at:       new Date(reset_at).toISOString(),
          retry_after_ms: reset_at - Date.now(),
        });
      }

      next();
    };
  }

  // ── Cache Invalidation ──────────────────────────────────────────────────────

  /** Invalidate all market data for a symbol */
  async invalidateMarketData(symbol: string): Promise<void> {
    const prefixes = ['forex', 'crypto', 'stock'];
    await Promise.all(prefixes.map(ac => this.del(`market:${ac}:${symbol}`)));
  }

  /** Flush entire L1 cache */
  flushL1(): void {
    const size = this.l1.size;
    this.l1.clear();
    this.stats.evictions += size;
  }

  // ── Stats ───────────────────────────────────────────────────────────────────

  getStats(): CacheStats {
    const total     = this.stats.hits + this.stats.misses;
    const hit_rate  = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      mode:          this.redisEnabled ? 'redis' : 'memory',
      l1_size:       this.l1.size,
      hits:          this.stats.hits,
      misses:        this.stats.misses,
      hit_rate_pct:  Math.round(hit_rate * 100) / 100,
      evictions:     this.stats.evictions,
      redis_enabled: this.redisEnabled,
      uptime_ms:     Date.now() - this.startedAt,
    };
  }

  async healthCheck(): Promise<{ healthy: boolean; mode: string; latency_ms?: number; error?: string }> {
    if (!this.redisEnabled || !this.redis) {
      return { healthy: true, mode: 'memory', latency_ms: 0 };
    }

    try {
      const start = Date.now();
      await this.redis.ping();
      return { healthy: true, mode: 'redis', latency_ms: Date.now() - start };
    } catch (err) {
      return { healthy: false, mode: 'redis', error: (err as Error).message };
    }
  }

  // ── Shutdown ─────────────────────────────────────────────────────────────────

  async shutdown(): Promise<void> {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    if (this.redis) {
      try { await this.redis.quit(); } catch { /* ignore */ }
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

export const redisCache = new RedisCacheService();
export default redisCache;
