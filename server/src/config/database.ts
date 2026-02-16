import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'foxlite_db',
  user: process.env.DB_USER || 'foxlite_user',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Check if database is accessible
    await query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Run migrations
    await runMigrations();
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

// Database migrations
async function runMigrations() {
  console.log('📦 Running database migrations...');
  
  // Create extensions
  await query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  `);
  
  // Users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      role VARCHAR(50) DEFAULT 'user',
      phone VARCHAR(20),
      verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `);
  
  // Customers table
  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      type VARCHAR(50) NOT NULL,
      contact_name VARCHAR(100),
      contact_email VARCHAR(100),
      contact_phone VARCHAR(20),
      address TEXT,
      postcode VARCHAR(20),
      hiqa_registered BOOLEAN DEFAULT false,
      hiqa_registration_number VARCHAR(50),
      chp_system BOOLEAN DEFAULT false,
      renewable_energy BOOLEAN DEFAULT false,
      renewable_percentage DECIMAL(5,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);
    CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
  `);
  
  // Facilities table
  await query(`
    CREATE TABLE IF NOT EXISTS facilities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      postcode VARCHAR(20),
      facility_type VARCHAR(50),
      beds INTEGER,
      rooms INTEGER,
      sqm INTEGER,
      staff_count INTEGER,
      operating_hours VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_facilities_customer_id ON facilities(customer_id);
    CREATE INDEX IF NOT EXISTS idx_facilities_type ON facilities(facility_type);
  `);
  
  // Meters table
  await query(`
    CREATE TABLE IF NOT EXISTS meters (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
      mprn VARCHAR(20),
      mpan VARCHAR(20),
      meter_type VARCHAR(20) NOT NULL,
      connection_type VARCHAR(20),
      capacity_kva DECIMAL(10,2),
      smart_meter BOOLEAN DEFAULT false,
      meter_serial VARCHAR(50),
      installation_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_meters_facility_id ON meters(facility_id);
    CREATE INDEX IF NOT EXISTS idx_meters_mprn ON meters(mprn);
    CREATE INDEX IF NOT EXISTS idx_meters_type ON meters(meter_type);
  `);
  
  // Bills table
  await query(`
    CREATE TABLE IF NOT EXISTS bills (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      meter_id UUID REFERENCES meters(id) ON DELETE CASCADE,
      bill_number VARCHAR(100),
      bill_date DATE NOT NULL,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      supplier VARCHAR(100) NOT NULL,
      tariff_name VARCHAR(200),
      
      total_kwh DECIMAL(12,2),
      day_kwh DECIMAL(12,2),
      night_kwh DECIMAL(12,2),
      peak_kwh DECIMAL(12,2),
      off_peak_kwh DECIMAL(12,2),
      estimated BOOLEAN DEFAULT false,
      meter_reading_current DECIMAL(12,2),
      meter_reading_previous DECIMAL(12,2),
      
      unit_charges DECIMAL(10,2),
      standing_charges DECIMAL(10,2),
      network_charges DECIMAL(10,2),
      capacity_charges DECIMAL(10,2),
      pso_levy DECIMAL(10,2),
      ccl_carbon_tax DECIMAL(10,2),
      reactive_power_charge DECIMAL(10,2),
      other_charges DECIMAL(10,2),
      
      subtotal_before_vat DECIMAL(10,2),
      vat_rate DECIMAL(5,4),
      vat_amount DECIMAL(10,2),
      total_amount DECIMAL(10,2) NOT NULL,
      
      pdf_url TEXT,
      pdf_stored_path TEXT,
      ocr_confidence DECIMAL(5,2),
      ocr_data JSONB,
      processing_status VARCHAR(50) DEFAULT 'pending',
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_bills_meter_id ON bills(meter_id);
    CREATE INDEX IF NOT EXISTS idx_bills_date ON bills(bill_date);
    CREATE INDEX IF NOT EXISTS idx_bills_supplier ON bills(supplier);
    CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(processing_status);
  `);
  
  // Tariff database table
  await query(`
    CREATE TABLE IF NOT EXISTS tariff_database (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      supplier VARCHAR(100) NOT NULL,
      tariff_name VARCHAR(200) NOT NULL,
      tariff_type VARCHAR(50) NOT NULL,
      connection_type VARCHAR(20) DEFAULT 'LV',
      
      unit_rate DECIMAL(8,4),
      day_rate DECIMAL(8,4),
      night_rate DECIMAL(8,4),
      peak_rate DECIMAL(8,4),
      off_peak_rate DECIMAL(8,4),
      standing_charge_daily DECIMAL(8,4),
      capacity_charge_per_kva DECIMAL(8,4),
      
      night_hours_start TIME,
      night_hours_end TIME,
      
      min_consumption_kwh INTEGER,
      max_consumption_kwh INTEGER,
      contract_length_months INTEGER,
      exit_fee DECIMAL(10,2),
      
      valid_from DATE NOT NULL,
      valid_to DATE,
      active BOOLEAN DEFAULT true,
      
      scraped_url TEXT,
      last_verified TIMESTAMP,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_tariff_supplier ON tariff_database(supplier);
    CREATE INDEX IF NOT EXISTS idx_tariff_active ON tariff_database(active);
    CREATE INDEX IF NOT EXISTS idx_tariff_valid_dates ON tariff_database(valid_from, valid_to);
  `);
  
  // Audit projects table
  await query(`
    CREATE TABLE IF NOT EXISTS audit_projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
      project_name VARCHAR(200) NOT NULL,
      status VARCHAR(50) DEFAULT 'initiated',
      start_date DATE NOT NULL,
      end_date DATE,
      audit_period_years INTEGER DEFAULT 6,
      
      total_bills_analyzed INTEGER DEFAULT 0,
      total_bills_with_errors INTEGER DEFAULT 0,
      total_overcharge_identified DECIMAL(12,2) DEFAULT 0,
      total_claims_submitted DECIMAL(12,2) DEFAULT 0,
      total_recovered DECIMAL(12,2) DEFAULT 0,
      
      commission_rate DECIMAL(5,4) DEFAULT 0.20,
      commission_earned DECIMAL(12,2) DEFAULT 0,
      
      assigned_to UUID REFERENCES users(id),
      notes TEXT,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_audit_customer_id ON audit_projects(customer_id);
    CREATE INDEX IF NOT EXISTS idx_audit_status ON audit_projects(status);
    CREATE INDEX IF NOT EXISTS idx_audit_assigned ON audit_projects(assigned_to);
  `);
  
  // Overcharge findings table
  await query(`
    CREATE TABLE IF NOT EXISTS overcharge_findings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      audit_project_id UUID REFERENCES audit_projects(id) ON DELETE CASCADE,
      bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
      
      finding_type VARCHAR(50) NOT NULL,
      severity VARCHAR(20) DEFAULT 'medium',
      description TEXT NOT NULL,
      
      overcharge_amount DECIMAL(10,2) NOT NULL,
      correct_amount DECIMAL(10,2),
      
      claim_status VARCHAR(50) DEFAULT 'identified',
      claim_reference VARCHAR(100),
      supplier_response TEXT,
      
      recovered_amount DECIMAL(10,2) DEFAULT 0,
      recovered_date DATE,
      
      evidence_data JSONB,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_findings_audit_id ON overcharge_findings(audit_project_id);
    CREATE INDEX IF NOT EXISTS idx_findings_type ON overcharge_findings(finding_type);
    CREATE INDEX IF NOT EXISTS idx_findings_status ON overcharge_findings(claim_status);
  `);
  
  // Claims table
  await query(`
    CREATE TABLE IF NOT EXISTS claims (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      audit_project_id UUID REFERENCES audit_projects(id) ON DELETE CASCADE,
      claim_reference VARCHAR(100) UNIQUE,
      
      supplier VARCHAR(100) NOT NULL,
      claim_type VARCHAR(50) NOT NULL,
      claim_amount DECIMAL(12,2) NOT NULL,
      
      submission_date DATE,
      submission_method VARCHAR(50),
      supporting_docs_url TEXT[],
      
      supplier_reference VARCHAR(100),
      supplier_acknowledged_date DATE,
      supplier_response TEXT,
      
      status VARCHAR(50) DEFAULT 'draft',
      priority VARCHAR(20) DEFAULT 'normal',
      
      recovered_amount DECIMAL(12,2) DEFAULT 0,
      recovered_date DATE,
      recovery_method VARCHAR(50),
      
      cru_escalated BOOLEAN DEFAULT false,
      cru_escalation_date DATE,
      cru_reference VARCHAR(100),
      
      notes TEXT,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_claims_audit_id ON claims(audit_project_id);
    CREATE INDEX IF NOT EXISTS idx_claims_supplier ON claims(supplier);
    CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
    CREATE INDEX IF NOT EXISTS idx_claims_submission ON claims(submission_date);
  `);
  
  // Switching recommendations table (for NO COMPARE)
  await query(`
    CREATE TABLE IF NOT EXISTS switching_recommendations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      bill_id UUID REFERENCES bills(id),
      
      current_supplier VARCHAR(100) NOT NULL,
      current_annual_cost DECIMAL(10,2) NOT NULL,
      
      recommended_supplier VARCHAR(100) NOT NULL,
      recommended_tariff VARCHAR(200) NOT NULL,
      recommended_annual_cost DECIMAL(10,2) NOT NULL,
      
      annual_savings DECIMAL(10,2) NOT NULL,
      percentage_savings DECIMAL(5,2),
      
      status VARCHAR(50) DEFAULT 'pending',
      switch_initiated_date DATE,
      switch_completed_date DATE,
      
      commission_earned DECIMAL(10,2) DEFAULT 0,
      commission_paid BOOLEAN DEFAULT false,
      
      referral_code VARCHAR(50),
      referral_url TEXT,
      
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_switching_user_id ON switching_recommendations(user_id);
    CREATE INDEX IF NOT EXISTS idx_switching_status ON switching_recommendations(status);
  `);
  
  // Activity log table
  await query(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50),
      entity_id UUID,
      details JSONB,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
    CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_log(action);
    CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);
  `);
  
  console.log('✅ Database migrations completed successfully');
}

export default { pool, query, transaction, initializeDatabase };
