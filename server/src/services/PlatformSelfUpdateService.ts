/**
 * PLATFORM SELF-UPDATE SERVICE
 * =============================================================================
 * Manages the platform's self-improvement queue with mandatory human authorization.
 *
 * DESIGN PRINCIPLE:
 *   The platform can PROPOSE updates autonomously based on observed performance.
 *   NO update is APPLIED without explicit authorization from Darryl.
 *   Every approval/rejection is permanently logged with full audit trail.
 *
 * WORKFLOW:
 *   1. Platform (or AI agent) proposes an update → queued as PENDING
 *   2. Notification sent (webhook/log) → Darryl reviews
 *   3. Darryl approves (POST /api/v10/updates/:id/approve?approver=Darryl)
 *      OR rejects  (POST /api/v10/updates/:id/reject?approver=Darryl&reason=...)
 *   4. If APPROVED → update is marked AUTHORIZED (still requires manual deployment)
 *   5. If REJECTED → update is archived with reason
 *
 * SELF-IMPROVEMENT TRIGGERS:
 *   - Feature with V10 score < 98.5% → platform suggests fix
 *   - Calibration ECE > threshold → platform suggests recalibration parameters
 *   - Signal win rate drops → platform suggests strategy adjustment
 *   - External API failure rate > 10% → platform suggests alternative data source
 *
 * SECURITY:
 *   - Only one authorized approver: the AUTHORIZED_APPROVER constant
 *   - All actions logged with timestamp and SHA-256 hash
 *   - Updates are PROPOSALS only — actual deployment always manual
 */

import { createHash } from 'crypto';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { AUTHORIZED_APPROVER } from './V10ComplianceGate.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type UpdateStatus =
  | 'PENDING'      // Awaiting human review
  | 'AUTHORIZED'   // Approved by Darryl — ready to deploy
  | 'REJECTED'     // Rejected by Darryl
  | 'DEPLOYED'     // Confirmed deployed
  | 'ROLLED_BACK'  // Deployed but rolled back
  | 'EXPIRED';     // 30-day window elapsed without action

export type UpdateCategory =
  | 'ACCURACY'       // Signal accuracy improvement
  | 'CALIBRATION'    // Calibration model update
  | 'DATA_SOURCE'    // New/replacement data source
  | 'PERFORMANCE'    // System performance optimisation
  | 'SECURITY'       // Security patch or hardening
  | 'FEATURE'        // New feature addition
  | 'BUGFIX'         // Bug fix
  | 'CONFIGURATION'; // Config/parameter tuning

export type ImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PlatformUpdate {
  id:               string;
  title:            string;
  description:      string;
  category:         UpdateCategory;
  impact:           ImpactLevel;
  status:           UpdateStatus;
  proposer:         string;          // 'SYSTEM', 'AI_AGENT', or user ID
  target_feature:   string;          // Feature ID from V10 registry
  proposed_change:  string;          // Technical description of the change
  expected_benefit: string;          // Quantified expected improvement
  risk_assessment:  string;          // Risks and mitigation
  proposed_at:      string;
  reviewed_at:      string | null;
  reviewed_by:      string | null;
  review_notes:     string | null;
  deployed_at:      string | null;
  expires_at:       string;          // Auto-expires after 30 days
  data_hash:        string;          // SHA-256 of update content
  audit_trail:      AuditEntry[];
}

export interface AuditEntry {
  action:     string;
  actor:      string;
  timestamp:  string;
  notes:      string;
  hash:       string;
}

export interface ProposeUpdateInput {
  title:            string;
  description:      string;
  category:         UpdateCategory;
  impact:           ImpactLevel;
  target_feature:   string;
  proposed_change:  string;
  expected_benefit: string;
  risk_assessment:  string;
  proposer?:        string;
}

export interface AuthorizationResult {
  success:    boolean;
  update_id:  string;
  new_status: UpdateStatus;
  message:    string;
  authorized_by?: string;
}

