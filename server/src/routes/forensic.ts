/**
 * FORENSIC INVESTIGATION API ROUTES
 * Orb AI Forensic Investigation Platform
 * 
 * API endpoints for prosecution-grade forensic reconstruction
 * as specified in FINAL MASTER FORENSIC INVESTIGATION DIRECTIVE v3.0
 * 
 * Capabilities:
 * - Master Actor Registry management
 * - Master Matter Index management
 * - Master Property & Asset Register
 * - Financial transaction tracking
 * - Conspiracy detection and analysis
 * - Investigation report generation
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { nanoid } from 'nanoid';
import { query } from '../config/database';
import ConspiracyDetectionEngine from '../engines/ConspiracyDetectionEngine';

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
    cb(null, `forensic-${timestamp}-${uniqueId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for evidence files
  },
});

// ============================================================================
// PLATFORM STATUS & READINESS
// ============================================================================

/**
 * GET /api/forensic/readiness
 * Platform Readiness Assessment (as per Directive Section 0.5)
 */
router.get('/readiness', async (req: Request, res: Response) => {
  try {
    const actorCount = await query('SELECT COUNT(*) FROM forensic_actors');
    const entityCount = await query('SELECT COUNT(*) FROM forensic_entities');
    const matterCount = await query('SELECT COUNT(*) FROM forensic_matters');
    const propertyCount = await query('SELECT COUNT(*) FROM forensic_properties');
    const documentCount = await query('SELECT COUNT(*) FROM forensic_documents');
    const taskCount = await query('SELECT COUNT(*) FROM forensic_tasks WHERE status != \'COMPLETED\'');

    const readiness = {
      platform_status: 'OPERATIONAL',
      operational_date: new Date().toISOString(),
      database_status: 'ACTIVE',
      registries: {
        actor_registry: {
          status: 'ACTIVE',
          record_count: parseInt(actorCount.rows[0].count)
        },
        entity_registry: {
          status: 'ACTIVE',
          record_count: parseInt(entityCount.rows[0].count)
        },
        matter_index: {
          status: 'ACTIVE',
          record_count: parseInt(matterCount.rows[0].count)
        },
        property_register: {
          status: 'ACTIVE',
          record_count: parseInt(propertyCount.rows[0].count)
        }
      },
      evidence_management: {
        document_count: parseInt(documentCount.rows[0].count),
        storage_status: 'OPERATIONAL'
      },
      analytical_engines: {
        conspiracy_detection: 'READY',
        temporal_correlation: 'READY',
        actor_intersection: 'READY',
        financial_flow_mapping: 'READY',
        cui_bono_analysis: 'READY'
      },
      active_tasks: parseInt(taskCount.rows[0].count),
      phase_status: 'PHASE_1_READY',
      message: 'Platform is fully operational and ready for Phase 1: Total Data Extraction'
    };

    res.json({
      success: true,
      readiness
    });

  } catch (error) {
    console.error('Readiness check error:', error);
    res.status(500).json({ error: 'Failed to assess platform readiness' });
  }
});

// ============================================================================
// MASTER ACTOR REGISTRY
// ============================================================================

/**
 * POST /api/forensic/actors
 * Create new actor in Master Actor Registry
 */
router.post('/actors', async (req: Request, res: Response) => {
  try {
    const {
      full_name,
      aliases,
      date_of_birth,
      nationality,
      occupation,
      known_addresses,
      role_in_scheme,
      risk_level,
      metadata
    } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: 'full_name is required' });
    }

    const actor_id = `ACTOR-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_actors (
        actor_id, full_name, aliases, date_of_birth, nationality,
        occupation, known_addresses, role_in_scheme, risk_level, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      actor_id,
      full_name,
      aliases || [],
      date_of_birth,
      nationality,
      occupation,
      known_addresses || [],
      role_in_scheme,
      risk_level || 'MEDIUM',
      metadata ? JSON.stringify(metadata) : null
    ]);

    // Log activity
    await query(`
      INSERT INTO activity_log (id, action, user_id, metadata, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [
      nanoid(12),
      'actor_created',
      'forensic_system',
      JSON.stringify({ actor_id, full_name, risk_level })
    ]);

    res.json({
      success: true,
      actor_id,
      message: 'Actor added to Master Actor Registry'
    });

  } catch (error) {
    console.error('Actor creation error:', error);
    res.status(500).json({ error: 'Failed to create actor' });
  }
});

/**
 * GET /api/forensic/actors
 * List all actors with filtering
 */
router.get('/actors', async (req: Request, res: Response) => {
  try {
    const { risk_level, search } = req.query;

    let queryText = 'SELECT * FROM forensic_actors WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (risk_level) {
      queryText += ` AND risk_level = $${paramIndex++}`;
      params.push(risk_level);
    }

    if (search) {
      queryText += ` AND (full_name ILIKE $${paramIndex++} OR $${paramIndex++} = ANY(aliases))`;
      params.push(`%${search}%`, search);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      actors: result.rows
    });

  } catch (error) {
    console.error('Actor fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
});

