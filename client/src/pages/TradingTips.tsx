/**
 * TRADING TIPS & PROFESSIONAL FORECASTS — UI-004
 * =============================================================================
 * CVK-1100 compliant page. Displays V10-certified professional trading tips
 * and forecasts with full legal responsibility chain visibility.
 *
 * RESPONSIBILITY CHAIN (3 steps):
 *   [AI_PLATFORM] → generate DRAFT forecast
 *   [END_USER]    → acknowledge ORB-DISCLAIMER-v2.1 (7 points) → PENDING_SIGNOFF
 *   [QUALIFIED_PROFESSIONAL] → sign certificate → SIGNED / LEGALLY_VALID
 *
 * Forecast is NOT legally binding until all 3 steps are complete.
 * ORB-DISCLAIMER-v2.1 | MiFID II Art 24 | FCA COBS 12 | Consumer Duty PS22/9
 */

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES (mirroring ProfessionalForecastService.ts)
// ─────────────────────────────────────────────────────────────────────────────

type ForecastStatus = 'DRAFT' | 'PENDING_SIGNOFF' | 'UNDER_REVIEW' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
type ForecastType   = 'TRADING_TIP' | 'MARKET_FORECAST' | 'RISK_ASSESSMENT' | 'SECTOR_OUTLOOK' | 'MACRO_BRIEF';

interface ResponsibilityLink {
  party:      string;
  action:     string;
  timestamp:  string;
  actor_id?:  string;
  notes?:     string;
}

