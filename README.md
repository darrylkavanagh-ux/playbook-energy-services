# FOXLITE ENERGY SERVICES
## Independent Energy Consultants

**Professional energy consulting services specializing in forensic audits, billing analysis, and regulatory compliance.**

---

## Repository Structure

```
foxlite-consulting/
├── clients/                    # Client engagement materials (CONFIDENTIAL)
│   └── clearspace/            # Clearspace Ltd forensic audit (2026)
│       ├── correspondence/    # Client and supplier letters
│       ├── reports/          # Forensic reports and executive summaries
│       ├── internal/         # Internal briefing notes
│       └── directives/       # Project directives and requirements
├── templates/                 # Reusable document templates
│   ├── foxlite-letterhead.js # Professional letterhead generator
│   ├── foxlite-helpers.js    # Forensic audit calculation utilities
│   └── veritech-certification-page.js # VeriTech 10 certification template
├── diagnostics/              # Platform diagnostic reports
├── website/                  # Foxlite Energy Services website (pending)
└── README.md                 # This file
```

---

## Services Offered

### Forensic Energy Audits
- Comprehensive billing analysis and verification
- Consumption anomaly identification and quantification
- Tariff classification review and optimization
- Regulatory compliance assessment

### Energy Consulting
- Independent energy supply analysis
- Meter accuracy testing coordination
- Supplier performance evaluation
- Energy efficiency recommendations

### Regulatory Support
- CRU complaint preparation and submission
- ESBN technical review requests
- GDPR data access requests
- Legal documentation support

---

## VeriTech 10 Certification Process

All forensic audit outputs undergo our proprietary **VeriTech 10** verification process:

1. **Source Verification** - All data traced to authoritative sources
2. **Arithmetic Verification** - Independent calculation verification
3. **Regulatory Verification** - Compliance with applicable regulations
4. **Limitation Disclosure** - Clear statement of data gaps and constraints
5. **Evidence Classification** - CONFIRMED/CALCULATED/ESTIMATED/UNKNOWN
6. **Professional Certification** - Review by qualified energy professional
7. **Authoritative Source Check** - Cross-reference against primary sources
8. **Integrity Assurance** - Document integrity and version control
9. **Cross-Reference Audit** - Internal consistency verification
10. **Fitness for Purpose** - Suitability for intended regulatory/commercial use

**Result:** CERTIFIED documents carry enhanced evidential weight under Irish and EU law.

---

## Template Usage

### Letterhead Template
```javascript
const letterhead = require('./templates/foxlite-letterhead.js');
const header = letterhead.generateHeader('26/02/2026');
```

### Calculation Helpers
```javascript
const helpers = require('./templates/foxlite-helpers.js');
const rate = helpers.calculations.blendedRate(totalCharges, totalKwh);
const excess = helpers.calculations.excessConsumption(consumption, 50);
```

### VeriTech Certification
```javascript
const veritech = require('./templates/veritech-certification-page.js');
const certPage = veritech.generateCertificationPage(docRef, title, professional, date);
```

---

## Contact Information

**Email:** [EMAIL@FOXLITE.IE]  
**Director:** David Clarke, Group Managing Director  
**Specialization:** Commercial and industrial energy supply forensic analysis

---

## Classification

**CONFIDENTIAL** — This repository contains client engagement materials and proprietary methodologies. Access restricted to authorized personnel only.

---

*Professional energy consulting services delivered with independence, integrity, and technical excellence.*