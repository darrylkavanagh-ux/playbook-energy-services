import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Retail & Food Service | Foxlite Forensic Services',
  description: 'Cost optimization for retail chains, restaurants, and food service businesses with multiple locations.',
}

export default function RetailPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🛒</div>
              <SectionLabel className="text-gold">Retail & Food Service</SectionLabel>
              <SectionTitle className="text-white">
                Cost optimization for retail and food service businesses
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for retail chains, restaurants, and food service 
                businesses with multiple locations and complex supply chain operations.
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
                  Retail & Food Service Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Retail and food service businesses face unique cost pressures with multiple locations, 
                  high energy consumption, extensive waste generation, and complex payment processing. 
                  Our specialized auditing approach understands the operational requirements of retail 
                  chains and food service operations, identifying significant cost savings opportunities.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Multi-location energy consumption</li>
                      <li>• Food waste and packaging disposal</li>
                      <li>• Refrigeration and equipment costs</li>
                      <li>• Point-of-sale and payment processing</li>
                      <li>• Security systems across locations</li>
                      <li>• Cleaning and maintenance services</li>
                      <li>• Business insurance for retail operations</li>
                      <li>• Banking and merchant service fees</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Multi-site energy optimization</li>
                      <li>• Waste management cost reduction</li>
                      <li>• Equipment and maintenance analysis</li>
                      <li>• Payment processing fee optimization</li>
                      <li>• Security system cost analysis</li>
                      <li>• Service contract consolidation</li>
                      <li>• Insurance premium benchmarking</li>
                      <li>• Cross-location cost standardization</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    no disruption to your retail operations.
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
                Ready to optimize your retail costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to retail and food service operations. 
                Discover how much your business could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Retail Audit
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