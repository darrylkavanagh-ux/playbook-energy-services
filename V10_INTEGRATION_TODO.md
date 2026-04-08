# V10 Integration TODO — Foxlite Automated Audit Service Platform
## File: playbook-energy-services/V10_INTEGRATION_TODO.md
## Playbook Corporation Limited
## 1 April 2026

---

## 1. CURRENT STATE

`faasp_v1.py` (Foxlite Automated Audit Service Platform) currently:

- Accepts invoice batches and financial document inputs
- Runs SHERLOCK anomaly scoring against each invoice/document
- Produces structured Python output (dict / JSON) containing:
  - Anomaly scores per invoice
  - Summary findings
  - Evidence references
- Generates a final PDF audit report from the structured output

**What is missing:**
- No V10 certification layer — outputs carry no V10 cert grade or cert ID
- No chain-of-custody record linked to a V10 cert
- No HITL (Human-In-The-Loop) gate before PDF is sealed
- SHERLOCK anomaly outputs do not include `v10Classification` field
- No `/v10/certify` API call in the pipeline

---

## 2. INTEGRATION STEPS

Complete the following steps in order. Each step is a discrete, deployable unit of work.

### Step 1 — Import V10Certificate Type

**Action:** Import the `V10Certificate` type (and associated `V10CertifyRequest` / `V10CertifyResponse` models) from the VeriTech engine suite into the Foxlite Python codebase.

**Method (choose one based on deployment stage):**

Option A — Shared API (preferred until package is published):
```python
# faasp_v1.py — top of file
import httpx  # or requests
from typing import TypedDict, Literal

V10Grade = Literal["A1", "A2", "B1", "B2", "C", "PENDING", "ANOMALY"]

class V10CertifyRequest(TypedDict):
    documentHash: str        # SHA-256 of the document/report
    caseRef: str             # Internal case reference
    documentType: str        # e.g. "audit_report"
    engineIds: list[str]     # Engines involved in generating the output
    verifierRef: str | None  # Human verifier name + role (required for A1/A2)

class V10CertifyResponse(TypedDict):
    certId: str
    grade: V10Grade
    status: Literal["ISSUED", "PENDING", "ANOMALY", "REJECTED"]
    issuedAt: str            # ISO 8601 UTC
    hitlRequired: bool
    chainRecord: str         # Blockchain / audit log reference
```

Option B — npm/PyPI package (when `veritech-engine-suite` is published):
```python
# requirements.txt: veritech-engine-suite>=1.0.0
from veritech_engine_suite import V10Certificate, V10CertifyRequest
```

**Dependency note:** See Section 4.

---

### Step 2 — Add POST /v10/certify Call at End of Audit Pipeline

**Action:** After all SHERLOCK scoring and report generation is complete, but BEFORE the PDF
is sealed, add a call to the ORB AI `/v10/certify` endpoint.

**Location in `faasp_v1.py`:** After `generate_report_json()` and before `seal_pdf()`.

```python
import hashlib
import httpx
import os

V10_CERTIFY_URL = os.environ["ORB_AI_V10_CERTIFY_URL"]  # e.g. https://api.orbai.io/v10/certify
V10_API_KEY = os.environ["ORB_AI_API_KEY"]               # Never hardcode

def call_v10_certify(
    report_json: dict,
    case_ref: str,
    verifier_ref: str | None = None,
) -> V10CertifyResponse:
    """
    Call the ORB AI /v10/certify endpoint.
    Returns V10CertifyResponse. Raises on HTTP error.
    Never log V10_API_KEY or any secret in this function.
    """
    report_bytes = json.dumps(report_json, sort_keys=True).encode("utf-8")
    document_hash = hashlib.sha256(report_bytes).hexdigest()

    payload: V10CertifyRequest = {
        "documentHash": document_hash,
        "caseRef": case_ref,
        "documentType": "audit_report",
        "engineIds": ["ENG-07", "ENG-26", "ENG-31"],  # Update to reflect actual engines used
        "verifierRef": verifier_ref,
    }

    response = httpx.post(
        V10_CERTIFY_URL,
        json=payload,
        headers={"Authorization": f"Bearer {V10_API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()
```

**Error handling:** If the `/v10/certify` call fails, do NOT seal the PDF. Log the failure
using `foxlite_logger.error(...)` (see `utils/logger.py`) and place the case in PENDING
state for operator review.

