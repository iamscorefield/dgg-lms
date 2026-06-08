import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link"; // 🔥 IMPORTED LINK FOR CLEAN NAVIGATION

export default async function StudentCoursesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", session.user.id)
    .eq("payment_status", "paid");

  return (
    // 🔥 FIXED: Standardized background layer to pure white
    <div className="flex min-h-screen bg-white font-sans selection:bg-[#512d7c]/10 text-slate-800">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-black text-[#512d7c] mb-2 uppercase tracking-tight">
          My Courses
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-400 mb-8 leading-relaxed">
          All the courses you’re currently enrolled in, with quick access to continue learning.
        </p>

        {(!enrollments || enrollments.length === 0) ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6 text-left max-w-md">
            <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
              You’re not enrolled in any course yet. Visit{" "}
              <a
                href="/dashboard/courses"
                className="text-[#f2b42c] font-black hover:underline"
              >
                Browse Courses
              </a>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#512d7c] mb-2 uppercase tracking-wide group-hover:text-amber-600 transition-colors">
                    {enrollment.courses.title}
                  </h2>
                  <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                    {enrollment.courses.description}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-5">
                    {enrollment.courses.type?.replace("_", " ")} •{" "}
                    {enrollment.courses.level || "All levels"}
                  </p>

                  <div className="mb-6 bg-slate-50 border border-slate-200/50 p-3 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Progress Parameter</p>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5">
                      <div
                        className="bg-[#f2b42c] h-1.5 rounded-full transition-all"
                        style={{ width: "30%" }} // placeholder data
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">30% complete</p>
                  </div>
                </div>

                {/* 🔥 FIXED ROUTING ACTION: Now points directly to your learning module page using the enrollment course ID pointer */}
                <Link 
                  href={`/dashboard/learning?courseId=${enrollment.courses.id}`}
                  className="w-full py-3 bg-[#512d7c] hover:bg-[#3f2361] text-white text-center font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-3xs decoration-none block"
                >
                  Continue Course
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}