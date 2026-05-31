/**
 * SMART MONEY FLOW SERVICE — P1
 * =============================================================================
 * Tracks institutional positioning using:
 *   1. CFTC Commitment of Traders (COT) report — weekly Friday release
 *   2. Options market positioning — put/call ratios, gamma exposure
 *   3. Dark pool volume tracking (proxy via reported block trades)
 *
 * COT Report Interpretation:
 *   - Commercial hedgers: usually wrong on direction (they hedge, not speculate)
 *   - Non-commercial large specs: "smart money" — trend followers with capital
 *   - Non-reportable small specs: retail traders (often contrarian indicator)
 *
 *   Signal: When large specs are EXTREMELY long/short AND commercials flip,
 *           a trend reversal is often imminent (the classic COT signal)
 *
 * Put/Call Ratio:
 *   - PCR > 1.2 = extreme fear → contrarian BUY
 *   - PCR < 0.6 = extreme greed → contrarian SELL
 *   - PCR 0.6–1.2 = neutral range
 *
 * Gamma Exposure (GEX):
 *   - Positive GEX → dealers are long gamma → they BUY dips, SELL rallies
 *     (dampens volatility, price tends to pin to large options strikes)
 *   - Negative GEX → dealers are short gamma → they SELL dips, BUY rallies
 *     (amplifies volatility, directional moves accelerate)
 *
 * Data Sources (Phase 1 — free/cheap tiers):
 *   - CFTC COT: https://www.cftc.gov/dea/newcot/f_futopt.txt (weekly, free)
 *   - Barchart.com options data (requires account)
 *   - Manual input via API endpoint for early platform testing
 *
 * Phase 2 upgrade:
 *   - Real-time options flow via Unusual Whales API
 *   - Dark pool data via FINRA ATS transparency data
 *   - Machine learning on historical COT extremes
 *
 * Persistence: Supabase smart_money_flow table
 */

import supabaseService, { isSupabaseEnabled } from './SupabaseService.js';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface COTData {
  symbol:           string;
  report_date:      string;
  commercials_long:  number;
  commercials_short: number;
  large_specs_long:  number;
  large_specs_short: number;
  small_specs_long:  number;
  small_specs_short: number;
}

export interface OptionsFlow {
  symbol:            string;
  expiry_date:       string;
  put_volume:        number;
  call_volume:       number;
  put_call_ratio:    number;
  gamma_exposure:    number;    // positive = dealers long gamma, negative = short
  implied_vol:       number;    // average IV
  max_pain_level:    number;    // price where options cause maximum pain to buyers
}

