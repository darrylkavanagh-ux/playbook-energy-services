/**
 * EMAIL ANALYSIS ENGINE
 * =============================================================================
 * Thread Reconstruction, Communication Pattern Analysis, Timeline Building
 * 
 * Modeled after: FBI Email Analysis Unit, GCHQ TEMPORA, NSA PRISM
 * Implements: Thread reconstruction, Participant profiling, Timeline analysis
 */

export interface EmailAnalysisResult {
  analysis_id: string;
  total_emails: number;
  date_range: { start: Date; end: Date };
  
  threads: EmailThread[];
  participants: ParticipantProfile[];
  timeline: TimelineEntry[];
  
  // Pattern detection
  communication_patterns: CommunicationPattern[];
  suspicious_indicators: SuspiciousIndicator[];
  
  // Network
  network_map: EmailNetwork[];
  dominant_participants: string[];
  
  // Evidence
  key_emails: KeyEmail[];
  evidence_summary: string;
  
  analysis_timestamp: Date;
}

export interface EmailThread {
  thread_id: string;
  subject: string;
  emails: EmailMessage[];
  participants: string[];
  date_range: { start: Date; end: Date };
  message_count: number;
  legal_relevance: 'high' | 'medium' | 'low';
}

export interface EmailMessage {
  message_id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  timestamp: Date;
  attachments: string[];
  headers: Record<string, string>;
  
  // Analysis
  sentiment: string;
  key_entities: string[];
  money_mentions: number[];
  urgency_level: string;
}

export interface ParticipantProfile {
  email_address: string;
  name?: string;
  total_sent: number;
  total_received: number;
  first_seen: Date;
  last_seen: Date;
  
  // Behavioral patterns
  avg_response_time_hours: number;
  most_active_hours: number[];
  communication_style: string;
  
  // Network position
  centrality_score: number;
  role: 'hub' | 'bridge' | 'peripheral' | 'isolate';
  
  // Risk
  suspicious_behaviors: string[];
  risk_score: number;
}

export interface TimelineEntry {
  timestamp: Date;
  event_type: 'email_sent' | 'email_received' | 'attachment_sent' | 'thread_started';
  from: string;
  to: string[];
  subject: string;
  summary: string;
  significance: 'critical' | 'high' | 'medium' | 'low';
}

export interface CommunicationPattern {
  pattern_type: string;
  description: string;
  occurrences: number;
  participants: string[];
  time_range: { start: Date; end: Date };
  significance: string;
}

export interface SuspiciousIndicator {
  indicator_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  evidence: string[];
  emails_affected: string[];
}

export interface EmailNetwork {
  from: string;
  to: string;
  email_count: number;
  total_attachments: number;
  first_contact: Date;
  last_contact: Date;
  relationship_strength: number;
}

export interface KeyEmail {
  email_id: string;
  subject: string;
  from: string;
  timestamp: Date;
  importance_score: number;
  reason: string;
}

export class EmailAnalysisEngine {
  
  /**
   * Analyze collection of emails
   */
  async analyzeEmails(emails: any[]): Promise<EmailAnalysisResult> {
    
    const analysisId = `EMAIL-ANALYSIS-${Date.now()}`;
    
    // Parse and normalize emails
    const normalizedEmails = this.normalizeEmails(emails);
    
    // Reconstruct threads
    const threads = this.reconstructThreads(normalizedEmails);
    
    // Profile participants
    const participants = this.profileParticipants(normalizedEmails);
    
    // Build timeline
    const timeline = this.buildTimeline(normalizedEmails);
    
    // Detect patterns
    const patterns = this.detectCommunicationPatterns(normalizedEmails, participants);
    
    // Identify suspicious indicators
    const suspiciousIndicators = this.identifySuspiciousIndicators(normalizedEmails);
    
    // Build network map
    const networkMap = this.buildNetworkMap(normalizedEmails);
    
    // Identify dominant participants
    const dominantParticipants = participants
      .sort((a, b) => b.centrality_score - a.centrality_score)
      .slice(0, 5)
      .map(p => p.email_address);
    
    // Identify key emails
    const keyEmails = this.identifyKeyEmails(normalizedEmails, patterns);
    
    // Generate evidence summary
    const evidenceSummary = this.generateEvidenceSummary(threads, patterns, suspiciousIndicators);
    
    const dateRange = this.getDateRange(normalizedEmails);
    
    return {
      analysis_id: analysisId,
      total_emails: normalizedEmails.length,
      date_range: dateRange,
      threads,
      participants,
      timeline,
      communication_patterns: patterns,
      suspicious_indicators: suspiciousIndicators,
      network_map: networkMap,
      dominant_participants: dominantParticipants,
      key_emails: keyEmails,
      evidence_summary: evidenceSummary,
      analysis_timestamp: new Date()
    };
  }
  
