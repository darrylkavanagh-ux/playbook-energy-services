import React from "react";
import Layout from "../components/Layout";
import { Link } from "wouter";

export default function OrbAI() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-[#00FFFF] border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              Orb AI Protocol
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
              Trust <br/> Nothing.
            </h1>
          </div>
          <div className="mt-8 md:mt-0 max-w-md text-right">
            <p className="font-mono text-lg mb-4">
              The world's first decentralized truth verification infrastructure.
            </p>
            <div className="flex gap-2 justify-end">
              <span className="neo-tag bg-black text-[#00FFFF]">C27 Compliant</span>
              <span className="neo-tag bg-black text-[#00FFFF]">GDPR Ready</span>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Verification Panel */}
          <div className="lg:col-span-8 bg-white border-4 border-black p-8 neo-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-black text-white px-4 py-2 font-mono text-xs font-bold uppercase z-10">
              Live Feed
            </div>
            
            <div className="border-4 border-dashed border-gray-300 bg-gray-50 h-96 flex flex-col items-center justify-center relative group-hover:border-black transition-colors cursor-pointer">
              <div className="w-24 h-24 mb-6 rounded-full bg-[#00FFFF] border-4 border-black flex items-center justify-center animate-pulse">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
                  <path d="M10 12L12 14L14 12" />
                  <path d="M12 3V21" />
                </svg>
              </div>
              <h3 className="text-2xl font-black uppercase mb-2">Scan Document</h3>
              <p className="font-mono text-sm text-gray-500">Drag & Drop ID, Contracts, or Certificates</p>
              
              {/* Scanning Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFFF]/20 to-transparent h-8 w-full top-0 animate-[scan_3s_linear_infinite] pointer-events-none"></div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-black text-[#00FFFF] p-6 border-4 border-black">
              <h3 className="font-mono text-sm uppercase mb-2">Global Fraud Index</h3>
              <div className="text-6xl font-black">84%</div>
              <div className="h-2 bg-gray-800 mt-4 overflow-hidden">
                <div className="h-full bg-[#00FFFF] w-[84%]"></div>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6">
              <h3 className="font-black uppercase text-xl mb-4">Active Nodes</h3>
              <ul className="space-y-4 font-mono text-sm">
                <li className="flex justify-between items-center">
                  <span>London, UK</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Dublin, IE</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                </li>
                <li className="flex justify-between items-center">
                  <span>New York, US</span>
                  <span className="w-3 h-3 bg-green-500 rounded-full border border-black"></span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Singapore, SG</span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full border border-black animate-pulse"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border-4 border-black bg-[#00FFFF] neo-shadow hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-black uppercase mb-4">Deep Fake Detection</h3>
            <p className="font-mono text-sm">
              Pixel-level analysis of video and audio to detect synthetic manipulation with 99.9% accuracy.
            </p>
          </div>
          <div className="p-6 border-4 border-black bg-white neo-shadow hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-black uppercase mb-4">Blockchain Notary</h3>
            <p className="font-mono text-sm">
              Every verified document is hashed and stored on the immutable ledger for permanent proof of existence.
            </p>
          </div>
          <div className="p-6 border-4 border-black bg-white neo-shadow hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-black uppercase mb-4">Identity Scoring</h3>
            <p className="font-mono text-sm">
              Cross-reference 500+ data points to build a comprehensive trust score for individuals and entities.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
