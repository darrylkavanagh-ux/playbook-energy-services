import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Team | Foxlite Forensic Services',
  description: 'Meet the forensic auditing experts behind Foxlite Forensic Services — David Clarke and Derek Dunphy. Combined decades of expertise in energy forensics, building management, and financial recovery.',
}

const team = [
  {
    name: 'David Clarke',
    title: 'Managing Director — Forensic Audit Lead',
    initials: 'DC',
    accentBg: 'bg-[#C4A44E]',
    accentText: 'text-[#0B1A2B]',
    bio: [
      'David Clarke is the founding director and principal forensic auditor at Foxlite Forensic Services, bringing over 20 years of expertise in energy systems, building management, and utility cost forensics.',
      'His background spans electrical engineering, facilities management, and commercial energy procurement — giving him a uniquely granular view of how utility billing errors arise, persist, and compound across multi-year periods.',
      'David has led forensic audits across healthcare, hospitality, retail, and manufacturing sectors, recovering millions of euro in overcharges from energy suppliers, waste contractors, banks, and insurance providers.',
      'He is recognised for his ability to combine technical engineering knowledge with the evidential rigour required for legal-grade dispute resolution and regulatory submissions.',
    ],
    credentials: [
      'Electrical Systems & Building Management',
      'Commercial Energy Procurement',
      'Forensic Audit Methodology',
      'Regulatory Dispute Resolution',
      'CRU (Commission for Regulation of Utilities) Framework',
    ],
    specialisms: ['Energy Forensics', 'CCL Exemption', 'Capacity Charge Disputes', 'Multi-Site Audits', 'Prosecution Bundle Preparation'],
    email: 'David@foxliteforensics.com',
    phone: null,
  },
  {
    name: 'Derek Dunphy',
    title: 'Director — Operations & Client Services',
    initials: 'DD',
    accentBg: 'bg-[#0B1A2B]',
    accentText: 'text-[#C4A44E]',
    bio: [
      'Derek Dunphy serves as Director of Operations and Client Services at Foxlite Forensic Services, overseeing client engagement, case management, and the delivery of audit findings from initial instruction through to recovery.',
      'With deep roots in quantity surveying, property management, and facilities contracting, Derek brings a comprehensive understanding of the cost structures across which overcharges most frequently arise — from service charges and maintenance contracts to waste collection and insurance premiums.',
      "Derek leads Foxlite's client relationships across the healthcare, property, and public sector verticals, and is responsible for the firm's results-only service model which aligns the firm's interests directly with client outcomes.",
      'He is the primary point of contact for institutional clients, law firms instructing forensic expert services, and regulatory bodies requiring independent verification of billing practices.',
    ],
    credentials: [
      'Quantity Surveying',
      'Property & Facilities Management',
      'Contract & Cost Management',
      'Client & Stakeholder Engagement',
      'Results-Based Service Delivery',
    ],
    specialisms: ['Waste & Utilities', 'Banking Charge Audits', 'Insurance Premium Recovery', 'Property Service Charges', 'Expert Witness Support'],
    email: 'derek.dunphy@foxliteforensics.com',
    phone: '+353 (89) 656 9838',
  },
]

const values = [
  {
    icon: '🔍',
    title: 'Forensic Rigour',
    description: 'Every finding is evidence-based, fully documented, and defensible to a regulatory or legal standard.',
  },
  {
    icon: '🤝',
    title: 'Results Alignment',
    description: 'We operate on a no-find, no-fee basis. Our interests are 100% aligned with yours.',
  },
  {
    icon: '⚖️',
    title: 'Independent Integrity',
    description: 'No supplier affiliations. No preferred partnerships. Wholly independent advice, always.',
  },
  {
    icon: '🏛️',
    title: 'Regulatory Authority',
    description: 'Our work is structured for CRU, Revenue, and court-grade submissions from day one.',
  },
]

