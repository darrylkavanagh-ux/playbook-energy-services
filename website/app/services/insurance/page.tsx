import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Insurance Audits | Foxlite Forensic Services',
  description: 'Insurance premium and claims cost verification to ensure fair pricing and proper coverage.',
}

export default function InsuranceServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">🛡️</div>
              <SectionLabel className="text-gold">Insurance & Rates Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive insurance cost analysis and premium optimization
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our insurance audits identify overcharges in premiums, claims handling fees, 
                and policy costs across all business insurance categories.
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
                    Insurance & Premium Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Insurance costs can be complex and often contain hidden charges and excessive premiums. 
                    Our forensic insurance audits examine all aspects of your business insurance portfolio, 
                    from policy terms to claims handling, identifying overcharges and ensuring fair coverage.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Business Insurance</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Public liability premiums</li>
                        <li>• Professional indemnity costs</li>
                        <li>• Property and contents cover</li>
                        <li>• Business interruption insurance</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Specialized Cover</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Motor fleet insurance</li>
                        <li>• Cyber liability coverage</li>
                        <li>• Directors and officers insurance</li>
                        <li>• Product liability premiums</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Excessive Premiums</div>
                        <div className="text-textMid text-sm">Overpriced coverage, poor risk assessment</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Hidden Fees</div>
                        <div className="text-textMid text-sm">Admin charges, broker fees, policy costs</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Coverage Issues</div>
                        <div className="text-textMid text-sm">Over-insurance, duplicate coverage</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Claims Handling</div>
                        <div className="text-textMid text-sm">Excessive deductibles, poor settlement terms</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our expertise in insurance regulations and risk management ensures 
                    we identify every possible saving opportunity while maintaining 
                    appropriate coverage levels for your business protection.
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
                        <div className="font-semibold text-navy">Policy Review</div>
                        <div className="text-sm text-textMid">Analyze all business insurance policies and coverage</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Risk Assessment</div>
                        <div className="text-sm text-textMid">Evaluate actual business risks against coverage levels</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Premium Analysis</div>
                        <div className="text-sm text-textMid">Compare premiums against market rates and risk profiles</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Claims Review</div>
                        <div className="text-sm text-textMid">Examine claims history and settlement patterns</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Insurer Negotiation</div>
                        <div className="text-sm text-textMid">Handle renegotiation of terms and premiums</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Coverage Optimization</div>
                        <div className="text-sm text-textMid">Implement ongoing insurance cost monitoring</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Button className="w-full">
                      Start Insurance Audit
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
                Other audits that complement insurance analysis
              </SectionTitle>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0}>
              <Link href="/services/fleet" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">🚗</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Fleet Management
                  </h3>
                  <p className="text-textMid">
                    Vehicle leasing, fuel, and maintenance cost analysis
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={200}>
              <Link href="/services/property" className="group">
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                    Property Management
                  </h3>
                  <p className="text-textMid">
                    Property maintenance, service charges, and facility management
                  </p>
                </div>
              </Link>
            </FadeIn>
            
            <FadeIn delay={400}>
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