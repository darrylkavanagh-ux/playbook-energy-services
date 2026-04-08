/**
 * TEMPORAL VERIFICATION ENGINE - V6 LAYER
 * =============================================================================
 * REAL IMPLEMENTATION - Validates dates and detects anachronisms
 * 
 * Purpose: Verify chronological accuracy, detect temporal inconsistencies
 * 
 * Checks:
 * 1. Future dates (evidence dated after current time)
 * 2. Anachronisms (events before/after possible timeframe)
 * 3. Chronological consistency (creation before modification)
 * 4. Reasonable age (evidence not too old)
 * 5. Temporal ordering (sequence of events makes sense)
 * 
 * Target Accuracy: 95%+ for temporal verification
 * 
 * Standards:
 * - PACE 1984: Evidence integrity and provenance
 * - ISO/IEC 27037:2012: Digital evidence temporal metadata
 * - Chain of Custody: Unbroken temporal sequence
 */

import crypto from 'crypto';
import { SearchRecord } from './UniversalSearchEngine';

export interface TemporalCheck {
  check_name: string;
  passed: boolean;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp_checked: Date;
  expected_range?: { min: Date; max: Date };
  actual_value?: Date;
  details: string;
}

export interface TemporalEvidence {
  record_id: string;
  file_path?: string;
  created_date?: Date;
  modified_date?: Date;
  accessed_date?: Date;
  metadata_date?: Date;
  content_dates: Date[]; // Dates extracted from content
  temporal_checks: TemporalCheck[];
  overall_status: 'PASS' | 'FAIL' | 'WARNING';
  temporal_score: number; // 0-100
}

export interface TemporalVerificationReport {
  verification_id: string;
  total_records: number;
  records_passed: number;
  records_failed: number;
  records_warning: number;
  
  evidence: TemporalEvidence[];
  
  critical_failures: TemporalCheck[];
  warnings: TemporalCheck[];
  
  earliest_date: Date;
  latest_date: Date;
  timeline_span_days: number;
  
  accuracy: number; // 0-100
  
  timestamp: Date;
  duration_ms: number;
}

export class TemporalVerificationEngine {
  
  private now: Date;
  private maxAgeYears: number;
  private futureToleranceSeconds: number;
  
  constructor(maxAgeYears: number = 10, futureToleranceSeconds: number = 300) {
    this.now = new Date();
    this.maxAgeYears = maxAgeYears;
    this.futureToleranceSeconds = futureToleranceSeconds; // Allow 5min clock drift
  }
  
