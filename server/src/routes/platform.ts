/**
 * FORENSIC PLATFORM API ROUTES
 * ============================================================================
 * Unified REST API for the Orb AI Forensic Investigation Platform.
 *
 * Routes:
 *   --- AUTH ---
 *   POST /api/platform/auth/login              — authenticate, receive JWT
 *   POST /api/platform/auth/logout             — revoke session
 *   POST /api/platform/auth/users              — create user (admin only)
 *   GET  /api/platform/auth/audit              — access audit log
 *
 *   --- CASES ---
 *   POST /api/platform/cases                   — create case
 *   GET  /api/platform/cases                   — list cases
 *   GET  /api/platform/cases/:id               — get case
 *   PATCH /api/platform/cases/:id/status       — update status
 *   POST /api/platform/cases/:id/entities      — add entity
 *   POST /api/platform/cases/:id/timeline      — add timeline event
 *   POST /api/platform/cases/:id/notes         — add analyst note
 *   GET  /api/platform/cases/:id/summary       — case summary
 *   GET  /api/platform/cases/:id/contradictions — contradiction detection
 *
 *   --- EVIDENCE ---
 *   POST /api/platform/evidence/ingest         — ingest evidence item
 *   GET  /api/platform/evidence/:id            — get evidence item
 *   GET  /api/platform/evidence/:id/verify     — verify integrity
 *   POST /api/platform/evidence/:id/custody    — record custody action
 *   GET  /api/platform/cases/:id/evidence      — get all evidence for case
 *   GET  /api/platform/cases/:id/exhibit-index — exhibit index
 *   GET  /api/platform/evidence/search         — search evidence
 *
 *   --- OCR / DOCUMENT INTELLIGENCE ---
 *   POST /api/platform/documents/extract       — extract text + entities from file
 *   POST /api/platform/documents/correlate     — correlate artifacts across evidence
 *   GET  /api/platform/documents/extraction/:id — get extraction result
 *
 *   --- REPORTS ---
 *   POST /api/platform/reports                 — generate report
 *   GET  /api/platform/reports/:id             — get report
 *   GET  /api/platform/cases/:id/reports       — list reports for case
 *
 *   --- PLATFORM ---
 *   GET  /api/platform/health                  — platform health
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import { rbacService } from '../modules/rbac/RBACService';
import { caseManager } from '../modules/cases/CaseManager';
import { evidenceVault } from '../modules/vault/EvidenceVault';
import { documentProcessor } from '../modules/ocr/DocumentIntelligenceProcessor';
import { reportGenerator } from '../modules/reporting/ForensicReportGenerator';

const router = Router();

// ─── File upload configuration ────────────────────────────────────────────────

const uploadDir = process.env.UPLOAD_STAGING_DIR || path.join(process.cwd(), 'uploads', 'staging');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const id = nanoid(12);
    const ext = path.extname(file.originalname);
    cb(null, `staging-${Date.now()}-${id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
});

// ─── AUTH ROUTES (no auth middleware — these ARE the auth endpoints) ──────────

/**
 * POST /api/platform/auth/login
 */
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const ua = req.get('user-agent') || '';
    const session = rbacService.authenticate(username, password, ip, ua);
    return res.json({ success: true, ...session });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Authentication failed' });
  }
});

/**
 * POST /api/platform/auth/logout
 */
router.post('/auth/logout', rbacService.authMiddleware(), (req: Request, res: Response) => {
  const user = (req as any).user;
  rbacService.revokeSession(user.session_id);
  return res.json({ success: true, message: 'Session revoked' });
});

/**
 * POST /api/platform/auth/users  (admin only)
 */
