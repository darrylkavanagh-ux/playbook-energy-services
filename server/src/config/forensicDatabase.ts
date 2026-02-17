/**
 * FORENSIC INVESTIGATION DATABASE SCHEMA
 * For Orb AI Forensic Investigation Platform
 * 
 * This schema supports prosecution-grade forensic reconstruction
 * of complex multi-party fraud schemes involving actors, entities,
 * properties, and fraudulent transactions.
 */

import { query } from './database';

/**
 * Initialize all forensic investigation database tables
 */
export async function initForensicDatabase() {
  try {
    console.log('🔍 Initializing Orb AI Forensic Investigation Database...');

    // 1. MASTER ACTOR REGISTRY
    // Tracks all individuals involved in the investigation
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_actors (
        id SERIAL PRIMARY KEY,
        actor_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        aliases TEXT[],
        date_of_birth DATE,
        nationality VARCHAR(100),
        occupation VARCHAR(255),
        known_addresses TEXT[],
        role_in_scheme VARCHAR(255),
        risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        criminal_history JSONB,
        professional_licenses JSONB,
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. MASTER ENTITY REGISTRY  
    // Tracks all companies, trusts, and organizations
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_entities (
        id SERIAL PRIMARY KEY,
        entity_id VARCHAR(50) UNIQUE NOT NULL,
        legal_name VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        registration_number VARCHAR(100),
        registration_jurisdiction VARCHAR(100),
        incorporation_date DATE,
        dissolution_date DATE,
        registered_address TEXT,
        trading_addresses TEXT[],
        directors JSONB,
        shareholders JSONB,
        ultimate_beneficial_owners JSONB,
        business_activities TEXT[],
        risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        regulatory_status VARCHAR(100),
        financial_status VARCHAR(100),
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. MASTER MATTER INDEX
    // Tracks all legal matters, cases, and incidents
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_matters (
        id SERIAL PRIMARY KEY,
        matter_id VARCHAR(50) UNIQUE NOT NULL,
        matter_type VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        jurisdiction VARCHAR(100),
        case_number VARCHAR(100),
        filing_date DATE,
        incident_date DATE,
        discovery_date DATE,
        status VARCHAR(100),
        severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        estimated_loss DECIMAL(15, 2),
        estimated_recovery DECIMAL(15, 2),
        related_matters TEXT[],
        actors_involved TEXT[],
        entities_involved TEXT[],
        properties_involved TEXT[],
        evidence_files TEXT[],
        timeline JSONB,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. MASTER PROPERTY & ASSET REGISTER
    // Tracks all properties and assets involved
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_properties (
        id SERIAL PRIMARY KEY,
        property_id VARCHAR(50) UNIQUE NOT NULL,
        property_type VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        eircode VARCHAR(20),
        folio_number VARCHAR(100),
        registration_jurisdiction VARCHAR(100),
        land_registry_reference VARCHAR(100),
        property_pin VARCHAR(100),
        acquisition_date DATE,
        acquisition_price DECIMAL(15, 2),
        current_value DECIMAL(15, 2),
        current_owner VARCHAR(255),
        previous_owners JSONB,
        ownership_chain JSONB,
        encumbrances JSONB,
        mortgages JSONB,
        planning_permissions JSONB,
        rental_status VARCHAR(100),
        rental_income DECIMAL(15, 2),
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. ACTOR-ENTITY RELATIONSHIPS
    // Tracks relationships between actors and entities
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_actor_entity_relationships (
        id SERIAL PRIMARY KEY,
        actor_id VARCHAR(50) NOT NULL REFERENCES forensic_actors(actor_id),
        entity_id VARCHAR(50) NOT NULL REFERENCES forensic_entities(entity_id),
        relationship_type VARCHAR(100) NOT NULL,
        start_date DATE,
        end_date DATE,
        position_title VARCHAR(255),
        shareholding_percentage DECIMAL(5, 2),
        voting_rights DECIMAL(5, 2),
        beneficial_ownership BOOLEAN,
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(actor_id, entity_id, relationship_type, start_date)
      )
    `);

    // 6. FINANCIAL TRANSACTIONS
    // Tracks all financial flows between parties
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_transactions (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(50) UNIQUE NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_type VARCHAR(100) NOT NULL,
        from_party_type VARCHAR(20) CHECK (from_party_type IN ('ACTOR', 'ENTITY')),
        from_party_id VARCHAR(50) NOT NULL,
        to_party_type VARCHAR(20) CHECK (to_party_type IN ('ACTOR', 'ENTITY')),
        to_party_id VARCHAR(50) NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'EUR',
        payment_method VARCHAR(100),
        bank_account_from VARCHAR(100),
        bank_account_to VARCHAR(100),
        reference VARCHAR(255),
        purpose VARCHAR(500),
        related_matter_id VARCHAR(50),
        related_property_id VARCHAR(50),
        suspicious_indicators TEXT[],
        aml_flags TEXT[],
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. DOCUMENT REGISTER
    // Tracks all evidence documents
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_documents (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(50) UNIQUE NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        file_path TEXT,
        file_size BIGINT,
        file_hash VARCHAR(128),
        mime_type VARCHAR(100),
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(255),
        custodian VARCHAR(255),
        matter_id VARCHAR(50),
        related_actors TEXT[],
        related_entities TEXT[],
        related_properties TEXT[],
        classification VARCHAR(100),
        confidentiality VARCHAR(50) CHECK (confidentiality IN ('PUBLIC', 'CONFIDENTIAL', 'PRIVILEGED', 'TOP_SECRET')),
        chain_of_custody JSONB,
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. INVESTIGATION TIMELINE
    // Tracks all key events chronologically
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_timeline (
        id SERIAL PRIMARY KEY,
        event_id VARCHAR(50) UNIQUE NOT NULL,
        event_date DATE NOT NULL,
        event_time TIME,
        event_type VARCHAR(100) NOT NULL,
        event_title VARCHAR(500) NOT NULL,
        event_description TEXT,
        location VARCHAR(255),
        actors_involved TEXT[],
        entities_involved TEXT[],
        properties_involved TEXT[],
        matters_involved TEXT[],
        evidence_documents TEXT[],
        significance VARCHAR(20) CHECK (significance IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        verified BOOLEAN DEFAULT FALSE,
        verification_source VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. CONSPIRACY LINKS
    // Tracks identified conspiracies and connections
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_conspiracy_links (
        id SERIAL PRIMARY KEY,
        link_id VARCHAR(50) UNIQUE NOT NULL,
        link_type VARCHAR(100) NOT NULL,
        description TEXT,
        node_a_type VARCHAR(20) NOT NULL,
        node_a_id VARCHAR(50) NOT NULL,
        node_b_type VARCHAR(20) NOT NULL,
        node_b_id VARCHAR(50) NOT NULL,
        connection_strength DECIMAL(3, 2),
        temporal_correlation BOOLEAN DEFAULT FALSE,
        financial_link BOOLEAN DEFAULT FALSE,
        communication_link BOOLEAN DEFAULT FALSE,
        evidence_supporting TEXT[],
        detection_method VARCHAR(100),
        detection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 10. INVESTIGATION FINDINGS
    // Tracks all investigation findings and conclusions
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_findings (
        id SERIAL PRIMARY KEY,
        finding_id VARCHAR(50) UNIQUE NOT NULL,
        matter_id VARCHAR(50),
        finding_type VARCHAR(100) NOT NULL,
        finding_category VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        evidence_quality VARCHAR(20) CHECK (evidence_quality IN ('WEAK', 'MODERATE', 'STRONG', 'CONCLUSIVE')),
        legal_implications TEXT,
        criminal_implications TEXT,
        civil_implications TEXT,
        regulatory_implications TEXT,
        actors_implicated TEXT[],
        entities_implicated TEXT[],
        estimated_damages DECIMAL(15, 2),
        statute_of_limitations DATE,
        supporting_documents TEXT[],
        supporting_transactions TEXT[],
        recommendations TEXT[],
        status VARCHAR(100),
        assigned_investigator VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 11. DATA SOURCES
    // Tracks all data sources and extraction status
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_data_sources (
        id SERIAL PRIMARY KEY,
        source_id VARCHAR(50) UNIQUE NOT NULL,
        source_type VARCHAR(100) NOT NULL,
        source_name VARCHAR(255) NOT NULL,
        source_category VARCHAR(100),
        description TEXT,
        access_method VARCHAR(100),
        access_status VARCHAR(100),
        access_credentials_required BOOLEAN DEFAULT FALSE,
        last_extraction_date TIMESTAMP,
        extraction_frequency VARCHAR(50),
        records_extracted INTEGER DEFAULT 0,
        data_quality_score DECIMAL(3, 2),
        reliability_score DECIMAL(3, 2),
        legal_basis TEXT,
        restrictions TEXT,
        metadata JSONB,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 12. INVESTIGATION TASKS
    // Tracks investigation workflow and tasks
    await query(`
      CREATE TABLE IF NOT EXISTS forensic_tasks (
        id SERIAL PRIMARY KEY,
        task_id VARCHAR(50) UNIQUE NOT NULL,
        task_type VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        priority VARCHAR(20) CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
        status VARCHAR(100) NOT NULL,
        assigned_to VARCHAR(255),
        matter_id VARCHAR(50),
        due_date DATE,
        completed_date DATE,
        dependencies TEXT[],
        deliverables TEXT[],
        findings TEXT[],
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    console.log('🔍 Creating forensic database indexes...');
    
    await query(`CREATE INDEX IF NOT EXISTS idx_actors_name ON forensic_actors(full_name)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_actors_risk ON forensic_actors(risk_level)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_entities_name ON forensic_entities(legal_name)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_entities_risk ON forensic_entities(risk_level)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_matters_type ON forensic_matters(matter_type)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_matters_status ON forensic_matters(status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_properties_owner ON forensic_properties(current_owner)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON forensic_transactions(transaction_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_transactions_parties ON forensic_transactions(from_party_id, to_party_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_timeline_date ON forensic_timeline(event_date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_findings_matter ON forensic_findings(matter_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_findings_severity ON forensic_findings(severity)`);

    console.log('✅ Forensic Investigation Database initialized successfully');

    return {
      success: true,
      message: 'Forensic Investigation Database initialized',
      tables: [
        'forensic_actors',
        'forensic_entities', 
        'forensic_matters',
        'forensic_properties',
        'forensic_actor_entity_relationships',
        'forensic_transactions',
        'forensic_documents',
        'forensic_timeline',
        'forensic_conspiracy_links',
        'forensic_findings',
        'forensic_data_sources',
        'forensic_tasks'
      ]
    };

  } catch (error) {
    console.error('❌ Forensic Database initialization error:', error);
    throw error;
  }
}

/**
 * Seed initial data for testing
 */
export async function seedForensicTestData() {
  try {
    console.log('🌱 Seeding forensic investigation test data...');

    // Insert sample actor
    await query(`
      INSERT INTO forensic_actors (
        actor_id, full_name, aliases, role_in_scheme, risk_level, metadata
      ) VALUES (
        'ACTOR-001',
        'Sample Subject',
        ARRAY['Alias 1', 'Alias 2'],
        'Primary Subject',
        'HIGH',
        '{"notes": "Test actor for system validation"}'::jsonb
      ) ON CONFLICT (actor_id) DO NOTHING
    `);

    // Insert sample entity
    await query(`
      INSERT INTO forensic_entities (
        entity_id, legal_name, entity_type, registration_number, risk_level, metadata
      ) VALUES (
        'ENTITY-001',
        'Sample Corporation Ltd',
        'Private Company',
        'IE123456',
        'MEDIUM',
        '{"notes": "Test entity for system validation"}'::jsonb
      ) ON CONFLICT (entity_id) DO NOTHING
    `);

    // Insert sample matter
    await query(`
      INSERT INTO forensic_matters (
        matter_id, matter_type, title, description, severity, status, metadata
      ) VALUES (
        'MATTER-001',
        'Fraud Investigation',
        'Sample Investigation Case',
        'Test case for forensic platform validation',
        'HIGH',
        'ACTIVE',
        '{"notes": "Test matter for system validation"}'::jsonb
      ) ON CONFLICT (matter_id) DO NOTHING
    `);

    console.log('✅ Test data seeded successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Test data seeding error:', error);
    throw error;
  }
}

export default { initForensicDatabase, seedForensicTestData };

// Run migration if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Running Forensic Database Migration...');
  initForensicDatabase()
    .then(() => {
      console.log('✅ Forensic Database Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Forensic Database Migration failed:', error);
      process.exit(1);
    });
}
