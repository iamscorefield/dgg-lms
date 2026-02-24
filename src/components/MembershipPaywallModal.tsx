"use client";

import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

type MembershipPaywallModalProps = {
  open: boolean;
  onClose: () => void;
  source?: "prep-course" | "prep-lesson" | "profile-edit" | "default";
};

export function MembershipPaywallModal({
  open,
  onClose,
  source = "default",
}: MembershipPaywallModalProps) {
  if (!open) return null;

  let title = "Join DGG Student to unlock prep courses";
  let body =
    "Pay a one-time fee of 30,000 to become a DGG Student and unlock access to our beginners prep program.";
  if (source === "profile-edit") {
    title = "Upgrade to edit your profile";
    body =
      "Profile editing and full prep access are available for DGG Students. Pay a one-time fee of 30,000 to unlock these features.";
  }

  const handlePaystack = async () => {
    try {
      const supabase = createBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Please log in first.");
        return;
      }

      const email = session.user.email;
      if (!email) {
        toast.error("No email found for this account.");
        return;
      }

      const amount = 30000; // NGN
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
        callback: async () => {
          toast.success("Payment successful! Your membership will be activated.");
          // TODO: later we will call Supabase here to set membership_status = 'premium'
          onClose();
        },
        onClose: () => {
          toast.error("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Error starting Paystack payment:", err);
      toast.error("Could not start payment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4 p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
        >
          ×
        </button>
        <p className="text-xs font-semibold text-[#f2b42c] uppercase tracking-[0.16em] mb-1">
          DGG Student Membership
        </p>
        <h2 className="text-sm font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-xs text-gray-700 mb-3">{body}</p>
        <ul className="text-[11px] text-gray-700 space-y-1 mb-4">
          <li>• Unlock 10 structured prep courses.</li>
          <li>• Get a clear roadmap for your tech journey.</li>
          <li>• One-time payment, no expiry for prep access.</li>
        </ul>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-full text-[11px] font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handlePaystack}
            className="px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-[#512d7c] hover:bg-[#3f215f]"
          >
            Pay 30,000 now
          </button>
        </div>
      </div>
    </div>
  );
}
