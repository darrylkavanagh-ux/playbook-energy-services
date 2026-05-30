/**
 * FRACTAL PATTERN MATCHER — Dynamic Time Warping (DTW)
 * =============================================================================
 * Identifies recurring price formations by comparing candle sequences using
 * Dynamic Time Warping distance — the gold standard for time-series similarity
 * when patterns may be stretched/compressed in time.
 *
 * ALGORITHM:
 *   DTW warps two time series onto each other by finding the optimal alignment
 *   path through an N×M cost matrix. Distance < threshold → pattern match.
 *
 *   Complexity: O(N×M) per comparison — optimised with Sakoe-Chiba band.
 *
 * PATTERN LIBRARY (built-in):
 *   Bullish: Hammer, Inverse H&S, Ascending Triangle, Cup & Handle, Bull Flag
 *   Bearish: Shooting Star, Head & Shoulders, Descending Triangle, Bear Flag
 *   Neutral: Doji, Inside Bar, Consolidation
 *
 * USAGE:
 *   const matcher = new FractalPatternMatcher();
 *   const matches = matcher.match(ohlcvSeries, { topN: 3, threshold: 0.15 });
 *
 * OUTPUT:
 *   Array of PatternMatch objects sorted by confidence (DTW distance inverted).
 *   Each match includes: pattern name, direction, confidence %, description, trade bias.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OHLCV {
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
  time?:  number;   // Unix ms (optional)
}

export interface PatternTemplate {
  name:        string;
  direction:   'BULLISH' | 'BEARISH' | 'NEUTRAL';
  description: string;
  trade_bias:  'BUY' | 'SELL' | 'WAIT';
  /** Normalised close price sequence (0.0–1.0) representing the pattern shape */
  template:    number[];
  /** Minimum candles needed to match */
  min_candles: number;
  /** Maximum DTW distance ratio to qualify as a match */
  threshold:   number;
}

export interface PatternMatch {
  pattern:       string;
  direction:     'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trade_bias:    'BUY' | 'SELL' | 'WAIT';
  description:   string;
  confidence:    number;     // 0–100
  dtw_distance:  number;     // lower = better match
  start_idx:     number;     // index in input series where pattern starts
  end_idx:       number;     // index in input series where pattern ends
  candle_count:  number;
}

export interface MatchOptions {
  topN?:           number;    // Return top N matches (default: 5)
  threshold?:      number;    // DTW threshold override (default: per-pattern)
  min_confidence?: number;    // Minimum confidence % (default: 55)
  window?:         number;    // Sakoe-Chiba band width (default: 20% of length)
  lookback?:       number;    // How many recent candles to search (default: all)
}

export interface DTWResult {
  distance:    number;
  normalised:  number;   // Normalised by series length
  path:        Array<[number, number]>;  // Warp path
}

// ── Pattern Library ───────────────────────────────────────────────────────────

