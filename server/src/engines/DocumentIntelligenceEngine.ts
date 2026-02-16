/**
 * DOCUMENT INTELLIGENCE ENGINE
 * =============================================================================
 * Natural Language Processing & Document Analysis
 * 
 * Modeled after: FBI Document Analysis Unit, GCHQ Language Analysis, NSA NLP
 * Implements: Entity extraction, Sentiment analysis, Key phrase extraction, Document classification
 */

export interface DocumentAnalysis {
  analysis_id: string;
  document_id: string;
  document_title: string;
  
  // Content analysis
  full_text: string;
  word_count: number;
  page_count: number;
  language: string;
  
  // Entity extraction
  entities: ExtractedEntity[];
  persons: string[];
  organizations: string[];
  locations: string[];
  dates: Date[];
  amounts: MoneyAmount[];
  
  // Relationships
  relationships: EntityRelationship[];
  
  // Key content
  key_phrases: KeyPhrase[];
  summary: string;
  topics: Topic[];
  
  // Sentiment
  overall_sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentiment_score: number;
  emotional_tone: string[];
  
  // Classification
  document_type: string;
  confidence: number;
  categories: string[];
  
  // Forensic indicators
  deception_indicators: DeceptionIndicator[];
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  legal_relevance: string;
  
  // Metadata
  author?: string;
  creation_date?: Date;
  last_modified?: Date;
  metadata: any;
  
  analysis_timestamp: Date;
}

export interface ExtractedEntity {
  entity_id: string;
  entity_type: 'PERSON' | 'ORG' | 'LOCATION' | 'DATE' | 'MONEY' | 'EMAIL' | 'PHONE' | 'ACCOUNT' | 'PROPERTY';
  text: string;
  confidence: number;
  start_position: number;
  end_position: number;
  context: string;
  mentions: number;
}

export interface EntityRelationship {
  subject: string;
  relationship: string;
  object: string;
  confidence: number;
  evidence: string;
}

export interface KeyPhrase {
  phrase: string;
  relevance_score: number;
  frequency: number;
  first_occurrence: number;
}

export interface Topic {
  topic_name: string;
  keywords: string[];
  confidence: number;
}

export interface MoneyAmount {
  amount: number;
  currency: string;
  context: string;
  position: number;
}

export interface DeceptionIndicator {
  indicator_type: string;
  description: string;
  evidence: string;
  confidence: number;
}

export interface EmailThread {
  thread_id: string;
  subject: string;
  participants: EmailParticipant[];
  emails: Email[];
  
  // Thread analysis
  total_messages: number;
  date_range: { start: Date; end: Date };
  thread_duration_days: number;
  
  // Content analysis
  key_topics: string[];
  sentiment_evolution: SentimentPoint[];
  participant_dynamics: ParticipantDynamic[];
  
  // Forensic
  red_flags: string[];
  legal_relevance: string;
  evidence_value: 'high' | 'medium' | 'low';
}

export interface EmailParticipant {
  email_address: string;
  name?: string;
  role: 'sender' | 'recipient' | 'cc' | 'bcc';
  message_count: number;
  first_participation: Date;
  last_participation: Date;
}

export interface Email {
  email_id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  
  timestamp: Date;
  
  // Analysis
  sentiment: string;
  key_points: string[];
  mentions: string[];
  
  // Metadata
  headers: any;
  attachments: string[];
}

export interface SentimentPoint {
  timestamp: Date;
  sentiment: number;
  email_id: string;
}

export interface ParticipantDynamic {
  participant: string;
  dominance_score: number;
  avg_sentiment: number;
  response_time_hours: number;
}

export class DocumentIntelligenceEngine {
  
