# REGULATORY CLASSIFICATION NOTE — EXCALIBUR AND TRADING OUTPUTS
# Playbook AI Verification Centres Limited — Veritech Division
# Document ID: PAVC-REGULATORY-NOTE-CYCLE2-2026-04-05
# CLASSIFICATION: RESTRICTED — LEGAL REVIEW REQUIRED
# Evidence Class: FACT (system exists) / INF (regulatory assessment) / UV (legal determination)
# ======================================================================

## 1. SYSTEMS UNDER REVIEW

### A: EXCALIBUR Engine Suite
**Location**: `darrylkavanagh-ux/Veritech/CVK-1100-DARRYL-KAVANAGH/EXCALIBUR/`
**Also**: `darrylkavanagh-ux/playbook-energy-services/server/src/engines/ForexAnalysisEngine.ts`
**Nature**: Forex (EUR/USD) and cryptocurrency prediction/signal engine
**Claims**: Accuracy targets discussed; ensemble model; David Clarke sign-off required

### B: Phantom Account
**Location**: `darrylkavanagh-ux/playbook-energy-services/phantom_account_live.json`
**Nature**: Appears to be a live trading account record
**Risk Level**: 🔴 CRITICAL if live

---

## 2. REGULATORY CLASSIFICATION FRAMEWORK

### 2.1 Possible Classifications (all currently INF/UV — legal determination required)

| Classification | Applies If | Regulator | Obligation |
|---------------|-----------|-----------|-----------|
| **Analytical tool only** | No client funds, no investment advice, no client-facing signals | Likely unregulated | Document this clearly in all materials |
| **Investment research** | Distributed to clients as trading basis | ESMA/CBI/FCA | Research disclaimer + disclosure obligations |
| **Investment advice** | Personalised recommendations to invest | CBI Ireland (MiFID II) / FCA (UK) | Authorisation required |
| **Discretionary portfolio management** | Trading on client behalf | CBI/FCA | Authorisation required |
| **Algorithm for financial instruments** | Used in live trading decisions | MiFID II Art. 17 | Algo trading controls + circuit breakers |

### 2.2 Key Indicators (Evidence-Classified)

| Indicator | Finding | Class |
|-----------|---------|-------|
| EXCALIBUR described as "analytical tool" | FACT — Human Oversight Register v2.0 | FACT |
| "98.5% is NOT claimed for FX forecasts" | FACT — confirmed in HOR | FACT |
| David Clarke sign-off required before client delivery | FACT — HOR Domain C | FACT |
| ForexAnalysisEngine.ts present in production codebase | FACT | FACT |
| Phantom account = live account | INF — JSON filename implies live | INF |
| EXCALIBUR used for actual trading decisions | UV | UV |
| MiFID II authorisation obtained | UV — not evidenced | UV |

### 2.3 Critical Risk (INF-class)

If EXCALIBUR outputs are provided to any third party as the basis for trading decisions
without CBI/FCA authorisation, this would likely constitute:
- Provision of investment advice without authorisation (MiFID II)
- Potential market manipulation risk if signals affect market prices
- Consumer protection and advertising regulations breach

---

## 3. RECOMMENDED ACTIONS (Immediate)

**🔴 BEFORE ANY CLIENT-FACING DEPLOYMENT OF EXCALIBUR:**

1. **Legal opinion**: Obtain written opinion from a solicitor with MiFID II expertise
   on whether EXCALIBUR outputs constitute regulated investment advice/research
2. **Phantom account**: Confirm whether `phantom_account_live.json` contains:
   (a) test/demo data, or (b) a real account with real funds
3. **If real account**: Ensure appropriate regulatory compliance for any real trading
4. **Disclaimer language**: All EXCALIBUR outputs must carry explicit "not financial advice"
   disclaimer in prominent position
5. **Client agreements**: Any commercial arrangement involving EXCALIBUR signals must
   include appropriate disclaimers, risk warnings, and terms of service
6. **Document the analytical tool designation**: Formal written policy that EXCALIBUR
   is an analytical tool, not investment advice — confirmed by legal counsel

---
*Evidence class: FACT (system exists) / INF (regulatory risk assessment) / UV (legal classification)*
*This document does NOT constitute legal advice. Legal review by qualified solicitor required.*
*Playbook AI Verification Centres Limited — V10-READY DRAFT — HUMAN CERTIFICATION REQUIRED*
*Document ID: PAVC-REGULATORY-NOTE-CYCLE2-2026-04-05*