const PATTERN_LIBRARY: PatternTemplate[] = [

  // ── BULLISH PATTERNS ──────────────────────────────────────────────────────

  {
    name:        'Hammer',
    direction:   'BULLISH',
    description: 'Single-candle reversal: small body at top, long lower wick ≥2× body. Signals buying pressure after decline.',
    trade_bias:  'BUY',
    min_candles: 5,
    threshold:   0.18,
    template:    [0.50, 0.45, 0.40, 0.35, 0.10, 0.30],  // Decline then hammer
  },
  {
    name:        'Inverse Head & Shoulders',
    direction:   'BULLISH',
    description: 'Three-trough reversal: left shoulder, deeper head, right shoulder at similar level to left. Neckline breakout = entry.',
    trade_bias:  'BUY',
    min_candles: 15,
    threshold:   0.20,
    template:    [0.7, 0.5, 0.6, 0.2, 0.6, 0.5, 0.7, 0.8, 0.9],  // IHS shape
  },
  {
    name:        'Ascending Triangle',
    direction:   'BULLISH',
    description: 'Flat resistance + rising lows. Coiled spring — breakout above resistance high-probability.',
    trade_bias:  'BUY',
    min_candles: 12,
    threshold:   0.15,
    template:    [0.5, 0.6, 0.55, 0.65, 0.6, 0.68, 0.63, 0.70],  // Rising lows, flat highs
  },
  {
    name:        'Cup & Handle',
    direction:   'BULLISH',
    description: 'U-shaped consolidation (cup) followed by small pullback (handle). Breakout above rim = target = cup depth.',
    trade_bias:  'BUY',
    min_candles: 20,
    threshold:   0.22,
    template:    [0.8, 0.6, 0.3, 0.4, 0.6, 0.8, 0.7, 0.75, 0.8, 0.9],  // Cup then handle
  },
  {
    name:        'Bull Flag',
    direction:   'BULLISH',
    description: 'Sharp advance (flagpole) followed by parallel channel pullback. Continuation — breakout targets flagpole height.',
    trade_bias:  'BUY',
    min_candles: 10,
    threshold:   0.16,
    template:    [0.2, 0.5, 0.8, 0.9, 0.75, 0.7, 0.72, 0.74, 0.95],  // Pole then flag
  },
  {
    name:        'Morning Star',
    direction:   'BULLISH',
    description: 'Three-candle reversal: bearish candle, small-body doji/indecision, bullish candle. Bottom reversal signal.',
    trade_bias:  'BUY',
    min_candles: 5,
    threshold:   0.17,
    template:    [0.7, 0.5, 0.35, 0.40, 0.55, 0.70],  // Down, doji, up
  },
  {
    name:        'Double Bottom',
    direction:   'BULLISH',
    description: 'Two troughs at similar level with peak between. W-shape. Breakout above neckline confirms reversal.',
    trade_bias:  'BUY',
    min_candles: 12,
    threshold:   0.18,
    template:    [0.8, 0.5, 0.2, 0.5, 0.2, 0.5, 0.8],  // W shape
  },

  // ── BEARISH PATTERNS ──────────────────────────────────────────────────────

  {
    name:        'Shooting Star',
    direction:   'BEARISH',
    description: 'Single-candle reversal: small body at bottom, long upper wick ≥2× body. Signals rejection of highs after advance.',
    trade_bias:  'SELL',
    min_candles: 5,
    threshold:   0.18,
    template:    [0.50, 0.55, 0.60, 0.65, 0.90, 0.70],  // Rise then shooting star
  },
  {
    name:        'Head & Shoulders',
    direction:   'BEARISH',
    description: 'Three-peak top reversal: left shoulder, taller head, right shoulder. Neckline breakdown = entry. Measured move target.',
    trade_bias:  'SELL',
    min_candles: 15,
    threshold:   0.20,
    template:    [0.3, 0.5, 0.4, 0.8, 0.4, 0.5, 0.3, 0.2, 0.1],  // H&S shape
  },
  {
    name:        'Descending Triangle',
    direction:   'BEARISH',
    description: 'Flat support + falling highs. Lower highs signal selling pressure. Breakdown below support = entry.',
    trade_bias:  'SELL',
    min_candles: 12,
    threshold:   0.15,
    template:    [0.5, 0.4, 0.45, 0.35, 0.40, 0.32, 0.37, 0.30],  // Falling highs, flat lows
  },
  {
    name:        'Bear Flag',
    direction:   'BEARISH',
    description: 'Sharp decline (flagpole) followed by upward parallel channel. Continuation — breakdown targets flagpole depth.',
    trade_bias:  'SELL',
    min_candles: 10,
    threshold:   0.16,
    template:    [0.8, 0.5, 0.2, 0.1, 0.25, 0.30, 0.28, 0.26, 0.05],  // Pole then bear flag
  },
  {
    name:        'Evening Star',
    direction:   'BEARISH',
    description: 'Three-candle top reversal: bullish candle, small doji at top, bearish candle. Classic topping pattern.',
    trade_bias:  'SELL',
    min_candles: 5,
    threshold:   0.17,
    template:    [0.3, 0.5, 0.65, 0.60, 0.45, 0.30],  // Up, doji, down
  },
  {
    name:        'Double Top',
    direction:   'BEARISH',
    description: 'Two peaks at similar level with trough between. M-shape. Breakdown below neckline confirms reversal.',
    trade_bias:  'SELL',
    min_candles: 12,
    threshold:   0.18,
    template:    [0.2, 0.5, 0.8, 0.5, 0.8, 0.5, 0.2],  // M shape
  },

  // ── NEUTRAL PATTERNS ─────────────────────────────────────────────────────

  {
    name:        'Doji Cluster',
    direction:   'NEUTRAL',
    description: 'Multiple consecutive doji candles — extreme indecision. Await breakout for direction. Volatility compression before expansion.',
    trade_bias:  'WAIT',
    min_candles: 4,
    threshold:   0.10,
    template:    [0.5, 0.52, 0.48, 0.51, 0.49],  // Flat sequence
  },
  {
    name:        'Inside Bar Compression',
    direction:   'NEUTRAL',
    description: 'Each bar\'s range contained within prior bar. Tightening coil — significant breakout imminent in either direction.',
    trade_bias:  'WAIT',
    min_candles: 5,
    threshold:   0.12,
    template:    [0.3, 0.7, 0.4, 0.6, 0.45, 0.55, 0.48, 0.52],  // Narrowing
  },
  {
    name:        'Symmetrical Triangle',
    direction:   'NEUTRAL',
    description: 'Converging trendlines — lower highs + higher lows. Continuation pattern: breakout direction = trend bias.',
    trade_bias:  'WAIT',
    min_candles: 12,
    threshold:   0.14,
    template:    [0.2, 0.8, 0.3, 0.7, 0.38, 0.62, 0.44, 0.56, 0.50],  // Converging
  },
];

