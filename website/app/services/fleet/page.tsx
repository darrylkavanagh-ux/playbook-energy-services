import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Fleet Management Audits | Foxlite Forensic Services',
  description: 'Forensic audit of fleet fuel, leasing, maintenance and vehicle management costs. Identify overcharges and recover money. No upfront costs.',
}

export default function FleetServicePage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🚗</div>
              <SectionLabel className="text-gold">Fleet Management Audits</SectionLabel>
              <SectionTitle className="text-white">
                Recover overcharges from fuel, leasing and vehicle management contracts
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Fleet costs are among the most complex and poorly-monitored business expenses. 
                Foxlite's forensic fleet audit identifies fuel card errors, lease overcharges, 
                maintenance contract discrepancies and underclaimed rebates.
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
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Fleet Cost Forensic Analysis</h2>
                <p className="text-lg text-textMid leading-relaxed mb-6">
                  Fleet management contracts involve multiple suppliers, complex rebate structures, 
                  and volume-based pricing tiers that are rarely monitored against actual spend. 
                  Errors accumulate across fuel cards, lease agreements, servicing contracts and 
                  fleet management platforms — often going undetected for years.
                </p>
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Foxlite reviews every fuel card transaction, lease schedule, maintenance invoice 
                  and mileage record against the contracted terms — identifying where overcharges 
                  have occurred and quantifying the recoverable amount.
                </p>

                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Audit</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Fuel Cards', items: ['Volume rebate tier misapplication', 'Transaction fees above contract', 'Card management charge errors', 'Price cap violations'] },
                    { title: 'Vehicle Leasing', items: ['Rate calculation errors', 'Excess mileage charge disputes', 'Maintenance package overcharges', 'Early termination fee errors'] },
                    { title: 'Fleet Maintenance', items: ['Labour rate overcharges', 'Parts markup above agreement', 'Warranty work billed incorrectly', 'Service interval errors'] },
                    { title: 'Fleet Management Fees', items: ['Platform fee overcharges', 'Driver management charges', 'Accident management fees', 'Risk and compliance charges'] },
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
                    A food manufacturing plant with a fleet of 18 vehicles had been paying fuel card 
                    charges without receiving the volume rebate tier they qualified for since 2022. 
                    Additionally, a legacy ISDN-linked fleet tracker was billed but had been decommissioned. 
                    Total recovery: <span className="text-gold font-bold">€14,300</span> across 3 years, 
                    plus rebate adjustment going forward saving €4,800 annually.
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
                      { n: '1', title: 'Contract Collection', desc: 'Gather fuel card agreements, lease schedules, and maintenance contracts' },
                      { n: '2', title: 'Transaction Analysis', desc: 'Review all fuel card and invoice data against contracted rates' },
                      { n: '3', title: 'Rebate Verification', desc: 'Verify volume thresholds and confirm applicable rebate tiers were applied' },
                      { n: '4', title: 'Lease Reconciliation', desc: 'Cross-reference lease schedules against payment history and mileage records' },
                      { n: '5', title: 'Recovery Claim', desc: 'Submit findings to fleet providers and manage recovery to completion' },
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
                      <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Fleet Audit</Link>
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
                Fleet audits typically recover €9,800–€25,000
              </h2>
              <p className="text-navy/80 text-lg mb-6">
                No upfront costs. We are paid 25% of what we recover — nothing if we find nothing.
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
            <FadeIn><SectionLabel>Related Services</SectionLabel><SectionTitle>Complement your fleet audit</SectionTitle></FadeIn>
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
