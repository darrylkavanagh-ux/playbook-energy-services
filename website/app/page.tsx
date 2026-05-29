'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Section, SectionLabel, SectionTitle, GoldRule, GoldRuleLeft } from '@/components/Section'
import { ServiceCard } from '@/components/ServiceCard'
import { FadeIn } from '@/components/FadeIn'

const services = [
  { title: 'Energy Audits',       description: 'Comprehensive electricity, gas, and renewable energy cost analysis. We identify billing errors, incorrect tariffs, and overcharges going back up to 6 years.',  icon: '⚡', href: '/services/energy' },
  { title: 'Waste Management',    description: 'Detailed waste collection, disposal, and recycling cost verification. Hidden charges, duplicate billing, and inflated rates — all uncovered.',                  icon: '♻️', href: '/services/waste' },
  { title: 'Banking & Finance',   description: 'Bank charges, loan fees, and financial service cost analysis. Recover overcharged amounts from undisclosed fees and mis-sold products.',                       icon: '💳', href: '/services/banking' },
  { title: 'Telecoms',            description: 'Mobile, landline, and internet service cost verification. Identify billing discrepancies, redundant contracts, and inflated line rental.',                    icon: '📡', href: '/services/telecoms' },
  { title: 'Fleet Management',    description: 'Vehicle leasing, fuel, and maintenance cost analysis. Fleet optimization and overcharge recovery across your entire vehicle portfolio.',                       icon: '🚗', href: '/services/fleet' },
  { title: 'Insurance',           description: 'Insurance premium and claims cost verification to ensure fair pricing, proper coverage, and elimination of duplicate or unnecessary policies.',               icon: '🛡️', href: '/services/insurance' },
  { title: 'Property Management', description: 'Property maintenance, service charges, and facility management cost analysis. Ensure every charge is contractually justified.',                               icon: '🏢', href: '/services/property' },
  { title: 'Complete Audit',      description: 'Comprehensive forensic audit across all business cost categories. Maximum savings identification in a single coordinated engagement.',                         icon: '📊', href: '/services/all' },
]

const stats = [
  { value: '€0',    label: 'Upfront cost',         sub: 'Zero risk to your business' },
  { value: '25%',   label: 'Success-only fee',      sub: 'Half the industry standard' },
  { value: '8',     label: 'Audit categories',      sub: 'Comprehensive coverage' },
  { value: '6yr',   label: 'Lookback period',       sub: 'Maximum recovery window' },
]

const process = [
  { num: '01', title: 'Free Consultation',  desc: 'We assess your business costs at zero charge and confirm the audit scope, sectors covered, and realistic recovery estimate.' },
  { num: '02', title: 'Forensic Audit',     desc: 'Our specialists conduct a meticulous forensic analysis of every bill, contract, tariff, and supplier agreement.' },
  { num: '03', title: 'Recovery & Results', desc: 'We negotiate and recover overcharges on your behalf. Our fee is 25% of what we recover — nothing if we find nothing.' },
]

