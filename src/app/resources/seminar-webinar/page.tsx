"use client";

import { useState } from "react";
import { Play, Calendar, Clock, Video, Download, Users, Bell, ArrowUpRight, ArrowDownToLine, Tv } from "lucide-react";

interface WebinarRecord {
  id: string;
  title: string;
  duration: string;
  speaker: string;
  date: string;
  description: string;
  youtubeId: string;
}

interface UpcomingEvent {
  topic: string;
  date: string;
  time: string;
  mentor: string;
}

export default function SeminarWebinarPage() {
  // 15 Comprehensive Masterclass & Corporate Archive Records
  const webinars: WebinarRecord[] = [
    { id: "01", title: "Scaling B2B Tech Outreach Matrices in 2026", duration: "1:45:20", speaker: "Scorefield Bello", date: "June 14, 2026", description: "Deep-dive session into engineering high-converting automated sales funnels, validating customer lead databases, and closing corporate retainer contracts globally.", youtubeId: "dQw4w9WgXcQ" },
    { id: "02", title: "Advanced Local SEO Optimization Pipelines", duration: "1:12:40", speaker: "Tech Lead Irene", date: "May 28, 2026", description: "How to build proprietary local auditing structures to rank client web architectures on top tiers of search maps instantly.", youtubeId: "dQw4w9WgXcQ" },
    { id: "03", title: "Full-Stack System Performance Diagnostics", duration: "2:05:15", speaker: "Developer Joet", date: "May 15, 2026", description: "Locating memory leaks inside heavy Node.js background runtimes and configuring lightning-fast React state hydration processes.", youtubeId: "dQw4w9WgXcQ" },
    { id: "04", title: "UI/UX Enterprise Product Design Sprints", duration: "1:30:10", speaker: "Design Core Posh B", date: "April 30, 2026", description: "Translating loose multi-tenant SaaS business requirement specs into production-ready high-fidelity component wireframes.", youtubeId: "dQw4w9WgXcQ" },
    { id: "05", title: "The 2026 Freelance Monetization Blueprints", duration: "1:55:00", speaker: "Scorefield Bello", date: "April 12, 2026", description: "Mastering Upwork bidding algorithmic patterns, configuring non-traditional international wallets, and scaling freelance revenue loops safely.", youtubeId: "dQw4w9WgXcQ" },
    { id: "06", title: "AI Prompt Engineering for Business Automation", duration: "1:22:18", speaker: "Automation Lead Team", date: "March 29, 2026", description: "Harnessing macro context prompt frameworks to systematically generate corporate flyer assets, script templates, and pitch documentation.", youtubeId: "dQw4w9WgXcQ" },
    { id: "07", title: "Supabase Relational Database Architecture Safeties", duration: "1:40:50", speaker: "Developer Joet", date: "March 11, 2026", description: "Structuring clean Postgres table foreign keys, managing real-time subscriptions, and keeping public data columns nullable but secure.", youtubeId: "dQw4w9WgXcQ" },
    { id: "08", title: "Corporate Legal Positioning & CAC Frameworks", duration: "1:05:30", speaker: "Legal Consultant", date: "Feb 24, 2026", description: "Navigating corporate regulatory compliance parameters in Nigeria to smoothly scale startups from concepts to venture investments.", youtubeId: "dQw4w9WgXcQ" },
    { id: "09", title: "Building Multi-Tenant SaaS with Next.js", duration: "2:18:00", speaker: "Scorefield Bello", date: "Feb 05, 2026", description: "Architecting decoupled client portals, handling subdomains dynamically, and deploying cloud-ready application matrices.", youtubeId: "dQw4w9WgXcQ" },
    { id: "10", title: "Digital Brand Growth Auditing Frameworks", duration: "1:25:45", speaker: "Tech Lead Irene", date: "Jan 22, 2026", description: "How we engineered the DGG Brand Auditor backend logic to analyze digital footprints on a fully automated scheduling loop.", youtubeId: "dQw4w9WgXcQ" },
    { id: "11", title: "Cybersecurity Baselines for Web App Deployments", duration: "1:37:12", speaker: "SecOps Specialist", date: "Jan 10, 2026", description: "Mitigating standard application vulnerabilities, setting up secure JWT access, and validating browser cookie encryption structures.", youtubeId: "dQw4w9WgXcQ" },
    { id: "12", title: "E-Commerce Conversion UX Pattern Analysis", duration: "1:15:20", speaker: "Design Core Posh B", date: "Dec 18, 2025", description: "Stripping down bloated components to create minimalist checkout layouts that retain cart completions and increase trust scores.", youtubeId: "dQw4w9WgXcQ" },
    { id: "13", title: "Asynchronous Learning & Remote Workspace Habits", duration: "0:58:40", speaker: "Operations Manager", date: "Dec 02, 2025", description: "How remote international tech pods maintain high delivery velocity across varied global corridor time zones without crowded logs.", youtubeId: "dQw4w9WgXcQ" },
    { id: "14", title: "No-Code Rapid Prototyping Systems", duration: "1:44:10", speaker: "Product Engineer", date: "Nov 19, 2025", description: "Deploying fully operational marketplace web structures and workflows for client validation rounds without writing early lines of code.", youtubeId: "dQw4w9WgXcQ" },
    { id: "15", title: "Venture Capital Seed Round Pitch Preparations", duration: "2:30:15", speaker: "Scorefield Bello", date: "Nov 04, 2025", description: "The definitive technical walkthrough on structuring capital proposals, projecting growth metrics, and positioning platforms for institutional backing.", youtubeId: "dQw4w9WgXcQ" }
  ];

  const upcomingEvents: UpcomingEvent[] = [
    { topic: "Predictive B2B Pipeline Nurturing Systems", date: "July 08, 2026", time: "6:00 PM WAT", mentor: "Scorefield Bello" },
    { topic: "Deep Cold Calling Scripts & Deal Closing Strategies", date: "July 22, 2026", time: "4:00 PM WAT", mentor: "Sales Team Lead" }
  ];

  const [currentWebinar, setCurrentWebinar] = useState<WebinarRecord>(webinars[0]);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* SECTION HEADER */}
        <div className="text-left max-w-3xl mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-xs font-black text-[#e0a51a] uppercase tracking-widest rounded-full mb-3">
            🎥 Global Masterclass Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A0033] tracking-tight leading-tight">
            Seminars & Strategic Webinars
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Gain elite system insights from our recorded live sessions. Stream advanced growth models, software architecture walk-throughs, and global tech operations on demand without leaving your platform wrapper.
          </p>
        </div>

        {/* TOP SECTION: MATRIX THEATER THEATER PLAYER LAYER */}
        <section className="grid lg:grid-cols-12 gap-8 mb-16 items-start">
          <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm">
            <div className="aspect-video w-full rounded-2xl bg-black border border-slate-800 shadow-inner overflow-hidden relative">
              <iframe
                src={`https://www.youtube.com/embed/${currentWebinar.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                title={currentWebinar.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
            <div className="mt-5 text-left">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                  Host: {currentWebinar.speaker}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  📅 {currentWebinar.date}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1A0033] tracking-tight mt-3 mb-2">
                {currentWebinar.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                {currentWebinar.description}
              </p>
            </div>
          </div>

          {/* SIDEBAR BOX: RECONFIGURED FOR ENGAGEMENT */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#512d7c] to-[#2E164A] text-white p-6 sm:p-8 rounded-3xl shadow-md h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div>
              <h3 className="text-base font-black tracking-tight mb-4 flex items-center gap-2 text-[#f2b42c]">
                <Video size={20} /> Digital Network Rules
              </h3>
              <p className="text-xs text-purple-100 font-medium leading-relaxed mb-4">
                These advanced sessions expand directly beyond your standard baseline track syllabus. To turn these hours into real technical assets:
              </p>
              <ul className="text-xs space-y-3 font-semibold text-purple-200 border-t border-white/10 pt-4">
                <li className="flex items-start gap-2">🚀 Cross-reference code workflows with your local workspace modules.</li>
                <li className="flex items-start gap-2">🚀 Download the attached summary blueprint indices before streaming.</li>
                <li className="flex items-start gap-2">🚀 Bring unresolved track bugs directly into our weekly live workshops.</li>
              </ul>
            </div>
            
            <a 
              href="/signup" 
              className="mt-8 w-full py-3.5 bg-[#f2b42c] hover:bg-[#dfa21e] text-black font-black uppercase text-xs tracking-widest text-center rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 decoration-none"
            >
              Join Next Live Cohort <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        {/* CONTROLS MATRIX GRID (15 CARDS) */}
        <section className="text-left mb-20">
          <div className="mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Tv size={20} className="text-[#512d7c]" /> Seminar Archive Console ({webinars.length} Deep-Dive Sessions)
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Select any corporate briefing milestone below to launch that specific video asset directly into the primary theater interface above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {webinars.map((video) => {
              const isActive = currentWebinar.id === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => {
                    setCurrentWebinar(video);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className={`w-full text-left bg-slate-50/50 hover:bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between group shadow-3xs cursor-pointer ${
                    isActive 
                      ? "border-[#512d7c] bg-white ring-2 ring-[#512d7c]/20 shadow-md" 
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-mono font-black text-xs transition-all ${
                        isActive ? "bg-[#512d7c] text-white border-[#512d7c]" : "bg-white text-[#512d7c] border-slate-200 group-hover:bg-[#512d7c] group-hover:text-white"
                      }`}>
                        {video.id}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {video.date}
                      </span>
                    </div>

                    <h4 className={`font-black text-sm tracking-tight leading-snug mb-1.5 transition-colors ${
                      isActive ? "text-[#512d7c]" : "text-slate-800 group-hover:text-[#512d7c]"
                    }`}>
                      {video.title}
                    </h4>
                    
                    <p className="text-xs font-bold text-purple-600/90 mb-2">Host: {video.speaker}</p>
                    
                    <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {video.duration}
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                      isActive ? "text-[#512d7c]" : "text-slate-400 group-hover:text-[#512d7c]"
                    }`}>
                      {isActive ? "Now Streaming" : "Launch Asset"} <Play size={10} className="fill-current" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION A: THE LIVE SESSION BROADCAST SCHEDULE TIMELINE */}
        <section className="text-left max-w-4xl mx-auto mb-20">
          <div className="mb-6 border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Calendar size={22} className="text-[#512d7c]" /> Upcoming Live Masterclass Broadcasts
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Sync your primary workflow schedule to participate live in our premium regional community sprint pipelines.
            </p>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-2xs transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-black px-2 py-0.5 rounded">Live Workshop</span>
                  <h4 className="font-black text-base text-slate-800 tracking-tight">{event.topic}</h4>
                  <p className="text-xs font-medium text-slate-400">Led by Lead Mentor: <span className="font-bold text-[#512d7c]">{event.mentor}</span></p>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-slate-200/60">
                  <div className="text-left sm:text-right font-mono text-xs font-bold text-slate-600">
                    <div>📅 {event.date}</div>
                    <div className="text-slate-400">{event.time}</div>
                  </div>
                  <button type="button" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#512d7c] hover:bg-[#3f2261] text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-3xs cursor-pointer border-0">
                    <Bell size={12} /> Sync Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION B: KEY TAKEAWAY SUMMARY DOWNLOADS */}
        <section className="text-left max-w-4xl mx-auto mb-20">
          <div className="mb-6 border-b border-slate-200 pb-3">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Download size={22} className="text-[#512d7c]" /> Core Takeaway Summaries &amp; Index Assets
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Rapidly extract blueprints, corporate script templates, and architecture map files attached to the masterclasses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-purple-200 transition-all">
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-800 tracking-tight truncate">B2B Lead Generation &amp; Pipeline Playbook</h4>
                <p className="text-[11px] text-slate-400 font-medium font-mono">PDF File • 4.8 MB</p>
              </div>
              <button type="button" className="p-2.5 bg-slate-50 hover:bg-purple-50 text-[#512d7c] rounded-xl border border-slate-100 flex-shrink-0 transition cursor-pointer">
                <ArrowDownToLine size={16} />
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-purple-200 transition-all">
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-800 tracking-tight truncate">Enterprise Local SEO Audit Metrics Deck</h4>
                <p className="text-[11px] text-slate-400 font-medium font-mono">XLSX Sheet • 1.2 MB</p>
              </div>
              <button type="button" className="p-2.5 bg-slate-50 hover:bg-purple-50 text-[#512d7c] rounded-xl border border-slate-100 flex-shrink-0 transition cursor-pointer">
                <ArrowDownToLine size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION C: GUEST SPEAKER ECOSYSTEM MATRIX */}
        <section className="text-left bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-3xl max-w-5xl mx-auto shadow-2xs">
          <div className="mb-6 border-b border-slate-200 pb-4">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Users size={18} className="text-[#512d7c]" /> DGG Mentor &amp; Masterclass Operations Ecosystem
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Connecting professional tech leads and closing agents across five international hubs to structure global systems.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-3xs">
              <p className="font-black text-[#512d7c] text-sm sm:text-base leading-tight">Scorefield Bello</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-0.5">CEO / Strategy Architect</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-3xs">
              <p className="font-black text-[#512d7c] text-sm sm:text-base leading-tight">Irene</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-0.5">Local SEO Lead</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-3xs">
              <p className="font-black text-[#512d7c] text-sm sm:text-base leading-tight">Joet</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-0.5">Backend Core Dev</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-3xs">
              <p className="font-black text-[#512d7c] text-sm sm:text-base leading-tight">Posh B</p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-0.5">UI/UX Design Lead</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}