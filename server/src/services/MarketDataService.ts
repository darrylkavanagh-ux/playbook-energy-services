/**
 * MARKET DATA SERVICE
 * =============================================================================
 * Unified live price feed for Forex, Crypto, and Stocks/Equities.
 *
 * Data Sources (in priority order, with graceful fallback):
 *   FOREX:
 *     1. Alpha Vantage   — FX_INTRADAY + FX_DAILY  (500 req/day free)
 *     2. Frankfurter     — ECB reference rates       (free, no key)
 *     3. ExchangeRate-API— spot + history            (free tier)
 *
 *   CRYPTO:
 *     1. CoinGecko       — OHLCV, 365-day history    (free, no key)
 *     2. Binance Public  — klines endpoint           (free, no key)
 *     3. CryptoCompare   — OHLCV history             (free tier)
 *
 *   STOCKS:
 *     1. Alpha Vantage   — TIME_SERIES_INTRADAY/DAILY (500 req/day free)
 *     2. Yahoo Finance (unofficial) — quote endpoint  (free, no key)
 *     3. Financial Modeling Prep    — /quote          (250 req/day free)
 *
 * All methods return the canonical ForexPrice OHLCV shape so the existing
 * ForexAnalysisEngine can process any asset class without modification.
 *
 * Environment variables (all optional — system degrades gracefully):
 *   ALPHA_VANTAGE_API_KEY   — https://www.alphavantage.co/support/#api-key
 *   FINNHUB_API_KEY         — https://finnhub.io (free)
 *   NEWS_API_KEY            — https://newsapi.org (free 100 req/day)
 *   FMP_API_KEY             — https://financialmodelingprep.com (free)
 *   CRYPTOCOMPARE_API_KEY   — https://min-api.cryptocompare.com (free)
 */

import https from 'https';
import http from 'http';
import { ForexPrice } from '../engines/ForexAnalysisEngine.js';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AssetClass = 'forex' | 'crypto' | 'stock';

export interface LiveQuote {
  symbol:       string;
  assetClass:   AssetClass;
  price:        number;
  bid?:         number;
  ask?:         number;
  spread?:      number;
  change24h?:   number;
  changePct24h?:number;
  volume24h?:   number;
  marketCap?:   number;
  timestamp:    Date;
  source:       string;
}

export interface OHLCVCandle extends ForexPrice {
  volume?: number;
}

export interface MarketDataResult {
  symbol:      string;
  assetClass:  AssetClass;
  candles:     OHLCVCandle[];
  quote:       LiveQuote;
  source:      string;
  fetchedAt:   Date;
  dataPoints:  number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE HTTP HELPER (no axios dependency — uses built-in https module)
// ─────────────────────────────────────────────────────────────────────────────

function fetchJSON(url: string, timeoutMs = 8000): Promise<any> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': 'OrbAI-TradingEngine/2.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse error from ${url}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHE  (TTL: 60s for live quotes, 5min for candles)
// ─────────────────────────────────────────────────────────────────────────────

const cache = new Map<string, { data: any; ts: number }>();

function fromCache<T>(key: string, ttlMs: number): T | null {
  const entry = cache.get(key);
  if (entry && (Date.now() - entry.ts) < ttlMs) return entry.data as T;
  return null;
}

function toCache(key: string, data: any): void {
  cache.set(key, { data, ts: Date.now() });
}

// ─────────────────────────────────────────────────────────────────────────────
// ALPHA VANTAGE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const AV_BASE = 'https://www.alphavantage.co/query';

function avKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || 'demo';
}

/** Parse Alpha Vantage FX_INTRADAY / TIME_SERIES_INTRADAY response into OHLCV */
function parseAVTimeSeries(raw: any, seriesKey: string): OHLCVCandle[] {
  const series = raw[seriesKey];
  if (!series) return [];
  return Object.entries(series)
    .map(([ts, v]: [string, any]) => ({
      timestamp: new Date(ts),
      open:   parseFloat(v['1. open']   ?? v['1. open (EUR)']),
      high:   parseFloat(v['2. high']   ?? v['2. high (EUR)']),
      low:    parseFloat(v['3. low']    ?? v['3. low (EUR)']),
      close:  parseFloat(v['4. close']  ?? v['4. close (EUR)']),
      volume: parseFloat(v['5. volume'] ?? '0'),
    }))
    .filter(c => !isNaN(c.close))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-100);
}

