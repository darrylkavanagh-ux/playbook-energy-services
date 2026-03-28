'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { ServiceCard } from '@/components/ServiceCard'
import { FadeIn } from '@/components/FadeIn'

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

export default function HomePage() {
  const [currentStat, setCurrentStat] = useState(0)
  const stats = [
    { label: '25%', description: 'Our fee on recovered savings' },
    { label: '8', description: 'Specialized audit categories' },
    { label: '€0', description: 'Upfront cost to you' },
    { label: '3yr', description: 'Maximum engagement period' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-midNavy to-darkNavy">
          <div className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent opacity-30"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <FadeIn delay={0}>
            <div className="mb-6">
              <div className="text-5xl md:text-7xl font-bold font-playfair mb-4">
                FOXLITE
              </div>
              <div className="text-gold text-lg md:text-xl font-dm-sans uppercase tracking-wider">
                Forensic Services
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="h-1 bg-gold w-32 mx-auto mb-8 animate-pulse"></div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 leading-tight">
              We find overcharges.<br />
              <span className="text-gold">You keep the savings.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={600}>
            <p className="text-xl md:text-2xl text-greyLight mb-8 leading-relaxed">
              Independent forensic auditing firm established in 2019.<br />
              Specialized in identifying and recovering business cost overcharges.
            </p>
          </FadeIn>
          
          <FadeIn delay={800}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Audit
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy">
                Learn More
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gold py-8">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 100}>
                <div className="text-navy">
                  <div className="text-3xl md:text-4xl font-bold font-playfair mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm md:text-base font-semibold">
                    {stat.description}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>The Problem</SectionLabel>
              <SectionTitle>
                Irish businesses lose millions to hidden overcharges
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-textMid max-w-3xl mx-auto leading-relaxed">
                Energy bills, waste management, banking fees, telecoms, insurance, and property costs 
                often contain errors, overcharges, and unnecessary fees that go unnoticed for years.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Hidden Costs</h3>
                <p className="text-textMid">
                  Complex billing structures hide overcharges and unnecessary fees from business owners.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Lost Savings</h3>
                <p className="text-textMid">
                  Businesses pay 15-30% more than necessary across multiple cost categories.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="font-playfair text-xl font-bold text-navy mb-3">Time Wasted</h3>
                <p className="text-textMid">
                  Business owners lack time and expertise to conduct thorough cost audits.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Services</SectionLabel>
              <SectionTitle>
                Comprehensive forensic auditing across 8 categories
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-textMid max-w-3xl mx-auto leading-relaxed">
                We specialize in identifying overcharges and billing errors across all major 
                business cost categories. No upfront fees - we only get paid when you save money.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 100}>
                <ServiceCard {...service} />
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Pricing</SectionLabel>
              <SectionTitle>
                Simple, transparent, results-based
              </SectionTitle>
              <GoldRule className="mb-8" />
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn delay={0}>
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Industry Standard</h3>
                <div className="text-4xl font-bold text-textMid mb-2">50%</div>
                <div className="text-textMid mb-4">of recovered savings</div>
                <div className="text-textMid mb-6">5-year engagement</div>
                <div className="text-sm text-textLight">
                  What most forensic auditors charge
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div className="bg-gold rounded-lg shadow-lg p-8 text-center border-4 border-goldDark">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-4">Foxlite Advantage</h3>
                <div className="text-4xl font-bold text-navy mb-2">25%</div>
                <div className="text-navy mb-4">of recovered savings</div>
                <div className="text-navy mb-6">3-year engagement</div>
                <div className="text-sm text-navy font-semibold">
                  Half the cost, shorter commitment
                </div>
              </div>
            </FadeIn>
          </div>
          
          <div className="text-center mt-12">
            <FadeIn delay={400}>
              <Button size="lg" className="text-lg px-8 py-4">
                View Full Pricing
              </Button>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Testimonial */}
      <section className="py-20">
        <Section>
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl text-gold mb-8">"</div>
              <blockquote className="text-2xl md:text-3xl font-playfair text-navy mb-8 leading-relaxed">
                Foxlite identified €47,000 in energy overcharges we had been paying for three years. 
                Their forensic approach is thorough and professional.
              </blockquote>
              <div className="text-lg text-textMid">
                <strong>MANAGING DIRECTOR — FORENSIC AUDIT LEAD</strong><br />
                Managing Director, Foxlite Forensic Services
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to recover your overcharges?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Start with a free audit. No upfront costs, no risk. 
                We only get paid when we find savings for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Free Audit
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy">
                  Contact Us
                </Button>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}