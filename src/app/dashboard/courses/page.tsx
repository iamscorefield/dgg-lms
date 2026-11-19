import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import CoursesClient from "./CoursesClient";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
};

export default async function StudentCoursesPage(
  props: {
    searchParams?: Promise<{
      q?: string;
      level?: string;
      type?: string;
      price?: string;
    }>;
  }
) {
  const searchParams = (await props.searchParams) || {};
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
  const priceFilter = (searchParams.price || "").trim();

  let query = supabase
    .from("courses")
    .select(
      "id, title, short_description, full_description, category, level, course_type, price, is_free, status"
    )
    .eq("status", "published")
    .eq("is_free", false)
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

  if (priceFilter === "50-100") {
    query = query.gte("price", 50000).lte("price", 100000);
  } else if (priceFilter === "100-200") {
    query = query.gte("price", 100000).lte("price", 200000);
  } else if (priceFilter === "200-400") {
    query = query.gte("price", 200000).lte("price", 400000);
  }

  const { data: rawCourses, error } = await query;

  if (error) {
    console.error("Error loading student courses:", error);
  }

  // Filter out prep and business courses so only main catalog courses appear here
  const courses = (rawCourses || []).filter((course: any) => {
    const cType = (course.course_type || "").toLowerCase();
    return (
      cType !== "precourse" &&
      cType !== "prep_course" &&
      cType !== "prep" &&
      cType !== "business" &&
      cType !== "business_track"
    );
  });

  return (
    <CoursesClient
      initialCourses={courses}
      searchParams={{ q, level: levelFilter, type: typeFilter, price: priceFilter }}
    />
  );
}