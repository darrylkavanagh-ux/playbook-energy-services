/**
 * ORACLE ENGINE — STRATEGIC VISION PAGE
 * ============================================================================
 * Answers three user questions on one page:
 *   1. What would the 10 greatest traders have wished for?
 *   2. Can we build it? (capability roadmap)
 *   3. How accurate will it be? (honest accuracy model)
 *   4. What should we charge? (SaaS pricing strategy)
 *   5. How do we become enterprise-grade rated 100/100?
 */

import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import {
  TRADER_WISHES,
  ORACLE_CAPABILITIES,
  ACCURACY_MODEL,
  PRICING_TIERS,
  COMPETITORS,
  ENTERPRISE_CHECKLIST,
  computeEnterpriseScore,
  type TraderWish,
  type OracleCapability,
  type PricingTier,
} from "@/data/oracleEngine";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
type OracleTabId = "wishes" | "capabilities" | "accuracy" | "pricing" | "enterprise";

function buildStatusBadge(status: OracleCapability["build_status"]) {
  const map: Record<string, string> = {
    live:            "bg-emerald-500 text-white",
    buildable_now:   "bg-blue-500 text-white",
    buildable_6mo:   "bg-amber-500 text-black",
    research_phase:  "bg-purple-500 text-white",
  };
  const label: Record<string, string> = {
    live:            "✅ LIVE NOW",
    buildable_now:   "🔨 BUILD NOW",
    buildable_6mo:   "📅 6 MONTHS",
    research_phase:  "🔬 RESEARCH",
  };
  return { cls: map[status] ?? "bg-gray-400 text-white", label: label[status] ?? status };
}

