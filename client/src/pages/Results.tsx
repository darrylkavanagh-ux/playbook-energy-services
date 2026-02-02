import React from "react";
import { Link } from "wouter";
import Layout from "../components/Layout";

export default function Results() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-black text-[#FFD700] px-3 py-1 font-mono text-sm font-bold uppercase mb-4">
              Analysis Complete
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
              You Are <br/> Overpaying
            </h1>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <div className="font-mono text-sm uppercase text-gray-500 mb-1">Potential Annual Savings</div>
            <div className="text-6xl font-black bg-[#FFD700] px-4 py-2 border-4 border-black inline-block neo-shadow">
              €482.50
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Current Plan Card */}
          <div className="bg-white border-4 border-black p-6 opacity-50 hover:opacity-100 transition-opacity">
            <h3 className="font-mono text-sm uppercase font-bold text-gray-500 mb-4">Current Supplier</h3>
            <div className="text-3xl font-black uppercase mb-2">Electric Ireland</div>
            <div className="font-mono text-sm mb-6">Standard 24hr Urban</div>
            
            <div className="space-y-4 font-mono text-sm border-t-4 border-black pt-4">
              <div className="flex justify-between">
                <span>Unit Rate:</span>
                <span className="font-bold text-red-600">43.20c</span>
              </div>
              <div className="flex justify-between">
                <span>Standing Charge:</span>
                <span className="font-bold">€320.45</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Annual Cost:</span>
                <span className="font-bold">€2,145.50</span>
              </div>
            </div>
          </div>

          {/* Recommended Plan Card */}
          <div className="bg-[#FFD700] border-4 border-black p-6 relative lg:col-span-2 neo-shadow transform scale-[1.02]">
            <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-mono text-xs font-bold uppercase">
              Recommended Switch
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-mono text-sm uppercase font-bold text-black/60 mb-4">New Supplier</h3>
                <div className="text-4xl font-black uppercase mb-2">Bord Gáis Energy</div>
                <div className="font-mono text-sm mb-6 font-bold">New Customer Discount (30%)</div>
                
                <div className="space-y-4 font-mono text-sm border-t-4 border-black pt-4">
                  <div className="flex justify-between">
                    <span>Unit Rate:</span>
                    <span className="font-bold bg-black text-[#FFD700] px-1">29.45c</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standing Charge:</span>
                    <span className="font-bold">€280.10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Annual Cost:</span>
                    <span className="font-bold text-xl">€1,663.00</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t-4 md:border-t-0 md:border-l-4 border-black pt-6 md:pt-0 md:pl-6">
                <div>
                  <h4 className="font-black uppercase mb-2">Why this plan?</h4>
                  <ul className="font-mono text-sm space-y-2 list-disc pl-4 marker:text-black">
                    <li>Lowest unit rate in market</li>
                    <li>12-month price freeze</li>
                    <li>€50 welcome credit included</li>
                  </ul>
                </div>
                
                <button className="neo-button w-full mt-8 text-lg bg-black text-white hover:bg-white hover:text-black border-white hover:border-black">
                  Switch Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <section>
          <h3 className="text-2xl font-black uppercase mb-6 border-b-4 border-black inline-block">Usage Breakdown</h3>
          <div className="bg-white border-4 border-black p-8">
             <div className="h-64 flex items-end justify-between gap-2 font-mono text-xs">
                {[45, 60, 35, 80, 55, 40, 70, 90, 65, 50, 75, 60].map((h, i) => (
                  <div key={i} className="w-full bg-black hover:bg-[#FFD700] transition-colors relative group" style={{height: `${h}%`}}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {h * 10} kWh
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 font-mono text-xs uppercase font-bold text-gray-500">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
             </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
