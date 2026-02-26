import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Healthcare | Foxlite Forensic Services',
  description: 'Forensic auditing for healthcare facilities, medical practices, and healthcare service providers.',
}

export default function HealthcarePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏥</div>
              <SectionLabel className="text-gold">Healthcare</SectionLabel>
              <SectionTitle className="text-white">
                Specialized auditing for healthcare facilities
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Comprehensive cost auditing for healthcare facilities, medical practices, 
                and healthcare service providers with specialized operational requirements.
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
                  Healthcare Industry Cost Challenges
                </h2>
                
                <p className="text-lg text-textMid leading-relaxed mb-8">
                  Healthcare facilities operate with unique cost structures including specialized 
                  equipment, strict regulatory requirements, and 24/7 operational needs. Our 
                  specialized auditing approach understands healthcare operations, from medical 
                  equipment costs to specialized waste disposal, ensuring compliance while 
                  optimizing operational expenses.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Common Cost Areas</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• 24/7 energy consumption and backup systems</li>
                      <li>• Medical and hazardous waste disposal</li>
                      <li>• Medical equipment maintenance contracts</li>
                      <li>• Specialized cleaning and sterilization</li>
                      <li>• Healthcare telecoms and IT systems</li>
                      <li>• Medical gas and utility services</li>
                      <li>• Professional indemnity insurance</li>
                      <li>• Banking and payment processing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-cream rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-4">Audit Scope</h3>
                    <ul className="text-textMid space-y-2">
                      <li>• Energy efficiency for medical facilities</li>
                      <li>• Medical waste management optimization</li>
                      <li>• Equipment maintenance cost analysis</li>
                      <li>• Specialized service contract review</li>
                      <li>• Healthcare IT and telecoms optimization</li>
                      <li>• Medical gas supply cost verification</li>
                      <li>• Insurance premium benchmarking</li>
                      <li>• Compliance-focused cost optimization</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Pricing Summary</h3>
                  <p className="text-navy text-lg leading-relaxed">
                    <strong>The audit is free.</strong> We charge 25% of recovered amounts. 
                    We also retain 25% of ongoing savings for three years. No upfront costs, 
                    no disruption to your healthcare operations.
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
                Ready to optimize your healthcare costs?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation tailored to healthcare operations. 
                Discover how much your facility could be saving.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Healthcare Audit
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