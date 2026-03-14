# Changelog
All notable changes to this project are documented here.
Format: [Semantic Versioning](https://semver.org/)

---

## [1.0.0] — 2026-03-14

### 🚀 Initial Release — Playbook Corporation Limited

**Platform: ORB AI / ORBIT I**
First production release of the ORBIT I four-phase human-AI pipeline.

#### Added — Core Pipeline
- Phase 1: Human upload and pre-check service with SHA-256 integrity
- Phase 2: AI ingestion pipeline with 11 anomaly detection types
- Phase 3: Human verification and sign-off with CVK-1100 protocol
- Phase 4: Anti-fraud AI engine with 9 fraud signal checks

#### Added — Two-Lane Architecture
- `DataLane` system: `PRIMARY_EVIDENCE` vs `AI_ENRICHMENT` classification
- Evidence grades A1 through INADMISSIBLE
- Court-admissibility enforcement at TypeScript type level

#### Added — VeriTech-10 Foundation
- Universal Process Recorder: every process automatically V10-certified
- Outcome classification: EVIDENTIAL / VALUABLE / REQUIRES_FOLLOW_UP / ANOMALY / ROUTINE
- Immutable audit trail with SHA-256 tamper detection
- Follow-up task queue with automatic deadline assignment
- Intelligence register: permanent asset registry of all valuable findings

#### Added — Guard Services (5 gap fixes)
- `EditorApprovalGate`: RSS human-origin enforcement for Waterford Post / Cardiff Post
- `Neo4jSeedEnforcer`: all graph nodes traced to human-uploaded document
- `SAR_MLRO_Gate`: POCA 2002 compliant hard gate for SAR submission
- `NexusInputGuard`: blocks AI_ENRICHMENT from court/SAR/VeriTech outputs
- `DataLaneTag`: wraps all AI enrichment with mandatory disclosure

#### Added — Support Services
- API Rate Limiter (Redis-backed, per-service quotas, daily budget caps)
- GDPR Retention Enforcer (automated data expiry, right-to-erasure responses)
- Multi-Jurisdiction Router (GB / GB-SCT / GB-WLS / IE / INTL)
- Investigation Dashboard Service (live platform status across all 7 repositories)
- Transparency Log (append-only, court-admissible, Sharp Ruling compliant)
- Document State Machine (7 states with enforced transitions)

#### Added — Engines
- ENG-32: HM Land Registry + Irish Property Price Register
- API Integration Layer: Companies House UK, CRO Ireland, OFAC, EU Sanctions,
  HM Treasury Sanctions, HMLR, Alchemy Blockchain, Blockstream,
  HaveIBeenPwned, OpenCorporates, UK Insolvency Register
- ATLAS Neo4j Client: Waterford Cartel network pre-loaded

#### Added — Database (Supabase)
- Schema v2: Core platform tables
- Schema v3: ORBIT I pipeline tables
- Schema v4: Two-lane and compliance tables (RSS queue, SAR drafts, GDPR requests)
- Schema v5: VeriTech-10 process records, follow-up tasks, alerts, intelligence register

#### Added — Governance
- EU AI Act governance (high-risk system classification)
- GDPR Data Handling Protocol
- EXCALIBUR Forex Accuracy Correction
- IP Protection Protocol for external coders
- Anti-Fraud Model Governance document

#### Added — Documentation
- MASTER FORENSIC AUDIT REPORT (14 March 2026)
- NCA / Garda ORION Pilot Proposal
- Investigation Protocol Templates (6 templates)
- Complete Deployment Runbook v2.0
- Playbook Corporation Governance Brief

#### Compliance
- Sharp Ruling (AI disclosure on every output) ✅
- EU AI Act Article 6 high-risk classification ✅
- UK/IE GDPR automated enforcement ✅
- POCA 2002 SAR MLRO gate ✅
- VeriTech-10 certification standard ✅

---

## [0.9.0] — 2026-02-01 (Pre-release)
- Initial protocol design: MAP-1, ORION DIRECTIVE
- 31 engine registry (ENG-01 to ENG-31)
- CVK-1100 verification methodology

---

*This changelog follows the [Keep a Changelog](https://keepachangelog.com/) standard.*