// ── DTW Core Algorithm ────────────────────────────────────────────────────────

/**
 * Compute DTW distance between two sequences.
 * Uses Sakoe-Chiba band to limit warping (performance + accuracy).
 *
 * @param s1     First sequence (query)
 * @param s2     Second sequence (reference/template)
 * @param window Sakoe-Chiba band width (0 = unlimited)
 * @returns DTWResult with distance, normalised distance, and warp path
 */
export function computeDTW(s1: number[], s2: number[], window = 0): DTWResult {
  const n = s1.length;
  const m = s2.length;

  // Default window: 20% of longer series (min 2)
  const w = window > 0 ? window : Math.max(2, Math.ceil(Math.max(n, m) * 0.20));

  // Initialise cost matrix with Infinity
  const dtw: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(Infinity),
  );
  dtw[0][0] = 0;

  // Fill cost matrix with Sakoe-Chiba band constraint
  for (let i = 1; i <= n; i++) {
    const jStart = Math.max(1, i - w);
    const jEnd   = Math.min(m, i + w);
    for (let j = jStart; j <= jEnd; j++) {
      const cost = Math.abs(s1[i - 1] - s2[j - 1]);
      dtw[i][j]  = cost + Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
    }
  }

  const distance   = dtw[n][m];
  const normalised = distance / Math.max(n, m);

  // Backtrack to find optimal path
  const path: Array<[number, number]> = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    path.unshift([i - 1, j - 1]);
    if      (i === 0) j--;
    else if (j === 0) i--;
    else {
      const minPrev = Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
      if      (minPrev === dtw[i - 1][j - 1]) { i--; j--; }
      else if (minPrev === dtw[i - 1][j])     { i--; }
      else                                     { j--; }
    }
  }

  return { distance, normalised, path };
}

// ── Normalisation Utilities ───────────────────────────────────────────────────

