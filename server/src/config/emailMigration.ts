/**
 * Email Processing Database Migration
 * Creates tables for email bill processing and reference code tracking
 */

export const emailMigrationSQL = `
-- ========================================
-- REFERENCE CODES TABLE
-- ========================================
-- Stores customer reference codes for email bill submissions
CREATE TABLE IF NOT EXISTS reference_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  customer_id VARCHAR(100) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  project_id VARCHAR(100) NOT NULL REFERENCES audit_projects(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NULL,
  
  -- Index for fast lookups
  CONSTRAINT idx_reference_code_lookup UNIQUE (code, active)
);

CREATE INDEX IF NOT EXISTS idx_reference_codes_customer ON reference_codes(customer_id);
CREATE INDEX IF NOT EXISTS idx_reference_codes_project ON reference_codes(project_id);
CREATE INDEX IF NOT EXISTS idx_reference_codes_active ON reference_codes(active, expires_at);


-- ========================================
-- EMAIL LOGS TABLE
-- ========================================
-- Tracks all processed emails and their outcomes
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  email_id VARCHAR(100) UNIQUE NOT NULL,
  customer_id VARCHAR(100) REFERENCES customers(id) ON DELETE SET NULL,
  project_id VARCHAR(100) REFERENCES audit_projects(id) ON DELETE SET NULL,
  reference_code VARCHAR(50),
  from_email VARCHAR(255) NOT NULL,
  subject TEXT,
  attachments_count INTEGER DEFAULT 0,
  processed_bills JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'pending', -- pending, success, error, no_reference, invalid_reference
  error_message TEXT,
  received_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key (optional - may be NULL if reference invalid)
  CONSTRAINT fk_email_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_email_project FOREIGN KEY (project_id) REFERENCES audit_projects(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_email_logs_customer ON email_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_project ON email_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_reference ON email_logs(reference_code);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_processed_at ON email_logs(processed_at DESC);


-- ========================================
-- EMAIL PROCESSING STATISTICS
-- ========================================
-- Aggregate view of email processing stats per customer
CREATE OR REPLACE VIEW email_processing_stats AS
SELECT
  customer_id,
  COUNT(*) as total_emails,
  COUNT(*) FILTER (WHERE status = 'success') as successful_emails,
  COUNT(*) FILTER (WHERE status = 'error') as failed_emails,
  COUNT(*) FILTER (WHERE status = 'no_reference') as no_reference_emails,
  COUNT(*) FILTER (WHERE status = 'invalid_reference') as invalid_reference_emails,
  SUM(attachments_count) as total_attachments,
  SUM(jsonb_array_length(processed_bills)) as total_bills_processed,
  MIN(processed_at) as first_email_date,
  MAX(processed_at) as last_email_date
FROM email_logs
WHERE customer_id IS NOT NULL
GROUP BY customer_id;


-- ========================================
-- REFERENCE CODE USAGE VIEW
-- ========================================
-- Track reference code usage and email activity
CREATE OR REPLACE VIEW reference_code_usage AS
SELECT
  rc.code,
  rc.customer_id,
  c.name as customer_name,
  rc.project_id,
  rc.active,
  rc.created_at,
  rc.expires_at,
  COUNT(el.id) as emails_received,
  SUM(el.attachments_count) as total_attachments,
  SUM(jsonb_array_length(el.processed_bills)) as total_bills,
  MAX(el.processed_at) as last_used_at
FROM reference_codes rc
LEFT JOIN customers c ON c.id = rc.customer_id
LEFT JOIN email_logs el ON el.reference_code = rc.code
GROUP BY rc.code, rc.customer_id, c.name, rc.project_id, rc.active, rc.created_at, rc.expires_at;


-- ========================================
-- AUDIT TRAIL FOR REFERENCE CODES
-- ========================================
-- Track when reference codes are created/deactivated
CREATE TABLE IF NOT EXISTS reference_code_audit (
  id SERIAL PRIMARY KEY,
  reference_code VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'created', 'deactivated', 'expired', 'used'
  performed_by VARCHAR(100), -- User ID if applicable
  performed_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_reference_audit_code ON reference_code_audit(reference_code);
CREATE INDEX IF NOT EXISTS idx_reference_audit_action ON reference_code_audit(action);
CREATE INDEX IF NOT EXISTS idx_reference_audit_performed_at ON reference_code_audit(performed_at DESC);


-- ========================================
-- TRIGGER: Log reference code creation
-- ========================================
CREATE OR REPLACE FUNCTION log_reference_code_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reference_code_audit (reference_code, action, metadata)
  VALUES (
    NEW.code,
    'created',
    jsonb_build_object(
      'customer_id', NEW.customer_id,
      'project_id', NEW.project_id,
      'expires_at', NEW.expires_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_reference_creation ON reference_codes;
CREATE TRIGGER trigger_log_reference_creation
  AFTER INSERT ON reference_codes
  FOR EACH ROW
  EXECUTE FUNCTION log_reference_code_creation();


-- ========================================
-- TRIGGER: Log reference code deactivation
-- ========================================
CREATE OR REPLACE FUNCTION log_reference_code_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.active = true AND NEW.active = false THEN
    INSERT INTO reference_code_audit (reference_code, action, metadata)
    VALUES (
      NEW.code,
      'deactivated',
      jsonb_build_object('reason', 'manual_deactivation')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_reference_deactivation ON reference_codes;
CREATE TRIGGER trigger_log_reference_deactivation
  AFTER UPDATE ON reference_codes
  FOR EACH ROW
  EXECUTE FUNCTION log_reference_code_deactivation();


-- ========================================
-- FUNCTION: Auto-expire reference codes
-- ========================================
-- Function to automatically deactivate expired reference codes
CREATE OR REPLACE FUNCTION expire_old_reference_codes()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  WITH expired AS (
    UPDATE reference_codes
    SET active = false, updated_at = NOW()
    WHERE active = true
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
    RETURNING code
  )
  INSERT INTO reference_code_audit (reference_code, action, metadata)
  SELECT code, 'expired', '{"reason": "automatic_expiration"}'::jsonb
  FROM expired;
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;


-- ========================================
-- SCHEDULED JOB: Expire reference codes daily
-- ========================================
-- Note: This requires pg_cron extension
-- Run: CREATE EXTENSION IF NOT EXISTS pg_cron;
-- Then: SELECT cron.schedule('expire-reference-codes', '0 2 * * *', 'SELECT expire_old_reference_codes()');


-- ========================================
-- SAMPLE DATA (for development/testing)
-- ========================================
-- Uncomment to insert sample reference codes

-- INSERT INTO reference_codes (code, customer_id, project_id, expires_at)
-- SELECT
--   'FOXLITE-' || substring(md5(random()::text) from 1 for 8),
--   'CUST-001',
--   'PROJ-001',
--   NOW() + interval '90 days'
-- WHERE NOT EXISTS (SELECT 1 FROM reference_codes LIMIT 1);

`;

export default emailMigrationSQL;
