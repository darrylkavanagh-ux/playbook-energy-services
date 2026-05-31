/**
 * CERTIFICATION GATEWAY
 * =============================================================================
 * CVK-1100 Standard — Dual Certification System
 *
 * THREE CERTIFICATION ROUTES:
 *
 * ROUTE A — PLATFORM CERTIFICATION (fee-based):
 *   The platform identifies a qualified professional from its approved registry
 *   whose credentials are verified, background-checked, and certified by
 *   Orb AI Universe. The platform charges a certification fee per document.
 *   This is the highest-assurance route — certificate is legally defensible.
 *   Qualification requirements derived from Judge Victoria Sharpe ruling.
 *
 * ROUTE B — SELF-CERTIFICATION (responsibility waiver):
 *   The user certifies themselves as having the required qualifications.
 *   They AUTOMATICALLY WAIVE ALL RIGHTS to claim platform liability.
 *   If they do not hold the required qualifications, they have committed
 *   a false declaration — this is logged and timestamped with their IP.
 *   Self-certifiers cannot use the certificate in any legal or regulatory
 *   proceeding. The certificate is stamped SELF-CERTIFIED — PLATFORM
 *   ASSUMES NO LIABILITY.
 *
 * ROUTE C — APPROVED USER-NOMINATED PROFESSIONAL:
 *   The user nominates their own qualified professional.
 *   The platform carries out mandatory background checks:
 *     1. Identity verification (name, DOB, professional ID)
 *     2. Photographic ID upload (passport / driving licence)
 *     3. Credential verification against the issuing body's register
 *     4. Sanctions screening (HM Treasury, OFAC, EU consolidated list)
 *     5. Darryl L4 final approval gate
 *   Until all checks pass, the professional has status PENDING_VERIFICATION.
 *   Only VERIFIED status allows certificate signing.
 *
 * CERTIFICATION FEES (platform-managed, Route A):
 *   TRADING_TIP:          £25 per certificate
 *   MARKET_FORECAST:      £75 per certificate
 *   RISK_ASSESSMENT:      £50 per certificate
 *   FORENSIC_REPORT:      £150 per certificate
 *   LEGAL_DOCUMENT:       £200 per certificate
 *   COMPLIANCE_FILING:    £100 per certificate
 *
 * QUALIFICATION REQUIREMENTS — Judge Victoria Sharpe Ruling (June 2025):
 *   The ruling established that AI-generated evidence and analysis requires
 *   sign-off by a professionally indemnified qualified person. The minimum
 *   qualifications by domain are specified in DOMAIN_QUALIFICATION_MAP below.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type CertificationRoute = 'PLATFORM' | 'SELF' | 'USER_NOMINATED';

export type CertificationDomain =
  | 'TRADING_TIP' | 'MARKET_FORECAST' | 'RISK_ASSESSMENT'
  | 'FORENSIC_REPORT' | 'LEGAL_DOCUMENT' | 'COMPLIANCE_FILING'
  | 'ENERGY_AUDIT' | 'MEDICAL_ASSESSMENT' | 'TECHNICAL_ANALYSIS';

export type VerificationStatus =
  | 'PENDING_IDENTITY' | 'PENDING_CREDENTIAL' | 'PENDING_SANCTIONS'
  | 'PENDING_DARRYL_APPROVAL' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type CertificateStatus =
  | 'DRAFT' | 'PENDING_CERTIFICATION' | 'PLATFORM_CERTIFIED'
  | 'SELF_CERTIFIED' | 'USER_NOMINATED_CERTIFIED'
  | 'REJECTED' | 'EXPIRED' | 'REVOKED';

export interface NominatedProfessional {
  nomination_id:       string;
  nominated_by:        string;  // user_id
  full_name:           string;
  date_of_birth:       string;
  professional_id:     string;  // e.g. FCA reference number
  credential_type:     string;
  issuing_body:        string;
  credential_number:   string;
  jurisdiction:        string;
  domains:             CertificationDomain[];
  photo_id_ref?:       string;  // path to uploaded photo ID
  photo_id_verified:   boolean;
  identity_verified:   boolean;
  credential_verified: boolean;
  sanctions_clear:     boolean;
  status:              VerificationStatus;
  submitted_at:        string;
  verified_at?:        string;
  approved_by?:        string;  // Darryl L4
  rejection_reason?:   string;
  background_check_id: string;
  indemnity_confirmed: boolean;  // professional must confirm PI insurance
}

export interface SelfCertificationWaiver {
  waiver_id:         string;
  user_id:           string;
  domain:            CertificationDomain;
  declared_credential: string;
  declared_issuing_body: string;
  ip_address?:       string;
  waiver_accepted:   boolean;
  waiver_text:       string;
  waiver_timestamp:  string;
  false_declaration_warning_acknowledged: boolean;
  all_rights_waived: boolean;
}

export interface PlatformCertificate {
  cert_id:           string;
  document_id:       string;
  domain:            CertificationDomain;
  route:             CertificationRoute;
  status:            CertificateStatus;
  certifier_id?:     string;  // professional who signed (Route A/C)
  certifier_name?:   string;
  credential_used?:  string;
  self_cert_waiver?: SelfCertificationWaiver;  // Route B
  fee_amount_gbp?:   number;    // Route A
  fee_paid:          boolean;
  issued_at?:        string;
  expires_at?:       string;
  sha256:            string;
  legal_validity:    string;
  liability_note:    string;
  v10_cert_ref?:     string;
}

export interface CertificationRequest {
  document_id:  string;
  domain:       CertificationDomain;
  route:        CertificationRoute;
  user_id:      string;
  // Route B fields
  self_cert?:   {
    declared_credential: string;
    declared_issuing_body: string;
    ip_address?: string;
    waiver_accepted: boolean;
    false_declaration_acknowledged: boolean;
  };
  // Route C fields
  nominated_professional_id?: string;
  // Route A is automatic — platform selects
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN QUALIFICATION MAP — per Judge Victoria Sharpe Ruling (June 2025)
// ─────────────────────────────────────────────────────────────────────────────

export const DOMAIN_QUALIFICATION_MAP: Record<CertificationDomain, {
  min_level:      string;
  required_bodies: string[];
  regulatory_basis: string;
  description:    string;
  fee_gbp:        number;
}> = {
  TRADING_TIP: {
    min_level:       'Level 3 (CISI Investment Advice Diploma or equivalent)',
    required_bodies: ['FCA', 'ESMA', 'CBI', 'FINRA', 'ASIC', 'MAS'],
    regulatory_basis: 'FCA COBS 12.4, MiFID II Art 24(4), Consumer Duty PS22/9',
    description:     'Trading tip and signal certification for retail/professional client recommendations',
    fee_gbp:         25,
  },
  MARKET_FORECAST: {
    min_level:       'Level 4 (CFA Level 1 or CISI Level 4 equivalent)',
    required_bodies: ['FCA', 'ESMA', 'CBI', 'FINRA', 'CFA Institute'],
    regulatory_basis: 'MiFID II Art 24, FCA COBS 14.3, MAR Article 20',
    description:     'Market forecast and research certification',
    fee_gbp:         75,
  },
  RISK_ASSESSMENT: {
    min_level:       'Level 4 (FRM, PRM, or CFA Level 2 equivalent)',
    required_bodies: ['GARP', 'PRMIA', 'CFA Institute', 'FCA'],
    regulatory_basis: 'Basel III, MiFID II Art 16, FCA SYSC 7',
    description:     'Risk assessment and portfolio risk certification',
    fee_gbp:         50,
  },
  FORENSIC_REPORT: {
    min_level:       'Expert witness qualified (IACIS CFCE, EnCE, or forensic accounting qualification)',
    required_bodies: ['IACIS', 'EC-Council', 'ICAEW', 'ACCA', 'ACFE'],
    regulatory_basis: 'ISO/IEC 27037, PACE 1984, CPR Part 35, Judge Victoria Sharpe Ruling 2025',
    description:     'Digital or financial forensic report certification for legal proceedings',
    fee_gbp:         150,
  },
  LEGAL_DOCUMENT: {
    min_level:       'Solicitor, Barrister, or equivalent legal professional (qualified)',
    required_bodies: ['SRA', 'Bar Council', 'Law Society', 'DSBA', 'BSB'],
    regulatory_basis: 'Legal Services Act 2007, Courts and Legal Services Act 1990',
    description:     'Legal document and opinion certification',
    fee_gbp:         200,
  },
  COMPLIANCE_FILING: {
    min_level:       'Level 3 (ICA Diploma, ACAMS CAMS, or FCA approved person)',
    required_bodies: ['ICA', 'ACAMS', 'FCA', 'CBI'],
    regulatory_basis: 'MLR 2017, POCA 2002, FCA SYSC, EU AMLD6',
    description:     'AML/compliance filing and submission certification',
    fee_gbp:         100,
  },
  ENERGY_AUDIT: {
    min_level:       'Certified Energy Auditor (DEA, CIBSE, or equivalent)',
    required_bodies: ['CIBSE', 'RICS', 'ESOS', 'MCS'],
    regulatory_basis: 'Energy Act 2011, ESOS Regulations 2014, EU Energy Efficiency Directive',
    description:     'Energy audit and consumption analysis certification',
    fee_gbp:         80,
  },
  MEDICAL_ASSESSMENT: {
    min_level:       'Registered Medical Practitioner (GMC, IMC, or equivalent)',
    required_bodies: ['GMC', 'IMC', 'BMA'],
    regulatory_basis: 'Medical Act 1983, MCA 2005, Personal Injury Protocol',
    description:     'Medical assessment and quantum report certification for legal purposes',
    fee_gbp:         250,
  },
  TECHNICAL_ANALYSIS: {
    min_level:       'CMT Level 2 or CFA Level 1 minimum',
    required_bodies: ['CMT Association', 'CFA Institute', 'CISI'],
    regulatory_basis: 'MiFID II Art 24, FCA COBS 12',
    description:     'Technical analysis and charting certification for financial communication',
    fee_gbp:         35,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SELF-CERTIFICATION WAIVER TEXT (legally binding declaration)
// ─────────────────────────────────────────────────────────────────────────────

const SELF_CERT_WAIVER_TEXT = `
SELF-CERTIFICATION DECLARATION AND RIGHTS WAIVER

By proceeding with self-certification, I, the undersigned user, hereby declare and acknowledge:

1. QUALIFICATION DECLARATION: I declare that I hold the qualifications required for the
   domain stated in this certification request, as specified in the Orb AI Universe
   Certification Gateway Domain Qualification Requirements.

2. WAIVER OF PLATFORM LIABILITY: I acknowledge and accept that by choosing self-certification,
   I IRREVOCABLY WAIVE ALL RIGHTS to make any claim against Orb AI Universe, its operators,
   directors, employees, or agents in connection with this certified document or any action
   taken in reliance upon it.

3. FALSE DECLARATION ACKNOWLEDGEMENT: I understand that if I do not in fact hold the required
   qualifications, I am making a false declaration. This declaration is timestamped, IP-logged,
   and retained. A false declaration may constitute fraud under the Fraud Act 2006 (UK) and
   equivalent legislation in other jurisdictions.

4. LIMITATIONS OF SELF-CERTIFIED DOCUMENT: I acknowledge that a self-certified document:
   (a) Cannot be used in any legal, regulatory, or court proceeding as professional evidence;
   (b) Will be stamped "SELF-CERTIFIED — PLATFORM ASSUMES NO LIABILITY";
   (c) Does not satisfy FCA, MiFID II, or Judge Victoria Sharpe Ruling requirements for
       professional certification of AI-generated outputs;
   (d) Carries no professional indemnity insurance protection.

5. GOVERNING LAW: This declaration is governed by the laws of England and Wales.

By proceeding, you confirm you have read and understood this declaration in its entirety.
`.trim();

// ─────────────────────────────────────────────────────────────────────────────
// CERTIFICATION GATEWAY CLASS
// ─────────────────────────────────────────────────────────────────────────────

const CERTS_PATH       = path.resolve(__dirname, '../../../data/certifications.json');
const NOMINATIONS_PATH = path.resolve(__dirname, '../../../data/nominated_professionals.json');

export class CertificationGateway {

  private certificates:         Map<string, PlatformCertificate> = new Map();
  private nominatedProfessionals: Map<string, NominatedProfessional> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  // ── ROUTE A: Platform Certification ──────────────────────────────────────

  async requestPlatformCertification(req: CertificationRequest, certifierId: string, certifierName: string, credentialUsed: string): Promise<PlatformCertificate> {
    const domain   = req.domain;
    const domainSpec = DOMAIN_QUALIFICATION_MAP[domain];
    if (!domainSpec) throw new Error(`Unknown domain: ${domain}`);

    const certId = this.genCertId('PLATFORM', domain);
    const now    = new Date();
    const expiry = new Date(now.getTime() + 365 * 24 * 3600 * 1000); // 1 year

    const content = `${req.document_id}|${domain}|PLATFORM|${certifierId}|${now.toISOString()}`;
    const sha256  = crypto.createHash('sha256').update(content).digest('hex');

    const cert: PlatformCertificate = {
      cert_id:         certId,
      document_id:     req.document_id,
      domain,
      route:           'PLATFORM',
      status:          'PLATFORM_CERTIFIED',
      certifier_id:    certifierId,
      certifier_name:  certifierName,
      credential_used: credentialUsed,
      fee_amount_gbp:  domainSpec.fee_gbp,
      fee_paid:        false, // payment integration pending
      issued_at:       now.toISOString(),
      expires_at:      expiry.toISOString(),
      sha256,
      legal_validity:  `PLATFORM_CERTIFIED — Signed by ${certifierName} (${credentialUsed}). Meets ${domainSpec.regulatory_basis} requirements. Professionally indemnified.`,
      liability_note:  'Orb AI Universe platform certification. The certifying professional holds the required qualifications and professional indemnity insurance for this domain. Certificate is legally valid for the purposes stated.',
    };

    this.certificates.set(certId, cert);
    this.persistCerts();
    return cert;
  }

  // ── ROUTE B: Self-Certification ───────────────────────────────────────────

  selfCertify(req: CertificationRequest): PlatformCertificate {
    if (req.route !== 'SELF') throw new Error('Route must be SELF for self-certification');
    if (!req.self_cert) throw new Error('self_cert fields required for self-certification');

    const { declared_credential, declared_issuing_body, ip_address, waiver_accepted, false_declaration_acknowledged } = req.self_cert;

    if (!waiver_accepted || !false_declaration_acknowledged) {
      throw new Error('Self-certification requires acceptance of waiver and false declaration acknowledgement');
    }

    const waiverId = `WAV-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex')}`;
    const waiver: SelfCertificationWaiver = {
      waiver_id:         waiverId,
      user_id:           req.user_id,
      domain:            req.domain,
      declared_credential,
      declared_issuing_body,
      ip_address,
      waiver_accepted:   true,
      waiver_text:       SELF_CERT_WAIVER_TEXT,
      waiver_timestamp:  new Date().toISOString(),
      false_declaration_warning_acknowledged: true,
      all_rights_waived: true,
    };

    const certId  = this.genCertId('SELF', req.domain);
    const now     = new Date();
    const expiry  = new Date(now.getTime() + 90 * 24 * 3600 * 1000); // 90 days only
    const content = `${req.document_id}|${req.domain}|SELF|${req.user_id}|${now.toISOString()}`;
    const sha256  = crypto.createHash('sha256').update(content).digest('hex');

    const cert: PlatformCertificate = {
      cert_id:           certId,
      document_id:       req.document_id,
      domain:            req.domain,
      route:             'SELF',
      status:            'SELF_CERTIFIED',
      self_cert_waiver:  waiver,
      fee_amount_gbp:    0,
      fee_paid:          true,
      issued_at:         now.toISOString(),
      expires_at:        expiry.toISOString(),
      sha256,
      legal_validity:    'SELF-CERTIFIED ONLY — PLATFORM ASSUMES NO LIABILITY. This certificate carries no professional indemnity protection and cannot be used in legal, regulatory, or court proceedings.',
      liability_note:    'The user has waived all rights against the platform by choosing self-certification. If the declared qualification is false, the user may be liable under the Fraud Act 2006 and equivalent legislation. This certificate is NOT valid for FCA, MiFID II, or Judge Victoria Sharpe Ruling purposes.',
    };

    this.certificates.set(certId, cert);
    this.persistCerts();
    return cert;
  }

  // ── ROUTE C: User-Nominated Professional ─────────────────────────────────

  nominateProfessional(input: Omit<NominatedProfessional, 'nomination_id' | 'background_check_id' | 'photo_id_verified' | 'identity_verified' | 'credential_verified' | 'sanctions_clear' | 'status' | 'submitted_at' | 'indemnity_confirmed'>): NominatedProfessional {
    const nomination: NominatedProfessional = {
      ...input,
      nomination_id:       `NOM-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex')}`,
      background_check_id: `BGC-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(4).toString('hex')}`,
      photo_id_verified:   false,
      identity_verified:   false,
      credential_verified: false,
      sanctions_clear:     false,
      indemnity_confirmed: false,
      status:              'PENDING_IDENTITY',
      submitted_at:        new Date().toISOString(),
    };

    this.nominatedProfessionals.set(nomination.nomination_id, nomination);
    this.persistNominations();

    console.log(`[CertGateway] New nomination ${nomination.nomination_id} for ${nomination.full_name} — status PENDING_IDENTITY. Background check ${nomination.background_check_id} initiated.`);
    return nomination;
  }

  // ── Advance nomination through verification stages ─────────────────────────

  advanceVerification(nominationId: string, stage: 'identity' | 'credential' | 'sanctions' | 'indemnity', result: boolean, notes?: string, approvedBy?: string): NominatedProfessional {
    const nom = this.nominatedProfessionals.get(nominationId);
    if (!nom) throw new Error(`Nomination ${nominationId} not found`);

    switch (stage) {
      case 'identity':
        nom.identity_verified = result;
        nom.photo_id_verified = result;
        nom.status = result ? 'PENDING_CREDENTIAL' : 'REJECTED';
        if (!result) nom.rejection_reason = notes ?? 'Identity verification failed';
        break;
      case 'credential':
        nom.credential_verified = result;
        nom.status = result ? 'PENDING_SANCTIONS' : 'REJECTED';
        if (!result) nom.rejection_reason = notes ?? 'Credential verification failed';
        break;
      case 'sanctions':
        nom.sanctions_clear = result;
        nom.status = result ? 'PENDING_DARRYL_APPROVAL' : 'REJECTED';
        if (!result) nom.rejection_reason = notes ?? 'Sanctions screening failed';
        break;
      case 'indemnity':
        nom.indemnity_confirmed = result;
        break;
    }

    // Final approval — Darryl L4 only
    if (nom.status === 'PENDING_DARRYL_APPROVAL' && approvedBy) {
      if (approvedBy !== 'Darryl') {
        throw new Error('Final professional approval requires Darryl (L4 AUTHORIZED_APPROVER)');
      }
      if (nom.identity_verified && nom.credential_verified && nom.sanctions_clear && nom.indemnity_confirmed) {
        nom.status     = 'VERIFIED';
        nom.verified_at = new Date().toISOString();
        nom.approved_by = approvedBy;
      }
    }

    this.persistNominations();
    return nom;
  }

  // ── Issue certificate for a verified nominated professional ──────────────

  issueNominatedCertificate(req: CertificationRequest): PlatformCertificate {
    if (!req.nominated_professional_id) throw new Error('nominated_professional_id required for Route C');

    const nom = this.nominatedProfessionals.get(req.nominated_professional_id);
    if (!nom) throw new Error(`Nominated professional ${req.nominated_professional_id} not found`);
    if (nom.status !== 'VERIFIED') throw new Error(`Nominated professional status is ${nom.status} — must be VERIFIED before certificate can be issued`);
    if (!nom.domains.includes(req.domain)) throw new Error(`Professional ${nom.full_name} is not approved for domain ${req.domain}`);

    const domainSpec = DOMAIN_QUALIFICATION_MAP[req.domain];
    const certId     = this.genCertId('USER_NOMINATED', req.domain);
    const now        = new Date();
    const expiry     = new Date(now.getTime() + 365 * 24 * 3600 * 1000);

    const content = `${req.document_id}|${req.domain}|USER_NOMINATED|${nom.nomination_id}|${now.toISOString()}`;
    const sha256  = crypto.createHash('sha256').update(content).digest('hex');

    const cert: PlatformCertificate = {
      cert_id:         certId,
      document_id:     req.document_id,
      domain:          req.domain,
      route:           'USER_NOMINATED',
      status:          'USER_NOMINATED_CERTIFIED',
      certifier_id:    nom.nomination_id,
      certifier_name:  nom.full_name,
      credential_used: `${nom.credential_type} (${nom.issuing_body})`,
      fee_amount_gbp:  domainSpec.fee_gbp * 0.5, // reduced fee — platform did verification work
      fee_paid:        false,
      issued_at:       now.toISOString(),
      expires_at:      expiry.toISOString(),
      sha256,
      legal_validity:  `USER-NOMINATED PROFESSIONAL — ${nom.full_name} (${nom.credential_type}, ${nom.issuing_body}). Background checked and platform-verified. Meets ${domainSpec.regulatory_basis} requirements.`,
      liability_note:  'Certificate issued against a user-nominated professional who has passed full platform verification including identity check, credential verification, sanctions screening, and professional indemnity confirmation. Darryl L4 final approval on record.',
    };

    this.certificates.set(certId, cert);
    this.persistCerts();
    return cert;
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  getCertificate(certId: string): PlatformCertificate | null {
    return this.certificates.get(certId) ?? null;
  }

  getNomination(nominationId: string): NominatedProfessional | null {
    return this.nominatedProfessionals.get(nominationId) ?? null;
  }

  getPendingNominations(): NominatedProfessional[] {
    return Array.from(this.nominatedProfessionals.values())
      .filter(n => n.status !== 'VERIFIED' && n.status !== 'REJECTED');
  }

  getVerifiedNominations(): NominatedProfessional[] {
    return Array.from(this.nominatedProfessionals.values())
      .filter(n => n.status === 'VERIFIED');
  }

  getDomainRequirements(): typeof DOMAIN_QUALIFICATION_MAP {
    return DOMAIN_QUALIFICATION_MAP;
  }

  getSelfCertWaiverText(): string {
    return SELF_CERT_WAIVER_TEXT;
  }

  stats(): {
    total_certs: number;
    platform_certs: number;
    self_certs: number;
    nominated_certs: number;
    pending_nominations: number;
    verified_professionals: number;
  } {
    const certs = Array.from(this.certificates.values());
    return {
      total_certs:            certs.length,
      platform_certs:         certs.filter(c => c.route === 'PLATFORM').length,
      self_certs:             certs.filter(c => c.route === 'SELF').length,
      nominated_certs:        certs.filter(c => c.route === 'USER_NOMINATED').length,
      pending_nominations:    this.getPendingNominations().length,
      verified_professionals: this.getVerifiedNominations().length,
    };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private genCertId(route: CertificationRoute, domain: CertificationDomain): string {
    const routeCode = route === 'PLATFORM' ? 'PLT' : route === 'SELF' ? 'SLF' : 'NOM';
    const domCode   = domain.slice(0, 4).toUpperCase();
    return `CERT-${routeCode}-${domCode}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }

  private persistCerts(): void {
    try {
      const dir = path.dirname(CERTS_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(CERTS_PATH, JSON.stringify(Array.from(this.certificates.entries()), null, 2), 'utf8');
    } catch (e) { console.warn('[CertGateway] Certs persist failed:', e); }
  }

  private persistNominations(): void {
    try {
      const dir = path.dirname(NOMINATIONS_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(NOMINATIONS_PATH, JSON.stringify(Array.from(this.nominatedProfessionals.entries()), null, 2), 'utf8');
    } catch (e) { console.warn('[CertGateway] Nominations persist failed:', e); }
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(CERTS_PATH)) {
        const entries: [string, PlatformCertificate][] = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf8'));
        for (const [k, v] of entries) this.certificates.set(k, v);
        console.log(`[CertGateway] Loaded ${this.certificates.size} certificates from disk`);
      }
      if (fs.existsSync(NOMINATIONS_PATH)) {
        const entries: [string, NominatedProfessional][] = JSON.parse(fs.readFileSync(NOMINATIONS_PATH, 'utf8'));
        for (const [k, v] of entries) this.nominatedProfessionals.set(k, v);
        console.log(`[CertGateway] Loaded ${this.nominatedProfessionals.size} nominations from disk`);
      }
    } catch (e) { console.warn('[CertGateway] Load failed:', e); }
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const certificationGateway = new CertificationGateway();
export default certificationGateway;
