import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Banking & Finance Audits | Foxlite Forensic Services',
  description: 'Bank charges, loan fees, and financial service cost analysis to recover overcharged amounts.',
}

export default function BankingServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">💳</div>
              <SectionLabel className="text-gold">Banking & Finance Audits</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive banking cost analysis and fee recovery
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our banking audits identify excessive fees, incorrect charges, and hidden costs 
                across all business banking and financial services.
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
                    Banking & Financial Services Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Banking fees and financial service charges can accumulate significantly over time. 
                    Our forensic banking audits examine all aspects of your business banking relationships, 
                    loan agreements, and financial service contracts to identify overcharges and recover fees.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">What We Analyze</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Banking Services</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Account maintenance fees</li>
                        <li>• Transaction charges</li>
                        <li>• Overdraft and facility fees</li>
                        <li>• International transfer costs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Lending & Credit</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• Loan arrangement fees</li>
                        <li>• Interest rate calculations</li>
                        <li>• Credit facility charges</li>
                        <li>• Early repayment penalties</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Common Overcharges We Find</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Excessive Fees</div>
                        <div className="text-textMid text-sm">Unnecessary charges, duplicate fees</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Rate Miscalculations</div>
                        <div className="text-textMid text-sm">Incorrect interest applications, margin errors</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Service Charges</div>
                        <div className="text-textMid text-sm">Unwarranted transaction fees, admin costs</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Contract Breaches</div>
                        <div className="text-textMid text-sm">Charges outside agreed terms</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our expertise in banking regulations and financial service agreements ensures 
                    we identify every possible recovery opportunity while maintaining strong 
                    banking relationships for your business.
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
                        <div className="font-semibold text-navy">Account Analysis</div>
                        <div className="text-sm text-textMid">Review all business banking accounts and statements</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Fee Verification</div>
                        <div className="text-sm text-textMid">Check all charges against agreed fee schedules</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Contract Review</div>
                        <div className="text-sm text-textMid">Analyze loan agreements and facility terms</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Overcharge Identification</div>
                        <div className="text-sm text-textMid">Identify incorrect charges and fee breaches</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Bank Negotiation</div>
                        <div className="text-sm text-textMid">Handle recovery discussions with banking partners</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cost Optimization</div>
                        <div className="text-sm text-textMid">Implement ongoing fee monitoring systems</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Button className="w-full">
                      Start Banking Audit
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
                Other audits that complement banking analysis
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
            
            <FadeIn delay={400}>
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