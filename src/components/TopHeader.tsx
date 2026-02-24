"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Welcome to DGG Academy – empowering learners and tutors across Africa.",
  "We use 3 flexible phases of learning to make education easy and accessible for all.",
  "Choose self‑paced learning, join a cohort batch, or book one‑on‑one sessions.",
  "Learn anywhere, anytime with expert tutors and practical, real‑world projects.",
  "Start small, grow fast – build skills that match your goals and schedule.",
];

export default function TopHeader() {
  const [now, setNow] = useState<string>("");
  const [displayed, setDisplayed] = useState<string>("");
  const [messageIndex, setMessageIndex] = useState(0);

  // Date & time
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const formatted = d.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      setNow(formatted);
    };

    updateTime();
    const id = setInterval(updateTime, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Typing effect for multiple messages
  useEffect(() => {
    const text = MESSAGES[messageIndex];
    let i = 0;

    setDisplayed("");

    const typeInterval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(typeInterval);

        // Wait before next message
        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 1800); // pause after finishing one message
      }
    }, 40); // typing speed

    return () => clearInterval(typeInterval);
  }, [messageIndex]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-9 sm:h-10">
        {/* Date & time */}
        <div className="text-[10px] sm:text-xs font-medium">
          <span className="text-[#512d7c]">{now}</span>
        </div>

        {/* Typing text */}
        <div className="flex-1 mx-3 overflow-hidden">
          <p className="text-[10px] sm:text-xs font-semibold text-[#512d7c] whitespace-normal">
            {displayed}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Accent dots */}
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#512d7c]" />
          <span className="h-2 w-2 rounded-full bg-[#f2b42c]" />
        </div>
      </div>
    </div>
  );
}
