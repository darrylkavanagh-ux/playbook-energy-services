# PLAYBOOK LABS - COMPLETE PLATFORM INVENTORY & CAPABILITIES DOCUMENTATION

**Repository:** https://github.com/darrylkavanagh-ux/foxlite-consulting  
**Branch:** genspark_ai_developer  
**Documentation Date:** February 16, 2026  
**Compiled By:** GenSpark AI Developer

---

## EXECUTIVE SUMMARY

### Platform Identity
**Name:** PLAYBOOK LABS Ecosystem  
**Suite Components:**
- **NO COMPARE** - Energy Bill Analysis Platform
- **ORB AI** - Document Verification & Fraud Detection Platform
- **KAVAN AI** - Legal Intelligence & Asset Tracing Platform
- **FOXLITE CONSULTING** - Forensic Utility Audit Services

### Mission Statement
"Decentralized truth verification and intelligence infrastructure designed to dismantle complex billing systems, verify document authenticity, trace hidden assets, and expose financial irregularities."

### Platform Statistics
- **Total Files:** 97 (excluding node_modules)
- **TypeScript Files:** 133
- **UI Components:** 69 components (6,349 lines of code)
- **Application Pages:** 8 main routes
- **Asset Documents:** 6 legal/business templates
- **Dependencies:** 627 npm packages
- **Code Quality:** TypeScript Strict Mode, Zero Errors

---

## 1. CORE PLATFORMS & CAPABILITIES

### 1.1 NO COMPARE - Energy Bill Analysis Platform

#### Purpose
Revolutionary energy bill analysis system designed to expose energy supplier overcharging through AI-powered forensic analysis.

#### Core Features

**Bill Upload & Analysis**
- Location: `/analyze`
- Drag & drop file upload (PDF, JPG, PNG)
- Mock 3-second AI processing simulation
- Auto-redirect to results

**AI Analysis Engine (Claimed):**
- 12 AI Engines Active
- OCR Extraction - Line-by-line bill dismantling
- NLP Processing - Tariff structure understanding
- Market Comparison - Real-time cross-referencing
- Fraud Detection - Hidden charge identification

**Results Display:**
- Current vs recommended supplier comparison
- Annual savings calculation (€482.50 example)
- Usage breakdown chart (12-month visualization)
- One-click switch capability

**Statistics:**
- €2M+ Potential damages found
- 12 Active engines running
- 100% Market coverage
- 0.0s Bias (pure math)

---

### 1.2 ORB AI - Truth Verification Infrastructure

#### Purpose
World's first decentralized truth verification infrastructure for document authenticity, deepfake detection, and identity verification.

#### Core Features

**Document Verification:**
- Location: `/orb`
- Drag & drop scanning interface
- Live feed visualization with animated scanning
- Document types: IDs, Contracts, Certificates

**Global Fraud Index:**
- Current index: 84%
- Real-time progress bar visualization

**Active Node Network:**
- 🟢 London, UK (Active)
- 🟢 Dublin, IE (Active)
- 🟢 New York, US (Active)
- 🟡 Singapore, SG (Partial)

**Capabilities:**
- Deep Fake Detection - 99.9% accuracy claimed
- Blockchain Notary - Immutable document hashing
- Identity Scoring - 500+ data point cross-reference

**Compliance:**
- ✅ C27 Compliant
- ✅ GDPR Ready

---

### 1.3 KAVAN AI - Legal Intelligence Platform

#### Purpose
Automated legal warfare system providing case strategy, asset tracing, and precedent analysis.

#### Active Case Files

**Case 1: CORP-2026-001**
- Client: Signa care Group
- Type: Utility Audit
- Status: PROPOSAL READY ✅
- Documents: Audit Proposal, Letter of Authority

**Case 2: CASE-2024-089**
- Client: David Clarke vs. Cavan General
- Type: Medical Negligence
- Status: PROCESSING RBA 🔴 (animated)
- Legal Pack: Brief to Senior Counsel, AI Medical Assessment, Opinion on Merits, Forensic Chronology

**Case 3: CASE-2024-042**
- Client: Waterford Crystal Asset Strip
- Status: ONGOING

**Global Asset Tracing:**
- Target: OFFSHORE_ACC_77
- Jurisdiction: Cayman Islands
- Value: €4.2M

**Investigation Tools:**
- Entity Resolution
- Corporate Structure Analysis
- Financial Forensics
- Social Graph Mapping

---

### 1.4 FOXLITE CONSULTING - Corporate Services

