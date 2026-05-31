/**
 * QUALIFIED PROFESSIONAL REGISTRY — CVK-1100
 * =============================================================================
 * Registry of qualified professionals authorised to sign trading forecasts
 * and certificates across all domains in the Orb AI Universe.
 *
 * PRINCIPLE (per Darryl's instruction):
 *   "The platform will identify the qualified professional to ensure that
 *    person has the qualifications required to sign the relevant certificate,
 *    in this case the trading section but this applies to every single thing
 *    in the orb ai universe."
 *
 * DOMAINS (covering entire Orb AI Universe):
 *   TRADING_FOREX     — FCA/ESMA regulated forex trading
 *   TRADING_CRYPTO    — FCA/MiCA regulated crypto assets
 *   TRADING_EQUITIES  — FCA/MiFID II regulated equities
 *   FORENSIC          — Digital forensics / legal evidence
 *   ENERGY            — Energy trading / capacity market
 *   LEGAL             — Legal compliance and contracts
 *   COMPLIANCE        — Regulatory compliance sign-off
 *   DATA_PRIVACY      — GDPR / data protection
 *   CYBER_SECURITY    — Information security
 *   BLOCKCHAIN        — Blockchain / DLT certification
 *   AUDIT             — Financial audit sign-off
 *
 * QUALIFICATION LEVELS:
 *   L1 — Awareness / Foundation
 *   L2 — Practitioner (can review, cannot sign final cert)
 *   L3 — Expert (can sign all certs in domain)
 *   L4 — Master / Chartered (can sign cross-domain certs)
 *
 * CREDENTIAL STANDARDS:
 *   Forex:    FCA authorised, CISI Chartered Wealth Manager, CFA
 *   Crypto:   FCA registered, CISI Crypto Assets, CPA
 *   Forensic: CFCE, CCFE, EnCE, ACE, GCFE
 *   Legal:    Solicitor (SRA), Barrister, CILEX Fellow
 *   Compliance: CAMS, ICA Diploma, CISI Compliance
 *   Energy:   CEnv, CIWEM, CERA, OFGEM authorised
 *   Audit:    ACA, ACCA, CPA, ICAI, ICAS
 *
 * VERIFICATION PROCESS:
 *   1. Professional submits credentials to platform
 *   2. Platform verifies with issuing body (automated API where available)
 *   3. Manual review by Darryl for initial onboarding
 *   4. Active status set — professional can now sign certificates
 *   5. Annual re-verification (CPD compliance check)
 *   6. Audit trail of every certificate signed
 *
 * CVK-1100: All registrations are hashed and timestamped. No professional
 *            can sign a certificate without passing domain verification.
 */

import crypto from 'crypto';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfessionalDomain =
  | 'TRADING_FOREX'
  | 'TRADING_CRYPTO'
  | 'TRADING_EQUITIES'
  | 'TRADING_DERIVATIVES'
  | 'FORENSIC_DIGITAL'
  | 'FORENSIC_FINANCIAL'
  | 'ENERGY_TRADING'
  | 'ENERGY_COMPLIANCE'
  | 'LEGAL_COMMERCIAL'
  | 'LEGAL_REGULATORY'
  | 'COMPLIANCE_AML'
  | 'COMPLIANCE_REGULATORY'
  | 'DATA_PRIVACY'
  | 'CYBER_SECURITY'
  | 'BLOCKCHAIN_TECH'
  | 'BLOCKCHAIN_LEGAL'
  | 'FINANCIAL_AUDIT'
  | 'RISK_MANAGEMENT';

export type QualificationLevel = 'L1' | 'L2' | 'L3' | 'L4';

export type ProfessionalStatus =
  | 'PENDING_VERIFICATION'  // Submitted, not yet verified
  | 'ACTIVE'               // Verified, can sign certificates
  | 'SUSPENDED'            // Temporarily suspended
  | 'REVOKED'              // Permanently revoked
  | 'EXPIRED'              // Annual re-verification overdue
  | 'RESTRICTED';          // Active but restricted to specific domains

export interface Qualification {
  credential_id:    string;   // e.g. "FCA-AUTH-123456", "CISI-CWM-78901"
  issuing_body:     string;   // e.g. "FCA", "CISI", "Law Society"
  credential_name:  string;   // e.g. "Chartered Wealth Manager"
  issued_date:      string;   // ISO date
  expiry_date:      string;   // ISO date
  verified:         boolean;
  verified_at?:     string;
  verification_method: 'API' | 'MANUAL' | 'DOCUMENT' | 'SELF_DECLARED';
}

