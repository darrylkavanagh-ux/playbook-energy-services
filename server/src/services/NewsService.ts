/**
 * NEWS SERVICE
 * =============================================================================
 * Step 4: Wires live news feeds into the trading signal pipeline.
 *
 * Sources (free tiers, no credit card required):
 *   1. NewsAPI      — https://newsapi.org          (100 req/day free)
 *                      Set NEWS_API_KEY in .env
 *   2. Finnhub      — https://finnhub.io           (real-time, free tier)
 *                      Set FINNHUB_API_KEY in .env
 *   3. CryptoPanic  — https://cryptopanic.com      (crypto + macro, free)
 *                      No key required for basic endpoint
 *   4. Fallback     — curated static headlines (system runs without keys)
 *
 * Outputs a NewsAnalysisResult with:
 *   - Sentiment score   (-1 to +1, negative = bearish)
 *   - Confidence boost  (0–0.15, added to signal confidence)
 *   - Top 5 headlines   with individual sentiment labels
 *   - Key themes        e.g. "Fed dovish", "ECB hawkish"
 *   - Asset impact map  e.g. { 'EUR/USD': 'BULLISH', 'BTC/USD': 'NEUTRAL' }
 */

import https from 'https';
import http from 'http';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type NewsSentiment = 'STRONGLY_BULLISH' | 'MILDLY_BULLISH' | 'NEUTRAL'
                          | 'MILDLY_BEARISH'  | 'STRONGLY_BEARISH';

export interface NewsHeadline {
  title:       string;
  source:      string;
  url:         string;
  published_at: string;
  sentiment:   NewsSentiment;
  sentiment_score: number;   // -1 to +1
  relevance:   number;       // 0–1
  symbols?:    string[];     // e.g. ['EUR/USD', 'USD']
}

export interface NewsAnalysisResult {
  query:               string;           // symbol or topic searched
  overall_sentiment:   NewsSentiment;
  sentiment_score:     number;           // -1 to +1, aggregate
  confidence_boost:    number;           // added to signal confidence (0–0.15)
  headlines:           NewsHeadline[];   // top relevant headlines
  key_themes:          string[];
  asset_impact:        Record<string, 'BULLISH' | 'BEARISH' | 'NEUTRAL'>;
  sources_analysed:    number;
  source_breakdown:    Record<string, number>; // source → count
  fetched_at:          string;
  is_live:             boolean;          // false = fallback static data
  cache_ttl_seconds:   number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SENTIMENT KEYWORDS
// ─────────────────────────────────────────────────────────────────────────────

const BULLISH_KEYWORDS = [
  'surge', 'rally', 'breakout', 'bullish', 'soar', 'jump', 'rise', 'gain',
  'positive', 'optimism', 'recovery', 'growth', 'boom', 'outperform',
  'hawkish ecb', 'dovish fed', 'rate cut', 'stimulus', 'easing',
  'beat expectations', 'strong', 'robust', 'upgrade',
];

const BEARISH_KEYWORDS = [
  'crash', 'plunge', 'drop', 'fall', 'decline', 'bearish', 'slump', 'tumble',
  'recession', 'contraction', 'weak', 'disappoint', 'miss', 'downgrade',
  'hawkish fed', 'dovish ecb', 'rate hike', 'tightening', 'inflation spike',
  'crisis', 'default', 'risk-off', 'selloff', 'correction',
];

function scoreHeadline(title: string): number {
  const lower = title.toLowerCase();
  let score = 0;
  for (const kw of BULLISH_KEYWORDS) if (lower.includes(kw)) score += 0.15;
  for (const kw of BEARISH_KEYWORDS) if (lower.includes(kw)) score -= 0.15;
  return Math.max(-1, Math.min(1, score));
}

function sentimentLabel(score: number): NewsSentiment {
  if (score >=  0.5) return 'STRONGLY_BULLISH';
  if (score >=  0.1) return 'MILDLY_BULLISH';
  if (score <= -0.5) return 'STRONGLY_BEARISH';
  if (score <= -0.1) return 'MILDLY_BEARISH';
  return 'NEUTRAL';
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP HELPER
// ─────────────────────────────────────────────────────────────────────────────

function fetchJSON(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'OrbAI-NewsService/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e}`)); }
      });
    }).on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CACHE
// ─────────────────────────────────────────────────────────────────────────────

