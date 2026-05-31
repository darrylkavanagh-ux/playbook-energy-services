/**
 * PROFESSIONAL FORECAST ROUTES — CVK-1100
 * =============================================================================
 * Trading tips, professional forecasts, and certificate sign-off system.
 *
 * ENDPOINTS:
 *   POST /api/trading/forecast              — Generate professional forecast from signal
 *   GET  /api/trading/forecast/:id          — Get a specific forecast
 *   GET  /api/trading/forecast/:id/status   — Get sign-off status
 *   POST /api/trading/forecast/:id/signoff  — User submits forecast for sign-off
 *   POST /api/trading/forecast/:id/sign     — Professional signs the forecast
 *   GET  /api/trading/forecasts             — List all forecasts
 *   GET  /api/trading/forecasts/pending     — Forecasts awaiting sign-off
 *   GET  /api/trading/forecasts/signed      — Signed (valid) forecasts
 *   GET  /api/trading/professionals         — Registry of qualified professionals
 *   POST /api/trading/professionals         — Register a new professional
 *   POST /api/trading/professionals/:id/activate — Activate professional (Darryl only)
 *   GET  /api/trading/professionals/domains — Domain requirements
 *   GET  /api/trading/tips                  — Latest signed trading tips (public)
 */

import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { multiAssetEngine }              from '../engines/MultiAssetTradingEngine.js';
import { signalCalibrator }              from '../services/SignalCalibrationService.js';
import { centralBankNLP }               from '../services/CentralBankNLPService.js';
import { smartMoneyFlow }               from '../services/SmartMoneyFlowService.js';
import { professionalForecastService }  from '../services/ProfessionalForecastService.js';
import { professionalRegistry }         from '../services/QualifiedProfessionalRegistry.js';
import type { AssetClass }              from '../services/MarketDataService.js';
import type { ForecastType, ForecastTimeframe } from '../services/ProfessionalForecastService.js';
import type { ProfessionalDomain }      from '../services/QualifiedProfessionalRegistry.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trading/forecast — Generate professional forecast from a signal
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forecast', async (req: Request, res: Response) => {
  try {
    const {
      symbol          = 'EUR/USD',
      asset_class     = 'forex' as AssetClass,
      forecast_type   = 'TRADING_TIP' as ForecastType,
      timeframe       = '1H' as ForecastTimeframe,
    } = req.body;

    if (!['forex', 'crypto', 'stock'].includes(asset_class)) {
      return res.status(400).json({ error: 'asset_class must be forex | crypto | stock' });
    }

    // 1. Generate live signal
    const signal = await multiAssetEngine.generateSignal(symbol.toUpperCase(), asset_class);

    // 2. Apply calibration
    const calibration = signalCalibrator.calibrateWithTier(signal.confidence_pct, signal.asset_class);
    (signal as any).calibrated_probability = calibration.calibrated_probability;
    (signal as any).calibrated_pct         = calibration.calibrated_pct;

    // 3. Compute Oracle 12-pillar score
    const layers     = (signal as any).layers || {};
    const techScore  = layers.technical?.score     ?? signal.signal_score;
    const volScore   = layers.volume?.score        ?? 50;
    const momScore   = layers.momentum?.score      ?? 50;
    const assetScore = layers.asset_specific?.score ?? 50;
    const patLayer   = layers.pattern_layer         ?? { confidence: 0, trade_bias: 'WAIT', adjustment: 0 };
    const p5 = patLayer.trade_bias === 'WAIT' ? 50
             : patLayer.trade_bias === signal.action ? Math.min(100, 50 + patLayer.confidence * 0.5)
             : Math.max(0, 50 - patLayer.confidence * 0.3);

    const cbDivergence = centralBankNLP.getDivergenceSignals();
    const symbolBase   = signal.symbol.slice(0, 3);
    const cbEntry      = cbDivergence.find((d: any) => d.pair?.includes(symbolBase));
    const p7 = cbEntry ? Math.min(100, Math.max(0, 50 + ((cbEntry as any).bias_score ?? 0) * 0.5)) : 50;

    const smSignal = smartMoneyFlow.getSignal(signal.symbol);
    const p8 = smSignal ? Math.min(100, Math.max(0, 50 + (smSignal.institutional_sentiment ?? 0) * 0.5)) : 50;
    const p9 = Math.min(100, Math.max(0, (signal.risk_reward / 3) * 100));
    const p10 = signal.strength === 'STRONG' ? 95 : signal.strength === 'MODERATE' ? 70 : 40;
    const p12 = signal.candles_used >= 100 ? 100 : (signal.candles_used / 100) * 100;

    const oracleScore = Math.round(
      techScore * 0.20 + volScore * 0.10 + momScore * 0.10 + assetScore * 0.08 +
      p5 * 0.10 + calibration.calibrated_pct * 0.08 + p7 * 0.08 + p8 * 0.06 +
      p9 * 0.08 + p10 * 0.06 + 50 * 0.03 + p12 * 0.03
    );

    const oracle = {
      score: oracleScore,
      pillars: {
        p1_technical: techScore, p2_volume: volScore, p3_momentum: momScore,
        p4_asset_specific: assetScore, p5_pattern: p5,
        p6_calibrated_confidence: calibration.calibrated_pct,
        p7_cb_nlp: p7, p8_smart_money: p8, p9_risk_reward: p9,
        p10_strength: p10, p11_hitl: 50, p12_data_quality: p12,
      },
    };

    // 4. Generate professional forecast
    const forecast = professionalForecastService.generateFromSignal(
      signal, oracle, calibration, forecast_type, timeframe,
    );

    res.json({
      success:    true,
      forecast,
      signal_summary: {
        signal_id:    signal.signal_id,
        action:       signal.action,
        strength:     signal.strength,
        oracle_score: oracleScore,
        calibrated:   calibration.calibrated_pct,
      },
      next_step: {
        instruction: 'To make this forecast legally valid, return it for professional sign-off.',
        endpoint:    `POST /api/trading/forecast/${forecast.forecast_id}/signoff`,
        required:    'user_acknowledgement: true (accept all disclaimer points)',
        expires_at:  forecast.expires_at,
      },
    });

  } catch (err: any) {
    res.status(500).json({ error: `Forecast generation failed: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/forecast/:id — Get a specific forecast
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forecast/:id', (req: Request, res: Response) => {
  const forecast = professionalForecastService.getById(String(req.params.id));
  if (!forecast) return res.status(404).json({ error: 'Forecast not found or expired.' });

  res.json({ success: true, forecast });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/forecast/:id/status — Sign-off status
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forecast/:id/status', (req: Request, res: Response) => {
  const forecast = professionalForecastService.getById(String(req.params.id));
  if (!forecast) return res.status(404).json({ error: 'Forecast not found.' });

  const assignedProfessional = forecast.status === 'PENDING_SIGNOFF' || forecast.status === 'SIGNED'
    ? professionalRegistry.findBestMatch(forecast.asset_class, forecast.forecast_type)
    : null;

  res.json({
    success:         true,
    forecast_id:     forecast.forecast_id,
    status:          forecast.status,
    v10_certified:   forecast.v10_certified,
    cert_id:         forecast.cert_id || null,
    signed_at:       forecast.signed_at || null,
    signed_by:       forecast.signed_by || null,
    expires_at:      forecast.expires_at,
    responsibility_chain: forecast.responsibility_chain,
    assigned_professional: assignedProfessional ? {
      name:         assignedProfessional.full_name,
      domain:       assignedProfessional.primary_domain,
      qualification_level: assignedProfessional.qualification_level,
      can_sign:     assignedProfessional.can_sign,
      certs_signed: assignedProfessional.certificates_signed,
    } : null,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trading/forecast/:id/signoff — User returns forecast for sign-off
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forecast/:id/signoff', (req: Request, res: Response) => {
  try {
    const forecastId = String(req.params.id);
    const {
      requester_id,
      user_acknowledgement,
      reason = 'Requesting professional validation',
    } = req.body;

    if (!requester_id) {
      return res.status(400).json({ error: 'requester_id is required.' });
    }
    if (user_acknowledgement !== true) {
      return res.status(400).json({
        error: 'user_acknowledgement must be true. You must explicitly accept all disclaimer points.',
        disclaimer_points: [
          'I understand this is AI-generated information, NOT financial advice',
          'I accept full personal responsibility for any trading decisions I make',
          'I understand no guarantee of profit is made or implied',
          'I confirm I am not relying on this as a licensed professional recommendation',
          'I understand this forecast requires qualified professional sign-off to become legally valid',
          'I accept the risk warning and understand trading involves risk of total capital loss',
        ],
      });
    }

    // Hash IP for privacy
    const rawIp = req.ip || req.connection?.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16);

    const result = professionalForecastService.requestSignOff({
      forecast_id:          forecastId,
      requester_id,
      requester_type:       'USER',
      reason,
      user_acknowledgement: true,
      submitted_at:         new Date().toISOString(),
      ip_hash:              ipHash,
    });

    if (!result.success) return res.status(400).json(result);

    // Find and assign qualified professional
    const forecast = professionalForecastService.getById(forecastId);
    const qualified = forecast
      ? professionalRegistry.findBestMatch(forecast.asset_class, forecast.forecast_type)
      : null;

    res.json({
      ...result,
      assigned_professional: qualified ? {
        name:         qualified.full_name,
        domain:       qualified.primary_domain,
        qualification_level: qualified.qualification_level,
        credentials:  qualified.qualifications.filter(q => q.verified).map(q => q.credential_name),
        sign_domain:  qualified.sign_domains,
      } : null,
      cvk_1100_note: 'Sign-off process initiated. The platform has identified the qualified professional ' +
                     'for this domain. The forecast will NOT be legally valid until they complete their review.',
    });

  } catch (err: any) {
    res.status(500).json({ error: `Sign-off request failed: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trading/forecast/:id/sign — Professional signs the forecast
// ─────────────────────────────────────────────────────────────────────────────
router.post('/forecast/:id/sign', (req: Request, res: Response) => {
  try {
    const forecastId = String(req.params.id);
    const {
      professional_id,
      credential_id,
      decision = 'SIGN',
      notes    = '',
    } = req.body;

    if (!professional_id || !credential_id) {
      return res.status(400).json({ error: 'professional_id and credential_id are required.' });
    }
    if (!['SIGN', 'REJECT'].includes(decision)) {
      return res.status(400).json({ error: 'decision must be SIGN or REJECT.' });
    }

    // Verify professional is registered and active
    const professional = professionalRegistry.getById(professional_id);
    if (!professional) {
      return res.status(403).json({ error: 'Professional not found in registry.' });
    }
    if (!professional.can_sign) {
      return res.status(403).json({
        error: 'Professional is not authorised to sign certificates.',
        status: professional.status,
        reason: 'Qualification level L3+ and ACTIVE status required.',
      });
    }

    // Verify the credential is valid for this professional
    const cred = professional.qualifications.find(q => q.credential_id === credential_id);
    if (!cred) {
      return res.status(403).json({ error: `Credential ${credential_id} not found for professional ${professional_id}.` });
    }
    if (!cred.verified) {
      return res.status(403).json({ error: 'Credential has not been verified. Please contact compliance.' });
    }
    if (new Date(cred.expiry_date) < new Date()) {
      return res.status(403).json({ error: `Credential expired on ${cred.expiry_date}. Please renew.` });
    }

    // Check domain suitability
    const forecast = professionalForecastService.getById(forecastId);
    if (!forecast) return res.status(404).json({ error: 'Forecast not found.' });

    const domainMap: Record<string, ProfessionalDomain> = {
      forex: 'TRADING_FOREX', crypto: 'TRADING_CRYPTO', stock: 'TRADING_EQUITIES',
    };
    const requiredDomain = domainMap[forecast.asset_class] || 'TRADING_FOREX';
    if (!professional.sign_domains.includes(requiredDomain)) {
      return res.status(403).json({
        error: `Professional not authorised for domain ${requiredDomain}.`,
        professional_domains: professional.sign_domains,
      });
    }

    // Execute sign-off
    const result = professionalForecastService.professionalSignOff(
      forecastId,
      {
        credential_id,
        name:          professional.full_name,
        qualification: cred.credential_name,
        domain:        requiredDomain,
      },
      decision as 'SIGN' | 'REJECT',
      notes,
    );

    // Record the signature
    const sig = professionalRegistry.recordSignature(
      professional_id,
      forecastId,
      requiredDomain,
      decision === 'SIGN' ? 'SIGNED' : 'REJECTED',
      credential_id,
      notes,
    );

    res.json({
      ...result,
      signature: {
        id:    sig.signature_id,
        hash:  sig.hash,
        at:    sig.signed_at,
      },
      v10_status: result.success ? 'LEGALLY_VALID — V10 certified forecast' : 'REJECTED — not valid for use',
    });

  } catch (err: any) {
    res.status(500).json({ error: `Sign-off failed: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/forecasts — All forecasts (paginated)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forecasts', (_req: Request, res: Response) => {
  const forecasts = professionalForecastService.getAll(100);
  const stats     = professionalForecastService.stats();

  res.json({
    success:   true,
    total:     forecasts.length,
    stats,
    forecasts: forecasts.map(f => ({
      forecast_id:   f.forecast_id,
      forecast_type: f.forecast_type,
      status:        f.status,
      symbol:        f.symbol,
      direction:     f.direction,
      conviction:    f.conviction,
      oracle_score:  f.oracle_score,
      action:        f.tip?.action || 'N/A',
      v10_certified: f.v10_certified,
      cert_id:       f.cert_id || null,
      generated_at:  f.generated_at,
      expires_at:    f.expires_at,
    })),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/forecasts/pending — Awaiting sign-off
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forecasts/pending', (_req: Request, res: Response) => {
  const pending = professionalForecastService.getPendingSignOff();

  res.json({
    success: true,
    count:   pending.length,
    queue:   pending.map(f => ({
      forecast_id:  f.forecast_id,
      symbol:       f.symbol,
      asset_class:  f.asset_class,
      direction:    f.direction,
      oracle_score: f.oracle_score,
      status:       f.status,
      generated_at: f.generated_at,
      expires_at:   f.expires_at,
      responsibility_chain_length: f.responsibility_chain.length,
    })),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/forecasts/signed — Signed and legally valid
// ─────────────────────────────────────────────────────────────────────────────
router.get('/forecasts/signed', (_req: Request, res: Response) => {
  const signed = professionalForecastService.getSigned();

  res.json({
    success: true,
    count:   signed.length,
    forecasts: signed,
    note:    'These forecasts have been reviewed and signed by a qualified professional. V10 certified.',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/tips — Latest signed trading tips (public-facing)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/tips', (_req: Request, res: Response) => {
  const signed = professionalForecastService.getSigned();
  const tips   = signed
    .filter(f => f.forecast_type === 'TRADING_TIP' && f.tip)
    .slice(0, 20);

  res.json({
    success: true,
    count:   tips.length,
    tips: tips.map(f => ({
      forecast_id:    f.forecast_id,
      cert_id:        f.cert_id,
      symbol:         f.symbol,
      asset_class:    f.asset_class,
      action:         f.tip?.action,
      direction:      f.direction,
      conviction:     f.conviction,
      oracle_score:   f.oracle_score,
      entry_price:    f.tip?.entry_price,
      stop_loss:      f.tip?.stop_loss,
      take_profit_1:  f.tip?.take_profit_1,
      take_profit_2:  f.tip?.take_profit_2,
      risk_reward:    f.tip?.risk_reward,
      position_pct:   f.tip?.position_size_pct,
      summary:        f.summary,
      rationale:      f.rationale,
      risks:          f.risks,
      key_levels:     f.key_levels,
      macro_context:  f.macro_context,
      signed_at:      f.signed_at,
      signed_by:      f.signed_by,
      expires_at:     f.expires_at,
      v10_certified:  true,
      disclaimer_summary: 'This tip has been reviewed and signed by a qualified professional. ' +
                          'It remains for informational purposes only. Trading involves risk of loss. ' +
                          `Full disclaimer: ${f.disclaimer.version}`,
    })),
    platform_note: 'All tips on this page are V10 certified and professionally signed. ' +
                   'Trading tips are for informational purposes only and do not constitute financial advice.',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/professionals — Registry of qualified professionals
// ─────────────────────────────────────────────────────────────────────────────
router.get('/professionals', (_req: Request, res: Response) => {
  const professionals = professionalRegistry.getAll();
  const stats         = professionalRegistry.stats();

  res.json({
    success: true,
    stats,
    professionals: professionals.map(p => ({
      professional_id:   p.professional_id,
      full_name:         p.full_name,
      title:             p.title || '',
      post_nominals:     p.post_nominals || '',
      primary_domain:    p.primary_domain,
      qualification_level: p.qualification_level,
      status:            p.status,
      can_sign:          p.can_sign,
      sign_domains:      p.sign_domains,
      credentials:       p.qualifications.map(q => ({
        name:    q.credential_name,
        body:    q.issuing_body,
        verified: q.verified,
        expiry:  q.expiry_date,
      })),
      certificates_signed: p.certificates_signed,
      registered_at:     p.registered_at,
      next_reverification: p.next_reverification,
    })),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trading/professionals — Register a new professional
// ─────────────────────────────────────────────────────────────────────────────
router.post('/professionals', (req: Request, res: Response) => {
  try {
    const {
      full_name, title, post_nominals, email, phone,
      domains, primary_domain, qualification_level,
      qualifications, registered_by, notes,
    } = req.body;

    if (!full_name || !email || !domains || !primary_domain || !qualification_level || !qualifications) {
      return res.status(400).json({
        error: 'Required: full_name, email, domains, primary_domain, qualification_level, qualifications',
      });
    }

    const professional = professionalRegistry.register({
      full_name, title, post_nominals, email, phone,
      domains, primary_domain, qualification_level,
      qualifications, registered_by: registered_by || 'API',
      notes,
    });

    res.json({
      success:         true,
      professional_id: professional.professional_id,
      status:          professional.status,
      message:         'Professional registered. PENDING_VERIFICATION — Darryl must activate before signing is permitted.',
      next_step:       `POST /api/trading/professionals/${professional.professional_id}/activate (approver=Darryl)`,
    });

  } catch (err: any) {
    res.status(500).json({ error: `Registration failed: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/trading/professionals/:id/activate — Activate (Darryl only)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/professionals/:id/activate', (req: Request, res: Response) => {
  const professionalId = String(req.params.id);
  const { approver }   = req.body;

  if (approver !== 'Darryl') {
    return res.status(403).json({
      error:  'Only Darryl can activate qualified professionals.',
      reason: 'CVK-1100 gate: AUTHORIZED_APPROVER = Darryl. All professional activations require Darryl sign-off.',
    });
  }

  const result = professionalRegistry.activate(professionalId, 'Darryl');

  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  res.json({ success: true, message: result.message });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/trading/professionals/domains — Domain requirement specs
// ─────────────────────────────────────────────────────────────────────────────
router.get('/professionals/domains', (_req: Request, res: Response) => {
  res.json({
    success:  true,
    domains:  professionalRegistry.getAllDomainRequirements(),
    note:     'These are the qualification requirements for each domain in the Orb AI Universe.',
  });
});

export default router;