/**
 * GET /api/forensic/actors/:actorId
 * Get detailed actor information
 */
router.get('/actors/:actorId', async (req: Request, res: Response) => {
  try {
    const { actorId } = req.params;

    const actorResult = await query(
      'SELECT * FROM forensic_actors WHERE actor_id = $1',
      [actorId]
    );

    if (actorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Actor not found' });
    }

    // Get related entities
    const entitiesResult = await query(`
      SELECT faer.*, fe.legal_name, fe.entity_type
      FROM forensic_actor_entity_relationships faer
      JOIN forensic_entities fe ON faer.entity_id = fe.entity_id
      WHERE faer.actor_id = $1 AND faer.status = 'active'
    `, [actorId]);

    // Get matters involved
    const mattersResult = await query(`
      SELECT * FROM forensic_matters
      WHERE $1 = ANY(actors_involved)
    `, [actorId]);

    // Get transactions
    const transactionsResult = await query(`
      SELECT * FROM forensic_transactions
      WHERE (from_party_id = $1 AND from_party_type = 'ACTOR')
         OR (to_party_id = $1 AND to_party_type = 'ACTOR')
      ORDER BY transaction_date DESC
      LIMIT 50
    `, [actorId]);

    res.json({
      success: true,
      actor: actorResult.rows[0],
      related_entities: entitiesResult.rows,
      matters_involved: mattersResult.rows,
      transactions: transactionsResult.rows
    });

  } catch (error) {
    console.error('Actor detail fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch actor details' });
  }
});

// ============================================================================
// MASTER ENTITY REGISTRY
// ============================================================================

/**
 * POST /api/forensic/entities
 * Create new entity in Master Entity Registry
 */
