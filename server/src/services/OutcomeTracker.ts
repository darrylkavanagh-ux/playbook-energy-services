/**
 * OUTCOME TRACKER SERVICE
 * =============================================================================
 * Step 3: Records actual price outcomes after each signal and computes REAL
 * accuracy statistics — not the mathematically-capped 98.5% claim.
 *
 * How it works:
 *   1. When a signal is generated, it is registered here with entry price +
 *      direction.
 *   2. After the signal's timeframe expires (or when manually updated), the
 *      actual close price is recorded.
 *   3. Win/loss is determined: BUY signal wins if actual price > entry, SELL
 *      signal wins if actual price < entry.
 *   4. Aggregate accuracy, Sharpe ratio, profit factor, max drawdown are
 *      computed over the rolling window.
 *
 * Storage: in-memory Map + optional filesystem JSON persistence so outcomes
 * survive server restarts without requiring a database.
 *
 * After 90 days of live signals you will have a statistically meaningful
 * accuracy figure (Step 6 in the build plan).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TradingSignal, SignalAction } from '../engines/MultiAssetTradingEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type OutcomeResult = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING';

export interface SignalOutcome {
  signal_id:        string;
  symbol:           string;
  asset_class:      string;
  action:           SignalAction;
  signal_score:     number;
  confidence_pct:   number;
  entry_price:      number;
  stop_loss:        number;
  take_profit_1:    number;
  take_profit_2:    number;
  timeframe:        string;
  registered_at:    string;          // ISO timestamp when signal was registered

  // Filled in when outcome is recorded
  exit_price?:      number;
  outcome?:         OutcomeResult;
  pnl_pct?:         number;          // percentage P&L (positive = profit)
  pips?:            number;          // forex pips | crypto/stock cents
  recorded_at?:     string;          // ISO timestamp when outcome was submitted
  recorded_by?:     string;          // trader name / automated system
  notes?:           string;
}

export interface AccuracyStats {
  total_signals:       number;
  resolved_signals:    number;       // outcomes recorded (not PENDING)
  pending_signals:     number;
  wins:                number;
  losses:              number;
  breakeven:           number;
  win_rate_pct:        number;       // real measured accuracy
  avg_win_pct:         number;
  avg_loss_pct:        number;
  profit_factor:       number;       // gross wins / gross losses
  expectancy_pct:      number;       // avg trade P&L
  max_drawdown_pct:    number;       // deepest peak-to-trough
  sharpe_ratio:        number;       // annualised (assumes 252 trading days)
  by_asset_class: {
    forex:  { signals: number; wins: number; win_rate_pct: number };
    crypto: { signals: number; wins: number; win_rate_pct: number };
    stock:  { signals: number; wins: number; win_rate_pct: number };
  };
  by_action: {
    BUY:  { signals: number; wins: number; win_rate_pct: number };
    SELL: { signals: number; wins: number; win_rate_pct: number };
    HOLD: { signals: number; wins: number; win_rate_pct: number };
  };
  confidence_vs_accuracy: { bucket: string; count: number; win_rate_pct: number }[];
  last_updated:   string;
  statistical_significance: string;  // "NOT SIGNIFICANT" until ≥30 resolved signals
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────

const PERSISTENCE_FILE = path.resolve(__dirname, '../../..', 'data', 'signal_outcomes.json');

function ensureDataDir(): void {
  const dir = path.dirname(PERSISTENCE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadFromDisk(): Map<string, SignalOutcome> {
  try {
    ensureDataDir();
    if (!fs.existsSync(PERSISTENCE_FILE)) return new Map();
    const raw = fs.readFileSync(PERSISTENCE_FILE, 'utf8');
    const arr: SignalOutcome[] = JSON.parse(raw);
    return new Map(arr.map(o => [o.signal_id, o]));
  } catch {
    return new Map();
  }
}

function saveToDisk(outcomes: Map<string, SignalOutcome>): void {
  try {
    ensureDataDir();
    const arr = Array.from(outcomes.values());
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    console.warn('[OutcomeTracker] Could not persist to disk:', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class OutcomeTracker {
  private outcomes: Map<string, SignalOutcome>;

  constructor() {
    this.outcomes = loadFromDisk();
    console.log(`[OutcomeTracker] Loaded ${this.outcomes.size} signal outcomes from disk.`);
  }

  // ── Register a new signal immediately when generated ─────────────────────
  register(signal: TradingSignal): SignalOutcome {
    const record: SignalOutcome = {
      signal_id:      signal.signal_id,
      symbol:         signal.symbol,
      asset_class:    signal.asset_class,
      action:         signal.action,
      signal_score:   signal.signal_score,
      confidence_pct: signal.confidence_pct,
      entry_price:    signal.entry_price,
      stop_loss:      signal.stop_loss,
      take_profit_1:  signal.take_profit_1,
      take_profit_2:  signal.take_profit_2,
      timeframe:      signal.timeframe,
      registered_at:  new Date().toISOString(),
      outcome:        'PENDING',
    };

    this.outcomes.set(signal.signal_id, record);
    saveToDisk(this.outcomes);
    return record;
  }

  // ── Record the outcome once actual price is known ─────────────────────────
  recordOutcome(
    signal_id:    string,
    exit_price:   number,
    recorded_by?: string,
    notes?:       string,
  ): { success: boolean; outcome?: SignalOutcome; error?: string } {
    const record = this.outcomes.get(signal_id);
    if (!record) {
      return { success: false, error: `Signal ${signal_id} not found` };
    }
    if (record.outcome !== 'PENDING') {
      return { success: false, error: `Signal ${signal_id} already has outcome: ${record.outcome}` };
    }

    const entry = record.entry_price;
    let pnl_pct: number;

    if (record.action === 'BUY') {
      pnl_pct = ((exit_price - entry) / entry) * 100;
    } else if (record.action === 'SELL') {
      pnl_pct = ((entry - exit_price) / entry) * 100;
    } else {
      // HOLD signal — we consider it a win if price didn't move against a neutral position
      pnl_pct = 0;
    }

    // Determine pip value for forex (1 pip = 0.0001 for most pairs)
    const pipFactor = record.asset_class === 'forex' ? 10000 : 100;
    const pips = (exit_price - entry) * pipFactor * (record.action === 'SELL' ? -1 : 1);

    // Win/loss threshold: ±0.05% is breakeven
    let outcome: OutcomeResult;
    if (Math.abs(pnl_pct) < 0.05) {
      outcome = 'BREAKEVEN';
    } else if (pnl_pct > 0) {
      outcome = 'WIN';
    } else {
      outcome = 'LOSS';
    }

    record.exit_price   = exit_price;
    record.outcome      = outcome;
    record.pnl_pct      = +pnl_pct.toFixed(4);
    record.pips         = +pips.toFixed(1);
    record.recorded_at  = new Date().toISOString();
    record.recorded_by  = recorded_by || 'system';
    record.notes        = notes;

    this.outcomes.set(signal_id, record);
    saveToDisk(this.outcomes);

    return { success: true, outcome: record };
  }

  // ── Auto-resolve expired signals using live price ─────────────────────────
  autoResolve(signal_id: string, currentPrice: number): { success: boolean; outcome?: SignalOutcome } {
    const record = this.outcomes.get(signal_id);
    if (!record || record.outcome !== 'PENDING') return { success: false };
    return this.recordOutcome(signal_id, currentPrice, 'auto_resolver');
  }

  // ── Get a single outcome record ────────────────────────────────────────────
  getOutcome(signal_id: string): SignalOutcome | undefined {
    return this.outcomes.get(signal_id);
  }

  // ── Get all outcomes, newest first ────────────────────────────────────────
  getAll(limit = 100, assetClass?: string): SignalOutcome[] {
    let arr = Array.from(this.outcomes.values())
      .sort((a, b) => new Date(b.registered_at).getTime() - new Date(a.registered_at).getTime());
    if (assetClass) arr = arr.filter(o => o.asset_class === assetClass);
    return arr.slice(0, limit);
  }

  // ── Compute aggregate accuracy stats ──────────────────────────────────────
  computeStats(): AccuracyStats {
    const all     = Array.from(this.outcomes.values());
    const resolved = all.filter(o => o.outcome !== 'PENDING');
    const pending  = all.filter(o => o.outcome === 'PENDING');
    const wins     = resolved.filter(o => o.outcome === 'WIN');
    const losses   = resolved.filter(o => o.outcome === 'LOSS');
    const breakeven = resolved.filter(o => o.outcome === 'BREAKEVEN');

    const winRate  = resolved.length > 0 ? (wins.length / resolved.length) * 100 : 0;
    const avgWin   = wins.length > 0   ? wins.reduce((s, o)   => s + (o.pnl_pct ?? 0), 0) / wins.length   : 0;
    const avgLoss  = losses.length > 0 ? losses.reduce((s, o) => s + (o.pnl_pct ?? 0), 0) / losses.length : 0;

    const grossWins  = wins.reduce((s, o)   => s + Math.abs(o.pnl_pct ?? 0), 0);
    const grossLoss  = losses.reduce((s, o) => s + Math.abs(o.pnl_pct ?? 0), 0);
    const profitFactor = grossLoss > 0 ? grossWins / grossLoss : wins.length > 0 ? 99 : 0;
    const expectancy   = resolved.length > 0
      ? resolved.reduce((s, o) => s + (o.pnl_pct ?? 0), 0) / resolved.length
      : 0;

    // Max drawdown — simulate cumulative P&L curve
    let peak = 0, maxDD = 0, cumulative = 0;
    const sorted = [...resolved].sort((a, b) => new Date(a.registered_at).getTime() - new Date(b.registered_at).getTime());
    for (const o of sorted) {
      cumulative += (o.pnl_pct ?? 0);
      if (cumulative > peak) peak = cumulative;
      const dd = peak - cumulative;
      if (dd > maxDD) maxDD = dd;
    }

    // Sharpe ratio (annualised) — mean daily returns / std dev * sqrt(252)
    const pnls = sorted.map(o => o.pnl_pct ?? 0);
    let sharpe = 0;
    if (pnls.length >= 5) {
      const mean = pnls.reduce((s, v) => s + v, 0) / pnls.length;
      const variance = pnls.reduce((s, v) => s + (v - mean) ** 2, 0) / pnls.length;
      const std = Math.sqrt(variance);
      sharpe = std > 0 ? (mean / std) * Math.sqrt(252) : 0;
    }

    // By asset class
    const byAsset = (cls: string) => {
      const c = resolved.filter(o => o.asset_class === cls);
      const w = c.filter(o => o.outcome === 'WIN');
      return { signals: c.length, wins: w.length, win_rate_pct: c.length > 0 ? +(w.length / c.length * 100).toFixed(1) : 0 };
    };

    // By action
    const byAction = (act: SignalAction) => {
      const c = resolved.filter(o => o.action === act);
      const w = c.filter(o => o.outcome === 'WIN');
      return { signals: c.length, wins: w.length, win_rate_pct: c.length > 0 ? +(w.length / c.length * 100).toFixed(1) : 0 };
    };

    // Confidence vs accuracy buckets
    const buckets = [
      { label: '50–60%', min: 50, max: 60 },
      { label: '60–70%', min: 60, max: 70 },
      { label: '70–80%', min: 70, max: 80 },
      { label: '80–90%', min: 80, max: 90 },
      { label: '90–98.5%', min: 90, max: 100 },
    ];
    const confidenceVsAccuracy = buckets.map(b => {
      const inBucket = resolved.filter(o => o.confidence_pct >= b.min && o.confidence_pct < b.max);
      const w = inBucket.filter(o => o.outcome === 'WIN');
      return {
        bucket: b.label,
        count: inBucket.length,
        win_rate_pct: inBucket.length > 0 ? +(w.length / inBucket.length * 100).toFixed(1) : 0,
      };
    });

    // Statistical significance warning
    let significance: string;
    if (resolved.length < 10)       significance = 'NOT SIGNIFICANT — need ≥10 resolved signals';
    else if (resolved.length < 30)  significance = 'LOW — need ≥30 signals for basic stats';
    else if (resolved.length < 100) significance = 'MODERATE — need ≥100 signals for confidence';
    else if (resolved.length < 300) significance = 'MEANINGFUL — approaching 90-day target';
    else                             significance = 'STATISTICALLY SIGNIFICANT';

    return {
      total_signals:       all.length,
      resolved_signals:    resolved.length,
      pending_signals:     pending.length,
      wins:                wins.length,
      losses:              losses.length,
      breakeven:           breakeven.length,
      win_rate_pct:        +winRate.toFixed(2),
      avg_win_pct:         +avgWin.toFixed(4),
      avg_loss_pct:        +avgLoss.toFixed(4),
      profit_factor:       +profitFactor.toFixed(3),
      expectancy_pct:      +expectancy.toFixed(4),
      max_drawdown_pct:    +maxDD.toFixed(4),
      sharpe_ratio:        +sharpe.toFixed(3),
      by_asset_class: {
        forex:  byAsset('forex'),
        crypto: byAsset('crypto'),
        stock:  byAsset('stock'),
      },
      by_action: {
        BUY:  byAction('BUY'),
        SELL: byAction('SELL'),
        HOLD: byAction('HOLD'),
      },
      confidence_vs_accuracy: confidenceVsAccuracy,
      last_updated:            new Date().toISOString(),
      statistical_significance: significance,
    };
  }

  // ── Get pending signals older than N minutes (for auto-expiry) ────────────
  getExpired(olderThanMinutes = 240): SignalOutcome[] {
    const cutoff = Date.now() - olderThanMinutes * 60 * 1000;
    return Array.from(this.outcomes.values()).filter(
      o => o.outcome === 'PENDING' && new Date(o.registered_at).getTime() < cutoff,
    );
  }

  // ── Summary counts for health checks ─────────────────────────────────────
  summary(): { total: number; pending: number; resolved: number; win_rate_pct: number } {
    const all      = Array.from(this.outcomes.values());
    const resolved = all.filter(o => o.outcome !== 'PENDING');
    const wins     = resolved.filter(o => o.outcome === 'WIN');
    return {
      total:        all.length,
      pending:      all.length - resolved.length,
      resolved:     resolved.length,
      win_rate_pct: resolved.length > 0 ? +(wins.length / resolved.length * 100).toFixed(2) : 0,
    };
  }
}

// Singleton
export const outcomeTracker = new OutcomeTracker();
export default outcomeTracker;
