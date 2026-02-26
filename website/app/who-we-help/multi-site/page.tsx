import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Multi-Site Businesses | Foxlite Forensic Services',
  description: 'Comprehensive auditing for businesses operating across multiple locations and jurisdictions.',
}

export default function MultiSitePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">📍</div>
              <SectionLabel className="text-gold">Multi-Site Businesses</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive auditing for multi-location operations
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Specialized cost auditing for businesses operating across multiple locations 
                and jurisdictions with complex, distributed operational structures.
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
                  Multi-Site Business Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Multi-site businesses face unique cost management challenges with distributed 
                  operations, varying local suppliers, inconsistent contract terms, and complex 
                  cost allocation. Our specialized auditing approach understands multi-location 
                  operations, from franchise networks to corporate chains, identifying 
                  consolidation opportunities and standardization savings across all sites.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Multi-location energy contracts</li>
                      <li>• Distributed waste management services</li>
                      <li>• Site-specific maintenance contracts</li>
                      <li>• Multi-site telecoms and IT services</li>
                      <li>• Regional banking and payment processing</li>
                      <li>• Location-specific insurance policies</li>
                      <li>• Fleet management across regions</li>
                      <li>• Varying supplier contracts per site</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Cross-site cost consolidation</li>
                      <li>• Contract standardization opportunities</li>
                      <li>• Multi-location energy optimization</li>
                      <li>• Centralized service procurement</li>
                      <li>• Regional supplier renegotiation</li>
                      <li>• Site-by-site cost benchmarking</li>
                      <li>• Group insurance optimization</li>
                      <li>• Operational cost standardization</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    coordinated approach across all your business locations.
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
                Ready to optimize your multi-site costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to multi-location operations. 
                Discover how much your business network could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Multi-Site Audit
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