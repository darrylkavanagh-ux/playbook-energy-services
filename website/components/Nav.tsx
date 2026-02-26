'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

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
      { name: 'Complete Audit', href: '/services/all', icon: '📊' }
    ]
  },
  {
    name: 'Who We Help',
    href: '/who-we-help',
    dropdown: [
      { name: 'Property Management', href: '/who-we-help/property-management', icon: '🏗️' },
      { name: 'Hotels & Hospitality', href: '/who-we-help/hotels-hospitality', icon: '🏨' },
      { name: 'Retail & Food Service', href: '/who-we-help/retail-food', icon: '🛒' },
      { name: 'Healthcare', href: '/who-we-help/healthcare', icon: '🏥' },
      { name: 'Manufacturing', href: '/who-we-help/manufacturing', icon: '🏭' },
      { name: 'Public Sector', href: '/who-we-help/public-sector', icon: '🏛️' },
      { name: 'Multi-Site Businesses', href: '/who-we-help/multi-site', icon: '📍' }
    ]
  },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="font-playfair text-navy">FOXLITE</span>
              <span className="text-gold text-sm font-dm-sans uppercase tracking-wider ml-2">
                Forensic Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="text-navy hover:text-gold transition-colors font-medium">
                      {item.name}
                    </button>
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-greyLight py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center px-4 py-2 text-navy hover:bg-cream hover:text-gold transition-colors"
                          >
                            <span className="mr-3">{subItem.icon}</span>
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-navy hover:text-gold transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <Button className="bg-gold hover:bg-goldDark text-navy font-semibold">
              Free Audit
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-navy hover:text-gold">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}