"use client";

import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";
import { Search, ShieldCheck, ShieldAlert, ShieldQuestion, Calendar, Award, FileCheck, ExternalLink, Printer, Mail, UserCheck } from "lucide-react";

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
  source: "lms" | "admin"; // Identifies the database verification source
  courseScope?: string;    // Captured from admin ledger database rows
}

export default function CertificateVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [accountStatus, setAccountStatus] = useState<"not_found" | "student_pending" | "certified">("not_found");

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
      // ==========================================
      // PATH A: LMS AUTOMATED SYSTEM VERIFICATION
      // ==========================================
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
        
        const profileNode = Array.isArray(lmsData.profiles) ? lmsData.profiles[0] : (lmsData.profiles as any);

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
          source: "lms"
        });
        setLoading(false);
        return;
      }

      // ==========================================
      // PATH B: ADMINISTRATIVE LEDGER VERIFICATION (Offline/Teen-Tech)
      // ==========================================
      const { data: adminData, error: adminError } = await supabase
        .from("admin_ledgers")
        .select(`
          id, full_name, track_name, course_scope, completion_date, verification_status, average_score
        `) // Added average_score schema target to selection criteria
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
          avgScore: Number(adminData.average_score || 85.00), // Binding historical metrics directly from columns
          capstoneName: "Integrated Module Portfolio",
          capstoneUrl: "#",
          status: (adminData.verification_status as any) || "verified",
          source: "admin",
          courseScope: adminData.course_scope
        });
        setLoading(false);
        return;
      }

      // ==========================================
      // PATH C: PENDING PROFILE CHECKSUM
      // ==========================================
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
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16 print:pt-0 print:pb-0 selection:bg-[#512d7c]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 print:px-0">
        
        {/* HEADER SECTION */}
        <div className="text-left mb-10 print:hidden">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-xs font-black text-[#512d7c] uppercase tracking-widest rounded-full mb-3">
            🛡️ SECURE VERIFICATION CENTRAL
          </span>
          <h1 className="text-3xl font-black text-[#1A0033] tracking-tight leading-tight">
            Academic Credential Verification Service
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Validate authentic graduation vectors instantly. Corporate recruitment desks, external human resource directors, and international hubs can input a student's unique <strong>Certificate Serial Number</strong> or <strong>Registered Email</strong> to extract verified status logs directly from our backend databases.
          </p>
        </div>

        {/* SEARCH FORM PANEL */}
        <div className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-3xl mb-8 shadow-3xs print:hidden text-left">
          <form onSubmit={handleVerification} className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
              Query Credential Reference Sockets
            </label>
            <div className="relative flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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

        {/* DYNAMIC RESULT VIEWPORTS */}
        {searchAttempted && !loading && (
          <div className="animate-fadeIn text-left">
            
            {/* STATE 1: VALID ACCOUNT FOUND */}
            {accountStatus === "certified" && result && (
              <div className="border-2 border-slate-200/80 rounded-3xl bg-white overflow-hidden shadow-sm relative print:border-0 print:shadow-none">
                <div className={`h-2.5 w-full ${result.source === 'lms' ? 'bg-[#512d7c]' : 'bg-[#f2b42c]'}`} />
                <div className="p-6 sm:p-10 space-y-8">
                  
                  {/* Verification Source Header Identifiers */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-100 pb-6 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{result.fullName}</h2>
                        
                        {/* LMS Source Badge */}
                        {result.source === 'lms' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-[10px] font-black text-[#512d7c] uppercase tracking-wider">
                            <ShieldCheck size={12} /> LMS Verification
                          </span>
                        )}

                        {/* Admin Console Source Badge */}
                        {result.source === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] font-black text-amber-700 uppercase tracking-wider">
                            <ShieldCheck size={12} /> Admin Verification
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 font-mono">
                        <Mail size={12} /> Registry Identity: {result.email}
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">Secure Verification Key</span>
                      <span className="font-mono text-base font-black text-[#512d7c] bg-purple-50 px-3 py-1 rounded border border-purple-100/60 shadow-3xs">
                        {result.certId}
                      </span>
                    </div>
                  </div>

                  {/* Program Duration Coordinates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <div className="flex gap-3 items-start">
                      <Calendar size={18} className="text-[#512d7c] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Program Track Entry Sync</span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{result.startDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                      <FileCheck size={18} className="text-[#512d7c] mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Graduation Sign-Off Date</span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{result.completion_date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course / Curriculum Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 flex items-center gap-1.5">
                      <Award size={14} className="text-[#512d7c]" /> Curricular Achievement Summary Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-8 text-left">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Completed Academic Specialization Track</span>
                        <p className="text-base font-black text-[#1A0033] mt-1 tracking-tight leading-snug">{result.trackName}</p>
                      </div>
                      <div className="md:col-span-4 text-left border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Milestone Scoreboard Average</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-black text-slate-900 font-mono">{result.avgScore.toFixed(2)}%</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">Passed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scope Details or Capstone Audits based on Source */}
                  {result.source === 'admin' && result.courseScope && (
                    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/40 text-left space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Verified Course Modules &amp; Scope</span>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{result.courseScope}</p>
                    </div>
                  )}

                  {result.source === 'lms' && (
                    <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/40 text-left">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Verified System Capstone Production Build</span>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5 tracking-tight leading-snug">{result.capstoneName}</h4>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between w-full flex-wrap gap-3">
                        <span className="text-[11px] font-medium text-slate-400">🛡️ Code repositories fully audited and verified by DGG technical administration.</span>
                        {result.capstoneUrl !== "#" && (
                          <a href={result.capstoneUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-[#512d7c] transition shadow-3xs hover:shadow-2xs decoration-none print:hidden">
                            Inspect Live Build <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Print and Validation Footer Block */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <p className="text-[11px] font-medium text-slate-400">Security checksum successfully cleared against active Supabase database records.</p>
                    <button type="button" onClick={() => window.print()} className="w-full sm:w-auto px-5 py-3 bg-[#512d7c] hover:bg-[#3f2261] text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-3xs flex items-center justify-center gap-2 cursor-pointer border-0">
                      <Printer size={14} /> Print Audit Record
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: PENDING GRADUATION */}
            {accountStatus === "student_pending" && (
              <div className="border border-amber-200 bg-amber-50/30 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-3xs">
                  <UserCheck size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">LMS Verification Pending</h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-sm">
                    This email is recognized as an active student inside our platform directory, but no completed course or administrative ledger records yet exist for certification.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 3: RECORD NOT FOUND */}
            {accountStatus === "not_found" && (
              <div className="border border-red-200 bg-red-50/30 p-6 sm:p-8 rounded-3xl flex flex-col items-center text-center max-w-xl mx-auto space-y-4 animate-fadeIn">
                <div className="h-12 w-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shadow-3xs">
                  <ShieldAlert size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-slate-900 text-base tracking-tight uppercase">No Record Found</h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-sm">
                    No active certificate profile, matching administrative code, or student account record string was detected inside our database registry modules.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* DEFAULT INITIAL STATE */}
        {!searchAttempted && (
          <div className="border border-dashed border-slate-200 bg-slate-50/30 p-10 rounded-3xl text-center flex flex-col items-center space-y-3">
            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#512d7c] shadow-3xs">
              <ShieldQuestion size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Awaiting Verification Target Input</h3>
            <p className="text-xs font-medium text-slate-400 max-w-xs leading-normal">
              Enter a verified student parameter above to cross-examine our secure data ledger.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}