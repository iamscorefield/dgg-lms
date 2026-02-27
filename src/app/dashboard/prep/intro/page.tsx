"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export default function PrepIntroPage() {
  const [loading, setLoading] = useState(false);
  const role: "student" | "tutor" | "admin" = "student";

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

      const amount = 50000;
      const handler = (window as any).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: amount * 100,
        currency: "NGN",
        reference: new Date().getTime().toString(),
        metadata: {
          user_id: session.user.id,
          type: "membership",
        },
        callback: () => {
          toast.success("Payment successful! Your membership will be activated.");
          setLoading(false);
          // later: call Supabase to mark membership as active
        },
        onClose: () => {
          toast.error("Payment cancelled");
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error(error);
      toast.error("Could not start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 mb-8">
            <p className="text-xs font-semibold text-[#f2b42c] uppercase tracking-[0.16em] mb-2">
              DGG Academy Prep
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#512d7c] mb-3">
              Start your tech journey with confidence
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              This prep program is designed for beginners who want a clear,
              simple path into tech. Follow our guided roadmap, learn core
              skills, and build the right habits from day one.
            </p>
          </section>

          {/* Video / overview */}
          <section className="grid lg:grid-cols-[2fr,1.2fr] gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Intro video: how DGG Prep works
              </h2>
              <div className="aspect-video rounded-xl bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-500">
                Intro video coming soon – add your DGG Academy intro here.
              </div>
              <p className="mt-3 text-xs text-gray-600">
                In this video, you&apos;ll explain what students can expect, how
                to use the platform, and how the 10 prep courses fit into their
                journey.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                One-time DGG Student membership
              </h2>
              <p className="text-xs text-gray-700 mb-3">
                With a one‑time payment of{" "}
                <span className="font-semibold">50,000</span>, you become a DGG
                Student and unlock access to our full prep program and
                supporting resources.
              </p>
              <ul className="text-xs text-gray-700 space-y-1 mb-4">
                <li>• Access to 10 structured prep courses.</li>
                <li>• Clear roadmap for your first months in tech.</li>
                <li>• Guided learning, not random YouTube hopping.</li>
              </ul>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePaystack}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[#512d7c] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3f215f] transition disabled:opacity-60"
                >
                  {loading
                    ? "Starting payment..."
                    : "Pay 50,000 to become a DGG Student"}
                </button>
                <p className="text-[11px] text-gray-500">
                  One-time payment. No expiry. You keep access to the prep
                  courses for life as long as your account is active.
                </p>
              </div>
            </div>
          </section>

          {/* Steps section */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Your DGG Prep journey in 4 simple steps
            </h2>
            <div className="grid lg:grid-cols-4 gap-4 text-xs text-gray-700">
              <div className="flex flex-col gap-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b42c] text-[11px] font-semibold text-black">
                  1
                </span>
                <p className="font-semibold text-gray-900">
                  Create your free account
                </p>
                <p>
                  Sign up to DGG Academy and complete your basic profile
                  details.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b42c] text-[11px] font-semibold text-black">
                  2
                </span>
                <p className="font-semibold text-gray-900">
                  Become a DGG Student
                </p>
                <p>
                  Pay 50,000 once to unlock the full prep bundle and premium
                  student features.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b42c] text-[11px] font-semibold text-black">
                  3
                </span>
                <p className="font-semibold text-gray-900">
                  Follow the prep roadmap
                </p>
                <p>
                  Go through the 10 prep courses step by step and complete the
                  guided tasks.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2b42c] text-[11px] font-semibold text-black">
                  4
                </span>
                <p className="font-semibold text-gray-900">
                  Move into advanced courses
                </p>
                <p>
                  After prep, you&apos;ll be ready for more focused, higher‑level
                  courses and real projects.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Ready to start your prep journey?
            </h2>
            <p className="text-xs text-gray-700 mb-3">
              Join as a DGG Student today and unlock all 10 prep courses with a
              simple one‑time payment.
            </p>
            <button
              type="button"
              onClick={handlePaystack}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[#512d7c] px-5 py-2 text-xs font-semibold text-white hover:bg-[#3f215f] transition disabled:opacity-60"
            >
              {loading
                ? "Starting payment..."
                : "Become a DGG Student (50,000)"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
