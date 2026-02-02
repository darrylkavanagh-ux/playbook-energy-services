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
                { 
                  id: "CASE-2024-089", 
                  name: "David Clarke vs. Cavan General", 
                  status: "PROCESSING RBA", 
                  date: "02 FEB 2026", 
                  files: ["Brief to Senior Counsel", "AI Medical Assessment", "Opinion on Merits", "Forensic Chronology"] 
                },
                { id: "CASE-2024-042", name: "Waterford Crystal Asset Strip", status: "ONGOING", date: "28 JAN 2026", files: [] },
                { id: "CASE-2023-115", name: "Rosie Dobbin Probate Fraud", status: "REVIEW", date: "15 JAN 2026", files: [] },
              ].map((c) => (
                <div key={c.id} className="border-2 border-black hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between p-4 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full border border-black ${c.status === 'PROCESSING RBA' ? 'bg-[#FF3333] animate-[pulse_0.5s_ease-in-out_infinite]' : c.status === 'CRITICAL' ? 'bg-[#FF3333] animate-pulse' : 'bg-gray-400'}`}></div>
                      <div>
                        <div className="font-bold uppercase text-sm group-hover:underline">{c.name}</div>
                        <div className="font-mono text-xs text-gray-500">{c.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-xs bg-black text-white px-2 py-1 mb-1 ${c.status === 'PROCESSING RBA' ? 'bg-[#FF3333]' : ''}`}>{c.status}</div>
                      <div className="font-mono text-xs">{c.date}</div>
                    </div>
                  </div>
                  
                  {/* Generated Files Section */}
                  {c.files.length > 0 && (
                    <div className="border-t-2 border-black bg-gray-100 p-3">
                      <div className="mb-2 font-mono text-[10px] uppercase font-bold text-gray-500">Legal Pack Generated:</div>
                      <div className="flex flex-wrap gap-2">
                        {c.files.map((f) => (
                          <div key={f} className="bg-white border border-black px-2 py-1 text-[10px] font-mono font-bold uppercase flex items-center gap-1 hover:bg-[#FF3333] hover:text-white cursor-pointer transition-colors">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            {f}
                          </div>
                        ))}
                      </div>
                      {c.status === 'PROCESSING RBA' && (
                        <div className="mt-3 border-t border-gray-300 pt-2 flex items-center gap-2 text-[#FF3333] font-mono text-[10px] font-bold uppercase animate-pulse">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/><path d="M12 8V16"/><path d="M8 12H16"/></svg>
                          Pushing to RBA Platform Core...
                        </div>
                      )}
                    </div>
                  )}
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