export default function TeamPage() {
  return (
    <>
      {/* ── Hero Header ── */}
      <section className="pt-32 pb-20 bg-[#060D18] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060D18] via-[#0B1A2B] to-[#0F2240]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <SectionLabel>Our People</SectionLabel>
              <SectionTitle className="text-white">
                The forensic expertise behind Foxlite
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-lg text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Founded on decades of combined expertise in energy systems, building management,
                and commercial cost forensics — Foxlite is led by two directors who have built
                careers around finding what others miss.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Team Profiles ── */}
      <section className="py-24 bg-white">
        <Section>
          <div className="space-y-24">
            {team.map((member, idx) => (
              <FadeIn key={member.name} delay={idx * 150}>
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  {/* Profile Card */}
                  <div className="lg:col-span-4">
                    <div className="sticky top-28">
                      {/* Avatar */}
                      <div className="relative mb-6">
                        <div className={`w-32 h-32 rounded-full ${member.accentBg} flex items-center justify-center mx-auto lg:mx-0 shadow-[0_8px_30px_rgba(0,0,0,0.15)]`}>
                          <span className={`text-4xl font-playfair font-bold ${member.accentText}`}>{member.initials}</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 lg:right-auto lg:-left-2 w-8 h-8 bg-[#C4A44E] rounded-full opacity-40" />
                      </div>

                      <h2 className="font-playfair text-3xl font-bold text-[#0B1A2B] mb-1">{member.name}</h2>
                      <p className="text-[#C4A44E] font-medium text-sm uppercase tracking-wider mb-5 leading-snug">
                        {member.title}
                      </p>

                      {/* Contact details */}
                      <div className="space-y-2 mb-6 p-4 bg-[#F8F6F1] rounded-xl border border-[#E2E0DB]">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-2 text-sm text-[#C4A44E] hover:text-[#A68A3A] transition-colors font-medium"
                          >
                            <span className="text-[#0B1A2B]">✉</span>
                            <span>{member.email}</span>
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/\s|\(|\)|-/g, '')}`}
                            className="flex items-center gap-2 text-sm text-[#C4A44E] hover:text-[#A68A3A] transition-colors font-medium"
                          >
                            <span className="text-[#0B1A2B]">📞</span>
                            <span>{member.phone}</span>
                          </a>
                        )}
                      </div>

                      {/* Specialisms */}
                      <div className="mb-2">
                        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#8A8A8A] mb-3">
                          Specialisms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.specialisms.map((s) => (
                            <span
                              key={s}
                              className="text-xs bg-[#F8F6F1] text-[#0B1A2B] border border-[rgba(196,164,78,0.3)] px-3 py-1 rounded-full font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Content */}
                  <div className="lg:col-span-8">
                    <div className="space-y-5 text-[#3A3A3A] leading-relaxed text-[1rem] mb-8">
                      {member.bio.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Credentials */}
                    <div className="bg-[#F8F6F1] rounded-xl p-6 border border-[#E2E0DB]">
                      <h4 className="font-playfair text-lg font-bold text-[#0B1A2B] mb-4">
                        Credentials &amp; Expertise
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {member.credentials.map((cred) => (
                          <div key={cred} className="flex items-center gap-3">
                            <svg className="w-4 h-4 text-[#C4A44E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[#3A3A3A] text-sm font-medium">{cred}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {idx < team.length - 1 && (
                  <div className="mt-24 h-px bg-gradient-to-r from-transparent via-[#E2E0DB] to-transparent" />
                )}
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ── Values ── */}
      <section className="py-20 bg-[#F8F6F1]">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel className="text-[#A68A3A]">What We Stand For</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">Our professional values</SectionTitle>
              <GoldRule />
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 100}>
                <div className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow border border-[#E2E0DB]">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-playfair text-lg font-bold text-[#0B1A2B] mb-3">{v.title}</h3>
                  <p className="text-[#6A6A6A] text-sm leading-relaxed">{v.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-16 bg-[#0B1A2B]">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '€4.2M+', label: 'Recovered for clients' },
              { value: '200+',   label: 'Audits completed' },
              { value: '6 Years', label: 'Lookback period' },
              { value: '100%',   label: 'No-find, no-fee' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-playfair text-4xl font-bold text-[#C4A44E] mb-2">{stat.value}</div>
                <div className="text-[rgba(248,246,241,0.6)] text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-white">
        <Section>
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <SectionTitle className="text-[#0B1A2B]">Work with our team</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-[#3A3A3A] text-lg leading-relaxed mb-8">
                Ready to find out how much you may have been overcharged?
                Contact David or Derek directly for a confidential, no-obligation consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary inline-flex !text-sm !py-3 !px-8">
                  Book a Free Consultation
                </Link>
                <Link href="/calculator" className="btn-navy inline-flex !text-sm !py-3 !px-8">
                  Use Our Calculator
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </section>
    </>
  )
}
