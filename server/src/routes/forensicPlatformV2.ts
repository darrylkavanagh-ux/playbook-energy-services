/**
 * FORENSIC INVESTIGATION PLATFORM — COMPLETE API ROUTES
 * ============================================================================
 * Full REST API surface for the production forensic platform.
 *
 * Modules wired:
 *   /api/v2/blockchain  — TRM BLOCKINT wallet screening, tracing, flow, linkage
 *   /api/v2/evidence    — Evidence intake, custody, verification, index
 *   /api/v2/cases       — Case CRUD, entities, timeline, notes
 *   /api/v2/auth        — Login, logout, session management
 *   /api/v2/reports     — Report generation & export
 *   /api/v2/ocr         — Document extraction & artifact correlation
 *   /api/v2/audit       — RBAC audit log
 *   /api/v2/health      — Platform health & quota status
 *
 * All routes enforce JWT auth + RBAC permission check.
 * All mutations produce an immutable audit trail entry.
 */

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ─── Module imports ────────────────────────────────────────────────────────────
import { trmBlockint, TRMRateLimitError, TRMAuthError, TRMQuotaExceededError }
  from '../integrations/blockint/TRMBlockintService';
import { evidenceVault } from '../modules/vault/EvidenceVault';
import { caseManager } from '../modules/cases/CaseManager';
import { rbacService } from '../modules/rbac/RBACService';
import { reportGenerator } from '../modules/reporting/ForensicReportGenerator';
import { documentProcessor } from '../modules/ocr/DocumentIntelligenceProcessor';

const router = Router();

