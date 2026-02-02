import React from "react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { name: "No Compare", path: "/", color: "bg-[#FFD700]" },
    { name: "Orb AI", path: "/orb", color: "bg-[#00FFFF]" },
    { name: "Kavan AI", path: "/kavan", color: "bg-[#FF3333]" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans selection:bg-black selection:text-[#FFD700]">
      {/* Marquee Banner */}
      <div className="bg-black text-[#FFD700] overflow-hidden py-2 border-b-4 border-black font-mono text-sm font-bold uppercase tracking-widest">
        <div className="whitespace-nowrap animate-marquee">
          WARNING: HIGH ENERGY PRICES DETECTED /// STOP OVERPAYING /// SWITCH NOW /// SYSTEM STATUS: OPERATIONAL /// VERITECH ENGINE SUITE ACTIVE ///
        </div>
      </div>

      {/* Global Navigation Bar */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black"></div>
            <span className="font-black uppercase tracking-tighter text-xl">Playbook<span className="text-gray-400">Labs</span></span>
          </div>
          
          <div className="hidden md:flex gap-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`
                  px-4 py-2 font-mono text-sm font-bold uppercase border-2 border-black transition-all
                  ${location === item.path 
                    ? `${item.color} neo-shadow translate-x-[-2px] translate-y-[-2px]` 
                    : 'bg-white hover:bg-gray-100'}
                `}>
                  {item.name}
                </a>
              </Link>
            ))}
          </div>

          <div className="w-8 h-8 border-2 border-black rounded-full flex items-center justify-center font-bold cursor-pointer hover:bg-black hover:text-white transition-colors">
            ?
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-8 md:p-12 border-t-4 border-black mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-black uppercase text-2xl mb-4">Playbook</h4>
            <p className="font-mono text-xs text-gray-400">
              Decentralized truth verification and intelligence infrastructure.
            </p>
          </div>
          <div>
            <h5 className="font-bold uppercase mb-4 text-[#FFD700]">No Compare</h5>
            <ul className="font-mono text-xs space-y-2 text-gray-400">
              <li><Link href="/"><a className="hover:text-white">Bill Analysis</a></Link></li>
              <li><Link href="/tariffs"><a className="hover:text-white">Tariff Scanner</a></Link></li>
              <li><Link href="/analyze"><a className="hover:text-white">Switch Protocol</a></Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase mb-4 text-[#00FFFF]">Orb AI</h5>
            <ul className="font-mono text-xs space-y-2 text-gray-400">
              <li><Link href="/orb"><a className="hover:text-white">Doc Verification</a></Link></li>
              <li><Link href="/orb"><a className="hover:text-white">Fraud Detection</a></Link></li>
              <li><Link href="/orb"><a className="hover:text-white">Compliance C27</a></Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold uppercase mb-4 text-[#FF3333]">Kavan AI</h5>
            <ul className="font-mono text-xs space-y-2 text-gray-400">
              <li><Link href="/kavan"><a className="hover:text-white">Legal Intel</a></Link></li>
              <li><Link href="/kavan"><a className="hover:text-white">Asset Tracing</a></Link></li>
              <li><Link href="/kavan"><a className="hover:text-white">Case Strategy</a></Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-gray-600">© 2026 PLAYBOOK LABS. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
            <span className="font-mono text-xs font-bold uppercase text-gray-400">System Status: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
