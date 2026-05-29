'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Section, SectionLabel, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

// ── Irish market rates (May 2026) ──────────────────────────────────────────
const ELECTRICITY_RATES = {
  'Electric Ireland':  { unit: 0.4287, standing: 0.8932 },
  'Bord Gáis Energy':  { unit: 0.4154, standing: 0.8650 },
  'SSE Airtricity':    { unit: 0.4312, standing: 0.9100 },
  'Energia':           { unit: 0.4198, standing: 0.8750 },
  'Prepay Power':      { unit: 0.4450, standing: 0.9200 },
  'Other / Unknown':   { unit: 0.4280, standing: 0.8900 },
}

const GAS_RATES = {
  'Bord Gáis Energy':  { unit: 0.0842, standing: 0.4100 },
  'Electric Ireland':  { unit: 0.0871, standing: 0.4250 },
  'SSE Airtricity':    { unit: 0.0856, standing: 0.4180 },
  'Energia':           { unit: 0.0865, standing: 0.4220 },
  'Flogas':            { unit: 0.0880, standing: 0.4300 },
  'Other / Unknown':   { unit: 0.0860, standing: 0.4200 },
}

const SECTOR_OVERCHARGE: Record<string, number> = {
  'Hospitality / Hotel':              0.22,
  'Retail':                           0.18,
  'Office / Professional Services':   0.15,
  'Manufacturing':                    0.20,
  'Healthcare':                       0.17,
  'Property Management':              0.21,
  'Public Sector':                    0.14,
  'Other':                            0.16,
}

type Step = 1 | 2 | 3 | 4

interface FormData {
  businessName:        string
  sector:              string
  electricitySupplier: string
  electricitySpend:    string
  gasSupplier:         string
  gasSpend:            string
  telecoms:            string
  waste:               string
  insurance:           string
  fleet:               string
  banking:             string
  yearsUnaudited:      string
}

interface Results {
  totalSpend:          number
  estimatedOvercharge: number
  foxliteFee:          number
  netRecovery:         number
  byCategory:          { label: string; spend: number; overcharge: number }[]
}

const STEP_LABELS = ['Business Profile', 'Monthly Costs', 'Audit Period', 'Your Results']

