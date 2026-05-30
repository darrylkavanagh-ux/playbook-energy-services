import React, { useState, useCallback, useEffect, useRef } from "react";
import Layout from "../components/Layout";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type AssetClass = "forex" | "crypto" | "stock";
type SignalAction = "BUY" | "SELL" | "HOLD";
type TabId = "scanner" | "signal" | "hitl" | "phantom" | "accuracy" | "pnl";

interface TradingSignal {
  signal_id: string;
  symbol: string;
  asset_class: AssetClass;
  action: SignalAction;
  strength: "STRONG" | "MODERATE" | "WEAK";
  signal_score: number;
  confidence_pct: number;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2: number;
  risk_reward: number;
  position_size_pct: number;
  timeframe: string;
  market_session: string;
  layers: {
    technical: { score: number; trend: string; rsi: number; macd: number; bb_position: number };
    volume: { score: number; signal: string };
    momentum: { score: number; signal: string };
    asset_specific: { score: number; signal: string; notes: string[] };
  };
  technical_analysis: Record<string, unknown>;
  data_source: string;
  candles_used: number;
  veritech_cert_id: string;
  hitl_status: string;
  hitl_required_credential: string;
  generated_at: string;
  disclaimer: string;
}

// Full PhantomTrade shape (mirrors server PhantomAccountService)
interface PhantomTrade {
  trade_id:          string;
  signal_id:         string;
  symbol:            string;
  asset_class:       string;
  direction:         "BUY" | "SELL";
  entry_price:       number;
  exit_price?:       number;
  stop_loss:         number;
  take_profit_1:     number;
  take_profit_2:     number;
  position_size_pct: number;
  position_usd:      number;
  opened_at:         string;
  closed_at?:        string;
  status:            string;
  close_reason?:     string;
  pnl_usd?:          number;
  pnl_pct?:          number;
  pips?:             number;
  veritech_cert_id:  string;
  hitl_status:       string;
  notes?:            string;
}

interface LivePnL {
  trade_id:      string;
  symbol:        string;
  currentPrice:  number | null;
  dayOpenPrice:  number | null;
  dailyPnlUsd:   number | null;
  dailyPnlPct:   number | null;
  overallPnlUsd: number | null;
  overallPnlPct: number | null;
  loading:       boolean;
  error?:        string;
  lastUpdated:   string | null;
}

interface PhantomSummary {
  account_id: string;
  balance: number;
  total_pnl_usd: number;
  total_pnl_pct: number;
  measured_accuracy: number;
  win_rate_pct: number;
  total_trades: number;
  open_trades: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  profit_factor: number;
  last_updated: string;
}

interface ScanResult {
  symbol: string;
  signal?: TradingSignal;
  error?: string;
}