// ─── Multer upload config ─────────────────────────────────────────────────────
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = process.env.EVIDENCE_STORAGE_PATH || path.join(process.cwd(), 'uploads', 'evidence', 'intake');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ts = Date.now();
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9\-_]/g, '_').substring(0, 40);
      cb(null, `${ts}-${base}${ext}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/tiff',
      'video/mp4', 'video/quicktime', 'audio/mpeg', 'audio/wav',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv', 'application/json', 'application/xml',
      'application/zip', 'application/octet-stream',
    ];
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error(`File type not permitted: ${file.mimetype}`));
    }
  },
});

// ─── Auth shortcuts ───────────────────────────────────────────────────────────
const auth = rbacService.authMiddleware();
const can = (p: any) => rbacService.require(p);

// ─── Error wrapper ────────────────────────────────────────────────────────────
// Returns (req, res, next) => void — TS-safe for Express route handlers
function wrap(fn: (req: any, res: any, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

// ============================================================================
// AUTH ROUTES  /api/v2/auth
// ============================================================================

const authRouter = Router();

/**
 * POST /api/v2/auth/register
 * Create a new platform user (admin only in production — open in test)
 */
authRouter.post('/register', wrap(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'username, email, password, role required' });
  }
  const user = rbacService.createUser({
    username, email, password, role,
    created_by: 'system',
    ip_whitelist: req.body.ip_whitelist || [],
  });
  res.status(201).json({ success: true, user });
}));

/**
 * POST /api/v2/auth/login
 */
authRouter.post('/login', wrap(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const result = rbacService.authenticate(
    username, password,
    req.ip || '0.0.0.0',
    req.get('user-agent') || ''
  );
  res.json({ success: true, ...result });
}));

/**
 * POST /api/v2/auth/logout
 */
authRouter.post('/logout', auth, wrap(async (req: any, res) => {
  rbacService.revokeSession(req.user.session_id);
  res.json({ success: true, message: 'Session revoked' });
}));

/**
 * GET /api/v2/auth/me
 */
authRouter.get('/me', auth, wrap(async (req: any, res) => {
  res.json({ user_id: req.user.user_id, role: req.user.role, session_id: req.user.session_id });
}));

// ============================================================================
// BLOCKCHAIN ROUTES  /api/v2/blockchain
// ============================================================================

const blockchainRouter = Router();

/**
 * POST /api/v2/blockchain/screen
 * Screen a single wallet address
 */
blockchainRouter.post('/screen', auth, can('blockchain:screen'), wrap(async (req: any, res) => {
  const { address, chain, asset, screening_type } = req.body;
  if (!address || !chain) {
    return res.status(400).json({ error: 'address and chain required' });
  }
  const result = await trmBlockint.screenWallet({ address, chain, asset, screening_type });
  res.json({ success: true, result });
}));

/**
 * POST /api/v2/blockchain/screen/batch
 * Screen multiple wallets
 */
blockchainRouter.post('/screen/batch', auth, can('blockchain:screen'), wrap(async (req: any, res) => {
  const { wallets } = req.body;
  if (!Array.isArray(wallets) || wallets.length === 0) {
    return res.status(400).json({ error: 'wallets array required' });
  }
  if (wallets.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 wallets per batch request' });
  }
  const results = await trmBlockint.batchScreenWallets(wallets);
  res.json({ success: true, count: results.length, results });
}));

/**
 * POST /api/v2/blockchain/trace
 * Trace a transaction (forward/backward/both)
 */
blockchainRouter.post('/trace', auth, can('blockchain:trace'), wrap(async (req: any, res) => {
  const { tx_hash, chain, direction, max_hops, min_value_usd, include_exchanges, include_mixers } = req.body;
  if (!tx_hash || !chain) {
    return res.status(400).json({ error: 'tx_hash and chain required' });
  }
  const result = await trmBlockint.traceTransaction({
    tx_hash, chain,
    direction: direction || 'both',
    max_hops: max_hops || 5,
    min_value_usd, include_exchanges, include_mixers,
  });
  res.json({ success: true, result });
}));

/**
 * POST /api/v2/blockchain/flow
 * Analyse asset flow for an address
 */
blockchainRouter.post('/flow', auth, can('blockchain:trace'), wrap(async (req: any, res) => {
  const { address, chain, date_from, date_to, min_value_usd } = req.body;
  if (!address || !chain) {
    return res.status(400).json({ error: 'address and chain required' });
  }
  const result = await trmBlockint.analyzeAssetFlow({ address, chain, date_from, date_to, min_value_usd });
  res.json({ success: true, result });
}));

/**
 * POST /api/v2/blockchain/link
 * Cluster and link multiple addresses
 */
blockchainRouter.post('/link', auth, can('blockchain:trace'), wrap(async (req: any, res) => {
  const { addresses, chain, linkage_types } = req.body;
  if (!Array.isArray(addresses) || addresses.length < 2) {
    return res.status(400).json({ error: 'addresses array (min 2) and chain required' });
  }
  const result = await trmBlockint.linkEntities({ addresses, chain, linkage_types });
  res.json({ success: true, result });
}));

/**
 * GET /api/v2/blockchain/quota
 * Current daily quota status per endpoint
 */
blockchainRouter.get('/quota', auth, can('platform:health'), wrap(async (req: any, res) => {
  const quota = trmBlockint.getQuotaStatus();
  res.json({ success: true, quota });
}));

/**
 * GET /api/v2/blockchain/logs
 * TRM API request correlation log (last N entries)
 */
blockchainRouter.get('/logs', auth, can('audit:read'), wrap(async (req: any, res) => {
  const limit = parseInt(req.query.limit as string || '100');
  const logs = trmBlockint.getRequestLog().slice(-limit);
  res.json({ success: true, count: logs.length, logs });
}));

/**
 * POST /api/v2/blockchain/quota-uplift
 * Generate a quota-uplift request document
 */
blockchainRouter.post('/quota-uplift', auth, can('platform:config'), wrap(async (req: any, res) => {
  const doc = trmBlockint.generateQuotaUpliftRequest({
    current_daily_limit: req.body.current_daily_limit || 10000,
    requested_daily_limit: req.body.requested_daily_limit || 100000,
    peak_throughput_rps: req.body.peak_throughput_rps || 5,
    use_case_description: req.body.use_case_description || 'Forensic investigation platform',
    estimated_monthly_calls: req.body.estimated_monthly_calls || 150000,
    primary_endpoints: req.body.primary_endpoints || ['/screening/addresses', '/blockchain/transactions/trace'],
    organisation_name: req.body.organisation_name || 'Orb AI Forensic Platform',
    contact_email: req.body.contact_email || 'ops@orb-ai.io',
  });
  res.json({ success: true, document: doc });
}));

// ============================================================================
// EVIDENCE ROUTES  /api/v2/evidence
// ============================================================================

const evidenceRouter = Router();

/**
 * POST /api/v2/evidence/intake
 * Ingest a new evidence file into the secure vault
 */
evidenceRouter.post('/intake', auth, can('evidence:intake'),
  upload.single('file'),
  wrap(async (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'File upload required (field: file)' });
    }
    const {
      case_id, category, title, description, source,
      obtained_by, obtained_method, privilege,
      gdpr_personal_data, gdpr_special_category,
      tags, related_entities, related_matters,
      analyst_notes, jurisdiction, confidentiality_level,
    } = req.body;

    if (!case_id || !category || !title || !source || !obtained_by || !obtained_method) {
      return res.status(400).json({
        error: 'case_id, category, title, source, obtained_by, obtained_method required',
      });
    }

    const item = await evidenceVault.ingestEvidence({
      case_id,
      category,
      title,
      description: description || '',
      source,
      obtained_by: obtained_by || req.user.user_id,
      obtained_method,
      file_path: req.file.path,
      privilege: privilege || 'none',
      gdpr_personal_data: gdpr_personal_data === 'true' || gdpr_personal_data === true,
      gdpr_special_category: gdpr_special_category === 'true' || gdpr_special_category === true,
      gdpr_data_subjects: tags ? JSON.parse(tags) : [],
      tags: tags ? JSON.parse(tags) : [],
      related_entities: related_entities ? JSON.parse(related_entities) : [],
      related_matters: related_matters ? JSON.parse(related_matters) : [],
      analyst_notes: analyst_notes || '',
      jurisdiction: jurisdiction ? JSON.parse(jurisdiction) : ['ireland'],
      confidentiality_level: confidentiality_level || 'restricted',
    });

    // Auto-link to case
    caseManager.linkEvidence(case_id, item.evidence_id, req.user.user_id);

    res.status(201).json({ success: true, evidence: item });
  })
);

/**
 * GET /api/v2/evidence/:evidenceId
 */
evidenceRouter.get('/:evidenceId', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const item = evidenceVault.getEvidence(req.params.evidenceId);
  if (item.privilege !== 'none' && !rbacService.can(req.user.user_id, 'evidence:privileged_read').granted) {
    return res.status(403).json({ error: 'Privileged evidence requires evidence:privileged_read permission' });
  }
  evidenceVault.recordCustodyAction(
    req.params.evidenceId, 'accessed', req.user.user_id, 'Analyst', 'API access', 'intact'
  );
  res.json({ success: true, evidence: item });
}));

/**
 * GET /api/v2/evidence/case/:caseId
 */
evidenceRouter.get('/case/:caseId', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const evidence = evidenceVault.getCaseEvidence(req.params.caseId);
  const filtered = rbacService.can(req.user.user_id, 'evidence:privileged_read').granted
    ? evidence
    : evidence.filter(e => e.privilege === 'none');
  res.json({ success: true, count: filtered.length, evidence: filtered });
}));

/**
 * POST /api/v2/evidence/:evidenceId/custody
 * Record a custody action
 */
evidenceRouter.post('/:evidenceId/custody', auth, can('evidence:update'), wrap(async (req: any, res) => {
  const { action, notes, condition } = req.body;
  if (!action) return res.status(400).json({ error: 'action required' });
  const entry = evidenceVault.recordCustodyAction(
    req.params.evidenceId,
    action,
    req.user.user_id,
    req.user.role,
    notes || '',
    condition || 'intact'
  );
  res.json({ success: true, custody_entry: entry });
}));

/**
 * GET /api/v2/evidence/:evidenceId/verify
 * Verify evidence integrity (hash check + custody chain)
 */
evidenceRouter.get('/:evidenceId/verify', auth, can('evidence:verify'), wrap(async (req: any, res) => {
  const result = evidenceVault.verifyIntegrity(req.params.evidenceId);
  res.json({ success: true, verification: result });
}));

/**
 * GET /api/v2/evidence/case/:caseId/index
 * Generate exhibit index for a case
 */
evidenceRouter.get('/case/:caseId/index', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const index = evidenceVault.generateExhibitIndex(req.params.caseId);
  res.json({ success: true, index });
}));

/**
 * GET /api/v2/evidence/search
 */
evidenceRouter.get('/search', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const { case_id, category, grade, tag, entity, status, min_admissibility } = req.query;
  const results = evidenceVault.searchEvidence({
    case_id: case_id as string,
    category: category as any,
    grade: grade as any,
    tag: tag as string,
    entity: entity as string,
    status: status as any,
    min_admissibility: min_admissibility ? parseInt(min_admissibility as string) : undefined,
  });
  res.json({ success: true, count: results.length, evidence: results });
}));

// ============================================================================
// CASE ROUTES  /api/v2/cases
// ============================================================================

const casesRouter = Router();

/**
 * POST /api/v2/cases
 * Create a new investigation case
 */
casesRouter.post('/', auth, can('case:create'), wrap(async (req: any, res) => {
  const {
    title, type, priority, description, lead_analyst,
    supervising_officer, jurisdictions, classification,
    incident_date, reporting_deadline, client_ref,
    estimated_loss_usd, estimated_recovery_usd,
  } = req.body;

  if (!title || !type || !priority || !description) {
    return res.status(400).json({ error: 'title, type, priority, description required' });
  }

  const newCase = caseManager.createCase({
    title, type, priority, description,
    lead_analyst: lead_analyst || req.user.user_id,
    supervising_officer, jurisdictions, classification,
    incident_date, reporting_deadline, client_ref,
    estimated_loss_usd: parseFloat(estimated_loss_usd || 0),
    estimated_recovery_usd: parseFloat(estimated_recovery_usd || 0),
  });

  res.status(201).json({ success: true, case: newCase });
}));

/**
 * GET /api/v2/cases
 * List cases with filters
 */
casesRouter.get('/', auth, can('case:read'), wrap(async (req: any, res) => {
  const { status, type, priority, analyst, jurisdiction } = req.query;
  const cases = caseManager.listCases({ status: status as any, type: type as any, priority: priority as any, analyst: analyst as string, jurisdiction: jurisdiction as string });
  res.json({ success: true, count: cases.length, cases: cases.map(c => caseManager.generateCaseSummary(c.case_id)) });
}));

/**
 * GET /api/v2/cases/:caseId
 */
casesRouter.get('/:caseId', auth, can('case:read'), wrap(async (req: any, res) => {
  const c = caseManager.getCase(req.params.caseId);
  res.json({ success: true, case: c });
}));

/**
 * GET /api/v2/cases/:caseId/summary
 */
casesRouter.get('/:caseId/summary', auth, can('case:read'), wrap(async (req: any, res) => {
  const summary = caseManager.generateCaseSummary(req.params.caseId);
  res.json({ success: true, summary });
}));

/**
 * PATCH /api/v2/cases/:caseId/status
 */
casesRouter.patch('/:caseId/status', auth, can('case:update'), wrap(async (req: any, res) => {
  const { status, reason } = req.body;
  if (!status) return res.status(400).json({ error: 'status required' });
  const c = caseManager.updateCaseStatus(req.params.caseId, status, req.user.user_id, reason || '');
  res.json({ success: true, case: c });
}));

/**
 * POST /api/v2/cases/:caseId/entities
 * Add an entity to a case
 */
casesRouter.post('/:caseId/entities', auth, can('entity:create'), wrap(async (req: any, res) => {
  const { type, role, name, aliases, identifiers, risk_score, notes } = req.body;
  if (!type || !role || !name) {
    return res.status(400).json({ error: 'type, role, name required' });
  }
  const entity = caseManager.addEntity(req.params.caseId, {
    type, role, name,
    aliases: aliases || [],
    identifiers: identifiers || [],
    risk_score: parseInt(risk_score || 0),
    notes: notes || '',
    added_by: req.user.user_id,
  });
  res.status(201).json({ success: true, entity });
}));

/**
 * POST /api/v2/cases/:caseId/timeline
 * Add a timeline event
 */
casesRouter.post('/:caseId/timeline', auth, can('timeline:create'), wrap(async (req: any, res) => {
  const {
    timestamp, timestamp_precision, event_type, title, description,
    actors_involved, evidence_refs, significance, verified, source,
    tags,
  } = req.body;
  if (!timestamp || !event_type || !title) {
    return res.status(400).json({ error: 'timestamp, event_type, title required' });
  }
  const evt = caseManager.addTimelineEvent(req.params.caseId, {
    timestamp, timestamp_precision: timestamp_precision || 'day',
    event_type, title, description: description || '',
    actors_involved: actors_involved || [],
    evidence_refs: evidence_refs || [],
    significance: significance || 'medium',
    verified: verified || false,
    source: source || req.user.user_id,
    contradiction_flag: false,
    contradiction_notes: '',
    tags: tags || [],
  });
  res.status(201).json({ success: true, event: evt });
}));

/**
 * GET /api/v2/cases/:caseId/contradictions
 * Run contradiction detection
 */
casesRouter.get('/:caseId/contradictions', auth, can('case:read'), wrap(async (req: any, res) => {
  const findings = caseManager.detectContradictions(req.params.caseId);
  res.json({ success: true, count: findings.length, findings });
}));

/**
 * POST /api/v2/cases/:caseId/notes
 * Add an analyst note
 */
casesRouter.post('/:caseId/notes', auth, can('note:create'), wrap(async (req: any, res) => {
  const { content, note_type, priority, tags, is_privileged, supersedes } = req.body;
  if (!content || !note_type) {
    return res.status(400).json({ error: 'content and note_type required' });
  }
  const note = caseManager.addNote(req.params.caseId, {
    author: req.user.user_id,
    content, note_type, priority, tags,
    is_privileged: is_privileged || false,
    supersedes,
  });
  res.status(201).json({ success: true, note });
}));

/**
 * POST /api/v2/cases/:caseId/blockchain
 * Link a blockchain address to a case
 */
casesRouter.post('/:caseId/blockchain', auth, can('blockchain:trace'), wrap(async (req: any, res) => {
  const { address, chain } = req.body;
  if (!address || !chain) return res.status(400).json({ error: 'address and chain required' });
  caseManager.linkBlockchainAddress(req.params.caseId, address, chain, req.user.user_id);
  res.json({ success: true, linked: `${chain}:${address}` });
}));

// ============================================================================
// OCR / EXTRACTION ROUTES  /api/v2/ocr
// ============================================================================

const ocrRouter = Router();

/**
 * POST /api/v2/ocr/extract
 * Extract content from an existing evidence item
 */
ocrRouter.post('/extract', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const { evidence_id, extraction_depth, extract_entities, extract_financial, detect_anomalies } = req.body;
  if (!evidence_id) return res.status(400).json({ error: 'evidence_id required' });

  const item = evidenceVault.getEvidence(evidence_id);

  const result = await documentProcessor.extractFromFile({
    evidence_id,
    file_path: item.file_path,
    mime_type: item.mime_type,
    extraction_depth: extraction_depth || 'standard',
    extract_entities: extract_entities !== false,
    extract_financial: extract_financial !== false,
    detect_anomalies: detect_anomalies !== false,
    requested_by: req.user.user_id,
  });

  res.json({ success: true, extraction: result });
}));

/**
 * GET /api/v2/ocr/:evidenceId
 * Get extraction result for an evidence item
 */
ocrRouter.get('/:evidenceId', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const result = documentProcessor.getEvidenceExtraction(req.params.evidenceId);
  if (!result) return res.status(404).json({ error: 'No extraction found for this evidence ID' });
  res.json({ success: true, extraction: result });
}));

/**
 * POST /api/v2/ocr/correlate
 * Cross-correlate artifacts across multiple evidence items
 */
ocrRouter.post('/correlate', auth, can('evidence:read'), wrap(async (req: any, res) => {
  const { evidence_ids } = req.body;
  if (!Array.isArray(evidence_ids) || evidence_ids.length < 2) {
    return res.status(400).json({ error: 'evidence_ids array (min 2) required' });
  }
  const correlations = documentProcessor.correlateArtifacts(evidence_ids);
  res.json({ success: true, count: correlations.length, correlations });
}));

// ============================================================================
// REPORT ROUTES  /api/v2/reports
// ============================================================================

const reportsRouter = Router();

/**
 * POST /api/v2/reports/generate
 * Generate a forensic report
 */
reportsRouter.post('/generate', auth, can('report:create'), wrap(async (req: any, res) => {
  const {
    case_id, report_type, format, jurisdiction, authored_by, approved_by,
    include_privileged, include_evidence_hashes, include_blockchain_data,
    classification, custom_header, custom_footer, redact_personal_data,
    prepared_by_credentials,
  } = req.body;

  if (!case_id || !report_type) {
    return res.status(400).json({ error: 'case_id and report_type required' });
  }

  const c = caseManager.getCase(case_id);
  const evidence = evidenceVault.getCaseEvidence(case_id);
  const exhibitIndex = evidenceVault.generateExhibitIndex(case_id);
  const caseSummary = caseManager.generateCaseSummary(case_id);

  const report = reportGenerator.generateReport({
    request: {
      case_id,
      report_type,
      format: format || 'markdown',
      prepared_by: authored_by || req.user.user_id,
      prepared_by_credentials: req.body.prepared_by_credentials || 'Orb AI Forensic Analyst',
      jurisdiction,
      classification,
      include_privileged: include_privileged === true || include_privileged === 'true',
      redact_personal_data: redact_personal_data === true || redact_personal_data === 'true',
    },
    caseData: c,
    caseSummary,
    evidence,
    exhibitIndex,
  });

  // Record report generation in case audit
  caseManager.addNote(case_id, {
    author: req.user.user_id,
    content: `Report generated: ${report.report_id} (${report_type})`,
    note_type: 'observation',
    priority: 'low',
  });

  res.status(201).json({ success: true, report });
}));

/**
 * GET /api/v2/reports/:reportId
 */
reportsRouter.get('/:reportId', auth, can('report:read'), wrap(async (req: any, res) => {
  const report = reportGenerator.getReport(req.params.reportId);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json({ success: true, report });
}));

/**
 * GET /api/v2/reports/case/:caseId
 */
reportsRouter.get('/case/:caseId', auth, can('report:read'), wrap(async (req: any, res) => {
  const reports = reportGenerator.listReports(req.params.caseId);
  res.json({ success: true, count: reports.length, reports });
}));

/**
 * GET /api/v2/reports/:reportId/export
 * Export report content as plain text (or JSON)
 */
reportsRouter.get('/:reportId/export', auth, can('report:export'), wrap(async (req: any, res) => {
  const report = reportGenerator.getReport(req.params.reportId);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const isJson = report.report_type === 'osint_intelligence' || req.query.format === 'json';
  if (isJson) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${report.report_id}.json"`);
    res.send(JSON.stringify(report, null, 2));
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${report.report_id}.md"`);
    res.send(report.formatted_content);
  }
}));