---

### Step 3 — Attach V10Certificate to Final Report Output

**Action:** Embed the returned `V10CertifyResponse` in both the JSON output and the HTML/PDF report.

**JSON output — add `v10Cert` key:**
```python
final_output = {
    "caseRef": case_ref,
    "auditFindings": findings,
    "anomalyScores": anomaly_scores,
    "v10Cert": v10_response,  # Full V10CertifyResponse dict
    "generatedAt": datetime.now(timezone.utc).isoformat(),
}
```

**HTML/PDF report — add V10 certification block:**
Add a "VeriTech V10 Certification" section to the PDF report template. This section must show:
- Cert ID
- Grade (A1 / A2 / PENDING / ANOMALY)
- Issued at (timestamp)
- Human verifier reference (if A1/A2)
- Chain record reference
- AI Disclosure statement (verbatim from cert record)

**HITL note:** If `v10_response["grade"] == "PENDING"`, do not seal the PDF. Present the
auditor with the HITL review flow (Step 4).

---

### Step 4 — Add Human Reviewer Step (HITL Gate)

**Action:** After anomaly scoring and BEFORE the PDF seal action, implement a mandatory
human auditor review step for all cases with ANOMALY-classified items.

**Logic:**
```python
def requires_hitl_review(anomaly_scores: list[dict], v10_response: V10CertifyResponse) -> bool:
    """Returns True if human review is required before PDF can be sealed."""
    has_anomaly = any(item["v10Classification"] == "ANOMALY" for item in anomaly_scores)
    cert_pending = v10_response.get("status") == "PENDING"
    cert_hitl = v10_response.get("hitlRequired", False)
    return has_anomaly or cert_pending or cert_hitl

# In main pipeline:
if requires_hitl_review(anomaly_scores, v10_response):
    foxlite_logger.hitl_escalation(
        engine_id="ENG-31",
        reason="Anomaly-classified items require auditor review before seal",
        case_ref=case_ref,
        correlation_id=correlation_id,
    )
    # Halt pipeline — return PENDING status to caller
    # Do NOT call seal_pdf() until auditor has cleared the HITL flag
    return {"status": "PENDING_HITL_REVIEW", "caseRef": case_ref, "v10CertId": v10_response["certId"]}
```

**UI requirement:** The Foxlite front-end must present the auditor with:
- List of all ANOMALY-classified items (with invoice ref + anomaly type + severity)
- "Approve" and "Reject" actions per item (or "Approve All" / "Reject All")
- "Seal Report" button enabled only after all ANOMALY items have been actioned
- Auditor name + timestamp recorded on approval

---

### Step 5 — Store V10 Cert ID in Audit Record

**Action:** Persist the V10 cert ID in the audit record (database row or audit log file)
for chain-of-custody purposes.

```python
# After sealing the PDF, write the cert ID to the audit record
audit_record = {
    "caseRef": case_ref,
    "v10CertId": v10_response["certId"],
    "v10Grade": v10_response["grade"],
    "v10IssuedAt": v10_response["issuedAt"],
    "v10ChainRecord": v10_response["chainRecord"],
    "sealedAt": datetime.now(timezone.utc).isoformat(),
    "auditedBy": verifier_ref,
}
save_audit_record(audit_record)  # Implement: DB insert or append to audit log file

foxlite_logger.audit(
    action="AUDIT_REPORT_SEALED",
    engine_id="ENG-31",
    case_ref=case_ref,
    result=v10_response["grade"],
    correlation_id=correlation_id,
    v10CertId=v10_response["certId"],
)
```

---

## 3. SHERLOCK INTEGRATION

SHERLOCK anomaly scorer outputs must be updated to include a `v10Classification` field
on every scored item before those outputs are passed to the `faasp_v1.py` report generator.

### Required Change to SHERLOCK Output Schema

Current SHERLOCK output per item:
```python
{
    "invoiceRef": "INV-001",
    "anomalyScore": 0.87,
    "anomalyType": "DUPLICATE_INVOICE",
    "severity": "HIGH",
}
```

Required SHERLOCK output per item (add `v10Classification`):
```python
{
    "invoiceRef": "INV-001",
    "anomalyScore": 0.87,
    "anomalyType": "DUPLICATE_INVOICE",
    "severity": "HIGH",
    "v10Classification": "ANOMALY",  # One of: EVIDENTIAL | ANOMALY | ROUTINE
}
```