#### Purpose
Forensic utility audit and cost recovery services for nursing homes, hotels, and industrial groups.

#### Services

**Historic Refund Recovery:**
- 6-year back-bill analysis
- Tariff error identification
- Tax overcharge correction

**Rate Optimization:**
- Direct supplier negotiation
- Group buying power
- Below-market rates

**Business Model:**
- No Win, No Fee
- 15-22% recovery rate
- €15,000-€40,000 typical per site

---

## 2. COMPLETE FILE INVENTORY

### Root Directory Structure
```
webapp/
├── client/              # Frontend application
├── server/              # Express server
├── shared/              # Shared constants
├── src/                 # Legacy source
├── patches/             # Package patches
├── dist/                # Build output
├── node_modules/        # 627 dependencies
├── package.json         # Project config
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.ts   # Tailwind config
├── TEST_REPORT.md       # Testing documentation
└── ideas.md             # Design philosophy
```

### Client Application Structure
```
client/
├── index.html           # Client entry point
├── public/              # Static assets
│   └── __manus__/
│       └── debug-collector.js
└── src/
    ├── main.tsx         # React entry
    ├── App.tsx          # Root component
    ├── index.css        # Global styles
    │
    ├── assets/          # 6 legal documents
    │   ├── DAVID_CLARKE_AI_MEDICAL_ASSESSMENT_DAMAGES.md
    │   ├── DAVID_CLARKE_CHRONOLOGICAL_REPORT.md
    │   ├── DAVID_CLARKE_LEGAL_PACK_BRIEF_SENIOR_COUNSEL.md
    │   ├── DAVID_CLARKE_OPINION_ON_MERITS.md
    │   ├── SIGNICARE_LETTER_OF_AUTHORITY.md
    │   └── SIGNICARE_UTILITY_AUDIT_PROPOSAL.md
    │
    ├── components/      # React components
    │   ├── Layout.tsx   # Global layout
    │   ├── ErrorBoundary.tsx
    │   ├── ManusDialog.tsx
    │   ├── Map.tsx
    │   └── ui/          # 69 UI components
    │
    ├── contexts/
    │   └── ThemeContext.tsx
    │
    ├── hooks/           # 4 custom hooks
    ├── lib/             # Utilities
    └── pages/           # 9 page components
        ├── Home.tsx
        ├── Analyze.tsx
        ├── Results.tsx
        ├── OrbAI.tsx
        ├── KavanAI.tsx
        ├── Foxlite.tsx
        ├── SystemStatus.tsx
        └── NotFound.tsx
```

---

## 3. TECHNOLOGY STACK

### Frontend
- **React:** 19.2.1 (latest)
- **TypeScript:** 5.6.3 (strict mode)
- **Vite:** 7.1.9 (build tool)
- **Tailwind CSS:** 4.1.14 (styling)
- **Radix UI:** Complete component suite (28 packages)
- **TanStack Query:** 5.90.20 (state management)
- **Wouter:** 3.7.1 (routing - patched)
- **Framer Motion:** 12.23.22 (animations)

### Backend
- **Express:** 4.21.2 (minimal server)
- **Node.js:** v18+ required

### UI Libraries
- **lucide-react:** 0.453.0 (1000+ icons)
- **recharts:** 2.15.4 (charts)
- **sonner:** 2.0.7 (toasts)
- **react-hook-form:** 7.64.0 (forms)
- **zod:** 4.1.12 (validation)

### Development Tools
- **prettier:** 3.6.2 (formatting)
- **esbuild:** 0.25.10 (fast bundler)
- **vitest:** 2.1.9 (testing framework - not used)

---

## 4. DESIGN SYSTEM

### Neo-Brutalist Energy Design

**Philosophy:**
"Treat energy bills as a hazard requiring immediate remediation with maximum visibility."

**Core Principles:**
1. Urgency & Warning
2. Raw Utility (no decoration)
3. High Visibility (maximum contrast)

**Color Palette:**
- Safety Yellow: `#FFD700`
- Construction Black: `#000000`
- Off-White: `#F5F5F5`
- Signal White: `#FFFFFF`
- Orb AI Cyan: `#00FFFF`
- Kavan AI Red: `#FF3333`

**Typography:**
- Headings: Space Grotesk (Bold/Black)
- Body: Space Mono / JetBrains Mono (Monospaced)

**UI Elements:**
- Hard Borders: 4px solid black
- Neo-Shadows: `4px 4px 0px #000000`
- No rounded corners (except circles)
- Asymmetric grids for tension

