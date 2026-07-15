import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with private server-side environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Use Service Role Key for secure admin bypass, or Anon Key if RLS handles it
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, fullName, trackName, courseScope, completionDate } = body;

    if (!id || !fullName || !trackName) {
      return NextResponse.json(
        { error: "Validation Fault: Missing required fields." },
        { status: 400 }
      );
    }

    // Insert directly into the secure public.admin_ledgers table
    const { error } = await supabase
      .from("admin_ledgers")
      .insert([
        {
          id: id,
          full_name: fullName,
          track_name: trackName,
          course_scope: courseScope,
          completion_date: completionDate,
          verification_status: "verified",
        },
      ]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API route crash:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}