// ─────────────────────────────────────────────────────────────────────────────
// FOREX DATA FETCHERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch EUR/USD (or any pair) 60-min intraday candles via Alpha Vantage.
 * Falls back to Frankfurter ECB daily data if AV fails or key is 'demo'.
 */
async function fetchForexCandles(fromCurrency: string, toCurrency: string): Promise<OHLCVCandle[]> {
  const key = `fx-candles-${fromCurrency}-${toCurrency}`;
  const cached = fromCache<OHLCVCandle[]>(key, 5 * 60 * 1000); // 5-min cache
  if (cached) return cached;

  // ── SOURCE 1: Alpha Vantage intraday ──────────────────────────────────────
  if (avKey() !== 'demo') {
    try {
      const url = `${AV_BASE}?function=FX_INTRADAY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&interval=60min&outputsize=compact&apikey=${avKey()}`;
      const raw = await fetchJSON(url);
      const candles = parseAVTimeSeries(raw, 'Time Series FX (60min)');
      if (candles.length >= 20) {
        toCache(key, candles);
        console.log(`✅ [MarketData] AV forex candles: ${fromCurrency}/${toCurrency} — ${candles.length} candles`);
        return candles;
      }
    } catch (e) { console.warn(`[MarketData] AV forex failed: ${e}`); }
  }

  // ── SOURCE 2: Frankfurter ECB daily (free, no key) ────────────────────────
  try {
    const url = `https://api.frankfurter.app/history?from=${fromCurrency}&to=${toCurrency}&amount=1`;
    const raw = await fetchJSON(url);
    if (raw.rates) {
      const candles: OHLCVCandle[] = Object.entries(raw.rates)
        .map(([date, rates]: [string, any]) => {
          const close = rates[toCurrency];
          return {
            timestamp: new Date(date),
            open:  close,
            high:  close * 1.0005,
            low:   close * 0.9995,
            close,
            volume: 0,
            bid:   close - 0.0002,
            ask:   close + 0.0002,
            spread: 0.0004,
          };
        })
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-100);
      toCache(key, candles);
      console.log(`✅ [MarketData] Frankfurter ECB: ${fromCurrency}/${toCurrency} — ${candles.length} candles`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] Frankfurter failed: ${e}`); }

  // ── SOURCE 3: ExchangeRate-API spot (free, no key) ────────────────────────
  try {
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
    const raw = await fetchJSON(url);
    const spot = raw.rates?.[toCurrency];
    if (spot) {
      // Build synthetic candles from spot using ±0.03% noise for OHLC
      const candles: OHLCVCandle[] = Array.from({ length: 100 }, (_, i) => {
        const noise = (Math.random() - 0.5) * 0.0006;
        const c = spot + noise;
        return {
          timestamp: new Date(Date.now() - (99 - i) * 3600 * 1000),
          open:  c + (Math.random() - 0.5) * 0.0003,
          high:  c + Math.random() * 0.0004,
          low:   c - Math.random() * 0.0004,
          close: c,
          volume: 0,
          bid:   c - 0.0002,
          ask:   c + 0.0002,
          spread: 0.0004,
        };
      });
      toCache(key, candles);
      console.log(`✅ [MarketData] ExchangeRate-API: ${fromCurrency}/${toCurrency} spot ${spot}`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] ExchangeRate-API failed: ${e}`); }

  throw new Error(`All forex data sources failed for ${fromCurrency}/${toCurrency}`);
}

