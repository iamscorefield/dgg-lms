"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface NotificationItem {
  id: string;
  icon: string;
  badge: string;
  title: string;
  text: string;
  actionText: string;
  link: string;
}

// 📋 High-Engagement Youth & Tech Student Notification Pool
const lmsNotificationPool: NotificationItem[] = [
  {
    id: "prep-course-bundle",
    icon: "⚡",
    badge: "Special Deal",
    title: "DGG Prep Program",
    text: "Access 8 Foundational Tech Tracks for ₦75,000 flat! Gain lifetime entry into high-growth dev circles.",
    actionText: "Secure Access",
    link: "https://learning.dglobalgrowthfield.com/signup"
  },
  {
    id: "corporate-workforce-teams",
    icon: "💼",
    badge: "Enterprise",
    title: "Train Your Brand Staff",
    text: "Upskill your corporate team in modern software engineering and automated digital pipelines.",
    actionText: "Request Brief",
    link: "https://dglobalgrowthfield.com/corporatetraining"
  },
  {
    id: "advanced-tech-mastery",
    icon: "🚀",
    badge: "In-Demand",
    title: "Live Production Labs",
    text: "Master modern full-stack workflows and remote client algorithms with senior mentor guidance.",
    actionText: "Join Cohort",
    link: "https://learning.dglobalgrowthfield.com/signup"
  }
];

interface LmsPopupProps {
  isFreeUser?: boolean;
}

export default function LmsPopup({ isFreeUser = true }: LmsPopupProps) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeNotify, setActiveNotify] = useState<NotificationItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const poolIndexRef = useRef(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Guards against running inside internal student or admin portals
  const isInsideDashboard = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/classroom') ||
    pathname.startsWith('/admin');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const triggerNextPopup = () => {
    if (!isFreeUser || isInsideDashboard) {
      setIsVisible(false);
      return;
    }

    setIsVisible(false);

    setTimeout(() => {
      const currentMessage = lmsNotificationPool[poolIndexRef.current];
      poolIndexRef.current = (poolIndexRef.current + 1) % lmsNotificationPool.length;

      setActiveNotify(currentMessage);
      setIsVisible(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 7500); // Visible for 7.5 seconds
    }, 300);
  };

  useEffect(() => {
    if (!hasMounted || !isFreeUser || isInsideDashboard) return;

    // Initial trigger after 4 seconds
    const initialDelay = setTimeout(() => {
      triggerNextPopup();
    }, 4000);

    // Heartbeat every 40 seconds
    const interval = setInterval(() => {
      triggerNextPopup();
    }, 40000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname, isFreeUser, isInsideDashboard, hasMounted]);

  if (!hasMounted || !isFreeUser || isInsideDashboard) return null;

  return (
    <AnimatePresence>
      {isVisible && activeNotify && (
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9985] w-[calc(100vw-2rem)] sm:w-[320px] pointer-events-auto"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-purple-100/90 text-left relative overflow-hidden flex flex-col">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#512d7c] via-[#f2b42c] to-[#512d7c]" />

            {/* Header: Icon, Badge, Title & Close */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pt-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base leading-none shrink-0 p-1 bg-purple-50 rounded-lg">
                  {activeNotify.icon}
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <h4 className="text-xs font-black uppercase tracking-tight text-[#512d7c] truncate">
                    {activeNotify.title}
                  </h4>
                  <span className="text-[8px] font-black uppercase tracking-wider bg-[#f2b42c]/20 text-[#512d7c] px-1.5 py-0.5 rounded-full shrink-0">
                    {activeNotify.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 text-xs flex items-center justify-center border-0 cursor-pointer shrink-0"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            {/* Landscape Body Text */}
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-3">
              {activeNotify.text}
            </p>

            {/* Content-Hugging Action Button */}
            <div className="flex justify-end pt-0.5">
              <a
                href={activeNotify.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsVisible(false)}
                className="w-fit inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#512d7c] hover:bg-[#3d225d] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm decoration-transparent cursor-pointer"
              >
                <span>{activeNotify.actionText}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}