import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Public Sector | Foxlite Forensic Services',
  description: 'Specialized auditing services for government agencies, public bodies, and non-profit organizations.',
}

export default function PublicSectorPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏛️</div>
              <SectionLabel className="text-gold">Public Sector</SectionLabel>
              <SectionTitle className="text-white">
                Specialized auditing for government and public bodies
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for government agencies, public bodies, and 
                non-profit organizations with specialized procurement and accountability requirements.
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
                  Public Sector Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Public sector organizations face unique challenges with strict procurement rules, 
                  accountability requirements, and budget constraints. Our specialized auditing 
                  approach understands public sector operations, from framework agreements to 
                  compliance requirements, ensuring maximum value for public money while 
                  maintaining full transparency and accountability.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Multi-site energy consumption</li>
                      <li>• Public building waste management</li>
                      <li>• Facility maintenance and cleaning</li>
                      <li>• Public sector telecoms frameworks</li>
                      <li>• Fleet and transport services</li>
                      <li>• Banking and financial services</li>
                      <li>• Public liability insurance</li>
                      <li>• IT and technology services</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Framework agreement optimization</li>
                      <li>• Multi-site cost consolidation</li>
                      <li>• Procurement compliance verification</li>
                      <li>• Service contract renegotiation</li>
                      <li>• Energy efficiency for public buildings</li>
                      <li>• Waste management cost reduction</li>
                      <li>• Technology service optimization</li>
                      <li>• Budget accountability enhancement</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    full transparency and accountability for public sector requirements.
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
                Ready to optimize your public sector costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to public sector operations. 
                Discover how much your organization could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Public Sector Audit
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