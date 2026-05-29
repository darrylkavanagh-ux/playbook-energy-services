'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navigation = [
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { name: 'Energy Audits',       href: '/services/energy' },
      { name: 'Waste Management',    href: '/services/waste' },
      { name: 'Banking & Finance',   href: '/services/banking' },
      { name: 'Telecoms',            href: '/services/telecoms' },
      { name: 'Fleet Management',    href: '/services/fleet' },
      { name: 'Insurance',           href: '/services/insurance' },
      { name: 'Property Management', href: '/services/property' },
      { name: 'Complete Audit',      href: '/services/all' },
    ],
  },
  {
    name: 'Who We Help',
    href: '/who-we-help',
    dropdown: [
      { name: 'Property Management', href: '/who-we-help/property-management' },
      { name: 'Hotels & Hospitality',href: '/who-we-help/hospitality' },
      { name: 'Retail & Food Service',href: '/who-we-help/retail' },
      { name: 'Healthcare',          href: '/who-we-help/healthcare' },
      { name: 'Manufacturing',       href: '/who-we-help/manufacturing' },
      { name: 'Public Sector',       href: '/who-we-help/public-sector' },
      { name: 'Multi-Site Businesses',href: '/who-we-help/multi-site' },
    ],
  },
  { name: 'Savings Calculator', href: '/calculator' },
  { name: 'Pricing',            href: '/pricing' },
  { name: 'Case Studies',       href: '/case-studies' },
  {
    name: 'About',
    href: '/about',
    dropdown: [
      { name: 'About Us',              href: '/about' },
      { name: 'Our Team',              href: '/team' },
      { name: 'Forensic Capabilities', href: '/forensic-capabilities' },
      { name: 'Privacy Policy',        href: '/privacy' },
    ],
  },
  { name: 'Contact', href: '/contact' },
]

export function Nav() {
  const [scrolled, setScrolled]           = useState(false)
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else            document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navBg = scrolled
    ? 'bg-[#060D18]/95 backdrop-blur-xl shadow-[0_2px_40px_rgba(0,0,0,0.6)] border-b border-[rgba(196,164,78,0.12)]'
    : 'bg-gradient-to-b from-[rgba(6,13,24,0.92)] to-transparent backdrop-blur-sm'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[76px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0" onClick={() => setMobileOpen(false)}>
              {/* White box to preserve logo contrast */}
              <div className="flex-shrink-0 bg-white rounded-lg p-1 shadow-[0_0_0_1px_rgba(196,164,78,0.35)] group-hover:shadow-[0_0_0_2px_rgba(196,164,78,0.6)] transition-all duration-300">
                <Image
                  src="/images/foxlite-logo.jpg"
                  alt="Foxlite Forensic Services"
                  width={52}
                  height={46}
                  className="block rounded object-contain"
                  priority
                />
              </div>
              <div className="leading-none">
                <div className="font-playfair text-[1.15rem] font-bold text-white tracking-tight leading-tight">
                  FOXLITE
                </div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#C4A44E] leading-tight mt-0.5">
                  Forensic Services
                </div>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-[0.82rem] font-semibold text-[rgba(248,246,241,0.82)] hover:text-[#C4A44E] transition-colors duration-200 uppercase tracking-wide rounded">
                      {item.name}
                      <svg className={`w-3 h-3 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown panel */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 transition-all duration-200 origin-top ${openDropdown === item.name ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F2240] border-l border-t border-[rgba(196,164,78,0.25)] rotate-45" />
                      <div className="bg-[#0F2240] border border-[rgba(196,164,78,0.2)] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden mt-1.5">
                        {item.dropdown.map((sub, i) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-5 py-2.5 text-[0.81rem] text-[rgba(248,246,241,0.78)] hover:text-[#C4A44E] hover:bg-[rgba(196,164,78,0.07)] transition-all duration-150 font-medium ${i !== item.dropdown!.length - 1 ? 'border-b border-[rgba(196,164,78,0.07)]' : ''}`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-[0.82rem] font-semibold text-[rgba(248,246,241,0.82)] hover:text-[#C4A44E] transition-colors duration-200 uppercase tracking-wide rounded"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* ── Desktop CTAs ── */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/calculator"
                className="text-[0.8rem] font-bold uppercase tracking-wide px-4 py-2 rounded-md text-[#C4A44E] border border-[rgba(196,164,78,0.4)] hover:bg-[rgba(196,164,78,0.1)] hover:border-[#C4A44E] transition-all duration-200"
              >
                Savings Calculator
              </Link>
              <Link
                href="/contact"
                className="btn-primary !text-[0.8rem] !py-2 !px-5"
              >
                Free Audit
              </Link>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] group"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              <span className={`block w-6 h-[2px] bg-[#C4A44E] transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-[#C4A44E] transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-[2px] bg-[#C4A44E] transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#060D18]/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-[85vw] max-w-sm bg-[#0B1A2B] border-l border-[rgba(196,164,78,0.15)] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(196,164,78,0.12)]">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <div className="bg-white rounded-md p-1">
                <Image src="/images/foxlite-logo.jpg" alt="Foxlite" width={40} height={36} className="block rounded object-contain" />
              </div>
              <div>
                <div className="font-playfair text-sm font-bold text-white">FOXLITE</div>
                <div className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-[#C4A44E]">Forensic Services</div>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="text-[rgba(248,246,241,0.6)] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navigation.map((item) =>
              item.dropdown ? (
                <div key={item.name}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-3 text-[0.85rem] font-semibold uppercase tracking-wider text-white hover:text-[#C4A44E] transition-colors"
                    onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                  >
                    {item.name}
                    <svg className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === item.name ? 'rotate-180 text-[#C4A44E]' : 'text-[rgba(248,246,241,0.4)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === item.name ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="pl-4 pb-2 space-y-0.5 border-l border-[rgba(196,164,78,0.2)] ml-3">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2.5 text-[0.82rem] text-[rgba(248,246,241,0.65)] hover:text-[#C4A44E] transition-colors font-medium"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-3 text-[0.85rem] font-semibold uppercase tracking-wider text-white hover:text-[#C4A44E] transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Drawer CTAs */}
          <div className="px-5 pb-8 pt-4 border-t border-[rgba(196,164,78,0.12)] space-y-3">
            <Link href="/calculator" onClick={() => setMobileOpen(false)}
              className="block text-center py-3 rounded-lg border border-[rgba(196,164,78,0.4)] text-[#C4A44E] text-sm font-bold uppercase tracking-wide hover:bg-[rgba(196,164,78,0.1)] transition-all">
              Savings Calculator
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center !py-3 !text-sm w-full">
              Request Free Audit
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
