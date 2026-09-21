import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with the Service Role Key to bypass Row-Level Security (RLS) on backend admin actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      fullName,
      trackName,
      courseScope,
      completionDate,
      averageScore,
      attendanceRate,
      weeklyBreakdown,
      disciplineComment,
      teamworkComment,
      hostComment,
      ceoComment,
      verificationStatus
    } = body;

    // Validate required fields matching exact frontend payload
    if (!id || !fullName || !trackName) {
      return NextResponse.json(
        { error: "Missing required identifier, name, or track name parameters." },
        { status: 400 }
      );
    }

    // Insert directly into the admin_ledgers table mapping camelCase to your exact snake_case DB columns
    const { error } = await supabaseAdmin.from("admin_ledgers").insert([
      {
        id: id,
        full_name: fullName,
        track_name: trackName,
        course_scope: courseScope,
        completion_date: completionDate,
        average_score: averageScore ? parseFloat(averageScore) : null,
        attendance_rate: attendanceRate ? parseFloat(attendanceRate) : null,
        weekly_breakdown: weeklyBreakdown,
        discipline_comment: disciplineComment,
        teamwork_comment: teamworkComment,
        host_comment: hostComment,
        ceo_comment: ceoComment,
        verification_status: verificationStatus || "verified",
      },
    ]);

    if (error) {
      console.error("Supabase Insertion Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Record deployed successfully!" });
  } catch (err: any) {
    console.error("Server API Exception:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}