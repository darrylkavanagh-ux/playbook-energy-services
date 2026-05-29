import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Public Sector | Foxlite Forensic Services',
  description: 'Forensic cost auditing for local authorities, government agencies, and public bodies. Recover energy, waste, telecoms and fleet overcharges — documented to procurement compliance standard.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'VAT misclassification on public sector electricity supplies, tariff errors across multiple buildings, meter read disputes, and incorrect maximum demand charges — all documented for public audit compliance.' },
  { icon: '♻️', cat: 'Waste', detail: 'Tonnage figure disputes at collection sites, unmandated price escalations on framework contracts, and charges for collections not made — recoverable through formal supplier dispute.' },
  { icon: '🚗', cat: 'Fleet', detail: 'Maintenance markup above contracted rate from fleet management providers, fuel card billing discrepancies, and vehicle lease charges above the framework rate.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Line rental on disconnected numbers, legacy broadband services maintained post-office consolidation, and service level charges above contracted grade.' },
  { icon: '🏛️', cat: 'Procurement', detail: 'Service charge calculations above framework rates, discretionary expense pass-throughs without adequate procurement support, and vendor invoices above agreed schedule.' },
]

const auditProcess = [
  { n: '01', title: 'Procurement-Compliant Scope', desc: 'All Foxlite work for public sector clients is structured to meet OGP procurement guidelines and public audit requirements from day one.' },
  { n: '02', title: 'FOI-Assisted Data Collection', desc: 'Where direct supplier data is unavailable, we assist with FOI requests to obtain metering and billing data from ESB Networks and other regulated entities.' },
  { n: '03', title: 'Audit-Grade Documentation', desc: 'All findings are documented to the standard required for finance committee presentation, C&AG scrutiny, and where applicable, legal proceedings.' },
  { n: '04', title: 'Recovery & Framework Update', desc: 'Supplier credits negotiated and approved through appropriate governance channels. New procurement framework recommendations provided where applicable.' },
]

export default function PublicSectorPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏛️</div>
              <SectionLabel className="text-[#C4A44E]">Public Sector</SectionLabel>
              <SectionTitle className="text-white">
                Procurement-compliant forensic auditing for public bodies
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Local authorities, government agencies, and public bodies face unique accountability
                requirements. Foxlite delivers forensic cost audits documented to public sector
                governance standards — recovering overcharges while protecting procurement integrity.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Stat band */}
      <section className="bg-[#C4A44E] py-8">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '€108k', l: 'Largest public sector recovery' },
              { v: '6yr', l: 'Maximum lookback period' },
              { v: '4', l: 'Categories in typical public engagement' },
              { v: '€0', l: 'Upfront cost' },
            ].map((s, i) => (
              <FadeIn key={s.l} delay={i * 80}>
                <div>
                  <div className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-1">{s.v}</div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-wide text-[#0B1A2B]/70">{s.l}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Overcharge types */}
      <section className="py-24 bg-white">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Where Overcharges Occur</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in the public sector</SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>
          <div className="space-y-5 max-w-4xl mx-auto">
            {overchargeTypes.map((item, i) => (
              <FadeIn key={item.cat} delay={i * 80}>
                <div className="flex gap-5 bg-[#F8F6F1] rounded-xl p-6 border border-[#E2E0DB]">
                  <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <div className="font-playfair font-bold text-[#0B1A2B] text-lg mb-2">{item.cat}</div>
                    <p className="text-[0.88rem] text-[#5A5A5A] leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Process */}
      <section className="py-24 bg-[#060D18]">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>The Process</SectionLabel>
              <SectionTitle className="text-white">How a Foxlite public sector audit works</SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auditProcess.map((step, i) => (
              <FadeIn key={step.n} delay={i * 100}>
                <div className="bg-[#0D1F35] border border-[rgba(196,164,78,0.12)] rounded-2xl p-7">
                  <div className="w-12 h-12 rounded-full bg-[#C4A44E] flex items-center justify-center font-bold text-[#0B1A2B] text-lg mb-5">{step.n}</div>
                  <h3 className="font-playfair text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-[0.83rem] text-[rgba(248,246,241,0.55)] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#F8F6F1]">
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="bg-[#C4A44E] rounded-2xl p-10 mb-8">
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">Audit-grade findings. Zero upfront cost.</h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  Foxlite charges <strong>25% of recovered amounts only</strong>. All documentation is structured for public sector governance and audit requirements. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Public Sector Audit
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/calculator" className="btn-navy !bg-[#0B1A2B] !text-white !border-[rgba(196,164,78,0.35)] inline-flex items-center gap-2 text-base px-8 py-4">
                  Calculate My Savings
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
