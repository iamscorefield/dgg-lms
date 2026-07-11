"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { Award, ShieldCheck, FileDown, BookOpen, Layers, CheckCircle2, Lock } from "lucide-react";

interface CertificateNode {
  id: string;
  type: "prep" | "main";
  title: string;
  courseScopeText: string;
  trackType: string;
  tierScope: string;
  isCompleted: boolean;
  completionDate: string | null;
  credentialId: string | null;
  requiredCoursesCount?: number;
  completedCoursesCount?: number;
}

export default function CertificatesPage() {
  const [studentName, setStudentName] = useState("DGG Student");
  const [userTier, setUserTier] = useState("free");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [prepCompletedCount, setPrepCompletedCount] = useState(0); 
  const [trackingId, setTrackingId] = useState("");
  
  // Real database completion check tracking for the premium main track
  const [isMainTrackCompleted, setIsMainTrackCompleted] = useState(false);

  useEffect(() => {
    async function loadCertificateData() {
      try {
        const supabase = createBrowser();
        const { data, error: authError } = await supabase.auth.getUser();

        if (authError || !data?.user) {
          setLoading(false);
          return;
        }

        const currentUserId = data.user.id;
        setUserId(currentUserId);

        // 1. Load profile details and tracking ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, membership_status, tracking_id")
          .eq("id", currentUserId)
          .maybeSingle();

        if (profile) {
          if (profile.full_name) setStudentName(profile.full_name);
          if (profile.membership_status) setUserTier(profile.membership_status);
          if (profile.tracking_id) setTrackingId(profile.tracking_id);
        }

        // 2. Query actual completed prep courses from database user_enrollments
        const { count: prepCount, error: prepError } = await supabase
          .from("user_enrollments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", currentUserId)
          .eq("status", "completed")
          .like("course_id", "prep-%");

        if (!prepError && prepCount !== null) {
          setPrepCompletedCount(prepCount);
        }

        // 3. SECURED LIVE CHECK FOR MAIN TRACK PAID ENROLLMENT AND PROGRESS COMPLETION
        // Queries premium enrollments table for valid paid status matching course_id 18
        const { data: mainEnrollment } = await supabase
          .from("enrollments")
          .select("course_id")
          .eq("student_id", currentUserId)
          .eq("course_id", "18")
          .eq("payment_status", "paid")
          .maybeSingle();

        if (mainEnrollment) {
          // Verify if user_enrollments marks this specific course_id as completed
          const { data: mainProgress } = await supabase
            .from("user_enrollments")
            .select("status")
            .eq("user_id", currentUserId)
            .eq("course_id", "18")
            .eq("status", "completed")
            .maybeSingle();

          if (mainProgress) {
            setIsMainTrackCompleted(true);
          }
        }

      } catch (err) {
        console.error("Failed to compile certificate requirements:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificateData();
  }, []);

  const shortId = trackingId || (userId ? userId.slice(0, 8).toUpperCase() : "STUDENT");
  const isPrepMasterUnlocked = prepCompletedCount === 8;

  const coreCertificatesCatalog: CertificateNode[] = [
    {
      id: "canvas-prep",
      type: "prep",
      title: "8 Core Foundational Prep Program Graduate",
      trackType: "Prep Bundle",
      tierScope: "Foundational",
      courseScopeText: "Digital Literacy, Web Architecture, UI/UX Systems, Programming Logic, React & Next.js Frameworks, Backend Server Mechanics, Relational Databases, and Cloud Integration with Supabase Workspace Hubs.",
      isCompleted: isPrepMasterUnlocked, 
      completionDate: "June 6, 2026",
      credentialId: `DGG-PR-${shortId}`,
      requiredCoursesCount: 8,
      completedCoursesCount: prepCompletedCount
    },
    {
      id: "canvas-main",
      type: "main",
      title: "Advanced Full-Stack Web Architecture Certification",
      trackType: "Main Core Module",
      tierScope: "Full-Stack Web Architecture",
      courseScopeText: isMainTrackCompleted 
        ? "Advanced Full-Stack Web Systems Architecture & Production Engineering Matrix" 
        : "Production Grade Code Architecture Mastery",
      isCompleted: isMainTrackCompleted, 
      completionDate: isMainTrackCompleted ? "June 7, 2026" : null,
      credentialId: isMainTrackCompleted ? `DGG-MN-${shortId}` : null
    }
  ];

  const earnedCertsCount = coreCertificatesCatalog.filter(c => c.isCompleted).length;

  const handlePrintPDF = (elementId: string, isCompleted: boolean) => {
    if (!isCompleted) {
      toast.error("Track requirements incomplete. Downloader access is restricted.");
      return;
    }

    const printContent = document.getElementById(elementId);
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>DGG_Academy_Certificate</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap');
            @page { size: A4 landscape; margin: 0 !important; }
            html, body { margin: 0 !important; padding: 0 !important; width: 297mm; height: 210mm; overflow: hidden; background-color: #fff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: 'Montserrat', sans-serif; }
            .print-wrapper { width: 297mm !important; height: 210mm !important; position: relative; box-sizing: border-box; overflow: hidden; background-color: #ffffff !important; }
            .cert-canvas-frame { width: 100% !important; height: 100% !important; padding: 3.5rem !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; box-sizing: border-box !important; }
            .font-serif-italic { font-family: 'Playfair Display', serif; font-style: italic; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body class="flex items-center justify-center">
          <div class="print-wrapper">
            <div class="cert-canvas-frame">${printContent.innerHTML}</div>
          </div>
          <script>
            window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-10 text-left font-black text-xs uppercase tracking-widest text-[#512d7c] font-mono animate-pulse">
          Loading Certification Ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fcfbfe] text-slate-800 font-sans selection:bg-[#512d7c]/10">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
            <div className="text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#512d7c] mb-1">
                <Layers size={14} /> Student Dashboard
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
                Credentials &amp; Diplomas
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                Preview your certificate structures and unlock print-ready options upon course completion.
              </p>
            </div>
            
            {/* Interactive Metrics Bar */}
            <div className="flex items-center gap-4 text-left self-start md:self-auto">
              <div className="px-5 py-3 bg-white border border-slate-200/80 shadow-xs rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-[#512d7c] rounded-xl"><Award size={20} /></div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Unlocked</span>
                  <span className="text-xl font-black text-[#512d7c] block">{earnedCertsCount} Certificate</span>
                </div>
              </div>
              <div className="px-5 py-3 bg-white border border-slate-200/80 shadow-xs rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-[#f2b42c] rounded-xl"><CheckCircle2 size={20} /></div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Tier Level</span>
                  <span className="text-xs font-black uppercase text-white bg-[#512d7c] px-2.5 py-0.5 rounded-md mt-1 block">
                    {userTier}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Context Rules Info */}
            <div className="space-y-6 xl:col-span-1">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6 text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen size={16} className="text-[#512d7c]" /> Completion Status
                </h3>
                
                <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
                  <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100">
                    <span className="font-bold text-[#f2b42c] block mb-1">📋 Prep Bundle Check:</span>
                    Foundational status: <span className="font-black text-[#512d7c] font-mono text-sm">{prepCompletedCount}/8</span>. Completing all 8 modules unlocks download capability for the master foundational credential.
                  </div>

                  <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <span className="font-bold text-[#512d7c] block mb-1">⚡ Main Modules Check:</span>
                    Main architectural paths behave independently. Finishing your premium mainline track converts the template into an active ready asset below.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Columns: Canvas Template Previews */}
            <div className="xl:col-span-2 space-y-8">
              {coreCertificatesCatalog.map((cert) => (
                <div 
                  key={cert.id}
                  className={`bg-white border rounded-[2.5rem] p-6 lg:p-8 shadow-sm space-y-6 relative transition-all border-slate-200/80`}
                >
                  {/* Card Title Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block text-[9px] font-black uppercase tracking-widest font-mono px-2.5 py-0.5 rounded-md border ${
                          cert.type === "prep" ? "bg-amber-50 text-[#f2b42c] border-amber-200" : "bg-purple-50 text-[#512d7c] border-purple-200"
                        }`}>
                          {cert.trackType}
                        </span>
                        {!cert.isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase font-mono px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-md">
                            <Lock size={10} /> View-Only Template
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                        {cert.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      disabled={!cert.isCompleted}
                      onClick={() => handlePrintPDF(`canvas-${cert.id}`, cert.isCompleted)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border-0 sm:w-auto w-full ${
                        cert.isCompleted 
                          ? "bg-[#512d7c] hover:bg-[#402263] text-white shadow-xs cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <FileDown size={14} /> {cert.isCompleted ? "Download Official PDF" : "Locked (Finish Course)"}
                    </button>
                  </div>

                  {/* 🖼️ INTERACTIVE CANVAS CONTAINER - ALWAYS VISIBLE TEMPLATE MODE */}
                  <div className="w-full overflow-x-auto border border-slate-200 rounded-2xl bg-slate-50/50 p-4 shadow-inner">
                    <div 
                      id={`canvas-${cert.id}`}
                      className="relative w-[1000px] aspect-[1414/1000] bg-white overflow-hidden border-[14px] border-double border-[#512d7c] p-12 text-center flex-shrink-0 mx-auto flex flex-col justify-between"
                      style={{ boxSizing: "border-box" }}
                    >
                      
                      {/* Corner-Peel Layout Edge Accents */}
                      <div className="absolute top-0 left-0 w-36 h-36 pointer-events-none overflow-hidden z-0">
                        <div className="absolute top-[-40px] left-[-40px] w-52 h-20 bg-[#512d7c] rotate-45 transform" />
                        <div className="absolute top-[-20px] left-[-20px] w-52 h-4 bg-[#f2b42c] rotate-45 transform" />
                      </div>

                      {/* Top Header Row Layout */}
                      <div className="flex justify-between items-center w-full relative z-10 pl-16">
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <img 
                              src="/favicon.ico" 
                              alt="DGG Icon" 
                              className="h-11 w-11 object-contain p-1 bg-[#f2b42c] rounded-full border border-[#512d7c]"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f2b42c'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                              }}
                            />
                            <div className="flex flex-col justify-center">
                              <h4 className="text-[13px] font-black uppercase tracking-[0.18em] text-[#512d7c] m-0 p-0 leading-none">D-GLOBAL</h4>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mt-1 leading-none">GROWTHFIELD ACADEMY</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[9px] font-black uppercase font-mono px-3 py-1 rounded-md border border-slate-200 tracking-wider text-slate-400 bg-slate-50">
                          {cert.isCompleted ? "OFFICIAL SYSTEM CREDENTIAL" : "PREVIEW SPECIMEN TEMPLATE"}
                        </span>
                      </div>

                      {/* Central Certificate Content Presentation Panel */}
                      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto z-10 my-6 space-y-6">
                        <h1 className="text-5xl font-black tracking-tight text-[#512d7c] font-serif italic m-0">
                          Certificate of Completion
                        </h1>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#f2b42c] to-transparent w-48 mx-auto" />
                        
                        <p className="text-[10px] font-black tracking-[0.22em] text-slate-400 uppercase m-0">
                          This institutional record certifies that the authorized participant
                        </p>
                        
                        {/* Dynamic Name Box - Unlocks legal data only when completed */}
                        <div className={`py-3 border-b border-dashed w-fit mx-auto px-20 rounded-2xl transition-all ${
                          cert.isCompleted ? "border-[#f2b42c] bg-purple-50/40" : "border-slate-300 bg-slate-50/80"
                        }`}>
                          <h2 className={`text-3xl font-black tracking-widest uppercase m-0 leading-none ${
                            cert.isCompleted ? "text-[#512d7c]" : "text-slate-300"
                          }`}>
                            {cert.isCompleted ? studentName : "[PARTICIPANT NAME]"}
                          </h2>
                        </div>

                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-xl mx-auto m-0">
                          has cleared all required modular assessment targets, validated passing weight structures, and satisfied graduation paths for the learning track:
                        </p>

                        <h3 className="text-base font-black text-[#512d7c] uppercase tracking-wide bg-purple-50/50 py-3 px-8 rounded-xl border border-purple-100/30 m-0">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Right-Edge Floating Ribbon Badge Component */}
                      <div className="absolute right-8 top-0 bottom-0 w-24 flex flex-col items-center justify-start pt-14 pointer-events-none z-10">
                        <div className="w-12 h-40 bg-[#512d7c] relative shadow-sm flex flex-col items-center pt-4 rounded-b-xs">
                          <div className="w-6 h-6 rounded-full bg-[#f2b42c] flex items-center justify-center text-[10px] font-bold text-[#512d7c]">
                            ★
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-3 bg-white" style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }} />
                        </div>
                        <div className="w-2.5 h-24 bg-[#f2b42c] mt-2 rounded-full opacity-30" />
                      </div>

                      {/* Bottom Stamp Validation & Signatures Grid */}
                      <div className="grid grid-cols-3 gap-6 items-end pt-6 border-t border-slate-200 relative z-10 w-full pr-16">
                        
                        {/* Left Signatory Anchor */}
                        <div className="text-left space-y-1.5 flex flex-col justify-end h-full">
                          <div className="border-b border-slate-200 pb-1 w-full">
                            <span className="font-serif italic text-sm font-black text-[#512d7c] tracking-wider block">Scorefield Bello</span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 m-0 leading-none">Founder &amp; Executive CEO</p>
                        </div>

                        {/* Center Seal Core Anchor */}
                        <div className="flex flex-col items-center justify-center space-y-2 h-full">
                          <div className={`flex items-center gap-1 border px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                            cert.isCompleted ? "bg-[#e6f6f0] text-[#00875a] border-[#b3f0db]" : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}>
                            <ShieldCheck size={10} /> {cert.isCompleted ? "VERIFIED" : "SPECIMEN"}
                          </div>

                          <div className="w-20 h-20 rounded-full border-4 border-double border-[#512d7c] flex flex-col items-center justify-center p-1 bg-white flex-shrink-0 shadow-3xs">
                            <div className="w-full h-full rounded-full border border-dashed border-[#f2b42c] flex flex-col items-center justify-center text-[7px] font-black text-[#512d7c] tracking-tight leading-none">
                              <span className="scale-75 text-slate-400 block">DGG HUB</span>
                              <div className={`text-[6px] font-sans px-1 font-bold rounded-xs my-0.5 border tracking-normal inline-block transition-all ${
                                cert.isCompleted ? "bg-[#e6f6f0] text-[#00875a] border-[#b3f0db]" : "bg-slate-50 text-slate-300 border-slate-200"
                              }`}>
                                APPROVED
                              </div>
                              <span className="scale-75 text-slate-400 block">2026</span>
                            </div>
                          </div>

                          <p className="text-[9px] font-black uppercase tracking-widest text-[#512d7c] m-0 whitespace-nowrap leading-none">
                            Administrative Office
                          </p>
                        </div>

                        {/* Right Immutable Ledger Anchor */}
                        <div className="text-right space-y-1.5 flex flex-col justify-end h-full">
                          <div className="border-b border-slate-200 pb-1 w-full text-right">
                            <span className={`font-mono text-[10px] font-black tracking-wider block transition-all ${
                              cert.isCompleted ? "text-slate-700" : "text-slate-300"
                            }`}>
                              {cert.isCompleted ? cert.credentialId : "[CREDENTIAL ID]"}
                            </span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 m-0 leading-none">
                            {cert.isCompleted ? "Certified Log Date" : "Pending Completion"}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}