  private normalizeEmails(emails: any[]): EmailMessage[] {
    return emails.map((email, idx) => ({
      message_id: email.message_id || `MSG-${idx}`,
      from: email.from || email.sender,
      to: Array.isArray(email.to) ? email.to : [email.to],
      cc: email.cc,
      bcc: email.bcc,
      subject: email.subject || '(No Subject)',
      body: email.body || email.text || email.html || '',
      timestamp: new Date(email.date || email.timestamp),
      attachments: email.attachments || [],
      headers: email.headers || {},
      sentiment: 'neutral',
      key_entities: [],
      money_mentions: [],
      urgency_level: 'normal'
    }));
  }
  
  /**
   * Reconstruct email threads
   */
  private reconstructThreads(emails: EmailMessage[]): EmailThread[] {
    const threadMap = new Map<string, EmailMessage[]>();
    
    // Group by subject (normalized)
    for (const email of emails) {
      const normalizedSubject = email.subject
        .replace(/^(re:|fwd?:|fw:)\s*/gi, '')
        .trim()
        .toLowerCase();
      
      if (!threadMap.has(normalizedSubject)) {
        threadMap.set(normalizedSubject, []);
      }
      
      threadMap.get(normalizedSubject)!.push(email);
    }
    
    // Convert to threads
    const threads: EmailThread[] = [];
    let threadIdx = 1;
    
    for (const [subject, threadEmails] of threadMap.entries()) {
      threadEmails.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      const participants = new Set<string>();
      threadEmails.forEach(email => {
        participants.add(email.from);
        email.to.forEach(to => participants.add(to));
      });
      
      const dates = threadEmails.map(e => e.timestamp);
      
      threads.push({
        thread_id: `THREAD-${threadIdx++}`,
        subject,
        emails: threadEmails,
        participants: Array.from(participants),
        date_range: {
          start: new Date(Math.min(...dates.map(d => d.getTime()))),
          end: new Date(Math.max(...dates.map(d => d.getTime())))
        },
        message_count: threadEmails.length,
        legal_relevance: threadEmails.length > 5 ? 'high' : 'medium'
      });
    }
    
    threads.sort((a, b) => b.message_count - a.message_count);
    
    return threads;
  }
  
  /**
   * Profile email participants
   */
  private profileParticipants(emails: EmailMessage[]): ParticipantProfile[] {
    const participantMap = new Map<string, any>();
    
    for (const email of emails) {
      // Sender
      if (!participantMap.has(email.from)) {
        participantMap.set(email.from, {
          email_address: email.from,
          total_sent: 0,
          total_received: 0,
          first_seen: email.timestamp,
          last_seen: email.timestamp,
          timestamps: []
        });
      }
      
      const senderProfile = participantMap.get(email.from);
      senderProfile.total_sent++;
      senderProfile.last_seen = new Date(Math.max(senderProfile.last_seen.getTime(), email.timestamp.getTime()));
      senderProfile.timestamps.push(email.timestamp);
      
      // Recipients
      for (const recipient of email.to) {
        if (!participantMap.has(recipient)) {
          participantMap.set(recipient, {
            email_address: recipient,
            total_sent: 0,
            total_received: 0,
            first_seen: email.timestamp,
            last_seen: email.timestamp,
            timestamps: []
          });
        }
        
        const recipientProfile = participantMap.get(recipient);
        recipientProfile.total_received++;
        recipientProfile.last_seen = new Date(Math.max(recipientProfile.last_seen.getTime(), email.timestamp.getTime()));
      }
    }
    
    // Calculate metrics
    const profiles: ParticipantProfile[] = [];
    
    for (const [email, data] of participantMap.entries()) {
      // Calculate average response time (simplified)
      const avgResponseTime = 24;  // hours
      
      // Determine most active hours
      const hourCounts = new Array(24).fill(0);
      data.timestamps.forEach((ts: Date) => {
        hourCounts[ts.getHours()]++;
      });
      const mostActiveHours = hourCounts
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(h => h.hour);
      
      // Calculate centrality (simplified - based on total activity)
      const centralityScore = (data.total_sent + data.total_received) / emails.length;
      
      // Determine role
      let role: 'hub' | 'bridge' | 'peripheral' | 'isolate';
      if (centralityScore > 0.5) role = 'hub';
      else if (centralityScore > 0.2) role = 'bridge';
      else if (centralityScore > 0.05) role = 'peripheral';
      else role = 'isolate';
      
      profiles.push({
        email_address: email,
        total_sent: data.total_sent,
        total_received: data.total_received,
        first_seen: data.first_seen,
        last_seen: data.last_seen,
        avg_response_time_hours: avgResponseTime,
        most_active_hours: mostActiveHours,
        communication_style: data.total_sent > data.total_received ? 'proactive' : 'reactive',
        centrality_score: centralityScore,
        role,
        suspicious_behaviors: [],
        risk_score: 0
      });
    }
    
    return profiles.sort((a, b) => b.centrality_score - a.centrality_score);
  }
  
