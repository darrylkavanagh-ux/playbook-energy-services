import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Manufacturing | Foxlite Forensic Services',
  description: 'Forensic cost auditing for manufacturing plants and food production facilities. Recover energy capacity charge, fleet fuel, and telecoms overcharges — no upfront cost.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'Excess capacity charges billed against a demand profile that materially reduced post-COVID or following production changes. Half-hourly meter analysis routinely reveals manufacturers overpaying by 25–35% on capacity charges alone.' },
  { icon: '🚗', cat: 'Fleet', detail: 'Volume-based fuel card rebate tiers not applied despite qualifying volumes, maintenance markup above contracted rate from fleet management providers, and duplicate mileage charges.' },
  { icon: '♻️', cat: 'Waste', detail: 'Industrial waste collection overcharges, unmandated price escalations on commercial waste contracts, and hazardous waste disposal charges above the contracted rate.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Legacy ISDN and leased lines maintained on contract after physical decommission during site upgrades — often persisting for 2–4 years undetected.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Industrial premises classified incorrectly post-process change, machinery breakdown cover duplicated across multiple policies, and premium loadings applied without formal review.' },
]

const auditProcess = [
  { n: '01', title: 'Production Profile Review', desc: 'We map your energy consumption profile, fleet size, waste generation, and operational footprint to identify which cost categories carry the highest overcharge probability.' },
  { n: '02', title: 'Half-Hourly Data Analysis', desc: 'Manufacturing energy audits require HH meter data analysis. We obtain this directly from ESB Networks or your supplier on your behalf and apply forensic capacity charge testing.' },
  { n: '03', title: 'Fleet & Contract Review', desc: 'Every fuel card transaction, fleet maintenance invoice, and procurement agreement is cross-referenced against contracted rates and volume thresholds.' },
  { n: '04', title: 'Recovery & Contract Reset', desc: 'Retrospective credits secured. Supply contracts reset to reflect actual demand profile — delivering ongoing annual savings in addition to one-off recovery.' },
]

export default function ManufacturingPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏭</div>
              <SectionLabel className="text-[#C4A44E]">Manufacturing</SectionLabel>
              <SectionTitle className="text-white">
                Industrial forensic auditing for manufacturing operations
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Manufacturing and food production facilities carry the highest energy overcharge rates
                of any sector. Foxlite's forensic capacity charge analysis and fleet cost reviews
                routinely recover six-figure sums for Irish manufacturers.
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
              { v: '25%', l: 'Average manufacturing overcharge rate' },
              { v: '€53.7k', l: 'Largest single plant recovery' },
              { v: '3yr', l: 'Lookback on energy capacity charges' },
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
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in manufacturing</SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite manufacturing audit works</SectionTitle>
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
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">No upfront cost. Ever.</h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  Foxlite charges <strong>25% of recovered amounts only</strong> — half the industry standard. Maximum 3-year engagement. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Manufacturing Audit
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