function complexityBar(score: number) {
  const bars = Array.from({ length: 10 }, (_, i) => i < score);
  return (
    <div className="flex gap-0.5">
      {bars.map((active, i) => (
        <div
          key={i}
          className={`h-2 w-3 rounded-sm ${
            active
              ? score >= 9 ? "bg-red-500"
                : score >= 7 ? "bg-amber-500"
                : "bg-emerald-500"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function statusColour(status: string) {
  if (status === "live")        return "bg-emerald-100 text-emerald-700 border border-emerald-400";
  if (status === "partial")     return "bg-amber-100 text-amber-700 border border-amber-400";
  if (status === "planned")     return "bg-blue-100 text-blue-700 border border-blue-400";
  return "bg-gray-100 text-gray-500 border border-gray-300";
}

function statusLabel(status: string) {
  if (status === "live")        return "✅ LIVE";
  if (status === "partial")     return "⚡ PARTIAL";
  if (status === "planned")     return "📅 PLANNED";
  return "○ NOT STARTED";
}

// ─────────────────────────────────────────────────────────────────────────────
// WISH CARD
// ─────────────────────────────────────────────────────────────────────────────
function WishCard({ wish }: { wish: TraderWish }) {
  const [expanded, setExpanded] = useState(false);

  const complexityMap: Record<string, string> = {
    low:       "bg-emerald-100 text-emerald-700",
    medium:    "bg-blue-100 text-blue-700",
    high:      "bg-amber-100 text-amber-700",
    very_high: "bg-red-100 text-red-700",
  };

  return (
    <div
      className="border-4 border-black neo-shadow mb-4 overflow-hidden"
      style={{ borderLeftColor: wish.colour, borderLeftWidth: 8 }}
    >
      <button
        className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="px-3 py-1 font-black text-sm text-white border-2 border-black"
                style={{ backgroundColor: wish.colour }}
              >
                {wish.trader_name}
              </span>
              <span className="font-mono text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                {wish.era}
              </span>
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${complexityMap[wish.build_complexity]}`}>
                {wish.build_complexity.replace("_", " ").toUpperCase()} COMPLEXITY
              </span>
              {wish.can_we_build_it && (
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-700">
                  ✅ BUILDABLE
                </span>
              )}
            </div>
            <h3 className="font-black text-xl uppercase leading-tight mb-1">{wish.wish_title}</h3>
            <p className="font-mono text-sm text-gray-600 line-clamp-2">{wish.wish_description}</p>
          </div>
          <span className="font-bold text-xl flex-shrink-0">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t-4 border-black p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <div className="font-black uppercase text-xs tracking-widest mb-2 text-gray-400">The Full Wish</div>
                <p className="font-mono text-sm leading-relaxed text-gray-700">{wish.wish_description}</p>
              </div>
              <div>
                <div className="font-black uppercase text-xs tracking-widest mb-2 text-gray-400">Why It Mattered</div>
                <p className="font-mono text-sm leading-relaxed text-amber-800 bg-amber-50 border-l-4 border-amber-400 pl-3 py-2">
                  {wish.why_it_mattered}
                </p>
              </div>
              <div>
                <div className="font-black uppercase text-xs tracking-widest mb-2 text-gray-400">Modern Equivalent</div>
                <p className="font-mono text-sm leading-relaxed text-blue-800 bg-blue-50 border-l-4 border-blue-400 pl-3 py-2">
                  {wish.modern_equivalent}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="border-4 border-black p-4" style={{ borderLeftColor: wish.colour, borderLeftWidth: 8 }}>
                <div className="font-black uppercase text-xs tracking-widest mb-2">Can We Build It?</div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{wish.can_we_build_it ? "✅" : "❌"}</span>
                  <span className="font-black text-xl">{wish.can_we_build_it ? "YES" : "NOT YET"}</span>
                </div>
                <div className="font-mono text-sm text-gray-600">{wish.build_approach}</div>
              </div>

              <div className="border-2 border-emerald-400 bg-emerald-50 p-4">
                <div className="font-black uppercase text-xs tracking-widest mb-2 text-emerald-700">
                  Expected Accuracy If Built
                </div>
                <div className="font-black text-2xl text-emerald-700">{wish.accuracy_if_built.split(' ')[0]}</div>
                <div className="font-mono text-xs text-emerald-600 mt-1">{wish.accuracy_if_built}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPABILITY CARD
// ─────────────────────────────────────────────────────────────────────────────
function CapabilityCard({ cap }: { cap: OracleCapability }) {
  const [expanded, setExpanded] = useState(false);
  const { cls, label } = buildStatusBadge(cap.build_status);

  return (
    <div className="border-4 border-black neo-shadow mb-4 overflow-hidden">
      <button
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-2xl">{cap.icon}</span>
              <span className={`px-2 py-0.5 text-xs font-bold rounded ${cls}`}>{label}</span>
              <span className="font-mono text-xs text-gray-400 border border-gray-200 px-2 py-0.5">
                Revenue weight: {"★".repeat(cap.revenue_weight)}{"☆".repeat(5 - cap.revenue_weight)}
              </span>
            </div>
            <h3 className="font-black text-lg uppercase leading-tight mb-1">{cap.pillar}</h3>
            <p className="font-mono text-sm text-gray-600 line-clamp-2">{cap.description}</p>

            <div className="mt-2 flex items-center gap-3">
              <div className="font-mono text-xs text-gray-400">Complexity:</div>
              {complexityBar(cap.complexity_score)}
              <div className="font-mono text-xs text-gray-400">{cap.complexity_score}/10</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-black text-emerald-600 text-sm">{cap.accuracy_range.split(' ')[0]}</div>
            <div className="font-mono text-xs text-gray-400">accuracy</div>
            <div className="mt-2 font-bold text-lg">{expanded ? "▲" : "▼"}</div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t-4 border-black p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="font-black uppercase text-xs tracking-widest mb-2">Full Description</div>
              <p className="font-mono text-xs leading-relaxed text-gray-600">{cap.description}</p>
              <div className="mt-3">
                <div className="font-black uppercase text-xs tracking-widest mb-2">Accuracy Range</div>
                <div className="font-mono text-xs bg-emerald-50 border border-emerald-300 p-2 text-emerald-800">
                  {cap.accuracy_range}
                </div>
              </div>
            </div>

            <div>
              <div className="font-black uppercase text-xs tracking-widest mb-2">Data Sources</div>
              <ul className="space-y-1">
                {cap.data_sources.map((d) => (
                  <li key={d} className="font-mono text-xs text-gray-600 flex items-start gap-1">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">▸</span>{d}
                  </li>
                ))}
              </ul>
              <div className="font-black uppercase text-xs tracking-widest mb-2 mt-3">Trader Wishes It Fulfils</div>
              <div className="flex flex-wrap gap-1">
                {cap.trader_wish_ids.map((id) => {
                  const w = TRADER_WISHES.find((tw) => tw.trader_id === id);
                  return w ? (
                    <span
                      key={id}
                      className="px-2 py-0.5 text-xs font-bold text-white border border-black"
                      style={{ backgroundColor: w.colour }}
                    >
                      {w.trader_name.split(" ").pop()}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div>
              <div className="font-black uppercase text-xs tracking-widest mb-2">AI Models</div>
              <ul className="space-y-1 mb-3">
                {cap.ai_models.map((m) => (
                  <li key={m} className="font-mono text-xs text-purple-700 flex items-start gap-1">
                    <span className="text-purple-400 flex-shrink-0">🧠</span>{m}
                  </li>
                ))}
              </ul>
              <div className="font-black uppercase text-xs tracking-widest mb-2">Tech Stack</div>
              <div className="flex flex-wrap gap-1">
                {cap.tech_stack.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 border border-gray-300 bg-gray-100 font-mono text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WISHES TAB
// ─────────────────────────────────────────────────────────────────────────────
function WishesTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">The Oracle Wish List</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          If the 10 greatest traders of all time had one wish — the single technology or data feed that
          would have given them surgical accuracy — what would they have asked for? And can we build it today?
          The answer to every single one is <strong className="text-black">YES</strong>.
        </p>
      </div>

      {/* Summary banner */}
      <div className="border-4 border-black bg-black text-white p-6 mb-8 neo-shadow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-black text-4xl text-[#FFD700]">{TRADER_WISHES.length}</div>
            <div className="font-mono text-xs text-gray-400">Wishes Identified</div>
          </div>
          <div>
            <div className="font-black text-4xl text-emerald-400">
              {TRADER_WISHES.filter((w) => w.can_we_build_it).length}
            </div>
            <div className="font-mono text-xs text-gray-400">Can Build Now/Soon</div>
          </div>
          <div>
            <div className="font-black text-4xl text-[#00FFFF]">
              {TRADER_WISHES.filter((w) => w.build_complexity === "very_high").length}
            </div>
            <div className="font-mono text-xs text-gray-400">Very High Complexity</div>
          </div>
          <div>
            <div className="font-black text-4xl text-amber-400">82%</div>
            <div className="font-mono text-xs text-gray-400">Peak Oracle Accuracy</div>
          </div>
        </div>
      </div>

      {TRADER_WISHES.map((w) => <WishCard key={w.trader_id} wish={w} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPABILITIES TAB
// ─────────────────────────────────────────────────────────────────────────────
function CapabilitiesTab() {
  const [filterStatus, setFilterStatus] = useState("all");
  const statuses = ["all", "live", "buildable_now", "buildable_6mo", "research_phase"];

  const filtered = filterStatus === "all"
    ? ORACLE_CAPABILITIES
    : ORACLE_CAPABILITIES.filter((c) => c.build_status === filterStatus);

  const liveCount      = ORACLE_CAPABILITIES.filter((c) => c.build_status === "live").length;
  const buildableCount = ORACLE_CAPABILITIES.filter((c) => c.build_status === "buildable_now").length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Oracle Capability Pillars</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          12 intelligence pillars that together form the Oracle Engine. Each pillar answers one of the
          trader wishes. Combined, they produce the Oracle Score — a single 0–100 confidence number that
          aggregates all available evidence before a trade signal fires.
        </p>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Live Now",       count: liveCount,                                               colour: "bg-emerald-500 text-white" },
          { label: "Build Now",      count: buildableCount,                                          colour: "bg-blue-500 text-white" },
          { label: "6-Month Build",  count: ORACLE_CAPABILITIES.filter((c) => c.build_status === "buildable_6mo").length, colour: "bg-amber-500 text-black" },
          { label: "Total Pillars",  count: ORACLE_CAPABILITIES.length,                              colour: "bg-black text-white" },
        ].map((s) => (
          <div key={s.label} className={`border-4 border-black p-3 text-center neo-shadow ${s.colour}`}>
            <div className="font-black text-3xl">{s.count}</div>
            <div className="font-mono text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
              filterStatus === s ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {s === "all" ? "ALL PILLARS" : buildStatusBadge(s as OracleCapability["build_status"]).label}
          </button>
        ))}
      </div>

      {filtered.map((c) => <CapabilityCard key={c.id} cap={c} />)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURACY TAB
// ─────────────────────────────────────────────────────────────────────────────
function AccuracyTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Honest Accuracy Forecast</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          The single most important question in trading technology. What accuracy can this platform
          HONESTLY deliver? Here is the layer-by-layer breakdown — from our current Architecture B baseline
          to the full Oracle Stack. No inflated claims. No 98.5% marketing fiction.
        </p>
      </div>

      {/* Accuracy disclaimer */}
      <div className="border-4 border-red-500 bg-red-50 p-5 mb-8 neo-shadow">
        <div className="font-black uppercase text-red-700 mb-2">⚠ CRITICAL HONESTY NOTICE</div>
        <p className="font-mono text-sm text-red-700 leading-relaxed">
          <strong>The 98.5% figure is our AI model's mathematical confidence ceiling — not an accuracy claim.</strong>{" "}
          Real trading accuracy in financial markets NEVER exceeds 90% on a sustained basis, even for Renaissance Technologies.
          Jim Simons's Medallion Fund — the greatest trading system ever built — operates at ~55% raw win rate
          and makes money through position sizing and scale, not 90%+ accuracy.
          Every accuracy number below is back-tested or modelled — real deployed accuracy will be lower until
          we have 1,000+ live signal outcomes in the OutcomeTracker.
        </p>
      </div>

      {/* Layer-by-layer table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-4 border-black font-mono text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-3 text-left font-bold">Layer</th>
              <th className="px-4 py-3 text-left font-bold">Accuracy</th>
              <th className="px-4 py-3 text-left font-bold">Horizon</th>
              <th className="px-4 py-3 text-left font-bold">Best Market</th>
              <th className="px-4 py-3 text-left font-bold">vs Random</th>
            </tr>
          </thead>
          <tbody>
            {ACCURACY_MODEL.map((layer, i) => {
              const isTop = i === ACCURACY_MODEL.length - 1;
              const isHITL = layer.layer.includes("HITL");
              return (
                <tr
                  key={layer.layer}
                  className={
                    isTop ? "bg-[#FFD700] font-bold"
                    : isHITL ? "bg-emerald-50"
                    : i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }
                >
                  <td className="px-4 py-3 font-bold text-xs">{layer.layer}</td>
                  <td className={`px-4 py-3 font-black text-sm ${
                    isTop ? "text-black" : "text-emerald-700"
                  }`}>
                    {layer.accuracy_range}
                  </td>
                  <td className="px-4 py-3 text-xs">{layer.horizon}</td>
                  <td className="px-4 py-3 text-xs">{layer.market.split(',')[0]}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-700">{layer.vs_baseline}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded cards */}
      <h3 className="font-black uppercase text-xl mb-4 border-b-4 border-black pb-2">
        Full Layer Detail
      </h3>
      <div className="space-y-4">
        {ACCURACY_MODEL.map((layer, i) => (
          <div key={layer.layer} className="border-4 border-black p-4 neo-shadow">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-8 h-8 bg-black text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <h4 className="font-black uppercase text-sm">{layer.layer}</h4>
                </div>
                <p className="font-mono text-xs text-gray-500 pl-11">{layer.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-black text-2xl text-emerald-600">{layer.accuracy_range.split(' ')[0]}</div>
                <div className="font-mono text-xs text-gray-400">{layer.horizon}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t-2 border-gray-100 pt-3">
              <div>
                <div className="font-bold text-xs uppercase text-gray-400 mb-1">Best Market</div>
                <div className="font-mono text-xs">{layer.market}</div>
              </div>
              <div>
                <div className="font-bold text-xs uppercase text-gray-400 mb-1">Best Conditions</div>
                <div className="font-mono text-xs">{layer.conditions}</div>
              </div>
              <div className="border-l-4 border-amber-400 pl-3">
                <div className="font-bold text-xs uppercase text-amber-600 mb-1">Key Note</div>
                <div className="font-mono text-xs text-amber-700">{layer.notes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Medallion Fund comparison */}
      <div className="mt-8 border-4 border-black bg-[#1a1a2e] text-white p-6 neo-shadow">
        <h3 className="font-black uppercase text-xl mb-4 text-[#FFD700]">
          How Does This Compare To The Best Ever?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="border-l-4 border-[#FFD700] pl-3">
            <strong className="text-[#FFD700]">Jim Simons — Medallion Fund</strong><br />
            ~55% raw win rate · 66% annual return · 10,000 simultaneous positions<br />
            <span className="text-gray-400 text-xs">Edge comes from SCALE and SIZING — not accuracy alone</span>
          </div>
          <div className="border-l-4 border-[#00FFFF] pl-3">
            <strong className="text-[#00FFFF]">ORB AI Oracle (Target)</strong><br />
            Oracle 80+: 74% · Oracle 90+: 82% · 15–20% of signals qualify<br />
            <span className="text-gray-400 text-xs">High-filter, high-accuracy model vs Simons's high-volume low-accuracy model</span>
          </div>
          <div className="border-l-4 border-[#FF3333] pl-3">
            <strong className="text-[#FF3333]">George Soros — Quantum Fund</strong><br />
            ~60% win rate · 30% annual return · ~50 concentrated positions<br />
            <span className="text-gray-400 text-xs">Edge comes from POSITION SIZING when right — not from being right more often</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400 border-t border-gray-600 pt-4">
          <strong className="text-white">The Lesson:</strong> Accuracy alone doesn't generate returns. 
          A 55% accurate system with correct position sizing and Kelly Criterion beats 
          a 70% accurate system with reckless sizing. Our Oracle Score targets both: 
          high accuracy ON THE SIGNALS THAT FIRE and the Kelly Criterion position sizer ensures right-sizing.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING TAB
// ─────────────────────────────────────────────────────────────────────────────
function PricingTab() {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">SaaS Pricing Strategy</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          Monthly subscription model — the right choice for this platform. One-time or usage-based
          billing doesn't work for trading intelligence because the VALUE IS CONTINUOUS: live prices,
          live signals, live accuracy tracking, live news. Monthly recurring = aligned incentives.
        </p>
      </div>

      {/* Competitor benchmark */}
      <div className="border-4 border-black bg-gray-50 p-5 mb-8 neo-shadow">
        <h3 className="font-black uppercase mb-4">Competitive Pricing Benchmarks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COMPETITORS.map((c) => (
            <div key={c.name} className="border-2 border-gray-300 bg-white p-3">
              <div className="font-black text-sm mb-1">{c.name}</div>
              <div className="font-mono text-xs text-gray-500 mb-2">{c.category}</div>
              <div className="font-black text-2xl text-black">${c.price_usd}<span className="text-sm font-mono text-gray-400">/mo</span></div>
              <div className="font-mono text-xs text-gray-400 mt-1">{c.pricing}</div>
              <div className="mt-2 space-y-1">
                {c.what_we_do_better.slice(0, 2).map((w) => (
                  <div key={w} className="font-mono text-xs text-emerald-700 flex items-start gap-1">
                    <span className="text-emerald-500 flex-shrink-0">✓</span>{w}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center gap-4 mb-6">
        <span className={`font-bold text-sm ${!billingAnnual ? "text-black" : "text-gray-400"}`}>Monthly</span>
        <button
          onClick={() => setBillingAnnual(!billingAnnual)}
          className={`relative w-14 h-7 rounded-full border-2 border-black transition-colors ${
            billingAnnual ? "bg-black" : "bg-gray-200"
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white border-2 border-black rounded-full transition-transform ${
            billingAnnual ? "translate-x-7" : "translate-x-0.5"
          }`} />
        </button>
        <span className={`font-bold text-sm ${billingAnnual ? "text-black" : "text-gray-400"}`}>
          Annual <span className="text-emerald-600">(save ~20%)</span>
        </span>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.id} tier={tier} annual={billingAnnual} />
        ))}
      </div>

      {/* Pricing rationale */}
      <div className="border-4 border-black p-6 neo-shadow">
        <h3 className="font-black uppercase text-xl mb-4">Why Monthly, Not Per-Use?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
          <div>
            <h4 className="font-black uppercase text-sm mb-3 border-b-2 border-black pb-1">
              Why NOT per-signal/per-use (like Skywork/Manus)
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Trading decisions can't be interrupted by credit limits</li>
              <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Per-signal pricing creates perverse incentive to generate MORE signals (quantity over quality)</li>
              <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Traders need always-on monitoring — alerts at 3am, weekends</li>
              <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Usage-based billing creates unpredictable costs for institutional users</li>
              <li className="flex items-start gap-2"><span className="text-red-500">✗</span> Credit systems create friction at the exact moment of decision</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase text-sm mb-3 border-b-2 border-black pb-1">
              Why Monthly Subscription IS RIGHT
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Predictable revenue for platform — funds continuous development</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Always-on monitoring: trader gets unlimited use within tier</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Aligns incentives: we succeed only if traders succeed</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Annual billing locks in clients and funds capital-intensive data sources</li>
              <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Professional/Enterprise tiers can be sold on ROI: 1 good trade pays for 6 months</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 border-t-2 border-black pt-4 font-mono text-xs text-gray-500">
          <strong>Revenue model goal:</strong> 500 Starter ($49) + 200 Professional ($199) + 50 Enterprise ($799) + 5 Institutional ($2,999) =
          <strong className="text-black"> $24,500 + $39,800 + $39,950 + $14,995 = $119,245 MRR ($1.43M ARR)</strong> at target market penetration.
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, annual }: { tier: PricingTier; annual: boolean }) {
  const price = annual ? tier.price_annual : tier.price_monthly;
  const saving = tier.price_monthly - tier.price_annual;

  return (
    <div
      className={`border-4 border-black neo-shadow flex flex-col overflow-hidden relative ${
        tier.popular ? "scale-[1.02]" : ""
      }`}
    >
      {tier.popular && (
        <div className="bg-[#FFD700] border-b-4 border-black text-center font-black uppercase text-xs py-1 tracking-widest">
          ⭐ MOST POPULAR
        </div>
      )}

      {/* Header */}
      <div className="p-5" style={{ backgroundColor: tier.colour, color: tier.colour === "#FFD700" ? "#000" : "#fff" }}>
        <div className="font-black uppercase text-xl">{tier.name}</div>
        <div className="font-mono text-xs opacity-70 mt-1">{tier.tagline}</div>
        <div className="mt-4">
          <span className="font-black text-4xl">${price}</span>
          <span className="font-mono text-sm opacity-70">/mo</span>
          {annual && saving > 0 && (
            <div className="font-mono text-xs opacity-80 mt-1">
              Save ${saving}/mo · ${tier.price_annual_total}/yr
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 p-4 bg-white">
        <div className="font-mono text-xs text-gray-500 mb-3">{tier.target_user}</div>
        <div className="grid grid-cols-3 gap-2 mb-4 border-b-2 border-gray-100 pb-4">
          <div className="text-center">
            <div className="font-black text-lg">{tier.oracle_pillars}</div>
            <div className="font-mono text-xs text-gray-400">Pillars</div>
          </div>
          <div className="text-center">
            <div className="font-black text-xs">{tier.signal_quota}</div>
            <div className="font-mono text-xs text-gray-400">Signals</div>
          </div>
          <div className="text-center">
            <div className="font-black text-sm">{tier.hitl_access ? "✅" : "—"}</div>
            <div className="font-mono text-xs text-gray-400">HITL</div>
          </div>
        </div>

        <ul className="space-y-1">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-1.5 font-mono text-xs text-gray-600">
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-4 border-t-4 border-black">
        <button
          className="w-full py-3 font-black uppercase border-4 border-black neo-shadow transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
          style={{ backgroundColor: tier.colour, color: tier.colour === "#FFD700" || tier.colour === "bg-emerald-400" ? "#000" : "#fff" }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTERPRISE CHECKLIST TAB
// ─────────────────────────────────────────────────────────────────────────────
function EnterpriseTab() {
  const [filterCategory, setFilterCategory] = useState("all");
  const score = useMemo(() => computeEnterpriseScore(), []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ENTERPRISE_CHECKLIST.map((i) => i.category)));
    return ["all", ...cats];
  }, []);

  const filtered = filterCategory === "all"
    ? ENTERPRISE_CHECKLIST
    : ENTERPRISE_CHECKLIST.filter((i) => i.category === filterCategory);

  const scoreColour =
    score.pct >= 80 ? "text-emerald-600"
    : score.pct >= 60 ? "text-amber-600"
    : "text-red-600";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Enterprise Grade Roadmap</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          What does it take to reach enterprise-grade? Here is a 100-point checklist across
          Signal Quality, Accuracy Validation, Compliance, Data Infrastructure, API, and UX.
          Each item is scored by build status. This is the definitive roadmap to rated-100 platform.
        </p>
      </div>

      {/* Gauge */}
      <div className="border-4 border-black p-6 neo-shadow mb-8 bg-[#1a1a2e] text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <div className={`font-black text-7xl ${scoreColour}`}>{score.pct}%</div>
            <div className="font-mono text-sm text-gray-400">Enterprise Score</div>
            <div className="font-mono text-xs text-gray-500 mt-1">
              {score.score.toFixed(1)} / {score.max} points
            </div>
          </div>

          <div className="flex-1 w-full">
            {/* Progress bar */}
            <div className="w-full h-6 border-4 border-[#FFD700] bg-gray-800 mb-4">
              <div
                className={`h-full transition-all ${
                  score.pct >= 80 ? "bg-emerald-500"
                  : score.pct >= 60 ? "bg-amber-500"
                  : "bg-red-500"
                }`}
                style={{ width: `${score.pct}%` }}
              />
            </div>

            {/* Category breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(score.by_category).map(([cat, catScore]) => {
                const pct = Math.round((catScore.score / catScore.max) * 100);
                return (
                  <div key={cat} className="border border-gray-600 p-2">
                    <div className="font-mono text-xs text-gray-400">{cat}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-700">
                        <div
                          className={`h-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-black text-xs text-white">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCategory(c)}
            className={`px-3 py-1 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
              filterCategory === c ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {c === "all" ? "ALL ITEMS" : c.toUpperCase()}
            {c !== "all" && (
              <span className="ml-1 text-gray-400">
                ({ENTERPRISE_CHECKLIST.filter((i) => i.category === c).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Checklist table */}
      <div className="overflow-x-auto">
        <table className="w-full border-4 border-black font-mono text-sm">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-3 py-2 text-left font-bold text-xs">Category</th>
              <th className="px-3 py-2 text-left font-bold text-xs">Item</th>
              <th className="px-3 py-2 text-center font-bold text-xs">Points</th>
              <th className="px-3 py-2 text-left font-bold text-xs">Status</th>
              <th className="px-3 py-2 text-center font-bold text-xs">P</th>
              <th className="px-3 py-2 text-left font-bold text-xs">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 text-xs font-bold text-gray-500">{item.category}</td>
                <td className="px-3 py-2 font-bold text-xs">{item.item}</td>
                <td className="px-3 py-2 text-center">
                  <span className="font-black text-sm">{item.points}</span>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${statusColour(item.status)}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs font-bold ${
                    item.priority === "p0" ? "text-red-600"
                    : item.priority === "p1" ? "text-amber-600"
                    : "text-gray-400"
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Next steps */}
      <div className="mt-8 border-4 border-black p-6 neo-shadow">
        <h3 className="font-black uppercase text-xl mb-4">Priority Roadmap to 100/100</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "P0 — Ship Now (0–4 weeks)",
              colour: "border-red-500 bg-red-50",
              items: ENTERPRISE_CHECKLIST.filter((i) => i.priority === "p0" && i.status !== "live"),
            },
            {
              label: "P1 — Next Sprint (1–3 months)",
              colour: "border-amber-500 bg-amber-50",
              items: ENTERPRISE_CHECKLIST.filter((i) => i.priority === "p1" && i.status === "not_started"),
            },
            {
              label: "P2 — Enterprise Release (3–6 months)",
              colour: "border-blue-400 bg-blue-50",
              items: ENTERPRISE_CHECKLIST.filter((i) => i.priority === "p2"),
            },
          ].map((col) => (
            <div key={col.label} className={`border-4 p-4 ${col.colour}`}>
              <div className="font-black uppercase text-xs tracking-widest mb-3">{col.label}</div>
              {col.items.length === 0 ? (
                <div className="font-mono text-xs text-green-700">✅ All items complete</div>
              ) : (
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item.id} className="font-mono text-xs text-gray-700 flex items-start gap-2">
                      <span className="font-black text-xs w-5 text-gray-400 flex-shrink-0">{item.id}</span>
                      <span>{item.item} <span className="text-gray-400">({item.points}pts)</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function OracleEngine() {
  const [activeTab, setActiveTab] = useState<OracleTabId>("wishes");
  const score = useMemo(() => computeEnterpriseScore(), []);

  const tabs: { id: OracleTabId; label: string; icon: string }[] = [
    { id: "wishes",       label: "Trader Wishes",       icon: "🌠" },
    { id: "capabilities", label: "Oracle Capabilities", icon: "🔮" },
    { id: "accuracy",     label: "Accuracy Model",      icon: "🎯" },
    { id: "pricing",      label: "Pricing Strategy",    icon: "💰" },
    { id: "enterprise",   label: "Enterprise Roadmap",  icon: "🏆" },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-black text-[#00FFFF] border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              Playbook Trading — Oracle Engine v3.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
              Oracle<br />Engine
            </h1>
          </div>
          <div className="mt-6 md:mt-0 max-w-sm text-right">
            <p className="font-mono text-sm mb-3 text-gray-600">
              If the 10 greatest traders had one wish.<br />
              Can we build it? How accurate? What to charge?<br />
              What makes this enterprise-grade?
            </p>
            <div className="flex gap-2 justify-end flex-wrap">
              <span className="neo-tag bg-black text-[#00FFFF] font-mono text-xs px-2 py-1 border-2 border-black">
                12 Oracle Pillars
              </span>
              <span className="neo-tag font-mono text-xs px-2 py-1 border-2 border-black bg-[#FFD700] text-black">
                Enterprise Score: {score.pct}%
              </span>
              <span className="neo-tag bg-black text-white font-mono text-xs px-2 py-1 border-2 border-black">
                Peak Accuracy: 82%
              </span>
            </div>
          </div>
        </div>

        {/* ── Executive summary strip ────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { icon: "🌠", label: "Trader Wishes",     value: String(TRADER_WISHES.length),      colour: "bg-[#1a1a2e] text-white" },
            { icon: "🔮", label: "Oracle Pillars",    value: String(ORACLE_CAPABILITIES.length), colour: "bg-[#0f3460] text-white" },
            { icon: "🎯", label: "Peak Accuracy",     value: "82%",                              colour: "bg-emerald-600 text-white" },
            { icon: "💰", label: "Target MRR",        value: "$119K",                            colour: "bg-[#FFD700] text-black" },
            { icon: "🏆", label: "Enterprise Score",  value: `${score.pct}%`,                    colour: "bg-black text-white" },
          ].map((s) => (
            <div key={s.label} className={`border-4 border-black p-3 neo-shadow text-center ${s.colour}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-3xl leading-none">{s.value}</div>
              <div className="font-mono text-xs mt-1 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── The one-paragraph case ─────────────────────────────────────── */}
        <div className="border-4 border-black bg-black text-white p-6 mb-8 neo-shadow">
          <p className="font-mono text-sm leading-relaxed">
            <span className="text-[#FFD700] font-black">THE CORE INSIGHT:</span>{" "}
            Jesse Livermore would have paid anything for real-time institutional order flow.
            Soros would have paid anything for instant central bank NLP scoring.
            Druckenmiller would have paid anything for a live global liquidity monitor.
            Every one of their wishes is buildable today — with public APIs, open-source ML models, and modern
            infrastructure. The Oracle Engine doesn't promise the impossible.{" "}
            <span className="text-[#00FFFF] font-black">
              It assembles the exact tools each legend would have used if they were trading today — into one
              platform, scored by a single Oracle number, verified by a licensed human trader, and certifiable
              under FCA compliance standards.
            </span>{" "}
            No other platform on earth does all of this.
          </p>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────── */}
        <div className="flex gap-0 mb-8 border-b-4 border-black overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 font-mono font-bold text-sm uppercase whitespace-nowrap border-r-2 border-black transition-colors ${
                activeTab === t.id ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}
        <div className="pb-16">
          {activeTab === "wishes"       && <WishesTab />}
          {activeTab === "capabilities" && <CapabilitiesTab />}
          {activeTab === "accuracy"     && <AccuracyTab />}
          {activeTab === "pricing"      && <PricingTab />}
          {activeTab === "enterprise"   && <EnterpriseTab />}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="border-t-4 border-black pt-6 pb-8">
          <div className="font-mono text-xs text-gray-400 max-w-4xl">
            <strong>DISCLAIMER:</strong> All accuracy figures are modelled or back-tested estimates based on historical data.
            Past accuracy does not guarantee future performance. All trading involves risk.
            Oracle Score and accuracy ranges are the result of quantitative modelling and are subject to
            change as live signal data accumulates in the OutcomeTracker. The 82% accuracy figure applies only
            to Oracle Score ≥ 90 signals, which represent approximately 10–15% of all signals generated.
            This platform provides decision-support tools, not financial advice.
            Final investment decisions remain the responsibility of the licensed trader and the end user.
          </div>
        </div>
      </div>
    </Layout>
  );
}
