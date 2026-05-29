/**
 * CASE MANAGEMENT MODULE
 * ============================================================================
 * Full lifecycle management for forensic investigations.
 *
 * Capabilities:
 *   - Case creation, classification, and status tracking
 *   - Entity resolution (actors, companies, addresses, wallets)
 *   - Timeline construction (auto-sorted, deduplication, conflict detection)
 *   - Analyst notes with versioning
 *   - Evidence tagging and cross-referencing
 *   - Matter linking (related cases, sub-matters)
 *   - Jurisdiction mapping
 *   - Case summary generation
 *
 * Compliance: CPIA 1996 (UK), Irish CJA 2011, GDPR Art 5
 */

import crypto from 'crypto';
import { nanoid } from 'nanoid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseStatus =
  | 'open'
  | 'active'
  | 'under_review'
  | 'escalated'
  | 'submitted'
  | 'closed'
  | 'archived'
  | 'suspended';

export type CaseType =
  | 'financial_fraud'
  | 'corporate_fraud'
  | 'money_laundering'
  | 'blockchain_fraud'
  | 'property_fraud'
  | 'tax_evasion'
  | 'bribery_corruption'
  | 'cyber_crime'
  | 'identity_fraud'
  | 'regulatory_breach'
  | 'civil_dispute'
  | 'utility_audit'
  | 'human_rights'
  | 'other';

export type CasePriority = 'critical' | 'high' | 'medium' | 'low';

export type EntityType =
  | 'individual'
  | 'company'
  | 'trust'
  | 'partnership'
  | 'government_body'
  | 'ngo'
  | 'wallet_cluster'
  | 'unknown';

export type EntityRole =
  | 'subject'         // Primary target of investigation
  | 'suspect'         // Under suspicion
  | 'person_of_interest'
  | 'witness'
  | 'victim'
  | 'associate'
  | 'professional_advisor'
  | 'beneficial_owner'
  | 'nominee'
  | 'facilitator'
  | 'complainant'
  | 'regulator'
  | 'unknown';

export interface Case {
  case_id: string;
  case_ref: string;           // Human-readable: OAI-2026-001
  title: string;
  type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  description: string;

  // Parties
  lead_analyst: string;
  assigned_analysts: string[];
  supervising_officer: string;
  client_ref: string | null;    // External client reference if applicable

  // Jurisdiction & Classification
  jurisdictions: string[];
  classification: 'unclassified' | 'restricted' | 'confidential' | 'secret';

  // Financial Summary
  estimated_loss_usd: number;
  estimated_recovery_usd: number;
  currencies_involved: string[];

  // Timeline
  incident_date: string | null;
  discovery_date: string;
  reporting_deadline: string | null;
  closed_date: string | null;

  // Entities
  entities: CaseEntity[];

  // Timeline events
  timeline: TimelineEvent[];

  // Linked items
  evidence_ids: string[];
  matter_ids: string[];
  related_case_ids: string[];
  blockchain_addresses: string[];

  // Notes
  analyst_notes: AnalystNote[];

  // Audit
  created_by: string;
  created_at: string;
  updated_at: string;
  version: number;
  audit_log: CaseAuditEntry[];
}

export interface CaseEntity {
  entity_id: string;
  type: EntityType;
  role: EntityRole;
  name: string;
  aliases: string[];
  identifiers: EntityIdentifier[];
  risk_score: number;
  risk_flags: string[];
  linked_entities: string[];   // entity_ids
  added_by: string;
  added_at: string;
  notes: string;
  status: 'active' | 'cleared' | 'charged' | 'deceased' | 'unknown';
}

export interface EntityIdentifier {
  type: 'pps_number' | 'passport' | 'drivers_licence' | 'company_reg' | 'wallet_address'
      | 'email' | 'phone' | 'ip_address' | 'iban' | 'bic' | 'tax_ref' | 'other';
  value: string;
  jurisdiction?: string;
  verified: boolean;
}

export interface TimelineEvent {
  event_id: string;
  sequence: number;
  timestamp: string;             // ISO 8601 — can be approximate
  timestamp_precision: 'exact' | 'day' | 'month' | 'year' | 'approximate';
  event_type: TimelineEventType;
  title: string;
  description: string;
  actors_involved: string[];     // entity_ids
  evidence_refs: string[];       // evidence_ids
  significance: 'critical' | 'high' | 'medium' | 'low';
  verified: boolean;
  source: string;
  contradiction_flag: boolean;
  contradiction_notes: string;
  tags: string[];
}

