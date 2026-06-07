"use client";

import React from "react";

const pathwayStages = [
  {
    step: "01",
    stageName: "Stage 1: The Technical Foundation",
    durationLabel: "Months 1 – 3 (12 Weeks)",
    title: "Digital Literacy & Structural Workflows",
    description: "Establish complete terminal confidence by mastering the essential digital architecture used in modern remote corporate workspaces. You will move from foundational systems navigation directly into prompt engineering automation systems.",
    skills: ["Operating Systems", "Cloud Infrastructure", "Slack & Async Syncs", "AI Assistance", "Prompt Engineering"],
    accentColor: "border-[#512d7c]"
  },
  {
    step: "02",
    stageName: "Stage 2: Core Specialization Sprints",
    durationLabel: "Months 4 – 6 (12 Weeks)",
    title: "High-Demand Technical Execution",
    description: "Pivot directly into a high-value engineering track tailored to your career goal. This intensive sprint block builds verified portfolio assets across full-stack coding, data analytics engines, or high-conversion creative brand design packages.",
    skills: ["HTML5 / CSS3 / JavaScript", "Python Scripting", "SQL & Power BI Data", "UI/UX Architecture", "Video Editing Assets"],
    accentColor: "border-[#f2b42c]"
  },
  {
    step: "03",
    stageName: "Stage 3: Global Monetization Node",
    durationLabel: "Months 7 – 12 (24 Weeks)",
    title: "Freelance Architecture & Outreach Execution",
    description: "Bridge the gap between raw technical skills and direct revenue generation. Learn the systematic monetization framework required to deploy professional portfolios, close international platform clients, and master e-commerce setups.",
    skills: ["Upwork Profile Optimization", "Proposal Bidding Loops", "Paystack Gateway CRM", "Cold Outreach Systems", "Portfolio Construction"],
    accentColor: "border-slate-900"
  }
];

export default function TrainingTiers() {
  return (
    /* 🔥 FIXED: Re-architected as a high-fidelity visual roadmap sequence instead of a card grid loop to eliminate corporate repetition */
    <section className="pt-4 pb-24 bg-white relative overflow-hidden mt-0 border-t-0" id="curriculum-pathway">
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-[#f2b42c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#512d7c]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Compressed Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#f2b42c]/10 text-[#512d7c] border border-[#f2b42c]/20 mb-4">
            Syllabus Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Your Three-Stage Curriculum Pathway
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Follow a structured career timeline engineered to take you from a tech enthusiast to an industry professional, and finally into a high-earning global contractor.
          </p>
        </div>

        {/* 🗺️ VERTICAL TIMELINE ROADMAP ENGINE */}
        <div className="relative border-l-2 border-slate-100 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-0.5 md:before:bg-slate-100 space-y-16">
          {pathwayStages.map((stage, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div key={idx} className="relative flex flex-col md:flex-row items-stretch w-full text-left">
                
                {/* Visual Timeline Node Dot Connection */}
                <div className="absolute -left-[31px] md:left-1/2 md:-ml-3.5 top-2 w-7 h-7 rounded-full bg-white border-4 border-[#512d7c] z-20 shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f2b42c]" />
                </div>

                {/* Left Block Space Holder (Desktop Only) */}
                <div className={`hidden md:block w-1/2 pr-12 text-right ${isEven ? "order-1 pl-12 pr-0 text-left" : ""}`}>
                  {!isEven ? (
                    <div className="pt-2 sticky top-24">
                      <span className="text-7xl font-black text-slate-100 tracking-tighter block leading-none select-none">
                        PHASE {stage.step}
                      </span>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-black text-[10px] tracking-wider rounded-md uppercase">
                        ⌛ {stage.durationLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/70 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-base font-black text-[#512d7c] uppercase tracking-wide mb-1">{stage.stageName}</h3>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-4">{stage.title}</h4>
                      <p className="text-xs leading-relaxed text-slate-500 font-medium mb-6">{stage.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md shadow-2xs">
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Block Space Holder (Desktop Only) */}
                <div className={`w-full md:w-1/2 pl-8 md:pl-12 text-left ${isEven ? "order-0 pr-12 pl-0 text-right" : ""}`}>
                  {isEven ? (
                    <div className="pt-2 sticky top-24">
                      <span className="text-7xl font-black text-slate-100 tracking-tighter block leading-none select-none">
                        PHASE {stage.step}
                      </span>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-black text-[10px] tracking-wider rounded-md uppercase">
                        ⌛ {stage.durationLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/70 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-base font-black text-[#512d7c] uppercase tracking-wide mb-1">{stage.stageName}</h3>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-4">{stage.title}</h4>
                      <p className="text-xs leading-relaxed text-slate-500 font-medium mb-6">{stage.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md shadow-2xs">
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Fallback Label Indicators (Hidden on Desktop) */}
                <div className="md:hidden w-full mt-2 pl-4">
                  <span className="inline-block mb-3 px-2.5 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-bold text-[9px] tracking-wide rounded uppercase">
                    ⌛ Term: {stage.durationLabel}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Structural Call to Action Banner Anchor */}
        <div className="mt-24 text-center">
          <a
            href="/signup"
            className="inline-block px-10 py-4 bg-[#f2b42c] text-[#512d7c] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#e0a324] hover:scale-105 transition-all shadow-xl decoration-none border-0 cursor-pointer"
          >
            Enroll in the Pathway Now
          </a>
        </div>

      </div>
    </section>
  );
}