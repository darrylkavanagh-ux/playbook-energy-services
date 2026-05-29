/**
 * TRM BLOCKINT API SERVICE
 * ============================================================================
 * Production-grade integration for TRM Labs BLOCKINT blockchain intelligence.
 *
 * Capabilities:
 *   - Wallet screening & risk scoring
 *   - Transaction tracing (forward + backward)
 *   - Asset-flow analysis across chains
 *   - Entity linkage & attribution
 *   - Exposure aggregation (direct + indirect)
 *   - Chronology reconstruction from on-chain events
 *
 * Rate-Limit Handling:
 *   - Respects Retry-After header (HTTP 429)
 *   - Exponential backoff with full-jitter
 *   - Bounded retries (configurable, default 5)
 *   - In-memory request queue with concurrency cap
 *   - Per-endpoint daily quota tracking
 *   - Quota-uplift request template generator
 *
 * Security:
 *   - API key loaded from environment only (never client-side)
 *   - All requests logged with correlation IDs
 *   - Responses cached with TTL to reduce quota burn
 *
 * Compliance: FATF Recommendation 16, EU 6AMLD, FinCEN SAR requirements
 */

import crypto from 'crypto';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlockintConfig {
  apiKey: string;                     // from env: TRM_API_KEY
  baseUrl: string;                    // from env: TRM_BASE_URL (default: https://api.trmlabs.com/public/v2)
  maxRetries: number;                 // default 5
  initialBackoffMs: number;           // default 1000
  maxBackoffMs: number;               // default 60000
  concurrencyLimit: number;           // max parallel requests, default 3
  cacheTtlMs: number;                 // response cache TTL, default 5 minutes
  dailyQuotaLimit: number;            // daily request cap per endpoint, default 10000
  environment: 'test' | 'production';
}

export interface WalletScreeningRequest {
  address: string;
  chain: BlockchainNetwork;
  asset?: string;
  screening_type?: 'full' | 'sanctions' | 'risk_score';
}

export interface WalletScreeningResult {
  address: string;
  chain: string;
  risk_score: number;           // 0–100
  risk_level: RiskLevel;
  sanctions_hit: boolean;
  sanctions_details: SanctionsDetail[];
  entity_attribution: EntityAttribution | null;
  exposure: ExposureBreakdown;
  ownership_data: OwnershipData;
  screened_at: string;
  trm_trace_id: string;
}

export interface TransactionTraceRequest {
  tx_hash: string;
  chain: BlockchainNetwork;
  direction: 'forward' | 'backward' | 'both';
  max_hops: number;             // 1–10, default 5
  min_value_usd?: number;
  include_exchanges?: boolean;
  include_mixers?: boolean;
}

export interface TransactionTraceResult {
  tx_hash: string;
  chain: string;
  direction: string;
  hops: TraceHop[];
  entities_touched: string[];
  mixers_detected: boolean;
  exchanges_identified: string[];
  risk_flags: RiskFlag[];
  total_value_usd: number;
  trace_complete: boolean;
  trm_trace_id: string;
}

export interface AssetFlowRequest {
  address: string;
  chain: BlockchainNetwork;
  date_from?: string;           // ISO 8601
  date_to?: string;
  min_value_usd?: number;
}

export interface AssetFlowResult {
  address: string;
  chain: string;
  inflows: FlowEntry[];
  outflows: FlowEntry[];
  net_flow_usd: number;
  counterparty_summary: CounterpartySummary[];
  suspicious_patterns: SuspiciousPattern[];
  timeline: ChronologyEntry[];
}

export interface EntityLinkageRequest {
  addresses: string[];
  chain: BlockchainNetwork;
  linkage_types?: LinkageType[];
}

export interface EntityLinkageResult {
  cluster_id: string;
  addresses: string[];
  attributed_entity: EntityAttribution | null;
  linkage_evidence: LinkageEvidence[];
  confidence_score: number;
  risk_level: RiskLevel;
}

// Supporting types
export type BlockchainNetwork =
  | 'bitcoin' | 'ethereum' | 'tron' | 'bsc' | 'polygon'
  | 'solana' | 'avalanche' | 'arbitrum' | 'optimism' | 'litecoin'
  | 'bitcoin_cash' | 'ripple' | 'stellar' | 'monero' | 'zcash';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE' | 'CRITICAL';
export type LinkageType = 'common_ownership' | 'co-spend' | 'peel_chain' | 'exchange_cluster';

export interface SanctionsDetail {
  list_name: string;           // e.g. OFAC SDN, EU Consolidated, UK HMT
  entity_name: string;
  designation_date: string;
  confidence: number;
}