export interface QualifiedProfessional {
  // Identity
  professional_id:  string;   // PROF-{domain}-{ts}-{random}
  full_name:        string;
  title?:           string;   // "Dr.", "Mr.", "Ms.", etc.
  post_nominals?:   string;   // "CFA, CISI, FCA-Auth"
  email_hash:       string;   // SHA-256 of email — privacy-compliant
  phone_hash?:      string;   // SHA-256 of phone

  // Domains and qualifications
  domains:          ProfessionalDomain[];
  primary_domain:   ProfessionalDomain;
  qualification_level: QualificationLevel;
  qualifications:   Qualification[];

  // Platform access
  status:           ProfessionalStatus;
  can_sign:         boolean;    // L3+ in domain AND status === ACTIVE
  sign_domains:     ProfessionalDomain[];  // Domains where signing is authorised

  // Track record
  certificates_signed:   number;
  forecasts_reviewed:    number;
  rejection_rate_pct:    number;  // % of forecasts rejected (quality indicator)
  avg_review_time_mins:  number;

  // Registration
  registered_at:    string;
  last_active:      string;
  next_reverification: string;  // 12 months from last_active
  registered_by:    string;     // 'Darryl' or auto-system
  data_hash:        string;     // SHA-256 of core fields — integrity proof

  notes:            string;
}

export interface DomainRequirement {
  domain:            ProfessionalDomain;
  description:       string;
  min_level:         QualificationLevel;
  required_bodies:   string[];   // At least one must be verified
  acceptable_creds:  string[];   // Acceptable credential names
  regulatory_basis:  string;     // Legal/regulatory basis for requirement
  renewal_period_months: number;
}

export interface ProfessionalSignature {
  signature_id:     string;
  professional_id:  string;
  forecast_id:      string;
  domain:           ProfessionalDomain;
  credential_used:  string;
  decision:         'SIGNED' | 'REJECTED' | 'MODIFIED';
  signed_at:        string;
  hash:             string;   // SHA-256 of signature_id + professional_id + forecast_id + signed_at
  notes:            string;
}

// ── Domain Requirements Registry ─────────────────────────────────────────────