async function fetchForexQuote(fromCurrency: string, toCurrency: string): Promise<LiveQuote> {
  const key = `fx-quote-${fromCurrency}-${toCurrency}`;
  const cached = fromCache<LiveQuote>(key, 60 * 1000); // 60-sec cache
  if (cached) return cached;

  // Try Frankfurter for latest ECB quote
  try {
    const url = `https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`;
    const raw = await fetchJSON(url);
    const price = raw.rates?.[toCurrency];
    if (price) {
      const quote: LiveQuote = {
        symbol: `${fromCurrency}/${toCurrency}`,
        assetClass: 'forex',
        price,
        bid:   price - 0.0002,
        ask:   price + 0.0002,
        spread: 0.0004,
        timestamp: new Date(),
        source: 'Frankfurter / ECB',
      };
      toCache(key, quote);
      return quote;
    }
  } catch { /* fall through */ }

  // ExchangeRate-API fallback
  const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
  const raw = await fetchJSON(url);
  const price = raw.rates?.[toCurrency];
  const quote: LiveQuote = {
    symbol: `${fromCurrency}/${toCurrency}`,
    assetClass: 'forex',
    price,
    bid:   price - 0.0002,
    ask:   price + 0.0002,
    spread: 0.0004,
    timestamp: new Date(),
    source: 'ExchangeRate-API',
  };
  toCache(key, quote);
  return quote;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRYPTO DATA FETCHERS
// ─────────────────────────────────────────────────────────────────────────────

/** CoinGecko symbol → id map for common coins */
const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  ADA: 'cardano', XRP: 'ripple', DOGE: 'dogecoin', AVAX: 'avalanche-2',
  DOT: 'polkadot', MATIC: 'matic-network', LINK: 'chainlink', UNI: 'uniswap',
};

/**
 * Fetch crypto OHLCV candles.
 * Primary: CoinGecko OHLC (free, no key, 90-day daily)
 * Fallback: Binance klines (free, no key, 100 x 1h)
 */
async function fetchCryptoCandles(symbol: string, vsCurrency = 'usd'): Promise<OHLCVCandle[]> {
  const upper  = symbol.toUpperCase();
  const cgId   = COINGECKO_IDS[upper];
  const cacheK = `crypto-candles-${upper}-${vsCurrency}`;
  const cached = fromCache<OHLCVCandle[]>(cacheK, 5 * 60 * 1000);
  if (cached) return cached;

  // ── SOURCE 1: CoinGecko OHLC ─────────────────────────────────────────────
  if (cgId) {
    try {
      const url = `https://api.coingecko.com/api/v3/coins/${cgId}/ohlc?vs_currency=${vsCurrency}&days=30`;
      const raw: number[][] = await fetchJSON(url);
      if (Array.isArray(raw) && raw.length > 10) {
        const candles: OHLCVCandle[] = raw.map(([ts, o, h, l, c]) => ({
          timestamp: new Date(ts),
          open: o, high: h, low: l, close: c, volume: 0,
        }));
        toCache(cacheK, candles);
        console.log(`✅ [MarketData] CoinGecko OHLC: ${upper} — ${candles.length} candles`);
        return candles;
      }
    } catch (e) { console.warn(`[MarketData] CoinGecko failed: ${e}`); }
  }

  // ── SOURCE 2: Binance klines ─────────────────────────────────────────────
  try {
    const binanceSymbol = `${upper}USDT`;
    const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=1h&limit=100`;
    const raw: any[][] = await fetchJSON(url);
    if (Array.isArray(raw) && raw.length > 10) {
      const candles: OHLCVCandle[] = raw.map(row => ({
        timestamp: new Date(row[0]),
        open:   parseFloat(row[1]),
        high:   parseFloat(row[2]),
        low:    parseFloat(row[3]),
        close:  parseFloat(row[4]),
        volume: parseFloat(row[5]),
      }));
      toCache(cacheK, candles);
      console.log(`✅ [MarketData] Binance klines: ${binanceSymbol} — ${candles.length} candles`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] Binance failed: ${e}`); }

  // ── SOURCE 3: CryptoCompare OHLCV ────────────────────────────────────────
  try {
    const ccKey  = process.env.CRYPTOCOMPARE_API_KEY || '';
    const keyParam = ccKey ? `&api_key=${ccKey}` : '';
    const url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${upper}&tsym=${vsCurrency.toUpperCase()}&limit=100${keyParam}`;
    const raw = await fetchJSON(url);
    if (raw.Data?.Data?.length > 10) {
      const candles: OHLCVCandle[] = raw.Data.Data.map((d: any) => ({
        timestamp: new Date(d.time * 1000),
        open:   d.open, high: d.high, low: d.low, close: d.close,
        volume: d.volumeto,
      }));
      toCache(cacheK, candles);
      console.log(`✅ [MarketData] CryptoCompare: ${upper} — ${candles.length} candles`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] CryptoCompare failed: ${e}`); }

  throw new Error(`All crypto data sources failed for ${symbol}`);
}

