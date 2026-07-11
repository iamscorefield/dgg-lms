"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import { BookOpen, Layers, CheckCircle2, Clock } from "lucide-react";

interface DbCourse {
  id: string;
  title: string;
  price: number;
  course_type: "prep" | "main";
}

export default function InProgressPage() {
  const supabase = createBrowser();
  const [loading, setLoading] = useState(true);
  const [prepCourses, setPrepCourses] = useState<any[]>([]);
  const [mainCourses, setMainCourses] = useState<any[]>([]);

  useEffect(() => {
    async function syncProgressDashboard() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // 1. Fetch all live courses from your database catalog
        const { data: dbCourses, error: coursesErr } = await supabase
          .from("courses")
          .select("id, title, price, course_type");
        if (coursesErr) throw coursesErr;

        // 2. Fetch Premium Master Track Enrollments Progress
        const { data: premiumProgress } = await supabase
          .from("user_enrollments")
          .select("course_id, status, progress_map")
          .eq("user_id", session.user.id);

        // 3. Fetch Foundational Lesson/Module Slider Progress
        const { data: lessonProgress } = await supabase
          .from("user_module_progress")
          .select("module_id, lessons_completed, current_lesson_index")
          .eq("user_id", session.user.id);

        // 4. Map progress records into quick lookup dictionaries
        const premiumLookup: Record<string, any> = {};
        premiumProgress?.forEach(item => {
          premiumLookup[item.course_id] = item;
        });

        const lessonLookup: Record<string, any> = {};
        lessonProgress?.forEach(item => {
          lessonLookup[item.module_id] = item;
        });

        const parsedPrepList: any[] = [];
        const parsedMainList: any[] = [];

        if (dbCourses) {
          dbCourses.forEach((course: DbCourse) => {
            const isPrepTrack = course.course_type === "prep";

            if (isPrepTrack) {
              const tracking = lessonLookup[course.id];
              const calculatedPct = tracking?.lessons_completed ? 100 : Math.min((tracking?.current_lesson_index || 0) * 20, 100);
              
              parsedPrepList.push({
                id: course.id,
                title: course.title,
                status: tracking?.lessons_completed ? "completed" : tracking ? "in_progress" : "not_started",
                pct: calculatedPct
              });
            } else {
              const tracking = premiumLookup[course.id];
              if (tracking) {
                parsedMainList.push({
                  id: course.id,
                  title: course.title,
                  status: tracking.status,
                  pct: tracking.progress_map?.completed_percentage ?? 0
                });
              }
            }
          });
        }

        setPrepCourses(parsedPrepList);
        setMainCourses(parsedMainList);

      } catch (err) {
        console.error("Progress engine aggregation fault:", err);
      } finally {
        setLoading(false);
      }
    }

    syncProgressDashboard();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#faf9fc]">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-10 font-mono text-xs uppercase tracking-widest text-[#512d7c] animate-pulse text-left">
          Synchronizing dynamic progress matrix channels...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf9fc] text-slate-800 font-sans antialiased">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 space-y-8 text-left">
        <div>
          <h1 className="text-3xl font-black text-[#512d7c] tracking-tight uppercase">Live Learning Ledger</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
            Real-time visual monitoring matching unified database status tracking parameters.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* DYNAMIC FOUNDATIONAL TRACK CONTAINER */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Layers size={16} className="text-[#512d7c]" /> Foundational Program Track ({prepCourses.length} Total)
            </h2>

            {prepCourses.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 italic py-4">No active introductory tracks initialized on the server config matrix.</p>
            ) : (
              <div className="space-y-4">
                {prepCourses.map((course) => {
                  const isDone = course.status === "completed";
                  const isStarted = course.status === "in_progress";

                  return (
                    <div key={course.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-slate-800">{course.title}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          {isDone ? (
                            <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={11} /> Completed</span>
                          ) : isStarted ? (
                            <span className="text-[#512d7c] flex items-center gap-1"><Clock size={11} /> Active</span>
                          ) : (
                            <span className="text-slate-400">Not Started</span>
                          )}
                        </p>
                      </div>

                      <div className="w-full sm:w-48 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 font-mono">
                          <span>PROGRESS</span>
                          <span className="text-[#512d7c]">{course.pct}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-[#512d7c]'}`} 
                            style={{ width: `${course.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DYNAMIC PREMIUM CORE TRACKS CONTAINER */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <BookOpen size={16} className="text-[#512d7c]" /> Premium Core Tracks
            </h2>

            {mainCourses.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs font-semibold text-slate-400 leading-normal">No advanced premium paths activated yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mainCourses.map((course) => (
                  <div key={course.id} className="p-4 border border-slate-100 rounded-2xl space-y-3 bg-white shadow-3xs">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight line-clamp-2">{course.title}</h3>
                      <span className="text-[8px] font-mono font-black text-white bg-[#512d7c] px-1.5 py-0.5 rounded shrink-0">CORE</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f2b42c]" style={{ width: `${course.pct}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 block text-right font-mono">{course.pct}% COMPLETE</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}