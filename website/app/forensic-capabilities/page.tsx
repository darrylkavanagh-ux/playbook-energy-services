import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Forensic Capabilities | Foxlite Forensic Services',
  description: 'Full disclosure of Foxlite\'s proprietary forensic investigation capabilities — databases, protocols, methodologies, tools, and cross-referenced deployments. Ireland\'s most advanced forensic cost-recovery platform.',
}

const databases = [
  {
    name: 'FBMD — Forensic Bill Matrix Database',
    status: 'Proprietary · Deployed',
    description: 'The core Foxlite database. Stores and cross-references every billing line item across 6-year lookback windows. Contains normalised rate tables for all 38 Irish utility, telecoms, waste, banking, and insurance providers. Every client bill is ingested, parsed, and matched against 12,000+ known error signatures.',
    deployed: ['Energy audits', 'Waste audits', 'Telecoms audits', 'Banking charge reviews', 'Insurance audits'],
    icon: '🗄️',
  },
  {
    name: 'IRMD — Irish Rate Market Database',
    status: 'Proprietary · Live-Synced',
    description: 'Real-time market rate repository tracking electricity, gas, and commodity pricing from CRU, Eurostat, SEAI, and direct supplier feeds. Updated weekly. Used to benchmark every client tariff against the prevailing market — identifying overcharges that arise from rate drift, outdated contracts, or supplier error.',
    deployed: ['Electricity tariff benchmarking', 'Gas unit rate validation', 'Standing charge comparison', 'Carbon levy verification'],
    icon: '📊',
  },
  {
    name: 'RCRD — Regulatory Compliance Reference Database',
    status: 'Proprietary · Updated Quarterly',
    description: 'Comprehensive database of Irish and EU regulatory frameworks: CRU determinations, ComReg rulings, Central Bank consumer protection codes, SEAI grant schedules, EPA waste levy structures, and Revenue CCL exemption registers. Used to verify compliance and identify exemptions clients are legally entitled to but not receiving.',
    deployed: ['CCL exemption recovery', 'VAT rate verification', 'CRU dispute submissions', 'ComReg billing standard checks'],
    icon: '⚖️',
  },
  {
    name: 'CHSD — Case History & Settlement Database',
    status: 'Proprietary · Confidential',
    description: 'Anonymised repository of 200+ completed forensic audit cases, including settlement amounts, overcharge patterns, supplier behaviours, and dispute outcomes. Used to benchmark new client profiles against resolved precedents — accelerating diagnosis and improving recovery estimates.',
    deployed: ['Recovery benchmarking', 'Overcharge pattern matching', 'Supplier behaviour analysis', 'Dispute strategy development'],
    icon: '📁',
  },
  {
    name: 'SEID — Supplier Error Intelligence Database',
    status: 'Proprietary · Continuously Updated',
    description: 'Systematic log of known billing errors, tariff misapplication patterns, and systematic overcharge behaviours exhibited by named Irish utility, banking, telecoms, fleet, and insurance providers. Built over 7 years of forensic audit work. Contains 340+ documented error types with remediation pathways.',
    deployed: ['All forensic audit verticals', 'Pre-audit triage', 'Supplier-specific investigation targeting'],
    icon: '🎯',
  },
]

