import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Foxlite Forensic Services',
  description: 'Meet the team behind Foxlite Forensic Services — independent forensic auditors established in 2019, based in Dublin, Ireland.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">About Us</SectionLabel>
              <SectionTitle className="text-white">
                Ireland's independent forensic auditing experts
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Established in 2019, Foxlite Forensic Services recovers historic overcharges
                and secures ongoing cost reductions for commercial organisations across Ireland
                and the United Kingdom.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <SectionLabel>Who We Are</SectionLabel>
                <SectionTitle>Forensic auditing built on operator experience</SectionTitle>
                <div className="space-y-6 text-lg text-textMid leading-relaxed">
                  <p>
                    Foxlite Forensic Services was founded in 2019 with a single purpose: to help
                    Irish and UK businesses recover money they have been overcharged — and to
                    prevent it happening again.
                  </p>
                  <p>
                    Our team brings decades of hands-on experience across hospitality, property
                    management, maintenance services, and commercial property. We understand billing
                    complexity from an operator's perspective — which is exactly why we find what
                    others miss.
                  </p>
                  <p>
                    We operate on a results-only basis. If we don't find savings, you pay nothing.
                    Our 25% fee is taken only from what we recover on your behalf.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-cream rounded-2xl p-8 space-y-5">
                <h3 className="font-playfair text-2xl font-bold text-navy mb-2">Our Methodology</h3>
                {[
                  { icon: '🔍', title: 'Forensic Analysis', desc: 'Line-by-line examination of every bill across all cost categories' },
                  { icon: '📊', title: 'Six-Year Recovery', desc: 'We claim the full statutory retrospective recovery period' },
                  { icon: '🤝', title: 'Results-Only Fee', desc: 'No savings found — no invoice raised. Ever.' },
                  { icon: '🛡️', title: 'GDPR Compliant', desc: 'All supplier data requests are handled with full legal authority' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-navy">{item.title}</h4>
                      <p className="text-textMid text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <Section>
          <div className="text-center mb-16">
            <FadeIn>
              <SectionLabel>Our Team</SectionLabel>
              <SectionTitle>Over 100 years combined experience</SectionTitle>
              <GoldRule className="mb-6" />
              <p className="text-lg text-textMid max-w-2xl mx-auto">
                Two principals. Deep operator backgrounds. A shared commitment to getting every
                client what they are owed.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* David Clarke */}
            <FadeIn delay={0}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-navy px-8 pt-10 pb-8 text-center">
                  <div className="w-24 h-24 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-playfair font-bold text-navy">DC</span>
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-white">David Clarke</h3>
                  <p className="text-gold font-semibold mt-1">Managing Director</p>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-textMid leading-relaxed">
                    Over 30 years' experience across hospitality, maintenance services, and
                    commercial property management. David brings an operator's understanding
                    of where real costs hide — and precisely how suppliers exploit billing
                    complexity to overcharge.
                  </p>
                  <p className="text-textMid leading-relaxed">
                    He leads all forensic audit engagements and supplier recovery negotiations,
                    drawing on three decades of direct industry experience to identify overcharges
                    that traditional auditors overlook.
                  </p>
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <a href="tel:+353860276700" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                      <span>📞</span> +353 86 027 6700
                    </a>
                    <a href="mailto:DavidC@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                      <span>✉️</span> DavidC@foxliteforensics.com
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Derek Dunphy */}
            <FadeIn delay={150}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-navy px-8 pt-10 pb-8 text-center">
                  <div className="w-24 h-24 bg-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl font-playfair font-bold text-navy">DD</span>
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-white">Derek Dunphy</h3>
                  <p className="text-gold font-semibold mt-1">Head of Sales Development</p>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-textMid leading-relaxed">
                    Extensive background in client relationship management and business development
                    across commercial sectors. Derek ensures every client receives a tailored
                    approach and clear, transparent communication at every stage of the audit
                    and recovery process.
                  </p>
                  <p className="text-textMid leading-relaxed">
                    He manages client onboarding, new business development, and the ongoing
                    client relationships that underpin Foxlite's reputation for professionalism
                    and results.
                  </p>
                  <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <a href="tel:+353897064225" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                      <span>📞</span> +353 89 706 4225
                    </a>
                    <a href="mailto:DerekD@foxliteforensics.com" className="flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium">
                      <span>✉️</span> DerekD@foxliteforensics.com
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Credentials */}
      <section className="py-20">
        <Section>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-gold rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="font-playfair text-2xl font-bold text-navy mb-3">VeriTech 10 Certified</h3>
                <p className="text-navy leading-relaxed">
                  Certified under VeriTech 10 standards — ensuring the highest standards
                  of forensic methodology, data verification, and client confidentiality.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-cream rounded-2xl p-8 text-center">
                <div className="text-4xl mb-4">🇪🇺</div>
                <h3 className="font-playfair text-2xl font-bold text-navy mb-3">EU AI Act Compliant</h3>
                <p className="text-textMid leading-relaxed">
                  Our human-led, AI-assisted methodology is fully compliant with EU AI Act
                  requirements — ethical, transparent, and fully auditable.
                </p>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Ready to find out what you're owed?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Contact David or Derek today for a free, confidential assessment.
                No obligation. No upfront cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-gold hover:bg-goldDark text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors"
                >
                  Request Free Audit
                </Link>
                <Link
                  href="/calculator"
                  className="border-2 border-white text-white hover:bg-white hover:text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors"
                >
                  Try the Calculator
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
