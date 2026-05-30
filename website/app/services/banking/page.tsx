import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Banking & Finance Audits | Foxlite Forensic Services',
  description: 'Forensic audit of bank charges, merchant service fees, loan costs and financial service overcharges. No upfront cost — 25% of savings recovered.',
}

export default function BankingServicePage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">💳</div>
              <SectionLabel className="text-gold">Banking & Finance Audits</SectionLabel>
              <SectionTitle className="text-white">
                Recover overcharges from banks, lenders and financial service providers
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Irish businesses routinely pay more than their agreed rate on bank charges, 
                merchant fees and loan costs. Our forensic banking audits identify and recover these overcharges.
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
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Banking Cost Forensic Analysis</h2>
                <p className="text-lg text-textMid leading-relaxed mb-6">
                  Bank charges and financial service costs are among the most opaque expense categories 
                  for Irish businesses. Complex fee structures, layered charges and automated escalations 
                  mean overcharges persist undetected for years.
                </p>
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Foxlite's banking audit team cross-references every charge against your original 
                  facility agreements, merchant service contracts and published tariff schedules — 
                  identifying discrepancies across current account fees, merchant processing, 
                  loan interest margins and asset finance costs.
                </p>

                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Audit</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Current Account Charges', items: ['Transaction fees above agreed rate', 'Maintenance and facility charges', 'Overdraft interest and fees', 'International payment charges'] },
                    { title: 'Merchant Services', items: ['Terminal rental above contracted rate', 'Processing fees above agreed MDR', 'Chargeback fees and dispute charges', 'PCI compliance fee overcharges'] },
                    { title: 'Business Loans & Facilities', items: ['Interest margin above agreed spread', 'Arrangement and renewal fees', 'Covenant monitoring charges', 'Early repayment and break costs'] },
                    { title: 'Asset & Trade Finance', items: ['Leasing rate miscalculations', 'Invoice discounting fee errors', 'Trade finance margin overcharges', 'HP and PCP calculation errors'] },
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
                    A Dublin-based retail group found their merchant service provider had been applying 
                    the incorrect MDR tier since 2020, despite qualifying for the lower rate based on 
                    transaction volume. Foxlite recovered <span className="text-gold font-bold">€21,600</span> in 
                    overcharges across 4 years — plus renegotiated the contract at the correct rate going forward.
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
                      { n: '1', title: 'Agreement Review', desc: 'Obtain original facility letters, merchant agreements and loan documentation' },
                      { n: '2', title: 'Statement Analysis', desc: 'Analyse 24–72 months of bank statements and charge schedules' },
                      { n: '3', title: 'Rate Comparison', desc: 'Compare charged rates against agreed contractual rates line by line' },
                      { n: '4', title: 'Error Quantification', desc: 'Calculate total overcharge with interest and present findings report' },
                      { n: '5', title: 'Recovery Negotiation', desc: 'Manage dispute with bank or financial institution through to credit' },
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
                      <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Banking Audit</Link>
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
                Average banking audit recovery: €18,400
              </h2>
              <p className="text-navy/80 text-lg mb-6">
                Our fee is 25% of recovered amounts only. No savings found — no fee charged.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculator">
                  <Link href="/calculator" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Calculate My Savings</Link>
                </Link>
                <Link href="/contact">
                  <Link href="/contact" className="inline-block px-6 py-3 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center">Free Consultation</Link>
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>

      <section className="py-16 bg-cream">
        <Section>
          <div className="text-center mb-10">
            <FadeIn>
              <SectionLabel>Related Services</SectionLabel>
              <SectionTitle>Other audits that work alongside banking</SectionTitle>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Energy Audits', href: '/services/energy', desc: 'Electricity and gas overcharge recovery' },
              { icon: '🛡️', title: 'Insurance Audits', href: '/services/insurance', desc: 'Premium overcharge and loading recovery' },
              { icon: '📊', title: 'Complete Audit', href: '/services/all', desc: 'All 8 categories in one engagement' },
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
