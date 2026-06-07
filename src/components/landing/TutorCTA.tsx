"use client";

import React from "react";

const instructorPerks = [
  "Monetize your technical experience through highly competitive hourly or cohort instruction tracks",
  "Gain access to vetted, passionate African students, interns, and corporate teams ready to scale",
  "Leverage our complete pre-built LMS platform architecture, streaming tools, and grading sandboxes",
  "Design specialized advanced elective masterclasses mapped to modern tech frameworks"
];

export default function TutorCTA() {
  return (
    /* 🔥 FIXED: Set padding parameters to pt-0 pb-24 to lock seamlessly into the landing page flow cascade */
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="tutor-onboarding">
      {/* Background Graphic Flares */}
      <div className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-[#512d7c]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-[#f2b42c]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Core Structural Panel Card Frame */}
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* 🎯 LEFT SIDE CONTENT: VALUE PERKS INSTRUCTION (7 COLUMNS) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#f2b42c]/10 border border-[#f2b42c]/30 text-amber-700 rounded-md font-bold text-[9px] tracking-widest uppercase mb-3">
                  🤝 Faculty Recruitment Node
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#512d7c] tracking-tight leading-none">
                  Become a Tutor at DGG Academy
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Share your technical expertise, teach passionate upcoming engineers and analysts, and scale your earning power while engineering real socioeconomic impact.
                </p>
              </div>

              {/* Perks Bullet Array Block */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">
                  Why Teach with D-Global Growthfield?
                </h3>
                <ul className="space-y-3.5 pl-0">
                  {instructorPerks.map((perk, idx) => (
                    <li key={idx} className="text-xs sm:text-sm flex items-start gap-3 font-medium text-slate-600 leading-relaxed">
                      <span className="font-black text-[#512d7c] text-md leading-none mt-0.5">✔</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Operational Capability Footnotes */}
              <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wide pt-2">
                <span className="flex items-center gap-1.5">🌍 Flexible Remote Hours</span>
                <span className="text-slate-200">•</span>
                <span className="flex items-center gap-1.5">💰 Premium Compensation</span>
                <span className="text-slate-200">•</span>
                <span className="flex items-center gap-1.5">🛠️ Pre-Built LMS Systems</span>
              </div>
            </div>

            {/* 🚀 RIGHT SIDE CONTENT: MODERN ACTION APPLICATION TRIGGER CARD (5 COLUMNS) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#512d7c]/5 border border-[#512d7c]/10 rounded-3xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
                {/* Visual Icon Badge Element */}
                <div className="w-16 h-16 rounded-2xl bg-[#512d7c] text-white flex items-center justify-center text-3xl mb-4 shadow-sm select-none">
                  🧑‍🏫
                </div>
                
                <h3 className="text-base font-black text-[#512d7c] uppercase tracking-wide mb-2">
                  Join Our Expert Faculty
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs font-medium">
                  Submit your professional profile portfolio ledger, identify your domain specialization fields, and complete our swift vetting sequence.
                </p>

                {/* Refined Target Action Link Button Anchor */}
                <a
                  href="/signup?role=tutor"
                  className="w-full block text-center py-4 bg-[#512d7c] hover:bg-[#3d225d] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md decoration-none cursor-pointer transform hover:scale-[1.02]"
                >
                  Apply as Tutor
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}