  /**
   * Perform temporal verification on evidence records
   */
  async verify(records: SearchRecord[]): Promise<TemporalVerificationReport> {
    
    const verificationId = `TEMPORAL-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const startTime = Date.now();
    
    console.log(`\n🕐 TEMPORAL VERIFICATION ENGINE - V6 LAYER`);
    console.log(`📋 Verification ID: ${verificationId}`);
    console.log(`📄 Records to verify: ${records.length}`);
    console.log(`⏰ Current time: ${this.now.toISOString()}\n`);
    
    const evidence: TemporalEvidence[] = [];
    const criticalFailures: TemporalCheck[] = [];
    const warnings: TemporalCheck[] = [];
    
    let earliestDate = this.now;
    let latestDate = new Date(0);
    
    // Verify each record
    for (const record of records) {
      const temporalEvidence = await this.verifyRecord(record);
      evidence.push(temporalEvidence);
      
      // Track earliest/latest dates
      if (record.metadata.created_date && record.metadata.created_date < earliestDate) {
        earliestDate = record.metadata.created_date;
      }
      if (record.metadata.modified_date && record.metadata.modified_date > latestDate) {
        latestDate = record.metadata.modified_date;
      }
      
      // Collect failures and warnings
      for (const check of temporalEvidence.temporal_checks) {
        if (!check.passed) {
          if (check.severity === 'critical') {
            criticalFailures.push(check);
          } else {
            warnings.push(check);
          }
        }
      }
    }
    
    const passed = evidence.filter(e => e.overall_status === 'PASS').length;
    const failed = evidence.filter(e => e.overall_status === 'FAIL').length;
    const warning = evidence.filter(e => e.overall_status === 'WARNING').length;
    
    const timelineSpanDays = Math.floor((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate accuracy
    const accuracy = this.calculateAccuracy(evidence);
    
    const report: TemporalVerificationReport = {
      verification_id: verificationId,
      total_records: records.length,
      records_passed: passed,
      records_failed: failed,
      records_warning: warning,
      evidence,
      critical_failures: criticalFailures,
      warnings,
      earliest_date: earliestDate,
      latest_date: latestDate,
      timeline_span_days: timelineSpanDays,
      accuracy,
      timestamp: new Date(),
      duration_ms: Date.now() - startTime
    };
    
    console.log(`\n✅ TEMPORAL VERIFICATION COMPLETE`);
    console.log(`📊 Passed: ${passed}/${records.length}`);
    console.log(`❌ Failed: ${failed} (critical issues)`);
    console.log(`⚠️  Warnings: ${warning}`);
    console.log(`📅 Timeline: ${earliestDate.toISOString().split('T')[0]} to ${latestDate.toISOString().split('T')[0]} (${timelineSpanDays} days)`);
    console.log(`🎯 Temporal accuracy: ${accuracy.toFixed(1)}%`);
    console.log(`⏱️  Duration: ${report.duration_ms}ms\n`);
    
    return report;
  }
  
  /**
   * Verify temporal consistency of a single record
   */
  private async verifyRecord(record: SearchRecord): Promise<TemporalEvidence> {
    const checks: TemporalCheck[] = [];
    
    // Check 1: Future date detection (CRITICAL)
    if (record.metadata.created_date) {
      const futureThreshold = new Date(this.now.getTime() + this.futureToleranceSeconds * 1000);
      const isFuture = record.metadata.created_date > futureThreshold;
      
      checks.push({
        check_name: 'Future Date Detection',
        passed: !isFuture,
        severity: 'critical',
        timestamp_checked: record.metadata.created_date,
        expected_range: { min: new Date(0), max: futureThreshold },
        actual_value: record.metadata.created_date,
        details: isFuture 
          ? `❌ Evidence dated in the future: ${record.metadata.created_date.toISOString()} (now: ${this.now.toISOString()})`
          : `✅ Creation date is valid (not in future)`
      });
    }
    
    // Check 2: Chronological consistency (creation before modification)
    if (record.metadata.created_date && record.metadata.modified_date) {
      const chronologicallyValid = record.metadata.created_date <= record.metadata.modified_date;
      
      checks.push({
        check_name: 'Chronological Consistency',
        passed: chronologicallyValid,
        severity: 'critical',
        timestamp_checked: record.metadata.created_date,
        actual_value: record.metadata.modified_date,
        details: chronologicallyValid
          ? `✅ Created (${record.metadata.created_date.toISOString()}) before modified (${record.metadata.modified_date.toISOString()})`
          : `❌ Temporal paradox: Modified date precedes creation date`
      });
    }
    
    // Check 3: Reasonable age (not too old)
    if (record.metadata.created_date) {
      const ageYears = (this.now.getTime() - record.metadata.created_date.getTime()) / (1000 * 60 * 60 * 24 * 365);
      const reasonableAge = ageYears <= this.maxAgeYears;
      
      checks.push({
        check_name: 'Evidence Age Reasonableness',
        passed: reasonableAge,
        severity: ageYears > 20 ? 'high' : 'medium',
        timestamp_checked: record.metadata.created_date,
        expected_range: { 
          min: new Date(this.now.getTime() - this.maxAgeYears * 365 * 24 * 60 * 60 * 1000), 
          max: this.now 
        },
        actual_value: record.metadata.created_date,
        details: reasonableAge
          ? `✅ Evidence age: ${ageYears.toFixed(1)} years (within ${this.maxAgeYears} year threshold)`
          : `⚠️ Evidence may be too old: ${ageYears.toFixed(1)} years`
      });
    }
    
    // Check 4: Metadata completeness
    const hasCreatedDate = !!record.metadata.created_date;
    const hasModifiedDate = !!record.metadata.modified_date;
    const metadataComplete = hasCreatedDate && hasModifiedDate;
    
    checks.push({
      check_name: 'Temporal Metadata Completeness',
      passed: metadataComplete,
      severity: 'low',
      timestamp_checked: this.now,
      details: metadataComplete
        ? `✅ Complete temporal metadata (created & modified dates present)`
        : `⚠️ Incomplete metadata: ${hasCreatedDate ? '' : 'created date missing'} ${hasModifiedDate ? '' : 'modified date missing'}`
    });
    
    // Check 5: Modified date not in future
    if (record.metadata.modified_date) {
      const futureThreshold = new Date(this.now.getTime() + this.futureToleranceSeconds * 1000);
      const isFuture = record.metadata.modified_date > futureThreshold;
      
      checks.push({
        check_name: 'Modified Date Validation',
        passed: !isFuture,
        severity: 'high',
        timestamp_checked: record.metadata.modified_date,
        expected_range: { min: new Date(0), max: futureThreshold },
        actual_value: record.metadata.modified_date,
        details: isFuture
          ? `❌ Modified date in future: ${record.metadata.modified_date.toISOString()}`
          : `✅ Modified date is valid`
      });
    }
    
    // Extract dates from content
    const contentDates = this.extractDatesFromContent(record.content);
    
    // Check 6: Content dates consistency
    if (contentDates.length > 0 && record.metadata.created_date) {
      const allDatesBeforeCreation = contentDates.every(d => d <= record.metadata.created_date!);
      
      checks.push({
        check_name: 'Content Date Consistency',
        passed: allDatesBeforeCreation,
        severity: 'medium',
        timestamp_checked: this.now,
        details: allDatesBeforeCreation
          ? `✅ All content dates (${contentDates.length}) precede or match file creation`
          : `⚠️ Some content dates are after file creation (possible backdating)`
      });
    }
    
    // Calculate overall status
    const criticalFailed = checks.filter(c => !c.passed && c.severity === 'critical').length;
    const highFailed = checks.filter(c => !c.passed && c.severity === 'high').length;
    
    const overallStatus: TemporalEvidence['overall_status'] = 
      criticalFailed > 0 ? 'FAIL' :
      highFailed > 0 ? 'WARNING' :
      'PASS';
    
    // Calculate temporal score
    const temporalScore = (checks.filter(c => c.passed).length / checks.length) * 100;
    
    return {
      record_id: record.record_id,
      file_path: record.metadata.file_path,
      created_date: record.metadata.created_date,
      modified_date: record.metadata.modified_date,
      accessed_date: undefined,
      metadata_date: undefined,
      content_dates: contentDates,
      temporal_checks: checks,
      overall_status: overallStatus,
      temporal_score
    };
  }
  
  /**
   * Extract dates from content text
   */
  private extractDatesFromContent(content: string): Date[] {
    const dates: Date[] = [];
    
    // Match ISO 8601 dates (YYYY-MM-DD)
    const isoPattern = /\b(20\d{2})-([01]\d)-([0-3]\d)\b/g;
    let match;
    
    while ((match = isoPattern.exec(content)) !== null) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      } catch (e) {
        // Ignore invalid dates
      }
    }
    
    // Match DD/MM/YYYY or MM/DD/YYYY
    const slashPattern = /\b([0-3]\d)\/([01]\d)\/(20\d{2})\b/g;
    
    while ((match = slashPattern.exec(content)) !== null) {
      try {
        const date = new Date(`${match[3]}-${match[2]}-${match[1]}`);
        if (!isNaN(date.getTime())) {
          dates.push(date);
        }
      } catch (e) {
        // Ignore invalid dates
      }
    }
    
    return dates;
  }
  
  /**
   * Calculate verification accuracy
   */
  private calculateAccuracy(evidence: TemporalEvidence[]): number {
    if (evidence.length === 0) return 0;
    
    // Accuracy factors:
    // 1. Pass rate (60%) - percentage of records that passed all checks
    // 2. Critical check success (30%) - no critical failures
    // 3. Metadata completeness (10%) - all records have temporal metadata
    
    const passRate = evidence.filter(e => e.overall_status === 'PASS').length / evidence.length * 100;
    
    const criticalChecksTotal = evidence.reduce((sum, e) => 
      sum + e.temporal_checks.filter(c => c.severity === 'critical').length, 0);
    const criticalChecksPassed = evidence.reduce((sum, e) => 
      sum + e.temporal_checks.filter(c => c.severity === 'critical' && c.passed).length, 0);
    const criticalSuccessRate = criticalChecksTotal > 0 
      ? (criticalChecksPassed / criticalChecksTotal) * 100 
      : 100;
    
    const metadataCompleteRate = evidence.filter(e => 
      e.created_date && e.modified_date).length / evidence.length * 100;
    
    const accuracy = (passRate * 0.6) + (criticalSuccessRate * 0.3) + (metadataCompleteRate * 0.1);
    
    return Math.min(100, accuracy);
  }
}

export default TemporalVerificationEngine;
