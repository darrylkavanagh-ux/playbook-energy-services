import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Foxlite Forensic Services | Independent Forensic Auditing Ireland',
  description: 'Ireland\'s independent forensic auditing firm. We recover historic overcharges across energy, waste, telecoms, banking, insurance, fleet and property — going back six years. No win, no fee.',
  keywords: 'forensic audit ireland, energy audit, overcharge recovery, waste management audit, banking audit, telecoms audit, fleet audit, insurance audit, property audit, dublin ireland',
  authors: [{ name: 'Foxlite Forensic Services' }],
  creator: 'Foxlite Forensic Services',
  publisher: 'Foxlite Forensic Services',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://foxliteforensics.com',
    siteName: 'Foxlite Forensic Services',
    title: 'Foxlite Forensic Services | Independent Forensic Auditing Ireland',
    description: 'We find overcharges. You keep the savings. No win, no fee.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foxlite Forensic Services | Independent Forensic Auditing Ireland',
    description: 'We find overcharges. You keep the savings. No win, no fee.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} ${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href="https://foxliteforensics.com" />
      </head>
      <body className="font-montserrat antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
