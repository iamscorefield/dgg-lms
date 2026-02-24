import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";
import crypto from "crypto";

export async function POST(req: Request) {
  // Read raw body for Paystack signature check
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  // Verify Paystack signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
    .update(body)
    .digest("hex");

  if (!signature || hash !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // Only handle successful charges
  if (event.event === "charge.success") {
    const { user_id, course_id } = event.data.metadata || {};
    const amountKobo = event.data.amount;
    const reference = event.data.reference;

    if (!user_id || !course_id) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // Service-role Supabase client (for server-side updates)
    const supabase = createServerClient({
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    });

    // Get course price to confirm amount
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("price")
      .eq("id", course_id)
      .single();

    if (!course || courseError) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Compare amount in kobo
    const expectedAmountKobo = Number(course.price || 0) * 100;
    if (amountKobo !== expectedAmountKobo) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
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

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