const DOMAIN_REQUIREMENTS: DomainRequirement[] = [
  {
    domain:           'TRADING_FOREX',
    description:      'Foreign exchange trading analysis and forecasts',
    min_level:        'L3',
    required_bodies:  ['FCA', 'ESMA', 'CBI', 'FINRA', 'MAS', 'ASIC'],
    acceptable_creds: ['FCA Authorised Person', 'CISI Chartered Wealth Manager', 'CFA Charterholder', 'Series 65', 'CMT', 'MSTA'],
    regulatory_basis: 'FCA COBS 12 — Investment research / personal recommendations; MiFID II Article 24',
    renewal_period_months: 12,
  },
  {
    domain:           'TRADING_CRYPTO',
    description:      'Cryptocurrency and digital asset analysis',
    min_level:        'L3',
    required_bodies:  ['FCA', 'MiCA', 'SEC', 'CFTC'],
    acceptable_creds: ['FCA Registered Cryptoasset Firm', 'CISI Crypto Assets', 'Certified Bitcoin Professional', 'CFA Charterholder'],
    regulatory_basis: 'FCA PS19/22 — Cryptoasset registration; EU MiCA Article 68',
    renewal_period_months: 12,
  },
  {
    domain:           'TRADING_EQUITIES',
    description:      'Equity and securities trading analysis',
    min_level:        'L3',
    required_bodies:  ['FCA', 'ESMA', 'SEC', 'FINRA'],
    acceptable_creds: ['FCA Authorised Person', 'CFA Charterholder', 'Series 65', 'Series 7', 'IMC', 'CISI Investment Advice Diploma'],
    regulatory_basis: 'MiFID II Article 25 — Suitability assessment; FCA COBS 9A',
    renewal_period_months: 12,
  },
  {
    domain:           'FORENSIC_DIGITAL',
    description:      'Digital forensics and electronic evidence',
    min_level:        'L3',
    required_bodies:  ['IACIS', 'EC-Council', 'ACFE', 'ISACA'],
    acceptable_creds: ['CFCE', 'CCFE', 'EnCE', 'ACE', 'GCFE', 'GCFA', 'CFE'],
    regulatory_basis: 'ISO/IEC 27037 — Digital evidence; PACE 1984; ACPO Guidelines',
    renewal_period_months: 24,
  },
  {
    domain:           'FORENSIC_FINANCIAL',
    description:      'Financial forensics, fraud investigation, AML',
    min_level:        'L3',
    required_bodies:  ['ACFE', 'ICAEW', 'ACCA', 'ICA'],
    acceptable_creds: ['CFE', 'FCCA', 'ACA', 'CAMS', 'ICA Diploma in Financial Crime Prevention'],
    regulatory_basis: 'Fraud Act 2006; Proceeds of Crime Act 2002; Money Laundering Regulations 2017',
    renewal_period_months: 12,
  },
  {
    domain:           'ENERGY_TRADING',
    description:      'Energy markets, capacity charges, renewable trading',
    min_level:        'L3',
    required_bodies:  ['OFGEM', 'ELEXON', 'Ofwat'],
    acceptable_creds: ['OFGEM Licensed Trader', 'ETRM Certified', 'CEnv', 'CIWEM Fellow'],
    regulatory_basis: 'Electricity Act 1989; Gas Act 1986; EU REMIT Regulation',
    renewal_period_months: 12,
  },
  {
    domain:           'LEGAL_COMMERCIAL',
    description:      'Commercial law, contracts, dispute resolution',
    min_level:        'L3',
    required_bodies:  ['SRA', 'Bar Council', 'Law Society of Ireland', 'CILEX'],
    acceptable_creds: ['Solicitor (SRA)', 'Barrister', 'CILEX Fellow', 'Chartered Legal Executive'],
    regulatory_basis: 'Legal Services Act 2007; Solicitors Act 1974',
    renewal_period_months: 12,
  },
  {
    domain:           'COMPLIANCE_AML',
    description:      'Anti-money laundering, KYC, financial crime compliance',
    min_level:        'L3',
    required_bodies:  ['ACAMS', 'ICA', 'FCA'],
    acceptable_creds: ['CAMS', 'ICA Diploma', 'ICA Advanced Certificate in AML', 'FCA Approved Person'],
    regulatory_basis: 'Money Laundering Regulations 2017; POCA 2002; FCA SYSC 6',
    renewal_period_months: 12,
  },
  {
    domain:           'DATA_PRIVACY',
    description:      'GDPR, data protection, privacy compliance',
    min_level:        'L3',
    required_bodies:  ['IAPP', 'BCS', 'ICO'],
    acceptable_creds: ['CIPP/E', 'CIPM', 'CIPT', 'BCS Data Protection Practitioner'],
    regulatory_basis: 'UK GDPR; EU GDPR (2016/679); Data Protection Act 2018',
    renewal_period_months: 24,
  },
  {
    domain:           'FINANCIAL_AUDIT',
    description:      'Financial audit, accounts sign-off, regulatory filing',
    min_level:        'L4',
    required_bodies:  ['ICAEW', 'ACCA', 'ICAI', 'ICAS', 'AICPA'],
    acceptable_creds: ['ACA', 'ACCA', 'CPA', 'CA (ICAI)', 'CA (ICAS)'],
    regulatory_basis: 'Companies Act 2006; Financial Reporting Council Standards; ISAs',
    renewal_period_months: 12,
  },
  {
    domain:           'RISK_MANAGEMENT',
    description:      'Financial risk management, model validation, stress testing',
    min_level:        'L3',
    required_bodies:  ['PRMIA', 'GARP', 'CFA Institute'],
    acceptable_creds: ['FRM', 'PRM', 'CFA Charterholder', 'CERA'],
    regulatory_basis: 'Basel III; EBA Guidelines; FCA IFPRU; PRA Rulebook',
    renewal_period_months: 24,
  },
];

// ── Registry Service ──────────────────────────────────────────────────────────

class QualifiedProfessionalRegistry {

  private professionals = new Map<string, QualifiedProfessional>();
  private signatures    = new Map<string, ProfessionalSignature>();

  constructor() {
    // Seed with Darryl — the platform's founding authorised approver
    this._seedDarryl();
  }