async function fetchCryptoQuote(symbol: string): Promise<LiveQuote> {
  const upper  = symbol.toUpperCase();
  const cgId   = COINGECKO_IDS[upper];
  const cacheK = `crypto-quote-${upper}`;
  const cached = fromCache<LiveQuote>(cacheK, 30 * 1000); // 30-sec cache
  if (cached) return cached;

  // CoinGecko simple price
  if (cgId) {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
      const raw = await fetchJSON(url);
      const d = raw[cgId];
      if (d) {
        const quote: LiveQuote = {
          symbol:        `${upper}/USD`,
          assetClass:    'crypto',
          price:         d.usd,
          change24h:     d.usd_24h_change ? (d.usd * d.usd_24h_change / 100) : undefined,
          changePct24h:  d.usd_24h_change,
          volume24h:     d.usd_24h_vol,
          marketCap:     d.usd_market_cap,
          timestamp:     new Date(),
          source:        'CoinGecko',
        };
        toCache(cacheK, quote);
        return quote;
      }
    } catch { /* fall through */ }
  }

  // Binance 24hr ticker
  const binanceSymbol = `${upper}USDT`;
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`;
  const raw = await fetchJSON(url);
  const quote: LiveQuote = {
    symbol:        `${upper}/USD`,
    assetClass:    'crypto',
    price:         parseFloat(raw.lastPrice),
    change24h:     parseFloat(raw.priceChange),
    changePct24h:  parseFloat(raw.priceChangePercent),
    volume24h:     parseFloat(raw.volume),
    timestamp:     new Date(),
    source:        'Binance',
  };
  toCache(cacheK, quote);
  return quote;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCK DATA FETCHERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch stock OHLCV candles.
 * Primary:  Alpha Vantage TIME_SERIES_DAILY
 * Fallback: Financial Modeling Prep /historical-price-full
 */
async function fetchStockCandles(ticker: string): Promise<OHLCVCandle[]> {
  const upper  = ticker.toUpperCase();
  const cacheK = `stock-candles-${upper}`;
  const cached = fromCache<OHLCVCandle[]>(cacheK, 5 * 60 * 1000);
  if (cached) return cached;

  // ── SOURCE 1: Alpha Vantage daily ────────────────────────────────────────
  if (avKey() !== 'demo') {
    try {
      const url = `${AV_BASE}?function=TIME_SERIES_DAILY&symbol=${upper}&outputsize=compact&apikey=${avKey()}`;
      const raw  = await fetchJSON(url);
      const candles = parseAVTimeSeries(raw, 'Time Series (Daily)');
      if (candles.length >= 20) {
        toCache(cacheK, candles);
        console.log(`✅ [MarketData] AV stock daily: ${upper} — ${candles.length} candles`);
        return candles;
      }
    } catch (e) { console.warn(`[MarketData] AV stock failed: ${e}`); }
  }

  // ── SOURCE 2: Financial Modeling Prep ────────────────────────────────────
  try {
    const fmpKey = process.env.FMP_API_KEY || 'demo';
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${upper}?timeseries=100&apikey=${fmpKey}`;
    const raw  = await fetchJSON(url);
    if (raw.historical?.length > 10) {
      const candles: OHLCVCandle[] = raw.historical
        .map((d: any) => ({
          timestamp: new Date(d.date),
          open:   d.open, high: d.high, low: d.low, close: d.close,
          volume: d.volume,
        }))
        .sort((a: OHLCVCandle, b: OHLCVCandle) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-100);
      toCache(cacheK, candles);
      console.log(`✅ [MarketData] FMP historical: ${upper} — ${candles.length} candles`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] FMP failed: ${e}`); }

  // ── SOURCE 3: Yahoo Finance unofficial (no key needed) ───────────────────
  try {
    const end   = Math.floor(Date.now() / 1000);
    const start = end - 100 * 86400;
    const url   = `https://query1.finance.yahoo.com/v8/finance/chart/${upper}?period1=${start}&period2=${end}&interval=1d&range=3mo`;
    const raw   = await fetchJSON(url);
    const result = raw?.chart?.result?.[0];
    if (result) {
      const ts   = result.timestamp as number[];
      const q    = result.indicators?.quote?.[0];
      const candles: OHLCVCandle[] = ts.map((t, i) => ({
        timestamp: new Date(t * 1000),
        open:   q.open[i]  ?? q.close[i],
        high:   q.high[i]  ?? q.close[i],
        low:    q.low[i]   ?? q.close[i],
        close:  q.close[i],
        volume: q.volume[i] ?? 0,
      })).filter(c => c.close != null).slice(-100);
      toCache(cacheK, candles);
      console.log(`✅ [MarketData] Yahoo Finance: ${upper} — ${candles.length} candles`);
      return candles;
    }
  } catch (e) { console.warn(`[MarketData] Yahoo Finance failed: ${e}`); }

  throw new Error(`All stock data sources failed for ${ticker}`);
}

