'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

const services = [
  { title: 'Energy Audits', description: 'Electricity, gas & renewable energy billing errors recovered.', icon: '⚡', href: '/services/energy', stat: '73%', statLabel: 'bills contain errors' },
  { title: 'Waste Management', description: 'Waste collection, disposal & recycling cost verification.', icon: '♻️', href: '/services/waste', stat: '62%', statLabel: 'overcharged' },
  { title: 'Banking & Finance', description: 'Bank charges, loan fees & financial service overcharges.', icon: '💳', href: '/services/banking', stat: '51%', statLabel: 'fees disputed' },
  { title: 'Telecoms', description: 'Mobile, broadband & landline billing discrepancies.', icon: '📡', href: '/services/telecoms', stat: '58%', statLabel: 'billing errors found' },
  { title: 'Fleet Management', description: 'Vehicle leasing, fuel & maintenance cost recovery.', icon: '🚗', href: '/services/fleet', stat: '48%', statLabel: 'costs recoverable' },
  { title: 'Insurance', description: 'Premium & claims cost verification for fair pricing.', icon: '🛡️', href: '/services/insurance', stat: '45%', statLabel: 'premiums excessive' },
  { title: 'Property Management', description: 'Service charges, maintenance & facilities cost analysis.', icon: '🏢', href: '/services/property', stat: '60%', statLabel: 'charges incorrect' },
  { title: 'Complete Audit', description: 'Full forensic audit across all business cost categories.', icon: '📊', href: '/services/all', stat: '100%', statLabel: 'comprehensive cover' },
]

const steps = [
  { num: '01', title: 'Engage Us', desc: 'No upfront fees. We review your situation and agree a scope in one call.' },
  { num: '02', title: 'Forensic Analysis', desc: 'We collect your bills and contracts and conduct a line-by-line forensic examination.' },
  { num: '03', title: 'Overcharge Report', desc: 'We present a full report identifying every overcharge and the recovery potential.' },
  { num: '04', title: 'Recovery & Savings', desc: 'We negotiate directly with suppliers and recover your money — back six years.' },
]

