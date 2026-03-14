-- ═══════════════════════════════════════════════════════════════════════
-- SUPABASE SCHEMA v5.0 — VeriTech-10 Universal Process Recording
-- Playbook Corporation Limited | ORB AI Platform
-- Date: 14 March 2026
-- Run AFTER: v2.sql + v3.sql + v4.sql
-- ═══════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────
-- V10 PROCESS RECORDS — Core table. APPEND-ONLY. Every process step.
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS v10_process_records (
  process_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  v10_cert_id         TEXT NOT NULL UNIQUE,
  v10_hash            TEXT,
  v10_cert_timestamp  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  v10_cert_status     TEXT NOT NULL DEFAULT 'PARTIAL'
                      CHECK (v10_cert_status IN ('PARTIAL','CERTIFIED','FAILED')),

  -- Process context
  process_type        TEXT NOT NULL,
  initiated_by        TEXT NOT NULL,
  actor_type          TEXT NOT NULL CHECK (actor_type IN ('HUMAN','AI_ENGINE','SYSTEM')),
  engine_id           TEXT,
  session_id          UUID NOT NULL,
  matter_id           TEXT,
  document_id         UUID REFERENCES document_records(document_id),
  jurisdiction        TEXT,
  repository          TEXT NOT NULL,

  -- Timing
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  duration_ms         INTEGER,

  -- Input/Output
  input_summary       TEXT NOT NULL,
  output_summary      TEXT NOT NULL DEFAULT 'PROCESS IN PROGRESS',
  input_hash          TEXT,
  output_hash         TEXT,

  -- Classification
  outcome             TEXT NOT NULL DEFAULT 'ROUTINE'
                      CHECK (outcome IN ('EVIDENTIAL','VALUABLE','REQUIRES_FOLLOW_UP','ANOMALY','ROUTINE')),
  intelligence_value  TEXT NOT NULL DEFAULT 'NONE'
                      CHECK (intelligence_value IN ('CRITICAL','HIGH','MEDIUM','LOW','NONE')),
  evidential_value    TEXT NOT NULL DEFAULT 'NONE'
                      CHECK (evidential_value IN ('COURT_READY_A1','COURT_READY_A2','SUPPORTING_B','BACKGROUND_C','NONE')),
  confidence_score    NUMERIC(5,2),

  -- Follow-up
  follow_up_required  BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_priority  TEXT NOT NULL DEFAULT 'NONE'
                      CHECK (follow_up_priority IN ('IMMEDIATE','WITHIN_24H','WITHIN_7D','SCHEDULED','NONE')),
  follow_up_nature    TEXT,
  follow_up_assigned_to TEXT,
  follow_up_deadline  TIMESTAMPTZ,

  -- Chain of custody
  previous_process_id UUID,
  linked_process_ids  UUID[] DEFAULT '{}',
  parent_session_id   UUID,

  -- V10 mandatory fields
  ai_involved         BOOLEAN NOT NULL DEFAULT FALSE,
  human_review_required BOOLEAN NOT NULL DEFAULT FALSE,
  human_review_completed BOOLEAN NOT NULL DEFAULT FALSE,
  sharp_ruling_disclosure TEXT NOT NULL,
  sealed              BOOLEAN NOT NULL DEFAULT TRUE,
  sealed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sealed_by_system    TEXT NOT NULL DEFAULT 'ORBIT-I-V10'
);

-- Append-only: no updates allowed to completed/certified records
CREATE OR REPLACE RULE v10_no_delete AS ON DELETE TO v10_process_records DO INSTEAD NOTHING;

-- Allow PARTIAL→CERTIFIED/FAILED updates only (in-progress records can be completed)
ALTER TABLE v10_process_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "v10_insert" ON v10_process_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "v10_select" ON v10_process_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "v10_update_partial_only" ON v10_process_records FOR UPDATE TO authenticated
  USING (v10_cert_status = 'PARTIAL')
  WITH CHECK (true);