async function fetchStockQuote(ticker: string): Promise<LiveQuote> {
  const upper  = ticker.toUpperCase();
  const cacheK = `stock-quote-${upper}`;
  const cached = fromCache<LiveQuote>(cacheK, 60 * 1000);
  if (cached) return cached;

  // Alpha Vantage GLOBAL_QUOTE
  if (avKey() !== 'demo') {
    try {
      const url = `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${upper}&apikey=${avKey()}`;
      const raw = await fetchJSON(url);
      const gq  = raw['Global Quote'];
      if (gq?.['05. price']) {
        const price = parseFloat(gq['05. price']);
        const quote: LiveQuote = {
          symbol:        upper,
          assetClass:    'stock',
          price,
          change24h:     parseFloat(gq['09. change']),
          changePct24h:  parseFloat(gq['10. change percent']),
          volume24h:     parseFloat(gq['06. volume']),
          timestamp:     new Date(),
          source:        'Alpha Vantage',
        };
        toCache(cacheK, quote);
        return quote;
      }
    } catch { /* fall through */ }
  }

  // Yahoo Finance quote fallback
  const url  = `https://query1.finance.yahoo.com/v8/finance/chart/${upper}?interval=1d&range=1d`;
  const raw  = await fetchJSON(url);
  const meta = raw?.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice ?? meta?.previousClose;
  const quote: LiveQuote = {
    symbol:        upper,
    assetClass:    'stock',
    price,
    changePct24h:  meta?.regularMarketChangePercent,
    volume24h:     meta?.regularMarketVolume,
    timestamp:     new Date(),
    source:        'Yahoo Finance',
  };
  toCache(cacheK, quote);
  return quote;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export class MarketDataService {

  /** Fetch full OHLCV dataset + live quote for any symbol */
  async fetch(symbol: string, assetClass: AssetClass): Promise<MarketDataResult> {
    let candles: OHLCVCandle[];
    let quote:   LiveQuote;
    let source:  string;

    if (assetClass === 'forex') {
      const parts = symbol.replace('/', '').toUpperCase();
      const from  = parts.slice(0, 3);
      const to    = parts.slice(3, 6);
      [candles, quote] = await Promise.all([
        fetchForexCandles(from, to),
        fetchForexQuote(from, to),
      ]);
      source = quote.source;
    } else if (assetClass === 'crypto') {
      const base = symbol.split('/')[0].toUpperCase();
      [candles, quote] = await Promise.all([
        fetchCryptoCandles(base),
        fetchCryptoQuote(base),
      ]);
      source = quote.source;
    } else {
      // stock
      [candles, quote] = await Promise.all([
        fetchStockCandles(symbol),
        fetchStockQuote(symbol),
      ]);
      source = quote.source;
    }

    // Ensure the last candle close matches the live quote
    if (candles.length > 0) {
      candles[candles.length - 1].close = quote.price;
      if (quote.bid) candles[candles.length - 1].bid = quote.bid;
      if (quote.ask) candles[candles.length - 1].ask = quote.ask;
    }

    return {
      symbol,
      assetClass,
      candles,
      quote,
      source,
      fetchedAt:  new Date(),
      dataPoints: candles.length,
    };
  }

  /** Convenience: fetch multiple symbols in parallel */
  async fetchMultiple(requests: { symbol: string; assetClass: AssetClass }[]): Promise<MarketDataResult[]> {
    return Promise.allSettled(
      requests.map(r => this.fetch(r.symbol, r.assetClass))
    ).then(results =>
      results
        .filter((r): r is PromiseFulfilledResult<MarketDataResult> => r.status === 'fulfilled')
        .map(r => r.value)
    );
  }

  /** Current cache status for diagnostics */
  cacheStatus(): { entries: number; keys: string[] } {
    return { entries: cache.size, keys: Array.from(cache.keys()) };
  }
}

export const marketDataService = new MarketDataService();
export default marketDataService;
