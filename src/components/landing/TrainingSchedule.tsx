"use client";

export default function TrainingSchedule() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#512d7c] via-[#512d7c] to-[#f2b42c]/35">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/90 rounded-3xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 sm:px-6 pt-5 sm:pt-6">
            <span className="text-2xl">🎓</span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#512d7c]">
              Live Skills &amp; Career Training Batches
            </h2>
          </div>

          <p className="px-4 sm:px-6 pt-3 pb-5 sm:pb-6 text-xs sm:text-sm md:text-base text-gray-800">
            Structured live sessions designed for students, graduates, and working
            professionals who want to build practical digital and career skills
            through real projects and guided mentorship.
          </p>

          {/* Table */}
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-12 bg-[#512d7c] text-white text-xs sm:text-sm md:text-base font-semibold">
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-2.5 sm:py-3">
                Day
              </div>
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-2.5 sm:py-3">
                Time
              </div>
              <div className="col-span-4 md:col-span-6 px-3 sm:px-4 py-2.5 sm:py-3">
                Activity
              </div>
            </div>

            {/* Weekday batch */}
            <div className="grid grid-cols-12 text-xs sm:text-sm md:text-base text-[#512d7c]">
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
                Mon, Wed &amp; Thu
              </div>
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
                10 AM – 3 PM (Live Hybrid: Online + In‑Person)
              </div>
              <div className="col-span-4 md:col-span-6 px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
                Core training sessions, Q&amp;A and practical walk‑throughs.
              </div>
            </div>

            {/* Weekend batch */}
            <div className="grid grid-cols-12 text-xs sm:text-sm md:text-base text-[#512d7c]">
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-3 sm:py-4">
                Weekend (Sat)
              </div>
              <div className="col-span-4 md:col-span-3 px-3 sm:px-4 py-3 sm:py-4">
                11 AM – 3 PM (Live Hybrid)
              </div>
              <div className="col-span-4 md:col-span-6 px-3 sm:px-4 py-3 sm:py-4">
                Project &amp; skill‑building labs, portfolio reviews and career guidance.
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="px-4 sm:px-6 py-3 sm:py-4 text-[11px] sm:text-xs md:text-sm text-gray-600 italic">
            Note: Batches run in cycles across the year. You can join the next
            available cohort that matches your schedule.
          </p>
        </div>
      </div>
    </section>
  );
}
