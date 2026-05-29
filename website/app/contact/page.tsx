'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

const services = [
  'Energy Audits',
  'Waste Management',
  'Banking & Finance',
  'Telecoms',
  'Fleet Management',
  'Insurance',
  'Property Management',
  'Complete Audit (All Categories)'
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[Foxlite Enquiry] ${formData.service || 'General'} — ${formData.name} (${formData.company})`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nService: ${formData.service || 'Not specified'}\n\nMessage:\n${formData.message || 'No message'}`
    )
    window.location.href = `mailto:David@foxliteforensics.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <>
      {/* ── Hero Header ── */}
      <section className="pt-32 pb-20 bg-[#060D18] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060D18] via-[#0B1A2B] to-[#0F2240]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <SectionLabel>Contact Us</SectionLabel>
              <SectionTitle className="text-white">Start your forensic audit today</SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-lg text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Book a free, no-obligation consultation. We&apos;ll assess your business costs
                and identify potential savings opportunities — at no charge.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Main Content ── */}
      <section className="py-20 bg-[#F8F6F1]">
        <Section>
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left — Company Details */}
            <FadeIn>
              <div>
                <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-6">Get In Touch</h2>

                <div className="space-y-5 mb-8">

                  {/* General Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#C4A44E] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <span className="text-[#0B1A2B] text-lg">✉</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1A2B] text-sm uppercase tracking-wide mb-0.5">General Enquiries</div>
                      <a href="mailto:David@foxliteforensics.com" className="text-[#3A3A3A] hover:text-[#C4A44E] transition-colors text-[0.92rem]">
                        David@foxliteforensics.com
                      </a>
                    </div>
                  </div>

                  {/* David Clarke */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#0B1A2B] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <span className="text-[#C4A44E] text-sm font-bold font-playfair">DC</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1A2B] text-[0.92rem]">David Clarke</div>
                      <div className="text-[#6A6A6A] text-sm mb-1">Managing Director — Forensic Audit Lead</div>
                      <a href="mailto:David@foxliteforensics.com" className="text-[#C4A44E] text-sm hover:text-[#A68A3A] transition-colors font-medium">
                        David@foxliteforensics.com
                      </a>
                    </div>
                  </div>

                  {/* Derek Dunphy */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#0B1A2B] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <span className="text-[#C4A44E] text-sm font-bold font-playfair">DD</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1A2B] text-[0.92rem]">Derek Dunphy</div>
                      <div className="text-[#6A6A6A] text-sm mb-1">Director — Operations & Client Services</div>
                      <a href="tel:+353896569838" className="text-[#C4A44E] text-sm hover:text-[#A68A3A] transition-colors font-medium block">
                        +353 (89) 656 9838
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-[#C4A44E] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <span className="text-[#0B1A2B] text-lg">📍</span>
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1A2B] text-sm uppercase tracking-wide mb-0.5">Location</div>
                      <div className="text-[#3A3A3A] text-[0.92rem]">Dublin, Ireland</div>
                      <div className="text-[#6A6A6A] text-sm">Established 2019</div>
                    </div>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-white rounded-2xl border border-[#E2E0DB] p-6 shadow-sm mb-6">
                  <h3 className="font-playfair text-xl font-bold text-[#0B1A2B] mb-5">What happens next?</h3>
                  <div className="space-y-4">
                    {[
                      { n: '1', title: 'Initial Consultation', desc: 'Free 30-minute call — we review your business costs and outline where overcharges are most likely.' },
                      { n: '2', title: 'Audit Proposal', desc: 'Detailed proposal with audit scope, estimated timeline, and indicative savings potential.' },
                      { n: '3', title: 'Forensic Audit', desc: 'Full forensic analysis of billing records, contracts, and tariffs across all in-scope categories.' },
                      { n: '4', title: 'Recovery & Reporting', desc: 'We negotiate recoveries on your behalf. Full audit report provided. Our fee: 25% of recovered amounts only.' },
                    ].map(step => (
                      <div key={step.n} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-[#C4A44E] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#0B1A2B]">{step.n}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-[#0B1A2B] text-sm">{step.title}</div>
                          <div className="text-[#6A6A6A] text-sm leading-relaxed">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cert badges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#C4A44E] rounded-xl p-4 text-center">
                    <div className="font-playfair font-bold text-[#0B1A2B] text-sm">VeriTech 10</div>
                    <div className="text-[#0B1A2B]/70 text-xs">Certified</div>
                  </div>
                  <div className="bg-[#0B1A2B] rounded-xl p-4 text-center">
                    <div className="font-playfair font-bold text-[#C4A44E] text-sm">EU AI Act</div>
                    <div className="text-[rgba(248,246,241,0.6)] text-xs">Compliant</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right — Contact Form */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(11,26,43,0.12)] border border-[#E2E0DB] p-8">
                {!submitted ? (
                  <>
                    <h3 className="font-playfair text-2xl font-bold text-[#0B1A2B] mb-2">
                      Request Free Consultation
                    </h3>
                    <p className="text-[#6A6A6A] text-sm mb-6">
                      Fill in your details and we&apos;ll be in touch within one business day.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Full Name *</label>
                          <input
                            type="text" id="name" name="name" required
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition text-[#1A1A1A]"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Company Name *</label>
                          <input
                            type="text" id="company" name="company" required
                            value={formData.company} onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition text-[#1A1A1A]"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Email Address *</label>
                          <input
                            type="email" id="email" name="email" required
                            value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition text-[#1A1A1A]"
                            placeholder="you@company.ie"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Phone Number</label>
                          <input
                            type="tel" id="phone" name="phone"
                            value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition text-[#1A1A1A]"
                            placeholder="e.g. +353 1 234 5678"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="service" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Service Interest</label>
                        <select
                          id="service" name="service"
                          value={formData.service} onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition bg-white text-[#1A1A1A]"
                        >
                          <option value="">Select a service</option>
                          {services.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-[0.12em] text-[#0B1A2B] mb-2">Message</label>
                        <textarea
                          id="message" name="message" rows={4}
                          value={formData.message} onChange={handleChange}
                          className="w-full px-4 py-3 border border-[#E2E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4A44E] focus:border-[#C4A44E] transition resize-none text-[#1A1A1A]"
                          placeholder="Tell us about your business and what you'd like to discuss..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full justify-center !py-4 !text-base"
                      >
                        Send Enquiry →
                      </button>

                      <p className="text-xs text-[#8A8A8A] text-center">
                        By submitting this form, you agree to our{' '}
                        <Link href="/privacy" className="text-[#C4A44E] underline">Privacy Policy</Link>.
                        No upfront costs — results-only engagement.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-[#C4A44E] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#0B1A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-[#0B1A2B] mb-4">
                      Enquiry Sent
                    </h3>
                    <p className="text-[#3A3A3A] text-base mb-6 max-w-sm mx-auto leading-relaxed">
                      Your email client has opened with your enquiry pre-filled.
                      Simply send the email to complete your enquiry.
                    </p>
                    <p className="text-[#3A3A3A] mb-8 text-sm">
                      Or email us directly at{' '}
                      <a href="mailto:David@foxliteforensics.com" className="text-[#C4A44E] font-semibold hover:text-[#A68A3A]">
                        David@foxliteforensics.com
                      </a>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/calculator" className="btn-primary !text-sm !py-3 !px-6">
                        Savings Calculator
                      </Link>
                      <Link href="/case-studies" className="btn-ghost !text-sm !py-3 !px-6">
                        View Case Studies
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Calculator CTA ── */}
      <section className="py-16 bg-[#0B1A2B]">
        <Section>
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-5xl mb-4">🧮</div>
              <h2 className="font-playfair text-3xl font-bold text-white mb-4">
                Want an estimate before you call?
              </h2>
              <p className="text-[rgba(248,246,241,0.65)] text-lg mb-8 leading-relaxed">
                Use our Forensic Savings Calculator to get an indicative recovery estimate
                based on your sector and monthly business costs — takes under 2 minutes.
              </p>
              <Link href="/calculator" className="btn-primary inline-flex !text-base !py-4 !px-10">
                Open Savings Calculator
              </Link>
            </div>
          </FadeIn>
        </Section>
      </section>
    </>
  )
}