  /**
   * Build chronological timeline
   */
  private buildTimeline(emails: EmailMessage[]): TimelineEntry[] {
    const timeline: TimelineEntry[] = [];
    
    const sortedEmails = [...emails].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    for (const email of sortedEmails) {
      timeline.push({
        timestamp: email.timestamp,
        event_type: 'email_sent',
        from: email.from,
        to: email.to,
        subject: email.subject,
        summary: email.body.substring(0, 200),
        significance: email.attachments.length > 0 ? 'high' : 'medium'
      });
    }
    
    return timeline;
  }
  
  /**
   * Detect communication patterns
   */
  private detectCommunicationPatterns(emails: EmailMessage[], participants: ParticipantProfile[]): CommunicationPattern[] {
    const patterns: CommunicationPattern[] = [];
    
    // Burst pattern - many emails in short time
    const sortedEmails = [...emails].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let burstCount = 0;
    let burstStart: Date | null = null;
    
    for (let i = 1; i < sortedEmails.length; i++) {
      const timeDiff = (sortedEmails[i].timestamp.getTime() - sortedEmails[i-1].timestamp.getTime()) / (1000 * 60 * 60);
      
      if (timeDiff < 1) {  // Within 1 hour
        if (!burstStart) burstStart = sortedEmails[i-1].timestamp;
        burstCount++;
      } else {
        if (burstCount > 5) {
          patterns.push({
            pattern_type: 'COMMUNICATION_BURST',
            description: `Burst of ${burstCount} emails within short timeframe`,
            occurrences: burstCount,
            participants: [sortedEmails[i-1].from],
            time_range: { start: burstStart!, end: sortedEmails[i-1].timestamp },
            significance: 'May indicate urgent activity or coordination'
          });
        }
        burstCount = 0;
        burstStart = null;
      }
    }
    
    // Off-hours communication
    const offHoursEmails = emails.filter(e => {
      const hour = e.timestamp.getHours();
      return hour < 6 || hour > 22;
    });
    
    if (offHoursEmails.length > emails.length * 0.2) {
      patterns.push({
        pattern_type: 'OFF_HOURS_COMMUNICATION',
        description: `${offHoursEmails.length} emails sent outside business hours`,
        occurrences: offHoursEmails.length,
        participants: [...new Set(offHoursEmails.map(e => e.from))],
        time_range: this.getDateRange(offHoursEmails),
        significance: 'May indicate concealment attempts'
      });
    }
    
    return patterns;
  }
  
