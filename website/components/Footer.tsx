import Link from 'next/link'

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
  { name: 'Calculator',  href: '/calculator' },
  { name: 'Case Studies',href: '/case-studies' },
  { name: 'Pricing',     href: '/pricing' },
  { name: 'Contact',     href: '/contact' },
]

const industries = [
  { name: 'Hotels & Hospitality',  href: '/who-we-help/hospitality' },
  { name: 'Property Management',   href: '/who-we-help/property-management' },
  { name: 'Healthcare',            href: '/who-we-help/healthcare' },
  { name: 'Manufacturing',         href: '/who-we-help/manufacturing' },
  { name: 'Retail & Food Service', href: '/who-we-help/retail' },
  { name: 'Multi-Site Businesses', href: '/who-we-help/multi-site' },
]

const footerLinkStyle = {
  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
  fontSize: '0.8125rem',
  fontWeight: 300,
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1,
  display: 'block',
  transition: 'color 0.2s',
}

const headingStyle = {
  fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: 'var(--gold)',
  marginBottom: '1.25rem',
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#fff' }}>

      {/* ── Top divider ───────────────────────────── */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(184,150,90,0.3), transparent)' }} />

      {/* ── Main grid ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand col — wider */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{
                fontFamily: 'var(--font-cormorant), Cormorant Garamond, Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                FOX<span style={{ color: 'var(--gold)' }}>LITE</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 500,
                marginTop: '0.25rem',
              }}>
                Forensic Services
              </div>
            </div>

            {/* Strapline */}
            <p style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '0.8125rem',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '1.75rem',
              maxWidth: 320,
            }}>
              Independent forensic auditing firm established in 2019, based in
              Dublin, Ireland. Recovering overcharges across Ireland and the UK.
            </p>

            {/* Contacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { name: 'David Clarke', role: 'Managing Director', phone: '+353 86 027 6700', tel: '+353860276700', email: 'DavidC@foxliteforensics.com' },
                { name: 'Derek Dunphy', role: 'Head of Sales',      phone: '+353 89 706 4225', tel: '+353897064225', email: 'DerekD@foxliteforensics.com' },
              ].map((person) => (
                <div key={person.name}>
                  <p style={{
                    fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: 'var(--gold)',
                    marginBottom: '0.3rem',
                  }}>
                    {person.name} <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>· {person.role}</span>
                  </p>
                  <a href={`tel:${person.tel}`} style={{
                    ...footerLinkStyle,
                    marginBottom: '0.2rem',
                  }}
                  className="hover:text-gold">
                    {person.phone}
                  </a>
                  <a href={`mailto:${person.email}`} style={footerLinkStyle} className="hover:text-gold">
                    {person.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p style={headingStyle}>Services</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {services.map((s) => (
                <li key={s.name}>
                  <Link href={s.href} style={footerLinkStyle} className="hover:text-gold">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p style={headingStyle}>Company</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {company.map((c) => (
                <li key={c.name}>
                  <Link href={c.href} style={footerLinkStyle} className="hover:text-gold">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p style={headingStyle}>Industries</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {industries.map((ind) => (
                <li key={ind.name}>
                  <Link href={ind.href} style={footerLinkStyle} className="hover:text-gold">
                    {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────── */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <p style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.25)',
          }}>
            © 2026 Foxlite Forensic Services Ltd. Established 2019. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--gold)',
            }}>
              ✓ VeriTech 10 Certified
            </span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
            <span style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--gold)',
            }}>
              EU AI Act Compliant
            </span>
            <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
            <span style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--gold)',
            }}>
              GDPR Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
