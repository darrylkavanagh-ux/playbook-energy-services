import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Hotels & Hospitality | Foxlite Forensic Services',
  description: 'Forensic cost auditing for hotels, restaurants, and hospitality businesses. Recover overcharges on energy, waste, telecoms, insurance and banking — no upfront cost.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'Incorrect maximum demand tariff classification, night rate misapplication, standing charge errors — hotels are disproportionately affected due to 24/7 operation and complex metering.' },
  { icon: '♻️', cat: 'Waste', detail: 'Unmandated price escalations, duplicate uplift charges, and inflated commercial food waste rates are endemic in hospitality contracts.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Legacy lines retained on contract after decommission, duplicate broadband billing, and guest WiFi infrastructure charges often persist unnoticed for years.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Premium loading without client notification, incorrect property classification, and duplicate policy coverage are common hospitality insurance overcharges.' },
  { icon: '💳', cat: 'Banking', detail: 'Merchant service fee rates above contracted levels, card processing surcharges, and unauthorized account fees accumulate rapidly at high transaction volumes.' },
]

const auditProcess = [
  { n: '01', title: 'Bill & Contract Collection', desc: 'We request 24–72 months of utility bills, waste contracts, insurance schedules, and banking statements directly from your suppliers.' },
  { n: '02', title: 'Forensic Bill Matrix Analysis', desc: 'Every billing line is cross-referenced against contracted rates, CRU tariff schedules, and live Irish market benchmarks.' },
  { n: '03', title: 'Finding & Recovery Plan', desc: 'We present a detailed findings report with quantified overcharges, recovery entitlement, and negotiation strategy per supplier.' },
  { n: '04', title: 'Supplier Negotiation', desc: 'We handle all supplier negotiations directly. Credits and refunds are processed. Our fee: 25% of recovered amounts only.' },
]

export default function HospitalityPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏨</div>
              <SectionLabel className="text-[#C4A44E]">Hotels & Hospitality</SectionLabel>
              <SectionTitle className="text-white">
                Forensic cost recovery for hospitality businesses
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Hotels, restaurants, and hospitality venues carry some of the highest overcharge rates
                of any sector — typically 18–25% across energy, waste, and telecoms. Foxlite
                forensic audits recover what you've been overbilled, with zero upfront cost.
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
              { v: '22%', l: 'Average hospitality overcharge rate' },
              { v: '€61k', l: 'Largest single hotel recovery' },
              { v: '5', l: 'Audit categories applicable' },
              { v: '0', l: 'Upfront cost to you' },
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
              <SectionTitle className="text-[#0B1A2B]">
                Common overcharge categories in hospitality
              </SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite hospitality audit works</SectionTitle>
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

      {/* Pricing + CTA */}
      <section className="py-24 bg-[#F8F6F1]">
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="bg-[#C4A44E] rounded-2xl p-10 mb-8">
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">
                  No upfront cost. Ever.
                </h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  The audit is completely free. Foxlite charges{' '}
                  <strong>25% of recovered amounts only</strong> — half the industry standard.
                  Maximum engagement: 3 years. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Hospitality Audit
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
