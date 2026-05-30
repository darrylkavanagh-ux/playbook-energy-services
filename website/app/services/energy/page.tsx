import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Energy Audits | Foxlite Forensic Services',
  description: 'Comprehensive electricity, gas, and renewable energy cost analysis to identify overcharges and billing errors.',
}

export default function EnergyServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">⚡</div>
              <SectionLabel className="text-gold">Energy Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive energy cost analysis and overcharge recovery
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our energy audits identify billing errors, tariff mismatches, and hidden charges 
                across electricity, gas, and renewable energy systems.
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
                    Energy Cost Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Energy costs represent one of the largest expense categories for most businesses, 
                    yet they're also where we find the most significant overcharges. Our forensic 
                    energy audits examine every aspect of your energy supply, consumption, and billing.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Electricity Costs</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Supply charges and standing fees</li>
                        <li>• Unit rates and tariff structures</li>
                        <li>• Power factor penalties</li>
                        <li>• Maximum demand charges</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Gas Costs</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Supply and transportation charges</li>
                        <li>• Calorific value calculations</li>
                        <li>• Capacity and commodity rates</li>
                        <li>• Balancing and network charges</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Billing Errors</div>
                        <div className="text-textMid text-sm">Incorrect meter readings, wrong tariff applications</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Hidden Charges</div>
                        <div className="text-textMid text-sm">Undisclosed fees, duplicate charges</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Tariff Mismatches</div>
                        <div className="text-textMid text-sm">Wrong rate structures for usage patterns</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Contract Issues</div>
                        <div className="text-textMid text-sm">Unfavorable terms, automatic renewals</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our technical expertise in electrical systems, combined with forensic auditing 
                    methodologies, ensures we identify every possible saving opportunity in your 
                    energy costs.
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
                        <div className="font-semibold text-navy">Bill Collection</div>
                        <div className="text-sm text-textMid">Gather 24 months of energy bills and contracts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Usage Analysis</div>
                        <div className="text-sm text-textMid">Analyze consumption patterns and demand profiles</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Tariff Verification</div>
                        <div className="text-sm text-textMid">Check tariff applications and rate calculations</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Error Identification</div>
                        <div className="text-sm text-textMid">Identify overcharges and billing discrepancies</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Recovery Process</div>
                        <div className="text-sm text-textMid">Handle supplier negotiations and refund claims</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Optimization</div>
                        <div className="text-sm text-textMid">Implement ongoing cost monitoring systems</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Link href="/contact" className="inline-block px-6 py-3 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-lg hover:bg-[#B8943E] transition-all duration-200 text-center w-full block">Start Energy Audit</Link>
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
                Other audits that complement energy analysis
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
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
              <Link href="/services/waste" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">♻️</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Waste Management
                  </h3>
                  <p className="text-textMid">
                    Waste collection and disposal cost verification
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={400}>
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