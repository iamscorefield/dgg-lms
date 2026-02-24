// src/app/dashboard/admin/tutors/[tutorId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: { tutorId: string } }
) {
  const supabase = await createServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const formData = await req.formData();
  const status = formData.get("status") as
    | "active"
    | "disabled"
    | "under_review"
    | null;
  const returnTo =
    (formData.get("returnTo") as string) || "/dashboard/admin/tutors";

  if (!status) {
    return NextResponse.redirect(new URL(returnTo, req.url));
  }

  await supabase
    .from("profiles")
    .update({ status })
    .eq("id", params.tutorId);

  return NextResponse.redirect(new URL(returnTo, req.url));
}