const testimonials = [
  {
    quote: 'Foxlite identified €47,000 in energy overcharges we had been unknowingly paying for three years. Their forensic approach is thorough, professional, and completely results-driven.',
    name: 'Managing Director',
    company: 'National Hospitality Group',
    recovered: '€47,000',
  },
  {
    quote: 'Within six weeks, the Foxlite team uncovered €23,500 in telecoms and waste billing errors. The process was completely seamless — they handled everything.',
    name: 'Finance Director',
    company: 'Property Management Firm, Dublin',
    recovered: '€23,500',
  },
]

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — full-screen, cinematic
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0" style={{ position: 'absolute' }}>
          <Image
            src="/images/hero-boardroom.jpg"
            alt="Foxlite forensic audit boardroom"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Deep navy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#060D18]/92 via-[#0B1A2B]/85 to-[#0F2240]/80" />
          {/* Subtle radial gold glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(196,164,78,0.07),transparent)]" />
          {/* Noise grain overlay */}
          <div className="noise-overlay" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full pt-32 pb-24 px-5">
          <div className="max-w-5xl mx-auto text-center">

            <FadeIn delay={0}>
              <div className="eyebrow justify-center text-[#C4A44E] mb-6">
                Independent Forensic Auditing · Established 2019 · Dublin, Ireland
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6">
                We find{' '}
                <span className="relative inline-block">
                  <span className="text-gradient-gold">overcharges.</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4A44E] to-transparent" />
                </span>
                <br />
                You keep the{' '}
                <span className="text-gradient-gold">savings.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={240}>
              <p className="text-lg sm:text-xl md:text-2xl text-[rgba(248,246,241,0.7)] max-w-3xl mx-auto leading-relaxed mb-10">
                Irish businesses lose millions annually to hidden billing errors, incorrect tariffs,
                and supplier overcharges. Foxlite forensic audits find them — with zero upfront cost.
              </p>
            </FadeIn>

            <FadeIn delay={360}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/calculator" className="btn-primary text-base px-8 py-4">
                  Calculate My Savings
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-ghost text-base px-8 py-4">
                  Free Consultation
                </Link>
              </div>
            </FadeIn>

            {/* Trust indicators */}
            <FadeIn delay={500}>
              <div className="mt-14 flex flex-wrap justify-center gap-3">
                {['VeriTech 10 Certified', 'EU AI Act Compliant', 'GDPR Compliant', 'No Win · No Fee'].map(t => (
                  <span key={t} className="badge-gold">{t}</span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[rgba(196,164,78,0.5)]">Discover</span>
          <svg className="w-5 h-5 text-[rgba(196,164,78,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS BAR — gold on dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#0B1A2B] via-[#0F2240] to-[#0B1A2B] border-y border-[rgba(196,164,78,0.15)]">
        <Section className="py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <FadeIn key={s.value} delay={i * 80}>
                <div className="stat-chip text-center">
                  <div className="font-playfair text-3xl md:text-4xl font-bold text-gradient-gold mb-1">{s.value}</div>
                  <div className="text-[0.8rem] font-bold text-white uppercase tracking-wide mb-0.5">{s.label}</div>
                  <div className="text-[0.72rem] text-[rgba(248,246,241,0.45)]">{s.sub}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          PROBLEM SECTION — cream background
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F6F1] py-24 lg:py-32">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: image */}
            <FadeIn delay={0} direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(11,26,43,0.2)]">
                <Image
                  src="/images/forensic-documents.jpg"
                  alt="Forensic document analysis"
                  width={640}
                  height={360}
                  className="w-full object-cover"
                />
                {/* Gold frame accent */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(196,164,78,0.25)]" />
                {/* Stat overlay */}
                <div className="absolute bottom-4 left-4 bg-[#0B1A2B]/90 backdrop-blur-sm border border-[rgba(196,164,78,0.35)] rounded-xl px-5 py-3">
                  <div className="font-playfair text-2xl font-bold text-[#C4A44E]">15–30%</div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-wider text-[rgba(248,246,241,0.7)]">Average overcharge rate</div>
                </div>
              </div>
            </FadeIn>

            {/* Right: copy */}
            <FadeIn delay={150} direction="right">
              <SectionLabel className="text-[#A68A3A]">The Problem</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">
                Irish businesses lose millions to{' '}
                <em className="not-italic text-[#A68A3A]">hidden overcharges</em>
              </SectionTitle>
              <div className="gold-rule-left mb-8" />
              <p className="text-[1rem] text-[#5A5A5A] leading-relaxed mb-8">
                Energy bills, waste management, banking fees, telecoms, insurance, and property costs 
                frequently contain errors, overcharges, and unnecessary fees that accumulate undetected 
                for years — draining your profits silently.
              </p>

              <div className="space-y-5">
                {[
                  { icon: '🔍', title: 'Hidden in complexity',  desc: 'Multi-page bills, rolling contracts, and opaque pricing structures are deliberately difficult to interrogate.' },
                  { icon: '💰', title: '15–30% average excess', desc: 'Research shows most Irish businesses pay significantly more than necessary across at least 3 cost categories.' },
                  { icon: '⏰', title: 'Years go unnoticed',    desc: 'Without specialist forensic analysis, overcharges compound over years — often totalling six figures.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-lg bg-[#0B1A2B] flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0B1A2B] mb-1 text-[0.92rem]">{item.title}</h4>
                      <p className="text-[0.83rem] text-[#6A6A6A] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES GRID — dark navy
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#060D18] py-24 lg:py-32">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Services</SectionLabel>
              <SectionTitle className="text-white">
                Forensic auditing across{' '}
                <span className="text-gradient-gold">8 specialist categories</span>
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-[1rem] text-[rgba(248,246,241,0.6)] max-w-2xl mx-auto leading-relaxed">
                No upfront fees. No risk. We only get paid when we recover overcharges on your behalf.
              </p>
            </FadeIn>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 70}>
                <ServiceCard {...svc} />
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — mid navy
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0B1A2B] py-24 lg:py-32 border-y border-[rgba(196,164,78,0.1)]">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>The Process</SectionLabel>
              <SectionTitle className="text-white">Simple. Transparent. Results-driven.</SectionTitle>
              <GoldRule className="mb-4" />
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-[rgba(196,164,78,0.3)] via-[rgba(196,164,78,0.6)] to-[rgba(196,164,78,0.3)]" />

            {process.map((step, i) => (
              <FadeIn key={step.num} delay={i * 120}>
                <div className="relative text-center px-6">
                  {/* Number circle */}
                  <div className="w-20 h-20 rounded-full bg-[#0F2240] border-2 border-[#C4A44E] flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="font-playfair text-2xl font-bold text-gradient-gold">{step.num}</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-[0.85rem] text-[rgba(248,246,241,0.55)] leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          AUDIT TEAM IMAGE + COPY — cream
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F6F1] py-24 lg:py-32">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Copy */}
            <FadeIn delay={0} direction="left">
              <SectionLabel className="text-[#A68A3A]">Who We Are</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">
                Specialist forensic auditors,{' '}
                <em className="not-italic text-[#A68A3A]">not generalists</em>
              </SectionTitle>
              <div className="gold-rule-left mb-8" />
              <p className="text-[1rem] text-[#5A5A5A] leading-relaxed mb-6">
                Founded in 2019 by David Clarke and Derek Dunphy, Foxlite Forensic Services 
                is Ireland's dedicated forensic cost auditing firm. We combine deep sector expertise 
                with proprietary analytical methodology to uncover what standard accountancy misses.
              </p>
              <p className="text-[1rem] text-[#5A5A5A] leading-relaxed mb-8">
                Our VeriTech 10-certified platform cross-references billing data against live Irish 
                market rates, CRU tariff schedules, and contractual obligations — identifying 
                discrepancies invisible to the naked eye.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { v: '2019', l: 'Year established' },
                  { v: '€2M+', l: 'Recovered to date' },
                  { v: '150+', l: 'Audits completed' },
                  { v: '100%', l: 'Client satisfaction' },
                ].map(item => (
                  <div key={item.l} className="bg-white rounded-xl p-4 border border-[#E2E0DB] shadow-sm">
                    <div className="font-playfair text-2xl font-bold text-[#0B1A2B] mb-1">{item.v}</div>
                    <div className="text-[0.75rem] font-semibold uppercase tracking-wide text-[#8A8A8A]">{item.l}</div>
                  </div>
                ))}
              </div>

              <Link href="/about" className="btn-navy !bg-[#0B1A2B] !text-white !border-[rgba(196,164,78,0.35)] hover:!border-[#C4A44E] inline-flex">
                Meet the Team
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeIn>

            {/* Image */}
            <FadeIn delay={150} direction="right">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(11,26,43,0.18)]">
                <Image
                  src="/images/audit-team.jpg"
                  alt="Foxlite forensic audit specialists"
                  width={640}
                  height={360}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(196,164,78,0.2)]" />
                {/* Quote overlay */}
                <div className="absolute bottom-4 right-4 max-w-[240px] bg-[#0B1A2B]/90 backdrop-blur-sm border border-[rgba(196,164,78,0.3)] rounded-xl px-4 py-3">
                  <p className="text-[0.72rem] text-[rgba(248,246,241,0.8)] leading-relaxed italic">
                    "We find what standard accountancy misses."
                  </p>
                  <p className="text-[0.68rem] font-bold text-[#C4A44E] mt-1 uppercase tracking-wide">David Clarke, MD</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          PRICING COMPARISON — dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#060D18] py-24 lg:py-32">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Transparent Pricing</SectionLabel>
              <SectionTitle className="text-white">
                Half the cost. Shorter commitment.{' '}
                <span className="text-gradient-gold">Better results.</span>
              </SectionTitle>
              <GoldRule className="mb-4" />
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Industry standard */}
            <FadeIn delay={0}>
              <div className="rounded-2xl border border-[rgba(248,246,241,0.08)] bg-[#0D1F35] p-8 text-center h-full flex flex-col">
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[rgba(248,246,241,0.35)] mb-4">Industry Standard</div>
                <div className="font-playfair text-5xl font-bold text-[rgba(248,246,241,0.45)] mb-2">50%</div>
                <div className="text-[0.83rem] text-[rgba(248,246,241,0.4)] mb-1">of recovered savings</div>
                <div className="text-[0.78rem] text-[rgba(248,246,241,0.3)] mb-6">5-year engagement period</div>
                <div className="mt-auto text-[0.75rem] text-[rgba(248,246,241,0.25)]">What most forensic auditors charge</div>
              </div>
            </FadeIn>

            {/* Foxlite advantage */}
            <FadeIn delay={120}>
              <div className="rounded-2xl border-2 border-[#C4A44E] bg-gradient-to-br from-[#0F2240] to-[#0D1F35] p-8 text-center h-full flex flex-col relative overflow-hidden shadow-[0_0_60px_rgba(196,164,78,0.15)]">
                {/* Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(196,164,78,0.08),transparent)] pointer-events-none" />
                {/* Best value badge */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <div className="bg-[#C4A44E] text-[#0B1A2B] text-[0.62rem] font-bold uppercase tracking-[0.18em] px-5 py-1 rounded-b-lg">
                    Foxlite Advantage
                  </div>
                </div>
                <div className="mt-5">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C4A44E] mb-4">Your Rate</div>
                  <div className="font-playfair text-5xl font-bold text-white mb-2">25%</div>
                  <div className="text-[0.83rem] text-[rgba(248,246,241,0.75)] mb-1">of recovered savings only</div>
                  <div className="text-[0.78rem] text-[rgba(248,246,241,0.55)] mb-6">3-year maximum engagement</div>
                </div>
                <div className="mt-auto space-y-2">
                  {['50% less than competitors', 'No recovery · No fee', '40% shorter commitment'].map(f => (
                    <div key={f} className="flex items-center justify-center gap-2 text-[0.78rem] text-[rgba(248,246,241,0.7)]">
                      <svg className="w-3.5 h-3.5 text-[#C4A44E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="text-center mt-10">
            <FadeIn delay={200}>
              <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
                View Full Pricing Details
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          CALCULATOR CTA — gold band
      ═══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#C4A44E] via-[#D4B96A] to-[#C4A44E] py-24 lg:py-28 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, #0B1A2B 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <Section className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <FadeIn delay={0}>
              <div className="eyebrow !text-[#0B1A2B]/70 justify-center lg:justify-start">
                Free Tool · Instant Estimate
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1A2B] mb-5 leading-tight">
                How much could your business recover?
              </h2>
              <p className="text-[#0B1A2B]/75 text-[1rem] mb-7 leading-relaxed">
                Our forensic savings calculator estimates potential overcharges across energy, telecoms, 
                waste, insurance, and banking — based on live Irish market rates and sector benchmarks.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Takes under 2 minutes to complete',
                  'Built on live Irish supplier rate data',
                  'Covers 7 cost categories',
                  'Results prompt a free Foxlite consultation',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[0.9rem] text-[#0B1A2B]/80 font-medium">
                    <svg className="w-5 h-5 text-[#0B1A2B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/calculator" className="btn-navy inline-flex items-center gap-2 !bg-[#0B1A2B] !text-white !border-[rgba(11,26,43,0.3)]">
                Open Savings Calculator
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeIn>

            {/* Right: example card */}
            <FadeIn delay={160}>
              <div className="bg-[#0B1A2B] rounded-2xl p-7 shadow-[0_30px_80px_rgba(11,26,43,0.4)] border border-[rgba(196,164,78,0.25)]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C4A44E] mb-1">Live Example</div>
                    <div className="text-white font-semibold text-sm">4-star hotel · 3-year review</div>
                  </div>
                  <div className="text-3xl">🏨</div>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { label: 'Electricity',  spend: '€54,000', overcharge: '€10,260', pct: '19%' },
                    { label: 'Gas',          spend: '€21,600', overcharge: '€3,672',  pct: '17%' },
                    { label: 'Telecoms',     spend: '€9,000',  overcharge: '€1,350',  pct: '15%' },
                    { label: 'Waste',        spend: '€14,400', overcharge: '€2,592',  pct: '18%' },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[0.78rem] text-[rgba(248,246,241,0.55)]">{row.label} ({row.spend})</span>
                        <span className="text-[0.78rem] font-bold text-[#C4A44E]">{row.overcharge} <span className="text-[rgba(248,246,241,0.35)] font-normal">({row.pct})</span></span>
                      </div>
                      <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#A68A3A] to-[#D4B96A] rounded-full" style={{ width: row.pct }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[rgba(196,164,78,0.15)] pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[rgba(248,246,241,0.55)]">Total estimated recovery</span>
                    <span className="font-bold text-[#C4A44E] text-base">€17,874</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[rgba(248,246,241,0.45)] text-xs">Net to business (after 25% fee)</span>
                    <span className="font-bold text-green-400 text-sm">€13,406</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS — dark
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0B1A2B] py-24 lg:py-32 border-t border-[rgba(196,164,78,0.1)]">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Client Results</SectionLabel>
              <SectionTitle className="text-white">
                Real recoveries. Real businesses.
              </SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>

          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="relative">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className={`testimonial-card transition-all duration-700 ${i === activeTestimonial ? 'opacity-100 relative' : 'opacity-0 absolute inset-0'}`}
                  >
                    <p className="font-playfair text-xl md:text-2xl text-white leading-relaxed mb-8 mt-4">
                      "{t.quote}"
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-[0.78rem] text-[rgba(248,246,241,0.5)]">{t.company}</div>
                      </div>
                      <div className="flex-shrink-0 bg-[rgba(196,164,78,0.1)] border border-[rgba(196,164,78,0.3)] rounded-xl px-5 py-2 text-center">
                        <div className="font-playfair text-2xl font-bold text-[#C4A44E]">{t.recovered}</div>
                        <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[rgba(248,246,241,0.45)]">Recovered</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-6 h-2 bg-[#C4A44E]' : 'w-2 h-2 bg-[rgba(196,164,78,0.3)]'}`}
                  />
                ))}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA — dark navy
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#060D18] py-24 border-t border-[rgba(196,164,78,0.1)]">
        <Section>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              {/* Logo in white box */}
              <div className="inline-block bg-white rounded-2xl p-3 shadow-[0_0_0_1px_rgba(196,164,78,0.35),0_8px_32px_rgba(0,0,0,0.4)] mb-8">
                <Image
                  src="/images/foxlite-logo.jpg"
                  alt="Foxlite Forensic Services"
                  width={80}
                  height={72}
                  className="block rounded-lg"
                />
              </div>

              <SectionLabel className="justify-center">Start Today</SectionLabel>
              <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to recover your{' '}
                <span className="text-gradient-gold">overcharges?</span>
              </h2>
              <p className="text-[1.05rem] text-[rgba(248,246,241,0.6)] mb-10 max-w-xl mx-auto leading-relaxed">
                Start with a free audit. Zero upfront costs, zero risk. 
                We only get paid when we deliver results for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculator" className="btn-primary text-base px-9 py-4">
                  Calculate My Savings
                </Link>
                <Link href="/contact" className="btn-ghost text-base px-9 py-4">
                  Contact Us
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>
    </>
  )
}