interface CacheEntry { data: NewsAnalysisResult; expiresAt: number }
const newsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─────────────────────────────────────────────────────────────────────────────
// STATIC FALLBACK (used when no API keys configured or rate-limited)
// ─────────────────────────────────────────────────────────────────────────────

function buildFallback(query: string): NewsAnalysisResult {
  const isForex  = /EUR|GBP|USD|JPY|CHF|AUD|NZD|forex|fx/i.test(query);
  const isCrypto = /BTC|ETH|SOL|BNB|crypto|bitcoin|ethereum/i.test(query);
  const isStock  = /AAPL|MSFT|GOOG|NVDA|TSLA|stock|equity/i.test(query);

  const headlines: NewsHeadline[] = isForex ? [
    { title: 'ECB signals data-dependent approach as Eurozone inflation stabilises', source: 'Reuters (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'NEUTRAL', sentiment_score: 0.05, relevance: 0.9, symbols: ['EUR/USD'] },
    { title: 'Federal Reserve minutes show growing confidence in disinflation path', source: 'Bloomberg (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BULLISH', sentiment_score: 0.3, relevance: 0.85, symbols: ['EUR/USD', 'DXY'] },
    { title: 'EUR/USD consolidates near key resistance after strong NFP print', source: 'FX Street (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'NEUTRAL', sentiment_score: -0.1, relevance: 0.95, symbols: ['EUR/USD'] },
  ] : isCrypto ? [
    { title: 'Bitcoin ETF inflows continue as institutional adoption accelerates', source: 'CoinDesk (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BULLISH', sentiment_score: 0.35, relevance: 0.9, symbols: ['BTC/USD'] },
    { title: 'Ethereum network activity hits multi-month high on DeFi resurgence', source: 'Decrypt (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BULLISH', sentiment_score: 0.3, relevance: 0.8, symbols: ['ETH/USD'] },
    { title: 'Crypto market cautious ahead of Fed rate decision this week', source: 'CryptoSlate (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'NEUTRAL', sentiment_score: -0.05, relevance: 0.75, symbols: ['BTC/USD', 'ETH/USD'] },
  ] : [
    { title: 'S&P 500 holds near all-time highs as earnings season approaches', source: 'CNBC (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BULLISH', sentiment_score: 0.25, relevance: 0.85, symbols: ['SPY', 'QQQ'] },
    { title: 'Tech sector outperforms on strong cloud revenue beats', source: 'WSJ (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BULLISH', sentiment_score: 0.4, relevance: 0.8, symbols: ['AAPL', 'MSFT', 'GOOG'] },
    { title: 'Rate uncertainty weighs on small-cap valuations heading into quarter end', source: 'MarketWatch (cached)', url: '', published_at: new Date().toISOString(), sentiment: 'MILDLY_BEARISH', sentiment_score: -0.2, relevance: 0.7, symbols: ['IWM'] },
  ];

  const avgScore = headlines.reduce((s, h) => s + h.sentiment_score, 0) / headlines.length;

  return {
    query,
    overall_sentiment:  sentimentLabel(avgScore),
    sentiment_score:    +avgScore.toFixed(3),
    confidence_boost:   Math.max(0, Math.min(0.12, Math.abs(avgScore) * 0.15)),
    headlines,
    key_themes:         isForex
      ? ['ECB data-dependent stance', 'Fed disinflation narrative', 'USD consolidation']
      : isCrypto
      ? ['Institutional BTC adoption', 'DeFi activity uptick', 'Pre-Fed caution']
      : ['Earnings season proximity', 'Tech strength', 'Rate uncertainty'],
    asset_impact:       {},
    sources_analysed:   3,
    source_breakdown:   { 'cached_fallback': 3 },
    fetched_at:         new Date().toISOString(),
    is_live:            false,
    cache_ttl_seconds:  300,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class NewsService {
  private newsApiKey:    string | undefined;
  private finnhubKey:    string | undefined;

  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.finnhubKey = process.env.FINNHUB_API_KEY;

    if (this.newsApiKey)  console.log('[NewsService] NewsAPI key configured');
    if (this.finnhubKey)  console.log('[NewsService] Finnhub key configured');
    if (!this.newsApiKey && !this.finnhubKey) {
      console.warn('[NewsService] No API keys — using static fallback. Set NEWS_API_KEY and FINNHUB_API_KEY in .env');
    }
  }

  // ── Main entry point ───────────────────────────────────────────────────────
  async analyse(query: string): Promise<NewsAnalysisResult> {
    const cacheKey = `news:${query.toLowerCase()}`;
    const cached   = newsCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) return cached.data;

    let result: NewsAnalysisResult;

    // Try Finnhub first (better for individual symbols)
    if (this.finnhubKey) {
      try {
        result = await this.fetchFinnhub(query);
        newsCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      } catch (e) {
        console.warn(`[NewsService] Finnhub failed for "${query}":`, e);
      }
    }

    // Try NewsAPI
    if (this.newsApiKey) {
      try {
        result = await this.fetchNewsAPI(query);
        newsCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      } catch (e) {
        console.warn(`[NewsService] NewsAPI failed for "${query}":`, e);
      }
    }

    // Try CryptoPanic (no key needed, good for crypto)
    if (/BTC|ETH|SOL|BNB|ADA|DOT|XRP|crypto/i.test(query)) {
      try {
        result = await this.fetchCryptoPanic(query);
        newsCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
        return result;
      } catch (e) {
        console.warn(`[NewsService] CryptoPanic failed for "${query}":`, e);
      }
    }

    // Static fallback
    result = buildFallback(query);
    newsCache.set(cacheKey, { data: result, expiresAt: Date.now() + 60_000 }); // 1 min for fallback
    return result;
  }

  // ── Finnhub company/symbol news ──────────────────────────────────────────
  private async fetchFinnhub(query: string): Promise<NewsAnalysisResult> {
    const symbol = query.replace('/', '').toUpperCase();
    const from   = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const to     = new Date().toISOString().slice(0, 10);

    // Finnhub supports company news by symbol and general market news
    const isGeneral = /EUR|GBP|JPY|CHF|AUD|forex|fx/i.test(query);
    const url = isGeneral
      ? `https://finnhub.io/api/v1/news?category=general&token=${this.finnhubKey}`
      : `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${this.finnhubKey}`;

    const data = await fetchJSON(url) as { headline?: string; source?: string; url?: string; datetime?: number; summary?: string }[];
    if (!Array.isArray(data)) throw new Error('Unexpected Finnhub response shape');

    const headlines: NewsHeadline[] = data.slice(0, 10).map(item => {
      const title = item.headline || '';
      const score = scoreHeadline(title);
      return {
        title,
        source:       item.source   || 'Finnhub',
        url:          item.url      || '',
        published_at: item.datetime ? new Date(item.datetime * 1000).toISOString() : new Date().toISOString(),
        sentiment:    sentimentLabel(score),
        sentiment_score: score,
        relevance:    0.8,
        symbols:      [symbol],
      };
    });

    return this.buildResult(query, headlines, 'finnhub', data.length);
  }

  // ── NewsAPI everything endpoint ───────────────────────────────────────────
  private async fetchNewsAPI(query: string): Promise<NewsAnalysisResult> {
    const q      = encodeURIComponent(query.replace('/', ' '));
    const from   = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const url    = `https://newsapi.org/v2/everything?q=${q}&from=${from}&sortBy=relevancy&pageSize=10&apiKey=${this.newsApiKey}&language=en`;

    const data = await fetchJSON(url) as { status?: string; articles?: { title: string; source: { name: string }; url: string; publishedAt: string }[]; totalResults?: number };
    if (data.status !== 'ok' || !data.articles) throw new Error('NewsAPI error or no articles');

    const headlines: NewsHeadline[] = data.articles.map(a => {
      const score = scoreHeadline(a.title);
      return {
        title:       a.title,
        source:      a.source?.name || 'NewsAPI',
        url:         a.url          || '',
        published_at: a.publishedAt || new Date().toISOString(),
        sentiment:   sentimentLabel(score),
        sentiment_score: score,
        relevance:   0.75,
      };
    });

    return this.buildResult(query, headlines, 'newsapi', data.totalResults || headlines.length);
  }

  // ── CryptoPanic (no key needed) ───────────────────────────────────────────
  private async fetchCryptoPanic(query: string): Promise<NewsAnalysisResult> {
    const currencies = query.replace('/', '').replace('USD', '').toUpperCase();
    const url = `https://cryptopanic.com/api/free/v1/posts/?auth_token=anonymous&currencies=${currencies}&public=true`;

    const data = await fetchJSON(url) as { results?: { title: string; source: { title: string }; url: string; published_at: string; votes?: { positive: number; negative: number } }[] };
    if (!data.results) throw new Error('CryptoPanic no results');

    const headlines: NewsHeadline[] = data.results.slice(0, 8).map(item => {
      const score = scoreHeadline(item.title);
      return {
        title:       item.title,
        source:      item.source?.title || 'CryptoPanic',
        url:         item.url            || '',
        published_at: item.published_at  || new Date().toISOString(),
        sentiment:   sentimentLabel(score),
        sentiment_score: score,
        relevance:   0.85,
        symbols:     [currencies],
      };
    });

    return this.buildResult(query, headlines, 'cryptopanic', data.results.length);
  }

  // ── Build normalised result ───────────────────────────────────────────────
  private buildResult(
    query:        string,
    headlines:    NewsHeadline[],
    sourceName:   string,
    totalSources: number,
  ): NewsAnalysisResult {
    const avgScore = headlines.length > 0
      ? headlines.reduce((s, h) => s + h.sentiment_score * h.relevance, 0)
        / headlines.reduce((s, h) => s + h.relevance, 0)
      : 0;

    // Confidence boost: 0 when neutral, up to +0.12 when strongly directional
    const confidenceBoost = Math.min(0.12, Math.abs(avgScore) * 0.15);

    // Extract themes from top headlines
    const themes = this.extractThemes(headlines);

    // Build impact map per symbol
    const assetImpact: Record<string, 'BULLISH' | 'BEARISH' | 'NEUTRAL'> = {};
    for (const h of headlines) {
      for (const sym of (h.symbols || [])) {
        const existing = assetImpact[sym];
        const impact: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = h.sentiment_score > 0.1 ? 'BULLISH'
          : h.sentiment_score < -0.1 ? 'BEARISH' : 'NEUTRAL';
        // Simple majority vote
        if (!existing) assetImpact[sym] = impact;
        else if (existing !== impact) assetImpact[sym] = 'NEUTRAL';
      }
    }

    return {
      query,
      overall_sentiment:  sentimentLabel(avgScore),
      sentiment_score:    +avgScore.toFixed(3),
      confidence_boost:   +confidenceBoost.toFixed(4),
      headlines:          headlines.slice(0, 5),
      key_themes:         themes,
      asset_impact:       assetImpact,
      sources_analysed:   totalSources,
      source_breakdown:   { [sourceName]: totalSources },
      fetched_at:         new Date().toISOString(),
      is_live:            true,
      cache_ttl_seconds:  300,
    };
  }

  // ── Simple keyword theme extractor ───────────────────────────────────────
  private extractThemes(headlines: NewsHeadline[]): string[] {
    const text = headlines.map(h => h.title.toLowerCase()).join(' ');
    const themeMap: Record<string, string> = {
      'federal reserve|fed rate|fomc|powell': 'Fed monetary policy signal',
      'ecb|european central bank|lagarde': 'ECB policy stance',
      'inflation|cpi|pce': 'Inflation data impact',
      'employment|jobs|nonfarm|payroll': 'Labour market data',
      'gdp|growth|recession': 'Economic growth outlook',
      'bitcoin|btc|crypto': 'Crypto market sentiment',
      'earnings|revenue|profit': 'Corporate earnings season',
      'oil|energy|opec': 'Energy market moves',
      'china|geopolit|trade war': 'Geopolitical risk',
    };

    const themes: string[] = [];
    for (const [pattern, label] of Object.entries(themeMap)) {
      if (new RegExp(pattern).test(text)) themes.push(label);
    }
    return themes.slice(0, 4);
  }

  // ── Bulk analysis for watchlist ───────────────────────────────────────────
  async analyseWatchlist(symbols: string[]): Promise<Record<string, NewsAnalysisResult>> {
    const results: Record<string, NewsAnalysisResult> = {};
    // Stagger requests to avoid rate limits
    for (const sym of symbols) {
      results[sym] = await this.analyse(sym);
      await new Promise(r => setTimeout(r, 200));
    }
    return results;
  }

  // ── Cache status for diagnostics ─────────────────────────────────────────
  cacheStatus(): { entries: number; keys: string[] } {
    return { entries: newsCache.size, keys: Array.from(newsCache.keys()) };
  }
}

// Singleton
export const newsService = new NewsService();
export default newsService;
