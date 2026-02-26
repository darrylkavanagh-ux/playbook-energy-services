import Link from 'next/link'

const services = [
  { name: 'Energy Audits', href: '/services/energy' },
  { name: 'Waste Management', href: '/services/waste' },
  { name: 'Banking & Finance', href: '/services/banking' },
  { name: 'Telecoms', href: '/services/telecoms' },
  { name: 'Fleet Management', href: '/services/fleet' },
  { name: 'Insurance', href: '/services/insurance' },
  { name: 'Property Management', href: '/services/property' },
  { name: 'Complete Audit', href: '/services/all' }
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' }
]

const industries = [
  { name: 'Property Management', href: '/who-we-help/property-management' },
  { name: 'Hotels & Hospitality', href: '/who-we-help/hotels-hospitality' },
  { name: 'Healthcare', href: '/who-we-help/healthcare' },
  { name: 'Manufacturing', href: '/who-we-help/manufacturing' }
]

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <div className="text-2xl font-bold">
                <span className="font-playfair text-white">FOXLITE</span>
                <div className="text-gold text-sm font-dm-sans uppercase tracking-wider">
                  Forensic Services
                </div>
              </div>
            </div>
            <p className="text-greyLight mb-4">
              Independent forensic auditing firm established in 2019, based in Dublin, Ireland.
            </p>
            <div className="text-sm text-greyLight">
              <p>Email: info@foxlite.ie</p>
              <p>Director: David Clarke</p>
              <p>Dublin, Ireland</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-greyLight hover:text-gold transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-greyLight hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold">Industries</h3>
            <ul className="space-y-2">
              {industries.map((industry) => (
                <li key={industry.name}>
                  <Link
                    href={industry.href}
                    className="text-greyLight hover:text-gold transition-colors"
                  >
                    {industry.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-midNavy mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-greyLight text-sm">
              © 2026 Foxlite Forensic Services. Established 2019. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gold text-sm font-semibold">VeriTech 10 Certified</span>
              <span className="text-greyLight">•</span>
              <span className="text-gold text-sm font-semibold">EU AI Act Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}