export default function HomePage() {
  const [count, setCount] = useState(0)
  const stats = [
    { val: '€2.4M+', label: 'Recovered for clients' },
    { val: '25%', label: 'Our fee on savings only' },
    { val: '6 yrs', label: 'Retrospective recovery' },
    { val: '€0', label: 'Upfront cost to you' },
  ]

  const [counted, setCounted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !counted) setCounted(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [counted])

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060E18] via-[#0B1A2B] to-[#112240]" />
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,164,78,0.15),transparent_60%)]" />
        {/* Diagonal rule */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white" style={{clipPath: 'polygon(0 100%,100% 100%,100% 0)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 border border-gold/40 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-gold text-sm font-semibold tracking-wider uppercase">Established 2019 · Dublin, Ireland</span>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="font-playfair text-white text-7xl md:text-8xl font-bold leading-none mb-3">
                FOX<span className="text-gold">LITE</span>
              </div>
              <div className="text-greyLight text-lg tracking-[0.35em] uppercase font-semibold mb-10">
                Forensic Services
              </div>
            </FadeIn>

            <FadeIn delay={250}>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                We find the overcharges.<br />
                <span className="text-gold italic">You keep the money.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="text-xl text-greyLight leading-relaxed mb-10 max-w-2xl">
                Ireland's independent forensic auditing firm. We recover historic overcharges
                across energy, waste, telecoms, banking, insurance, fleet and property — going
                back six years. No win, no fee.
              </p>
            </FadeIn>

            <FadeIn delay={550}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact"
                  className="inline-block bg-gold hover:bg-[#A68A3A] text-navy font-bold text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-gold/20 text-center">
                  Request Free Audit →
                </Link>
                <Link href="/calculator"
                  className="inline-block border-2 border-white/30 hover:border-gold text-white hover:text-gold font-semibold text-lg px-10 py-4 rounded-xl transition-all duration-200 text-center">
                  Try the Calculator
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─────────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="bg-gold">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div>
                  <div className="font-playfair text-4xl font-bold text-navy mb-1">{s.val}</div>
                  <div className="text-navy/80 text-sm font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ─── THE PROBLEM ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <SectionLabel>The Problem</SectionLabel>
              <SectionTitle>
                Irish businesses lose millions every year to billing errors
              </SectionTitle>
              <GoldRule className="mb-8 mx-0" />
              <div className="space-y-5 text-lg text-textMid leading-relaxed">
                <p>
                  Energy, waste, telecoms, banking fees, insurance premiums and property charges
                  all contain errors — often for years. Complex billing structures and supplier
                  complacency mean that most businesses simply never check.
                </p>
                <p>
                  The result: you're quietly paying 15–30% more than you should be, across
                  multiple cost lines, month after month.
                </p>
                <p className="font-semibold text-navy">
                  Foxlite recovers what's yours — forensically, professionally, and on a no-win,
                  no-fee basis.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/calculator"
                  className="inline-block bg-navy hover:bg-[#112240] text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
                  Calculate Your Recovery →
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🔍', title: 'Hidden Charges', desc: 'Suppliers exploit billing complexity to overcharge quietly and consistently.' },
                  { icon: '📅', title: '6-Year Lookback', desc: 'Irish and UK law allows recovery of overcharges going back six years.' },
                  { icon: '💰', title: 'Real Money Back', desc: 'We negotiate directly with suppliers and put the cash back in your account.' },
                  { icon: '✅', title: 'No Win, No Fee', desc: '25% of what we recover. If we find nothing, you pay nothing.' },
                ].map((card) => (
                  <div key={card.title} className="bg-cream rounded-2xl p-6">
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="font-playfair font-bold text-navy text-base mb-2">{card.title}</h3>
                    <p className="text-textMid text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="py-28 bg-[#0B1A2B] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,164,78,0.1),transparent_60%)]" />
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel className="text-gold">The Process</SectionLabel>
              <SectionTitle className="text-white">How we recover your money</SectionTitle>
              <GoldRule className="mb-4" />
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 120}>
                <div className="relative">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gold/20 z-0" style={{width: 'calc(100% - 2rem)', left: '50%'}} />
                  )}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-7 h-full hover:border-gold/40 transition-colors">
                    <div className="font-playfair text-5xl font-bold text-gold/30 mb-4 leading-none">{step.num}</div>
                    <h3 className="font-playfair text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-greyLight/70 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ─── SERVICES GRID ─────────────────────────────────────────────────────── */}
      <section className="py-28 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Services</SectionLabel>
              <SectionTitle>Eight specialist audit categories</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-xl text-textMid max-w-2xl mx-auto">
                Each category has a dedicated forensic methodology developed over years of
                live audit work across Ireland and the UK.
              </p>
            </FadeIn>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 60}>
                <Link href={svc.href}
                  className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gold/30">
                  <div className="bg-navy p-5 flex items-center justify-between">
                    <span className="text-3xl">{svc.icon}</span>
                    <span className="text-right">
                      <div className="font-playfair text-2xl font-bold text-gold">{svc.stat}</div>
                      <div className="text-white/50 text-xs">{svc.statLabel}</div>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-playfair text-lg font-bold text-navy mb-2 group-hover:text-gold transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-textMid text-sm leading-relaxed">{svc.description}</p>
                    <div className="mt-4 text-gold text-sm font-semibold">Learn more →</div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ─── PRICING COMPARISON ────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Transparent Pricing</SectionLabel>
              <SectionTitle>Half the cost. Shorter commitment.</SectionTitle>
              <GoldRule className="mb-6" />
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <FadeIn>
              <div className="rounded-2xl border-2 border-gray-100 p-8 text-center">
                <p className="text-textFaint text-sm uppercase tracking-widest font-semibold mb-4">Industry Standard</p>
                <div className="font-playfair text-6xl font-bold text-textLight mb-2">50%</div>
                <p className="text-textMid mb-1">of recovered savings</p>
                <p className="text-textLight text-sm mb-6">5-year engagement period</p>
                <div className="text-sm text-textLight bg-gray-50 rounded-xl p-4">
                  What most forensic auditors charge — double our rate, twice the commitment.
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="rounded-2xl border-4 border-gold bg-navy p-8 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Best Value</div>
                <p className="text-gold/80 text-sm uppercase tracking-widest font-semibold mb-4">Foxlite Advantage</p>
                <div className="font-playfair text-6xl font-bold text-gold mb-2">25%</div>
                <p className="text-white mb-1">of recovered savings</p>
                <p className="text-white/60 text-sm mb-6">3-year engagement only</p>
                <div className="text-sm text-white/80 bg-white/10 rounded-xl p-4">
                  Half the industry rate. One year shorter. Only paid when we find your money.
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="text-center mt-10">
            <FadeIn delay={300}>
              <Link href="/pricing"
                className="inline-block border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold px-10 py-3.5 rounded-xl transition-colors">
                See Full Pricing Detail
              </Link>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ─── TESTIMONIAL / SOCIAL PROOF ────────────────────────────────────────── */}
      <section className="py-28 bg-cream relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
        <Section>
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="mb-12">
                <SectionLabel>Client Results</SectionLabel>
                <SectionTitle>What our clients say</SectionTitle>
                <GoldRule className="mb-0 mx-0" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="text-gold text-5xl font-playfair leading-none mb-4">"</div>
                  <blockquote className="font-playfair text-xl text-navy leading-relaxed mb-6">
                    Foxlite identified €47,000 in energy overcharges we had been paying
                    for three years. Their forensic approach is thorough and completely professional.
                  </blockquote>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-bold text-navy">Managing Director</p>
                    <p className="text-textMid text-sm">Dublin-based Property Management Company</p>
                    <div className="mt-2 text-gold text-sm font-semibold">Energy Audit · €47,000 recovered</div>
                  </div>
                </div>
                <div className="bg-navy rounded-2xl p-8">
                  <div className="text-gold text-5xl font-playfair leading-none mb-4">"</div>
                  <blockquote className="font-playfair text-xl text-white leading-relaxed mb-6">
                    We had no idea how much we were being overcharged. David and his team
                    handled everything — the bills, the suppliers, the negotiations.
                    Completely hassle-free.
                  </blockquote>
                  <div className="border-t border-white/10 pt-4">
                    <p className="font-bold text-white">Operations Director</p>
                    <p className="text-greyLight/60 text-sm">Multi-site Hospitality Group</p>
                    <div className="mt-2 text-gold text-sm font-semibold">Complete Audit · Multiple categories</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ─── CALCULATOR CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,164,78,0.12),transparent_60%)]" />
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <FadeIn>
              <SectionLabel className="text-gold">Free Savings Calculator</SectionLabel>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Find out exactly what you could recover
              </h2>
              <p className="text-xl text-greyLight/80 mb-6 leading-relaxed">
                Enter your annual bills for electricity, gas, waste, telecoms, insurance and more.
                Instant estimate. No login. No obligation.
              </p>
              <ul className="space-y-3 mb-8">
                {['No login required', 'Instant estimate', 'Based on real industry error rates', 'Works for single or multi-site businesses'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-greyLight">
                    <span className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-xs flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/calculator"
                className="inline-block bg-gold hover:bg-[#A68A3A] text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg shadow-gold/20">
                Try the Calculator →
              </Link>
            </FadeIn>
            <FadeIn delay={200}>
              {/* Live example panel */}
              <div className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-8">
                <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-6">Example — Hotel Group, 4 sites</p>
                <div className="space-y-4">
                  {[
                    { label: 'Annual electricity (4 sites)', val: '€96,000', sub: '4 × €24,000' },
                    { label: 'Est. annual overcharge (18%)', val: '€17,280', sub: 'Industry avg error rate', red: true },
                    { label: '6-year recovery potential', val: '€103,680', sub: 'Full retrospective period' },
                    { label: 'Foxlite fee (25%)', val: '€25,920', sub: 'Only paid on recovery' },
                    { label: 'You keep', val: '€77,760', sub: 'Net to your business', gold: true },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start pb-4 border-b border-white/8 last:border-0">
                      <div>
                        <p className={`text-sm font-medium ${row.gold ? 'text-gold' : 'text-white'}`}>{row.label}</p>
                        <p className="text-white/40 text-xs">{row.sub}</p>
                      </div>
                      <span className={`font-bold text-lg ${row.gold ? 'text-gold' : row.red ? 'text-red-400' : 'text-white'}`}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ─── TEAM CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <Section>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-cream rounded-2xl p-8 flex flex-col">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-5">
                  <span className="font-playfair text-2xl font-bold text-navy">DC</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-navy">David Clarke</h3>
                <p className="text-gold font-semibold text-sm mb-4">Managing Director</p>
                <p className="text-textMid text-sm leading-relaxed flex-1">
                  30+ years across hospitality, maintenance and property management.
                  David leads all forensic audit engagements.
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <a href="tel:+353860276700" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                    <span>📞</span> +353 86 027 6700
                  </a>
                  <a href="mailto:DavidC@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                    <span>✉️</span> DavidC@foxliteforensics.com
                  </a>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-cream rounded-2xl p-8 flex flex-col">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-5">
                  <span className="font-playfair text-2xl font-bold text-gold">DD</span>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-navy">Derek Dunphy</h3>
                <p className="text-gold font-semibold text-sm mb-4">Head of Sales Development</p>
                <p className="text-textMid text-sm leading-relaxed flex-1">
                  Extensive client relationship and business development background.
                  Derek manages onboarding and new client engagements.
                </p>
                <div className="mt-6 space-y-2 text-sm">
                  <a href="tel:+353897064225" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                    <span>📞</span> +353 89 706 4225
                  </a>
                  <a href="mailto:DerekD@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                    <span>✉️</span> DerekD@foxliteforensics.com
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <Section>
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn>
              <div className="font-playfair text-6xl text-gold/20 mb-4">"</div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to find out what<br />
                <span className="text-gold">you're owed?</span>
              </h2>
              <p className="text-xl text-greyLight/80 mb-10">
                Start with a free audit. No upfront costs. No risk.
                We only get paid when we recover money for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact"
                  className="bg-gold hover:bg-[#A68A3A] text-navy font-bold text-lg px-12 py-4 rounded-xl transition-colors shadow-lg shadow-gold/20">
                  Request Free Audit
                </Link>
                <a href="tel:+353860276700"
                  className="border-2 border-white/30 hover:border-gold text-white hover:text-gold font-bold text-lg px-12 py-4 rounded-xl transition-colors">
                  Call David: +353 86 027 6700
                </a>
              </div>
              <p className="text-greyLight/40 text-sm mt-8">
                VeriTech 10 Certified · EU AI Act Compliant · GDPR Compliant
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
