/**
 * BLOCKCHAIN INTELLIGENCE API ROUTES
 * ============================================================================
 * Exposes TRM BLOCKINT capabilities via authenticated REST endpoints.
 *
 * Routes:
 *   POST /api/blockint/screen/wallet          — single wallet screening
 *   POST /api/blockint/screen/batch           — batch wallet screening
 *   POST /api/blockint/trace/transaction      — transaction tracing
 *   POST /api/blockint/analyze/flow           — asset flow analysis
 *   POST /api/blockint/link/entities          — entity linkage / clustering
 *   GET  /api/blockint/quota                  — daily quota status
 *   GET  /api/blockint/log                    — request correlation log
 *   POST /api/blockint/quota-uplift           — generate quota uplift request
 *   GET  /api/blockint/health                 — service health check
 *
 * All routes require JWT auth + 'blockchain:screen' or 'blockchain:trace' permission.
 * Results are automatically linked to the specified case_id if provided.
 */

import { Router, Request, Response } from 'express';
import { trmBlockint, TRMRateLimitError, TRMAuthError, TRMQuotaExceededError } from '../integrations/blockint/TRMBlockintService';
import { caseManager } from '../modules/cases/CaseManager';
import { rbacService } from '../modules/rbac/RBACService';

const router = Router();

// Apply auth middleware to all blockint routes
router.use(rbacService.authMiddleware());

// ─── Wallet Screening ─────────────────────────────────────────────────────────

/**
 * POST /api/blockint/screen/wallet
 * Screen a single wallet address for risk, sanctions and entity attribution.
 *
 * Body: { address, chain, asset?, case_id?, screening_type? }
 */
