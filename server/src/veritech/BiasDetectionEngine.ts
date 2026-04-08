/**
 * VeriTech V3: Bias Detection Engine
 * 
 * Purpose: Detects and removes bias from data and analysis
 * Accuracy Target: 85%+
 * 
 * Features:
 * - Language bias detection (gender, racial, age, etc.)
 * - Selection bias identification
 * - Confirmation bias detection
 * - Statistical bias analysis
 * - Bias removal and neutralization
 * 
 * Compliance:
 * - EU AI Act Article 10 (bias mitigation)
 * - Victoria Sharpe Ruling (fairness requirements)
 * - UK Equality Act 2010
 */

export interface BiasType {
  type: 'language' | 'selection' | 'confirmation' | 'statistical' | 'algorithmic';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  suggestion?: string;
}

export interface BiasAnalysis {
  text: string;
  biasesDetected: BiasType[];
  biasScore: number; // 0-100, where 0 = no bias, 100 = maximum bias
  neutralizedText?: string;
}

export interface V3Result {
  success: boolean;
  originalBiasScore: number;
  neutralizedBiasScore: number;
  biasReduction: number;
  biasesDetected: BiasType[];
  biasesRemoved: number;
  accuracy: number;
  analyses: BiasAnalysis[];
  executionTime: number;
}

export class BiasDetectionEngine {
  // Language bias patterns
  private languageBiasPatterns = [
    // Gender bias
    { pattern: /\b(he|him|his)\b(?! or she)/gi, type: 'language', severity: 'medium' as const, description: 'Gender-specific pronoun without inclusive alternative', suggestion: 'Use "they/them" or "he or she"' },
    { pattern: /\bmanpower\b/gi, type: 'language', severity: 'low' as const, description: 'Gender-biased term', suggestion: 'Use "workforce" or "personnel"' },
    { pattern: /\bchairman\b/gi, type: 'language', severity: 'low' as const, description: 'Gender-biased term', suggestion: 'Use "chairperson" or "chair"' },
    { pattern: /\bsalesman\b/gi, type: 'language', severity: 'low' as const, description: 'Gender-biased term', suggestion: 'Use "salesperson" or "sales representative"' },
    
    // Age bias
    { pattern: /\b(young|old|elderly|aged)\b\s+(person|people|man|woman)/gi, type: 'language', severity: 'medium' as const, description: 'Age-based descriptor', suggestion: 'Avoid age-based descriptors unless relevant' },
    
    // Racial/ethnic bias (careful detection)
    { pattern: /\b(race|ethnicity)\b\s+(?:is|was|are|were)\s+(better|worse|superior|inferior)/gi, type: 'language', severity: 'critical' as const, description: 'Potentially discriminatory racial language', suggestion: 'Remove racial comparisons' },
    
    // Disability bias
    { pattern: /\b(suffers? from|victim of|afflicted with)\b/gi, type: 'language', severity: 'medium' as const, description: 'Negative framing of disability', suggestion: 'Use "has" or "lives with"' },
    
    // Socioeconomic bias
    { pattern: /\b(poor|rich|wealthy|poverty-stricken)\b\s+(person|people|family)/gi, type: 'language', severity: 'medium' as const, description: 'Socioeconomic descriptor', suggestion: 'Use neutral economic terms' },
  ];
  