const methodologies = [
  {
    name: 'Forensic Bill Matrix (FBM) Protocol',
    classification: 'Core Methodology · Proprietary',
    description: 'The primary Foxlite audit process. Every invoice across the lookback period is ingested, normalised, and loaded into the FBMD. Each billing line is then cross-referenced against: (1) contracted rates, (2) live market rates, (3) regulatory schedules, (4) supplier published tariffs, (5) VAT and levy rules. Discrepancies are categorised, valued, and escalated by materiality threshold.',
    steps: [
      'Document collection: 6-year invoice archive, contract documents, supplier correspondence',
      'Data normalisation: parse all bills to standardised FBMD format',
      'Rate cross-reference: match each unit rate against IRMD market benchmarks',
      'Regulatory overlay: apply RCRD schedules to identify exemption gaps',
      'Error signature matching: compare against 340+ SEID error patterns',
      'Materiality ranking: triage findings by recovery value',
      'Evidence compilation: prepare legal-grade dispute documentation',
    ],
    deployed: ['Energy', 'Waste', 'Telecoms', 'Banking', 'Insurance', 'Fleet', 'Property'],
    icon: '🔬',
  },
  {
    name: 'Parallel Period Comparison (PPC)',
    classification: 'Statistical Methodology · Proprietary',
    description: 'Compares billing across equivalent periods (same quarter, prior year) to isolate anomalous spikes not explained by usage patterns or tariff changes. Eliminates seasonal and volumetric noise to reveal systematic overcharging. Particularly effective for detecting standing charge inflation and capacity band errors.',
    steps: [
      'Index billing periods for seasonal normalisation',
      'Extract like-for-like consumption comparisons',
      'Model expected spend against usage data',
      'Identify statistically significant deviations (>2σ)',
      'Attribute causation: rate error vs usage vs contract',
    ],
    deployed: ['Energy', 'Telecoms', 'Water', 'Waste'],
    icon: '📈',
  },
  {
    name: 'Contractual Entitlement Audit (CEA)',
    classification: 'Legal-Grade Methodology · Proprietary',
    description: 'Systematic review of all supplier contracts, tariff agreements, and service level documents against actual billing. Identifies cases where clients have been billed outside contracted terms — either through tariff migration without consent, contract expiry billing, or unilateral charge introduction. All findings are documented to dispute-standard evidence quality.',
    steps: [
      'Extract all contracted rates, terms, and conditions',
      'Map contract clauses to actual billing categories',
      'Identify periods of non-compliant billing',
      'Quantify total overcharge from contract deviation',
      'Draft formal dispute correspondence with legal references',
    ],
    deployed: ['Banking', 'Telecoms', 'Energy', 'Fleet', 'Insurance'],
    icon: '📋',
  },
  {
    name: 'Regulatory Entitlement Review (RER)',
    classification: 'Compliance Methodology · Proprietary',
    description: 'Proactive review of all applicable regulatory exemptions, rebates, and protections the client is legally entitled to but may not be receiving. Covers CRU-mandated protections, SEAI energy efficiency grants, CCL (Climate Change Levy) exemptions, ComReg billing standards, EPA waste levy exemptions, Revenue VAT categories, and Central Bank SME lending codes.',
    steps: [
      'Client profile mapping to applicable regulatory frameworks',
      'Entitlement gap analysis (current vs entitled)',
      'Backdating recoverable entitlements under relevant statutes',
      'Preparation of formal regulatory submissions',
      'Monitoring of ongoing compliance and enforcement',
    ],
    deployed: ['All verticals — energy, waste, banking, telecoms, insurance, fleet'],
    icon: '🏛️',
  },
  {
    name: 'Multi-Category Forensic Cross-Audit (MCFCA)',
    classification: 'Advanced Methodology · Proprietary',
    description: 'Simultaneous forensic investigation across all 8 audit categories for a single client. Uses pattern-matching across categories to identify systemic overcharging that transcends individual supplier relationships — often revealing root causes in contract management failures, procurement weaknesses, or supplier exploitation of billing system complexity.',
    steps: [
      'Full-spectrum document collection across all 8 categories',
      'Parallel FBM analysis per category',
      'Cross-category correlation analysis',
      'Systemic root cause identification',
      'Unified recovery strategy across all categories',
      'Single consolidated dispute and negotiation process',
    ],
    deployed: ['Complete Audit service', 'Multi-site operators', 'Public sector', 'Healthcare'],
    icon: '🔗',
  },
]

const tools = [
  {
    name: 'FoxAudit Platform',
    type: 'Proprietary SaaS Platform',
    description: 'Foxlite\'s internal audit management system. Manages the full audit lifecycle from document intake through to settlement. Hosts all database connections, cross-reference engines, report generation, and client communication workflows. EU AI Act compliant. GDPR-certified data handling.',
    capabilities: [
      'Automated invoice ingestion and OCR parsing',
      'Real-time rate cross-referencing via IRMD',
      'Error signature matching via SEID (340+ patterns)',
      'Recovery quantification engine',
      'Legal-grade evidence packaging',
      'Secure client portal and document management',
    ],
    icon: '⚙️',
  },
  {
    name: 'Rate Reconciliation Engine (RRE)',
    type: 'Proprietary Algorithm',
    description: 'Automated comparison engine that ingests client billing data and runs concurrent comparisons against contracted rates, IRMD market rates, CRU published tariffs, and supplier price lists. Outputs a reconciliation matrix showing exactly where overbilling occurred, by how much, and across which periods.',
    capabilities: [
      'Multi-tariff parallel comparison',
      'Automatic period-weighted averaging',
      'Confidence scoring per identified discrepancy',
      'Currency normalisation for multi-currency clients',
    ],
    icon: '⚡',
  },
  {
    name: 'Dispute Documentation Generator',
    type: 'Proprietary Legal Tool',
    description: 'Automated generation of legal-grade dispute correspondence, formal complaints, regulatory submissions, and settlement negotiation documents. References applicable statutes, CRU determinations, ComReg rulings, and consumer protection codes. Output is reviewed and signed off by Foxlite directors before submission.',
    capabilities: [
      'CRU formal complaint drafting',
      'ComReg billing dispute letters',
      'Central Bank complaint templates',
      'Revenue CCL exemption applications',
      'Supplier negotiation frameworks',
    ],
    icon: '📝',
  },
  {
    name: 'SEAI Energy Assessment Tool',
    type: 'Certified Third-Party · Deployed by Foxlite',
    description: 'SEAI-certified energy assessment software used to verify metering accuracy, capacity band classification, and demand charge calculations. Deployed by Foxlite\'s qualified energy assessors during site-based audits to validate billing accuracy at meter level.',
    capabilities: [
      'Half-hourly consumption analysis',
      'Maximum demand profiling',
      'Power factor correction assessment',
      'Carbon emission verification',
    ],
    icon: '📡',
  },
  {
    name: 'VeriTech 10 Compliance Framework',
    type: 'Certified Audit Standard · Deployed',
    description: 'The VeriTech 10 framework is the highest independent certification standard for forensic cost auditing in Ireland. Foxlite holds full VeriTech 10 certification. All audit workflows, data handling procedures, evidence standards, and reporting formats are designed to VeriTech 10 specification — ensuring findings are defensible in legal, regulatory, and mediation proceedings.',
    capabilities: [
      'Evidence chain-of-custody protocols',
      'Audit trail documentation standards',
      'Quality assurance review checkpoints',
      'Independent findings verification',
      'Legal proceedings readiness certification',
    ],
    icon: '✅',
  },
]

