"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Radio, Clock, RadioTower, Calendar, ArrowUpRight, Signal, Hourglass, Globe, Tv, Zap, Users, ShieldAlert, Sparkles } from "lucide-react";

interface RadioEpisode {
  id: string;
  title: string;
  duration: string;
  airDate: string;
  station: "Top Radio 90.9 FM" | "Sweet FM 107.1";
  description: string;
}

interface Season {
  name: string;
  month: string;
  episodes: RadioEpisode[];
}

export default function RadioProgramPage() {
  // 6 Full Seasons Expanded From January 2026 to June 2026 (4 Episodes per month)
  const seasonalCatalog: Season[] = [
    {
      name: "Season 06: Scale & Retain",
      month: "June 2026",
      episodes: [
        { id: "S6E4", title: "Configuring Non-Traditional Sockets for Asset Transfers", duration: "30:00", airDate: "June 27, 2026", station: "Top Radio 90.9 FM", description: "Navigating international freelance currency withdrawals, configuring secure payment APIs, and retaining liquidity safely." },
        { id: "S6E3", title: "The DGG Brand Auditor Backend Framework Tour", duration: "60:00", airDate: "June 25, 2026", station: "Sweet FM 107.1", description: "Breaking down the automated Node.js and React background algorithms used to process instant local search audits." },
        { id: "S6E2", title: "B2B Retainer Funnel Engineering Strategies", duration: "30:00", airDate: "June 20, 2026", station: "Top Radio 90.9 FM", description: "How tech agencies structure macro target lead matrices, automate cold email arrays, and close operations deals smoothly." },
        { id: "S6E1", title: "Erasing Core Workflow Bottlenecks inside Local Firms", duration: "60:00", airDate: "June 18, 2026", station: "Sweet FM 107.1", description: "A conversational guide map explaining structural optimization and setting up lightweight user-friendly management platforms." }
      ]
    },
    {
      name: "Season 05: Foundations First",
      month: "May 2026",
      episodes: [
        { id: "S5E4", title: "Mastering Localized Search Architecture Basics", duration: "30:00", airDate: "May 30, 2026", station: "Top Radio 90.9 FM", description: "Simple techniques to push local business data models to premium map directories to rank above close regional rivals." },
        { id: "S5E3", title: "Undergraduate Roadmaps into Modern Techie Tracks", duration: "60:00", airDate: "May 28, 2026", station: "Sweet FM 107.1", description: "Balancing strict academic tasks while forging clean programming logic frameworks and row-level data protects." },
        { id: "S5E2", title: "Why Custom Lightweight Platforms Save Capital Yearly", duration: "30:00", airDate: "May 23, 2026", station: "Top Radio 90.9 FM", description: "Stripping commercial plugins and complex themes to avoid annual subscription billing via clean, tailored architectures." },
        { id: "S5E1", title: "Bypassing Loop Hell: A Beginner's Autonomy Strategy", duration: "60:00", airDate: "May 21, 2026", station: "Sweet FM 107.1", description: "How to stop re-watching repetitive beginner courses and start engineering functional apps with strict milestone scoring." }
      ]
    },
    {
      name: "Season 04: AI Automation Sprints",
      month: "April 2026",
      episodes: [
        { id: "S4E4", title: "Prompt Context Macro Engineering", duration: "30:00", airDate: "April 25, 2026", station: "Top Radio 90.9 FM", description: "Configuring systematic data prompts to automate document curation schemas and promotional design templates seamlessly." },
        { id: "S4E3", title: "Local Market Content Optimization Patterns", duration: "60:00", airDate: "April 23, 2026", station: "Sweet FM 107.1", description: "How regional hubs maximize localized content delivery vectors to dominate audience attention spans on strict budgets." },
        { id: "S4E2", title: "Supabase User Authentication State Handlers", duration: "30:00", airDate: "April 18, 2026", station: "Top Radio 90.9 FM", description: "Safe tracking of student metadata arrays, session timeout fallbacks, and multi-tenant database protection criteria." },
        { id: "S4E1", title: "E-Commerce Core Checkout Pipeline Optimization", duration: "60:00", airDate: "April 16, 2026", station: "Sweet FM 107.1", description: "Erasing conversion drag factors from payment frames to reduce shopping cart bounce behavior inside agricultural marketplaces." }
      ]
    },
    {
      name: "Season 03: Monetization Loops",
      month: "March 2026",
      episodes: [
        { id: "S3E4", title: "Upwork Algorithm Optimization Blueprints", duration: "30:00", airDate: "March 28, 2026", station: "Top Radio 90.9 FM", description: "Building highly authoritative technical profiles and managing rapid-response client outreach schedules to win active contracts." },
        { id: "S3E3", title: "Structuring Global Remote Engineering Guilds", duration: "60:00", airDate: "March 26, 2026", station: "Sweet FM 107.1", description: "Asynchronous management setups designed to combine full-stack talents across multiple borders into single-delivery agency cells." },
        { id: "S3E2", title: "Bypassing Legacy Framework Maintenance Drag", duration: "30:00", airDate: "March 21, 2026", station: "Top Radio 90.9 FM", description: "Migrating standard monolithic systems into decoupled cloud microservices to improve latency performance scores." },
        { id: "S3E1", title: "Venture Financing Foundations for Tech Founders", duration: "60:00", airDate: "March 19, 2026", station: "Sweet FM 107.1", description: "Mapping institutional pitch proposals and financial forecasting models to clear international seed funding rounds." }
      ]
    },
    {
      name: "Season 02: Platform Architecture",
      month: "February 2026",
      episodes: [
        { id: "S2E4", title: "Next.js App Router Core Rendering Mechanics", duration: "30:00", airDate: "February 28, 2026", station: "Top Radio 90.9 FM", description: "Configuring server-side optimization pipelines and injecting explicit use-client markers into complex interactive frameworks." },
        { id: "S2E3", title: "Ecosystem Radio Stream Synchronization Setups", duration: "60:00", airDate: "February 26, 2026", station: "Sweet FM 107.1", description: "Deploying high-availability cloud audio relays and connecting broadcast panel streams into standard Next.js layouts." },
        { id: "S2E2", title: "Database Row-Level Security Policy Definitions", duration: "30:00", airDate: "February 21, 2026", station: "Top Radio 90.9 FM", description: "How to prevent unauthenticated read/write loops while handling sensitive profile storage collections securely." },
        { id: "S2E1", title: "Responsive Interface Breakpoint Strategy Basics", duration: "60:00", airDate: "February 15, 2026", station: "Sweet FM 107.1", description: "Designing flexible fluid component grids that look consistent from compact layout smartphones to widescreen displays." }
      ]
    },
    {
      name: "Season 01: System Launch",
      month: "January 2026",
      episodes: [
        { id: "S1E4", title: "The Initial 2026 DGG Prep Strategy Overview", duration: "30:00", airDate: "January 31, 2026", station: "Top Radio 90.9 FM", description: "Unveiling the foundational curriculum modules engineered to build robust software habits from the very first line of code." },
        { id: "S1E3", title: "Basic Computer Operating Layout Diagnostics", duration: "60:00", airDate: "January 29, 2026", station: "Sweet FM 107.1", description: "Erasing elementary technical barriers for absolute beginners before entering deep programmatic tracks." },
        { id: "S1E2", title: "The Economic Shift Toward Distributed Cloud Work", duration: "30:00", airDate: "January 24, 2026", station: "Top Radio 90.9 FM", description: "Analyzing the global market transition toward specialized freelance hubs and cross-border tech closed agencies." },
        { id: "S1E1", title: "Platform Architecture Conception & Schema Blueprints", duration: "60:00", airDate: "January 22, 2026", station: "Sweet FM 107.1", description: "The premier launch episode mapping out the engineering roadmap and educational vision behind the DGG Academy LMS ecosystem." }
      ]
    }
  ];

  const [activeSeason, setActiveSeason] = useState<number>(0);
  const [currentEpisode, setCurrentEpisode] = useState<RadioEpisode>(seasonalCatalog[0].episodes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("July 02, 2026 10:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* HEADER BLOCK */}
        <div className="text-left max-w-3xl mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-xs font-black text-[#512d7c] uppercase tracking-widest rounded-full mb-3">
            📻 THE DIGITAL GROWTH HOUR
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A0033] tracking-tight leading-tight">
            Empowering the Youth with Borderless Digital Value
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Absolutely Free on Air! Access inspiring tech conversations, practical local growth insights, and career roadmap blueprints broadcasted directly from our regional media slots.
          </p>
        </div>

        {/* LIVE BROADCASTS & ONLINE COUNTDOWN TIMER */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Top Radio Card */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left relative overflow-hidden shadow-3xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black tracking-wider bg-purple-100 text-[#512d7c] px-2.5 py-1 rounded-md uppercase">Lagos Base</span>
              <Signal size={16} className="text-[#512d7c]" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Radio 90.9 FM</h3>
            <p className="text-xs font-bold text-[#512d7c] mt-0.5">Saturdays: 11:30 AM – 12:00 PM</p>
            <p className="text-xs font-medium text-slate-400 mt-3 leading-relaxed">
              Hosted by <span className="font-bold text-slate-700">Justina Onyekachi (Joet)</span>. Unlocking global remote income streams directly from your mobile device.
            </p>
          </div>

          {/* Sweet FM Card */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left relative overflow-hidden shadow-3xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md uppercase">Abeokuta Base</span>
              <RadioTower size={16} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Sweet FM 107.1</h3>
            <p className="text-xs font-bold text-amber-600 mt-0.5">Thursdays: 10:00 AM – 11:00 AM</p>
            <p className="text-xs font-medium text-slate-400 mt-3 leading-relaxed">
              Hosted by <span className="font-bold text-slate-700">Justina Onyekachi (Joet)</span>. Breaking down foundational tech skills and local institutional growth blueprints.
            </p>
          </div>

          {/* Countdown Unit */}
          <div className="bg-gradient-to-br from-[#512d7c] to-[#1A0033] text-white p-6 rounded-2xl text-left flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">
                <Hourglass size={12} /> Next Live Session
              </div>
              <p className="text-xs text-purple-200 font-semibold leading-tight">Tune in live online or over our local air loops via our central hub gateway:</p>
              
              <div className="grid grid-cols-4 gap-2 my-4 text-center">
                <div className="bg-white/10 p-2 rounded-xl border border-white/5"><span className="block font-black text-lg sm:text-xl font-mono">{timeLeft.days}</span><span className="text-[9px] uppercase tracking-wider text-purple-300">Days</span></div>
                <div className="bg-white/10 p-2 rounded-xl border border-white/5"><span className="block font-black text-lg sm:text-xl font-mono">{timeLeft.hours}</span><span className="text-[9px] uppercase tracking-wider text-purple-300">Hrs</span></div>
                <div className="bg-white/10 p-2 rounded-xl border border-white/5"><span className="block font-black text-lg sm:text-xl font-mono">{timeLeft.minutes}</span><span className="text-[9px] uppercase tracking-wider text-purple-300">Mins</span></div>
                <div className="bg-white/10 p-2 rounded-xl border border-white/5"><span className="block font-black text-lg sm:text-xl font-mono">{timeLeft.seconds}</span><span className="text-[9px] uppercase tracking-wider text-purple-300">Secs</span></div>
              </div>
            </div>

            <a 
              href="https://live.dglobalgrowthfield.com" 
              target="_blank" 
              className="w-full py-2.5 bg-[#f2b42c] hover:bg-[#dfa21e] text-black font-black uppercase text-xs tracking-widest text-center rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 decoration-none"
            >
              <Globe size={14} /> Stream Live Portal
            </a>
          </div>
        </section>

        {/* ACTIVE AUDIO PLAYER UNIT */}
        <section className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl mb-16 flex flex-col md:flex-row items-center gap-6 relative shadow-2xs">
          <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-[#512d7c] to-[#1A0033] flex items-center justify-center text-[#f2b42c] shadow-md flex-shrink-0">
            <Radio size={36} className={isPlaying ? "animate-pulse" : ""} />
          </div>
          <div className="flex-1 text-left w-full">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider bg-[#512d7c]/10 text-[#512d7c] px-2 py-0.5 rounded">
                Code {currentEpisode.id}
              </span>
              <span className="text-xs font-bold text-slate-400">📡 Broadcaster: {currentEpisode.station}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#1A0033] tracking-tight leading-snug mb-1">{currentEpisode.title}</h2>
            <p className="text-xs font-medium text-slate-400 mb-4 font-mono">Air Date Sync: {currentEpisode.airDate}</p>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-5">{currentEpisode.description}</p>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-2xl max-w-xl">
              <button 
                type="button" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 rounded-full bg-[#512d7c] hover:bg-[#3f2261] flex items-center justify-center text-white transition shadow-sm border-0 focus:outline-none cursor-pointer"
              >
                {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" className="ml-0.5" />}
              </button>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-[#f2b42c] transition-all duration-300 ${isPlaying ? "w-1/2" : "w-0"}`} />
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">{currentEpisode.duration}</span>
            </div>
          </div>
        </section>

        {/* 6 SEASONS ARRAYS MATRIX LIST (JAN TO DATE) */}
        <section className="text-left mb-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-8 gap-4">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {seasonalCatalog.map((season, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveSeason(idx);
                    setCurrentEpisode(seasonalCatalog[idx].episodes[0]);
                  }}
                  className={`text-xs md:text-sm font-black uppercase tracking-wider pb-2 border-b-2 transition-all cursor-pointer bg-transparent border-0 focus:outline-none ${
                    activeSeason === idx ? "border-[#512d7c] text-[#512d7c]" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {season.month.split(" ")[0]}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#512d7c] bg-purple-50 px-3 py-1 rounded-md border border-purple-100">
              Active: {seasonalCatalog[activeSeason].name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalCatalog[activeSeason].episodes.map((episode) => {
              const isActive = currentEpisode.id === episode.id;
              return (
                <button
                  key={episode.id}
                  type="button"
                  onClick={() => {
                    setCurrentEpisode(episode);
                    setIsPlaying(true);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className={`w-full text-left bg-slate-50/50 hover:bg-white border rounded-2xl p-5 flex gap-4 transition-all group cursor-pointer ${
                    isActive ? "border-[#512d7c] bg-white ring-2 ring-[#512d7c]/20 shadow-sm" : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-mono font-black text-xs transition-all flex-shrink-0 ${
                    isActive ? "bg-[#512d7c] text-white border-[#512d7c]" : "bg-white text-[#512d7c] border-slate-200 group-hover:bg-[#512d7c] group-hover:text-white"
                  }`}>
                    {episode.id.slice(-2)}
                  </div>
                  <div className="flex flex-col justify-between min-w-0 w-full">
                    <div>
                      <div className="flex items-center justify-between w-full gap-2 mb-1">
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 truncate max-w-[150px]">{episode.station}</span>
                        <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">📅 {episode.airDate.split(',')[0]}</span>
                      </div>
                      <h4 className={`font-black text-sm tracking-tight leading-snug mb-1.5 transition-colors ${isActive ? "text-[#512d7c]" : "text-slate-800 group-hover:text-[#512d7c]"}`}>
                        {episode.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2">{episode.description}</p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>⏱️ Runtime: {episode.duration} Mins</span>
                      <span className={`uppercase font-black flex items-center gap-1 ${isActive ? "text-[#512d7c]" : "group-hover:text-[#512d7c]"}`}>
                        {isActive ? "Streaming Now" : "Load Track"} ➔
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ⚡ NEW SECTION 1: MODERN MEDIA JINGLE & PROMOTIONAL SPONSORSHIPS */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 mb-20 text-left shadow-3xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f2b42c]/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-[10px] font-black text-amber-800 uppercase tracking-widest rounded-md mb-4">
              <Sparkles size={12} /> Airtime Opportunities
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
              Deploy Your Brand Jingles &amp; Audio Promotions Globally
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              Position your business directly in front of thousands of high-intent tech professionals, corporate founders, and student communities. Leverage our prime airtime segments across Lagos and Abeokuta to broadcast conversion-optimized audio placements.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/contact" className="px-5 py-3 bg-[#512d7c] hover:bg-[#3f2261] text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow-sm decoration-none">
                Book Promotion Slot
              </a>
              <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-600 shadow-3xs">
                📞 Call Enquiries: 09124923196
              </div>
            </div>
          </div>
        </section>

        {/* ⚡ NEW SECTION 2: MEDIA HOUSE AZURACAST DIGITAL TRANSITION ECOSYSTEM */}
        <section className="bg-white border-2 border-dashed border-purple-200 rounded-3xl p-6 sm:p-10 mb-20 text-left relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 text-[10px] font-black text-[#512d7c] uppercase tracking-widest rounded-md">
                <Zap size={12} /> Technical Partnership Matrix
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Stop Wasting Capital on Bulky Traditional Radio Hardware
              </h3>
              <p className="text-sm font-bold text-purple-700">
                Are you ready to wave goodbye to expensive antenna setups, heavy fuel costs, and local transmission restrictions?
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                Traditional broadcasting bleeds massive budget pools on hardware maintenance. DGG Academy helps modern media houses transition safely into high-availability **Digital Cloud Radio arrays**. Using optimized **Virtual Private Servers (VPS)** and an integrated **Azuracast control dashboard**, you can broadcast crystal-clear audio streams globally with zero terrestrial limitations.
              </p>
            </div>
            
            <div className="lg:col-span-4 bg-[#512d7c]/5 border border-[#512d7c]/10 p-6 rounded-2xl space-y-4 text-center">
              <p className="text-xs font-black text-[#512d7c] uppercase tracking-wider">Ecosystem Modernization Partnership</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Erase local infrastructure boundaries entirely. Join the DGlobal collaborative structural layout to deploy your digital audio sockets smoothly.
              </p>
              <a href="/contact" className="w-full inline-flex items-center justify-center px-4 py-3 bg-[#512d7c] hover:bg-[#3f2261] text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-sm decoration-none">
                Request Cloud Setup
              </a>
            </div>
          </div>
        </section>

        {/* ⚡ NEW SECTION 3: CAMPUS OUTREACH & YOUTH INTEGRATION HUB */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 text-left shadow-3xs relative overflow-hidden">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-[#512d7c] text-[10px] font-black uppercase tracking-widest rounded-md">
                <Users size={12} /> Community Expansion Node
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Inviting Campuses, Undergraduates &amp; Youth Communities
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                We are actively synchronizing with student institutions, tech clubs, and ambitious youth demographics across Nigeria. If you are looking to bring practical digital value pipelines, localized masterclasses, or professional growth sprint models right onto your campus corridor, let's collaborate to build an unshakeable ecosystem.
              </p>
            </div>
            <div className="md:col-span-4 w-full text-center md:text-right">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#f2b42c] hover:bg-[#dfa21e] text-black font-black text-xs uppercase tracking-widest rounded-xl transition shadow-md w-full sm:w-auto decoration-none">
                Register Your Hub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}