export interface EntityAttribution {
  entity_id: string;
  name: string;
  type: 'exchange' | 'mixer' | 'darknet' | 'sanctions' | 'service' | 'unknown';
  country?: string;
  risk_score: number;
  verified: boolean;
}

export interface ExposureBreakdown {
  direct_exposure_usd: number;
  indirect_exposure_usd: number;
  exposure_by_category: Record<string, number>;
  highest_risk_counterparty: string | null;
}

export interface OwnershipData {
  known_owner: boolean;
  owner_name: string | null;
  owner_type: string | null;
  kyc_status: string | null;
}

export interface TraceHop {
  hop_number: number;
  tx_hash: string;
  from_address: string;
  to_address: string;
  value_usd: number;
  entity: EntityAttribution | null;
  risk_score: number;
  timestamp: string;
  block_height: number;
}

export interface RiskFlag {
  flag_type: string;
  severity: RiskLevel;
  description: string;
  evidence_tx: string[];
}

export interface FlowEntry {
  tx_hash: string;
  counterparty: string;
  value_usd: number;
  timestamp: string;
  entity: EntityAttribution | null;
  risk_score: number;
}

export interface CounterpartySummary {
  address: string;
  entity_name: string | null;
  total_value_usd: number;
  tx_count: number;
  risk_level: RiskLevel;
}

export interface SuspiciousPattern {
  pattern_type: 'layering' | 'structuring' | 'rapid_movement' | 'mixer_usage' | 'peel_chain' | 'fan_out';
  description: string;
  confidence: number;
  supporting_txs: string[];
}

export interface ChronologyEntry {
  timestamp: string;
  event_type: string;
  description: string;
  tx_hash?: string;
  value_usd?: number;
  entity?: string;
  risk_flag?: string;
}

export interface LinkageEvidence {
  linkage_type: LinkageType;
  tx_hash: string;
  confidence: number;
  description: string;
}

// ─── Queue internals ─────────────────────────────────────────────────────────

interface QueuedRequest<T> {
  id: string;
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

interface QuotaTracker {
  endpoint: string;
  date: string;          // YYYY-MM-DD
  count: number;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// ─── Service class ────────────────────────────────────────────────────────────

export class TRMBlockintService {
  private readonly config: BlockintConfig;
  private queue: QueuedRequest<unknown>[] = [];
  private activeRequests = 0;
  private quotaStore: Map<string, QuotaTracker> = new Map();
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private correlationLog: Array<{
    id: string;
    endpoint: string;
    timestamp: string;
    duration_ms: number;
    status: number;
    cached: boolean;
    retry_count: number;
  }> = [];

