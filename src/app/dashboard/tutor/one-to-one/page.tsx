import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorOneToOnePage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Example: future sessions from a sessions table (placeholder)
  const sessions: any[] = [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          1‑to‑1 Sessions
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Plan and review one-to-one sessions with your assigned students.
        </p>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700 mb-4">
              You don’t have any scheduled sessions yet.
            </p>
            <button className="px-4 py-2 bg-[#512d7c] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-[#3f2361]">
              Create Session (coming soon)
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6">
            {/* Later: list upcoming and past sessions here */}
          </div>
        )}
      </div>
    </div>
  );
}
