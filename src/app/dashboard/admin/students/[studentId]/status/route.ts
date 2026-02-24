import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

type RouteParams = {
  studentId: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  const params = await context.params;
  const { studentId } = params;

  const supabase = await createServer();

  const body = await request.json();
  const { new_status } = body as { new_status: string };

  if (!new_status) {
    return NextResponse.json(
      { error: "Missing new_status" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("students")
    .update({ status: new_status })
    .eq("id", studentId);

  if (error) {
    console.error("Error updating student status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
