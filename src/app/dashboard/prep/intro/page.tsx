"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export default function PrepIntroPage() {
  const [loading, setLoading] = useState(false);
  const role: "student" | "tutor" | "admin" = "student";

  // 🔥 FIXED: Updated to align exactly with image_d0d85d.png foundational modules
  const prepCourses = [
    { 
      id: "01", 
      title: "Basic Computer and Internet Skills for Absolute Beginners", 
      desc: "Master essential hardware concepts, operating system navigation, and baseline internet operations confidently." 
    },
    { 
      id: "02", 
      title: "Getting Ready for Online Learning", 
      desc: "Set up professional digital workspace communication architectures and master asynchronous learning frameworks." 
    },
    { 
      id: "03", 
      title: "Introduction to Modern Techie Journey", 
      desc: "Discover multi-tier industry career paths and plan your technical track development timeline." 
    },
    { 
      id: "04", 
      title: "Introduction to No-Code Tools & Building Your First App or Website", 
      desc: "Design responsive visual wireframes and deploy functional web applications without writing raw code lines." 
    },
    { 
      id: "05", 
      title: "Cybersecurity Fundamentals: Understanding Cybersecurity Basics", 
      desc: "Protect sensitive user accounts, master encryption protocols, and avoid standard online vulnerability traps." 
    },
    { 
      id: "06", 
      title: "Introduction to Artificial Intelligence (AI)", 
      desc: "Harness advanced prompt engineering patterns to automate complex creative workflows and research cycles." 
    },
    { 
      id: "07", 
      title: "Get To Know Legal Registration of Business in Nigeria", 
      desc: "Navigate Corporate Affairs Commission (CAC) legal frameworks to register businesses and establish corporate structures legally." 
    },
    { 
      id: "08", 
      title: "Digital Monetization – Secure Online Opportunities...", 
      desc: "Build optimized freelance marketplace channels, create bidding loops, and configure international payment pipelines securely." 
    }
  ];

  const handlePaystack = async () => {
    try {
      setLoading(true);
      const supabase = createBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please log in first.");
        setLoading(false);
        return;
      }

      const email = session.user.email;
      if (!email) {
        toast.error("No email found for this account.");
        setLoading(false);
        return;
      }

      const amount = 75000; // 🔥 PRESERVED: Your verified 75k structural token pricing setting
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, 
        currency: "NGN",
        reference: "DGG-PREP-" + new Date().getTime().toString(),
        metadata: {
          user_id: session.user.id,
          type: "membership",
          course_bundle: "dgg_prep_main"
        },
        callback: () => {
          toast.success("Payment successful! Your DGG Prep enrollment is active.");
          setLoading(false);
          window.location.reload();
        },
        onClose: () => {
          toast.error("Payment registration cancelled.");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error(error);
      toast.error("Could not start payment module. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-[#512d7c]/10 text-slate-800 font-sans">
      <Sidebar role={role} />

      {/* Main Container Workspace */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
        <div className="max-w-5xl mx-auto">
          
          {/* Premium Hero Banner Card Layout */}
          <section className="relative overflow-hidden bg-slate-50 rounded-3xl border border-slate-200/70 p-6 sm:p-8 lg:p-12 mb-8 shadow-2xs">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#f2b42c]/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="relative z-10 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200/80 text-xs font-black text-[#f2b42c] uppercase tracking-widest rounded-full mb-4 shadow-3xs">
                ✨ DGG Academy Prep Course
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#512d7c] tracking-tight leading-tight max-w-3xl">
                Start your tech journey with absolute confidence
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-2xl mt-3 leading-relaxed">
                This foundational program is engineered specifically for beginners looking for an unshakeable starting baseline before selecting advanced tracks. Bypass random tutorial loops, master ecosystem workflows, and forge winning production habits from day one.
              </p>
            </div>
          </section>

          {/* Video Overview Grid System Layout */}
          <section className="grid lg:grid-cols-[1.6fr,1.4fr] gap-6 mb-10 items-start">
            
            {/* Interactive Video Container */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/70 p-6 text-left h-full flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-4">
                  <span>📹</span> Intro Blueprint Video: How Prep Executes
                </h2>
                <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-inner overflow-hidden flex flex-col items-center justify-center text-center p-4 group relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-0" />
                  <div className="h-14 w-14 rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/20 shadow-md z-10 scale-95 group-hover:scale-100">
                    <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-7xl font-black text-white/5 tracking-tighter absolute select-none pointer-events-none uppercase">
                    DGG
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-4 font-mono z-10 group-hover:text-white transition-colors">
                    DGG Academy Intro Matrix Node
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400 leading-relaxed italic border-t border-slate-200/60 pt-3">
                Inside this operational briefing, your instructors map out module milestones, platform execution tools, and explain exactly how these 8 foundational paths launch your journey.
              </p>
            </div>

            {/* Upgraded Payment Pricing Widget Box */}
            <div className="bg-slate-50 rounded-3xl border-2 border-[#512d7c]/20 p-6 sm:p-8 shadow-2xs text-left relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-[#512d7c] text-white font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                Lifetime Access
              </div>

              <div>
                <h2 className="text-xs font-black text-[#512d7c] uppercase tracking-widest mb-1">
                  Full Onboarding Token
                </h2>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  One-time Student Membership
                </h3>
                
                <div className="my-5 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ₦75,000
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider line-through">
                    ₦120,000
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-5">
                  Unlock permanent unthrottled access clearance into our 8 foundational modules with zero future subscription rates.
                </p>

                <ul className="text-xs font-bold text-slate-600 space-y-2.5 mb-6 border-t border-b border-slate-200/60 py-4">
                  <li className="flex items-center gap-2.5"><span className="text-emerald-500 text-sm">✓</span> Access to 8 Core Prep Disciplines</li>
                  <li className="flex items-center gap-2.5"><span className="text-emerald-500 text-sm">✓</span> Step-by-Step Practical Blueprint Sequence</li>
                  <li className="flex items-center gap-2.5"><span className="text-emerald-500 text-sm">✓</span> Real-world Project Portfolios &amp; Monetization</li>
                  <li className="flex items-center gap-2.5"><span className="text-emerald-500 text-sm">✓</span> Direct Technical Support Loops</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handlePaystack}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-[#512d7c] hover:bg-[#402263] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition disabled:opacity-50 active:scale-98 shadow-sm cursor-pointer"
                >
                  {loading ? "Initializing Channel..." : "Authorize ₦75,000 Membership"}
                </button>
                <p className="text-[10px] text-center font-medium text-slate-400 leading-relaxed">
                  Securely processed via Paystack Infrastructure. Single billing footprint. No renewal rates apply.
                </p>
              </div>
            </div>

          </section>

          {/* 📚 Complete 8 Prep Course Cards Grid Layout */}
          <section className="mb-10 text-left">
            <div className="mb-6">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>📖</span> Included Foundational Modules (8 Core Tracks)
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Each node is structured sequentially with structured learning resources, real objectives, and custom mentor review gates.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {prepCourses.map((course) => (
                <div key={course.id} className="bg-slate-50/60 rounded-2xl border border-slate-200/60 p-5 hover:bg-white hover:border-slate-300 transition-all flex gap-4 group shadow-3xs">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center font-mono font-black text-xs text-[#512d7c] shadow-3xs group-hover:bg-[#512d7c] group-hover:text-white transition-all flex-shrink-0">
                    {course.id}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-[#512d7c] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed mt-1.5">
                      {course.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Journey Milestones Map Layout */}
          <section className="bg-slate-50 rounded-3xl border border-slate-200/70 p-6 sm:p-8 lg:p-10 mb-10 text-left">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2">
              <span>🎯</span> Your Journey in 4 Simple Milestones
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              
              <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 relative group hover:shadow-2xs transition-all">
                <span className="absolute top-3 right-4 font-mono font-black text-slate-100 group-hover:text-[#f2b42c]/10 text-3xl transition-colors">01</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-[11px] font-black text-[#f2b42c]">1</span>
                <p className="font-bold text-slate-800 text-sm mt-1">Create Account</p>
                <p className="text-slate-400 font-medium leading-relaxed">Secure your unique profile credentials and launch your personalized path entry setup.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 relative group hover:shadow-2xs transition-all">
                <span className="absolute top-3 right-4 font-mono font-black text-slate-100 group-hover:text-[#512d7c]/10 text-3xl transition-colors">02</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-[11px] font-black text-[#512d7c]">2</span>
                <p className="font-bold text-slate-800 text-sm mt-1">Clear Entry Fee</p>
                <p className="text-slate-400 font-medium leading-relaxed">Process your flat one-time entry token to gain complete permanent platform ecosystem access.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 relative group hover:shadow-2xs transition-all">
                <span className="absolute top-3 right-4 font-mono font-black text-slate-100 group-hover:text-[#f2b42c]/10 text-3xl transition-colors">03</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-[11px] font-black text-[#f2b42c]">3</span>
                <p className="font-bold text-slate-800 text-sm mt-1">Execute Roadmap</p>
                <p className="text-slate-400 font-medium leading-relaxed">Tackle the 8 core structured curriculum modules sequentially using custom learning sandboxes.</p>
              </div>

              <div className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-slate-200/60 relative group hover:shadow-2xs transition-all">
                <span className="absolute top-3 right-4 font-mono font-black text-slate-100 group-hover:text-[#512d7c]/10 text-3xl transition-colors">04</span>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-[11px] font-black text-[#512d7c]">4</span>
                <p className="font-bold text-slate-800 text-sm mt-1">Advance Upward</p>
                <p className="text-slate-400 font-medium leading-relaxed">Graduate confidently directly into your selected high-demand core specialization sprint tier.</p>
              </div>

            </div>
          </section>

          {/* Secondary Bottom Call-to-Action Panel */}
          <section className="bg-gradient-to-r from-[#512d7c] to-[#361d53] rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-md">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(242,180,44,0.08),transparent)] pointer-events-none" />
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
              Ready to unlock your permanent developer clearance?
            </h2>
            <p className="text-xs font-medium text-purple-200 max-w-lg mx-auto mb-5 leading-relaxed">
              Join your DGG Academy peers today and launch through your 8 core courses with elite support loops.
            </p>
            <button
              type="button"
              onClick={handlePaystack}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-[#f2b42c] hover:bg-[#dfa21e] px-6 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg transition disabled:opacity-50 cursor-pointer border-0"
            >
              {loading ? "Initializing..." : "Become a DGG Student (₦75,000)"}
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}