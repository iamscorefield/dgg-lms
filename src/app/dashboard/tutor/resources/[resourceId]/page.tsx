import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

type ModuleRow = {
  id: string;
  title: string | null;
  summary: string | null;
  sort_order: number | null;
  items: {
    id: string;
    item_type: string;
    title: string;
    file_url: string | null;
  }[];
};

async function createModule(formData: FormData) {
  "use server";

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const resourceId = String(formData.get("resource_id") || "");
  const title = String(formData.get("module_title") || "").trim();
  const summary = String(formData.get("module_summary") || "").trim();

  if (!resourceId || !title) {
    return;
  }

  // Optional: compute sort_order as last + 1
  const { data: existing } = await supabase
    .from("tutor_resource_modules")
    .select("sort_order")
    .eq("resource_id", resourceId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 && existing[0].sort_order !== null
      ? (existing[0].sort_order as number) + 1
      : 1;

  await supabase.from("tutor_resource_modules").insert({
    resource_id: resourceId,
    title,
    summary: summary || null,
    sort_order: nextOrder,
  });

  redirect(`/dashboard/tutor/resources/${resourceId}`);
}

async function createItem(formData: FormData) {
  "use server";

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const resourceId = String(formData.get("resource_id") || "");
  const moduleId = String(formData.get("module_id") || "");
  const itemType = String(formData.get("item_type") || "").trim();
  const title = String(formData.get("item_title") || "").trim();
  const content = String(formData.get("item_content") || "").trim();
  const fileUrl = String(formData.get("item_file_url") || "").trim();

  if (!resourceId || !moduleId || !itemType || !title) {
    return;
  }

  // Optional: compute sort_order as last + 1
  const { data: existing } = await supabase
    .from("tutor_resource_items")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder =
    existing && existing.length > 0 && existing[0].sort_order !== null
      ? (existing[0].sort_order as number) + 1
      : 1;

  await supabase.from("tutor_resource_items").insert({
    module_id: moduleId,
    item_type: itemType,
    title,
    content: content || null,
    file_url: fileUrl || null,
    sort_order: nextOrder,
  });

  redirect(`/dashboard/tutor/resources/${resourceId}`);
}

export default async function TutorResourceDetailPage(
  props: { params: Promise<{ resourceId: string }> }
) {
  const { resourceId } = await props.params;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: resource, error: resourceError } = await supabase
    .from("tutor_resources")
    .select("id, title, content, video_url, created_at")
    .eq("id", resourceId)
    .eq("tutor_id", session.user.id)
    .maybeSingle();

  if (resourceError || !resource) {
    redirect("/dashboard/tutor/resources");
  }

  const { data: modulesData, error: modulesError } = await supabase
    .from("tutor_resource_modules")
    .select(
      `
      id,
      title,
      summary,
      sort_order,
      tutor_resource_items (
        id,
        item_type,
        title,
        file_url,
        sort_order
      )
    `
    )
    .eq("resource_id", resourceId)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    console.error("Error loading tutor resource modules:", modulesError);
  }

  const modules: ModuleRow[] = (modulesData || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    summary: m.summary,
    sort_order: m.sort_order,
    items:
      (m.tutor_resource_items || []).map((it: any) => ({
        id: it.id,
        item_type: it.item_type,
        title: it.title,
        file_url: it.file_url,
      })) ?? [],
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#f2b42c] uppercase tracking-wide mb-1">
                Teaching Resource
              </p>
              <h1 className="text-2xl font-bold text-[#512d7c]">
                {resource.title}
              </h1>
              <p className="text-[11px] text-gray-500 mt-1">
                Created on{" "}
                {new Date(resource.created_at).toLocaleDateString()}
              </p>
            </div>
            <a
              href="/dashboard/tutor/resources"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              ← Back to resources
            </a>
          </div>

          {/* Resource overview */}
          <section className="bg-white rounded-2xl shadow p-6 space-y-3 border border-gray-100">
            {resource.content && (
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {resource.content}
              </p>
            )}
            {resource.video_url && (
              <a
                href={resource.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f2b42c] hover:underline"
              >
                Open main link / video →
              </a>
            )}
          </section>

          {/* Create new module */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-sm font-bold text-[#512d7c] mb-4">
              Add Module
            </h2>
            <form action={createModule} className="space-y-3">
              <input type="hidden" name="resource_id" value={resource.id} />
              <input
                name="module_title"
                type="text"
                placeholder="Module title (e.g. Week 1: HTML Basics)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
              <textarea
                name="module_summary"
                placeholder="Short summary of what this module covers..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#512d7c] text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-[#3f2361]"
              >
                Save Module
              </button>
            </form>
          </section>

          {/* Modules and items */}
          <section className="space-y-4">
            {modules.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
                <p className="text-sm text-gray-700">
                  No modules yet. Create a module above, then you can add
                  lessons, PDFs or links under it.
                </p>
              </div>
            ) : (
              modules.map((m, index) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl shadow p-5 border border-gray-100 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-1">
                        Module {m.sort_order ?? index + 1}
                      </p>
                      <h3 className="text-sm font-semibold text-[#512d7c]">
                        {m.title || `Module ${index + 1}`}
                      </h3>
                      {m.summary && (
                        <p className="text-xs text-gray-600 mt-1">
                          {m.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {m.items.length === 0 ? (
                      <p className="text-[11px] text-gray-500">
                        No items yet. Add lessons, PDFs or links using the
                        form below.
                      </p>
                    ) : (
                      m.items.map((it) => (
                        <a
                          key={it.id}
                          href={`/dashboard/tutor/resources/${resource.id}/${m.id}/${it.id}`}
                          className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:border-[#f2b42c] hover:bg-yellow-50/40 transition text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-50 text-[10px] font-semibold text-[#512d7c] uppercase">
                              {it.item_type.slice(0, 1)}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {it.title}
                            </span>
                          </div>
                          {it.file_url && (
                            <span className="text-[10px] text-gray-500 truncate max-w-[160px]">
                              {it.file_url}
                            </span>
                          )}
                        </a>
                      ))
                    )}
                  </div>

                  {/* Add item form */}
                  <form action={createItem} className="mt-4 space-y-2">
                    <input type="hidden" name="resource_id" value={resource.id} />
                    <input type="hidden" name="module_id" value={m.id} />
                    <div className="flex flex-wrap gap-2">
                      <select
                        name="item_type"
                        className="w-full sm:w-32 rounded-full border border-gray-300 px-3 py-2 text-[11px] bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                        defaultValue="lesson"
                      >
                        <option value="lesson">Lesson</option>
                        <option value="pdf">PDF</option>
                        <option value="link">Link</option>
                        <option value="video">Video</option>
                      </select>
                      <input
                        name="item_title"
                        type="text"
                        placeholder="Item title (e.g. Lesson 1: Intro)"
                        className="flex-1 min-w-[160px] px-3 py-2 border border-gray-300 rounded-full text-[11px] text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
                      />
                    </div>
                    <textarea
                      name="item_content"
                      placeholder="Notes / lesson body (optional for PDF or link items)"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
                    />
                    <input
                      name="item_file_url"
                      type="text"
                      placeholder="Optional link (PDF URL, external article, video, etc.)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-full text-[11px] text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
                    />
                    <button
                      type="submit"
                      className="mt-1 px-4 py-2 bg-[#512d7c] text-white text-[11px] font-semibold rounded-full hover:bg-[#3f2361]"
                    >
                      Add Item
                    </button>
                  </form>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