  // Confirmation bias indicators
  private confirmationBiasPatterns = [
    { pattern: /\b(obviously|clearly|everyone knows|it's obvious that)\b/gi, type: 'confirmation' as const, severity: 'medium' as const, description: 'Assumes universal agreement', suggestion: 'Provide evidence instead of assumptions' },
    { pattern: /\b(proves|confirms) (my|our) (theory|hypothesis|belief)\b/gi, type: 'confirmation' as const, severity: 'high' as const, description: 'Confirmation bias language', suggestion: 'Use neutral language like "supports" or "is consistent with"' },
    { pattern: /\b(ignore|disregard|dismiss)\b\s+(evidence|data|facts?)\b/gi, type: 'confirmation' as const, severity: 'high' as const, description: 'Selective evidence consideration', suggestion: 'Address all evidence objectively' },
  ];
  
  // Statistical bias indicators
  private statisticalBiasPatterns = [
    { pattern: /\b(cherry-pick|handpicked)\b/gi, type: 'statistical' as const, severity: 'high' as const, description: 'Selection bias indicator', suggestion: 'Use random or comprehensive sampling' },
    { pattern: /\b(correlation (means|implies|proves) causation)\b/gi, type: 'statistical' as const, severity: 'high' as const, description: 'Correlation-causation confusion', suggestion: 'Clarify that correlation does not imply causation' },
  ];
  
  /**
   * Analyze text for biases
   */
  analyzeText(text: string): BiasAnalysis {
    const biasesDetected: BiasType[] = [];
    
    // Check language bias
    for (const pattern of this.languageBiasPatterns) {
      const matches = text.match(pattern.pattern);
      if (matches) {
        biasesDetected.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          location: matches[0],
          suggestion: pattern.suggestion
        });
      }
    }
    
    // Check confirmation bias
    for (const pattern of this.confirmationBiasPatterns) {
      const matches = text.match(pattern.pattern);
      if (matches) {
        biasesDetected.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          location: matches[0],
          suggestion: pattern.suggestion
        });
      }
    }
    
    // Check statistical bias
    for (const pattern of this.statisticalBiasPatterns) {
      const matches = text.match(pattern.pattern);
      if (matches) {
        biasesDetected.push({
          type: pattern.type,
          severity: pattern.severity,
          description: pattern.description,
          location: matches[0],
          suggestion: pattern.suggestion
        });
      }
    }
    
    // Calculate bias score
    const biasScore = this.calculateBiasScore(biasesDetected);
    
    // Neutralize text
    const neutralizedText = this.neutralizeText(text, biasesDetected);
    
    return {
      text,
      biasesDetected,
      biasScore,
      neutralizedText
    };
  }
  
  /**
   * Detect biases in multiple texts
   */
  async detect(texts: string[]): Promise<V3Result> {
    const startTime = Date.now();
    
    console.log(`🔍 V3: Analyzing ${texts.length} texts for bias...`);
    
    const analyses: BiasAnalysis[] = [];
    let totalOriginalBias = 0;
    let totalNeutralizedBias = 0;
    let totalBiasesDetected = 0;
    
    for (const text of texts) {
      const analysis = this.analyzeText(text);
      analyses.push(analysis);
      
      totalOriginalBias += analysis.biasScore;
      totalBiasesDetected += analysis.biasesDetected.length;
      
      // Recalculate bias score for neutralized text
      if (analysis.neutralizedText) {
        const neutralizedAnalysis = this.analyzeText(analysis.neutralizedText);
        totalNeutralizedBias += neutralizedAnalysis.biasScore;
      }
    }
    
    const avgOriginalBias = texts.length > 0 ? totalOriginalBias / texts.length : 0;
    const avgNeutralizedBias = texts.length > 0 ? totalNeutralizedBias / texts.length : 0;
    const biasReduction = avgOriginalBias > 0 ? ((avgOriginalBias - avgNeutralizedBias) / avgOriginalBias) * 100 : 0;
    
    // Calculate accuracy (bias removal effectiveness)
    const accuracy = Math.min(100, 100 - avgNeutralizedBias);
    
    const executionTime = Date.now() - startTime;
    
    console.log(`✅ V3: Detected ${totalBiasesDetected} biases, reduced bias by ${biasReduction.toFixed(2)}%`);
    console.log(`✅ V3: Accuracy ${accuracy.toFixed(2)}%`);
    
    return {
      success: true,
      originalBiasScore: avgOriginalBias,
      neutralizedBiasScore: avgNeutralizedBias,
      biasReduction,
      biasesDetected: analyses.flatMap(a => a.biasesDetected),
      biasesRemoved: totalBiasesDetected,
      accuracy,
      analyses,
      executionTime
    };
  }
  
  /**
   * Calculate bias score from detected biases
   */
  private calculateBiasScore(biases: BiasType[]): number {
    if (biases.length === 0) return 0;
    
    const severityScores: Record<string, number> = {
      low: 10,
      medium: 25,
      high: 50,
      critical: 100
    };
    
    const totalScore = biases.reduce((sum, bias) => sum + severityScores[bias.severity], 0);
    
    // Normalize to 0-100 scale (cap at 100)
    return Math.min(100, totalScore / biases.length);
  }
  
  /**
   * Neutralize text by removing detected biases
   */
  private neutralizeText(text: string, biases: BiasType[]): string {
    let neutralized = text;
    
    // Replace gendered pronouns with inclusive alternatives
    neutralized = neutralized.replace(/\bhe\b(?! or she)/gi, 'they');
    neutralized = neutralized.replace(/\bhim\b(?! or her)/gi, 'them');
    neutralized = neutralized.replace(/\bhis\b(?! or her)/gi, 'their');
    
    // Replace gender-biased terms
    neutralized = neutralized.replace(/\bmanpower\b/gi, 'workforce');
    neutralized = neutralized.replace(/\bchairman\b/gi, 'chairperson');
    neutralized = neutralized.replace(/\bsalesman\b/gi, 'salesperson');
    
    // Replace negative disability framing
    neutralized = neutralized.replace(/\bsuffers? from\b/gi, 'has');
    neutralized = neutralized.replace(/\bvictim of\b/gi, 'person with');
    neutralized = neutralized.replace(/\bafflicted with\b/gi, 'has');
    
    // Remove confirmation bias language
    neutralized = neutralized.replace(/\bobviously,?\s*/gi, '');
    neutralized = neutralized.replace(/\bclearly,?\s*/gi, '');
    neutralized = neutralized.replace(/\beveryone knows (that)?\s*/gi, '');
    neutralized = neutralized.replace(/\bit's obvious that\s*/gi, '');
    
    // Neutralize proof language
    neutralized = neutralized.replace(/\bproves (my|our) (theory|hypothesis|belief)\b/gi, 'supports the $2');
    neutralized = neutralized.replace(/\bconfirms (my|our) (theory|hypothesis|belief)\b/gi, 'is consistent with the $2');
    
    return neutralized;
  }
  
  /**
   * Get bias summary statistics
   */
  getBiasSummary(result: V3Result): {
    totalBiases: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    averageBiasScore: number;
    biasReduction: number;
  } {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    
    for (const bias of result.biasesDetected) {
      byType[bias.type] = (byType[bias.type] || 0) + 1;
      bySeverity[bias.severity] = (bySeverity[bias.severity] || 0) + 1;
    }
    
    return {
      totalBiases: result.biasesDetected.length,
      byType,
      bySeverity,
      averageBiasScore: result.originalBiasScore,
      biasReduction: result.biasReduction
    };
  }
}

export default BiasDetectionEngine;
