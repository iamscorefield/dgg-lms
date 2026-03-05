import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

type ItemRow = {
  id: string;
  item_type: string;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
  module: {
    id: string;
    title: string | null;
  } | null;
  resource: {
    id: string;
    title: string | null;
  } | null;
};

export default async function TutorResourceItemPage(
  props: { params: Promise<{ resourceId: string; moduleId: string; itemId: string }> }
) {
  const { resourceId, moduleId, itemId } = await props.params;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Load the item and ensure it belongs to this tutor's resource
  const { data: itemData, error } = await supabase
    .from("tutor_resource_items")
    .select(
      `
      id,
      item_type,
      title,
      content,
      file_url,
      created_at,
      module:tutor_resource_modules (
        id,
        title,
        resource_id,
        resource:tutor_resources (
          id,
          title,
          tutor_id
        )
      )
    `
    )
    .eq("id", itemId)
    .maybeSingle();

  if (error || !itemData) {
    console.error("Error loading tutor resource item:", error);
    redirect(`/dashboard/tutor/resources/${resourceId}`);
  }

  // Type narrow and access nested resource/tutor_id
  const moduleData = itemData.module as any | null;
  const resourceData = moduleData?.resource as any | null;

  if (!resourceData || resourceData.id !== resourceId || resourceData.tutor_id !== session.user.id) {
    // Item does not belong to this tutor/resource
    redirect("/dashboard/tutor/resources");
  }

  const item: ItemRow = {
    id: itemData.id,
    item_type: itemData.item_type,
    title: itemData.title,
    content: itemData.content,
    file_url: itemData.file_url,
    created_at: itemData.created_at,
    module: moduleData
      ? {
          id: moduleData.id,
          title: moduleData.title,
        }
      : null,
    resource: resourceData
      ? {
          id: resourceData.id,
          title: resourceData.title,
        }
      : null,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex flex-wrap items-center gap-1">
              <a
                href="/dashboard/tutor/resources"
                className="text-[#512d7c] hover:underline"
              >
                Resources
              </a>
              <span>/</span>
              <a
                href={`/dashboard/tutor/resources/${item.resource?.id}`}
                className="text-[#512d7c] hover:underline"
              >
                {item.resource?.title || "Resource"}
              </a>
              <span>/</span>
              <span>{item.module?.title || "Module"}</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
              {item.item_type}
            </span>
          </div>

          {/* Header */}
          <header className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h1 className="text-xl font-bold text-[#512d7c] mb-2">
              {item.title}
            </h1>
            <p className="text-[11px] text-gray-500">
              Part of:{" "}
              <span className="font-semibold">
                {item.module?.title || "Module"}
              </span>{" "}
              •{" "}
              <span className="font-semibold">
                {item.resource?.title || "Resource"}
              </span>
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Created on {new Date(item.created_at).toLocaleDateString()}
            </p>
          </header>

          {/* Content */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
            {item.content ? (
              <div className="text-sm text-gray-800 whitespace-pre-line">
                {item.content}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No written content added for this item yet.
              </p>
            )}

            {item.file_url && (
              <div className="pt-2 border-t border-dashed border-gray-200">
                <p className="text-[11px] text-gray-500 mb-1">
                  Attached link (PDF / article / video):
                </p>
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#f2b42c] hover:underline break-all"
                >
                  Open attachment →
                </a>
              </div>
            )}
          </section>

          {/* Back link */}
          <div className="flex justify-between items-center text-[11px]">
            <a
              href={`/dashboard/tutor/resources/${item.resource?.id}`}
              className="inline-flex items-center gap-1 text-[#512d7c] hover:underline"
            >
              ← Back to modules & items
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
