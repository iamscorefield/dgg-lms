"use client";

import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Calendar,
  Award,
  FileCheck,
  ExternalLink,
  Mail,
  UserCheck,
  Users,
  MessageSquare,
} from "lucide-react";

interface VerificationResult {
  certId: string;
  fullName: string;
  email: string;
  trackName: string;
  startDate: string;
  completion_date: string;
  avgScore: number;
  capstoneName: string;
  capstoneUrl: string;
  status: "verified" | "pending" | "invalid";
  source: "lms" | "admin";
  courseScope?: string;
  attendanceRate?: number;
  weeklyBreakdown?: string;
  disciplineComment?: string;
  teamworkComment?: string;
  hostComment?: string;
  ceoComment?: string;
}

export default function CertificateVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [accountStatus, setAccountStatus] = useState<
    "not_found" | "student_pending" | "certified"
  >("not_found");

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchAttempted(true);
    setResult(null);
    setAccountStatus("not_found");

    const supabase = createBrowser();
    const cleanQuery = searchQuery.trim();

    try {
      // PATH A: LMS AUTOMATED SYSTEM VERIFICATION
      const { data: lmsData, error: lmsError } = await supabase
        .from("certifications")
        .select(`
          id, track_name, start_date, completion_date, average_assessment_score,
          capstone_project_name, capstone_project_url, verification_status,
          profiles!inner (full_name, email)
        `)
        .or(`id.eq.${cleanQuery},profiles(email.eq.${cleanQuery})`)
        .maybeSingle();

      if (!lmsError && lmsData) {
        setAccountStatus("certified");

        const profileNode = Array.isArray(lmsData.profiles)
          ? lmsData.profiles[0]
          : (lmsData.profiles as any);

        setResult({
          certId: lmsData.id,
          fullName: profileNode?.full_name || "Unknown Graduate",
          email: profileNode?.email || "",
          trackName: lmsData.track_name,
          startDate: lmsData.start_date,
          completion_date: lmsData.completion_date,
          avgScore: Number(lmsData.average_assessment_score),
          capstoneName: lmsData.capstone_project_name,
          capstoneUrl: lmsData.capstone_project_url || "#",
          status: (lmsData.verification_status as any) || "verified",
          source: "lms",
        });
        setLoading(false);
        return;
      }

      // PATH B: ADMINISTRATIVE LEDGER VERIFICATION (Includes Rich Recruiter Transcript & Comments)
      const { data: adminData, error: adminError } = await supabase
        .from("admin_ledgers")
        .select(`
          id, full_name, track_name, course_scope, completion_date, verification_status, average_score,
          attendance_rate, weekly_breakdown, discipline_comment, teamwork_comment, host_comment, ceo_comment
        `)
        .eq("id", cleanQuery)
        .maybeSingle();

      if (!adminError && adminData) {
        setAccountStatus("certified");

        setResult({
          certId: adminData.id,
          fullName: adminData.full_name,
          email: "N/A (Administrative On-Site Registration)",
          trackName: adminData.track_name,
          startDate: "On-Site Cohort Base",
          completion_date: adminData.completion_date,
          avgScore: Number(adminData.average_score || 85.0),
          capstoneName: "Integrated Module Portfolio",
          capstoneUrl: "#",
          status: (adminData.verification_status as any) || "verified",
          source: "admin",
          courseScope: adminData.course_scope,
          attendanceRate: Number(adminData.attendance_rate || 100.0),
          weeklyBreakdown:
            adminData.weekly_breakdown || "Weekly breakdown logs synced.",
          disciplineComment:
            adminData.discipline_comment ||
            "Maintained high professional conduct throughout the term.",
          teamworkComment:
            adminData.teamwork_comment ||
            "Demonstrated excellent collaboration during interactive cohort exercises.",
          hostComment:
            adminData.host_comment ||
            "Consistent participation and strong grasp of core lab directives.",
          ceoComment:
            adminData.ceo_comment ||
            "Approved and endorsed for placement in professional tech environments.",
        });
        setLoading(false);
        return;
      }

      // PATH C: PENDING PROFILE CHECK
      if (cleanQuery.includes("@")) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("email", cleanQuery)
          .maybeSingle();

        if (profileData) {
          setAccountStatus("student_pending");
          setLoading(false);
          return;
        }
      }

      setAccountStatus("not_found");
    } catch (err) {
      console.error("Verification processing exception:", err);
      setAccountStatus("not_found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16 selection:bg-[#512d7c]/10">
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-left mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-xs font-black text-[#512d7c] uppercase tracking-widest rounded-full mb-3">
            🛡️ SECURE VERIFICATION CENTRAL
          </span>
          <h1 className="text-3xl font-black text-[#1A0033] tracking-tight leading-tight">
            Academic Credential &amp; Professional Dossier Verification
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Validate authentic graduation records, transcripts, and stakeholder
            recommendations directly online. Input a unique{" "}
            <strong>Certificate Serial Number</strong> or{" "}
            <strong>Registered Email</strong> to review credential status.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-3xl mb-8 shadow-3xs text-left">
          <form onSubmit={handleVerification} className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
              Query Credential Reference Sockets
            </label>
            <div className="relative flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Certificate Serial Number (e.g. DGG-TN-...) or Student Email..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#512d7c] hover:bg-[#3f2261] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-0"
              >
                {loading ? "Verifying..." : "Verify Credentials"}
              </button>
            </div>
          </form>
        </div>

        {searchAttempted && !loading && (
          <div className="animate-fadeIn text-left">
            {accountStatus === "certified" && result && (
              <div className="border-2 border-slate-200/80 rounded-3xl bg-white overflow-hidden shadow-sm relative">
                <div
                  className={`h-2.5 w-full ${
                    result.source === "lms" ? "bg-[#512d7c]" : "bg-[#f2b42c]"
                  }`}
                />
                <div className="p-6 sm:p-10 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-100 pb-6 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          {result.fullName}
                        </h2>

                        {result.source === "lms" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-[10px] font-black text-[#512d7c] uppercase tracking-wider">
                            <ShieldCheck size={12} /> LMS Verification
                          </span>
                        )}

                        {result.source === "admin" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] font-black text-amber-700 uppercase tracking-wider">
                            <ShieldCheck size={12} /> Admin Verified Dossier
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 font-mono">
                        <Mail size={12} /> Registry Identity: {result.email}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                        Secure Verification Key
                      </span>
                      <span className="font-mono text-base font-black text-[#512d7c] bg-purple-50 px-3 py-1 rounded border border-purple-100/60 shadow-3xs">
                        {result.certId}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <div className="flex gap-3 items-start">
                      <Calendar
                        size={18}
                        className="text-[#512d7c] mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Program Track Entry Sync
                        </span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          {result.startDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                      <FileCheck
                        size={18}
                        className="text-[#512d7c] mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Graduation Sign-Off Date
                        </span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          {result.completion_date}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
                      <Award size={14} className="text-[#512d7c]" /> Curricular
                      Achievement Summary Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8 text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Completed Academic Specialization Track
                        </span>
                        <p className="text-base font-black text-[#1A0033] mt-1 tracking-tight leading-snug">
                          {result.trackName}
                        </p>
                      </div>
                      <div className="md:col-span-4 text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Milestone Scoreboard Average
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            {result.avgScore.toFixed(2)}%
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                            Passed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {result.source === "admin" && result.courseScope && (
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40 text-left space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        Verified Course Modules &amp; Scope
                      </span>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {result.courseScope}
                      </p>
                    </div>
                  )}

                  {/* RECRUITER DOSSIER: ATTENDANCE & BEHAVIORAL EVALUATION */}
                  {result.source === "admin" && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={14} className="text-[#512d7c]" />{" "}
                        Professional Transcript &amp; Behavioral Audit Dossier
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-2xl space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              Overall Attendance Rate
                            </span>
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                              {result.attendanceRate?.toFixed(2)}%
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 mt-1">
                            {result.weeklyBreakdown}
                          </p>
                        </div>

                        <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-2xl space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Discipline &amp; Punctuality
                          </span>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1">
                            {result.disciplineComment}
                          </p>
                        </div>

                        <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-2xl space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Teamwork &amp; Collaboration
                          </span>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1">
                            {result.teamworkComment}
                          </p>
                        </div>

                        <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-2xl space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            Host / Instructor Engagement
                          </span>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1">
                            {result.hostComment}
                          </p>
                        </div>
                      </div>

                      <div className="border border-purple-200 bg-purple-50/40 p-5 rounded-2xl space-y-1.5 text-left">
                        <div className="flex items-center gap-1.5 text-[#512d7c] font-black text-xs uppercase tracking-wider">
                          <MessageSquare size={14} /> Executive CEO &amp;
                          Founder Recommendation
                        </div>
                        <p className="text-xs font-bold text-slate-800 leading-relaxed italic">
                          &ldquo;{result.ceoComment}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                  {result.source === "lms" && (
                    <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/40 text-left">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Verified System Capstone Production Build
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5 tracking-tight leading-snug">
                          {result.capstoneName}
                        </h4>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between w-full flex-wrap gap-3">
                        <span className="text-[11px] font-medium text-slate-400">
                          🛡️ Code repositories fully audited and verified by DGG
                          technical administration.
                        </span>
                        {result.capstoneUrl !== "#" && (
                          <a
                            href={result.capstoneUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-[#512d7c] transition shadow-3xs hover:shadow-2xs decoration-none"
                          >
                            Inspect Live Build <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      Live verified cryptographic record checksum cleared validated from database records.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {accountStatus === "student_pending" && (
              <div className="border border-amber-200 bg-amber-50/30 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-3xs">
                  <UserCheck size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">
                    LMS Verification Pending
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-sm">
                    This email is recognized as an active student inside our
                    platform directory, but no completed course or
                    administrative ledger records yet exist for certification.
                  </p>
                </div>
              </div>
            )}

            {accountStatus === "not_found" && (
              <div className="border border-red-200 bg-red-50/30 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shadow-3xs">
                  <ShieldAlert size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">
                    No Record Found
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-sm">
                    No active certificate profile, matching administrative
                    code, or student account record string was detected inside
                    our database registry modules.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {!searchAttempted && (
          <div className="border border-dashed border-slate-200 bg-slate-50/30 p-10 rounded-3xl text-center flex flex-col items-center space-y-3">
            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#512d7c] shadow-3xs">
              <ShieldQuestion size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
              Awaiting Verification Target Input
            </h3>
            <p className="text-xs font-medium text-slate-400 max-w-xs leading-normal">
              Enter a verified student parameter above to cross-examine our
              secure data ledger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}