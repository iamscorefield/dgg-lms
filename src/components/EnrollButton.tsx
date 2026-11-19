// src/components/EnrollButton.tsx
"use client";

import { useState } from "react";
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

export type MainTierKey = "basic" | "standard" | "advance";

type EnrollButtonProps = {
  courseId: number;
  isFree: boolean | null;
  selectedTier?: MainTierKey | null;
  tierPrice?: number | null;
  isUpgrade?: boolean;
  label?: string;
};

function getUnlockedCountForMainTier(tier: MainTierKey): number {
  if (tier === "basic") return 2;
  if (tier === "standard") return 4;
  return 7;
}

export function EnrollButton({
  courseId,
  isFree,
  selectedTier = null,
  tierPrice = null,
  isUpgrade = false,
  label,
}: EnrollButtonProps) {
  const [processing, setProcessing] = useState(false);

  async function handleClick() {
    if (processing) return;
    setProcessing(true);

    try {
      const supabase = createBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error("Login first to enroll");
        setProcessing(false);
        return;
      }

      // 1) Load full course row
      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error || !course) {
        console.error("Course not found for payment:", error);
        toast.error("Could not load course info");
        setProcessing(false);
        return;
      }

      const isMainCourse =
        String(course.course_type || "").toLowerCase() === "main";

      // Resolve exact price to charge
      let priceToCharge = Number(course.price || 0);

      if (isMainCourse && selectedTier) {
        if (tierPrice && tierPrice > 0) {
          priceToCharge = Number(tierPrice);
        } else if (selectedTier === "basic") {
          priceToCharge = Number(course.basic_price ?? course.price ?? 0);
        } else if (selectedTier === "standard") {
          priceToCharge = Number(course.standard_price ?? 0);
        } else if (selectedTier === "advance") {
          priceToCharge = Number(course.advance_price ?? 0);
        }
      }

      if (isFree || !priceToCharge || priceToCharge <= 0) {
        if (isMainCourse && !isFree) {
          toast.error("Price for the selected tier has not been configured yet.");
          setProcessing(false);
          return;
        }

        await supabase.from("enrollments").insert({
          student_id: session.user.id,
          course_id: courseId,
          payment_status: "paid",
          metadata: { training_type: "dashboard_course" },
        });
        toast.success("Enrolled successfully!");
        window.location.href = `/dashboard/learning/${courseId}`;
        return;
      }

      // 2) Ensure an enrollment record exists (or update existing enrollment for upgrade)
      const { data: existingEnrollment } = await supabase
        .from("enrollments")
        .select("id, payment_status")
        .eq("student_id", session.user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      if (!existingEnrollment) {
        await supabase.from("enrollments").insert({
          student_id: session.user.id,
          course_id: courseId,
          payment_status: "pending",
          metadata: {
            training_type: "dashboard_course",
            main_tier: selectedTier || undefined,
          },
        });
      } else if (existingEnrollment.payment_status !== "paid") {
        await supabase
          .from("enrollments")
          .update({ payment_status: "pending" })
          .eq("id", existingEnrollment.id);
      }

      // 3) Launch Paystack inline popup
      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        console.error("Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY");
        toast.error("Payment is not configured. Contact support.");
        setProcessing(false);
        return;
      }

      if (typeof window === "undefined" || !window.PaystackPop) {
        console.error("Paystack script not loaded");
        toast.error("Payment not ready yet. Please wait a moment and try again.");
        setProcessing(false);
        return;
      }

      const userEmail = session.user.email ?? "no-email@placeholder.com";
      const reference = `DGG-${courseId}-${Date.now()}`;

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: userEmail,
        amount: Math.round(priceToCharge * 100), // NGN → kobo
        currency: "NGN",
        reference,
        metadata: {
          user_id: session.user.id,
          course_id: courseId,
          main_tier: isMainCourse && selectedTier ? selectedTier : undefined,
          tier: isMainCourse && selectedTier ? selectedTier : undefined,
          is_upgrade: isUpgrade,
          training_type: "dashboard_course",
        },
        callback: async (response) => {
          try {
            // Immediately sync enrollment tier & paid status so student doesn't wait on webhook delay
            const unlockedCount =
              isMainCourse && selectedTier
                ? getUnlockedCountForMainTier(selectedTier)
                : null;

            const updateFields: Record<string, unknown> = {
              payment_status: "paid",
              payment_reference: response?.reference || reference,
              enrolled_at: new Date().toISOString(),
            };

            if (isMainCourse && selectedTier) {
              updateFields.access_tier = selectedTier;
              updateFields.unlocked_modules = unlockedCount;
            }

            const { error: updateErr } = await supabase
              .from("enrollments")
              .update(updateFields)
              .eq("student_id", session.user.id)
              .eq("course_id", courseId);

            if (updateErr && isMainCourse && selectedTier) {
              // Fallback if access_tier / unlocked_modules columns are not added yet
              await supabase
                .from("enrollments")
                .update({
                  payment_status: "paid",
                  payment_reference: response?.reference || reference,
                  enrolled_at: new Date().toISOString(),
                })
                .eq("student_id", session.user.id)
                .eq("course_id", courseId);
            }
          } catch (syncErr) {
            console.error("Post-payment enrollment sync error:", syncErr);
          }

          toast.success(
            isUpgrade
              ? `Upgraded to ${selectedTier?.toUpperCase()} tier! Modules unlocked.`
              : "Payment successful! Redirecting to your course workspace..."
          );
          window.location.href = `/dashboard/learning/${courseId}`;
        },
        onClose: () => {
          toast.error("Payment cancelled");
          setProcessing(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Enroll button error:", err);
      toast.error("Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  const buttonText =
    label ||
    (isFree
      ? "Start for free"
      : isUpgrade && selectedTier
      ? `Upgrade to ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}`
      : selectedTier
      ? `Enroll ${selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier`
      : "Enroll now");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={processing}
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#f2b42c] text-xs font-bold text-black hover:bg-[#e0a51a] transition cursor-pointer disabled:opacity-60 border-0"
    >
      {processing ? "Opening checkout..." : buttonText}
    </button>
  );
}