import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Property Management Audits | Foxlite Forensic Services',
  description: 'Property maintenance, service charges, and facility management cost analysis.',
}

export default function PropertyServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🏢</div>
              <SectionLabel className="text-gold">Property & Facilities Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive property cost analysis and facility optimization
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our property audits identify overcharges in maintenance, service charges, 
                and facility management costs across all property-related expenses.
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
                    Property & Facility Management Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Property and facility costs are often complex and can contain significant overcharges. 
                    Our forensic property audits examine all aspects of your property operations, 
                    from maintenance contracts to service charges, identifying cost savings and 
                    operational improvements.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Maintenance & Services</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Cleaning and janitorial services</li>
                        <li>• Security and monitoring costs</li>
                        <li>• Maintenance contracts</li>
                        <li>• Landscaping and grounds care</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Property Costs</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Service charge allocations</li>
                        <li>• Property management fees</li>
                        <li>• Rates and local charges</li>
                        <li>• Building compliance costs</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Service Overcharges</div>
                        <div className="text-textMid text-sm">Excessive cleaning frequencies, overpriced maintenance</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Management Fees</div>
                        <div className="text-textMid text-sm">Excessive property management charges</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Service Charges</div>
                        <div className="text-textMid text-sm">Incorrect allocations, duplicate charges</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Contract Issues</div>
                        <div className="text-textMid text-sm">Unfavorable terms, automatic increases</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our expertise in property management and building services ensures 
                    we identify every possible saving opportunity while maintaining 
                    high standards of property care and compliance.
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
                        <div className="font-semibold text-navy">Property Assessment</div>
                        <div className="text-sm text-textMid">Catalog all properties and service agreements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Service Review</div>
                        <div className="text-sm text-textMid">Analyze all maintenance and facility service contracts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cost Verification</div>
                        <div className="text-sm text-textMid">Verify all charges against service levels provided</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Efficiency Analysis</div>
                        <div className="text-sm text-textMid">Identify service optimization opportunities</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Supplier Negotiation</div>
                        <div className="text-sm text-textMid">Handle renegotiation with service providers</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cost Monitoring</div>
                        <div className="text-sm text-textMid">Implement ongoing property cost tracking</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Button className="w-full">
                      Start Property Audit
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
                Other audits that complement property management analysis
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0}>
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
            
            <FadeIn delay={200}>
              <Link href="/services/waste" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">♻️</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Waste Management
                  </h3>
                  <p className="text-textMid">
                    Waste collection, disposal, and recycling cost verification
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={400}>
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