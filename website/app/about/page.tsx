import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'About Us | Foxlite Forensic Services',
  description: 'Founded in 2019, Foxlite Forensic Services is Dublin\'s independent forensic auditing firm. We recover overcharged costs for Irish businesses across energy, waste, banking, telecoms, and more.',
}

const milestones = [
  { year: '2019', event: 'Foxlite founded by David Clarke & Derek Dunphy in Dublin' },
  { year: '2020', event: 'First major multi-site energy audit — €94,000 recovered for retail client' },
  { year: '2021', event: 'VeriTech 10 certification achieved; healthcare vertical launched' },
  { year: '2022', event: 'Public sector mandate awarded; 6-year lookback capability established' },
  { year: '2023', event: '€2M cumulative recovery milestone reached across 100+ audits' },
  { year: '2024', event: 'EU AI Act compliance framework integrated into audit platform' },
  { year: '2025', event: '€4.2M total recovered; 200+ forensic audits completed' },
]

const certifications = [
  {
    title: 'VeriTech 10 Certified',
    subtitle: 'Forensic Audit Standard',
    description: 'Our methodology, data handling, and reporting standards are independently verified to the VeriTech 10 framework — the highest independent certification for forensic cost auditing in Ireland.',
    bg: 'bg-[#C4A44E]',
    textColor: 'text-[#0B1A2B]',
  },
  {
    title: 'EU AI Act Compliant',
    subtitle: 'Regulatory Framework',
    description: 'Foxlite\'s analytical platform and data processing methodologies are fully compliant with EU AI Act requirements, ensuring ethical, transparent, and auditable use of technology.',
    bg: 'bg-[#0B1A2B]',
    textColor: 'text-white',
  },
  {
    title: 'GDPR Compliant',
    subtitle: 'Data Protection',
    description: 'All client data, billing records, and audit documentation is handled under strict GDPR protocols. Data is processed securely, never shared with third parties, and destroyed post-engagement.',
    bg: 'bg-[#0F2240]',
    textColor: 'text-white',
  },
]

