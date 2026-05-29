import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Healthcare | Foxlite Forensic Services',
  description: 'Forensic cost auditing for healthcare facilities, private clinics, and medical practices. Recover energy, waste, insurance and banking overcharges — no upfront cost.',
}

const overchargeTypes = [
  { icon: '⚡', cat: 'Energy', detail: 'Night rate electricity applied incorrectly during standard rate hours, incorrect maximum demand classification, and VAT misapplication on reduced-rate medical supplies — all common in 24/7 clinical environments.' },
  { icon: '♻️', cat: 'Clinical Waste', detail: 'Clinical and hazardous waste uplift charges billed at unauthorized rates, unmandated weight-based escalations, and duplicate collections billed against a single uplift event.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Professional indemnity premium loading applied without notification, incorrect premises classification post-extension or renovation, and unauthorized loadings on public liability cover.' },
  { icon: '💳', cat: 'Banking', detail: 'Payment processing fees above contracted merchant service rates, unauthorized account maintenance charges, and duplicate direct debit processing fees on standing orders.' },
  { icon: '📡', cat: 'Telecoms', detail: 'Legacy clinical IT lines maintained on contract after decommission, duplicate broadband billing, and connectivity service charges billed above contracted grade SLA.' },
]

const auditProcess = [
  { n: '01', title: 'Confidential Scope Review', desc: 'We assess your facility\'s cost profile under strict confidentiality protocols. Full GDPR compliance throughout — no data leaves your control without written authority.' },
  { n: '02', title: 'Data Collection', desc: 'We request billing records directly from your suppliers on your behalf — minimising disruption to clinical operations. You provide access; we manage the process.' },
  { n: '03', title: 'Forensic Analysis', desc: 'Half-hourly meter data analysis, contract cross-referencing, and regulatory tariff verification — documented to the standard required for dispute resolution.' },
  { n: '04', title: 'Recovery & Reporting', desc: 'Full findings report provided. We negotiate recoveries directly. Our fee: 25% of recovered amounts. No recovery, no fee.' },
]

export default function HealthcarePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏥</div>
              <SectionLabel className="text-[#C4A44E]">Healthcare</SectionLabel>
              <SectionTitle className="text-white">
                Forensic cost auditing for healthcare facilities
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Healthcare facilities face complex, high-volume cost structures across energy, clinical
                waste, insurance, and banking. Foxlite forensic audits recover overcharges with zero
                disruption to clinical operations and zero upfront cost.
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
              { v: '20%', l: 'Average healthcare overcharge rate' },
              { v: '€47.8k', l: 'Largest single facility recovery' },
              { v: '3', l: 'Audit categories in typical engagement' },
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
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in healthcare</SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite healthcare audit works</SectionTitle>
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
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">No upfront cost. Full confidentiality.</h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  Foxlite charges <strong>25% of recovered amounts only</strong>. All client data handled under GDPR with full clinical confidentiality protocols. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Healthcare Audit
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