router.post('/entities', async (req: Request, res: Response) => {
  try {
    const {
      legal_name,
      entity_type,
      registration_number,
      registration_jurisdiction,
      incorporation_date,
      registered_address,
      directors,
      shareholders,
      risk_level,
      metadata
    } = req.body;

    if (!legal_name || !entity_type) {
      return res.status(400).json({ error: 'legal_name and entity_type are required' });
    }

    const entity_id = `ENTITY-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_entities (
        entity_id, legal_name, entity_type, registration_number,
        registration_jurisdiction, incorporation_date, registered_address,
        directors, shareholders, risk_level, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      entity_id,
      legal_name,
      entity_type,
      registration_number,
      registration_jurisdiction,
      incorporation_date,
      registered_address,
      directors ? JSON.stringify(directors) : null,
      shareholders ? JSON.stringify(shareholders) : null,
      risk_level || 'MEDIUM',
      metadata ? JSON.stringify(metadata) : null
    ]);

    res.json({
      success: true,
      entity_id,
      message: 'Entity added to Master Entity Registry'
    });

  } catch (error) {
    console.error('Entity creation error:', error);
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

/**
 * GET /api/forensic/entities
 * List all entities
 */
router.get('/entities', async (req: Request, res: Response) => {
  try {
    const { risk_level, entity_type, search } = req.query;

    let queryText = 'SELECT * FROM forensic_entities WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (risk_level) {
      queryText += ` AND risk_level = $${paramIndex++}`;
      params.push(risk_level);
    }

    if (entity_type) {
      queryText += ` AND entity_type = $${paramIndex++}`;
      params.push(entity_type);
    }

    if (search) {
      queryText += ` AND legal_name ILIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      entities: result.rows
    });

  } catch (error) {
    console.error('Entity fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// ============================================================================
// MASTER MATTER INDEX
// ============================================================================

/**
 * POST /api/forensic/matters
 * Create new matter in Master Matter Index
 */
router.post('/matters', async (req: Request, res: Response) => {
  try {
    const {
      matter_type,
      title,
      description,
      jurisdiction,
      case_number,
      filing_date,
      incident_date,
      severity,
      estimated_loss,
      actors_involved,
      entities_involved,
      metadata
    } = req.body;

    if (!matter_type || !title) {
      return res.status(400).json({ error: 'matter_type and title are required' });
    }

    const matter_id = `MATTER-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_matters (
        matter_id, matter_type, title, description, jurisdiction,
        case_number, filing_date, incident_date, severity, estimated_loss,
        actors_involved, entities_involved, status, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      matter_id,
      matter_type,
      title,
      description,
      jurisdiction || 'Ireland',
      case_number,
      filing_date,
      incident_date,
      severity || 'MEDIUM',
      estimated_loss,
      actors_involved || [],
      entities_involved || [],
      'ACTIVE',
      metadata ? JSON.stringify(metadata) : null
    ]);

    res.json({
      success: true,
      matter_id,
      message: 'Matter added to Master Matter Index'
    });

  } catch (error) {
    console.error('Matter creation error:', error);
    res.status(500).json({ error: 'Failed to create matter' });
  }
});

/**
 * GET /api/forensic/matters
 * List all matters
 */
router.get('/matters', async (req: Request, res: Response) => {
  try {
    const { status, severity, matter_type } = req.query;

    let queryText = 'SELECT * FROM forensic_matters WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      queryText += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (severity) {
      queryText += ` AND severity = $${paramIndex++}`;
      params.push(severity);
    }

    if (matter_type) {
      queryText += ` AND matter_type = $${paramIndex++}`;
      params.push(matter_type);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      matters: result.rows
    });

  } catch (error) {
    console.error('Matter fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch matters' });
  }
});

// ============================================================================
// MASTER PROPERTY & ASSET REGISTER
// ============================================================================

/**
 * POST /api/forensic/properties
 * Add property to Master Property & Asset Register
 */
router.post('/properties', async (req: Request, res: Response) => {
  try {
    const {
      property_type,
      address,
      eircode,
      folio_number,
      acquisition_date,
      acquisition_price,
      current_value,
      current_owner,
      metadata
    } = req.body;

    if (!property_type || !address) {
      return res.status(400).json({ error: 'property_type and address are required' });
    }

    const property_id = `PROP-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_properties (
        property_id, property_type, address, eircode, folio_number,
        acquisition_date, acquisition_price, current_value, current_owner, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      property_id,
      property_type,
      address,
      eircode,
      folio_number,
      acquisition_date,
      acquisition_price,
      current_value,
      current_owner,
      metadata ? JSON.stringify(metadata) : null
    ]);

    res.json({
      success: true,
      property_id,
      message: 'Property added to Master Property & Asset Register'
    });

  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

/**
 * GET /api/forensic/properties
 * List all properties
 */
router.get('/properties', async (req: Request, res: Response) => {
  try {
    const { owner, property_type } = req.query;

    let queryText = 'SELECT * FROM forensic_properties WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (owner) {
      queryText += ` AND current_owner ILIKE $${paramIndex++}`;
      params.push(`%${owner}%`);
    }

    if (property_type) {
      queryText += ` AND property_type = $${paramIndex++}`;
      params.push(property_type);
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      properties: result.rows
    });

  } catch (error) {
    console.error('Property fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// ============================================================================
// FINANCIAL TRANSACTIONS
// ============================================================================

/**
 * POST /api/forensic/transactions
 * Record financial transaction
 */
router.post('/transactions', async (req: Request, res: Response) => {
  try {
    const {
      transaction_date,
      transaction_type,
      from_party_type,
      from_party_id,
      to_party_type,
      to_party_id,
      amount,
      currency,
      payment_method,
      reference,
      purpose,
      suspicious_indicators,
      metadata
    } = req.body;

    if (!transaction_date || !from_party_id || !to_party_id || !amount) {
      return res.status(400).json({ 
        error: 'transaction_date, from_party_id, to_party_id, and amount are required' 
      });
    }

    const transaction_id = `TXN-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_transactions (
        transaction_id, transaction_date, transaction_type,
        from_party_type, from_party_id, to_party_type, to_party_id,
        amount, currency, payment_method, reference, purpose,
        suspicious_indicators, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      transaction_id,
      transaction_date,
      transaction_type || 'TRANSFER',
      from_party_type || 'ACTOR',
      from_party_id,
      to_party_type || 'ACTOR',
      to_party_id,
      amount,
      currency || 'EUR',
      payment_method,
      reference,
      purpose,
      suspicious_indicators || [],
      metadata ? JSON.stringify(metadata) : null
    ]);

    res.json({
      success: true,
      transaction_id,
      message: 'Transaction recorded'
    });

  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});

/**
 * GET /api/forensic/transactions
 * Get transaction history
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const { party_id, start_date, end_date, min_amount } = req.query;

    let queryText = 'SELECT * FROM forensic_transactions WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (party_id) {
      queryText += ` AND (from_party_id = $${paramIndex} OR to_party_id = $${paramIndex})`;
      params.push(party_id);
      paramIndex++;
    }

    if (start_date) {
      queryText += ` AND transaction_date >= $${paramIndex++}`;
      params.push(start_date);
    }

    if (end_date) {
      queryText += ` AND transaction_date <= $${paramIndex++}`;
      params.push(end_date);
    }

    if (min_amount) {
      queryText += ` AND amount >= $${paramIndex++}`;
      params.push(min_amount);
    }

    queryText += ' ORDER BY transaction_date DESC LIMIT 100';

    const result = await query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      transactions: result.rows
    });

  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ============================================================================
// CONSPIRACY DETECTION
// ============================================================================

/**
 * POST /api/forensic/analyze/conspiracy
 * Run comprehensive conspiracy detection analysis
 */
router.post('/analyze/conspiracy', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Starting conspiracy detection analysis...');

    const conspiracyLinks = await ConspiracyDetectionEngine.detectConspiracies();

    res.json({
      success: true,
      analysis_type: 'CONSPIRACY_DETECTION',
      timestamp: new Date().toISOString(),
      results: {
        conspiracy_links_detected: conspiracyLinks.length,
        high_confidence_links: conspiracyLinks.filter(l => 
          l.evidence_strength === 'STRONG' || l.evidence_strength === 'CONCLUSIVE'
        ).length,
        links: conspiracyLinks
      }
    });

  } catch (error) {
    console.error('Conspiracy detection error:', error);
    res.status(500).json({ error: 'Failed to run conspiracy detection' });
  }
});

/**
 * POST /api/forensic/analyze/temporal
 * Run temporal correlation analysis
 */
router.post('/analyze/temporal', async (req: Request, res: Response) => {
  try {
    const { time_window_days, minimum_events } = req.body;

    const correlations = await ConspiracyDetectionEngine.detectTemporalCorrelations(
      time_window_days || 7,
      minimum_events || 3
    );

    res.json({
      success: true,
      analysis_type: 'TEMPORAL_CORRELATION',
      parameters: {
        time_window_days: time_window_days || 7,
        minimum_events: minimum_events || 3
      },
      results: {
        correlations_found: correlations.length,
        correlations
      }
    });

  } catch (error) {
    console.error('Temporal analysis error:', error);
    res.status(500).json({ error: 'Failed to run temporal analysis' });
  }
});

/**
 * POST /api/forensic/analyze/financial-flows
 * Run financial flow mapping
 */
router.post('/analyze/financial-flows', async (req: Request, res: Response) => {
  try {
    const { minimum_amount } = req.body;

    const flows = await ConspiracyDetectionEngine.mapFinancialFlows(
      minimum_amount || 10000
    );

    res.json({
      success: true,
      analysis_type: 'FINANCIAL_FLOW_MAPPING',
      results: {
        significant_flows: flows.length,
        total_value: flows.reduce((sum, f) => sum + f.total_amount, 0),
        flows
      }
    });

  } catch (error) {
    console.error('Financial flow analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze financial flows' });
  }
});

/**
 * POST /api/forensic/analyze/cui-bono
 * Run Cui Bono (Who Benefits) analysis
 */
router.post('/analyze/cui-bono', async (req: Request, res: Response) => {
  try {
    const beneficiaries = await ConspiracyDetectionEngine.analyzeCuiBono();

    res.json({
      success: true,
      analysis_type: 'CUI_BONO',
      results: {
        beneficiaries_identified: beneficiaries.length,
        total_benefits: beneficiaries.reduce((sum, b) => sum + b.total_benefit_value, 0),
        beneficiaries
      }
    });

  } catch (error) {
    console.error('Cui Bono analysis error:', error);
    res.status(500).json({ error: 'Failed to run Cui Bono analysis' });
  }
});

/**
 * GET /api/forensic/report
 * Generate comprehensive investigation report
 */
router.get('/report', async (req: Request, res: Response) => {
  try {
    const report = await ConspiracyDetectionEngine.generateInvestigationReport();

    res.json({
      success: true,
      report_type: 'COMPREHENSIVE_INVESTIGATION_REPORT',
      generated_at: new Date().toISOString(),
      report
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ============================================================================
// EVIDENCE DOCUMENT MANAGEMENT
// ============================================================================

/**
 * POST /api/forensic/documents
 * Upload evidence document
 */
router.post('/documents', upload.single('document'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const {
      document_type,
      title,
      description,
      matter_id,
      related_actors,
      related_entities,
      classification,
      confidentiality
    } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No document uploaded' });
    }

    const document_id = `DOC-${Date.now()}-${nanoid(8)}`;

    await query(`
      INSERT INTO forensic_documents (
        document_id, document_type, title, description, file_path,
        file_size, mime_type, matter_id, related_actors, related_entities,
        classification, confidentiality, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [
      document_id,
      document_type || 'EVIDENCE',
      title || file.originalname,
      description,
      file.path,
      file.size,
      file.mimetype,
      matter_id,
      related_actors ? JSON.parse(related_actors) : [],
      related_entities ? JSON.parse(related_entities) : [],
      classification || 'UNCLASSIFIED',
      confidentiality || 'CONFIDENTIAL',
      JSON.stringify({
        original_name: file.originalname,
        uploaded_at: new Date().toISOString()
      })
    ]);

    res.json({
      success: true,
      document_id,
      filename: file.filename,
      size: file.size,
      message: 'Evidence document uploaded successfully'
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

export default router;
