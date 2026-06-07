"use client";

import React from "react";

const modelData = [
  {
    icon: "👨🏽‍💻",
    title: "Self-Paced Learning Portal",
    subtitle: "On-Demand Resource Architecture",
    description: "Architected for ultimate professional flexibility. Master advanced technical concepts at your own speed using premium high-definition recorded modules, downloadable reference blueprints, and integrated progress checks.",
    keywords: ["Recorded Video Lessons", "Downloadable PDFs", "Knowledge Base Testing", "Lifetime Access Archive"],
    features: [
      "100% Flexible scheduling – learn anytime, anywhere",
      "Comprehensive downloadable codebases, design templates & technical guides",
      "Automated modular quizzes for real-time concept validation",
      "Verifiable DGG Academy Industry Completion Certificate"
    ],
    isFeatured: false
  },
  {
    icon: "🧑‍🧑‍🧒‍🧒",
    title: "Batch Cohort (Live Group Class)",
    subtitle: "Collaborative Interactive Sprints",
    description: "Accelerate your training loops within a structured, high-energy environment. Join live interactive digital masterclasses with specific calendar tracks, group project sandboxes, and shared peer networking matrices.",
    keywords: ["Live Zoom Video Classes", "Interactive Cohort Syncs", "Weekly Deliverable Appraisals", "Global Alumni Workspace"],
    features: [
      "Live interactive video coaching blocks with complete access to class recordings",
      "Peer-to-peer programming, cross-functional design sprints & real-time team reviews",
      "Weekly diagnostic assignments accompanied by detailed instructor review logs",
      "Exclusive access to the collaborative DGG community slack channels"
    ],
    isFeatured: true 
  },
  {
    icon: "👥",
    title: "1-on-1 Dedicated Mentorship",
    subtitle: "Elite Custom Engineering Track",
    description: "The ultimate premium educational pathway. Partner directly with a veteran industry expert for completely personalized engineering sessions, deep core parameter analysis, and dedicated technical career guidance.",
    keywords: ["Private Mentorship Sessions", "Customized Learning Maps", "Asymmetric Q&A Pipeline", "Direct Industry Placement Support"],
    features: [
      "Private video synchronization blocks mapped explicitly to your timeline",
      "Customized curriculum loops prioritizing specialized skill gaps",
      "Unlimited code audits, design reviews, and portfolio development analysis",
      "Priority career accelerator pathways and global freelance platform onboarding"
    ],
    isFeatured: false
  }
];

export default function TrainingModels() {
  return (
    /* 🔥 FIXED: Shifted padding-top from py-24 to pt-0 pb-24 and stripped outer margins to collapse the gap below Hero */
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="learning-models">
      {/* Background Semantic Asset Anchors */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#512d7c]/5 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SEO Header Block - Explicit Semantic Optimization */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Educational Delivery Framework
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Three Flexible Learning Models, <br />
            <span className="bg-gradient-to-r from-[#512d7c] to-[#f2b42c] bg-clip-text text-transparent">
              One Comprehensive Standard.
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Whether you want to build foundational skills in full-stack web development, refine UI/UX design architectures, master data analytics databases, or scale your earning footprint on international freelance channels—our structured frameworks adapt completely to your active professional lifecycle.
          </p>
        </div>

        {/* Asymmetric Structural Grid Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {modelData.map((model, idx) => (
            <article 
              key={idx} 
              className={`flex flex-col justify-between p-8 rounded-[2.5rem] border transition-all duration-300 relative group text-left ${
                model.isFeatured 
                  ? "bg-[#512d7c] text-white border-0 shadow-[0_20px_50px_rgba(81,45,124,0.3)] lg:-translate-y-4 lg:scale-105 z-10" 
                  : "bg-white text-slate-900 border-slate-200/80 shadow-md hover:shadow-xl"
              }`}
            >
              <div>
                {/* Visual Label Indicator for Segment Highlight */}
                {model.isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f2b42c] text-[#512d7c] text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-md">
                    Most Popular
                  </span>
                )}

                {/* Card Icon Header Loop */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner ${
                  model.isFeatured ? "bg-white/10" : "bg-slate-50 group-hover:bg-[#512d7c]/5 transition-colors"
                }`}>
                  {model.icon}
                </div>

                {/* Typography Engine */}
                <span className={`text-[10px] font-black tracking-wider uppercase block mb-1 ${
                  model.isFeatured ? "text-[#f2b42c]" : "text-slate-400"
                }`}>
                  {model.subtitle}
                </span>
                <h3 className={`text-xl sm:text-2xl font-black tracking-wide mb-4 ${
                  model.isFeatured ? "text-white" : "text-[#512d7c]"
                }`}>
                  {model.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${
                  model.isFeatured ? "text-purple-100" : "text-slate-500"
                }`}>
                  {model.description}
                </p>

                {/* Hidden Meta Index Tags for Search Engine Crawlers */}
                <div className="flex flex-wrap gap-1.5 mb-6 opacity-80">
                  {model.keywords.map((kw, kIdx) => (
                    <span 
                      key={kIdx} 
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        model.isFeatured ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Structural Core Deliverables Checklist */}
                <div className={`border-t pt-6 ${model.isFeatured ? "border-white/10" : "border-slate-100"}`}>
                  <h4 className={`text-[10px] font-black uppercase tracking-wider mb-4 ${
                    model.isFeatured ? "text-white" : "text-slate-900"
                  }`}>
                    What is Included in This Track:
                  </h4>
                  <ul className="space-y-3.5">
                    {model.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-xs flex items-start gap-3 font-medium leading-relaxed">
                        <span className={`font-black text-sm leading-none mt-0.5 ${
                          model.isFeatured ? "text-[#f2b42c]" : "text-[#512d7c]"
                        }`}>
                          ✔
                        </span>
                        <span className={model.isFeatured ? "text-purple-50" : "text-slate-600"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Conversion Trigger Button Link */}
              <div className="pt-8 mt-auto">
                <a
                  href="/signup"
                  className={`w-full block py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-sm transition-all border-0 cursor-pointer decoration-none ${
                    model.isFeatured
                      ? "bg-[#f2b42c] text-[#512d7c] hover:bg-[#e0a324] hover:scale-[1.02]"
                      : "bg-[#512d7c] text-white hover:bg-[#3d225d] hover:scale-[1.02]"
                  }`}
                >
                  Select This Model
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}