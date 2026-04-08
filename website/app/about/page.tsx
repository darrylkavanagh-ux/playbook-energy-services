import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us | Foxlite Forensic Services',
  description: 'Learn about Foxlite Forensic Services, an independent forensic auditing firm established in 2019, based in Dublin, Ireland.',
}

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">About Us</SectionLabel>
              <SectionTitle className="text-white">
                Independent forensic auditing experts
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Established in 2019, Foxlite Forensic Services is Dublin's leading independent 
                forensic auditing firm, specializing in business cost recovery and overcharge identification.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <SectionLabel>Who We Are</SectionLabel>
                <SectionTitle>
                  Forensic auditing specialists with a mission
                </SectionTitle>
                <div className="space-y-6 text-lg text-textMid leading-relaxed">
                  <p>
                    Foxlite Forensic Services was founded in 2019 with a simple mission: to help Irish 
                    businesses recover money they've been overcharged across multiple cost categories.
                  </p>
                  <p>
                    Our team combines deep expertise in building management, quantity surveying, and 
                    electrical systems with forensic auditing methodologies to identify hidden costs 
                    and billing errors that traditional accountants miss.
                  </p>
                  <p>
                    We operate on a results-only basis - if we don't find savings, you don't pay. 
                    This alignment of interests ensures we're motivated to deliver real value to every client.
                  </p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="bg-cream rounded-lg p-8">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-6">Our Approach</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-gold text-xl">🔍</div>
                    <div>
                      <h4 className="font-semibold text-navy mb-1">Forensic Analysis</h4>
                      <p className="text-textMid">Deep-dive investigation of all cost categories</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-gold text-xl">📊</div>
                    <div>
                      <h4 className="font-semibold text-navy mb-1">Data-Driven</h4>
                      <p className="text-textMid">Evidence-based findings with full documentation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-gold text-xl">🤝</div>
                    <div>
                      <h4 className="font-semibold text-navy mb-1">Results-Only</h4>
                      <p className="text-textMid">No savings found, no fees charged</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Team</SectionLabel>
              <SectionTitle>
                Expert professionals with proven track records
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FadeIn delay={0}>
              <div className="text-center">
                <div className="w-32 h-32 bg-navy rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl text-gold font-playfair font-bold">DC</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-navy mb-2">MANAGING DIRECTOR — FORENSIC AUDIT LEAD</h3>
                <div className="text-gold font-semibold mb-4">Managing Director</div>
                <div className="text-textMid leading-relaxed">
                  <p className="mb-3">
                    Qualified in Building Management & Quantity Surveying with over 15 years 
                    experience in cost analysis and project management.
                  </p>
                  <p>
                    Specializes in energy auditing, property cost analysis, and forensic 
                    investigation of construction and facility management overcharges.
                  </p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="text-center">
                <div className="w-32 h-32 bg-navy rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-4xl text-gold font-playfair font-bold">DD</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-navy mb-2">TECHNICAL DIRECTOR — ELECTRICAL SYSTEMS SPECIALIST</h3>
                <div className="text-gold font-semibold mb-4">Technical Director</div>
                <div className="text-textMid leading-relaxed">
                  <p className="mb-3">
                    Qualified Electrician with Philips Lighting certification and extensive 
                    experience in electrical systems and energy efficiency analysis.
                  </p>
                  <p>
                    Leads technical audits of electrical installations, energy consumption 
                    patterns, and lighting system optimization projects.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* VeriTech 10 Certification */}
      <section className="py-20">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <div className="bg-gold rounded-lg p-8 mb-8">
                  <h3 className="font-playfair text-3xl font-bold text-navy mb-4">VeriTech 10 Certified</h3>
                  <p className="text-lg text-navy leading-relaxed">
                    Foxlite Forensic Services is VeriTech 10 Certified, ensuring the highest standards 
                    of forensic auditing methodology, data verification, and client confidentiality.
                  </p>
                </div>
                
                <div className="bg-cream rounded-lg p-8">
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">EU AI Act Compliant</h3>
                  <p className="text-lg text-textMid leading-relaxed">
                    Our auditing processes and data handling procedures are fully compliant with 
                    EU AI Act requirements, ensuring ethical and transparent use of technology 
                    in our forensic investigations.
                  </p>
                </div>
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
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to work with Ireland's forensic auditing experts?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Contact us today for a free consultation and discover how much your business 
                could be saving across all cost categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Audit
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy">
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