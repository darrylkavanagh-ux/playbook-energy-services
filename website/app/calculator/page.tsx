'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

// ── Types ──────────────────────────────────────────────────────────────────────

type Category = {
  id: string
  label: string
  icon: string
  errorRate: number          // % of bills with errors (industry stat)
  avgOverchargeRate: number  // % of annual spend typically overcharged
  placeholder: string
  unit: string
  href: string
}

// ── Data ───────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    id: 'electricity',
    label: 'Electricity',
    icon: '⚡',
    errorRate: 73,
    avgOverchargeRate: 18,
    placeholder: 'e.g. 24000',
    unit: '€ / year',
    href: '/services/energy',
  },
  {
    id: 'gas',
    label: 'Gas',
    icon: '🔥',
    errorRate: 68,
    avgOverchargeRate: 15,
    placeholder: 'e.g. 8000',
    unit: '€ / year',
    href: '/services/energy',
  },
  {
    id: 'water',
    label: 'Water',
    icon: '💧',
    errorRate: 55,
    avgOverchargeRate: 12,
    placeholder: 'e.g. 3500',
    unit: '€ / year',
    href: '/services/energy',
  },
  {
    id: 'waste',
    label: 'Waste Management',
    icon: '♻️',
    errorRate: 62,
    avgOverchargeRate: 20,
    placeholder: 'e.g. 6000',
    unit: '€ / year',
    href: '/services/waste',
  },
  {
    id: 'telecoms',
    label: 'Telecoms',
    icon: '📡',
    errorRate: 58,
    avgOverchargeRate: 22,
    placeholder: 'e.g. 5000',
    unit: '€ / year',
    href: '/services/telecoms',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: '🛡️',
    errorRate: 45,
    avgOverchargeRate: 16,
    placeholder: 'e.g. 12000',
    unit: '€ / year',
    href: '/services/insurance',
  },
  {
    id: 'banking',
    label: 'Banking & Finance',
    icon: '💳',
    errorRate: 51,
    avgOverchargeRate: 14,
    placeholder: 'e.g. 4000',
    unit: '€ / year',
    href: '/services/banking',
  },
  {
    id: 'fleet',
    label: 'Fleet / Fuel',
    icon: '🚗',
    errorRate: 48,
    avgOverchargeRate: 13,
    placeholder: 'e.g. 9000',
    unit: '€ / year',
    href: '/services/fleet',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function CalculatorPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [sites, setSites] = useState('1')

  const handleChange = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }))
    setShowResults(false)
  }

  const totalSpend = categories.reduce((acc, cat) => {
    const v = parseFloat(values[cat.id] || '0')
    return acc + (isNaN(v) ? 0 : v)
  }, 0)

  const siteCount = Math.max(1, parseInt(sites) || 1)

  // Per-category estimates
  const results = categories
    .map((cat) => {
      const annual = parseFloat(values[cat.id] || '0') || 0
      if (annual === 0) return null
      const overcharge = (annual * cat.avgOverchargeRate) / 100
      const sixYearRecovery = overcharge * 6
      const foxliteFee = sixYearRecovery * 0.25
      const clientKeeps = sixYearRecovery - foxliteFee
      return { ...cat, annual, overcharge, sixYearRecovery, foxliteFee, clientKeeps }
    })
    .filter(Boolean) as Array<Category & {
    annual: number
    overcharge: number
    sixYearRecovery: number
    foxliteFee: number
    clientKeeps: number
  }>

  const totals = results.reduce(
    (acc, r) => ({
      annual: acc.annual + r.annual,
      sixYear: acc.sixYear + r.sixYearRecovery,
      fee: acc.fee + r.foxliteFee,
      keeps: acc.keeps + r.clientKeeps,
    }),
    { annual: 0, sixYear: 0, fee: 0, keeps: 0 }
  )

  const multiSiteTotals = {
    sixYear: totals.sixYear * siteCount,
    fee: totals.fee * siteCount,
    keeps: totals.keeps * siteCount,
  }

  const hasData = results.length > 0

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Savings Calculator</SectionLabel>
              <SectionTitle className="text-white">
                How much could your business recover?
              </SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Enter your annual spend in any cost category below. We will show you an
                estimated overcharge range based on industry audit data — and how much
                you could recover going back six years.
              </p>
              <p className="text-sm text-greyLight/70 mt-4">
                * Estimates are based on industry-wide billing error statistics. Actual
                recoveries vary. A free Foxlite audit will give you the precise figure.
              </p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Calculator form */}
      <section className="py-16 bg-cream">
        <Section>
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-2">
                  Step 1 — Enter your annual spend
                </h2>
                <p className="text-textMid mb-8 text-sm">
                  Enter as many or as few categories as you like. Leave blank if you're
                  not sure — you can always update later.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <label className="block text-sm font-semibold text-navy mb-1">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                        <span className="ml-2 text-xs text-gray-400 font-normal">
                          {cat.errorRate}% of bills have errors
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                        <input
                          type="number"
                          min="0"
                          placeholder={cat.placeholder.replace('e.g. ', '')}
                          value={values[cat.id] || ''}
                          onChange={(e) => handleChange(cat.id, e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:outline-none text-navy font-medium transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Number of sites */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-navy mb-4">
                    Step 2 — How many sites do you operate?
                    <span className="ml-2 text-xs text-gray-400 font-normal">
                      (multiplies your total estimate)
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {['1', '2', '3', '5', '10', '20', '50+'].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setSites(n === '50+' ? '50' : n); setShowResults(false) }}
                        className={`px-5 py-2 rounded-xl font-semibold text-sm border-2 transition-colors ${
                          (n === '50+' ? sites === '50' : sites === n)
                            ? 'bg-gold border-gold text-navy'
                            : 'border-gray-200 text-navy hover:border-gold'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate button */}
                <button
                  onClick={() => setShowResults(true)}
                  disabled={!hasData}
                  className="mt-8 w-full bg-navy hover:bg-midNavy disabled:opacity-40 text-white font-bold text-lg py-4 rounded-xl transition-colors"
                >
                  {hasData ? 'Calculate My Potential Recovery →' : 'Enter at least one figure above'}
                </button>
              </div>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Results */}
      {showResults && hasData && (
        <section className="py-16">
          <Section>
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                {/* Headline numbers */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                  <div className="bg-navy rounded-2xl p-6 text-center text-white">
                    <div className="text-3xl font-bold font-playfair text-gold mb-1">
                      {fmt(multiSiteTotals.sixYear)}
                    </div>
                    <div className="text-greyLight text-sm">
                      Estimated 6-year overcharge
                      {siteCount > 1 && <span className="block text-xs mt-1">across {siteCount} sites</span>}
                    </div>
                  </div>
                  <div className="bg-gold rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold font-playfair text-navy mb-1">
                      {fmt(multiSiteTotals.keeps)}
                    </div>
                    <div className="text-navy/80 text-sm font-semibold">
                      You keep (after Foxlite 25% fee)
                    </div>
                  </div>
                  <div className="bg-cream rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold font-playfair text-navy mb-1">
                      {fmt(multiSiteTotals.fee)}
                    </div>
                    <div className="text-textMid text-sm">
                      Foxlite fee (25% of recovery only)
                    </div>
                  </div>
                </div>

                {/* Breakdown table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
                  <div className="bg-navy px-6 py-4">
                    <h3 className="text-white font-playfair text-xl font-bold">
                      Category Breakdown
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-cream text-navy">
                          <th className="text-left px-6 py-3 font-semibold">Category</th>
                          <th className="text-right px-4 py-3 font-semibold">Annual Spend</th>
                          <th className="text-right px-4 py-3 font-semibold">Est. Annual Overcharge</th>
                          <th className="text-right px-4 py-3 font-semibold">6-Year Recovery</th>
                          <th className="text-right px-6 py-3 font-semibold">You Keep</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r, i) => (
                          <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-cream/40'}>
                            <td className="px-6 py-3 font-medium text-navy">
                              <span className="mr-2">{r.icon}</span>{r.label}
                            </td>
                            <td className="text-right px-4 py-3 text-textMid">{fmt(r.annual)}</td>
                            <td className="text-right px-4 py-3 text-red-600 font-semibold">{fmt(r.overcharge)}</td>
                            <td className="text-right px-4 py-3 text-navy font-semibold">{fmt(r.sixYearRecovery)}</td>
                            <td className="text-right px-6 py-3 text-gold font-bold">{fmt(r.clientKeeps)}</td>
                          </tr>
                        ))}
                        {siteCount > 1 && (
                          <tr className="bg-navy text-white font-bold">
                            <td className="px-6 py-3">TOTAL ({siteCount} sites)</td>
                            <td className="text-right px-4 py-3">{fmt(totals.annual * siteCount)}</td>
                            <td className="text-right px-4 py-3 text-red-300">{fmt(results.reduce((a, r) => a + r.overcharge, 0) * siteCount)}</td>
                            <td className="text-right px-4 py-3">{fmt(multiSiteTotals.sixYear)}</td>
                            <td className="text-right px-6 py-3 text-gold">{fmt(multiSiteTotals.keeps)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Disclaimer + CTA */}
                <div className="bg-navy rounded-2xl p-8 text-center text-white">
                  <h3 className="font-playfair text-2xl font-bold mb-3">
                    Your estimate: {fmt(multiSiteTotals.keeps)} waiting to be recovered
                  </h3>
                  <p className="text-greyLight mb-6 max-w-2xl mx-auto">
                    This is a conservative estimate based on industry billing error data. A full
                    Foxlite forensic audit will give you the exact figure — at no cost and no
                    obligation to proceed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="bg-gold hover:bg-goldDark text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors"
                    >
                      Claim My Free Audit →
                    </Link>
                    <a
                      href="tel:+353860276700"
                      className="border-2 border-white text-white hover:bg-white hover:text-navy font-bold text-lg px-10 py-4 rounded-xl transition-colors"
                    >
                      Call David: +353 86 027 6700
                    </a>
                  </div>
                  <p className="text-xs text-greyLight/60 mt-6">
                    Estimates use industry-average error rates and are for illustrative purposes only.
                    Actual recoveries depend on individual billing history and supplier response.
                    Foxlite's 25% fee is charged only on amounts actually recovered.
                  </p>
                </div>
              </FadeIn>
            </div>
          </Section>
        </section>
      )}

      {/* How it works — below fold */}
      {!showResults && (
        <section className="py-16">
          <Section>
            <div className="max-w-3xl mx-auto text-center">
              <FadeIn>
                <SectionLabel>How the estimate works</SectionLabel>
                <SectionTitle>Based on real industry data</SectionTitle>
                <GoldRule className="mb-8" />
                <div className="grid sm:grid-cols-3 gap-8 text-left mt-8">
                  {[
                    { icon: '📊', title: '73% error rate', desc: 'Industry studies show 73% of commercial electricity bills contain at least one billing error.' },
                    { icon: '📅', title: '6-year lookback', desc: 'Irish and UK law allows recovery of overcharges going back up to six years from suppliers.' },
                    { icon: '💰', title: '25% fee only', desc: 'Foxlite charges 25% of the amount actually recovered. If we find nothing, you pay nothing.' },
                  ].map((item) => (
                    <div key={item.title} className="bg-cream rounded-xl p-6">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h4 className="font-playfair font-bold text-navy text-lg mb-2">{item.title}</h4>
                      <p className="text-textMid text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </Section>
        </section>
      )}
    </>
  )
}
