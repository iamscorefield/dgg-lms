// src/app/api/admin/tutors/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { applicationId, userId } = await req.json();

    if (!applicationId || !userId) {
      return NextResponse.json(
        { error: "applicationId and userId are required" },
        { status: 400 }
      );
    }

    const supabase = await createServer();

    // 1) Mark application approved
    const { error: appError } = await supabase
      .from("tutor_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);

    if (appError) {
      return NextResponse.json(
        { error: appError.message },
        { status: 500 }
      );
    }

    // 2) Update user role in profiles to 'tutor'
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "tutor" })
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
