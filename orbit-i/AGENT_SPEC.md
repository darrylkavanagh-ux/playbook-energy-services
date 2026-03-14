# AGENT_SPEC — foxlite-consulting
## Version: 1.0.0 | Updated: 14 March 2026

### Purpose
Foxlite Energy Services — commercial energy bill auditing platform (Phase 1 revenue target)

### Phases Supported
Phase 1, Phase 2, Phase 3

### Roles
UPLOADER, INGESTION_AI

### Tools / Services
| Name | ID | Phase | Inputs | Outputs | Side Effects |
|------|-----|-------|--------|---------|-------------|
| ENERGY-AUDIT-PIPELINE | ENG-ENERGY | 2 | energy_bill | audit_report | writes_supabase |
| UPLOAD-FORM-ENERGY | UI-ENERGY | 1 | energy_bill, client_metadata | document_record | calls_phase1_upload |

### Human-Required Transitions
- ingested_to_awaiting_verification

### External Integrations
- None (standalone)

### Compliance
{
  "gdpr": "UK",
  "energy_regulations": "Ofgem"
}
