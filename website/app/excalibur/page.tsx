import type { Metadata } from 'next'
import { Section } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'
import TradingDashboard from '@/components/TradingDashboard'

export const metadata: Metadata = {
  title: 'Excalibur Trading Intelligence | Foxlite Forensic Services',
  description: 'Advanced forex trading intelligence dashboard with live technical analysis.',
  robots: 'noindex, nofollow'
}

export default function ExcaliburPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <div className="text-6xl mb-6">⚔️</div>
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6">
                EXCALIBUR
              </h1>
              <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
              <p className="text-xl text-greyLight max-w-2xl mx-auto leading-relaxed">
                Advanced Trading Intelligence Platform
              </p>
              <p className="text-sm text-greyLight mt-4 opacity-75">
                Live Technical Analysis • EUR/USD Focus • Real-Time Data
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Trading Dashboard */}
      <section className="py-8 bg-navy min-h-screen">
        <Section>
          <FadeIn>
            <TradingDashboard />
          </FadeIn>
        </Section>
      </section>
    </>
  )
}