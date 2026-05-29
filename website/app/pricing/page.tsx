import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Pricing | Foxlite Forensic Services',
  description: 'Simple, transparent, results-based pricing. 25% of recovered savings, 3-year engagement. No upfront costs.',
}

const faqs = [
  {
    question: 'What if you don\'t find any savings?',
    answer: 'If we don\'t identify recoverable overcharges, you pay nothing. Our fee is only charged on actual savings recovered.'
  },
  {
    question: 'How long does an audit take?',
    answer: 'Initial audits typically take 2-4 weeks depending on the complexity of your business and number of cost categories analyzed.'
  },
  {
    question: 'Do you handle the recovery process?',
    answer: 'Yes, we manage all negotiations with suppliers and service providers to recover identified overcharges on your behalf.'
  },
  {
    question: 'What documentation do you need?',
    answer: 'We typically need 24 months of bills, contracts, and service agreements for the categories being audited.'
  },
  {
    question: 'Can you audit just one cost category?',
    answer: 'Absolutely. You can choose individual services like energy audits or opt for our comprehensive audit across all categories.'
  },
  {
    question: 'How do you ensure confidentiality?',
    answer: 'All client information is protected under strict confidentiality agreements and our VeriTech 10 certification standards.'
  }
]

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Pricing</SectionLabel>
              <SectionTitle className="text-white">
                Simple, transparent, results-based
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                No upfront costs, no hidden fees. We only get paid when we find savings for your business.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Consultation */}
            <FadeIn delay={0}>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-greyLight">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Free Consultation</h3>
                <div className="text-5xl font-bold text-gold mb-4">€0</div>
                <div className="text-textMid mb-6">Initial assessment</div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-textMid">Business cost review</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-textMid">Audit scope definition</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-textMid">Savings potential estimate</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-textMid">No obligation proposal</span>
                  </li>
                </ul>
                
                <Link href="/contact" className="inline-block px-6 py-3 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center w-full block">Book Consultation</Link>
              </div>
            </FadeIn>

            {/* Our Fee Structure */}
            <FadeIn delay={200}>
              <div className="bg-gold rounded-lg shadow-lg p-8 text-center border-4 border-goldDark relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-navy text-white px-4 py-1 rounded-full text-sm font-semibold">
                  RECOMMENDED
                </div>
                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Foxlite Fee Structure</h3>
                <div className="text-5xl font-bold text-navy mb-4">25%</div>
                <div className="text-navy mb-6">of recovered savings</div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-navy mr-2">✓</span>
                    <span className="text-navy">3-year engagement maximum</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-navy mr-2">✓</span>
                    <span className="text-navy">All audit categories included</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-navy mr-2">✓</span>
                    <span className="text-navy">Recovery process managed</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-navy mr-2">✓</span>
                    <span className="text-navy">Ongoing cost monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-navy mr-2">✓</span>
                    <span className="text-navy">VeriTech 10 certified process</span>
                  </li>
                </ul>
                
                <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Audit</Link>
              </div>
            </FadeIn>

            {/* Industry Standard */}
            <FadeIn delay={400}>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-greyLight">
                <h3 className="font-playfair text-2xl font-bold text-textMid mb-4">Industry Standard</h3>
                <div className="text-5xl font-bold text-textMid mb-4">50%</div>
                <div className="text-textMid mb-6">of recovered savings</div>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-textMid mr-2">•</span>
                    <span className="text-textMid">5-year engagement typical</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-textMid mr-2">•</span>
                    <span className="text-textMid">Limited audit scope</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-textMid mr-2">•</span>
                    <span className="text-textMid">Basic recovery support</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-textMid mr-2">•</span>
                    <span className="text-textMid">Minimal ongoing support</span>
                  </li>
                </ul>
                
                <div className="text-sm text-textLight italic">
                  What most forensic auditors charge
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Value Comparison</SectionLabel>
              <SectionTitle>
                Why choose Foxlite over industry standard?
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-3 text-center">
                  <div className="p-6 border-r border-greyLight">
                    <div className="font-semibold text-navy mb-2">Feature</div>
                  </div>
                  <div className="p-6 border-r border-greyLight bg-gold">
                    <div className="font-semibold text-navy mb-2">Foxlite</div>
                  </div>
                  <div className="p-6">
                    <div className="font-semibold text-navy mb-2">Industry Standard</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 text-center border-t border-greyLight">
                  <div className="p-4 border-r border-greyLight">
                    <div className="text-textMid">Fee Percentage</div>
                  </div>
                  <div className="p-4 border-r border-greyLight bg-goldLight">
                    <div className="font-bold text-navy">25%</div>
                  </div>
                  <div className="p-4">
                    <div className="text-textMid">50%</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 text-center border-t border-greyLight">
                  <div className="p-4 border-r border-greyLight">
                    <div className="text-textMid">Engagement Period</div>
                  </div>
                  <div className="p-4 border-r border-greyLight bg-goldLight">
                    <div className="font-bold text-navy">3 years max</div>
                  </div>
                  <div className="p-4">
                    <div className="text-textMid">5+ years</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 text-center border-t border-greyLight">
                  <div className="p-4 border-r border-greyLight">
                    <div className="text-textMid">Audit Categories</div>
                  </div>
                  <div className="p-4 border-r border-greyLight bg-goldLight">
                    <div className="font-bold text-navy">All 8 categories</div>
                  </div>
                  <div className="p-4">
                    <div className="text-textMid">Limited scope</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 text-center border-t border-greyLight">
                  <div className="p-4 border-r border-greyLight">
                    <div className="text-textMid">Recovery Management</div>
                  </div>
                  <div className="p-4 border-r border-greyLight bg-goldLight">
                    <div className="font-bold text-navy">Full service</div>
                  </div>
                  <div className="p-4">
                    <div className="text-textMid">Basic support</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Frequently Asked Questions</SectionLabel>
              <SectionTitle>
                Everything you need to know about our pricing
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-lg font-bold text-navy mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-textMid leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to start saving money?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Book your free consultation today. No upfront costs, no risk. 
                We only get paid when we find savings for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="inline-block px-8 py-4 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-xl text-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Book Free Consultation</Link>
                <Link href="/contact" className="inline-block px-8 py-4 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-xl text-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center">Contact Us</Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}