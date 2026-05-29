import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Telecoms Audits | Foxlite Forensic Services',
  description: 'Forensic audit of mobile, broadband, landline and unified communications costs. Identify billing errors, duplicate lines and contract overcharges.',
}

export default function TelecomsServicePage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">📡</div>
              <SectionLabel className="text-gold">Telecoms Audits</SectionLabel>
              <SectionTitle className="text-white">
                Recover telecoms overcharges — mobile, broadband, landlines and unified comms
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Telecoms billing is among the most error-prone business cost categories. 
                Duplicate lines, stale contracts, incorrect bundles and rate misapplication 
                create overcharges that compound undetected for years.
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
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">Telecoms Cost Forensic Analysis</h2>
                <p className="text-lg text-textMid leading-relaxed mb-6">
                  Business telecoms contracts evolve over time — new lines are added, bundles are 
                  changed, and legacy services linger on invoice long after the physical service 
                  has been decommissioned. Contract auto-renewals lock businesses into rates that 
                  are significantly above current market rates.
                </p>
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Foxlite audits every telecoms invoice line — from mobile handset plans to SIP 
                  trunks, MPLS circuits to broadband connections — cross-referencing charges against 
                  contracted rates, usage records, and active service inventories to identify and 
                  recover all overcharges.
                </p>

                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Audit</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { title: 'Mobile & SIM Costs', items: ['Tariff above contracted rate', 'Roaming charge disputes', 'Data overage charge errors', 'Legacy handset charges on inactive SIMs'] },
                    { title: 'Broadband & Fixed Lines', items: ['Line rental above agreed rate', 'Duplicate broadband circuits', 'Decommissioned ISDN lines still billed', 'Speed/service tier mismatches'] },
                    { title: 'Unified Communications', items: ['VoIP per-seat charges above contract', 'Call recording storage overcharges', 'Auto-renew rate escalation disputes', 'MS Teams/Cisco licensing errors'] },
                    { title: 'Contract & Billing Errors', items: ['Early termination fee disputes', 'Minimum usage commitment miscalculations', 'Bundled minutes overage errors', 'Multi-site billing consolidation errors'] },
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
                    A 12-location retail chain had two broadband lines being billed at one location 
                    for three years following a supplier change in 2021 — the original line had never 
                    been formally ceased. The telecoms audit also identified line rental charges on 
                    two disconnected ISDN numbers across two other sites. Total telecoms recovery: 
                    <span className="text-gold font-bold"> €21,600</span>.
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
                      { n: '1', title: 'Service Inventory', desc: 'Compile full inventory of all active and billed telecoms services across all sites' },
                      { n: '2', title: 'Contract Review', desc: 'Gather all current and expired telecoms contracts and rate schedules' },
                      { n: '3', title: 'Bill Reconciliation', desc: 'Cross-reference 24–60 months of invoices against contracted rates for each service line' },
                      { n: '4', title: 'Ghost Service Identification', desc: 'Identify disconnected or inactive services still being billed' },
                      { n: '5', title: 'Recovery & Optimisation', desc: 'File recovery claims and recommend contract optimisation going forward' },
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
                      <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Telecoms Audit</Link>
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
                Average telecoms audit recovery: €11,200
              </h2>
              <p className="text-navy/80 text-lg mb-6">
                No upfront costs. 25% of recovered amounts only — nothing if we find nothing.
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
            <FadeIn><SectionLabel>Related Services</SectionLabel><SectionTitle>Complement your telecoms audit</SectionTitle></FadeIn>
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
