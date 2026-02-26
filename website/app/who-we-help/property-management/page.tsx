import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Property Management | Foxlite Forensic Services',
  description: 'Specialized forensic auditing for property management companies, residential complexes, and commercial property portfolios.',
}

export default function PropertyManagementPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏗️</div>
              <SectionLabel className="text-gold">Property Management</SectionLabel>
              <SectionTitle className="text-white">
                Specialized auditing for property management companies
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for property management companies, residential complexes, 
                and commercial property portfolios with complex operational structures.
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
                  Property Management Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Property management companies face unique cost challenges with multiple properties, 
                  diverse service contracts, and complex billing structures. Our specialized auditing 
                  approach understands the intricacies of property operations, from service charge 
                  allocations to maintenance contracts, ensuring every cost is optimized.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Energy costs across multiple properties</li>
                      <li>• Waste management and recycling services</li>
                      <li>• Maintenance and cleaning contracts</li>
                      <li>• Security and monitoring systems</li>
                      <li>• Landscaping and grounds maintenance</li>
                      <li>• Insurance premiums and coverage</li>
                      <li>• Telecoms and broadband services</li>
                      <li>• Banking and financial service fees</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Service charge verification and allocation</li>
                      <li>• Maintenance contract cost analysis</li>
                      <li>• Energy efficiency and billing optimization</li>
                      <li>• Supplier contract renegotiation</li>
                      <li>• Insurance premium benchmarking</li>
                      <li>• Waste management cost reduction</li>
                      <li>• Technology and telecoms optimization</li>
                      <li>• Cross-property cost consolidation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    no risk to your property management operations.
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
                Ready to optimize your property costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to property management operations. 
                Discover how much your portfolio could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Property Audit
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