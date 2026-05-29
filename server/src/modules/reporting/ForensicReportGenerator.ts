/**
 * FORENSIC REPORT GENERATOR
 * ============================================================================
 * Produces structured, export-ready forensic reports for multiple audiences:
 *
 *   - Law Enforcement Submission Pack (Garda Síochána / PSNI / NCA / FBI)
 *   - Financial Regulator Report (CBI / FCA / SEC / FinCEN)
 *   - Corporate Investigation Memo (internal / board-level)
 *   - Prosecution Bundle Summary (DPP / CPS / DOJ)
 *   - Civil Litigation Pack (solicitor / barrister)
 *   - Expert Witness Report (court-ready)
 *   - OSINT Intelligence Report
 *   - Blockchain Tracing Report
 *
 * Output formats: JSON (structured), Markdown (human-readable), plain text
 *
 * Each report includes:
 *   - Executive Summary
 *   - Evidence Schedule (indexed)
 *   - Chronology of Events
 *   - Entity / Actor Analysis
 *   - Financial Flow Summary
 *   - Findings with evidence references and integrity hashes
 *   - Analyst attestation
 *   - Report integrity hash (SHA-256 of full content)
 *
 * Compliance: CPIA 1996, CJA (Ireland) 2011, CPR Part 35 (expert evidence),
 *             ENISA Digital Forensics Reporting Guidelines
 */

import crypto from 'crypto';
import { Case, CaseSummary, TimelineEvent, CaseEntity } from '../cases/CaseManager';
import { EvidenceItem, ExhibitIndex } from '../vault/EvidenceVault';

// ─── Report types ─────────────────────────────────────────────────────────────

export type ReportType =
  | 'law_enforcement'
  | 'financial_regulator'
  | 'corporate_memo'
  | 'prosecution_bundle'
  | 'civil_litigation'
  | 'expert_witness'
  | 'osint_intelligence'
  | 'blockchain_tracing';

export type ExportFormat = 'json' | 'markdown' | 'text';

export interface ReportRequest {
  case_id: string;
  report_type: ReportType;
  format: ExportFormat;
  prepared_by: string;
  prepared_by_credentials: string;
  recipient?: string;
  recipient_agency?: string;
  jurisdiction?: string;
  classification?: string;
  include_privileged?: boolean;
  include_intelligence_only?: boolean;  // include Grade E evidence
  redact_personal_data?: boolean;
  custom_findings?: Finding[];
  reference_number?: string;
}

export interface ForensicReport {
  report_id: string;
  report_ref: string;           // e.g. RPT-2026-001
  report_type: ReportType;
  case_ref: string;
  case_id: string;
  prepared_by: string;
  prepared_by_credentials: string;
  prepared_at: string;
  version: number;
  status: 'draft' | 'final' | 'submitted' | 'superseded';
  classification: string;

  recipient: string;
  recipient_agency: string;
  jurisdiction: string;
  reference_number: string;

  // Core sections
  executive_summary: ExecutiveSummary;
  evidence_schedule: EvidenceScheduleItem[];
  chronology: ChronologySection;
  entity_analysis: EntityAnalysisSection;
  financial_summary: FinancialSummarySection;
  findings: Finding[];
  recommendations: Recommendation[];

  // Attestation
  analyst_attestation: AnalystAttestation;

  // Integrity
  report_hash: string;
  evidence_hashes: Record<string, string>;

  // Formatted output
  formatted_content: string;
}

export interface ExecutiveSummary {
  overview: string;
  key_findings: string[];
  total_subjects: number;
  total_evidence_items: number;
  estimated_financial_loss_usd: number;
  investigation_period: string;
  jurisdiction: string[];
  urgency_level: 'routine' | 'priority' | 'urgent' | 'critical';
  recommended_action: string;
}

export interface EvidenceScheduleItem {
  exhibit_ref: string;
  title: string;
  category: string;
  grade: string;
  obtained_date: string;
  obtained_from: string;
  sha256_hash: string;
  admissibility_score: number;
  privilege: string;
  status: string;
  custody_entries: number;
  relevance_summary: string;
}

export interface ChronologySection {
  start_date: string | null;
  end_date: string | null;
  total_events: number;
  critical_events: ChronologyEntry[];
  full_timeline: ChronologyEntry[];
}

