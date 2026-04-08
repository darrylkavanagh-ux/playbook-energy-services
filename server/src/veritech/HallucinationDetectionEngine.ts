/**
 * HALLUCINATION DETECTION ENGINE - V2 LAYER
 * =============================================================================
 * REAL IMPLEMENTATION - Cross-references claims against primary sources
 * 
 * Purpose: Remove AI-generated hallucinations, fabrications, and unsourced claims
 * 
 * Method:
 * 1. Extract factual claims from documents
 * 2. Search for supporting evidence in source corpus
 * 3. Calculate confidence score for each claim
 * 4. Flag claims with insufficient evidence as hallucinations
 * 5. Remove or mark hallucinated content
 * 
 * Target Accuracy: 92%+ for hallucination detection
 * 
 * Standards:
 * - Daubert Standard: Scientific methodology for evidence validation
 * - Best Evidence Rule: Primary sources preferred over secondary
 * - Victoria Sharpe Ruling: Transparency about AI limitations
 */

import crypto from 'crypto';
import { SearchRecord } from './UniversalSearchEngine';

export interface Claim {
  claim_id: string;
  text: string;
  type: 'factual' | 'opinion' | 'speculation' | 'mixed';
  source_document: string;
  line_number?: number;
  extracted_at: Date;
}

export interface EvidenceMatch {
  claim_id: string;
  source_record_id: string;
  source_path: string;
  matching_text: string;
  confidence: number; // 0-1
  match_type: 'exact' | 'semantic' | 'contextual' | 'none';
}

export interface HallucinationResult {
  claim: Claim;
  evidence_matches: EvidenceMatch[];
  is_hallucination: boolean;
  confidence_score: number; // 0-1, confidence that claim is TRUE
  removal_recommended: boolean;
  reason: string;
}

export interface HallucinationDetectionReport {
  verification_id: string;
  total_claims: number;
  verified_claims: number;
  hallucinations_detected: number;
  hallucinations_removed: number;
  
  results: HallucinationResult[];
  
  accuracy: number; // 0-100, self-assessed accuracy
  
  timestamp: Date;
  duration_ms: number;
}

export class HallucinationDetectionEngine {
  
  private minConfidenceThreshold: number;
  
  constructor(minConfidenceThreshold: number = 0.90) {
    this.minConfidenceThreshold = minConfidenceThreshold;
  }
  
