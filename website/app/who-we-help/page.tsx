import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Who We Help | Foxlite Forensic Services',
  description: 'Specialized forensic auditing services for property management, hospitality, retail, healthcare, manufacturing, public sector, and multi-site businesses.',
}

const industries = [
  {
    title: 'Property Management',
    description: 'Comprehensive cost auditing for property management companies, residential complexes, and commercial property portfolios.',
    icon: '🏗️',
    href: '/who-we-help/property-management'
  },
  {
    title: 'Hotels & Hospitality',
    description: 'Specialized auditing for hotels, restaurants, and hospitality businesses with complex operational cost structures.',
    icon: '🏨',
    href: '/who-we-help/hospitality'
  },
  {
    title: 'Retail & Food Service',
    description: 'Cost optimization for retail chains, restaurants, and food service businesses with multiple locations.',
    icon: '🛒',
    href: '/who-we-help/retail'
  },
  {
    title: 'Healthcare',
    description: 'Forensic auditing for healthcare facilities, medical practices, and healthcare service providers.',
    icon: '🏥',
    href: '/who-we-help/healthcare'
  },
  {
    title: 'Manufacturing',
    description: 'Industrial cost auditing for manufacturing facilities, production plants, and industrial operations.',
    icon: '🏭',
    href: '/who-we-help/manufacturing'
  },
  {
    title: 'Public Sector',
    description: 'Specialized auditing services for government agencies, public bodies, and non-profit organizations.',
    icon: '🏛️',
    href: '/who-we-help/public-sector'
  },
  {
    title: 'Multi-Site Businesses',
    description: 'Comprehensive auditing for businesses operating across multiple locations and jurisdictions.',
    icon: '📍',
    href: '/who-we-help/multi-site'
  }
]

export default function WhoWeHelpPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Who We Help</SectionLabel>
              <SectionTitle className="text-white">
                Specialized forensic auditing across industries
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                We provide tailored forensic auditing services to businesses across multiple industries, 
                understanding the unique cost challenges and opportunities in each sector.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Industries Grid */}
      <section className="py-20">
        <Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <FadeIn key={industry.title} delay={index * 100}>
                <Link href={industry.href} className="group">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full border border-greyLight hover:border-gold">
                    <div className="text-5xl mb-6">{industry.icon}</div>
                    <h3 className="font-playfair text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-textMid leading-relaxed mb-6">
                      {industry.description}
                    </p>
                    <div className="text-gold font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Learn more →
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Why Industry Specialization Matters */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Industry Expertise</SectionLabel>
              <SectionTitle>
                Why industry specialization matters
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Targeted Analysis</h3>
                <p className="text-textMid">
                  Understanding industry-specific cost structures and common overcharge patterns.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Regulatory Knowledge</h3>
                <p className="text-textMid">
                  Expertise in industry regulations, compliance requirements, and sector-specific contracts.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Best Practices</h3>
                <p className="text-textMid">
                  Knowledge of industry benchmarks and optimization strategies specific to your sector.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}