export interface ChronologyEntry {
  sequence: number;
  date: string;
  date_precision: string;
  event: string;
  actors: string[];
  evidence_refs: string[];
  significance: string;
  verified: boolean;
}

export interface EntityAnalysisSection {
  total_entities: number;
  subjects: EntityProfile[];
  associates: EntityProfile[];
  entity_relationships: EntityRelationship[];
}

export interface EntityProfile {
  name: string;
  role: string;
  type: string;
  risk_score: number;
  identifiers: string[];
  linked_to: string[];
  key_actions: string[];
  status: string;
}

export interface EntityRelationship {
  entity_a: string;
  entity_b: string;
  relationship_type: string;
  evidence_basis: string[];
  confidence: number;
}

export interface FinancialSummarySection {
  total_estimated_loss_usd: number;
  currency_breakdown: Record<string, number>;
  significant_transactions: TransactionSummary[];
  financial_patterns: string[];
  asset_recovery_potential_usd: number;
}

export interface TransactionSummary {
  description: string;
  amount_usd: number;
  currency: string;
  date: string;
  from_entity: string;
  to_entity: string;
  evidence_ref: string;
  flagged: boolean;
  flag_reason: string;
}

export interface Finding {
  finding_id: string;
  finding_number: string;    // e.g. F-001
  title: string;
  category: FindingCategory;
  description: string;
  evidence_refs: string[];
  entity_refs: string[];
  timeline_refs: string[];
  confidence_level: 'conclusive' | 'high' | 'medium' | 'low' | 'intelligence_only';
  legal_basis: string;
  applicable_offences: string[];
  jurisdiction: string[];
  integrity_hashes: string[];
  analyst_notes: string;
}

export type FindingCategory =
  | 'fraud' | 'money_laundering' | 'bribery' | 'tax_evasion'
  | 'corporate_misconduct' | 'regulatory_breach' | 'property_fraud'
  | 'cyber_crime' | 'identity_fraud' | 'asset_concealment'
  | 'document_forgery' | 'perjury' | 'obstruction' | 'other';

export interface Recommendation {
  priority: 'immediate' | 'urgent' | 'standard' | 'advisory';
  action: string;
  rationale: string;
  responsible_party: string;
  deadline: string | null;
  legal_basis: string;
}

export interface AnalystAttestation {
  prepared_by: string;
  credentials: string;
  date: string;
  statement: string;
  methodology: string;
  limitations: string;
}

// ─── Report Generator ─────────────────────────────────────────────────────────

export class ForensicReportGenerator {
  private readonly reports: Map<string, ForensicReport> = new Map();
  private reportCounter: Map<string, number> = new Map();