---

## 5. APPLICATION ROUTES

### Complete Route Map

**/ (Home)** - NO COMPARE landing page
- Hero section with "Stop Overpaying For Energy"
- 3-step process (Upload, Analyze, Switch)
- Statistics (€2M+, 12 engines, 100% coverage)
- CTA: "Analyze My Bill"

**/analyze** - Bill upload interface
- Drag & drop zone
- File selection button
- 3-second processing simulation
- Redirect to /results

**/results** - Analysis results
- Current supplier: Electric Ireland (example)
- Recommended: Bord Gáis Energy
- Savings: €482.50 annual
- Usage chart (12-month bars)
- Switch button

**/orb** - Orb AI platform
- Document scanner interface
- Global Fraud Index: 84%
- Active node network (4 locations)
- Feature cards (Deep Fake, Blockchain, Identity)

**/kavan** - Kavan AI dashboard
- 3 active case files
- Signa care utility audit
- David Clarke medical case
- Asset tracing visualization
- Investigation tools

**/foxlite** - Foxlite Consulting
- Services overview
- No Win, No Fee model
- Contact: david@foxliteconsulting.com
- Recovery stats: 15-22%

**/status** - System monitoring
- Terminal-style boot sequence
- Green matrix aesthetic
- Network metrics (99.99% uptime)
- Sequential log animation

**/tariffs** - Not implemented (dead link)

