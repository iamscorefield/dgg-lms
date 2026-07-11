import Sidebar from "@/components/Sidebar";
import ChatPopup from "@/components/ChatPopup";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { BookOpen, Layers, Award, Clock, Search, ArrowRight, Sparkles, GraduationCap, CheckCircle2 } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const studentId = session.user.id;

  // 1. Load Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", studentId)
    .single();

  // 2. Fetch Premium Core Paid Enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", studentId)
    .eq("payment_status", "paid");

  // 3. Fetch Real-time Progress Map Matrix for calculations
  const { data: userProgress } = await supabase
    .from("user_enrollments")
    .select("course_id, status, progress_map")
    .eq("user_id", studentId);

  // Map progress markers using an index object dictionary for O(1) page checks
  const trackingMap: Record<string, { status: string; pct: number }> = {};
  let completedCount = 0;
  let prepCompleted = 0;

  if (userProgress) {
    userProgress.forEach((item) => {
      const percentage = item.progress_map?.completed_percentage ?? 0;
      trackingMap[item.course_id] = {
        status: item.status,
        pct: percentage,
      };
      if (item.status === "completed") {
        completedCount++;
        if (item.course_id.startsWith("prep-")) {
          prepCompleted++;
        }
      }
    });
  }

  // Earned certs calculation: 1 if all 8 prep modules are done, plus any completed paid main modules
  const earnedCertificatesCount = (prepCompleted === 8 ? 1 : 0) + 
    (enrollments?.filter(e => trackingMap[e.courses?.id]?.status === "completed").length || 0);

  return (
    <div className="flex min-h-screen bg-[#faf9fc] text-slate-800 font-sans antialiased selection:bg-[#512d7c]/10">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 text-left space-y-8 overflow-hidden">
        
        {/* Top Navigation Row Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#512d7c] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search your courses database..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all shadow-2xs"
            />
          </div>
          
          <div className="text-[11px] font-black font-mono uppercase text-slate-400 tracking-wider bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/40 w-fit self-end md:self-auto">
            Operational Node Hub: 2026
          </div>
        </div>

        {/* Welcome Hero Component */}
        <div className="relative bg-gradient-to-br from-[#512d7c] to-[#391e60] rounded-[2.5rem] p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-sm">
          <div className="absolute right-[-5%] top-[-20%] text-white/[0.03] pointer-events-none -rotate-12"><GraduationCap size={360} /></div>
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/10 text-[#f2b42c] px-3 py-1 rounded-md border border-white/10">
              <Sparkles size={12} /> Inspired By Growth
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight pt-1">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}!
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 font-medium max-w-xl leading-relaxed pt-1">
              Track your active program workflows, check verified assessment weight configurations, and process your certification streams cleanly.
            </p>
          </div>
        </div>

        {/* Advanced Analytical Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-[#512d7c] rounded-2xl"><BookOpen size={20} /></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Enrolled Tracks</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{enrollments?.length || 0}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 size={20} /></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Completed</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{completedCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-[#f2b42c] rounded-2xl"><Award size={20} /></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Certificates</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">{earnedCertificatesCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Clock size={20} /></div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Active In-Progress</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">
                {(enrollments?.length || 0) + (userProgress?.filter(p => p.status === "in_progress").length || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Division Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          
          {/* LEFT COLUMN: PREMIUM ENROLLED COURSES FEED */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-[#512d7c]" /> Your Premium Training Tracks
              </h2>
              <span className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200/80 px-2.5 py-1 rounded-xl shadow-3xs">
                Paid Core Modules
              </span>
            </div>

            {enrollments?.length === 0 ? (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-8 text-center space-y-4">
                <p className="text-sm font-medium text-slate-500">
                  No core premium training tracks mapped onto your profile yet.
                </p>
                <a
                  href="/dashboard/courses"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#512d7c] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-[#3f2160] transition border-0 cursor-pointer"
                >
                  Browse Academy Tracks <ArrowRight size={12} />
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {enrollments?.map((enrollment: any) => {
                  const courseIdKey = enrollment.courses?.id;
                  const progressState = trackingMap[courseIdKey] || { status: "not_started", pct: 0 };
                  
                  return (
                    <div
                      key={enrollment.id}
                      className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between min-h-[260px]"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-black text-white bg-[#512d7c] px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {enrollment.courses?.type ? enrollment.courses.type.replace("_", " ") : "Core Module"}
                          </span>
                          <span className={`text-[9px] font-black font-mono uppercase ${
                            progressState.status === "completed" ? "text-emerald-600" : "text-amber-500"
                          }`}>
                            {progressState.status.replace("_", " ")}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                          {enrollment.courses?.title}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 font-mono">
                            <span>COMPLETION WEIGHT</span>
                            <span>{progressState.pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#f2b42c] h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressState.pct}%` }}
                            />
                          </div>
                        </div>

                        <a
                          href={`/dashboard/learning/${enrollment.courses?.id}`}
                          className="block w-full py-2.5 text-center bg-[#512d7c] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#3f2160] transition-all border-0 shadow-3xs cursor-pointer"
                        >
                          {progressState.pct > 0 ? "Resume Learning" : "Launch Course Workspace"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: FOUNDATION COMPACT HERO BANNER */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-[#f2b42c]" /> Foundation Node Kit
            </h2>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs text-left space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2b42c]/5 rounded-bl-full pointer-events-none" />
              <div className="space-y-2">
                <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase font-mono tracking-wider bg-amber-50 text-[#f2b42c] border border-amber-200 rounded-md">
                  8 Courses Pack Bundle (Free Access Tier)
                </span>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Are you a Newbie?</h3>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Explore our foundational preparation sequence designed to help newcomers calibrate technical logic mappings before starting premium paths. Includes digital literacy, programming logic, server setups, and more.
                </p>
              </div>

              <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100/50 flex justify-between items-center text-[11px] font-bold text-slate-500 font-mono">
                <span>Completed Sequence Node Tracks:</span>
                <span className="text-[#512d7c] font-black text-sm">{prepCompleted}/8</span>
              </div>

              <a
                href="/dashboard/precourse"
                className="inline-flex w-full items-center justify-center gap-1.5 py-3 bg-[#f2b42c] hover:bg-[#d9a123] text-black text-xs font-black uppercase tracking-widest rounded-xl transition border-0 shadow-2xs cursor-pointer"
              >
                Access Prep Portal <ArrowRight size={13} />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Global Real-time Messaging Interface Popup Toggle */}
      <ChatPopup currentUserId={studentId} role="student" courseId="GENERAL" />
    </div>
  );
}