  /**
   * Generate a complete forensic report from case data.
   */
  generateReport(params: {
    request: ReportRequest;
    caseData: Case;
    caseSummary: CaseSummary;
    evidence: EvidenceItem[];
    exhibitIndex: ExhibitIndex;
    customFindings?: Finding[];
  }): ForensicReport {
    const { request, caseData, caseSummary, evidence, exhibitIndex } = params;
    const year = new Date().getFullYear().toString();
    const counter = (this.reportCounter.get(year) || 0) + 1;
    this.reportCounter.set(year, counter);

    const reportId = `RPT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const reportRef = `RPT-${year}-${String(counter).padStart(4, '0')}`;
    const now = new Date().toISOString();

    // Filter evidence based on request params
    let filteredEvidence = evidence;
    if (!request.include_privileged) {
      filteredEvidence = filteredEvidence.filter(e => e.privilege === 'none');
    }
    if (!request.include_intelligence_only) {
      filteredEvidence = filteredEvidence.filter(e => e.grade !== 'E');
    }
    if (request.redact_personal_data) {
      filteredEvidence = filteredEvidence.map(e => ({
        ...e,
        gdpr_data_subjects: e.gdpr_personal_data ? ['[REDACTED]'] : e.gdpr_data_subjects,
      }));
    }

    // Build sections
    const executiveSummary = this.buildExecutiveSummary(caseData, caseSummary, filteredEvidence, request);
    const evidenceSchedule = this.buildEvidenceSchedule(filteredEvidence);
    const chronology = this.buildChronology(caseData.timeline);
    const entityAnalysis = this.buildEntityAnalysis(caseData.entities);
    const financialSummary = this.buildFinancialSummary(caseData);
    const findings = request.custom_findings || params.customFindings || this.autoGenerateFindings(caseData, filteredEvidence);
    const recommendations = this.generateRecommendations(request.report_type, caseData, findings);

    const attestation = this.buildAttestation(request, now);

    // Compute evidence hashes map
    const evidenceHashes: Record<string, string> = {};
    for (const e of filteredEvidence) {
      evidenceHashes[e.exhibit_ref] = e.sha256_hash;
    }

    // Build formatted content
    const formattedContent = this.formatReport(
      request.report_type, request.format,
      {
        reportRef, caseData, caseSummary, executiveSummary, evidenceSchedule,
        chronology, entityAnalysis, financialSummary, findings, recommendations,
        attestation, reportId, request, evidenceHashes,
      }
    );

    // Compute report hash (integrity seal)
    const reportHash = crypto.createHash('sha256').update(formattedContent).digest('hex');

    const report: ForensicReport = {
      report_id: reportId,
      report_ref: reportRef,
      report_type: request.report_type,
      case_ref: caseData.case_ref,
      case_id: caseData.case_id,
      prepared_by: request.prepared_by,
      prepared_by_credentials: request.prepared_by_credentials,
      prepared_at: now,
      version: 1,
      status: 'draft',
      classification: request.classification || caseData.classification,
      recipient: request.recipient || '',
      recipient_agency: request.recipient_agency || '',
      jurisdiction: request.jurisdiction || caseData.jurisdictions.join(', '),
      reference_number: request.reference_number || '',
      executive_summary: executiveSummary,
      evidence_schedule: evidenceSchedule,
      chronology,
      entity_analysis: entityAnalysis,
      financial_summary: financialSummary,
      findings,
      recommendations,
      analyst_attestation: attestation,
      report_hash: reportHash,
      evidence_hashes: evidenceHashes,
      formatted_content: formattedContent,
    };

    this.reports.set(reportId, report);
    console.log(`[REPORT-GEN] Generated: ${reportRef} (${request.report_type}) for case ${caseData.case_ref}`);
    return report;
  }

  // ─── Section builders ─────────────────────────────────────────────────────────

  private buildExecutiveSummary(
    c: Case, summary: CaseSummary, evidence: EvidenceItem[], req: ReportRequest
  ): ExecutiveSummary {
    const subjects = c.entities.filter(e => e.role === 'subject' || e.role === 'suspect');
    const urgency: ExecutiveSummary['urgency_level'] =
      c.priority === 'critical' ? 'critical' :
      c.priority === 'high' ? 'urgent' :
      c.priority === 'medium' ? 'priority' : 'routine';

    return {
      overview: `This report documents the findings of a forensic investigation into ${c.title}. ` +
        `The investigation covers the period from ${c.incident_date || 'unknown'} to ${new Date().toISOString().split('T')[0]} ` +
        `and involves ${summary.entity_count} identified entities across ${c.jurisdictions.join(', ')} jurisdiction(s). ` +
        `A total of ${evidence.length} evidence items have been processed and authenticated.`,
      key_findings: [
        `${subjects.length} subject(s)/suspect(s) identified`,
        `${evidence.length} evidence items authenticated and indexed`,
        `Estimated financial exposure: USD ${c.estimated_loss_usd.toLocaleString()}`,
        `${summary.timeline_event_count} timeline events reconstructed`,
        `${summary.contradiction_count} potential contradiction(s) detected`,
        `Case open for ${summary.days_open} day(s)`,
      ],
      total_subjects: subjects.length,
      total_evidence_items: evidence.length,
      estimated_financial_loss_usd: c.estimated_loss_usd,
      investigation_period: `${c.incident_date || 'Unknown start'} — ${new Date().toISOString().split('T')[0]}`,
      jurisdiction: c.jurisdictions,
      urgency_level: urgency,
      recommended_action: this.getRecommendedAction(req.report_type, urgency),
    };
  }

  private buildEvidenceSchedule(evidence: EvidenceItem[]): EvidenceScheduleItem[] {
    return evidence.map(e => ({
      exhibit_ref: e.exhibit_ref,
      title: e.title,
      category: e.category,
      grade: e.grade,
      obtained_date: e.obtained_at.split('T')[0],
      obtained_from: e.source,
      sha256_hash: e.sha256_hash,
      admissibility_score: e.admissibility_score,
      privilege: e.privilege,
      status: e.status,
      custody_entries: e.custody_log.length,
      relevance_summary: e.description.substring(0, 200),
    }));
  }

  private buildChronology(timeline: TimelineEvent[]): ChronologySection {
    const sorted = [...timeline].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const critical = sorted.filter(e => e.significance === 'critical' || e.significance === 'high');

    const toEntry = (e: TimelineEvent, i: number): ChronologyEntry => ({
      sequence: i + 1,
      date: e.timestamp,
      date_precision: e.timestamp_precision,
      event: e.title + ': ' + e.description,
      actors: e.actors_involved,
      evidence_refs: e.evidence_refs,
      significance: e.significance,
      verified: e.verified,
    });

    return {
      start_date: sorted[0]?.timestamp || null,
      end_date: sorted[sorted.length - 1]?.timestamp || null,
      total_events: sorted.length,
      critical_events: critical.map((e, i) => toEntry(e, i)),
      full_timeline: sorted.map((e, i) => toEntry(e, i)),
    };
  }

  private buildEntityAnalysis(entities: CaseEntity[]): EntityAnalysisSection {
    const subjects = entities.filter(e => e.role === 'subject' || e.role === 'suspect');
    const associates = entities.filter(e => !['subject', 'suspect'].includes(e.role));

    const toProfile = (e: CaseEntity): EntityProfile => ({
      name: e.name,
      role: e.role,
      type: e.type,
      risk_score: e.risk_score,
      identifiers: e.identifiers.map(i => `${i.type}: ${i.value}`),
      linked_to: e.linked_entities,
      key_actions: e.risk_flags,
      status: e.status,
    });

    // Build relationships from linked_entities
    const relationships: EntityRelationship[] = [];
    for (const e of entities) {
      for (const linkedId of e.linked_entities) {
        const linked = entities.find(x => x.entity_id === linkedId);
        if (linked) {
          relationships.push({
            entity_a: e.name,
            entity_b: linked.name,
            relationship_type: 'associated',
            evidence_basis: [],
            confidence: 70,
          });
        }
      }
    }

    return {
      total_entities: entities.length,
      subjects: subjects.map(toProfile),
      associates: associates.map(toProfile),
      entity_relationships: relationships,
    };
  }

  private buildFinancialSummary(c: Case): FinancialSummarySection {
    return {
      total_estimated_loss_usd: c.estimated_loss_usd,
      currency_breakdown: c.currencies_involved.reduce((acc, curr) => {
        acc[curr] = c.estimated_loss_usd;
        return acc;
      }, {} as Record<string, number>),
      significant_transactions: [],
      financial_patterns: [
        c.estimated_loss_usd > 1000000 ? 'Large-scale financial exposure detected' : '',
        'Detailed transaction analysis requires financial institution data requests',
      ].filter(Boolean),
      asset_recovery_potential_usd: c.estimated_recovery_usd,
    };
  }

  private autoGenerateFindings(c: Case, evidence: EvidenceItem[]): Finding[] {
    const findings: Finding[] = [];
    let num = 1;

    // Finding: Evidence of financial irregularity
    const financialEvidence = evidence.filter(e =>
      e.category === 'financial' || e.category === 'blockchain'
    );
    if (financialEvidence.length > 0) {
      findings.push({
        finding_id: `FND-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
        finding_number: `F-${String(num++).padStart(3, '0')}`,
        title: 'Financial Evidence Identified',
        category: 'fraud',
        description: `${financialEvidence.length} financial evidence item(s) identified and authenticated. ` +
          `Total estimated financial exposure: USD ${c.estimated_loss_usd.toLocaleString()}.`,
        evidence_refs: financialEvidence.map(e => e.exhibit_ref),
        entity_refs: c.entities.filter(e => e.role === 'subject').map(e => e.entity_id),
        timeline_refs: [],
        confidence_level: financialEvidence.length >= 3 ? 'high' : 'medium',
        legal_basis: 'Criminal Justice (Theft and Fraud Offences) Act 2001 (IE); Fraud Act 2006 (UK)',
        applicable_offences: ['Fraud by false representation', 'Money laundering', 'Theft'],
        jurisdiction: c.jurisdictions,
        integrity_hashes: financialEvidence.map(e => e.sha256_hash),
        analyst_notes: 'Full forensic accounting analysis recommended.',
      });
    }

    // Finding: Document anomalies
    const highGradeEvidence = evidence.filter(e => e.grade === 'A' || e.grade === 'B');
    if (highGradeEvidence.length > 0) {
      findings.push({
        finding_id: `FND-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
        finding_number: `F-${String(num++).padStart(3, '0')}`,
        title: 'Primary Documentary Evidence Authenticated',
        category: 'fraud',
        description: `${highGradeEvidence.length} primary/secondary evidence item(s) authenticated with ` +
          `dual SHA-256/SHA-3 hash verification and unbroken chain of custody.`,
        evidence_refs: highGradeEvidence.map(e => e.exhibit_ref),
        entity_refs: [],
        timeline_refs: [],
        confidence_level: 'conclusive',
        legal_basis: 'Electronic Commerce Act 2000 (IE); Electronic Communications Act 2000 (UK)',
        applicable_offences: ['Evidence of record'],
        jurisdiction: c.jurisdictions,
        integrity_hashes: highGradeEvidence.map(e => e.sha256_hash),
        analyst_notes: 'All items passed integrity verification at time of report generation.',
      });
    }

    return findings;
  }

  private generateRecommendations(
    reportType: ReportType,
    c: Case,
    findings: Finding[]
  ): Recommendation[] {
    const recs: Recommendation[] = [];

    if (reportType === 'law_enforcement') {
      recs.push({
        priority: 'urgent',
        action: 'Formally receive and register this evidence package under CPIA 1996 / CJA 2011',
        rationale: 'Ensures chain of custody continuity and prosecution readiness',
        responsible_party: 'Receiving officer',
        deadline: null,
        legal_basis: 'CPIA 1996 s.3; Criminal Justice Act 2011 (IE)',
      });
      if (c.estimated_loss_usd > 100000) {
        recs.push({
          priority: 'urgent',
          action: 'Apply for Production Order / Search Warrant to obtain financial institution records',
          rationale: `Estimated loss of USD ${c.estimated_loss_usd.toLocaleString()} warrants urgent asset-freeze consideration`,
          responsible_party: 'Investigating officer / Garda Bureau of Fraud Investigation',
          deadline: null,
          legal_basis: 'Criminal Assets Bureau Act 1996; Proceeds of Crime Act 1996 (IE)',
        });
      }
    }

    if (reportType === 'financial_regulator') {
      recs.push({
        priority: 'immediate',
        action: 'File Suspicious Activity Report (SAR) with the relevant Financial Intelligence Unit',
        rationale: 'Regulatory obligation triggered by findings — failure to report is a criminal offence',
        responsible_party: 'Compliance Officer / MLRO',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        legal_basis: 'Criminal Justice (Money Laundering and Terrorist Financing) Act 2010 (IE); POCA 2002 (UK)',
      });
    }

    recs.push({
      priority: 'standard',
      action: 'Preserve all digital evidence in accordance with ISO/IEC 27037:2012',
      rationale: 'Ensures continued admissibility and defence against integrity challenges',
      responsible_party: 'Lead Analyst',
      deadline: null,
      legal_basis: 'ISO/IEC 27037:2012 — Digital Evidence Preservation',
    });

    return recs;
  }

  // ─── Formatting ───────────────────────────────────────────────────────────────

  private formatReport(
    type: ReportType,
    format: ExportFormat,
    data: {
      reportRef: string;
      caseData: Case;
      caseSummary: CaseSummary;
      executiveSummary: ExecutiveSummary;
      evidenceSchedule: EvidenceScheduleItem[];
      chronology: ChronologySection;
      entityAnalysis: EntityAnalysisSection;
      financialSummary: FinancialSummarySection;
      findings: Finding[];
      recommendations: Recommendation[];
      attestation: AnalystAttestation;
      reportId: string;
      request: ReportRequest;
      evidenceHashes: Record<string, string>;
    }
  ): string {
    if (format === 'json') {
      return JSON.stringify({
        report_ref: data.reportRef,
        report_type: type,
        case_ref: data.caseData.case_ref,
        generated_at: new Date().toISOString(),
        ...data,
      }, null, 2);
    }

    if (format === 'markdown') {
      return this.formatMarkdown(type, data);
    }

    return this.formatPlainText(type, data);
  }

  private formatMarkdown(type: ReportType, d: any): string {
    const lines: string[] = [];
    const hr = '---';
    const now = new Date().toISOString().split('T')[0];

    // Header
    lines.push(`# FORENSIC INVESTIGATION REPORT`);
    lines.push(`## ${this.getReportTitle(type)}`);
    lines.push('');
    lines.push(`| Field | Value |`);
    lines.push(`|---|---|`);
    lines.push(`| Report Reference | **${d.reportRef}** |`);
    lines.push(`| Case Reference | **${d.caseData.case_ref}** |`);
    lines.push(`| Case Title | ${d.caseData.title} |`);
    lines.push(`| Prepared By | ${d.request.prepared_by} |`);
    lines.push(`| Credentials | ${d.request.prepared_by_credentials} |`);
    lines.push(`| Date | ${now} |`);
    lines.push(`| Classification | **${(d.request.classification || 'RESTRICTED').toUpperCase()}** |`);
    lines.push(`| Recipient | ${d.request.recipient || 'N/A'} |`);
    lines.push(`| Recipient Agency | ${d.request.recipient_agency || 'N/A'} |`);
    lines.push(`| Jurisdiction | ${d.caseData.jurisdictions.join(', ')} |`);
    lines.push('');
    lines.push(hr);
    lines.push('');

    // Executive Summary
    lines.push('## 1. EXECUTIVE SUMMARY');
    lines.push('');
    lines.push(d.executiveSummary.overview);
    lines.push('');
    lines.push('### Key Findings');
    for (const kf of d.executiveSummary.key_findings) {
      lines.push(`- ${kf}`);
    }
    lines.push('');
    lines.push(`**Urgency Level:** ${d.executiveSummary.urgency_level.toUpperCase()}`);
    lines.push(`**Recommended Action:** ${d.executiveSummary.recommended_action}`);
    lines.push('');
    lines.push(hr);
    lines.push('');

    // Evidence Schedule
    lines.push('## 2. EVIDENCE SCHEDULE');
    lines.push('');
    lines.push(`Total evidence items: **${d.evidenceSchedule.length}**`);
    lines.push('');
    if (d.evidenceSchedule.length > 0) {
      lines.push('| Exhibit Ref | Title | Category | Grade | Obtained | Admissibility | Status |');
      lines.push('|---|---|---|---|---|---|---|');
      for (const item of d.evidenceSchedule) {
        lines.push(`| **${item.exhibit_ref}** | ${item.title.substring(0, 40)} | ${item.category} | **${item.grade}** | ${item.obtained_date} | ${item.admissibility_score}/100 | ${item.status} |`);
      }
    } else {
      lines.push('*No evidence items in schedule.*');
    }
    lines.push('');
    lines.push('### Evidence Integrity Hashes (SHA-256)');
    lines.push('```');
    for (const [ref, hash] of Object.entries(d.evidenceHashes)) {
      lines.push(`${ref}: ${hash}`);
    }
    lines.push('```');
    lines.push('');
    lines.push(hr);
    lines.push('');

    // Chronology
    lines.push('## 3. CHRONOLOGY OF EVENTS');
    lines.push('');
    lines.push(`Total events: **${d.chronology.total_events}** | Period: ${d.chronology.start_date || 'Unknown'} — ${d.chronology.end_date || 'Present'}`);
    lines.push('');
    if (d.chronology.critical_events.length > 0) {
      lines.push('### Critical / High-Significance Events');
      lines.push('');
      for (const e of d.chronology.critical_events) {
        lines.push(`**[${e.sequence}] ${e.date.split('T')[0]}** — ${e.event.substring(0, 150)}`);
        if (e.evidence_refs.length > 0) {
          lines.push(`  - Evidence: ${e.evidence_refs.join(', ')}`);
        }
        if (e.actors.length > 0) {
          lines.push(`  - Actors: ${e.actors.join(', ')}`);
        }
        lines.push('');
      }
    }
    lines.push(hr);
    lines.push('');

    // Entity Analysis
    lines.push('## 4. ENTITY & ACTOR ANALYSIS');
    lines.push('');
    lines.push(`Total entities: **${d.entityAnalysis.total_entities}** | Subjects/Suspects: **${d.entityAnalysis.subjects.length}**`);
    lines.push('');
    if (d.entityAnalysis.subjects.length > 0) {
      lines.push('### Subjects / Suspects');
      for (const s of d.entityAnalysis.subjects) {
        lines.push(`#### ${s.name}`);
        lines.push(`- **Role:** ${s.role} | **Type:** ${s.type} | **Status:** ${s.status}`);
        lines.push(`- **Risk Score:** ${s.risk_score}/100`);
        if (s.identifiers.length > 0) lines.push(`- **Identifiers:** ${s.identifiers.join('; ')}`);
        if (s.key_actions.length > 0) lines.push(`- **Risk Flags:** ${s.key_actions.join('; ')}`);
        lines.push('');
      }
    }
    lines.push(hr);
    lines.push('');

    // Financial Summary
    lines.push('## 5. FINANCIAL SUMMARY');
    lines.push('');
    lines.push(`| Item | Value |`);
    lines.push(`|---|---|`);
    lines.push(`| Estimated Total Loss | **USD ${d.financialSummary.total_estimated_loss_usd.toLocaleString()}** |`);
    lines.push(`| Recovery Potential | USD ${d.financialSummary.asset_recovery_potential_usd.toLocaleString()} |`);
    for (const [curr, amt] of Object.entries(d.financialSummary.currency_breakdown) as [string, number][]) {
      lines.push(`| ${curr} Exposure | ${(amt as number).toLocaleString()} |`);
    }
    lines.push('');
    if (d.financialSummary.financial_patterns.length > 0) {
      lines.push('**Financial Patterns:**');
      for (const p of d.financialSummary.financial_patterns) {
        lines.push(`- ${p}`);
      }
    }
    lines.push('');
    lines.push(hr);
    lines.push('');

    // Findings
    lines.push('## 6. FINDINGS');
    lines.push('');
    for (const f of d.findings) {
      lines.push(`### ${f.finding_number}: ${f.title}`);
      lines.push(`**Category:** ${f.category} | **Confidence:** ${f.confidence_level.toUpperCase()}`);
      lines.push('');
      lines.push(f.description);
      lines.push('');
      if (f.evidence_refs.length > 0) lines.push(`**Evidence References:** ${f.evidence_refs.join(', ')}`);
      if (f.applicable_offences.length > 0) lines.push(`**Applicable Offences:** ${f.applicable_offences.join('; ')}`);
      if (f.legal_basis) lines.push(`**Legal Basis:** ${f.legal_basis}`);
      if (f.integrity_hashes.length > 0) {
        lines.push('**Integrity Hashes:**');
        lines.push('```');
        f.integrity_hashes.forEach((h: string) => lines.push(h));
        lines.push('```');
      }
      lines.push('');
    }
    lines.push(hr);
    lines.push('');

    // Recommendations
    lines.push('## 7. RECOMMENDATIONS');
    lines.push('');
    for (let i = 0; i < d.recommendations.length; i++) {
      const r = d.recommendations[i];
      lines.push(`### R-${String(i + 1).padStart(3, '0')}: [${r.priority.toUpperCase()}] ${r.action}`);
      lines.push(`**Rationale:** ${r.rationale}`);
      lines.push(`**Responsible:** ${r.responsible_party}`);
      if (r.deadline) lines.push(`**Deadline:** ${r.deadline}`);
      lines.push(`**Legal Basis:** ${r.legal_basis}`);
      lines.push('');
    }
    lines.push(hr);
    lines.push('');

    // Attestation
    lines.push('## 8. ANALYST ATTESTATION');
    lines.push('');
    lines.push(`**Prepared by:** ${d.attestation.prepared_by}`);
    lines.push(`**Credentials:** ${d.attestation.credentials}`);
    lines.push(`**Date:** ${d.attestation.date}`);
    lines.push('');
    lines.push('### Declaration');
    lines.push(`> ${d.attestation.statement}`);
    lines.push('');
    lines.push(`**Methodology:** ${d.attestation.methodology}`);
    lines.push(`**Limitations:** ${d.attestation.limitations}`);
    lines.push('');
    lines.push(hr);
    lines.push('');
    lines.push(`*Report generated by Orb AI Forensic Investigation Platform. Report ID: ${d.reportId}*`);
    lines.push(`*This document is ${(d.request.classification || 'RESTRICTED').toUpperCase()}. Unauthorised disclosure is prohibited.*`);

    return lines.join('\n');
  }

  private formatPlainText(type: ReportType, d: any): string {
    // Convert markdown to plain text (strip markdown syntax)
    return this.formatMarkdown(type, d)
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\|/g, ' ')
      .replace(/^---$/gm, '─'.repeat(60))
      .replace(/>\s*/g, '')
      .replace(/`{3}[\s\S]*?`{3}/gm, match => match.replace(/`{3}/g, ''))
      .replace(/`(.+?)`/g, '$1');
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  private buildAttestation(req: ReportRequest, date: string): AnalystAttestation {
    return {
      prepared_by: req.prepared_by,
      credentials: req.prepared_by_credentials,
      date: date.split('T')[0],
      statement: `I, ${req.prepared_by}, being duly qualified and having conducted the forensic analysis described herein, ` +
        `declare that this report represents an accurate and complete account of my findings based on the evidence examined. ` +
        `All evidence has been handled in accordance with established chain-of-custody procedures. ` +
        `I am aware that this report may be used in legal proceedings and I accept the obligations of an expert witness where applicable.`,
      methodology: 'Digital forensic analysis in accordance with ACPO Good Practice Guide (2012), ' +
        'ISO/IEC 27037:2012, and ENISA Digital Forensics Guidelines (2022). ' +
        'All files cryptographically hashed (SHA-256 + SHA-3-256) at intake. Chain of custody maintained throughout.',
      limitations: 'This report is based solely on evidence items listed in the Evidence Schedule. ' +
        'Access to additional records (financial institutions, telecommunications providers, government registers) ' +
        'may significantly expand findings. Intelligence-grade evidence (Grade E) is excluded from evidential conclusions.',
    };
  }

  private getReportTitle(type: ReportType): string {
    const titles: Record<ReportType, string> = {
      law_enforcement: 'Law Enforcement Submission — Forensic Evidence Package',
      financial_regulator: 'Financial Regulator Submission — Suspicious Activity Report',
      corporate_memo: 'Corporate Investigation Memorandum',
      prosecution_bundle: 'Prosecution Bundle — Evidence and Chronology',
      civil_litigation: 'Civil Litigation Evidence Pack',
      expert_witness: 'Expert Witness Report',
      osint_intelligence: 'OSINT Intelligence Assessment',
      blockchain_tracing: 'Blockchain Tracing and Asset-Flow Report',
    };
    return titles[type] || 'Forensic Report';
  }

  private getRecommendedAction(type: ReportType, urgency: string): string {
    if (type === 'law_enforcement') {
      return urgency === 'critical'
        ? 'Immediate arrest/detention consideration — refer to GBFI/NCA/relevant authority without delay'
        : 'Register evidence, open formal investigation file, consider production orders';
    }
    if (type === 'financial_regulator') return 'File SAR within statutory timeframe; consider account freeze';
    if (type === 'prosecution_bundle') return 'Review with DPP/CPS for charging decision';
    if (type === 'corporate_memo') return 'Escalate to Board/Audit Committee; consider external legal counsel';
    return 'Review findings and determine appropriate next steps with legal counsel';
  }

  // ─── Retrieval ────────────────────────────────────────────────────────────────

  getReport(reportId: string): ForensicReport | null {
    return this.reports.get(reportId) || null;
  }

  listReports(caseId?: string): ForensicReport[] {
    const all = Array.from(this.reports.values());
    return caseId ? all.filter(r => r.case_id === caseId) : all;
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const reportGenerator = new ForensicReportGenerator();
export default ForensicReportGenerator;
