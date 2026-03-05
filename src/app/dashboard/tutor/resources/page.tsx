import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

async function createTutorResource(formData: FormData) {
  "use server";

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const videoUrl = String(formData.get("video_url") || "").trim();
  const pdfUrl = String(formData.get("pdf_url") || "").trim();

  if (!title) {
    return;
  }

  await supabase.from("tutor_resources").insert({
    tutor_id: session.user.id,
    title,
    content,
    video_url: videoUrl || null,
    pdf_url: pdfUrl || null,
  });

  redirect("/dashboard/tutor/resources");
}

export default async function TutorResourcesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: resources, error } = await supabase
    .from("tutor_resources")
    .select("id, title, content, video_url, pdf_url, created_at")
    .eq("tutor_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading tutor resources:", error);
  }

  const hasResources = resources && resources.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Teaching Resources
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Create and manage lesson notes, reference links, videos and PDFs you
          use with your students.
        </p>

        {/* Create new resource */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h2 className="text-lg font-bold text-[#512d7c] mb-4">
            Create New Resource
          </h2>
          <form action={createTutorResource} className="space-y-4">
            <input
              name="title"
              type="text"
              placeholder="Resource title (e.g. HTML Basics Lesson 1)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
            <textarea
              name="content"
              placeholder="Description or lesson notes..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                name="video_url"
                type="text"
                placeholder="Main video link (YouTube, Loom, etc.)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
              <input
                name="pdf_url"
                type="text"
                placeholder="Main PDF / document link"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#512d7c] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-[#3f2361]"
            >
              Save Resource
            </button>
          </form>
        </div>

        {/* Existing resources */}
        {!hasResources ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You haven’t created any teaching resources yet. Start by adding
              your first lesson outline or reference material above.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {resources!.map((r: any) => (
              <a
                key={r.id}
                href={`/dashboard/tutor/resources/${r.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2 hover:shadow-md hover:border-[#f2b42c] transition-all"
              >
                <h3 className="text-sm font-semibold text-[#512d7c]">
                  {r.title}
                </h3>
                {r.content && (
                  <p className="text-xs text-gray-700 line-clamp-3">
                    {r.content}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                  {r.video_url && (
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[#512d7c]">
                      Video link
                    </span>
                  )}
                  {r.pdf_url && (
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-[#a36b00]">
                      PDF link
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Created on {new Date(r.created_at).toLocaleDateString()}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#f2b42c]">
                  Open & manage modules
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