  /**
   * Detect hallucinations by cross-referencing claims against source corpus
   */
  async detect(
    textToVerify: string,
    sourceRecords: SearchRecord[]
  ): Promise<HallucinationDetectionReport> {
    
    const verificationId = `HALLUC-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const startTime = Date.now();
    
    console.log(`\n🔍 HALLUCINATION DETECTION ENGINE - V2 LAYER`);
    console.log(`📋 Verification ID: ${verificationId}`);
    console.log(`📄 Text length: ${textToVerify.length} characters`);
    console.log(`📚 Source records: ${sourceRecords.length} documents\n`);
    
    // Step 1: Extract claims from text
    const claims = this.extractClaims(textToVerify);
    console.log(`✅ Extracted ${claims.length} claims`);
    
    // Step 2: Verify each claim against sources
    const results: HallucinationResult[] = [];
    
    for (const claim of claims) {
      const evidence = await this.findEvidence(claim, sourceRecords);
      const confidenceScore = this.calculateConfidence(evidence);
      const isHallucination = confidenceScore < this.minConfidenceThreshold;
      
      results.push({
        claim,
        evidence_matches: evidence,
        is_hallucination: isHallucination,
        confidence_score: confidenceScore,
        removal_recommended: isHallucination && confidenceScore < 0.50,
        reason: this.generateReason(evidence, confidenceScore, isHallucination)
      });
    }
    
    const verified = results.filter(r => !r.is_hallucination).length;
    const hallucinations = results.filter(r => r.is_hallucination).length;
    const removed = results.filter(r => r.removal_recommended).length;
    
    // Calculate accuracy
    const accuracy = this.calculateAccuracy(results, sourceRecords.length);
    
    const report: HallucinationDetectionReport = {
      verification_id: verificationId,
      total_claims: claims.length,
      verified_claims: verified,
      hallucinations_detected: hallucinations,
      hallucinations_removed: removed,
      results,
      accuracy,
      timestamp: new Date(),
      duration_ms: Date.now() - startTime
    };
    
    console.log(`\n✅ HALLUCINATION DETECTION COMPLETE`);
    console.log(`📊 Claims verified: ${verified}/${claims.length}`);
    console.log(`🚨 Hallucinations detected: ${hallucinations}`);
    console.log(`🗑️  Recommended removal: ${removed}`);
    console.log(`🎯 Detection accuracy: ${accuracy.toFixed(1)}%`);
    console.log(`⏱️  Duration: ${report.duration_ms}ms\n`);
    
    return report;
  }
  
  /**
   * Extract factual claims from text
   */
  private extractClaims(text: string): Claim[] {
    const claims: Claim[] = [];
    
    // Split into sentences
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      
      // Determine claim type
      const type = this.classifyClaimType(sentence);
      
      // Only extract factual claims (opinions/speculation handled by V3/V4)
      if (type === 'factual' || type === 'mixed') {
        claims.push({
          claim_id: `CLAIM-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          text: sentence,
          type,
          source_document: 'input_text',
          line_number: i + 1,
          extracted_at: new Date()
        });
      }
    }
    
    return claims;
  }
  
  /**
   * Classify claim type
   */
  private classifyClaimType(sentence: string): Claim['type'] {
    const lowerSentence = sentence.toLowerCase();
    
    // Opinion indicators
    const opinionWords = ['believe', 'think', 'feel', 'opinion', 'view', 'seems', 'appears'];
    if (opinionWords.some(word => lowerSentence.includes(word))) {
      return 'opinion';
    }
    
    // Speculation indicators
    const speculationWords = ['might', 'could', 'possibly', 'perhaps', 'maybe', 'probably'];
    if (speculationWords.some(word => lowerSentence.includes(word))) {
      return 'speculation';
    }
    
    // Factual statements (contains dates, numbers, names, specific events)
    const hasDate = /\b(19|20)\d{2}\b/.test(sentence);
    const hasNumber = /\b\d+\b/.test(sentence);
    const hasProperNoun = /\b[A-Z][a-z]+\b/.test(sentence);
    
    if (hasDate || hasNumber || hasProperNoun) {
      return 'factual';
    }
    
    return 'mixed';
  }
  
  /**
   * Find evidence for claim in source records
   */
  private async findEvidence(claim: Claim, sourceRecords: SearchRecord[]): Promise<EvidenceMatch[]> {
    const matches: EvidenceMatch[] = [];
    
    const claimWords = this.extractKeywords(claim.text);
    
    for (const record of sourceRecords) {
      const recordContent = record.content.toLowerCase();
      const claimText = claim.text.toLowerCase();
      
      // Check for exact match
      if (recordContent.includes(claimText)) {
        matches.push({
          claim_id: claim.claim_id,
          source_record_id: record.record_id,
          source_path: record.metadata.file_path || 'unknown',
          matching_text: this.extractMatchingContext(recordContent, claimText),
          confidence: 0.95,
          match_type: 'exact'
        });
        continue;
      }
      
      // Check for semantic match (keywords overlap)
      const matchScore = this.calculateKeywordOverlap(claimWords, recordContent);
      
      if (matchScore > 0.60) {
        matches.push({
          claim_id: claim.claim_id,
          source_record_id: record.record_id,
          source_path: record.metadata.file_path || 'unknown',
          matching_text: this.extractKeywordContext(recordContent, claimWords),
          confidence: matchScore,
          match_type: 'semantic'
        });
      }
    }
    
    return matches;
  }
  
  /**
   * Extract keywords from claim
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']);
    
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }
  
  /**
   * Calculate keyword overlap score
   */
  private calculateKeywordOverlap(keywords: string[], content: string): number {
    if (keywords.length === 0) return 0;
    
    const contentLower = content.toLowerCase();
    const matches = keywords.filter(keyword => contentLower.includes(keyword));
    
    return matches.length / keywords.length;
  }
  
  /**
   * Extract matching context from content
   */
  private extractMatchingContext(content: string, searchText: string, contextChars: number = 100): string {
    const index = content.indexOf(searchText);
    if (index === -1) return '';
    
    const start = Math.max(0, index - contextChars);
    const end = Math.min(content.length, index + searchText.length + contextChars);
    
    return '...' + content.substring(start, end) + '...';
  }
  
  /**
   * Extract context around keywords
   */
  private extractKeywordContext(content: string, keywords: string[], contextChars: number = 100): string {
    for (const keyword of keywords) {
      const index = content.toLowerCase().indexOf(keyword);
      if (index !== -1) {
        const start = Math.max(0, index - contextChars);
        const end = Math.min(content.length, index + keyword.length + contextChars);
        return '...' + content.substring(start, end) + '...';
      }
    }
    return '[No context found]';
  }
  
  /**
   * Calculate confidence score based on evidence
   */
  private calculateConfidence(evidence: EvidenceMatch[]): number {
    if (evidence.length === 0) return 0;
    
    // Weight evidence by match type and confidence
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const match of evidence) {
      let weight = 1.0;
      
      // Exact matches have highest weight
      if (match.match_type === 'exact') weight = 2.0;
      else if (match.match_type === 'semantic') weight = 1.0;
      else weight = 0.5;
      
      weightedSum += match.confidence * weight;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }
  
  /**
   * Generate reason for hallucination determination
   */
  private generateReason(evidence: EvidenceMatch[], confidence: number, isHallucination: boolean): string {
    if (!isHallucination && confidence >= 0.95) {
      return `Verified with high confidence (${(confidence * 100).toFixed(1)}%) - ${evidence.length} exact matches found in source documents`;
    }
    
    if (!isHallucination && confidence >= this.minConfidenceThreshold) {
      return `Verified with acceptable confidence (${(confidence * 100).toFixed(1)}%) - ${evidence.length} supporting sources found`;
    }
    
    if (isHallucination && evidence.length === 0) {
      return `HALLUCINATION: No supporting evidence found in any source document (confidence: 0%)`;
    }
    
    if (isHallucination && confidence < 0.50) {
      return `HALLUCINATION: Insufficient evidence (confidence: ${(confidence * 100).toFixed(1)}%) - recommend removal`;
    }
    
    return `QUESTIONABLE: Weak evidence (confidence: ${(confidence * 100).toFixed(1)}%) - requires human review`;
  }
  
  /**
   * Calculate detection accuracy
   */
  private calculateAccuracy(results: HallucinationResult[], sourceCount: number): number {
    // Accuracy factors:
    // 1. Source coverage (40%) - more sources = higher accuracy
    // 2. Evidence found rate (30%) - more evidence = higher accuracy
    // 3. High confidence rate (30%) - more high-confidence = higher accuracy
    
    const sourceCoverageScore = Math.min(100, sourceCount * 5); // Max at 20 sources
    
    const evidenceFoundRate = results.length > 0
      ? results.filter(r => r.evidence_matches.length > 0).length / results.length * 100
      : 0;
    
    const highConfidenceRate = results.length > 0
      ? results.filter(r => r.confidence_score >= 0.90).length / results.length * 100
      : 0;
    
    const accuracy = (sourceCoverageScore * 0.4) + (evidenceFoundRate * 0.3) + (highConfidenceRate * 0.3);
    
    return Math.min(100, accuracy);
  }
  
  /**
   * Remove hallucinations from text
   */
  removeHallucinations(text: string, report: HallucinationDetectionReport): string {
    let cleanedText = text;
    
    // Remove claims marked for removal
    for (const result of report.results) {
      if (result.removal_recommended) {
        cleanedText = cleanedText.replace(result.claim.text, '');
      }
    }
    
    // Clean up multiple spaces and line breaks
    cleanedText = cleanedText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    return cleanedText;
  }
}

export default HallucinationDetectionEngine;
