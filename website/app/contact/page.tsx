'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'

const services = [
  'Energy Audits',
  'Waste Management',
  'Banking & Finance',
  'Telecoms',
  'Fleet Management',
  'Insurance',
  'Property Management',
  'Complete Audit'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Contact Us</SectionLabel>
              <SectionTitle className="text-white">
                Ready to start your forensic audit?
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Get in touch for a free consultation. We'll assess your business costs 
                and identify potential savings opportunities.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Company Details */}
            <FadeIn>
              <div>
                <h2 className="font-playfair text-3xl font-bold text-navy mb-6">
                  Get In Touch
                </h2>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Email</h3>
                    <p className="text-textMid">info@foxlite.ie</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Managing Director</h3>
                    <p className="text-textMid">David Clarke</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Location</h3>
                    <p className="text-textMid">Dublin, Ireland</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Established</h3>
                    <p className="text-textMid">2019</p>
                  </div>
                </div>
                
                <div className="bg-cream rounded-lg p-6">
                  <h3 className="font-playfair text-xl font-bold text-navy mb-4">
                    What happens next?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-navy">1</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Initial Consultation</div>
                        <div className="text-sm text-textMid">Free 30-minute discussion about your business costs</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-navy">2</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Audit Proposal</div>
                        <div className="text-sm text-textMid">Detailed proposal with scope and potential savings estimate</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-navy">3</span>
                      </div>
                      <div>
                        <div className="font-semibold text-navy">Forensic Audit</div>
                        <div className="text-sm text-textMid">Comprehensive analysis of your business costs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={200}>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-6">
                  Request Free Consultation
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-navy mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-navy mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-greyLight rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                      placeholder="Tell us about your business and what you'd like to discuss..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full text-lg py-3">
                    Send Message
                  </Button>
                  
                  <p className="text-sm text-textLight text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="max-w-4xl mx-auto">
                <SectionLabel>Our Certifications</SectionLabel>
                <SectionTitle>
                  Trusted, certified, and compliant
                </SectionTitle>
                <GoldRule className="mb-8" />
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gold rounded-lg p-6">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                      VeriTech 10 Certified
                    </h3>
                    <p className="text-navy">
                      Ensuring the highest standards of forensic auditing methodology, 
                      data verification, and client confidentiality.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-greyLight">
                    <h3 className="font-playfair text-xl font-bold text-navy mb-3">
                      EU AI Act Compliant
                    </h3>
                    <p className="text-textMid">
                      Our processes and data handling procedures are fully compliant 
                      with EU AI Act requirements for ethical technology use.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}