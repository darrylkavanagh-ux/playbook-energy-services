import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Property Management | Foxlite Forensic Services',
  description: 'Forensic cost auditing for property management companies, commercial portfolios and residential OMC boards. Recover service charge, energy and maintenance overcharges — no upfront cost.',
}

const overchargeTypes = [
  { icon: '🏢', cat: 'Service Charges', detail: 'Management fees calculated on gross rent rather than net as specified in lease, discretionary maintenance expense pass-throughs without procurement support, and service charge reconciliation errors compounding over multiple years.' },
  { icon: '⚡', cat: 'Energy Pass-Through', detail: 'Landlords billing tenants at above-contract unit rates, standing charge pass-throughs above the contracted level, and VAT misapplication on common area energy supplies.' },
  { icon: '♻️', cat: 'Waste', detail: 'Building waste collection charges above contracted rates, duplicate bin charge pass-throughs, and communal waste management fees applied without contractual basis in service charge accounts.' },
  { icon: '🔧', cat: 'Maintenance', detail: 'Contractor invoices above the agreed schedule of rates, markup applied above the contracted percentage, and maintenance charges passed to service charge accounts without adequate procurement documentation.' },
  { icon: '🛡️', cat: 'Insurance', detail: 'Block policy premiums above the correctly declared reinstatement value, duplicate cover elements, and premium loading applied without notification to the OMC or management company board.' },
]

const auditProcess = [
  { n: '01', title: 'Lease & Contract Review', desc: 'We review all lease agreements, management contracts, and service charge clauses to establish what is contractually permitted to be charged — and at what basis.' },
  { n: '02', title: 'Reconciliation Analysis', desc: 'We reconstruct service charge reconciliation statements from base supplier invoices, management agreements, and property records — identifying where charges don\'t reconcile.' },
  { n: '03', title: 'Supplier Invoice Verification', desc: 'All discretionary maintenance and building services expenses are cross-referenced against procurement records, schedule of rates, and approved budgets.' },
  { n: '04', title: 'Recovery & New Protocol', desc: 'Overcharges recovered through arbitration or direct negotiation. New service charge monitoring protocol implemented to prevent recurrence.' },
]

export default function PropertyManagementPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏗️</div>
              <SectionLabel className="text-[#C4A44E]">Property Management</SectionLabel>
              <SectionTitle className="text-white">
                Service charge forensics for property management companies
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Property management companies, OMC boards, and commercial portfolio owners face
                service charge overcharges that compound silently for years. Foxlite forensic
                service charge audits recover what you've been overbilled — with zero upfront cost.
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
              { v: '€82.5k', l: 'Largest portfolio recovery' },
              { v: '4yr', l: 'Typical lookback on service charges' },
              { v: '3', l: 'Audit categories in typical engagement' },
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
              <SectionTitle className="text-[#0B1A2B]">Common overcharge categories in property management</SectionTitle>
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
              <SectionTitle className="text-white">How a Foxlite property management audit works</SectionTitle>
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
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-4">No upfront cost. Lease-defensible findings.</h2>
                <p className="text-[#0B1A2B]/80 text-lg leading-relaxed">
                  Foxlite charges <strong>25% of recovered amounts only</strong>. All findings are documented to the standard required for lease dispute resolution and arbitration. If we find nothing, you pay nothing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Start Free Property Audit
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
