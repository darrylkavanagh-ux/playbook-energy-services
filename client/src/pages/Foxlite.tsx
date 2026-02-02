import React from "react";
import { Link } from "wouter";
import Layout from "../components/Layout";

export default function Foxlite() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-block bg-black text-white px-4 py-2 font-mono font-bold uppercase mb-6 w-fit">
            Foxlite Consulting
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter">
            Forensic <br/>
            <span className="bg-[#FFD700] text-black px-4 decoration-slice">Utility</span> <br/>
            Audits
          </h1>
          <p className="text-xl md:text-2xl font-mono mb-10 max-w-2xl border-l-8 border-black pl-6 py-2">
            We recover historic overcharges for Nursing Homes, Hotels, and Industrial Groups. No Win, No Fee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:david@foxliteconsulting.com" className="neo-button text-center text-xl">
              Request Audit
            </a>
            <Link href="/">
              <a className="bg-white text-black font-bold uppercase tracking-wider border-4 border-black px-6 py-3 neo-shadow transition-all hover:bg-black hover:text-white neo-shadow-hover active:neo-shadow-active text-center text-xl">
                View Platform
              </a>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <div className="aspect-square bg-black border-4 border-black relative overflow-hidden neo-shadow">
             <div className="w-full h-full bg-[#FFD700] flex items-center justify-center">
                <span className="text-9xl font-black opacity-20 rotate-45">FOX</span>
             </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-4 font-mono font-bold text-xs">
              <div className="flex justify-between items-center">
                <span>AUDIT STATUS:</span>
                <span className="animate-pulse text-[#FFD700]">● ACTIVE</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>RECOVERY RATE:</span>
                <span>15-22%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 bg-black flex-grow"></div>
          <h2 className="text-4xl font-black uppercase whitespace-nowrap">Our Expertise</h2>
          <div className="h-4 bg-black flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
              <span className="text-3xl font-black">€</span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">Historic Refunds</h3>
            <p className="font-mono text-sm leading-relaxed">
              We analyze 6 years of back-bills to find tariff errors, unapplied discounts, and tax overcharges.
            </p>
          </div>

          {/* Card 2 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
               <span className="text-3xl font-black">%</span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">Rate Optimization</h3>
            <p className="font-mono text-sm leading-relaxed">
              We negotiate directly with suppliers using our group buying power to secure below-market rates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
               <span className="text-3xl font-black">0</span>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">No Risk</h3>
            <p className="font-mono text-sm leading-relaxed">
              Our fee is strictly a percentage of the savings we secure. If we find nothing, you pay nothing.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
