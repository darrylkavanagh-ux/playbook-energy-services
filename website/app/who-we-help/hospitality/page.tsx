import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Hotels & Hospitality | Foxlite Forensic Services',
  description: 'Specialized forensic auditing for hotels, restaurants, and hospitality businesses with complex operational cost structures.',
}

export default function HospitalityPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏨</div>
              <SectionLabel className="text-gold">Hotels & Hospitality</SectionLabel>
              <SectionTitle className="text-white">
                Specialized auditing for hospitality businesses
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for hotels, restaurants, and hospitality businesses 
                with complex operational cost structures and high-volume service requirements.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <Section>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="prose prose-lg max-w-none">
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                  Hospitality Industry Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  The hospitality industry operates with complex cost structures, high energy consumption, 
                  extensive waste generation, and multiple service contracts. Our specialized auditing 
                  approach understands the unique operational requirements of hotels, restaurants, and 
                  hospitality venues, identifying cost savings without compromising service quality.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• High-volume energy consumption</li>
                      <li>• Commercial waste and food waste management</li>
                      <li>• Kitchen equipment and maintenance</li>
                      <li>• Laundry and cleaning services</li>
                      <li>• Guest telecoms and WiFi services</li>
                      <li>• Food and beverage supplier costs</li>
                      <li>• Insurance for hospitality operations</li>
                      <li>• Banking and payment processing fees</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Energy efficiency optimization</li>
                      <li>• Waste management cost reduction</li>
                      <li>• Kitchen and equipment cost analysis</li>
                      <li>• Service contract renegotiation</li>
                      <li>• Telecoms and technology optimization</li>
                      <li>• Payment processing fee reduction</li>
                      <li>• Insurance premium benchmarking</li>
                      <li>• Operational cost consolidation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    no disruption to your hospitality operations.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy mb-6">
                Ready to optimize your hospitality costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to hospitality operations. 
                Discover how much your business could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Hospitality Audit
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Contact Us
                </Button>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}