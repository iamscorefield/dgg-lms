"use client";

import React from "react";

const foundationalCourses = [
  { id: "01", title: "Basic Computer and Internet Skills for Absolute Beginners" },
  { id: "02", title: "Getting Ready for Online Learning" },
  { id: "03", title: "Introduction to Modern Techie Journey" },
  { id: "04", title: "Introduction to No-Code Tools & Building Your First App or Website" },
  { id: "05", title: "Cybersecurity Fundamentals: Understanding Cybersecurity Basics" },
  { id: "06", title: "Introduction to Artificial Intelligence (AI)" },
  { id: "07", title: "Get To Know Legal Registration of Business in Nigeria" },
  { id: "08", title: "Digital Monetization – Secure Online Opportunities..." }
];

export default function EverythingYouNeed() {
  return (
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="enrollment-pricing">
      {/* Structural Background Graphic Flares */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-[#512d7c]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#f2b42c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Modern Section Title Architecture */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Curriculum Package
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Everything Included In Your Preparation Track
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlock absolute, unrestricted access to all 8 foundational courses, live interactive cohort workshops, custom project submission consoles, and professional certification trackers.
          </p>
        </div>

        {/* 🚀 TWO-COLUMN SPLIT ECOSYSTEM: COVETED GRID + PREMIUM CHECKOUT ANCHOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* LEFT SIDE: THE 8 FOUNDATIONAL COURSES MATRIX (7 COLUMNS) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2 text-left">
              <span>📚</span> Included Foundational Modules (8 Core Tracks)
            </h3>
            
            {/* 🔥 MAINTAINED OLD STRUCTURE: 4 and 4 dynamic responsive column split layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foundationalCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-2xs flex gap-4 items-start hover:border-[#512d7c]/30 transition-all text-left group"
                >
                  <span className="text-xs font-black text-[#f2b42c] bg-[#512d7c] w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#f2b42c] group-hover:text-[#512d7c] transition-colors">
                    {course.id}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                    {course.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: PREMIUM INCOME INCENTIVE & CHECKOUT NODE PANEL (5 COLUMNS) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#512d7c] border-0 rounded-[2.5rem] p-8 text-white shadow-[0_25px_60px_rgba(81,45,124,0.35)] relative overflow-hidden text-left">
              {/* Internal Accent Lighting Panel */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-[#f2b42c] rounded-md font-bold text-[9px] tracking-widest uppercase mb-4">
                Complete Portal Access
              </span>
              
              <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2">
                DGG Academy Prep Bundle
              </h3>
              <p className="text-xs text-purple-100/80 leading-relaxed mb-6 font-medium">
                Gain instant premium access to our complete integrated Learning Management System, download bundles, assignment repositories, and executive certification tracks.
              </p>

              {/* Locked Pricing Display Matrix */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left relative z-10">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block mb-1">
                  Standard Enrollment Fee
                </span>
                <div className="space-y-0.5">
                  {/* Slashed Original Value */}
                  <div className="text-sm font-bold text-purple-300 line-through tracking-tight">
                    ₦125,000
                  </div>
                  {/* Active Discount Value */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-[#f2b42c] tracking-tight">
                      ₦75,000
                    </span>
                    <span className="text-xs font-bold text-white/70 uppercase">
                      NGN One-Time
                    </span>
                  </div>
                </div>
              </div>

              {/* Immediate 20% ROI Direct Commission Compensation Notice */}
              <div className="flex gap-3 items-start text-xs leading-relaxed text-purple-50/90 font-medium mb-8 border-t border-white/10 pt-6">
                <span className="text-lg leading-none">⚡</span>
                <p>
                  <strong>The Earning Loop:</strong> Includes full configuration for your unique outbound tracking nodes. Earn a direct <strong>20% Return on Investment (ROI) cash commission</strong> paid instantly on every verified customer conversion you secure during your immersion timeline.
                </p>
              </div>

              {/* Modified Button Keyword Text */}
              <a 
                href="/signup" 
                className="w-full block text-center py-4 bg-[#f2b42c] text-[#512d7c] hover:bg-[#e0a324] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md border-0 decoration-none cursor-pointer transform hover:scale-[1.02]"
              >
                Explore to Secure Slot Now
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}