import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { CookieConsent } from '@/components/CookieConsent'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600']
})

export const metadata: Metadata = {
  title: 'Foxlite Forensic Services | Independent Forensic Auditing',
  description: 'We find overcharges. You keep the savings. Independent forensic auditing firm established in 2019, based in Dublin, Ireland.',
  keywords: 'forensic audit, energy audit, waste management, banking audit, telecoms audit, fleet audit, insurance audit, property audit',
  authors: [{ name: 'Foxlite Forensic Services' }],
  creator: 'Foxlite Forensic Services',
  publisher: 'Foxlite Forensic Services',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://foxliteforensics.com',
    siteName: 'Foxlite Forensic Services',
    title: 'Foxlite Forensic Services | Independent Forensic Auditing',
    description: 'We find overcharges. You keep the savings. Independent forensic auditing firm established in 2019, based in Dublin, Ireland.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foxlite Forensic Services | Independent Forensic Auditing',
    description: 'We find overcharges. You keep the savings. Independent forensic auditing firm established in 2019, based in Dublin, Ireland.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href="https://foxliteforensics.com" />
      </head>
      <body className="font-dm-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  )
}