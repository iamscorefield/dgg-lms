import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

type MainTier = "basic" | "standard" | "advance";

function normalizeMainTier(raw: unknown): MainTier | null {
  if (!raw) return null;
  const val = String(raw).toLowerCase().trim();
  if (val === "basic" || val === "standard" || val === "advance") {
    return val;
  }
  return null;
}

function getUnlockedModuleCountForTier(tier: MainTier): number {
  if (tier === "basic") return 2;
  if (tier === "standard") return 4;
  return 7; // advance unlocks all 7 modules
}

export async function POST(req: NextRequest) {
  // Read raw body for Paystack signature check
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Verify Paystack signature
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const hash = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  if (!signature || hash !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Only handle successful charges
  if (event.event === "charge.success") {
    const metadata = event.data.metadata || {};
    const { user_id, course_id, tier, main_tier } = metadata;
    const amountKobo = Number(event.data.amount || 0);
    const reference = event.data.reference;

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id in metadata" },
        { status: 400 }
      );
    }

    const supabase = await createServer();

    // CASE 1: Tier-based one-time payment (Prep or Business package)
    if (tier === "prep" || tier === "business") {
      const updateField =
        tier === "prep" ? { prep_paid: true } : { business_paid: true };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updateField)
        .eq("id", user_id);

      if (profileError) {
        console.error("Error updating profile tier payment:", profileError);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { received: true, tier_unlocked: tier },
        { status: 200 }
      );
    }

    // CASE 2: Individual / Main Course Tiered Enrollment Payment
    if (!course_id) {
      return NextResponse.json(
        { error: "Missing course_id metadata" },
        { status: 400 }
      );
    }

    const selectedMainTier = normalizeMainTier(main_tier ?? tier);

    let course: Record<string, any> | null = null;
    let courseError: any = null;

    const fullCourseRes = await supabase
      .from("courses")
      .select(
        "id, course_type, price, basic_price, standard_price, advance_price"
      )
      .eq("id", course_id)
      .single();

    if (fullCourseRes.error || !fullCourseRes.data) {
      const fallbackCourseRes = await supabase
        .from("courses")
        .select("id, course_type, price")
        .eq("id", course_id)
        .single();
      course = fallbackCourseRes.data;
      courseError = fallbackCourseRes.error;
    } else {
      course = fullCourseRes.data;
    }

    if (!course || courseError) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const isMainCourse =
      String(course.course_type || "").toLowerCase() === "main";

    let expectedAmountNgn = Number(course.price || 0);

    if (isMainCourse && selectedMainTier) {
      if (selectedMainTier === "basic") {
        expectedAmountNgn = Number(course.basic_price ?? course.price ?? 0);
      } else if (selectedMainTier === "standard") {
        expectedAmountNgn = Number(course.standard_price || 0);
      } else if (selectedMainTier === "advance") {
        expectedAmountNgn = Number(course.advance_price || 0);
      }
    }

    const expectedAmountKobo = expectedAmountNgn * 100;
    if (expectedAmountKobo > 0 && amountKobo !== expectedAmountKobo) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    const unlockedModulesCount =
      isMainCourse && selectedMainTier
        ? getUnlockedModuleCountForTier(selectedMainTier)
        : null;

    const baseEnrollmentUpdate: Record<string, unknown> = {
      payment_status: "paid",
      payment_reference: reference,
      enrolled_at: new Date().toISOString(),
    };

    if (isMainCourse && selectedMainTier) {
      const tieredUpdate: Record<string, unknown> = {
        ...baseEnrollmentUpdate,
        access_tier: selectedMainTier,
        unlocked_modules: unlockedModulesCount,
      };

      const { error: tieredUpdateError } = await supabase
        .from("enrollments")
        .update(tieredUpdate)
        .eq("student_id", user_id)
        .eq("course_id", course_id)
        .eq("payment_status", "pending");

      if (tieredUpdateError) {
        // Fallback if access_tier / unlocked_modules columns haven't been added yet
        await supabase
          .from("enrollments")
          .update(baseEnrollmentUpdate)
          .eq("student_id", user_id)
          .eq("course_id", course_id)
          .eq("payment_status", "pending");
      }
    } else {
      await supabase
        .from("enrollments")
        .update(baseEnrollmentUpdate)
        .eq("student_id", user_id)
        .eq("course_id", course_id)
        .eq("payment_status", "pending");
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}