const differentiators = [
  {
    icon: '🔬',
    title: 'Forensic — not standard — methodology',
    desc: 'We go beyond accounting. Our Forensic Bill Matrix cross-references every billing line against contracted rates, live market tariffs, and regulatory schedules. Standard accountancy misses what we find.',
  },
  {
    icon: '⚡',
    title: 'Deep sector knowledge',
    desc: 'Our directors bring engineering, quantity surveying, and facilities management expertise. We understand how bills are constructed — and how overcharges hide within them.',
  },
  {
    icon: '⚖️',
    title: 'Legal-grade documentation',
    desc: 'Every finding is documented to the standard required for regulatory submission, supplier dispute resolution, and if necessary, legal proceedings.',
  },
  {
    icon: '🎯',
    title: 'Results-only alignment',
    desc: 'Our 25% fee — half the industry standard — is charged only on recovered amounts. If we find nothing, you pay nothing. Our interests are 100% aligned with yours.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="pt-32 pb-24 bg-[#0B1A2B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(196,164,78,0.07),transparent)]" />
        <Section className="relative z-10">
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-[#C4A44E]">About Foxlite</SectionLabel>
              <SectionTitle className="text-white">
                Ireland's independent forensic{' '}
                <span className="text-gradient-gold">cost auditing firm</span>
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-[rgba(248,246,241,0.65)] max-w-3xl mx-auto leading-relaxed">
                Founded in 2019 by David Clarke and Derek Dunphy, Foxlite Forensic Services exists
                for one reason: to recover money that Irish businesses have been overcharged — and
                to ensure it never happens again.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Mission + Image ── */}
      <section className="py-24 bg-[#F8F6F1]">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <SectionLabel className="text-[#A68A3A]">Our Mission</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">
                Find what standard accountancy misses
              </SectionTitle>
              <div className="gold-rule-left mb-8" />
              <p className="text-[1rem] text-[#5A5A5A] leading-relaxed mb-6">
                Irish businesses lose millions every year to hidden billing errors, incorrect tariffs,
                and systematic supplier overcharges. These aren't occasional mistakes — they're
                structural features of complex, opaque billing environments that persist for years
                without specialist forensic intervention.
              </p>
              <p className="text-[1rem] text-[#5A5A5A] leading-relaxed mb-8">
                Foxlite was built to close that gap. We combine deep engineering and cost management
                expertise with proprietary forensic methodology to identify overcharges invisible to
                the naked eye — and then recover them.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '2019', l: 'Year founded' },
                  { v: '€4.2M+', l: 'Recovered to date' },
                  { v: '200+', l: 'Audits completed' },
                  { v: '25%', l: 'Fee on recovery only' },
                ].map(item => (
                  <div key={item.l} className="bg-white rounded-xl p-4 border border-[#E2E0DB] shadow-sm">
                    <div className="font-playfair text-2xl font-bold text-[#0B1A2B] mb-1">{item.v}</div>
                    <div className="text-[0.75rem] font-semibold uppercase tracking-wide text-[#8A8A8A]">{item.l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={150}>
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(11,26,43,0.2)]">
                <Image
                  src="/images/forensic-documents.jpg"
                  alt="Foxlite forensic audit process"
                  width={640}
                  height={420}
                  className="w-full object-cover"
                  quality={85}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(196,164,78,0.25)]" />
                <div className="absolute bottom-4 left-4 bg-[#0B1A2B]/90 backdrop-blur-sm border border-[rgba(196,164,78,0.35)] rounded-xl px-5 py-3">
                  <div className="font-playfair text-xl font-bold text-[#C4A44E]">15–30%</div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-wider text-[rgba(248,246,241,0.7)]">Average overcharge rate</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Why Foxlite is Different ── */}
      <section className="py-24 bg-[#060D18]">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>What Sets Us Apart</SectionLabel>
              <SectionTitle className="text-white">
                The Foxlite difference
              </SectionTitle>
              <GoldRule className="mb-4" />
            </FadeIn>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {differentiators.map((d, i) => (
              <FadeIn key={d.title} delay={i * 80}>
                <div className="bg-[#0D1F35] border border-[rgba(196,164,78,0.12)] rounded-2xl p-7 hover:border-[rgba(196,164,78,0.3)] transition-colors">
                  <div className="text-3xl mb-4">{d.icon}</div>
                  <h3 className="font-playfair text-lg font-bold text-white mb-3">{d.title}</h3>
                  <p className="text-[0.85rem] text-[rgba(248,246,241,0.55)] leading-relaxed">{d.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ── Team Intro ── */}
      <section className="py-24 bg-[#F8F6F1]">
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(11,26,43,0.18)]">
                <Image
                  src="/images/audit-team.jpg"
                  alt="Foxlite founding directors"
                  width={640}
                  height={420}
                  className="w-full object-cover"
                  quality={85}
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-[rgba(196,164,78,0.2)]" />
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={150}>
              <SectionLabel className="text-[#A68A3A]">Our Founders</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">
                Built by specialists, not generalists
              </SectionTitle>
              <div className="gold-rule-left mb-8" />

              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C4A44E] flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair font-bold text-[#0B1A2B] text-sm">DC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0B1A2B]">David Clarke</div>
                    <div className="text-[0.8rem] text-[#C4A44E] font-medium mb-1">Managing Director — Forensic Audit Lead</div>
                    <p className="text-[0.85rem] text-[#5A5A5A] leading-relaxed">
                      20+ years in energy systems, building management, and utility cost forensics.
                      Leads all major forensic audit engagements and regulatory submissions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#0B1A2B] flex items-center justify-center flex-shrink-0">
                    <span className="font-playfair font-bold text-[#C4A44E] text-sm">DD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0B1A2B]">Derek Dunphy</div>
                    <div className="text-[0.8rem] text-[#C4A44E] font-medium mb-1">Director — Operations & Client Services</div>
                    <p className="text-[0.85rem] text-[#5A5A5A] leading-relaxed">
                      Quantity surveying and property management specialist. Oversees client
                      engagement, case management, and recovery delivery.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/team" className="btn-navy !bg-[#0B1A2B] !text-white !border-[rgba(196,164,78,0.35)] hover:!border-[#C4A44E] inline-flex items-center gap-2">
                View Full Team Profiles
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* ── Company Timeline ── */}
      <section className="py-24 bg-white">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Journey</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">From startup to Ireland's leading forensic auditor</SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-[#C4A44E] via-[rgba(196,164,78,0.4)] to-transparent" />
              {milestones.map((m, i) => (
                <FadeIn key={m.year} delay={i * 80}>
                  <div className="flex gap-8 mb-8 relative">
                    <div className="w-20 flex-shrink-0 text-right">
                      <span className="font-playfair font-bold text-[#C4A44E] text-lg">{m.year}</span>
                    </div>
                    <div className="relative flex-shrink-0 mt-1">
                      <div className="w-4 h-4 rounded-full bg-[#C4A44E] border-2 border-white shadow-[0_0_0_3px_rgba(196,164,78,0.25)]" />
                    </div>
                    <div className="pb-2">
                      <p className="text-[0.93rem] text-[#3A3A3A] leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </Section>
      </section>

      {/* ── Certifications ── */}
      <section className="py-24 bg-[#F8F6F1]">
        <Section>
          <div className="text-center mb-14">
            <FadeIn>
              <SectionLabel>Accreditations</SectionLabel>
              <SectionTitle className="text-[#0B1A2B]">
                Certified to the highest standards
              </SectionTitle>
              <GoldRule />
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, i) => (
              <FadeIn key={cert.title} delay={i * 100}>
                <div className={`rounded-2xl p-8 ${cert.bg}`}>
                  <h3 className={`font-playfair text-xl font-bold ${cert.textColor} mb-1`}>{cert.title}</h3>
                  <div className={`text-[0.72rem] font-semibold uppercase tracking-wider ${cert.textColor} opacity-60 mb-4`}>{cert.subtitle}</div>
                  <p className={`text-[0.83rem] leading-relaxed ${cert.textColor} opacity-80`}>{cert.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#0B1A2B] text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to work with Ireland's forensic auditing experts?
              </h2>
              <p className="text-xl text-[rgba(248,246,241,0.6)] mb-10 max-w-2xl mx-auto leading-relaxed">
                Free consultation. No upfront cost. Results-only engagement.
                Find out how much your business could recover.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary text-base px-8 py-4">
                  Book Free Consultation
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/calculator" className="btn-ghost text-base px-8 py-4">
                  Calculate My Savings
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
