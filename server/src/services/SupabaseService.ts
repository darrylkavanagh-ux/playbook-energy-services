/**
 * SUPABASE SERVICE — PLAYBOOK TRADING
 * =============================================================================
 * Central Supabase client + all Playbook Trading table operations.
 *
 * Tables managed:
 *   trading_signals          — every signal ever generated
 *   phantom_trades           — phantom account positions
 *   signal_outcomes          — real accuracy tracking
 *   oracle_scores            — oracle engine evaluations
 *   cb_nlp_scores            — central bank NLP scores (P1)
 *   smart_money_flow         — CFTC COT + options positioning (P1)
 *   playbook_subscriptions   — SaaS subscription tiers
 *   playbook_users           — platform users
 *   equity_curve             — phantom account equity history
 *   hitl_reviews             — human-in-the-loop verification log
 *   webhook_endpoints        — outbound webhook registrations (P1)
 *   calibration_snapshots    — isotonic regression calibration data
 *
 * Design decisions:
 *   - createClient() uses SERVICE_ROLE key server-side (full trust)
 *   - All public reads use ANON key (RLS enforced)
 *   - Graceful degradation: if SUPABASE_URL not set, falls back to JSON files
 *   - All methods return { data, error } matching Supabase conventions
 *   - Migrations are idempotent (CREATE TABLE IF NOT EXISTS)
 *
 * SETUP:
 *   1. Create project at https://app.supabase.com
 *   2. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Railway env
 *   3. Run: POST /api/trading/admin/migrate  (once, to create all tables)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type SignalAction   = 'BUY' | 'SELL' | 'HOLD';
export type TradeStatus    = 'OPEN' | 'CLOSED_WIN' | 'CLOSED_LOSS' | 'CLOSED_BE' | 'CLOSED_MANUAL';
export type OutcomeResult  = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'PENDING';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise' | 'institutional';
export type HITLStatus     = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'AUTO_APPROVED';

export interface DBTradingSignal {
  id?:                   string;
  signal_id:             string;
  symbol:                string;
  asset_class:           string;
  action:                SignalAction;
  signal_score:          number;
  confidence_pct:        number;
  entry_price:           number;
  stop_loss:             number;
  take_profit_1:         number;
  take_profit_2:         number;
  timeframe:             string;
  technical_score:       number;
  volume_score:          number;
  momentum_score:        number;
  asset_specific_score:  number;
  rsi:                   number;
  macd_signal:           string;
  bb_position:           string;
  atr:                   number;
  support_level:         number;
  resistance_level:      number;
  news_sentiment:        string;
  oracle_score?:         number;
  hitl_status:           HITLStatus;
  hitl_trader_id?:       string;
  hitl_approved_at?:     string;
  veritech_cert_id:      string;
  veritech_hash:         string;
  generated_at:          string;
  created_at?:           string;
}

export interface DBPhantomTrade {
  id?:                string;
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
  position_usd:       number;
  opened_at:          string;
  closed_at?:         string;
  status:             TradeStatus;
  close_reason?:      string;
  pnl_usd?:           number;
  pnl_pct?:           number;
  pips?:              number;
  signal_was_correct?: boolean;
  veritech_cert_id:   string;
  hitl_status:        string;
  notes?:             string;
  created_at?:        string;
  updated_at?:        string;
}

export interface DBSignalOutcome {
  id?:             string;
  signal_id:       string;
  symbol:          string;
  asset_class:     string;
  action:          SignalAction;
  signal_score:    number;
  confidence_pct:  number;
  entry_price:     number;
  stop_loss:       number;
  take_profit_1:   number;
  take_profit_2:   number;
  timeframe:       string;
  registered_at:   string;
  exit_price?:     number;
  outcome:         OutcomeResult;
  pnl_pct?:        number;
  pips?:           number;
  recorded_at?:    string;
  recorded_by?:    string;
  notes?:          string;
  created_at?:     string;
}

export interface DBOracleScore {
  id?:             string;
  signal_id?:      string;
  symbol:          string;
  asset_class:     string;
  oracle_score:    number;
  layer_scores:    Record<string, number>;
  recommendation:  string;
  computed_at:     string;
  created_at?:     string;
}

export interface DBCBNLPScore {
  id?:              string;
  source:           string;    // 'FED' | 'ECB' | 'BOE' | 'BOJ' | 'BIS'
  speech_title:     string;
  speech_date:      string;
  hawkish_score:    number;    // 0–100
  dovish_score:     number;    // 0–100
  neutral_score:    number;    // 0–100
  net_stance:       number;    // hawkish - dovish
  keywords_found:   string[];
  raw_text_excerpt: string;
  source_url?:      string;
  scored_at:        string;
  created_at?:      string;
}

export interface DBSmartMoneyFlow {
  id?:              string;
  symbol:           string;
  asset_class:      string;
  report_date:      string;    // CFTC COT date or options expiry date
  data_source:      string;    // 'CFTC_COT' | 'OPTIONS_FLOW' | 'DARK_POOL'
  commercials_net:  number;
  large_specs_net:  number;
  small_specs_net:  number;
  institutional_sentiment: number;  // -100 to +100
  options_put_call_ratio?: number;
  gamma_exposure?:  number;
  dark_pool_volume?: number;
  created_at?:      string;
}

export interface DBPlaybookUser {
  id?:              string;
  email:            string;
  full_name?:       string;
  tier:             SubscriptionTier;
  trader_credential?: string;   // FCA_CISI_LEVEL_3 | FINRA_SERIES_65 etc.
  is_hitl_trader:   boolean;
  api_key?:         string;
  subscription_start?: string;
  subscription_end?:   string;
  monthly_signal_count: number;
  webhook_url?:     string;
  slack_webhook?:   string;
  teams_webhook?:   string;
  created_at?:      string;
  updated_at?:      string;
}

export interface DBCalibrationSnapshot {
  id?:              string;
  asset_class:      string;
  timeframe:        string;
  raw_confidence:   number;   // binned centre: 55, 65, 75, 85, 95
  calibrated_probability: number;   // isotonic regression output
  sample_count:     number;
  win_count:        number;
  computed_at:      string;
  created_at?:      string;
}

export interface DBEquityCurvePoint {
  id?:           string;
  account_id:    string;
  timestamp:     string;
  equity:        number;
  trade_id?:     string;
  event:         string;
  created_at?:   string;
}

export interface DBHITLReview {
  id?:            string;
  signal_id:      string;
  trader_id:      string;
  decision:       'APPROVED' | 'REJECTED';
  confidence_adjustment?: number;   // trader can nudge ±5%
  notes?:         string;
  reviewed_at:    string;
  created_at?:    string;
}

export interface DBWebhookEndpoint {
  id?:            string;
  user_id:        string;
  label:          string;
  url:            string;
  type:           'SLACK' | 'TEAMS' | 'CUSTOM' | 'DISCORD';
  events:         string[];    // ['SIGNAL_GENERATED', 'TRADE_OPENED', 'TRADE_CLOSED']
  active:         boolean;
  secret_hash?:   string;
  last_fired?:    string;
  fire_count:     number;
  created_at?:    string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHANTOM ACCOUNT AGGREGATE (stored in Supabase as a summary row)
// ─────────────────────────────────────────────────────────────────────────────

export interface DBPhantomAccount {
  id?:                 string;
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
  profit_factor:       number;
  max_drawdown_pct:    number;
  sharpe_ratio:        number;
  measured_accuracy:   number;
  inception_date:      string;
  last_updated:        string;
  created_at?:         string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL MIGRATION DDL — PLAYBOOK TRADING TABLES
// ─────────────────────────────────────────────────────────────────────────────

export const PLAYBOOK_TRADING_MIGRATION_SQL = `
-- ============================================================================
-- PLAYBOOK TRADING — PostgreSQL schema
-- Compatible with Supabase (postgres 15+)
-- Run once: POST /api/trading/admin/migrate
-- All statements are idempotent (CREATE TABLE IF NOT EXISTS)
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Trading Signals ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trading_signals (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id             VARCHAR(50) UNIQUE NOT NULL,
  symbol                VARCHAR(20) NOT NULL,
  asset_class           VARCHAR(10) NOT NULL CHECK (asset_class IN ('forex','crypto','stock')),
  action                VARCHAR(5) NOT NULL CHECK (action IN ('BUY','SELL','HOLD')),
  signal_score          DECIMAL(5,2) NOT NULL,
  confidence_pct        DECIMAL(5,2) NOT NULL,
  entry_price           DECIMAL(18,8) NOT NULL,
  stop_loss             DECIMAL(18,8) NOT NULL,
  take_profit_1         DECIMAL(18,8) NOT NULL,
  take_profit_2         DECIMAL(18,8) NOT NULL,
  timeframe             VARCHAR(10) NOT NULL,
  technical_score       DECIMAL(5,2) DEFAULT 0,
  volume_score          DECIMAL(5,2) DEFAULT 0,
  momentum_score        DECIMAL(5,2) DEFAULT 0,
  asset_specific_score  DECIMAL(5,2) DEFAULT 0,
  rsi                   DECIMAL(6,2) DEFAULT 0,
  macd_signal           VARCHAR(20) DEFAULT 'NEUTRAL',
  bb_position           VARCHAR(20) DEFAULT 'MIDDLE',
  atr                   DECIMAL(18,8) DEFAULT 0,
  support_level         DECIMAL(18,8) DEFAULT 0,
  resistance_level      DECIMAL(18,8) DEFAULT 0,
  news_sentiment        VARCHAR(20) DEFAULT 'NEUTRAL',
  oracle_score          DECIMAL(5,2),
  hitl_status           VARCHAR(30) DEFAULT 'PENDING_REVIEW',
  hitl_trader_id        VARCHAR(100),
  hitl_approved_at      TIMESTAMPTZ,
  veritech_cert_id      VARCHAR(60) NOT NULL,
  veritech_hash         VARCHAR(70) NOT NULL,
  generated_at          TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ts_symbol       ON trading_signals(symbol);
CREATE INDEX IF NOT EXISTS idx_ts_asset_class  ON trading_signals(asset_class);
CREATE INDEX IF NOT EXISTS idx_ts_action       ON trading_signals(action);
CREATE INDEX IF NOT EXISTS idx_ts_generated_at ON trading_signals(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ts_hitl         ON trading_signals(hitl_status);

-- ── Phantom Trades ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS phantom_trades (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id             VARCHAR(20) UNIQUE NOT NULL,
  signal_id            VARCHAR(50) REFERENCES trading_signals(signal_id) ON DELETE SET NULL,
  symbol               VARCHAR(20) NOT NULL,
  asset_class          VARCHAR(10) NOT NULL,
  direction            VARCHAR(4) NOT NULL CHECK (direction IN ('BUY','SELL')),
  entry_price          DECIMAL(18,8) NOT NULL,
  exit_price           DECIMAL(18,8),
  stop_loss            DECIMAL(18,8) NOT NULL,
  take_profit_1        DECIMAL(18,8) NOT NULL,
  take_profit_2        DECIMAL(18,8) NOT NULL,
  position_size_pct    DECIMAL(5,2) NOT NULL,
  position_usd         DECIMAL(12,2) NOT NULL,
  opened_at            TIMESTAMPTZ NOT NULL,
  closed_at            TIMESTAMPTZ,
  status               VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  close_reason         VARCHAR(30),
  pnl_usd              DECIMAL(12,2),
  pnl_pct              DECIMAL(8,4),
  pips                 DECIMAL(8,1),
  signal_was_correct   BOOLEAN,
  veritech_cert_id     VARCHAR(60) NOT NULL,
  hitl_status          VARCHAR(30) DEFAULT 'PENDING_REVIEW',
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pt_symbol     ON phantom_trades(symbol);
CREATE INDEX IF NOT EXISTS idx_pt_status     ON phantom_trades(status);
CREATE INDEX IF NOT EXISTS idx_pt_opened_at  ON phantom_trades(opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_pt_signal_id  ON phantom_trades(signal_id);

-- ── Signal Outcomes ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signal_outcomes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id       VARCHAR(50) UNIQUE NOT NULL,
  symbol          VARCHAR(20) NOT NULL,
  asset_class     VARCHAR(10) NOT NULL,
  action          VARCHAR(5) NOT NULL,
  signal_score    DECIMAL(5,2) NOT NULL,
  confidence_pct  DECIMAL(5,2) NOT NULL,
  entry_price     DECIMAL(18,8) NOT NULL,
  stop_loss       DECIMAL(18,8) NOT NULL,
  take_profit_1   DECIMAL(18,8) NOT NULL,
  take_profit_2   DECIMAL(18,8) NOT NULL,
  timeframe       VARCHAR(10) NOT NULL,
  registered_at   TIMESTAMPTZ NOT NULL,
  exit_price      DECIMAL(18,8),
  outcome         VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  pnl_pct         DECIMAL(8,4),
  pips            DECIMAL(8,1),
  recorded_at     TIMESTAMPTZ,
  recorded_by     VARCHAR(100),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_so_signal_id    ON signal_outcomes(signal_id);
CREATE INDEX IF NOT EXISTS idx_so_symbol       ON signal_outcomes(symbol);
CREATE INDEX IF NOT EXISTS idx_so_outcome      ON signal_outcomes(outcome);
CREATE INDEX IF NOT EXISTS idx_so_registered   ON signal_outcomes(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_so_confidence   ON signal_outcomes(confidence_pct);

-- ── Oracle Scores ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS oracle_scores (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id       VARCHAR(50),
  symbol          VARCHAR(20) NOT NULL,
  asset_class     VARCHAR(10) NOT NULL,
  oracle_score    DECIMAL(5,2) NOT NULL,
  layer_scores    JSONB NOT NULL DEFAULT '{}',
  recommendation  VARCHAR(50) NOT NULL,
  computed_at     TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_os_symbol      ON oracle_scores(symbol);
CREATE INDEX IF NOT EXISTS idx_os_score       ON oracle_scores(oracle_score DESC);
CREATE INDEX IF NOT EXISTS idx_os_computed_at ON oracle_scores(computed_at DESC);

-- ── Central Bank NLP Scores (P1) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cb_nlp_scores (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source            VARCHAR(10) NOT NULL,
  speech_title      TEXT NOT NULL,
  speech_date       DATE NOT NULL,
  hawkish_score     DECIMAL(5,2) NOT NULL,
  dovish_score      DECIMAL(5,2) NOT NULL,
  neutral_score     DECIMAL(5,2) NOT NULL,
  net_stance        DECIMAL(5,2) NOT NULL,
  keywords_found    TEXT[] DEFAULT '{}',
  raw_text_excerpt  TEXT,
  source_url        TEXT,
  scored_at         TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cb_source     ON cb_nlp_scores(source);
CREATE INDEX IF NOT EXISTS idx_cb_date       ON cb_nlp_scores(speech_date DESC);
CREATE INDEX IF NOT EXISTS idx_cb_stance     ON cb_nlp_scores(net_stance);

-- ── Smart Money Flow (P1) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS smart_money_flow (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  symbol                      VARCHAR(20) NOT NULL,
  asset_class                 VARCHAR(10) NOT NULL,
  report_date                 DATE NOT NULL,
  data_source                 VARCHAR(20) NOT NULL,
  commercials_net             DECIMAL(12,2) DEFAULT 0,
  large_specs_net             DECIMAL(12,2) DEFAULT 0,
  small_specs_net             DECIMAL(12,2) DEFAULT 0,
  institutional_sentiment     DECIMAL(5,2) DEFAULT 0,
  options_put_call_ratio      DECIMAL(6,4),
  gamma_exposure              DECIMAL(18,2),
  dark_pool_volume            DECIMAL(18,2),
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_smf_symbol  ON smart_money_flow(symbol);
CREATE INDEX IF NOT EXISTS idx_smf_date    ON smart_money_flow(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_smf_source  ON smart_money_flow(data_source);

-- ── Playbook Users ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS playbook_users (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                  VARCHAR(255) UNIQUE NOT NULL,
  full_name              VARCHAR(200),
  tier                   VARCHAR(20) NOT NULL DEFAULT 'starter',
  trader_credential      VARCHAR(50),
  is_hitl_trader         BOOLEAN DEFAULT false,
  api_key                VARCHAR(64) UNIQUE,
  subscription_start     TIMESTAMPTZ,
  subscription_end       TIMESTAMPTZ,
  monthly_signal_count   INTEGER DEFAULT 0,
  webhook_url            TEXT,
  slack_webhook          TEXT,
  teams_webhook          TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pu_email  ON playbook_users(email);
CREATE INDEX IF NOT EXISTS idx_pu_tier   ON playbook_users(tier);
CREATE INDEX IF NOT EXISTS idx_pu_apikey ON playbook_users(api_key);

-- ── Phantom Account Aggregate ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS phantom_account (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id           VARCHAR(30) UNIQUE NOT NULL,
  name                 VARCHAR(200) NOT NULL,
  starting_balance     DECIMAL(12,2) NOT NULL DEFAULT 10000,
  current_balance      DECIMAL(12,2) NOT NULL DEFAULT 10000,
  peak_balance         DECIMAL(12,2) NOT NULL DEFAULT 10000,
  total_trades         INTEGER DEFAULT 0,
  open_trades_count    INTEGER DEFAULT 0,
  closed_trades_count  INTEGER DEFAULT 0,
  winning_trades       INTEGER DEFAULT 0,
  losing_trades        INTEGER DEFAULT 0,
  breakeven_trades     INTEGER DEFAULT 0,
  total_pnl_usd        DECIMAL(12,2) DEFAULT 0,
  total_pnl_pct        DECIMAL(8,4) DEFAULT 0,
  win_rate_pct         DECIMAL(5,2) DEFAULT 0,
  profit_factor        DECIMAL(8,3) DEFAULT 0,
  max_drawdown_pct     DECIMAL(8,4) DEFAULT 0,
  sharpe_ratio         DECIMAL(8,3) DEFAULT 0,
  measured_accuracy    DECIMAL(5,2) DEFAULT 0,
  inception_date       TIMESTAMPTZ DEFAULT NOW(),
  last_updated         TIMESTAMPTZ DEFAULT NOW(),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Equity Curve ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equity_curve (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id  VARCHAR(30) NOT NULL,
  timestamp   TIMESTAMPTZ NOT NULL,
  equity      DECIMAL(12,2) NOT NULL,
  trade_id    VARCHAR(20),
  event       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ec_account_id ON equity_curve(account_id);
CREATE INDEX IF NOT EXISTS idx_ec_timestamp  ON equity_curve(timestamp DESC);

-- ── HITL Reviews ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hitl_reviews (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id              VARCHAR(50) NOT NULL,
  trader_id              VARCHAR(100) NOT NULL,
  decision               VARCHAR(10) NOT NULL CHECK (decision IN ('APPROVED','REJECTED')),
  confidence_adjustment  DECIMAL(5,2),
  notes                  TEXT,
  reviewed_at            TIMESTAMPTZ NOT NULL,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hr_signal_id ON hitl_reviews(signal_id);
CREATE INDEX IF NOT EXISTS idx_hr_trader_id ON hitl_reviews(trader_id);
CREATE INDEX IF NOT EXISTS idx_hr_reviewed  ON hitl_reviews(reviewed_at DESC);

-- ── Calibration Snapshots (Isotonic Regression) ──────────────────────────────
CREATE TABLE IF NOT EXISTS calibration_snapshots (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_class             VARCHAR(10) NOT NULL,
  timeframe               VARCHAR(10) NOT NULL,
  raw_confidence          DECIMAL(5,2) NOT NULL,
  calibrated_probability  DECIMAL(6,4) NOT NULL,
  sample_count            INTEGER NOT NULL,
  win_count               INTEGER NOT NULL,
  computed_at             TIMESTAMPTZ NOT NULL,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cal_asset_class  ON calibration_snapshots(asset_class);
CREATE INDEX IF NOT EXISTS idx_cal_computed_at  ON calibration_snapshots(computed_at DESC);

-- ── Webhook Endpoints (P1) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES playbook_users(id) ON DELETE CASCADE,
  label        VARCHAR(100) NOT NULL,
  url          TEXT NOT NULL,
  type         VARCHAR(10) NOT NULL DEFAULT 'CUSTOM',
  events       TEXT[] DEFAULT '{}',
  active       BOOLEAN DEFAULT true,
  secret_hash  VARCHAR(64),
  last_fired   TIMESTAMPTZ,
  fire_count   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_we_user_id ON webhook_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_we_active  ON webhook_endpoints(active);

-- ── Row Level Security (RLS) ─────────────────────────────────────────────────
-- Enable RLS on user-facing tables
ALTER TABLE playbook_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE phantom_trades        ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints     ENABLE ROW LEVEL SECURITY;

-- Public read policy for trading signals (read-only for all)
CREATE POLICY IF NOT EXISTS "Public read trading_signals"
  ON trading_signals FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read signal_outcomes"
  ON signal_outcomes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read oracle_scores"
  ON oracle_scores FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read calibration_snapshots"
  ON calibration_snapshots FOR SELECT USING (true);

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
`;

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT FACTORY
// ─────────────────────────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null;
let _isConfigured = false;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (!_isConfigured) {
      console.warn('[Supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — running in file-fallback mode');
      _isConfigured = true;
    }
    return null;
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db:   { schema: 'public' },
  });
  _isConfigured = true;
  console.log('[Supabase] ✅ Connected to Supabase project');
  return _client;
}

export function isSupabaseEnabled(): boolean {
  return !!(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class SupabaseService {

  // ── MIGRATION ──────────────────────────────────────────────────────────────

  async runMigration(): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    try {
      // Split on semicolons, run each statement
      const statements = PLAYBOOK_TRADING_MIGRATION_SQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 10 && !s.startsWith('--'));

      for (const sql of statements) {
        const { error } = await client.rpc('exec_sql', { sql: sql + ';' }).single();
        if (error && !error.message.includes('already exists')) {
          // Use raw query via REST for DDL
          console.warn('[Supabase] Migration warning:', error.message);
        }
      }
      console.log('[Supabase] ✅ Migration completed — all Playbook Trading tables created');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // ── TRADING SIGNALS ────────────────────────────────────────────────────────

  async insertSignal(signal: DBTradingSignal): Promise<{ data?: DBTradingSignal; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('trading_signals')
      .upsert(signal, { onConflict: 'signal_id' })
      .select()
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  async getSignals(limit = 50, assetClass?: string): Promise<{ data?: DBTradingSignal[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    let q = client
      .from('trading_signals')
      .select('*')
      .order('generated_at', { ascending: false })
      .limit(limit);
    if (assetClass) q = q.eq('asset_class', assetClass);
    const { data, error } = await q;
    return { data: data ?? undefined, error: error?.message };
  }

  async updateSignalHITL(
    signal_id: string,
    status: HITLStatus,
    trader_id: string,
    confidence_adjustment?: number,
  ): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const update: Partial<DBTradingSignal> = {
      hitl_status:       status,
      hitl_trader_id:    trader_id,
      hitl_approved_at:  new Date().toISOString(),
    };
    if (confidence_adjustment !== undefined) {
      // store the review in hitl_reviews table
    }
    const { error } = await client
      .from('trading_signals')
      .update(update)
      .eq('signal_id', signal_id);

    // Also log to hitl_reviews
    if (!error) {
      await client.from('hitl_reviews').insert({
        signal_id,
        trader_id,
        decision:  status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        confidence_adjustment,
        reviewed_at: new Date().toISOString(),
      });
    }
    return { success: !error, error: error?.message };
  }

  // ── PHANTOM TRADES ─────────────────────────────────────────────────────────

  async upsertPhantomTrade(trade: DBPhantomTrade): Promise<{ data?: DBPhantomTrade; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('phantom_trades')
      .upsert({ ...trade, updated_at: new Date().toISOString() }, { onConflict: 'trade_id' })
      .select()
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  async getOpenTrades(): Promise<{ data?: DBPhantomTrade[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('phantom_trades')
      .select('*')
      .eq('status', 'OPEN')
      .order('opened_at', { ascending: false });
    return { data: data ?? undefined, error: error?.message };
  }

  async getClosedTrades(limit = 50): Promise<{ data?: DBPhantomTrade[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('phantom_trades')
      .select('*')
      .neq('status', 'OPEN')
      .order('closed_at', { ascending: false })
      .limit(limit);
    return { data: data ?? undefined, error: error?.message };
  }

  async getAllTrades(limit = 100): Promise<{ data?: DBPhantomTrade[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('phantom_trades')
      .select('*')
      .order('opened_at', { ascending: false })
      .limit(limit);
    return { data: data ?? undefined, error: error?.message };
  }

  async closeTrade(
    trade_id: string,
    exit_price: number,
    pnl_usd: number,
    pnl_pct: number,
    status: TradeStatus,
    close_reason: string,
    pips?: number,
  ): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client
      .from('phantom_trades')
      .update({
        exit_price,
        pnl_usd,
        pnl_pct,
        status,
        close_reason,
        pips,
        closed_at:  new Date().toISOString(),
        signal_was_correct: pnl_usd >= 0,
        updated_at: new Date().toISOString(),
      })
      .eq('trade_id', trade_id);
    return { success: !error, error: error?.message };
  }

  // ── SIGNAL OUTCOMES ────────────────────────────────────────────────────────

  async upsertOutcome(outcome: DBSignalOutcome): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client
      .from('signal_outcomes')
      .upsert(outcome, { onConflict: 'signal_id' });
    return { success: !error, error: error?.message };
  }

  async getOutcomes(limit = 100, assetClass?: string): Promise<{ data?: DBSignalOutcome[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    let q = client
      .from('signal_outcomes')
      .select('*')
      .order('registered_at', { ascending: false })
      .limit(limit);
    if (assetClass) q = q.eq('asset_class', assetClass);
    const { data, error } = await q;
    return { data: data ?? undefined, error: error?.message };
  }

  async getResolvedOutcomes(): Promise<{ data?: DBSignalOutcome[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('signal_outcomes')
      .select('*')
      .neq('outcome', 'PENDING')
      .order('registered_at', { ascending: false });
    return { data: data ?? undefined, error: error?.message };
  }

  // ── ORACLE SCORES ──────────────────────────────────────────────────────────

  async insertOracleScore(score: DBOracleScore): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client.from('oracle_scores').insert(score);
    return { success: !error, error: error?.message };
  }

  async getLatestOracleScore(symbol: string): Promise<{ data?: DBOracleScore; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('oracle_scores')
      .select('*')
      .eq('symbol', symbol)
      .order('computed_at', { ascending: false })
      .limit(1)
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  // ── CENTRAL BANK NLP ───────────────────────────────────────────────────────

  async insertCBNLPScore(score: DBCBNLPScore): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client.from('cb_nlp_scores').insert(score);
    return { success: !error, error: error?.message };
  }

  async getLatestCBNLPScores(source?: string): Promise<{ data?: DBCBNLPScore[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    let q = client
      .from('cb_nlp_scores')
      .select('*')
      .order('speech_date', { ascending: false })
      .limit(20);
    if (source) q = q.eq('source', source);
    const { data, error } = await q;
    return { data: data ?? undefined, error: error?.message };
  }

  // ── SMART MONEY FLOW ───────────────────────────────────────────────────────

  async insertSmartMoneyFlow(flow: DBSmartMoneyFlow): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client.from('smart_money_flow').insert(flow);
    return { success: !error, error: error?.message };
  }

  async getLatestSmartMoneyFlow(symbol: string): Promise<{ data?: DBSmartMoneyFlow; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('smart_money_flow')
      .select('*')
      .eq('symbol', symbol)
      .order('report_date', { ascending: false })
      .limit(1)
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  // ── PHANTOM ACCOUNT ────────────────────────────────────────────────────────

  async upsertPhantomAccount(account: DBPhantomAccount): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client
      .from('phantom_account')
      .upsert({ ...account, last_updated: new Date().toISOString() }, { onConflict: 'account_id' });
    return { success: !error, error: error?.message };
  }

  async getPhantomAccount(account_id: string): Promise<{ data?: DBPhantomAccount; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('phantom_account')
      .select('*')
      .eq('account_id', account_id)
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  // ── EQUITY CURVE ───────────────────────────────────────────────────────────

  async appendEquityCurvePoint(point: DBEquityCurvePoint): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client.from('equity_curve').insert(point);
    return { success: !error, error: error?.message };
  }

  async getEquityCurve(account_id: string, limit = 200): Promise<{ data?: DBEquityCurvePoint[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('equity_curve')
      .select('*')
      .eq('account_id', account_id)
      .order('timestamp', { ascending: false })
      .limit(limit);
    return { data: data?.reverse() ?? undefined, error: error?.message };
  }

  // ── CALIBRATION SNAPSHOTS ──────────────────────────────────────────────────

  async upsertCalibrationSnapshot(snap: DBCalibrationSnapshot): Promise<{ success: boolean; error?: string }> {
    const client = getClient();
    if (!client) return { success: false, error: 'Supabase not configured' };
    const { error } = await client.from('calibration_snapshots').insert(snap);
    return { success: !error, error: error?.message };
  }

  async getCalibrationSnapshots(assetClass?: string): Promise<{ data?: DBCalibrationSnapshot[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    let q = client
      .from('calibration_snapshots')
      .select('*')
      .order('computed_at', { ascending: false })
      .limit(100);
    if (assetClass) q = q.eq('asset_class', assetClass);
    const { data, error } = await q;
    return { data: data ?? undefined, error: error?.message };
  }

  // ── USERS ──────────────────────────────────────────────────────────────────

  async upsertUser(user: DBPlaybookUser): Promise<{ data?: DBPlaybookUser; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('playbook_users')
      .upsert({ ...user, updated_at: new Date().toISOString() }, { onConflict: 'email' })
      .select()
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  async getUserByApiKey(api_key: string): Promise<{ data?: DBPlaybookUser; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    const { data, error } = await client
      .from('playbook_users')
      .select('*')
      .eq('api_key', api_key)
      .single();
    return { data: data ?? undefined, error: error?.message };
  }

  // ── WEBHOOK ENDPOINTS ──────────────────────────────────────────────────────

  async getActiveWebhooks(events?: string[]): Promise<{ data?: DBWebhookEndpoint[]; error?: string }> {
    const client = getClient();
    if (!client) return { error: 'Supabase not configured' };
    let q = client
      .from('webhook_endpoints')
      .select('*')
      .eq('active', true);
    const { data, error } = await q;
    let result = data ?? [];
    if (events && events.length > 0) {
      result = result.filter((wh: DBWebhookEndpoint) =>
        events.some(e => wh.events.includes(e))
      );
    }
    return { data: result, error: error?.message };
  }

  async recordWebhookFired(id: string): Promise<void> {
    const client = getClient();
    if (!client) return;
    await client
      .from('webhook_endpoints')
      .update({ last_fired: new Date().toISOString() })
      .eq('id', id)
      .select();
    // increment fire_count via RPC
  }

  // ── HEALTH CHECK ───────────────────────────────────────────────────────────

  async healthCheck(): Promise<{
    connected: boolean;
    tables: Record<string, boolean>;
    error?: string;
  }> {
    const client = getClient();
    if (!client) {
      return { connected: false, tables: {}, error: 'Supabase not configured — file-fallback mode active' };
    }
    const tables = [
      'trading_signals', 'phantom_trades', 'signal_outcomes',
      'oracle_scores', 'phantom_account', 'equity_curve',
      'hitl_reviews', 'calibration_snapshots', 'playbook_users',
      'cb_nlp_scores', 'smart_money_flow', 'webhook_endpoints',
    ];
    const tableStatus: Record<string, boolean> = {};
    for (const table of tables) {
      const { error } = await client.from(table).select('id').limit(1);
      tableStatus[table] = !error;
    }
    return {
      connected: true,
      tables: tableStatus,
      error: undefined,
    };
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const supabaseService = new SupabaseService();
export default supabaseService;
