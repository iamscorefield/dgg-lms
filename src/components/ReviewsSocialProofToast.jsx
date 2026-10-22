"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔗 DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const REVIEWS_BACKEND_URL = "https://script.google.com/macros/s/AKfycbwAiRe3dNTMgeLLlnGVSHiQZ7Xd0god9xQS7U_5-Aa-JVzIyIOC5gCm-0ktOpJS8WiL/exec";
const MAIN_SITE_REVIEWS_URL = "https://dglobalgrowthfield.com/reviews";

export default function ReviewsSocialProofToast() {
  const [reviews, setReviews] = useState([]);
  const [batch, setBatch] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [driftDirection, setDriftDirection] = useState("right-to-left");
  const currentIndexRef = useRef(0);
  const hideTimerRef = useRef(null);

  // Targets strictly LMS and Tech training tracks
  const targetCategories = ["Internship & Accelerator", "Enterprise Software & LMS"];

  // 1. Fetch live approved reviews via JSONP
  useEffect(() => {
    const callbackName = "dgg_lms_toast_cb_" + Math.round(100000 * Math.random());
    const script = document.createElement("script");

    window[callbackName] = (data) => {
      delete window[callbackName];
      if (script.parentNode) document.body.removeChild(script);

      if (data && data.status === "success" && Array.isArray(data.reviews)) {
        const filtered = data.reviews.filter((r) => targetCategories.includes(r.vertical));
        setReviews(filtered);
      }
    };

    script.onerror = () => {
      delete window[callbackName];
      if (script.parentNode) document.body.removeChild(script);
    };

    script.src = `${REVIEWS_BACKEND_URL}?callback=${callbackName}`;
    document.body.appendChild(script);

    return () => {
      delete window[callbackName];
      if (script.parentNode) document.body.removeChild(script);
    };
  }, []);

  // 2. Trigger Batch Every 55 Seconds with 10s Drift Duration
  const showNextBatch = () => {
    if (!reviews.length) return;

    const batchSize = Math.min(2, reviews.length);
    const selected = [];

    for (let i = 0; i < batchSize; i++) {
      const idx = (currentIndexRef.current + i) % reviews.length;
      selected.push(reviews[idx]);
    }

    currentIndexRef.current = (currentIndexRef.current + batchSize) % reviews.length;
    
    // Toggle direction: Right-to-Left vs Left-to-Right
    setDriftDirection((prev) => (prev === "right-to-left" ? "left-to-right" : "right-to-left"));
    setBatch(selected);
    setIsVisible(true);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 10000); // 10 seconds total on-screen drift
  };

  useEffect(() => {
    if (!reviews.length) return;

    // First appearance after 4 seconds
    const firstTimeout = setTimeout(() => {
      showNextBatch();
    }, 4000);

    // Repeats every 55 seconds (giving 45s clear pause between batches)
    const interval = setInterval(() => {
      showNextBatch();
    }, 55000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [reviews]);

  if (!reviews.length) return null;

  // Continuous gentle slow drift with solid opacity throughout
  const driftVariants = driftDirection === "right-to-left"
    ? {
        initial: { opacity: 0, x: 90, scale: 0.96 },
        animate: { 
          opacity: [0, 1, 1, 1], 
          x: [90, 15, -15, -35], 
          scale: 1 
        },
        exit: { opacity: 0, x: -70, scale: 0.95 }
      }
    : {
        initial: { opacity: 0, x: -90, scale: 0.96 },
        animate: { 
          opacity: [0, 1, 1, 1], 
          x: [-90, -15, 15, 35], 
          scale: 1 
        },
        exit: { opacity: 0, x: 70, scale: 0.95 }
      };

  // Dynamic corner positioning based on drift cycle
  const positionClass = driftDirection === "right-to-left"
    ? "top-20 sm:top-24 right-4 sm:right-8 items-end"
    : "top-20 sm:top-24 left-4 sm:left-8 items-start";

  return (
    <div className={`fixed z-[9980] pointer-events-none flex flex-col gap-3 max-w-[320px] sm:max-w-[340px] w-full ${positionClass}`}>
      <AnimatePresence>
        {isVisible &&
          batch.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={driftVariants.initial}
              animate={driftVariants.animate}
              exit={driftVariants.exit}
              transition={{
                duration: 9.6, // Smooth 9.6-second drift matching the 10s display window
                ease: "linear",
                delay: index * 0.35 // Clean quarter-second stagger between card 1 and 2
              }}
              className="pointer-events-auto w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-purple-100/90 text-left relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f2b42c] via-[#512d7c] to-[#f2b42c]" />

              <div className="flex items-start gap-2.5 pt-0.5">
                {/* Avatar / Initial */}
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#512d7c] shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#512d7c] text-[#f2b42c] font-black text-xs flex items-center justify-center shrink-0 uppercase">
                    {(item.name || "C").charAt(0)}
                  </div>
                )}

                {/* Content Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-black text-[#512d7c] truncate">
                      {item.name}
                    </span>
                    <span className="text-amber-400 text-[10px] tracking-tighter shrink-0">
                      {"★".repeat(Number(item.rating) || 5)}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-800 font-bold leading-snug line-clamp-2 mt-0.5">
                    "{item.headline}"
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-2 text-[8px] text-slate-400 font-medium">
                    <span className="truncate max-w-[130px]">{item.role || "Student"} • {item.location || "Nigeria"}</span>
                    
                    {/* 🔗 Direct Link Anchor To Main Site Review Page */}
                    <a
                      href={`${MAIN_SITE_REVIEWS_URL}#review-${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsVisible(false)}
                      className="text-[#512d7c] hover:text-[#f2b42c] font-black text-[9px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded transition-colors no-underline"
                    >
                      <span>Read More</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}