/**
 * Health Check Endpoints
 * Provides system health status for monitoring and observability
 * 
 * Compliance:
 * - NIST SP 800-53 (SI-4: Information System Monitoring)
 * - EU AI Act Article 13 (Transparency and monitoring)
 * - ISO/IEC 27001 (System monitoring)
 */

import { Request, Response, Router } from 'express';
import { Pool } from 'pg';

const router = Router();

// Database connection check
async function checkDatabase(): Promise<{ status: string; responseTime: number; error?: string }> {
  const startTime = Date.now();
  
  try {
    // Use the existing PostgreSQL connection from your app
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        error: 'DATABASE_URL not configured'
      };
    }
    
    const pool = new Pool({ connectionString: databaseUrl });
    const result = await pool.query('SELECT NOW()');
    await pool.end();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Memory check
function checkMemory(): { status: string; usage: NodeJS.MemoryUsage; usagePercent: number } {
  const usage = process.memoryUsage();
  const totalMemory = usage.heapTotal;
  const usedMemory = usage.heapUsed;
  const usagePercent = (usedMemory / totalMemory) * 100;
  
  return {
    status: usagePercent < 90 ? 'healthy' : 'warning',
    usage,
    usagePercent: Math.round(usagePercent * 100) / 100
  };
}

// Uptime check
function checkUptime(): { status: string; uptime: number; uptimeFormatted: string } {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  return {
    status: 'healthy',
    uptime,
    uptimeFormatted: `${days}d ${hours}h ${minutes}m ${seconds}s`
  };
}

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ORB AI Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with system metrics
 */
router.get('/api/health/detailed', async (req: Request, res: Response) => {
  const [database, memory, uptime] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkMemory()),
    Promise.resolve(checkUptime())
  ]);
  
  const overallStatus = 
    database.status === 'unhealthy' ? 'unhealthy' :
    memory.status === 'warning' ? 'degraded' :
    'healthy';
  
  const statusCode = 
    overallStatus === 'unhealthy' ? 503 :
    overallStatus === 'degraded' ? 200 :
    200;
  
  res.status(statusCode).json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    service: 'ORB AI Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks: {
      database,
      memory,
      uptime
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid
    }
  });
});

/**
 * GET /api/health/ready
 * Kubernetes readiness probe
 * Returns 200 if service is ready to accept traffic
 */
router.get('/api/health/ready', async (req: Request, res: Response) => {
  try {
    const database = await checkDatabase();
    
    if (database.status === 'healthy') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: 'Database connection failed'
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/health/live
 * Kubernetes liveness probe
 * Returns 200 if service is alive
 */
router.get('/api/health/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health/metrics
 * Prometheus-compatible metrics endpoint
 */
router.get('/api/health/metrics', async (req: Request, res: Response) => {
  const memory = checkMemory();
  const uptime = checkUptime();
  const database = await checkDatabase();
  
  // Prometheus text format
  const metrics = `
# HELP orb_ai_up Service is up (1) or down (0)
# TYPE orb_ai_up gauge
orb_ai_up 1

# HELP orb_ai_uptime_seconds Service uptime in seconds
# TYPE orb_ai_uptime_seconds counter
orb_ai_uptime_seconds ${uptime.uptime}

# HELP orb_ai_memory_usage_bytes Memory usage in bytes
# TYPE orb_ai_memory_usage_bytes gauge
orb_ai_memory_usage_bytes{type="heap_used"} ${memory.usage.heapUsed}
orb_ai_memory_usage_bytes{type="heap_total"} ${memory.usage.heapTotal}
orb_ai_memory_usage_bytes{type="rss"} ${memory.usage.rss}
orb_ai_memory_usage_bytes{type="external"} ${memory.usage.external}

# HELP orb_ai_memory_usage_percent Memory usage percentage
# TYPE orb_ai_memory_usage_percent gauge
orb_ai_memory_usage_percent ${memory.usagePercent}

# HELP orb_ai_database_response_time_ms Database response time in milliseconds
# TYPE orb_ai_database_response_time_ms gauge
orb_ai_database_response_time_ms ${database.responseTime}

# HELP orb_ai_database_status Database health status (1=healthy, 0=unhealthy)
# TYPE orb_ai_database_status gauge
orb_ai_database_status ${database.status === 'healthy' ? 1 : 0}
`.trim();
  
  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.status(200).send(metrics);
});

export default router;
