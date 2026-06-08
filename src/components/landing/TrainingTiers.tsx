"use client";

import React from "react";

const pathwayStages = [
  {
    step: "01",
    stageName: "Stage 1: The Technical & Operational Foundation",
    durationLabel: "Months 1 – 3 (12 Weeks)",
    title: "Digital Literacy & Structural Workflows",
    description: "Establish complete confidence by mastering the digital systems, cloud architectures, and asynchronous tools used across modern remote corporate workspaces. This module ensures all students, regardless of their final career path, can navigate professional tech ecosystems and leverage AI workflows efficiently.",
    skills: ["Digital Systems", "Cloud Workspace Hubs", "Professional Communications", "AI Workflow Automation", "Prompt Architecture"],
    accentColor: "border-[#512d7c]"
  },
  {
    step: "02",
    stageName: "Stage 2: Core Specialization Sprints",
    durationLabel: "Months 4 – 6 (12 Weeks)",
    title: "High-Demand Professional Execution",
    description: "Diverge into your premium chosen industry module tier. This intensive sprint block focuses on developing specialized portfolio assets, building enterprise systems, analyzing complex operational data, or crafting high-conversion digital brand assets tailored to market demands.",
    skills: ["Software Engineering", "UI/UX Interface Systems", "Data Analytics Engine", "Digital Brand Growth", "Business Architecture"],
    accentColor: "border-[#f2b42c]"
  },
  {
    step: "03",
    stageName: "Stage 3: Global Monetization Node",
    durationLabel: "Months 7 – 12 (24 Weeks)",
    title: "Freelance Architecture & Outreach Execution",
    description: "Bridge the gap between specialized skills and direct revenue generation. Learn the systematic monetization frameworks required to launch personal agencies, pitch international clients across online spaces, optimize consulting loops, and master regional payment processors.",
    skills: ["Upwork Optimization", "LinkedIn Business Outreach", "Cold Proposal Pitching", "Paystack Gateway Systems", "Portfolio Showcases"],
    accentColor: "border-slate-900"
  }
];

export default function TrainingTiers() {
  return (
    <section className="pt-4 pb-24 bg-white relative overflow-hidden mt-0 border-t-0 font-sans" id="curriculum-pathway">
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-[#f2b42c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#512d7c]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#f2b42c]/10 text-[#512d7c] border border-[#f2b42c]/20 mb-4">
            Syllabus Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4 uppercase">
            Your Three-Stage Curriculum Pathway
          </h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Follow a structured career timeline engineered to take you from a tech enthusiast to an industry professional, and finally into a high-earning global contractor.
          </p>
        </div>

        {/* 🗺️ VERTICAL TIMELINE ROADMAP ENGINE */}
        <div className="relative border-l-2 border-slate-100 md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:h-full md:before:w-0.5 md:before:bg-slate-100 space-y-12 md:space-y-16">
          {pathwayStages.map((stage, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div key={idx} className="relative flex flex-col md:flex-row items-stretch w-full text-left">
                
                {/* Visual Timeline Node Dot Connection */}
                <div className="absolute -left-[37px] md:left-1/2 md:-ml-3.5 top-2 w-7 h-7 rounded-full bg-white border-4 border-[#512d7c] z-20 shadow-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f2b42c]" />
                </div>

                {/* 1. LEFT SIDE ELEMENT CONTAINER */}
                <div className={`w-full md:w-1/2 md:pr-12 md:text-right ${isEven ? "md:order-2 md:pl-12 md:pr-0 md:text-left" : "block"}`}>
                  <div className={`md:hidden ${!isEven ? "hidden md:block" : "block"}`}>
                    <div className="pt-2 mb-2">
                      <span className="text-4xl md:text-7xl font-black text-slate-100 tracking-tighter block leading-none select-none">
                        PHASE {stage.step}
                      </span>
                    </div>
                  </div>

                  {!isEven ? (
                    <div className="hidden md:block pt-2 sticky top-24">
                      <span className="text-7xl font-black text-slate-100 tracking-tighter block leading-none select-none">
                        PHASE {stage.step}
                      </span>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-black text-[10px] tracking-wider rounded-md uppercase">
                        ⌛ {stage.durationLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/60 p-6 sm:p-8 rounded-[2rem] shadow-2xs hover:shadow-xs transition-all">
                      <h3 className="text-xs sm:text-sm font-black text-[#512d7c] uppercase tracking-wide mb-1">{stage.stageName}</h3>
                      <h4 className="text-base font-black text-slate-800 leading-tight mb-4 uppercase">{stage.title}</h4>
                      <p className="text-xs leading-relaxed text-slate-400 font-bold mb-6">{stage.description}</p>
                      
                      <div className="flex flex-wrap gap-2 justify-start">
                        {stage.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-md shadow-3xs">
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. RIGHT SIDE ELEMENT CONTAINER */}
                <div className={`w-full md:w-1/2 pl-0 md:pl-12 text-left mt-4 md:mt-0 ${isEven ? "md:order-1 md:pr-12 md:pl-0 md:text-right" : "block"}`}>
                  {isEven ? (
                    <div className="hidden md:block pt-2 sticky top-24">
                      <span className="text-7xl font-black text-slate-100 tracking-tighter block leading-none select-none">
                        PHASE {stage.step}
                      </span>
                      <span className="inline-block mt-2 px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-black text-[10px] tracking-wider rounded-md uppercase">
                        ⌛ {stage.durationLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/70 p-6 sm:p-8 rounded-[2rem] shadow-2xs hover:shadow-xs transition-all">
                      <h3 className="text-xs sm:text-sm font-black text-[#512d7c] uppercase tracking-wide mb-1">{stage.stageName}</h3>
                      <h4 className="text-base font-black text-slate-800 leading-tight mb-4 uppercase">{stage.title}</h4>
                      <p className="text-xs leading-relaxed text-slate-400 font-bold mb-6">{stage.description}</p>
                      
                      <div className="flex flex-wrap gap-2 justify-start">
                        {stage.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="text-[10px] font-black uppercase tracking-tight px-2.5 py-1 bg-white border border-slate-200 text-slate-500 rounded-md shadow-3xs">
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* MOBILE TIME CHIP STICKER ELEMENT */}
                <div className="md:hidden w-full mt-3 pl-0">
                  <span className="inline-block px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] font-black text-[10px] tracking-wide rounded-md uppercase">
                    ⌛ Term: {stage.durationLabel}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Global Structural Call to Action Banner Anchor */}
        <div className="mt-20 text-center">
          <a
            href="/signup"
            className="inline-block px-10 py-4 bg-[#f2b42c] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#e0a51a] hover:scale-[1.02] transition-all shadow-md decoration-none border-0 cursor-pointer"
          >
            Enroll in the Pathway Now
          </a>
        </div>

      </div>
    </section>
  );
}