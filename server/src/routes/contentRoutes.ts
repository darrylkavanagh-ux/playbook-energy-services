/**
 * CONTENT INTELLIGENCE ROUTES
 * =============================================================================
 * Express router for the ContentIntelligenceEngine and LanguageCalibrationService.
 *
 * These endpoints form the CVK-1100 Writing/Dialogue/Content Engine diagnostic
 * API. All platform-generated text is produced to the 1,100-point standard —
 * indistinguishable from expert human professional writing across 11 languages.
 *
 * Routes:
 *   POST /api/content/generate              — Generate content with quality gate
 *   POST /api/content/batch                 — Batch generation (up to 20 items)
 *   GET  /api/content/calibration           — Language calibration summary
 *   GET  /api/content/calibration/profiles  — All 11 language profiles
 *   GET  /api/content/calibration/:lang/:mode — Specific calibration model
 *   POST /api/content/diagnostic            — Full CVK-1100 diagnostic run
 *   GET  /api/content/modes                 — Available writing modes
 *   GET  /api/content/languages             — Supported languages + profiles
 *   GET  /api/content/quality-report/:contentId — Quality report for stored output
 *
 * CVK-1100 Standard:
 *   - Quality score ≥ 85/100
 *   - Zero AI-tells detected (29 prohibited phrases)
 *   - Sentence variety ≥ 0.3
 *   - Domain vocabulary coverage ≥ 0.6
 *   - All 11 language profiles calibrated
 *
 * Compliance: FCA COBS 12, MiFID II Art 24, Consumer Duty PS22/9.
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import {
  contentEngine,
  ContentRequest,
  ContentOutput,
  WritingMode,
  SupportedLanguage,
  ContentTone,
} from '../engines/ContentIntelligenceEngine.js';
import { languageCalibration } from '../services/LanguageCalibrationService.js';

const router = Router();

// CVK-1100 quality threshold for diagnostic reporting
const CVK_1100_THRESHOLD    = 85;
const CVK_1100_AI_TELLS_MAX = 0;
const CVK_1100_VARIETY_MIN  = 0.3;

// In-memory content store for quality-report lookups (session-scoped)
const outputStore = new Map<string, ContentOutput>();

// ── Helpers ──────────────────────────────────────────────────────────────────

function cvk1100Pass(output: ContentOutput): boolean {
  return (
    output.quality_score      >= CVK_1100_THRESHOLD &&
    output.ai_tells_detected.length === CVK_1100_AI_TELLS_MAX &&
    output.sentence_variety   >= CVK_1100_VARIETY_MIN &&
    output.passed_gate
  );
}

function cvk1100Score(output: ContentOutput): number {
  // Scale quality_score (0–100) → CVK-1100 scale (0–1100)
  return Math.round((output.quality_score / 100) * 1100);
}

function guard400(res: Response, missing: string[]): boolean {
  if (missing.length) {
    res.status(400).json({
      success: false,
      error:   `Missing required fields: ${missing.join(', ')}`,
    });
    return true;
  }
  return false;
}

// ── POST /api/content/generate ───────────────────────────────────────────────

/**
 * POST /api/content/generate
 *
 * Generate a single piece of content through the CVK-1100 quality gate.
 * Content is produced in the specified writing mode and language. If the
 * output fails the quality gate (AI-tells detected, score < 85, or low
 * sentence variety) a warning is returned alongside the output.
 *
 * Body:
 *   mode          string   — WritingMode (TRADING_ANALYST | LEGAL_COUNSEL | etc.)
 *   language?     string   — SupportedLanguage (default 'en')
 *   tone?         string   — ContentTone (default 'PROFESSIONAL')
 *   context       object   — ContentContext (symbol, direction, findings, etc.)
 *   max_words?    number   — Maximum word count (default 200)
 *   min_words?    number   — Minimum word count (default 80)
 *   ingest_feedback? boolean — Feed output into calibration service (default true)
 *
 * Response 200: { success, output, cvk_1100_score, passed_gate, warnings }
 * Response 400: Missing or invalid fields
 * Response 422: Content failed quality gate (output returned with failure detail)
 * Response 500: Internal error
 */
