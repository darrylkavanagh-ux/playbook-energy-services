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
  ] = await Promise.all([
    loadRouter('./routes/trading.js',    'trading'),
    loadRouter('./routes/forex.js',      'forex'),
    loadRouter('./routes/orb.js',        'orb'),
    loadRouter('./routes/kavan.js',      'kavan'),
    loadRouter('./routes/forensic.js',   'forensic'),
    loadRouter('./routes/platform.js',   'platform'),
    loadRouter('./routes/veritech.js',   'veritech'),
    loadRouter('./routes/neural.js',     'neural'),
    loadRouter('./routes/foxlite.js',    'foxlite'),
    loadRouter('./routes/nocompare.js',  'nocompare'),
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

  // ── Supabase admin route (run migration once) ──────────────────────────────
  app.post('/api/trading/admin/migrate', async (_req: Request, res: Response) => {
    try {
      const { supabaseService } = await import('./services/SupabaseService.js');
      const result = await supabaseService.runMigration();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ── Supabase health endpoint ───────────────────────────────────────────────
  app.get('/api/trading/admin/supabase-health', async (_req: Request, res: Response) => {
    try {
      const { supabaseService, isSupabaseEnabled } = await import('./services/SupabaseService.js');
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
  app.get('*', (req: Request, res: Response) => {
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
