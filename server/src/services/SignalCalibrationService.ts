/**
 * SIGNAL CALIBRATION SERVICE — ISOTONIC REGRESSION
 * =============================================================================
 * Converts raw confidence scores (arbitrary 50–98.5%) into calibrated
 * probabilities that reflect true empirical win rates.
 *
 * The Problem:
 *   A signal saying "confidence: 85%" might actually win 62% of the time.
 *   Without calibration, confidence scores are just relative rankings —
 *   not true probabilities.
 *
 * The Solution — Isotonic Regression:
 *   1. Group historical signals into confidence bins (e.g. 50–60%, 60–70%, …)
 *   2. Compute empirical win rate within each bin
 *   3. Apply isotonic regression to enforce monotonicity (higher confidence
 *      must never calibrate to LOWER probability than a lower confidence bin)
 *   4. Use piecewise-linear interpolation between bin midpoints for smooth
 *      probability estimates at any confidence level
 *
 * Why Isotonic Regression over Platt Scaling?
 *   - No parametric assumption about the shape of the calibration curve
 *   - Handles non-linear miscalibration (e.g. overconfidence at extremes)
 *   - Works well with small sample sizes (30+ resolved signals)
 *   - Result is a step function — easily explainable and auditable
 *
 * Reliability Curve (Expected Calibration Error):
 *   - We compute ECE to measure how well calibrated we are
 *   - ECE < 0.05 = excellent; ECE 0.05–0.10 = good; ECE > 0.10 = needs work
 *
 * Usage:
 *   const calibrator = new SignalCalibrationService();
 *   await calibrator.rebuild();                    // train on all resolved outcomes
 *   const prob = calibrator.calibrate(0.82);       // raw 82% → true probability
 *   const metrics = calibrator.getMetrics();       // ECE, bins, sample count
 *
 * Integration:
 *   Called automatically by OutcomeTracker after each outcome is recorded.
 *   Result stored in calibration_snapshots table in Supabase.
 *   Trading routes use calibrator.calibrate() before returning signal confidence.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabaseService, { isSupabaseEnabled } from './SupabaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CalibrationBin {
  bin_label:          string;       // e.g. "50–60%"
  confidence_min:     number;       // 0.50
  confidence_max:     number;       // 0.60
  midpoint:           number;       // 0.55
  sample_count:       number;
  win_count:          number;
  empirical_win_rate: number;       // raw win rate in this bin
  calibrated_prob:    number;       // after isotonic regression
}

export interface CalibrationMetrics {
  total_resolved_signals:    number;
  calibration_status:        'NOT_ENOUGH_DATA' | 'PRELIMINARY' | 'TRAINED' | 'ROBUST';
  expected_calibration_error: number;   // ECE — lower is better
  max_calibration_error:     number;   // MCE — worst single bin
  brier_score:               number;   // mean squared error of probability estimates
  reliability_score:         number;   // 1 - ECE, 0–100
  bins:                      CalibrationBin[];
  by_asset_class: {
    forex:  { ece: number; samples: number };
    crypto: { ece: number; samples: number };
    stock:  { ece: number; samples: number };
  };
  last_trained:              string | null;
  next_recommended_retrain:  string;
}

export interface IsotonicModel {
  x: number[];   // midpoints (sorted ascending)
  y: number[];   // calibrated probabilities (isotonic — non-decreasing)
  trained_at: string;
  sample_count: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ISOTONIC REGRESSION (Pool Adjacent Violators Algorithm)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pool Adjacent Violators (PAV) Algorithm
 *
 * Given a sequence y[] (not necessarily monotone), returns a non-decreasing
 * sequence that minimises the sum of squared errors.
 *
 * Time complexity: O(n) — linear pass with stack-based pooling.
 *
 * Reference: Ayer et al. (1955), "An empirical distribution function for
 * sampling with incomplete information"
 */
