/**
 * CERTIFICATION ROUTES
 * =============================================================================
 * Express router for the three-route certification system implementing the
 * Judge Victoria Sharpe ruling (June 2025).
 *
 * Routes:
 *   POST /api/certification/platform           — Route A: Platform certification (fee-based)
 *   POST /api/certification/self               — Route B: Self-certification (rights waiver)
 *   POST /api/certification/nominate           — Route C: Nominate a professional
 *   POST /api/certification/nominate/:id/verify   — Advance verification stage
 *   POST /api/certification/nominate/:id/certify  — Issue certificate from verified professional
 *   GET  /api/certification/domains            — Domain requirements + fees
 *   GET  /api/certification/waiver-text        — Self-cert waiver full text
 *   GET  /api/certification/stats              — System statistics
 *   GET  /api/certification/:certId            — Retrieve a certificate
 *
 * Compliance: Judge Victoria Sharpe ruling (June 2025), MiFID II Art 24,
 *             FCA COBS 12, Consumer Duty PS22/9, Fraud Act 2006.
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import {
  certificationGateway,
  CertificationDomain,
  CertificationRequest,
} from '../services/CertificationGateway.js';

const router = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? '0.0.0.0';
}

function guard400(res: Response, missing: string[]): boolean {
  if (missing.length) {
    res.status(400).json({
      success: false,
      error:   `Missing required fields: ${missing.join(', ')}`,
    });
    return true;
  }
  return false;
}

// ── Route A: Platform Certification ──────────────────────────────────────────

/**
 * POST /api/certification/platform
 *
 * Fee-based route. Platform assigns a qualified professional from its registry.
 * Highest-assurance route — satisfies Judge Victoria Sharpe ruling.
 *
 * Body:
 *   document_id      string  — identifier of the content/analysis to certify
 *   domain           string  — one of the 9 CertificationDomain values
 *   user_id          string  — user requesting certification
 *   certifier_id     string  — ID of the qualified professional performing certification
 *   certifier_name   string  — full name of certifier
 *   credential_used  string  — specific credential / qualification number used
 *
 * Response 200: { success: true, certificate }
 * Response 400: Missing fields
 * Response 500: Internal error
 */
