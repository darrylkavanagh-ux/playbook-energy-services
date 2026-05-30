import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Retail & Food Service | Foxlite Forensic Services',
  description: 'Forensic cost auditing for retail chains, convenience stores, and food service businesses. Recover energy, telecoms, banking and waste overcharges across all locations.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'Multi-site incorrect standing charges, capacity fee overcharges at locations that reduced hours post-COVID, and incorrect tariff classifications — especially common at convenience retail.' },
  { icon: '💳', cat: 'Banking', detail: 'Merchant service fee rates applied above the contracted rate, duplicate transaction fees, and POS terminal charges billed against decommissioned equipment.' },
  { icon: '♻️', cat: 'Waste', detail: 'Food waste collection overcharges, undisclosed price escalations, duplicate bin charges, and tonnage figures that don\'t reconcile with collection records.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Duplicate broadband lines at multiple locations, ISDN lines maintained on contract after decommission, and broadband service level charges above contracted grade.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Premises cover loaded above the correct rebuild value, duplicate public liability coverage across locations, and premium hikes applied without policy changes.' },
]

const auditProcess = [
  { n: '01', title: 'Multi-Site Scope Assessment', desc: 'Free consultation to map every location, every supplier, and every cost category in scope — establishing the realistic recovery estimate before we begin.' },
  { n: '02', title: 'Site-Level Bill Collection', desc: 'We collect bills and contracts for each location individually. Every site is audited on its own data — nothing is averaged or estimated.' },
  { n: '03', title: 'Forensic Bill Matrix', desc: 'Each billing line at each site is cross-referenced against contracted rates, CRU tariff data, and live Irish market benchmarks.' },
  { n: '04', title: 'Recovery & New Contracts', desc: 'We negotiate credits from each supplier and where appropriate, renegotiate contracts to lock in correct rates going forward.' },
]

export default function RetailPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🛒</div>
              <SectionLabel className="text-[#C4A44E]">Retail & Food Service</SectionLabel>
              <SectionTitle className="text-white">
                Multi-site forensic auditing for retail businesses
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Retail and food service operators face overcharges at scale — errors multiply
                across every location, every month. Foxlite forensic audits identify and recover
                overcharges across all sites, with zero upfront cost.
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
              { v: '18%', l: 'Average retail overcharge rate' },
              { v: '€94k', l: 'Largest multi-site recovery' },
              { v: '12', l: 'Sites audited in single engagement' },
              { v: '€0', l: 'Upfront cost to you' },
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
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in retail</SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite retail audit works</SectionTitle>
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
                  The audit is completely free. Foxlite charges <strong>25% of recovered amounts only</strong> — half the industry standard. Maximum engagement: 3 years. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Retail Audit
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
