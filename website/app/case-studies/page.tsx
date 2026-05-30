import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'


export const metadata: Metadata = {
  title: 'Case Studies | Foxlite Forensic Services',
  description: 'Real-world forensic audit results. Foxlite has recovered over €4.2M for Irish businesses across energy, waste, telecoms, banking, insurance and property cost categories.',
}

const caseStudies = [
  {
    id: 'cs-001',
    sector: 'Hospitality',
    icon: '🏨',
    title: 'Dublin 4-Star Hotel — Energy & Waste Overcharges',
    summary: 'Multi-year forensic audit of electricity, gas and waste contracts uncovered systematic billing errors and tariff misapplication.',
    recovery: '€61,400',
    period: '4-year lookback',
    categories: ['Energy', 'Waste', 'Telecoms'],
    highlights: [
      '€38,200 in electricity overcharges traced to incorrect maximum demand tariff classification',
      '€14,700 in gas billing errors due to incorrect calorific value calculations',
      '€8,500 in waste collection overcharges — unmandated price escalations not in contract',
    ],
    methodology: 'Foxlite analysed 48 months of billing data across three suppliers. The electricity audit revealed the hotel had been billed on a commercial tariff structure inappropriate for its actual consumption profile — a single tariff reclassification triggered a four-year retrospective credit.',
    outcome: 'Supplier credits and refunds processed within 11 weeks of audit completion. New tariff structures locked in, projected forward savings of €14,000 per annum.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
  {
    id: 'cs-002',
    sector: 'Retail',
    icon: '🛒',
    title: 'Multi-Site Convenience Retail Chain — 12 Locations',
    summary: 'Complete forensic audit across energy, telecoms and banking charges at a 12-location Irish retail group.',
    recovery: '€94,200',
    period: '5-year lookback',
    categories: ['Energy', 'Telecoms', 'Banking'],
    highlights: [
      '€54,800 in electricity overcharges across eight sites — incorrect standing charges and capacity fees',
      '€21,600 in telecoms billing errors — duplicate broadband lines billed at two locations for 3 years',
      '€17,800 in bank charges — merchant service fee rates above contracted rate, applied since 2020',
    ],
    methodology: 'Each of the 12 sites was audited individually using Foxlite\'s Forensic Bill Matrix, comparing contracted rates against actual invoices across all billing periods. Banking charge analysis cross-referenced the original merchant services agreement against processed statement data.',
    outcome: 'Full recovery package negotiated with three separate suppliers. Merchant services contract renegotiated saving €8,200 annually going forward. Duplicate telecom lines disconnected.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
  {
    id: 'cs-003',
    sector: 'Healthcare',
    icon: '🏥',
    title: 'Private Healthcare Facility — Waste, Energy & Insurance',
    summary: 'Forensic cost review of a private clinic revealed overcharges across three categories, including an insurance premium loaded without client notification.',
    recovery: '€47,800',
    period: '3-year lookback',
    categories: ['Waste', 'Energy', 'Insurance'],
    highlights: [
      '€19,200 in energy overcharges — night rate electricity applied incorrectly during standard rate hours',
      '€16,400 in waste management overcharges — clinical waste uplift charges billed at unauthorized rates',
      '€12,200 in insurance premium overcharges — unauthorized loading applied following premises extension in 2022',
    ],
    methodology: 'The energy audit deployed half-hourly meter data analysis to identify rate boundary misapplication. The insurance review involved direct comparison of premium notices against original policy schedule and endorsements. Waste review examined all weighbridge receipts against billed tonnage.',
    outcome: 'Full recovery from waste contractor and insurer within 9 weeks. Energy supplier issued retrospective credit. Insurance broker replaced — projected annual saving of €4,100.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
  {
    id: 'cs-004',
    sector: 'Property Management',
    icon: '🏢',
    title: 'Commercial Property Portfolio — Service Charge Audit',
    summary: 'Service charge audit across a 6-building commercial portfolio uncovered systematic management fee overcharges and unsupported expense claims.',
    recovery: '€82,500',
    period: '4-year lookback',
    categories: ['Property', 'Energy', 'Waste'],
    highlights: [
      '€44,300 in management fee overcharges — fees calculated on gross rent rather than net as specified in lease',
      '€22,100 in energy cost pass-through errors — landlord billing tenants at above-contract unit rates',
      '€16,100 in unsupported maintenance expense claims passed through service charge accounts',
    ],
    methodology: 'Foxlite\'s property audit team reviewed all service charge reconciliation statements, lease agreements, and underlying supplier invoices. Management fee calculations were reconstructed from the base rent records and tested against lease provisions. All discretionary maintenance expenses were cross-referenced against procurement records.',
    outcome: 'Arbitration process initiated. Full settlement reached with property manager within 16 weeks. New service charge monitoring protocol implemented. Client retained Foxlite for ongoing annual review.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
  {
    id: 'cs-005',
    sector: 'Manufacturing',
    icon: '🏭',
    title: 'Food Manufacturing Plant — Energy & Fleet Audit',
    summary: 'Forensic audit of a food production facility identified significant electricity capacity charge overcharges and fuel card billing discrepancies.',
    recovery: '€53,700',
    period: '3-year lookback',
    categories: ['Energy', 'Fleet', 'Telecoms'],
    highlights: [
      '€39,400 in electricity overcharges — excess capacity charges billed against a demand profile that had materially reduced post-COVID',
      '€9,800 in fleet fuel card billing errors — volume-based rebate tier not applied despite qualifying volume',
      '€4,500 in telecoms overcharges — legacy ISDN lines maintained on contract but physically decommissioned',
    ],
    methodology: 'Half-hourly electricity data was analysed across three years. Capacity charges were benchmarked against actual maximum demand readings — the site had reduced production capacity in 2021 but the supply contract had not been updated. Fleet data included all fuel card transaction records cross-referenced against card-level invoices and rebate tier thresholds.',
    outcome: 'Electricity capacity charge renegotiated to reflect actual demand profile — annual saving of €13,200. Fuel card rebate retrospectively applied. ISDN lines formally terminated.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
  {
    id: 'cs-006',
    sector: 'Public Sector',
    icon: '🏛️',
    title: 'Local Authority — Multi-Category Cost Review',
    summary: 'Commissioned forensic review of utilities and contracted services for a local authority identified overcharges across four categories.',
    recovery: '€108,600',
    period: '6-year lookback',
    categories: ['Energy', 'Waste', 'Fleet', 'Telecoms'],
    highlights: [
      '€61,200 in electricity overcharges across 14 buildings — mix of tariff errors, meter read disputes, and incorrect VAT classification',
      '€23,800 in waste management overcharges — tonnage figures disputed at two sites',
      '€14,400 in fleet management overcharges — maintenance markup above the contracted rate applied by service provider',
      '€9,200 in telecoms — line rental charges on disconnected numbers over three years',
    ],
    methodology: 'The full six-year period was audited using FOI-sourced procurement records and meter data obtained directly from ESB Networks. VAT classification errors were identified by cross-referencing the building use category against Revenue guidance on reduced-rate electricity supplies. All findings were documented to the standard required for public sector audit and procurement compliance.',
    outcome: 'Full recovery package approved by council finance committee. Supplier credits of €108,600 received across four suppliers. New procurement framework for energy and telecoms established based on Foxlite recommendations.',
    tag: 'COMPLETED',
    tagColor: 'bg-gold text-navy',
  },
]

const stats = [
  { value: '€4.2M+', label: 'Total recovered for clients' },
  { value: '200+', label: 'Forensic audits completed' },
  { value: '6 Years', label: 'Maximum lookback period' },
  { value: '94%', label: 'Cases with full recovery' },
]

export default function CaseStudiesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Case Studies</SectionLabel>
              <SectionTitle className="text-white">
                Real audits. Real results. Real money recovered.
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Every case below is based on a real Foxlite forensic audit. Sector and identifying
                details have been anonymised. Methodology, findings, and recovery figures are as documented.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Stats Banner */}
      <section className="bg-gold py-10">
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 100}>
                <div>
                  <div className="text-3xl md:text-4xl font-playfair font-bold text-navy mb-1">{s.value}</div>
                  <div className="text-navy/70 text-sm font-medium uppercase tracking-wide">{s.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 bg-white">
        <Section>
          <div className="space-y-12">
            {caseStudies.map((cs, idx) => (
              <FadeIn key={cs.id} delay={idx * 80}>
                <div className="bg-white border border-greyLight rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-navy px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{cs.icon}</div>
                      <div>
                        <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">
                          {cs.sector} · {cs.period}
                        </div>
                        <h2 className="font-playfair text-xl font-bold text-white leading-snug">
                          {cs.title}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${cs.tagColor}`}>
                        {cs.tag}
                      </span>
                      <div className="text-right">
                        <div className="text-gold font-playfair text-2xl font-bold">{cs.recovery}</div>
                        <div className="text-greyLight text-xs">recovered</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-8 py-8">
                    <p className="text-textMid text-lg leading-relaxed mb-6">{cs.summary}</p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {cs.categories.map(cat => (
                        <span key={cat} className="text-xs bg-cream text-navy border border-gold/30 px-3 py-1 rounded-full font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Findings */}
                      <div>
                        <h3 className="font-playfair text-lg font-bold text-navy mb-4 flex items-center gap-2">
                          <span className="text-gold">⚠</span> Key Findings
                        </h3>
                        <ul className="space-y-3">
                          {cs.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-gold mt-1 flex-shrink-0">✓</span>
                              <span className="text-textMid text-sm leading-relaxed">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Methodology + Outcome */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-playfair text-lg font-bold text-navy mb-3 flex items-center gap-2">
                            <span className="text-gold">🔍</span> Methodology
                          </h3>
                          <p className="text-textMid text-sm leading-relaxed">{cs.methodology}</p>
                        </div>
                        <div className="bg-cream rounded-xl p-5">
                          <h3 className="font-playfair text-base font-bold text-navy mb-2 flex items-center gap-2">
                            <span className="text-gold">✅</span> Outcome
                          </h3>
                          <p className="text-textMid text-sm leading-relaxed">{cs.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Process Banner */}
      <section className="py-20 bg-cream">
        <Section>
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Our Process</SectionLabel>
              <SectionTitle>How every Foxlite audit works</SectionTitle>
              <GoldRule />
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Free Scope Consultation', desc: 'We assess your business costs, identify which categories are in scope, and provide a no-obligation audit proposal.' },
              { n: '02', title: 'Bill & Contract Collection', desc: 'You provide 24–72 months of invoices and contracts. We handle all supplier data requests on your behalf.' },
              { n: '03', title: 'Forensic Analysis', desc: 'Our team applies the Foxlite Forensic Bill Matrix across every billing line — every charge, every period.' },
              { n: '04', title: 'Recovery & Reporting', desc: 'We negotiate recoveries directly with suppliers. You receive full documentation. Our fee is 25% of recovered amounts only.' },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={i * 100}>
                <div className="bg-white rounded-xl p-7 shadow-sm border border-greyLight">
                  <div className="w-12 h-12 bg-navy text-gold rounded-full flex items-center justify-center font-bold text-lg mb-5">
                    {step.n}
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-navy mb-3">{step.title}</h3>
                  <p className="text-textMid text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Section>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-white border-t border-greyLight">
        <Section>
          <FadeIn>
            <p className="text-xs text-textLight text-center max-w-4xl mx-auto leading-relaxed">
              <strong>Confidentiality notice:</strong> All case studies are based on real Foxlite forensic audits. 
              Client names, trading names, and any commercially identifying information have been removed. 
              Recovery figures, methodologies, and findings are as recorded in the original audit documentation. 
              Results achieved in prior cases are not a guarantee of results in future engagements.
            </p>
          </FadeIn>
        </Section>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                Could your business be next?
              </h2>
              <p className="text-xl text-greyLight mb-8 max-w-2xl mx-auto">
                Our forensic audits have recovered an average of €21,000 per engagement.
                Start with a free, no-obligation consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/calculator">
                  <Link href="/calculator" className="inline-block px-8 py-4 bg-[#C4A44E] text-[#0B1A2B] font-semibold rounded-xl text-lg hover:bg-[#B8943E] transition-all duration-200 text-center">Calculate My Savings</Link>
                </Link>
                <Link href="/contact">
                  <Link href="/contact" className="inline-block px-8 py-4 border-2 border-[#C4A44E] text-[#C4A44E] font-semibold rounded-xl text-lg hover:bg-[#C4A44E] hover:text-[#0B1A2B] transition-all duration-200 text-center">Book Free Consultation</Link>
                </Link>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>
    </>
  )
}
