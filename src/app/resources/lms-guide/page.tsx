"use client";

import { useState } from "react";
import { Play, BookOpen, Clock, Layers, HelpCircle, ArrowUpRight, ChevronDown, MessageSquare, Headphones, ShieldAlert } from "lucide-react";

interface VideoGuide {
  id: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  youtubeId: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function LMSGuidePage() {
  // 9 Custom Structured Video Guides for DGG Platform Mastery
  const guides: VideoGuide[] = [
    {
      id: "01",
      title: "Complete Platform Walkthrough & Onboarding Guide",
      duration: "12:45",
      category: "Ecosystem Basics",
      description: "A comprehensive structural tour through the DGG platform dashboard. Learn how to locate assignments, switch modules, and interact with the technical core.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "02",
      title: "Bypassing the Gate-Locked Syllabus Mechanics",
      duration: "08:20",
      category: "Syllabus Mastery",
      description: "Understand how the 80%+ scoring validation mechanism locks subsequent courses and learn the strict sandbox deployment rules.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "03",
      title: "Setting Up Your Supabase Local Localized State",
      duration: "15:10",
      category: "Developer Track",
      description: "How to safely handle profile metadata strings, perform local table tests, and configure authentication endpoints without error loops.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "04",
      title: "Optimizing Your Interactive Student Workspace",
      duration: "06:40",
      category: "Ecosystem Basics",
      description: "Customize your environment controls, review execution timelines, and sync your primary calendar nodes with cohort live briefings.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "05",
      title: "Submitting Your First Practical Sandbox Lab Assessment",
      duration: "10:15",
      category: "Syllabus Mastery",
      description: "Step-by-step guidance on committing logic, troubleshooting failed compilations, and validating your sandbox scores efficiently.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "06",
      title: "Connecting with Cohort Dedicated Support Mentors",
      duration: "05:30",
      category: "Support Loops",
      description: "Bypass typical ticket queues. Learn how to leverage instant asynchronous communication matrices to clear structural roadblocks.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "07",
      title: "Navigating Monetization Milestones & Portfolio Setup",
      duration: "14:22",
      category: "Monetization",
      description: "A professional mapping of Upwork pipelines, international payment gateway setups, and formatting your real-world development portfolio data.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "08",
      title: "Troubleshooting Authentication Session Timeouts",
      duration: "07:05",
      category: "Support Loops",
      description: "Fixing stale browser sessions, handling cookie expirations safely, and checking database synchronizations instantly.",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "09",
      title: "Graduating Confidently into Advanced Specialization Tiers",
      duration: "11:50",
      category: "Monetization",
      description: "What happens after the Prep Track? How to systematically map your baseline performance score sheet into premium corporate specialized agency pods.",
      youtubeId: "dQw4w9WgXcQ"
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Why is my next lesson showing a locked status icon?",
      answer: "DGG Academy runs on a strict sequential gate-locking framework. You must attempt the practical assessment sandbox assignment for your current lesson and score 80% or higher to automatically trigger the database migration hook that unlocks the next video node."
    },
    {
      question: "How long do I maintain access clearance to these video training modules?",
      answer: "Once your baseline ₦75,000 onboarding membership token is authorized via Paystack, your account clears for lifetime unthrottled server access. There are zero recurring subscription rates, and all future 2026 curriculum expansions are included."
    },
    {
      question: "What should I do if my Paystack payment successfully runs but my panel remains locked?",
      answer: "This is usually caused by a delayed background web-hook sync. Do not pay twice. Simply perform a hard refresh on your web browser cache or sign out and sign back in to force a fresh Supabase session token fetch."
    },
    {
      question: "Can I download these video modules to watch offline?",
      answer: "To secure proprietary system logic, all curriculum training modules must be streamed live through our high-performance embedded media pipeline inside the authenticated web student panel dashboard."
    }
  ];

  const [currentVideo, setCurrentVideo] = useState<VideoGuide>(guides[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* SECTION HEADER BLOCK */}
        <div className="text-left max-w-3xl mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-xs font-black text-[#512d7c] uppercase tracking-widest rounded-full mb-3">
            📚 Knowledge Base Clearance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A0033] tracking-tight leading-tight">
            LMS Operational Video Blueprint Guide
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Eliminate operational confusion completely. Switch through our 9 deep-dive interface modules below to master your workspace configurations, code sandboxes, and platform pathways instantly.
          </p>
        </div>

        {/* TOP CORES SYSTEM: THE MAIN STREAM THEATER PLAYER LAYER */}
        <section className="grid lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Active Theater View Panel Frame */}
          <div className="lg:col-span-8 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm">
            <div className="aspect-video w-full rounded-2xl bg-black border border-slate-800 shadow-inner overflow-hidden relative">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
            <div className="mt-5 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#512d7c]/10 text-[#512d7c] px-2.5 py-1 rounded-md">
                {currentVideo.category}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-[#1A0033] tracking-tight mt-2.5 mb-2">
                {currentVideo.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                {currentVideo.description}
              </p>
            </div>
          </div>

          {/* REWRITTEN SIDEBAR CONTEXT BOX */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#512d7c] to-[#2E164A] text-white p-6 sm:p-8 rounded-3xl shadow-md h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
            <div>
              <h3 className="text-base font-black tracking-tight mb-4 flex items-center gap-2 text-[#f2b42c]">
                <HelpCircle size={20} /> Ready to get started?
              </h3>
              <p className="text-xs text-purple-100 font-medium leading-relaxed mb-4">
                This guided reference structure is designed to fast-track your technical literacy setup. To ensure maximum optimization as you move forward:
              </p>
              <ul className="text-xs space-y-3 font-semibold text-purple-200 border-t border-white/10 pt-4">
                <li className="flex items-start gap-2">🔹 Follow the modules sequentially without attempting to bypass core assignment gates.</li>
                <li className="flex items-start gap-2">🔹 Test your system configurations alongside each step using a split-screen layout.</li>
                <li className="flex items-start gap-2">🔹 Access your cohort dashboard to track real-time score analytics and feedback loop criteria.</li>
              </ul>
            </div>
            
            <a 
              href="/signup" 
              className="mt-8 w-full py-3.5 bg-[#f2b42c] hover:bg-[#dfa21e] text-black font-black uppercase text-xs tracking-widest text-center rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 decoration-none"
            >
              Start Full Prep Journey <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        {/* THE LOWER SECTION: CONTROLS GRID STREAMING MATRIX GRID (9 CARDS) */}
        <section className="text-left mb-20">
          <div className="mb-8 border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers size={20} className="text-[#512d7c]" /> All LMS Documentation Modules ({guides.length} Video Blueprints)
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Click any specific operational milestone tile below to reload the primary high-definition streaming view frame canvas above.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((video) => {
              const isActive = currentVideo.id === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => {
                    setCurrentVideo(video);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className={`w-full text-left bg-slate-50/50 hover:bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between group shadow-3xs cursor-pointer ${
                    isActive 
                      ? "border-[#512d7c] bg-white ring-2 ring-[#512d7c]/20 shadow-md" 
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center font-mono font-black text-xs transition-all ${
                        isActive ? "bg-[#512d7c] text-white border-[#512d7c]" : "bg-white text-[#512d7c] border-slate-200 group-hover:bg-[#512d7c] group-hover:text-white"
                      }`}>
                        {video.id}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded">
                        {video.category}
                      </span>
                    </div>

                    <h4 className={`font-black text-sm tracking-tight leading-snug mb-2 transition-colors ${
                      isActive ? "text-[#512d7c]" : "text-slate-800 group-hover:text-[#512d7c]"
                    }`}>
                      {video.title}
                    </h4>
                    
                    <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {video.duration} Mins
                    </span>
                    <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                      isActive ? "text-[#512d7c]" : "text-slate-400 group-hover:text-[#512d7c]"
                    }`}>
                      {isActive ? "Now Watching" : "Launch Guide"} <Play size={10} className="fill-current" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION A: QUICK-SEARCH DOCUMENTATION INDEX (ACCORDION) */}
        <section className="text-left max-w-4xl mx-auto mb-20">
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-2">
              <BookOpen size={22} className="text-[#512d7c]" /> Frequently Raised Platform Questions
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Quick answers to structural mechanics, database status verification, and token access configurations.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-[#512d7c]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed bg-white border-t border-slate-100 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION B: TECHNICAL SUPPORT ESCALATION DESK */}
        <section className="text-left bg-slate-50 border border-slate-200 p-6 sm:p-10 rounded-3xl max-w-5xl mx-auto shadow-2xs">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-[10px] font-black text-red-700 uppercase tracking-widest rounded-md">
                <ShieldAlert size={12} /> System Resolution Core
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Unresolved Account Configuration Bug?
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
                If an assessment score hasn't registered or you are running into LMS dashboard rendering errors after following the guides, escalate it instantly. Our operational administration monitor support tickets directly.
              </p>
            </div>
            
            <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-4 w-full">
              <a 
                href="/contact"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center shadow-3xs decoration-none"
              >
                <MessageSquare size={14} className="text-[#512d7c]" /> Open Forum Ticket
              </a>
              <a 
                href="/contact"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#512d7c] hover:bg-[#3f2261] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all text-center shadow-sm decoration-none"
              >
                <Headphones size={14} /> Contact Live Helpdesk
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}