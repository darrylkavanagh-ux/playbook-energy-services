import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Case Studies | Foxlite Forensic Services',
  description: 'Real-world examples of cost recovery and savings identification by Foxlite Forensic Services.',
}

export default function CaseStudiesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Case Studies</SectionLabel>
              <SectionTitle className="text-white">
                Real results from our forensic audits
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Discover how we've helped Irish businesses recover significant overcharges 
                across multiple cost categories.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Coming Soon */}
      <section className="py-20">
        <Section>
          <div className="text-center max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-6xl mb-8">📋</div>
              <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                Case Studies Under Preparation
              </h2>
              <p className="text-lg text-textMid leading-relaxed mb-8">
                We're currently preparing detailed case studies showcasing our forensic audit 
                results and client success stories. These will be available soon and will 
                demonstrate the significant savings we've achieved across various industries.
              </p>
              <div className="bg-cream rounded-lg p-6 mb-8">
                <h3 className="font-playfair text-xl font-bold text-navy mb-4">
                  What to expect in our case studies:
                </h3>
                <ul className="text-left text-textMid space-y-2">
                  <li>• Detailed breakdown of overcharges identified</li>
                  <li>• Recovery amounts and timelines</li>
                  <li>• Industry-specific cost analysis</li>
                  <li>• Client testimonials and feedback</li>
                  <li>• Methodology and audit process insights</li>
                </ul>
              </div>
              <p className="text-lg text-textMid mb-8">
                In the meantime, we welcome your enquiry to discuss how our forensic auditing 
                services can benefit your specific business situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Audit
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Contact Us
                </Button>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Preview Cards */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Coming Soon</SectionLabel>
              <SectionTitle>
                Preview of upcoming case studies
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                  Energy Audit Success
                </h3>
                <p className="text-textMid mb-4">
                  How we identified €47,000 in energy overcharges for a Dublin-based 
                  property management company.
                </p>
                <div className="text-sm text-gold font-semibold">Coming Soon</div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                  Multi-Site Recovery
                </h3>
                <p className="text-textMid mb-4">
                  Comprehensive audit across 12 retail locations resulting in 
                  significant cost savings across multiple categories.
                </p>
                <div className="text-sm text-gold font-semibold">Coming Soon</div>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                  Healthcare Facility
                </h3>
                <p className="text-textMid mb-4">
                  Forensic audit of a healthcare facility uncovering hidden charges 
                  in waste management and telecoms contracts.
                </p>
                <div className="text-sm text-gold font-semibold">Coming Soon</div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}