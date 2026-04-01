"""
logger.py — Structured JSON logger for Foxlite Forensic Services
Service: foxlite-forensic-services
V10 Compliance: includes audit() method for chain-of-custody logging
Foxlite-specific: invoice_anomaly() method for SHERLOCK anomaly scorer logging

SECURITY RULES (MANDATORY):
  - NEVER log: API keys, tokens, passwords, PATs, secret values
  - NEVER log: PII (names, passport numbers, DOBs, addresses, case refs to external parties)
  - NEVER log: Full exception objects (may contain request details with secrets)
  - DO log: error messages (truncated to 200 chars), engine IDs, case refs, timestamps
  - Invoice refs may be logged as they are internal references, not personal data
"""

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Literal, Optional


class StructuredLogger:
    """
    JSON structured logger with correlation ID support.
    Compliant with V10 audit trail requirements and GDPR logging restrictions.
    """

    def __init__(self, service: str, version: str = "1.0.0") -> None:
        self.service = service
        self.version = version
        self._logger = self._setup_logger()

    def _setup_logger(self) -> logging.Logger:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter("%(message)s"))
        logger = logging.getLogger(self.service)
        if not logger.handlers:
            logger.addHandler(handler)
        logger.setLevel(logging.INFO)
        logger.propagate = False
        return logger

    def _build_entry(
        self,
        level: str,
        message: str,
        correlation_id: Optional[str] = None,
        extra: Optional[dict[str, Any]] = None,
    ) -> str:
        entry: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "service": self.service,
            "version": self.version,
            "correlationId": correlation_id or "NONE",
            "message": str(message)[:500],  # Truncate to prevent log injection
        }
        if extra:
            # Filter out any accidentally-passed sensitive keys
            _BLOCKED_KEYS = {
                "password", "token", "secret", "api_key", "apikey",
                "authorization", "pat", "credential", "private_key",
            }
            safe_extra = {
                k: v for k, v in extra.items()
                if k.lower() not in _BLOCKED_KEYS
            }
            entry.update(safe_extra)
        return json.dumps(entry, default=str)

    def info(
        self,
        message: str,
        correlation_id: Optional[str] = None,
        **extra: Any,
    ) -> None:
        self._logger.info(self._build_entry("INFO", message, correlation_id, extra or None))

    def warn(
        self,
        message: str,
        correlation_id: Optional[str] = None,
        **extra: Any,
    ) -> None:
        self._logger.warning(self._build_entry("WARN", message, correlation_id, extra or None))

    def error(
        self,
        message: str,
        correlation_id: Optional[str] = None,
        **extra: Any,
    ) -> None:
        # Accept message string only — never pass raw Exception objects
        safe_msg = str(message)[:200]
        self._logger.error(self._build_entry("ERROR", safe_msg, correlation_id, extra or None))

    def audit(
        self,
        action: str,
        engine_id: str,
        case_ref: str,
        result: str,
        correlation_id: Optional[str] = None,
        **extra: Any,
    ) -> None:
        """
        V10 audit trail — every engine action MUST be logged here.
        These logs form the chain-of-custody record for V10 certification.
        """
        entry_extra = {
            "engineId": engine_id,
            "caseRef": case_ref,
            "result": result,
            "v10AuditTrail": True,
            **extra,
        }
        self._logger.info(
            self._build_entry(
                "AUDIT",
                f"{action} via {engine_id}",
                correlation_id,
                entry_extra,
            )
        )

    def hitl_escalation(
        self,
        engine_id: str,
        reason: str,
        case_ref: str,
        correlation_id: Optional[str] = None,
    ) -> None:
        """
        Log a Human-In-The-Loop escalation event (ENG-31 trigger).
        This is a HIGH-PRIORITY log entry for the V10 oversight record.
        """
        self._logger.warning(
            self._build_entry(
                "HITL_ESCALATION",
                f"HITL required: {reason[:100]}",
                correlation_id,
                {
                    "engineId": engine_id,
                    "caseRef": case_ref,
                    "v10Classification": "ANOMALY",
                    "hitlRequired": True,
                    "v10AuditTrail": True,
                },
            )
        )

    def invoice_anomaly(
        self,
        invoice_ref: str,
        anomaly_type: str,
        severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"],
        correlation_id: Optional[str] = None,
    ) -> None:
        """
        Foxlite-specific: Log an invoice anomaly finding from the SHERLOCK anomaly scorer.

        Used by SHERLOCK anomaly scorer to log individual invoice/document findings.
        Each call represents one anomaly finding on one invoice reference.
        These logs are part of the V10 audit trail for the Foxlite forensic audit platform.

        Args:
            invoice_ref:     Internal invoice reference (e.g. "INV-001"). Not personal data.
            anomaly_type:    SHERLOCK anomaly classification (e.g. "DUPLICATE_INVOICE",
                             "INFLATED_VALUE", "MISSING_COUNTERPARTY", "DATE_ANOMALY").
            severity:        Severity level — LOW | MEDIUM | HIGH | CRITICAL.
            correlation_id:  Request correlation ID for tracing across services.

        Security note:
            Do NOT pass invoice counterparty names, personal names, or account numbers
            as invoice_ref or anomaly_type. Use only internal reference codes.
        """
        # Map severity to V10 classification
        v10_classification: str
        if severity in ("HIGH", "CRITICAL"):
            v10_classification = "ANOMALY"
        elif severity == "MEDIUM":
            v10_classification = "REQUIRES_FOLLOW_UP"
        else:
            v10_classification = "ROUTINE"

        self._logger.warning(
            self._build_entry(
                "AUDIT",
                f"Invoice anomaly detected: {anomaly_type} on {invoice_ref}",
                correlation_id,
                {
                    "engineId": "SHERLOCK",
                    "invoiceRef": invoice_ref,
                    "anomalyType": anomaly_type,
                    "severity": severity,
                    "v10Classification": v10_classification,
                    "v10AuditTrail": True,
                    "hitlRequired": severity in ("HIGH", "CRITICAL"),
                    "platform": "foxlite-forensic-services",
                },
            )
        )


# Module-level default loggers — import and use directly
foxlite_logger = StructuredLogger("foxlite-forensic-services", "1.0.0")

# Usage examples:
# from utils.logger import foxlite_logger
#
# Basic logging:
# foxlite_logger.info("Audit pipeline started", correlation_id="req-abc123", caseRef="CASE-001")
#
# V10 audit trail:
# foxlite_logger.audit("REPORT_GENERATED", "ENG-31", "CASE-001", "PENDING", "req-abc123")
#
# HITL escalation:
# foxlite_logger.hitl_escalation("ENG-31", "Anomaly items require review", "CASE-001", "req-abc123")
#
# Invoice anomaly (SHERLOCK):
# foxlite_logger.invoice_anomaly("INV-001", "DUPLICATE_INVOICE", "HIGH", "req-abc123")
# foxlite_logger.invoice_anomaly("INV-042", "DATE_ANOMALY", "MEDIUM", "req-abc123")
#
# Error (safe — no exception object):
# foxlite_logger.error("V10 certify API call failed", engineId="ENG-31", caseRef="CASE-001")