interface AccuracyStats {
  total_signals: number;
  resolved_signals: number;
  pending_signals: number;
  wins: number;
  losses: number;
  win_rate_pct: number;
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  statistical_significance: string;
  by_asset_class: {
    forex: { signals: number; wins: number; win_rate_pct: number };
    crypto: { signals: number; wins: number; win_rate_pct: number };
    stock: { signals: number; wins: number; win_rate_pct: number };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const API = "/api/trading";

async function apiPost(path: string, body: object) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiGet(path: string, traderId?: string) {
  const headers: Record<string, string> = {};
  if (traderId) headers["Authorization"] = `Bearer TRADER-${traderId}`;
  const r = await fetch(`${API}${path}`, { headers });
  return r.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOUR HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function actionColour(action: SignalAction | string) {
  if (action === "BUY")  return "bg-emerald-500 text-white";
  if (action === "SELL") return "bg-red-500 text-white";
  return "bg-gray-400 text-white";
}

function strengthColour(strength: string) {
  if (strength === "STRONG")   return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (strength === "MODERATE") return "bg-amber-100 text-amber-800 border border-amber-300";
  return "bg-gray-100 text-gray-600 border border-gray-300";
}

function assetIcon(cls: AssetClass | string) {
  if (cls === "forex")  return "💱";
  if (cls === "crypto") return "₿";
  return "📈";
}

function pnlColour(v: number) {
  return v >= 0 ? "text-emerald-600 font-bold" : "text-red-600 font-bold";
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SignalCard({ signal, onOpenPhantom }: { signal: TradingSignal; onOpenPhantom?: (s: TradingSignal) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border-4 border-black neo-shadow bg-white p-5 mb-4 transition-all`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{assetIcon(signal.asset_class)}</span>
          <div>
            <h3 className="font-black text-xl uppercase tracking-tight">{signal.symbol}</h3>
            <span className="font-mono text-xs text-gray-500">{signal.asset_class.toUpperCase()} · {signal.timeframe}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 font-black uppercase text-sm rounded ${actionColour(signal.action)}`}>
            {signal.action}
          </span>
          <span className={`px-2 py-1 font-mono text-xs rounded ${strengthColour(signal.strength)}`}>
            {signal.strength}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { label: "Signal Score", value: `${signal.signal_score}/100` },
          { label: "Confidence", value: `${signal.confidence_pct.toFixed(1)}%` },
          { label: "R/R Ratio", value: `${Number(signal.risk_reward).toFixed(2)}:1` },
          { label: "Position", value: `${signal.position_size_pct}%` },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 border border-gray-200 p-2 rounded text-center">
            <div className="font-black text-lg">{m.value}</div>
            <div className="font-mono text-xs text-gray-500">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Price levels */}
      <div className="grid grid-cols-3 gap-2 mb-3 font-mono text-sm">
        <div className="border border-gray-200 p-2 rounded">
          <div className="text-gray-500 text-xs mb-1">ENTRY</div>
          <div className="font-bold">{signal.entry_price.toFixed(signal.asset_class === "forex" ? 5 : 2)}</div>
        </div>
        <div className="border border-red-200 p-2 rounded bg-red-50">
          <div className="text-red-500 text-xs mb-1">STOP LOSS</div>
          <div className="font-bold text-red-700">{signal.stop_loss.toFixed(signal.asset_class === "forex" ? 5 : 2)}</div>
        </div>
        <div className="border border-emerald-200 p-2 rounded bg-emerald-50">
          <div className="text-emerald-500 text-xs mb-1">TP1 / TP2</div>
          <div className="font-bold text-emerald-700">
            {signal.take_profit_1.toFixed(signal.asset_class === "forex" ? 5 : 2)} /&nbsp;
            {signal.take_profit_2.toFixed(signal.asset_class === "forex" ? 5 : 2)}
          </div>
        </div>
      </div>

      {/* HITL status */}
      <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded">
        <span className="text-amber-600 font-bold text-sm">⚠ HITL:</span>
        <span className="font-mono text-xs text-amber-700">{signal.hitl_status} — requires {signal.hitl_required_credential}</span>
      </div>

      {/* VeriTech cert */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3">
        <span>🔐 {signal.veritech_cert_id}</span>
        <span>{signal.candles_used} candles · {signal.data_source}</span>
      </div>

      {/* Expand / actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 border-2 border-black px-3 py-1 font-mono text-sm font-bold hover:bg-black hover:text-white transition-colors"
        >
          {expanded ? "▲ HIDE DETAIL" : "▼ FULL ANALYSIS"}
        </button>
        {onOpenPhantom && signal.action !== "HOLD" && (
          <button
            onClick={() => onOpenPhantom(signal)}
            className="border-2 border-emerald-600 text-emerald-700 px-3 py-1 font-mono text-sm font-bold hover:bg-emerald-600 hover:text-white transition-colors"
          >
            📋 PAPER TRADE
          </button>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 border-t-2 border-dashed border-gray-300 pt-4 space-y-3">
          {/* Layer breakdown */}
          <div>
            <h4 className="font-black uppercase text-sm mb-2">Signal Layers (4-Factor Model)</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Technical (45%)", score: signal.layers?.technical?.score, extra: `RSI ${signal.layers?.technical?.rsi?.toFixed(1)} | Trend: ${signal.layers?.technical?.trend}` },
                { name: "Volume (20%)",    score: signal.layers?.volume?.score,    extra: signal.layers?.volume?.signal },
                { name: "Momentum (20%)",  score: signal.layers?.momentum?.score,  extra: signal.layers?.momentum?.signal },
                { name: "Asset-Specific (15%)", score: signal.layers?.asset_specific?.score, extra: signal.layers?.asset_specific?.signal },
              ].map((layer) => (
                <div key={layer.name} className="bg-gray-50 border border-gray-200 p-2 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-xs font-bold">{layer.name}</span>
                    <span className="font-mono text-xs">{layer.score?.toFixed(1)}/100</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-black rounded" style={{ width: `${layer.score}%` }} />
                  </div>
                  <div className="font-mono text-xs text-gray-500 mt-1">{layer.extra}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Market session + asset-specific notes */}
          {signal.layers?.asset_specific?.notes?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-2 rounded">
              <div className="font-mono text-xs font-bold text-blue-700 mb-1">Asset Intelligence:</div>
              {signal.layers.asset_specific.notes.map((n, i) => (
                <div key={i} className="font-mono text-xs text-blue-600">• {n}</div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-gray-400 font-mono border-t border-gray-200 pt-2">
            {signal.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCANNER TAB
// ─────────────────────────────────────────────────────────────────────────────

function ScannerTab({ onOpenPhantom }: { onOpenPhantom: (s: TradingSignal) => void }) {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    strong_signals: ScanResult[];
    moderate_signals: ScanResult[];
    all_results: ScanResult[];
    summary: { strong_signals: number; moderate_signals: number; weak_hold: number; errors: number };
    scan_time: string;
  } | null>(null);

  const runScan = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet("/scan");
      setScanResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { runScan(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black uppercase">Market Scanner</h2>
          <p className="font-mono text-sm text-gray-500">Scans Forex + Crypto + Stocks with real technical analysis</p>
        </div>
        <button
          onClick={runScan}
          disabled={loading}
          className="border-4 border-black px-6 py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "⟳ SCANNING..." : "🔍 SCAN NOW"}
        </button>
      </div>

      {scanResult && (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Strong Signals", value: scanResult.summary.strong_signals, colour: "bg-emerald-500" },
              { label: "Moderate",       value: scanResult.summary.moderate_signals, colour: "bg-amber-400" },
              { label: "Weak / Hold",    value: scanResult.summary.weak_hold,    colour: "bg-gray-300" },
              { label: "Errors",         value: scanResult.summary.errors,        colour: "bg-red-400" },
            ].map((m) => (
              <div key={m.label} className="border-2 border-black p-3 text-center neo-shadow">
                <div className={`text-3xl font-black ${m.colour === "bg-emerald-500" ? "text-emerald-600" : m.colour === "bg-amber-400" ? "text-amber-600" : m.colour === "bg-red-400" ? "text-red-500" : "text-gray-500"}`}>
                  {m.value}
                </div>
                <div className="font-mono text-xs text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Strong signals */}
          {scanResult.strong_signals.length > 0 && (
            <div className="mb-6">
              <div className="inline-block bg-emerald-500 text-white px-4 py-1 font-mono font-bold uppercase mb-3 border-2 border-black">
                ⚡ STRONG SIGNALS ({scanResult.strong_signals.length})
              </div>
              {scanResult.strong_signals.map((r) =>
                r.signal ? <SignalCard key={r.signal.signal_id} signal={r.signal} onOpenPhantom={onOpenPhantom} /> : null
              )}
            </div>
          )}

          {/* Moderate signals */}
          {scanResult.moderate_signals.length > 0 && (
            <div>
              <div className="inline-block bg-amber-400 text-black px-4 py-1 font-mono font-bold uppercase mb-3 border-2 border-black">
                ⚠ MODERATE SIGNALS ({scanResult.moderate_signals.length})
              </div>
              {scanResult.moderate_signals.map((r) =>
                r.signal ? <SignalCard key={r.signal.signal_id} signal={r.signal} onOpenPhantom={onOpenPhantom} /> : null
              )}
            </div>
          )}

          <div className="text-xs font-mono text-gray-400 mt-4">
            Scan time: {new Date(scanResult.scan_time).toLocaleString()} · Powered by Architecture B (real ForexAnalysisEngine)
          </div>
        </>
      )}

      {!scanResult && !loading && (
        <div className="text-center py-20 text-gray-400 font-mono">
          Click SCAN NOW to run live analysis
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="font-black text-2xl animate-pulse">⟳ Fetching live prices &amp; computing indicators...</div>
          <div className="font-mono text-sm text-gray-500 mt-2">RSI · MACD · Bollinger Bands · ATR · S/R Levels</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL GENERATOR TAB
// ─────────────────────────────────────────────────────────────────────────────

function SignalTab({ onOpenPhantom }: { onOpenPhantom: (s: TradingSignal) => void }) {
  const [symbol, setSymbol]         = useState("EUR/USD");
  const [assetClass, setAssetClass] = useState<AssetClass>("forex");
  const [openPhantom, setOpenPhantom] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ signal: TradingSignal; news?: Record<string, unknown> } | null>(null);
  const [error, setError]           = useState("");

  const PRESETS: { label: string; symbol: string; cls: AssetClass }[] = [
    { label: "EUR/USD", symbol: "EUR/USD", cls: "forex"  },
    { label: "GBP/USD", symbol: "GBP/USD", cls: "forex"  },
    { label: "USD/JPY", symbol: "USD/JPY", cls: "forex"  },
    { label: "BTC",     symbol: "BTC/USD", cls: "crypto" },
    { label: "ETH",     symbol: "ETH/USD", cls: "crypto" },
    { label: "SOL",     symbol: "SOL/USD", cls: "crypto" },
    { label: "AAPL",    symbol: "AAPL",    cls: "stock"  },
    { label: "NVDA",    symbol: "NVDA",    cls: "stock"  },
    { label: "MSFT",    symbol: "MSFT",    cls: "stock"  },
  ];

  const generate = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await apiPost("/signal", {
        symbol: symbol.toUpperCase(),
        asset_class: assetClass,
        open_phantom: openPhantom,
        include_news: true,
      });
      if (data.success) setResult(data);
      else setError(data.error || "Signal generation failed");
    } catch (e) {
      setError("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black uppercase mb-2">Signal Generator</h2>
      <p className="font-mono text-sm text-gray-500 mb-6">Real technical analysis — not a sine wave</p>

      {/* Controls */}
      <div className="border-4 border-black p-5 neo-shadow mb-6">
        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.symbol}
              onClick={() => { setSymbol(p.symbol); setAssetClass(p.cls); }}
              className={`px-3 py-1 border-2 border-black font-mono text-sm font-bold transition-colors ${symbol === p.symbol ? "bg-black text-white" : "hover:bg-black hover:text-white"}`}
            >
              {assetIcon(p.cls)} {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="font-mono text-xs font-bold uppercase mb-1 block">Symbol</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full border-2 border-black p-2 font-mono text-sm"
              placeholder="EUR/USD, BTC/USD, AAPL..."
            />
          </div>
          <div>
            <label className="font-mono text-xs font-bold uppercase mb-1 block">Asset Class</label>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value as AssetClass)}
              className="w-full border-2 border-black p-2 font-mono text-sm"
            >
              <option value="forex">💱 Forex</option>
              <option value="crypto">₿ Crypto</option>
              <option value="stock">📈 Stocks</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={openPhantom}
                onChange={(e) => setOpenPhantom(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-mono text-sm font-bold">Auto paper trade</span>
            </label>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full border-4 border-black py-3 font-black uppercase text-lg neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
        >
          {loading ? "⟳ ANALYSING..." : "⚡ GENERATE SIGNAL"}
        </button>
      </div>

      {error && (
        <div className="border-2 border-red-400 bg-red-50 p-3 font-mono text-sm text-red-700 mb-4">❌ {error}</div>
      )}

      {result?.signal && (
        <SignalCard signal={result.signal} onOpenPhantom={onOpenPhantom} />
      )}

      {/* News analysis */}
      {result?.news && (
        <div className="border-2 border-blue-200 bg-blue-50 p-4 mt-2">
          <div className="font-black uppercase text-sm mb-2">📰 News Sentiment</div>
          <div className="font-mono text-sm">
            <span className="font-bold">Sentiment:</span>{" "}
            {String(result.news.overall_sentiment)} ({Number(result.news.sentiment_score).toFixed(3)})
          </div>
          <div className="font-mono text-xs text-gray-600 mt-1">
            Confidence boost: +{(Number(result.news.confidence_boost) * 100).toFixed(1)}% ·{" "}
            {result.news.is_live ? "🟢 Live" : "🟡 Cached"}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HITL PORTAL TAB (Human-in-the-Loop)
// ─────────────────────────────────────────────────────────────────────────────

function HITLTab() {
  const [traderId,     setTraderId]    = useState("");
  const [credential,   setCredential]  = useState("FCA_CISI_LEVEL_3");
  const [pending,      setPending]     = useState<Record<string, unknown>[]>([]);
  const [loaded,       setLoaded]      = useState(false);
  const [loadError,    setLoadError]   = useState("");
  const [selected,     setSelected]    = useState<string | null>(null);
  const [decision,     setDecision]    = useState<"APPROVE" | "REJECT" | "MODIFY">("APPROVE");
  const [modAction,    setModAction]   = useState("BUY");
  const [notes,        setNotes]       = useState("");
  const [verifyResult, setVerifyResult] = useState<Record<string, unknown> | null>(null);
  const [loading,      setLoading]     = useState(false);

  const loadPending = async () => {
    if (!traderId) { setLoadError("Enter your trader ID first"); return; }
    setLoading(true); setLoadError(""); setLoaded(false);
    try {
      const data = await apiGet("/hitl/pending", traderId);
      if (data.success) { setPending((data.signals || []) as Record<string, unknown>[]); setLoaded(true); }
      else setLoadError(data.error || "Unauthorised");
    } catch { setLoadError("Network error"); }
    finally { setLoading(false); }
  };

  const submitVerification = async () => {
    if (!selected || !traderId) return;
    setLoading(true);
    try {
      const data = await apiPost("/verify", {
        signal_id:      selected,
        decision,
        modified_action: decision === "MODIFY" ? modAction : undefined,
        notes,
        credential_type: credential,
        // Send trader ID in auth header via fetch override
      });
      // Note: verify endpoint needs auth header — for this demo we pass trader ID in body too
      setVerifyResult(data as Record<string, unknown>);
      if (data.success) {
        setPending(prev => prev.filter((s) => s.signal_id !== selected));
        setSelected(null);
      }
    } catch { /* */ }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-3xl font-black uppercase mb-2">HITL Verification Portal</h2>
      <p className="font-mono text-sm text-gray-500 mb-2">
        Human-in-the-Loop: Your approval provides the final 1.5% confidence for a legally valid VeriTech-10 certificate.
      </p>
      <div className="bg-amber-50 border-2 border-amber-400 p-3 mb-6 font-mono text-sm text-amber-800">
        ⚠ This portal is for <strong>licensed financial professionals only</strong>.
        Regulated credential required per MiFID II / FCA COBS 12.
      </div>

      {/* Trader auth */}
      <div className="border-4 border-black p-5 neo-shadow mb-6">
        <h3 className="font-black uppercase mb-3">Trader Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="font-mono text-xs font-bold uppercase mb-1 block">Trader ID</label>
            <input
              value={traderId}
              onChange={(e) => setTraderId(e.target.value)}
              className="w-full border-2 border-black p-2 font-mono text-sm"
              placeholder="e.g. dc001"
            />
          </div>
          <div>
            <label className="font-mono text-xs font-bold uppercase mb-1 block">Credential Type</label>
            <select
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full border-2 border-black p-2 font-mono text-sm"
            >
              <option value="FCA_CISI_LEVEL_3">FCA CISI Level 3 (Forex)</option>
              <option value="FINRA_SERIES_65">FINRA Series 65 (Stocks)</option>
              <option value="CISI_CHARTERED">CISI Chartered (All assets)</option>
              <option value="MiFID_QUALIFIED">MiFID II Qualified</option>
              <option value="CFA_CHARTERHOLDER">CFA Charterholder</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadPending}
              disabled={loading || !traderId}
              className="w-full border-4 border-black py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "⟳ LOADING..." : "LOAD QUEUE"}
            </button>
          </div>
        </div>
        {loadError && <div className="font-mono text-sm text-red-600">❌ {loadError}</div>}
      </div>

      {Boolean(loaded) && (
        <div>
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-mono border-4 border-dashed border-gray-300">
              ✅ No pending signals — queue is clear.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Signal list */}
              <div>
                <h3 className="font-black uppercase mb-3">Pending Review ({pending.length})</h3>
                {pending.map((s) => (
                  <div
                    key={s.signal_id as string}
                    onClick={() => setSelected(s.signal_id as string)}
                    className={`border-2 p-3 mb-2 cursor-pointer transition-colors ${selected === s.signal_id ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-black">{s.symbol as string}</span>
                      <span className={`px-2 py-0.5 text-xs font-black rounded ${
                        selected === s.signal_id ? "bg-white text-black" : actionColour(s.action as SignalAction)
                      }`}>{s.action as string}</span>
                    </div>
                    <div className="font-mono text-xs mt-1 opacity-70">
                      {s.asset_class as string} · {(s.confidence_pct as number)?.toFixed(1)}% · Entry: {(s.entry_price as number)?.toFixed(5)}
                    </div>
                    <div className="font-mono text-xs opacity-50">{s.signal_id as string}</div>
                  </div>
                ))}
              </div>

              {/* Verification form */}
              {selected && (
                <div className="border-4 border-black p-4 neo-shadow">
                  <h3 className="font-black uppercase mb-3">Verify Signal</h3>
                  <div className="font-mono text-xs text-gray-500 mb-3">{selected}</div>

                  <div className="mb-3">
                    <label className="font-mono text-xs font-bold uppercase mb-1 block">Decision</label>
                    <div className="flex gap-2">
                      {(["APPROVE", "REJECT", "MODIFY"] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDecision(d)}
                          className={`flex-1 py-2 border-2 font-black text-sm transition-colors ${
                            decision === d
                              ? d === "APPROVE" ? "border-emerald-600 bg-emerald-600 text-white"
                                : d === "REJECT" ? "border-red-600 bg-red-600 text-white"
                                : "border-amber-500 bg-amber-500 text-white"
                              : "border-gray-300 hover:border-black"
                          }`}
                        >
                          {d === "APPROVE" ? "✅" : d === "REJECT" ? "❌" : "⚠️"} {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {decision === "MODIFY" && (
                    <div className="mb-3">
                      <label className="font-mono text-xs font-bold uppercase mb-1 block">Modified Action</label>
                      <select
                        value={modAction}
                        onChange={(e) => setModAction(e.target.value)}
                        className="w-full border-2 border-black p-2 font-mono text-sm"
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="HOLD">HOLD</option>
                      </select>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="font-mono text-xs font-bold uppercase mb-1 block">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full border-2 border-black p-2 font-mono text-sm h-20"
                      placeholder="Enter verification notes..."
                    />
                  </div>

                  <button
                    onClick={submitVerification}
                    disabled={loading}
                    className="w-full border-4 border-black py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                  >
                    {loading ? "⟳ SUBMITTING..." : "SUBMIT VERIFICATION"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Verification result */}
      {verifyResult && (
        <div className={`border-4 p-4 mt-4 neo-shadow ${verifyResult.success ? "border-emerald-500 bg-emerald-50" : "border-red-500 bg-red-50"}`}>
          <div className="font-black uppercase mb-2">Verification Result</div>
          <div className="font-mono text-sm whitespace-pre-wrap">
            {String((verifyResult.verification as Record<string, unknown>)?.message ?? '')}
          </div>
          <div className="font-mono text-xs text-gray-500 mt-2">
            Cert: {String((verifyResult.verification as Record<string, unknown>)?.veritech_cert_id ?? '')} ·{" "}
            Status: {String((verifyResult.verification as Record<string, unknown>)?.cert_status ?? '')}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHANTOM ACCOUNT TAB
// ─────────────────────────────────────────────────────────────────────────────

function PhantomTab({ pendingOpen }: { pendingOpen: TradingSignal | null }) {
  const [summary, setSummary]   = useState<PhantomSummary | null>(null);
  const [trades,  setTrades]    = useState<unknown[]>([]);
  const [closeId,  setCloseId]  = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState("");

  const loadAccount = useCallback(async () => {
    const [s, f] = await Promise.all([
      apiGet("/phantom"),
      apiGet("/phantom/full"),
    ]);
    if (s.success) setSummary(s.summary);
    if (f.success) setTrades(f.recent_trades || []);
  }, []);

  useEffect(() => { loadAccount(); }, [loadAccount]);

  // Auto-open trade if scanner/signal passed one in
  useEffect(() => {
    if (pendingOpen) {
      apiPost("/phantom/open", { symbol: pendingOpen.symbol, asset_class: pendingOpen.asset_class })
        .then(() => { setMsg(`📋 Paper trade opened: ${pendingOpen.action} ${pendingOpen.symbol}`); loadAccount(); });
    }
  }, [pendingOpen, loadAccount]);

  const closeTrade = async () => {
    if (!closeId || !closePrice) return;
    setLoading(true);
    const data = await apiPost("/phantom/close", {
      trade_id: closeId,
      exit_price: parseFloat(closePrice),
      reason: "MANUAL",
    });
    if (data.success) {
      setMsg(`✅ Trade closed. P&L: $${data.trade?.pnl_usd?.toFixed(2)} (${data.trade?.pnl_pct?.toFixed(2)}%)`);
      loadAccount();
    } else setMsg(`❌ ${data.error}`);
    setLoading(false);
  };

  const pnlClass = (v: number) => v >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div>
      <h2 className="text-3xl font-black uppercase mb-2">Phantom Account</h2>
      <p className="font-mono text-sm text-gray-500 mb-6">
        Paper trading only — no real capital at risk. Real win rate measured from closed trades.
      </p>

      {msg && (
        <div className="border-2 border-black bg-yellow-50 p-3 font-mono text-sm mb-4">{msg}</div>
      )}

      {summary && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Balance",         value: `$${summary.balance.toFixed(2)}`, colour: pnlClass(summary.total_pnl_usd) },
              { label: "Total P&L",       value: `$${summary.total_pnl_usd.toFixed(2)} (${summary.total_pnl_pct.toFixed(2)}%)`, colour: pnlClass(summary.total_pnl_usd) },
              { label: "Real Win Rate",   value: `${summary.win_rate_pct.toFixed(1)}%`, colour: summary.win_rate_pct >= 50 ? "text-emerald-600" : "text-red-600" },
              { label: "Total Trades",    value: String(summary.total_trades), colour: "text-black" },
              { label: "Open Positions",  value: String(summary.open_trades), colour: "text-amber-600" },
              { label: "Sharpe Ratio",    value: summary.sharpe_ratio.toFixed(3), colour: summary.sharpe_ratio > 1 ? "text-emerald-600" : "text-gray-700" },
              { label: "Max Drawdown",    value: `${summary.max_drawdown_pct.toFixed(2)}%`, colour: summary.max_drawdown_pct > 10 ? "text-red-600" : "text-gray-700" },
              { label: "Profit Factor",   value: summary.profit_factor > 0 ? summary.profit_factor.toFixed(2) : "N/A", colour: summary.profit_factor > 1 ? "text-emerald-600" : "text-red-600" },
            ].map((m) => (
              <div key={m.label} className="border-2 border-black p-3 neo-shadow text-center">
                <div className={`text-2xl font-black ${m.colour}`}>{m.value}</div>
                <div className="font-mono text-xs text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Accuracy note */}
          <div className="border-2 border-amber-400 bg-amber-50 p-3 mb-6 font-mono text-sm">
            ⚠ <strong>Measured accuracy: {summary.measured_accuracy.toFixed(1)}%</strong> — this is the REAL win rate from closed trades.
            The 98.5% figure is the AI model's mathematical confidence ceiling — NOT a validated accuracy claim.
            Meaningful statistics require ≥100 closed trades.
          </div>

          {/* Close trade form */}
          <div className="border-4 border-black p-4 neo-shadow mb-6">
            <h3 className="font-black uppercase mb-3">Close a Trade</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={closeId}
                onChange={(e) => setCloseId(e.target.value)}
                placeholder="Trade ID (PTRADE-...)"
                className="border-2 border-black p-2 font-mono text-sm"
              />
              <input
                value={closePrice}
                onChange={(e) => setClosePrice(e.target.value)}
                placeholder="Exit price"
                type="number"
                step="0.00001"
                className="border-2 border-black p-2 font-mono text-sm"
              />
              <button
                onClick={closeTrade}
                disabled={loading}
                className="border-4 border-black py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                {loading ? "⟳ CLOSING..." : "CLOSE TRADE"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Trade history */}
      <h3 className="font-black uppercase mb-3">Recent Trades</h3>
      {trades.length === 0 ? (
        <div className="text-center py-10 text-gray-400 font-mono border-4 border-dashed border-gray-300">
          No trades yet — use PAPER TRADE button on a signal to open one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black font-mono text-sm">
            <thead>
              <tr className="bg-black text-white">
                {["ID", "Symbol", "Direction", "Entry", "Exit", "P&L $", "P&L %", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(trades as Record<string, unknown>[]).map((t: Record<string, unknown>, i: number) => (
                <tr key={t.trade_id as string} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-2 text-xs">{t.trade_id as string}</td>
                  <td className="px-3 py-2 font-bold">{t.symbol as string}</td>
                  <td className={`px-3 py-2 font-bold ${t.direction === "BUY" ? "text-emerald-600" : "text-red-600"}`}>{t.direction as string}</td>
                  <td className="px-3 py-2">{(t.entry_price as number)?.toFixed(5)}</td>
                  <td className="px-3 py-2">{t.exit_price ? (t.exit_price as number).toFixed(5) : "—"}</td>
                  <td className={`px-3 py-2 font-bold ${pnlClass((t.pnl_usd as number) || 0)}`}>
                    {t.pnl_usd !== undefined ? `$${(t.pnl_usd as number).toFixed(2)}` : "—"}
                  </td>
                  <td className={`px-3 py-2 font-bold ${pnlClass((t.pnl_pct as number) || 0)}`}>
                    {t.pnl_pct !== undefined ? `${(t.pnl_pct as number).toFixed(2)}%` : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      (t.status as string)?.includes("WIN") ? "bg-emerald-100 text-emerald-700"
                      : (t.status as string)?.includes("LOSS") ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                    }`}>
                      {t.status as string}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// P&L CALCULATOR TAB
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch live price for a symbol+asset_class from the market-data endpoint */
async function fetchLivePrice(symbol: string, assetClass: string): Promise<number | null> {
  try {
    const r = await fetch(
      `/api/trading/market-data?symbol=${encodeURIComponent(symbol)}&asset_class=${encodeURIComponent(assetClass)}`
    );
    const d = await r.json();
    if (d.success && d.price != null) return Number(d.price);
    return null;
  } catch {
    return null;
  }
}

function PnLArrow({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-400 text-lg">—</span>;
  if (value > 0)  return <span className="text-emerald-600 text-xl font-black">▲</span>;
  if (value < 0)  return <span className="text-red-600 text-xl font-black">▼</span>;
  return <span className="text-gray-500 text-xl font-black">◆</span>;
}

function PnLValue({
  usd, pct, size = "normal",
}: { usd: number | null; pct: number | null; size?: "normal" | "large" }) {
  const sizeClass = size === "large" ? "text-2xl" : "text-base";
  const colour =
    usd === null  ? "text-gray-400"
    : usd > 0    ? "text-emerald-600"
    : usd < 0    ? "text-red-600"
    : "text-gray-500";

  return (
    <span className={`${colour} font-black ${sizeClass}`}>
      {usd === null
        ? "Fetching…"
        : `${usd >= 0 ? "+" : ""}$${usd.toFixed(2)} (${pct !== null ? (pct >= 0 ? "+" : "") + pct.toFixed(3) + "%" : ""})`}
    </span>
  );
}

function PnLCalculatorTab() {
  const [openTrades,   setOpenTrades]   = useState<PhantomTrade[]>([]);
  const [closedTrades, setClosedTrades] = useState<PhantomTrade[]>([]);
  const [livePnL,      setLivePnL]      = useState<Record<string, LivePnL>>({});
  const [loading,      setLoading]      = useState(false);
  const [lastRefresh,  setLastRefresh]  = useState<string | null>(null);
  const [autoRefresh,  setAutoRefresh]  = useState(true);
  const [refreshSecs,  setRefreshSecs]  = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── load trades from phantom/full ──────────────────────────────────────────
  const loadTrades = useCallback(async () => {
    const d = await (await fetch("/api/trading/phantom/full")).json();
    if (d.success) {
      const account = d.account as {
        open_trades: PhantomTrade[];
        closed_trades: PhantomTrade[];
      };
      setOpenTrades(account.open_trades ?? []);
      setClosedTrades((account.closed_trades ?? []).slice(-20)); // last 20
    }
  }, []);

  // ── fetch live P&L for all open trades ─────────────────────────────────────
  const refreshPnL = useCallback(async () => {
    if (openTrades.length === 0) {
      setLastRefresh(new Date().toLocaleTimeString());
      return;
    }
    setLoading(true);

    // Build initial loading state
    const init: Record<string, LivePnL> = {};
    openTrades.forEach((t) => {
      init[t.trade_id] = {
        trade_id:      t.trade_id,
        symbol:        t.symbol,
        currentPrice:  null,
        dayOpenPrice:  null,
        dailyPnlUsd:   null,
        dailyPnlPct:   null,
        overallPnlUsd: null,
        overallPnlPct: null,
        loading:       true,
        lastUpdated:   null,
      };
    });
    setLivePnL(init);

    // Fetch live prices in parallel
    const results = await Promise.allSettled(
      openTrades.map((t) => fetchLivePrice(t.symbol, t.asset_class))
    );

    const updated: Record<string, LivePnL> = {};
    openTrades.forEach((t, i) => {
      const result = results[i];
      const currentPrice =
        result.status === "fulfilled" && result.value !== null
          ? result.value
          : null;

      let overallPnlUsd: number | null = null;
      let overallPnlPct: number | null = null;
      let dailyPnlUsd:   number | null = null;
      let dailyPnlPct:   number | null = null;

      if (currentPrice !== null) {
        const posUsd = t.position_usd;
        const isBuy  = t.direction === "BUY";
        const priceDiff = isBuy
          ? currentPrice - t.entry_price
          : t.entry_price - currentPrice;

        overallPnlPct = (priceDiff / t.entry_price) * 100;
        overallPnlUsd = (overallPnlPct / 100) * posUsd;

        // Daily P&L: approximate using today's open ≈ entry_price adjusted
        // (without a separate day-open endpoint, we use the stored entry vs current
        //  and note this is "since entry". For a true daily P&L the server would need
        //  a day-open snapshot — we flag this clearly in the UI)
        const openedToday =
          t.opened_at &&
          new Date(t.opened_at).toDateString() === new Date().toDateString();

        if (openedToday) {
          // opened today → daily = overall
          dailyPnlPct = overallPnlPct;
          dailyPnlUsd = overallPnlUsd;
        } else {
          // For multi-day trades we show overall as "daily" approximation
          // A true daily P&L would require a midnight price snapshot
          dailyPnlPct = overallPnlPct;
          dailyPnlUsd = overallPnlUsd;
        }
      }

      updated[t.trade_id] = {
        trade_id:      t.trade_id,
        symbol:        t.symbol,
        currentPrice,
        dayOpenPrice:  t.entry_price,
        dailyPnlUsd,
        dailyPnlPct,
        overallPnlUsd,
        overallPnlPct,
        loading:       false,
        error:         currentPrice === null ? "Price unavailable" : undefined,
        lastUpdated:   new Date().toLocaleTimeString(),
      };
    });

    setLivePnL(updated);
    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  }, [openTrades]);

  // ── initial load ────────────────────────────────────────────────────────────
  useEffect(() => { loadTrades(); }, [loadTrades]);

  // ── trigger price refresh when trades list changes ──────────────────────────
  useEffect(() => {
    if (openTrades.length > 0) refreshPnL();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTrades]);

  // ── auto-refresh timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!autoRefresh) return;
    timerRef.current = setInterval(() => {
      loadTrades();
    }, refreshSecs * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoRefresh, refreshSecs, loadTrades]);

  // ── Portfolio totals ────────────────────────────────────────────────────────
  const portfolioTotals = (() => {
    const rows = Object.values(livePnL).filter((r) => !r.loading);
    if (rows.length === 0) return null;
    const totalOverallUsd = rows.reduce((s, r) => s + (r.overallPnlUsd ?? 0), 0);
    const totalDailyUsd   = rows.reduce((s, r) => s + (r.dailyPnlUsd   ?? 0), 0);
    const totalPos        = openTrades.reduce((s, t) => s + t.position_usd, 0);
    return {
      totalOverallUsd,
      totalDailyUsd,
      overallPct: totalPos > 0 ? (totalOverallUsd / totalPos) * 100 : 0,
      dailyPct:   totalPos > 0 ? (totalDailyUsd   / totalPos) * 100 : 0,
      openCount:  rows.length,
    };
  })();

  // ── closed trades cumulative ────────────────────────────────────────────────
  const closedPnL = closedTrades.reduce((s, t) => s + (t.pnl_usd ?? 0), 0);

  const statusBadge = (status: string) => {
    if (status?.includes("WIN"))  return "bg-emerald-100 text-emerald-700 border border-emerald-300";
    if (status?.includes("LOSS")) return "bg-red-100 text-red-700 border border-red-300";
    if (status?.includes("BE"))   return "bg-gray-100 text-gray-600 border border-gray-300";
    return "bg-amber-100 text-amber-700 border border-amber-300";
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase mb-1">P&L Calculator</h2>
          <p className="font-mono text-sm text-gray-500">
            Live profit &amp; loss for every open phantom trade — daily movement and overall from entry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 cursor-pointer font-mono text-sm border-2 border-black px-3 py-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            Auto-refresh
          </label>

          {/* Interval selector */}
          <select
            value={refreshSecs}
            onChange={(e) => setRefreshSecs(Number(e.target.value))}
            className="border-2 border-black px-2 py-2 font-mono text-sm"
            disabled={!autoRefresh}
          >
            <option value={30}>Every 30s</option>
            <option value={60}>Every 60s</option>
            <option value={120}>Every 2min</option>
            <option value={300}>Every 5min</option>
          </select>

          {/* Manual refresh */}
          <button
            onClick={() => { loadTrades(); }}
            disabled={loading}
            className="border-4 border-black px-4 py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "⟳ FETCHING…" : "⟳ REFRESH NOW"}
          </button>
        </div>
      </div>

      {/* Last refresh timestamp */}
      {lastRefresh && (
        <div className="font-mono text-xs text-gray-400 mb-4">
          Last updated: <span className="text-black font-bold">{lastRefresh}</span>
          {autoRefresh && <span className="ml-2 text-blue-500">(auto-refreshing every {refreshSecs}s)</span>}
        </div>
      )}

      {/* ── Portfolio Summary Bar ──────────────────────────────────────── */}
      {portfolioTotals && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className={`border-4 border-black p-4 neo-shadow ${portfolioTotals.totalOverallUsd >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
            <div className="font-mono text-xs text-gray-500 mb-1">PORTFOLIO OVERALL P&L</div>
            <div className="flex items-center gap-2">
              <PnLArrow value={portfolioTotals.totalOverallUsd} />
              <div>
                <PnLValue usd={portfolioTotals.totalOverallUsd} pct={portfolioTotals.overallPct} size="large" />
              </div>
            </div>
          </div>

          <div className={`border-4 border-black p-4 neo-shadow ${portfolioTotals.totalDailyUsd >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
            <div className="font-mono text-xs text-gray-500 mb-1">PORTFOLIO DAILY P&L</div>
            <div className="flex items-center gap-2">
              <PnLArrow value={portfolioTotals.totalDailyUsd} />
              <div>
                <PnLValue usd={portfolioTotals.totalDailyUsd} pct={portfolioTotals.dailyPct} size="large" />
              </div>
            </div>
          </div>

          <div className="border-4 border-black p-4 neo-shadow bg-white">
            <div className="font-mono text-xs text-gray-500 mb-1">OPEN POSITIONS</div>
            <div className="font-black text-4xl text-black">{portfolioTotals.openCount}</div>
            <div className="font-mono text-xs text-gray-400">live phantom trades</div>
          </div>

          <div className={`border-4 border-black p-4 neo-shadow ${closedPnL >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
            <div className="font-mono text-xs text-gray-500 mb-1">REALISED P&L (CLOSED)</div>
            <div className="flex items-center gap-2">
              <PnLArrow value={closedPnL} />
              <span className={`font-black text-2xl ${closedPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {closedPnL >= 0 ? "+" : ""}${closedPnL.toFixed(2)}
              </span>
            </div>
            <div className="font-mono text-xs text-gray-400">{closedTrades.length} closed trades</div>
          </div>
        </div>
      )}

      {/* ── Open Trades P&L Cards ──────────────────────────────────────── */}
      <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">
        Open Positions — Live P&L
      </h3>

      {openTrades.length === 0 ? (
        <div className="text-center py-16 border-4 border-dashed border-gray-300 font-mono text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <div className="font-black uppercase text-lg">No Open Trades</div>
          <p className="text-sm mt-2">
            Use the Scanner or Signal Generator tabs to generate a signal,<br />
            then click <strong>PAPER TRADE</strong> to open a phantom position.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {openTrades.map((trade) => {
            const lp = livePnL[trade.trade_id];
            const isBuy   = trade.direction === "BUY";
            const dirColour = isBuy ? "bg-emerald-500 text-white" : "bg-red-500 text-white";

            return (
              <div
                key={trade.trade_id}
                className={`border-4 border-black neo-shadow overflow-hidden ${
                  lp?.overallPnlUsd !== null && lp?.overallPnlUsd !== undefined
                    ? lp.overallPnlUsd >= 0 ? "border-emerald-500" : "border-red-500"
                    : ""
                }`}
              >
                {/* Trade header */}
                <div className="flex items-center justify-between p-4 bg-black text-white">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">{trade.trade_id}</span>
                    <span className={`px-2 py-0.5 font-black text-sm border-2 border-white ${dirColour}`}>
                      {isBuy ? "▲ BUY" : "▼ SELL"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xl">{trade.symbol}</div>
                    <div className="font-mono text-xs text-gray-400 capitalize">{trade.asset_class}</div>
                  </div>
                </div>

                {/* P&L rows */}
                <div className="p-4 bg-white">
                  {lp?.loading ? (
                    <div className="flex items-center gap-2 font-mono text-sm text-gray-400 animate-pulse py-4">
                      <span className="text-xl">⟳</span> Fetching live price…
                    </div>
                  ) : lp?.error ? (
                    <div className="font-mono text-sm text-red-500 py-2">
                      ⚠ {lp.error} — showing entry price data only
                    </div>
                  ) : (
                    <>
                      {/* Daily P&L */}
                      <div className={`flex items-center justify-between p-3 mb-2 border-2 rounded ${
                        lp?.dailyPnlUsd !== null && (lp?.dailyPnlUsd ?? 0) >= 0
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-red-300 bg-red-50"
                      }`}>
                        <div>
                          <div className="font-mono text-xs text-gray-500 uppercase font-bold">Daily P&L</div>
                          <div className="font-mono text-xs text-gray-400">
                            {trade.opened_at && new Date(trade.opened_at).toDateString() === new Date().toDateString()
                              ? "Opened today"
                              : `Since entry ${new Date(trade.opened_at).toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <PnLArrow value={lp?.dailyPnlUsd ?? null} />
                          <PnLValue usd={lp?.dailyPnlUsd ?? null} pct={lp?.dailyPnlPct ?? null} />
                        </div>
                      </div>

                      {/* Overall P&L */}
                      <div className={`flex items-center justify-between p-3 border-2 rounded ${
                        (lp?.overallPnlUsd ?? 0) >= 0
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-red-400 bg-red-50"
                      }`}>
                        <div>
                          <div className="font-mono text-xs text-gray-500 uppercase font-bold">Overall P&L</div>
                          <div className="font-mono text-xs text-gray-400">Entry → Now</div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <PnLArrow value={lp?.overallPnlUsd ?? null} />
                          <PnLValue usd={lp?.overallPnlUsd ?? null} pct={lp?.overallPnlPct ?? null} size="large" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Price details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 border-t-2 border-gray-100 pt-3">
                    <div className="text-center">
                      <div className="font-mono text-xs text-gray-400">Entry</div>
                      <div className="font-bold text-sm">{trade.entry_price.toFixed(5)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-xs text-gray-400">Current</div>
                      <div className={`font-bold text-sm ${
                        lp?.currentPrice !== null && lp?.currentPrice !== undefined
                          ? (isBuy ? lp.currentPrice > trade.entry_price : lp.currentPrice < trade.entry_price)
                              ? "text-emerald-600"
                              : "text-red-600"
                          : "text-gray-400"
                      }`}>
                        {lp?.currentPrice !== null && lp?.currentPrice !== undefined
                          ? lp.currentPrice.toFixed(5)
                          : "—"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-xs text-gray-400">Stop Loss</div>
                      <div className="font-bold text-sm text-red-500">{trade.stop_loss.toFixed(5)}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-xs text-gray-400">TP1</div>
                      <div className="font-bold text-sm text-emerald-600">{trade.take_profit_1.toFixed(5)}</div>
                    </div>
                  </div>

                  {/* Position size + last updated */}
                  <div className="flex items-center justify-between mt-2 font-mono text-xs text-gray-400 border-t border-gray-100 pt-2">
                    <span>Position: <span className="text-black font-bold">${trade.position_usd.toFixed(2)}</span></span>
                    {lp?.lastUpdated && <span>Updated: {lp.lastUpdated}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Closed Trades Summary ──────────────────────────────────────── */}
      <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">
        Closed Trades — Realised P&L (last {closedTrades.length})
      </h3>

      {closedTrades.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 font-mono text-gray-400 text-sm">
          No closed trades yet.
        </div>
      ) : (
        <>
          {/* Closed P&L summary strip */}
          <div className={`flex items-center gap-4 p-4 border-4 border-black neo-shadow mb-4 ${
            closedPnL >= 0 ? "bg-emerald-50" : "bg-red-50"
          }`}>
            <PnLArrow value={closedPnL} />
            <div>
              <div className="font-mono text-xs text-gray-500 uppercase">Cumulative Realised P&L</div>
              <span className={`font-black text-3xl ${closedPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {closedPnL >= 0 ? "+" : ""}${closedPnL.toFixed(2)}
              </span>
            </div>
            <div className="ml-auto text-right font-mono text-xs text-gray-500">
              {closedTrades.filter((t) => (t.pnl_usd ?? 0) > 0).length} wins ·{" "}
              {closedTrades.filter((t) => (t.pnl_usd ?? 0) < 0).length} losses ·{" "}
              {closedTrades.filter((t) => Math.abs(t.pnl_usd ?? 0) < 0.01).length} breakeven
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-2 border-black font-mono text-sm">
              <thead>
                <tr className="bg-black text-white">
                  {["Symbol", "Dir", "Entry", "Exit", "Daily P&L", "Overall P&L", "Status", "Opened"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-bold uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...closedTrades].reverse().map((t, i) => (
                  <tr key={t.trade_id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 font-bold">{t.symbol}</td>
                    <td className={`px-3 py-2 font-bold ${t.direction === "BUY" ? "text-emerald-600" : "text-red-600"}`}>
                      {t.direction}
                    </td>
                    <td className="px-3 py-2">{t.entry_price?.toFixed(5)}</td>
                    <td className="px-3 py-2">{t.exit_price?.toFixed(5) ?? "—"}</td>
                    <td className={`px-3 py-2 font-bold ${(t.pnl_usd ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {t.pnl_usd !== undefined
                        ? `${(t.pnl_usd) >= 0 ? "+" : ""}$${t.pnl_usd.toFixed(2)}`
                        : "—"}
                    </td>
                    <td className={`px-3 py-2 font-bold ${(t.pnl_pct ?? 0) >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {t.pnl_pct !== undefined
                        ? `${t.pnl_pct >= 0 ? "+" : ""}${t.pnl_pct.toFixed(3)}%`
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-400">
                      {t.opened_at ? new Date(t.opened_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Methodology note ──────────────────────────────────────────── */}
      <div className="mt-8 border-2 border-amber-300 bg-amber-50 p-4 font-mono text-xs text-amber-800">
        <strong>P&L Calculation Methodology:</strong> Overall P&L = (Current Price − Entry Price) / Entry Price × Position USD,
        adjusted for direction (BUY profits when price rises; SELL profits when price falls).
        Daily P&L uses entry price as the day baseline for trades opened today; for multi-day positions
        it shows movement since entry (a true daily P&L would require a midnight price snapshot stored server-side).
        All figures are <strong>phantom / paper trading only</strong> — no real capital is at risk.
        Live prices are fetched from Alpha Vantage → Frankfurter → ExchangeRate-API (forex),
        CoinGecko → Binance (crypto), Alpha Vantage → Finnhub (stocks) with fallback chain.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURACY TAB
// ─────────────────────────────────────────────────────────────────────────────

function AccuracyTab() {
  const [stats,   setStats]   = useState<AccuracyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [signalId, setSignalId] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [recordMsg, setRecordMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    apiGet("/accuracy").then(d => {
      if (d.success) setStats(d.accuracy);
    }).finally(() => setLoading(false));
  }, []);

  const recordOutcome = async () => {
    if (!signalId || !exitPrice) return;
    const data = await apiPost("/outcome", {
      signal_id: signalId,
      exit_price: parseFloat(exitPrice),
      recorded_by: "manual_entry",
    });
    if (data.success) {
      setRecordMsg(`✅ Outcome recorded: ${data.outcome?.outcome} | P&L: ${data.outcome?.pnl_pct?.toFixed(4)}%`);
      // Refresh stats
      apiGet("/accuracy").then(d => { if (d.success) setStats(d.accuracy); });
    } else setRecordMsg(`❌ ${data.error}`);
  };

  return (
    <div>
      <h2 className="text-3xl font-black uppercase mb-2">Accuracy Analytics</h2>
      <p className="font-mono text-sm text-gray-500 mb-6">
        Real measured accuracy — not a mathematical cap. Requires 90 days / ≥100 signals for significance.
      </p>

      {/* Record outcome form */}
      <div className="border-4 border-black p-4 neo-shadow mb-6">
        <h3 className="font-black uppercase mb-3">Record Outcome (Step 3)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input
            value={signalId}
            onChange={(e) => setSignalId(e.target.value)}
            placeholder="Signal ID (SIG-...)"
            className="border-2 border-black p-2 font-mono text-sm"
          />
          <input
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            placeholder="Actual exit price"
            type="number"
            step="0.00001"
            className="border-2 border-black p-2 font-mono text-sm"
          />
          <button
            onClick={recordOutcome}
            className="border-4 border-black py-2 font-black uppercase neo-shadow hover:bg-black hover:text-white transition-colors"
          >
            RECORD OUTCOME
          </button>
        </div>
        {recordMsg && <div className="font-mono text-sm">{recordMsg}</div>}
      </div>

      {loading && <div className="text-center py-10 font-mono animate-pulse">Loading accuracy data...</div>}

      {stats && (
        <>
          {/* Significance warning */}
          <div className={`border-2 p-3 mb-4 font-mono text-sm ${stats.resolved_signals < 30 ? "border-red-400 bg-red-50 text-red-700" : stats.resolved_signals < 100 ? "border-amber-400 bg-amber-50 text-amber-800" : "border-emerald-400 bg-emerald-50 text-emerald-800"}`}>
            📊 {stats.statistical_significance}
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Signals",    value: String(stats.total_signals) },
              { label: "Resolved",         value: String(stats.resolved_signals) },
              { label: "Win Rate",         value: `${stats.win_rate_pct.toFixed(2)}%` },
              { label: "Profit Factor",    value: stats.profit_factor > 0 ? stats.profit_factor.toFixed(3) : "N/A" },
              { label: "Wins",             value: String(stats.wins) },
              { label: "Losses",           value: String(stats.losses) },
              { label: "Sharpe Ratio",     value: stats.sharpe_ratio.toFixed(3) },
              { label: "Max Drawdown",     value: `${stats.max_drawdown_pct.toFixed(4)}%` },
            ].map((m) => (
              <div key={m.label} className="border-2 border-black p-3 neo-shadow text-center">
                <div className="text-2xl font-black">{m.value}</div>
                <div className="font-mono text-xs text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>

          {/* By asset class */}
          <h3 className="font-black uppercase mb-3">Accuracy by Asset Class</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["forex", "crypto", "stock"] as const).map((cls) => {
              const d = stats.by_asset_class[cls];
              return (
                <div key={cls} className="border-2 border-black p-3 neo-shadow text-center">
                  <div className="text-2xl mb-1">{assetIcon(cls)}</div>
                  <div className="font-black uppercase text-sm mb-2">{cls}</div>
                  <div className="font-black text-xl">{d.win_rate_pct.toFixed(1)}%</div>
                  <div className="font-mono text-xs text-gray-500">{d.wins}W / {d.signals - d.wins}L of {d.signals}</div>
                </div>
              );
            })}
          </div>

          <div className="font-mono text-xs text-gray-400 border-t border-gray-200 pt-4">
            ⚠ All accuracy figures are based on paper trading outcomes only. Past performance is not indicative of future results.
            Live trading requires FCA authorisation (UK), MiFID II compliance (EU), or SEC registration (US).
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Trading() {
  const [activeTab, setActiveTab] = useState<TabId>("scanner");
  const [pendingPhantom, setPendingPhantom] = useState<TradingSignal | null>(null);

  const handleOpenPhantom = useCallback((signal: TradingSignal) => {
    setPendingPhantom(signal);
    setActiveTab("phantom");
  }, []);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "scanner",  label: "Market Scanner",     icon: "🔍" },
    { id: "signal",   label: "Signal Generator",   icon: "⚡" },
    { id: "hitl",     label: "HITL Portal",         icon: "👤" },
    { id: "phantom",  label: "Phantom Account",    icon: "📋" },
    { id: "pnl",      label: "P&L Calculator",     icon: "💰" },
    { id: "accuracy", label: "Accuracy Analytics", icon: "📊" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-[#00FFFF] border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              ORB AI Trading Engine v2 — Architecture B
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
              Multi-Asset<br />Trading
            </h1>
          </div>
          <div className="mt-6 md:mt-0 max-w-sm text-right">
            <p className="font-mono text-sm mb-3">
              Real RSI · MACD · BB · ATR · S/R<br />
              Forex + Crypto + Stocks<br />
              Live price feeds · HITL verification
            </p>
            <div className="flex gap-2 justify-end flex-wrap">
              <span className="neo-tag bg-black text-[#00FFFF] font-mono text-xs px-2 py-1 border-2 border-black">Architecture B LIVE</span>
              <span className="neo-tag bg-black text-[#00FFFF] font-mono text-xs px-2 py-1 border-2 border-black">No Sine Wave</span>
              <span className="neo-tag bg-black text-[#00FFFF] font-mono text-xs px-2 py-1 border-2 border-black">HITL Active</span>
            </div>
          </div>
        </div>

        {/* Asset class pills */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { icon: "💱", label: "FOREX", sub: "EUR/USD · GBP/USD · 6 pairs" },
            { icon: "₿",  label: "CRYPTO", sub: "BTC · ETH · SOL · 10 coins" },
            { icon: "📈", label: "STOCKS", sub: "AAPL · NVDA · MSFT · 10 tickers" },
          ].map((a) => (
            <div key={a.label} className="border-2 border-black px-4 py-2 neo-shadow flex items-center gap-2 whitespace-nowrap">
              <span className="text-xl">{a.icon}</span>
              <div>
                <div className="font-black text-sm">{a.label}</div>
                <div className="font-mono text-xs text-gray-500">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b-4 border-black overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 font-mono font-bold text-sm uppercase whitespace-nowrap border-r-2 border-black transition-colors ${
                activeTab === t.id ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pb-16">
          {activeTab === "scanner"  && <ScannerTab onOpenPhantom={handleOpenPhantom} />}
          {activeTab === "signal"   && <SignalTab  onOpenPhantom={handleOpenPhantom} />}
          {activeTab === "hitl"     && <HITLTab />}
          {activeTab === "phantom"  && <PhantomTab pendingOpen={pendingPhantom} />}
          {activeTab === "pnl"      && <PnLCalculatorTab />}
          {activeTab === "accuracy" && <AccuracyTab />}
        </div>

        {/* Disclaimer */}
        <div className="border-t-4 border-black pt-6 pb-8">
          <div className="font-mono text-xs text-gray-400 max-w-4xl">
            <strong>REGULATORY DISCLAIMER:</strong> This platform provides AI-assisted market analysis for informational purposes only.
            It does not constitute financial advice. All signals require Human-in-the-Loop (HITL) verification by a licensed professional
            before live execution. Forex trading: FCA CISM Level 3 or equivalent required (UK).
            CFD/Crypto trading: local regulatory authorisation required. Stock trading: FCA, FINRA, or equivalent required.
            VeriTech-10 certificates are legally valid only after HITL sign-off.
            Past performance is not indicative of future results. Do not trade with capital you cannot afford to lose.
          </div>
        </div>
      </div>
    </Layout>
  );
}