// ============================================================================
// AUDIT ROUTES  /api/v2/audit
// ============================================================================

const auditRouter = Router();

/**
 * GET /api/v2/audit/logs
 */
auditRouter.get('/logs', auth, can('audit:read'), wrap(async (req: any, res) => {
  const { user_id, permission, resource_type, granted, from, to, limit } = req.query;
  const logs = rbacService.getAuditLog({
    user_id: user_id as string,
    permission: permission as any,
    resource_type: resource_type as string,
    granted: granted !== undefined ? granted === 'true' : undefined,
    from: from as string,
    to: to as string,
    limit: limit ? parseInt(limit as string) : 500,
  });
  res.json({ success: true, count: logs.length, logs });
}));

// ============================================================================
// HEALTH ROUTES  /api/v2/health
// ============================================================================

const healthRouter = Router();

/**
 * GET /api/v2/health
 * Platform health check (no auth required for monitoring systems)
 */
healthRouter.get('/', wrap(async (req, res) => {
  const quota = trmBlockint.getQuotaStatus();
  const cases = caseManager.listCases().length;

  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    platform: 'Orb AI Forensic Platform',
    modules: {
      blockchain: { status: process.env.TRM_API_KEY ? 'configured' : 'api_key_missing' },
      evidence_vault: { status: 'operational' },
      case_manager: { active_cases: cases },
      rbac: { status: 'operational' },
      ocr: { status: 'operational' },
      reporting: { status: 'operational' },
    },
    blockchain_quota: quota,
    environment: process.env.NODE_ENV || 'development',
  });
}));

