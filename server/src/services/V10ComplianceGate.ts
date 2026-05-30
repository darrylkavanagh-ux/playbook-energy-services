/**
 * V10 COMPLIANCE GATE
 * =============================================================================
 * VeriTech-10 (V10) certification engine for Playbook Trading Platform.
 *
 * THE GATE:
 *   Every platform feature is scored against the V10 certification threshold.
 *   THRESHOLD: 98.5% — The gate is CLOSED until this level is reached.
 *   Features that pass are CERTIFIED. Features below threshold are PENDING.
 *
 * CERTIFICATION MODEL:
 *   - AI provides mathematical ceiling: up to 98.5% confidence
 *   - Licensed trader (Darryl) provides final 1.5% via HITL sign-off
 *   - Combined: 100% certified signal path
 *   - No signal exits without reaching the threshold or human override
 *
 * CERT ID FORMAT: V10-{CLASS}-{timestamp}-{random6}
 *   CLASS:  SIGNAL | SERVICE | ENGINE | UI | INFRA | DATA | PROTOCOL
 *   e.g.    V10-SIGNAL-20250530-A3F7K2
 *
 * FEATURE REGISTRY:
 *   All features are pre-registered with required evidence scores.
 *   Each feature tracks: implementation, test coverage, accuracy, uptime.
 *
 * SELF-UPDATE PROTOCOL:
 *   Platform can propose updates to any feature.
 *   Updates queue to PendingAuthorization.
 *   DARRYL must approve before any update is applied.
 *   Full audit trail maintained.
 */

import { createHash } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

// ── Constants ─────────────────────────────────────────────────────────────────

export const V10_THRESHOLD        = 98.5;    // Gate threshold %
export const CERT_VERSION         = 'V10';
export const AUTHORIZED_APPROVER  = 'Darryl';  // Human-in-the-loop approver

// ── Enumerations ──────────────────────────────────────────────────────────────

export type FeatureClass =
  | 'SIGNAL'     // Trading signal generation
  | 'SERVICE'    // Backend service
  | 'ENGINE'     // Core trading engine
  | 'UI'         // Frontend component
  | 'INFRA'      // Infrastructure (DB, cache, WS)
  | 'DATA'       // Data pipeline
  | 'PROTOCOL';  // Integration protocol (FIX, webhook)

export type CertStatus =
  | 'CERTIFIED'  // ≥ 98.5% — gate passed
  | 'PENDING'    // < 98.5% — gate closed
  | 'FAILED'     // Critical test failure
  | 'DEPRECATED' // No longer active
  | 'REVIEW';    // Under human review

export type EvidenceType =
  | 'UNIT_TEST'        // Automated unit test pass rate
  | 'INTEGRATION_TEST' // Integration test pass rate
  | 'ACCURACY_SCORE'   // Historical accuracy / signal win rate
  | 'UPTIME'           // Service uptime %
  | 'CODE_COVERAGE'    // Test coverage %
  | 'MANUAL_REVIEW'    // Human code review sign-off
  | 'LOAD_TEST'        // Performance under load
  | 'SECURITY_SCAN';   // Security vulnerability scan

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface EvidenceRecord {
  type:         EvidenceType;
  score:        number;          // 0–100
  description:  string;
  tested_at:    string;          // ISO8601
  passed:       boolean;
}

export interface V10Feature {
  id:                 string;     // Unique feature ID
  name:               string;
  class:              FeatureClass;
  description:        string;
  implementation_file: string;    // Primary file path
  status:             CertStatus;
  score:              number;     // Composite V10 score 0–100
  threshold:          number;     // Usually 98.5
  evidence:           EvidenceRecord[];
  cert_id:            string | null;
  cert_issued_at:     string | null;
  data_hash:          string | null;  // SHA-256 of implementation snapshot
  dependencies:       string[];   // Other feature IDs this depends on
  notes:              string;
  last_evaluated_at:  string;
}

export interface CertificationResult {
  feature_id:    string;
  certified:     boolean;
  score:         number;
  threshold:     number;
  cert_id:       string | null;
  gap:           number;          // threshold - score (positive = still needed)
  evidence_count: number;
  notes:         string;
  issued_at:     string;
}