  constructor(config?: Partial<BlockintConfig>) {
    this.config = {
      apiKey: process.env.TRM_API_KEY || '',
      baseUrl: process.env.TRM_BASE_URL || 'https://api.trmlabs.com/public/v2',
      maxRetries: parseInt(process.env.TRM_MAX_RETRIES || '5'),
      initialBackoffMs: parseInt(process.env.TRM_INITIAL_BACKOFF_MS || '1000'),
      maxBackoffMs: parseInt(process.env.TRM_MAX_BACKOFF_MS || '60000'),
      concurrencyLimit: parseInt(process.env.TRM_CONCURRENCY_LIMIT || '3'),
      cacheTtlMs: parseInt(process.env.TRM_CACHE_TTL_MS || String(5 * 60 * 1000)),
      dailyQuotaLimit: parseInt(process.env.TRM_DAILY_QUOTA_LIMIT || '10000'),
      environment: (process.env.TRM_ENVIRONMENT as 'test' | 'production') || 'production',
      ...config,
    };

    if (!this.config.apiKey) {
      console.warn('[TRM-BLOCKINT] WARNING: TRM_API_KEY not set. All calls will fail.');
    }
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Screen a wallet address for sanctions, risk score, and entity attribution.
   */
  async screenWallet(req: WalletScreeningRequest): Promise<WalletScreeningResult> {
    const cacheKey = `screen:${req.chain}:${req.address}`;
    const cached = this.getCache<WalletScreeningResult>(cacheKey);
    if (cached) return cached;

    const result = await this.enqueue(() =>
      this.requestWithRetry<WalletScreeningResult>(
        'POST',
        '/screening/addresses',
        {
          blockchain: req.chain,
          asset: req.asset || 'ALL_ASSETS',
          addresses: [{ address: req.address }],
        },
        'screenWallet'
      )
    );

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Trace a transaction forward, backward, or both — up to N hops.
   */
  async traceTransaction(req: TransactionTraceRequest): Promise<TransactionTraceResult> {
    const cacheKey = `trace:${req.chain}:${req.tx_hash}:${req.direction}:${req.max_hops}`;
    const cached = this.getCache<TransactionTraceResult>(cacheKey);
    if (cached) return cached;

    const result = await this.enqueue(() =>
      this.requestWithRetry<TransactionTraceResult>(
        'POST',
        '/blockchain/transactions/trace',
        {
          chain: req.chain,
          transaction_hash: req.tx_hash,
          direction: req.direction,
          max_hops: Math.min(req.max_hops, 10),
          filters: {
            min_value_usd: req.min_value_usd || 0,
            include_exchanges: req.include_exchanges ?? true,
            include_mixers: req.include_mixers ?? true,
          },
        },
        'traceTransaction'
      )
    );

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Analyse full asset flow for an address over a time window.
   */
  async analyzeAssetFlow(req: AssetFlowRequest): Promise<AssetFlowResult> {
    const cacheKey = `flow:${req.chain}:${req.address}:${req.date_from}:${req.date_to}`;
    const cached = this.getCache<AssetFlowResult>(cacheKey);
    if (cached) return cached;

    const result = await this.enqueue(() =>
      this.requestWithRetry<AssetFlowResult>(
        'POST',
        '/blockchain/addresses/flow',
        {
          chain: req.chain,
          address: req.address,
          date_range: {
            from: req.date_from,
            to: req.date_to,
          },
          min_value_usd: req.min_value_usd || 0,
        },
        'analyzeAssetFlow'
      )
    );

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Link multiple addresses to a common entity or cluster.
   */
  async linkEntities(req: EntityLinkageRequest): Promise<EntityLinkageResult> {
    const cacheKey = `link:${req.chain}:${req.addresses.sort().join(',')}`;
    const cached = this.getCache<EntityLinkageResult>(cacheKey);
    if (cached) return cached;

    const result = await this.enqueue(() =>
      this.requestWithRetry<EntityLinkageResult>(
        'POST',
        '/blockchain/addresses/cluster',
        {
          chain: req.chain,
          addresses: req.addresses,
          linkage_types: req.linkage_types || ['common_ownership', 'co-spend', 'peel_chain'],
        },
        'linkEntities'
      )
    );

    this.setCache(cacheKey, result);
    return result;
  }

  /**
   * Screen multiple wallets in batch (respects concurrency limit).
   */
  async batchScreenWallets(
    requests: WalletScreeningRequest[]
  ): Promise<WalletScreeningResult[]> {
    const chunks = this.chunkArray(requests, this.config.concurrencyLimit);
    const results: WalletScreeningResult[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(r => this.screenWallet(r)));
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * Get correlation/request logs for audit trail.
   */
  getRequestLog() {
    return [...this.correlationLog];
  }

  /**
   * Get current daily quota usage per endpoint.
   */
  getQuotaStatus(): Record<string, { used: number; limit: number; remaining: number; date: string }> {
    const today = this.todayDate();
    const result: Record<string, { used: number; limit: number; remaining: number; date: string }> = {};

    for (const [key, tracker] of this.quotaStore.entries()) {
      if (tracker.date === today) {
        result[tracker.endpoint] = {
          used: tracker.count,
          limit: this.config.dailyQuotaLimit,
          remaining: Math.max(0, this.config.dailyQuotaLimit - tracker.count),
          date: today,
        };
      }
    }

    return result;
  }

  /**
   * Generate a quota-uplift request document for submission to TRM Labs.
   */
  generateQuotaUpliftRequest(params: {
    current_daily_limit: number;
    requested_daily_limit: number;
    peak_throughput_rps: number;
    use_case_description: string;
    estimated_monthly_calls: number;
    primary_endpoints: string[];
    organisation_name: string;
    contact_email: string;
  }): string {
    const today = new Date().toISOString().split('T')[0];
    return `
TRM LABS — API QUOTA UPLIFT REQUEST
=====================================
Date: ${today}
Organisation: ${params.organisation_name}
Contact: ${params.contact_email}
Environment: ${this.config.environment.toUpperCase()}

CURRENT LIMITS
--------------
Daily Request Limit:        ${params.current_daily_limit.toLocaleString()}
Concurrency Limit:          ${this.config.concurrencyLimit}

REQUESTED LIMITS
----------------
Daily Request Limit:        ${params.requested_daily_limit.toLocaleString()}
Peak Throughput:            ${params.peak_throughput_rps} req/sec
Estimated Monthly Calls:    ${params.estimated_monthly_calls.toLocaleString()}

USE CASE
--------
${params.use_case_description}

PRIMARY ENDPOINTS
-----------------
${params.primary_endpoints.map(e => `  • ${e}`).join('\n')}

VOLUME BREAKDOWN (estimated)
-----------------------------
Monthly wallet screenings:    ${Math.round(params.estimated_monthly_calls * 0.4).toLocaleString()}
Monthly transaction traces:   ${Math.round(params.estimated_monthly_calls * 0.3).toLocaleString()}
Monthly flow analyses:        ${Math.round(params.estimated_monthly_calls * 0.2).toLocaleString()}
Monthly entity linkages:      ${Math.round(params.estimated_monthly_calls * 0.1).toLocaleString()}

TEST / PRODUCTION SEPARATION
-----------------------------
Test environment:   Separate TRM_TEST_API_KEY; capped at 1,000 calls/day
Production:         TRM_API_KEY; requested limit above

NOTES
-----
- All production calls originate from server-side only (no client-side key exposure)
- Rate-limit handling: exponential backoff with full-jitter, max ${this.config.maxRetries} retries
- Caching: ${this.config.cacheTtlMs / 1000}s TTL to reduce redundant calls
- Monitoring: per-endpoint quota tracking with alert at 80% of daily limit
`.trim();
  }

  // ─── Core HTTP with retry + rate-limit ──────────────────────────────────────

  private async requestWithRetry<T>(
    method: 'GET' | 'POST',
    path: string,
    body: Record<string, unknown>,
    endpointLabel: string,
    attempt = 0
  ): Promise<T> {
    this.checkQuota(endpointLabel);

    const correlationId = crypto.randomUUID();
    const startTime = Date.now();
    const url = `${this.config.baseUrl}${path}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': this.config.apiKey,
          'x-correlation-id': correlationId,
          'x-environment': this.config.environment,
        },
        body: method === 'POST' ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      const duration = Date.now() - startTime;
      this.incrementQuota(endpointLabel);

      // ── 429 Rate Limited ────────────────────────────────────────────────────
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfterMs = retryAfterHeader
          ? parseInt(retryAfterHeader) * 1000
          : this.calculateBackoff(attempt);

        this.logRequest(correlationId, endpointLabel, duration, 429, false, attempt);
        console.warn(`[TRM-BLOCKINT] 429 Rate Limited. Retrying after ${retryAfterMs}ms (attempt ${attempt + 1}/${this.config.maxRetries})`);

        if (attempt >= this.config.maxRetries) {
          throw new TRMRateLimitError('Max retries exceeded after rate limiting', {
            endpoint: endpointLabel,
            retries: attempt,
            last_retry_after_ms: retryAfterMs,
          });
        }

        await this.sleep(retryAfterMs);
        return this.requestWithRetry<T>(method, path, body, endpointLabel, attempt + 1);
      }

      // ── Server errors (5xx) — retry with backoff ─────────────────────────────
      if (response.status >= 500 && response.status < 600) {
        const backoffMs = this.calculateBackoff(attempt);
        this.logRequest(correlationId, endpointLabel, duration, response.status, false, attempt);
        console.warn(`[TRM-BLOCKINT] ${response.status} Server Error. Retrying after ${backoffMs}ms (attempt ${attempt + 1}/${this.config.maxRetries})`);

        if (attempt >= this.config.maxRetries) {
          throw new TRMAPIError(`TRM API server error: ${response.status}`, response.status);
        }

        await this.sleep(backoffMs);
        return this.requestWithRetry<T>(method, path, body, endpointLabel, attempt + 1);
      }

      // ── Auth errors — do NOT retry ──────────────────────────────────────────
      if (response.status === 401 || response.status === 403) {
        this.logRequest(correlationId, endpointLabel, duration, response.status, false, attempt);
        throw new TRMAuthError(`TRM API authentication failed: ${response.status}. Check TRM_API_KEY environment variable.`);
      }

      // ── Client errors (4xx except 429) — do NOT retry ────────────────────────
      if (!response.ok) {
        const errorBody = await response.text();
        this.logRequest(correlationId, endpointLabel, duration, response.status, false, attempt);
        throw new TRMAPIError(`TRM API error ${response.status}: ${errorBody}`, response.status);
      }

      // ── Success ─────────────────────────────────────────────────────────────
      const data = await response.json() as T;
      this.logRequest(correlationId, endpointLabel, duration, response.status, false, attempt);
      return data;

    } catch (error) {
      // Re-throw known errors
      if (error instanceof TRMBlockintError) throw error;

      // Network errors — retry with backoff
      const backoffMs = this.calculateBackoff(attempt);
      const duration = Date.now() - startTime;
      this.logRequest(correlationId, endpointLabel, duration, 0, false, attempt);
      console.warn(`[TRM-BLOCKINT] Network error (attempt ${attempt + 1}/${this.config.maxRetries}):`, error);

      if (attempt >= this.config.maxRetries) {
        throw new TRMNetworkError(`TRM API network error after ${attempt} retries: ${(error as Error).message}`);
      }

      await this.sleep(backoffMs);
      return this.requestWithRetry<T>(method, path, body, endpointLabel, attempt + 1);
    }
  }

  // ─── Queue with concurrency control ─────────────────────────────────────────

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const item: QueuedRequest<T> = {
        id: crypto.randomUUID(),
        fn,
        resolve,
        reject,
      };
      this.queue.push(item as QueuedRequest<unknown>);
      this.drainQueue();
    });
  }

  private drainQueue(): void {
    while (this.activeRequests < this.config.concurrencyLimit && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.activeRequests++;

      item.fn()
        .then(result => {
          item.resolve(result);
        })
        .catch(err => {
          item.reject(err);
        })
        .finally(() => {
          this.activeRequests--;
          this.drainQueue();
        });
    }
  }

  // ─── Backoff calculation (exponential + full jitter) ─────────────────────────

  private calculateBackoff(attempt: number): number {
    const expo = Math.min(
      this.config.initialBackoffMs * Math.pow(2, attempt),
      this.config.maxBackoffMs
    );
    // Full jitter: random value between 0 and expo
    return Math.floor(Math.random() * expo);
  }

  // ─── Quota tracking ──────────────────────────────────────────────────────────

  private checkQuota(endpoint: string): void {
    const today = this.todayDate();
    const key = `${endpoint}:${today}`;
    const tracker = this.quotaStore.get(key);

    if (tracker && tracker.count >= this.config.dailyQuotaLimit) {
      throw new TRMQuotaExceededError(
        `Daily quota exceeded for endpoint: ${endpoint}. Used: ${tracker.count}/${this.config.dailyQuotaLimit}`
      );
    }

    // Warn at 80% usage
    if (tracker && tracker.count >= this.config.dailyQuotaLimit * 0.8) {
      console.warn(
        `[TRM-BLOCKINT] QUOTA WARNING: ${endpoint} at ${tracker.count}/${this.config.dailyQuotaLimit} (${Math.round(tracker.count / this.config.dailyQuotaLimit * 100)}%)`
      );
    }
  }

  private incrementQuota(endpoint: string): void {
    const today = this.todayDate();
    const key = `${endpoint}:${today}`;
    const existing = this.quotaStore.get(key);

    if (existing && existing.date === today) {
      existing.count++;
    } else {
      this.quotaStore.set(key, { endpoint, date: today, count: 1 });
    }
  }

  // ─── Cache ────────────────────────────────────────────────────────────────────

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.config.cacheTtlMs,
    });
  }

  // ─── Request logging ──────────────────────────────────────────────────────────

  private logRequest(
    id: string,
    endpoint: string,
    duration: number,
    status: number,
    cached: boolean,
    retryCount: number
  ): void {
    this.correlationLog.push({
      id,
      endpoint,
      timestamp: new Date().toISOString(),
      duration_ms: duration,
      status,
      cached,
      retry_count: retryCount,
    });

    // Keep last 1000 entries
    if (this.correlationLog.length > 1000) {
      this.correlationLog.shift();
    }
  }

  // ─── Utilities ────────────────────────────────────────────────────────────────

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}

// ─── Custom error classes ────────────────────────────────────────────────────

export class TRMBlockintError extends Error {
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'TRMBlockintError';
  }
}

export class TRMRateLimitError extends TRMBlockintError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, context);
    this.name = 'TRMRateLimitError';
  }
}

export class TRMAuthError extends TRMBlockintError {
  constructor(message: string) {
    super(message);
    this.name = 'TRMAuthError';
  }
}

export class TRMAPIError extends TRMBlockintError {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = 'TRMAPIError';
  }
}

export class TRMNetworkError extends TRMBlockintError {
  constructor(message: string) {
    super(message);
    this.name = 'TRMNetworkError';
  }
}

export class TRMQuotaExceededError extends TRMBlockintError {
  constructor(message: string) {
    super(message);
    this.name = 'TRMQuotaExceededError';
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

export const trmBlockint = new TRMBlockintService();
export default TRMBlockintService;
