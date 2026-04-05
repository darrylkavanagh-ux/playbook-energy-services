# DATA PROTECTION RISK NOTE — EMAIL INVESTIGATION DATASET
# Playbook AI Verification Centres Limited — Veritech Division
# Document ID: PAVC-GDPR-NOTE-CYCLE2-2026-04-05
# CLASSIFICATION: RESTRICTED — LEGAL REVIEW REQUIRED
# Evidence Class: FACT (data confirmed present) / INF (risk assessment) / UV (lawful basis status)
# ======================================================================

## 1. DATASET IDENTIFIED

**Location:** `darrylkavanagh-ux/playbook-energy-services`
  - `investigations/email-extraction-2025-12-22/investigation_data.json` — **2,977,153 bytes (2.97 MB)**
  - `investigations/email-extraction-2025-12-22/investigation_data.txt` — **2,043,218 bytes (2.04 MB)**
  - `investigations/email-extraction-2025-12-22/investigation_summary.md` — 10,880 bytes
  - `investigations/email-extraction-2025-12-22/ANALYSIS_SUMMARY.md` — 3,327 bytes
  - `investigations/recent-gmail-threads-dec-2025.md` — 3,043 bytes

**Total investigation data volume**: ~5.02 MB
**Evidence class of dataset existence**: FACT (GitHub repo — live confirmed)

Also:
  - `phantom_account_live.json` — 2,558 bytes (financial account data)
  - `phantom_account_live_dashboard.png` — 343,854 bytes (screenshot)

---

## 2. DATA PROTECTION RISK ASSESSMENT

### 2.1 Applicable Law

| Jurisdiction | Instrument | Applies? |
|-------------|-----------|---------|
| Ireland | GDPR (EU) 2016/679 + Data Protection Act 2018 | YES — Irish entity |
| UK | UK GDPR + DPA 2018 | LIKELY — UK individuals involved |
| EU | GDPR 2016/679 | YES |

### 2.2 Key Questions Requiring Legal Determination (All currently: UV)

| Question | Current Status | Required Action |
|---------|---------------|----------------|
| Who are the data subjects? | UV | Legal review of content |
| What personal data categories are present? | UV | Content audit |
| What is the lawful basis for collection? | UV | Legal determination |
| What is the lawful basis for storage in a GitHub repo? | UV | Legal determination — likely requires change |
| Is this a legitimate investigative purpose under GDPR Art. 6(1)(f)? | UV | Legal opinion required |
| Is special category data present (Art. 9)? | UV | Content audit |
| Have data subjects been notified per Art. 13/14? | UV | Unknown |
| Is GitHub an appropriate processor/storage? | INF — RISK HIGH | DPA review |
| What is the retention period? | UV | Policy required |
| Is 2.97 MB of email content proportionate to purpose? | INF — likely NOT proportionate | Minimisation review |

### 2.3 Risk Assessment

| Risk | Severity | Evidence Class |
|------|---------|---------------|
| Personal data of third parties in a private but network-accessible GitHub repo | 🔴 CRITICAL | FACT |
| No documented lawful basis for processing | 🔴 CRITICAL | UV |
| Data volume (5MB) disproportionate to any single investigative task | 🔴 HIGH | INF |
| Potential special category data (health, legal proceedings) | 🟠 HIGH | INF |
| No DPA-compliant retention policy | 🟠 HIGH | UV |
| Data subjects unaware of processing | 🟠 HIGH | INF |

---

## 3. IMMEDIATE RECOMMENDED ACTIONS

**🔴 BEFORE ANY FURTHER USE OF THIS DATA:**

1. **Engage a qualified data protection solicitor** — lawful basis must be confirmed before any processing
2. **Consider removing the data from GitHub** — even private repos are not GDPR-compliant storage
   for personal data without documented technical and organisational measures
3. **Conduct a Data Protection Impact Assessment (DPIA)** — required under GDPR Art. 35 for
   large-scale processing of personal communications
4. **Document the purpose limitation** — what specific investigative purpose justifies
   5MB of email extraction?
5. **Apply data minimisation** — retain only what is strictly necessary for the stated purpose
6. **Check if CVK-1100 investigation exemption applies** — GDPR Art. 10 / DPA 2018 s.10
   may allow processing for legal proceedings, but must be documented

---

## 4. PHANTOM ACCOUNT RISK NOTE

**`phantom_account_live.json` and `phantom_account_live_dashboard.png`:**
- These appear to contain live financial account data
- **Risk**: If this is a real trading account with real funds, storing credentials/data
  in GitHub (even private) violates basic financial data security principles
- **Action required**: Confirm whether this is test/demo data or a live regulated account
- **If live**: Remove immediately and review under relevant financial regulation
  (CBI Ireland, FCA UK, or equivalent)

---
*Evidence class: FACT (files confirmed) / INF (risk classification) / UV (lawful basis)*
*This document does NOT constitute legal advice. Legal review by qualified solicitor required.*
*Playbook AI Verification Centres Limited — V10-READY DRAFT — HUMAN CERTIFICATION REQUIRED*
*Document ID: PAVC-GDPR-NOTE-CYCLE2-2026-04-05*
