import React from "react";
import Layout from "../components/Layout";

export default function KavanAI() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-[#FF3333] text-white border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              Kavan AI Intelligence
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
              Legal <br/> Warfare.
            </h1>
          </div>
          <div className="mt-8 md:mt-0 max-w-md text-right">
            <p className="font-mono text-lg mb-4">
              Automated case strategy, asset tracing, and precedent analysis.
            </p>
            <div className="flex gap-2 justify-end">
              <span className="neo-tag bg-black text-[#FF3333]">Asset Tracing</span>
              <span className="neo-tag bg-black text-[#FF3333]">Litigation Support</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          
          {/* Case File Card */}
          <div className="bg-white border-4 border-black p-6 neo-shadow lg:col-span-2">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase">Active Case Files</h3>
              <button className="neo-button text-xs py-2 px-4">New Case</button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: "CASE-2024-089", name: "David Clarke vs. Cavan General", status: "CRITICAL", date: "02 FEB 2026" },
                { id: "CASE-2024-042", name: "Waterford Crystal Asset Strip", status: "ONGOING", date: "28 JAN 2026" },
                { id: "CASE-2023-115", name: "Rosie Dobbin Probate Fraud", status: "REVIEW", date: "15 JAN 2026" },
              ].map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 border-2 border-black hover:bg-gray-50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full border border-black ${c.status === 'CRITICAL' ? 'bg-[#FF3333] animate-pulse' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="font-bold uppercase text-sm group-hover:underline">{c.name}</div>
                      <div className="font-mono text-xs text-gray-500">{c.id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs bg-black text-white px-2 py-1 mb-1">{c.status}</div>
                    <div className="font-mono text-xs">{c.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Tracing Map Placeholder */}
          <div className="bg-black border-4 border-black p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <h3 className="text-2xl font-black uppercase mb-4 relative z-10 text-[#FF3333]">Global Asset Trace</h3>
            
            <div className="aspect-square border-2 border-[#FF3333] rounded-full relative flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
              <div className="w-2 h-2 bg-[#FF3333] absolute top-0 left-1/2 -translate-x-1/2"></div>
              <div className="w-full h-[1px] bg-[#FF3333]/30"></div>
              <div className="h-full w-[1px] bg-[#FF3333]/30"></div>
            </div>

            <div className="space-y-2 font-mono text-xs relative z-10">
              <div className="flex justify-between text-[#FF3333]">
                <span>TARGET ACQUIRED:</span>
                <span>OFFSHORE_ACC_77</span>
              </div>
              <div className="flex justify-between">
                <span>JURISDICTION:</span>
                <span>CAYMAN ISLANDS</span>
              </div>
              <div className="flex justify-between">
                <span>VALUE EST:</span>
                <span>€4.2M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <section>
          <h2 className="text-4xl font-black uppercase mb-8 border-l-8 border-[#FF3333] pl-6">Investigation Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Entity Resolution', 'Corporate Structure', 'Financial Forensics', 'Social Graph'].map((tool) => (
              <div key={tool} className="bg-white border-4 border-black p-4 hover:bg-[#FF3333] hover:text-white transition-colors cursor-pointer group">
                <div className="w-10 h-10 border-2 border-black mb-4 flex items-center justify-center bg-gray-100 group-hover:bg-white group-hover:text-black font-bold">
                  {tool[0]}
                </div>
                <h4 className="font-bold uppercase">{tool}</h4>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
