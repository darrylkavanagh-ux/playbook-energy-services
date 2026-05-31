/**
 * V10 CERTIFICATION DASHBOARD
 * =============================================================================
 * VeriTech-10 compliance monitoring UI for Playbook Trading Platform.
 * Shows the real-time certification status of every platform feature.
 *
 * THE V10 GATE:
 *   Threshold: 98.5% — CLOSED until this level is reached.
 *   AI provides up to 98.5% mathematically. Licensed trader (Darryl) adds the
 *   final 1.5% via HITL sign-off for 100% certified signal path.
 */

import React, { useState, useEffect, useCallback } from 'react';

// ── Types (mirrored from server) ──────────────────────────────────────────────

type CertStatus = 'CERTIFIED' | 'PENDING' | 'FAILED' | 'DEPRECATED' | 'REVIEW';
type FeatureClass = 'SIGNAL' | 'SERVICE' | 'ENGINE' | 'UI' | 'INFRA' | 'DATA' | 'PROTOCOL';
type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type UpdateStatus = 'PENDING' | 'AUTHORIZED' | 'REJECTED' | 'DEPLOYED' | 'ROLLED_BACK' | 'EXPIRED';

interface V10Feature {
  id:                  string;
  name:                string;
  class:               FeatureClass;
  description:         string;
  implementation_file: string;
  status:              CertStatus;
  score:               number;
  threshold:           number;
  evidence:            Array<{ type: string; score: number; passed: boolean; description: string; tested_at: string }>;
  cert_id:             string | null;
  cert_issued_at:      string | null;
  notes:               string;
  last_evaluated_at:   string;
  dependencies:        string[];
}

interface PlatformUpdate {
  id:               string;
  title:            string;
  description:      string;
  category:         string;
  impact:           ImpactLevel;
  status:           UpdateStatus;
  proposer:         string;
  target_feature:   string;
  proposed_change:  string;
  expected_benefit: string;
  risk_assessment:  string;
  proposed_at:      string;
  reviewed_at:      string | null;
  reviewed_by:      string | null;
  review_notes:     string | null;
  audit_trail:      Array<{ action: string; actor: string; timestamp: string; notes: string }>;
}

