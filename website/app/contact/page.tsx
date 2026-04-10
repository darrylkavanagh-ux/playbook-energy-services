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
  'Complete Audit',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', service: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production connect to a form API (e.g. Formspree, Resend, etc.)
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,164,78,0.1),transparent_60%)]" />
        <Section>
          <div className="text-center relative z-10">
            <FadeIn>
              <SectionLabel className="text-gold">Contact Us</SectionLabel>
              <SectionTitle className="text-white">
                Let's find out what you're owed
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight/80 max-w-3xl mx-auto leading-relaxed">
                Free consultation. No upfront cost. No obligation.
                Just tell us a little about your business and we'll take it from there.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Main content */}
      <section className="py-24 bg-cream">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Left — contact info */}
            <FadeIn>
              <div>
                <h2 className="font-playfair text-3xl font-bold text-navy mb-8">Speak directly with the team</h2>

                <div className="space-y-6 mb-10">
                  {/* David */}
                  <div className="bg-white rounded-2xl p-6 flex items-start gap-5 shadow-sm border border-gray-100">
                    <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shrink-0">
                      <span className="font-playfair text-xl font-bold text-navy">DC</span>
                    </div>
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-navy">David Clarke</h3>
                      <p className="text-gold text-sm font-semibold mb-2">Managing Director</p>
                      <a href="tel:+353860276700" className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium mb-1">
                        📞 +353 86 027 6700
                      </a>
                      <a href="mailto:DavidC@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium">
                        ✉️ DavidC@foxliteforensics.com
                      </a>
                    </div>
                  </div>

                  {/* Derek */}
                  <div className="bg-white rounded-2xl p-6 flex items-start gap-5 shadow-sm border border-gray-100">
                    <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center shrink-0">
                      <span className="font-playfair text-xl font-bold text-gold">DD</span>
                    </div>
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-navy">Derek Dunphy</h3>
                      <p className="text-gold text-sm font-semibold mb-2">Head of Sales Development</p>
                      <a href="tel:+353897064225" className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium mb-1">
                        📞 +353 89 706 4225
                      </a>
                      <a href="mailto:DerekD@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors text-sm font-medium">
                        ✉️ DerekD@foxliteforensics.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-navy rounded-2xl p-7 text-white">
                  <h3 className="font-playfair text-xl font-bold mb-5">What happens next?</h3>
                  <div className="space-y-4">
                    {[
                      { n: '1', title: 'Free Consultation', desc: '30-minute call to understand your business costs and discuss potential savings.' },
                      { n: '2', title: 'Audit Proposal', desc: 'We prepare a clear scope, timeline and estimate — at no cost.' },
                      { n: '3', title: 'Forensic Audit', desc: 'We analyse every bill and contract in detail, then present our findings.' },
                      { n: '4', title: 'Recovery', desc: 'We handle all supplier negotiations and recover your money — going back six years.' },
                    ].map((step) => (
                      <div key={step.n} className="flex gap-4">
                        <div className="w-7 h-7 bg-gold rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-navy font-bold text-xs">{step.n}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{step.title}</p>
                          <p className="text-greyLight/60 text-sm">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right — form */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-6">✅</div>
                    <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Message received!</h3>
                    <p className="text-textMid mb-6">
                      Thank you for getting in touch. David or Derek will contact you within one business day.
                    </p>
                    <Link href="/"
                      className="inline-block bg-gold hover:bg-[#A68A3A] text-navy font-bold px-8 py-3 rounded-xl transition-colors">
                      Back to Home
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="font-playfair text-2xl font-bold text-navy mb-6">Request Free Consultation</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-navy mb-1.5">Full Name *</label>
                          <input type="text" name="name" required value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy transition-colors"
                            placeholder="Your name" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-navy mb-1.5">Company *</label>
                          <input type="text" name="company" required value={formData.company} onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy transition-colors"
                            placeholder="Company name" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-navy mb-1.5">Email *</label>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy transition-colors"
                            placeholder="your@email.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-navy mb-1.5">Phone</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy transition-colors"
                            placeholder="+353 ..." />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-1.5">Area of Interest</label>
                        <select name="service" value={formData.service} onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy transition-colors bg-white">
                          <option value="">Select a service (optional)</option>
                          {services.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-1.5">Message</label>
                        <textarea name="message" rows={4} value={formData.message} onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy resize-none transition-colors"
                          placeholder="Tell us about your business — size, sectors, main cost concerns..." />
                      </div>
                      <button type="submit"
                        className="w-full bg-navy hover:bg-[#112240] text-white font-bold text-lg py-4 rounded-xl transition-colors">
                        Send Message →
                      </button>
                      <p className="text-xs text-textFaint text-center">
                        Your information is kept strictly confidential in line with our GDPR obligations.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Trust bar */}
      <section className="py-14 bg-navy">
        <Section>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
            <div className="text-white">
              <span className="text-gold font-semibold">✓ VeriTech 10 Certified</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20" />
            <div className="text-white">
              <span className="text-gold font-semibold">✓ EU AI Act Compliant</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20" />
            <div className="text-white">
              <span className="text-gold font-semibold">✓ GDPR Compliant</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20" />
            <div className="text-white">
              <span className="text-gold font-semibold">✓ No Win, No Fee</span>
            </div>
          </div>
        </Section>
      </section>
    </>
  )
}