  /**
   * Analyze document content
   */
  async analyzeDocument(documentId: string, fullText: string, metadata: any = {}): Promise<DocumentAnalysis> {
    
    const analysisId = `DOC-ANALYSIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Detect language
    const language = this.detectLanguage(fullText);
    
    // Extract entities
    const entities = this.extractEntities(fullText);
    
    // Extract specific entity types
    const persons = entities.filter(e => e.entity_type === 'PERSON').map(e => e.text);
    const organizations = entities.filter(e => e.entity_type === 'ORG').map(e => e.text);
    const locations = entities.filter(e => e.entity_type === 'LOCATION').map(e => e.text);
    const dates = this.extractDates(fullText);
    const amounts = this.extractMoneyAmounts(fullText);
    
    // Extract relationships
    const relationships = this.extractRelationships(fullText, entities);
    
    // Extract key phrases
    const keyPhrases = this.extractKeyPhrases(fullText);
    
    // Generate summary
    const summary = this.generateSummary(fullText, keyPhrases);
    
    // Detect topics
    const topics = this.detectTopics(fullText, keyPhrases);
    
    // Sentiment analysis
    const sentiment = this.analyzeSentiment(fullText);
    
    // Classify document
    const classification = this.classifyDocument(fullText, entities);
    
    // Detect deception indicators
    const deceptionIndicators = this.detectDeception(fullText);
    
    // Assess urgency
    const urgencyLevel = this.assessUrgency(fullText, keyPhrases);
    
    // Assess legal relevance
    const legalRelevance = this.assessLegalRelevance(fullText, entities);
    
    return {
      analysis_id: analysisId,
      document_id: documentId,
      document_title: metadata.title || 'Untitled Document',
      full_text: fullText,
      word_count: fullText.split(/\s+/).length,
      page_count: Math.ceil(fullText.length / 3000),
      language,
      entities,
      persons: [...new Set(persons)],
      organizations: [...new Set(organizations)],
      locations: [...new Set(locations)],
      dates,
      amounts,
      relationships,
      key_phrases: keyPhrases,
      summary,
      topics,
      overall_sentiment: sentiment.overall,
      sentiment_score: sentiment.score,
      emotional_tone: sentiment.emotions,
      document_type: classification.type,
      confidence: classification.confidence,
      categories: classification.categories,
      deception_indicators: deceptionIndicators,
      urgency_level: urgencyLevel,
      legal_relevance: legalRelevance,
      author: metadata.author,
      creation_date: metadata.creation_date,
      last_modified: metadata.last_modified,
      metadata,
      analysis_timestamp: new Date()
    };
  }
  
  private detectLanguage(text: string): string {
    // Simple language detection
    const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a'];
    const irishWords = ['agus', 'an', 'is', 'ar', 'le'];
    
    const lowerText = text.toLowerCase();
    const englishCount = englishWords.filter(w => lowerText.includes(w)).length;
    const irishCount = irishWords.filter(w => lowerText.includes(w)).length;
    
    return englishCount > irishCount ? 'en' : 'ga';
  }
  
  /**
   * Named Entity Recognition
   */
  private extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        entity_id: `ENT-${entities.length + 1}`,
        entity_type: 'EMAIL',
        text: match[0],
        confidence: 1.0,
        start_position: match.index,
        end_position: match.index + match[0].length,
        context: text.substring(Math.max(0, match.index - 50), Math.min(text.length, match.index + match[0].length + 50)),
        mentions: 1
      });
    }
    
    // Extract phone numbers
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    while ((match = phoneRegex.exec(text)) !== null) {
      entities.push({
        entity_id: `ENT-${entities.length + 1}`,
        entity_type: 'PHONE',
        text: match[0],
        confidence: 0.9,
        start_position: match.index,
        end_position: match.index + match[0].length,
        context: text.substring(Math.max(0, match.index - 50), Math.min(text.length, match.index + match[0].length + 50)),
        mentions: 1
      });
    }
    
    // Extract property references (Irish format)
    const propertyRegex = /Folio\s+\w+|\bregistry\s+\d+|property\s+at\s+[\w\s,]+/gi;
    while ((match = propertyRegex.exec(text)) !== null) {
      entities.push({
        entity_id: `ENT-${entities.length + 1}`,
        entity_type: 'PROPERTY',
        text: match[0],
        confidence: 0.85,
        start_position: match.index,
        end_position: match.index + match[0].length,
        context: text.substring(Math.max(0, match.index - 50), Math.min(text.length, match.index + match[0].length + 50)),
        mentions: 1
      });
    }
    
    // In production, use proper NLP library (spaCy, Stanford NER, etc.)
    
    return entities;
  }
  
  private extractDates(text: string): Date[] {
    const dates: Date[] = [];
    
    // Simple date extraction
    const dateRegex = /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g;
    let match;
    
    while ((match = dateRegex.exec(text)) !== null) {
      const day = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const year = parseInt(match[3]);
      
      dates.push(new Date(year, month, day));
    }
    
    return dates;
  }
  
  private extractMoneyAmounts(text: string): MoneyAmount[] {
    const amounts: MoneyAmount[] = [];
    
    // Extract money amounts
    const moneyRegex = /[€£$]\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)|(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s?[€£$]/g;
    let match;
    
    while ((match = moneyRegex.exec(text)) !== null) {
      const amountStr = match[1] || match[2];
      const amount = parseFloat(amountStr.replace(/,/g, ''));
      const currency = match[0].includes('€') ? 'EUR' : match[0].includes('£') ? 'GBP' : 'USD';
      
      amounts.push({
        amount,
        currency,
        context: text.substring(Math.max(0, match.index - 100), Math.min(text.length, match.index + 100)),
        position: match.index
      });
    }
    
    return amounts;
  }
  
  private extractRelationships(text: string, entities: ExtractedEntity[]): EntityRelationship[] {
    const relationships: EntityRelationship[] = [];
    
    // Simple relationship extraction
    const relationshipPatterns = [
      { pattern: /(\w+)\s+owns\s+(\w+)/gi, relationship: 'OWNS' },
      { pattern: /(\w+)\s+controls\s+(\w+)/gi, relationship: 'CONTROLS' },
      { pattern: /(\w+)\s+is\s+director\s+of\s+(\w+)/gi, relationship: 'DIRECTOR_OF' },
      { pattern: /(\w+)\s+employed\s+by\s+(\w+)/gi, relationship: 'EMPLOYED_BY' }
    ];
    
    for (const { pattern, relationship } of relationshipPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        relationships.push({
          subject: match[1],
          relationship,
          object: match[2],
          confidence: 0.7,
          evidence: match[0]
        });
      }
    }
    
    return relationships;
  }
  
  private extractKeyPhrases(text: string): KeyPhrase[] {
    // TF-IDF based key phrase extraction
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();
    
    for (const word of words) {
      if (word.length > 3) {  // Ignore short words
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }
    
    // Convert to key phrases
    const phrases: KeyPhrase[] = [];
    for (const [word, freq] of wordFreq.entries()) {
      if (freq > 2) {  // Must appear at least 3 times
        phrases.push({
          phrase: word,
          relevance_score: freq / words.length,
          frequency: freq,
          first_occurrence: text.toLowerCase().indexOf(word)
        });
      }
    }
    
    phrases.sort((a, b) => b.relevance_score - a.relevance_score);
    return phrases.slice(0, 20);
  }
  
  private generateSummary(text: string, keyPhrases: KeyPhrase[]): string {
    // Extract first 3 sentences
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
    return sentences.slice(0, 3).join(' ');
  }
  
  private detectTopics(text: string, keyPhrases: KeyPhrase[]): Topic[] {
    const topics: Topic[] = [];
    
    // Legal/financial topic detection
    const financialKeywords = ['money', 'payment', 'account', 'transfer', 'transaction', 'fund'];
    const propertyKeywords = ['property', 'real estate', 'land', 'building', 'purchase', 'sale'];
    const legalKeywords = ['contract', 'agreement', 'legal', 'court', 'solicitor', 'lawyer'];
    
    const lowerText = text.toLowerCase();
    
    if (financialKeywords.some(kw => lowerText.includes(kw))) {
      topics.push({
        topic_name: 'Financial Transactions',
        keywords: financialKeywords.filter(kw => lowerText.includes(kw)),
        confidence: 0.85
      });
    }
    
    if (propertyKeywords.some(kw => lowerText.includes(kw))) {
      topics.push({
        topic_name: 'Property/Real Estate',
        keywords: propertyKeywords.filter(kw => lowerText.includes(kw)),
        confidence: 0.80
      });
    }
    
    if (legalKeywords.some(kw => lowerText.includes(kw))) {
      topics.push({
        topic_name: 'Legal Matters',
        keywords: legalKeywords.filter(kw => lowerText.includes(kw)),
        confidence: 0.75
      });
    }
    
    return topics;
  }
  
  private analyzeSentiment(text: string): any {
    // Simple sentiment analysis
    const positiveWords = ['good', 'excellent', 'pleased', 'happy', 'positive', 'success'];
    const negativeWords = ['bad', 'poor', 'unhappy', 'negative', 'failure', 'problem', 'issue', 'concern'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
    const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
    
    const score = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
    
    let overall: 'positive' | 'negative' | 'neutral' | 'mixed';
    if (score > 0.2) overall = 'positive';
    else if (score < -0.2) overall = 'negative';
    else if (positiveCount > 0 && negativeCount > 0) overall = 'mixed';
    else overall = 'neutral';
    
    return {
      overall,
      score,
      emotions: score > 0 ? ['optimistic'] : score < 0 ? ['concerned'] : ['neutral']
    };
  }
  
  private classifyDocument(text: string, entities: ExtractedEntity[]): any {
    // Document classification
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('email') || entities.some(e => e.entity_type === 'EMAIL')) {
      return { type: 'EMAIL', confidence: 0.9, categories: ['Communication'] };
    }
    
    if (lowerText.includes('contract') || lowerText.includes('agreement')) {
      return { type: 'CONTRACT', confidence: 0.85, categories: ['Legal', 'Contract'] };
    }
    
    if (lowerText.includes('invoice') || lowerText.includes('payment')) {
      return { type: 'FINANCIAL', confidence: 0.8, categories: ['Financial', 'Transaction'] };
    }
    
    return { type: 'GENERAL', confidence: 0.5, categories: ['General'] };
  }
  
  private detectDeception(text: string): DeceptionIndicator[] {
    const indicators: DeceptionIndicator[] = [];
    
    // Linguistic indicators of deception
    const hedgingPhrases = ['to be honest', 'to tell the truth', 'believe me', 'trust me'];
    const distancingLanguage = ['that person', 'those people', 'them'];
    
    const lowerText = text.toLowerCase();
    
    for (const phrase of hedgingPhrases) {
      if (lowerText.includes(phrase)) {
        indicators.push({
          indicator_type: 'HEDGING_LANGUAGE',
          description: `Use of hedging phrase: "${phrase}"`,
          evidence: phrase,
          confidence: 0.6
        });
      }
    }
    
    return indicators;
  }
  
  private assessUrgency(text: string, keyPhrases: KeyPhrase[]): 'low' | 'medium' | 'high' | 'critical' {
    const urgentWords = ['urgent', 'immediately', 'asap', 'critical', 'emergency'];
    const lowerText = text.toLowerCase();
    
    const urgencyCount = urgentWords.filter(w => lowerText.includes(w)).length;
    
    if (urgencyCount >= 3) return 'critical';
    if (urgencyCount >= 2) return 'high';
    if (urgencyCount >= 1) return 'medium';
    return 'low';
  }
  
  private assessLegalRelevance(text: string, entities: ExtractedEntity[]): string {
    const hasMoneyAmounts = entities.some(e => e.entity_type === 'MONEY');
    const hasMultipleParties = entities.filter(e => e.entity_type === 'PERSON' || e.entity_type === 'ORG').length >= 2;
    
    if (hasMoneyAmounts && hasMultipleParties) {
      return 'HIGH - Financial transaction involving multiple parties';
    }
    
    return 'MEDIUM - Potential evidentiary value';
  }
}

export default DocumentIntelligenceEngine;
