import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'All Audit Services | Foxlite Forensic Services',
  description: 'Complete forensic audit across all 8 business cost categories — energy, waste, banking, telecoms, fleet, insurance, property management. One engagement, maximum recovery.',
}

export default function AllServicesPage() {
  const services = [
    {
      icon: '⚡',
      title: 'Energy Audits',
      href: '/services/energy',
      avg: '€22,400',
      desc: 'Electricity, gas, renewable energy — tariff misapplication, capacity charges, billing errors.',
      rate: '19%',
    },
    {
      icon: '♻️',
      title: 'Waste Management',
      href: '/services/waste',
      avg: '€8,600',
      desc: 'Waste collection, clinical and general disposal, tonnage disputes, unauthorised price escalations.',
      rate: '18%',
    },
    {
      icon: '💳',
      title: 'Banking & Finance',
      href: '/services/banking',
      avg: '€18,400',
      desc: 'Current account charges, merchant service fees, loan interest margins, asset finance costs.',
      rate: '14%',
    },
    {
      icon: '📡',
      title: 'Telecoms',
      href: '/services/telecoms',
      avg: '€11,200',
      desc: 'Mobile, broadband, ISDN, VoIP — duplicate lines, ghost services, above-contract rates.',
      rate: '15%',
    },
    {
      icon: '🚗',
      title: 'Fleet Management',
      href: '/services/fleet',
      avg: '€14,300',
      desc: 'Fuel cards, vehicle leasing, maintenance contracts — rebate misapplication, rate errors.',
      rate: '16%',
    },
    {
      icon: '🛡️',
      title: 'Insurance',
      href: '/services/insurance',
      avg: '€12,800',
      desc: 'Premium loadings, duplicate covers, brokerage overcharges, policy endorsement errors.',
      rate: '12%',
    },
    {
      icon: '🏢',
      title: 'Property Management',
      href: '/services/property',
      avg: '€28,000',
      desc: 'Service charges, FM fees, maintenance contracts, energy cost pass-through overcharges.',
      rate: '21%',
    },
    {
      icon: '📊',
      title: 'Complete Audit',
      href: '/services/all',
      avg: '€94,200',
      desc: 'All seven categories in one comprehensive engagement — maximum recovery, single engagement.',
      rate: '15–22%',
      featured: true,
    },
  ]

  return (
    <>
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">📊</div>
              <SectionLabel className="text-gold">Complete Audit</SectionLabel>
              <SectionTitle className="text-white">
                All 8 forensic audit categories in one engagement
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                The Foxlite Complete Audit covers every major business cost category in a single 
                engagement. Our forensic team systematically reviews energy, waste, banking, telecoms, 
                fleet, insurance, and property management — identifying and recovering all overcharges.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Our 8 Audit Categories</SectionLabel>
              <SectionTitle>Every business cost category forensically audited</SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 80}>
                <Link href={s.href} className="group">
                  <div className={`rounded-2xl p-6 h-full border transition-all hover:shadow-lg ${
                    s.featured ? 'bg-navy border-gold/40 text-white' : 'bg-white border-greyLight'
                  }`}>
                    <div className="text-4xl mb-4">{s.icon}</div>
                    <h3 className={`font-playfair text-lg font-bold mb-2 group-hover:text-gold transition-colors ${
                      s.featured ? 'text-white' : 'text-navy'
                    }`}>{s.title}</h3>
                    <p className={`text-sm leading-relaxed mb-4 ${s.featured ? 'text-greyLight' : 'text-textMid'}`}>
                      {s.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-xs ${s.featured ? 'text-greyLight' : 'text-textLight'}`}>Avg. recovery</div>
                        <div className={`font-bold font-playfair ${s.featured ? 'text-gold' : 'text-navy'}`}>{s.avg}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        s.featured ? 'bg-gold/20 text-gold' : 'bg-cream text-navy'
                      }`}>
                        ~{s.rate} overcharge
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Why Complete Audit */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <SectionLabel>Why Complete Audit?</SectionLabel>
              <SectionTitle>Maximum recovery. Single engagement.</SectionTitle>
              <GoldRule className="mb-6" />
              <div className="space-y-5 text-textMid leading-relaxed text-lg">
                <p>
                  Individual category audits recover significant amounts — but the complete audit 
                  typically delivers 3–4x more per engagement because overcharges in one category 
                  often mask deeper systemic billing errors in others.
                </p>
                <p>
                  A single forensic engagement also means one set of documents requested, one client 
                  liaison contact, and one consolidated findings report — minimising disruption to 
                  your business.
                </p>
                <p>
                  The Foxlite Complete Audit is structured over 6–8 weeks and covers all in-scope 
                  categories with a single engagement agreement and a single fee structure: 
                  25% of total recovered savings.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="bg-navy rounded-2xl p-8 text-white">
                <h3 className="font-playfair text-xl font-bold text-gold mb-6">What's included</h3>
                <div className="space-y-4">
                  {[
                    { icon: '✓', text: 'All 8 cost categories audited in parallel' },
                    { icon: '✓', text: 'Single document request — we coordinate everything' },
                    { icon: '✓', text: 'Dedicated forensic audit lead assigned to your case' },
                    { icon: '✓', text: 'All supplier negotiations handled by Foxlite' },
                    { icon: '✓', text: 'Full forensic findings report per category' },
                    { icon: '✓', text: 'Consolidated recovery tracker and reporting' },
                    { icon: '✓', text: '25% fee on total recovered savings — nothing upfront' },
                    { icon: '✓', text: 'Ongoing cost monitoring recommendations included' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-gold font-bold flex-shrink-0">{item.icon}</span>
                      <span className="text-greyLight text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-4xl font-playfair font-bold text-gold mb-1">€94,200</div>
                    <div className="text-greyLight text-sm">Average complete audit recovery</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-playfair text-4xl font-bold mb-6">
                Start your complete forensic audit today
              </h2>
              <p className="text-xl text-greyLight mb-8">
                Free initial consultation. No upfront costs. 25% of recovered savings only.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculator">
                  <Link href="/calculator" className="inline-block px-8 py-4 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-xl text-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Calculate My Savings</Link>
                </Link>
                <Link href="/contact">
                  <Link href="/contact" className="inline-block px-8 py-4 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-xl text-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center">Book Free Consultation</Link>
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>
    </>
  )
}