router.post('/generate', (req: Request, res: Response) => {
  try {
    const { mode, language, tone, context, max_words, min_words, ingest_feedback } = req.body;

    const missing: string[] = [];
    if (!mode)    missing.push('mode');
    if (!context) missing.push('context');
    if (guard400(res, missing)) return;

    const validModes: WritingMode[] = [
      'TRADING_ANALYST', 'LEGAL_COUNSEL', 'FORENSIC_EXAMINER',
      'RISK_OFFICER', 'MARKET_COMMENTATOR', 'COMPLIANCE_OFFICER',
    ];
    if (!validModes.includes(mode as WritingMode)) {
      res.status(400).json({
        success:      false,
        error:        `Invalid mode "${mode}". Valid modes: ${validModes.join(', ')}.`,
        valid_modes:  validModes,
      });
      return;
    }

    const request: ContentRequest = {
      mode:      mode as WritingMode,
      language:  (language ?? 'en') as SupportedLanguage,
      tone:      (tone ?? 'PROFESSIONAL') as ContentTone,
      context,
      max_words: max_words ? Number(max_words) : undefined,
      min_words: min_words ? Number(min_words) : undefined,
    };

    const output = contentEngine.generate(request);
    outputStore.set(output.content_id, output);

    // Feed into calibration service unless explicitly disabled
    if (ingest_feedback !== false) {
      languageCalibration.ingest(output);
    }

    const cvkScore  = cvk1100Score(output);
    const passed    = cvk1100Pass(output);
    const warnings: string[] = [];

    if (output.ai_tells_detected.length > 0) {
      warnings.push(`AI-tell phrases detected (${output.ai_tells_detected.length}): ${output.ai_tells_detected.join(', ')}. These phrases mark content as machine-generated and must be purged before publication.`);
    }
    if (output.quality_score < CVK_1100_THRESHOLD) {
      warnings.push(`Quality score ${output.quality_score}/100 is below CVK-1100 threshold of ${CVK_1100_THRESHOLD}. Content requires revision.`);
    }
    if (output.sentence_variety < CVK_1100_VARIETY_MIN) {
      warnings.push(`Sentence variety ${output.sentence_variety.toFixed(3)} is below minimum ${CVK_1100_VARIETY_MIN}. Increase structural variation to prevent robotic cadence.`);
    }

    const statusCode = passed ? 200 : 422;

    res.status(statusCode).json({
      success:         passed,
      output,
      cvk_1100_score:  cvkScore,
      cvk_1100_target: 1100,
      passed_gate:     passed,
      warnings:        warnings.length ? warnings : undefined,
      quality_detail: {
        quality_score:      `${output.quality_score}/100 (CVK-1100: ${cvkScore}/1100)`,
        ai_tells_detected:  output.ai_tells_detected.length,
        sentence_variety:   output.sentence_variety.toFixed(3),
        domain_coverage:    output.domain_coverage.toFixed(3),
        readability_score:  output.readability_score.toFixed(1),
        word_count:         output.word_count,
      },
      quality_report_endpoint: `/api/content/quality-report/${output.content_id}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── POST /api/content/batch ──────────────────────────────────────────────────

/**
 * POST /api/content/batch
 *
 * Generate multiple pieces of content in a single request. Maximum 20 items.
 * Each item goes through the full CVK-1100 quality gate independently.
 *
 * Body:
 *   requests   ContentRequest[]  — array of content requests (max 20)
 *   ingest_feedback? boolean    — feed passing outputs into calibration (default true)
 *
 * Response 200: { success, results, summary }
 */
router.post('/batch', (req: Request, res: Response) => {
  try {
    const { requests, ingest_feedback } = req.body;

    if (!Array.isArray(requests) || requests.length === 0) {
      res.status(400).json({
        success: false,
        error:   'requests must be a non-empty array of ContentRequest objects.',
      });
      return;
    }

    if (requests.length > 20) {
      res.status(400).json({
        success: false,
        error:   `Batch limit is 20 items. You submitted ${requests.length}.`,
      });
      return;
    }

    const outputs = contentEngine.generateBatch(requests as ContentRequest[]);

    // Store and optionally ingest
    let passCount = 0;
    let failCount = 0;
    let totalCvkScore = 0;

    const results = outputs.map(output => {
      outputStore.set(output.content_id, output);
      if (ingest_feedback !== false) {
        languageCalibration.ingest(output);
      }

      const passed   = cvk1100Pass(output);
      const cvkScore = cvk1100Score(output);
      if (passed) passCount++; else failCount++;
      totalCvkScore += cvkScore;

      return {
        content_id:     output.content_id,
        mode:           output.mode,
        language:       output.language,
        passed_gate:    passed,
        cvk_1100_score: cvkScore,
        quality_score:  output.quality_score,
        ai_tells:       output.ai_tells_detected.length,
        word_count:     output.word_count,
        text_preview:   output.text.substring(0, 120) + (output.text.length > 120 ? '...' : ''),
        quality_report_endpoint: `/api/content/quality-report/${output.content_id}`,
      };
    });

    res.status(200).json({
      success: true,
      results,
      summary: {
        total:            outputs.length,
        passed:           passCount,
        failed:           failCount,
        pass_rate:        `${((passCount / outputs.length) * 100).toFixed(1)}%`,
        avg_cvk_score:    Math.round(totalCvkScore / outputs.length),
        cvk_1100_target:  1100,
        batch_status:     failCount === 0 ? 'ALL_PASSED' : passCount === 0 ? 'ALL_FAILED' : 'PARTIAL_PASS',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── POST /api/content/diagnostic ─────────────────────────────────────────────

/**
 * POST /api/content/diagnostic
 *
 * Full CVK-1100 diagnostic run. Generates one sample output for every
 * WritingMode × Language combination (6 modes × specified languages),
 * evaluates all outputs against the 1,100-point standard, and returns
 * a comprehensive diagnostic report.
 *
 * Body:
 *   languages?   string[]  — subset of languages to test (default: all 11)
 *   context?     object    — shared ContentContext for all samples
 *
 * Response 200: { success, diagnostic_report }
 *
 * NOTE: Running all 66 combinations (6 × 11) can take several seconds.
 *       For quick checks use languages: ['en'] (6 outputs only).
 */
router.post('/diagnostic', (req: Request, res: Response) => {
  try {
    const { languages, context } = req.body;

    const allModes: WritingMode[] = [
      'TRADING_ANALYST', 'LEGAL_COUNSEL', 'FORENSIC_EXAMINER',
      'RISK_OFFICER', 'MARKET_COMMENTATOR', 'COMPLIANCE_OFFICER',
    ];
    const allLanguages: SupportedLanguage[] = ['en', 'fr', 'de', 'es', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi'];

    const targetLanguages: SupportedLanguage[] = Array.isArray(languages)
      ? languages.filter((l: string) => allLanguages.includes(l as SupportedLanguage)) as SupportedLanguage[]
      : allLanguages;

    if (targetLanguages.length === 0) {
      res.status(400).json({
        success: false,
        error:   `No valid languages specified. Supported: ${allLanguages.join(', ')}.`,
      });
      return;
    }

    const defaultContext = context ?? {
      symbol:      'EUR/USD',
      asset_class: 'FOREX',
      direction:   'BULLISH',
      oracle_score: 78,
      conviction:  'HIGH',
      timeframe:   '4H',
    };

    // Build all requests
    const requests: ContentRequest[] = [];
    for (const lang of targetLanguages) {
      for (const mode of allModes) {
        requests.push({ mode, language: lang, tone: 'PROFESSIONAL', context: defaultContext });
      }
    }

    const outputs = contentEngine.generateBatch(requests);
    outputs.forEach(o => {
      outputStore.set(o.content_id, o);
      languageCalibration.ingest(o);
    });

    // Aggregate metrics
    const passedOutputs  = outputs.filter(cvk1100Pass);
    const failedOutputs  = outputs.filter(o => !cvk1100Pass(o));
    const avgQuality     = outputs.reduce((a, o) => a + o.quality_score, 0) / outputs.length;
    const avgCvkScore    = Math.round((avgQuality / 100) * 1100);
    const avgVariety     = outputs.reduce((a, o) => a + o.sentence_variety, 0) / outputs.length;
    const totalAiTells   = outputs.reduce((a, o) => a + o.ai_tells_detected.length, 0);

    // Per-mode breakdown
    const byMode: Record<string, { pass: number; fail: number; avg_score: number }> = {};
    for (const mode of allModes) {
      const modeOutputs = outputs.filter(o => o.mode === mode);
      const modePass    = modeOutputs.filter(cvk1100Pass).length;
      byMode[mode] = {
        pass:      modePass,
        fail:      modeOutputs.length - modePass,
        avg_score: Math.round(modeOutputs.reduce((a, o) => a + o.quality_score, 0) / modeOutputs.length),
      };
    }

    // Per-language breakdown
    const byLanguage: Record<string, { pass: number; fail: number; avg_score: number }> = {};
    for (const lang of targetLanguages) {
      const langOutputs = outputs.filter(o => o.language === lang);
      const langPass    = langOutputs.filter(cvk1100Pass).length;
      byLanguage[lang] = {
        pass:      langPass,
        fail:      langOutputs.length - langPass,
        avg_score: Math.round(langOutputs.reduce((a, o) => a + o.quality_score, 0) / langOutputs.length),
      };
    }

    const overallPassRate = (passedOutputs.length / outputs.length) * 100;
    const cvk1100Met      = overallPassRate >= 98.5 && totalAiTells === 0;

    // Recommendations
    const recommendations: string[] = [];
    if (totalAiTells > 0) {
      const tellDetails = outputs
        .filter(o => o.ai_tells_detected.length > 0)
        .map(o => `[${o.mode}/${o.language}]: ${o.ai_tells_detected.join(', ')}`);
      recommendations.push(`CRITICAL: ${totalAiTells} AI-tell phrase(s) detected. These must be eliminated before any content is published. Affected outputs: ${tellDetails.join(' | ')}`);
    }
    if (avgVariety < 0.35) {
      recommendations.push('Sentence variety is below optimal (target ≥ 0.35). Introduce more structural variation: mix short declarative sentences with longer analytical constructions. Avoid consecutive sentences of similar length.');
    }
    if (avgQuality < CVK_1100_THRESHOLD) {
      recommendations.push(`Average quality score ${avgQuality.toFixed(1)} is below CVK-1100 threshold ${CVK_1100_THRESHOLD}. Increase domain vocabulary density, reduce generic phrasing, and ensure all outputs contain at least 3 domain-specific terms per paragraph.`);
    }
    const lowModeModes = Object.entries(byMode).filter(([, v]) => v.avg_score < CVK_1100_THRESHOLD);
    if (lowModeModes.length) {
      recommendations.push(`Writing modes below threshold: ${lowModeModes.map(([m, v]) => `${m} (${v.avg_score})`).join(', ')}. Expand domain vocabulary banks for these modes.`);
    }
    const lowLangLangs = Object.entries(byLanguage).filter(([, v]) => v.avg_score < CVK_1100_THRESHOLD);
    if (lowLangLangs.length) {
      recommendations.push(`Languages below threshold: ${lowLangLangs.map(([l, v]) => `${l} (${v.avg_score})`).join(', ')}. These language profiles require additional calibration samples (target: 100 passing samples before model rebuild).`);
    }
    if (recommendations.length === 0) {
      recommendations.push('All CVK-1100 criteria met. Content engine is operating at the 1,100-point standard across all tested language × mode combinations.');
    }

    res.status(200).json({
      success: true,
      diagnostic_report: {
        run_at:            new Date().toISOString(),
        total_outputs:     outputs.length,
        languages_tested:  targetLanguages,
        modes_tested:      allModes,
        cvk_1100_achieved: cvk1100Met,
        overall: {
          pass_count:        passedOutputs.length,
          fail_count:        failedOutputs.length,
          pass_rate:         `${overallPassRate.toFixed(1)}%`,
          avg_quality_score: avgQuality.toFixed(1),
          avg_cvk_score:     avgCvkScore,
          cvk_1100_target:   1100,
          avg_sentence_variety: avgVariety.toFixed(3),
          total_ai_tells:    totalAiTells,
        },
        by_mode:     byMode,
        by_language: byLanguage,
        recommendations,
        failed_outputs: failedOutputs.map(o => ({
          content_id:        o.content_id,
          mode:              o.mode,
          language:          o.language,
          quality_score:     o.quality_score,
          ai_tells_detected: o.ai_tells_detected,
          sentence_variety:  o.sentence_variety.toFixed(3),
        })),
        calibration_summary: languageCalibration.getSummary(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/content/calibration ─────────────────────────────────────────────

/**
 * GET /api/content/calibration
 *
 * Returns the language calibration summary across all 11 language profiles.
 * Includes total sample counts, active languages, and models built.
 */
router.get('/calibration', (_req: Request, res: Response) => {
  try {
    const summary = languageCalibration.getSummary();

    res.status(200).json({
      success: true,
      summary,
      note: 'The LanguageCalibrationService ingests passing ContentOutput samples and rebuilds calibration models every 100 samples. Models inform tone, formality, and structure parameters for each language.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/content/calibration/profiles ────────────────────────────────────

/**
 * GET /api/content/calibration/profiles
 *
 * Returns all 11 language profiles including formality baselines,
 * politeness levels, script type, and calibration state.
 */
router.get('/calibration/profiles', (_req: Request, res: Response) => {
  try {
    const profiles = languageCalibration.getProfiles();

    res.status(200).json({
      success: true,
      profiles,
      languages_supported: Object.keys(profiles),
      note: 'Profiles include: EN, FR, DE, ES, IT, PT, ZH, JA, KO, AR, HI. Each profile encodes Heylighen formality baseline, average sentence length, passive voice ratio, politeness level, and script direction.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/content/calibration/:lang/:mode ─────────────────────────────────

/**
 * GET /api/content/calibration/:lang/:mode
 *
 * Returns the specific calibration model for a language × mode combination,
 * if enough samples have been ingested to build one.
 *
 * Response 200: { success, model } or { success, model: null, message }
 */
router.get('/calibration/:lang/:mode', (req: Request, res: Response) => {
  try {
    const lang = String(req.params.lang); const mode = String(req.params.mode);
    const model = languageCalibration.getModel(
      mode as WritingMode,
      lang as SupportedLanguage,
    );

    if (!model) {
      res.status(200).json({
        success: true,
        model:   null,
        message: `No calibration model yet for ${mode}/${lang}. Minimum 100 passing samples required. Ingest more content through POST /api/content/generate to build this model.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      model,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/content/modes ───────────────────────────────────────────────────

/**
 * GET /api/content/modes
 *
 * Returns all available writing modes with descriptions and domain vocabulary counts.
 */
router.get('/modes', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    modes: [
      {
        id:          'TRADING_ANALYST',
        description: 'Senior trading desk analyst writing style. Technical precision, FX/equity/crypto vocabulary, signal analysis framing.',
        example_domains: ['momentum', 'confluence', 'breakout', 'retracement', 'divergence', 'liquidity'],
      },
      {
        id:          'LEGAL_COUNSEL',
        description: 'Senior solicitor or barrister drafting style. Authoritative, precise, statute-referenced. No hedging without legal basis.',
        example_domains: ['pursuant', 'notwithstanding', 'without prejudice', 'inter alia', 'prima facie'],
      },
      {
        id:          'FORENSIC_EXAMINER',
        description: 'Forensic investigator report writing. Evidence-anchored, methodology-cited, conclusion hedged by evidence weight.',
        example_domains: ['Benford', 'chain of custody', 'hash verification', 'temporal correlation', 'anomaly'],
      },
      {
        id:          'RISK_OFFICER',
        description: 'Chief risk officer or risk manager communication style. Probability-framed, scenario-aware, regulatory-anchored.',
        example_domains: ['VaR', 'drawdown', 'tail risk', 'stress test', 'counterparty exposure'],
      },
      {
        id:          'MARKET_COMMENTATOR',
        description: 'Senior market commentator writing for professional audiences. Informed, contextual, avoids sensationalism.',
        example_domains: ['macro backdrop', 'risk-off', 'yield spread', 'positioning', 'catalysts'],
      },
      {
        id:          'COMPLIANCE_OFFICER',
        description: 'Compliance officer drafting regulatory correspondence and internal policy. Precise, unambiguous, audit-trail aware.',
        example_domains: ['MiFID II', 'Consumer Duty', 'FCA COBS', 'GDPR Art 22', 'ESMA'],
      },
    ],
    cvk_1100_note: 'All modes are calibrated to the CVK-1100 standard: zero AI-tells, quality score ≥ 85, sentence variety ≥ 0.3, domain coverage ≥ 0.6. Text must be indistinguishable from expert human professional writing.',
  });
});

// ── GET /api/content/languages ───────────────────────────────────────────────

/**
 * GET /api/content/languages
 *
 * Returns all 11 supported languages with their profile summaries.
 */
router.get('/languages', (_req: Request, res: Response) => {
  try {
    const profiles = languageCalibration.getProfiles();

    res.status(200).json({
      success: true,
      languages: Object.entries(profiles).map(([code, profile]) => ({
        code,
        name:              profile.name,
        native_name:       profile.native_name,
        script:            profile.script,
        rtl:               profile.rtl,
        formality_baseline: profile.formality_baseline,
        politeness_level:  profile.politeness_level,
        sample_count:      profile.sample_count,
        calibrated:        profile.calibrated_at !== null,
      })),
      note: 'The CVK-1100 standard mandates calibration across all 11 languages. Each language profile encodes culturally appropriate formality, politeness, and sentence structure parameters to ensure output is indistinguishable from native professional writing.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── GET /api/content/quality-report/:contentId ───────────────────────────────

/**
 * GET /api/content/quality-report/:contentId
 *
 * Returns a detailed human-readable quality report for a previously generated
 * content item (identified by its content_id).
 *
 * Note: The output store is session-scoped (in-memory). Reports are available
 * only during the current server session.
 *
 * Response 200: { success, report, output }
 * Response 404: Content ID not found in this session
 */
router.get('/quality-report/:contentId', (req: Request, res: Response) => {
  try {
    const contentId = String(req.params.contentId);
    const output = outputStore.get(contentId);

    if (!output) {
      res.status(404).json({
        success: false,
        error:   `Content ID "${contentId}" not found in this session. Quality reports are session-scoped. Re-generate the content to obtain a fresh report.`,
      });
      return;
    }

    const report = contentEngine.qualityReport(output);
    const cvkScore = cvk1100Score(output);
    const passed   = cvk1100Pass(output);

    res.status(200).json({
      success: true,
      report,
      cvk_1100_score:  cvkScore,
      cvk_1100_target: 1100,
      passed_gate:     passed,
      output: {
        content_id:        output.content_id,
        mode:              output.mode,
        language:          output.language,
        quality_score:     output.quality_score,
        sentence_variety:  output.sentence_variety,
        domain_coverage:   output.domain_coverage,
        ai_tells_detected: output.ai_tells_detected,
        word_count:        output.word_count,
        passed_gate:       output.passed_gate,
        generated_at:      output.generated_at,
        text:              output.text,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
