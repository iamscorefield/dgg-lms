import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CertificatesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Placeholder: later you can fetch from a certificates table
  const certificates: any[] = [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Certificates &amp; Badges
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Track the programs you’ve completed and the skills you’ve earned
          along the way. Certificates and skill badges appear here once you
          finish eligible courses.
        </p>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-sm text-gray-700">
              You don’t have any certificates yet. Complete a course to unlock
              your first certificate and badge.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* map certificates here later */}
          </div>
        )}
      </div>
    </div>
  );
}
