import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

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
    const { user_id, course_id, tier } = metadata; // Added 'tier' support for prep/business packages
    const amountKobo = event.data.amount;
    const reference = event.data.reference;

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id in metadata" },
        { status: 400 }
      );
    }

    const supabase = await createServer();

    // CASE 1: Tier-based one-time payment (e.g., Prep or Business package)
    if (tier === "prep" || tier === "business") {
      const updateField = tier === "prep" ? { prep_paid: true } : { business_paid: true };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updateField)
        .eq("id", user_id);

      if (profileError) {
        console.error("Error updating profile tier payment:", profileError);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      return NextResponse.json({ received: true, tier_unlocked: tier }, { status: 200 });
    }

    // CASE 2: Individual Course Enrollment Payment (Legacy / Standard)
    if (!course_id) {
      return NextResponse.json(
        { error: "Missing course_id metadata" },
        { status: 400 }
      );
    }

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("price")
      .eq("id", course_id)
      .single();

    if (!course || courseError) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const expectedAmountKobo = Number(course.price || 0) * 100;
    if (amountKobo !== expectedAmountKobo) {
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // Update enrollment: mark as paid and set enrolled_at
    await supabase
      .from("enrollments")
      .update({
        payment_status: "paid",
        payment_reference: reference,
        enrolled_at: new Date().toISOString(),
      })
      .eq("student_id", user_id)
      .eq("course_id", course_id)
      .eq("payment_status", "pending");
  }

  return NextResponse.json({ received: true }, { status: 200 });
}