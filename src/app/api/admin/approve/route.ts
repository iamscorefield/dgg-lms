// src/app/api/admin/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase-server"; // adjust path

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    // TODO: your real Supabase code
    // const supabase = createClient();
    // const { error } = await supabase
    //   .from("requests") // change to your table
    //   .update({ status: "approved" })
    //   .eq("id", requestId);
    //
    // if (error) {
    //   return NextResponse.json({ error: error.message }, { status: 500 });
    // }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
