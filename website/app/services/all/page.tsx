import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Complete Audit | Foxlite Forensic Services',
  description: 'Comprehensive forensic audit across all business cost categories for maximum savings identification.',
}

export default function AllServicePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">📊</div>
              <SectionLabel className="text-gold">Complete Audit</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive forensic audit across all commercial charges
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our complete audit examines every aspect of your business costs across all 8 categories 
                to identify maximum savings opportunities and overcharge recovery.
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
                    Complete Business Cost Forensic Analysis
                  </h2>
                  
                  <p className="text-lg text-textMid leading-relaxed mb-6">
                    Our complete audit is the most comprehensive forensic analysis available, examining 
                    every aspect of your business costs across all categories. This holistic approach 
                    identifies interconnected overcharges and optimization opportunities that single-category 
                    audits might miss, maximizing your potential savings.
                  </p>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">All 8 Audit Categories</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Core Services</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• ⚡ Energy (electricity, gas, renewables)</li>
                        <li>• ♻️ Waste management & recycling</li>
                        <li>• 💳 Banking & financial services</li>
                        <li>• 📡 Telecoms & broadband</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-navy mb-2">Specialized Areas</h4>
                      <ul className="text-textMid space-y-1">
                        <li>• 🚗 Fleet management & fuel</li>
                        <li>• 🛡️ Insurance & risk management</li>
                        <li>• 🏢 Property & facility management</li>
                        <li>• 📊 Cross-category optimization</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Complete Audit Advantages</h3>
                  
                  <div className="bg-cream rounded-lg p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold text-navy mb-2">Maximum Savings</div>
                        <div className="text-textMid text-sm">Identify all possible overcharges across every cost category</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Cross-Category Analysis</div>
                        <div className="text-textMid text-sm">Find interconnected issues and optimization opportunities</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Comprehensive Recovery</div>
                        <div className="text-textMid text-sm">Single engagement covers all business cost areas</div>
                      </div>
                      <div>
                        <div className="font-semibold text-navy mb-2">Holistic Optimization</div>
                        <div className="text-textMid text-sm">Implement business-wide cost management systems</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-textMid leading-relaxed">
                    Our complete audit approach leverages our expertise across all business cost categories 
                    to deliver the maximum possible savings for your organization. This comprehensive 
                    methodology ensures no overcharge goes undetected and no optimization opportunity is missed.
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
                        <div className="font-semibold text-navy">Business Assessment</div>
                        <div className="text-sm text-textMid">Comprehensive review of all business cost categories</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Data Collection</div>
                        <div className="text-sm text-textMid">Gather documentation across all 8 audit categories</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Forensic Analysis</div>
                        <div className="text-sm text-textMid">Detailed examination of all costs and contracts</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">4</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Cross-Category Review</div>
                        <div className="text-sm text-textMid">Identify interconnected issues and opportunities</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">5</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Recovery Management</div>
                        <div className="text-sm text-textMid">Handle all supplier negotiations and recoveries</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-navy">6</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Ongoing Optimization</div>
                        <div className="text-sm text-textMid">Implement comprehensive cost monitoring systems</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-greyLight">
                    <Button className="w-full">
                      Start Complete Audit
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Section>
      </section>

      {/* All Services Overview */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-12">
            <FadeIn>
              <SectionLabel>Included Services</SectionLabel>
              <SectionTitle>
                All 8 audit categories in one comprehensive engagement
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
            
            <FadeIn delay={100}>
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
            
            <FadeIn delay={300}>
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
            
            <FadeIn delay={500}>
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
            
            <FadeIn delay={700}>
              <div className="bg-gold rounded-lg shadow-lg p-6 h-full">
                <div className="text-4xl mb-4 text-navy">🎯</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                  Cross-Category Analysis
                </h3>
                <p className="text-navy">
                  Identify interconnected issues and holistic optimization opportunities
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}