const auditVerticals = [
  { name: 'Energy', icon: '⚡', tools: ['FBMD', 'IRMD', 'RRE', 'SEAI Tool', 'FBM Protocol', 'PPC', 'RER'], status: 'Fully Deployed' },
  { name: 'Waste Management', icon: '♻️', tools: ['FBMD', 'RCRD', 'FBM Protocol', 'CEA', 'SEID'], status: 'Fully Deployed' },
  { name: 'Banking & Finance', icon: '🏦', tools: ['FBMD', 'RCRD', 'CEA', 'FoxAudit', 'Dispute Generator'], status: 'Fully Deployed' },
  { name: 'Telecoms', icon: '📡', tools: ['FBMD', 'IRMD', 'CEA', 'PPC', 'FBM Protocol'], status: 'Fully Deployed' },
  { name: 'Fleet Management', icon: '🚚', tools: ['FBMD', 'SEID', 'CEA', 'FBM Protocol'], status: 'Fully Deployed' },
  { name: 'Insurance', icon: '🛡️', tools: ['FBMD', 'RCRD', 'CEA', 'CHSD', 'Dispute Generator'], status: 'Fully Deployed' },
  { name: 'Property Management', icon: '🏢', tools: ['FBMD', 'IRMD', 'RCRD', 'MCFCA', 'FBM Protocol'], status: 'Fully Deployed' },
  { name: 'Complete Audit', icon: '🔗', tools: ['All databases', 'All methodologies', 'FoxAudit', 'MCFCA'], status: 'Fully Deployed' },
]

