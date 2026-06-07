"use client";

import React from "react";

const scheduleBatches = [
  {
    type: "Weekday Cohort Track",
    days: "Mon, Wed & Thu",
    time: "10:00 AM – 3:00 PM",
    format: "Live Hybrid Deployment (Online + In‑Person)",
    activityTitle: "Core Technical Syncs & Interactive Sprints",
    description: "Intensive training blocks covering core framework architecture, live development sprint configurations, instant code troubleshooting loops, and practical real-world client walk‑throughs.",
    badgeColor: "bg-[#512d7c] text-white",
    indicatorColor: "bg-[#f2b42c]"
  },
  {
    type: "Weekend Intensive Track",
    days: "Saturday Only",
    time: "11:00 AM – 3:00 PM",
    format: "Live Hybrid Sandbox Lab",
    activityTitle: "Portfolio Audits & Monetization Labs",
    description: "Hands-on collaborative build labs completely focused on tracking global portfolio development, freelance platform profiling on Upwork, career path guidance, and team project configurations.",
    badgeColor: "bg-[#f2b42c] text-[#512d7c]",
    indicatorColor: "bg-[#512d7c]"
  }
];

export default function TrainingSchedule() {
  return (
    /* 🔥 FIXED: Eliminated the harsh old gradient block to deliver an elegant, clean structural layout with optimal vertical spacing */
    <section className="pt-0 pb-24 bg-white relative overflow-hidden mt-0 border-t-0" id="cohort-schedules">
      {/* Background Decorative Radial Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#512d7c]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Modern Section Title Architecture */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Cohort Calendars
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Live Skills &amp; Career Training Batches
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our structured, interactive live programs are engineered to accommodate students, graduates, and active professionals. Choose the synchronization tract that best scales with your current weekly lifecycle.
          </p>
        </div>

        {/* 🚀 TWO-COLUMN HIGH-FIDELITY COHORT CARD ARRAY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {scheduleBatches.map((batch, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50/70 border border-slate-200/80 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left relative overflow-hidden"
            >
              {/* Corner Ambient Flare Graphic */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/40 rounded-bl-[4rem] pointer-events-none" />

              <div className="space-y-6">
                {/* Track Badge Descriptor */}
                <div className="flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${batch.badgeColor}`}>
                    {batch.type}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <span className={`w-2 h-2 rounded-full ${batch.indicatorColor} animate-pulse`} />
                    Active Cycle
                  </div>
                </div>

                {/* Day & Time Frame Metric Group */}
                <div className="border-b border-slate-200/60 pb-4">
                  <h3 className="text-2xl font-black text-[#512d7c] tracking-tight mb-1">
                    {batch.days}
                  </h3>
                  <p className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    🕒 {batch.time} <span className="text-slate-400 font-medium">({batch.format})</span>
                  </p>
                </div>

                {/* Technical Activity Content Parameters */}
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-[#512d7c] uppercase tracking-wide">
                    {batch.activityTitle}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                    {batch.description}
                  </p>
                </div>
              </div>

              {/* Action Onboarding Card Link */}
              <div className="pt-8">
                <a 
                  href="/signup" 
                  className="w-full block text-center py-3.5 bg-white hover:bg-[#512d7c] border border-slate-200 text-slate-800 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-2xs cursor-pointer border-solid decoration-none"
                >
                  Join This Batch
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote Compliance Banner Panel */}
        <div className="mt-8 max-w-2xl mx-auto bg-amber-50/50 border border-amber-200/40 p-4 rounded-2xl flex items-center gap-3 text-left">
          <span className="text-xl">💡</span>
          <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed font-medium italic">
            <strong>Enrollment Lifecycle Notice:</strong> Training batches execute continuously in rotating functional cycles across the academic calendar. Shortlisted students can seamlessly map into the next available automated cohort track without onboarding friction.
          </p>
        </div>

      </div>
    </section>
  );
}