export interface PlatformV10Report {
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

// ── Feature Registry ──────────────────────────────────────────────────────────

const FEATURE_REGISTRY: Omit<V10Feature, 'status' | 'score' | 'cert_id' | 'cert_issued_at' | 'data_hash' | 'last_evaluated_at'>[] = [

  // ── ENGINES ──────────────────────────────────────────────────────────────

  {
    id:                  'ENG-001',
    name:                'MultiAssetTradingEngine',
    class:               'ENGINE',
    description:         'Architecture B engine: Wilder RSI, EMA-MACD, Bollinger Bands, ATR, S/R detection. 4-layer scoring: Technical 45% + Volume 20% + Momentum 20% + Asset-specific 15%.',
    implementation_file: 'server/src/engines/MultiAssetTradingEngine.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Core signal engine. Must maintain ≥98.5% mathematical accuracy ceiling.',
  },
  {
    id:                  'ENG-002',
    name:                'FractalPatternMatcher',
    class:               'ENGINE',
    description:         'Dynamic Time Warping (DTW) pattern recognition. 17 built-in patterns (7 bullish, 6 bearish, 3 neutral). Sakoe-Chiba band optimisation.',
    implementation_file: 'server/src/engines/FractalPatternMatcher.ts',
    evidence:            [],
    dependencies:        ['ENG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Supplementary confirmation layer. Not yet wired to main signal pipeline.',
  },

  // ── SIGNALS ───────────────────────────────────────────────────────────────

  {
    id:                  'SIG-001',
    name:                'SignalCalibrationService',
    class:               'SIGNAL',
    description:         'Isotonic regression (PAV algorithm). 10 confidence bins. ECE/MCE/Brier score metrics. Auto-retrains every 10 resolved outcomes.',
    implementation_file: 'server/src/services/SignalCalibrationService.ts',
    evidence:            [],
    dependencies:        ['ENG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Converts raw 50–98.5% confidence to calibrated probabilities. Critical for V10 accuracy gate.',
  },
  {
    id:                  'SIG-002',
    name:                'OracleEngine',
    class:               'SIGNAL',
    description:         '12-pillar oracle scoring: technical confluence, news sentiment, CB NLP, smart money, institutional flow. Filters Architecture B output to 74–87% accuracy band.',
    implementation_file: 'client/src/pages/OracleEngine.tsx',
    evidence:            [],
    dependencies:        ['ENG-001', 'SIG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Oracle UI complete. Backend oracle scoring engine integration pending.',
  },
  {
    id:                  'SIG-003',
    name:                'OutcomeTracker',
    class:               'SIGNAL',
    description:         'Tracks signal outcomes (WIN/LOSS/PARTIAL). Records P&L, pip delta, accuracy rate. Triggers calibration rebuild every 10 resolved outcomes.',
    implementation_file: 'server/src/services/OutcomeTracker.ts',
    evidence:            [],
    dependencies:        ['SIG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Dual persistence to JSON + Supabase implemented.',
  },

  // ── SERVICES ─────────────────────────────────────────────────────────────

  {
    id:                  'SVC-001',
    name:                'SupabaseService',
    class:               'SERVICE',
    description:         'Supabase client + all 12 Playbook Trading tables. Full SQL DDL migration. RLS policies. Graceful degradation to JSON when SUPABASE_URL not set.',
    implementation_file: 'server/src/services/SupabaseService.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Tables: trading_signals, phantom_trades, signal_outcomes, oracle_scores, phantom_account, equity_curve, hitl_reviews, calibration_snapshots, playbook_users, cb_nlp_scores, smart_money_flow, webhook_endpoints.',
  },
  {
    id:                  'SVC-002',
    name:                'PhantomAccountService',
    class:               'SERVICE',
    description:         'Paper trading account simulation. Tracks equity curve, open/closed trades, P&L, drawdown. Dual persistence to JSON + Supabase.',
    implementation_file: 'server/src/services/PhantomAccountService.ts',
    evidence:            [],
    dependencies:        ['SVC-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Starting balance configurable. Equity curve synced to Supabase on every trade.',
  },
  {
    id:                  'SVC-003',
    name:                'CentralBankNLPService',
    class:               'SERVICE',
    description:         'FED/ECB/BOE/BOJ/BIS hawkish/dovish scorer. 31 hawkish + 30 dovish keywords weighted 1–3. Currency impact mapping. Divergence signal computation.',
    implementation_file: 'server/src/services/CentralBankNLPService.ts',
    evidence:            [],
    dependencies:        ['SVC-001'],
    threshold:           V10_THRESHOLD,
    notes:               'API endpoints wired. 61 keywords total across 5 central banks.',
  },
  {
    id:                  'SVC-004',
    name:                'SmartMoneyFlowService',
    class:               'SERVICE',
    description:         'CFTC COT processor + options overlay. Reversal detection at extremes. Institutional sentiment -100 to +100. GEX gamma exposure.',
    implementation_file: 'server/src/services/SmartMoneyFlowService.ts',
    evidence:            [],
    dependencies:        ['SVC-001'],
    threshold:           V10_THRESHOLD,
    notes:               'API endpoints wired. CFTC COT auto-fetch pending (manual input works).',
  },
  {
    id:                  'SVC-005',
    name:                'WebhookService',
    class:               'SERVICE',
    description:         'Outbound webhook delivery. SLACK/TEAMS/DISCORD/CUSTOM formatters. HMAC-SHA256 X-Playbook-Signature. 3 retries with exponential backoff.',
    implementation_file: 'server/src/services/WebhookService.ts',
    evidence:            [],
    dependencies:        ['SVC-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Webhook endpoint registry in Supabase. Fire-and-forget delivery.',
  },
  {
    id:                  'SVC-006',
    name:                'MarketDataService',
    class:               'SERVICE',
    description:         'Live price data fetcher for forex, crypto, stocks. Multi-provider fallback.',
    implementation_file: 'server/src/services/MarketDataService.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Currently uses external APIs with no caching. RedisCache integration pending.',
  },
  {
    id:                  'SVC-007',
    name:                'RedisCache',
    class:               'SERVICE',
    description:         'L1 in-memory + L2 Redis two-tier cache. Market data 60s TTL. Rate limiting per API key. Signal deduplication.',
    implementation_file: 'server/src/services/RedisCache.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Service built. Not yet wired to MarketDataService or trading routes.',
  },

  // ── INFRASTRUCTURE ────────────────────────────────────────────────────────

  {
    id:                  'INF-001',
    name:                'WebSocketServer',
    class:               'INFRA',
    description:         'WebSocket server on /ws path. __playbookBroadcast() global. Heartbeat keepalive. Max client limit configurable.',
    implementation_file: 'server/index.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Built into server/index.ts. Broadcasts SIGNAL_GENERATED, CB_NLP_SCORED, SMART_MONEY_UPDATED events.',
  },
  {
    id:                  'INF-002',
    name:                'ExpressServer',
    class:               'INFRA',
    description:         'Full Express server with CORS, security headers, graceful shutdown. Dynamic route loading with stub fallback.',
    implementation_file: 'server/index.ts',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Replaces the static-file stub. All trading API routes reachable.',
  },
  {
    id:                  'INF-003',
    name:                'BuildPipeline',
    class:               'INFRA',
    description:         'Dual TypeScript build: vite for client, tsc for server. railway.toml deployment config. npm run build produces dist/server.js + dist/public/.',
    implementation_file: 'package.json',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Build pipeline verified working. tsconfig.json + tsconfig.server.json both present.',
  },
  {
    id:                  'INF-004',
    name:                'CIWorkflow',
    class:               'INFRA',
    description:         '6-job GitHub Actions CI: type-check, security-scan, v10-compliance, supabase-check, trading-smoke-test, build.',
    implementation_file: '.github/workflows/ci.yml',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Complete rewrite this session. PAV unit test + NLP keyword test in CI.',
  },

  // ── UI COMPONENTS ─────────────────────────────────────────────────────────

  {
    id:                  'UI-001',
    name:                'TradingPage',
    class:               'UI',
    description:         'Main trading dashboard. 7 tabs: Signals, Phantom, History, Oracle, Assets, News, Calibration. Playbook Trading v3.0 branding.',
    implementation_file: 'client/src/pages/Trading.tsx',
    evidence:            [],
    dependencies:        ['ENG-001', 'SIG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'CalibrationTab (7th tab) with isotonic regression viewer added.',
  },
  {
    id:                  'UI-002',
    name:                'OracleEnginePage',
    class:               'UI',
    description:         'Oracle Engine strategic vision page. 12-pillar accuracy stack visualisation. Oracle scores, trader wishes, pricing tiers.',
    implementation_file: 'client/src/pages/OracleEngine.tsx',
    evidence:            [],
    dependencies:        ['SIG-002'],
    threshold:           V10_THRESHOLD,
    notes:               'Header updated to v3.0 branding.',
  },
  {
    id:                  'UI-003',
    name:                'V10Dashboard',
    class:               'UI',
    description:         'V10 certification dashboard. Shows certified vs pending features, overall score, authorization queue, sign-over status.',
    implementation_file: 'client/src/pages/V10Dashboard.tsx',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'Being built this session.',
  },

  // ── DATA PIPELINES ────────────────────────────────────────────────────────

  {
    id:                  'DAT-001',
    name:                'JSONFallbackPersistence',
    class:               'DATA',
    description:         'JSON file persistence layer for all trading data when Supabase not configured. data/ directory tracked by git.',
    implementation_file: 'data/.gitkeep',
    evidence:            [],
    dependencies:        [],
    threshold:           V10_THRESHOLD,
    notes:               'data/.gitkeep created. PhantomAccountService + OutcomeTracker use JSON persistence.',
  },
  {
    id:                  'DAT-002',
    name:                'SupabaseDualPersistence',
    class:               'DATA',
    description:         'Fire-and-forget async writes to Supabase for every signal, trade, outcome, equity point. Never blocks request.',
    implementation_file: 'server/src/services/SupabaseService.ts',
    evidence:            [],
    dependencies:        ['SVC-001', 'DAT-001'],
    threshold:           V10_THRESHOLD,
    notes:               'Wired into PhantomAccountService, OutcomeTracker, trading.ts routes.',
  },

  // ── PROTOCOLS ─────────────────────────────────────────────────────────────

  {
    id:                  'PRO-001',
    name:                'WebhookDelivery',
    class:               'PROTOCOL',
    description:         'Outbound webhook delivery. HMAC-SHA256 signature. 3 retries with 1s/2s/4s backoff. Supabase endpoint registry.',
    implementation_file: 'server/src/services/WebhookService.ts',
    evidence:            [],
    dependencies:        ['SVC-005'],
    threshold:           V10_THRESHOLD,
    notes:               'SLACK/TEAMS/DISCORD/CUSTOM formatters implemented.',
  },
  {
    id:                  'PRO-002',
    name:                'FIXProtocol',
    class:               'PROTOCOL',
    description:         'FIX 4.4 order management interface for institutional broker connectivity.',
    implementation_file: 'server/src/protocols/FIXGateway.ts',
    evidence:            [],
    dependencies:        ['ENG-001'],
    threshold:           V10_THRESHOLD,
    notes:               'NOT YET BUILT. P2 feature.',
  },
];

// ── V10ComplianceGate Class ───────────────────────────────────────────────────

export class V10ComplianceGate {

  private features = new Map<string, V10Feature>();
  private persistPath: string;

  constructor() {
    this.persistPath = path.resolve(process.cwd(), 'data', 'v10_compliance.json');
    this.initializeRegistry();
  }

  // ── Initialisation ──────────────────────────────────────────────────────────

  private initializeRegistry(): void {
    // Load persisted state if exists
    const persisted = this.loadState();

    for (const spec of FEATURE_REGISTRY) {
      const existing = persisted.get(spec.id);
      const feature: V10Feature = {
        ...spec,
        status:            existing?.status            || 'PENDING',
        score:             existing?.score             ?? 0,
        evidence:          existing?.evidence          || [],
        cert_id:           existing?.cert_id           || null,
        cert_issued_at:    existing?.cert_issued_at    || null,
        data_hash:         existing?.data_hash         || null,
        last_evaluated_at: existing?.last_evaluated_at || new Date().toISOString(),
      };
      this.features.set(spec.id, feature);
    }
  }

  // ── Evidence Submission ─────────────────────────────────────────────────────

  /**
   * Submit evidence for a feature.
   * After submission, automatically re-evaluates the feature score.
   */
  submitEvidence(
    featureId: string,
    evidence:  EvidenceRecord,
  ): { accepted: boolean; feature?: V10Feature; error?: string } {
    const feature = this.features.get(featureId);
    if (!feature) {
      return { accepted: false, error: `Feature ${featureId} not found in registry` };
    }

    // Replace existing evidence of same type or append
    const existingIdx = feature.evidence.findIndex(e => e.type === evidence.type);
    if (existingIdx >= 0) {
      feature.evidence[existingIdx] = evidence;
    } else {
      feature.evidence.push(evidence);
    }

    // Re-evaluate score
    this.evaluateFeature(featureId);
    this.saveState();

    return { accepted: true, feature: this.features.get(featureId) };
  }

  // ── Evaluation ──────────────────────────────────────────────────────────────

  /**
   * Evaluate a single feature against the V10 threshold.
   * Score = weighted average of all evidence records.
   *
   * Evidence weights:
   *   UNIT_TEST:        25%
   *   INTEGRATION_TEST: 20%
   *   ACCURACY_SCORE:   25%
   *   UPTIME:           10%
   *   CODE_COVERAGE:    10%
   *   MANUAL_REVIEW:    10%
   *   (LOAD_TEST, SECURITY_SCAN: bonus points)
   */
  evaluateFeature(featureId: string): CertificationResult {
    const feature = this.features.get(featureId);
    if (!feature) {
      return {
        feature_id:     featureId,
        certified:      false,
        score:          0,
        threshold:      V10_THRESHOLD,
        cert_id:        null,
        gap:            V10_THRESHOLD,
        evidence_count: 0,
        notes:          'Feature not found',
        issued_at:      new Date().toISOString(),
      };
    }

    const weights: Record<EvidenceType, number> = {
      UNIT_TEST:        0.25,
      INTEGRATION_TEST: 0.20,
      ACCURACY_SCORE:   0.25,
      UPTIME:           0.10,
      CODE_COVERAGE:    0.10,
      MANUAL_REVIEW:    0.10,
      LOAD_TEST:        0.05,
      SECURITY_SCAN:    0.05,
    };

    if (feature.evidence.length === 0) {
      feature.score            = 0;
      feature.status           = 'PENDING';
      feature.last_evaluated_at = new Date().toISOString();
      return {
        feature_id:     featureId,
        certified:      false,
        score:          0,
        threshold:      V10_THRESHOLD,
        cert_id:        null,
        gap:            V10_THRESHOLD,
        evidence_count: 0,
        notes:          'No evidence submitted. Submit UNIT_TEST, ACCURACY_SCORE, and MANUAL_REVIEW evidence to progress.',
        issued_at:      new Date().toISOString(),
      };
    }

    // Compute weighted score
    let totalWeight  = 0;
    let weightedSum  = 0;
    let anyFailed    = false;

    for (const ev of feature.evidence) {
      const w        = weights[ev.type] || 0.05;
      weightedSum   += ev.score * w;
      totalWeight   += w;
      if (!ev.passed) anyFailed = true;
    }

    // Normalise to 0–100 range
    const rawScore = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
    feature.score  = Math.min(100, Math.max(0, rawScore));

    // Determine status
    if (anyFailed) {
      feature.status = 'FAILED';
    } else if (feature.score >= V10_THRESHOLD) {
      feature.status = 'CERTIFIED';
      if (!feature.cert_id) {
        feature.cert_id        = this.generateCertId(feature);
        feature.cert_issued_at = new Date().toISOString();
        feature.data_hash      = this.computeDataHash(feature);
      }
    } else {
      feature.status = 'PENDING';
    }

    feature.last_evaluated_at = new Date().toISOString();

    const gap = Math.max(0, V10_THRESHOLD - feature.score);

    return {
      feature_id:     featureId,
      certified:      feature.status === 'CERTIFIED',
      score:          Math.round(feature.score * 10) / 10,
      threshold:      V10_THRESHOLD,
      cert_id:        feature.cert_id,
      gap:            Math.round(gap * 10) / 10,
      evidence_count: feature.evidence.length,
      notes:          feature.status === 'CERTIFIED'
        ? `CERTIFIED — V10 threshold met. Cert: ${feature.cert_id}`
        : `PENDING — ${gap.toFixed(1)}% below V10 threshold. Need: ${this.getMissingEvidenceHint(feature)}`,
      issued_at: new Date().toISOString(),
    };
  }

  /** Evaluate ALL features and return comprehensive report */
  evaluateAll(): V10Feature[] {
    for (const id of this.features.keys()) {
      this.evaluateFeature(id);
    }
    this.saveState();
    return Array.from(this.features.values());
  }

  // ── Platform Report ─────────────────────────────────────────────────────────

  generateReport(): PlatformV10Report {
    this.evaluateAll();

    const all        = Array.from(this.features.values());
    const certified  = all.filter(f => f.status === 'CERTIFIED');
    const pending    = all.filter(f => f.status === 'PENDING');
    const failed     = all.filter(f => f.status === 'FAILED');

    const totalScore = all.length > 0
      ? all.reduce((sum, f) => sum + f.score, 0) / all.length
      : 0;

    const criticalGaps = pending
      .filter(f => f.score < 50)
      .map(f => `${f.id} ${f.name}: ${f.score.toFixed(1)}% (gap: ${(V10_THRESHOLD - f.score).toFixed(1)}%)`);

    const signOffReady = certified.length > 0 && failed.length === 0;

    const gateStatus: 'OPEN' | 'CLOSED' = totalScore >= V10_THRESHOLD ? 'OPEN' : 'CLOSED';

    const summary = gateStatus === 'OPEN'
      ? `✅ V10 GATE OPEN — Platform score ${totalScore.toFixed(1)}% meets the ${V10_THRESHOLD}% threshold. ${certified.length} features certified.`
      : `🔴 V10 GATE CLOSED — Platform score ${totalScore.toFixed(1)}% below ${V10_THRESHOLD}% threshold. ${pending.length} features pending. ${criticalGaps.length} critical gaps.`;

    return {
      generated_at:       new Date().toISOString(),
      platform_name:      'Playbook Trading — Orb AI Universe v3.0',
      cert_version:       CERT_VERSION,
      overall_score:      Math.round(totalScore * 10) / 10,
      threshold:          V10_THRESHOLD,
      gate_status:        gateStatus,
      certified_count:    certified.length,
      pending_count:      pending.length,
      failed_count:       failed.length,
      total_features:     all.length,
      certified_features: certified,
      pending_features:   pending,
      failed_features:    failed,
      critical_gaps:      criticalGaps,
      sign_off_ready:     signOffReady,
      human_approver:     AUTHORIZED_APPROVER,
      summary,
    };
  }

  // ── Query Methods ───────────────────────────────────────────────────────────

  getFeature(id: string): V10Feature | undefined {
    return this.features.get(id);
  }

  getAll(): V10Feature[] {
    return Array.from(this.features.values());
  }

  getCertified(): V10Feature[] {
    return this.getAll().filter(f => f.status === 'CERTIFIED');
  }

  getPending(): V10Feature[] {
    return this.getAll().filter(f => f.status === 'PENDING');
  }

  getFailed(): V10Feature[] {
    return this.getAll().filter(f => f.status === 'FAILED');
  }

  getByClass(cls: FeatureClass): V10Feature[] {
    return this.getAll().filter(f => f.class === cls);
  }

  getOverallScore(): number {
    const all = this.getAll();
    if (all.length === 0) return 0;
    return all.reduce((sum, f) => sum + f.score, 0) / all.length;
  }

  isGateOpen(): boolean {
    return this.getOverallScore() >= V10_THRESHOLD;
  }

  // ── Cert ID + Hash ─────────────────────────────────────────────────────────

  private generateCertId(feature: V10Feature): string {
    const ts     = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 8);
    const random = Math.random().toString(36).toUpperCase().slice(2, 8);
    return `${CERT_VERSION}-${feature.class}-${ts}-${random}`;
  }

  private computeDataHash(feature: V10Feature): string {
    const data = JSON.stringify({
      id:          feature.id,
      name:        feature.name,
      score:       feature.score,
      evidence:    feature.evidence,
      cert_issued: feature.cert_issued_at,
    });
    return createHash('sha256').update(data).digest('hex').slice(0, 16).toUpperCase();
  }

  // ── Evidence Hints ─────────────────────────────────────────────────────────

  private getMissingEvidenceHint(feature: V10Feature): string {
    const submitted = new Set(feature.evidence.map(e => e.type));
    const missing   = (['UNIT_TEST', 'ACCURACY_SCORE', 'MANUAL_REVIEW'] as EvidenceType[])
      .filter(t => !submitted.has(t));
    return missing.length > 0
      ? `submit evidence for: ${missing.join(', ')}`
      : 'improve scores on submitted evidence';
  }

  // ── Persistence ─────────────────────────────────────────────────────────────

  private saveState(): void {
    try {
      const state: Record<string, V10Feature> = {};
      for (const [id, f] of this.features.entries()) {
        state[id] = f;
      }
      writeFileSync(this.persistPath, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // data/ dir may not exist in CI — silent fail
    }
  }

  private loadState(): Map<string, V10Feature> {
    const m = new Map<string, V10Feature>();
    try {
      if (existsSync(this.persistPath)) {
        const raw   = readFileSync(this.persistPath, 'utf-8');
        const state = JSON.parse(raw) as Record<string, V10Feature>;
        for (const [id, f] of Object.entries(state)) {
          m.set(id, f);
        }
      }
    } catch {
      // Start fresh
    }
    return m;
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

export const v10Gate = new V10ComplianceGate();
export default v10Gate;
