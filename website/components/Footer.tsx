'use client'

import Link from 'next/link'
import Image from 'next/image'

const services = [
  { name: 'Energy Audits',       href: '/services/energy' },
  { name: 'Waste Management',    href: '/services/waste' },
  { name: 'Banking & Finance',   href: '/services/banking' },
  { name: 'Telecoms',            href: '/services/telecoms' },
  { name: 'Fleet Management',    href: '/services/fleet' },
  { name: 'Insurance',           href: '/services/insurance' },
  { name: 'Property Management', href: '/services/property' },
  { name: 'Complete Audit',      href: '/services/all' },
]

const company = [
  { name: 'About Us',    href: '/about' },
  { name: 'Our Team',    href: '/team' },
  { name: 'Case Studies',href: '/case-studies' },
  { name: 'Pricing',     href: '/pricing' },
  { name: 'Calculator',  href: '/calculator' },
  { name: 'Contact',     href: '/contact' },
]

const sectors = [
  { name: 'Hotels & Hospitality',  href: '/who-we-help/hotels-hospitality' },
  { name: 'Healthcare',            href: '/who-we-help/healthcare' },
  { name: 'Manufacturing',         href: '/who-we-help/manufacturing' },
  { name: 'Property Management',   href: '/who-we-help/property-management' },
  { name: 'Retail & Food Service', href: '/who-we-help/retail-food' },
  { name: 'Public Sector',         href: '/who-we-help/public-sector' },
]

const certBadges = [
  { label: 'VeriTech 10', sub: 'Certified Platform' },
  { label: 'EU AI Act',   sub: 'Compliant' },
  { label: 'GDPR',        sub: 'Compliant' },
  { label: 'ISO 27001',   sub: 'Aligned' },
]

export function Footer() {
  return (
    <footer className="bg-[#060D18] text-[rgba(248,246,241,0.72)] relative overflow-hidden">

      {/* Top gold rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(196,164,78,0.45)] to-transparent" />

      {/* Pre-footer CTA band */}
      <div className="bg-gradient-to-r from-[#0B1A2B] via-[#0F2240] to-[#0B1A2B] border-b border-[rgba(196,164,78,0.1)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="eyebrow !mb-1 justify-center md:justify-start">No recovery · No fee</p>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white">
              Start your free forensic audit today
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/calculator" className="btn-ghost !text-sm !py-2.5 !px-6">
              Savings Calculator
            </Link>
            <Link href="/contact" className="btn-primary !text-sm !py-2.5 !px-6">
              Request Free Audit
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              {/* White box around logo for contrast */}
              <div className="bg-white rounded-xl p-2 shadow-[0_0_0_1px_rgba(196,164,78,0.35)] group-hover:shadow-[0_0_0_2px_rgba(196,164,78,0.55)] transition-all duration-300 flex-shrink-0">
                <Image
                  src="/images/foxlite-logo.jpg"
                  alt="Foxlite Forensic Services"
                  width={64}
                  height={57}
                  className="block rounded object-contain"
                />
              </div>
              <div className="leading-none">
                <div className="font-playfair text-[1.3rem] font-bold text-white tracking-tight">FOXLITE</div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C4A44E] mt-1">Forensic Services</div>
              </div>
            </Link>

            <p className="text-[0.875rem] leading-relaxed mb-5 max-w-xs text-[rgba(248,246,241,0.6)]">
              Independent forensic auditing firm established in 2019. 
              Based in Dublin, Ireland. We find what others miss.
            </p>

            <div className="space-y-1.5 text-[0.82rem] text-[rgba(248,246,241,0.55)] mb-6">
              <p>
                <span className="text-[#C4A44E] font-semibold">Email:</span>{' '}
                <a href="mailto:David@foxliteforensics.com" className="hover:text-[#C4A44E] transition-colors">David@foxliteforensics.com</a>
              </p>
              <p>
                <span className="text-[#C4A44E] font-semibold">Phone:</span>{' '}
                <a href="tel:+353896569838" className="hover:text-[#C4A44E] transition-colors">+353 (89) 656 9838</a>
              </p>
              <p><span className="text-[#C4A44E] font-semibold">Director:</span> David Clarke</p>
              <p><span className="text-[#C4A44E] font-semibold">Operations:</span> Derek Dunphy</p>
              <p><span className="text-[#C4A44E] font-semibold">Location:</span> Dublin, Ireland</p>
            </div>

            {/* Cert badges */}
            <div className="flex flex-wrap gap-2">
              {certBadges.map(b => (
                <div key={b.label} className="badge-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A44E] inline-block flex-shrink-0" />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C4A44E] mb-5">Services</h4>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s.name}>
                  <Link href={s.href} className="text-[0.83rem] text-[rgba(248,246,241,0.6)] hover:text-[#C4A44E] transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[rgba(196,164,78,0.3)] group-hover:bg-[#C4A44E] transition-colors flex-shrink-0" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C4A44E] mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map(c => (
                <li key={c.name}>
                  <Link href={c.href} className="text-[0.83rem] text-[rgba(248,246,241,0.6)] hover:text-[#C4A44E] transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[rgba(196,164,78,0.3)] group-hover:bg-[#C4A44E] transition-colors flex-shrink-0" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#C4A44E] mb-5">Sectors</h4>
            <ul className="space-y-3">
              {sectors.map(s => (
                <li key={s.name}>
                  <Link href={s.href} className="text-[0.83rem] text-[rgba(248,246,241,0.6)] hover:text-[#C4A44E] transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[rgba(196,164,78,0.3)] group-hover:bg-[#C4A44E] transition-colors flex-shrink-0" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(196,164,78,0.1)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.75rem] text-[rgba(248,246,241,0.35)]">
            © 2026 Foxlite Forensic Services Ltd. Established 2019. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-[0.75rem] text-[rgba(248,246,241,0.35)] hover:text-[#C4A44E] transition-colors">
              Privacy Policy
            </Link>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('foxlite_cookie_consent')
                  window.location.reload()
                }
              }}
              className="text-[0.75rem] text-[rgba(248,246,241,0.35)] hover:text-[#C4A44E] transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