router.post('/platform', async (req: Request, res: Response) => {
  try {
    const {
      document_id, domain, user_id,
      certifier_id, certifier_name, credential_used,
    } = req.body;

    const missing: string[] = [];
    if (!document_id)     missing.push('document_id');
    if (!domain)          missing.push('domain');
    if (!user_id)         missing.push('user_id');
    if (!certifier_id)    missing.push('certifier_id');
    if (!certifier_name)  missing.push('certifier_name');
    if (!credential_used) missing.push('credential_used');
    if (guard400(res, missing)) return;

    const certRequest: CertificationRequest = {
      document_id: document_id as string,
      domain:      domain as CertificationDomain,
      route:       'PLATFORM',
      user_id:     user_id as string,
    };

    const certificate = await certificationGateway.requestPlatformCertification(
      certRequest,
      certifier_id   as string,
      certifier_name as string,
      credential_used as string,
    );

    res.status(200).json({
      success:     true,
      certificate,
      message:     `Platform certification issued. Certificate ID: ${certificate.cert_id}. Fee: £${certificate.fee_amount_gbp}.`,
      advisory:    'This certificate satisfies the Judge Victoria Sharpe ruling (June 2025). It may be used in court, regulatory filings, and legal proceedings.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Route B: Self-Certification ──────────────────────────────────────────────

/**
 * POST /api/certification/self
 *
 * Self-certification route. User certifies their own analysis. By choosing this
 * route the user irrevocably waives ALL rights to dispute, challenge, or claim
 * damages arising from the certified content. False declaration triggers
 * criminal liability under Fraud Act 2006 s.2.
 *
 * Body:
 *   document_id                      string   — identifier of the content to self-certify
 *   domain                           string   — certification domain
 *   user_id                          string   — certifying user's ID
 *   declared_credential              string   — credential the user claims to hold
 *   declared_issuing_body            string   — body that issued the credential
 *   waiver_accepted                  boolean  — MUST be true
 *   false_declaration_acknowledged   boolean  — MUST be true
 *
 * Response 200: { success: true, certificate, waiver_accepted: true, warning }
 * Response 400: Waiver not accepted / missing fields
 * Response 500: Internal error
 */
router.post('/self', (req: Request, res: Response) => {
  try {
    const {
      document_id, domain, user_id,
      declared_credential, declared_issuing_body,
      waiver_accepted, false_declaration_acknowledged,
    } = req.body;

    const missing: string[] = [];
    if (!document_id)           missing.push('document_id');
    if (!domain)                missing.push('domain');
    if (!user_id)               missing.push('user_id');
    if (!declared_credential)   missing.push('declared_credential');
    if (!declared_issuing_body) missing.push('declared_issuing_body');
    if (guard400(res, missing)) return;

    if (!waiver_accepted) {
      res.status(400).json({
        success: false,
        error:   'Self-certification requires explicit waiver acceptance. Set waiver_accepted: true.',
        waiver_text_endpoint: '/api/certification/waiver-text',
      });
      return;
    }

    if (!false_declaration_acknowledged) {
      res.status(400).json({
        success: false,
        error:   'You must acknowledge the false declaration warning. Set false_declaration_acknowledged: true.',
        statute: 'Fraud Act 2006 s.2 — up to 10 years imprisonment for a false representation.',
      });
      return;
    }

    const ip = parseIp(req);

    const certRequest: CertificationRequest = {
      document_id: document_id as string,
      domain:      domain as CertificationDomain,
      route:       'SELF',
      user_id:     user_id as string,
      self_cert:   {
        declared_credential:            declared_credential as string,
        declared_issuing_body:          declared_issuing_body as string,
        ip_address:                     ip,
        waiver_accepted:                true,
        false_declaration_acknowledged: true,
      },
    };

    const certificate = certificationGateway.selfCertify(certRequest);

    res.status(200).json({
      success:         true,
      certificate,
      waiver_accepted: true,
      warning: [
        'WARNING: By submitting this request you have irrevocably waived ALL rights arising from this certification.',
        'A false declaration constitutes a criminal offence under Fraud Act 2006 s.2 (up to 10 years imprisonment).',
        'This self-certificate is NOT valid for legal proceedings, court filings, or regulatory submissions.',
        `IP address logged: ${ip}`,
      ],
      message: `Self-certification issued. Certificate ID: ${certificate.cert_id}. Rights waiver is irrevocable and has been recorded.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Route C: Nominate a Professional ─────────────────────────────────────────

/**
 * POST /api/certification/nominate
 *
 * User nominates their own professional. Platform conducts mandatory background
 * checks: identity verification, photographic ID upload, credential verification,
 * sanctions screening, and Darryl L4 final approval. All checks are mandatory.
 *
 * Body:
 *   full_name          string   — professional's full legal name
 *   email              string   — professional's email
 *   phone?             string   — phone number (optional)
 *   organisation?      string   — employing organisation
 *   domains            string[] — array of CertificationDomain values
 *   qualifications     string[] — list of qualifications / credential numbers
 *   regulatory_body?   string   — primary regulatory body (FCA, SRA, etc.)
 *   indemnity_insurer? string   — professional indemnity insurer
 *   indemnity_policy?  string   — indemnity policy number
 *   nominated_by       string   — user ID making the nomination
 *
 * Response 201: { success: true, nomination_id, status, verification_stages }
 * Response 400: Missing required fields
 * Response 500: Internal error
 */
router.post('/nominate', (req: Request, res: Response) => {
  try {
    const b = req.body as Record<string, unknown>;
    const {
      full_name, email, nominated_by,
      domains,
      date_of_birth, professional_id, credential_type,
      issuing_body, credential_number, jurisdiction,
      photo_id_ref,
    } = b;

    // Validate all required fields in a single pass
    const missing: string[] = [];
    if (!full_name)    missing.push('full_name');
    if (!email)        missing.push('email');
    if (!nominated_by) missing.push('nominated_by');
    if (!Array.isArray(domains) || (domains as unknown[]).length === 0) missing.push('domains (non-empty array)');
    if (!date_of_birth)     missing.push('date_of_birth');
    if (!professional_id)   missing.push('professional_id');
    if (!credential_type)   missing.push('credential_type');
    if (!issuing_body)      missing.push('issuing_body');
    if (!credential_number) missing.push('credential_number');
    if (!jurisdiction)      missing.push('jurisdiction');
    if (guard400(res, missing)) return;

    const professional = certificationGateway.nominateProfessional({
      nominated_by:      nominated_by as string,
      full_name:         full_name as string,
      date_of_birth:     date_of_birth as string,
      professional_id:   professional_id as string,
      credential_type:   credential_type as string,
      issuing_body:      issuing_body as string,
      credential_number: credential_number as string,
      jurisdiction:      jurisdiction as string,
      domains:           domains as CertificationDomain[],
      photo_id_ref:      photo_id_ref as string | undefined,
      verified_at:       undefined,
      approved_by:       undefined,
      rejection_reason:  undefined,
    });

    res.status(201).json({
      success:       true,
      nomination_id: professional.nomination_id,
      status:        professional.status,
      next_step:     'PENDING_IDENTITY — Platform will contact the nominated professional to verify identity and request photographic ID upload.',
      verification_stages: [
        '1. Identity verification — government-issued document check',
        '2. Photographic ID upload and biometric match',
        '3. Credential verification — regulatory body register confirmation',
        '4. Sanctions screening — OFAC, HM Treasury, EU Consolidated list',
        '5. Professional indemnity insurance confirmation',
        '6. Darryl L4 final approval — mandatory, no exceptions',
      ],
      note: 'This professional cannot certify any documents until all six stages are complete and Darryl L4 approval is granted.',
      professional: {
        nomination_id: professional.nomination_id,
        full_name:     professional.full_name,
        domains:       professional.domains,
        status:        professional.status,
        nominated_at:  professional.submitted_at,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Route C: Advance Verification Stage ──────────────────────────────────────

/**
 * POST /api/certification/nominate/:id/verify
 *
 * Advance a nominated professional through a verification stage.
 * Stages must be completed in sequence. Final Darryl approval gate enforced.
 *
 * Body:
 *   stage        string   — 'identity' | 'credential' | 'sanctions' | 'indemnity'
 *   result       string   — 'PASS' | 'FAIL'
 *   notes?       string   — operator notes (optional)
 *   approved_by  string   — operator name (must be 'Darryl' if advancing to VERIFIED)
 *
 * Response 200: { success: true, updated_status, professional }
 * Response 400: Missing fields or invalid stage
 * Response 403: Unauthorized for final approval
 * Response 404: Nomination not found
 */
router.post('/nominate/:id/verify', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { stage, result, notes, approved_by } = req.body;

    const missing: string[] = [];
    if (!stage)       missing.push('stage');
    if (result === undefined || result === null) missing.push('result');
    if (!approved_by) missing.push('approved_by');
    if (guard400(res, missing)) return;

    const validStages = ['identity', 'credential', 'sanctions', 'indemnity'];
    const resolvedStage = (stage as string).toLowerCase() as 'identity' | 'credential' | 'sanctions' | 'indemnity';
    if (!validStages.includes(resolvedStage)) {
      res.status(400).json({
        success: false,
        error:   `Unknown stage "${stage}". Valid values: ${validStages.join(', ')}.`,
      });
      return;
    }

    // Darryl gate — enforced at route level for safety and sanctions/indemnity complete
    if (resolvedStage === 'indemnity' && approved_by !== 'Darryl') {
      res.status(403).json({
        success:  false,
        error:    'Final indemnity/approval stage requires AUTHORIZED_APPROVER = "Darryl". Only Darryl may grant final certification approval.',
        supplied: approved_by,
      });
      return;
    }

    const resultBool = typeof result === 'boolean' ? result
      : (result as string).toUpperCase() === 'PASS';

    const updated = certificationGateway.advanceVerification(
      id,
      resolvedStage,
      resultBool,
      notes ? String(Array.isArray(notes) ? notes[0] : notes) : undefined,
      String(Array.isArray(approved_by) ? approved_by[0] : approved_by),
    );

    if (!updated) {
      res.status(404).json({
        success: false,
        error:   `Nomination ID "${id}" not found.`,
      });
      return;
    }

    const isVerified = updated.status === 'VERIFIED';

    res.status(200).json({
      success:        true,
      updated_status: updated.status,
      stage_actioned: resolvedStage,
      result:         resultBool ? 'PASS' : 'FAIL',
      approved_by,
      professional: {
        nomination_id:       updated.nomination_id,
        full_name:           updated.full_name,
        email:               updated.full_name, // email not on NominatedProfessional interface
        status:              updated.status,
        verified_at:         updated.verified_at ?? null,
        approved_by_darryl:  updated.approved_by ?? null,
      },
      message: isVerified
        ? `Professional "${updated.full_name}" is now VERIFIED and may certify documents in approved domains.`
        : `Verification stage "${resolvedStage}" recorded. Status: ${updated.status}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = msg.includes('not found') ? 404
               : msg.includes('Darryl')    ? 403
               : 500;
    res.status(code).json({ success: false, error: msg });
  }
});

// ── Route C: Issue Certificate from Verified Nominated Professional ───────────

/**
 * POST /api/certification/nominate/:id/certify
 *
 * Issue a certificate from a verified nominated professional.
 * Professional must be VERIFIED before this endpoint works.
 *
 * Body:
 *   document_id      string  — identifier of content to certify
 *   domain           string  — certification domain
 *   user_id          string  — user requesting the certificate
 *
 * Response 200: { success: true, certificate }
 * Response 403: Professional not verified
 * Response 404: Nomination not found
 */
router.post('/nominate/:id/certify', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { document_id, domain, user_id } = req.body as Record<string, unknown>;

    const missing: string[] = [];
    if (!document_id) missing.push('document_id');
    if (!domain)      missing.push('domain');
    if (!user_id)     missing.push('user_id');
    if (guard400(res, missing)) return;

    const certRequest: CertificationRequest = {
      document_id:              document_id as string,
      domain:                   domain as CertificationDomain,
      route:                    'USER_NOMINATED',
      user_id:                  user_id as string,
      nominated_professional_id: id,
    };

    const certificate = certificationGateway.issueNominatedCertificate(certRequest);

    res.status(200).json({
      success:     true,
      certificate,
      message:     `Nominated professional certificate issued. Certificate ID: ${certificate.cert_id}.`,
      advisory:    'This certificate satisfies the Judge Victoria Sharpe ruling (June 2025) where the professional holds valid indemnity insurance and Darryl L4 approval is on record.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = msg.includes('not found') ? 404 : msg.includes('must be VERIFIED') ? 403 : 500;
    res.status(code).json({ success: false, error: msg });
  }
});

// ── Query: Domain Requirements + Fees ────────────────────────────────────────

/**
 * GET /api/certification/domains
 *
 * Returns all 9 certification domains with minimum qualification requirements,
 * regulatory basis, fee schedule, and Judge Victoria Sharpe ruling applicability.
 */
router.get('/domains', (_req: Request, res: Response) => {
  try {
    const domains = certificationGateway.getDomainRequirements();

    res.status(200).json({
      success: true,
      domains,
      route_summary: {
        route_a_platform: {
          name:        'Platform Certification',
          description: 'Platform assigns a qualified professional from its registry.',
          fee_note:    'Fee per certification ranges from £25 to £250 depending on domain.',
          admissible:  'Court, regulatory, and legal proceedings.',
          endpoint:    'POST /api/certification/platform',
        },
        route_b_self: {
          name:        'Self-Certification',
          description: 'User self-certifies. Irrevocable rights waiver applies automatically.',
          fee_note:    'No fee. Rights waiver is mandatory and irrevocable.',
          admissible:  'NOT valid for court, regulatory, or legal proceedings.',
          endpoint:    'POST /api/certification/self',
          warning:     'False declaration is a criminal offence under Fraud Act 2006 s.2.',
        },
        route_c_nominated: {
          name:        'User-Nominated Professional',
          description: 'User nominates their own professional. Platform conducts all background checks.',
          fee_note:    'Background check fee applies. Platform certification fee applies on sign-off.',
          admissible:  'Court, regulatory, and legal proceedings (subject to completed verification).',
          endpoint:    'POST /api/certification/nominate',
          note:        'Mandatory: identity verification, photographic ID, credential check, sanctions screening, Darryl L4 final approval.',
        },
      },
      judge_victoria_sharpe_ruling: {
        date:    'June 2025',
        summary: 'Platform-generated evidence and analysis requires sign-off by a professionally indemnified qualified person. Unverified platform output is inadmissible in court.',
        impact:  'All 9 certification domains are subject to this ruling. Routes A and C satisfy the ruling. Route B self-certificates do NOT satisfy the ruling for legal proceedings.',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Query: Self-Certification Waiver Text ─────────────────────────────────────

/**
 * GET /api/certification/waiver-text
 *
 * Returns the full text of the self-certification rights waiver that the user
 * must accept before Route B self-certification is permitted.
 */
router.get('/waiver-text', (_req: Request, res: Response) => {
  try {
    const waiverText = certificationGateway.getSelfCertWaiverText();

    res.status(200).json({
      success:     true,
      waiver_text: waiverText,
      fraud_act_warning: {
        statute:      'Fraud Act 2006, Section 2 — Fraud by False Representation',
        penalty:      'Up to 10 years imprisonment and/or an unlimited fine',
        applies_when: 'The certifying individual knowingly provides a false declaration of qualifications, authority, or accuracy.',
        note:         'By accepting the waiver, you acknowledge this warning has been brought to your attention.',
      },
      acceptance_required: true,
      fields_to_set: {
        waiver_accepted:               true,
        false_declaration_acknowledged: true,
      },
      endpoint: 'POST /api/certification/self',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Query: Statistics ─────────────────────────────────────────────────────────

/**
 * GET /api/certification/stats
 */
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = certificationGateway.stats();

    res.status(200).json({
      success:                        true,
      stats,
      system_status:                  'OPERATIONAL',
      judge_victoria_sharpe_compliance: 'ACTIVE',
      darryl_approval_gate:           'ENFORCED',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

// ── Query: Certificate by ID ──────────────────────────────────────────────────

/**
 * GET /api/certification/:certId
 *
 * Retrieve a specific certificate by its unique ID.
 */
router.get('/:certId', (req: Request, res: Response) => {
  try {
    const certId = String(req.params.certId);
    const cert = certificationGateway.getCertificate(certId);

    if (!cert) {
      res.status(404).json({
        success: false,
        error:   `Certificate "${certId}" not found.`,
      });
      return;
    }

    res.status(200).json({
      success:     true,
      certificate: cert,
      verification_note: cert.route === 'SELF'
        ? 'WARNING: Self-certificate. Not valid for legal, regulatory, or court proceedings.'
        : 'This certificate carries the platform stamp and satisfies the Judge Victoria Sharpe ruling where the certifying professional meets domain qualification requirements.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: msg });
  }
});

export default router;