router.post('/auth/users',
  rbacService.authMiddleware(),
  rbacService.require('user:create'),
  (req: Request, res: Response) => {
    try {
      const { username, email, password, role, ip_whitelist, custom_permissions } = req.body;
      const created_by = (req as any).user?.user_id || 'system';
      const user = rbacService.createUser({ username, email, password, role, created_by, ip_whitelist, custom_permissions });
      return res.status(201).json({ success: true, user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/auth/audit
 */
router.get('/auth/audit',
  rbacService.authMiddleware(),
  rbacService.require('audit:read'),
  (req: Request, res: Response) => {
    const { user_id, permission, resource_type, granted, from, to, limit } = req.query as any;
    const log = rbacService.getAuditLog({
      user_id, permission, resource_type,
      granted: granted !== undefined ? granted === 'true' : undefined,
      from, to,
      limit: limit ? parseInt(limit) : 500,
    });
    return res.json({ success: true, count: log.length, log });
  }
);

// Apply auth to all remaining routes
router.use(rbacService.authMiddleware());

// ─── CASE ROUTES ──────────────────────────────────────────────────────────────

/**
 * POST /api/platform/cases
 */
router.post('/cases',
  rbacService.require('case:create'),
  (req: Request, res: Response) => {
    try {
      const analyst = (req as any).user?.user_id || 'system';
      const newCase = caseManager.createCase({ ...req.body, lead_analyst: req.body.lead_analyst || analyst });
      return res.status(201).json({ success: true, case: newCase });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/cases
 */
router.get('/cases',
  rbacService.require('case:read'),
  (req: Request, res: Response) => {
    const { status, type, priority, analyst, jurisdiction } = req.query as any;
    const cases = caseManager.listCases({ status, type, priority, analyst, jurisdiction });
    return res.json({ success: true, count: cases.length, cases });
  }
);

/**
 * GET /api/platform/cases/:id
 */
router.get('/cases/:id',
  rbacService.require('case:read'),
  (req: Request, res: Response) => {
    try {
      const c = caseManager.getCase(req.params.id);
      return res.json({ success: true, case: c });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * PATCH /api/platform/cases/:id/status
 */
router.patch('/cases/:id/status',
  rbacService.require('case:update'),
  (req: Request, res: Response) => {
    try {
      const actor = (req as any).user?.user_id || 'system';
      const { status, reason } = req.body;
      const updated = caseManager.updateCaseStatus(req.params.id, status, actor, reason || '');
      return res.json({ success: true, case: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * POST /api/platform/cases/:id/entities
 */
router.post('/cases/:id/entities',
  rbacService.require('entity:create'),
  (req: Request, res: Response) => {
    try {
      const added_by = (req as any).user?.user_id || 'system';
      const entity = caseManager.addEntity(req.params.id, { ...req.body, added_by });
      return res.status(201).json({ success: true, entity });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * POST /api/platform/cases/:id/timeline
 */
router.post('/cases/:id/timeline',
  rbacService.require('timeline:create'),
  (req: Request, res: Response) => {
    try {
      const event = caseManager.addTimelineEvent(req.params.id, {
        ...req.body,
        verified: req.body.verified ?? false,
        contradiction_flag: false,
        contradiction_notes: '',
      });
      return res.status(201).json({ success: true, event });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * POST /api/platform/cases/:id/notes
 */
router.post('/cases/:id/notes',
  rbacService.require('note:create'),
  (req: Request, res: Response) => {
    try {
      const author = (req as any).user?.user_id || 'system';
      const note = caseManager.addNote(req.params.id, { ...req.body, author });
      return res.status(201).json({ success: true, note });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/cases/:id/summary
 */
router.get('/cases/:id/summary',
  rbacService.require('case:read'),
  (req: Request, res: Response) => {
    try {
      const summary = caseManager.generateCaseSummary(req.params.id);
      return res.json({ success: true, summary });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/cases/:id/contradictions
 */
router.get('/cases/:id/contradictions',
  rbacService.require('case:read'),
  (req: Request, res: Response) => {
    try {
      const contradictions = caseManager.detectContradictions(req.params.id);
      return res.json({
        success: true,
        case_id: req.params.id,
        total: contradictions.length,
        critical: contradictions.filter(c => c.severity === 'critical').length,
        contradictions,
      });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

// ─── EVIDENCE ROUTES ──────────────────────────────────────────────────────────

/**
 * POST /api/platform/evidence/ingest
 * Accepts multipart/form-data with a 'file' field.
 */
router.post('/evidence/ingest',
  rbacService.require('evidence:intake'),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Use multipart/form-data with a "file" field.' });
      }

      const {
        case_id, category, title, description, source,
        obtained_method, privilege, gdpr_personal_data,
        gdpr_special_category, tags, related_entities,
        related_matters, analyst_notes, jurisdiction,
        confidentiality_level,
      } = req.body;

      const obtained_by = (req as any).user?.user_id || req.body.obtained_by || 'system';

      if (!case_id || !category || !title || !source || !obtained_method) {
        return res.status(400).json({
          error: 'Required fields: case_id, category, title, source, obtained_method',
        });
      }

      const item = await evidenceVault.ingestEvidence({
        case_id,
        category,
        title,
        description: description || '',
        source,
        obtained_by,
        obtained_method,
        file_path: req.file.path,
        privilege: privilege || 'none',
        gdpr_personal_data: gdpr_personal_data === 'true',
        gdpr_special_category: gdpr_special_category === 'true',
        gdpr_data_subjects: tags ? JSON.parse(tags) : [],
        tags: tags ? JSON.parse(tags) : [],
        related_entities: related_entities ? JSON.parse(related_entities) : [],
        related_matters: related_matters ? JSON.parse(related_matters) : [],
        analyst_notes: analyst_notes || '',
        jurisdiction: jurisdiction ? JSON.parse(jurisdiction) : ['ireland'],
        confidentiality_level: confidentiality_level || 'restricted',
      });

      // Link to case
      caseManager.linkEvidence(case_id, item.evidence_id, obtained_by);

      return res.status(201).json({ success: true, evidence: item });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/evidence/:id
 */
router.get('/evidence/:id',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    try {
      const item = evidenceVault.getEvidence(req.params.id);
      // Strip privileged content if user lacks privilege read
      const user = (req as any).user;
      const canReadPrivileged = rbacService.can(user.user_id, 'evidence:privileged_read').granted;
      if (!canReadPrivileged && item.privilege !== 'none') {
        return res.status(403).json({
          error: 'This evidence item is privileged. Requires evidence:privileged_read permission.',
          privilege: item.privilege,
          exhibit_ref: item.exhibit_ref,
        });
      }
      return res.json({ success: true, evidence: item });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/evidence/:id/verify
 */
router.get('/evidence/:id/verify',
  rbacService.require('evidence:verify'),
  (req: Request, res: Response) => {
    try {
      const result = evidenceVault.verifyIntegrity(req.params.id);
      return res.json({ success: true, verification: result });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * POST /api/platform/evidence/:id/custody
 */
router.post('/evidence/:id/custody',
  rbacService.require('evidence:update'),
  (req: Request, res: Response) => {
    try {
      const { action, notes, condition } = req.body;
      const actor = (req as any).user?.user_id || 'system';
      const actorRole = (req as any).user?.role || 'analyst';

      if (!action) return res.status(400).json({ error: 'action is required' });

      const entry = evidenceVault.recordCustodyAction(
        req.params.id, action, actor, actorRole,
        notes || '', condition || 'intact'
      );
      return res.json({ success: true, custody_entry: entry });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/cases/:id/evidence
 */
router.get('/cases/:id/evidence',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    try {
      const items = evidenceVault.getCaseEvidence(req.params.id);
      const user = (req as any).user;
      const canPriv = rbacService.can(user.user_id, 'evidence:privileged_read').granted;
      const filtered = canPriv ? items : items.filter(i => i.privilege === 'none');
      return res.json({ success: true, count: filtered.length, evidence: filtered });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/cases/:id/exhibit-index
 */
router.get('/cases/:id/exhibit-index',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    try {
      const index = evidenceVault.generateExhibitIndex(req.params.id);
      return res.json({ success: true, exhibit_index: index });
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/evidence/search
 */
router.get('/evidence/search',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    const { case_id, category, grade, tag, entity, status, min_admissibility } = req.query as any;
    const results = evidenceVault.searchEvidence({
      case_id, category, grade, tag, entity, status,
      min_admissibility: min_admissibility ? parseInt(min_admissibility) : undefined,
    });
    return res.json({ success: true, count: results.length, evidence: results });
  }
);

// ─── DOCUMENT INTELLIGENCE ROUTES ────────────────────────────────────────────

/**
 * POST /api/platform/documents/extract
 * Extract text, entities, and metadata from an uploaded or existing evidence file.
 * If evidence_id provided, uses the vault file. Otherwise accepts a file upload.
 */
router.post('/documents/extract',
  rbacService.require('evidence:read'),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      let filePath: string;
      let mimeType: string;
      let evidenceId: string;

      if (req.body.evidence_id) {
        // Use file from evidence vault
        const item = evidenceVault.getEvidence(req.body.evidence_id);
        filePath = item.file_path;
        mimeType = item.mime_type;
        evidenceId = item.evidence_id;
      } else if (req.file) {
        filePath = req.file.path;
        mimeType = req.file.mimetype;
        evidenceId = `temp-${nanoid(8)}`;
      } else {
        return res.status(400).json({ error: 'Provide evidence_id or upload a file' });
      }

      const requester = (req as any).user?.user_id || 'system';
      const result = await documentProcessor.extractFromFile({
        evidence_id: evidenceId,
        file_path: filePath,
        mime_type: mimeType,
        extraction_depth: req.body.depth || 'standard',
        extract_entities: req.body.extract_entities !== 'false',
        extract_financial: req.body.extract_financial !== 'false',
        detect_anomalies: req.body.detect_anomalies !== 'false',
        requested_by: requester,
      });

      return res.json({ success: true, extraction: result });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * POST /api/platform/documents/correlate
 * Correlate artifacts across multiple evidence items.
 * Body: { evidence_ids: string[] }
 */
router.post('/documents/correlate',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    try {
      const { evidence_ids } = req.body;
      if (!Array.isArray(evidence_ids) || evidence_ids.length < 2) {
        return res.status(400).json({ error: 'evidence_ids must be an array of at least 2 IDs' });
      }
      const correlations = documentProcessor.correlateArtifacts(evidence_ids);
      return res.json({
        success: true,
        count: correlations.length,
        critical: correlations.filter(c => c.forensic_significance === 'critical').length,
        correlations,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/documents/extraction/:id
 */
router.get('/documents/extraction/:id',
  rbacService.require('evidence:read'),
  (req: Request, res: Response) => {
    const result = documentProcessor.getExtraction(req.params.id);
    if (!result) return res.status(404).json({ error: `Extraction not found: ${req.params.id}` });
    return res.json({ success: true, extraction: result });
  }
);

// ─── REPORT ROUTES ────────────────────────────────────────────────────────────

/**
 * POST /api/platform/reports
 * Generate a forensic report for a case.
 */
router.post('/reports',
  rbacService.require('report:create'),
  (req: Request, res: Response) => {
    try {
      const {
        case_id, report_type, format, prepared_by_credentials,
        recipient, recipient_agency, jurisdiction, classification,
        include_privileged, include_intelligence_only, redact_personal_data,
        reference_number, custom_findings,
      } = req.body;

      if (!case_id || !report_type) {
        return res.status(400).json({ error: 'case_id and report_type are required' });
      }

      const caseData = caseManager.getCase(case_id);
      const caseSummary = caseManager.generateCaseSummary(case_id);
      const evidence = evidenceVault.getCaseEvidence(case_id);
      const exhibitIndex = evidenceVault.generateExhibitIndex(case_id);
      const prepared_by = (req as any).user?.user_id || req.body.prepared_by || 'system';

      const report = reportGenerator.generateReport({
        request: {
          case_id, report_type, format: format || 'markdown',
          prepared_by,
          prepared_by_credentials: prepared_by_credentials || 'Orb AI Forensic Analyst',
          recipient, recipient_agency, jurisdiction, classification,
          include_privileged: include_privileged === true,
          include_intelligence_only: include_intelligence_only === true,
          redact_personal_data: redact_personal_data === true,
          reference_number, custom_findings,
        },
        caseData, caseSummary, evidence, exhibitIndex,
        customFindings: custom_findings,
      });

      return res.status(201).json({ success: true, report });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * GET /api/platform/reports/:id
 */
router.get('/reports/:id',
  rbacService.require('report:read'),
  (req: Request, res: Response) => {
    const report = reportGenerator.getReport(req.params.id);
    if (!report) return res.status(404).json({ error: `Report not found: ${req.params.id}` });
    return res.json({ success: true, report });
  }
);

/**
 * GET /api/platform/cases/:id/reports
 */
router.get('/cases/:id/reports',
  rbacService.require('report:read'),
  (req: Request, res: Response) => {
    const reports = reportGenerator.listReports(req.params.id);
    return res.json({ success: true, count: reports.length, reports });
  }
);

// ─── PLATFORM HEALTH ──────────────────────────────────────────────────────────

/**
 * GET /api/platform/health
 */
router.get('/health', (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.json({
    status: 'operational',
    platform: 'Orb AI Forensic Investigation Platform',
    version: '2.0.0',
    modules: {
      rbac: 'active',
      case_manager: 'active',
      evidence_vault: 'active',
      document_processor: 'active',
      report_generator: 'active',
      blockint: process.env.TRM_API_KEY ? 'configured' : 'unconfigured',
    },
    authenticated_user: user?.user_id || null,
    authenticated_role: user?.role || null,
    timestamp: new Date().toISOString(),
  });
});

export default router;
