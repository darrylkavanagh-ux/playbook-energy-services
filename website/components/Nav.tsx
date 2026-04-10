'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { name: 'Energy Audits', href: '/services/energy', icon: '⚡' },
      { name: 'Waste Management', href: '/services/waste', icon: '♻️' },
      { name: 'Banking & Finance', href: '/services/banking', icon: '💳' },
      { name: 'Telecoms', href: '/services/telecoms', icon: '📡' },
      { name: 'Fleet Management', href: '/services/fleet', icon: '🚗' },
      { name: 'Insurance', href: '/services/insurance', icon: '🛡️' },
      { name: 'Property Management', href: '/services/property', icon: '🏢' },
      { name: 'Complete Audit', href: '/services/all', icon: '📊' },
    ],
  },
  {
    name: 'Who We Help',
    href: '/who-we-help',
    dropdown: [
      { name: 'Property Management', href: '/who-we-help/property-management', icon: '🏗️' },
      { name: 'Hotels & Hospitality', href: '/who-we-help/hospitality', icon: '🏨' },
      { name: 'Retail & Food Service', href: '/who-we-help/retail', icon: '🛒' },
      { name: 'Healthcare', href: '/who-we-help/healthcare', icon: '🏥' },
      { name: 'Manufacturing', href: '/who-we-help/manufacturing', icon: '🏭' },
      { name: 'Public Sector', href: '/who-we-help/public-sector', icon: '🏛️' },
      { name: 'Multi-Site Businesses', href: '/who-we-help/multi-site', icon: '📍' },
    ],
  },
  { name: 'Calculator', href: '/calculator' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close mobile menu on route change
  const closeAll = () => {
    setMobileOpen(false)
    setOpenDropdown(null)
    setMobileDropdown(null)
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || mobileOpen
          ? 'bg-white shadow-lg'
          : 'bg-navy/80 backdrop-blur-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={closeAll} className="flex items-center space-x-2 shrink-0">
            <span className={cn('font-playfair text-xl font-bold transition-colors', isScrolled || mobileOpen ? 'text-navy' : 'text-white')}>
              FOXLITE
            </span>
            <span className="text-gold text-xs font-semibold uppercase tracking-widest hidden sm:block">
              Forensic Services
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 font-medium text-sm transition-colors hover:text-gold',
                        isScrolled ? 'text-navy' : 'text-white'
                      )}
                    >
                      {item.name}
                      <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeAll}
                            className="flex items-center px-4 py-2.5 text-navy hover:bg-cream hover:text-gold transition-colors text-sm"
                          >
                            <span className="mr-3 text-base">{sub.icon}</span>
                            {sub.name}
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
                      'font-medium text-sm transition-colors hover:text-gold',
                      item.name === 'Calculator' ? 'text-gold font-semibold' : isScrolled ? 'text-navy' : 'text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              onClick={closeAll}
              className="bg-gold hover:bg-goldDark text-navy font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Free Audit
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={cn('lg:hidden p-2 rounded-md transition-colors', isScrolled || mobileOpen ? 'text-navy' : 'text-white')}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu — full screen panel */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    {/* Accordion toggle */}
                    <button
                      onClick={() =>
                        setMobileDropdown(mobileDropdown === item.name ? null : item.name)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-navy font-semibold text-base hover:bg-cream transition-colors"
                    >
                      <span>{item.name}</span>
                      <svg
                        className={cn('w-4 h-4 transition-transform', mobileDropdown === item.name ? 'rotate-180' : '')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown items */}
                    {mobileDropdown === item.name && (
                      <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-gold pl-4">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-navy hover:bg-cream hover:text-gold transition-colors text-sm"
                          >
                            <span className="text-base">{sub.icon}</span>
                            {sub.name}
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
                      'block px-4 py-3 rounded-lg font-semibold text-base transition-colors',
                      item.name === 'Calculator'
                        ? 'text-gold hover:bg-cream'
                        : 'text-navy hover:bg-cream hover:text-gold'
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA button */}
            <div className="pt-4 pb-2">
              <Link
                href="/contact"
                onClick={closeAll}
                className="block w-full text-center bg-gold hover:bg-goldDark text-navy font-bold py-3 px-6 rounded-xl transition-colors text-base"
              >
                Get Free Audit →
              </Link>
            </div>

            {/* Contact info */}
            <div className="border-t border-gray-100 pt-4 pb-2 text-sm text-gray-500 space-y-1 px-4">
              <p className="font-semibold text-navy">David Clarke</p>
              <p>+353 86 027 6700 · DavidC@foxliteforensics.com</p>
              <p className="font-semibold text-navy mt-2">Derek Dunphy</p>
              <p>+353 89 706 4225 · DerekD@foxliteforensics.com</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