/**
 * Normalise OHLCV series to 0.0–1.0 range using close prices.
 * Z-score normalisation to handle different price scales.
 */
export function normaliseClose(series: OHLCV[]): number[] {
  const closes = series.map(c => c.close);
  const min    = Math.min(...closes);
  const max    = Math.max(...closes);
  const range  = max - min;

  if (range === 0) return closes.map(() => 0.5);
  return closes.map(c => (c - min) / range);
}

/**
 * Normalise using High-Low range for pattern shape matching
 * (captures wicks and real body proportions better than close-only).
 */
export function normaliseMidpoint(series: OHLCV[]): number[] {
  const mids  = series.map(c => (c.high + c.low) / 2);
  const min   = Math.min(...mids);
  const max   = Math.max(...mids);
  const range = max - min;
  if (range === 0) return mids.map(() => 0.5);
  return mids.map(m => (m - min) / range);
}

// ── FractalPatternMatcher Class ───────────────────────────────────────────────

export class FractalPatternMatcher {

  private patterns: PatternTemplate[];

  constructor(customPatterns?: PatternTemplate[]) {
    this.patterns = customPatterns ? [...PATTERN_LIBRARY, ...customPatterns] : [...PATTERN_LIBRARY];
  }

  // ── Main Match Method ───────────────────────────────────────────────────────

  /**
   * Find the best pattern matches in a price series.
   * Scans the series in a sliding window, testing each pattern template.
   *
   * @param series  Array of OHLCV candles (minimum 5)
   * @param options Match configuration
   * @returns Sorted array of PatternMatch objects (best match first)
   */
  match(series: OHLCV[], options: MatchOptions = {}): PatternMatch[] {
    if (!series || series.length < 5) return [];

    const {
      topN           = 5,
      threshold,
      min_confidence = 55,
      window         = 0,
      lookback,
    } = options;

    const workingSeries = lookback && lookback < series.length
      ? series.slice(-lookback)
      : series;

    const allMatches: PatternMatch[] = [];

    for (const pattern of this.patterns) {
      if (workingSeries.length < pattern.min_candles) continue;

      const effectiveThreshold = threshold ?? pattern.threshold;
      const templateLen        = pattern.template.length;

      // Slide window across series
      const stepSize = Math.max(1, Math.floor(templateLen / 2));
      for (let startIdx = 0; startIdx <= workingSeries.length - pattern.min_candles; startIdx += stepSize) {
        const endIdx    = Math.min(startIdx + Math.max(templateLen, pattern.min_candles), workingSeries.length);
        const segment   = workingSeries.slice(startIdx, endIdx);
        const query     = normaliseMidpoint(segment);
        const reference = pattern.template;

        const { normalised } = computeDTW(query, reference, window);

        if (normalised <= effectiveThreshold) {
          const confidence = this.dtwToConfidence(normalised, effectiveThreshold);
          if (confidence >= min_confidence) {
            allMatches.push({
              pattern:      pattern.name,
              direction:    pattern.direction,
              trade_bias:   pattern.trade_bias,
              description:  pattern.description,
              confidence:   Math.round(confidence * 10) / 10,
              dtw_distance: Math.round(normalised * 10000) / 10000,
              start_idx:    startIdx,
              end_idx:      endIdx - 1,
              candle_count: endIdx - startIdx,
            });
          }
        }
      }
    }

    // Sort by confidence descending, deduplicate overlapping matches for same pattern
    const deduped  = this.deduplicateMatches(allMatches);
    const filtered = deduped.filter(m => m.confidence >= min_confidence);
    filtered.sort((a, b) => b.confidence - a.confidence);

    return filtered.slice(0, topN);
  }

  // ── Convenience Methods ─────────────────────────────────────────────────────

  /** Match only bullish patterns */
  matchBullish(series: OHLCV[], options?: MatchOptions): PatternMatch[] {
    return this.match(series, options).filter(m => m.direction === 'BULLISH');
  }

