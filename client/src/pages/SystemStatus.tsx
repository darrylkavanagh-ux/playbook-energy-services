import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function SystemStatus() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "INITIALIZING VERITECH CORE...",
      "CONNECTING TO PLAYBOOK NETWORK NODES [12/12]...",
      "SYNCING BLOCKCHAIN LEDGER...",
      "VERIFYING SMART CONTRACTS...",
      "CONTRACT ADDRESS: 0x71C...9A21 [VERIFIED]",
      "LOADING ORB AI MODULES...",
      "LOADING KAVAN AI LEGAL ENGINE...",
      "LOADING NO COMPARE MARKET ANALYZER...",
      "SYSTEM INTEGRITY CHECK: 100%",
      "DEPLOYMENT COMPLETE. SYSTEM ONLINE."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${sequence[i]}`]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-8">System Status</h1>
        
        <div className="bg-black text-[#00FF00] font-mono p-6 border-4 border-gray-800 h-96 overflow-y-auto shadow-[0_0_20px_rgba(0,255,0,0.2)]">
          {logs.map((log, index) => (
            <div key={index} className="mb-2 border-b border-gray-900 pb-1 last:border-0">
              <span className="mr-2 text-gray-500">{">"}</span>
              {log}
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white border-4 border-black p-6">
            <h3 className="font-bold uppercase mb-2">Network Uptime</h3>
            <div className="text-4xl font-black text-green-600">99.99%</div>
          </div>
          <div className="bg-white border-4 border-black p-6">
            <h3 className="font-bold uppercase mb-2">Gas Fees</h3>
            <div className="text-4xl font-black text-blue-600">12 Gwei</div>
          </div>
          <div className="bg-white border-4 border-black p-6">
            <h3 className="font-bold uppercase mb-2">Pending Tx</h3>
            <div className="text-4xl font-black text-orange-600">0</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