export interface UpdateQueueSummary {
  total:       number;
  pending:     number;
  authorized:  number;
  rejected:    number;
  deployed:    number;
  expired:     number;
  oldest_pending_days: number | null;
}

// ── PlatformSelfUpdateService ─────────────────────────────────────────────────

export class PlatformSelfUpdateService {

  private updates = new Map<string, PlatformUpdate>();
  private persistPath: string;

  constructor() {
    this.persistPath = path.resolve(process.cwd(), 'data', 'platform_updates.json');
    this.loadState();
    this.sweepExpired();
  }

  // ── Proposal Submission ─────────────────────────────────────────────────────

  /**
   * Propose a new platform update.
   * All proposals are PENDING by default — no update is applied automatically.
   */
  propose(input: ProposeUpdateInput): PlatformUpdate {
    const id      = this.generateId();
    const now     = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const update: PlatformUpdate = {
      id,
      title:            input.title,
      description:      input.description,
      category:         input.category,
      impact:           input.impact,
      status:           'PENDING',
      proposer:         input.proposer || 'SYSTEM',
      target_feature:   input.target_feature,
      proposed_change:  input.proposed_change,
      expected_benefit: input.expected_benefit,
      risk_assessment:  input.risk_assessment,
      proposed_at:      now.toISOString(),
      reviewed_at:      null,
      reviewed_by:      null,
      review_notes:     null,
      deployed_at:      null,
      expires_at:       expires.toISOString(),
      data_hash:        '',
      audit_trail:      [],
    };

    update.data_hash = this.hashUpdate(update);
    this.addAudit(update, 'PROPOSED', update.proposer, `Update proposed: ${input.title}`);
    this.updates.set(id, update);
    this.saveState();

    console.log(`[PlatformSelfUpdate] New update queued: ${id} — "${input.title}" — awaiting ${AUTHORIZED_APPROVER} authorization`);

    return update;
  }

  // ── Authorization ──────────────────────────────────────────────────────────

  /**
   * Authorize (approve) a pending update.
   * ONLY Darryl can authorize.
   */
  authorize(
    updateId: string,
    approver: string,
    notes?:   string,
  ): AuthorizationResult {
    // Security check — only authorized approver can approve
    if (approver !== AUTHORIZED_APPROVER) {
      return {
        success:    false,
        update_id:  updateId,
        new_status: 'PENDING',
        message:    `Authorization denied. Only '${AUTHORIZED_APPROVER}' can authorize platform updates. Provided: '${approver}'.`,
      };
    }

    const update = this.updates.get(updateId);
    if (!update) {
      return {
        success:    false,
        update_id:  updateId,
        new_status: 'PENDING',
        message:    `Update ${updateId} not found.`,
      };
    }

    if (update.status !== 'PENDING') {
      return {
        success:    false,
        update_id:  updateId,
        new_status: update.status,
        message:    `Update ${updateId} is already in status '${update.status}'. Only PENDING updates can be authorized.`,
      };
    }

    if (new Date(update.expires_at) < new Date()) {
      update.status = 'EXPIRED';
      this.saveState();
      return {
        success:    false,
        update_id:  updateId,
        new_status: 'EXPIRED',
        message:    `Update ${updateId} has expired. Please submit a new proposal.`,
      };
    }

    update.status       = 'AUTHORIZED';
    update.reviewed_at  = new Date().toISOString();
    update.reviewed_by  = approver;
    update.review_notes = notes || 'Authorized by ' + approver;
    update.data_hash    = this.hashUpdate(update);

    this.addAudit(update, 'AUTHORIZED', approver, notes || `Authorized by ${approver}`);
    this.saveState();

    console.log(`[PlatformSelfUpdate] ✅ Update AUTHORIZED: ${updateId} — "${update.title}" by ${approver}`);

    return {
      success:       true,
      update_id:     updateId,
      new_status:    'AUTHORIZED',
      message:       `Update '${update.title}' authorized by ${approver}. Ready for deployment.`,
      authorized_by: approver,
    };
  }

