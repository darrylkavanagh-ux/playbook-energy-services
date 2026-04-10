'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ──────────────────────────────────────────────────────────
   FadeIn — lightweight scroll-triggered animation
────────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay) } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
      }}
    >
      {children}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */
const services = [
  { title: 'Energy Audits',       icon: '⚡', href: '/services/energy',    stat: '73%', label: 'bills contain errors',     desc: 'Electricity, gas & renewables — line-by-line billing verification and overcharge recovery.' },
  { title: 'Waste Management',    icon: '♻️', href: '/services/waste',     stat: '62%', label: 'clients overcharged',      desc: 'Waste collection, disposal & recycling cost verification and contract review.' },
  { title: 'Banking & Finance',   icon: '💳', href: '/services/banking',   stat: '51%', label: 'fees disputed',            desc: 'Bank charges, loan fees & financial service overcharges identified and reclaimed.' },
  { title: 'Telecoms',            icon: '📡', href: '/services/telecoms',  stat: '58%', label: 'billing errors found',     desc: 'Mobile, broadband & landline billing discrepancies resolved with suppliers.' },
  { title: 'Fleet Management',    icon: '🚗', href: '/services/fleet',     stat: '48%', label: 'costs recoverable',        desc: 'Vehicle leasing, fuel, servicing & maintenance cost recovery and optimisation.' },
  { title: 'Insurance',           icon: '🛡️', href: '/services/insurance', stat: '45%', label: 'premiums excessive',      desc: 'Premium & claims cost verification ensuring you pay a fair, accurate price.' },
  { title: 'Property Management', icon: '🏢', href: '/services/property',  stat: '60%', label: 'charges incorrect',       desc: 'Service charges, maintenance & facilities management cost analysis.' },
  { title: 'Complete Audit',      icon: '📊', href: '/services/all',       stat: '100%', label: 'comprehensive cover',    desc: 'Full forensic audit across all eight business cost categories simultaneously.' },
]

const stats = [
  { value: '€2.4M+', label: 'Recovered for clients',    sub: 'Since 2019' },
  { value: '25%',    label: 'Our fee — recovered only', sub: 'Industry avg: 50%' },
  { value: '6 yrs',  label: 'Retrospective lookback',   sub: 'Maximum recovery' },
  { value: '€0',     label: 'Upfront cost to you',      sub: 'No win, no fee' },
]

const steps = [
  { num: '01', title: 'Free Consultation',  desc: 'One call, no obligation. We review your situation and agree the scope of audit together.' },
  { num: '02', title: 'Forensic Analysis',  desc: 'We collect your bills and contracts. Our team conducts a forensic line-by-line examination.' },
  { num: '03', title: 'Recovery Report',    desc: 'A detailed report identifying every overcharge found and the full recovery potential.' },
  { num: '04', title: 'We Recover It',      desc: 'We negotiate directly with suppliers. Your money comes back — up to six years retrospectively.' },
]

const testimonials = [
  {
    quote: 'Foxlite identified €47,000 in energy overcharges we had been quietly paying for three years. Their forensic approach is thorough and completely professional.',
    author: 'Managing Director',
    company: 'Dublin Property Management Group',
    result: '€47,000 recovered · Energy Audit',
    dark: false,
  },
  {
    quote: 'We had no idea how much we were being overcharged. David and his team handled everything — the bills, the suppliers, the negotiations. Completely hassle-free.',
    author: 'Operations Director',
    company: 'Multi-Site Hospitality Group',
    result: '€82,000 recovered · Complete Audit',
    dark: true,
  },
]

