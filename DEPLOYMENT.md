# DEPLOYMENT GUIDE — playbook-energy-services (Foxlite)
**Platforms:** Railway (backend) + Cloudflare Pages (frontend)
**Updated:** 2 April 2026

## Required GitHub Secrets
Add these at: https://github.com/darrylkavanagh-ux/playbook-energy-services/settings/secrets/actions

| Secret | Where to get |
|--------|--------------|
| CLOUDFLARE_API_TOKEN | Cloudflare → Profile → API Tokens → Create |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare dashboard right sidebar |
| RAILWAY_TOKEN | railway.app/account/tokens |
| FOXLITE_API_URL | Your Railway URL for Foxlite backend |

## Local Development
```bash
cp .env.example .env
npm install
npm run dev
```

## Health Check
Add this endpoint to ensure deployment verification works:
GET /health → {"status":"ok","service":"foxlite"}
