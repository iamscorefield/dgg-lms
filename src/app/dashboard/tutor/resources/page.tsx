import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorResourcesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Later: fetch from tutor_resources table filtered by tutor_id
  const resources: any[] = [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Teaching Resources
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Create and manage lesson notes, reference links, and videos you use with your students.
        </p>

        {/* Create new resource (UI only for now) */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-lg font-bold text-[#512d7c] mb-4">
            Create New Resource
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Resource title (e.g. HTML Basics Lesson 1)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
            <textarea
              placeholder="Description or lesson notes..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
            <input
              type="text"
              placeholder="Optional video URL (YouTube, Loom, etc.)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
            <button className="px-6 py-2 bg-[#512d7c] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-[#3f2361]">
              Save Resource (coming soon)
            </button>
          </div>
        </div>

        {/* Existing resources */}
        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You haven’t created any teaching resources yet. Start by adding your
              first lesson outline or reference material above.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Later: map resources here */}
          </div>
        )}
      </div>
    </div>
  );
}
