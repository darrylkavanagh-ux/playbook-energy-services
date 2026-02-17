/**
 * COURT-READY DATABASE EXTENSIONS
 * Priority 1 additions for court-admissible evidence and prosecution bundles
 * 
 * These tables enable:
 * - Unbreakable chain of custody
 * - Evidence authentication and verification
 * - Prosecution bundle generation
 * - Legal citation tracking
 * - Expert witness compliance
 */

import { query } from './database';

/**
 * Initialize court-ready database extensions
 */
export async function initCourtReadyDatabase() {
  try {
    console.log('⚖️  Initializing Court-Ready Database Extensions...');

    // 1. EVIDENCE CUSTODY CHAIN
    // Unbreakable chain of custody with cryptographic proof
    await query(`
      CREATE TABLE IF NOT EXISTS evidence_custody_chain (
        id SERIAL PRIMARY KEY,
        custody_id VARCHAR(50) UNIQUE NOT NULL,
        evidence_id VARCHAR(50) NOT NULL,
        document_id VARCHAR(50) REFERENCES forensic_documents(document_id),
        custody_from VARCHAR(255) NOT NULL,
        custody_to VARCHAR(255) NOT NULL,
        transfer_datetime TIMESTAMP NOT NULL,
        transfer_location VARCHAR(500),
        transfer_reason TEXT,
        transfer_method VARCHAR(100),
        evidence_condition VARCHAR(100),
        evidence_hash_before VARCHAR(128) NOT NULL,
        evidence_hash_after VARCHAR(128) NOT NULL,
        digital_signature TEXT,
        witness_name VARCHAR(255),
        witness_signature TEXT,
        seal_number VARCHAR(100),
        seal_intact BOOLEAN DEFAULT TRUE,
        contamination_detected BOOLEAN DEFAULT FALSE,
        authentication_passed BOOLEAN DEFAULT TRUE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. EVIDENCE AUTHENTICATION
    // Digital forensics and document verification
    await query(`
      CREATE TABLE IF NOT EXISTS evidence_authentication (
        id SERIAL PRIMARY KEY,
        auth_id VARCHAR(50) UNIQUE NOT NULL,
        evidence_id VARCHAR(50) NOT NULL,
        document_id VARCHAR(50) REFERENCES forensic_documents(document_id),
        authentication_type VARCHAR(100) NOT NULL,
        authentication_method VARCHAR(255) NOT NULL,
        authenticated_by VARCHAR(255) NOT NULL,
        authentication_datetime TIMESTAMP NOT NULL,
        authentication_result VARCHAR(50) CHECK (authentication_result IN ('AUTHENTIC', 'ALTERED', 'FORGED', 'INCONCLUSIVE')),
        confidence_score DECIMAL(5, 4),
        file_hash VARCHAR(128),
        file_signature VARCHAR(255),
        metadata_extracted JSONB,
        exif_data JSONB,
        creation_timestamp TIMESTAMP,
        modification_timestamp TIMESTAMP,
        access_timestamp TIMESTAMP,
        author_detected VARCHAR(255),
        software_detected VARCHAR(255),
        anomalies_detected TEXT[],
        verification_steps JSONB,
        expert_notes TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. EVIDENCE EXHIBITS
    // Exhibit numbering and tracking for court submissions
    await query(`
      CREATE TABLE IF NOT EXISTS evidence_exhibits (
        id SERIAL PRIMARY KEY,
        exhibit_id VARCHAR(50) UNIQUE NOT NULL,
        exhibit_number VARCHAR(50) UNIQUE NOT NULL,
        exhibit_type VARCHAR(100) NOT NULL,
        document_id VARCHAR(50) REFERENCES forensic_documents(document_id),
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        exhibit_description TEXT NOT NULL,
        exhibit_date DATE,
        exhibit_author VARCHAR(255),
        exhibit_source VARCHAR(255),
        relevance TEXT,
        probative_value VARCHAR(50) CHECK (probative_value IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        admissibility_status VARCHAR(50) CHECK (admissibility_status IN ('PENDING', 'ADMITTED', 'EXCLUDED', 'CONTESTED')),
        objections TEXT[],
        referenced_in_pleadings TEXT[],
        referenced_in_statements TEXT[],
        page_references TEXT[],
        cross_referenced_exhibits TEXT[],
        file_path TEXT,
        file_size BIGINT,
        bundle_inclusion BOOLEAN DEFAULT TRUE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. LEGAL PRECEDENTS
    // Case law database for citation
    await query(`
      CREATE TABLE IF NOT EXISTS legal_precedents (
        id SERIAL PRIMARY KEY,
        precedent_id VARCHAR(50) UNIQUE NOT NULL,
        case_name VARCHAR(500) NOT NULL,
        case_citation VARCHAR(255) UNIQUE NOT NULL,
        jurisdiction VARCHAR(100) NOT NULL,
        court_level VARCHAR(100) NOT NULL,
        court_name VARCHAR(255),
        decision_date DATE,
        judge_names TEXT[],
        case_summary TEXT,
        legal_issues TEXT[],
        key_holdings TEXT[],
        ratio_decidendi TEXT,
        obiter_dicta TEXT,
        applied_statutes TEXT[],
        distinguished_cases TEXT[],
        followed_cases TEXT[],
        overruled_cases TEXT[],
        relevance_score DECIMAL(3, 2),
        keywords TEXT[],
        bailii_url TEXT,
        full_text_url TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. STATUTORY REFERENCES
    // Legislation citations and sections
    await query(`
      CREATE TABLE IF NOT EXISTS statutory_references (
        id SERIAL PRIMARY KEY,
        statute_id VARCHAR(50) UNIQUE NOT NULL,
        legislation_title VARCHAR(500) NOT NULL,
        jurisdiction VARCHAR(100) NOT NULL,
        year INTEGER,
        act_number VARCHAR(50),
        section_number VARCHAR(50),
        subsection_number VARCHAR(50),
        section_title VARCHAR(500),
        section_text TEXT,
        commencement_date DATE,
        repeal_date DATE,
        amendments TEXT[],
        related_sections TEXT[],
        relevance TEXT,
        legislation_url TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. PROSECUTION BUNDLES
    // Court submission document bundles
    await query(`
      CREATE TABLE IF NOT EXISTS prosecution_bundles (
        id SERIAL PRIMARY KEY,
        bundle_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        bundle_type VARCHAR(100) NOT NULL,
        bundle_title VARCHAR(500) NOT NULL,
        bundle_description TEXT,
        case_reference VARCHAR(100),
        court_name VARCHAR(255),
        hearing_date DATE,
        prepared_by VARCHAR(255) NOT NULL,
        preparation_date DATE NOT NULL,
        page_count INTEGER,
        exhibit_count INTEGER,
        witness_count INTEGER,
        included_exhibits TEXT[],
        included_statements TEXT[],
        included_reports TEXT[],
        chronology_included BOOLEAN DEFAULT FALSE,
        dramatis_personae_included BOOLEAN DEFAULT FALSE,
        index_included BOOLEAN DEFAULT TRUE,
        bundle_status VARCHAR(50) CHECK (bundle_status IN ('DRAFT', 'REVIEW', 'FINALIZED', 'FILED', 'SERVED')),
        filing_date DATE,
        filing_reference VARCHAR(100),
        served_parties TEXT[],
        electronic_bundle_path TEXT,
        physical_bundle_location VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. DISCLOSURE SCHEDULE
    // Unused material and disclosure obligations
    await query(`
      CREATE TABLE IF NOT EXISTS disclosure_schedule (
        id SERIAL PRIMARY KEY,
        disclosure_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        material_type VARCHAR(100) NOT NULL,
        material_description TEXT NOT NULL,
        relevance_to_case TEXT,
        material_category VARCHAR(50) CHECK (material_category IN ('UNUSED', 'SENSITIVE', 'NON_SENSITIVE', 'BRADY', 'PII')),
        disclosure_required BOOLEAN DEFAULT TRUE,
        disclosure_status VARCHAR(50) CHECK (disclosure_status IN ('PENDING_REVIEW', 'DISCLOSED', 'WITHHELD', 'REDACTED')),
        disclosure_date DATE,
        withholding_reason TEXT,
        public_interest_immunity BOOLEAN DEFAULT FALSE,
        redaction_applied BOOLEAN DEFAULT FALSE,
        redaction_reason TEXT,
        disclosed_to_parties TEXT[],
        document_id VARCHAR(50) REFERENCES forensic_documents(document_id),
        file_path TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. WITNESS STATEMENTS
    // Witness testimony and statements
    await query(`
      CREATE TABLE IF NOT EXISTS witness_statements (
        id SERIAL PRIMARY KEY,
        statement_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        witness_name VARCHAR(255) NOT NULL,
        witness_type VARCHAR(100) CHECK (witness_type IN ('FACT', 'EXPERT', 'CHARACTER', 'HEARSAY')),
        witness_occupation VARCHAR(255),
        witness_address TEXT,
        statement_date DATE NOT NULL,
        statement_location VARCHAR(500),
        taken_by VARCHAR(255),
        statement_text TEXT NOT NULL,
        exhibits_referenced TEXT[],
        sworn BOOLEAN DEFAULT FALSE,
        affidavit BOOLEAN DEFAULT FALSE,
        declaration BOOLEAN DEFAULT FALSE,
        witness_signature TEXT,
        statement_status VARCHAR(50) CHECK (statement_status IN ('DRAFT', 'FINALIZED', 'FILED', 'SERVED')),
        credibility_assessment TEXT,
        corroborating_evidence TEXT[],
        contradicted_by TEXT[],
        document_path TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. EXPERT REPORTS
    // Expert witness reports and opinions
    await query(`
      CREATE TABLE IF NOT EXISTS expert_reports (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        expert_name VARCHAR(255) NOT NULL,
        expert_qualifications TEXT NOT NULL,
        expert_field VARCHAR(255) NOT NULL,
        expert_organization VARCHAR(255),
        report_type VARCHAR(100) NOT NULL,
        report_title VARCHAR(500) NOT NULL,
        report_date DATE NOT NULL,
        opinion_summary TEXT NOT NULL,
        methodology_description TEXT NOT NULL,
        daubert_compliant BOOLEAN DEFAULT FALSE,
        frye_compliant BOOLEAN DEFAULT FALSE,
        peer_reviewed BOOLEAN DEFAULT FALSE,
        error_rate_known BOOLEAN DEFAULT FALSE,
        generally_accepted BOOLEAN DEFAULT TRUE,
        assumptions_stated BOOLEAN DEFAULT TRUE,
        limitations_stated BOOLEAN DEFAULT TRUE,
        alternative_hypotheses TEXT[],
        opinions TEXT[],
        conclusions TEXT NOT NULL,
        exhibits_referenced TEXT[],
        literature_cited TEXT[],
        cv_attached BOOLEAN DEFAULT TRUE,
        report_status VARCHAR(50) CHECK (report_status IN ('DRAFT', 'FINALIZED', 'FILED', 'SERVED')),
        document_path TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. COURT SUBMISSIONS
    // Filed documents and court filings
    await query(`
      CREATE TABLE IF NOT EXISTS court_submissions (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        submission_type VARCHAR(100) NOT NULL,
        submission_title VARCHAR(500) NOT NULL,
        court_name VARCHAR(255) NOT NULL,
        case_reference VARCHAR(100),
        filing_date DATE NOT NULL,
        filing_reference VARCHAR(100),
        filed_by VARCHAR(255) NOT NULL,
        submission_status VARCHAR(50) CHECK (submission_status IN ('DRAFT', 'FILED', 'SERVED', 'RESPONDED')),
        hearing_date DATE,
        hearing_result VARCHAR(255),
        document_path TEXT,
        electronic_filing_receipt TEXT,
        served_parties TEXT[],
        service_date DATE,
        service_method VARCHAR(100),
        response_deadline DATE,
        responses_received TEXT[],
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 11. INVESTIGATION MILESTONES
    // Phase tracking and progress monitoring
    await query(`
      CREATE TABLE IF NOT EXISTS investigation_milestones (
        id SERIAL PRIMARY KEY,
        milestone_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50) REFERENCES forensic_matters(matter_id),
        phase VARCHAR(100) NOT NULL,
        milestone_name VARCHAR(500) NOT NULL,
        milestone_description TEXT,
        milestone_type VARCHAR(100) CHECK (milestone_type IN ('INTELLIGENCE', 'INVESTIGATION', 'CASE_BUILDING', 'PROSECUTION', 'ASSET_RECOVERY')),
        target_date DATE,
        completion_date DATE,
        status VARCHAR(50) CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'BLOCKED')),
        completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
        assigned_to TEXT[],
        dependencies TEXT[],
        blocking_issues TEXT[],
        deliverables TEXT[],
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    console.log('⚖️  Creating court-ready database indexes...');
    
    await query(`CREATE INDEX IF NOT EXISTS idx_custody_chain_evidence ON evidence_custody_chain(evidence_id, document_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_custody_chain_transfer ON evidence_custody_chain(transfer_datetime)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_authentication_evidence ON evidence_authentication(evidence_id, document_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_authentication_result ON evidence_authentication(authentication_result)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exhibits_number ON evidence_exhibits(exhibit_number)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_exhibits_matter ON evidence_exhibits(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_precedents_citation ON legal_precedents(case_citation)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_precedents_jurisdiction ON legal_precedents(jurisdiction)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_statutes_title ON statutory_references(legislation_title)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_bundles_matter ON prosecution_bundles(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_disclosure_matter ON disclosure_schedule(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_statements_matter ON witness_statements(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_expert_reports_matter ON expert_reports(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_submissions_matter ON court_submissions(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_milestones_matter ON investigation_milestones(matter_id)`);

    console.log('✅ Court-Ready Database Extensions initialized successfully');

    return {
      success: true,
      message: 'Court-Ready Database initialized',
      tables: [
        'evidence_custody_chain',
        'evidence_authentication',
        'evidence_exhibits',
        'legal_precedents',
        'statutory_references',
        'prosecution_bundles',
        'disclosure_schedule',
        'witness_statements',
        'expert_reports',
        'court_submissions',
        'investigation_milestones'
      ]
    };

  } catch (error) {
    console.error('❌ Court-Ready Database initialization error:', error);
    throw error;
  }
}

export default { initCourtReadyDatabase };
