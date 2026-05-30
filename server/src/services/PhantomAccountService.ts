/**
 * PHANTOM ACCOUNT SERVICE
 * =============================================================================
 * Multi-asset paper trading engine. Replaces phantom_account_live.json.
 *
 * Tracks:
 *   - Virtual portfolio (starting balance configurable, default $10,000)
 *   - Open and closed phantom trades across Forex, Crypto, and Stocks
 *   - Real P&L computed from live prices when trade is closed
 *   - Aggregate performance: win rate, Sharpe ratio, max drawdown, profit factor
 *
 * Paper trading model:
 *   - Trades execute at signal entry_price (slippage not modelled in v1)
 *   - Position size = signal.position_size_pct × account equity
 *   - SL/TP triggers are checked when recordPrice() is called
 *   - No margin/leverage in v1 — trades are fully funded
 *
 * Persistence: JSON file (same pattern as OutcomeTracker)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import type { TradingSignal } from '../engines/MultiAssetTradingEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type TradeStatus    = 'OPEN' | 'CLOSED_WIN' | 'CLOSED_LOSS' | 'CLOSED_BE' | 'CLOSED_MANUAL';
export type CloseReason    = 'TAKE_PROFIT_1' | 'TAKE_PROFIT_2' | 'STOP_LOSS' | 'MANUAL' | 'EXPIRED';

export interface PhantomTrade {
  trade_id:           string;
  signal_id:          string;
  symbol:             string;
  asset_class:        string;
  direction:          'BUY' | 'SELL';
  entry_price:        number;
  exit_price?:        number;
  stop_loss:          number;
  take_profit_1:      number;
  take_profit_2:      number;
  position_size_pct:  number;
  position_usd:       number;          // dollar value when trade opened
  opened_at:          string;
  closed_at?:         string;
  status:             TradeStatus;
  close_reason?:      CloseReason;
  pnl_usd?:           number;
  pnl_pct?:           number;
  pips?:              number;
  signal_was_correct?:boolean;
  veritech_cert_id:   string;
  hitl_status:        string;
  notes?:             string;
}

export interface EquityCurvePoint {
  timestamp: string;
  equity:    number;
  trade_id?: string;
  event:     string;
}

export interface PhantomAccount {
  account_id:          string;
  name:                string;
  starting_balance:    number;
  current_balance:     number;
  peak_balance:        number;
  total_trades:        number;
  open_trades_count:   number;
  closed_trades_count: number;
  winning_trades:      number;
  losing_trades:       number;
  breakeven_trades:    number;
  total_pnl_usd:       number;
  total_pnl_pct:       number;
  win_rate_pct:        number;
  avg_win_usd:         number;
  avg_loss_usd:        number;
  avg_win_pct:         number;
  avg_loss_pct:        number;
  profit_factor:       number;
  max_drawdown_pct:    number;
  sharpe_ratio:        number;
  calmar_ratio:        number;         // annualised return / max drawdown
  expectancy_usd:      number;         // avg trade profit in $
  measured_accuracy:   number;         // REAL win rate — not the 98.5% claim
  open_trades:         PhantomTrade[];
  closed_trades:       PhantomTrade[];
  equity_curve:        EquityCurvePoint[];
  by_asset_class: {
    forex:  { trades: number; pnl_usd: number; win_rate_pct: number };
    crypto: { trades: number; pnl_usd: number; win_rate_pct: number };
    stock:  { trades: number; pnl_usd: number; win_rate_pct: number };
  };
  last_updated:        string;
  inception_date:      string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────

const DATA_DIR  = path.resolve(__dirname, '../../..', 'data');
const ACCT_FILE = path.join(DATA_DIR, 'phantom_account.json');

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function defaultAccount(): PhantomAccount {
  return {
    account_id:          `PHANTOM-${Date.now()}`,
    name:                'ORB AI Multi-Asset Phantom Account v2',
    starting_balance:    10_000,
    current_balance:     10_000,
    peak_balance:        10_000,
    total_trades:        0,
    open_trades_count:   0,
    closed_trades_count: 0,
    winning_trades:      0,
    losing_trades:       0,
    breakeven_trades:    0,
    total_pnl_usd:       0,
    total_pnl_pct:       0,
    win_rate_pct:        0,
    avg_win_usd:         0,
    avg_loss_usd:        0,
    avg_win_pct:         0,
    avg_loss_pct:        0,
    profit_factor:       0,
    max_drawdown_pct:    0,
    sharpe_ratio:        0,
    calmar_ratio:        0,
    expectancy_usd:      0,
    measured_accuracy:   0,
    open_trades:         [],
    closed_trades:       [],
    equity_curve:        [{ timestamp: new Date().toISOString(), equity: 10_000, event: 'Account opened' }],
    by_asset_class: {
      forex:  { trades: 0, pnl_usd: 0, win_rate_pct: 0 },
      crypto: { trades: 0, pnl_usd: 0, win_rate_pct: 0 },
      stock:  { trades: 0, pnl_usd: 0, win_rate_pct: 0 },
    },
    last_updated:  new Date().toISOString(),
    inception_date: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class PhantomAccountService {
  private account: PhantomAccount;

  constructor() {
    ensureDir();
    this.account = this.load();
    console.log(`[PhantomAccount] Loaded. Balance: $${this.account.current_balance.toFixed(2)}, Trades: ${this.account.total_trades}`);
  }

  private load(): PhantomAccount {
    try {
      if (fs.existsSync(ACCT_FILE)) {
        return JSON.parse(fs.readFileSync(ACCT_FILE, 'utf8'));
      }
    } catch {/* ignore */}
    return defaultAccount();
  }

  private save(): void {
    try {
      this.account.last_updated = new Date().toISOString();
      fs.writeFileSync(ACCT_FILE, JSON.stringify(this.account, null, 2), 'utf8');
    } catch (e) {
      console.warn('[PhantomAccount] Could not save to disk:', e);
    }
  }

  // ── Open a new phantom trade from a signal ────────────────────────────────
  openTrade(signal: TradingSignal, notes?: string): { success: boolean; trade?: PhantomTrade; error?: string } {
    if (signal.action === 'HOLD') {
      return { success: false, error: 'HOLD signals do not open positions' };
    }

    // Max 10 open trades
    if (this.account.open_trades.length >= 10) {
      return { success: false, error: 'Max 10 concurrent open trades reached' };
    }

    const positionUsd = this.account.current_balance * (signal.position_size_pct / 100);

    const trade: PhantomTrade = {
      trade_id:          `PTRADE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      signal_id:         signal.signal_id,
      symbol:            signal.symbol,
      asset_class:       signal.asset_class,
      direction:         signal.action as 'BUY' | 'SELL',
      entry_price:       signal.entry_price,
      stop_loss:         signal.stop_loss,
      take_profit_1:     signal.take_profit_1,
      take_profit_2:     signal.take_profit_2,
      position_size_pct: signal.position_size_pct,
      position_usd:      +positionUsd.toFixed(2),
      opened_at:         new Date().toISOString(),
      status:            'OPEN',
      veritech_cert_id:  signal.veritech_cert_id,
      hitl_status:       signal.hitl_status,
      notes,
    };

    this.account.open_trades.push(trade);
    this.account.total_trades++;
    this.account.open_trades_count++;

    this.account.equity_curve.push({
      timestamp: new Date().toISOString(),
      equity:    this.account.current_balance,
      trade_id:  trade.trade_id,
      event:     `OPEN ${trade.direction} ${trade.symbol} @ ${trade.entry_price}`,
    });

    this.recalcStats();
    this.save();
    return { success: true, trade };
  }

  // ── Close a trade at a given price ───────────────────────────────────────
  closeTrade(
    trade_id:    string,
    exit_price:  number,
    reason:      CloseReason = 'MANUAL',
    notes?:      string,
  ): { success: boolean; trade?: PhantomTrade; error?: string } {
    const idx = this.account.open_trades.findIndex(t => t.trade_id === trade_id);
    if (idx === -1) return { success: false, error: `Trade ${trade_id} not found` };

    const trade    = this.account.open_trades[idx];
    const entry    = trade.entry_price;
    const isBuy    = trade.direction === 'BUY';
    const pnlPct   = isBuy
      ? ((exit_price - entry) / entry) * 100
      : ((entry - exit_price) / entry) * 100;
    const pnlUsd   = trade.position_usd * (pnlPct / 100);
    const pipFactor = trade.asset_class === 'forex' ? 10000 : 100;
    const pips     = (exit_price - entry) * pipFactor * (isBuy ? 1 : -1);

    let status: TradeStatus;
    if (Math.abs(pnlPct) < 0.05)  status = 'CLOSED_BE';
    else if (pnlUsd > 0)           status = 'CLOSED_WIN';
    else                           status = 'CLOSED_LOSS';

    trade.exit_price        = exit_price;
    trade.closed_at         = new Date().toISOString();
    trade.status            = status;
    trade.close_reason      = reason;
    trade.pnl_usd           = +pnlUsd.toFixed(2);
    trade.pnl_pct           = +pnlPct.toFixed(4);
    trade.pips              = +pips.toFixed(1);
    trade.signal_was_correct = pnlUsd >= 0;
    if (notes) trade.notes  = notes;

    // Move to closed
    this.account.open_trades.splice(idx, 1);
    this.account.closed_trades.push(trade);
    this.account.current_balance += pnlUsd;
    if (this.account.current_balance > this.account.peak_balance) {
      this.account.peak_balance = this.account.current_balance;
    }

    this.account.equity_curve.push({
      timestamp: new Date().toISOString(),
      equity:    this.account.current_balance,
      trade_id:  trade.trade_id,
      event:     `CLOSE ${trade.direction} ${trade.symbol} @ ${exit_price} | P&L: $${pnlUsd.toFixed(2)}`,
    });

    this.recalcStats();
    this.save();
    return { success: true, trade };
  }

  // ── Check SL/TP triggers for all open trades ──────────────────────────────
  checkTriggers(symbol: string, currentPrice: number): PhantomTrade[] {
    const triggered: PhantomTrade[] = [];

    for (const trade of this.account.open_trades.filter(t => t.symbol === symbol)) {
      const isBuy = trade.direction === 'BUY';
      let closeReason: CloseReason | null = null;

      if (isBuy) {
        if (currentPrice <= trade.stop_loss)     closeReason = 'STOP_LOSS';
        else if (currentPrice >= trade.take_profit_2) closeReason = 'TAKE_PROFIT_2';
        else if (currentPrice >= trade.take_profit_1) closeReason = 'TAKE_PROFIT_1';
      } else {
        if (currentPrice >= trade.stop_loss)     closeReason = 'STOP_LOSS';
        else if (currentPrice <= trade.take_profit_2) closeReason = 'TAKE_PROFIT_2';
        else if (currentPrice <= trade.take_profit_1) closeReason = 'TAKE_PROFIT_1';
      }

      if (closeReason) {
        const result = this.closeTrade(trade.trade_id, currentPrice, closeReason, 'Auto-triggered by SL/TP');
        if (result.success && result.trade) triggered.push(result.trade);
      }
    }

    return triggered;
  }

  // ── Recalculate all aggregate stats ──────────────────────────────────────
  private recalcStats(): void {
    const closed = this.account.closed_trades;
    const wins   = closed.filter(t => t.status === 'CLOSED_WIN');
    const losses = closed.filter(t => t.status === 'CLOSED_LOSS');
    const be     = closed.filter(t => t.status === 'CLOSED_BE');

    this.account.closed_trades_count = closed.length;
    this.account.open_trades_count   = this.account.open_trades.length;
    this.account.winning_trades      = wins.length;
    this.account.losing_trades       = losses.length;
    this.account.breakeven_trades    = be.length;

    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    this.account.win_rate_pct      = +winRate.toFixed(2);
    this.account.measured_accuracy = +winRate.toFixed(2);  // Real number, not 98.5%

    const totalPnl = closed.reduce((s, t) => s + (t.pnl_usd ?? 0), 0);
    this.account.total_pnl_usd = +totalPnl.toFixed(2);
    this.account.total_pnl_pct = +((this.account.current_balance - this.account.starting_balance) / this.account.starting_balance * 100).toFixed(4);

    this.account.avg_win_usd   = wins.length > 0   ? +(wins.reduce((s, t)   => s + (t.pnl_usd ?? 0), 0) / wins.length).toFixed(2)   : 0;
    this.account.avg_loss_usd  = losses.length > 0 ? +(losses.reduce((s, t) => s + (t.pnl_usd ?? 0), 0) / losses.length).toFixed(2) : 0;
    this.account.avg_win_pct   = wins.length > 0   ? +(wins.reduce((s, t)   => s + (t.pnl_pct ?? 0), 0) / wins.length).toFixed(4)   : 0;
    this.account.avg_loss_pct  = losses.length > 0 ? +(losses.reduce((s, t) => s + (t.pnl_pct ?? 0), 0) / losses.length).toFixed(4) : 0;

    const grossWins = wins.reduce((s, t)   => s + Math.abs(t.pnl_usd ?? 0), 0);
    const grossLoss = losses.reduce((s, t) => s + Math.abs(t.pnl_usd ?? 0), 0);
    this.account.profit_factor  = grossLoss > 0 ? +(grossWins / grossLoss).toFixed(3) : wins.length > 0 ? 99 : 0;
    this.account.expectancy_usd = closed.length > 0
      ? +(closed.reduce((s, t) => s + (t.pnl_usd ?? 0), 0) / closed.length).toFixed(2)
      : 0;

    // Max drawdown from equity curve
    let peak = this.account.starting_balance, maxDD = 0;
    for (const pt of this.account.equity_curve) {
      if (pt.equity > peak) peak = pt.equity;
      const dd = (peak - pt.equity) / peak * 100;
      if (dd > maxDD) maxDD = dd;
    }
    this.account.max_drawdown_pct = +maxDD.toFixed(4);

    // Sharpe ratio
    const pnls = closed.map(t => t.pnl_pct ?? 0);
    if (pnls.length >= 5) {
      const mean = pnls.reduce((s, v) => s + v, 0) / pnls.length;
      const variance = pnls.reduce((s, v) => s + (v - mean) ** 2, 0) / pnls.length;
      const std = Math.sqrt(variance);
      this.account.sharpe_ratio = std > 0 ? +(( mean / std) * Math.sqrt(252)).toFixed(3) : 0;
    }

    // Calmar ratio (annualised return / max drawdown)
    const daysSinceInception = (Date.now() - new Date(this.account.inception_date).getTime()) / 86400000;
    const annualisedReturn   = daysSinceInception > 0
      ? (this.account.total_pnl_pct / daysSinceInception) * 365
      : 0;
    this.account.calmar_ratio = this.account.max_drawdown_pct > 0
      ? +(annualisedReturn / this.account.max_drawdown_pct).toFixed(3)
      : 0;

    // By asset class
    for (const cls of ['forex', 'crypto', 'stock'] as const) {
      const c = closed.filter(t => t.asset_class === cls);
      const w = c.filter(t => t.status === 'CLOSED_WIN');
      this.account.by_asset_class[cls] = {
        trades:       c.length,
        pnl_usd:      +c.reduce((s, t) => s + (t.pnl_usd ?? 0), 0).toFixed(2),
        win_rate_pct: c.length > 0 ? +(w.length / c.length * 100).toFixed(1) : 0,
      };
    }
  }

  // ── Getters ───────────────────────────────────────────────────────────────
  getAccount(): PhantomAccount { return this.account; }

  getSummary() {
    return {
      account_id:        this.account.account_id,
      balance:           this.account.current_balance,
      total_pnl_usd:     this.account.total_pnl_usd,
      total_pnl_pct:     this.account.total_pnl_pct,
      measured_accuracy: this.account.measured_accuracy,
      win_rate_pct:      this.account.win_rate_pct,
      total_trades:      this.account.total_trades,
      open_trades:       this.account.open_trades_count,
      sharpe_ratio:      this.account.sharpe_ratio,
      max_drawdown_pct:  this.account.max_drawdown_pct,
      profit_factor:     this.account.profit_factor,
      last_updated:      this.account.last_updated,
    };
  }

  getTrade(trade_id: string): PhantomTrade | undefined {
    return (
      this.account.open_trades.find(t  => t.trade_id === trade_id) ||
      this.account.closed_trades.find(t => t.trade_id === trade_id)
    );
  }

  getRecentTrades(limit = 20): PhantomTrade[] {
    const all = [...this.account.open_trades, ...this.account.closed_trades];
    return all
      .sort((a, b) => new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime())
      .slice(0, limit);
  }

  getEquityCurve(): EquityCurvePoint[] {
    return this.account.equity_curve.slice(-200);  // last 200 points
  }

  // ── Reset account (for testing only) ─────────────────────────────────────
  reset(startingBalance = 10_000): void {
    this.account = defaultAccount();
    this.account.starting_balance = startingBalance;
    this.account.current_balance  = startingBalance;
    this.account.peak_balance     = startingBalance;
    this.account.equity_curve     = [{ timestamp: new Date().toISOString(), equity: startingBalance, event: 'Account reset' }];
    this.save();
  }
}

// Singleton
export const phantomAccount = new PhantomAccountService();
export default phantomAccount;
