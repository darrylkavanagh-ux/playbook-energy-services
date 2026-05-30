import React, { useState } from 'react';
import {
  Briefcase, Building2, ChartColumn, Check, ChevronRight,
  CreditCard, Droplets, Eye, Factory, FileText, Flame,
  Globe, GraduationCap, Handshake, HardHat, HeartPulse,
  Hotel, House, Mail, Phone, Recycle, Search, Send,
  Shield, ShoppingBag, Wheat, Zap
} from 'lucide-react';

/* ─── NAV ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Services',     href: '#services'     },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Sectors',      href: '#sectors'      },
    { label: 'Pricing',      href: '#pricing'      },
    { label: 'Team',         href: '#team'         },
    { label: 'Contact',      href: '#contact'      },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-[#1a2332]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <a href="#" className="flex flex-col">
          <span className="text-white text-xl font-bold tracking-[0.15em] font-serif">FOXLITE</span>
          <span className="text-[#c9a84c] text-[10px] tracking-[0.35em] uppercase">Forensic Services</span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-white/70 hover:text-[#c9a84c] text-sm tracking-wide transition-colors duration-200">
              {l.label}
            </a>
          ))}
          <a href="#contact"
            className="bg-[#c9a84c] text-[#1a2332] px-5 py-2.5 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4b65e] transition-colors">
            Start Your Free Audit
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-[#1a2332] border-t border-white/10 px-6 pb-6">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-3 text-white/70 hover:text-[#c9a84c] text-sm tracking-wide border-b border-white/5">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="mt-4 block bg-[#c9a84c] text-[#1a2332] px-5 py-3 text-sm font-semibold tracking-wider uppercase text-center">
            Start Your Free Audit
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="bg-[#1a2332] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">
              Independent Forensic Auditing — Established 2019
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-[1.1] mb-8">
            We Find<br/>
            <span className="text-[#c9a84c]">Overcharges.</span><br/>
            You Keep the<br/>Savings.
          </h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            Specialist forensic auditors serving commercial organisations across Ireland and the United Kingdom.
            We recover historic overcharges and secure ongoing reductions across eight critical cost categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-[#c9a84c] text-[#1a2332] px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4b65e] transition-colors">
              Start Your Free Audit
              <ChevronRight className="w-4 h-4"/>
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-medium tracking-wide hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors">
              How It Works
            </a>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
          {[
            { value: '25%', label: 'Of rebate + first year\'s savings' },
            { value: '6yr',  label: 'Retrospective recovery period' },
            { value: '8',    label: 'Specialist audit categories' },
            { value: '£0',   label: 'Upfront cost — ever' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-serif font-bold text-[#c9a84c] mb-2">{s.value}</div>
              <div className="text-white/50 text-sm leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROBLEM BANNER ──────────────────────────────────────────────────────── */
