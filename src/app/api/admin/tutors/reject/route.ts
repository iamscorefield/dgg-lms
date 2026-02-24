// src/app/api/admin/tutors/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "applicationId is required" },
        { status: 400 }
      );
    }

    const supabase = await createServer();

    const { error } = await supabase
      .from("tutor_applications")
      .update({ status: "rejected" })
      .eq("id", applicationId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
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