export interface SmartMoneySignal {
  symbol:              string;
  asset_class:         string;
  report_date:         string;
  // COT derived
  commercials_net:     number;    // long - short
  large_specs_net:     number;    // large spec net position
  small_specs_net:     number;    // small spec net position
  cot_signal:          'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'REVERSAL_IMMINENT';
  cot_extremes:        boolean;   // large specs at extreme positioning
  // Options derived
  put_call_ratio?:     number;
  pcr_signal?:         'EXTREME_FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME_GREED';
  gamma_exposure?:     number;
  gex_signal?:         'POSITIVE_GEX' | 'NEGATIVE_GEX' | 'NEUTRAL_GEX';
  max_pain_level?:     number;
  // Composite
  institutional_sentiment: number;   // -100 to +100
  smart_money_direction:   'BULLISH' | 'BEARISH' | 'NEUTRAL';
  signal_strength:         'STRONG' | 'MODERATE' | 'WEAK';
  key_levels: {
    strong_support?:  number;
    strong_resistance?: number;
    gamma_pin?:       number;
  };
  explanation:  string;
  data_sources: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// COT EXTREME DETECTION
// ─────────────────────────────────────────────────────────────────────────────

/** Returns 'EXTREME_LONG' | 'EXTREME_SHORT' | 'NORMAL' based on percentile */
function detectExtreme(
  currentNet: number,
  historicalNets: number[],
  percentileThreshold = 0.85,
): 'EXTREME_LONG' | 'EXTREME_SHORT' | 'NORMAL' {
  if (historicalNets.length < 10) return 'NORMAL';
  const sorted = [...historicalNets].sort((a, b) => a - b);
  const n = sorted.length;
  const upperP = sorted[Math.floor(n * percentileThreshold)];
  const lowerP = sorted[Math.floor(n * (1 - percentileThreshold))];
  if (currentNet >= upperP) return 'EXTREME_LONG';
  if (currentNet <= lowerP) return 'EXTREME_SHORT';
  return 'NORMAL';
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export class SmartMoneyFlowService {

  private cache: Map<string, SmartMoneySignal> = new Map();

  // ── Process COT data into a smart money signal ───────────────────────────

  processCOT(cot: COTData, assetClass: string): SmartMoneySignal {
    const commercialsNet  = cot.commercials_long  - cot.commercials_short;
    const largeSpecsNet   = cot.large_specs_long  - cot.large_specs_short;
    const smallSpecsNet   = cot.small_specs_long  - cot.small_specs_short;

    // Total open interest
    const totalOI = cot.commercials_long + cot.commercials_short +
                    cot.large_specs_long + cot.large_specs_short;

    // Normalise net positions as percentage of OI
    const largeSpecsPct   = totalOI > 0 ? (largeSpecsNet / totalOI) * 100 : 0;
    const commercialsPct  = totalOI > 0 ? (commercialsNet / totalOI) * 100 : 0;

    // COT signal: large specs are the primary trend signal
    // When they're extremely positioned, watch for reversal if commercials flip
    let cotSignal: SmartMoneySignal['cot_signal'] = 'NEUTRAL';
    if (largeSpecsPct > 20) {
      // Commercials hedging aggressively against the trend = reversal imminent
      cotSignal = commercialsPct < -15 ? 'REVERSAL_IMMINENT' : 'BULLISH';
    } else if (largeSpecsPct < -20) {
      cotSignal = commercialsPct > 15  ? 'REVERSAL_IMMINENT' : 'BEARISH';
    }

    // Institutional sentiment: large specs drive this
    // Small specs are contrarian (when they're extreme, fade them)
    const smallSpecsContrarian = smallSpecsNet > 0 ? -10 : 10;
    const institutionalSentiment = Math.max(-100, Math.min(100,
      largeSpecsPct * 2.5 + smallSpecsContrarian
    ));

    let direction: SmartMoneySignal['smart_money_direction'] = 'NEUTRAL';
    if (institutionalSentiment > 20)  direction = 'BULLISH';
    if (institutionalSentiment < -20) direction = 'BEARISH';

    const absIS = Math.abs(institutionalSentiment);
    const strength: SmartMoneySignal['signal_strength'] =
      absIS >= 60 ? 'STRONG' : absIS >= 30 ? 'MODERATE' : 'WEAK';

    const explanation = this.buildCOTExplanation(
      cot.symbol, cotSignal, largeSpecsPct, commercialsPct, smallSpecsNet
    );

    const signal: SmartMoneySignal = {
      symbol:                   cot.symbol,
      asset_class:              assetClass,
      report_date:              cot.report_date,
      commercials_net:          commercialsNet,
      large_specs_net:          largeSpecsNet,
      small_specs_net:          smallSpecsNet,
      cot_signal:               cotSignal,
      cot_extremes:             Math.abs(largeSpecsPct) > 25,
      institutional_sentiment:  Math.round(institutionalSentiment),
      smart_money_direction:    direction,
      signal_strength:          strength,
      key_levels:               {},
      explanation,
      data_sources:             ['CFTC_COT'],
    };

    this.cache.set(cot.symbol, signal);

    // Persist to Supabase
    if (isSupabaseEnabled()) {
      supabaseService.insertSmartMoneyFlow({
        symbol:                 cot.symbol,
        asset_class:            assetClass,
        report_date:            cot.report_date,
        data_source:            'CFTC_COT',
        commercials_net:        commercialsNet,
        large_specs_net:        largeSpecsNet,
        small_specs_net:        smallSpecsNet,
        institutional_sentiment: Math.round(institutionalSentiment),
      }).catch(e => console.warn('[SmartMoney] Supabase persist error:', e.message));
    }

    return signal;
  }

  // ── Overlay options data ─────────────────────────────────────────────────

  overlayOptions(symbol: string, options: OptionsFlow): SmartMoneySignal | null {
    const existing = this.cache.get(symbol);
    const pcr = options.put_call_ratio;
    const gex = options.gamma_exposure;

    // PCR interpretation
    let pcrSignal: SmartMoneySignal['pcr_signal'] = 'NEUTRAL';
    if      (pcr >= 1.5) pcrSignal = 'EXTREME_FEAR';
    else if (pcr >= 1.2) pcrSignal = 'FEAR';
    else if (pcr <= 0.5) pcrSignal = 'EXTREME_GREED';
    else if (pcr <= 0.7) pcrSignal = 'GREED';

    // GEX interpretation
    let gexSignal: SmartMoneySignal['gex_signal'] = 'NEUTRAL_GEX';
    if (gex > 100_000_000)      gexSignal = 'POSITIVE_GEX';
    else if (gex < -100_000_000) gexSignal = 'NEGATIVE_GEX';

    if (existing) {
      existing.put_call_ratio = pcr;
      existing.pcr_signal     = pcrSignal;
      existing.gamma_exposure = gex;
      existing.gex_signal     = gexSignal;
      existing.max_pain_level = options.max_pain_level;
      existing.key_levels.gamma_pin = options.max_pain_level;
      existing.data_sources.push('OPTIONS_FLOW');

      // Adjust sentiment based on options: extreme fear is contrarian bullish
      if (pcrSignal === 'EXTREME_FEAR') {
        existing.institutional_sentiment = Math.min(100, existing.institutional_sentiment + 20);
      } else if (pcrSignal === 'EXTREME_GREED') {
        existing.institutional_sentiment = Math.max(-100, existing.institutional_sentiment - 20);
      }

      this.cache.set(symbol, existing);

      if (isSupabaseEnabled()) {
        supabaseService.insertSmartMoneyFlow({
          symbol,
          asset_class:              existing.asset_class,
          report_date:              options.expiry_date,
          data_source:              'OPTIONS_FLOW',
          commercials_net:          existing.commercials_net,
          large_specs_net:          existing.large_specs_net,
          small_specs_net:          existing.small_specs_net,
          institutional_sentiment:  existing.institutional_sentiment,
          options_put_call_ratio:   pcr,
          gamma_exposure:           gex,
        }).catch(e => console.warn('[SmartMoney] Options persist error:', e.message));
      }

      return existing;
    }

    // Options-only signal (no COT data)
    const optionsOnlySignal: SmartMoneySignal = {
      symbol,
      asset_class:             'stock',
      report_date:             options.expiry_date,
      commercials_net:         0,
      large_specs_net:         0,
      small_specs_net:         0,
      cot_signal:              'NEUTRAL',
      cot_extremes:            false,
      put_call_ratio:          pcr,
      pcr_signal:              pcrSignal,
      gamma_exposure:          gex,
      gex_signal:              gexSignal,
      max_pain_level:          options.max_pain_level,
      institutional_sentiment: pcrSignal === 'EXTREME_FEAR' ? 40 : pcrSignal === 'EXTREME_GREED' ? -40 : 0,
      smart_money_direction:   'NEUTRAL',
      signal_strength:         Math.abs(pcr - 1) > 0.5 ? 'STRONG' : 'MODERATE',
      key_levels:              { gamma_pin: options.max_pain_level },
      explanation:             `Options PCR: ${pcr.toFixed(2)} (${pcrSignal}). GEX: ${gex >= 0 ? 'positive' : 'negative'} — ${gexSignal}`,
      data_sources:            ['OPTIONS_FLOW'],
    };

    this.cache.set(symbol, optionsOnlySignal);
    return optionsOnlySignal;
  }

  // ── Build explanation text ────────────────────────────────────────────────

  private buildCOTExplanation(
    symbol: string,
    cotSignal: string,
    largeSpecsPct: number,
    commercialsPct: number,
    smallSpecsNet: number,
  ): string {
    const direction = largeSpecsPct > 0 ? 'long' : 'short';
    const reverse   = smallSpecsNet  > 0 ? 'long (contrarian bearish)' : 'short (contrarian bullish)';

    if (cotSignal === 'REVERSAL_IMMINENT') {
      return `⚠️ REVERSAL SIGNAL on ${symbol}: Large specs are ${Math.abs(largeSpecsPct).toFixed(1)}% net ${direction} BUT commercials are aggressively hedging the opposite direction. This pattern has historically preceded major reversals. CAUTION — do not chase the current trend.`;
    }
    if (cotSignal === 'BULLISH') {
      return `📈 BULLISH: Large institutional specs are ${largeSpecsPct.toFixed(1)}% net long ${symbol}. Small specs are ${reverse}. Commercial hedgers positioned at ${commercialsPct.toFixed(1)}%.`;
    }
    if (cotSignal === 'BEARISH') {
      return `📉 BEARISH: Large institutional specs are ${Math.abs(largeSpecsPct).toFixed(1)}% net short ${symbol}. Small specs are ${reverse}. Commercial hedgers positioned at ${commercialsPct.toFixed(1)}%.`;
    }
    return `⚖️ NEUTRAL: ${symbol} positioning is mixed. Large specs at ${largeSpecsPct.toFixed(1)}% net, commercials at ${commercialsPct.toFixed(1)}%. No clear institutional bias detected.`;
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  getSignal(symbol: string): SmartMoneySignal | null {
    return this.cache.get(symbol) || null;
  }

  getAllSignals(): SmartMoneySignal[] {
    return Array.from(this.cache.values());
  }

  getSummary(): {
    total_symbols:    number;
    bullish:          number;
    bearish:          number;
    neutral:          number;
    reversal_alerts:  string[];
    last_updated:     string;
  } {
    const signals = this.getAllSignals();
    const bullish = signals.filter(s => s.smart_money_direction === 'BULLISH').length;
    const bearish = signals.filter(s => s.smart_money_direction === 'BEARISH').length;
    const reversals = signals
      .filter(s => s.cot_signal === 'REVERSAL_IMMINENT')
      .map(s => s.symbol);

    return {
      total_symbols:    signals.length,
      bullish,
      bearish,
      neutral:          signals.length - bullish - bearish,
      reversal_alerts:  reversals,
      last_updated:     new Date().toISOString(),
    };
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const smartMoneyFlow = new SmartMoneyFlowService();
export default smartMoneyFlow;
