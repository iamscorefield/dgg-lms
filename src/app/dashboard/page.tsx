// app/dashboard/page.tsx
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createServer();

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

  const authUserId = session.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", authUserId)
    .maybeSingle();

  if (profileError) {
    console.error("Error loading profile for dashboard:", profileError);
  }

  const role = profile?.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  }

  if (role === "student") {
    redirect("/dashboard/student");
  }

  if (role === "pending_tutor") {
    redirect("/pending-approval");
  }

  console.warn(
    "Dashboard fallback: missing profile or unknown role, sending to /dashboard/student for user id",
    authUserId,
    "role:",
    role ?? "none"
  );
  redirect("/dashboard/student");
}