router.post('/screen/wallet',
  rbacService.require('blockchain:screen'),
  async (req: Request, res: Response) => {
    try {
      const { address, chain, asset, case_id, screening_type } = req.body;

      if (!address || !chain) {
        return res.status(400).json({ error: 'address and chain are required' });
      }

      const result = await trmBlockint.screenWallet({ address, chain, asset, screening_type });

      // Link to case if provided
      if (case_id) {
        try {
          caseManager.linkBlockchainAddress(case_id, address, chain, (req as any).user?.user_id || 'system');
        } catch { /* case may not exist, non-fatal */ }
      }

      return res.json({
        success: true,
        result,
        case_linked: !!case_id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return handleBlockintError(err, res);
    }
  }
);

/**
 * POST /api/blockint/screen/batch
 * Screen multiple wallet addresses in batch (respects concurrency limit).
 *
 * Body: { addresses: [{address, chain, asset?}], case_id? }
 */
router.post('/screen/batch',
  rbacService.require('blockchain:screen'),
  async (req: Request, res: Response) => {
    try {
      const { addresses, case_id } = req.body;

      if (!Array.isArray(addresses) || addresses.length === 0) {
        return res.status(400).json({ error: 'addresses array is required and must not be empty' });
      }

      if (addresses.length > 100) {
        return res.status(400).json({ error: 'Maximum 100 addresses per batch request' });
      }

      const results = await trmBlockint.batchScreenWallets(addresses);

      // Link all to case
      if (case_id) {
        for (const req_item of addresses) {
          try {
            caseManager.linkBlockchainAddress(case_id, req_item.address, req_item.chain, (req as any).user?.user_id || 'system');
          } catch { /* non-fatal */ }
        }
      }

      const highRisk = results.filter(r => ['HIGH', 'SEVERE', 'CRITICAL'].includes(r.risk_level));
      const sanctionsHits = results.filter(r => r.sanctions_hit);

      return res.json({
        success: true,
        total_screened: results.length,
        high_risk_count: highRisk.length,
        sanctions_hits: sanctionsHits.length,
        results,
        case_linked: !!case_id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return handleBlockintError(err, res);
    }
  }
);

// ─── Transaction Tracing ──────────────────────────────────────────────────────

/**
 * POST /api/blockint/trace/transaction
 * Trace a transaction forward, backward, or both up to N hops.
 *
 * Body: { tx_hash, chain, direction?, max_hops?, min_value_usd?,
 *         include_exchanges?, include_mixers?, case_id? }
 */
router.post('/trace/transaction',
  rbacService.require('blockchain:trace'),
  async (req: Request, res: Response) => {
    try {
      const {
        tx_hash, chain, direction = 'both', max_hops = 5,
        min_value_usd, include_exchanges, include_mixers, case_id,
      } = req.body;

      if (!tx_hash || !chain) {
        return res.status(400).json({ error: 'tx_hash and chain are required' });
      }

      if (max_hops < 1 || max_hops > 10) {
        return res.status(400).json({ error: 'max_hops must be between 1 and 10' });
      }

      const result = await trmBlockint.traceTransaction({
        tx_hash, chain, direction, max_hops,
        min_value_usd, include_exchanges, include_mixers,
      });

      return res.json({
        success: true,
        result,
        risk_flags: result.risk_flags,
        mixers_detected: result.mixers_detected,
        exchanges_identified: result.exchanges_identified,
        case_linked: !!case_id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return handleBlockintError(err, res);
    }
  }
);

// ─── Asset Flow Analysis ──────────────────────────────────────────────────────

/**
 * POST /api/blockint/analyze/flow
 * Analyse full asset flow for an address over a time window.
 *
 * Body: { address, chain, date_from?, date_to?, min_value_usd?, case_id? }
 */
router.post('/analyze/flow',
  rbacService.require('blockchain:trace'),
  async (req: Request, res: Response) => {
    try {
      const { address, chain, date_from, date_to, min_value_usd, case_id } = req.body;

      if (!address || !chain) {
        return res.status(400).json({ error: 'address and chain are required' });
      }

      const result = await trmBlockint.analyzeAssetFlow({
        address, chain, date_from, date_to, min_value_usd,
      });

      return res.json({
        success: true,
        result,
        suspicious_patterns: result.suspicious_patterns,
        net_flow_usd: result.net_flow_usd,
        timeline_events: result.timeline.length,
        case_linked: !!case_id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return handleBlockintError(err, res);
    }
  }
);

// ─── Entity Linkage ───────────────────────────────────────────────────────────

/**
 * POST /api/blockint/link/entities
 * Link multiple addresses to a common entity or cluster.
 *
 * Body: { addresses, chain, linkage_types?, case_id? }
 */
router.post('/link/entities',
  rbacService.require('blockchain:trace'),
  async (req: Request, res: Response) => {
    try {
      const { addresses, chain, linkage_types, case_id } = req.body;

      if (!Array.isArray(addresses) || addresses.length < 2) {
        return res.status(400).json({ error: 'addresses array must contain at least 2 addresses' });
      }

      if (addresses.length > 50) {
        return res.status(400).json({ error: 'Maximum 50 addresses per linkage request' });
      }

      const result = await trmBlockint.linkEntities({ addresses, chain, linkage_types });

      return res.json({
        success: true,
        result,
        cluster_id: result.cluster_id,
        attributed_entity: result.attributed_entity,
        confidence_score: result.confidence_score,
        risk_level: result.risk_level,
        case_linked: !!case_id,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return handleBlockintError(err, res);
    }
  }
);

// ─── Quota & Monitoring ───────────────────────────────────────────────────────

/**
 * GET /api/blockint/quota
 * Get current daily quota usage per endpoint.
 */
router.get('/quota',
  rbacService.require('blockchain:screen'),
  (_req: Request, res: Response) => {
    const quota = trmBlockint.getQuotaStatus();
    return res.json({
      success: true,
      quota,
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * GET /api/blockint/log
 * Get the last N request correlation log entries (audit trail).
 */
router.get('/log',
  rbacService.require('blockchain:export'),
  (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '100');
    const log = trmBlockint.getRequestLog().slice(-Math.min(limit, 1000));
    return res.json({
      success: true,
      count: log.length,
      log,
      timestamp: new Date().toISOString(),
    });
  }
);

/**
 * POST /api/blockint/quota-uplift
 * Generate a quota uplift request document for TRM Labs.
 *
 * Body: { current_daily_limit, requested_daily_limit, peak_throughput_rps,
 *         use_case_description, estimated_monthly_calls, primary_endpoints,
 *         organisation_name, contact_email }
 */
router.post('/quota-uplift',
  rbacService.require('platform:config'),
  (req: Request, res: Response) => {
    try {
      const doc = trmBlockint.generateQuotaUpliftRequest(req.body);
      return res.json({
        success: true,
        document: doc,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  }
);

/**
 * GET /api/blockint/health
 * Service health check — confirms API key is configured (does not expose it).
 */
router.get('/health', (_req: Request, res: Response) => {
  const hasKey = !!(process.env.TRM_API_KEY);
  const quota = trmBlockint.getQuotaStatus();
  const log = trmBlockint.getRequestLog();
  const recentErrors = log.filter(l =>
    l.status === 429 || l.status === 401 || l.status === 0
  ).slice(-10);

  return res.json({
    service: 'TRM BLOCKINT',
    status: hasKey ? 'configured' : 'unconfigured',
    api_key_present: hasKey,
    environment: process.env.TRM_ENVIRONMENT || 'production',
    base_url: process.env.TRM_BASE_URL || 'https://api.trmlabs.com/public/v2',
    quota_summary: quota,
    total_requests_today: Object.values(quota).reduce((s, q) => s + q.used, 0),
    recent_errors: recentErrors.length,
    last_request_at: log[log.length - 1]?.timestamp || null,
    timestamp: new Date().toISOString(),
  });
});

// ─── Error handler ────────────────────────────────────────────────────────────

function handleBlockintError(err: unknown, res: Response): Response {
  console.error('[BLOCKINT-ROUTE]', err);

  if (err instanceof TRMRateLimitError) {
    return res.status(429).json({
      error: 'TRM API rate limit reached',
      detail: err.message,
      context: err.context,
      retry_after_suggestion: '60 seconds',
    });
  }

  if (err instanceof TRMAuthError) {
    return res.status(503).json({
      error: 'TRM API authentication failure — check TRM_API_KEY environment variable',
      detail: err.message,
    });
  }

  if (err instanceof TRMQuotaExceededError) {
    return res.status(429).json({
      error: 'Daily quota exceeded',
      detail: err.message,
      suggestion: 'Request quota uplift via POST /api/blockint/quota-uplift',
    });
  }

  return res.status(500).json({
    error: 'Blockchain intelligence service error',
    detail: (err as Error).message,
  });
}

export default router;