  /**
   * Reject a pending update.
   * ONLY Darryl can reject.
   */
  reject(
    updateId: string,
    approver: string,
    reason:   string,
  ): AuthorizationResult {
    if (approver !== AUTHORIZED_APPROVER) {
      return {
        success:    false,
        update_id:  updateId,
        new_status: 'PENDING',
        message:    `Rejection denied. Only '${AUTHORIZED_APPROVER}' can reject platform updates.`,
      };
    }

    const update = this.updates.get(updateId);
    if (!update || update.status !== 'PENDING') {
      return {
        success:    false,
        update_id:  updateId,
        new_status: update?.status || 'PENDING',
        message:    `Update ${updateId} not found or not in PENDING state.`,
      };
    }

    update.status       = 'REJECTED';
    update.reviewed_at  = new Date().toISOString();
    update.reviewed_by  = approver;
    update.review_notes = reason;
    update.data_hash    = this.hashUpdate(update);

    this.addAudit(update, 'REJECTED', approver, `Rejected: ${reason}`);
    this.saveState();

    console.log(`[PlatformSelfUpdate] ❌ Update REJECTED: ${updateId} — "${update.title}" by ${approver}: ${reason}`);

    return {
      success:    true,
      update_id:  updateId,
      new_status: 'REJECTED',
      message:    `Update rejected. Reason: ${reason}`,
    };
  }

  /** Mark an authorized update as deployed */
  markDeployed(updateId: string, actor: string): AuthorizationResult {
    const update = this.updates.get(updateId);
    if (!update || update.status !== 'AUTHORIZED') {
      return {
        success:    false,
        update_id:  updateId,
        new_status: update?.status || 'PENDING',
        message:    `Update ${updateId} must be AUTHORIZED before marking as deployed.`,
      };
    }

    update.status      = 'DEPLOYED';
    update.deployed_at = new Date().toISOString();
    update.data_hash   = this.hashUpdate(update);

    this.addAudit(update, 'DEPLOYED', actor, `Deployed by ${actor}`);
    this.saveState();

    return {
      success:    true,
      update_id:  updateId,
      new_status: 'DEPLOYED',
      message:    `Update '${update.title}' marked as deployed.`,
    };
  }

  // ── Self-Improvement Proposals ─────────────────────────────────────────────

  /**
   * Analyse V10 scores and auto-propose improvements for features below threshold.
   * These are PROPOSALS only — Darryl must authorize before anything changes.
   */
  proposeFromV10Gaps(features: Array<{ id: string; name: string; score: number; status: string; notes: string }>): PlatformUpdate[] {
    const newProposals: PlatformUpdate[] = [];

    for (const feature of features) {
      if (feature.status !== 'PENDING') continue;
      if (feature.score >= 98.5) continue;

      // Don't re-propose if already pending
      const existing = Array.from(this.updates.values()).find(
        u => u.target_feature === feature.id && u.status === 'PENDING',
      );
      if (existing) continue;

      const gap = (98.5 - feature.score).toFixed(1);

      const proposal = this.propose({
        title:            `V10 Gap Fix: ${feature.name}`,
        description:      `Feature ${feature.id} (${feature.name}) is ${gap}% below V10 threshold. Auto-proposed improvement to close the gap.`,
        category:         'FEATURE',
        impact:           feature.score < 50 ? 'HIGH' : 'MEDIUM',
        target_feature:   feature.id,
        proposed_change:  `Review implementation, add unit tests and integration tests, submit MANUAL_REVIEW evidence. Current notes: ${feature.notes}`,
        expected_benefit: `+${gap}% V10 score for ${feature.name}. Moves status from PENDING to CERTIFIED.`,
        risk_assessment:  'Low risk — evidence submission only. No code changes required for basic certification.',
        proposer:         'AI_AGENT',
      });

      newProposals.push(proposal);
    }

    return newProposals;
  }

