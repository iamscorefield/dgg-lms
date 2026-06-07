"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

interface CertificateNode {
  id: string;
  type: "prep" | "main";
  title: string;
  courseScopeText: string;
  trackType: "Prep" | "Main Tier Module";
  tierScope: "Foundational" | "Full-Stack Web Architecture" | "Mobile Engineering" | "UI/UX System Master";
  isCompleted: boolean;
  completionDate: string | null;
  credentialId: string | null;
  bgImageName: string; 
}

export default function CertificatesPage() {
  const [studentName, setStudentName] = useState("DGG Student");
  const [userTier, setUserTier] = useState("free");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function loadCertificateData() {
      try {
        const supabase = createBrowser();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, membership_status")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          if (profile.full_name) setStudentName(profile.full_name);
          if (profile.membership_status) setUserTier(profile.membership_status);
        }
      } catch (err) {
        console.error("Failed to compile certificate requirements:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificateData();
  }, []);

  const shortId = userId ? userId.slice(0, 8).toUpperCase() : "STUDENT";

  const coreCertificatesCatalog: CertificateNode[] = [
    {
      id: "CERT-PREP-2026",
      type: "prep",
      title: "8 Core Foundational Prep Program Graduate",
      trackType: "Prep",
      tierScope: "Foundational",
      courseScopeText: "Digital Literacy, Web Architecture, UI/UX Systems, Programming Logic, React & Next.js Frameworks, Backend Server Mechanics, Relational Databases, and Cloud Integration with Supabase Backend Workspace Hubs.",
      isCompleted: true, 
      completionDate: "June 6, 2026",
      credentialId: `DGG-PR-${shortId}`,
      bgImageName: "certificate-prep-bg.png" 
    },
    {
      id: "CERT-MAIN-2026",
      type: "main",
      title: "Advanced Professional Program Master Certification",
      trackType: "Main Tier Module",
      tierScope: "Full-Stack Web Architecture",
      courseScopeText: userTier === "premium" ? "Advanced Full-Stack Web Systems Architecture & Production Engineering Matrix" : "Data Analysis Foundations Class",
      isCompleted: userTier === "premium", 
      completionDate: userTier === "premium" ? "June 7, 2026" : null,
      credentialId: userTier === "premium" ? `DGG-MN-${shortId}` : null,
      bgImageName: "certificate-main-bg.png" 
    }
  ];

  const earnedCertsCount = coreCertificatesCatalog.filter(c => c.isCompleted).length;

  const handlePrint = (elementId: string, isCompleted: boolean) => {
    if (!isCompleted) {
      toast.error("Complete your course first");
      return;
    }

    const printContent = document.getElementById(elementId);
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>DGG Academy Certificate Verification</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: landscape; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .print-canvas { width: 1000px; height: 707px; display: flex !important; position: relative; }
          </style>
        </head>
        <body class="bg-white flex items-center justify-center min-h-screen">
          ${printContent.outerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 600);
            };
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
        <div className="flex-1 lg:ml-64 p-10 text-left font-black text-xs uppercase tracking-widest text-[#512d7c] font-mono">
          Compiling secured credentials ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-slate-800 font-sans">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-10 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight">
              Certificates &amp; Verified Badges
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Track your graduations, verified skill badges, and digital credentials.
            </p>
          </div>

          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 text-left">
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Earned Credentials</span>
              <span className="text-2xl font-black text-[#512d7c] mt-1 block">{earnedCertsCount}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Membership Status</span>
              <span className="text-xs font-black uppercase tracking-wider text-white bg-[#512d7c] px-2.5 py-0.5 rounded-md mt-2 inline-block">
                {userTier} Tier
              </span>
            </div>
          </div>

          {/* Catalog Layout Stack */}
          <div className="space-y-12">
            {coreCertificatesCatalog.map((cert) => (
              <div 
                key={cert.id} 
                className={`w-full rounded-3xl border p-6 lg:p-8 grid lg:grid-cols-[1.1fr,1.9fr] gap-8 items-center bg-white ${
                  cert.isCompleted ? "border-slate-200" : "border-slate-100"
                }`}
              >
                
                {/* Actions column */}
                <div className="text-left flex flex-col justify-between h-full space-y-6">
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${
                      cert.type === "prep" ? "bg-amber-100 text-[#f2b42c]" : "bg-purple-100 text-[#512d7c]"
                    }`}>
                      {cert.type === "prep" ? "Prep Program" : "Main Course Program"}
                    </span>
                    <h2 className="text-lg font-black text-slate-800 tracking-tight leading-snug mt-2">
                      {cert.title}
                    </h2>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handlePrint(`canvas-${cert.id}`, cert.isCompleted)}
                      className={`w-full inline-flex items-center justify-center px-4 py-3 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xs transition-colors cursor-pointer ${
                        cert.isCompleted 
                          ? "bg-[#512d7c] hover:bg-[#402263] text-white" 
                          : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 animate-pulse"
                      }`}
                    >
                      {cert.isCompleted ? "📥 Download Printable Certificate" : "🔒 Complete your course first"}
                    </button>
                  </div>
                </div>

                {/* 🎨 DGG CERTIFICATE CANVAS ENGINE PANEL */}
                <div className="w-full overflow-x-auto border border-slate-200 rounded-2xl shadow-xs bg-neutral-50 p-2 sm:p-4 select-none">
                  {/* 🔥 PIXEL PERFECT SCALE AND FIXED WIDTH ENFORCEMENT TO MATCH TEMPLATE DESIGNS EXCLUSIVELY */}
                  <div 
                    id={`canvas-${cert.id}`}
                    className="relative w-[1000px] h-[707px] overflow-hidden flex font-sans bg-cover bg-center print-canvas flex-shrink-0"
                    style={{ 
                      backgroundImage: `url('/${cert.bgImageName}')`
                    }}
                  >
                    
                    {/* LEFT CANVAS INJECTIONS LAYER (PADDED EXACTLY TO MEET YOUR DESIGN HOUSINGS) */}
                    <div className="w-[62%] h-full relative flex flex-col justify-between z-10 px-12 pt-28 pb-16">
                      
                      {/* Name placement box */}
                      <div className="w-full mt-4 text-left">
                        <h3 className="text-4xl font-black text-[#512d7c] tracking-tight leading-none uppercase font-sans">
                          {studentName}
                        </h3>
                      </div>

                      {/* Course specific descriptions description array content text field */}
                      <div className="w-full pr-6 text-left mb-6">
                        <p className="text-[13px] font-bold text-purple-950/90 leading-relaxed font-sans max-w-xl">
                          {cert.courseScopeText}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT CANVAS INJECTIONS LAYER (PADDED AND SECURED AGAINST CUTOFFS) */}
                    <div className="w-[38%] h-full relative flex flex-col justify-end z-10 pl-8 pr-12 pb-16">
                      
                      {/* High-Contrast Dynamic Date and Public Links Mapping Area */}
                      <div className="w-full text-left space-y-4 mb-2">
                        <div className="w-full text-left">
                          <span className="font-serif italic text-white text-[18px] font-medium block">
                            Date: {cert.isCompleted ? (cert.completionDate || "Jun 07, 2026") : "Pending"}
                          </span>
                        </div>
                        
                        <div className="pt-3 border-t border-white/20 w-full text-left">
                          <span className="text-[9px] text-purple-200 uppercase tracking-widest font-mono font-black block">
                            CERTIFIED VERIFICATION LINK;
                          </span>
                          <span className="font-bold tracking-tight text-white block text-[12px] font-mono lowercase mt-1 break-all max-w-[280px]">
                            dglobalgrowthfield.com/verify/{cert.credentialId || "secure-id"}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Overlay Lock for uncompleted files */}
                    {!cert.isCompleted && (
                      <div className="absolute inset-0 z-30 bg-slate-950/20 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                        <div className="h-12 w-12 rounded-full bg-slate-900/95 border border-slate-800 text-slate-400 flex items-center justify-center shadow-lg animate-pulse text-lg">
                          🔒
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 font-mono mt-2 bg-slate-900/95 px-3 py-1 rounded-md shadow-md border border-slate-800/60">
                          Locked Asset Content Row
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}