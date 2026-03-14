# Security Policy
**Playbook Corporation Limited | ORB AI Platform**

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Active support |
| < 1.0   | ❌ No longer supported |

## Reporting a Vulnerability

**Do NOT report security vulnerabilities via public GitHub issues.**

Please report security issues to:
- **Email**: security@playbook-corp.com
- **Subject**: `[SECURITY] <brief description>`
- **Response time**: Within 24 hours (critical), 72 hours (non-critical)

Include:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact assessment
4. Your suggested fix (if any)

## Security Standards

This platform handles sensitive forensic evidence and personal data.
All security controls are implemented to the following standards:

| Standard | Requirement | Status |
|---------|-------------|--------|
| GDPR UK/IE | Data protection | ✅ Enforced |
| POCA 2002 | Money laundering | ✅ MLRO gate |
| Sharp Ruling | AI transparency | ✅ All outputs |
| EU AI Act | High-risk AI system | ✅ Governance embedded |
| VeriTech-10 | Every process certified | ✅ Foundation layer |

## Security Architecture

- **Secrets**: All secrets in environment variables — never committed to code
- **Tokens**: GitHub tokens must be stored in a password manager only.
  Never share tokens in chat, email, or any unencrypted channel
- **Data at rest**: Supabase RLS enforced on all tables
- **Data in transit**: TLS 1.3 minimum on all API calls
- **Audit trail**: Append-only transparency log — tampering detected by SHA-256 hash chain
- **Access control**: Repository access via deploy keys only — no personal tokens in CI

## Responsible Disclosure

We follow responsible disclosure. Upon receiving a valid report:
1. Acknowledge within 24 hours
2. Investigate and assess within 72 hours
3. Patch critical vulnerabilities within 7 days
4. Credit researcher in CHANGELOG.md (with permission)