function poolAdjacentViolators(x: number[], y: number[], weights?: number[]): number[] {
  const n = x.length;
  if (n === 0) return [];
  if (n === 1) return [y[0]];

  const w = weights || new Array(n).fill(1);

  // Working arrays for the PAV blocks
  const blockMean:  number[] = [];
  const blockWeight: number[] = [];
  const blockSize:  number[] = [];

  for (let i = 0; i < n; i++) {
    blockMean.push(y[i]);
    blockWeight.push(w[i]);
    blockSize.push(1);

    // Pool adjacent violators: merge with previous block if it violates monotonicity
    while (blockMean.length >= 2) {
      const last = blockMean.length - 1;
      if (blockMean[last] < blockMean[last - 1]) {
        // Merge the last two blocks
        const totalW = blockWeight[last - 1] + blockWeight[last];
        const mergedMean = (blockMean[last - 1] * blockWeight[last - 1] + blockMean[last] * blockWeight[last]) / totalW;
        blockMean.splice(last - 1, 2, mergedMean);
        blockWeight.splice(last - 1, 2, totalW);
        blockSize.splice(last - 1, 2, blockSize[last - 1] + blockSize[last]);
      } else {
        break;
      }
    }
  }

  // Expand blocks back to full-length array
  const result: number[] = [];
  for (let b = 0; b < blockMean.length; b++) {
    for (let j = 0; j < blockSize[b]; j++) {
      result.push(blockMean[b]);
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// LINEAR INTERPOLATION
// ─────────────────────────────────────────────────────────────────────────────

function linearInterpolate(x: number[], y: number[], xi: number): number {
  if (x.length === 0) return 0.55;   // default when no model
  if (xi <= x[0]) return y[0];
  if (xi >= x[x.length - 1]) return y[y.length - 1];
  for (let i = 0; i < x.length - 1; i++) {
    if (xi >= x[i] && xi <= x[i + 1]) {
      const t = (xi - x[i]) / (x[i + 1] - x[i]);
      return y[i] + t * (y[i + 1] - y[i]);
    }
  }
  return y[y.length - 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIDENCE BINS
// ─────────────────────────────────────────────────────────────────────────────

const CONFIDENCE_BINS: { label: string; min: number; max: number; mid: number }[] = [
  { label: '50–55%', min: 0.50, max: 0.55, mid: 0.525 },
  { label: '55–60%', min: 0.55, max: 0.60, mid: 0.575 },
  { label: '60–65%', min: 0.60, max: 0.65, mid: 0.625 },
  { label: '65–70%', min: 0.65, max: 0.70, mid: 0.675 },
  { label: '70–75%', min: 0.70, max: 0.75, mid: 0.725 },
  { label: '75–80%', min: 0.75, max: 0.80, mid: 0.775 },
  { label: '80–85%', min: 0.80, max: 0.85, mid: 0.825 },
  { label: '85–90%', min: 0.85, max: 0.90, mid: 0.875 },
  { label: '90–95%', min: 0.90, max: 0.95, mid: 0.925 },
  { label: '95–98.5%', min: 0.95, max: 1.00, mid: 0.975 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────

const DATA_DIR    = path.resolve(__dirname, '../../..', 'data');
const MODEL_FILE  = path.join(DATA_DIR, 'calibration_model.json');

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class SignalCalibrationService {

  private model: IsotonicModel | null = null;
  private modelByAsset: Record<string, IsotonicModel | null> = {
    forex: null, crypto: null, stock: null,
  };
  private metrics: CalibrationMetrics | null = null;
  private lastTrainedAt: string | null = null;

  constructor() {
    this.loadModelFromDisk();
    console.log('[Calibration] Service initialised. Model:', this.model ? `trained (${this.model.sample_count} samples)` : 'untrained');
  }

  // ── Load model from disk ─────────────────────────────────────────────────

  private loadModelFromDisk(): void {
    try {
      ensureDir();
      if (fs.existsSync(MODEL_FILE)) {
        const saved = JSON.parse(fs.readFileSync(MODEL_FILE, 'utf8'));
        this.model         = saved.model        || null;
        this.modelByAsset  = saved.modelByAsset || { forex: null, crypto: null, stock: null };
        this.metrics       = saved.metrics      || null;
        this.lastTrainedAt = saved.lastTrainedAt || null;
      }
    } catch { /* ignore */ }
  }

  private saveModelToDisk(): void {
    try {
      ensureDir();
      fs.writeFileSync(MODEL_FILE, JSON.stringify({
        model: this.model,
        modelByAsset: this.modelByAsset,
        metrics: this.metrics,
        lastTrainedAt: this.lastTrainedAt,
      }, null, 2), 'utf8');
    } catch (e) {
      console.warn('[Calibration] Could not save model to disk:', e);
    }
  }

  // ── Core: Build model from outcome data ──────────────────────────────────

  /**
   * Rebuild the isotonic regression model from resolved signal outcomes.
   * Called after each new outcome is recorded (or manually via admin endpoint).
   *
   * @param outcomes  Array of resolved signal outcomes (outcome !== 'PENDING')
   */
  async rebuild(outcomes?: Array<{
    confidence_pct:  number;
    outcome:         string;
    asset_class:     string;
  }>): Promise<{ success: boolean; metrics?: CalibrationMetrics; error?: string }> {
    try {
      // Load from Supabase if outcomes not provided
      let data = outcomes;
      if (!data) {
        if (isSupabaseEnabled()) {
          const { data: rows, error } = await supabaseService.getResolvedOutcomes();
          if (error) return { success: false, error };
          data = (rows || []).map(r => ({
            confidence_pct: r.confidence_pct,
            outcome:        r.outcome,
            asset_class:    r.asset_class,
          }));
        } else {
          // Load from disk file
          const diskPath = path.join(DATA_DIR, 'signal_outcomes.json');
          if (!fs.existsSync(diskPath)) {
            return { success: false, error: 'No outcome data available for calibration' };
          }
          const raw: any[] = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
          data = raw
            .filter(r => r.outcome && r.outcome !== 'PENDING')
            .map(r => ({
              confidence_pct: r.confidence_pct,
              outcome:        r.outcome,
              asset_class:    r.asset_class,
            }));
        }
      }

      if (!data || data.length < 10) {
        return { success: false, error: `Need at least 10 resolved outcomes (have ${data?.length || 0})` };
      }

      // Build global model
      this.model = this.fitModel(data, undefined);

      // Build per-asset-class models
      for (const cls of ['forex', 'crypto', 'stock']) {
        const subset = data.filter(d => d.asset_class === cls);
        this.modelByAsset[cls] = subset.length >= 10 ? this.fitModel(subset, undefined) : null;
      }

      // Compute calibration metrics
      this.metrics       = this.computeMetrics(data);
      this.lastTrainedAt = new Date().toISOString();

      // Persist
      this.saveModelToDisk();

      // Store snapshots in Supabase
      if (isSupabaseEnabled()) {
        await this.persistSnapshotsToSupabase(data);
      }

      console.log(`[Calibration] ✅ Model trained on ${data.length} samples. ECE: ${this.metrics.expected_calibration_error.toFixed(3)}`);
      return { success: true, metrics: this.metrics };

    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // ── Fit model ─────────────────────────────────────────────────────────────

  private fitModel(
    data: Array<{ confidence_pct: number; outcome: string }>,
    _asset_class: string | undefined,
  ): IsotonicModel {
    // 1. Assign each data point to a bin
    const binCounts:  number[] = new Array(CONFIDENCE_BINS.length).fill(0);
    const binWins:    number[] = new Array(CONFIDENCE_BINS.length).fill(0);

    for (const d of data) {
      const conf = d.confidence_pct / 100;   // normalise to 0–1
      for (let b = 0; b < CONFIDENCE_BINS.length; b++) {
        const bin = CONFIDENCE_BINS[b];
        if (conf >= bin.min && (conf < bin.max || b === CONFIDENCE_BINS.length - 1)) {
          binCounts[b]++;
          if (d.outcome === 'WIN') binWins[b]++;
          break;
        }
      }
    }

    // 2. Compute raw win rate per bin (only for bins with data)
    const activeBins:  number[] = [];
    const activeMids:  number[] = [];
    const activeRates: number[] = [];
    const activeWeights: number[] = [];

    for (let b = 0; b < CONFIDENCE_BINS.length; b++) {
      if (binCounts[b] >= 3) {   // minimum 3 samples per bin
        activeBins.push(b);
        activeMids.push(CONFIDENCE_BINS[b].mid);
        activeRates.push(binWins[b] / binCounts[b]);
        activeWeights.push(binCounts[b]);
      }
    }

    if (activeMids.length === 0) {
      // Fallback — straight identity line
      return {
        x: [0.50, 0.75, 1.00],
        y: [0.50, 0.60, 0.70],
        trained_at:   new Date().toISOString(),
        sample_count: data.length,
      };
    }

    // 3. Apply isotonic regression (PAV algorithm)
    const calibratedRates = poolAdjacentViolators(activeMids, activeRates, activeWeights);

    // 4. Clamp to [0.05, 0.95] — never say 0% or 100%
    const clampedRates = calibratedRates.map(r => Math.max(0.05, Math.min(0.95, r)));

    return {
      x:            activeMids,
      y:            clampedRates,
      trained_at:   new Date().toISOString(),
      sample_count: data.length,
    };
  }

  // ── Calibrate a single raw confidence score ───────────────────────────────

  /**
   * Convert a raw confidence score (0–100) into a calibrated probability (0–1).
   *
   * Uses per-asset-class model if available, falls back to global model.
   * If no model exists, returns a conservative estimate (assume ~55% for high confidence).
   *
   * @param rawConfidence  Engine confidence score (0–100)
   * @param assetClass     'forex' | 'crypto' | 'stock' (optional)
   * @returns              Calibrated probability (0–1)
   */
  calibrate(rawConfidence: number, assetClass?: string): number {
    const conf = rawConfidence / 100;

    // Try per-asset model first
    if (assetClass && this.modelByAsset[assetClass]) {
      const m = this.modelByAsset[assetClass]!;
      return +linearInterpolate(m.x, m.y, conf).toFixed(4);
    }

    // Fall back to global model
    if (this.model) {
      return +linearInterpolate(this.model.x, this.model.y, conf).toFixed(4);
    }

    // No model — use conservative mapping:
    // Architecture B alone produces ~52–58% accuracy
    // High confidence signals filter to ~60–65%
    const baseline = 0.52 + (conf - 0.50) * 0.30;   // 0.52 at 50% → ~0.67 at 98.5%
    return +Math.min(0.82, Math.max(0.45, baseline)).toFixed(4);
  }

  /**
   * Calibrate and return both the probability and a human-readable tier
   */
  calibrateWithTier(rawConfidence: number, assetClass?: string): {
    raw_confidence_pct:     number;
    calibrated_probability: number;
    calibrated_pct:         number;
    tier:                   string;
    description:            string;
    model_trained:          boolean;
  } {
    const prob = this.calibrate(rawConfidence, assetClass);
    const pct  = +(prob * 100).toFixed(1);

    let tier: string;
    let description: string;

    if (pct >= 75)      { tier = 'HIGH';     description = 'Strong edge — Oracle filter recommended'; }
    else if (pct >= 65) { tier = 'MODERATE'; description = 'Reasonable edge — standard position size'; }
    else if (pct >= 55) { tier = 'LOW';      description = 'Marginal edge — reduce size or skip'; }
    else                { tier = 'WEAK';     description = 'Near coin-flip — do not trade'; }

    return {
      raw_confidence_pct:     rawConfidence,
      calibrated_probability: prob,
      calibrated_pct:         pct,
      tier,
      description,
      model_trained:          !!this.model,
    };
  }

  // ── Compute calibration quality metrics ──────────────────────────────────

  private computeMetrics(
    data: Array<{ confidence_pct: number; outcome: string; asset_class: string }>,
  ): CalibrationMetrics {
    // Build bins with empirical win rates + calibrated probs
    const bins: CalibrationBin[] = CONFIDENCE_BINS.map(b => ({
      bin_label:          b.label,
      confidence_min:     b.min,
      confidence_max:     b.max,
      midpoint:           b.mid,
      sample_count:       0,
      win_count:          0,
      empirical_win_rate: 0,
      calibrated_prob:    0,
    }));

    for (const d of data) {
      const conf = d.confidence_pct / 100;
      for (let i = 0; i < bins.length; i++) {
        if (conf >= bins[i].confidence_min && (conf < bins[i].confidence_max || i === bins.length - 1)) {
          bins[i].sample_count++;
          if (d.outcome === 'WIN') bins[i].win_count++;
          break;
        }
      }
    }

    for (const bin of bins) {
      if (bin.sample_count > 0) {
        bin.empirical_win_rate = bin.win_count / bin.sample_count;
        bin.calibrated_prob    = this.calibrate(bin.midpoint * 100);
      }
    }

    // Expected Calibration Error (ECE) — weighted average |calibrated - empirical|
    let eceNumerator = 0, eceTotal = 0;
    let mce = 0;
    let brierNumerator = 0;

    for (const bin of bins.filter(b => b.sample_count > 0)) {
      const diff = Math.abs(bin.calibrated_prob - bin.empirical_win_rate);
      eceNumerator += diff * bin.sample_count;
      eceTotal     += bin.sample_count;
      if (diff > mce) mce = diff;

      // Brier score contribution
      brierNumerator += (bin.calibrated_prob - bin.empirical_win_rate) ** 2 * bin.sample_count;
    }

    const ece        = eceTotal > 0 ? eceNumerator / eceTotal : 1.0;
    const brierScore = eceTotal > 0 ? brierNumerator / eceTotal : 0.25;

    // Status
    const resolved = data.length;
    let status: CalibrationMetrics['calibration_status'];
    if (resolved < 10)       status = 'NOT_ENOUGH_DATA';
    else if (resolved < 30)  status = 'PRELIMINARY';
    else if (resolved < 100) status = 'TRAINED';
    else                     status = 'ROBUST';

    // Per asset class ECE
    const assetECE = (cls: string) => {
      const subset = data.filter(d => d.asset_class === cls);
      if (subset.length === 0) return { ece: 1.0, samples: 0 };
      let n = 0, e = 0;
      for (const bin of CONFIDENCE_BINS) {
        const inBin = subset.filter(d => {
          const c = d.confidence_pct / 100;
          return c >= bin.min && c < bin.max;
        });
        if (inBin.length === 0) continue;
        const empRate = inBin.filter(d => d.outcome === 'WIN').length / inBin.length;
        const calProb = this.calibrate(bin.mid * 100, cls);
        e += Math.abs(calProb - empRate) * inBin.length;
        n += inBin.length;
      }
      return { ece: n > 0 ? +(e / n).toFixed(4) : 1.0, samples: n };
    };

    // Next retrain — daily if < 100 samples, weekly otherwise
    const nextRetrain = new Date();
    nextRetrain.setDate(nextRetrain.getDate() + (resolved < 100 ? 1 : 7));

    return {
      total_resolved_signals:     resolved,
      calibration_status:         status,
      expected_calibration_error: +ece.toFixed(4),
      max_calibration_error:      +mce.toFixed(4),
      brier_score:                +brierScore.toFixed(4),
      reliability_score:          +((1 - ece) * 100).toFixed(1),
      bins,
      by_asset_class: {
        forex:  assetECE('forex'),
        crypto: assetECE('crypto'),
        stock:  assetECE('stock'),
      },
      last_trained:              this.lastTrainedAt,
      next_recommended_retrain:  nextRetrain.toISOString(),
    };
  }

  // ── Persist calibration snapshots to Supabase ─────────────────────────────

  private async persistSnapshotsToSupabase(
    data: Array<{ confidence_pct: number; outcome: string; asset_class: string }>,
  ): Promise<void> {
    try {
      const computedAt = new Date().toISOString();
      for (const bin of CONFIDENCE_BINS) {
        const inBin = data.filter(d => {
          const c = d.confidence_pct / 100;
          return c >= bin.min && c < bin.max;
        });
        if (inBin.length < 3) continue;
        const wins = inBin.filter(d => d.outcome === 'WIN').length;
        await supabaseService.upsertCalibrationSnapshot({
          asset_class:            'all',
          timeframe:              'all',
          raw_confidence:         +(bin.mid * 100).toFixed(1),
          calibrated_probability: this.calibrate(bin.mid * 100),
          sample_count:           inBin.length,
          win_count:              wins,
          computed_at:            computedAt,
        });
      }
    } catch (e) {
      console.warn('[Calibration] Could not persist snapshots to Supabase:', e);
    }
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  getMetrics(): CalibrationMetrics | null { return this.metrics; }
  getModel():   IsotonicModel | null       { return this.model; }
  isModelTrained(): boolean                { return !!this.model; }
  getSampleCount(): number                 { return this.model?.sample_count ?? 0; }

  /**
   * Quick summary for health checks and API endpoints
   */
  getSummary(): {
    trained:        boolean;
    sample_count:   number;
    ece:            number | null;
    status:         string;
    last_trained:   string | null;
  } {
    return {
      trained:      !!this.model,
      sample_count: this.model?.sample_count ?? 0,
      ece:          this.metrics?.expected_calibration_error ?? null,
      status:       this.metrics?.calibration_status ?? 'NOT_ENOUGH_DATA',
      last_trained: this.lastTrainedAt,
    };
  }

  /**
   * Demonstrate calibration on a series of raw scores
   * Useful for the UI accuracy tab and admin dashboard
   */
  demonstrationTable(): Array<{
    raw_pct: number;
    calibrated_pct: number;
    tier: string;
  }> {
    const levels = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 98.5];
    return levels.map(raw => {
      const calibrated = this.calibrateWithTier(raw);
      return {
        raw_pct:        raw,
        calibrated_pct: calibrated.calibrated_pct,
        tier:           calibrated.tier,
      };
    });
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const signalCalibrator = new SignalCalibrationService();
export default signalCalibrator;
