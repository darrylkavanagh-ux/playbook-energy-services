/**
 * CENTRAL BANK NLP SERVICE — P1
 * =============================================================================
 * Scores central bank communications (speeches, statements, minutes) on a
 * hawkish/dovish/neutral spectrum using keyword-based NLP.
 *
 * Supported sources:
 *   FED   — Federal Reserve (FOMC statements, Powell speeches)
 *   ECB   — European Central Bank (Lagarde speeches, ECB minutes)
 *   BOE   — Bank of England (MPC statements, Bailey speeches)
 *   BOJ   — Bank of Japan (Governor speeches, policy statements)
 *   BIS   — Bank for International Settlements (quarterly reviews)
 *
 * How it works:
 *   1. Text is normalised (lowercase, punctuation stripped)
 *   2. Hawkish keywords scored +1 to +3 based on intensity
 *   3. Dovish keywords scored -1 to -3 based on intensity
 *   4. Net stance = sum of all scores, normalised to -100 to +100
 *   5. Hawkish/dovish/neutral percentages computed
 *   6. Currency impact assessed per central bank
 *
 * Currency impacts:
 *   FED hawkish  → USD strength → EUR/USD falls, USD/JPY rises
 *   ECB hawkish  → EUR strength → EUR/USD rises
 *   BOE hawkish  → GBP strength → GBP/USD rises
 *   BOJ hawkish  → JPY strength → USD/JPY falls
 *
 * Phase 2 upgrade (6 months):
 *   Replace keyword matching with fine-tuned BERT/FinBERT model
 *   Add sentence-level sentiment with attention weights
 *   Real-time RSS feed processing from Fed.gov, ECB.europa.eu
 *
 * Persistence: Supabase cb_nlp_scores table
 */

import supabaseService, { isSupabaseEnabled } from './SupabaseService.js';

// ─────────────────────────────────────────────────────────────────────────────
// KEYWORD DICTIONARIES
// ─────────────────────────────────────────────────────────────────────────────

// Weight: 1 = mild, 2 = moderate, 3 = strong signal
const HAWKISH_KEYWORDS: { term: string; weight: number }[] = [
  // Rate hike signals
  { term: 'raise rates',              weight: 3 },
  { term: 'rate hike',                weight: 3 },
  { term: 'tighten monetary policy',  weight: 3 },
  { term: 'monetary tightening',      weight: 3 },
  { term: 'policy normalisation',     weight: 2 },
  { term: 'remove accommodation',     weight: 2 },
  { term: 'further increases',        weight: 2 },
  { term: 'additional increases',     weight: 2 },
  { term: 'above neutral',            weight: 2 },
  { term: 'restrictive territory',    weight: 3 },
  { term: 'sufficiently restrictive', weight: 3 },
  // Inflation concerns
  { term: 'inflation remains elevated', weight: 3 },
  { term: 'inflation too high',         weight: 3 },
  { term: 'inflation persistence',      weight: 2 },
  { term: 'price stability mandate',    weight: 2 },
  { term: 'above target',              weight: 2 },
  { term: 'unacceptably high',         weight: 3 },
  { term: 'combat inflation',          weight: 3 },
  { term: 'fight inflation',           weight: 3 },
  { term: 'inflationary pressures',    weight: 2 },
  { term: 'wage growth',               weight: 1 },
  { term: 'tight labour market',       weight: 2 },
  { term: 'overheating',               weight: 2 },
  // Balance sheet
  { term: 'quantitative tightening',   weight: 3 },
  { term: 'balance sheet reduction',   weight: 2 },
  { term: 'reduce balance sheet',      weight: 2 },
  // General hawkish
  { term: 'higher for longer',         weight: 3 },
  { term: 'data dependent',            weight: 1 },
  { term: 'vigilant',                  weight: 1 },
  { term: 'hawkish',                   weight: 2 },
];

const DOVISH_KEYWORDS: { term: string; weight: number }[] = [
  // Rate cut signals
  { term: 'cut rates',                weight: 3 },
  { term: 'rate cut',                 weight: 3 },
  { term: 'reduce rates',             weight: 3 },
  { term: 'lower rates',              weight: 3 },
  { term: 'easing cycle',             weight: 3 },
  { term: 'monetary easing',          weight: 3 },
  { term: 'accommodative policy',     weight: 2 },
  { term: 'accommodation warranted',  weight: 2 },
  { term: 'supportive stance',        weight: 2 },
  { term: 'looser policy',            weight: 2 },
  // Economic concern
  { term: 'downside risks',           weight: 2 },
  { term: 'economic weakness',        weight: 2 },
  { term: 'growth concerns',          weight: 2 },
  { term: 'recession risk',           weight: 3 },
  { term: 'labour market softening',  weight: 2 },
  { term: 'unemployment rising',      weight: 2 },
  { term: 'disinflation',             weight: 2 },
  { term: 'inflation declining',      weight: 2 },
  { term: 'below target',             weight: 2 },
  { term: 'inflation falling',        weight: 2 },
  { term: 'deflationary',             weight: 3 },
  { term: 'financial stability',      weight: 1 },
  // Balance sheet
  { term: 'quantitative easing',      weight: 3 },
  { term: 'asset purchases',          weight: 2 },
  { term: 'expand balance sheet',     weight: 2 },
  { term: 'bond buying',              weight: 2 },
  // General dovish
  { term: 'pause rate',               weight: 2 },
  { term: 'hold rates',               weight: 1 },
  { term: 'patient',                  weight: 1 },
  { term: 'gradual',                  weight: 1 },
  { term: 'dovish',                   weight: 2 },
];