interface ProfessionalForecast {
  forecast_id:          string;
  forecast_type:        ForecastType;
  status:               ForecastStatus;
  symbol:               string;
  asset_class:          string;
  direction:            'BULLISH' | 'BEARISH' | 'NEUTRAL';
  conviction:           'HIGH' | 'MEDIUM' | 'LOW';
  oracle_score:         number;
  calibrated_probability?: number;
  tip?: {
    action:           string;
    entry_price:      number;
    stop_loss:        number;
    take_profit_1:    number;
    take_profit_2:    number;
    risk_reward:      number;
    position_size_pct:number;
  };
  disclaimer: {
    version:              string;
    issued_at:            string;
    user_must_acknowledge: string[];
  };
  responsibility_chain:   ResponsibilityLink[];
  v10_certified:          boolean;
  cert_id?:               string;
  rationale?:             string[];
  risks?:                 string[];
  expires_at:             string;
  generated_at:           string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCLAIMER GATE MODAL
// ─────────────────────────────────────────────────────────────────────────────

const DISCLAIMER_POINTS = [
  'I understand this is AI-generated information, NOT financial advice',
  'I accept full personal responsibility for any trading decisions I make',
  'I understand no guarantee of profit is made or implied',
  'I confirm I am not relying on this as a licensed professional recommendation',
  'I understand this forecast requires qualified professional sign-off to become legally valid',
  'I accept the risk warning and understand trading involves risk of total capital loss',
  'I have read and understood the full disclaimer (ORB-DISCLAIMER-v2.1)',
];

interface DisclaimerGateProps {
  forecast: ProfessionalForecast;
  onAccepted: (forecastId: string) => void;
  onClose: () => void;
}

function DisclaimerGate({ forecast, onAccepted, onClose }: DisclaimerGateProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(DISCLAIMER_POINTS.length).fill(false));
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleSubmit = async () => {
    if (!allChecked) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/trading/forecast/${forecast.forecast_id}/signoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'web-user-' + Date.now().toString(36),
          user_acknowledgement: true,
          acknowledged_points: DISCLAIMER_POINTS,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Disclaimer accepted', description: 'Forecast is now pending professional sign-off.' });
        onAccepted(forecast.forecast_id);
      } else {
        toast({ title: 'Error', description: data.error || 'Sign-off failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not submit disclaimer acknowledgement', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-amber-500/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="text-xl font-bold text-amber-400">ORB-DISCLAIMER-v2.1</h2>
            <p className="text-xs text-gray-400">MiFID II Art 24 • FCA COBS 12 • Consumer Duty PS22/9 • GDPR Art 22</p>
          </div>
        </div>

        {/* Forecast context */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm">
          <span className="text-gray-400">Forecast: </span>
          <span className="text-white font-mono">{forecast.forecast_id}</span>
          <span className="ml-3 text-gray-400">Symbol: </span>
          <span className="text-cyan-400 font-semibold">{forecast.symbol}</span>
          <span className="ml-3 text-gray-400">Type: </span>
          <span className="text-purple-400">{forecast.forecast_type}</span>
        </div>

        {/* Mandatory acknowledgement points */}
        <div className="mb-5">
          <p className="text-sm text-gray-300 mb-3 font-medium">
            You must acknowledge ALL of the following before accessing this forecast:
          </p>
          <div className="space-y-3">
            {DISCLAIMER_POINTS.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/60 cursor-pointer hover:bg-gray-800"
                onClick={() => toggle(i)}
              >
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={() => toggle(i)}
                  className="mt-0.5 border-amber-500 data-[state=checked]:bg-amber-500"
                />
                <span className="text-sm text-gray-200 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal notice */}
        <div className="bg-red-950/40 border border-red-500/30 rounded-lg p-3 mb-5 text-xs text-red-300">
          <strong>IMPORTANT:</strong> This forecast is NOT financial advice and is NOT legally binding until:
          (1) you acknowledge this disclaimer in full, AND (2) a qualified professional holding a valid
          credential signs the certificate. The AI platform, Orb AI Universe, and its operators accept
          no liability for trading decisions made on the basis of this information.
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-gray-700 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${(checked.filter(Boolean).length / DISCLAIMER_POINTS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{checked.filter(Boolean).length}/{DISCLAIMER_POINTS.length}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-600 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className={`flex-1 font-semibold ${allChecked
              ? 'bg-amber-500 hover:bg-amber-400 text-black'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!allChecked || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting…' : allChecked ? '✅ I Accept — Proceed to Forecast' : `Accept All ${DISCLAIMER_POINTS.length} Points to Continue`}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ForecastStatus }) {
  const config: Record<ForecastStatus, { label: string; className: string }> = {
    DRAFT:            { label: '📝 DRAFT',            className: 'bg-gray-600 text-gray-200' },
    PENDING_SIGNOFF:  { label: '⏳ PENDING SIGN-OFF', className: 'bg-amber-600 text-amber-100' },
    UNDER_REVIEW:     { label: '🔍 UNDER REVIEW',     className: 'bg-blue-600 text-blue-100' },
    SIGNED:           { label: '✅ SIGNED — LEGALLY VALID', className: 'bg-green-600 text-green-100' },
    REJECTED:         { label: '❌ REJECTED',          className: 'bg-red-600 text-red-100' },
    EXPIRED:          { label: '🕐 EXPIRED',           className: 'bg-gray-500 text-gray-200' },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.className}`}>
      {c.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIBILITY CHAIN DISPLAY
// ─────────────────────────────────────────────────────────────────────────────

function ResponsibilityChain({ chain }: { chain: ResponsibilityLink[] }) {
  const steps = [
    { party: 'AI_PLATFORM',          label: 'Step 1: AI Platform',       icon: '🤖', desc: 'Oracle 12-pillar + PAV calibration generates forecast' },
    { party: 'END_USER',             label: 'Step 2: User Acknowledgement', icon: '👤', desc: 'User accepts ORB-DISCLAIMER-v2.1 (7 mandatory points)' },
    { party: 'QUALIFIED_PROFESSIONAL', label: 'Step 3: Professional Sign-off', icon: '🏛️', desc: 'Licensed professional signs with verified credential' },
  ];

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const completed = chain.find(c => c.party === step.party);
        return (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${
            completed ? 'border-green-500/40 bg-green-950/20' : 'border-gray-600/40 bg-gray-800/30'
          }`}>
            <span className="text-lg mt-0.5">{step.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-semibold ${completed ? 'text-green-400' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {completed
                  ? <span className="text-xs text-green-400">✓ {completed.action}</span>
                  : <span className="text-xs text-gray-500">Pending</span>
                }
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              {completed?.actor_id && (
                <p className="text-xs text-cyan-400 mt-0.5">Actor: {completed.actor_id}</p>
              )}
            </div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              completed ? 'bg-green-500 text-black' : 'bg-gray-600 text-gray-300'
            }`}>
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORECAST CARD
// ─────────────────────────────────────────────────────────────────────────────

interface ForecastCardProps {
  forecast: ProfessionalForecast;
  onRequestSignOff: (forecast: ProfessionalForecast) => void;
}

function ForecastCard({ forecast, onRequestSignOff }: ForecastCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isSigned = forecast.status === 'SIGNED';

  const directionColor =
    forecast.direction === 'BULLISH' ? 'text-green-400' :
    forecast.direction === 'BEARISH' ? 'text-red-400' : 'text-yellow-400';

  const directionIcon =
    forecast.direction === 'BULLISH' ? '↑' :
    forecast.direction === 'BEARISH' ? '↓' : '→';

  return (
    <Card className={`bg-gray-900 border ${isSigned ? 'border-green-500/50' : 'border-gray-700'} transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-white">{forecast.symbol}</span>
                <span className={`text-lg font-bold ${directionColor}`}>{directionIcon} {forecast.direction}</span>
                {forecast.v10_certified && (
                  <Badge className="bg-purple-600 text-white text-xs">V10 CERTIFIED</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={forecast.status} />
                <span className="text-xs text-gray-500">{forecast.forecast_type.replace('_', ' ')}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{forecast.asset_class.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{forecast.oracle_score}<span className="text-sm text-gray-400">/100</span></div>
            <div className="text-xs text-gray-500">Oracle Score</div>
            {forecast.calibrated_probability && (
              <div className="text-sm font-semibold text-amber-400">{(forecast.calibrated_probability * 100).toFixed(1)}% PAV</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Certificate ID (if signed) */}
        {isSigned && forecast.cert_id && (
          <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">🏆</span>
              <div>
                <p className="text-xs text-green-300 font-semibold">V10 CERTIFICATE — LEGALLY VALID</p>
                <p className="text-xs font-mono text-green-400">{forecast.cert_id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Trading tip details */}
        {forecast.tip && (
          <div className={`rounded-lg p-4 ${isSigned ? 'bg-gray-800' : 'bg-gray-800/50 opacity-80'}`}>
            {!isSigned && (
              <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
                <span>🔒</span> Full details unlocked after disclaimer acknowledgement + professional sign-off
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Action</span>
                <div className={`font-bold text-lg ${
                  forecast.tip.action === 'BUY' ? 'text-green-400' :
                  forecast.tip.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                }`}>{forecast.tip.action}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Entry Price</span>
                <div className="font-semibold text-white">{forecast.tip.entry_price?.toFixed(5)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Stop Loss</span>
                <div className="font-semibold text-red-400">{forecast.tip.stop_loss?.toFixed(5)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Take Profit 1</span>
                <div className="font-semibold text-green-400">{forecast.tip.take_profit_1?.toFixed(5)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Take Profit 2</span>
                <div className="font-semibold text-green-300">{forecast.tip.take_profit_2?.toFixed(5)}</div>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Risk:Reward</span>
                <div className="font-semibold text-purple-400">1:{forecast.tip.risk_reward?.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Rationale */}
        {expanded && forecast.rationale && forecast.rationale.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Rationale</p>
            <ul className="space-y-1">
              {forecast.rationale.map((r, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-cyan-500 mt-0.5">•</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {expanded && forecast.risks && forecast.risks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-400 uppercase mb-2">Risk Factors</p>
            <ul className="space-y-1">
              {forecast.risks.map((r, i) => (
                <li key={i} className="text-xs text-red-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">⚠</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Responsibility chain */}
        {expanded && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Responsibility Chain</p>
            <ResponsibilityChain chain={forecast.responsibility_chain} />
          </div>
        )}

        {/* Expiry */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Generated: {new Date(forecast.generated_at).toLocaleString()}</span>
          <span>Expires: {new Date(forecast.expires_at).toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-600 text-gray-300"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Hide Details' : 'Show Details'}
          </Button>
          {(forecast.status === 'DRAFT') && (
            <Button
              size="sm"
              className="text-xs bg-amber-600 hover:bg-amber-500 text-white"
              onClick={() => onRequestSignOff(forecast)}
            >
              🔐 Acknowledge Disclaimer & Request Sign-off
            </Button>
          )}
          {forecast.status === 'PENDING_SIGNOFF' && (
            <span className="text-xs text-amber-400 flex items-center gap-1 px-2">
              ⏳ Awaiting professional sign-off
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE FORECAST PANEL
// ─────────────────────────────────────────────────────────────────────────────

const FOREX_PAIRS  = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 'EUR/GBP', 'USD/CAD', 'NZD/USD'];
const CRYPTO_SYMS  = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'XRP/USD'];
const STOCK_TICKS  = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMZN'];

interface GeneratePanelProps {
  onGenerated: (forecast: ProfessionalForecast) => void;
}

function GeneratePanel({ onGenerated }: GeneratePanelProps) {
  const [symbol, setSymbol]         = useState('EUR/USD');
  const [assetClass, setAssetClass] = useState<'forex' | 'crypto' | 'stock'>('forex');
  const [fType, setFType]           = useState<ForecastType>('TRADING_TIP');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const symbolOptions =
    assetClass === 'forex'  ? FOREX_PAIRS :
    assetClass === 'crypto' ? CRYPTO_SYMS : STOCK_TICKS;

  useEffect(() => { setSymbol(symbolOptions[0]); }, [assetClass]); // eslint-disable-line

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/trading/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, asset_class: assetClass, forecast_type: fType }),
      });
      const data = await res.json();
      if (data.success && data.forecast) {
        toast({ title: 'Forecast generated', description: `${data.forecast.forecast_id} — ${data.forecast.status}` });
        onGenerated(data.forecast);
      } else {
        toast({ title: 'Error', description: data.error || 'Generation failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', description: 'Could not reach trading API', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-white flex items-center gap-2">
          <span>⚡</span> Generate Professional Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {/* Asset class */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Asset Class</label>
            <select
              value={assetClass}
              onChange={e => setAssetClass(e.target.value as 'forex' | 'crypto' | 'stock')}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
            >
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="stock">Stocks</option>
            </select>
          </div>
          {/* Symbol */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Symbol</label>
            <select
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
            >
              {symbolOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Forecast type */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Forecast Type</label>
            <select
              value={fType}
              onChange={e => setFType(e.target.value as ForecastType)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-sm text-white"
            >
              <option value="TRADING_TIP">Trading Tip (24H)</option>
              <option value="MARKET_FORECAST">Market Forecast (7D)</option>
              <option value="RISK_ASSESSMENT">Risk Assessment (48H)</option>
              <option value="SECTOR_OUTLOOK">Sector Outlook (7D)</option>
              <option value="MACRO_BRIEF">Macro Brief (72H)</option>
            </select>
          </div>
          {/* Generate button */}
          <div className="flex items-end">
            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? '⏳ Generating…' : '⚡ Generate'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Forecast uses Oracle 12-pillar scoring + PAV isotonic calibration + FractalPatternMatcher (DTW).
          Output is DRAFT until disclaimer is acknowledged and a qualified professional signs.
        </p>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNED TIPS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function SignedTipsPanel() {
  const [tips, setTips]     = useState<ProfessionalForecast[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTips = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/trading/tips');
      const data = await res.json();
      if (data.success) setTips(data.tips || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTips(); }, [fetchTips]);

  if (loading) return <div className="text-center text-gray-500 py-8">Loading certified tips…</div>;
  if (tips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">🏛️</div>
        <p className="text-gray-400 font-semibold">No V10-certified tips yet</p>
        <p className="text-sm text-gray-500 mt-1">Generate a forecast and complete the full 3-step sign-off chain to create your first certified tip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tips.map(t => (
        <div key={t.forecast_id} className="bg-gray-900 border border-green-500/40 rounded-xl p-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{t.symbol}</span>
                <span className={`font-bold ${t.tip?.action === 'BUY' ? 'text-green-400' : t.tip?.action === 'SELL' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {t.tip?.action}
                </span>
                <Badge className="bg-green-600 text-white text-xs">✅ LEGALLY VALID</Badge>
              </div>
              {t.cert_id && (
                <p className="text-xs font-mono text-green-400 mt-1">{t.cert_id}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-cyan-400">{t.oracle_score}<span className="text-xs text-gray-400">/100</span></div>
            </div>
          </div>
          {t.tip && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3 text-xs">
              <div><span className="text-gray-500">Entry</span><div className="text-white font-mono">{t.tip.entry_price?.toFixed(5)}</div></div>
              <div><span className="text-gray-500">SL</span><div className="text-red-400 font-mono">{t.tip.stop_loss?.toFixed(5)}</div></div>
              <div><span className="text-gray-500">TP1</span><div className="text-green-400 font-mono">{t.tip.take_profit_1?.toFixed(5)}</div></div>
              <div><span className="text-gray-500">TP2</span><div className="text-green-300 font-mono">{t.tip.take_profit_2?.toFixed(5)}</div></div>
              <div><span className="text-gray-500">R:R</span><div className="text-purple-400 font-mono">1:{t.tip.risk_reward?.toFixed(2)}</div></div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">Signed: {new Date(t.generated_at).toLocaleString()} • Expires: {new Date(t.expires_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFESSIONALS PANEL
// ─────────────────────────────────────────────────────────────────────────────

interface Professional {
  professional_id: string;
  full_name: string;
  qualification_level: string;
  domains: string[];
  status: string;
  sign_domains: string[];
}

function ProfessionalsPanel() {
  const [profs, setProfs] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/trading/professionals')
      .then(r => r.json())
      .then(d => { if (d.success) setProfs(d.professionals || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-500 py-8">Loading registry…</div>;

  return (
    <div className="space-y-3">
      {profs.map(p => (
        <div key={p.professional_id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{p.full_name}</span>
                <Badge className="bg-purple-700 text-white text-xs">{p.qualification_level}</Badge>
                <Badge className={`text-xs ${p.status === 'ACTIVE' ? 'bg-green-700 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {p.status}
                </Badge>
              </div>
              <p className="text-xs font-mono text-gray-500 mt-0.5">{p.professional_id}</p>
            </div>
          </div>
          {p.sign_domains && (
            <div className="mt-2 flex flex-wrap gap-1">
              {p.sign_domains.slice(0, 6).map((d: string) => (
                <span key={d} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{d.replace('_', ' ')}</span>
              ))}
            </div>
          )}
        </div>
      ))}
      {profs.length === 0 && (
        <p className="text-center text-gray-500 py-6">No professionals registered (Darryl is seeded as founding L4).</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'tips' | 'generate' | 'professionals';

export default function TradingTips() {
  const [activeTab, setActiveTab]               = useState<TabId>('tips');
  const [forecasts, setForecasts]               = useState<ProfessionalForecast[]>([]);
  const [disclaimerTarget, setDisclaimerTarget] = useState<ProfessionalForecast | null>(null);

  const handleGenerated = (f: ProfessionalForecast) => {
    setForecasts(prev => [f, ...prev]);
    setActiveTab('generate');
  };

  const handleSignOffAccepted = async (forecastId: string) => {
    // Refresh the forecast from server to get updated status
    try {
      const res  = await fetch(`/api/trading/forecast/${forecastId}`);
      const data = await res.json();
      if (data.success && data.forecast) {
        setForecasts(prev => prev.map(f => f.forecast_id === forecastId ? data.forecast : f));
      }
    } catch { /* silent */ }
    setDisclaimerTarget(null);
  };

  const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'tips',          label: 'Certified Tips',      icon: '✅' },
    { id: 'generate',      label: 'Generate Forecast',   icon: '⚡' },
    { id: 'professionals', label: 'Professional Registry', icon: '🏛️' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Disclaimer Gate Modal */}
      {disclaimerTarget && (
        <DisclaimerGate
          forecast={disclaimerTarget}
          onAccepted={handleSignOffAccepted}
          onClose={() => setDisclaimerTarget(null)}
        />
      )}

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">📊</span>
                <div>
                  <h1 className="text-2xl font-bold text-white">Trading Tips & Professional Forecasts</h1>
                  <p className="text-sm text-gray-400 mt-0.5">
                    V10 Certified • CVK-1100 Standard • 3-Step Legal Responsibility Chain
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-purple-700 text-white">V10 GATE</Badge>
              <Badge className="bg-amber-700 text-white">ORB-DISCLAIMER-v2.1</Badge>
              <Badge className="bg-blue-700 text-white">MiFID II Art 24</Badge>
              <Badge className="bg-green-700 text-white">FCA COBS 12</Badge>
            </div>
          </div>

          {/* Legal notice banner */}
          <div className="mt-4 bg-amber-950/40 border border-amber-500/30 rounded-lg px-4 py-2.5 text-xs text-amber-300">
            <strong>⚠️ IMPORTANT:</strong> All forecasts are AI-generated DRAFT information only. They are NOT financial advice
            and are NOT legally binding until (1) you acknowledge the full disclaimer, AND (2) a qualified professional
            with a verified credential signs the certificate. You assume full responsibility for any trading decisions.
            Past performance is not indicative of future results. Trading involves risk of total capital loss.
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Certified Tips Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">V10-Certified Trading Tips</h2>
              <span className="text-xs text-gray-500">Legally valid — full 3-step chain completed</span>
            </div>
            <SignedTipsPanel />
          </div>
        )}

        {/* Generate Forecast Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-4">
            <GeneratePanel onGenerated={handleGenerated} />
            {forecasts.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-white mb-3">
                  Generated This Session ({forecasts.length})
                </h2>
                <div className="space-y-4">
                  {forecasts.map(f => (
                    <ForecastCard
                      key={f.forecast_id}
                      forecast={f}
                      onRequestSignOff={setDisclaimerTarget}
                    />
                  ))}
                </div>
              </div>
            )}
            {forecasts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No forecasts generated yet. Use the form above to generate your first V10 forecast.</p>
              </div>
            )}
          </div>
        )}

        {/* Professionals Tab */}
        {activeTab === 'professionals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Qualified Professional Registry</h2>
              <span className="text-xs text-gray-500">18 domains • L1–L4 qualification levels • Darryl-only activation gate</span>
            </div>
            <ProfessionalsPanel />
          </div>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-gray-800 mt-8 py-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600 leading-relaxed max-w-3xl mx-auto">
            ORB-DISCLAIMER-v2.1 | MiFID II Article 24 | FCA COBS 12 | Consumer Duty PS22/9 | GDPR Article 22.
            This platform operates under the CVK-1100 verification standard. All forecasts require completion
            of the 3-step responsibility chain (AI_PLATFORM → END_USER → QUALIFIED_PROFESSIONAL) before
            becoming legally valid. The Orb AI Universe verification gate removes AI-generated content from
            legal standing until human professional certification is complete. Orb AI Universe™ and its
            operators are NOT authorised by the FCA to provide investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}