function ProblemBanner() {
  const problems = [
    'Incorrect tariff rates applied after contract renewals',
    'Estimated billing overriding actual meter readings',
    'Insurance premiums inflated through price walking',
    'VAT applied incorrectly or at wrong rates',
    'Standing charges, capacity charges, and levies miscalculated',
  ];
  return (
    <section className="bg-[#faf8f3] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c9a84c]"/>
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">The Problem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2332] leading-tight mb-6">
              Businesses lose millions to hidden overcharges every year.
            </h2>
            <p className="text-[#1a2332]/60 text-lg leading-relaxed">
              Suppliers make errors. Contracts are misapplied. Tariffs change without notice.
              Most businesses never find out — because they don't have the expertise to look.
            </p>
          </div>
          <div className="space-y-4">
            {problems.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-white border-l-2 border-[#c9a84c]">
                <Search className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0"/>
                <span className="text-[#1a2332]/70 text-sm leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ────────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: Zap,
    name: 'Electricity',
    tagline: 'Tariff verification, standing charge audits, capacity charge reviews, meter reading validation, PSO levy checks, DUoS/TUoS analysis.',
  },
  {
    icon: Flame,
    name: 'Gas',
    tagline: 'Unit rate forensics, carbon tax verification, meter accuracy, estimated vs actual billing, contract compliance, supplier switching analysis.',
  },
  {
    icon: Droplets,
    name: 'Water & Wastewater',
    tagline: 'Volumetric charge audits, standing charge reviews, trade effluent assessments, surface water drainage, meter calibration verification.',
  },
  {
    icon: Recycle,
    name: 'Waste Management',
    tagline: 'Collection frequency optimisation, weight-based vs volume billing, contamination charges, landfill tax verification, recycling credit recovery.',
  },
  {
    icon: Globe,
    name: 'Telecoms',
    tagline: 'Business line audits, broadband cost optimisation, mobile fleet management, SIP/VoIP migration analysis, call charge verification.',
  },
  {
    icon: Shield,
    name: 'Insurance',
    tagline: 'Premium forensic review, price walking detection, broker performance assessment, coverage gap analysis, claims history optimisation.',
  },
  {
    icon: CreditCard,
    name: 'Merchant Services',
    tagline: 'Card processing fee audits, interchange+ optimisation, PCI compliance cost review, terminal rental assessments, chargeback analysis.',
  },
  {
    icon: Building2,
    name: 'Business Rates',
    tagline: 'Business rates appeals, rateable value assessments, transitional relief checks, empty property relief, small business rate reviews.',
  },
];

function Services() {
  return (
    <section id="services" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Our Services</span>
            <span className="h-px w-8 bg-[#c9a84c]"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2332] mb-4">
            Eight specialist audit categories.
          </h2>
          <p className="text-[#1a2332]/50 text-lg">One forensic standard.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <div key={i} className="p-6 border border-[#1a2332]/10 hover:border-[#c9a84c] transition-colors group">
              <div className="w-10 h-10 bg-[#c9a84c]/10 flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/20 transition-colors">
                <s.icon className="w-5 h-5 text-[#c9a84c]"/>
              </div>
              <h3 className="font-serif font-bold text-[#1a2332] text-lg mb-3">{s.name}</h3>
              <p className="text-[#1a2332]/55 text-sm leading-relaxed">{s.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ────────────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: FileText,
    title: 'Initial Review',
    desc: 'Send us a sample of your recent bills. We conduct a preliminary assessment to identify potential overcharges and estimate your likely recovery.',
  },
  {
    icon: Handshake,
    title: 'Letter of Authority',
    desc: 'One simple document authorising us to request your billing data directly from suppliers on your behalf. No disruption to your operations.',
  },
  {
    icon: Eye,
    title: 'Data Collection',
    desc: 'We request complete billing histories for the full six-year statutory recovery period. All data handling is fully GDPR compliant.',
  },
  {
    icon: Search,
    title: 'Forensic Analysis',
    desc: 'Line-by-line examination of every bill, cross-referencing tariff rates, contract terms, and regulatory requirements to identify every overcharge.',
  },
  {
    icon: Send,
    title: 'Recovery & Negotiation',
    desc: 'We submit formal claims to each supplier, handle all correspondence, escalation, and regulatory complaints to maximise your recovery.',
  },
  {
    icon: ChartColumn,
    title: 'Ongoing Monitoring',
    desc: 'After recovery, we continue to monitor your accounts to capture future savings and prevent new overcharges from occurring.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#1a2332] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Our Process</span>
            <span className="h-px w-8 bg-[#c9a84c]"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Six steps to recovered savings.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="relative p-8 border border-white/10 hover:border-[#c9a84c]/40 transition-colors">
              <div className="absolute top-6 right-6 text-white/10 font-serif text-5xl font-bold leading-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="w-10 h-10 bg-[#c9a84c]/10 flex items-center justify-center mb-6">
                <s.icon className="w-5 h-5 text-[#c9a84c]"/>
              </div>
              <h3 className="font-serif font-bold text-white text-xl mb-3">{s.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTORS ─────────────────────────────────────────────────────────────── */
const SECTORS = [
  { icon: Hotel,        name: 'Hospitality',           desc: 'Hotels, restaurants, pubs, and leisure facilities with high energy consumption and complex tariff structures.' },
  { icon: ShoppingBag,  name: 'Retail',                desc: 'Multi-site retailers, shopping centres, and convenience stores with aggregated billing opportunities.' },
  { icon: HeartPulse,   name: 'Healthcare',            desc: 'Hospitals, clinics, nursing homes, and dental practices operating 24/7 with critical energy needs.' },
  { icon: GraduationCap,name: 'Education',             desc: 'Schools, colleges, universities, and training centres with seasonal usage patterns.' },
  { icon: Factory,      name: 'Manufacturing',         desc: 'Production facilities with high-demand energy contracts, maximum demand charges, and power factor penalties.' },
  { icon: House,        name: 'Property Management',   desc: 'Commercial landlords, managing agents, and co-working spaces with shared utility infrastructure.' },
  { icon: HardHat,      name: 'Construction',          desc: 'Building contractors, developers, and project managers with temporary supply connections.' },
  { icon: Briefcase,    name: 'Professional Services', desc: 'Law firms, accountancy practices, financial services, and consultancies with multiple office locations.' },
  { icon: Wheat,        name: 'Agriculture & Food',    desc: 'Farms, food processing facilities, and agricultural businesses with high energy and water consumption.' },
];

function Sectors() {
  return (
    <section id="sectors" className="bg-[#faf8f3] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Who We Help</span>
            <span className="h-px w-8 bg-[#c9a84c]"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2332] mb-6">
            Serving commercial organisations across every sector.
          </h2>
          <p className="text-[#1a2332]/55 text-lg max-w-2xl mx-auto">
            Our methodology scales across industries. Whether you operate a single site or a national portfolio,
            our forensic approach adapts to your billing complexity.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTORS.map((s, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-white border border-[#1a2332]/8 hover:border-[#c9a84c]/40 transition-colors">
              <div className="w-9 h-9 bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-[#c9a84c]"/>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a2332] mb-1">{s.name}</h3>
                <p className="text-[#1a2332]/55 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─────────────────────────────────────────────────────────────── */
const PRICING_INCLUDES = [
  'No upfront fees — ever',
  'Free initial review with no obligation',
  'Six-year retrospective recovery included',
  'All eight audit categories covered',
  'Ongoing monitoring at no additional cost',
  'Full supplier negotiation and recovery handled',
  'Maximum three-year engagement period',
];

function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Pricing</span>
            <span className="h-px w-8 bg-[#c9a84c]"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2332] mb-4">
            No savings, no fee.
          </h2>
          <p className="text-[#1a2332]/55 text-lg max-w-xl mx-auto">
            Our interests are perfectly aligned with yours. We take 25% of the rebate recovered
            and 25% of the first year's savings. We only earn when you save.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-[#1a2332] p-10">
            <h3 className="font-serif font-bold text-white text-2xl mb-2">Simple, Transparent Pricing</h3>
            <p className="text-white/50 text-sm mb-8">Two simple components:</p>
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6">
                <div className="text-4xl font-serif font-bold text-[#c9a84c] mb-1">25%</div>
                <div className="text-white/70 text-sm">of the rebate</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-[#c9a84c] mb-1">25%</div>
                <div className="text-white/70 text-sm">of the first year's savings</div>
              </div>
            </div>
            <p className="mt-8 text-white/40 text-xs leading-relaxed">
              If we find nothing, you owe nothing. Zero risk to your business.
            </p>
          </div>
          <div className="bg-[#faf8f3] p-10">
            <h3 className="font-serif font-bold text-[#1a2332] text-xl mb-6">Everything included:</h3>
            <ul className="space-y-3">
              {PRICING_INCLUDES.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#1a2332]/70">
                  <Check className="w-4 h-4 text-[#c9a84c] shrink-0"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TEAM ────────────────────────────────────────────────────────────────── */
function Team() {
  return (
    <section id="team" className="bg-[#1a2332] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#c9a84c]"/>
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Our Team</span>
            <span className="h-px w-8 bg-[#c9a84c]"/>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Over 100 years combined experience.
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Our forensic auditors combine decades of hands-on industry expertise with advanced analytical
            methodologies to uncover every overcharge.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase">
            <Shield className="w-3 h-3"/>
            VERITECH CERTIFIED • HUMAN-LED, AI-ASSISTED METHODOLOGY
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'David Clarke',
              title: 'Managing Director',
              phone: '+353 86 027 6700',
              email: 'David@foxliteforensics.com',
              bio: "Over 30 years' experience in hospitality, maintenance services, and commercial property management. David brings an operator's understanding of where the real costs hide — and how suppliers exploit complexity to overcharge.",
            },
            {
              name: 'Derek Dunphy',
              title: 'Head of Sales Development',
              phone: '+353 89 656 9838',
              email: 'Derek@foxliteforensics.com',
              bio: 'Extensive background in client relationship management and business development. Derek ensures every client receives a tailored approach and clear communication throughout the audit and recovery process.',
            },
          ].map((p, i) => (
            <div key={i} className="border border-white/10 p-8 hover:border-[#c9a84c]/40 transition-colors">
              <div className="w-14 h-14 bg-[#c9a84c]/10 flex items-center justify-center mb-6">
                <span className="text-[#c9a84c] font-serif font-bold text-xl">{p.name[0]}</span>
              </div>
              <h3 className="font-serif font-bold text-white text-xl mb-1">{p.name}</h3>
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">{p.title}</p>
              <p className="text-white/55 text-sm leading-relaxed mb-6">{p.bio}</p>
              <div className="space-y-2">
                <a href={`tel:${p.phone.replace(/\s/g,'')}`}
                  className="flex items-center gap-2 text-white/50 hover:text-[#c9a84c] text-sm transition-colors">
                  <Phone className="w-3.5 h-3.5"/>{p.phone}
                </a>
                <a href={`mailto:${p.email}`}
                  className="flex items-center gap-2 text-white/50 hover:text-[#c9a84c] text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5"/>{p.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────────────────────── */
const SECTORS_LIST = [
  'Hospitality','Retail','Healthcare','Education','Manufacturing',
  'Property Management','Construction','Professional Services','Agriculture & Food','Other',
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', company:'', sector:'', message:'' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contact" className="bg-[#faf8f3] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-[#c9a84c]"/>
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium">Get Started</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a2332] mb-6">
              Stop paying more than you should.
              <span className="block text-[#c9a84c]">Start recovering what's yours.</span>
            </h2>
            <p className="text-[#1a2332]/60 text-lg leading-relaxed mb-8">
              Your initial review is free, confidential, and carries no obligation.
              Most clients see results within 90 days.
            </p>
            <div className="space-y-4">
              <h3 className="font-semibold text-[#1a2332]">Contact Our Team</h3>
              <p className="text-[#1a2332]/55 text-sm leading-relaxed">
                Whether you manage a single site or a portfolio of properties, we welcome your enquiry.
                The initial assessment is provided at no cost and with no obligation.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { icon: Mail,  text: 'David@foxliteforensics.com', href: 'mailto:David@foxliteforensics.com' },
                  { icon: Mail,  text: 'Derek@foxliteforensics.com', href: 'mailto:Derek@foxliteforensics.com' },
                  { icon: Phone, text: 'David Clarke: +353 86 027 6700', href: 'tel:+353860276700' },
                  { icon: Phone, text: 'Derek Dunphy: +353 89 656 9838', href: 'tel:+353896569838' },
                ].map((c, i) => (
                  <a key={i} href={c.href}
                    className="flex items-center gap-3 text-[#1a2332]/60 hover:text-[#c9a84c] text-sm transition-colors">
                    <c.icon className="w-4 h-4 shrink-0"/>
                    {c.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white p-8 border border-[#1a2332]/8">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 bg-[#c9a84c]/10 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-[#c9a84c]"/>
                </div>
                <h3 className="font-serif font-bold text-[#1a2332] text-xl mb-2">Enquiry Received</h3>
                <p className="text-[#1a2332]/55 text-sm">
                  Thank you. A member of our team will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif font-bold text-[#1a2332] text-xl mb-6">Request Your Free Audit</h3>
                {[
                  { id:'name',    label:'Full Name',      type:'text',  required:true  },
                  { id:'email',   label:'Email Address',  type:'email', required:true  },
                  { id:'company', label:'Company Name',   type:'text',  required:true  },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="block text-xs font-medium text-[#1a2332]/60 tracking-wide uppercase mb-1.5">
                      {f.label}
                    </label>
                    <input id={f.id} type={f.type} required={f.required}
                      value={(form as any)[f.id]}
                      onChange={e => setForm(prev => ({...prev, [f.id]: e.target.value}))}
                      className="w-full border border-[#1a2332]/15 px-4 py-3 text-sm text-[#1a2332] focus:outline-none focus:border-[#c9a84c] transition-colors bg-[#faf8f3]"/>
                  </div>
                ))}
                <div>
                  <label htmlFor="sector" className="block text-xs font-medium text-[#1a2332]/60 tracking-wide uppercase mb-1.5">
                    Select your sector
                  </label>
                  <select id="sector"
                    value={form.sector}
                    onChange={e => setForm(prev => ({...prev, sector: e.target.value}))}
                    className="w-full border border-[#1a2332]/15 px-4 py-3 text-sm text-[#1a2332] focus:outline-none focus:border-[#c9a84c] transition-colors bg-[#faf8f3]">
                    <option value="">Select your sector</option>
                    {SECTORS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-[#1a2332]/60 tracking-wide uppercase mb-1.5">
                    Message (Optional)
                  </label>
                  <textarea id="message" rows={4}
                    value={form.message}
                    onChange={e => setForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Tell us about your business and what you'd like audited..."
                    className="w-full border border-[#1a2332]/15 px-4 py-3 text-sm text-[#1a2332] focus:outline-none focus:border-[#c9a84c] transition-colors bg-[#faf8f3] resize-none"/>
                </div>
                <button type="submit"
                  className="w-full bg-[#1a2332] text-white py-4 text-sm font-semibold tracking-wider uppercase hover:bg-[#c9a84c] hover:text-[#1a2332] transition-colors">
                  Request Free Audit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#1a2332] border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-white text-lg font-bold tracking-[0.15em] font-serif">FOXLITE</span>
              <span className="text-[#c9a84c] text-[10px] tracking-[0.35em] uppercase">Forensic Services</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Foxlite Forensic Services — Independent forensic auditing firm established in 2019.
              Specialised in identifying and recovering business cost overcharges across Ireland and the United Kingdom.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {['Electricity','Gas','Water & Wastewater','Waste Management','Telecoms','Insurance','Merchant Services','Business Rates'].map(s => (
              <a key={s} href="#services"
                className="text-white/40 hover:text-[#c9a84c] text-xs transition-colors">{s} Audits</a>
            ))}
          </div>
          <div className="space-y-2">
            <a href="mailto:David@foxliteforensics.com"
              className="flex items-center gap-2 text-white/40 hover:text-[#c9a84c] text-xs transition-colors">
              <Mail className="w-3 h-3"/>David@foxliteforensics.com
            </a>
            <a href="mailto:Derek@foxliteforensics.com"
              className="flex items-center gap-2 text-white/40 hover:text-[#c9a84c] text-xs transition-colors">
              <Mail className="w-3 h-3"/>Derek@foxliteforensics.com
            </a>
            <a href="tel:+353860276700"
              className="flex items-center gap-2 text-white/40 hover:text-[#c9a84c] text-xs transition-colors">
              <Phone className="w-3 h-3"/>+353 86 027 6700
            </a>
            <a href="tel:+353896569838"
              className="flex items-center gap-2 text-white/40 hover:text-[#c9a84c] text-xs transition-colors">
              <Phone className="w-3 h-3"/>+353 89 656 9838
            </a>
            <p className="text-white/25 text-xs pt-1">www.foxliteforensics.com</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs">© 2026 Foxlite Forensic Services. All rights reserved.</p>
          <p className="text-white/25 text-xs">VeriTech Certified • Human-Led, AI-Assisted Methodology</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ─────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Nav/>
      <Hero/>
      <ProblemBanner/>
      <Services/>
      <HowItWorks/>
      <Sectors/>
      <Pricing/>
      <Team/>
      <Contact/>
      <Footer/>
    </>
  );
}
