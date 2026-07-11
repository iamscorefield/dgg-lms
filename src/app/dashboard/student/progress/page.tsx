import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Clock, BookOpen, CheckCircle, Flame, Calendar, Activity } from "lucide-react";

export default async function StudentProgressPage() {
  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Pull core student paid enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", userId)
    .eq("payment_status", "paid");

  // 2. Fetch all real-time calculated lesson module progression paths
  const { data: progressRows } = await supabase
    .from("user_module_progress")
    .select("*")
    .eq("user_id", userId);

  // 3. Fetch analytics hour engines and operational interaction counters
  const { data: analyticsLog } = await supabase
    .from("student_analytics_logs")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: engagementCounters } = await supabase
    .from("structural_engagement_counters")
    .select("*")
    .eq("user_id", userId);

  // Structural aggregates metrics evaluation
  const totalCourses = enrollments?.length || 0;
  let completedCourses = 0;
  let inProgressCourses = totalCourses;

  // Compile full course-wise data maps
  const detailedCourseProgress = (enrollments || []).map((enrollment: any) => {
    // Safely filter progress items related to this course matching schema identifiers
    const matchingProgress = (progressRows || []).filter(
      (row) => row.course_id && String(row.course_id) === String(enrollment.course_id)
    );

    // Dynamic calculations based on 20 unique completion milestones (Lessons and Assessments across Modules)
    let totalItemsCompleted = 0;
    matchingProgress.forEach((mod) => {
      if (mod.lessons_completed) totalItemsCompleted += 1; 
      if (mod.assessments_completed) totalItemsCompleted += 1;
    });

    // Compute exact completion ratio out of 20 elements base index benchmark
    const calculatedPercentage = Math.min(Math.round((totalItemsCompleted / 20) * 100), 100);
    
    if (calculatedPercentage === 100) {
      completedCourses++;
    }

    // Aggregate click matrices for this specified path from engagement logs
    const courseEngagement = (engagementCounters || []).filter((e) => e.course_id === enrollment.course_id);
    const totalLessonOpenHits = courseEngagement.reduce((sum, curr) => sum + (curr.lesson_open_hits || 0), 0);
    const totalAssessmentOpenHits = courseEngagement.reduce((sum, curr) => sum + (curr.assessment_open_hits || 0), 0);

    return {
      ...enrollment,
      percentage: calculatedPercentage || 0,
      lessonHits: totalLessonOpenHits || 0, 
      assessmentHits: totalAssessmentOpenHits || 0
    };
  });

  // Calculate remaining in-progress counters safely
  inProgressCourses = Math.max(totalCourses - completedCourses, 0);

  const totalHoursSpent = analyticsLog?.total_hours_spent ? Number(analyticsLog.total_hours_spent).toFixed(1) : "0.0";
  const lastLoginString = analyticsLog?.last_login_at 
    ? new Date(analyticsLog.last_login_at).toLocaleDateString("en-NG", { hour: "2-digit", minute: "2-digit" })
    : "No logins logged";

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-800">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 space-y-8">
        
        {/* Title Header Section */}
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight">
            Learning Progress Matrix
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Audit your system usage timelines, monitor verification completion marks, and maintain your weekly curriculum velocity.
          </p>
        </div>

        {/* Top High-Fidelity Stats Cards Deck */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-purple-50 text-[#512d7c] rounded-xl"><BookOpen size={20} /></div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Total Tracks</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{totalCourses}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Completed</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{completedCourses}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={20} /></div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Dashboard Hours</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{totalHoursSpent} hrs</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 text-left">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Flame size={20} /></div>
            <div>
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Active Status</p>
              <p className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase mt-1 inline-block tracking-wide animate-pulse">Synchronized</p>
            </div>
          </div>
        </div>

        {/* Modern Tracking Splits Core Grid System Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column: Course Wise Completion Track Cards */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5 text-left">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Activity size={16} className="text-[#512d7c]" /> Course-Wise Progress Tracker
            </h2>
            
            {(!enrollments || enrollments.length === 0) ? (
              <p className="text-xs text-slate-400 font-medium py-4">
                You haven’t started any course yet. Enroll in a course to see your detailed progress here.
              </p>
            ) : (
              <div className="space-y-6">
                {detailedCourseProgress.map((item: any) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 transition hover:bg-slate-50/80">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                          {item.courses?.title || "Specialized Cohort Track"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider font-mono">ID: {item.course_id}</p>
                      </div>
                      <span className="text-xs font-black text-[#512d7c] bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg shrink-0 font-mono">
                        {item.percentage}% Done
                      </span>
                    </div>

                    {/* Progress Fill Indicator Line */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#512d7c] to-[#f2b42c] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>

                    {/* Interactive Click Metrics Matrix Badges */}
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-slate-500 font-bold">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Textbook Open Hits:</span>
                        <span className="text-[#512d7c] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">{item.lessonHits} times</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Assessments Entered:</span>
                        <span className="text-[#512d7c] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">{item.assessmentHits} times</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Platform Audit Session Timestamps Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-left h-fit">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Calendar size={16} className="text-[#512d7c]" /> Security Sign-In Audit
            </h2>

            <div className="space-y-4 font-sans">
              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Last Server Network Link</span>
                <p className="text-xs font-black text-slate-800 font-mono tracking-tight">{lastLoginString} (WAT)</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Current Profile Verification</span>
                <div className="text-xs text-slate-600 font-medium leading-relaxed space-y-1 font-sans">
                  <p className="flex items-center justify-between"><span className="text-slate-400">User Email:</span> <span className="font-bold text-slate-800 truncate max-w-[150px]">{session.user.email}</span></p>
                  <p className="flex items-center justify-between"><span className="text-slate-400">Gate Account:</span> <span className="font-bold text-emerald-600 uppercase text-[10px] bg-emerald-50 border border-emerald-100 px-1.5 rounded">Active</span></p>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-[11px] font-bold text-slate-400 leading-normal">
                ⏱️ Operational session telemetry hooks refresh automatically each time textbook nodes are closed or final assessments grade results are committed.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}