export default function CalculatorPage() {
  const [step, setStep]           = useState<Step>(1)
  const [form, setForm]           = useState<FormData>({
    businessName: '', sector: '', electricitySupplier: '', electricitySpend: '',
    gasSupplier: '', gasSpend: '', telecoms: '', waste: '', insurance: '', fleet: '',
    banking: '', yearsUnaudited: '3',
  })
  const [results, setResults]     = useState<Results | null>(null)
  const [contactForm, setContact] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const n = (v: string) => parseFloat(v) || 0

  const calculate = () => {
    const sectorRate = SECTOR_OVERCHARGE[form.sector] ?? 0.16
    const years      = Math.min(Math.max(n(form.yearsUnaudited), 1), 6)

    const cats = [
      { label: 'Electricity',       spend: n(form.electricitySpend) * 12, rate: 0.19  },
      { label: 'Gas / Heating',     spend: n(form.gasSpend)          * 12, rate: 0.17  },
      { label: 'Telecoms',          spend: n(form.telecoms)          * 12, rate: 0.15  },
      { label: 'Waste Management',  spend: n(form.waste)             * 12, rate: 0.18  },
      { label: 'Insurance',         spend: n(form.insurance)         * 12, rate: 0.12  },
      { label: 'Fleet',             spend: n(form.fleet)             * 12, rate: sectorRate },
      { label: 'Banking & Finance', spend: n(form.banking)           * 12, rate: 0.14  },
    ].filter(c => c.spend > 0)

    const byCategory = cats.map(c => ({
      label:      c.label,
      spend:      c.spend * years,
      overcharge: c.spend * c.rate * years,
    }))

    const totalSpend          = byCategory.reduce((a, b) => a + b.spend,      0)
    const estimatedOvercharge = byCategory.reduce((a, b) => a + b.overcharge, 0)
    const foxliteFee          = estimatedOvercharge * 0.25
    const netRecovery         = estimatedOvercharge - foxliteFee

    setResults({ totalSpend, estimatedOvercharge, foxliteFee, netRecovery, byCategory })
    setStep(4)
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

  const pct = (part: number, total: number) =>
    total > 0 ? ((part / total) * 100).toFixed(1) : '0.0'

  const canStep1 = form.sector.length > 0
  const canStep2 = n(form.electricitySpend) > 0

  // ── shared input class ────────────────────────────────────────────────────
  const inp = 'w-full bg-[#0D1F35] border border-[rgba(196,164,78,0.2)] rounded-xl px-4 py-3.5 text-[rgba(248,246,241,0.9)] placeholder-[rgba(248,246,241,0.25)] text-[0.9rem] focus:outline-none focus:border-[#C4A44E] focus:ring-2 focus:ring-[rgba(196,164,78,0.15)] transition-all duration-200'
  const sel = `${inp} appearance-none cursor-pointer`

  return (
    <div className="min-h-screen bg-[#060D18]">

      {/* ── Hero header ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060D18] via-[#0B1A2B] to-[#0F2240]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(196,164,78,0.07),transparent)]" />
        <div className="relative z-10">
          <Section>
            <div className="text-center max-w-3xl mx-auto">
              <FadeIn>
                {/* Logo in white box */}
                <div className="inline-block bg-white rounded-xl p-2.5 shadow-[0_0_0_1px_rgba(196,164,78,0.4),0_8px_32px_rgba(0,0,0,0.5)] mb-6">
                  <Image src="/images/foxlite-logo.jpg" alt="Foxlite" width={56} height={50} className="block rounded object-contain" />
                </div>

                <SectionLabel className="justify-center">Free Savings Calculator</SectionLabel>
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  How much could your business recover?
                </h1>
                <div className="gold-rule mb-6" />
                <p className="text-[1rem] text-[rgba(248,246,241,0.6)] leading-relaxed mb-2">
                  Enter your monthly business costs below. Our forensic model estimates potential
                  overcharges based on sector benchmarks and live Irish market data.
                </p>
                <p className="text-[0.78rem] text-[rgba(248,246,241,0.35)]">
                  Results are indicative estimates. A full Foxlite forensic audit identifies the precise recoverable amount.
                </p>
              </FadeIn>
            </div>
          </Section>
        </div>
      </section>

      {/* ── Step progress bar ── */}
      {step < 4 && (
        <div className="sticky top-[76px] z-30 bg-[#060D18]/95 backdrop-blur-md border-b border-[rgba(196,164,78,0.1)]">
          <Section className="py-4">
            <div className="flex items-center gap-0 max-w-2xl mx-auto">
              {STEP_LABELS.map((label, i) => {
                const num     = i + 1
                const active  = step === num
                const done    = step >  num
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                        done   ? 'bg-[#C4A44E] border-[#C4A44E] text-[#0B1A2B]' :
                        active ? 'bg-transparent border-[#C4A44E] text-[#C4A44E]' :
                                 'bg-transparent border-[rgba(196,164,78,0.2)] text-[rgba(248,246,241,0.3)]'
                      }`}>
                        {done ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : num}
                      </div>
                      <span className={`text-[0.6rem] font-semibold uppercase tracking-wide hidden sm:block ${active ? 'text-[#C4A44E]' : done ? 'text-[rgba(196,164,78,0.6)]' : 'text-[rgba(248,246,241,0.25)]'}`}>
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`flex-1 h-px mx-2 transition-all duration-500 ${done ? 'bg-[#C4A44E]' : 'bg-[rgba(196,164,78,0.15)]'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ── Calculator body ── */}
      <section className="py-12 pb-24">
        <div className="max-w-2xl mx-auto px-5">

          {/* ╔══════════════════════════╗
              ║  STEP 1 — Business Profile ║
              ╚══════════════════════════╝ */}
          {step === 1 && (
            <FadeIn>
              <div className="card-premium p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">Business Profile</h2>
                  <p className="text-[0.85rem] text-[rgba(248,246,241,0.5)]">
                    Help us calibrate the overcharge estimate to your sector and suppliers.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[rgba(196,164,78,0.8)] mb-2">
                      Business Name <span className="text-[rgba(248,246,241,0.3)] font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <input type="text" value={form.businessName}
                      onChange={e => update('businessName', e.target.value)}
                      placeholder="e.g. Acme Ltd" className={inp} />
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[rgba(196,164,78,0.8)] mb-2">
                      Business Sector <span className="text-[#C4A44E]">*</span>
                    </label>
                    <div className="relative">
                      <select value={form.sector} onChange={e => update('sector', e.target.value)} className={sel}>
                        <option value="">— Select your sector —</option>
                        {Object.keys(SECTOR_OVERCHARGE).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(196,164,78,0.5)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[rgba(196,164,78,0.8)] mb-2">
                      Electricity Supplier
                    </label>
                    <div className="relative">
                      <select value={form.electricitySupplier} onChange={e => update('electricitySupplier', e.target.value)} className={sel}>
                        <option value="">— Select supplier —</option>
                        {Object.keys(ELECTRICITY_RATES).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(196,164,78,0.5)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[rgba(196,164,78,0.8)] mb-2">
                      Gas Supplier <span className="text-[rgba(248,246,241,0.3)] font-normal normal-case tracking-normal">(if applicable)</span>
                    </label>
                    <div className="relative">
                      <select value={form.gasSupplier} onChange={e => update('gasSupplier', e.target.value)} className={sel}>
                        <option value="">— Select supplier —</option>
                        {Object.keys(GAS_RATES).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(196,164,78,0.5)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button onClick={() => setStep(2)} disabled={!canStep1}
                    className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none">
                    Continue
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ╔══════════════════════════╗
              ║  STEP 2 — Monthly Costs    ║
              ╚══════════════════════════╝ */}
          {step === 2 && (
            <FadeIn>
              <div className="card-premium p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">Monthly Business Costs</h2>
                  <p className="text-[0.85rem] text-[rgba(248,246,241,0.5)]">
                    Enter your average monthly spend. Leave blank any category that doesn't apply.
                  </p>
                </div>

                <div className="space-y-5">
                  {([
                    { label: 'Electricity',                       field: 'electricitySpend' as keyof FormData, icon: '⚡', required: true  },
                    { label: 'Gas / Heating',                     field: 'gasSpend'          as keyof FormData, icon: '🔥', required: false },
                    { label: 'Telecoms (mobile, broadband, etc)', field: 'telecoms'          as keyof FormData, icon: '📡', required: false },
                    { label: 'Waste Collection & Disposal',       field: 'waste'             as keyof FormData, icon: '♻️', required: false },
                    { label: 'Insurance Premiums',                field: 'insurance'         as keyof FormData, icon: '🛡️', required: false },
                    { label: 'Fleet (fuel, leasing, maintenance)',field: 'fleet'             as keyof FormData, icon: '🚗', required: false },
                    { label: 'Banking Charges & Finance Fees',    field: 'banking'           as keyof FormData, icon: '💳', required: false },
                  ] as const).map(({ label, field, icon, required }) => (
                    <div key={field as string}>
                      <label className="block text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[rgba(196,164,78,0.8)] mb-1.5">
                        <span className="mr-1.5">{icon}</span>{label}
                        {required && <span className="text-[#C4A44E] ml-1">*</span>}
                        <span className="text-[rgba(248,246,241,0.3)] font-normal normal-case tracking-normal ml-1">€/month</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(196,164,78,0.6)] font-bold text-sm">€</span>
                        <input type="number" min="0" step="100" value={form[field]}
                          onChange={e => update(field, e.target.value)}
                          placeholder="0"
                          className={`${inp} !pl-8`} />
                      </div>
                    </div>
                  ))}
                </div>

                {!canStep2 && (
                  <div className="mt-5 flex items-center gap-2 bg-[rgba(196,164,78,0.08)] border border-[rgba(196,164,78,0.2)] rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-[#C4A44E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[0.8rem] text-[rgba(196,164,78,0.8)]">
                      Please enter at least your monthly electricity spend to continue.
                    </p>
                  </div>
                )}

                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-ghost !text-sm !py-2.5 !px-6">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={!canStep2}
                    className="btn-primary !text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none">
                    Continue →
                  </button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ╔══════════════════════════╗
              ║  STEP 3 — Audit Period     ║
              ╚══════════════════════════╝ */}
          {step === 3 && (
            <FadeIn>
              <div className="card-premium p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-2">Audit Lookback Period</h2>
                  <p className="text-[0.85rem] text-[rgba(248,246,241,0.5)]">
                    How many years of billing history should we review? Foxlite can typically recover overcharges going back up to 6 years.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Year selector */}
                  <div>
                    <label className="block text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[rgba(196,164,78,0.8)] mb-4">
                      Years of unaudited billing history
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map(y => (
                        <button key={y} onClick={() => update('yearsUnaudited', String(y))}
                          className={`py-3.5 rounded-xl text-center font-bold text-sm border-2 transition-all duration-200 ${
                            form.yearsUnaudited === String(y)
                              ? 'border-[#C4A44E] bg-[rgba(196,164,78,0.12)] text-[#C4A44E] shadow-[0_0_20px_rgba(196,164,78,0.2)]'
                              : 'border-[rgba(196,164,78,0.15)] text-[rgba(248,246,241,0.45)] hover:border-[rgba(196,164,78,0.4)] hover:text-[rgba(248,246,241,0.7)]'
                          }`}>
                          {y} {y === 1 ? 'Year' : 'Yrs'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="bg-[rgba(196,164,78,0.06)] border border-[rgba(196,164,78,0.2)] rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="text-xl flex-shrink-0 mt-0.5">💡</div>
                      <p className="text-[0.83rem] text-[rgba(248,246,241,0.65)] leading-relaxed">
                        Most Irish businesses have <strong className="text-white">never had a formal forensic cost audit</strong>.
                        The longer the lookback period, the greater the potential recovery. Foxlite audits
                        typically identify overcharges of{' '}
                        <strong className="text-[#C4A44E]">14–22%</strong> of total spend across energy,
                        telecoms, waste, and insurance.
                      </p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="border border-[rgba(248,246,241,0.06)] rounded-xl p-4">
                    <p className="text-[0.72rem] text-[rgba(248,246,241,0.3)] leading-relaxed">
                      <strong className="text-[rgba(248,246,241,0.45)]">Disclaimer:</strong> Estimated figures
                      are illustrative, based on sector-average overcharge rates observed in Foxlite's audit
                      portfolio. Actual recoverable amounts depend on your specific contracts, tariffs, and
                      billing history.
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-ghost !text-sm !py-2.5 !px-6">
                    ← Back
                  </button>
                  <button onClick={calculate} className="btn-primary !text-sm">
                    Calculate My Savings →
                  </button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* ╔══════════════════════════╗
              ║  STEP 4 — Results          ║
              ╚══════════════════════════╝ */}
          {step === 4 && results && (
            <FadeIn>
              {/* ── Hero result card ── */}
              <div className="rounded-2xl overflow-hidden border border-[rgba(196,164,78,0.3)] shadow-[0_30px_80px_rgba(0,0,0,0.5)] mb-5">
                {/* Gold header band */}
                <div className="bg-gradient-to-r from-[#A68A3A] via-[#C4A44E] to-[#A68A3A] p-px">
                  <div className="bg-gradient-to-br from-[#0B1A2B] to-[#0F2240] p-8 text-center">
                    <div className="eyebrow justify-center mb-3">Your Savings Estimate</div>
                    <div className="font-playfair text-5xl md:text-6xl font-bold text-gradient-gold mb-2">
                      {fmt(results.estimatedOvercharge)}
                    </div>
                    <p className="text-[rgba(248,246,241,0.55)] text-sm">
                      Estimated recoverable overcharges over {form.yearsUnaudited} year{Number(form.yearsUnaudited) > 1 ? 's' : ''}
                    </p>
                    {form.businessName && (
                      <p className="text-[#C4A44E] text-xs font-bold uppercase tracking-wider mt-2">{form.businessName}</p>
                    )}
                  </div>
                </div>

                {/* Three metric chips */}
                <div className="bg-[#060D18] grid grid-cols-3 divide-x divide-[rgba(196,164,78,0.1)]">
                  {[
                    { label: 'Total Spend Reviewed', value: fmt(results.totalSpend),          color: 'text-[rgba(248,246,241,0.7)]' },
                    { label: 'Foxlite Fee (25%)',     value: fmt(results.foxliteFee),          color: 'text-white' },
                    { label: 'Net to Your Business', value: fmt(results.netRecovery),          color: 'text-green-400' },
                  ].map(chip => (
                    <div key={chip.label} className="py-5 px-3 text-center">
                      <div className={`font-playfair text-xl font-bold ${chip.color} mb-1`}>{chip.value}</div>
                      <div className="text-[0.62rem] font-semibold uppercase tracking-wide text-[rgba(248,246,241,0.35)]">{chip.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Category breakdown ── */}
              <div className="card-premium p-7 mb-5">
                <h3 className="font-playfair text-xl font-bold text-white mb-6">Breakdown by Category</h3>
                <div className="space-y-5">
                  {results.byCategory.map(cat => (
                    <div key={cat.label}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[0.82rem] font-semibold text-[rgba(248,246,241,0.8)]">{cat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.72rem] text-[rgba(248,246,241,0.35)]">{fmt(cat.spend)}</span>
                          <span className="text-[0.85rem] font-bold text-[#C4A44E]">{fmt(cat.overcharge)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#A68A3A] to-[#D4B96A] rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(parseFloat(pct(cat.overcharge, results.estimatedOvercharge)), 100)}%` }}
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-[0.68rem] text-[rgba(248,246,241,0.3)]">
                          {pct(cat.overcharge, results.estimatedOvercharge)}% of total overcharge
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── How Foxlite recovers ── */}
              <div className="card-premium p-7 mb-5">
                <h3 className="font-playfair text-xl font-bold text-white mb-6">How Foxlite Recovers Your Money</h3>
                <div className="grid sm:grid-cols-3 gap-5">
                  {[
                    { n: '01', t: 'Free Consultation', d: 'We review your business costs at zero charge and confirm the audit scope and realistic recovery estimate.' },
                    { n: '02', t: 'Forensic Audit',    d: 'Our team conducts a detailed forensic analysis of all billing records, contracts, and tariff schedules.' },
                    { n: '03', t: 'Recovery & Fee',    d: 'We recover the overcharges on your behalf. Our fee is 25% of what we recover — nothing if we find nothing.' },
                  ].map(item => (
                    <div key={item.n} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-[rgba(196,164,78,0.1)] border border-[rgba(196,164,78,0.3)] flex items-center justify-center font-playfair font-bold text-[#C4A44E] text-sm mx-auto mb-3">
                        {item.n}
                      </div>
                      <h4 className="font-semibold text-white text-[0.85rem] mb-2">{item.t}</h4>
                      <p className="text-[0.78rem] text-[rgba(248,246,241,0.45)] leading-relaxed">{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Contact CTA ── */}
              <div className="card-premium p-8">
                {!submitted ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                        Start your free audit consultation
                      </h3>
                      <p className="text-[0.85rem] text-[rgba(248,246,241,0.5)]">
                        Based on your inputs, Foxlite may be able to recover{' '}
                        <span className="text-[#C4A44E] font-bold">{fmt(results.netRecovery)}</span> net for your
                        business. Speak with our forensic audit team to confirm.
                      </p>
                    </div>

                    <form
                      onSubmit={e => { e.preventDefault(); setSubmitted(true) }}
                      className="space-y-4"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[rgba(196,164,78,0.7)] mb-1.5">
                            Your Name <span className="text-[#C4A44E]">*</span>
                          </label>
                          <input type="text" required value={contactForm.name}
                            onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                            placeholder="Full name" className={inp} />
                        </div>
                        <div>
                          <label className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[rgba(196,164,78,0.7)] mb-1.5">
                            Email Address <span className="text-[#C4A44E]">*</span>
                          </label>
                          <input type="email" required value={contactForm.email}
                            onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@company.ie" className={inp} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[rgba(196,164,78,0.7)] mb-1.5">
                          Phone Number
                        </label>
                        <input type="tel" value={contactForm.phone}
                          onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+353 01 xxx xxxx" className={inp} />
                      </div>
                      <div>
                        <label className="block text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[rgba(196,164,78,0.7)] mb-1.5">
                          Additional Notes
                        </label>
                        <textarea rows={3} value={contactForm.message}
                          onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                          placeholder="Any additional context about your business or costs..."
                          className={`${inp} resize-none`} />
                      </div>
                      <button type="submit" className="btn-primary w-full justify-center !py-4 !text-base">
                        Send My Savings Report to Foxlite
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <p className="text-center text-[0.72rem] text-[rgba(248,246,241,0.3)]">
                        No obligation. We'll review your estimate and contact you within 1 business day.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[rgba(196,164,78,0.12)] border border-[rgba(196,164,78,0.3)] flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-[#C4A44E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-white mb-3">Thank you, {contactForm.name}!</h3>
                    <p className="text-[rgba(248,246,241,0.55)] text-[0.9rem] mb-6 max-w-sm mx-auto">
                      Your savings estimate has been sent to our forensic team. We'll be in touch within
                      1 business day to discuss next steps.
                    </p>
                    <div className="bg-[rgba(196,164,78,0.07)] border border-[rgba(196,164,78,0.2)] rounded-xl p-5 text-center mb-6">
                      <div className="font-playfair text-3xl font-bold text-[#C4A44E] mb-1">{fmt(results.netRecovery)}</div>
                      <div className="text-[0.72rem] font-bold uppercase tracking-wider text-[rgba(248,246,241,0.4)]">Estimated net recovery</div>
                    </div>
                    <Link href="/" className="btn-ghost !text-sm !py-2.5 !px-6 inline-flex">
                      Return to Homepage
                    </Link>
                  </div>
                )}
              </div>

              {/* Recalculate */}
              <div className="text-center mt-6">
                <button
                  onClick={() => { setStep(1); setResults(null); setSubmitted(false) }}
                  className="text-[0.78rem] text-[rgba(248,246,241,0.35)] hover:text-[#C4A44E] transition-colors underline underline-offset-4"
                >
                  ← Start a new calculation
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  )
}
