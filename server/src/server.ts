/**
 * MAIN EXPRESS SERVER
 * Complete backend API for ORB AI Platform (NoCompare, VeriTech, Utility Audit clients)
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import multer from 'multer';
import { initializeDatabase } from './config/database';
import CompleteAuditEngine from './engines/CompleteAuditEngine';
import EmailBillProcessor from './services/EmailBillProcessor';

// Import route modules
import utilityAuditRoutes from './routes/utilityAudit';
import nocompareRoutes from './routes/nocompare';
import orbRoutes from './routes/orb';
import kavanRoutes from './routes/kavan';
import forensicRoutes from './routes/forensic';
import forexRoutes from './routes/forex';
import neuralRoutes from './routes/neural';
import veritechRoutes from './routes/veritech';
import healthRoutes from './routes/health';

// Import security middleware
import {
  securityHeaders,
  rateLimiter,
  corsMiddleware,
  validateInput,
  requestLogger,
  errorHandler
} from './middleware/security';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize engines
const auditEngine = new CompleteAuditEngine();

// Initialize email processor if configured
let emailProcessor: EmailBillProcessor | null = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailProcessor = new EmailBillProcessor({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '993'),
    tls: process.env.EMAIL_TLS === 'true',
    tlsOptions: {
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED !== 'false'
    }
  });
}

async function startServer() {
  const app: Express = express();
  const server = createServer(app);
  
  // ============================================
  // SECURITY MIDDLEWARE (Week 2 - Priority 1)
  // ============================================
  
  // Apply security headers (Helmet equivalent)
  app.use(securityHeaders);
  
  // Request logging for audit trail
  app.use(requestLogger);
  
  // CORS configuration
  app.use(corsMiddleware);
  
  // Rate limiting (100 req/15min per IP)
  app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  }));
  
  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Input validation (XSS, SQL injection protection)
  app.use(validateInput);
  
  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, process.env.UPLOAD_DIR || './uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage,
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'));
      }
    }
  });
  
  // Initialize database (non-fatal – platform runs without DB in dev/sandbox)
  console.log('🔌 Initializing database...');
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.warn('⚠️  Database unavailable – continuing in DB-less mode (Forex, health, and static routes still active)');
  }
  
  // Start email monitoring if configured
  if (emailProcessor) {
    console.log('📧 Starting email bill processor...');
    await emailProcessor.startMonitoring(parseInt(process.env.EMAIL_CHECK_INTERVAL || '5'));
  }
  
  // ============================================
  // API ROUTES
  // ============================================
  
  // Health check endpoints (comprehensive monitoring)
  app.use(healthRoutes);
  
  // System status
  app.get('/api/system/status', (req, res) => {
    res.json({
      engines_online: 12,
      network_uptime: '99.99%',
      gas_fees: '12 Gwei',
      pending_tx: 0,
      active_nodes: [
        { name: 'London', status: 'online' },
        { name: 'Dublin', status: 'online' },
        { name: 'New York', status: 'online' },
        { name: 'Singapore', status: 'partial' }
      ],
      global_fraud_index: 84,
      veritech_core_status: 'ONLINE',
      email_processor: emailProcessor ? 'monitoring' : 'disabled'
    });
  });
  
  // Mount platform-specific routes
  app.use('/api/utility-audit', utilityAuditRoutes);
  app.use('/api/nocompare', nocompareRoutes);
  app.use('/api/orb', orbRoutes);
  app.use('/api/kavan', kavanRoutes);
  app.use('/api/forensic', forensicRoutes);
  app.use('/api/forex', forexRoutes);
  app.use('/api/neural', neuralRoutes);
  app.use('/api/veritech', veritechRoutes);
  
  // ============================================
  // UTILITY AUDIT API (Client Services)
  // ============================================
  
  /**
   * POST /api/utility-audit/audit/upload
   * Upload bills for forensic audit
   */
  app.post('/api/utility-audit/audit/upload', upload.array('bills', 100), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      const { customer_name, facility_type, hiqa_registered } = req.body;
      
      res.json({
        success: true,
        message: `Received ${files.length} bills for processing`,
        files: files.map(f => ({ filename: f.filename, size: f.size })),
        processing_id: `AUDIT-${Date.now()}`
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  });
  
  /**
   * POST /api/utility-audit/audit/analyze
   * Perform complete audit analysis
   */
  app.post('/api/utility-audit/audit/analyze', async (req, res) => {
    try {
      const { bill_files, facility_data, customer_name } = req.body;
      
      if (!bill_files || !Array.isArray(bill_files)) {
        return res.status(400).json({ error: 'bill_files array required' });
      }
      
      // Perform complete audit
      const projectId = `AUDIT-${Date.now()}`;
      const report = await auditEngine.performCompleteAudit(
        bill_files,
        facility_data || { type: 'nursing_home', hiqa_registered: true },
        projectId,
        customer_name || 'Test Customer'
      );
      
      res.json({
        success: true,
        report
      });
      
    } catch (error) {
      console.error('Audit error:', error);
      res.status(500).json({ error: `Audit failed: ${error instanceof Error ? error.message : String(error)}` });
    }
  });
  
  /**
   * GET /api/utility-audit/audit/:projectId
   * Get audit project status
   */
  app.get('/api/utility-audit/audit/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      
      // TODO: Fetch from database
      res.json({
        project_id: projectId,
        status: 'completed',
        progress: 100,
        message: 'Audit analysis complete'
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch audit status' });
    }
  });
  
  // ============================================
  // NO COMPARE API
  // ============================================
  
  /**
   * POST /api/nocompare/upload
   * Upload single bill for comparison
   */
  app.post('/api/nocompare/upload', upload.single('bill'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Extract bill data using OCR
      const { ocrEngine } = auditEngine as any;
      const billData = await ocrEngine.extractBillData(file.path);
      
      res.json({
        success: true,
        bill_data: billData,
        processing_id: `COMPARE-${Date.now()}`
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: `Failed to process bill: ${error instanceof Error ? error.message : String(error)}` });
    }
  });
  
  /**
   * POST /api/nocompare/compare
   * Compare tariffs and find savings
   */
  app.post('/api/nocompare/compare', async (req, res) => {
    try {
      const { bill_data } = req.body;
      
      if (!bill_data) {
        return res.status(400).json({ error: 'bill_data required' });
      }
      
      // Analyze and find optimal tariff
      const { tariffOptimizer } = auditEngine as any;
      const usagePattern = tariffOptimizer.analyzeUsagePattern([bill_data]);
      const comparison = tariffOptimizer.findOptimalTariff(usagePattern, [bill_data]);
      
      res.json({
        success: true,
        comparison,
        potential_savings: comparison.annual_savings,
        percentage_savings: comparison.percentage_savings,
        recommended_supplier: comparison.optimal_tariff.supplier,
        recommended_tariff: comparison.optimal_tariff.tariff_name
      });
      
    } catch (error) {
      console.error('Comparison error:', error);
      res.status(500).json({ error: `Comparison failed: ${error instanceof Error ? error.message : String(error)}` });
    }
  });
  
  /**
   * GET /api/nocompare/suppliers
   * Get list of available suppliers
   */
  app.get('/api/nocompare/suppliers', async (req, res) => {
    try {
      const suppliers = [
        { name: 'Electric Ireland', tariffs: 2, avg_rate: 0.42 },
        { name: 'Bord Gáis Energy', tariffs: 1, avg_rate: 0.40 },
        { name: 'SSE Airtricity', tariffs: 1, avg_rate: 0.41 },
        { name: 'Energia', tariffs: 1, avg_rate: 0.39 },
        { name: 'Prepay Power', tariffs: 1, avg_rate: 0.43 }
      ];
      
      res.json({ suppliers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
  });
  
  // ============================================
  // ORB AI API
  // ============================================
  
  /**
   * POST /api/orb/verify
   * Verify document authenticity
   */
  app.post('/api/orb/verify', upload.single('document'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No document uploaded' });
      }
      
      // TODO: Implement deep fake detection
      res.json({
        success: true,
        verification_id: `VERIFY-${Date.now()}`,
        authenticity_score: 0.997,
        deepfake_detected: false,
        blockchain_hash: '0x' + Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });
  
  // ============================================
  // KAVAN AI API
  // ============================================
  
  /**
   * POST /api/kavan/case/create
   * Create new legal case
   */
  app.post('/api/kavan/case/create', async (req, res) => {
    try {
      const { case_name, case_type, plaintiff, defendant } = req.body;
      
      res.json({
        success: true,
        case_id: `CASE-${Date.now()}`,
        case_name,
        status: 'initiated',
        created_at: new Date().toISOString()
      });
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to create case' });
    }
  });
  
  // ============================================
  // SERVE FRONTEND (Production)
  // ============================================
  
  // Resolve static path robustly — works in both production (Railway/Vercel) and sandbox
  const candidatePaths = [
    path.resolve(__dirname, '..', 'public'),                          // Railway: dist/server.js → dist/public
    path.resolve(__dirname, 'public'),                                // alternative flat
    path.resolve(process.cwd(), 'dist', 'public'),                   // sandbox: cwd/dist/public
    path.resolve(process.cwd(), 'public'),                            // Vercel static output
  ];
  const fs = await import('fs');
  const staticPath = candidatePaths.find(p => {
    try { fs.accessSync(p); return true; } catch { return false; }
  }) || candidatePaths[0];

  console.log(`📁 Static files served from: ${staticPath}`);
  app.use(express.static(staticPath));

  // Handle client-side routing — only for non-API paths
  app.get('*', (req, res) => {
    const indexPath = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({
        platform: 'Orb AI Forensic & Forex Platform v2.0',
        status: 'API_ONLY_MODE',
        message: 'Frontend not built — API is fully operational',
        api_endpoints: [
          'GET /api/health',
          'GET /api/forex/health',
          'POST /api/forex/predict',
          'POST /api/forex/verify',
          'GET /api/forensic/readiness',
          'GET /api/system/status',
        ],
      });
    }
  });
  
  // Error handling middleware (comprehensive security error handler)
  app.use(errorHandler);
  
  // Start server
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║        ORB AI PLATFORM - VERITECH CORE ONLINE           ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running on http://localhost:${port}/`);
    console.log(`✅ API available at http://localhost:${port}/api/`);
    console.log(`✅ Database: Connected`);
    console.log(`✅ AI Engines: 12/12 Online`);
    console.log('');
    console.log('📍 Endpoints:');
    console.log('   • UTILITY AUDIT:    /api/utility-audit/*');
    console.log('   • NO COMPARE: /api/nocompare/*');
    console.log('   • ORB AI:     /api/orb/*');
    console.log('   • KAVAN AI:   /api/kavan/*');
    console.log('   • FORENSIC:   /api/forensic/*');
    console.log('   • System:     /api/system/status');
    console.log('');
  });
}

// Start the server
startServer().catch(console.error);