  /**
   * Identify suspicious indicators
   */
  private identifySuspiciousIndicators(emails: EmailMessage[]): SuspiciousIndicator[] {
    const indicators: SuspiciousIndicator[] = [];
    
    // BCC usage (hidden recipients)
    const bccEmails = emails.filter(e => e.bcc && e.bcc.length > 0);
    if (bccEmails.length > 0) {
      indicators.push({
        indicator_type: 'BCC_USAGE',
        severity: 'medium',
        description: `${bccEmails.length} emails with BCC recipients (hidden recipients)`,
        evidence: bccEmails.map(e => e.subject),
        emails_affected: bccEmails.map(e => e.message_id)
      });
    }
    
    // Deleted/missing emails in sequence
    // Would check for gaps in message IDs or references
    
    // External email addresses
    const externalEmails = emails.filter(e => 
      !e.from.includes('@company.com') || 
      e.to.some(to => !to.includes('@company.com'))
    );
    
    if (externalEmails.length > emails.length * 0.3) {
      indicators.push({
        indicator_type: 'EXTERNAL_COMMUNICATION',
        severity: 'low',
        description: `${externalEmails.length} emails to/from external addresses`,
        evidence: [...new Set(externalEmails.flatMap(e => [e.from, ...e.to]))],
        emails_affected: externalEmails.map(e => e.message_id)
      });
    }
    
    return indicators;
  }
  
  /**
   * Build network map
   */
  private buildNetworkMap(emails: EmailMessage[]): EmailNetwork[] {
    const networkMap = new Map<string, EmailNetwork>();
    
    for (const email of emails) {
      for (const to of email.to) {
        const key = `${email.from}::${to}`;
        
        if (!networkMap.has(key)) {
          networkMap.set(key, {
            from: email.from,
            to,
            email_count: 0,
            total_attachments: 0,
            first_contact: email.timestamp,
            last_contact: email.timestamp,
            relationship_strength: 0
          });
        }
        
        const network = networkMap.get(key)!;
        network.email_count++;
        network.total_attachments += email.attachments.length;
        network.last_contact = new Date(Math.max(network.last_contact.getTime(), email.timestamp.getTime()));
      }
    }
    
    // Calculate relationship strength
    const maxEmails = Math.max(...Array.from(networkMap.values()).map(n => n.email_count));
    for (const network of networkMap.values()) {
      network.relationship_strength = network.email_count / maxEmails;
    }
    
    return Array.from(networkMap.values())
      .sort((a, b) => b.email_count - a.email_count);
  }
  
  /**
   * Identify key emails
   */
  private identifyKeyEmails(emails: EmailMessage[], patterns: CommunicationPattern[]): KeyEmail[] {
    const keyEmails: KeyEmail[] = [];
    
    // Emails with attachments
    const emailsWithAttachments = emails.filter(e => e.attachments.length > 0);
    for (const email of emailsWithAttachments.slice(0, 10)) {
      keyEmails.push({
        email_id: email.message_id,
        subject: email.subject,
        from: email.from,
        timestamp: email.timestamp,
        importance_score: 0.9,
        reason: `Contains ${email.attachments.length} attachment(s)`
      });
    }
    
    // Emails mentioned in patterns
    for (const pattern of patterns) {
      if (pattern.pattern_type === 'COMMUNICATION_BURST') {
        const relevantEmails = emails.filter(e => 
          e.timestamp >= pattern.time_range.start && 
          e.timestamp <= pattern.time_range.end
        );
        
        for (const email of relevantEmails.slice(0, 3)) {
          keyEmails.push({
            email_id: email.message_id,
            subject: email.subject,
            from: email.from,
            timestamp: email.timestamp,
            importance_score: 0.85,
            reason: 'Part of communication burst pattern'
          });
        }
      }
    }
    
    return keyEmails.slice(0, 20);
  }
  
  private generateEvidenceSummary(threads: EmailThread[], patterns: CommunicationPattern[], indicators: SuspiciousIndicator[]): string {
    return `Email analysis identified ${threads.length} conversation threads with ${patterns.length} significant communication patterns. ` +
           `${indicators.length} suspicious indicators detected requiring further investigation. ` +
           `Key threads involve ${threads.filter(t => t.legal_relevance === 'high').length} high-relevance conversations.`;
  }
  
  private getDateRange(emails: EmailMessage[]): { start: Date; end: Date } {
    if (emails.length === 0) {
      return { start: new Date(), end: new Date() };
    }
    
    const dates = emails.map(e => e.timestamp.getTime());
    return {
      start: new Date(Math.min(...dates)),
      end: new Date(Math.max(...dates))
    };
  }
}

export default EmailAnalysisEngine;
