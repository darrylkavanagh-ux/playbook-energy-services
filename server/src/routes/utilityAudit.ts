/**
 * UTILITY AUDIT API ROUTES
 * Endpoints for client utility audit services platform
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { query } from '../config/database';
import { OCRExtractionEngine } from '../engines/OCRExtractionEngine';
import { VATRateAuditor } from '../engines/VATRateAuditor';
import { TariffOptimizer } from '../engines/TariffOptimizer';
import { CompleteAuditEngine } from '../engines/CompleteAuditEngine';

// Instantiate engines
const ocrExtractionEngine = new OCRExtractionEngine();
const vatRateAuditor = new VATRateAuditor();
const tariffOptimizer = new TariffOptimizer();
const completeAuditEngine = new CompleteAuditEngine();
import EmailBillProcessor from '../services/EmailBillProcessor';

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueId = nanoid(8);
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `audit-${timestamp}-${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPEG are allowed.'));
    }
  },
});


/**
 * POST /api/utility-audit/audit/upload
 * Upload energy bills for audit
 */
router.post('/audit/upload', upload.array('bills', 50), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { customer_id, facility_name, facility_type } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!customer_id || !facility_name) {
      return res.status(400).json({ error: 'customer_id and facility_name are required' });
    }

    // Create audit project
    const projectId = `AUDIT-${Date.now()}-${nanoid(8)}`;
    
    await query(`
      INSERT INTO audit_projects (
        id, customer_id, facility_name, facility_type,
        total_bills_analyzed, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, 'processing', NOW())
    `, [projectId, customer_id, facility_name, facility_type || 'commercial', files.length]);

    res.json({
      success: true,
      project_id: projectId,
      files_uploaded: files.length,
      files: files.map(f => ({ 
        filename: f.filename, 
        size: f.size,
        path: f.path 
      })),
      message: `${files.length} bills uploaded successfully. Processing audit...`
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});


/**
 * POST /api/utility-audit/audit/analyze
 * Analyze uploaded bills
 */
router.post('/audit/analyze', async (req: Request, res: Response) => {
  try {
    const { project_id, bill_paths } = req.body;

    if (!project_id || !bill_paths || !Array.isArray(bill_paths)) {
      return res.status(400).json({ error: 'project_id and bill_paths[] are required' });
    }

    console.log(`🔍 Starting audit analysis for project ${project_id}...`);

    // Extract data from all bills
    const extractedBills = [];
    for (const billPath of bill_paths) {
      try {
        const extracted = await ocrExtractionEngine.extractBillData(billPath);
        extractedBills.push(extracted);
      } catch (error) {
        console.error(`Failed to extract ${billPath}:`, error);
      }
    }

    if (extractedBills.length === 0) {
      return res.status(400).json({ error: 'No bills could be extracted' });
    }

    // Run complete audit (performCompleteAudit expects file paths, project_id, customer)
    const { customer_name = 'Utility Audit Client' } = req.body;
    const auditResult = await completeAuditEngine.performCompleteAudit(
      bill_paths,
      {
        type: 'nursing_home',
        hiqa_registered: true,
        care_facility: true,
        residential_care: true,
      },
      project_id,
      customer_name
    );

    // Update project with results
    await query(`
      UPDATE audit_projects
      SET
        total_amount_audited = $1,
        total_overcharge_found = $2,
        estimated_recovery = $3,
        status = 'completed',
        completed_at = NOW()
      WHERE id = $4
    `, [
      (auditResult as any).total_overcharge + (auditResult as any).total_recoverable,
      auditResult.total_overcharge,
      auditResult.total_recoverable,
      project_id
    ]);

    res.json({
      success: true,
      project_id,
      audit_result: auditResult,
      message: 'Audit completed successfully'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze bills' });
  }
});


/**
 * GET /api/utility-audit/audit/:projectId
 * Get audit project details
 */
router.get('/audit/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const result = await query(`
      SELECT * FROM audit_projects WHERE id = $1
    `, [projectId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audit project not found' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit project' });
  }
});


/**
 * GET /api/utility-audit/audits
 * List all audit projects for a customer
 */
router.get('/audits', async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query;

    let queryText = 'SELECT * FROM audit_projects';
    const queryParams: any[] = [];

    if (customer_id) {
      queryText += ' WHERE customer_id = $1';
      queryParams.push(customer_id);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, queryParams);

    res.json({
      success: true,
      count: result.rows.length,
      audits: result.rows
    });

  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ error: 'Failed to list audits' });
  }
});


/**
 * POST /api/utility-audit/reference-code/generate
 * Generate a new reference code for customer
 */
router.post('/reference-code/generate', async (req: Request, res: Response) => {
  try {
    const { customer_id, project_id, expires_in_days } = req.body;

    if (!customer_id || !project_id) {
      return res.status(400).json({ error: 'customer_id and project_id are required' });
    }

    const referenceCode = await EmailBillProcessor.generateReferenceCode(
      customer_id,
      project_id,
      expires_in_days || 90 // Default 90 days
    );

    res.json({
      success: true,
      reference_code: referenceCode,
      customer_id,
      project_id,
      expires_in_days: expires_in_days || 90,
      instructions: `Send your energy bills to our email with reference code "${referenceCode}" in the subject line or email body.`
    });

  } catch (error) {
    console.error('Reference code generation error:', error);
    res.status(500).json({ error: 'Failed to generate reference code' });
  }
});


/**
 * GET /api/utility-audit/reference-codes/:customerId
 * Get all reference codes for a customer
 */
router.get('/reference-codes/:customerId', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const codes = await EmailBillProcessor.getCustomerReferenceCodes(customerId);

    res.json({
      success: true,
      customer_id: customerId,
      codes
    });

  } catch (error) {
    console.error('Reference codes fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reference codes' });
  }
});


/**
 * POST /api/utility-audit/reference-code/deactivate
 * Deactivate a reference code
 */
router.post('/reference-code/deactivate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }

    await EmailBillProcessor.deactivateReferenceCode(code);

    res.json({
      success: true,
      message: `Reference code ${code} deactivated`
    });

  } catch (error) {
    console.error('Deactivation error:', error);
    res.status(500).json({ error: 'Failed to deactivate reference code' });
  }
});


/**
 * GET /api/utility-audit/email-logs
 * Get email processing logs
 */
router.get('/email-logs', async (req: Request, res: Response) => {
  try {
    const { customer_id, project_id, limit = 50 } = req.query;

    let queryText = 'SELECT * FROM email_logs WHERE 1=1';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (customer_id) {
      queryText += ` AND customer_id = $${paramIndex}`;
      queryParams.push(customer_id);
      paramIndex++;
    }

    if (project_id) {
      queryText += ` AND project_id = $${paramIndex}`;
      queryParams.push(project_id);
      paramIndex++;
    }

    queryText += ` ORDER BY processed_at DESC LIMIT $${paramIndex}`;
    queryParams.push(limit);

    const result = await query(queryText, queryParams);

    res.json({
      success: true,
      count: result.rows.length,
      logs: result.rows
    });

  } catch (error) {
    console.error('Email logs error:', error);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
});

export default router;