-- Performance indexes
CREATE INDEX idx_v10_matter       ON v10_process_records(matter_id) WHERE matter_id IS NOT NULL;
CREATE INDEX idx_v10_document     ON v10_process_records(document_id) WHERE document_id IS NOT NULL;
CREATE INDEX idx_v10_outcome      ON v10_process_records(outcome);
CREATE INDEX idx_v10_session      ON v10_process_records(session_id);
CREATE INDEX idx_v10_cert_status  ON v10_process_records(v10_cert_status);
CREATE INDEX idx_v10_intelligence ON v10_process_records(intelligence_value) WHERE intelligence_value != 'NONE';
CREATE INDEX idx_v10_evidential   ON v10_process_records(evidential_value) WHERE evidential_value != 'NONE';
CREATE INDEX idx_v10_follow_up    ON v10_process_records(follow_up_priority) WHERE follow_up_required = TRUE;
CREATE INDEX idx_v10_process_type ON v10_process_records(process_type);
CREATE INDEX idx_v10_repository   ON v10_process_records(repository);
CREATE INDEX idx_v10_started      ON v10_process_records(started_at DESC);

-- ────────────────────────────────────────────────────────────────────────
-- FOLLOW-UP TASK QUEUE — auto-created for every non-ROUTINE process
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS v10_follow_up_tasks (
  task_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id          UUID NOT NULL REFERENCES v10_process_records(process_id),
  v10_cert_id         TEXT NOT NULL,
  matter_id           TEXT,
  priority            TEXT NOT NULL CHECK (priority IN ('IMMEDIATE','WITHIN_24H','WITHIN_7D','SCHEDULED')),
  nature              TEXT NOT NULL,
  assigned_to         TEXT NOT NULL DEFAULT 'HITL_QUEUE',
  deadline            TIMESTAMPTZ NOT NULL,
  status              TEXT NOT NULL DEFAULT 'OPEN'
                      CHECK (status IN ('OPEN','IN_PROGRESS','COMPLETED','ESCALATED','SUPERSEDED')),
  outcome             TEXT,
  intelligence_value  TEXT,
  resolution_notes    TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  completed_by        TEXT
);

ALTER TABLE v10_follow_up_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_all" ON v10_follow_up_tasks FOR ALL TO authenticated USING (true);

CREATE INDEX idx_tasks_open     ON v10_follow_up_tasks(priority, deadline) WHERE status = 'OPEN';
CREATE INDEX idx_tasks_matter   ON v10_follow_up_tasks(matter_id) WHERE matter_id IS NOT NULL;
CREATE INDEX idx_tasks_assigned ON v10_follow_up_tasks(assigned_to);

-- ────────────────────────────────────────────────────────────────────────
-- V10 PROCESS ALERTS — auto-raised for EVIDENTIAL and ANOMALY outcomes
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS v10_process_alerts (
  alert_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  v10_cert_id         TEXT NOT NULL,
  process_id          UUID NOT NULL REFERENCES v10_process_records(process_id),
  matter_id           TEXT,
  document_id         UUID,
  alert_type          TEXT NOT NULL CHECK (alert_type IN ('EVIDENTIAL','ANOMALY')),
  severity            TEXT NOT NULL CHECK (severity IN ('CRITICAL','HIGH','MEDIUM','LOW','NONE')),
  summary             TEXT NOT NULL,
  sharp_disclosure    TEXT NOT NULL,
  raised_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved            BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by         TEXT,
  resolved_at         TIMESTAMPTZ,
  resolution_action   TEXT
);

ALTER TABLE v10_process_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_all" ON v10_process_alerts FOR ALL TO authenticated USING (true);

CREATE INDEX idx_alerts_unresolved ON v10_process_alerts(severity, raised_at) WHERE resolved = FALSE;
CREATE INDEX idx_alerts_matter     ON v10_process_alerts(matter_id) WHERE matter_id IS NOT NULL;

