import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId } = body as { courseId?: number };

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
      return NextResponse.json(
        { error: "Paystack keys not configured" },
        { status: 500 }
      );
    }

    const supabase = await createServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price, is_free, status")
      .eq("id", courseId)
      .single();

    if (courseError || !course || course.status !== "published") {
      return NextResponse.json(
        { error: "Course not found or not published" },
        { status: 404 }
      );
    }

    if (course.is_free) {
      return NextResponse.json(
        { error: "Course is free; no payment required" },
        { status: 400 }
      );
    }

    const amountNaira = Number(course.price || 0);
    if (!amountNaira || amountNaira <= 0) {
      return NextResponse.json(
        { error: "Invalid course price" },
        { status: 400 }
      );
    }

    const amountKobo = amountNaira * 100;

    // Ensure there is a pending enrollment
    await supabase
      .from("enrollments")
      .upsert(
        {
          student_id: userId,
          course_id: courseId,
          payment_status: "pending",
        },
        {
          onConflict: "student_id,course_id",
        }
      );

    const callbackUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000/dashboard/courses";

    const initRes = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amountKobo,
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: {
          user_id: userId,
          course_id: courseId,
          course_title: course.title,
        },
      }),
    });

    const initJson = await initRes.json();

    if (!initRes.ok || !initJson.status) {
      console.error("Paystack init error:", initJson);
      return NextResponse.json(
        { error: "Failed to initialize Paystack transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorization_url: initJson.data.authorization_url,
      reference: initJson.data.reference,
    });
  } catch (err: any) {
    console.error("Paystack init route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
