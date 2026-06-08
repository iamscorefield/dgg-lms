"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation'; // 🔥 Next.js safe router path hooks

interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  text: string;
  actionText: string;
  link: string;
}

// 📋 Specialized 3-Tier Notification Matrix for Unpaid/Free LMS Users
const lmsNotificationPool: NotificationItem[] = [
  {
    id: "prep-course-bundle",
    icon: "🚀",
    title: "DGG Prep Program",
    text: "Unlock the 8 Foundational Tech Courses for ₦75,000 flat! Gain lifetime entry into premium techie chambers.",
    actionText: "Secure Access",
    link: "https://learning.dglobalgrowthfield.com/signup"
  },
  {
    id: "corporate-workforce-teams",
    icon: "💼",
    title: "Train Your Brand Staff",
    text: "Upskill your business team in modern software engineering and automated workflows. Email us for custom workspaces.",
    actionText: "Email Mandate",
    link: "https://dglobalgrowthfield.com/corporatetraining"
  },
  {
    id: "advanced-tech-mastery",
    icon: "🎓",
    title: "Learn Advanced Skills",
    text: "Accelerate your market optimization engineering value. Register today to access our elite technical labs.",
    actionText: "Join Matrix",
    link: "https://learning.dglobalgrowthfield.com/signup"
  }
];

const positionStyles = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-28 right-6"
};

const animationVariants = {
  "bottom-right": { initial: { opacity: 0, y: 60, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 30, scale: 0.9 } },
  "bottom-left": { initial: { opacity: 0, y: 60, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 30, scale: 0.9 } },
  "top-right": { initial: { opacity: 0, y: -60, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.9 } }
};

interface LmsPopupProps {
  isFreeUser: boolean; // Managed by layout parameters
}

export default function LmsPopup({ isFreeUser }: LmsPopupProps) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeNotify, setActiveNotify] = useState<NotificationItem | null>(null);
  const [currentPosition, setCurrentPosition] = useState<keyof typeof positionStyles>("bottom-right");
  const [isVisible, setIsVisible] = useState(false);
  const poolIndexRef = useRef(0);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 🚫 BLOCK CONDITION: Guards and silences layout engine loops inside dashboard routes
  const isInsideDashboard = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/classroom') ||
    pathname.startsWith('/admin');

  // Next.js hydration safety mount lock
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

      const directions = Object.keys(positionStyles) as Array<keyof typeof positionStyles>;
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];

      setActiveNotify(currentMessage);
      setCurrentPosition(randomDirection);
      setIsVisible(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 8500); // Popup dismisses itself after 8.5 seconds on-screen
    }, 300);
  };

  useEffect(() => {
    if (!hasMounted || !isFreeUser || isInsideDashboard) return;

    // 🔥 SPEED ALIGNMENT 1: First slide launches onto client screen after exactly 4 seconds
    const initialDelayTimer = setTimeout(() => {
      triggerNextPopup();
    }, 4000);

    // 🔥 SPEED ALIGNMENT 2: Global interval loop runs exact 45-second rotations
    const globalIntervalLoop = setInterval(() => {
      triggerNextPopup();
    }, 45000);

    return () => {
      clearTimeout(initialDelayTimer);
      clearInterval(globalIntervalLoop);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname, isFreeUser, isInsideDashboard, hasMounted]);

  if (!hasMounted || !isFreeUser || isInsideDashboard) return null;

  return (
    <AnimatePresence>
      {isVisible && activeNotify && (
        <motion.div
          initial={animationVariants[currentPosition].initial}
          animate={animationVariants[currentPosition].animate}
          exit={animationVariants[currentPosition].exit}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
          className={`fixed ${positionStyles[currentPosition]} z-[9999] w-[310px] sm:w-[340px] p-[1.5px] shadow-2xl rounded-2xl bg-gradient-to-r from-[#512d7c] to-[#f2b42c]`}
        >
          <div className="bg-white rounded-[14px] p-4 flex items-center gap-4">
            
            <div className="text-2xl select-none">{activeNotify.icon}</div>
            
            <div className="flex-grow text-left">
              <h4 className="text-xs font-black text-[#512d7c] uppercase tracking-tighter">
                {activeNotify.title}
              </h4>
              <p className="text-[10px] text-gray-500 font-medium leading-normal mt-0.5">
                {activeNotify.text}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <a 
                href={activeNotify.link} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsVisible(false)}
                className="bg-[#512d7c] text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-[#f2b42c] hover:text-[#512d7c] transition-colors whitespace-nowrap decoration-transparent inline-block text-center cursor-pointer border-0"
              >
                {activeNotify.actionText} ↗
              </a>

              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-red-500 text-xs ml-1 p-1 focus:outline-none cursor-pointer border-0 bg-transparent"
              >
                ✕
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}