### V10 Classification Mapping for SHERLOCK

| SHERLOCK Score Range | Severity | v10Classification |
|---|---|---|
| 0.80 – 1.00 | HIGH / CRITICAL | `ANOMALY` |
| 0.50 – 0.79 | MEDIUM | `EVIDENTIAL` (if score > 0.65) or `REQUIRES_FOLLOW_UP` |
| 0.00 – 0.49 | LOW / NONE | `ROUTINE` |

Implement this mapping in `packages/sherlock/src/classifier.py` (or equivalent).
The mapping thresholds may be adjusted based on validation testing, but any change
must be documented in `governance/ACCURACY_LOG.md`.

---

## 4. DEPENDENCIES

The following dependencies must be in place before integration can proceed:

| Dependency | Status | Action Required |
|---|---|---|
| VeriTech engine suite must expose `/v10/certify` endpoint | ⚠️ Check current status | Confirm `orb-ai-platform` `/v10/certify` route is deployed and accessible |
| ORB AI backend must be deployed with `/v10/certify` route | ⚠️ See DEPLOYMENT.md | Deploy ORB AI platform per `orb-ai-platform/DEPLOYMENT.md` |
| `ORB_AI_V10_CERTIFY_URL` env var must be set | ❌ Not yet set in Foxlite | Add to `.env.example` and Railway/Vercel env var config |
| `ORB_AI_API_KEY` env var must be set | ❌ Not yet set in Foxlite | Generate API key from ORB AI admin; store in Railway secrets |
| `httpx` Python package | ✅ Likely present; confirm in requirements.txt | `pip install httpx` if not present |
| `veritech-engine-suite` PyPI package (optional) | ❌ Not yet published | Publish when ready; use shared API approach in interim |

---

## 5. TEST REQUIREMENTS

### 5.1 SHERLOCK Test: v10Classification Field

Add the following test to `packages/sherlock/tests/` (file: `test_anomaly_classifier.py`
or equivalent):

```python
def test_anomaly_output_includes_v10_classification():
    """
    Requirement: Sharp Ruling [2025] EWHC 1383 (Admin) — Req 3 (Non-Existent Sources)
    EU AI Act Article 14 (Human Oversight)
    Every SHERLOCK anomaly output must include v10Classification field.
    """
    from sherlock.classifier import classify_anomaly_score

    # High score → ANOMALY
    result = classify_anomaly_score(score=0.92, severity="HIGH")
    assert "v10Classification" in result, "v10Classification field missing from SHERLOCK output"
    assert result["v10Classification"] == "ANOMALY"

    # Low score → ROUTINE
    result = classify_anomaly_score(score=0.20, severity="LOW")
    assert result["v10Classification"] == "ROUTINE"

    # Medium score → EVIDENTIAL or REQUIRES_FOLLOW_UP
    result = classify_anomaly_score(score=0.67, severity="MEDIUM")
    assert result["v10Classification"] in ("EVIDENTIAL", "REQUIRES_FOLLOW_UP")
```

### 5.2 FAASP Integration Test: HITL Gate

```python
def test_hitl_gate_blocks_pdf_seal_on_anomaly():
    """
    Requirement: EU AI Act Article 14 (Human Oversight)
    Sharp Ruling Requirement 2 (Professional Responsibility)
    PDF must not be sealed when ANOMALY items are present without human review.
    """
    from faasp_v1 import requires_hitl_review

    anomaly_scores = [{"v10Classification": "ANOMALY", "invoiceRef": "INV-001"}]
    v10_response = {"status": "PENDING", "hitlRequired": True, "grade": "PENDING", "certId": "cert-001"}

    assert requires_hitl_review(anomaly_scores, v10_response) is True

def test_pdf_seal_allowed_when_no_anomaly():
    from faasp_v1 import requires_hitl_review

    anomaly_scores = [{"v10Classification": "ROUTINE", "invoiceRef": "INV-002"}]
    v10_response = {"status": "ISSUED", "hitlRequired": False, "grade": "B1", "certId": "cert-002"}

    assert requires_hitl_review(anomaly_scores, v10_response) is False
```

---

*This TODO is maintained in `playbook-energy-services/V10_INTEGRATION_TODO.md`.*
*Owner: Engineering Lead (Foxlite / Playbook Energy Services)*
*Target completion: 2–6 weeks from 1 April 2026*
