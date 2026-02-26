import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Manufacturing | Foxlite Forensic Services',
  description: 'Industrial cost auditing for manufacturing facilities, production plants, and industrial operations.',
}

export default function ManufacturingPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏭</div>
              <SectionLabel className="text-gold">Manufacturing</SectionLabel>
              <SectionTitle className="text-white">
                Industrial cost auditing for manufacturing operations
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for manufacturing facilities, production plants, 
                and industrial operations with high-volume energy and operational requirements.
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
                  Manufacturing Industry Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Manufacturing operations face significant cost pressures with high energy consumption, 
                  industrial waste management, complex equipment maintenance, and specialized services. 
                  Our industrial auditing expertise understands manufacturing cost structures, from 
                  production line energy usage to industrial waste disposal, identifying substantial 
                  savings opportunities without disrupting operations.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• High-volume industrial energy consumption</li>
                      <li>• Industrial and hazardous waste management</li>
                      <li>• Production equipment maintenance</li>
                      <li>• Industrial cleaning and safety services</li>
                      <li>• Manufacturing telecoms and IT systems</li>
                      <li>• Compressed air and utility services</li>
                      <li>• Industrial insurance coverage</li>
                      <li>• Fleet and logistics costs</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Industrial energy optimization</li>
                      <li>• Waste management cost reduction</li>
                      <li>• Equipment maintenance cost analysis</li>
                      <li>• Industrial service contract review</li>
                      <li>• Manufacturing IT and telecoms optimization</li>
                      <li>• Utility service cost verification</li>
                      <li>• Industrial insurance benchmarking</li>
                      <li>• Production cost consolidation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    no disruption to your manufacturing operations.
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
                Ready to optimize your manufacturing costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to manufacturing operations. 
                Discover how much your facility could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Manufacturing Audit
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