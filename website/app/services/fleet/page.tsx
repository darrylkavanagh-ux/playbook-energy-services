import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Fleet Management Audits | Foxlite Forensic Services',
  description: 'Vehicle leasing, fuel, and maintenance cost analysis for fleet optimization and overcharge recovery.',
}

export default function FleetServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🚗</div>
              <SectionLabel className="text-gold">Fleet & Fuel Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive fleet cost analysis and fuel optimization
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our fleet audits identify overcharges in vehicle leasing, fuel costs, maintenance, 
                and fleet management services to optimize your transportation expenses.
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
                    Fleet & Fuel Management Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Fleet costs represent a significant expense for many businesses, yet they often 
                    contain hidden charges and inefficiencies. Our forensic fleet audits examine 
                    all aspects of your vehicle operations, from leasing agreements to fuel cards, 
                    identifying cost savings and operational improvements.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Vehicle Costs</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Lease and rental agreements</li>
                        <li>• Insurance premiums</li>
                        <li>• Maintenance contracts</li>
                        <li>• Vehicle financing costs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Fuel & Operations</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Fuel card charges and fees</li>
                        <li>• Route optimization costs</li>
                        <li>• Driver expenses</li>
                        <li>• Fleet management services</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Lease Overcharges</div>
                        <div className="text-textMid text-sm">Excessive mileage charges, unfair wear penalties</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Fuel Card Fees</div>
                        <div className="text-textMid text-sm">Hidden transaction fees, poor fuel pricing</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Maintenance Costs</div>
                        <div className="text-textMid text-sm">Overpriced services, unnecessary work</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Insurance Issues</div>
                        <div className="text-textMid text-sm">Excessive premiums, poor coverage terms</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our expertise in fleet management and automotive industry practices ensures 
                    we identify every possible saving opportunity while maintaining operational 
                    efficiency and compliance with transport regulations.
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
                        <div className="font-semibold text-navy">Fleet Assessment</div>
                        <div className="text-sm text-textMid">Catalog all vehicles, leases, and service agreements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cost Analysis</div>
                        <div className="text-sm text-textMid">Analyze all fleet-related expenses and charges</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Contract Review</div>
                        <div className="text-sm text-textMid">Examine lease agreements and service contracts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Usage Optimization</div>
                        <div className="text-sm text-textMid">Identify efficiency improvements and cost reductions</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Supplier Negotiation</div>
                        <div className="text-sm text-textMid">Handle renegotiation with fleet service providers</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Fleet Monitoring</div>
                        <div className="text-sm text-textMid">Implement ongoing cost tracking and optimization</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Button className="w-full">
                      Start Fleet Audit
                    </Button>
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
                Other audits that complement fleet management analysis
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0}>
              <Link href="/services/insurance" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Insurance
                  </h3>
                  <p className="text-textMid">
                    Insurance premium and claims cost verification
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={200}>
              <Link href="/services/banking" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Banking & Finance
                  </h3>
                  <p className="text-textMid">
                    Bank charges, loan fees, and financial service cost analysis
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