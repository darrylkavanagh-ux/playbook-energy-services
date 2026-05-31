/**
 * PRODUCTION ENTRY POINT — Playbook Corporation Platform
 * =============================================================================
 * This file IS the entry point that Railway compiles and runs as dist/server.js
 *
 * CRITICAL FIX: Previously this was a static-file stub that ignored the full
 * Express server in server/src/server.ts. This file now directly implements the
 * complete Express server with all routes, matching server/src/server.ts.
 *
 * Build pipeline: tsc --project tsconfig.server.json → dist/server.js
 * Start command:  node dist/server.js
 * Health check:   GET /api/health
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC ROUTE IMPORTS — graceful degradation if modules fail to load
// ─────────────────────────────────────────────────────────────────────────────

async function loadRouter(importPath: string, label: string) {
  try {
    const mod = await import(importPath);
    const router = mod.default || mod.router;
    if (!router) throw new Error('No default export');
    console.log(`✅ Loaded route: ${label}`);
    return router;
  } catch (err: any) {
    console.warn(`⚠️  Could not load route ${label}: ${err.message}`);
    // Return a stub router that explains what's missing
    const stub = express.Router();
    stub.use((_req: Request, res: Response) => {
      res.status(503).json({
        error:  `Route ${label} not available`,
        detail: err.message,
        note:   'Module failed to load — check server logs',
      });
    });
    return stub;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSOCKET — Real-time price + signal push (P1)
// ─────────────────────────────────────────────────────────────────────────────

const wsClients: Set<WebSocket> = new Set();

function broadcastWS(event: string, data: unknown): void {
  const msg = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  for (const ws of wsClients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

// Make broadcast available globally for route modules
(globalThis as any).__playbookBroadcast = broadcastWS;

// ─────────────────────────────────────────────────────────────────────────────
// SERVER BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app: Express = express();
  const httpServer  = createServer(app);

  // ── WebSocket Server ───────────────────────────────────────────────────────
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  wss.on('connection', (ws: WebSocket, req) => {
    wsClients.add(ws);
    console.log(`[WS] Client connected. Total: ${wsClients.size}`);
    ws.send(JSON.stringify({
      event: 'CONNECTED',
      data:  { message: 'Playbook Trading WebSocket — live price + signal stream', clients: wsClients.size },
      timestamp: new Date().toISOString(),
    }));
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'PING') ws.send(JSON.stringify({ event: 'PONG', timestamp: new Date().toISOString() }));
        if (msg.type === 'SUBSCRIBE') {
          ws.send(JSON.stringify({ event: 'SUBSCRIBED', symbols: msg.symbols, timestamp: new Date().toISOString() }));
        }
      } catch { /* ignore malformed */ }
    });
    ws.on('close', () => {
      wsClients.delete(ws);
      console.log(`[WS] Client disconnected. Total: ${wsClients.size}`);
    });
    ws.on('error', (err) => console.warn('[WS] Error:', err.message));
  });

  // ── Core Middleware ────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origins = (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim());
    const origin  = req.headers.origin || '';
    const allowed = origins.includes('*') || origins.includes(origin) ? (origins.includes('*') ? '*' : origin) : '';
    if (allowed) res.header('Access-Control-Allow-Origin', allowed);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // ── Security headers ───────────────────────────────────────────────────────
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // ── Request logging ────────────────────────────────────────────────────────
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // ── Load all route modules ─────────────────────────────────────────────────
  const [
    tradingRoutes,
    forexRoutes,
    orbRoutes,
    kavanRoutes,
    forensicRoutes,
    platformRoutes,
    veritechRoutes,
    neuralRoutes,
    foxliteRoutes,
    nocompareRoutes,
    forecastRoutes,
    certificationRoutes,
    contentRoutes,
  ] = await Promise.all([
    loadRouter('./src/routes/trading.ts',             'trading'),
    loadRouter('./src/routes/forex.ts',               'forex'),
    loadRouter('./src/routes/orb.ts',                 'orb'),
    loadRouter('./src/routes/kavan.ts',               'kavan'),
    loadRouter('./src/routes/forensic.ts',            'forensic'),
    loadRouter('./src/routes/platform.ts',            'platform'),
    loadRouter('./src/routes/veritech.ts',            'veritech'),
    loadRouter('./src/routes/neural.ts',              'neural'),
    loadRouter('./src/routes/foxlite.ts',             'foxlite'),
    loadRouter('./src/routes/nocompare.ts',           'nocompare'),
    loadRouter('./src/routes/forecastRoutes.ts',      'forecast'),
    loadRouter('./src/routes/certificationRoutes.ts', 'certification'),
    loadRouter('./src/routes/contentRoutes.ts',       'content'),
  ]);

  // ── Mount API routes ───────────────────────────────────────────────────────
  app.use('/api/trading',    tradingRoutes);
  app.use('/api/forex',      forexRoutes);
  app.use('/api/orb',        orbRoutes);
  app.use('/api/kavan',      kavanRoutes);
  app.use('/api/forensic',   forensicRoutes);
  app.use('/api/platform',   platformRoutes);
  app.use('/api/veritech',   veritechRoutes);
  app.use('/api/neural',     neuralRoutes);
  app.use('/api/foxlite',    foxliteRoutes);
  app.use('/api/nocompare',  nocompareRoutes);
  app.use('/api/trading',         forecastRoutes);   // forecast + professional registry routes
  app.use('/api/certification',   certificationRoutes); // 3-route certification (Judge Victoria Sharpe)
  app.use('/api/content',         contentRoutes);      // CVK-1100 content engine + language calibration

  // ── Supabase admin route (run migration once) ──────────────────────────────
  app.post('/api/trading/admin/migrate', async (_req: Request, res: Response) => {
    try {
      const { supabaseService } = await import('./src/services/SupabaseService.js');
      const result = await supabaseService.runMigration();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ── Supabase health endpoint ───────────────────────────────────────────────
  app.get('/api/trading/admin/supabase-health', async (_req: Request, res: Response) => {
    try {
      const { supabaseService, isSupabaseEnabled } = await import('./src/services/SupabaseService.js');
      const health = await supabaseService.healthCheck();
      res.json({ supabase_enabled: isSupabaseEnabled(), ...health });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── WebSocket client info endpoint ─────────────────────────────────────────
  app.get('/api/ws/status', (_req: Request, res: Response) => {
    res.json({
      connected_clients: wsClients.size,
      ws_path:           '/ws',
      status:            'ONLINE',
    });
  });

  // ── V10 Compliance Gate endpoints ──────────────────────────────────────────

  app.get('/api/v10/report', async (_req: Request, res: Response) => {
    try {
      const { v10Gate }  = await import('./src/services/V10ComplianceGate.js');
      const report       = v10Gate.generateReport();
      res.json({ success: true, report });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.get('/api/v10/features', async (_req: Request, res: Response) => {
    try {
      const { v10Gate }  = await import('./src/services/V10ComplianceGate.js');
      const all          = v10Gate.evaluateAll();
      const certified    = all.filter((f: any) => f.status === 'CERTIFIED');
      const pending      = all.filter((f: any) => f.status === 'PENDING');
      const failed       = all.filter((f: any) => f.status === 'FAILED');
      res.json({
        success:        true,
        overall_score:  v10Gate.getOverallScore(),
        gate_open:      v10Gate.isGateOpen(),
        total:          all.length,
        certified_count: certified.length,
        pending_count:   pending.length,
        failed_count:    failed.length,
        features:        all,
      });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.get('/api/v10/features/:id', async (req: Request, res: Response) => {
    try {
      const { v10Gate }  = await import('./src/services/V10ComplianceGate.js');
      const featureId   = String(req.params.id);
      const feature      = v10Gate.getFeature(featureId);
      if (!feature) return res.status(404).json({ error: `Feature ${featureId} not found` });
      res.json({ success: true, feature });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.post('/api/v10/features/:id/evidence', async (req: Request, res: Response) => {
    try {
      const { v10Gate }  = await import('./src/services/V10ComplianceGate.js');
      const { type, score, description, passed, tested_at } = req.body;
      if (!type || score === undefined || !description) {
        return res.status(400).json({ error: 'Required: type, score, description' });
      }
      const result = v10Gate.submitEvidence(String(req.params.id), {
        type, score: Number(score),
        description,
        passed:     passed !== false,
        tested_at:  tested_at || new Date().toISOString(),
      });
      res.json(result);
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  // V10 Update Queue endpoints

  app.get('/api/v10/updates', async (_req: Request, res: Response) => {
    try {
      const { selfUpdate } = await import('./src/services/PlatformSelfUpdateService.js');
      res.json({
        success:  true,
        summary:  selfUpdate.getSummary(),
        updates:  selfUpdate.getAll(),
        note:     `Only '${(await import('./src/services/V10ComplianceGate.js')).AUTHORIZED_APPROVER}' can authorize or reject updates.`,
      });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.post('/api/v10/updates', async (req: Request, res: Response) => {
    try {
      const { selfUpdate } = await import('./src/services/PlatformSelfUpdateService.js');
      const { title, description, category, impact, target_feature, proposed_change, expected_benefit, risk_assessment, proposer } = req.body;
      if (!title || !description || !category || !impact || !target_feature || !proposed_change) {
        return res.status(400).json({ error: 'Required: title, description, category, impact, target_feature, proposed_change' });
      }
      const update = selfUpdate.propose({ title, description, category, impact, target_feature, proposed_change, expected_benefit: expected_benefit || 'Not specified', risk_assessment: risk_assessment || 'Not assessed', proposer });
      res.json({ success: true, update, message: `Update queued. Awaiting authorization from ${(await import('./src/services/V10ComplianceGate.js')).AUTHORIZED_APPROVER}.` });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.post('/api/v10/updates/:id/authorize', async (req: Request, res: Response) => {
    try {
      const { selfUpdate } = await import('./src/services/PlatformSelfUpdateService.js');
      const approver = String(req.query.approver || req.body.approver || '');
      const notes    = String(req.query.notes    || req.body.notes    || '');
      const result   = selfUpdate.authorize(String(req.params.id), approver, notes);
      const status   = result.success ? 200 : 403;
      res.status(status).json(result);
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.post('/api/v10/updates/:id/reject', async (req: Request, res: Response) => {
    try {
      const { selfUpdate } = await import('./src/services/PlatformSelfUpdateService.js');
      const approver = String(req.query.approver || req.body.approver || '');
      const reason   = String(req.query.reason   || req.body.reason   || 'No reason provided');
      const result   = selfUpdate.reject(String(req.params.id), approver, reason);
      const status   = result.success ? 200 : 403;
      res.status(status).json(result);
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });

  app.post('/api/v10/propose-improvements', async (_req: Request, res: Response) => {
    try {
      const { v10Gate }    = await import('./src/services/V10ComplianceGate.js');
      const { selfUpdate } = await import('./src/services/PlatformSelfUpdateService.js');
      const features = v10Gate.evaluateAll().map((f: any) => ({
        id:     f.id,
        name:   f.name,
        score:  f.score,
        status: f.status,
        notes:  f.notes,
      }));
      const proposals = selfUpdate.proposeFromV10Gaps(features);
      res.json({
        success:          true,
        proposals_queued: proposals.length,
        proposals,
        message:          proposals.length > 0
          ? `${proposals.length} improvement proposals queued. Awaiting Darryl authorization before any changes are applied.`
          : 'No new improvement proposals needed at this time.',
      });
    } catch (err: any) { res.status(500).json({ success: false, error: err.message }); }
  });


  // ── Global health endpoint ─────────────────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status:      'OPERATIONAL',
      platform:    'Playbook Corporation — Orb AI Universe',
      version:     '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        trading_engine: 'ONLINE',
        websocket:       `${wsClients.size} clients`,
        supabase:        process.env.SUPABASE_URL ? 'CONFIGURED' : 'FILE_FALLBACK',
        redis:           process.env.REDIS_URL ? 'CONFIGURED' : 'NOT_CONFIGURED',
      },
      timestamp: new Date().toISOString(),
      uptime:    process.uptime(),
    });
  });

  // ── Serve static frontend (Vite build output) ─────────────────────────────
  const staticPath = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, 'public')
    : path.resolve(__dirname, '..', 'dist');

  app.use(express.static(staticPath));

  // ── SPA fallback — all non-API routes serve index.html ────────────────────
  app.get('/{*path}', (req: Request, res: Response) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/ws')) {
      return res.status(404).json({ error: `API route not found: ${req.path}` });
    }
    const indexPath = path.join(staticPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Playbook Corporation</title></head>
            <body>
              <h1>Playbook Corporation — Orb AI Universe</h1>
              <p>Frontend build not found. Run: <code>npm run build</code></p>
              <p>API is operational at <a href="/api/health">/api/health</a></p>
            </body>
          </html>
        `);
      }
    });
  });

  // ── Error handler ─────────────────────────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Express] Unhandled error:', err.message);
    res.status(500).json({
      error:   'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    });
  });

  // ── Start listening ────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3000', 10);
  httpServer.listen(port, '0.0.0.0', () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║         PLAYBOOK CORPORATION — ORB AI UNIVERSE v3.0         ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║  HTTP  →  http://0.0.0.0:${port}                              ║`);
    console.log(`║  WS    →  ws://0.0.0.0:${port}/ws                             ║`);
    console.log(`║  ENV   →  ${(process.env.NODE_ENV || 'development').padEnd(51)}║`);
    console.log(`║  DB    →  ${(process.env.SUPABASE_URL ? 'Supabase ✅' : 'File fallback ⚠️').padEnd(51)}║`);
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully`);
    for (const ws of wsClients) ws.close(1001, 'Server shutting down');
    httpServer.close(() => {
      console.log('[Server] HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    console.error('[Server] Uncaught exception:', err);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled rejection:', reason);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
