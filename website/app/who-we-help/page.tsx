import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Who We Help | Foxlite Forensic Services',
  description: 'Forensic auditing for property management, hospitality, retail, healthcare, manufacturing, public sector and multi-site businesses.',
}

const industries = [
  {
    title: 'Property Management',
    description: 'Commercial landlords, managing agents, co-working spaces, and residential portfolios with shared utility infrastructure and complex billing arrangements.',
    icon: '🏗️',
    href: '/who-we-help/property-management',
  },
  {
    title: 'Hotels & Hospitality',
    description: 'Hotels, restaurants, pubs and leisure facilities with high energy consumption, seasonal billing patterns and complex multi-supplier contracts.',
    icon: '🏨',
    href: '/who-we-help/hospitality',
  },
  {
    title: 'Retail & Food Service',
    description: 'Multi-site retailers, shopping centres and convenience stores where aggregated billing creates significant overcharge opportunities.',
    icon: '🛒',
    href: '/who-we-help/retail',
  },
  {
    title: 'Healthcare',
    description: 'Hospitals, clinics, nursing homes and dental practices operating 24/7 with critical energy needs and stringent compliance requirements.',
    icon: '🏥',
    href: '/who-we-help/healthcare',
  },
  {
    title: 'Manufacturing',
    description: 'Production facilities with high-demand energy contracts, maximum demand charges, power factor penalties and complex metering arrangements.',
    icon: '🏭',
    href: '/who-we-help/manufacturing',
  },
  {
    title: 'Public Sector',
    description: 'Government agencies, public bodies, schools, universities and non-profits where billing errors often persist undetected for years.',
    icon: '🏛️',
    href: '/who-we-help/public-sector',
  },
  {
    title: 'Multi-Site Businesses',
    description: 'Businesses operating across multiple locations and jurisdictions where billing complexity creates the greatest opportunity for recovery.',
    icon: '📍',
    href: '/who-we-help/multi-site',
  },
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
                Serving commercial organisations across every sector
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Our methodology scales across industries. Whether you operate a single site or a
                national portfolio, our forensic approach adapts to your billing complexity.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Industries Grid — centered cards */}
      <section className="py-20">
        <Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <FadeIn key={industry.title} delay={index * 80}>
                <Link href={industry.href} className="group block h-full">
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border-2 border-transparent hover:border-gold flex flex-col items-center text-center">
                    <div className="text-5xl mb-5">{industry.icon}</div>
                    <h3 className="font-playfair text-xl font-bold text-navy mb-3 group-hover:text-gold transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-textMid text-sm leading-relaxed flex-1 mb-5">
                      {industry.description}
                    </p>
                    <span className="text-gold font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Learn more →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Why specialisation matters — centered */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Our Approach</SectionLabel>
              <SectionTitle>Why industry specialisation matters</SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-lg text-textMid max-w-2xl mx-auto">
                Every sector has its own tariff structures, contract norms, and billing patterns.
                We know where the errors hide in yours.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '🎯', title: 'Sector-Specific Patterns', desc: 'We understand the specific overcharge patterns common to each industry — and target them first.' },
              { icon: '📋', title: 'Regulatory Knowledge', desc: 'Full expertise in Irish and UK energy, utilities, and finance regulations across every sector we serve.' },
              { icon: '💡', title: 'Benchmark Intelligence', desc: 'We measure your costs against verified sector benchmarks to identify exactly where you\'re being overcharged.' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-playfair text-xl font-bold text-navy mb-3">{item.title}</h3>
                  <p className="text-textMid text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to see what you're owed?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Your initial review is free, confidential, and carries no obligation.
                Most clients see results within 90 days.
              </p>
              <Link href="/contact"
                className="inline-block bg-gold hover:bg-goldDark text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors">
                Request Your Free Audit →
              </Link>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
