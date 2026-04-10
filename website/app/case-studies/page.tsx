import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Case Studies | Foxlite Forensic Services',
  description: 'Real-world examples of cost recovery and savings achieved by Foxlite Forensic Services across Ireland and the UK.',
}

const results = [
  {
    icon: '⚡',
    industry: 'Property Management',
    title: 'Energy Overcharge Recovery — Dublin Portfolio',
    recovered: '€47,000',
    period: '3-year retrospective',
    categories: ['Electricity', 'Gas'],
    detail: 'A Dublin-based property management company had been billed on the wrong tariff structure across their portfolio for over three years. Foxlite conducted a full forensic line-by-line analysis of every electricity and gas invoice, identified systematic tariff misapplications, and negotiated a full retrospective refund directly with the supplier.',
    outcome: 'Full refund secured within 14 weeks of engagement. New tariff structure implemented, saving €15,600 annually going forward.',
    quote: 'Foxlite found money we didn\'t even know we\'d lost. The process was completely transparent and professional from start to finish.',
    role: 'Managing Director',
  },
  {
    icon: '🏨',
    industry: 'Hospitality',
    title: 'Multi-Site Utilities Audit — 4 Hotel Properties',
    recovered: '€82,000',
    period: '6-year retrospective',
    categories: ['Electricity', 'Waste', 'Telecoms'],
    detail: 'A four-property hotel group engaged Foxlite for a complete audit across energy, waste and telecoms. Billing errors were found in all three categories — including duplicate waste charges, inflated telecoms call rates, and incorrect electricity standing charges applied across all four sites.',
    outcome: 'Total recovery of €82,000 across six years, with ongoing annual savings of €21,500 secured through renegotiated contracts.',
    quote: 'We had no idea how much we were being overcharged. David and his team handled everything — the bills, the suppliers, the negotiations. Completely hassle-free.',
    role: 'Operations Director',
  },
  {
    icon: '🏭',
    industry: 'Manufacturing',
    title: 'Banking & Finance Overcharge — Midwest Manufacturer',
    recovered: '€31,500',
    period: '5-year retrospective',
    categories: ['Banking charges', 'Insurance'],
    detail: 'A manufacturing business had been paying unnecessary bank charges and duplicated insurance premiums for several years. Foxlite\'s forensic banking audit uncovered three categories of undisclosed charges and an overlapping insurance policy that had never been identified in annual reviews.',
    outcome: '€31,500 recovered in cash refunds plus elimination of €9,800 in annual duplicate charges.',
    quote: 'I assumed our accountant would have spotted this. They didn\'t. Foxlite did — and got our money back.',
    role: 'Financial Controller',
  },
]

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,164,78,0.12),transparent_60%)]" />
        <Section>
          <div className="text-center relative z-10">
            <FadeIn>
              <SectionLabel className="text-gold">Client Results</SectionLabel>
              <SectionTitle className="text-white">
                Real recoveries. Real businesses.
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight/80 max-w-3xl mx-auto leading-relaxed">
                Every case study below represents real money returned to a real Irish business.
                Names and identifying details are withheld in line with our confidentiality commitments.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Summary Stats */}
      <section className="bg-gold py-10">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '€2.4M+', label: 'Total recovered to date' },
              { val: '100+', label: 'Businesses audited' },
              { val: '8', label: 'Cost categories covered' },
              { val: '6 yrs', label: 'Maximum retrospective period' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-playfair text-4xl font-bold text-navy mb-1">{s.val}</div>
                <div className="text-navy/80 text-sm font-semibold uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-cream">
        <Section>
          <div className="space-y-16">
            {results.map((cs, i) => (
              <FadeIn key={cs.title} delay={i * 100}>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-navy px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{cs.icon}</span>
                      <div>
                        <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">{cs.industry}</p>
                        <h3 className="font-playfair text-xl md:text-2xl font-bold text-white">{cs.title}</h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-playfair text-3xl font-bold text-gold">{cs.recovered}</div>
                      <div className="text-white/60 text-xs mt-1">{cs.period}</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 grid lg:grid-cols-3 gap-8">
                    {/* Categories */}
                    <div>
                      <h4 className="font-semibold text-navy text-sm uppercase tracking-wider mb-3">Categories Audited</h4>
                      <div className="flex flex-wrap gap-2">
                        {cs.categories.map((cat) => (
                          <span key={cat} className="bg-cream text-navy text-sm font-medium px-3 py-1 rounded-full border border-gray-200">{cat}</span>
                        ))}
                      </div>

                      <h4 className="font-semibold text-navy text-sm uppercase tracking-wider mt-6 mb-3">Outcome</h4>
                      <p className="text-textMid text-sm leading-relaxed">{cs.outcome}</p>
                    </div>

                    {/* Detail */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-navy text-sm uppercase tracking-wider mb-3">What We Found</h4>
                      <p className="text-textMid leading-relaxed mb-6">{cs.detail}</p>

                      {/* Quote */}
                      <div className="bg-cream rounded-2xl p-6 border-l-4 border-gold">
                        <p className="font-playfair text-lg text-navy italic leading-relaxed mb-3">
                          "{cs.quote}"
                        </p>
                        <p className="text-textMid text-sm font-semibold">{cs.role} · {cs.industry}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Process note */}
      <section className="py-20 bg-white">
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <SectionLabel>Our Commitment</SectionLabel>
              <SectionTitle>Confidentiality you can count on</SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-lg text-textMid leading-relaxed mb-8">
                We never publish client names, identifying business details, or
                commercially sensitive information without explicit written consent.
                All case studies above are published with client approval and have
                had identifying details removed or modified.
              </p>
              <p className="text-lg text-textMid leading-relaxed mb-10">
                If you'd like to speak directly with one of our clients as a reference,
                we can facilitate introductions on request.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                  className="bg-navy hover:bg-[#112240] text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors">
                  Request a Client Reference
                </Link>
                <Link href="/calculator"
                  className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors">
                  Calculate Your Recovery
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl font-bold mb-4">
                Could your business be next?
              </h2>
              <p className="text-xl text-greyLight/80 mb-8 max-w-2xl mx-auto">
                Contact David or Derek today for a free, confidential assessment.
                No obligation. No upfront cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                  className="bg-gold hover:bg-[#A68A3A] text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors">
                  Start Free Audit
                </Link>
                <a href="tel:+353860276700"
                  className="border-2 border-white/30 hover:border-gold text-white hover:text-gold font-bold text-lg px-10 py-4 rounded-xl transition-colors">
                  Call: +353 86 027 6700
                </a>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
