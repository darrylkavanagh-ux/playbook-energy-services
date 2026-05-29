import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Insurance Audits | Foxlite Forensic Services',
  description: 'Forensic audit of insurance premiums, policy loadings and claims costs. Identify overcharges and unauthorised premium increases. No upfront costs.',
}

export default function InsuranceServicePage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🛡️</div>
              <SectionLabel className="text-gold">Insurance Audits</SectionLabel>
              <SectionTitle className="text-white">
                Recover unauthorised premium loadings and insurance overcharges
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Insurance premiums frequently contain unauthorised loadings, duplicate covers, 
                and inflated broker fees that accumulate over renewal cycles. Foxlite's forensic 
                insurance audit identifies every overcharge and recovers it.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <FadeIn>
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Insurance Premium Forensic Analysis</h2>
                <p className="text-lg text-textMid leading-relaxed mb-6">
                  Insurance premiums are rarely scrutinised beyond the renewal quote. Over time, 
                  unexplained loadings, duplicate policy elements, and brokerage charges above the 
                  agreed terms accumulate — often compounding across multiple renewal cycles without 
                  client notification.
                </p>
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Foxlite reviews every policy schedule, endorsement, and premium notice against 
                  the original underwriting agreement — identifying where premiums have been 
                  loaded, duplicated, or inflated without contractual basis.
                </p>

                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Audit</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Commercial Property Insurance', items: ['Unexplained premium loadings', 'Reinstatement value overestimation', 'Duplicate building/contents cover', 'Index-linking calculation errors'] },
                    { title: 'Employer & Public Liability', items: ['Premium uplift without claims basis', 'Payroll declaration overcharges', 'Retroactive premium adjustments', 'Excess increase without notification'] },
                    { title: 'Motor Fleet Insurance', items: ['Fleet rating errors', 'Driver-risk loading miscalculations', 'No-claims bonus misapplication', 'Premium finance interest overcharges'] },
                    { title: 'Brokerage & Fees', items: ['Broker commission above disclosed rate', 'Policy admin fees above schedule', 'Claims handling fee overcharges', 'Premium instalment interest errors'] },
                  ].map(cat => (
                    <div key={cat.title} className="bg-cream rounded-xl p-5">
                      <h4 className="font-semibold text-navy mb-3">{cat.title}</h4>
                      <ul className="space-y-1">
                        {cat.items.map(item => (
                          <li key={item} className="flex items-start gap-2 text-textMid text-sm">
                            <span className="text-gold mt-0.5 flex-shrink-0">•</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-navy text-white rounded-xl p-6 mb-8">
                  <h3 className="font-playfair text-xl font-bold mb-3">Case Example</h3>
                  <p className="text-greyLight text-sm leading-relaxed">
                    A private healthcare facility underwent a premises extension in 2022. 
                    The insurer applied a loading to the public liability premium — but the 
                    loading was applied at the commercial rate rather than the healthcare 
                    facilities rate specified in the original policy schedule. Foxlite identified 
                    the discrepancy and recovered <span className="text-gold font-bold">€12,200</span>{' '}
                    across 3 years. The insurer also replaced the broker following the audit findings.
                  </p>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-1">
              <FadeIn delay={200}>
                <div className="bg-cream rounded-xl p-6 sticky top-24">
                  <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Process</h3>
                  <div className="space-y-4">
                    {[
                      { n: '1', title: 'Policy Review', desc: 'Obtain all current and historic policy schedules, endorsements and renewal quotes' },
                      { n: '2', title: 'Premium Reconstruction', desc: 'Rebuild premium calculation from original underwriting terms for each renewal period' },
                      { n: '3', title: 'Loading Identification', desc: 'Identify unauthorised loadings, duplications and rate misapplications' },
                      { n: '4', title: 'Brokerage Audit', desc: 'Review broker commission disclosures and verify against agreed terms' },
                      { n: '5', title: 'Recovery Submission', desc: 'Present findings to insurer and broker — manage recovery through to credit or refund' },
                    ].map(step => (
                      <div key={step.n} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-navy">{step.n}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-navy text-sm">{step.title}</div>
                          <div className="text-textMid text-xs">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-greyLight">
                    <Link href="/contact">
                      <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Insurance Audit</Link>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Section>
      </section>

      <section className="py-16 bg-gold">
        <Section>
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-playfair text-3xl font-bold text-navy mb-4">
                Insurance audits typically recover €8,000–€20,000
              </h2>
              <p className="text-navy/80 text-lg mb-6">
                No upfront costs. 25% of recovered savings only — nothing if we find nothing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculator"><Link href="/calculator" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Calculate My Savings</Link></Link>
                <Link href="/contact"><Link href="/contact" className="inline-block px-6 py-3 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center">Free Consultation</Link></Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>

      <section className="py-16 bg-cream">
        <Section>
          <div className="text-center mb-10">
            <FadeIn><SectionLabel>Related Services</SectionLabel><SectionTitle>Complement your insurance audit</SectionTitle></FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Energy Audits', href: '/services/energy', desc: 'Electricity and gas overcharge recovery' },
              { icon: '💳', title: 'Banking & Finance', href: '/services/banking', desc: 'Bank charges and merchant fee recovery' },
              { icon: '📊', title: 'Complete Audit', href: '/services/all', desc: 'All 8 cost categories in one engagement' },
            ].map(s => (
              <FadeIn key={s.title}>
                <Link href={s.href} className="group">
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-greyLight">
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <h3 className="font-playfair text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">{s.title}</h3>
                    <p className="text-textMid text-sm">{s.desc}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>
    </>
  )
}
