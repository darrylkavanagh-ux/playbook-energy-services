-- ORB AI PLATFORM — SUPABASE SCHEMA v4.0
-- Date: 14 March 2026
-- New: Two-lane architecture tables, retention, GDPR, compliance
-- Run after: supabase_schema_v2.sql + supabase_schema_v3.sql

-- ════════════════════════════════════════════════
-- RSS ARTICLE QUEUE — Editor Approval Gate
-- (Waterford Post + Cardiff Post)
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS rss_article_queue (
  article_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_url TEXT NOT NULL,
  article_url TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  body_text TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  source_name TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'PENDING_EDITOR_REVIEW'
    CHECK (status IN ('PENDING_EDITOR_REVIEW','APPROVED_BY_EDITOR','REJECTED_BY_EDITOR')),
  lane TEXT NOT NULL DEFAULT 'AI_ENRICHMENT',
  document_id UUID REFERENCES document_records(document_id),
  editor_id TEXT,
  rejection_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rss_queue_status ON rss_article_queue(status);
CREATE INDEX idx_rss_queue_source ON rss_article_queue(source_name);

-- ════════════════════════════════════════════════
-- SAR DRAFTS — ML-generated, MLRO sign-off required
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sar_drafts (
  draft_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id TEXT NOT NULL,
  jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('GB','IE','GB-NI')),
  reporting_entity TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  subject_identifiers JSONB DEFAULT '{}',
  suspected_offences TEXT[] DEFAULT '{}',
  grounds_for_suspicion TEXT NOT NULL,
  evidence_summary TEXT,
  supporting_document_ids UUID[] DEFAULT '{}',
  ai_confidence NUMERIC(5,2),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'AI_DRAFT'
    CHECK (status IN ('AI_DRAFT','UNDER_MLRO_REVIEW','MLRO_APPROVED','SUBMITTED','REJECTED')),
  mlro_sign_off JSONB,
  submission_ref TEXT UNIQUE,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sar_status ON sar_drafts(status);
CREATE INDEX idx_sar_matter ON sar_drafts(matter_id);

-- ════════════════════════════════════════════════
-- SAR SUBMISSION LOG — PERMANENT (POCA 2002)
-- NO DELETE POLICY
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sar_submission_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES sar_drafts(draft_id),
  submission_ref TEXT NOT NULL UNIQUE,
  jurisdiction TEXT NOT NULL,
  reporting_body TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  mlro_id TEXT NOT NULL,
  mlro_name TEXT NOT NULL,
  mlro_authorisation_ref TEXT NOT NULL,
  supporting_documents UUID[] DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- NO updated_at — this record is immutable
);

ALTER TABLE sar_submission_log ENABLE ROW LEVEL SECURITY;
-- INSERT only — NO UPDATE, NO DELETE (POCA 2002 requirement)
CREATE POLICY "sar_log_insert_only" ON sar_submission_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- ════════════════════════════════════════════════
-- GDPR REQUESTS — Right to Access/Erasure/Rectification
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS gdpr_requests (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_subject_name TEXT NOT NULL,
  data_subject_email TEXT,
  request_type TEXT NOT NULL CHECK (request_type IN ('ERASURE','ACCESS','RECTIFICATION','PORTABILITY')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  requestor_id TEXT NOT NULL,
  grounds TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','IN_PROGRESS','COMPLETED','REJECTED')),
  deadline TIMESTAMPTZ NOT NULL,
  erasable JSONB DEFAULT '[]',
  exempt JSONB DEFAULT '[]',
  response_letter TEXT,
  completed_at TIMESTAMPTZ,
  completed_by TEXT
);

CREATE INDEX idx_gdpr_deadline ON gdpr_requests(deadline) WHERE status = 'PENDING';

-- ════════════════════════════════════════════════
-- ARCHIVED RECORDS — GDPR retention archive
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS archived_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_table TEXT NOT NULL,
  record JSONB NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  archived_by TEXT DEFAULT 'SYSTEM:GDPR_RETENTION'
);

-- ════════════════════════════════════════════════
-- INTERNAL ALERTS — Phase 4 low/medium alerts
-- ════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS internal_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES anti_fraud_assessments(assessment_id),
  document_id UUID REFERENCES document_records(document_id),
  tier TEXT NOT NULL CHECK (tier IN ('low','medium')),
  summary TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_unresolved ON internal_alerts(tier) WHERE resolved = FALSE;

-- ════════════════════════════════════════════════
-- ENABLE RLS ON NEW TABLES
-- ════════════════════════════════════════════════
ALTER TABLE rss_article_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE sar_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_alerts ENABLE ROW LEVEL SECURITY;

-- ════════════════════════════════════════════════
-- COMPLIANCE VIEW — Dashboard query helper
-- ════════════════════════════════════════════════
CREATE OR REPLACE VIEW compliance_dashboard AS
SELECT
  (SELECT COUNT(*) FROM document_records WHERE state = 'awaiting_verification') AS awaiting_verification,
  (SELECT COUNT(*) FROM document_records WHERE state = 'escalated') AS escalated_open,
  (SELECT COUNT(*) FROM anti_fraud_assessments WHERE alert_tier = 'high' AND hitl_decision IS NULL) AS high_alerts_open,
  (SELECT COUNT(*) FROM sar_drafts WHERE status = 'MLRO_APPROVED') AS sars_pending_submission,
  (SELECT COUNT(*) FROM sar_drafts WHERE status = 'SUBMITTED' AND submitted_at > NOW() - INTERVAL '30 days') AS sars_submitted_30d,
  (SELECT COUNT(*) FROM gdpr_requests WHERE status = 'PENDING') AS gdpr_requests_pending,
  (SELECT COUNT(*) FROM gdpr_requests WHERE status = 'PENDING' AND deadline < NOW()) AS gdpr_requests_overdue,
  (SELECT COUNT(*) FROM verifier_profiles WHERE current_trust_score < 60) AS verifiers_below_threshold,
  (SELECT ROUND(AVG(current_trust_score), 1) FROM verifier_profiles) AS avg_verifier_trust_score,
  NOW() AS generated_at;