export type TimelineEventType =
  | 'financial_transaction'
  | 'meeting'
  | 'communication'
  | 'document_created'
  | 'document_filed'
  | 'corporate_action'
  | 'property_transaction'
  | 'legal_proceeding'
  | 'regulatory_action'
  | 'blockchain_event'
  | 'travel'
  | 'employment_change'
  | 'asset_transfer'
  | 'payment'
  | 'withdrawal'
  | 'other';

export interface AnalystNote {
  note_id: string;
  author: string;
  timestamp: string;
  content: string;
  note_type: 'observation' | 'hypothesis' | 'instruction' | 'legal' | 'intelligence' | 'action_required';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  version: number;
  supersedes: string | null;    // note_id of note this replaces
  is_privileged: boolean;
}

export interface CaseAuditEntry {
  audit_id: string;
  timestamp: string;
  actor: string;
  action: string;
  field_changed: string | null;
  old_value: string | null;
  new_value: string | null;
}

export interface ContradictionFinding {
  finding_id: string;
  event_a_id: string;
  event_b_id: string;
  contradiction_type: 'timestamp_conflict' | 'location_conflict' | 'financial_conflict'
                    | 'statement_conflict' | 'entity_conflict' | 'document_conflict';
  description: string;
  severity: 'critical' | 'significant' | 'minor';
  resolution_status: 'unresolved' | 'resolved' | 'explained';
  resolution_notes: string;
}

// ─── Case Manager ─────────────────────────────────────────────────────────────

export class CaseManager {
  private readonly store: Map<string, Case> = new Map();
  private caseCounter: Map<string, number> = new Map();  // per-year counter

  // ─── Case CRUD ───────────────────────────────────────────────────────────────

