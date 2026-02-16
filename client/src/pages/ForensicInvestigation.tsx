/**
 * FORENSIC INVESTIGATION DASHBOARD
 * Orb AI Forensic Investigation Platform Frontend
 * 
 * Interface for prosecution-grade forensic reconstruction
 * as specified in FINAL MASTER FORENSIC INVESTIGATION DIRECTIVE v3.0
 */

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

interface ReadinessStatus {
  platform_status: string;
  operational_date: string;
  database_status: string;
  registries: {
    actor_registry: { status: string; record_count: number };
    entity_registry: { status: string; record_count: number };
    matter_index: { status: string; record_count: number };
    property_register: { status: string; record_count: number };
  };
  evidence_management: {
    document_count: number;
    storage_status: string;
  };
  analytical_engines: {
    conspiracy_detection: string;
    temporal_correlation: string;
    actor_intersection: string;
    financial_flow_mapping: string;
    cui_bono_analysis: string;
  };
  active_tasks: number;
  phase_status: string;
  message: string;
}

export default function ForensicInvestigation() {
  const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'actors' | 'matters' | 'analysis'>('overview');

  useEffect(() => {
    fetchReadinessStatus();
  }, []);

  const fetchReadinessStatus = async () => {
    try {
      const response = await fetch('/api/forensic/readiness');
      const data = await response.json();
      if (data.success) {
        setReadiness(data.readiness);
      }
    } catch (error) {
      console.error('Failed to fetch readiness:', error);
    } finally {
      setLoading(false);
    }
  };

  const runConspiracyAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forensic/analyze/conspiracy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(`Conspiracy Analysis Complete!\n\n${data.results.conspiracy_links_detected} conspiracy links detected\n${data.results.high_confidence_links} high-confidence links`);
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-[#FF0000] text-white border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              ⚠️ STRICTLY CONFIDENTIAL
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
              FORENSIC<br/>INVESTIGATION
            </h1>
            <div className="mt-4 font-mono text-sm uppercase font-bold text-gray-600">
              Orb AI Platform | Attorney-Client Privileged
            </div>
          </div>
          <div className="mt-8 md:mt-0 max-w-md text-right">
            <p className="font-mono text-lg mb-4">
              Prosecution-grade forensic reconstruction system for complex fraud investigations.
            </p>
            <div className="flex gap-2 justify-end flex-wrap">
              <span className="neo-tag bg-black text-[#FF0000]">Master Registries</span>
              <span className="neo-tag bg-black text-[#FF0000]">Conspiracy Detection</span>
              <span className="neo-tag bg-black text-[#FF0000]">Asset Tracing</span>
            </div>
          </div>
        </div>

        {/* Platform Status Banner */}
        {readiness && (
          <div className="bg-green-500 border-4 border-black p-6 mb-8 neo-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-black uppercase text-2xl mb-2">
                  ✅ PLATFORM STATUS: {readiness.platform_status}
                </div>
                <div className="font-mono text-sm">
                  {readiness.message}
                </div>
                <div className="font-mono text-xs mt-2 uppercase">
                  Phase: {readiness.phase_status} | Database: {readiness.database_status}
                </div>
              </div>
              <div className="text-right">
                <div className="text-6xl font-black">✓</div>
                <div className="font-mono text-xs">OPERATIONAL</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b-4 border-black pb-4">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'actors', label: 'Actor Registry' },
            { id: 'matters', label: 'Matter Index' },
            { id: 'analysis', label: 'Conspiracy Analysis' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`neo-button text-sm py-2 px-4 ${
                activeTab === tab.id ? 'bg-[#FF0000] text-white' : 'bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && readiness && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Master Registries */}
            <div className="bg-white border-4 border-black p-6 neo-shadow">
              <div className="text-4xl font-black mb-2">{readiness.registries.actor_registry.record_count}</div>
              <div className="font-mono text-xs uppercase font-bold text-gray-600">Actors Tracked</div>
              <div className="mt-4 text-xs font-mono">
                Status: <span className="text-green-600 font-bold">{readiness.registries.actor_registry.status}</span>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 neo-shadow">
              <div className="text-4xl font-black mb-2">{readiness.registries.entity_registry.record_count}</div>
              <div className="font-mono text-xs uppercase font-bold text-gray-600">Entities Monitored</div>
              <div className="mt-4 text-xs font-mono">
                Status: <span className="text-green-600 font-bold">{readiness.registries.entity_registry.status}</span>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 neo-shadow">
              <div className="text-4xl font-black mb-2">{readiness.registries.matter_index.record_count}</div>
              <div className="font-mono text-xs uppercase font-bold text-gray-600">Matters Indexed</div>
              <div className="mt-4 text-xs font-mono">
                Status: <span className="text-green-600 font-bold">{readiness.registries.matter_index.status}</span>
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6 neo-shadow">
              <div className="text-4xl font-black mb-2">{readiness.registries.property_register.record_count}</div>
              <div className="font-mono text-xs uppercase font-bold text-gray-600">Properties Registered</div>
              <div className="mt-4 text-xs font-mono">
                Status: <span className="text-green-600 font-bold">{readiness.registries.property_register.status}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && readiness && (
          <>
            {/* Analytical Engines Status */}
            <div className="bg-black text-white border-4 border-black p-6 mb-8 neo-shadow">
              <h3 className="text-2xl font-black uppercase mb-6 text-[#FF0000]">
                Analytical Engines Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(readiness.analytical_engines).map(([key, status]) => (
                  <div key={key} className="border-2 border-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-xs uppercase">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className={`font-bold text-xs ${
                        status === 'READY' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Management */}
            <div className="bg-white border-4 border-black p-6 mb-8 neo-shadow">
              <h3 className="text-2xl font-black uppercase mb-4">Evidence Management</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-black">{readiness.evidence_management.document_count}</div>
                  <div className="font-mono text-xs uppercase text-gray-600">Documents Secured</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-green-600">
                    {readiness.evidence_management.storage_status}
                  </div>
                  <div className="font-mono text-xs uppercase text-gray-600">Storage System</div>
                </div>
              </div>
            </div>

            {/* Active Tasks */}
            <div className="bg-[#FFD700] border-4 border-black p-6 mb-8 neo-shadow">
              <h3 className="text-2xl font-black uppercase mb-4">Investigation Workflow</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black">{readiness.active_tasks}</div>
                  <div className="font-mono text-sm uppercase font-bold">Active Tasks</div>
                </div>
                <button className="neo-button bg-black text-white py-3 px-6">
                  View Task Board
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Conspiracy Detection Panel */}
            <div className="bg-[#FF0000] text-white border-4 border-black p-8 neo-shadow">
              <h3 className="text-3xl font-black uppercase mb-4">
                ⚠️ CONSPIRACY DETECTION ENGINE
              </h3>
              <p className="font-mono text-sm mb-6">
                Advanced multi-method conspiracy detection combining temporal correlation, 
                actor intersection, financial flow mapping, and cui bono analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border-2 border-white p-4">
                  <div className="font-bold uppercase text-xs mb-2">Detection Methods</div>
                  <ul className="font-mono text-xs space-y-1">
                    <li>✓ Temporal Correlation Analysis</li>
                    <li>✓ Actor Intersection Analysis</li>
                    <li>✓ Financial Flow Mapping</li>
                    <li>✓ Cui Bono (Who Benefits)</li>
                    <li>✓ Communication Pattern Analysis</li>
                    <li>✓ Geographic Clustering</li>
                  </ul>
                </div>
                
                <div className="border-2 border-white p-4">
                  <div className="font-bold uppercase text-xs mb-2">Capabilities</div>
                  <ul className="font-mono text-xs space-y-1">
                    <li>• Multi-party fraud identification</li>
                    <li>• Shell company networks</li>
                    <li>• Money laundering schemes</li>
                    <li>• Beneficial ownership chains</li>
                    <li>• Asset concealment patterns</li>
                    <li>• Coordinated action detection</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={runConspiracyAnalysis}
                disabled={loading}
                className="neo-button bg-white text-[#FF0000] py-4 px-8 text-lg font-black uppercase w-full disabled:opacity-50"
              >
                {loading ? 'ANALYZING...' : '🔍 RUN COMPREHENSIVE CONSPIRACY ANALYSIS'}
              </button>
            </div>

            {/* Individual Analysis Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Temporal Correlation', endpoint: '/analyze/temporal', color: 'bg-blue-500' },
                { name: 'Financial Flows', endpoint: '/analyze/financial-flows', color: 'bg-green-500' },
                { name: 'Cui Bono', endpoint: '/analyze/cui-bono', color: 'bg-yellow-500' },
                { name: 'Full Report', endpoint: '/report', color: 'bg-purple-500' }
              ].map(tool => (
                <div key={tool.name} className={`${tool.color} border-4 border-black p-4 neo-shadow`}>
                  <div className="font-black uppercase text-sm mb-3">{tool.name}</div>
                  <button className="neo-button bg-white text-black py-2 px-4 text-xs w-full">
                    Run Analysis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'actors' && (
          <div className="bg-white border-4 border-black p-6 neo-shadow">
            <h3 className="text-2xl font-black uppercase mb-6">Master Actor Registry</h3>
            <p className="font-mono text-sm mb-6">
              Comprehensive tracking of all individuals involved in the investigation. 
              Click "View Registry" to access full actor profiles, relationships, and transaction history.
            </p>
            <button className="neo-button bg-[#FF0000] text-white py-3 px-6">
              View Actor Registry →
            </button>
          </div>
        )}

        {activeTab === 'matters' && (
          <div className="bg-white border-4 border-black p-6 neo-shadow">
            <h3 className="text-2xl font-black uppercase mb-6">Master Matter Index</h3>
            <p className="font-mono text-sm mb-6">
              Centralized index of all legal matters, cases, and incidents with interconnections mapped. 
              Access detailed matter files, timelines, and evidence repositories.
            </p>
            <button className="neo-button bg-[#FF0000] text-white py-3 px-6">
              View Matter Index →
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 border-t-4 border-black pt-8">
          <div className="bg-gray-100 border-4 border-black p-6 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-bold uppercase mb-2">Classification</div>
                <div>STRICTLY CONFIDENTIAL</div>
                <div>ATTORNEY-CLIENT PRIVILEGED</div>
              </div>
              <div>
                <div className="font-bold uppercase mb-2">Reference</div>
                <div>FINAL MASTER FORENSIC</div>
                <div>INVESTIGATION DIRECTIVE v3.0</div>
              </div>
              <div>
                <div className="font-bold uppercase mb-2">Authorized Users</div>
                <div>Darryl Kavanagh, Director</div>
                <div>Playbook Corporation Limited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
