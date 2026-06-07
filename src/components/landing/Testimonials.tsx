"use client";

import React, { useState } from "react";

const individualTestimonials = [
  {
    name: "Adaobi O.",
    role: "Senior UI/UX Designer",
    text: "The advanced UI/UX track completely rewired my design thinking. I transitioned from basic wireframing to designing full component enterprise systems.",
    metric: "Secured Remote Role"
  },
  {
    name: "Chinedu E.",
    role: "Full-Stack Engineer",
    text: "The 1:1 mentorship architecture is unmatched. My instructor walked me step-by-step through database normalization and Next.js custom API optimizations.",
    metric: "3x Freelance Revenue"
  },
  {
    name: "Fatima A.",
    role: "E-Commerce Founder",
    text: "I built my entire automated CRM setup and storefront during the digital growth sprint. My customer conversion loops are fully self-sufficient now.",
    metric: "Automated Store Launched"
  },
  {
    name: "Tunde W.",
    role: "Data Analytics Intern",
    text: "Skipping the entry basics and jumping straight into deep SQL indexing and complex Power BI DAX expressions landed me a global consulting contract.",
    metric: "Global Contract Secured"
  },
  {
    name: "Blessing I.",
    role: "AI Automations Specialist",
    text: "Learning to map workflow processes through LangChain nodes gave me a unique competitive edge on freelance platforms. Highly practical curriculum.",
    metric: "Top Rated on Upwork"
  }
];

const institutionalTestimonials = [
  {
    name: "Top FM Radio Network",
    role: "Media Infrastructure Client",
    text: "Deploying the DGG staff management ecosystem completely streamlined our weekly programming logistics and host tracking data.",
    metric: "3-Month Hybrid Pilot"
  },
  {
    name: "Bufason Media Computers",
    role: "E-Commerce Platform Partner",
    text: "Their comprehensive local SEO implementation and regional system audit gave us total market authority in Plateau State within a few short months.",
    metric: "+180% Organic Reach"
  },
  {
    name: "Style By Lizz",
    role: "Fashion Tech Client",
    text: "The e-commerce storefront system integration effortlessly syncs our female fashion apparel inventory tracker with premium local payment checkouts.",
    metric: "Seamless Paystack Node"
  },
  {
    name: "Sweet FM 107.1 Portal",
    role: "Media Platform Client",
    text: "Integrating our online broadcasting network cleanly over their custom media infrastructure completely resolved our server bandwidth warning frames.",
    metric: "100% Streaming Uptime"
  },
  {
    name: "Growthfield Hub Labs",
    role: "SME Incubation Cohort",
    text: "We ran our entire digital literacy training syllabus inside their portal system. Tracking student assignments and scores is perfectly streamlined.",
    metric: "250+ Grads Onboarded"
  }
];

export default function Testimonials() {
  const [activeCategory, setActiveCategory] = useState<"individual" | "institutional">("individual");
  const currentDataset = activeCategory === "individual" ? individualTestimonials : institutionalTestimonials;

  return (
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="success-stories">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-[#512d7c]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#f2b42c]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Compressed Header Architecture */}
        <div className="text-center max-w-3xl mx-auto mb-12 pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Validation Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4">
            Verified Success Ecosystem
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            See how our advanced practical modules translate directly into individual career jumps and optimized enterprise digital operations.
          </p>
        </div>

        {/* 🎛️ LOW-PROFILE ASYMMETRIC DUAL CATEGORY TOGGLE BAR */}
        <div className="flex justify-center gap-1.5 mb-16 max-w-md mx-auto bg-slate-200/60 backdrop-blur-md p-1.5 rounded-2xl select-none border border-slate-200/40">
          <button
            type="button"
            onClick={() => setActiveCategory("individual")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 border-0 cursor-pointer ${
              activeCategory === "individual"
                ? "bg-[#512d7c] text-white shadow-md scale-102"
                : "text-slate-500 hover:text-slate-900 bg-transparent"
            }`}
          >
            👤 Individuals (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("institutional")}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 border-0 cursor-pointer ${
              activeCategory === "institutional"
                ? "bg-[#512d7c] text-white shadow-md scale-102"
                : "text-slate-500 hover:text-slate-900 bg-transparent"
            }`}
          >
            🏢 Firms &amp; Hubs (5)
          </button>
        </div>

        {/* 🚀 CLEAN HORIZONTAL TESTIMONIAL SLIDER TRACK */}
        <div className="w-full overflow-hidden relative">
          {/* Subtle Ambient Vignettes */}
          <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

          {/* Flex Row Container representing the modern slider pipeline */}
          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 custom-scrollbar snap-x scroll-smooth items-stretch">
            {currentDataset.map((card, idx) => (
              <div
                key={idx}
                className="min-w-[290px] sm:min-w-[350px] max-w-[380px] bg-white border border-slate-200/90 rounded-[2rem] p-8 shadow-xs flex flex-col justify-between text-left snap-align-start hover:border-[#512d7c]/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  {/* Premium Framing Visual Quotation Tag */}
                  <span className="text-4xl font-serif text-[#f2b42c] block leading-none mb-3 select-none">“</span>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed italic mb-6">
                    {card.text}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                  <div>
                    <h4 className="text-sm font-black text-[#512d7c] tracking-wide">
                      {card.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                      {card.role}
                    </p>
                  </div>

                  {/* Operational Metric Floating Badge */}
                  <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-md uppercase tracking-wide flex-shrink-0">
                    {card.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Navigation Indicator Subtext */}
        <div className="text-center mt-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1.5 select-none">
            ← Swipe horizontally to inspect complete catalog milestones →
          </span>
        </div>

      </div>
    </section>
  );
}