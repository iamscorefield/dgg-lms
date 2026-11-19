"use client";

import React from "react";

const freeModules = [
  { id: "01", title: "Basic Computer & Internet Fundamentals" },
  { id: "02", title: "Hardware, Software & Peripheral Setup" },
  { id: "03", title: "Browser Configuration & Safe Navigation" },
  { id: "04", title: "Introduction to Your Modern Tech Journey" }
];

const prepModules = [
  { id: "01", title: "Core Digital Literacy & Productivity Systems" },
  { id: "02", title: "Interactive Workshop & Cohort Integration" },
  { id: "03", title: "Custom Project Submission & Sandboxes" },
  { id: "04", title: "Professional Certification & Progress Tracking" }
];

const businessModules = [
  { id: "01", title: "Legal Registration with CAC (Nigeria)" },
  { id: "02", title: "Business Name & Corporate Entity Setup" },
  { id: "03", title: "Annual Returns, Tax & Regulatory Compliance" },
  { id: "04", title: "Venture Operations, Planning & Scaling" }
];

export default function EverythingYouNeed() {
  return (
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0 font-sans" id="enrollment-pricing">
      {/* Structural Background Graphic Flares */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-[#512d7c]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#f2b42c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Modern Section Title Architecture */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Curriculum Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Choose Your Learning &amp; Business Track
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether you are starting from absolute scratch with our free onboarding track, advancing through our core Prep bundle, or launching your enterprise with our Business tier, we have structured your path to success.
          </p>
        </div>

        {/* 🚀 THREE-COLUMN DISTINCT TIER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          
          {/* TIER 1: FREE FOUNDATION TRACK */}
          <div className="bg-white border border-slate-200/90 rounded-[2.5rem] p-8 shadow-2xs flex flex-col justify-between text-left relative overflow-hidden hover:border-green-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md font-bold text-[9px] tracking-widest uppercase">
                  Onboarding Entry
                </span>
                <span className="text-2xl">🌱</span>
              </div>

              <h3 className="text-xl font-black text-[#512d7c] uppercase tracking-wide mb-2">
                Free Foundation Track
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                Essential introductory modules designed to orient every new student into digital literacy, hardware basics, and safe browsing.
              </p>

              {/* Price Tag */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Access Model
                </span>
                <div className="text-3xl font-black text-green-600 tracking-tight">
                  FREE
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Modules (4 Tracks)</h4>
                {freeModules.map((m) => (
                  <div key={m.id} className="flex gap-3 items-start text-xs font-bold text-slate-700">
                    <span className="text-green-600 font-black">✓</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <a 
              href="/signup" 
              className="w-full block text-center py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-widest rounded-xl transition-all decoration-none cursor-pointer"
            >
              Start Free Now
            </a>
          </div>

          {/* TIER 2: PREP COURSE BUNDLE (₦75,000) */}
          <div className="bg-[#512d7c] border-0 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 text-[#f2b42c] rounded-md font-bold text-[9px] tracking-widest uppercase">
                  Most Popular Prep
                </span>
                <span className="text-2xl">⚡</span>
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-2">
                Prep Course Bundle
              </h3>
              <p className="text-xs text-purple-100/80 leading-relaxed mb-6 font-medium">
                Comprehensive preparation track with live interactive workshops, custom project execution, and certification trackers.
              </p>

              {/* Price Tag */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block mb-1">
                  Standard Enrollment Fee
                </span>
                <div className="text-sm font-bold text-purple-300 line-through">₦125,000</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#f2b42c] tracking-tight">₦75,000</span>
                  <span className="text-xs font-bold text-white/70 uppercase">One-Time</span>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Included Modules (4 Core Tracks)</h4>
                {prepModules.map((m) => (
                  <div key={m.id} className="flex gap-3 items-start text-xs font-bold text-purple-50">
                    <span className="text-[#f2b42c] font-black">✓</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <a 
              href="/signup" 
              className="w-full block text-center py-4 bg-[#f2b42c] text-[#512d7c] hover:bg-[#e0a324] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md decoration-none cursor-pointer"
            >
              Enroll in Prep Track
            </a>
          </div>

          {/* TIER 3: BUSINESS TRAINING TRACK (₦100,000) */}
          <div className="bg-white border-2 border-[#f2b42c]/60 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between text-left relative overflow-hidden hover:shadow-2xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-bold text-[9px] tracking-widest uppercase">
                  Entrepreneurship Tier
                </span>
                <span className="text-2xl">📈</span>
              </div>

              <h3 className="text-xl font-black text-[#512d7c] uppercase tracking-wide mb-2">
                Business Training Track
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
                Professional enterprise setup, CAC registration guidance, regulatory compliance, and venture scaling frameworks.
              </p>

              {/* Price Tag */}
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Standard Business Fee
                </span>
                <div className="text-sm font-bold text-slate-400 line-through">₦150,000</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-600 tracking-tight">₦100,000</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">One-Time</span>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-3 mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Modules (4 Core Tracks)</h4>
                {businessModules.map((m) => (
                  <div key={m.id} className="flex gap-3 items-start text-xs font-bold text-slate-700">
                    <span className="text-amber-600 font-black">✓</span>
                    <span>{m.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <a 
              href="/signup" 
              className="w-full block text-center py-4 bg-[#512d7c] hover:bg-[#3f2162] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md decoration-none cursor-pointer"
            >
              Secure Business Slot Now
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}