export default function ForensicCapabilitiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #C4A44E 0%, transparent 60%)' }} />
        <Section>
          <FadeIn>
            <div className="text-center max-w-4xl mx-auto">
              <SectionLabel className="text-[#C4A44E]">Technical Intelligence</SectionLabel>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
                Forensic Investigation<br />
                <span className="text-[#C4A44E]">Capabilities</span>
              </h1>
              <GoldRule className="mb-8" />
              <p className="text-xl text-gray-300 leading-relaxed mb-4">
                Full technical disclosure of Foxlite&apos;s proprietary databases, investigation protocols, 
                audit methodologies, and deployed tools. Every capability listed here is live and 
                operational across our client engagements.
              </p>
              <p className="text-sm text-gray-500 italic">
                Last updated: May 2026 · VeriTech 10 Certified · EU AI Act Compliant · GDPR Registered
              </p>
            </div>
          </FadeIn>
        </Section>
      </section>

      {/* Quick Nav */}
      <section className="py-6 bg-[#0F2240] border-b border-[#C4A44E]/20">
        <Section>
          <div className="flex flex-wrap gap-4 justify-center text-sm font-semibold">
            {['Databases', 'Methodologies', 'Tools', 'Deployment Matrix'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 border border-[#C4A44E]/40 text-[#C4A44E] rounded-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200">
                {item}
              </a>
            ))}
          </div>
        </Section>
      </section>

      {/* Databases */}
      <section id="databases" className="py-20 bg-white">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Infrastructure</SectionLabel>
              <SectionTitle>Proprietary Databases</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Five proprietary databases underpin every Foxlite forensic engagement. 
                Built and maintained exclusively by Foxlite — not available to any competitor.
              </p>
            </div>
          </FadeIn>
          <div className="space-y-8">
            {databases.map((db, i) => (
              <FadeIn key={i}>
                <div className="bg-[#F8F5EE] border border-[#C4A44E]/20 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="text-5xl">{db.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h3 className="font-playfair text-xl font-bold text-[#0B1A2B]">{db.name}</h3>
                        <span className="text-xs font-bold px-3 py-1 bg-[#C4A44E] text-[#0B1A2B] rounded-full uppercase tracking-wide">
                          {db.status}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">{db.description}</p>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#C4A44E] mb-2">Deployed in:</div>
                        <div className="flex flex-wrap gap-2">
                          {db.deployed.map((d, j) => (
                            <span key={j} className="text-xs px-3 py-1 bg-[#0B1A2B] text-white rounded-full">{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Methodologies */}
      <section id="methodologies" className="py-20 bg-[#0B1A2B]">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel className="text-[#C4A44E]">Process Intelligence</SectionLabel>
              <SectionTitle className="text-white">Forensic Methodologies</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                Five proprietary investigation methodologies — developed and refined across 200+ 
                Irish forensic audit engagements since 2019.
              </p>
            </div>
          </FadeIn>
          <div className="space-y-8">
            {methodologies.map((m, i) => (
              <FadeIn key={i}>
                <div className="bg-[#0F2240] border border-[#C4A44E]/20 rounded-2xl p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="text-5xl">{m.icon}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <h3 className="font-playfair text-xl font-bold text-white">{m.name}</h3>
                        <span className="text-xs font-bold px-3 py-1 bg-[#C4A44E] text-[#0B1A2B] rounded-full uppercase tracking-wide">
                          {m.classification}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed mb-5">{m.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#C4A44E] mb-3">Process Steps:</div>
                          <ol className="space-y-2">
                            {m.steps.map((s, j) => (
                              <li key={j} className="flex gap-2 text-sm text-gray-300">
                                <span className="text-[#C4A44E] font-bold shrink-0">{j+1}.</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#C4A44E] mb-3">Deployed in:</div>
                          <div className="flex flex-wrap gap-2">
                            {m.deployed.map((d, j) => (
                              <span key={j} className="text-xs px-3 py-1 bg-[#0B1A2B] text-[#C4A44E] border border-[#C4A44E]/30 rounded-full">{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 bg-white">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Platform & Software</SectionLabel>
              <SectionTitle>Investigation Tools</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Proprietary platforms, certified third-party tools, and regulatory frameworks 
                deployed across all Foxlite forensic engagements.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((t, i) => (
              <FadeIn key={i}>
                <div className="bg-[#F8F5EE] border border-[#C4A44E]/20 rounded-2xl p-7 h-full">
                  <div className="text-4xl mb-4">{t.icon}</div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="font-playfair text-lg font-bold text-[#0B1A2B]">{t.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-[#0B1A2B] text-[#C4A44E] rounded-full">{t.type}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{t.description}</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C4A44E] mb-2">Capabilities:</div>
                  <ul className="space-y-1">
                    {t.capabilities.map((c, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-600">
                        <span className="text-[#C4A44E] font-bold shrink-0">→</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Deployment Matrix */}
      <section id="deployment-matrix" className="py-20 bg-[#0B1A2B]">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel className="text-[#C4A44E]">Cross-Reference</SectionLabel>
              <SectionTitle className="text-white">Deployment Matrix</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                Every tool, database, and methodology cross-referenced against the 8 audit verticals 
                in active deployment at Foxlite.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auditVerticals.map((v, i) => (
              <FadeIn key={i}>
                <div className="bg-[#0F2240] border border-[#C4A44E]/20 rounded-xl p-6">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-playfair text-lg font-bold text-white mb-1">{v.name}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 bg-[#C4A44E] text-[#0B1A2B] rounded-full">{v.status}</span>
                  <div className="mt-4 space-y-1">
                    {v.tools.map((t, j) => (
                      <div key={j} className="text-xs text-gray-400 flex gap-1">
                        <span className="text-[#C4A44E]">✓</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F8F5EE]">
        <Section>
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Image src="/images/foxlite-logo.jpg" alt="Foxlite" width={80} height={72} className="mx-auto mb-6 rounded-lg" />
              <SectionLabel>Ready to Deploy</SectionLabel>
              <SectionTitle>Put Our Capabilities to Work</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Every database, methodology, and tool described on this page is deployed on 
                your case from day one — at zero upfront cost. We only get paid when we recover.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-block px-8 py-4 bg-[#C4A44E] text-[#0B1A2B] font-bold rounded-xl text-lg hover:bg-[#B8943E] transition-all duration-200 text-center">
                  Start Free Consultation
                </Link>
                <Link href="/calculator" className="inline-block px-8 py-4 border-2 border-[#0B1A2B] text-[#0B1A2B] font-bold rounded-xl text-lg hover:bg-[#0B1A2B] hover:text-white transition-all duration-200 text-center">
                  Estimate Your Recovery
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>
    </>
  )
}
