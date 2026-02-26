import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { ServiceCard } from '@/components/ServiceCard'

export const metadata: Metadata = {
  title: 'Our Services | Foxlite Forensic Services',
  description: 'Comprehensive forensic auditing services across energy, waste, banking, telecoms, fleet, insurance, property, and complete business audits.',
}

const services = [
  {
    title: 'Energy Audits',
    description: 'Comprehensive electricity, gas, and renewable energy cost analysis to identify billing discrepancies and optimize energy expenses.',
    icon: '⚡',
    href: '/services/energy'
  },
  {
    title: 'Waste Management',
    description: 'Detailed waste collection, disposal, and recycling cost verification to ensure accurate billing and service optimization.',
    icon: '♻️',
    href: '/services/waste'
  },
  {
    title: 'Banking & Finance',
    description: 'Bank charges, loan fees, and financial service cost analysis to recover overcharged amounts and optimize banking relationships.',
    icon: '💳',
    href: '/services/banking'
  },
  {
    title: 'Telecoms & Broadband',
    description: 'Mobile, landline, and internet service cost verification to identify billing discrepancies and contract optimization opportunities.',
    icon: '📡',
    href: '/services/telecoms'
  },
  {
    title: 'Fleet & Fuel',
    description: 'Vehicle leasing, fuel, and maintenance cost analysis for fleet optimization and overcharge recovery across all transport expenses.',
    icon: '🚗',
    href: '/services/fleet'
  },
  {
    title: 'Insurance & Rates',
    description: 'Insurance premium and claims cost verification to ensure fair pricing and proper coverage across all business insurance categories.',
    icon: '🛡️',
    href: '/services/insurance'
  },
  {
    title: 'Property & Facilities',
    description: 'Property maintenance, service charges, and facility management cost analysis to optimize all property-related expenses.',
    icon: '🏢',
    href: '/services/property'
  },
  {
    title: 'Complete Audit',
    description: 'Comprehensive forensic audit across all 8 cost categories for maximum savings identification and business-wide optimization.',
    icon: '📊',
    href: '/services/all'
  }
]

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Our Services</SectionLabel>
              <SectionTitle className="text-white">
                Comprehensive forensic auditing across all business costs
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                We provide specialized forensic auditing services across 8 key cost categories, 
                identifying overcharges and optimizing expenses to maximize your business savings.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 100}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  href={service.href}
                />
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Why Choose Foxlite</SectionLabel>
              <SectionTitle>
                Proven expertise across all business cost categories
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Forensic Expertise</h3>
                <p className="text-textMid">
                  Deep forensic analysis capabilities with VeriTech 10 Certification and EU AI Act compliance.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">No Risk Pricing</h3>
                <p className="text-textMid">
                  Free audits with payment only on results. 25% of recoveries vs. industry standard 50%.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Proven Results</h3>
                <p className="text-textMid">
                  Established since 2019 with comprehensive coverage across all business cost categories.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy mb-6">
                Ready to start saving?
              </h2>
              <p className="text-xl text-textMid mb-8 max-w-2xl mx-auto">
                Contact us for a free consultation. Choose individual service audits or our 
                comprehensive complete audit across all cost categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/services/all">
                  <button className="bg-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all">
                    Complete Audit
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-navy text-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy hover:text-white transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}