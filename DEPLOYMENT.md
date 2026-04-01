# Playbook Energy Services — Deployment Guide
# Foxlite / SHERLOCK Forensic Energy Analysis
# Last updated: 2026-04-01

---

## Overview

This repo contains:
- **Foxlite** (`platforms/foxlite/faasp_v1.py`, 49KB) — Forensic Anomaly
  Analysis Service Platform v1, analyses energy billing data for fraud patterns
- **SHERLOCK package** — Electric Ireland parser, Flogas parser, anomaly
  scorer, chain of custody, Foxlite pack generator

---

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for audit log writes) |
| `VERITECH_CERT_SECRET` | V10 cert signing secret |
| `SHERLOCK_CHAIN_OF_CUSTODY_KEY` | Chain-of-custody HMAC key |
| `FOXLITE_OUTPUT_DIR` | Local path for Foxlite output files |
| `NEWSAPI_KEY` | NewsAPI key (for adverse media cross-checks) |

---

## Local Python Run

```bash
git clone https://github.com/darrylkavanagh-ux/playbook-energy-services
cd playbook-energy-services
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set env vars
cp .env.example .env
# Edit .env with local values

# Run Foxlite analysis
python platforms/foxlite/faasp_v1.py --input data/sample_billing.csv --output results/
```

---

## Input Format (Foxlite)

Foxlite expects CSV or JSON:
```json
{
  "account_id": "EI-123456",
  "provider": "electric_ireland",
  "readings": [
    { "date": "2025-01-01", "kwh": 450.2, "charge_gbp": 112.50 },
    ...
  ],
  "metadata": { "property_id": "...", "case_ref": "CVK-1100-XXX" }
}
```

---

## Output Format

Foxlite produces a SHERLOCK pack:
```json
{
  "case_ref": "CVK-1100-XXX",
  "anomaly_score": 0.87,
  "flags": ["GHOST_CONSUMPTION", "BILLING_DISCONTINUITY"],
  "chain_of_custody": { "analyst": "...", "timestamp": "...", "hash": "..." },
  "v10_hook": { "layer": 3, "engine": "ENG-SHERLOCK", "pending_human_review": true }
}
```

---

## Railway Deployment

```
Build: pip install -r requirements.txt
Start: uvicorn platforms.foxlite.faasp_api:app --host 0.0.0.0 --port $PORT
```

Add env vars in Railway dashboard → Variables.

---

## Pre-deploy Test

```bash
# Run unit tests
pytest tests/ -v

# Audit dependencies
pip-audit -r requirements.txt

# Test with sample data
python platforms/foxlite/faasp_v1.py --input tests/fixtures/sample_billing.csv --dry-run
```

---

## V10 Integration

See `V10_INTEGRATION_TODO.md` in this repo for the complete integration plan.
