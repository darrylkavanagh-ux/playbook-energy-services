import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { ServiceCard } from '@/components/ServiceCard'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Our Services | Foxlite Forensic Services',
  description: 'Comprehensive forensic auditing services across 8 categories: energy, waste, banking, telecoms, fleet, insurance, property, and complete audits.',
}

const services = [
  {
    title: 'Energy Audits',
    description: 'Comprehensive electricity, gas, and renewable energy cost analysis to identify overcharges and billing errors.',
    icon: '⚡',
    href: '/services/energy'
  },
  {
    title: 'Waste Management',
    description: 'Detailed waste collection, disposal, and recycling cost verification to ensure accurate billing.',
    icon: '♻️',
    href: '/services/waste'
  },
  {
    title: 'Banking & Finance',
    description: 'Bank charges, loan fees, and financial service cost analysis to recover overcharged amounts.',
    icon: '💳',
    href: '/services/banking'
  },
  {
    title: 'Telecoms',
    description: 'Mobile, landline, and internet service cost verification to identify billing discrepancies.',
    icon: '📡',
    href: '/services/telecoms'
  },
  {
    title: 'Fleet Management',
    description: 'Vehicle leasing, fuel, and maintenance cost analysis for fleet optimization and overcharge recovery.',
    icon: '🚗',
    href: '/services/fleet'
  },
  {
    title: 'Insurance',
    description: 'Insurance premium and claims cost verification to ensure fair pricing and proper coverage.',
    icon: '🛡️',
    href: '/services/insurance'
  },
  {
    title: 'Property Management',
    description: 'Property maintenance, service charges, and facility management cost analysis.',
    icon: '🏢',
    href: '/services/property'
  },
  {
    title: 'Complete Audit',
    description: 'Comprehensive forensic audit across all business cost categories for maximum savings identification.',
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
                Comprehensive forensic auditing across 8 categories
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                We specialize in identifying overcharges and billing errors across all major 
                business cost categories. No upfront fees - we only get paid when you save money.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 100}>
                <ServiceCard {...service} />
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Process Overview */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Process</SectionLabel>
              <SectionTitle>
                How we identify and recover your overcharges
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-navy">1</span>
                </div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Initial Assessment</h3>
                <p className="text-textMid">
                  Free consultation to understand your business costs and identify audit priorities.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-navy">2</span>
                </div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Forensic Analysis</h3>
                <p className="text-textMid">
                  Detailed investigation of bills, contracts, and cost structures to identify overcharges.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-navy">3</span>
                </div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Recovery & Savings</h3>
                <p className="text-textMid">
                  We handle recovery negotiations and implement ongoing cost optimization strategies.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}