const NEUTRAL_MARKERS: string[] = [
  'data dependent', 'monitor closely', 'assess incoming data',
  'meeting by meeting', 'balanced approach', 'two-sided risks',
  'uncertainty', 'watching carefully', 'evolving situation',
];

// ─────────────────────────────────────────────────────────────────────────────
// CURRENCY IMPACT MAPPING
// ─────────────────────────────────────────────────────────────────────────────

const CURRENCY_IMPACT: Record<string, {
  currency: string;
  hawkish_pairs:  string[];
  dovish_pairs:   string[];
  hawkish_effect: string;
  dovish_effect:  string;
}> = {
  FED: {
    currency:       'USD',
    hawkish_pairs:  ['EUR/USD↓', 'GBP/USD↓', 'USD/JPY↑', 'USD/CHF↑'],
    dovish_pairs:   ['EUR/USD↑', 'GBP/USD↑', 'USD/JPY↓', 'USD/CHF↓'],
    hawkish_effect: 'USD strengthens — short EUR/USD, GBP/USD; long USD/JPY',
    dovish_effect:  'USD weakens — long EUR/USD, GBP/USD; short USD/JPY',
  },
  ECB: {
    currency:       'EUR',
    hawkish_pairs:  ['EUR/USD↑', 'EUR/GBP↑', 'EUR/JPY↑'],
    dovish_pairs:   ['EUR/USD↓', 'EUR/GBP↓', 'EUR/JPY↓'],
    hawkish_effect: 'EUR strengthens — long EUR/USD',
    dovish_effect:  'EUR weakens — short EUR/USD',
  },
  BOE: {
    currency:       'GBP',
    hawkish_pairs:  ['GBP/USD↑', 'EUR/GBP↓'],
    dovish_pairs:   ['GBP/USD↓', 'EUR/GBP↑'],
    hawkish_effect: 'GBP strengthens — long GBP/USD',
    dovish_effect:  'GBP weakens — short GBP/USD',
  },
  BOJ: {
    currency:       'JPY',
    hawkish_pairs:  ['USD/JPY↓', 'EUR/JPY↓'],
    dovish_pairs:   ['USD/JPY↑', 'EUR/JPY↑'],
    hawkish_effect: 'JPY strengthens — short USD/JPY',
    dovish_effect:  'JPY weakens — long USD/JPY',
  },
  BIS: {
    currency:       'GLOBAL',
    hawkish_pairs:  ['DXY↑'],
    dovish_pairs:   ['DXY↓'],
    hawkish_effect: 'Global tightening signal — risk-off',
    dovish_effect:  'Global easing signal — risk-on',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CBNLPResult {
  source:           string;
  speech_title:     string;
  speech_date:      string;
  hawkish_score:    number;    // 0–100
  dovish_score:     number;    // 0–100
  neutral_score:    number;    // 0–100
  net_stance:       number;    // hawkish - dovish, -100 to +100
  stance_label:     string;    // 'HAWKISH' | 'MILDLY_HAWKISH' | 'NEUTRAL' | 'MILDLY_DOVISH' | 'DOVISH'
  keywords_found:   { term: string; type: 'hawkish' | 'dovish' | 'neutral'; weight: number }[];
  currency_impact:  {
    currency:       string;
    effect:         string;
    affected_pairs: string[];
    signal_strength: string;
  };
  text_excerpt:     string;
  scored_at:        string;
  confidence:       number;    // 0–100 based on keyword density
}

export interface CBNLPSummary {
  latest_scores:    Record<string, CBNLPResult>;
  global_stance:    string;
  divergence_pairs: Array<{ pair: string; direction: string; reason: string }>;
  last_updated:     string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class CentralBankNLPService {

  private cache: Map<string, CBNLPResult> = new Map();
  private lastUpdated: string | null = null;

  // ── Score a text excerpt ─────────────────────────────────────────────────

  scoreText(
    text:          string,
    source:        string,
    speechTitle:   string,
    speechDate:    string,
  ): CBNLPResult {
    const normalised = text.toLowerCase().replace(/[^\w\s]/g, ' ');

    let hawkishRaw = 0;
    let dovishRaw  = 0;
    let neutralHits = 0;
    const keywordsFound: CBNLPResult['keywords_found'] = [];

    // Score hawkish keywords
    for (const kw of HAWKISH_KEYWORDS) {
      const count = this.countOccurrences(normalised, kw.term);
      if (count > 0) {
        hawkishRaw += kw.weight * count;
        keywordsFound.push({ term: kw.term, type: 'hawkish', weight: kw.weight * count });
      }
    }

    // Score dovish keywords
    for (const kw of DOVISH_KEYWORDS) {
      const count = this.countOccurrences(normalised, kw.term);
      if (count > 0) {
        dovishRaw += kw.weight * count;
        keywordsFound.push({ term: kw.term, type: 'dovish', weight: kw.weight * count });
      }
    }

    // Count neutral markers
    for (const nm of NEUTRAL_MARKERS) {
      if (normalised.includes(nm)) {
        neutralHits++;
        keywordsFound.push({ term: nm, type: 'neutral', weight: 1 });
      }
    }

    // Normalise to 0–100 per type
    const total  = hawkishRaw + dovishRaw + Math.max(neutralHits, 1);
    const hawkishScore = Math.round((hawkishRaw / total) * 100);
    const dovishScore  = Math.round((dovishRaw  / total) * 100);
    const neutralScore = 100 - hawkishScore - dovishScore;

    // Net stance: +100 = extremely hawkish, -100 = extremely dovish
    const netStance = hawkishScore - dovishScore;

    // Stance label
    let stanceLabel: string;
    if      (netStance >= 40)   stanceLabel = 'HAWKISH';
    else if (netStance >= 15)   stanceLabel = 'MILDLY_HAWKISH';
    else if (netStance >= -15)  stanceLabel = 'NEUTRAL';
    else if (netStance >= -40)  stanceLabel = 'MILDLY_DOVISH';
    else                        stanceLabel = 'DOVISH';

    // Currency impact
    const impact = CURRENCY_IMPACT[source] || CURRENCY_IMPACT.BIS;
    const isHawkish = netStance > 0;
    const signalStrength = Math.abs(netStance) >= 40 ? 'STRONG' : Math.abs(netStance) >= 15 ? 'MODERATE' : 'WEAK';

    // Confidence based on keyword density (words per 1000)
    const wordCount  = normalised.split(/\s+/).length;
    const kwDensity  = ((hawkishRaw + dovishRaw) / Math.max(wordCount, 1)) * 1000;
    const confidence = Math.min(95, Math.round(40 + kwDensity * 3));

    const result: CBNLPResult = {
      source,
      speech_title:     speechTitle,
      speech_date:      speechDate,
      hawkish_score:    hawkishScore,
      dovish_score:     dovishScore,
      neutral_score:    Math.max(0, neutralScore),
      net_stance:       netStance,
      stance_label:     stanceLabel,
      keywords_found:   keywordsFound.slice(0, 20),
      currency_impact: {
        currency:       impact.currency,
        effect:         isHawkish ? impact.hawkish_effect : impact.dovish_effect,
        affected_pairs: isHawkish ? impact.hawkish_pairs : impact.dovish_pairs,
        signal_strength: signalStrength,
      },
      text_excerpt:     text.slice(0, 500),
      scored_at:        new Date().toISOString(),
      confidence,
    };

    // Cache it
    this.cache.set(source, result);
    this.lastUpdated = new Date().toISOString();

    // Async persist to Supabase
    if (isSupabaseEnabled()) {
      supabaseService.insertCBNLPScore({
        source:           result.source,
        speech_title:     result.speech_title,
        speech_date:      result.speech_date,
        hawkish_score:    result.hawkish_score,
        dovish_score:     result.dovish_score,
        neutral_score:    result.neutral_score,
        net_stance:       result.net_stance,
        keywords_found:   result.keywords_found.map(k => k.term),
        raw_text_excerpt: result.text_excerpt,
        scored_at:        result.scored_at,
      }).catch(e => console.warn('[CBNLP] Supabase persist error:', e.message));
    }

    return result;
  }

  // ── Count keyword occurrences in text ────────────────────────────────────

  private countOccurrences(text: string, term: string): number {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex   = new RegExp(`\\b${escaped}\\b`, 'g');
    return (text.match(regex) || []).length;
  }

  // ── Get latest cached score for a source ─────────────────────────────────

  getLatest(source: string): CBNLPResult | null {
    return this.cache.get(source) || null;
  }

  // ── Compute divergence signals (e.g. FED hawkish + ECB dovish = EUR/USD down) ──

  getDivergenceSignals(): Array<{
    pair:      string;
    direction: 'BUY' | 'SELL';
    reason:    string;
    strength:  number;
  }> {
    const fed = this.cache.get('FED');
    const ecb = this.cache.get('ECB');
    const boe = this.cache.get('BOE');
    const boj = this.cache.get('BOJ');

    const signals: Array<{ pair: string; direction: 'BUY' | 'SELL'; reason: string; strength: number }> = [];

    if (fed && ecb) {
      const divergence = fed.net_stance - ecb.net_stance;
      if (divergence > 20) {
        signals.push({
          pair:      'EUR/USD',
          direction: 'SELL',
          reason:    `FED (${fed.stance_label}) vs ECB (${ecb.stance_label}): USD expected to strengthen`,
          strength:  Math.min(100, Math.abs(divergence)),
        });
      } else if (divergence < -20) {
        signals.push({
          pair:      'EUR/USD',
          direction: 'BUY',
          reason:    `ECB (${ecb.stance_label}) vs FED (${fed.stance_label}): EUR expected to strengthen`,
          strength:  Math.min(100, Math.abs(divergence)),
        });
      }
    }

    if (fed && boj) {
      const divergence = fed.net_stance - boj.net_stance;
      if (divergence > 15) {
        signals.push({
          pair:      'USD/JPY',
          direction: 'BUY',
          reason:    `FED hawkish vs BOJ dovish — USD/JPY upside expected`,
          strength:  Math.min(100, Math.abs(divergence)),
        });
      } else if (divergence < -15) {
        signals.push({
          pair:      'USD/JPY',
          direction: 'SELL',
          reason:    `BOJ tightening vs FED easing — JPY strength expected`,
          strength:  Math.min(100, Math.abs(divergence)),
        });
      }
    }

    if (boe && ecb) {
      const divergence = boe.net_stance - ecb.net_stance;
      if (Math.abs(divergence) > 20) {
        signals.push({
          pair:      'EUR/GBP',
          direction: divergence > 0 ? 'SELL' : 'BUY',
          reason:    `BOE (${boe.stance_label}) vs ECB (${ecb.stance_label}) divergence`,
          strength:  Math.min(100, Math.abs(divergence)),
        });
      }
    }

    return signals;
  }

  // ── Full summary for API endpoint ────────────────────────────────────────

  getSummary(): CBNLPSummary {
    const latest: Record<string, CBNLPResult> = {};
    for (const [source, result] of this.cache.entries()) {
      latest[source] = result;
    }

    const divergence = this.getDivergenceSignals();

    // Compute global stance from available scores
    const sources = Array.from(this.cache.values());
    const avgStance = sources.length > 0
      ? sources.reduce((s, r) => s + r.net_stance, 0) / sources.length
      : 0;

    let globalStance: string;
    if      (avgStance >= 30)  globalStance = 'GLOBAL_TIGHTENING — Risk-off environment';
    else if (avgStance >= 10)  globalStance = 'MILDLY_HAWKISH — Rate cuts delayed';
    else if (avgStance >= -10) globalStance = 'NEUTRAL — Policy on hold globally';
    else if (avgStance >= -30) globalStance = 'MILDLY_DOVISH — Rate cuts likely soon';
    else                       globalStance = 'GLOBAL_EASING — Risk-on environment';

    return {
      latest_scores:    latest,
      global_stance:    globalStance,
      divergence_pairs: divergence.map(d => ({
        pair:      d.pair,
        direction: d.direction,
        reason:    d.reason,
      })),
      last_updated: this.lastUpdated || 'No data yet',
    };
  }

  // ── Demo scorer with sample Fed statement ────────────────────────────────

  scoreDemo(): CBNLPResult {
    const sampleText = `
      The Committee decided to raise the target range for the federal funds rate to 5-1/4 to 5-1/2 percent.
      In determining the extent of additional policy firming that may be appropriate to return inflation to
      2 percent over time, the Committee will take into account the cumulative tightening of monetary policy,
      the lags with which monetary policy affects economic activity and inflation, and economic and financial
      developments. Inflation remains elevated. The Committee remains highly attentive to inflation risks.
      The Committee is strongly committed to returning inflation to its 2 percent objective. Recent indicators
      suggest that economic activity has been expanding at a solid pace. Job gains have been robust in recent
      months, and the unemployment rate has remained low. Tighter credit conditions for households and businesses
      are likely to weigh on economic activity, hiring, and inflation.
    `;
    return this.scoreText(sampleText, 'FED', 'FOMC Statement Demo — Rate Hike', new Date().toISOString().split('T')[0]);
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const centralBankNLP = new CentralBankNLPService();
export default centralBankNLP;
