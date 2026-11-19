import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import FreeResourcesClient from "./FreeResourcesClient";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  duration_weeks: number | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
};

export default async function FreeResourcesPage(
  props: {
    searchParams: Promise<{
      q?: string;
      level?: string;
      type?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const q = (searchParams.q || "").trim();
  const levelFilter = (searchParams.level || "").trim();
  const typeFilter = (searchParams.type || "").trim();

  let query = supabase
    .from("courses")
    .select(
      "id, title, short_description, full_description, category, level, course_type, duration_weeks, price, is_free, status"
    )
    .eq("status", "published")
    .eq("is_free", true)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%`
    );
  }
  if (levelFilter) {
    query = query.eq("level", levelFilter);
  }
  if (typeFilter) {
    query = query.eq("course_type", typeFilter);
  }

  const { data: courses, error } = await query;
  if (error) {
    console.error("Error loading free resources:", error);
  }

  return <FreeResourcesClient initialCourses={courses || []} searchParams={{ q, level: levelFilter, type: typeFilter }} />;
}