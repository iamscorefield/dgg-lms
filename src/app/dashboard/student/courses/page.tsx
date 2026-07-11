import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers, GraduationCap, Search, ArrowRight, Play, CheckCircle2, Bookmark } from "lucide-react";

export default async function StudentCoursesPage() {
  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 1. Fetch Premium Core Paid Enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", session.user.id)
    .eq("payment_status", "paid");

  // 2. Fetch Real-time Progress Matrix Weights
  const { data: userProgress } = await supabase
    .from("user_enrollments")
    .select("course_id, status, progress_map")
    .eq("user_id", session.user.id);

  // Map progress values into an optimized indexing lookup dictionary object
  const trackingMap: Record<string, { status: string; pct: number }> = {};
  if (userProgress) {
    userProgress.forEach((item) => {
      trackingMap[item.course_id] = {
        status: item.status,
        pct: item.progress_map?.completed_percentage ?? 0,
      };
    });
  }

  return (
    <div className="flex min-h-screen bg-[#faf9fc] font-sans selection:bg-[#512d7c]/10 text-slate-800 antialiased">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 text-left space-y-8 overflow-hidden">
        
        {/* Modern Top Header Row Navigation Accent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight uppercase">
              My Learning Path
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
              Review active workspace access portals, inspect current course progress variables, and track completions.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white border border-slate-200/80 px-4 py-2 rounded-2xl shadow-3xs w-fit">
            <GraduationCap size={14} className="text-[#512d7c]" /> Active Modules: {(enrollments?.length || 0)}
          </div>
        </div>

        {/* Course Presentation Stream Layout Panel */}
        {(!enrollments || enrollments.length === 0) ? (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[2rem] p-8 text-center space-y-5 shadow-2xs">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#512d7c] mx-auto">
              <Bookmark size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">No Active Tracks Found</h3>
              <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-sm mx-auto">
                You are not enrolled in any paid core modules yet. Visit our main digital catalog to unlock advanced full-stack systems.
              </p>
            </div>
            <a
              href="/dashboard/courses"
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#512d7c] hover:bg-[#3f2160] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border-0 shadow-3xs cursor-pointer"
            >
              Browse Course Catalog <ArrowRight size={13} />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full">
            {enrollments.map((enrollment: any) => {
              const targetCourse = enrollment.courses;
              if (!targetCourse) return null;

              const progressState = trackingMap[targetCourse.id] || { status: "not_started", pct: 0 };
              const isDone = progressState.status === "completed";

              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-[2rem] border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between text-left group overflow-hidden relative"
                >
                  {/* Decorative Background Accent Mesh */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-50/20 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="p-6 space-y-4">
                    {/* Badge Meta Flags Header Row */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] font-mono font-black text-white bg-[#512d7c] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-3xs">
                        {targetCourse.type ? targetCourse.type.replace("_", " ") : "Core Module"}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        {isDone ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black font-mono uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 size={10} /> Passed
                          </span>
                        ) : (
                          <span className="text-[9px] font-black font-mono uppercase text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course Summary Presentation Section */}
                    <div className="space-y-1.5">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#512d7c] transition-colors line-clamp-2">
                        {targetCourse.title}
                      </h2>
                      {targetCourse.description && (
                        <p className="text-xs font-medium text-slate-400 line-clamp-2 leading-relaxed">
                          {targetCourse.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Parameter Level Array Strings */}
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400/80 flex items-center gap-2">
                      <span>Tier: {targetCourse.level || "All Levels"}</span>
                      <span>•</span>
                      <span>ID: #{targetCourse.id}</span>
                    </div>
                  </div>

                  {/* Operational Bottom Metrics & Progress Control Panel */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black font-mono text-slate-400">
                        <span>COMPLETION RATIO</span>
                        <span className="text-[#512d7c]">{progressState.pct}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#f2b42c] h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressState.pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Fluid Action Deep Route Anchor Navigation Button Link */}
                    <Link 
                      href={`/dashboard/learning/${targetCourse.id}`}
                      className="w-full py-3 bg-[#512d7c] hover:bg-[#3f2160] text-white text-center font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-3xs cursor-pointer border-0 flex items-center justify-center gap-2 group-hover:gap-3"
                    >
                      <span>{progressState.pct > 0 ? "Resume Module Track" : "Launch Core Track"}</span>
                      <Play size={12} className="fill-white shrink-0" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}