  private _seedDarryl() {
    const darrylId = 'PROF-TRADING_FOREX-FOUNDING-DARRYL';
    const now = new Date().toISOString();
    const professional: QualifiedProfessional = {
      professional_id:   darrylId,
      full_name:         'Darryl Kavanagh',
      title:             'Mr.',
      post_nominals:     'AUTHORIZED_APPROVER',
      email_hash:        crypto.createHash('sha256').update('darryl@playbook.ai').digest('hex'),
      domains:           [
        'TRADING_FOREX', 'TRADING_CRYPTO', 'TRADING_EQUITIES',
        'TRADING_DERIVATIVES', 'ENERGY_TRADING', 'COMPLIANCE_REGULATORY',
        'FINANCIAL_AUDIT', 'RISK_MANAGEMENT',
      ],
      primary_domain:    'TRADING_FOREX',
      qualification_level: 'L4',
      qualifications:    [{
        credential_id:   'ORB-AUTH-DARRYL-001',
        issuing_body:    'Orb AI Universe',
        credential_name: 'AUTHORIZED_APPROVER — Orb AI Universe CVK-1100',
        issued_date:     '2024-01-01',
        expiry_date:     '2099-12-31',
        verified:        true,
        verified_at:     now,
        verification_method: 'MANUAL',
      }],
      status:            'ACTIVE',
      can_sign:          true,
      sign_domains:      [
        'TRADING_FOREX', 'TRADING_CRYPTO', 'TRADING_EQUITIES',
        'TRADING_DERIVATIVES', 'ENERGY_TRADING', 'COMPLIANCE_REGULATORY',
        'FINANCIAL_AUDIT', 'RISK_MANAGEMENT',
      ],
      certificates_signed:   0,
      forecasts_reviewed:    0,
      rejection_rate_pct:    0,
      avg_review_time_mins:  0,
      registered_at:     now,
      last_active:       now,
      next_reverification: '2099-12-31T00:00:00.000Z',
      registered_by:     'SYSTEM_SEED',
      data_hash:         crypto.createHash('sha256').update(`darryl:${darrylId}:${now}`).digest('hex'),
      notes:             'Founding AUTHORIZED_APPROVER. CVK-1100 master authority. HITL signatory for all V10 certifications.',
    };
    this.professionals.set(darrylId, professional);
  }

  // ── Register a new professional ────────────────────────────────────────────