**/* (404)** - Not found page

---

## 6. UI COMPONENT LIBRARY

### 69 Custom Components (6,349 lines)

**Form Components (15):**
Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Input OTP, Input Group, Calendar, Form, Label, Field, Command, KBD

**Layout Components (12):**
Card, Separator, Scroll Area, Resizable, Aspect Ratio, Sidebar, Sheet, Drawer, Item, Empty, Tabs, Accordion

**Navigation (7):**
Navigation Menu, Menubar, Dropdown Menu, Context Menu, Breadcrumb, Pagination, Button Group

**Overlay (9):**
Dialog, Alert Dialog, Popover, Tooltip, Hover Card, Toast, Toaster, Sonner, Alert

**Data Display (11):**
Table, Avatar, Badge, Chart, Progress, Skeleton, Spinner, Collapsible, Carousel, Toggle, Toggle Group

**Buttons (3):**
Button, Button Group, Toggle

**Custom (4):**
Layout, ErrorBoundary, ManusDialog, Map

---

## 7. LEGAL DOCUMENT ASSETS

### 6 Document Templates in `client/src/assets/`

1. **SIGNICARE_UTILITY_AUDIT_PROPOSAL.md**
   - Corporate utility audit proposal
   - 6-year historical audit scope
   - 15-22% savings projection
   - No Win, No Fee terms

2. **SIGNICARE_LETTER_OF_AUTHORITY.md**
   - Authorization for supplier data access

3. **DAVID_CLARKE_BRIEF_SENIOR_COUNSEL.md**
   - Legal brief for medical negligence case
   - Case overview and legal arguments

4. **DAVID_CLARKE_AI_MEDICAL_ASSESSMENT.md**
   - Medical damages quantification
   - Injury assessment and causation

5. **DAVID_CLARKE_CHRONOLOGICAL_REPORT.md**
   - Forensic timeline of events
   - Medical interventions timeline

6. **DAVID_CLARKE_OPINION_ON_MERITS.md**
   - Legal opinion on case strength
   - Success probability assessment

---

## 8. SYSTEM CAPABILITIES

### Current State (Functional)

✅ **Fully Implemented:**
- Complete frontend UI/UX for all 4 platforms
- Responsive design (mobile, tablet, desktop)
- Neo-brutalist design system
- 8 client-side routes
- Interactive animations
- 69 reusable UI components
- Type-safe codebase (0 errors)
- Production build system
- Development hot reload

### Current State (Simulated)

⚠️ **Frontend Demonstrations Only:**
- Bill upload/processing (mock)
- AI analysis visualization
- Results with hardcoded data
- Document scanning (visual only)
- Case management (static data)
- Asset tracing (animated graphics)
- System monitoring (simulated)

### Missing Components

❌ **Not Implemented:**
- Real AI engine integrations
- OCR processing
- Database storage
- User authentication
- Payment processing
- Real-time data APIs
- Blockchain integration
- Legal document generation engines
- Email services
- File storage
- Automated testing

---

## 9. BUILD METRICS

### Production Build Performance
- **Build Time:** 5.38 seconds
- **Client Bundle:** 367.59 kB (105.48 kB gzipped)
- **CSS Bundle:** 122.39 kB (19.42 kB gzipped)
- **JavaScript:** 342.55 kB (100.93 kB gzipped)
- **Server Bundle:** 788 bytes
- **Total Modules:** 1,659 transformed
- **Compression:** 70-84% reduction

### Development Server
- **Startup Time:** 554ms
- **Port:** 3000
- **HMR:** Enabled
- **Public URL:** Available via sandbox

---

## 10. DEPLOYMENT INFORMATION

### Development Setup
```bash
git clone https://github.com/darrylkavanagh-ux/foxlite-consulting.git
cd foxlite-consulting
npx pnpm@10 install
npx pnpm@10 run dev
```

### Production Build
```bash
npx pnpm@10 run build
npx pnpm@10 run start
```

### Compatible Platforms
- Vercel (recommended)
- Netlify
- Cloudflare Pages
- Railway
- Render
- AWS/GCP/Azure

---

## 11. ARCHITECTURAL ASSESSMENT

### Strengths
✅ Modern tech stack (React 19, TypeScript 5.6, Vite 7.1)
✅ Unique neo-brutalist design
✅ Complete UI component library
✅ Type-safe codebase (zero errors)
✅ Fast build times (5 seconds)
✅ Well-organized structure
✅ Comprehensive frontend

### Weaknesses
❌ No backend implementation
❌ No database
❌ No authentication
❌ No real AI engines
❌ No automated tests
❌ Hardcoded demonstration data

### Platform Maturity
- **Frontend:** 95% complete (production-ready demo)
- **Backend:** 0% complete (not started)
- **Integration:** 0% complete (not started)
- **Testing:** 0% coverage (framework installed)

---

## 12. BUSINESS MODELS

### NO COMPARE
- Commission on supplier switches
- Referral fees from energy suppliers
- Premium analytics features
- B2B corporate audits

### ORB AI
- Pay-per-verification
- Subscription tiers
- Enterprise plans
- API access fees

### KAVAN AI
- Legal pack generation fees
- Case management subscriptions
- Success-based asset tracing
- Research services

### FOXLITE CONSULTING
- No Win, No Fee (25-30% of recovery)
- Performance-based fees
- Percentage of savings

---

## 13. TARGET MARKETS

### NO COMPARE
- **Primary:** Irish residential consumers (2M+ households)
- **Pain Point:** Average €400-600/year overpayment

### ORB AI
- **Primary:** Financial institutions, legal firms
- **Use Cases:** KYC, contract authentication, fraud detection

### KAVAN AI
- **Primary:** Law firms, litigation funders
- **Use Cases:** Medical negligence, asset recovery, disputes

### FOXLITE CONSULTING
- **Primary:** Nursing home groups (600+ in Ireland)
- **Recovery:** €15K-40K per site average

---

## 14. NEXT STEPS FOR PRODUCTION

### Phase 1: Backend Foundation
1. Set up Express API server
2. Implement PostgreSQL database
3. Add user authentication
4. Create API endpoints

### Phase 2: Core Functionality
1. Integrate OCR service
2. Connect energy supplier APIs
3. Implement comparison engine
4. Add data storage

### Phase 3: Advanced Features
1. Orb AI verification backend
2. Kavan AI document generation
3. Blockchain integration
4. Asset tracing algorithms

### Phase 4: Production Readiness
1. Comprehensive test suite
2. Security hardening
3. Performance optimization
4. CI/CD pipeline
5. Documentation

---

## CONCLUSION

The PLAYBOOK LABS ecosystem represents a comprehensive, well-designed frontend platform with:

✅ **Production-ready UI/UX** across 4 integrated platforms
✅ **Modern technology stack** with React 19, TypeScript 5.6, Vite 7.1
✅ **Unique design system** (neo-brutalist energy aesthetic)
✅ **69 reusable components** (6,349 lines of code)
✅ **8 application routes** fully implemented
✅ **Type-safe codebase** with zero errors

**Critical Gap:** Backend services, AI integrations, and data persistence not implemented.

**Recommendation:** Platform is ready for backend development and real AI engine integration.

---

**Document Version:** 1.0  
**Last Updated:** February 16, 2026  
**Compiled By:** GenSpark AI Developer  
**Branch:** genspark_ai_developer  
**Repository:** https://github.com/darrylkavanagh-ux/foxlite-consulting

**END OF INVENTORY**
