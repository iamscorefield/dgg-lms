"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export default function BusinessIntroPage() {
  const [loading, setLoading] = useState(false);
  const role: "student" | "tutor" | "admin" = "student";

  const businessModules = [
    { 
      id: "01", 
      title: "Legal Registration with CAC (Nigeria)", 
      desc: "Navigate Corporate Affairs Commission frameworks to officially register your enterprise name or limited company." 
    },
    { 
      id: "02", 
      title: "Business Name & Corporate Entity Setup Sprints", 
      desc: "Execute name availability searches, reservation filings, and statutory documentation workflows seamlessly." 
    },
    { 
      id: "03", 
      title: "Annual Returns, Tax & Regulatory Compliance", 
      desc: "Master FIRS tax identification, regulatory obligations, and timely annual return filings to protect your business standing." 
    },
    { 
      id: "04", 
      title: "Venture Operations, Planning & Scaling", 
      desc: "Establish corporate banking, asset structures, and operational frameworks designed for long-term commercial growth." 
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

      const amount = 100000; // Verified Business Tier Pricing (₦100k)
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100, 
        currency: "NGN",
        reference: "DGG-BIZ-" + new Date().getTime().toString(),
        metadata: {
          user_id: session.user.id,
          type: "membership",
          course_bundle: "dgg_business_main"
        },
        callback: () => {
          toast.success("Payment successful! Your DGG Business Tier enrollment is active.");
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

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
        <div className="max-w-5xl mx-auto">
          
          {/* Premium Hero Banner */}
          <section className="relative overflow-hidden bg-slate-50 rounded-3xl border border-slate-200/70 p-6 sm:p-8 lg:p-12 mb-8 shadow-2xs">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="relative z-10 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200/80 text-xs font-black text-amber-700 uppercase tracking-widest rounded-full mb-4 shadow-3xs">
                📈 DGG Academy Business Tier
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#512d7c] tracking-tight leading-tight max-w-3xl">
                Launch and scale your enterprise with legal certainty
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-2xl mt-3 leading-relaxed">
                Our Business Startup Track is engineered for entrepreneurs seeking complete corporate registration guidance, regulatory compliance mastery, and professional venture structuring from day one.
              </p>
            </div>
          </section>

          {/* Video Overview Grid System */}
          <section className="grid lg:grid-cols-[1.6fr,1.4fr] gap-6 mb-10 items-start">
            
            <div className="bg-slate-50 rounded-3xl border border-slate-200/70 p-6 text-left h-full flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-4">
                  <span>📹</span> Business Blueprint Video: Registration &amp; Scaling
                </h2>
                
                <div className="aspect-video w-full rounded-2xl bg-black border border-slate-200 shadow-inner overflow-hidden relative group">
                  <video 
                    src="/videos/business-intro.mp4"
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400 leading-relaxed italic border-t border-slate-200/60 pt-3">
                Watch this operational briefing to understand our step-by-step corporate registration frameworks and compliance advisory loops.
              </p>
            </div>

            {/* Payment Widget Box */}
            <div className="bg-slate-50 rounded-3xl border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xs text-left relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-amber-600 text-white font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-bl-xl shadow-xs">
                Enterprise Access
              </div>

              <div>
                <h2 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">
                  Business Startup Package
                </h2>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  One-time Corporate Membership
                </h3>
                
                <div className="my-5 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ₦100,000
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider line-through">
                    ₦150,000
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-5">
                  Unlock permanent access clearance into our 4 core business training modules and statutory registration guides.
                </p>

                <ul className="text-xs font-bold text-slate-600 space-y-2.5 mb-6 border-t border-b border-slate-200/60 py-4">
                  <li className="flex items-center gap-2.5"><span className="text-amber-600 text-sm">✓</span> Complete CAC Registration Walkthrough</li>
                  <li className="flex items-center gap-2.5"><span className="text-amber-600 text-sm">✓</span> Corporate Entity &amp; Tax Setup Sprints</li>
                  <li className="flex items-center gap-2.5"><span className="text-amber-600 text-sm">✓</span> Annual Returns &amp; Compliance Checklists</li>
                  <li className="flex items-center gap-2.5"><span className="text-amber-600 text-sm">✓</span> Direct Entrepreneurship Advisory Loops</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handlePaystack}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-[#512d7c] hover:bg-[#402263] px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white transition disabled:opacity-50 active:scale-98 shadow-sm cursor-pointer"
                >
                  {loading ? "Initializing Gateway..." : "Authorize ₦100,000 Business Access"}
                </button>
                <p className="text-[10px] text-center font-medium text-slate-400 leading-relaxed">
                  Securely processed via Paystack Infrastructure. Single billing footprint. No renewal rates apply.
                </p>
              </div>
            </div>

          </section>

          {/* 📚 Business Modules Grid */}
          <section className="mb-10 text-left">
            <div className="mb-6">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span>📖</span> Included Business Modules (4 Core Tracks)
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Structured enterprise modules designed to take your venture from concept to fully compliant legal status.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {businessModules.map((course) => (
                <div key={course.id} className="bg-slate-50/60 rounded-2xl border border-slate-200/60 p-5 hover:bg-white hover:border-slate-300 transition-all flex gap-4 group shadow-3xs">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center font-mono font-black text-xs text-amber-700 shadow-3xs group-hover:bg-amber-600 group-hover:text-white transition-all flex-shrink-0">
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

        </div>
      </div>
    </div>
  );
}