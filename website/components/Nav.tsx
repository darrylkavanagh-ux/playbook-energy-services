'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { name: 'Energy Audits',        href: '/services/energy',    icon: '⚡', desc: 'Electricity & gas billing errors' },
      { name: 'Waste Management',      href: '/services/waste',     icon: '♻️', desc: 'Collection & disposal costs' },
      { name: 'Banking & Finance',     href: '/services/banking',   icon: '💳', desc: 'Bank charges & loan fees' },
      { name: 'Telecoms',              href: '/services/telecoms',  icon: '📡', desc: 'Mobile, broadband & landline' },
      { name: 'Fleet Management',      href: '/services/fleet',     icon: '🚗', desc: 'Vehicle leasing & fuel costs' },
      { name: 'Insurance',             href: '/services/insurance', icon: '🛡️', desc: 'Premium & claims verification' },
      { name: 'Property Management',   href: '/services/property',  icon: '🏢', desc: 'Service charges & facilities' },
      { name: 'Complete Audit',        href: '/services/all',       icon: '📊', desc: 'Full forensic audit coverage' },
    ],
  },
  {
    name: 'Who We Help',
    href: '/who-we-help',
    dropdown: [
      { name: 'Hotels & Hospitality',  href: '/who-we-help/hospitality',         icon: '🏨', desc: 'Multi-site hotel groups' },
      { name: 'Property Management',   href: '/who-we-help/property-management', icon: '🏗️', desc: 'Facilities & estates' },
      { name: 'Retail & Food Service', href: '/who-we-help/retail',              icon: '🛒', desc: 'Chains & franchises' },
      { name: 'Healthcare',            href: '/who-we-help/healthcare',          icon: '🏥', desc: 'Hospitals & clinics' },
      { name: 'Manufacturing',         href: '/who-we-help/manufacturing',       icon: '🏭', desc: 'Industrial operations' },
      { name: 'Multi-Site Businesses', href: '/who-we-help/multi-site',          icon: '📍', desc: 'Multiple locations' },
    ],
  },
  { name: 'Calculator', href: '/calculator' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Nav() {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeAll = () => {
    setMobileOpen(false)
    setActiveDropdown(null)
    setMobileExpanded(null)
  }

  const handleMouseEnter = (name: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const transparent = !scrolled && !mobileOpen
  const navBg = transparent
    ? 'bg-transparent border-b border-transparent'
    : 'bg-white border-b border-gray-100 shadow-sm'

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
        navBg
      )}
    >
      {/* ── Main bar ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col leading-none">
              <span className={cn(
                'font-cormorant font-bold tracking-tight transition-colors duration-300',
                transparent ? 'text-white' : 'text-navy',
                'text-2xl'
              )}>
                FOX<span className="text-gold">LITE</span>
              </span>
              <span className={cn(
                'font-montserrat text-[0.55rem] tracking-[0.22em] uppercase transition-colors duration-300',
                transparent ? 'text-white opacity-60' : 'text-textLight'
              )}>
                Forensic Services
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.name)}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 rounded text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold',
                        transparent ? 'text-white' : 'text-textMid',
                        activeDropdown === item.name ? 'text-gold' : ''
                      )}
                    >
                      {item.name}
                      <svg
                        className={cn('w-3 h-3 transition-transform duration-200', activeDropdown === item.name ? 'rotate-180' : '')}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown panel */}
                    {activeDropdown === item.name && (
                      <div
                        onMouseEnter={() => handleMouseEnter(item.name)}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                          'absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-100 shadow-deep rounded z-50 py-2',
                          item.dropdown.length > 6 ? 'w-[480px] grid grid-cols-2 py-3 px-2' : 'w-56'
                        )}
                        style={{ animation: 'dropdownIn 0.18s ease both' }}
                      >
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeAll}
                            className="flex items-start gap-3 px-4 py-2.5 rounded transition-colors hover:bg-cream group"
                          >
                            <span className="text-lg mt-0.5 shrink-0">{sub.icon}</span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-navy group-hover:text-gold transition-colors truncate">
                                {sub.name}
                              </div>
                              <div className="text-xs text-textFaint truncate">{sub.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className={cn(
                      'px-3 py-2 rounded text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold',
                      transparent ? 'text-white' : 'text-textMid',
                      item.name === 'Calculator' ? 'text-gold font-semibold' : ''
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA button */}
            <Link
              href="/contact"
              onClick={closeAll}
              className={cn(
                'ml-4 px-5 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-200',
                transparent
                  ? 'bg-transparent border border-gold text-gold hover:bg-gold hover:text-navy'
                  : 'bg-gold text-navy hover:bg-goldDark'
              )}
              style={{ borderRadius: '2px' }}
            >
              Free Audit
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={cn(
              'lg:hidden p-2 transition-colors',
              transparent ? 'text-white' : 'text-navy'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile panel ──────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden mobile-nav-panel bg-navy overflow-y-auto">
          <div className="px-5 py-6 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.name ? null : item.name)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 text-white font-semibold text-base border-b border-white/10"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={cn(
                          'w-4 h-4 text-gold transition-transform duration-200',
                          mobileExpanded === item.name ? 'rotate-180' : ''
                        )}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {mobileExpanded === item.name && (
                      <div className="pl-4 pt-1 pb-2 space-y-0.5">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/80 hover:text-gold transition-colors"
                          >
                            <span className="text-base">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeAll}
                    className={cn(
                      'block px-4 py-3 text-base font-semibold border-b border-white/10 transition-colors hover:text-gold',
                      item.name === 'Calculator' ? 'text-gold' : 'text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA */}
            <div className="pt-6 pb-4 space-y-3">
              <Link
                href="/contact"
                onClick={closeAll}
                className="block w-full text-center bg-gold text-navy font-bold py-3.5 tracking-wide uppercase text-sm"
                style={{ borderRadius: '2px' }}
              >
                Get Free Audit →
              </Link>
              <a
                href="tel:+353860276700"
                className="block w-full text-center border border-white/30 text-white py-3 text-sm font-medium"
                style={{ borderRadius: '2px' }}
              >
                📞 Call David: +353 86 027 6700
              </a>
            </div>

            {/* Contact strip */}
            <div className="border-t border-white/10 pt-5 pb-4 space-y-4 text-sm">
              <div>
                <p className="text-gold font-semibold tracking-wide uppercase text-xs mb-1">David Clarke · Managing Director</p>
                <a href="tel:+353860276700" className="text-white/70 hover:text-gold transition-colors block">+353 86 027 6700</a>
                <a href="mailto:DavidC@foxliteforensics.com" className="text-white/70 hover:text-gold transition-colors block">DavidC@foxliteforensics.com</a>
              </div>
              <div>
                <p className="text-gold font-semibold tracking-wide uppercase text-xs mb-1">Derek Dunphy · Head of Sales</p>
                <a href="tel:+353897064225" className="text-white/70 hover:text-gold transition-colors block">+353 89 706 4225</a>
                <a href="mailto:DerekD@foxliteforensics.com" className="text-white/70 hover:text-gold transition-colors block">DerekD@foxliteforensics.com</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
