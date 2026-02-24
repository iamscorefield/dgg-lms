// src/components/EnrollButton.tsx
"use client";

import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

declare global {
  interface Window {
    PaystackPop?: {
      setup(options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        reference: string;
        metadata?: any;
        callback?: (response: { reference: string }) => void;
        onClose?: () => void;
      }): { openIframe: () => void };
    };
  }
}

type EnrollButtonProps = {
  courseId: number;
  isFree: boolean | null;
};

export function EnrollButton({ courseId, isFree }: EnrollButtonProps) {
  async function handleClick() {
    try {
      const supabase = createBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Login first to enroll");
        return;
      }

      // 1) Load full course row (so we can get price like your old table)
      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error || !course) {
        console.error("Course not found for payment:", error);
        toast.error("Could not load course info");
        return;
      }

      // Use a single price field from this dashboard course table
      // If null or 0, treat as free (like your old logic)
      const price = course.price as number | null;

      if (isFree || !price || price === 0) {
        await supabase.from("enrollments").insert({
          student_id: session.user.id,
          course_id: courseId,
          payment_status: "paid",
          metadata: { training_type: "dashboard_course" },
        });
        toast.success("Enrolled successfully!");
        return;
      }

      // 2) Paid flow – same Paystack popup pattern as CourseGrid
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        console.error("Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY");
        toast.error("Payment is not configured. Contact support.");
        return;
      }

      if (typeof window === "undefined" || !window.PaystackPop) {
        console.error("Paystack script not loaded");
        toast.error("Payment not ready yet. Please wait a moment and try again.");
        return;
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: session.user.email,
        amount: price * 100, // NGN → kobo, same as CourseGrid
        currency: "NGN",
        reference: new Date().getTime().toString(),
        metadata: {
          user_id: session.user.id,
          course_id: courseId,
          training_type: "dashboard_course",
        },
        callback: () => {
          toast.success("Payment successful! You now have access to this course.");
          // stay or redirect, your choice:
          // window.location.href = "/dashboard/my-courses";
        },
        onClose: () => {
          toast.error("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Enroll button error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#f2b42c] text-xs font-semibold text-black hover:bg-[#e0a51a]"
    >
      {isFree ? "Start for free" : "Enroll now"}
    </button>
  );
}
