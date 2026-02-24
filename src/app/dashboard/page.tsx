// app/dashboard/page.tsx
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createServer();

  // 1) Get session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Dashboard session error:", sessionError);
  }

  if (!session) {
    redirect("/login");
  }

  // Debug: log current auth user id
  console.log("DASHBOARD AUTH USER ID:", session.user.id);

  // 2) Get this user's profile + role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error loading profile for dashboard:", profileError);
  }

  console.log("DASHBOARD PROFILE RESULT:", profile);

  // 3) Route by exact role if we have one
  const role = profile?.role;

  if (role === "pending_tutor") {
    redirect("/pending-approval");
  }

  if (role === "student") {
    redirect("/dashboard/student");
  }

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  }

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  // 4) Fallback: if profile missing or role unknown, send to student dashboard
  console.warn(
    "Dashboard fallback: missing profile or unknown role, sending to /dashboard/student for user id",
    session.user.id,
    "role:",
    role ?? "none"
  );
  redirect("/dashboard/student");
}