interface V10Report {
  generated_at:       string;
  platform_name:      string;
  cert_version:       string;
  overall_score:      number;
  threshold:          number;
  gate_status:        'OPEN' | 'CLOSED';
  certified_count:    number;
  pending_count:      number;
  failed_count:       number;
  total_features:     number;
  certified_features: V10Feature[];
  pending_features:   V10Feature[];
  failed_features:    V10Feature[];
  critical_gaps:      string[];
  sign_off_ready:     boolean;
  human_approver:     string;
  summary:            string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const V10_THRESHOLD = 98.5;
const CLASS_ICONS: Record<FeatureClass, string> = {
  ENGINE:   '⚙️',
  SIGNAL:   '📡',
  SERVICE:  '🔧',
  UI:       '🖥️',
  INFRA:    '🏗️',
  DATA:     '💾',
  PROTOCOL: '🔌',
};
const IMPACT_COLORS: Record<ImpactLevel, string> = {
  LOW:      'bg-slate-700 text-slate-300',
  MEDIUM:   'bg-blue-900 text-blue-300',
  HIGH:     'bg-amber-900 text-amber-300',
  CRITICAL: 'bg-red-900 text-red-300',
};

// ── Helper Components ─────────────────────────────────────────────────────────

function ScoreBar({ score, threshold = V10_THRESHOLD }: { score: number; threshold?: number }) {
  const pct    = Math.min(100, score);
  const passed = score >= threshold;
  const color  = score >= threshold
    ? 'bg-emerald-500'
    : score >= 75
    ? 'bg-amber-500'
    : score >= 50
    ? 'bg-orange-500'
    : 'bg-red-500';

  return (
    <div className="relative w-full">
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Threshold marker */}
      <div
        className="absolute top-0 h-2 w-0.5 bg-white/60"
        style={{ left: `${threshold}%` }}
        title={`V10 Threshold: ${threshold}%`}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-0.5">
        <span className={passed ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
          {score.toFixed(1)}%
        </span>
        <span className="text-slate-500">{threshold}% gate</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CertStatus }) {
  const styles: Record<CertStatus, string> = {
    CERTIFIED:  'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
    PENDING:    'bg-amber-900/60 text-amber-300 border border-amber-700',
    FAILED:     'bg-red-900/60 text-red-300 border border-red-700',
    DEPRECATED: 'bg-slate-700 text-slate-400 border border-slate-600',
    REVIEW:     'bg-blue-900/60 text-blue-300 border border-blue-700',
  };
  const icons: Record<CertStatus, string> = {
    CERTIFIED:  '✅',
    PENDING:    '⏳',
    FAILED:     '❌',
    DEPRECATED: '🗃️',
    REVIEW:     '🔍',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}

function UpdateStatusBadge({ status }: { status: UpdateStatus }) {
  const styles: Record<UpdateStatus, string> = {
    PENDING:     'bg-amber-900/60 text-amber-300',
    AUTHORIZED:  'bg-emerald-900/60 text-emerald-300',
    REJECTED:    'bg-red-900/60 text-red-300',
    DEPLOYED:    'bg-blue-900/60 text-blue-300',
    ROLLED_BACK: 'bg-purple-900/60 text-purple-300',
    EXPIRED:     'bg-slate-700 text-slate-400',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${styles[status]}`}>
      {status}
    </span>
  );
}

function GaugeCircle({ score, threshold = V10_THRESHOLD }: { score: number; threshold?: number }) {
  const radius = 52;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color  = score >= threshold ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Threshold marker */}
        <line
          x1={65 + (radius - 5) * Math.cos(2 * Math.PI * threshold / 100 - Math.PI / 2)}
          y1={65 + (radius - 5) * Math.sin(2 * Math.PI * threshold / 100 - Math.PI / 2)}
          x2={65 + (radius + 5) * Math.cos(2 * Math.PI * threshold / 100 - Math.PI / 2)}
          y2={65 + (radius + 5) * Math.sin(2 * Math.PI * threshold / 100 - Math.PI / 2)}
          stroke="white" strokeWidth="2"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-black" style={{ color }}>{score.toFixed(1)}%</span>
        <span className="text-xs text-slate-400">V10 Score</span>
      </div>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────

function FeatureCard({ feature, onExpand }: { feature: V10Feature; onExpand: () => void }) {
  const gap = Math.max(0, V10_THRESHOLD - feature.score);

  return (
    <div
      className={`rounded-xl border p-4 cursor-pointer hover:scale-[1.01] transition-all duration-200 ${
        feature.status === 'CERTIFIED'
          ? 'border-emerald-700/50 bg-emerald-950/20'
          : feature.status === 'FAILED'
          ? 'border-red-700/50 bg-red-950/20'
          : 'border-slate-700/50 bg-slate-800/30'
      }`}
      onClick={onExpand}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">{CLASS_ICONS[feature.class]}</span>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-white truncate">{feature.name}</div>
            <div className="text-xs text-slate-500 font-mono">{feature.id}</div>
          </div>
        </div>
        <StatusBadge status={feature.status} />
      </div>

      <ScoreBar score={feature.score} />

      {feature.status === 'PENDING' && (
        <p className="text-xs text-amber-400 mt-2">
          Gap: {gap.toFixed(1)}% below V10 gate
        </p>
      )}

      {feature.cert_id && (
        <p className="text-xs text-emerald-500 mt-1 font-mono truncate">🔒 {feature.cert_id}</p>
      )}
    </div>
  );
}

// ── Main V10 Dashboard ────────────────────────────────────────────────────────

export default function V10Dashboard() {
  const [report, setReport]             = useState<V10Report | null>(null);
  const [updates, setUpdates]           = useState<PlatformUpdate[]>([]);
  const [loading, setLoading]           = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [activeTab, setActiveTab]       = useState<'overview' | 'features' | 'updates' | 'auth'>('overview');
  const [expandedFeature, setExpandedFeature] = useState<V10Feature | null>(null);
  const [filterClass, setFilterClass]   = useState<FeatureClass | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<CertStatus | 'ALL'>('ALL');
  const [proposingImprove, setProposingImprove] = useState(false);
  const [improveResult, setImproveResult] = useState<string | null>(null);

  // ── Data Fetch ──────────────────────────────────────────────────────────────

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await fetch('/api/v10/report');
      const json = await res.json();
      if (json.success) setReport(json.report);
      else setError(json.error || 'Failed to load V10 report');
    } catch (e: any) {
      setError(`API unavailable: ${e.message}. Ensure server is running.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpdates = useCallback(async () => {
    try {
      setLoadingUpdates(true);
      const res  = await fetch('/api/v10/updates');
      const json = await res.json();
      if (json.success) setUpdates(json.updates || []);
    } catch { /* silent */ } finally {
      setLoadingUpdates(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
    fetchUpdates();
  }, [fetchReport, fetchUpdates]);

  // ── Propose Improvements ────────────────────────────────────────────────────

  const proposeImprovements = async () => {
    setProposingImprove(true);
    setImproveResult(null);
    try {
      const res  = await fetch('/api/v10/propose-improvements', { method: 'POST' });
      const json = await res.json();
      setImproveResult(json.message || `${json.proposals_queued} proposals queued`);
      fetchUpdates();
    } catch (e: any) {
      setImproveResult(`Error: ${e.message}`);
    } finally {
      setProposingImprove(false);
    }
  };

  // ── Filtered Features ──────────────────────────────────────────────────────

  const allFeatures = report
    ? [...report.certified_features, ...report.pending_features, ...report.failed_features]
    : [];

  const filteredFeatures = allFeatures.filter(f => {
    if (filterClass  !== 'ALL' && f.class  !== filterClass)  return false;
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
    return true;
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="text-slate-300 text-lg">Loading V10 Compliance Gate...</p>
        </div>
      </div>
    );
  }

  const pendingUpdates = updates.filter(u => u.status === 'PENDING');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl">
                  🏆
                </div>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight">V10 Certification Gate</h1>
                  <p className="text-xs text-slate-400">VeriTech-10 · Playbook Trading — Orb AI Universe v3.0</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {report && (
                <div className={`px-4 py-2 rounded-xl font-bold text-sm border ${
                  report.gate_status === 'OPEN'
                    ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
                    : 'bg-red-900/40 border-red-700 text-red-300'
                }`}>
                  {report.gate_status === 'OPEN' ? '🔓 GATE OPEN' : '🔐 GATE CLOSED'}
                </div>
              )}

              {pendingUpdates.length > 0 && (
                <div className="px-3 py-1 rounded-lg bg-amber-900/40 border border-amber-700 text-amber-300 text-xs font-bold">
                  ⏳ {pendingUpdates.length} update{pendingUpdates.length !== 1 ? 's' : ''} awaiting auth
                </div>
              )}

              <button
                onClick={fetchReport}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-slate-700">
            {([
              { id: 'overview',  label: '📊 Overview',  badge: null },
              { id: 'features',  label: '🗂️ Features',  badge: report?.total_features },
              { id: 'updates',   label: '📋 Updates',    badge: pendingUpdates.length > 0 ? pendingUpdates.length : null },
              { id: 'auth',      label: '🔐 Authorize',  badge: pendingUpdates.length > 0 ? pendingUpdates.length : null },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-600 text-white text-xs">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Error ──────────────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-300">
            <p className="font-bold">⚠️ API Error</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2 text-red-400">Make sure the server is running: <code className="bg-red-900/50 px-1 rounded">npm run dev:server</code></p>
          </div>
        )}

        {/* ── OVERVIEW TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'overview' && report && (
          <div className="space-y-8">

            {/* Gate Status Banner */}
            <div className={`rounded-2xl p-6 border-2 ${
              report.gate_status === 'OPEN'
                ? 'bg-emerald-950/30 border-emerald-600'
                : 'bg-red-950/30 border-red-700'
            }`}>
              <div className="flex items-center gap-6 flex-wrap">
                <GaugeCircle score={report.overall_score} />
                <div className="flex-1 min-w-0">
                  <h2 className={`text-2xl font-black mb-2 ${
                    report.gate_status === 'OPEN' ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {report.gate_status === 'OPEN' ? '✅ V10 Gate Open' : '🔐 V10 Gate Closed'}
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">{report.summary}</p>
                  <div className="mt-3 flex gap-3 flex-wrap">
                    <span className="text-xs text-slate-400">
                      Generated: {new Date(report.generated_at).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      Approver: <span className="text-amber-400 font-bold">{report.human_approver}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      Threshold: <span className="text-white font-bold">{report.threshold}%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Features',  value: report.total_features,    color: 'text-white',         icon: '📦' },
                { label: 'Certified',        value: report.certified_count,    color: 'text-emerald-400',   icon: '✅' },
                { label: 'Pending',          value: report.pending_count,      color: 'text-amber-400',     icon: '⏳' },
                { label: 'Failed',           value: report.failed_count,       color: 'text-red-400',       icon: '❌' },
              ].map(m => (
                <div key={m.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className={`text-3xl font-black ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Feature Class Breakdown */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-bold text-lg mb-4">Feature Classes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(CLASS_ICONS) as FeatureClass[]).map(cls => {
                  const features = allFeatures.filter(f => f.class === cls);
                  const certified = features.filter(f => f.status === 'CERTIFIED').length;
                  const avgScore  = features.length > 0
                    ? features.reduce((s, f) => s + f.score, 0) / features.length
                    : 0;
                  return (
                    <button
                      key={cls}
                      onClick={() => { setActiveTab('features'); setFilterClass(cls); }}
                      className="bg-slate-700/40 hover:bg-slate-700/70 rounded-xl p-3 border border-slate-600/40 text-left transition-colors"
                    >
                      <div className="text-xl mb-1">{CLASS_ICONS[cls]}</div>
                      <div className="font-bold text-sm">{cls}</div>
                      <div className="text-xs text-slate-400">{features.length} features</div>
                      <div className="text-xs text-emerald-400">{certified}/{features.length} certified</div>
                      <ScoreBar score={avgScore} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Critical Gaps */}
            {report.critical_gaps.length > 0 && (
              <div className="bg-red-950/20 rounded-2xl border border-red-800/40 p-6">
                <h3 className="font-bold text-lg mb-3 text-red-300">⚠️ Critical Gaps (Score &lt; 50%)</h3>
                <ul className="space-y-2">
                  {report.critical_gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-200">
                      <span className="text-red-500 mt-0.5">→</span>
                      <span className="font-mono text-xs">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Self-Improve Button */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-bold text-lg mb-2">🤖 Self-Improvement Engine</h3>
              <p className="text-sm text-slate-400 mb-4">
                The platform can auto-propose improvements for all features below the V10 threshold.
                All proposals queue for <span className="text-amber-400 font-bold">{report.human_approver}</span>'s
                authorization before any changes are applied.
              </p>
              <button
                onClick={proposeImprovements}
                disabled={proposingImprove}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                {proposingImprove ? '⏳ Proposing...' : '💡 Propose Improvements for Pending Features'}
              </button>
              {improveResult && (
                <p className="mt-3 text-sm text-emerald-400">{improveResult}</p>
              )}
            </div>

          </div>
        )}

        {/* ── FEATURES TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'features' && (
          <div className="space-y-6">

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value as any)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="ALL">All Classes</option>
                {(Object.keys(CLASS_ICONS) as FeatureClass[]).map(c => (
                  <option key={c} value={c}>{CLASS_ICONS[c]} {c}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value="ALL">All Statuses</option>
                {(['CERTIFIED', 'PENDING', 'FAILED', 'REVIEW', 'DEPRECATED'] as CertStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <span className="text-slate-400 text-sm self-center">
                {filteredFeatures.length} of {allFeatures.length} features
              </span>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatures.map(feature => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onExpand={() => setExpandedFeature(expandedFeature?.id === feature.id ? null : feature)}
                />
              ))}
            </div>

            {/* Expanded Feature Detail */}
            {expandedFeature && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{CLASS_ICONS[expandedFeature.class]}</span>
                        <h3 className="text-xl font-black">{expandedFeature.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{expandedFeature.id}</p>
                    </div>
                    <button onClick={() => setExpandedFeature(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
                  </div>

                  <StatusBadge status={expandedFeature.status} />

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">V10 Score</p>
                      <ScoreBar score={expandedFeature.score} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Description</p>
                      <p className="text-sm text-slate-300">{expandedFeature.description}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Implementation File</p>
                      <code className="text-xs text-emerald-400 bg-slate-800 px-2 py-1 rounded">
                        {expandedFeature.implementation_file}
                      </code>
                    </div>

                    {expandedFeature.cert_id && (
                      <div className="bg-emerald-950/30 rounded-lg p-3 border border-emerald-800">
                        <p className="text-xs text-emerald-400 font-mono font-bold">🏆 CERT ID: {expandedFeature.cert_id}</p>
                        <p className="text-xs text-slate-400 mt-1">Issued: {new Date(expandedFeature.cert_issued_at!).toLocaleString()}</p>
                      </div>
                    )}

                    {expandedFeature.evidence.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-2">Evidence</p>
                        <div className="space-y-2">
                          {expandedFeature.evidence.map((ev, i) => (
                            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${
                              ev.passed ? 'bg-emerald-950/20' : 'bg-red-950/20'
                            }`}>
                              <span>{ev.passed ? '✅' : '❌'}</span>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-mono text-slate-300">{ev.type}</span>
                                <p className="text-xs text-slate-400 truncate">{ev.description}</p>
                              </div>
                              <span className={`text-sm font-bold ${ev.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                {ev.score.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {expandedFeature.notes && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Notes</p>
                        <p className="text-xs text-slate-300 bg-slate-800 rounded p-2">{expandedFeature.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── UPDATES TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Platform Updates Queue</h2>
              <button onClick={fetchUpdates} className="text-sm text-slate-400 hover:text-white">
                {loadingUpdates ? '⏳' : '🔄'} Refresh
              </button>
            </div>

            {updates.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <div className="text-4xl mb-3">📭</div>
                <p>No updates in queue. Use "Propose Improvements" on the Overview tab.</p>
              </div>
            ) : (
              updates.map(update => (
                <div key={update.id} className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UpdateStatusBadge status={update.status} />
                        <span className={`text-xs px-2 py-0.5 rounded ${IMPACT_COLORS[update.impact]}`}>
                          {update.impact}
                        </span>
                        <span className="text-xs text-slate-500">{update.category}</span>
                      </div>
                      <h3 className="font-bold text-white">{update.title}</h3>
                      <p className="text-xs text-slate-500 font-mono">{update.id} · {update.target_feature}</p>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(update.proposed_at).toLocaleString()}</span>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{update.description}</p>

                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-700/40 rounded p-2">
                      <p className="text-slate-400 font-bold mb-1">Proposed Change</p>
                      <p className="text-slate-300">{update.proposed_change}</p>
                    </div>
                    <div className="bg-slate-700/40 rounded p-2">
                      <p className="text-slate-400 font-bold mb-1">Expected Benefit</p>
                      <p className="text-slate-300">{update.expected_benefit}</p>
                    </div>
                  </div>

                  {update.reviewed_by && (
                    <div className="mt-3 text-xs text-slate-400">
                      Reviewed by <span className="text-amber-400 font-bold">{update.reviewed_by}</span> —{' '}
                      {update.review_notes}
                    </div>
                  )}

                  {update.proposer === 'AI_AGENT' && update.status === 'PENDING' && (
                    <div className="mt-3 text-xs text-amber-400">
                      🤖 AI-proposed — awaiting <strong>Darryl</strong>'s authorization via <code className="bg-slate-700 px-1 rounded">POST /api/v10/updates/{update.id}/authorize?approver=Darryl</code>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── AUTH TAB ───────────────────────────────────────────────────────── */}
        {activeTab === 'auth' && (
          <div className="space-y-6">
            <div className="bg-amber-950/30 rounded-2xl border border-amber-700/50 p-6">
              <h2 className="text-xl font-bold text-amber-300 mb-2">🔐 Authorization Center</h2>
              <p className="text-sm text-slate-300">
                Only <span className="text-amber-400 font-bold">Darryl</span> can authorize or reject platform updates.
                Use the API endpoints below or the interactive forms.
              </p>
            </div>

            {pendingUpdates.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-3">✅</div>
                <p>No pending updates require authorization.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-amber-300">⏳ Pending Authorization ({pendingUpdates.length})</h3>
                {pendingUpdates.map(update => (
                  <AuthCard
                    key={update.id}
                    update={update}
                    onAction={fetchUpdates}
                  />
                ))}
              </div>
            )}

            {/* API Reference */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-bold mb-3">📡 API Reference</h3>
              <div className="space-y-2 font-mono text-xs">
                {[
                  ['GET',  '/api/v10/report',                                'Full V10 compliance report'],
                  ['GET',  '/api/v10/features',                              'All features + scores'],
                  ['POST', '/api/v10/features/:id/evidence',                 'Submit evidence for a feature'],
                  ['GET',  '/api/v10/updates',                               'All updates queue'],
                  ['POST', '/api/v10/updates',                               'Propose new update'],
                  ['POST', '/api/v10/updates/:id/authorize?approver=Darryl', 'AUTHORIZE update (Darryl only)'],
                  ['POST', '/api/v10/updates/:id/reject?approver=Darryl',    'REJECT update (Darryl only)'],
                  ['POST', '/api/v10/propose-improvements',                  'Auto-propose V10 gap fixes'],
                ].map(([method, path, desc]) => (
                  <div key={path} className="flex gap-3 items-start p-2 bg-slate-700/30 rounded">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                      method === 'GET' ? 'bg-blue-900 text-blue-300' : 'bg-emerald-900 text-emerald-300'
                    }`}>{method}</span>
                    <span className="text-slate-300 flex-1">{path}</span>
                    <span className="text-slate-500 text-right">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── Auth Card Component ───────────────────────────────────────────────────────

function AuthCard({ update, onAction }: { update: PlatformUpdate; onAction: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<string | null>(null);
  const [approver, setApprover] = useState('Darryl');
  const [notes, setNotes]     = useState('');

  const handleAuth = async (action: 'authorize' | 'reject') => {
    setLoading(true);
    setResult(null);
    try {
      const body: Record<string, string> = { approver };
      if (action === 'authorize' && notes) body.notes = notes;
      if (action === 'reject')            body.reason = notes || 'Rejected by ' + approver;

      const res  = await fetch(`/api/v10/updates/${update.id}/${action}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      setResult(json.message || (json.success ? '✅ Done' : `❌ ${json.error}`));
      if (json.success) onAction();
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 rounded-xl border border-amber-700/30 p-5">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div>
          <h4 className="font-bold text-white">{update.title}</h4>
          <p className="text-xs text-slate-500 font-mono">{update.id} · {update.target_feature}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${IMPACT_COLORS[update.impact]}`}>{update.impact}</span>
      </div>

      <p className="text-sm text-slate-300 mb-3">{update.proposed_change}</p>
      <p className="text-xs text-slate-400 mb-4">Expected: {update.expected_benefit}</p>

      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-40">
          <label className="text-xs text-slate-400 mb-1 block">Authorizer Name</label>
          <input
            value={approver}
            onChange={e => setApprover(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
            placeholder="Darryl"
          />
        </div>
        <div className="flex-2 min-w-48">
          <label className="text-xs text-slate-400 mb-1 block">Notes / Reason</label>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
            placeholder="Optional notes..."
          />
        </div>
        <button
          onClick={() => handleAuth('authorize')}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          ✅ Authorize
        </button>
        <button
          onClick={() => handleAuth('reject')}
          disabled={loading}
          className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
        >
          ❌ Reject
        </button>
      </div>

      {result && (
        <p className={`mt-3 text-sm ${result.startsWith('✅') ? 'text-emerald-400' : 'text-red-400'}`}>
          {result}
        </p>
      )}
    </div>
  );
}
