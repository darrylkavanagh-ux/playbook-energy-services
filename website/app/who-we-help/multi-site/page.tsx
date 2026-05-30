import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Multi-Site Businesses | Foxlite Forensic Services',
  description: 'Forensic cost auditing for businesses operating across multiple locations. Identify cross-site energy, telecoms, banking and waste overcharges — no upfront cost.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'Incorrect standing charges and capacity fees replicated across multiple sites — sometimes for years. A single tariff error at head office often propagates automatically to all subsidiary supply agreements.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Duplicate broadband lines, legacy circuits maintained across closed or consolidated locations, and connectivity SLA charges above contracted grade billed at all sites.' },
  { icon: '💳', cat: 'Banking', detail: 'Merchant service fee inconsistencies across locations, duplicate terminal charges, and settlement fee rates that vary by site without contractual basis.' },
  { icon: '♻️', cat: 'Waste', detail: 'Collection frequency errors across sites, unmandated price escalations not uniformly challenged, and tonnage disputes that require site-level cross-referencing.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Cross-site policy structure errors, duplicate cover for shared assets across multiple locations, and premium calculations based on incorrect aggregate declared values.' },
]

const auditProcess = [
  { n: '01', title: 'Full Portfolio Mapping', desc: 'We map every site, every supplier, and every cost category across your entire portfolio. Establishing the full picture before we begin ensures no overcharge is missed.' },
  { n: '02', title: 'Site-Level Data Collection', desc: 'Each location is audited on its own data. We collect bills and contracts site by site — nothing is averaged or estimated across locations.' },
  { n: '03', title: 'Cross-Site Pattern Analysis', desc: 'Our Forensic Bill Matrix identifies both site-specific errors and systemic overcharges replicated across multiple locations — often the highest-value recoveries.' },
  { n: '04', title: 'Coordinated Recovery', desc: 'We manage negotiations across all suppliers simultaneously, delivering a single coordinated recovery package and a consolidated findings report.' },
]

export default function MultiSitePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">📍</div>
              <SectionLabel className="text-[#C4A44E]">Multi-Site Businesses</SectionLabel>
              <SectionTitle className="text-white">
                Portfolio-scale forensic auditing across all your locations
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Multi-site operations face overcharges at scale — errors compound across every
                location, every billing period. Foxlite audits every site individually, then
                cross-references findings to identify systemic overcharges others miss.
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
              { v: '12', l: 'Maximum sites in single engagement' },
              { v: '€94k', l: 'Largest multi-site recovery' },
              { v: '3+', l: 'Audit categories per engagement' },
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
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in multi-site operations</SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite multi-site audit works</SectionTitle>
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
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">One engagement. Every site. No upfront cost.</h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  Foxlite charges <strong>25% of recovered amounts only</strong>. We manage every location in a single coordinated engagement. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Multi-Site Audit
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
