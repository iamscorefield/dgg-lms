"use client";

import { useEffect, useState } from "react";

// --- EXPANDED HIGH-FIDELITY LMS CONTENT BLUEPRINTS ---
const featureSlides = [
  { 
    src: "/images/feature-1.jpg", 
    alt: "Self-Paced Portal Video Engine",
    label: "Model 1",
    badge: "👨🏽‍💻 Recorded Lessons & Quizzes",
    metric: "Lifetime Access Archive"
  },
  { 
    src: "/images/feature-2.jpg", 
    alt: "Interactive Live Cohort Hub",
    label: "Model 2",
    badge: "🧑‍🧑‍🧒‍🧒 Batch Live Zoom Syncs",
    metric: "Mon, Wed, Thu & Saturday Classes"
  },
  { 
    src: "/images/feature-3.jpg", 
    alt: "One-on-One Dedicated Mentor",
    label: "Model 3",
    badge: "👥 1:1 Private Mentorship Track",
    metric: "Custom Curricular Roadmaps"
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % featureSlides.length);
    }, 4000); // Bumped to 4s for smoother content legibility
    return () => clearInterval(id);
  }, []);

  const currentSlide = featureSlides[index];

  return (
    <section className="relative bg-slate-50 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Structural Ambient Background Glow System */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#512d7c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-[#f2b42c]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 🎯 LEFT SECTION: TEXT CONTENT ARCHITECTURE */}
          <div className="space-y-6 text-left">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10">
              DGG Academy Prep LMS
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#512d7c] leading-[1.05] tracking-tight">
              Build Practical <br />
              <span className="bg-gradient-to-r from-[#512d7c] via-[#f2b42c] to-[#512d7c] bg-clip-text text-transparent">
                Techie Skills With
              </span>
              <br />
              D-Global Growthfield
            </h1>
            <p className="text-sm sm:text-base md:text-md text-slate-600 leading-relaxed max-w-xl">
              Learn in the way that fits you best: structured video lessons,
              interactive live group classes, and one‑to‑one coaching with expert tutors.
            </p>

            {/* Inbuilt Micro-Checklist Metrics for Higher Conversion */}
            <div className="grid grid-cols-2 gap-3 pt-2 pb-4 text-left max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-[#f2b42c] text-sm">✔</span> Stage 1-3 Core Matrix
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-[#f2b42c] text-sm">✔</span> Digital Monetization (upwork, freelancing, etc)
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-[#f2b42c] text-sm">✔</span> in-dept Digital Literacy
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="text-[#f2b42c] text-sm">✔</span> Certified Accreditations
              </div>
            </div>

            {/* Buttons Row Layout */}
            <div className="flex flex-row flex-wrap gap-4">
              <a
                href="/signup"
                className="px-8 py-4 bg-[#f2b42c] text-[#512d7c] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#e0a324] transition-all shadow-md text-center border-0 decoration-none cursor-pointer"
              >
                Start Learning
              </a>
              <a
                href="/login"
                className="px-8 py-4 border-2 border-[#512d7c] text-[#512d7c] font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#512d7c] hover:text-white transition-all text-center decoration-none cursor-pointer"
              >
                Login
              </a>
            </div>
          </div>

          {/* 🖼️ RIGHT SECTION: MODERN RESPONSIVE BENTO GRID SLIDER */}
          <div className="relative mt-8 lg:mt-0 w-full max-w-xl mx-auto lg:max-w-none">
            {/* Ambient Background Panel Layer */}
            <div className="absolute inset-4 bg-purple-950/10 rounded-[2.5rem] blur-2xl transform rotate-3 scale-95 pointer-events-none" />

            {/* Primary Container Frame */}
            <div className="relative bg-white border border-slate-200 p-4 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] flex flex-col justify-between">
              
              {/* Dynamic Floating Model Status Label Capsule (Top Left) */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow-lg animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[#f2b42c] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f2b42c]">
                  {currentSlide.label}
                </span>
              </div>

              {/* Central Core Imagery Engine */}
              <div className="absolute inset-4 rounded-[1.8rem] overflow-hidden bg-slate-100">
                <img
                  key={currentSlide.src}
                  src={currentSlide.src}
                  alt={currentSlide.alt}
                  className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-all duration-700 ease-out"
                />
                {/* Dark Vignette Overlay for Content Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>

              {/* Dynamic Information Display Overlay Panel (Bottom Anchor) */}
              <div className="w-full mt-auto relative z-10 p-4 sm:p-6 text-left text-white transform translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-md font-bold text-[10px] tracking-wide mb-2 uppercase">
                  {currentSlide.badge}
                </span>
                <h4 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-sm uppercase tracking-wide">
                  {currentSlide.alt}
                </h4>
                <p className="text-[11px] text-[#f2b42c] font-bold tracking-wider mt-1 uppercase opacity-90">
                  ⚡ {currentSlide.metric}
                </p>
              </div>
            </div>

            {/* Bottom Slider Progress Indicator Navigation Dots */}
            <div className="flex gap-2.5 justify-center lg:justify-end mt-6 pr-4 select-none">
              {featureSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`border-0 p-0 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    i === index ? "bg-[#512d7c] w-8" : "bg-slate-300 w-2 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}