  /** Match only bearish patterns */
  matchBearish(series: OHLCV[], options?: MatchOptions): PatternMatch[] {
    return this.match(series, options).filter(m => m.direction === 'BEARISH');
  }

  /** Get the single highest-confidence match */
  bestMatch(series: OHLCV[], options?: MatchOptions): PatternMatch | null {
    const matches = this.match(series, { ...options, topN: 1 });
    return matches[0] || null;
  }

  /**
   * Compute similarity between two price series (0 = identical, 1 = completely different).
   * Useful for comparing current price action to historical examples.
   */
  similarity(series1: OHLCV[], series2: OHLCV[]): number {
    const n1 = normaliseMidpoint(series1);
    const n2 = normaliseMidpoint(series2);
    const { normalised } = computeDTW(n1, n2);
    return Math.min(1, normalised);
  }

  /** Get scoring breakdown for a specific pattern */
  scorePattern(series: OHLCV[], patternName: string): { matched: boolean; confidence: number; dtw_distance: number } {
    const pattern = this.patterns.find(p => p.name.toLowerCase() === patternName.toLowerCase());
    if (!pattern || series.length < pattern.min_candles) {
      return { matched: false, confidence: 0, dtw_distance: Infinity };
    }

    const recent    = series.slice(-Math.max(pattern.template.length + 3, pattern.min_candles));
    const query     = normaliseMidpoint(recent);
    const { normalised } = computeDTW(query, pattern.template);
    const confidence = normalised <= pattern.threshold
      ? this.dtwToConfidence(normalised, pattern.threshold)
      : 0;

    return {
      matched:      normalised <= pattern.threshold && confidence >= 55,
      confidence:   Math.round(confidence * 10) / 10,
      dtw_distance: Math.round(normalised * 10000) / 10000,
    };
  }

  /** List all available pattern names */
  listPatterns(): Array<{ name: string; direction: string; trade_bias: string; min_candles: number }> {
    return this.patterns.map(p => ({
      name:        p.name,
      direction:   p.direction,
      trade_bias:  p.trade_bias,
      min_candles: p.min_candles,
    }));
  }

  // ── Private Utilities ───────────────────────────────────────────────────────

  /**
   * Convert normalised DTW distance to confidence percentage.
   * distance=0 → confidence=100; distance=threshold → confidence=55
   */
  private dtwToConfidence(normalised: number, threshold: number): number {
    if (normalised <= 0)          return 100;
    if (normalised >= threshold)  return 55;

    // Linear interpolation: 0 → 100%, threshold → 55%
    const confidence = 100 - ((normalised / threshold) * (100 - 55));
    return Math.max(0, Math.min(100, confidence));
  }

  /** Remove overlapping matches for the same pattern — keep highest confidence */
  private deduplicateMatches(matches: PatternMatch[]): PatternMatch[] {
    const seen = new Map<string, PatternMatch>();

    for (const match of matches) {
      const key     = match.pattern;
      const existing = seen.get(key);
      if (!existing || match.confidence > existing.confidence) {
        seen.set(key, match);
      }
    }

    return Array.from(seen.values());
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

export const fractalMatcher = new FractalPatternMatcher();
export default fractalMatcher;

// ── Pattern Summary Export ─────────────────────────────────────────────────────

export const AVAILABLE_PATTERNS = PATTERN_LIBRARY.map(p => p.name);
export const BULLISH_PATTERNS   = PATTERN_LIBRARY.filter(p => p.direction === 'BULLISH').map(p => p.name);
export const BEARISH_PATTERNS   = PATTERN_LIBRARY.filter(p => p.direction === 'BEARISH').map(p => p.name);
export const NEUTRAL_PATTERNS   = PATTERN_LIBRARY.filter(p => p.direction === 'NEUTRAL').map(p => p.name);
