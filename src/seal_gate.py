"""
seal_gate.py — Foxlite HITL Enforcement Gate
playbook-energy-services | Priority 6

Determines whether a Foxlite anomaly report can be sealed (marked final).
A report can only be sealed if every anomaly item has been reviewed by a
named human reviewer with an explicit decision recorded.

Sharp Ruling [2025] EWHC 1383 (Admin) — SR-05 compliance.
EU AI Act Art. 14 — Human Oversight.

Python 3.10+ | Type-annotated | No external dependencies.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

# ---------------------------------------------------------------------------
# Logger setup
# ---------------------------------------------------------------------------
# The foxlite_logger module provides structured audit logging.
# If not yet available, fall back to stdlib logger for unit testing.
try:
    from foxlite_logger import audit as foxlite_audit  # type: ignore[import]
except ImportError:  # pragma: no cover – logger not yet wired
    def foxlite_audit(event_type: str, payload: dict[str, Any]) -> None:
        logging.getLogger("seal_gate").info(
            "AUDIT | event=%s payload=%s", event_type, payload
        )


# ---------------------------------------------------------------------------
# Public types
# ---------------------------------------------------------------------------

class AnomalyItem:
    """
    Represents a single anomaly finding in a Foxlite report.
    In production this will be a dataclass or Pydantic model wired to
    the SHERLOCK output schema — this stub mirrors the expected interface.
    """
    __slots__ = ("anomaly_id", "severity", "description", "reviewer_ref", "decision")

    def __init__(
        self,
        anomaly_id: str,
        severity: str,
        description: str,
        reviewer_ref: str | None = None,
        decision: str | None = None,
    ) -> None:
        self.anomaly_id: str = anomaly_id
        self.severity: str = severity
        self.description: str = description
        self.reviewer_ref: str | None = reviewer_ref
        self.decision: str | None = decision

    def is_reviewed(self) -> bool:
        """Returns True if both reviewer_ref and decision are present and non-empty."""
        return bool(self.reviewer_ref and self.decision)


SealGateResult = dict[str, Any]


# ---------------------------------------------------------------------------
# Core gate function
# ---------------------------------------------------------------------------

def seal_report_gate(
    report_id: str,
    anomaly_items: list[AnomalyItem],
) -> SealGateResult:
    """
    Determine whether a Foxlite report is eligible to be sealed.

    A report MAY be sealed only when every anomaly item has:
    - reviewer_ref: non-empty string identifying the human reviewer
    - decision: non-empty string ('ACCEPTED', 'REJECTED', 'ESCALATED', etc.)

    Args:
        report_id: Unique identifier for the Foxlite report.
        anomaly_items: List of AnomalyItem objects from SHERLOCK output.

    Returns:
        SealGateResult dict. Two possible shapes:

        If blocked:
        {
            "can_seal": False,
            "reason": str,              # human-readable block reason
            "unreviewed_count": int,    # number of unreviewed anomaly items
            "unreviewed_ids": list[str] # anomaly IDs pending review
        }

        If cleared:
        {
            "can_seal": True,
            "v10_ready": True,
            "report_id": str,
            "reviewer_count": int       # number of distinct reviewers
        }

    Raises:
        ValueError: If report_id is empty or anomaly_items is not a list.
    """
    if not report_id or not report_id.strip():
        raise ValueError("report_id must be a non-empty string")

    if not isinstance(anomaly_items, list):
        raise ValueError("anomaly_items must be a list")

    timestamp: str = datetime.now(tz=timezone.utc).isoformat()

    # Identify unreviewed items
    unreviewed: list[AnomalyItem] = [
        item for item in anomaly_items
        if not item.is_reviewed()
    ]
    unreviewed_ids: list[str] = [item.anomaly_id for item in unreviewed]
    unreviewed_count: int = len(unreviewed)

    if unreviewed_count > 0:
        # Build block result
        result: SealGateResult = {
            "can_seal": False,
            "reason": (
                f"{unreviewed_count} anomaly item(s) have not been reviewed by a "
                f"named human reviewer. All anomaly items require reviewer_ref and "
                f"decision before this report can be sealed."
            ),
            "unreviewed_count": unreviewed_count,
            "unreviewed_ids": unreviewed_ids,
        }

        # Log HITL escalation audit event
        foxlite_audit(
            "hitl_escalation",
            {
                "event": "seal_gate_blocked",
                "report_id": report_id,
                "unreviewed_count": unreviewed_count,
                "unreviewed_ids": unreviewed_ids,
                "timestamp": timestamp,
                "gate": "seal_report_gate",
                "compliance_ref": "SR-05 | EU AI Act Art.14",
            },
        )

        return result

    # All items reviewed — collect distinct reviewer refs for audit
    reviewer_refs: set[str] = {
        item.reviewer_ref  # type: ignore[misc]  # guaranteed non-None after is_reviewed()
        for item in anomaly_items
        if item.reviewer_ref
    }

    # Build cleared result
    cleared_result: SealGateResult = {
        "can_seal": True,
        "v10_ready": True,
        "report_id": report_id,
        "reviewer_count": len(reviewer_refs),
    }

    # Log V10 audit trail — report cleared for sealing
    foxlite_audit(
        "v10_audit",
        {
            "event": "seal_gate_cleared",
            "report_id": report_id,
            "total_anomaly_items": len(anomaly_items),
            "reviewer_count": len(reviewer_refs),
            "timestamp": timestamp,
            "gate": "seal_report_gate",
            "v10_ready": True,
            "compliance_ref": "SR-05 | EU AI Act Art.14",
        },
    )

    return cleared_result


# ---------------------------------------------------------------------------
# Module-level guard
# ---------------------------------------------------------------------------

if __name__ == "__main__":  # pragma: no cover
    # Example / smoke test
    items = [
        AnomalyItem(
            anomaly_id="A-001",
            severity="HIGH",
            description="Anomalous financial flow detected",
            reviewer_ref=None,
            decision=None,
        ),
        AnomalyItem(
            anomaly_id="A-002",
            severity="MEDIUM",
            description="Irregular pattern in booking records",
            reviewer_ref="REVIEWER-007",
            decision="ACCEPTED",
        ),
    ]

    result = seal_report_gate(report_id="RPT-2026-001", anomaly_items=items)
    print(result)
    # Expected: {"can_seal": False, "reason": "...", "unreviewed_count": 1, "unreviewed_ids": ["A-001"]}
