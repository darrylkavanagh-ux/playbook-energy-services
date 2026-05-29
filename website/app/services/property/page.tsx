import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Property Management Audits | Foxlite Forensic Services',
  description: 'Forensic audit of property service charges, facility management costs and maintenance contract overcharges. Independent and results-only.',
}

export default function PropertyServicePage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏢</div>
              <SectionLabel className="text-gold">Property Management Audits</SectionLabel>
              <SectionTitle className="text-white">
                Forensic review of service charges, maintenance costs and facility management fees
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Property-related costs are among the most complex and most frequently overcharged 
                business expenses. Service charge accounts, maintenance contracts and facility 
                management agreements regularly contain errors, inflated costs and unsupported charges.
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
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Property Cost Forensic Analysis</h2>
                <p className="text-lg text-textMid leading-relaxed mb-6">
                  Property service charges are governed by lease agreements and statutory obligations 
                  — but landlords and managing agents frequently apply charges that are inconsistent 
                  with the lease, inflate management fees, or pass through maintenance expenses that 
                  lack proper evidential support.
                </p>
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Foxlite's property audit team reviews service charge reconciliations, maintenance 
                  contracts, and facility management agreements against the governing lease — 
                  identifying every charge that lacks contractual basis and building the recovery case.
                </p>

                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Audit</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Service Charges', items: ['Management fee calculation errors', 'Charges outside recoverable categories', 'Sinking fund misapplication', 'Insurance premium pass-through overcharges'] },
                    { title: 'Maintenance Contracts', items: ['Labour rate overcharges', 'Parts and materials markup errors', 'Preventive maintenance overbilling', 'Reactive work scope disputes'] },
                    { title: 'Facility Management Fees', items: ['Fee percentage basis errors', 'Out-of-scope charges included', 'Markup on sub-contractor invoices', 'Overhead recovery above agreed rate'] },
                    { title: 'Energy Cost Pass-Through', items: ['Above-contract unit rate billing', 'Estimated vs actual reconciliation gaps', 'Common area energy charge errors', 'VAT rate misapplication on utilities'] },
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
                    A 6-building commercial portfolio audit found the managing agent had been 
                    calculating their management fee on gross rent received rather than net rent 
                    as specified in the management agreement. Across four years, the overcharge 
                    totalled <span className="text-gold font-bold">€44,300</span>. A further 
                    €22,100 was recovered from landlord-billed energy costs where tenants had 
                    been charged above the contracted unit rate.
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
                      { n: '1', title: 'Document Collection', desc: 'Gather leases, management agreements, service charge schedules and reconciliation statements' },
                      { n: '2', title: 'Lease Analysis', desc: 'Map every recoverable cost category in the lease against the actual charges applied' },
                      { n: '3', title: 'Reconciliation Review', desc: 'Audit all service charge reconciliations against supporting supplier invoices' },
                      { n: '4', title: 'Maintenance Audit', desc: 'Cross-reference maintenance invoices against contracted labour rates and approved scopes' },
                      { n: '5', title: 'Recovery Claim', desc: 'Prepare findings report and manage recovery dispute with landlord/managing agent' },
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
                      <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Property Audit</Link>
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
                Property audits average €28,000 recovery
              </h2>
              <p className="text-navy/80 text-lg mb-6">
                No upfront costs. 25% of recovered savings only. No find — no fee.
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
            <FadeIn><SectionLabel>Related Services</SectionLabel><SectionTitle>Complement your property audit</SectionTitle></FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Energy Audits', href: '/services/energy', desc: 'Electricity and gas overcharge recovery' },
              { icon: '♻️', title: 'Waste Management', href: '/services/waste', desc: 'Waste collection and disposal billing review' },
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
