import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Waste Management Audits | Foxlite Forensic Services',
  description: 'Detailed waste collection, disposal, and recycling cost verification to ensure accurate billing.',
}

export default function WasteServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">♻️</div>
              <SectionLabel className="text-gold">Waste Management Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive waste cost analysis and overcharge recovery
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our waste management audits identify billing errors, service overcharges, and hidden fees 
                across waste collection, disposal, and recycling services.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Description */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                    Waste Management Cost Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Waste management costs are often overlooked but can contain significant overcharges. 
                    Our forensic waste audits examine every aspect of your waste collection, disposal, 
                    recycling services, and associated charges to identify savings opportunities.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Collection Services</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Bin collection frequencies</li>
                        <li>• Container rental charges</li>
                        <li>• Collection route optimization</li>
                        <li>• Service level agreements</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Disposal & Recycling</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Landfill and disposal fees</li>
                        <li>• Recycling credit calculations</li>
                        <li>• Contamination penalties</li>
                        <li>• Hazardous waste handling</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Service Overcharges</div>
                        <div className="text-textMid text-sm">Excessive collection frequencies, unnecessary services</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Hidden Fees</div>
                        <div className="text-textMid text-sm">Fuel surcharges, admin fees, equipment charges</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Billing Errors</div>
                        <div className="text-textMid text-sm">Incorrect weights, wrong service levels</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Contract Issues</div>
                        <div className="text-textMid text-sm">Unfavorable terms, automatic price increases</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our expertise in waste management contracts and environmental regulations ensures 
                    we identify every possible saving opportunity while maintaining compliance with 
                    waste disposal requirements.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FadeIn delay={200}>
                <div className="bg-cream rounded-lg p-6 sticky top-24">
                  <h3 className="font-playfair text-xl font-bold text-navy mb-4">How It Works</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">1</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Contract Review</div>
                        <div className="text-sm text-textMid">Analyze waste management contracts and service agreements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Service Assessment</div>
                        <div className="text-sm text-textMid">Evaluate collection frequencies and service requirements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Bill Analysis</div>
                        <div className="text-sm text-textMid">Verify charges against actual services provided</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cost Optimization</div>
                        <div className="text-sm text-textMid">Identify service reductions and efficiency improvements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Supplier Negotiation</div>
                        <div className="text-sm text-textMid">Handle renegotiation of contracts and service levels</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Ongoing Monitoring</div>
                        <div className="text-sm text-textMid">Implement cost monitoring and compliance systems</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Waste Audit</Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Section>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-12">
            <FadeIn>
              <SectionLabel>Related Services</SectionLabel>
              <SectionTitle>
                Other audits that complement waste management analysis
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0}>
              <Link href="/services/property" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Property Management
                  </h3>
                  <p className="text-textMid">
                    Facility management and maintenance cost analysis
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={200}>
              <Link href="/services/energy" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Energy Audits
                  </h3>
                  <p className="text-textMid">
                    Electricity, gas, and renewable energy cost analysis
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={400}>
              <Link href="/services/telecoms" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">📡</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Telecoms
                  </h3>
                  <p className="text-textMid">
                    Mobile, landline, and internet service cost verification
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={600}>
              <Link href="/services/all" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Complete Audit
                  </h3>
                  <p className="text-textMid">
                    Comprehensive audit across all cost categories
                  </p>
                </div>
              </Link>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}