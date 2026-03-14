# COMPLETE DEPLOYMENT RUNBOOK — ORB AI ECOSYSTEM
## Version: 2.0 | Date: 14 March 2026
## Implements: Master Audit Report Phase 1 recommendations
## Target: Deploy Playbook Energy Audit Services FIRST (first revenue)

---

# PRE-REQUISITES (Do FIRST — all free tier accounts)

## 1. GITHUB SECURITY (BLOCKING — Must be first)
```
1. Go to: github.com → Settings → Password and authentication
2. Enable Two-Factor Authentication (2FA) → Use Authenticator App
   Recommended app: Google Authenticator or Authy
3. Download backup codes → store in secure password manager
4. Go to: Settings → Developer Settings → Personal Access Tokens (Classic)
5. Generate New Token → Name: "ORB-AI-DEPLOY-2026"
6. Scopes: tick 'repo' (all), 'workflow', 'read:user'
7. Set expiration: 90 days
8. COPY TOKEN IMMEDIATELY — you cannot see it again
9. Add token to all deployment secrets below
```

## 2. CREATE FREE ACCOUNTS (30 minutes total)

### Railway.app (Backend hosting — free $5 credit/month)
```
1. Go to: railway.app
2. Sign up with GitHub account (darrylkavanagh-ux)
3. Verify email
4. Note: Project dashboard URL for later
```

### Supabase (Database — free 500MB)
```
1. Go to: supabase.com
2. New Project → name: 'orb-ai-production'
3. Set strong database password → save securely
4. Region: EU West (Ireland) — IMPORTANT for GDPR
5. Wait 2 minutes for provisioning
6. Go to: Settings → API → copy URL and anon key
7. Go to: Settings → Database → copy connection string
```

### Cloudflare (Frontend hosting + CDN — free forever)
```
1. Go to: cloudflare.com → Sign up
2. Add site: foxliteservices.com (register domain first if needed)
3. Go to: Pages → Create a project
4. Connect GitHub account → authorise all repositories
5. Note Account ID from dashboard URL
6. Go to: My Profile → API Tokens → Create Token
   Use template: 'Edit Cloudflare Workers'
   Add permissions: Zone DNS (all), Cloudflare Pages (all)
```

### Neo4j Aura (Graph database — free tier)
```
1. Go to: console.neo4j.io
2. Create account → New Database → AuraFree
3. Download credentials file (contains URI, username, password)
4. SAVE FILE — you cannot retrieve password again
5. Note instance URI format: neo4j+s://[xxx].databases.neo4j.io
```

### Upstash Redis (Cache — free 10K req/day)
```
1. Go to: upstash.com
2. Create database → name: 'orb-ai-cache' → region: eu-west-1
3. Copy Redis URL (starts with rediss://)
```

---

# PHASE 1A: DEPLOY FOXLITE ENERGY SERVICES (First Revenue)
## Estimated time: 2 hours | Revenue: from day 1

### Step 1: Prepare Environment
```bash
# On your local machine, clone the repository
git clone https://github.com/darrylkavanagh-ux/playbook-energy-services.git
cd playbook-energy-services

# Copy environment template
cp .env.example .env

# Edit .env — minimum required for Foxlite:
nano .env
# Set:
# DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
# SUPABASE_URL=https://[REF].supabase.co
# SUPABASE_ANON_KEY=[from Supabase dashboard]
# JWT_SECRET=[run: openssl rand -base64 64]
# NODE_ENV=production
```

### Step 2: Set Up Database
```bash
# Install Supabase CLI
npm install -g supabase

# Run schema migrations (in order)
# First run v1:
psql $DATABASE_URL < supabase_schema.sql

# Then run v2 extension:
psql $DATABASE_URL < supabase_schema_v2.sql

# Verify tables created:
psql $DATABASE_URL -c "\dt"
```

### Step 3: Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init
# Project name: playbook-energy-services-backend

# Add environment variables (copy from .env)
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=[your supabase url]
railway variables set JWT_SECRET=[your secret]
# Add all other variables from .env

# Deploy
railway up

# Note the deployment URL: https://playbook-energy-services-backend.railway.app
```

### Step 4: Deploy Frontend to Cloudflare Pages
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Build frontend
npm install
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist \
  --project-name playbook-energy-services \
  --branch main

# OR use the GitHub Actions workflow already committed:
# .github/workflows/deploy.yml will auto-deploy on push to main
```

### Step 5: Configure Domain
```bash
# In Cloudflare Dashboard:
# 1. Go to: Pages → playbook-energy-services → Custom Domains
# 2. Add: app.foxliteservices.com
# 3. In DNS → Add CNAME: app → playbook-energy-services.pages.dev
# 4. Wait for SSL certificate (5-10 minutes)
```

### Step 6: Verify Deployment
```bash
# Test health endpoint
curl https://playbook-energy-services-backend.railway.app/health

# Expected response:
# { "status": "healthy", "platform": "Playbook Energy Audit Services", "version": "1.0.0" }

# Test frontend
curl -I https://app.foxliteservices.com
# Expected: HTTP/2 200
```

---

# PHASE 1B: ACTIVATE API INTEGRATIONS (60 minutes, mostly free)

## Companies House API (FREE — Essential for ENG-19 CORPORATE)
```bash
# 1. Register: developer.company-information.service.gov.uk
# 2. Create application → note API key
# 3. Add to .env:
COMPANIES_HOUSE_API_KEY=your_key_here

# Test immediately:
curl -u "your_key_here:" \
  "https://api.company-information.service.gov.uk/search/companies?q=gisborne+limited"
```

