"use client";

import React from "react";

const freebieDeliverables = [
  "Verbatim entry-level video lessons covering 2026 AI Prompting loops",
  "Downloadable OS configuration checklists & remote workspace cheat sheets",
  "Instant access to the DGG Prep course introduction handbook (PDF format)",
  "Starter workspace access cards to browse system dashboard features completely free"
];

export default function FreeResourcesCTA() {
  return (
    /* 🔥 FIXED: Shifted padding to pt-0 pb-24 and stripped outer background gradients for a smooth, cohesive page flow */
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="free-resources-pipeline">
      {/* Structural Background Graphic Flares */}
      <div className="absolute top-1/2 left-0 w-[350px] h-[350px] bg-[#512d7c]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-[#f2b42c]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Core Card Panel Box */}
        <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden text-left">
          
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* LEFT SIDE: CONVERSION VALUE SPECS (7 COLUMNS) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] rounded-md font-bold text-[9px] tracking-widest uppercase mb-3">
                  🎁 Zero-Cost Onboarding Node
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#512d7c] tracking-tight leading-none">
                  Access Free Resources Now
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  Sign up today to unlock introductory video modules, downloadable PDFs, and starter strategy guides—completely free, no payment required!
                </p>
              </div>

              {/* Checklist Group Matrix */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-4">
                  What You Unlock Instantly:
                </h3>
                <ul className="space-y-3">
                  {freebieDeliverables.map((item, idx) => (
                    <li key={idx} className="text-xs sm:text-sm flex items-start gap-3 font-medium text-slate-600 leading-relaxed">
                      <span className="font-black text-[#f2b42c] text-md leading-none">✔</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature Micro‑Bullet Subtext Group */}
              <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wide pt-2">
                <span className="flex items-center gap-1.5">🔒 No Card Needed</span>
                <span className="text-slate-200">•</span>
                <span className="flex items-center gap-1.5">⚡ Instant Access</span>
                <span className="text-slate-200">•</span>
                <span className="flex items-center gap-1.5">🚀 Self-Paced Track</span>
              </div>
            </div>

            {/* RIGHT SIDE: PREMIUM ACTION CTA CALLOUT PANEL (5 COLUMNS) */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
                {/* Embedded Aesthetic Graphics Element */}
                <div className="w-16 h-16 rounded-2xl bg-[#512d7c]/5 text-[#512d7c] flex items-center justify-center text-3xl mb-4">
                  🎓
                </div>
                
                <h3 className="text-base font-black text-[#512d7c] uppercase tracking-wide mb-2">
                  Ready to Start?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs font-medium">
                  Create your clean user profile ledger and gain immediate entry path access to our open-source curriculum modules.
                </p>

                {/* High-Conversion Link Button Anchor */}
                <a
                  href="/signup"
                  className="w-full block text-center py-4 bg-[#512d7c] hover:bg-[#3d225d] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md decoration-none cursor-pointer transform hover:scale-[1.02]"
                >
                  Sign Up Free & Get Instant Access
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}