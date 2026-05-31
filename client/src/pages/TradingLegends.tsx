/**
 * TRADING LEGENDS & MARKET HISTORY PAGE
 * ============================================================================
 * Renders the comprehensive trading legends dataset:
 *   - Top 10 greatest traders of all time with expandable profile cards
 *   - Interactive timeline of 19 major market events (filterable by era/category)
 *   - 5 technology eras: Ticker Tape → Telephone → Computer → Internet → AI
 *   - 15-entry required datasets registry
 *
 * Data source: /client/src/data/tradingLegends.ts
 */

import React, { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import {
  TRADER_PROFILES,
  MARKET_EVENTS,
  TECH_ERAS,
  REQUIRED_DATASETS,
  type TraderProfile,
  type MarketEvent,
  type TechEra,
  type DatasetEntry,
} from "@/data/tradingLegends";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type LegendTabId = "traders" | "events" | "eras" | "datasets";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function eraLabel(era: TraderProfile["era"]) {
  const map: Record<string, string> = {
    pre_phone:     "Pre-Telephone",
    phone_era:     "Telephone Era",
    computer_era:  "Computer Era",
    internet_era:  "Internet Era",
    ai_era:        "AI Era",
  };
  return map[era] ?? era;
}

function eraColour(era: TraderProfile["era"]) {
  const map: Record<string, string> = {
    pre_phone:    "bg-amber-100 text-amber-800 border-amber-400",
    phone_era:    "bg-blue-100 text-blue-800 border-blue-400",
    computer_era: "bg-purple-100 text-purple-800 border-purple-400",
    internet_era: "bg-emerald-100 text-emerald-800 border-emerald-400",
    ai_era:       "bg-cyan-100 text-cyan-800 border-cyan-400",
  };
  return map[era] ?? "bg-gray-100 text-gray-700 border-gray-300";
}

function impactBadge(impact: string) {
  const map: Record<string, string> = {
    catastrophic: "bg-red-600 text-white",
    severe:       "bg-red-400 text-white",
    major:        "bg-orange-500 text-white",
    moderate:     "bg-yellow-500 text-black",
    transformative:"bg-purple-600 text-white",
  };
  return map[impact.toLowerCase()] ?? "bg-gray-600 text-white";
}

function categoryIcon(category: string) {
  const map: Record<string, string> = {
    currency_crisis:  "💱",
    market_crash:     "📉",
    monetary_policy:  "🏦",
    political:        "🏛️",
    technology:       "💻",
    war:              "⚔️",
    pandemic:         "🦠",
    geopolitical:     "🌍",
    inflation:        "📈",
    default:          "📅",
  };
  return map[category.toLowerCase()] ?? map.default;
}

function priorityColour(priority: DatasetEntry["priority"]) {
  if (priority === "essential")    return "bg-red-100 text-red-700 border-red-400";
  if (priority === "important")    return "bg-yellow-100 text-yellow-700 border-yellow-400";
  return "bg-gray-100 text-gray-600 border-gray-300";
}

// ─────────────────────────────────────────────────────────────────────────────
// TRADER PROFILE CARD
// ─────────────────────────────────────────────────────────────────────────────
function TraderCard({ trader }: { trader: TraderProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border-4 border-black neo-shadow mb-4 overflow-hidden"
      style={{ borderLeftColor: trader.colour, borderLeftWidth: 8 }}
    >
      {/* Header — always visible */}
      <button
        className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Rank badge */}
            <div
              className="w-12 h-12 border-4 border-black flex items-center justify-center font-black text-xl flex-shrink-0 text-white"
              style={{ backgroundColor: trader.colour }}
            >
              #{trader.rank}
            </div>

            {/* Avatar */}
            <div
              className="w-14 h-14 border-4 border-black flex items-center justify-center font-black text-lg flex-shrink-0 text-white"
              style={{ backgroundColor: trader.colour }}
            >
              {trader.avatar_initials}
            </div>

            {/* Name + nickname */}
            <div>
              <h3 className="font-black text-xl uppercase leading-tight">{trader.name}</h3>
              <p className="font-mono text-xs text-gray-500 italic mb-1">"{trader.nickname}"</p>
              <div className="flex flex-wrap gap-1">
                <span className={`px-2 py-0.5 text-xs font-bold border rounded ${eraColour(trader.era)}`}>
                  {eraLabel(trader.era)}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono border border-gray-300 bg-gray-100 rounded">
                  {trader.born}{trader.died ? `–${trader.died}` : ""}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono border border-black bg-white rounded">
                  {trader.primary_market}
                </span>
              </div>
            </div>
          </div>

          {/* Peak net worth + expand toggle */}
          <div className="text-right flex-shrink-0">
            <div className="font-black text-emerald-600 text-sm">{trader.peak_net_worth}</div>
            <div className="font-mono text-xs text-gray-400">Peak net worth</div>
            <div className="mt-2 font-bold text-lg">{expanded ? "▲" : "▼"}</div>
          </div>
        </div>

        {/* Best trade teaser */}
        <div className="mt-3 font-mono text-sm bg-gray-50 border border-gray-200 p-2 rounded">
          <span className="font-bold text-black">Best trade:</span>{" "}
          <span className="text-gray-700">{trader.best_trade}</span>{" "}
          <span className="font-bold text-emerald-600">({trader.best_trade_profit})</span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t-4 border-black p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              {/* Famous quote */}
              <blockquote
                className="border-l-4 pl-4 mb-5 italic font-mono text-sm text-gray-700"
                style={{ borderLeftColor: trader.colour }}
              >
                {trader.famous_quote}
              </blockquote>

              {/* Strategy */}
              <div className="mb-4">
                <div className="font-black uppercase text-xs mb-1 tracking-widest">Strategy</div>
                <div className="font-bold text-black mb-1">{trader.strategy}</div>
                <p className="font-mono text-xs text-gray-600 leading-relaxed">{trader.strategy_detail}</p>
              </div>

              {/* Key rules */}
              <div className="mb-4">
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Key Trading Rules</div>
                <ul className="space-y-1">
                  {trader.key_rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 font-mono text-xs text-gray-700">
                      <span
                        className="w-5 h-5 rounded-full border-2 border-black font-black text-center text-white text-xs flex-shrink-0 leading-4"
                        style={{ backgroundColor: trader.colour }}
                      >
                        {i + 1}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="border-2 border-black p-2">
                  <div className="font-black text-xs uppercase text-gray-400">Career Returns</div>
                  <div className="font-bold text-sm">{trader.career_returns}</div>
                </div>
                {trader.fund && (
                  <div className="border-2 border-black p-2">
                    <div className="font-black text-xs uppercase text-gray-400">Fund</div>
                    <div className="font-bold text-sm">{trader.fund}</div>
                  </div>
                )}
                <div className="border-2 border-black p-2 col-span-2">
                  <div className="font-black text-xs uppercase text-gray-400">Technology Used</div>
                  <div className="font-mono text-xs">{trader.technology_used}</div>
                </div>
              </div>

              {/* Markets */}
              <div className="mb-4">
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Markets Traded</div>
                <div className="flex flex-wrap gap-1">
                  {trader.markets.map((m) => (
                    <span key={m} className="px-2 py-0.5 border-2 border-black font-mono text-xs bg-white">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Major events */}
              <div className="mb-4">
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Major Events Traded</div>
                <ul className="space-y-0.5">
                  {trader.major_events_traded.map((e) => (
                    <li key={e} className="font-mono text-xs text-gray-600 flex items-center gap-1">
                      <span className="text-amber-500">◆</span> {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Biggest loss */}
              {trader.biggest_loss && (
                <div className="border-2 border-red-400 bg-red-50 p-2 mb-4">
                  <div className="font-black text-xs uppercase text-red-700 mb-1">Biggest Loss</div>
                  <div className="font-mono text-xs text-red-700">{trader.biggest_loss}</div>
                </div>
              )}

              {/* Lessons */}
              <div>
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Lessons for Today</div>
                {trader.lessons.map((l, i) => (
                  <div key={i} className="border-l-2 border-black pl-2 mb-1 font-mono text-xs text-gray-600">
                    {l}
                  </div>
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
// TRADERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function TradersTab() {
  const [filterEra, setFilterEra] = useState<string>("all");
  const [filterMarket, setFilterMarket] = useState<string>("all");

  const eras = ["all", "pre_phone", "phone_era", "computer_era", "internet_era", "ai_era"];
  const markets = ["all", "Forex", "Stocks", "Commodities", "Crypto", "Global Macro"];

  const filtered = useMemo(() => {
    return TRADER_PROFILES.filter((t) => {
      const eraOk = filterEra === "all" || t.era === filterEra;
      const mktOk =
        filterMarket === "all" ||
        t.markets.some((m) => m.toLowerCase().includes(filterMarket.toLowerCase())) ||
        t.primary_market.toLowerCase().includes(filterMarket.toLowerCase());
      return eraOk && mktOk;
    });
  }, [filterEra, filterMarket]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Top 10 Trading Legends</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          The greatest traders of the last 150 years — from Jesse Livermore reading ticker tape in 1900 to Jim Simons
          running machine-learning algorithms in 2020. Each profile includes strategy, key rules, technology used, and
          the macro events that defined their careers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div>
          <div className="font-mono text-xs font-bold uppercase mb-1">Filter by Era</div>
          <div className="flex flex-wrap gap-1">
            {eras.map((e) => (
              <button
                key={e}
                onClick={() => setFilterEra(e)}
                className={`px-3 py-1 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
                  filterEra === e ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {e === "all" ? "ALL ERAS" : eraLabel(e as TraderProfile["era"])}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="font-mono text-xs font-bold uppercase mb-1">Filter by Market</div>
          <div className="flex flex-wrap gap-1">
            {markets.map((m) => (
              <button
                key={m}
                onClick={() => setFilterMarket(m)}
                className={`px-3 py-1 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
                  filterMarket === m ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="font-mono text-xs text-gray-400 mb-4">
        Showing {filtered.length} of {TRADER_PROFILES.length} traders
      </div>

      {filtered.map((t) => (
        <TraderCard key={t.id} trader={t} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKET EVENT CARD (timeline entry)
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event, isLeft }: { event: MarketEvent; isLeft: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`flex items-start gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"} mb-6`}>
      {/* Year pillar */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-16 h-16 border-4 border-black font-black text-white flex items-center justify-center text-sm"
          style={{ backgroundColor: event.colour }}
        >
          {event.year}
        </div>
        <div className="w-1 flex-1 bg-black min-h-[2rem]" />
      </div>

      {/* Card */}
      <div className="flex-1 border-4 border-black neo-shadow overflow-hidden">
        <button
          className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xl">{categoryIcon(event.category)}</span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${impactBadge(event.impact)}`}>
                  {event.impact.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-gray-400 border border-gray-300 px-2 py-0.5 rounded">
                  {event.date_label}
                </span>
              </div>
              <h4 className="font-black uppercase text-lg leading-tight">{event.title}</h4>
              <div className="font-mono text-sm font-bold text-blue-600 mt-1">{event.key_move}</div>
            </div>
            <span className="font-bold text-lg flex-shrink-0">{expanded ? "▲" : "▼"}</span>
          </div>

          {/* Markets hit */}
          <div className="flex flex-wrap gap-1 mt-2">
            {event.markets_hit.map((m) => (
              <span key={m} className="px-2 py-0.5 border border-gray-300 bg-white font-mono text-xs rounded">
                {m}
              </span>
            ))}
          </div>
        </button>

        {expanded && (
          <div className="border-t-4 border-black p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FX Impact */}
            <div>
              <div className="font-black uppercase text-xs mb-2 tracking-widest">FX Impact</div>
              <p className="font-mono text-xs text-gray-700 leading-relaxed">{event.fx_impact}</p>
            </div>

            {/* Win / Lose */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-emerald-400 bg-emerald-50 p-3">
                <div className="font-black uppercase text-xs text-emerald-700 mb-1">✅ Who Won</div>
                <p className="font-mono text-xs text-emerald-800">{event.who_won}</p>
              </div>
              <div className="border-2 border-red-400 bg-red-50 p-3">
                <div className="font-black uppercase text-xs text-red-700 mb-1">❌ Who Lost</div>
                <p className="font-mono text-xs text-red-800">{event.who_lost}</p>
              </div>
            </div>

            {/* Lesson */}
            <div className="md:col-span-2 border-2 border-amber-400 bg-amber-50 p-3">
              <div className="font-black uppercase text-xs text-amber-700 mb-1">💡 Key Lesson</div>
              <p className="font-mono text-xs text-amber-800 leading-relaxed">{event.lesson}</p>
            </div>

            {/* Traders involved */}
            {event.traders_involved && event.traders_involved.length > 0 && (
              <div className="md:col-span-2">
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Legends Involved</div>
                <div className="flex flex-wrap gap-1">
                  {event.traders_involved.map((t) => (
                    <span key={t} className="px-3 py-1 border-2 border-black font-mono text-xs bg-black text-white">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function EventsTab() {
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterImpact, setFilterImpact] = useState<string>("all");
  const [searchYear, setSearchYear] = useState<string>("");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(MARKET_EVENTS.map((e) => e.category)));
    return ["all", ...cats.sort()];
  }, []);

  const impacts = ["all", "catastrophic", "severe", "major", "transformative", "moderate"];

  const filtered = useMemo(() => {
    return MARKET_EVENTS.filter((e) => {
      const catOk    = filterCat === "all" || e.category === filterCat;
      const impactOk = filterImpact === "all" || e.impact.toLowerCase() === filterImpact;
      const yearOk   = !searchYear || String(e.year).includes(searchYear);
      return catOk && impactOk && yearOk;
    }).sort((a, b) => a.year - b.year);
  }, [filterCat, filterImpact, searchYear]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Major Market Events Timeline</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          19 events that shook global markets from 1923 to 2025. Each event reshaped how traders operate — from the
          1929 Wall Street Crash to the 2024 AI trading revolution. Includes who profited, who lost, and the lasting
          lesson for every modern trader.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <div className="font-mono text-xs font-bold uppercase mb-1">Category</div>
          <div className="flex flex-wrap gap-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3 py-1 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
                  filterCat === c ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {c === "all" ? "ALL" : `${categoryIcon(c)} ${c.replace(/_/g, " ").toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-xs font-bold uppercase mb-1">Impact Level</div>
          <div className="flex flex-wrap gap-1">
            {impacts.map((i) => (
              <button
                key={i}
                onClick={() => setFilterImpact(i)}
                className={`px-3 py-1 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
                  filterImpact === i ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                }`}
              >
                {i === "all" ? "ALL LEVELS" : i.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-xs font-bold uppercase mb-1">Year Search</div>
          <input
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            placeholder="e.g. 1992"
            className="border-2 border-black px-3 py-1 font-mono text-sm w-28"
          />
        </div>
      </div>

      <div className="font-mono text-xs text-gray-400 mb-4">
        Showing {filtered.length} of {MARKET_EVENTS.length} events
      </div>

      {/* Timeline */}
      <div className="pl-2">
        {filtered.map((event, i) => (
          <EventCard key={event.id} event={event} isLeft={i % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERA CARD
// ─────────────────────────────────────────────────────────────────────────────
function EraCard({ era, index }: { era: TechEra; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  const eraIcons: Record<string, string> = {
    pit_era:        "🎺",
    phone_era:      "☎️",
    computer_era:   "💻",
    internet_era:   "🌐",
    ai_era:         "🤖",
  };

  const eraColors: Record<string, string> = {
    pit_era:        "#1a1a2e",
    phone_era:      "#16213e",
    computer_era:   "#0f3460",
    internet_era:   "#533483",
    ai_era:         "#00FFFF",
  };

  const bgColour = eraColors[era.id] ?? "#1a1a2e";
  const isAi = era.id === "ai_era";

  return (
    <div className="border-4 border-black neo-shadow mb-4 overflow-hidden">
      <button
        className="w-full text-left p-5 transition-colors hover:opacity-90"
        style={{ backgroundColor: bgColour, color: isAi ? "#000" : "#fff" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{eraIcons[era.id] ?? "📡"}</span>
            <div>
              <div className="font-mono text-xs uppercase tracking-widest opacity-70 mb-1">{era.period}</div>
              <h3 className="font-black text-2xl uppercase">{era.name}</h3>
              <div className="font-mono text-sm mt-1 opacity-80">{era.description}</div>
            </div>
          </div>
          <span className="font-bold text-2xl opacity-70">{expanded ? "▲" : "▼"}</span>
        </div>

        {/* Tools preview */}
        <div className="flex flex-wrap gap-2 mt-3">
          {era.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 text-xs font-mono font-bold border-2"
              style={{
                borderColor: isAi ? "#000" : "#fff",
                color: isAi ? "#000" : "#fff",
                backgroundColor: "transparent",
              }}
            >
              {tool}
            </span>
          ))}
          {era.tools.length > 4 && (
            <span
              className="px-2 py-0.5 text-xs font-mono font-bold border-2"
              style={{ borderColor: isAi ? "#000" : "#fff", color: isAi ? "#000" : "#fff" }}
            >
              +{era.tools.length - 4} more
            </span>
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t-4 border-black p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tools */}
            <div>
              <div className="font-black uppercase text-xs mb-2 tracking-widest">Tools & Technology</div>
              <div className="flex flex-wrap gap-1">
                {era.tools.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 border-2 border-black font-mono text-xs"
                    style={{ borderLeftColor: bgColour, borderLeftWidth: 4 }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Speed + Key traders */}
            <div>
              <div className="border-2 border-black p-3 mb-3">
                <div className="font-black uppercase text-xs text-gray-400 mb-1">Execution Speed</div>
                <div className="font-bold">{era.speed}</div>
              </div>
              <div>
                <div className="font-black uppercase text-xs mb-2 tracking-widest">Key Traders of the Era</div>
                {era.key_traders.map((t) => (
                  <div key={t} className="flex items-center gap-2 font-mono text-xs py-1 border-b border-gray-100">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: bgColour }}
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Advantage + limitation */}
            <div className="space-y-3">
              <div className="border-2 border-emerald-400 bg-emerald-50 p-3">
                <div className="font-black uppercase text-xs text-emerald-700 mb-1">✅ Main Advantage</div>
                <p className="font-mono text-xs text-emerald-800">{era.advantage}</p>
              </div>
              <div className="border-2 border-red-400 bg-red-50 p-3">
                <div className="font-black uppercase text-xs text-red-700 mb-1">❌ Main Limitation</div>
                <p className="font-mono text-xs text-red-800">{era.limitation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERAS TAB
// ─────────────────────────────────────────────────────────────────────────────
function ErasTab() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Technology Eras of Trading</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          Trading technology evolved over 150 years from physical ticker tape machines in 1867 to AI-driven
          millisecond execution today. Each era created new information asymmetries — and new opportunities for
          those who mastered the tools first.
        </p>
      </div>

      {/* Era timeline connector */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {TECH_ERAS.map((era, i) => (
          <React.Fragment key={era.id}>
            <div className="flex flex-col items-center min-w-0 flex-shrink">
              <div
                className="w-12 h-12 border-4 border-black flex items-center justify-center text-xl font-black"
                style={{ backgroundColor: ["#1a1a2e","#16213e","#0f3460","#533483","#00FFFF"][i] }}
              >
                {["🎺","☎️","💻","🌐","🤖"][i]}
              </div>
              <div className="font-mono text-xs mt-1 text-center max-w-[70px]">
                {era.years[0]}–{era.years[1]}
              </div>
            </div>
            {i < TECH_ERAS.length - 1 && (
              <div className="flex-1 h-1 bg-black mx-1" />
            )}
          </React.Fragment>
        ))}
      </div>

      {TECH_ERAS.map((era, i) => (
        <EraCard key={era.id} era={era} index={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATASETS TAB
// ─────────────────────────────────────────────────────────────────────────────
function DatasetsTab() {
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filterPriority === "all") return REQUIRED_DATASETS;
    return REQUIRED_DATASETS.filter((d) => d.priority === filterPriority);
  }, [filterPriority]);

  // Group by use case category (inferred from useCase field)
  const grouped = useMemo(() => {
    const groups: Record<string, DatasetEntry[]> = {};
    filtered.forEach((d) => {
      const cat = d.useCase.toLowerCase().includes("news")    ? "News & Sentiment"
                : d.useCase.toLowerCase().includes("macro")   ? "Macro & Economic"
                : d.useCase.toLowerCase().includes("backtest")? "Price History"
                : d.useCase.toLowerCase().includes("signal")  ? "Signal Generation"
                : d.useCase.toLowerCase().includes("crisis")  ? "Historical Events"
                : d.useCase.toLowerCase().includes("central") ? "Central Banks"
                : d.useCase.toLowerCase().includes("sentiment")? "News & Sentiment"
                : d.useCase.toLowerCase().includes("position")? "Market Microstructure"
                : d.useCase.toLowerCase().includes("volatil") ? "Market Microstructure"
                : "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(d);
    });
    return groups;
  }, [filtered]);

  const totalFree = REQUIRED_DATASETS.filter((d) => d.free).length;
  const totalPaid = REQUIRED_DATASETS.filter((d) => !d.free).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase mb-2">Required Datasets & Data Sources</h2>
        <p className="font-mono text-sm text-gray-500 max-w-3xl">
          15 data sources required to build a production-grade trading platform. Includes forex tick data, economic
          fundamentals, news sentiment, COT positioning data, and crisis event overlays.
          <span className="text-emerald-600 font-bold"> {totalFree} free sources</span> ·{" "}
          <span className="text-amber-600 font-bold">{totalPaid} paid sources</span>
        </p>
      </div>

      {/* Priority filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "essential", "important", "nice_to_have"].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-4 py-2 font-mono text-xs border-2 border-black font-bold uppercase transition-colors ${
              filterPriority === p ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {p === "all" ? "ALL DATASETS" : p.replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
        <div className="font-mono text-xs self-center text-gray-400 ml-2">
          Showing {filtered.length} of {REQUIRED_DATASETS.length}
        </div>
      </div>

      {/* Grouped table */}
      {Object.entries(grouped).map(([group, datasets]) => (
        <div key={group} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-black uppercase text-lg">{group}</h3>
            <div className="flex-1 h-0.5 bg-black" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {datasets.map((d) => (
              <div key={d.name} className="border-4 border-black p-4 neo-shadow">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="font-black text-sm leading-tight">{d.name}</h4>
                    <div className="font-mono text-xs text-gray-500 mt-0.5">{d.provider}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-xs font-bold border rounded ${priorityColour(d.priority)}`}>
                      {d.priority.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        d.free
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-400"
                          : "bg-amber-100 text-amber-700 border border-amber-400"
                      }`}
                    >
                      {d.free ? "FREE" : d.cost}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xs text-gray-600 mb-2">{d.coverage}</div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-1.5 py-0.5 border border-gray-300 bg-gray-100 font-mono text-xs">
                      {d.format}
                    </span>
                    <span className="px-1.5 py-0.5 border border-blue-300 bg-blue-50 font-mono text-xs text-blue-700">
                      {d.useCase}
                    </span>
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold underline text-blue-600 hover:text-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    DOCS ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR (top summary)
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: "Trading Legends",   value: String(TRADER_PROFILES.length), icon: "🏆", colour: "bg-[#FFD700]" },
    { label: "Market Events",     value: String(MARKET_EVENTS.length),   icon: "📅", colour: "bg-[#FF3333] text-white" },
    { label: "Technology Eras",   value: String(TECH_ERAS.length),       icon: "💻", colour: "bg-[#00FFFF]" },
    { label: "Data Sources",      value: String(REQUIRED_DATASETS.length), icon: "🗄️", colour: "bg-black text-white" },
    { label: "Years of History",  value: "150+",                         icon: "📖", colour: "bg-gray-200" },
    {
      label: "Combined Returns",
      value: "2,600×",
      icon: "💰",
      colour: "bg-emerald-500 text-white",
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`border-4 border-black p-3 neo-shadow text-center ${s.colour}`}
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="font-black text-2xl leading-none">{s.value}</div>
          <div className="font-mono text-xs mt-1 opacity-80">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function TradingLegends() {
  const [activeTab, setActiveTab] = useState<LegendTabId>("traders");

  const tabs: { id: LegendTabId; label: string; icon: string; count?: number }[] = [
    { id: "traders",  label: "Trading Legends",   icon: "🏆", count: TRADER_PROFILES.length },
    { id: "events",   label: "Market Events",      icon: "📅", count: MARKET_EVENTS.length },
    { id: "eras",     label: "Technology Eras",    icon: "💻", count: TECH_ERAS.length },
    { id: "datasets", label: "Data Registries",    icon: "🗄️", count: REQUIRED_DATASETS.length },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-black pb-8">
          <div>
            <div className="inline-block bg-[#FFD700] border-4 border-black px-4 py-1 font-mono font-bold uppercase mb-4 neo-shadow">
              150 Years of Trading Mastery
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
              Trading<br />Legends
            </h1>
          </div>
          <div className="mt-6 md:mt-0 max-w-sm text-right">
            <p className="font-mono text-sm mb-3 text-gray-600">
              Jesse Livermore to Jim Simons.<br />
              Ticker tape to machine learning.<br />
              Every major crisis. Every lesson.
            </p>
            <div className="flex gap-2 justify-end flex-wrap">
              <span className="neo-tag bg-black text-[#FFD700] font-mono text-xs px-2 py-1 border-2 border-black">
                1877–2025
              </span>
              <span className="neo-tag bg-black text-white font-mono text-xs px-2 py-1 border-2 border-black">
                10 Traders
              </span>
              <span className="neo-tag bg-black text-[#00FFFF] font-mono text-xs px-2 py-1 border-2 border-black">
                19 Events
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats bar ──────────────────────────────────────────────────── */}
        <StatsBar />

        {/* ── Intro blurb ────────────────────────────────────────────────── */}
        <div className="border-4 border-black bg-[#1a1a2e] text-white p-6 mb-8 neo-shadow">
          <h2 className="font-black uppercase text-xl mb-3">What You'll Learn Here</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
            <div className="border-l-4 border-[#FFD700] pl-3">
              <strong className="text-[#FFD700]">Before Telephones (Pre-1950)</strong><br />
              Jesse Livermore used nothing but ticker tape and a pen. He made and lost $100 million
              by reading price action with zero technology. The discipline he developed — cutting losses,
              letting profits run — still underpins every modern system.
            </div>
            <div className="border-l-4 border-[#00FFFF] pl-3">
              <strong className="text-[#00FFFF]">Telephone & Bloomberg Era (1950–1999)</strong><br />
              Soros broke the Bank of England. PTJ called the '87 crash. Lipschutz built $300M/yr
              at Salomon. The Reuters Dealing System created the modern FX market in 1992 — and the
              traders who mastered it first printed money.
            </div>
            <div className="border-l-4 border-[#FF3333] pl-3">
              <strong className="text-[#FF3333]">Internet & AI Era (2000–Present)</strong><br />
              Jim Simons's Medallion Fund returned 66% annually for 20 years using pure machine learning.
              Today, 70% of FX volume is algorithmic. The edge has moved from information speed
              to pattern recognition at scale.
            </div>
          </div>
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
              {t.count !== undefined && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded font-black ${
                    activeTab === t.id ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}
        <div className="pb-16">
          {activeTab === "traders"  && <TradersTab />}
          {activeTab === "events"   && <EventsTab />}
          {activeTab === "eras"     && <ErasTab />}
          {activeTab === "datasets" && <DatasetsTab />}
        </div>

        {/* ── Footer disclaimer ──────────────────────────────────────────── */}
        <div className="border-t-4 border-black pt-6 pb-8">
          <div className="font-mono text-xs text-gray-400 max-w-4xl">
            <strong>DATA SOURCES:</strong> Trader profiles compiled from Market Wizards (Jack Schwager),
            Investopedia, Wikipedia, Renaissance Technologies research, Quantum Fund historical records, IG Markets
            history. Market events from BIS research, IMF historical data, and academic financial history databases.
            Net worth figures are approximate peak values in contemporary reporting. Past trading performance
            does not guarantee future results. This dataset is for educational and research purposes only.
          </div>
        </div>
      </div>
    </Layout>
  );
}