  // ── Query Methods ───────────────────────────────────────────────────────────

  getUpdate(id: string): PlatformUpdate | undefined {
    return this.updates.get(id);
  }

  getAll(): PlatformUpdate[] {
    return Array.from(this.updates.values()).sort(
      (a, b) => new Date(b.proposed_at).getTime() - new Date(a.proposed_at).getTime(),
    );
  }

  getPending(): PlatformUpdate[] {
    return this.getAll().filter(u => u.status === 'PENDING');
  }

  getAuthorized(): PlatformUpdate[] {
    return this.getAll().filter(u => u.status === 'AUTHORIZED');
  }

  getSummary(): UpdateQueueSummary {
    const all       = this.getAll();
    const pending   = all.filter(u => u.status === 'PENDING');
    const now       = Date.now();

    let oldestPendingDays: number | null = null;
    if (pending.length > 0) {
      const oldest = Math.min(...pending.map(u => new Date(u.proposed_at).getTime()));
      oldestPendingDays = Math.floor((now - oldest) / (24 * 60 * 60 * 1000));
    }

    return {
      total:               all.length,
      pending:             pending.length,
      authorized:          all.filter(u => u.status === 'AUTHORIZED').length,
      rejected:            all.filter(u => u.status === 'REJECTED').length,
      deployed:            all.filter(u => u.status === 'DEPLOYED').length,
      expired:             all.filter(u => u.status === 'EXPIRED').length,
      oldest_pending_days: oldestPendingDays,
    };
  }

  // ── Expiry Sweep ────────────────────────────────────────────────────────────

  private sweepExpired(): void {
    let count = 0;
    for (const update of this.updates.values()) {
      if (update.status === 'PENDING' && new Date(update.expires_at) < new Date()) {
        update.status = 'EXPIRED';
        this.addAudit(update, 'EXPIRED', 'SYSTEM', 'Auto-expired after 30 days without review');
        count++;
      }
    }
    if (count > 0) this.saveState();
  }

  // ── Audit Trail ─────────────────────────────────────────────────────────────

  private addAudit(update: PlatformUpdate, action: string, actor: string, notes: string): void {
    const entry: AuditEntry = {
      action,
      actor,
      timestamp: new Date().toISOString(),
      notes,
      hash:      createHash('sha256').update(`${action}:${actor}:${notes}:${Date.now()}`).digest('hex').slice(0, 8),
    };
    update.audit_trail.push(entry);
  }

  // ── Utilities ───────────────────────────────────────────────────────────────

  private generateId(): string {
    const ts     = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).toUpperCase().slice(2, 6);
    return `UPD-${ts}-${random}`;
  }

  private hashUpdate(update: PlatformUpdate): string {
    const data = JSON.stringify({
      id:       update.id,
      title:    update.title,
      status:   update.status,
      proposer: update.proposer,
      proposed: update.proposed_at,
    });
    return createHash('sha256').update(data).digest('hex').slice(0, 12).toUpperCase();
  }

  // ── Persistence ─────────────────────────────────────────────────────────────

  private saveState(): void {
    try {
      const state: Record<string, PlatformUpdate> = {};
      for (const [id, u] of this.updates.entries()) {
        state[id] = u;
      }
      writeFileSync(this.persistPath, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // data/ may not exist in CI
    }
  }

  private loadState(): void {
    try {
      if (existsSync(this.persistPath)) {
        const raw   = readFileSync(this.persistPath, 'utf-8');
        const state = JSON.parse(raw) as Record<string, PlatformUpdate>;
        for (const [id, u] of Object.entries(state)) {
          this.updates.set(id, u);
        }
      }
    } catch {
      // Start fresh
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

export const selfUpdate = new PlatformSelfUpdateService();
export default selfUpdate;