## Alchemy Blockchain API (FREE — Essential for ENG-17 CRYPTO)
```bash
# 1. Register: alchemy.com
# 2. Create App → Network: Ethereum Mainnet
# 3. Get API key from dashboard
# 4. Add to .env:
ALCHEMY_API_KEY=your_key_here

# Test:
curl -X POST "https://eth-mainnet.g.alchemy.com/v2/your_key_here" \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## OFAC Sanctions (FREE — No key needed)
```bash
# Test immediately (no registration):
curl "https://api.ofac.treasury.gov/v1/sanctions/search?name=Gisborne+Limited"
```

## HaveIBeenPwned (£3.50/month — Dark web intelligence)
```bash
# 1. Register: haveibeenpwned.com/API/Key
# 2. Subscribe monthly plan (£3.50 — cheapest enterprise tool available)
# 3. Get API key
# 4. Add to .env:
HIBP_API_KEY=your_key_here

# Test:
curl -H "hibp-api-key: your_key_here" \
  -H "user-agent: ORB-AI/1.0" \
  "https://haveibeenpwned.com/api/v3/breachedaccount/test@example.com"
```

## UK Insolvency Register (FREE — No key needed)
```bash
# Test immediately:
curl "https://api.insolvency.service.gov.uk/individual?surname=gisborne"
```

---

# PHASE 1C: NEO4J ATLAS ACTIVATION

```bash
# 1. Get credentials from Neo4j Aura dashboard
# 2. Add to .env:
NEO4J_URI=neo4j+s://[instance-id].databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=[from credentials file]

# 3. Run schema setup (in Neo4j Browser or via CLI):
cypher-shell -a $NEO4J_URI -u $NEO4J_USERNAME -p $NEO4J_PASSWORD \
  -f implementations/engines/atlas-neo4j/SETUP.md

# 4. Import Waterford Cartel network (already in schema):
# The schema file includes MERGE statements for Hoban, Keller, Walsh, Springhill House
```

---

# PHASE 2: DEPLOY KAVAN AI WEBSITE (VeriTech Portal)
## Prerequisite: I See Media Ltd legal matter resolved

### Step 1: Activate Stripe Payments
```bash
# 1. Register: stripe.com
# 2. Complete KYC (business verification)
# 3. Get live keys (after KYC complete)
# 4. Add to .env:
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
# 5. Create webhook in Stripe dashboard → point to:
#    https://api.kavan.ai/payments/webhook
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Revenue from day 1:
# Stage 1: £170 per verification
# Stage 2: £1,700 per full investigation
# Certificate: £49 per VeriTech-10 certificate
```

### Step 2: Deploy Backend
```bash
cd kavan-ai-website
railway init  # kavan-ai-backend
railway variables set [all env vars]
railway up
```

### Step 3: Deploy Frontend
```bash
npm run build
wrangler pages deploy dist --project-name kavan-ai-website
# Custom domain: app.kavan.ai
```

---

# PHASE 3: DEPLOY VERITECH ENGINE SUITE

### Blockchain Contracts (Arbitrum testnet FIRST)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Test on Arbitrum testnet (free — get test ETH from faucet)
cd veritech-engine-suite
forge test  # Run all tests first
forge build

# Deploy to testnet first (MANDATORY — test before mainnet)
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://goerli-rollup.arbitrum.io/rpc \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast

# After successful testnet verification → deploy to mainnet:
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $ARBISCAN_KEY
```

---

# PHASE 4: DEPLOY ORB AI MASTER PLATFORM

```bash
cd orb-ai-platform
railway init  # orb-ai-backend
railway variables set [all env vars including NEO4J, ALCHEMY, CH, HIBP]
railway up
wrangler pages deploy dist --project-name orb-ai-platform
# Custom domain: app.orbai.io
```

---

# PHASE 5: DEPLOY WATERFORD POST & CARDIFF POST

```bash
cd waterford-post
railway init  # waterford-post-backend
railway variables set [env vars]
railway up
wrangler pages deploy dist --project-name waterford-post
# Waterford: waterfordpost.ie
# Cardiff: cardiffpost.co.uk
```

---

# MONITORING & ALERTING

```bash
# Sentry (free 5K errors/month)
# 1. Register: sentry.io
# 2. Create project → Platform: Node.js
# 3. Get DSN
# 4. Add to .env: SENTRY_DSN=https://xxx@sentry.io/xxx

# UptimeRobot (free 50 monitors)
# 1. Register: uptimerobot.com
# 2. Add monitors for all 7 platform health endpoints:
#    https://app.foxliteservices.com/health
#    https://api.kavan.ai/health
#    https://app.orbai.io/health
#    https://veritech.io/health
#    https://waterfordpost.ie/health
#    https://cardiffpost.co.uk/health
# 3. Set alerts to: darryl@playbookcorp.co.uk
```

---

# POST-DEPLOYMENT CHECKLIST

- [ ] Foxlite backend returns 200 on /health
- [ ] Foxlite frontend loads at app.foxliteservices.com
- [ ] Supabase connection verified (all tables created)
- [ ] Neo4j Aura connected (Waterford Cartel graph loaded)
- [ ] Companies House API returns company data
- [ ] OFAC API returns screening results
- [ ] Alchemy API returns ETH block number
- [ ] GitHub Actions CI/CD triggered on push (green)
- [ ] Sentry receiving test event
- [ ] UptimeRobot monitoring all endpoints
- [ ] First energy audit report generated via Foxlite
- [ ] 2FA enabled on GitHub ✅ (MUST be before this list)
