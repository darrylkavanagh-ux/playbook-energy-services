'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookiePreferences {
  analytics: boolean
  functional: boolean
}

const CONSENT_KEY = 'foxlite_cookie_consent'
const CONSENT_VERSION = 'v1'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [prefs, setPrefs] = useState<CookiePreferences>({
    analytics: false,
    functional: false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY)
      if (!stored) {
        // Slight delay so the page renders first
        const timer = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(timer)
      }
      const parsed = JSON.parse(stored)
      if (parsed.version !== CONSENT_VERSION) {
        // Re-prompt if policy version has changed
        setTimeout(() => setVisible(true), 800)
      }
    } catch {
      setTimeout(() => setVisible(true), 800)
    }
  }, [])

  const saveConsent = (accepted: CookiePreferences | 'all' | 'none') => {
    const resolved: CookiePreferences =
      accepted === 'all'
        ? { analytics: true, functional: true }
        : accepted === 'none'
        ? { analytics: false, functional: false }
        : accepted

    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ version: CONSENT_VERSION, preferences: resolved, timestamp: new Date().toISOString() })
    )
    setVisible(false)
    setShowPreferences(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
    >
      <div className="max-w-5xl mx-auto bg-white border border-greyLight shadow-2xl rounded-2xl overflow-hidden">
        {!showPreferences ? (
          /* ── Main Banner ── */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">🍪</span>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h2 className="font-playfair text-lg font-bold text-navy mb-1">
                We use cookies
              </h2>
              <p className="text-textMid text-sm leading-relaxed">
                We use strictly necessary cookies to make our site work, and optional analytics cookies
                to understand how you use it. By clicking{' '}
                <strong className="text-navy">&ldquo;Accept All&rdquo;</strong>, you consent to all cookies.
                See our{' '}
                <Link href="/privacy" className="text-gold underline hover:text-goldDark transition-colors">
                  Privacy Policy
                </Link>{' '}
                for full details.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col xs:flex-row sm:flex-col lg:flex-row gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => saveConsent('all')}
                className="bg-gold text-navy font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-goldDark transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent('none')}
                className="bg-transparent border border-navy/30 text-navy font-medium text-sm px-5 py-2.5 rounded-lg hover:border-navy transition-colors whitespace-nowrap"
              >
                Reject Optional
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="bg-transparent text-textLight font-medium text-sm px-5 py-2.5 rounded-lg hover:text-navy transition-colors whitespace-nowrap"
              >
                Customise
              </button>
            </div>
          </div>
        ) : (
          /* ── Preferences Panel ── */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-navy">Cookie Preferences</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-textLight hover:text-navy transition-colors text-sm"
                aria-label="Back to cookie banner"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Strictly Necessary — always on */}
              <div className="flex items-start justify-between p-4 bg-cream rounded-xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-navy text-sm">Strictly Necessary</span>
                    <span className="text-xs bg-navy text-white px-2 py-0.5 rounded-full">Always Active</span>
                  </div>
                  <p className="text-textMid text-xs leading-relaxed">
                    Essential for the website to function. These cookies cannot be disabled.
                    They include session management and security tokens.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-6 bg-navy rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between p-4 bg-cream rounded-xl">
                <div className="flex-1 pr-4">
                  <span className="font-semibold text-navy text-sm block mb-1">Analytics</span>
                  <p className="text-textMid text-xs leading-relaxed">
                    Help us understand how visitors use our site (e.g. Google Analytics 4).
                    Data is anonymised and used only to improve the user experience.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs.analytics}
                  onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                  className={`flex-shrink-0 w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    prefs.analytics ? 'bg-gold justify-end' : 'bg-greyLight justify-start'
                  }`}
                  aria-label="Toggle analytics cookies"
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                </button>
              </div>

              {/* Functional */}
              <div className="flex items-start justify-between p-4 bg-cream rounded-xl">
                <div className="flex-1 pr-4">
                  <span className="font-semibold text-navy text-sm block mb-1">Functional</span>
                  <p className="text-textMid text-xs leading-relaxed">
                    Remember your preferences, such as language settings and form auto-fill,
                    to improve your experience on return visits.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs.functional}
                  onClick={() => setPrefs((p) => ({ ...p, functional: !p.functional }))}
                  className={`flex-shrink-0 w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                    prefs.functional ? 'bg-gold justify-end' : 'bg-greyLight justify-start'
                  }`}
                  aria-label="Toggle functional cookies"
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => saveConsent(prefs)}
                className="flex-1 bg-gold text-navy font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-goldDark transition-colors"
              >
                Save My Preferences
              </button>
              <button
                onClick={() => saveConsent('all')}
                className="flex-1 bg-navy text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-midNavy transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => saveConsent('none')}
                className="flex-1 border border-navy/30 text-navy font-medium text-sm px-5 py-2.5 rounded-lg hover:border-navy transition-colors"
              >
                Reject Optional
              </button>
            </div>

            <p className="text-textFaint text-xs mt-4 text-center">
              You can change your preferences at any time via the "Cookie Settings" link in the footer.{' '}
              <Link href="/privacy#cookies" className="text-gold hover:underline">
                Learn more
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
