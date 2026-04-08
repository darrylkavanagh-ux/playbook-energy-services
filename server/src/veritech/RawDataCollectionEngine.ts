/**
 * VeriTech V1: Raw Data Collection Engine
 * 
 * Purpose: Collects and aggregates raw data from multiple sources
 * Accuracy Target: 90%+
 * 
 * Features:
 * - Multi-source data collection (databases, files, APIs)
 * - Data normalization and standardization
 * - Metadata extraction
 * - Source verification
 * - Data integrity checks
 * 
 * Compliance:
 * - PACE 1984 (evidence collection)
 * - ISO/IEC 27037 (digital evidence)
 * - NIST SP 800-53 (data integrity)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { Pool } from 'pg';
import crypto from 'crypto';

export interface RawDataSource {
  type: 'database' | 'file' | 'api' | 'email' | 'drive';
  location: string;
  metadata?: Record<string, any>;
}

export interface CollectedData {
  id: string;
  source: RawDataSource;
  data: any;
  hash: string;
  timestamp: Date;
  size: number;
  format: string;
  metadata: Record<string, any>;
}

export interface V1Result {
  success: boolean;
  collected: CollectedData[];
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  accuracy: number;
  errors: Array<{
    source: string;
    error: string;
  }>;
  executionTime: number;
}

export class RawDataCollectionEngine {
  private databaseUrl?: string;
  private pool?: Pool;
  
  constructor(databaseUrl?: string) {
    this.databaseUrl = databaseUrl || process.env.DATABASE_URL;
  }
  
  /**
   * Collect raw data from multiple sources
   */
  async collect(sources: RawDataSource[]): Promise<V1Result> {
    const startTime = Date.now();
    const collected: CollectedData[] = [];
    const errors: Array<{ source: string; error: string }> = [];
    
    console.log(`📥 V1: Starting raw data collection from ${sources.length} sources...`);
    
    for (const source of sources) {
      try {
        const data = await this.collectFromSource(source);
        collected.push(data);
      } catch (error) {
        errors.push({
          source: source.location,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ Failed to collect from ${source.location}:`, error);
      }
    }
    
    const successfulSources = collected.length;
    const failedSources = errors.length;
    const totalSources = sources.length;
    const accuracy = totalSources > 0 ? (successfulSources / totalSources) * 100 : 0;
    const executionTime = Date.now() - startTime;
    
    console.log(`✅ V1: Collected ${successfulSources}/${totalSources} sources (${accuracy.toFixed(2)}% success rate)`);
    
    return {
      success: successfulSources > 0,
      collected,
      totalSources,
      successfulSources,
      failedSources,
      accuracy,
      errors,
      executionTime
    };
  }
  
  /**
   * Collect data from a single source
   */
  private async collectFromSource(source: RawDataSource): Promise<CollectedData> {
    switch (source.type) {
      case 'database':
        return await this.collectFromDatabase(source);
      case 'file':
        return await this.collectFromFile(source);
      case 'api':
        return await this.collectFromAPI(source);
      case 'email':
        return await this.collectFromEmail(source);
      case 'drive':
        return await this.collectFromDrive(source);
      default:
        throw new Error(`Unsupported source type: ${source.type}`);
    }
  }
  
  /**
   * Collect data from database
   */
  private async collectFromDatabase(source: RawDataSource): Promise<CollectedData> {
    if (!this.databaseUrl) {
      throw new Error('Database URL not configured');
    }
    
    if (!this.pool) {
      this.pool = new Pool({ connectionString: this.databaseUrl });
    }
    
    // Extract table name from location (format: "schema.table" or "table")
    const parts = source.location.split('.');
    const tableName = parts.length > 1 ? parts[1] : parts[0];
    const schemaName = parts.length > 1 ? parts[0] : 'public';
    
    // Query data
    const query = `SELECT * FROM ${schemaName}.${tableName} LIMIT 1000`;
    const result = await this.pool.query(query);
    
    // Calculate hash
    const dataString = JSON.stringify(result.rows);
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    return {
      id: `db-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      source,
      data: result.rows,
      hash,
      timestamp: new Date(),
      size: dataString.length,
      format: 'json',
      metadata: {
        rowCount: result.rows.length,
        columns: result.fields.map(f => f.name),
        schema: schemaName,
        table: tableName
      }
    };
  }
  
  /**
   * Collect data from file
   */
  private async collectFromFile(source: RawDataSource): Promise<CollectedData> {
    const filePath = source.location;
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Read file
    const buffer = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);
    
    // Calculate hash
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Determine format
    const ext = path.extname(filePath).toLowerCase();
    const format = ext.substring(1) || 'unknown';
    
    // Parse data based on format
    let data: any;
    if (format === 'json') {
      data = JSON.parse(buffer.toString('utf-8'));
    } else if (format === 'txt' || format === 'csv') {
      data = buffer.toString('utf-8');
    } else {
      data = buffer; // Keep as buffer for binary files
    }
    
    return {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      source,
      data,
      hash,
      timestamp: new Date(stats.mtime),
      size: stats.size,
      format,
      metadata: {
        filename: path.basename(filePath),
        path: filePath,
        created: stats.ctime,
        modified: stats.mtime,
        extension: ext
      }
    };
  }
  
  /**
   * Collect data from API
   */
  private async collectFromAPI(source: RawDataSource): Promise<CollectedData> {
    const url = source.location;
    
    // Fetch data
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VeriTech-V1-DataCollector/1.0',
        ...(source.metadata?.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    // Parse response
    const contentType = response.headers.get('content-type') || '';
    let data: any;
    let format: string;
    
    if (contentType.includes('application/json')) {
      data = await response.json();
      format = 'json';
    } else if (contentType.includes('text/')) {
      data = await response.text();
      format = 'text';
    } else {
      const buffer = await response.arrayBuffer();
      data = Buffer.from(buffer);
      format = 'binary';
    }
    
    // Calculate hash
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    return {
      id: `api-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      source,
      data,
      hash,
      timestamp: new Date(),
      size: dataString.length,
      format,
      metadata: {
        url,
        contentType,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      }
    };
  }
  
  /**
   * Collect data from email
   */
  private async collectFromEmail(source: RawDataSource): Promise<CollectedData> {
    // Email collection would integrate with EmailAnalysisEngine
    // For now, return placeholder
    throw new Error('Email collection not yet implemented in V1 (use EmailAnalysisEngine)');
  }
  
  /**
   * Collect data from Google Drive
   */
  private async collectFromDrive(source: RawDataSource): Promise<CollectedData> {
    // Drive collection would integrate with GoogleDriveForensicSystem
    // For now, return placeholder
    throw new Error('Drive collection not yet implemented in V1 (use GoogleDriveForensicSystem)');
  }
  
  /**
   * Verify data integrity
   */
  verifyIntegrity(data: CollectedData): boolean {
    // Recalculate hash
    const dataString = typeof data.data === 'string' ? data.data : JSON.stringify(data.data);
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    return hash === data.hash;
  }
  
  /**
   * Normalize data format
   */
  normalizeData(data: CollectedData): any {
    // Convert all data to consistent JSON format
    if (Buffer.isBuffer(data.data)) {
      return {
        type: 'binary',
        size: data.data.length,
        hash: data.hash
      };
    }
    
    if (typeof data.data === 'string') {
      // Try to parse as JSON
      try {
        return JSON.parse(data.data);
      } catch {
        return { type: 'text', content: data.data };
      }
    }
    
    return data.data;
  }
  
  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = undefined;
    }
  }
}

export default RawDataCollectionEngine;