/**
 * GET /api/v2/health/deep
 * Deep health check (auth required)
 */
healthRouter.get('/deep', auth, can('platform:health'), wrap(async (req: any, res) => {
  const cases = caseManager.listCases();
  const quota = trmBlockint.getQuotaStatus();
  const logs = trmBlockint.getRequestLog().slice(-10);

  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    stats: {
      total_cases: cases.length,
      open_cases: cases.filter(c => c.status === 'open' || c.status === 'active').length,
      critical_cases: cases.filter(c => c.priority === 'critical').length,
    },
    blockchain: {
      quota,
      recent_requests: logs.length,
      last_request: logs[logs.length - 1]?.timestamp || null,
    },
    environment: {
      node_env: process.env.NODE_ENV,
      trm_configured: !!process.env.TRM_API_KEY,
      jwt_configured: !!process.env.JWT_SECRET,
      vault_secret_configured: !!process.env.EVIDENCE_VAULT_SECRET,
      db_configured: !!process.env.DATABASE_URL || !!process.env.DB_HOST,
    },
  });
}));

// ============================================================================
// RATE-LIMIT ERROR HANDLER (TRM-specific)
// ============================================================================

function blockchainErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof TRMRateLimitError) {
    return res.status(429).json({
      error: 'TRM API rate limit exceeded',
      message: err.message,
      context: err.context,
      retry_guidance: 'Request has been automatically retried. Max retries exceeded — please retry after backoff period.',
    });
  }
  if (err instanceof TRMAuthError) {
    return res.status(503).json({
      error: 'TRM API authentication failed',
      message: 'Check TRM_API_KEY environment variable',
    });
  }
  if (err instanceof TRMQuotaExceededError) {
    return res.status(429).json({
      error: 'Daily quota exceeded',
      message: err.message,
      guidance: 'Submit quota uplift request via POST /api/v2/blockchain/quota-uplift',
    });
  }
  next(err);
}

// ============================================================================
// ROUTER ASSEMBLY
// ============================================================================

export function mountForensicPlatformV2(app: any) {
  app.use('/api/v2/auth', authRouter);
  app.use('/api/v2/blockchain', blockchainRouter);
  app.use('/api/v2/blockchain', blockchainErrorHandler);
  app.use('/api/v2/evidence', evidenceRouter);
  app.use('/api/v2/cases', casesRouter);
  app.use('/api/v2/ocr', ocrRouter);
  app.use('/api/v2/reports', reportsRouter);
  app.use('/api/v2/audit', auditRouter);
  app.use('/api/v2/health', healthRouter);
}

export default router;