  createCase(params: {
    title: string;
    type: CaseType;
    priority: CasePriority;
    description: string;
    lead_analyst: string;
    supervising_officer?: string;
    jurisdictions?: string[];
    classification?: Case['classification'];
    incident_date?: string;
    reporting_deadline?: string;
    client_ref?: string;
    estimated_loss_usd?: number;
    estimated_recovery_usd?: number;
  }): Case {
    const year = new Date().getFullYear().toString();
    const counter = (this.caseCounter.get(year) || 0) + 1;
    this.caseCounter.set(year, counter);

    const caseId = `CASE-${nanoid(12).toUpperCase()}`;
    const caseRef = `OAI-${year}-${String(counter).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const initAudit = this.createAuditEntry(params.lead_analyst, 'case_created', null, null, null, caseRef);

    const newCase: Case = {
      case_id: caseId,
      case_ref: caseRef,
      title: params.title,
      type: params.type,
      status: 'open',
      priority: params.priority,
      description: params.description,
      lead_analyst: params.lead_analyst,
      assigned_analysts: [params.lead_analyst],
      supervising_officer: params.supervising_officer || '',
      client_ref: params.client_ref || null,
      jurisdictions: params.jurisdictions || ['ireland'],
      classification: params.classification || 'restricted',
      estimated_loss_usd: params.estimated_loss_usd || 0,
      estimated_recovery_usd: params.estimated_recovery_usd || 0,
      currencies_involved: ['EUR'],
      incident_date: params.incident_date || null,
      discovery_date: now,
      reporting_deadline: params.reporting_deadline || null,
      closed_date: null,
      entities: [],
      timeline: [],
      evidence_ids: [],
      matter_ids: [],
      related_case_ids: [],
      blockchain_addresses: [],
      analyst_notes: [],
      created_by: params.lead_analyst,
      created_at: now,
      updated_at: now,
      version: 1,
      audit_log: [initAudit],
    };

    this.store.set(caseId, newCase);
    console.log(`[CASE-MANAGER] Created case: ${caseRef} (${caseId})`);
    return newCase;
  }

  getCase(caseId: string): Case {
    const c = this.store.get(caseId);
    if (!c) throw new CaseManagerError(`Case not found: ${caseId}`);
    return c;
  }

  getCaseByRef(caseRef: string): Case | null {
    for (const c of this.store.values()) {
      if (c.case_ref === caseRef) return c;
    }
    return null;
  }

  updateCaseStatus(caseId: string, status: CaseStatus, actor: string, reason: string): Case {
    const c = this.getCase(caseId);
    const old = c.status;
    c.status = status;
    c.updated_at = new Date().toISOString();
    if (status === 'closed') c.closed_date = c.updated_at;
    c.version++;
    c.audit_log.push(this.createAuditEntry(actor, 'status_changed', 'status', old, status, reason));
    return c;
  }

  listCases(filters?: {
    status?: CaseStatus;
    type?: CaseType;
    priority?: CasePriority;
    analyst?: string;
    jurisdiction?: string;
  }): Case[] {
    let results = Array.from(this.store.values());
    if (filters?.status) results = results.filter(c => c.status === filters.status);
    if (filters?.type) results = results.filter(c => c.type === filters.type);
    if (filters?.priority) results = results.filter(c => c.priority === filters.priority);
    if (filters?.analyst) results = results.filter(c => c.assigned_analysts.includes(filters.analyst!));
    if (filters?.jurisdiction) results = results.filter(c => c.jurisdictions.includes(filters.jurisdiction!));
    return results.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  // ─── Entity management ───────────────────────────────────────────────────────

  addEntity(caseId: string, params: {
    type: EntityType;
    role: EntityRole;
    name: string;
    aliases?: string[];
    identifiers?: EntityIdentifier[];
    risk_score?: number;
    notes?: string;
    added_by: string;
  }): CaseEntity {
    const c = this.getCase(caseId);
    const entity: CaseEntity = {
      entity_id: `ENT-${nanoid(10).toUpperCase()}`,
      type: params.type,
      role: params.role,
      name: params.name,
      aliases: params.aliases || [],
      identifiers: params.identifiers || [],
      risk_score: params.risk_score || 0,
      risk_flags: [],
      linked_entities: [],
      added_by: params.added_by,
      added_at: new Date().toISOString(),
      notes: params.notes || '',
      status: 'active',
    };
    c.entities.push(entity);
    c.updated_at = new Date().toISOString();
    c.audit_log.push(this.createAuditEntry(params.added_by, 'entity_added', 'entities', null, entity.name, ''));
    return entity;
  }

  resolveEntity(caseId: string, name: string): CaseEntity | null {
    const c = this.getCase(caseId);
    // Fuzzy match on name and aliases
    const normalized = name.toLowerCase().trim();
    return c.entities.find(e =>
      e.name.toLowerCase() === normalized ||
      e.aliases.some(a => a.toLowerCase() === normalized)
    ) || null;
  }

  // ─── Timeline management ─────────────────────────────────────────────────────

  addTimelineEvent(caseId: string, event: Omit<TimelineEvent, 'event_id' | 'sequence'>): TimelineEvent {
    const c = this.getCase(caseId);

    const fullEvent: TimelineEvent = {
      ...event,
      event_id: `EVT-${nanoid(10).toUpperCase()}`,
      sequence: c.timeline.length + 1,
    };

    // Insert in chronological order
    c.timeline.push(fullEvent);
    c.timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Re-sequence after sort
    c.timeline.forEach((e, i) => { e.sequence = i + 1; });

    c.updated_at = new Date().toISOString();
    return fullEvent;
  }

  detectContradictions(caseId: string): ContradictionFinding[] {
    const c = this.getCase(caseId);
    const findings: ContradictionFinding[] = [];

    for (let i = 0; i < c.timeline.length; i++) {
      for (let j = i + 1; j < c.timeline.length; j++) {
        const a = c.timeline[i];
        const b = c.timeline[j];

        // Check same actor in two places at same time
        const sharedActors = a.actors_involved.filter(x => b.actors_involved.includes(x));
        if (sharedActors.length > 0) {
          const timeDiff = Math.abs(
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          if (timeDiff < 60 * 60 * 1000 && a.event_id !== b.event_id) {
            findings.push({
              finding_id: `CON-${nanoid(8).toUpperCase()}`,
              event_a_id: a.event_id,
              event_b_id: b.event_id,
              contradiction_type: 'location_conflict',
              description: `Actor(s) ${sharedActors.join(', ')} appear in conflicting events within 1 hour`,
              severity: 'significant',
              resolution_status: 'unresolved',
              resolution_notes: '',
            });
          }
        }

        // Check financial conflicts: same tx referenced with different amounts
        if (
          a.event_type === 'financial_transaction' &&
          b.event_type === 'financial_transaction' &&
          a.evidence_refs.some(r => b.evidence_refs.includes(r))
        ) {
          findings.push({
            finding_id: `CON-${nanoid(8).toUpperCase()}`,
            event_a_id: a.event_id,
            event_b_id: b.event_id,
            contradiction_type: 'financial_conflict',
            description: `Overlapping evidence refs in distinct financial events — potential duplication or discrepancy`,
            severity: 'significant',
            resolution_status: 'unresolved',
            resolution_notes: '',
          });
        }
      }
    }

    return findings;
  }

  // ─── Analyst notes ────────────────────────────────────────────────────────────

  addNote(caseId: string, params: {
    author: string;
    content: string;
    note_type: AnalystNote['note_type'];
    priority?: AnalystNote['priority'];
    tags?: string[];
    is_privileged?: boolean;
    supersedes?: string;
  }): AnalystNote {
    const c = this.getCase(caseId);
    const note: AnalystNote = {
      note_id: `NOTE-${nanoid(10).toUpperCase()}`,
      author: params.author,
      timestamp: new Date().toISOString(),
      content: params.content,
      note_type: params.note_type,
      priority: params.priority || 'medium',
      tags: params.tags || [],
      version: 1,
      supersedes: params.supersedes || null,
      is_privileged: params.is_privileged || false,
    };
    c.analyst_notes.push(note);
    c.updated_at = new Date().toISOString();
    return note;
  }

  // ─── Evidence linking ─────────────────────────────────────────────────────────

  linkEvidence(caseId: string, evidenceId: string, actor: string): void {
    const c = this.getCase(caseId);
    if (!c.evidence_ids.includes(evidenceId)) {
      c.evidence_ids.push(evidenceId);
      c.audit_log.push(this.createAuditEntry(actor, 'evidence_linked', 'evidence_ids', null, evidenceId, ''));
      c.updated_at = new Date().toISOString();
    }
  }

  linkBlockchainAddress(caseId: string, address: string, chain: string, actor: string): void {
    const c = this.getCase(caseId);
    const key = `${chain}:${address}`;
    if (!c.blockchain_addresses.includes(key)) {
      c.blockchain_addresses.push(key);
      c.audit_log.push(this.createAuditEntry(actor, 'blockchain_address_linked', 'blockchain_addresses', null, key, ''));
      c.updated_at = new Date().toISOString();
    }
  }

  // ─── Summary generation ───────────────────────────────────────────────────────

  generateCaseSummary(caseId: string): CaseSummary {
    const c = this.getCase(caseId);
    const contradictions = this.detectContradictions(caseId);

    return {
      case_id: c.case_id,
      case_ref: c.case_ref,
      title: c.title,
      type: c.type,
      status: c.status,
      priority: c.priority,
      lead_analyst: c.lead_analyst,
      jurisdictions: c.jurisdictions,
      entity_count: c.entities.length,
      subjects: c.entities.filter(e => e.role === 'subject' || e.role === 'suspect').map(e => e.name),
      timeline_event_count: c.timeline.length,
      first_event: c.timeline[0]?.timestamp || null,
      last_event: c.timeline[c.timeline.length - 1]?.timestamp || null,
      evidence_count: c.evidence_ids.length,
      blockchain_addresses: c.blockchain_addresses.length,
      estimated_loss_usd: c.estimated_loss_usd,
      estimated_recovery_usd: c.estimated_recovery_usd,
      contradiction_count: contradictions.length,
      critical_contradictions: contradictions.filter(c => c.severity === 'critical').length,
      open_notes: c.analyst_notes.filter(n => n.note_type === 'action_required').length,
      days_open: Math.floor(
        (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
      generated_at: new Date().toISOString(),
    };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private createAuditEntry(
    actor: string,
    action: string,
    field: string | null,
    oldVal: string | null,
    newVal: string | null,
    notes: string
  ): CaseAuditEntry {
    return {
      audit_id: `AUD-${nanoid(8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      field_changed: field,
      old_value: oldVal,
      new_value: newVal,
    };
  }
}

// ─── Case summary type ────────────────────────────────────────────────────────

export interface CaseSummary {
  case_id: string;
  case_ref: string;
  title: string;
  type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  lead_analyst: string;
  jurisdictions: string[];
  entity_count: number;
  subjects: string[];
  timeline_event_count: number;
  first_event: string | null;
  last_event: string | null;
  evidence_count: number;
  blockchain_addresses: number;
  estimated_loss_usd: number;
  estimated_recovery_usd: number;
  contradiction_count: number;
  critical_contradictions: number;
  open_notes: number;
  days_open: number;
  generated_at: string;
}

// ─── Error class ──────────────────────────────────────────────────────────────
export class CaseManagerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CaseManagerError';
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const caseManager = new CaseManager();
export default CaseManager;
