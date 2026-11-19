import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import CoursesClient from "./CoursesClient";

export type CourseTierOption = {
  tier: "basic" | "standard" | "advance";
  label: string;
  price: number | null;
  unlockedModulesLabel: string;
  unlockedModuleCount: number;
};

export type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  basic_price?: number | null;
  standard_price?: number | null;
  advance_price?: number | null;
  is_free: boolean | null;
  status: string | null;
  module_count?: number;
  outcomes?: string[];
  modules?: { id: number; title: string | null; summary: string | null; sort_order: number | null }[];
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

  function buildCoursesQuery(includeTierPrices: boolean) {
    const columns = includeTierPrices
      ? "id, title, short_description, full_description, category, level, course_type, price, basic_price, standard_price, advance_price, is_free, status"
      : "id, title, short_description, full_description, category, level, course_type, price, is_free, status";

    let query = supabase
      .from("courses")
      .select(columns)
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

    return query;
  }

  let { data: rawCourses, error } = await buildCoursesQuery(true);

  if (error) {
    const fallbackRes = await buildCoursesQuery(false);
    rawCourses = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error) {
    console.error("Error loading student courses:", error);
  }

  // Filter out prep and business courses so only main catalog courses appear here
  const mainCourses = (rawCourses || []).filter((course: any) => {
    const cType = (course.course_type || "").toLowerCase();
    return (
      cType !== "precourse" &&
      cType !== "prep_course" &&
      cType !== "prep" &&
      cType !== "business" &&
      cType !== "business_track"
    );
  });

  const courseIds = mainCourses.map((c: any) => c.id);

  let outcomesByCourse = new Map<number, string[]>();
  let modulesByCourse = new Map<
    number,
    { id: number; title: string | null; summary: string | null; sort_order: number | null }[]
  >();

  if (courseIds.length > 0) {
    const [{ data: outcomesRows }, { data: modulesRows }] = await Promise.all([
      supabase
        .from("course_outcomes")
        .select("course_id, text, sort_order")
        .in("course_id", courseIds)
        .order("sort_order", { ascending: true }),
      supabase
        .from("course_modules")
        .select("id, course_id, title, summary, sort_order")
        .in("course_id", courseIds)
        .order("sort_order", { ascending: true }),
    ]);

    for (const row of outcomesRows || []) {
      const cid = Number((row as any).course_id);
      const text = String((row as any).text || "").trim();
      if (text) {
        const list = outcomesByCourse.get(cid) || [];
        list.push(text);
        outcomesByCourse.set(cid, list);
      }
    }

    for (const row of modulesRows || []) {
      const cid = Number((row as any).course_id);
      const list = modulesByCourse.get(cid) || [];
      list.push({
        id: Number((row as any).id),
        title: (row as any).title ?? null,
        summary: (row as any).summary ?? null,
        sort_order: (row as any).sort_order ?? null,
      });
      modulesByCourse.set(cid, list);
    }
  }

  const enrichedCourses: Course[] = mainCourses.map((course: any) => {
    const cid = Number(course.id);
    const courseModules = modulesByCourse.get(cid) || [];
    return {
      ...course,
      outcomes: outcomesByCourse.get(cid) || [],
      modules: courseModules,
      module_count: courseModules.length,
    };
  });

  return (
    <CoursesClient
      initialCourses={enrichedCourses}
      searchParams={{ q, level: levelFilter, type: typeFilter, price: priceFilter }}
    />
  );
}