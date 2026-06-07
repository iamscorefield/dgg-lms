"use client";

import { useState, useEffect } from "react";

export default function BatchCountdown() {
  // Safe initial values to shield against Next.js SSR hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    
    // 🔥 FIXED: Dynamically shifted target date to next active cohort cycle (July 1, 2026) since Feb 2026 has passed
    const target = new Date("2026-07-01T00:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    /* 🔥 FIXED: Shifted vertical padding bounds to pt-0 pb-24 to align with the overarching page flow constraints */
    <section className="pt-0 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0" id="batch-urgency">
      {/* Immersive Structural Blur Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#512d7c]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Deep Dual-Column Container Module */}
        <div className="bg-[#512d7c] border-0 rounded-[2.5rem] p-8 md:p-14 text-white shadow-[0_25px_60px_rgba(81,45,124,0.25)] relative overflow-hidden">
          
          {/* Aesthetic Background Lens Flare */}
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#f2b42c]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* 🎯 LEFT SIDE CONTENT: TYPOGRAPHY ACCELERATOR (7 COLUMNS) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-[#f2b42c] rounded-md font-bold text-[9px] tracking-widest uppercase mb-3 animate-pulse">
                  ⚡ Enrollment Gate Closing
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight uppercase">
                  Next Training Batch <br />
                  Starts Imminently!
                </h2>
                <p className="text-xs sm:text-sm text-purple-100/80 mt-2 font-medium leading-relaxed">
                  Our hybrid digital masterclasses and personalized mentorship tracks execute in closed cohort structures. Lock in your platform portal clearance vector before registration variables close out entirely.
                </p>
              </div>

              {/* Enhanced Action Call-to-Action Link Node */}
              <div className="pt-2">
                <a 
                  href="/signup" 
                  className="inline-block text-center px-8 py-4 bg-[#f2b42c] text-[#512d7c] hover:bg-[#e0a324] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md border-0 decoration-none cursor-pointer transform hover:scale-[1.02]"
                >
                  Reserve My Seat Right Now
                </a>
              </div>
            </div>

            {/* ⏱️ RIGHT SIDE CONTENT: 4-CELL BENTO TIME ENGINE MATRIX (6 COLUMNS) */}
            <div className="lg:col-span-6 w-full">
              {!isMounted ? (
                /* Skeletal Loading Placeholder layout to maintain flawless hydration scores */
                <div className="text-center py-6 text-purple-200/50 uppercase tracking-widest text-xs font-bold font-mono">
                  Loading Time Vectors...
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:gap-4 select-none">
                  
                  {/* Days Capsule Block */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center shadow-inner">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f2b42c] tracking-tight font-mono block leading-none">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase text-purple-200 mt-2 block">
                      Days
                    </span>
                  </div>

                  {/* Hours Capsule Block */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center shadow-inner">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-mono block leading-none">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase text-purple-200 mt-2 block">
                      Hours
                    </span>
                  </div>

                  {/* Minutes Capsule Block */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center shadow-inner">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-mono block leading-none">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase text-purple-200 mt-2 block">
                      Mins
                    </span>
                  </div>

                  {/* Seconds Capsule Block */}
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center shadow-inner">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#f2b42c] tracking-tight font-mono block leading-none animate-pulse">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] font-black tracking-widest uppercase text-purple-200 mt-2 block">
                      Secs
                    </span>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}