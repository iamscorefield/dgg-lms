"use client";

import React from "react";

const strategyUtilities = [
  {
    icon: "🎯",
    title: "Timestamped Deliverable Appraisals",
    subtitle: "Accountability Loop",
    description: "Every single task, code push, or creative blueprint you build is subjected to absolute professional vetting. Our system tracks submission timestamps automatically to train you for real international agency environments."
  },
  {
    icon: "💬",
    title: "Granular Assignment Feedback",
    subtitle: "Skill Refinement",
    description: "No generic grading templates here. Senior technical directors audit your project sandboxes item-by-item, providing personalized, video-recorded or text-based code reviews and UI layout adjustments."
  },
  {
    icon: "👥",
    title: "Direct Instructor Accessibility",
    subtitle: "Real-Time Mentorship",
    description: "Get unstuck instantly. Beyond recorded videos, you gain structured access pipelines to schedule live private query debugging, milestone alignment reviews, and open Slack/WhatsApp syncs with top engineering instructors."
  },
  {
    icon: "📊",
    title: "Production Ecosystem Simulation",
    subtitle: "Portfolio Acceleration",
    description: "Move past toy projects. Your assignments match live corporate client parameters, equipping you with robust, authentic, industry-standard case studies that stand out directly to recruiters and Upwork clients."
  }
];

export default function TrainingStrategy() {
  return (
    /* 🔥 FIXED: Transformed from a redundant curriculum list into a clean, modern System Features & QA Grid */
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="training-strategy">
      {/* Background Accent Gradient Ring */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#512d7c]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Compressed Section Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Quality Assurance Engines
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Our Core Training Infrastructure
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We don’t just hand you video materials and leave you isolated. D-Global Growthfield Academy deploys active quality monitoring nodes to safeguard your transition into a professional contractor.
          </p>
        </div>

        {/* 🚀 2x2 ULTRA-MODERN UTILITIES BENTO GRID MAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {strategyUtilities.map((utility, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200/80 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 text-left group items-start"
            >
              {/* Icon Capsule Element */}
              <div className="w-12 h-12 rounded-xl bg-[#512d7c]/5 text-[#512d7c] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#512d7c] group-hover:text-white transition-all duration-300">
                {utility.icon}
              </div>

              {/* Text Layout Core */}
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-600 block">
                  {utility.subtitle}
                </span>
                <h3 className="text-lg font-black text-[#512d7c] tracking-tight">
                  {utility.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
                  {utility.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Section Divider Hook for Smooth Content Transitions */}
        <div className="mt-20 w-16 h-1 bg-[#f2b42c] mx-auto rounded-full opacity-40" />

      </div>
    </section>
  );
}