-- ────────────────────────────────────────────────────────────────────────
-- V10 INTELLIGENCE REGISTER — valuable findings stored permanently
-- Separate from process records — this is the distilled intelligence
-- ────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS v10_intelligence_register (
  intel_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  v10_cert_id         TEXT NOT NULL UNIQUE,
  source_process_id   UUID NOT NULL REFERENCES v10_process_records(process_id),
  matter_id           TEXT,
  subject_names       TEXT[] DEFAULT '{}',
  subject_entities    JSONB DEFAULT '[]',
  intelligence_value  TEXT NOT NULL,
  evidential_value    TEXT NOT NULL,
  summary             TEXT NOT NULL,
  detail              JSONB DEFAULT '{}',
  tags                TEXT[] DEFAULT '{}',
  jurisdiction        TEXT,
  related_intel_ids   UUID[] DEFAULT '{}',
  registered_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registered_by       TEXT NOT NULL DEFAULT 'ORBIT-I-V10',
  -- Soft archive only — never delete
  archived            BOOLEAN NOT NULL DEFAULT FALSE,
  archived_reason     TEXT
);

ALTER TABLE v10_intelligence_register ENABLE ROW LEVEL SECURITY;
CREATE POLICY "intel_all" ON v10_intelligence_register FOR ALL TO authenticated USING (true);
CREATE INDEX idx_intel_matter   ON v10_intelligence_register(matter_id) WHERE matter_id IS NOT NULL;
CREATE INDEX idx_intel_subjects ON v10_intelligence_register USING GIN(subject_names);
CREATE INDEX idx_intel_tags     ON v10_intelligence_register USING GIN(tags);
CREATE INDEX idx_intel_value    ON v10_intelligence_register(intelligence_value, evidential_value);

-- ────────────────────────────────────────────────────────────────────────
-- COMPLIANCE DASHBOARD VIEW — updated to include V10 stats
-- ────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v10_compliance_dashboard AS
SELECT
  -- V10 Process Summary
  (SELECT COUNT(*) FROM v10_process_records WHERE v10_cert_status = 'CERTIFIED') AS v10_certified_records,
  (SELECT COUNT(*) FROM v10_process_records WHERE v10_cert_status = 'PARTIAL')   AS v10_in_progress,
  (SELECT COUNT(*) FROM v10_process_records WHERE v10_cert_status = 'FAILED')    AS v10_failed,
  (SELECT COUNT(*) FROM v10_process_records WHERE outcome = 'EVIDENTIAL')        AS evidential_findings,
  (SELECT COUNT(*) FROM v10_process_records WHERE outcome = 'VALUABLE')          AS valuable_findings,
  (SELECT COUNT(*) FROM v10_process_records WHERE outcome = 'ANOMALY')           AS anomalies,
  -- Follow-up Queue
  (SELECT COUNT(*) FROM v10_follow_up_tasks WHERE status = 'OPEN' AND priority = 'IMMEDIATE') AS immediate_tasks,
  (SELECT COUNT(*) FROM v10_follow_up_tasks WHERE status = 'OPEN' AND deadline < NOW())       AS overdue_tasks,
  (SELECT COUNT(*) FROM v10_follow_up_tasks WHERE status = 'OPEN')                            AS total_open_tasks,
  -- Alerts
  (SELECT COUNT(*) FROM v10_process_alerts WHERE resolved = FALSE AND alert_type = 'EVIDENTIAL') AS unresolved_evidential_alerts,
  (SELECT COUNT(*) FROM v10_process_alerts WHERE resolved = FALSE AND alert_type = 'ANOMALY')    AS unresolved_anomaly_alerts,
  -- Intelligence Register
  (SELECT COUNT(*) FROM v10_intelligence_register WHERE archived = FALSE)                        AS active_intelligence_records,
  -- Pipeline (from v4 view)
  (SELECT COUNT(*) FROM document_records WHERE state = 'awaiting_verification') AS awaiting_verification,
  (SELECT COUNT(*) FROM document_records WHERE state = 'escalated')             AS escalated_open,
  NOW() AS generated_at;
