import React from "react";
import { Link } from "wouter";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-block bg-[#FFD700] border-4 border-black px-4 py-2 font-mono font-bold uppercase mb-6 w-fit neo-shadow">
            v2.0 MVP Live
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter">
            Stop <br/>
            <span className="bg-black text-white px-4 decoration-slice">Overpaying</span> <br/>
            For Energy
          </h1>
          <p className="text-xl md:text-2xl font-mono mb-10 max-w-2xl border-l-8 border-[#FFD700] pl-6 py-2">
            The energy market is designed to confuse you. We use 12 precision engines to dismantle your bill and find the truth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/analyze">
              <a className="neo-button text-center text-xl">
                Analyze My Bill
              </a>
            </Link>
            <Link href="/tariffs">
              <a className="bg-white text-black font-bold uppercase tracking-wider border-4 border-black px-6 py-3 neo-shadow transition-all hover:bg-black hover:text-white neo-shadow-hover active:neo-shadow-active text-center text-xl">
                View Live Rates
              </a>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <div className="aspect-square bg-black border-4 border-black relative overflow-hidden neo-shadow flex items-center justify-center">
            {/* Platform hero graphic — energy meter visualization */}
            <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="400" fill="#111"/>
              <circle cx="200" cy="200" r="150" stroke="#FFD700" strokeWidth="4" strokeDasharray="8 4"/>
              <circle cx="200" cy="200" r="100" stroke="#FFD700" strokeWidth="2"/>
              <text x="200" y="190" textAnchor="middle" fill="#FFD700" fontSize="48" fontFamily="monospace" fontWeight="bold">⚡</text>
              <text x="200" y="240" textAnchor="middle" fill="#FFD700" fontSize="14" fontFamily="monospace">ENERGY AUDIT</text>
              <text x="200" y="262" textAnchor="middle" fill="#999" fontSize="11" fontFamily="monospace">12 ENGINES ACTIVE</text>
              <line x1="60" y1="340" x2="340" y2="340" stroke="#FFD700" strokeWidth="1" strokeOpacity="0.3"/>
              {[0,1,2,3,4,5,6,7].map(i => (
                <rect key={i} x={70 + i * 35} y={300 - Math.random() * 40} width="20" height={40 + Math.random() * 40} fill="#FFD700" fillOpacity={0.3 + Math.random() * 0.5}/>
              ))}
            </svg>
            <div className="absolute bottom-0 left-0 right-0 bg-[#FFD700] border-t-4 border-black p-4 font-mono font-bold text-xs">
              <div className="flex justify-between items-center">
                <span>SYSTEM STATUS:</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>ENGINES ACTIVE:</span>
                <span>12/12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 bg-black flex-grow"></div>
          <h2 className="text-4xl font-black uppercase whitespace-nowrap">How It Works</h2>
          <div className="h-4 bg-black flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="10" y1="17" x2="22" y2="17" stroke="currentColor" strokeWidth="2"/>
                <line x1="10" y1="22" x2="18" y2="22" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 26 L26 20 L28 22 L22 28 L20 26Z" fill="currentColor"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">1. Upload Bill</h3>
            <p className="font-mono text-sm leading-relaxed">
              Drag and drop your confusing PDF bill. Our OCR engine extracts every line item, rate, and hidden charge instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M16 8 L16 16 L22 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="2" fill="currentColor"/>
                <path d="M8 4 L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M24 4 L28 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">2. Deep Analysis</h3>
            <p className="font-mono text-sm leading-relaxed">
              Our 12-engine stack cross-references your usage against thousands of tariffs to find where you're being overcharged.
            </p>
          </div>

          {/* Card 3 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 16 L12 22 L26 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">3. Switch &amp; Save</h3>
            <p className="font-mono text-sm leading-relaxed">
              We present the cheapest option. No sponsored results. No bias. Just the math. Switch in 2 clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-[#FFD700] border-4 border-black p-8 md:p-12 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,215,0,0.1) 30px, rgba(255,215,0,0.1) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,215,0,0.1) 30px, rgba(255,215,0,0.1) 31px)'
        }}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">€2M+</div>
            <div className="font-mono text-sm uppercase tracking-widest">Potential Damages Found</div>
          </div>
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">12</div>
            <div className="font-mono text-sm uppercase tracking-widest">Active Engines</div>
          </div>
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">100%</div>
            <div className="font-mono text-sm uppercase tracking-widest">Market Coverage</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2">0.0s</div>
            <div className="font-mono text-sm uppercase tracking-widest">Bias</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">Ready to reclaim your money?</h2>
        <Link href="/analyze">
          <a className="neo-button inline-block text-2xl px-12 py-6">
            Start Analysis Protocol
          </a>
        </Link>
      </section>
    </Layout>
  );
}