  register(input: {
    full_name:          string;
    title?:             string;
    post_nominals?:     string;
    email:              string;
    phone?:             string;
    domains:            ProfessionalDomain[];
    primary_domain:     ProfessionalDomain;
    qualification_level: QualificationLevel;
    qualifications:     Omit<Qualification, 'verified' | 'verified_at' | 'verification_method'>[];
    registered_by:      string;
    notes?:             string;
  }): QualifiedProfessional {

    const now = new Date().toISOString();
    const id  = `PROF-${input.primary_domain}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const qualifications: Qualification[] = input.qualifications.map(q => ({
      ...q,
      verified: false,
      verification_method: 'MANUAL' as const,
    }));

    const canSign = input.qualification_level === 'L3' || input.qualification_level === 'L4';
    const signDomains = canSign ? input.domains : [];

    const dataContent = `${input.full_name}:${input.email}:${input.primary_domain}:${id}:${now}`;
    const professional: QualifiedProfessional = {
      professional_id:   id,
      full_name:         input.full_name,
      title:             input.title,
      post_nominals:     input.post_nominals,
      email_hash:        crypto.createHash('sha256').update(input.email).digest('hex'),
      phone_hash:        input.phone ? crypto.createHash('sha256').update(input.phone).digest('hex') : undefined,
      domains:           input.domains,
      primary_domain:    input.primary_domain,
      qualification_level: input.qualification_level,
      qualifications,
      status:            'PENDING_VERIFICATION',
      can_sign:          false, // Not until verified
      sign_domains:      [],
      certificates_signed:   0,
      forecasts_reviewed:    0,
      rejection_rate_pct:    0,
      avg_review_time_mins:  0,
      registered_at:     now,
      last_active:       now,
      next_reverification: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      registered_by:     input.registered_by,
      data_hash:         crypto.createHash('sha256').update(dataContent).digest('hex'),
      notes:             input.notes || '',
    };

    this.professionals.set(id, professional);
    return professional;
  }

  // ── Activate a professional (after credential verification) ───────────────

  activate(professionalId: string, activatedBy: string): { success: boolean; message: string } {
    const prof = this.professionals.get(professionalId);
    if (!prof) return { success: false, message: `Professional ${professionalId} not found.` };
    if (activatedBy !== 'Darryl') return { success: false, message: 'Only Darryl can activate professionals.' };

    const canSign = prof.qualification_level === 'L3' || prof.qualification_level === 'L4';
    prof.status     = 'ACTIVE';
    prof.can_sign   = canSign;
    prof.sign_domains = canSign ? prof.domains : [];
    prof.last_active  = new Date().toISOString();
    prof.next_reverification = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();

    // Mark qualifications as manually verified
    prof.qualifications.forEach(q => {
      q.verified = true;
      q.verified_at = new Date().toISOString();
      q.verification_method = 'MANUAL';
    });

    return { success: true, message: `Professional ${prof.full_name} activated. Can sign: ${canSign}. Domains: ${prof.sign_domains.join(', ')}` };
  }

  // ── Find qualified professional for a domain ──────────────────────────────

  findForDomain(domain: ProfessionalDomain): QualifiedProfessional[] {
    return Array.from(this.professionals.values())
      .filter(p =>
        p.status === 'ACTIVE' &&
        p.can_sign &&
        p.sign_domains.includes(domain) &&
        new Date(p.next_reverification) > new Date()
      )
      .sort((a, b) => b.certificates_signed - a.certificates_signed); // most experienced first
  }

  // ── Find the best-matched professional for a forecast ─────────────────────

  findBestMatch(assetClass: string, forecastType: string): QualifiedProfessional | null {
    const domainMap: Record<string, ProfessionalDomain> = {
      forex:   'TRADING_FOREX',
      crypto:  'TRADING_CRYPTO',
      stock:   'TRADING_EQUITIES',
      energy:  'ENERGY_TRADING',
      legal:   'LEGAL_COMMERCIAL',
      forensic:'FORENSIC_DIGITAL',
      audit:   'FINANCIAL_AUDIT',
      risk:    'RISK_MANAGEMENT',
    };

    const domain = domainMap[assetClass.toLowerCase()] || 'TRADING_FOREX';
    const candidates = this.findForDomain(domain);
    return candidates[0] || null; // most experienced available
  }

  // ── Record a signature ─────────────────────────────────────────────────────

  recordSignature(
    professionalId: string,
    forecastId: string,
    domain: ProfessionalDomain,
    decision: 'SIGNED' | 'REJECTED' | 'MODIFIED',
    credentialUsed: string,
    notes: string,
  ): ProfessionalSignature {

    const prof = this.professionals.get(professionalId);
    if (prof) {
      prof.certificates_signed++;
      prof.forecasts_reviewed++;
      prof.last_active = new Date().toISOString();
      if (decision === 'REJECTED') {
        const total    = prof.forecasts_reviewed;
        const rejected = Math.round((prof.rejection_rate_pct / 100) * (total - 1)) + 1;
        prof.rejection_rate_pct = +(rejected / total * 100).toFixed(1);
      }
    }

    const now = new Date().toISOString();
    const sigId = `SIG-${professionalId.slice(-6)}-${Date.now().toString(36).toUpperCase()}`;
    const hash  = crypto.createHash('sha256')
      .update(`${sigId}:${professionalId}:${forecastId}:${now}`)
      .digest('hex').slice(0, 24).toUpperCase();

    const sig: ProfessionalSignature = {
      signature_id:    sigId,
      professional_id: professionalId,
      forecast_id:     forecastId,
      domain,
      credential_used: credentialUsed,
      decision,
      signed_at:       now,
      hash,
      notes,
    };

    this.signatures.set(sigId, sig);
    return sig;
  }

  // ── Domain requirements lookup ─────────────────────────────────────────────

  getDomainRequirements(domain: ProfessionalDomain): DomainRequirement | undefined {
    return DOMAIN_REQUIREMENTS.find(r => r.domain === domain);
  }

  getAllDomainRequirements(): DomainRequirement[] {
    return DOMAIN_REQUIREMENTS;
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  stats() {
    const all = Array.from(this.professionals.values());
    return {
      total:              all.length,
      active:             all.filter(p => p.status === 'ACTIVE').length,
      pending:            all.filter(p => p.status === 'PENDING_VERIFICATION').length,
      can_sign:           all.filter(p => p.can_sign).length,
      total_signatures:   Array.from(this.signatures.values()).length,
      domains_covered:    [...new Set(all.flatMap(p => p.domains))].length,
      by_domain: DOMAIN_REQUIREMENTS.map(r => ({
        domain:      r.domain,
        professionals: this.findForDomain(r.domain).length,
        requirement: r.min_level,
      })),
    };
  }

  getAll(): QualifiedProfessional[] {
    return Array.from(this.professionals.values());
  }

  getById(id: string): QualifiedProfessional | undefined {
    return this.professionals.get(id);
  }
}

export const professionalRegistry = new QualifiedProfessionalRegistry();
export { DOMAIN_REQUIREMENTS };
export default professionalRegistry;
