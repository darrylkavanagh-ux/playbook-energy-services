import type { Metadata } from 'next'
import { Section, SectionLabel, SectionTitle, GoldRule } from '@/components/Section'
import { FadeIn } from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Privacy Policy | Foxlite Forensic Services',
  description: 'Privacy Policy for Foxlite Forensic Services. Learn how we collect, use, and protect your personal data in compliance with GDPR.',
  robots: 'index, follow',
}

const lastUpdated = '7 May 2026'
const controllerEmail = 'privacy@foxlite.ie'
const controllerAddress = 'Foxlite Forensic Services, Dublin, Ireland'
const dpoEmail = 'dpo@foxlite.ie'

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy text-white">
        <Section>
          <div className="text-center">
            <FadeIn>
              <SectionLabel className="text-gold">Legal</SectionLabel>
              <SectionTitle className="text-white">Privacy Policy</SectionTitle>
              <GoldRule className="mb-8" />
              <p className="text-xl text-greyLight max-w-3xl mx-auto leading-relaxed">
                Foxlite Forensic Services is committed to protecting your personal data
                and respecting your privacy rights under the EU General Data Protection
                Regulation (GDPR) and the Irish Data Protection Acts 1988–2018.
              </p>
              <p className="mt-4 text-sm text-greyLight">Last updated: {lastUpdated}</p>
            </FadeIn>
          </div>
        </Section>
      </section>

      {/* Policy Content */}
      <section className="py-20 bg-white">
        <Section>
          <div className="max-w-4xl mx-auto prose prose-lg">

            {/* 1. Data Controller */}
            <FadeIn>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  1. Data Controller
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed">
                  The data controller responsible for your personal information is:
                </p>
                <div className="bg-cream rounded-lg p-6 mt-4 border-l-4 border-gold">
                  <p className="font-semibold text-navy">Foxlite Forensic Services</p>
                  <p className="text-textMid">{controllerAddress}</p>
                  <p className="text-textMid">
                    Email:{' '}
                    <a href={`mailto:${controllerEmail}`} className="text-gold hover:underline">
                      {controllerEmail}
                    </a>
                  </p>
                  <p className="text-textMid mt-2">
                    Data Protection Officer:{' '}
                    <a href={`mailto:${dpoEmail}`} className="text-gold hover:underline">
                      {dpoEmail}
                    </a>
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* 2. Data We Collect */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  2. Personal Data We Collect
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  We collect and process the following categories of personal data:
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Identity Data',
                      desc: 'Full name, job title, company name, and professional qualifications.',
                    },
                    {
                      title: 'Contact Data',
                      desc: 'Email address, telephone number, and postal address.',
                    },
                    {
                      title: 'Financial & Billing Data',
                      desc: 'Invoice records, billing statements, meter readings, and utility account references submitted for audit purposes.',
                    },
                    {
                      title: 'Technical Data',
                      desc: 'IP address, browser type and version, time zone, browser plug-in types, operating system, and platform collected via cookies and analytics.',
                    },
                    {
                      title: 'Usage Data',
                      desc: 'Information about how you use our website, including pages visited, referral sources, and session duration.',
                    },
                    {
                      title: 'Communications Data',
                      desc: 'Emails, messages, and correspondence you send us through our contact form or directly.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start space-x-4 bg-offWhite rounded-lg p-4">
                      <div className="text-gold text-lg mt-0.5">▸</div>
                      <div>
                        <span className="font-semibold text-navy">{item.title}: </span>
                        <span className="text-textMid">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-textMid mt-4 leading-relaxed">
                  We do <strong>not</strong> collect any special categories of personal data (e.g. health,
                  biometric, racial or ethnic origin data) unless specifically required for a forensic
                  engagement and with your explicit written consent.
                </p>
              </div>
            </FadeIn>

            {/* 3. How We Use Your Data */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  3. How We Use Your Personal Data
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  We use your personal data only where we have a lawful basis to do so under Article 6 GDPR:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="p-3 text-left rounded-tl-lg">Purpose</th>
                        <th className="p-3 text-left">Lawful Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Deliver forensic audit services', 'Performance of a contract (Art. 6(1)(b))'],
                        ['Respond to enquiries and contact form submissions', 'Legitimate interests (Art. 6(1)(f))'],
                        ['Send service updates and engagement communications', 'Legitimate interests / consent'],
                        ['Comply with legal and regulatory obligations', 'Legal obligation (Art. 6(1)(c))'],
                        ['Analyse website usage via analytics cookies', 'Consent (Art. 6(1)(a))'],
                        ['Fraud prevention and platform security', 'Legitimate interests (Art. 6(1)(f))'],
                        ['Improve our services and user experience', 'Legitimate interests (Art. 6(1)(f))'],
                      ].map(([purpose, basis], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-cream' : 'bg-white'}>
                          <td className="p-3 text-textMid">{purpose}</td>
                          <td className="p-3 text-textMid font-medium">{basis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>

            {/* 4. Data Retention */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  4. Data Retention
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  We retain personal data only for as long as necessary for the purposes set out in this policy:
                </p>
                <div className="space-y-3">
                  {[
                    ['Client audit files and billing records', '7 years (Irish Revenue / GDPR balancing test)'],
                    ['Contact form enquiries', '2 years from last contact'],
                    ['Legal correspondence and dispute records', '7 years from resolution'],
                    ['Website analytics (anonymised)', '26 months (Google Analytics default)'],
                    ['Marketing communications consent records', 'Until consent withdrawn + 1 year'],
                  ].map(([type, period], i) => (
                    <div key={i} className="flex items-start justify-between bg-cream rounded-lg p-4">
                      <span className="text-textMid font-medium">{type}</span>
                      <span className="text-gold text-sm font-semibold ml-4 text-right whitespace-nowrap">{period}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 5. Data Sharing */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  5. Sharing Your Personal Data
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  We do not sell, rent, or trade your personal data. We may share data with:
                </p>
                <ul className="space-y-3 text-textMid">
                  {[
                    'Service providers acting as data processors (e.g. cloud hosting, email delivery) under binding data processing agreements',
                    'Professional advisors including solicitors and accountants under obligations of confidentiality',
                    'Regulatory authorities (e.g. the Data Protection Commission, Revenue Commissioners) where required by law',
                    'Courts, law enforcement or government agencies where legally required or to protect our legal rights',
                    'A buyer or successor entity in the event of a business transfer, subject to equivalent data protection obligations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="text-gold mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-textMid mt-4 leading-relaxed">
                  Any international transfers outside the EEA are governed by Standard Contractual Clauses
                  (SCCs) approved by the European Commission under GDPR Chapter V.
                </p>
              </div>
            </FadeIn>

            {/* 6. Cookies */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  6. Cookies &amp; Tracking Technologies
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  Our website uses cookies in accordance with the EU ePrivacy Directive and GDPR.
                  A cookie consent banner allows you to accept, reject, or customise non-essential cookies
                  on your first visit.
                </p>
                <div className="space-y-3">
                  {[
                    ['Strictly Necessary', 'Essential for the website to function. Cannot be disabled.', 'No consent required'],
                    ['Analytics', 'Help us understand how visitors use the site (e.g. Google Analytics 4).', 'Consent required'],
                    ['Functional', 'Remember your preferences and settings.', 'Consent required'],
                    ['Marketing', 'Used to deliver relevant advertising. We currently use none.', 'Consent required'],
                  ].map(([type, desc, consent]) => (
                    <div key={type} className="bg-cream rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-navy">{type}</span>
                        <span className="text-xs text-gold font-medium bg-navy/10 px-2 py-0.5 rounded">{consent}</span>
                      </div>
                      <p className="text-textMid text-sm">{desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-textMid mt-4">
                  You can withdraw your consent at any time by clicking <strong>"Cookie Settings"</strong> in the
                  footer, or by clearing cookies in your browser settings.
                </p>
              </div>
            </FadeIn>

            {/* 7. Your Rights */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  7. Your Rights Under GDPR
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  Under the GDPR and the Irish Data Protection Act 2018, you have the following rights:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['Right of Access (Art. 15)', 'Request a copy of all personal data we hold about you.'],
                    ['Right to Rectification (Art. 16)', 'Request correction of inaccurate or incomplete data.'],
                    ['Right to Erasure (Art. 17)', 'Request deletion of your data where no legitimate purpose remains.'],
                    ['Right to Restriction (Art. 18)', 'Request we restrict processing in certain circumstances.'],
                    ['Right to Data Portability (Art. 20)', 'Receive your data in a structured, machine-readable format.'],
                    ['Right to Object (Art. 21)', 'Object to processing based on legitimate interests or direct marketing.'],
                    ['Right to Withdraw Consent', 'Withdraw consent at any time where processing is consent-based.'],
                    ['Right to Lodge a Complaint', 'Lodge a complaint with the Data Protection Commission (dataprotection.ie).'],
                  ].map(([title, desc]) => (
                    <div key={title} className="bg-cream rounded-lg p-4 border-l-4 border-gold">
                      <h4 className="font-semibold text-navy text-sm mb-1">{title}</h4>
                      <p className="text-textMid text-sm">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-navy text-white rounded-lg p-6">
                  <p className="font-semibold text-gold mb-2">How to Exercise Your Rights</p>
                  <p className="text-greyLight text-sm">
                    Submit a written request to{' '}
                    <a href={`mailto:${controllerEmail}`} className="text-gold hover:underline">
                      {controllerEmail}
                    </a>
                    . We will respond within <strong>30 days</strong> in accordance with Article 12 GDPR.
                    Identity verification may be required before we process your request.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* 8. Security */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  8. Data Security
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed">
                  We implement appropriate technical and organisational measures to protect your personal data
                  against unauthorised access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="mt-4 space-y-2 text-textMid">
                  {[
                    'TLS/HTTPS encryption for all data in transit',
                    'Access controls and role-based authentication (RBAC)',
                    'Audit logging of all access to sensitive data',
                    'Regular security reviews and staff data protection training',
                    'Secure evidence handling protocols aligned with chain-of-custody requirements',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <span className="text-gold mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-textMid mt-4">
                  In the event of a personal data breach, we will notify the Data Protection Commission
                  within <strong>72 hours</strong> and affected individuals without undue delay, as required
                  by Article 33–34 GDPR.
                </p>
              </div>
            </FadeIn>

            {/* 9. Third-Party Links */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  9. Third-Party Links
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed">
                  Our website may contain links to third-party websites. This Privacy Policy does not apply
                  to those sites. We encourage you to review the privacy policies of any third-party sites
                  you visit. We are not responsible for the privacy practices of external websites.
                </p>
              </div>
            </FadeIn>

            {/* 10. Changes */}
            <FadeIn delay={100}>
              <div className="mb-12">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  10. Changes to This Policy
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed">
                  We may update this Privacy Policy from time to time. Material changes will be notified
                  via a notice on our website or by direct communication where appropriate. The date at the
                  top of this page reflects the most recent revision.
                </p>
              </div>
            </FadeIn>

            {/* 11. Contact */}
            <FadeIn delay={100}>
              <div className="mb-4">
                <h2 className="font-playfair text-2xl font-bold text-navy mb-4">
                  11. Contact Us
                </h2>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <p className="text-textMid leading-relaxed mb-4">
                  For any questions, concerns, or requests relating to this Privacy Policy or your personal data:
                </p>
                <div className="bg-cream rounded-lg p-6 border-l-4 border-gold">
                  <p className="font-semibold text-navy mb-2">Foxlite Forensic Services — Data Protection</p>
                  <p className="text-textMid">{controllerAddress}</p>
                  <p className="text-textMid">
                    General:{' '}
                    <a href={`mailto:${controllerEmail}`} className="text-gold hover:underline">
                      {controllerEmail}
                    </a>
                  </p>
                  <p className="text-textMid">
                    Data Protection Officer:{' '}
                    <a href={`mailto:${dpoEmail}`} className="text-gold hover:underline">
                      {dpoEmail}
                    </a>
                  </p>
                  <p className="text-textMid mt-3 text-sm">
                    You also have the right to lodge a complaint with the{' '}
                    <a
                      href="https://www.dataprotection.ie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      Data Protection Commission
                    </a>{' '}
                    (dataprotection.ie) at any time.
                  </p>
                </div>
              </div>
            </FadeIn>

          </div>
        </Section>
      </section>
    </>
  )
}