/* ──────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — Full-screen, deep navy with gold accents
      ═══════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #060E18 0%, #0A1628 45%, #0F2040 75%, #060E18 100%)' }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(184,150,90,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Ornamental vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none hidden lg:block"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(184,150,90,0.12) 30%, rgba(184,150,90,0.12) 70%, transparent)', transform: 'translateX(-50%)' }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20 w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

            {/* Left column */}
            <div>
              {/* Eyebrow */}
              <FadeIn delay={0}>
                <div className="flex items-center gap-3 mb-8">
                  <div style={{ width: 32, height: 1, background: 'var(--gold)', opacity: 0.6 }} />
                  <span style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    fontWeight: 600,
                  }}>
                    Established 2019 · Dublin, Ireland
                  </span>
                </div>
              </FadeIn>

              {/* Logotype */}
              <FadeIn delay={80}>
                <div
                  className="font-cormorant font-bold text-white leading-none mb-2"
                  style={{ fontSize: 'clamp(4rem,10vw,7rem)', letterSpacing: '-0.02em' }}
                >
                  FOX<span style={{ color: 'var(--gold)' }}>LITE</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 500,
                  marginBottom: '2.5rem',
                }}>
                  Forensic Services
                </div>
              </FadeIn>

              {/* Headline */}
              <FadeIn delay={200}>
                <h1
                  className="font-cormorant font-bold text-white leading-tight mb-6"
                  style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)' }}
                >
                  We find the overcharges.<br />
                  <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>You keep the money.</em>
                </h1>
              </FadeIn>

              {/* Sub */}
              <FadeIn delay={330}>
                <p style={{
                  fontSize: '1.0625rem',
                  lineHeight: 1.75,
                  color: 'rgba(255,255,255,0.6)',
                  maxWidth: '520px',
                  marginBottom: '2.5rem',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontWeight: 300,
                }}>
                  Ireland's independent forensic auditing firm. We recover historic
                  overcharges across energy, waste, telecoms, banking, insurance, fleet
                  and property — going back six years. <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>No win, no fee.</strong>
                </p>
              </FadeIn>

              {/* CTAs */}
              <FadeIn delay={460}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact" className="btn-primary text-center" style={{ letterSpacing: '0.06em' }}>
                    Request Free Audit →
                  </Link>
                  <Link href="/calculator" className="btn-outline text-center" style={{ letterSpacing: '0.06em' }}>
                    Try the Calculator
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right column — stats panel */}
            <FadeIn delay={300} className="mt-16 lg:mt-0">
              <div
                style={{
                  border: '1px solid rgba(184,150,90,0.2)',
                  padding: '2.5rem',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  fontWeight: 600,
                  marginBottom: '2rem',
                }}>
                  Why Foxlite
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s, i) => (
                    <FadeIn key={s.label} delay={400 + i * 80}>
                      <div style={{ borderBottom: '1px solid rgba(184,150,90,0.15)', paddingBottom: '1.25rem' }}>
                        <div
                          className="font-cormorant font-light text-white"
                          style={{ fontSize: 'clamp(2.2rem,5vw,3rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
                        >
                          <span style={{ color: 'var(--gold)' }}>{s.value}</span>
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.7)',
                          fontWeight: 500,
                          marginTop: '0.4rem',
                          lineHeight: 1.4,
                        }}>
                          {s.label}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontSize: '0.625rem',
                          color: 'rgba(255,255,255,0.3)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginTop: '0.2rem',
                        }}>
                          {s.sub}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #FAF8F3)' }}
        />
      </section>

      {/* ═══════════════════════════════════════════════
          INTRO STRIP — gold accent bar
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--gold)', padding: '1.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(1.1rem,2.5vw,1.4rem)',
              fontWeight: 400,
              color: 'var(--navy)',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              "The average Irish business is overcharged on at least three cost categories every year."
            </p>
            <Link
              href="/calculator"
              style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--navy)',
                border: '1px solid var(--navy)',
                padding: '0.625rem 1.5rem',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
            >
              Calculate Yours →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          THE PROBLEM — white bg, two-col layout
      ═══════════════════════════════════════════════ */}
      <section style={{ background: '#FDFCFA', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">

            {/* Left */}
            <FadeIn>
              <div className="section-label mb-4">The Problem</div>
              <div className="gold-rule-left mb-6" />
              <h2
                className="font-cormorant font-bold text-navy leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}
              >
                Irish businesses lose millions to billing errors. Silently. Every year.
              </h2>
              <div style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.8,
                color: 'var(--text-mid)',
                fontWeight: 300,
              }}>
                <p style={{ marginBottom: '1.25rem' }}>
                  Energy, waste, telecoms, banking, insurance and property charges all contain
                  errors — often compounding silently for years. Complex billing structures and
                  supplier complacency mean most businesses never check.
                </p>
                <p style={{ marginBottom: '1.25rem' }}>
                  The result: you are quietly paying 15–30% more than you should be,
                  across multiple cost lines, month after month.
                </p>
                <p style={{ fontWeight: 500, color: 'var(--navy)' }}>
                  Foxlite recovers what's yours — forensically, professionally,
                  and on a no-win, no-fee basis.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/calculator" className="btn-outline-dark">
                  Calculate Your Recovery →
                </Link>
              </div>
            </FadeIn>

            {/* Right — feature cards */}
            <FadeIn delay={200}>
              <div className="grid grid-cols-2 gap-4 mt-12 lg:mt-0">
                {[
                  { icon: '🔍', title: 'Forensic Precision',  desc: 'Every billing line is examined. Nothing is assumed. Errors that have gone undetected for years are surfaced.' },
                  { icon: '📅', title: '6-Year Lookback',      desc: 'Irish law allows recovery of overcharges going back six years — maximising every recovery opportunity.' },
                  { icon: '💰', title: 'Real Cash Returned',   desc: 'We negotiate directly with suppliers. Your money is returned to your account, not offset against future bills.' },
                  { icon: '✅', title: 'No Win, No Fee',        desc: 'We earn 25% of what we recover — half the industry average. If we find nothing, you pay nothing.' },
                ].map((card, i) => (
                  <FadeIn key={card.title} delay={i * 70}>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(184,150,90,0.15)',
                        borderTop: '3px solid var(--gold)',
                        padding: '1.5rem',
                        height: '100%',
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{card.icon}</div>
                      <h3
                        className="font-cormorant font-bold text-navy mb-2"
                        style={{ fontSize: '1.1rem' }}
                      >
                        {card.title}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontSize: '0.8125rem',
                        lineHeight: 1.6,
                        color: 'var(--text-light)',
                        fontWeight: 300,
                      }}>
                        {card.desc}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — dark navy, numbered steps
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <FadeIn>
            <div className="text-center mb-16">
              <div className="section-label mb-4">Our Process</div>
              <div className="gold-rule" style={{ maxWidth: 320, margin: '0 auto 1.5rem' }} />
              <h2
                className="font-cormorant font-bold text-white"
                style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}
              >
                How we recover your money
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(184,150,90,0.12)' }}>
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 100}>
                <div
                  style={{
                    background: 'var(--navy)',
                    padding: '2.5rem 2rem',
                    height: '100%',
                  }}
                >
                  <div
                    className="font-cormorant font-light"
                    style={{
                      fontSize: '4.5rem',
                      lineHeight: 1,
                      color: 'var(--gold)',
                      opacity: 0.25,
                      marginBottom: '1.5rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="font-cormorant font-bold text-white mb-3"
                    style={{ fontSize: '1.4rem' }}
                  >
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '0.8125rem',
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 300,
                  }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={400}>
            <div className="text-center mt-10">
              <Link href="/contact" className="btn-primary" style={{ display: 'inline-block' }}>
                Start Your Free Audit →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES — cream bg, 4-col grid
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <FadeIn>
            <div className="mb-14">
              <div className="section-label mb-4">Our Services</div>
              <div className="gold-rule-left mb-6" />
              <div className="lg:flex lg:items-end lg:justify-between">
                <h2
                  className="font-cormorant font-bold text-navy leading-tight mb-4 lg:mb-0"
                  style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', maxWidth: 480 }}
                >
                  Eight specialist audit categories
                </h2>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--text-light)',
                  maxWidth: 360,
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}>
                  Each category uses a dedicated forensic methodology developed over
                  years of live audit work across Ireland and the UK.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 50}>
                <Link href={svc.href} className="group" style={{ display: 'block', textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#ffffff',
                      borderTop: '3px solid var(--gold)',
                      borderLeft: '1px solid rgba(184,150,90,0.1)',
                      borderRight: '1px solid rgba(184,150,90,0.1)',
                      borderBottom: '1px solid rgba(184,150,90,0.1)',
                      padding: '1.75rem 1.5rem',
                      height: '100%',
                      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                    }}
                    className="hover:shadow-gold group-hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span style={{ fontSize: '1.75rem' }}>{svc.icon}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          className="font-cormorant font-bold"
                          style={{ fontSize: '1.75rem', color: 'var(--gold)', lineHeight: 1 }}
                        >
                          {svc.stat}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontSize: '0.6rem',
                          color: 'var(--text-faint)',
                          letterSpacing: '0.05em',
                          lineHeight: 1.4,
                          textTransform: 'uppercase',
                        }}>
                          {svc.label}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-cormorant font-bold text-navy mb-2"
                      style={{ fontSize: '1.2rem', transition: 'color 0.2s' }}
                    >
                      {svc.title}
                    </h3>

                    {/* Desc */}
                    <p style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '0.8rem',
                      lineHeight: 1.65,
                      color: 'var(--text-light)',
                      fontWeight: 300,
                      marginBottom: '1.25rem',
                    }}>
                      {svc.desc}
                    </p>

                    {/* CTA */}
                    <div style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}>
                      Learn more →
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PRICING COMPARISON — white bg
      ═══════════════════════════════════════════════ */}
      <section style={{ background: '#FDFCFA', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-4">Transparent Pricing</div>
              <div className="gold-rule" style={{ maxWidth: 200, margin: '0 auto 1.5rem' }} />
              <h2
                className="font-cormorant font-bold text-navy"
                style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}
              >
                Half the cost. Shorter commitment.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <FadeIn>
              <div
                style={{
                  border: '1px solid #e5e5e5',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  marginBottom: '1.5rem',
                }}>
                  Industry Standard
                </div>
                <div
                  className="font-cormorant font-light"
                  style={{ fontSize: '5rem', color: 'var(--text-light)', lineHeight: 1 }}
                >
                  50%
                </div>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  color: 'var(--text-mid)',
                  margin: '0.75rem 0 0.25rem',
                }}>
                  of recovered savings
                </p>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--text-faint)',
                  marginBottom: '1.5rem',
                }}>
                  5-year engagement period
                </p>
                <div style={{
                  background: 'var(--cream)',
                  padding: '1rem',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: 'var(--text-light)',
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}>
                  What most forensic auditors charge — double our rate, twice the commitment.
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div
                style={{
                  background: 'var(--navy)',
                  border: '2px solid var(--gold)',
                  padding: '2.5rem 2rem',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '0.3rem 0.75rem',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                }}>
                  Best Value
                </div>
                <div style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,150,90,0.7)',
                  marginBottom: '1.5rem',
                }}>
                  Foxlite Advantage
                </div>
                <div
                  className="font-cormorant font-light"
                  style={{ fontSize: '5rem', color: 'var(--gold)', lineHeight: 1 }}
                >
                  25%
                </div>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.85)',
                  margin: '0.75rem 0 0.25rem',
                }}>
                  of recovered savings
                </p>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '1.5rem',
                }}>
                  3-year engagement only
                </p>
                <div style={{
                  background: 'rgba(255,255,255,0.07)',
                  padding: '1rem',
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}>
                  Half the industry rate. One year shorter. Paid only when we recover your money.
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={300}>
            <div className="text-center mt-10">
              <Link href="/pricing" className="btn-outline-dark" style={{ display: 'inline-block' }}>
                View Full Pricing Details
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS — cream, editorial layout
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--cream)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <FadeIn>
            <div className="mb-14">
              <div className="section-label mb-4">Client Results</div>
              <div className="gold-rule-left mb-6" />
              <h2
                className="font-cormorant font-bold text-navy"
                style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', maxWidth: 480 }}
              >
                What our clients say
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 120}>
                <div
                  style={{
                    background: t.dark ? 'var(--navy)' : '#ffffff',
                    borderLeft: '3px solid var(--gold)',
                    padding: '2.5rem 2rem',
                    height: '100%',
                  }}
                >
                  <div
                    className="font-cormorant"
                    style={{
                      fontSize: '4rem',
                      lineHeight: 0.8,
                      color: 'var(--gold)',
                      marginBottom: '1.25rem',
                      opacity: 0.6,
                    }}
                  >
                    "
                  </div>
                  <blockquote
                    className="font-cormorant"
                    style={{
                      fontSize: '1.3rem',
                      fontStyle: 'italic',
                      lineHeight: 1.6,
                      color: t.dark ? '#ffffff' : 'var(--navy)',
                      marginBottom: '1.75rem',
                      fontWeight: 400,
                    }}
                  >
                    {t.quote}
                  </blockquote>
                  <div style={{ borderTop: `1px solid ${t.dark ? 'rgba(255,255,255,0.1)' : 'rgba(184,150,90,0.2)'}`, paddingTop: '1.25rem' }}>
                    <p style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: t.dark ? '#ffffff' : 'var(--navy)',
                    }}>
                      {t.author}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '0.8rem',
                      color: t.dark ? 'rgba(255,255,255,0.5)' : 'var(--text-light)',
                      fontWeight: 300,
                      marginTop: '0.2rem',
                    }}>
                      {t.company}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '0.75rem',
                      color: 'var(--gold)',
                      fontWeight: 600,
                      marginTop: '0.5rem',
                      letterSpacing: '0.03em',
                    }}>
                      {t.result}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <div className="mt-10">
              <Link href="/case-studies" className="btn-outline-dark" style={{ display: 'inline-block' }}>
                Read Full Case Studies
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CALCULATOR CTA — navy, two-col
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">

            <FadeIn>
              <div className="section-label mb-4">Free Savings Calculator</div>
              <div className="gold-rule-left mb-6" />
              <h2
                className="font-cormorant font-bold text-white leading-tight mb-5"
                style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}
              >
                Find out exactly what you could recover
              </h2>
              <p style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 300,
                marginBottom: '2rem',
              }}>
                Enter your annual spend on electricity, gas, waste, telecoms, insurance and more.
                Receive an instant estimate based on real industry error rates. No login, no obligation.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['No login required — instant estimate', 'Based on real industry overcharge rates', 'Works for single or multi-site businesses', '8 cost categories covered'].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: 20, height: 20,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      color: 'var(--navy)',
                      fontWeight: 700,
                    }}>✓</span>
                    <span style={{
                      fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                      fontSize: '0.875rem',
                      color: 'rgba(255,255,255,0.65)',
                      fontWeight: 300,
                    }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/calculator" className="btn-primary" style={{ display: 'inline-block' }}>
                Try the Calculator →
              </Link>
            </FadeIn>

            {/* Example calculation panel */}
            <FadeIn delay={200}>
              <div
                style={{
                  border: '1px solid rgba(184,150,90,0.2)',
                  padding: '2rem',
                  marginTop: '2rem',
                  background: 'rgba(255,255,255,0.03)',
                }}
                className="lg:mt-0"
              >
                <div style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: '1.75rem',
                  opacity: 0.8,
                }}>
                  Example — Hotel Group, 4 Sites
                </div>
                <div>
                  {[
                    { label: 'Annual electricity (4 sites)', value: '€96,000',  note: '4 × €24,000', accent: false, highlight: false },
                    { label: 'Estimated annual overcharge',  value: '€17,280',  note: 'At 18% industry avg.', accent: false, highlight: false },
                    { label: '6-year recovery potential',    value: '€103,680', note: 'Full retrospective period', accent: false, highlight: false },
                    { label: 'Foxlite fee (25%)',            value: '€25,920',  note: 'Paid only on recovery', accent: false, highlight: false },
                    { label: 'You keep',                     value: '€77,760',  note: 'Net to your business', accent: true, highlight: true },
                  ].map((row, i) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                        borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        background: row.highlight ? 'rgba(184,150,90,0.07)' : 'transparent',
                        padding: row.highlight ? '0.75rem 0.75rem' : undefined,
                      }}
                    >
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: row.accent ? 600 : 400,
                          color: row.accent ? 'var(--gold)' : 'rgba(255,255,255,0.75)',
                        }}>
                          {row.label}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                          fontSize: '0.65rem',
                          color: 'rgba(255,255,255,0.3)',
                          marginTop: '0.15rem',
                          letterSpacing: '0.04em',
                        }}>
                          {row.note}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
                        fontSize: row.accent ? '1.5rem' : '1.1rem',
                        fontWeight: row.accent ? 600 : 400,
                        color: row.accent ? 'var(--gold)' : 'rgba(255,255,255,0.85)',
                        lineHeight: 1,
                        paddingTop: '0.1rem',
                      }}>
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TEAM — white, editorial
      ═══════════════════════════════════════════════ */}
      <section style={{ background: '#FDFCFA', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-4">The Principals</div>
              <div className="gold-rule" style={{ maxWidth: 160, margin: '0 auto 1.5rem' }} />
              <h2
                className="font-cormorant font-bold text-navy"
                style={{ fontSize: 'clamp(2rem,4vw,2.8rem)' }}
              >
                The team behind every audit
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                initials: 'DC',
                name: 'David Clarke',
                role: 'Managing Director',
                bio: '30+ years across hospitality, maintenance and property management in Ireland and the UK. David leads all forensic audit engagements and supplier recovery negotiations personally.',
                phone: '+353 86 027 6700',
                tel: '+353860276700',
                email: 'DavidC@foxliteforensics.com',
                dark: false,
              },
              {
                initials: 'DD',
                name: 'Derek Dunphy',
                role: 'Head of Sales Development',
                bio: 'Extensive client relationship and business development background across multiple sectors. Derek manages all new business development and ongoing client relationships at Foxlite.',
                phone: '+353 89 706 4225',
                tel: '+353897064225',
                email: 'DerekD@foxliteforensics.com',
                dark: true,
              },
            ].map((person, i) => (
              <FadeIn key={person.name} delay={i * 150}>
                <div
                  style={{
                    background: person.dark ? 'var(--navy)' : '#ffffff',
                    border: `1px solid ${person.dark ? 'transparent' : 'rgba(184,150,90,0.15)'}`,
                    borderTop: '3px solid var(--gold)',
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: 56, height: 56,
                      borderRadius: '50%',
                      background: person.dark ? 'var(--gold)' : 'var(--navy)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: person.dark ? 'var(--navy)' : 'var(--gold)',
                      }}>
                        {person.initials}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-cormorant font-bold"
                        style={{ fontSize: '1.4rem', color: person.dark ? '#ffffff' : 'var(--navy)', lineHeight: 1.2 }}
                      >
                        {person.name}
                      </h3>
                      <p style={{
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        marginTop: '0.2rem',
                      }}>
                        {person.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: person.dark ? 'rgba(255,255,255,0.6)' : 'var(--text-mid)',
                    fontWeight: 300,
                    flex: 1,
                    marginBottom: '1.5rem',
                  }}>
                    {person.bio}
                  </p>

                  {/* Contact */}
                  <div style={{
                    borderTop: `1px solid ${person.dark ? 'rgba(255,255,255,0.1)' : 'rgba(184,150,90,0.15)'}`,
                    paddingTop: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    <a
                      href={`tel:${person.tel}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: person.dark ? 'rgba(255,255,255,0.8)' : 'var(--navy)',
                        transition: 'color 0.2s',
                      }}
                    >
                      <span>📞</span> {person.phone}
                    </a>
                    <a
                      href={`mailto:${person.email}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: person.dark ? 'rgba(255,255,255,0.8)' : 'var(--navy)',
                        transition: 'color 0.2s',
                      }}
                    >
                      <span>✉️</span> {person.email}
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <div className="text-center mt-12">
              <Link href="/about" className="btn-outline-dark" style={{ display: 'inline-block' }}>
                Full Team Profiles →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA — deep navy
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--navy)', padding: '6rem 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <div className="section-label mb-6">Ready to Begin?</div>
              <div className="gold-rule" style={{ maxWidth: 160, margin: '0 auto 2rem' }} />
              <h2
                className="font-cormorant font-bold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)' }}
              >
                Ready to find out<br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>what you're owed?</em>
              </h2>
              <p style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 300,
                marginBottom: '2.5rem',
              }}>
                Start with a free audit. No upfront costs. No risk. We only get paid when
                we successfully recover money for your business.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                  <Link href="/contact" className="btn-primary" style={{ display: 'inline-block' }}>
                    Request Free Audit
                  </Link>
                  <a href="tel:+353860276700" className="btn-outline" style={{ display: 'inline-block' }}>
                    Call +353 86 027 6700
                  </a>
                </div>
                <p style={{
                  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '1rem',
                }}>
                  VeriTech 10 Certified · EU AI Act Compliant · GDPR Compliant
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
