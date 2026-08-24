"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { 
  Award, 
  RotateCcw, 
  Database, 
  Printer, 
  KeyRound, 
  BookOpen, 
  FileText, 
  Calendar, 
  User, 
  FileCode,
  LogOut,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCertificateGeneratorPage() {
  const [inputName, setInputName] = useState("Future Bello");
  const [template, setTemplate] = useState("teen-tech");
  const [inputTitle, setInputTitle] = useState("Teen-Tech Seasonal Program");
  const [inputScope, setInputScope] = useState(
    "Digital Literacy, Basic Computing Operations, Generative AI Engineering, Graphic Design Foundations via Canva, Web Structure Basics, and Project-Based Game Logic Creation."
  );
  const [inputDate, setInputDate] = useState("September 3, 2026");
  const [inputScore, setInputScore] = useState("88.50");
  const [inputId, setInputId] = useState("DGG-TN-20260903");
  const [inputStatus, setInputStatus] = useState("verified");
  
  // RECRUITER DOSSIER STATES
  const [inputAttendance, setInputAttendance] = useState("95.00");
  const [inputWeeklyBreakdown, setInputWeeklyBreakdown] = useState("Week 1: 5/5 Days | Week 2: 5/5 Days | Week 3: 4/5 Days | Week 4: 5/5 Days");
  const [inputDiscipline, setInputDiscipline] = useState("Exemplary punctuality and rigorous adherence to studio code rules.");
  const [inputTeamwork, setInputTeamwork] = useState("Collaborated effectively during group projects, demonstrating strong peer leadership.");
  const [inputHost, setInputHost] = useState("Active lab participant with exceptional consistency during practical sessions.");
  const [inputCeo, setInputCeo] = useState("Recommended for top-tier junior technical roles and digital production pipelines.");

  const [isPushing, setIsPushing] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleTemplateToggle = (type: string) => {
    setTemplate(type);
    if (type === "teen-tech") {
      setInputTitle("Teen-Tech Seasonal Program");
      setInputScope(
        "Digital Literacy, Basic Computing Operations, Generative AI Engineering, Graphic Design Foundations via Canva, Web Structure Basics, and Project-Based Game Logic Creation."
      );
      setInputId("DGG-TN-20260903");
    } else if (type === "prep") {
      setInputTitle("8 Core Foundational DGG-Prep Program");
      setInputScope(
        "Digital Literacy, Web Architecture, UI/UX Systems, Programming Logic, React & Next.js Frameworks, Backend Server Mechanics, Relational Databases, and Cloud Integration with Supabase Workspace Hubs."
      );
      setInputId("DGG-PR-20260715");
    } else if (type === "main") {
      setInputTitle("Advanced Course Certification");
      setInputScope(
        "Advanced Full-Stack Web Systems Architecture, Relational Schema Normalization, and Production Grade Code Base Engineering Matrix."
      );
      setInputId("DGG-MN-20260607");
    } else {
      // CUSTOM TEMPLATE FIX: Instantly generate a unique custom hash to avoid primary key collision errors on Supabase
      setInputTitle("");
      setInputScope("");
      const randomHash = Math.floor(10000000 + Math.random() * 90000000);
      setInputId(`DGG-CS-${randomHash}`);
    }
  };

  const generateTrackingCode = () => {
    let codePrefix = "DGG-CS-";
    if (template === "teen-tech") codePrefix = "DGG-TN-";
    if (template === "prep") codePrefix = "DGG-PR-";
    if (template === "main") codePrefix = "DGG-MN-";

    const randomHash = Math.floor(10000000 + Math.random() * 90000000);
    setInputId(`${codePrefix}${randomHash}`);
    
    const randomScore = (Math.random() * (98 - 76) + 76).toFixed(2);
    setInputScore(randomScore);
    
    toast.success("New Unique Tracking ID Instanced!");
  };

  const resetConsoleForm = () => {
    setInputName("");
    setInputTitle("");
    setInputScope("");
    setInputDate("");
    setInputId("");
    setInputScore("0.00");
    setInputAttendance("100.00");
    setInputWeeklyBreakdown("");
    setInputDiscipline("");
    setInputTeamwork("");
    setInputHost("");
    setInputCeo("");
  };

  const pushRecordToSupabase = async () => {
    if (!inputId.trim() || !inputName.trim() || !inputTitle.trim()) {
      toast.error("Validation Fault: Complete ID, Name, and Track Title parameter fields.");
      return;
    }

    setIsPushing(true);
    const loadingToast = toast.loading("Deploying row entry to admin_ledgers ledger...");

    try {
      const res = await fetch("/api/admin/deploy-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inputId,
          fullName: inputName,
          trackName: inputTitle,
          courseScope: inputScope,
          completionDate: inputDate,
          averageScore: inputScore,
          attendanceRate: inputAttendance,
          weeklyBreakdown: inputWeeklyBreakdown,
          disciplineComment: inputDiscipline,
          teamworkComment: inputTeamwork,
          hostComment: inputHost,
          ceoComment: inputCeo,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("System Success: Credential live-activated inside public Registry!", {
          id: loadingToast,
        });
      } else {
        toast.error(`Insertion Rejected: ${data.error || "Unknown error"}`, {
          id: loadingToast,
        });
      }
    } catch (err: any) {
      toast.error(`Database Connection Fault: ${err.message}`, {
        id: loadingToast,
      });
    } finally {
      setIsPushing(false);
    }
  };

  const executeCertificatePrint = () => {
    const printContent = document.getElementById("targetCertCanvas")?.innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Browser blocked print popup window. Check browser configurations.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DGG_Administrative_Print_Job</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap');
          @page { size: A4 landscape; margin: 0 !important; }
          html, body { margin: 0 !important; padding: 0 !important; width: 297mm; height: 210mm; overflow: hidden; background-color: #ffffff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; font-family: 'Montserrat', sans-serif; }
          .print-wrapper { width: 297mm !important; height: 210mm !important; position: relative; box-sizing: border-box; overflow: hidden; background-color: #ffffff !important; }
          .cert-canvas-frame { width: 100% !important; height: 100% !important; padding: 3.5rem !important; display: flex !important; flex-direction: column !important; justify-content: space-between !important; box-sizing: border-box !important; border: 14px double #512d7c; position: relative; text-align: center; }
          .cert-edge-accent { position: absolute; top: 0; left: 0; width: 144px; height: 144px; overflow: hidden; }
          .accent-block-1 { position: absolute; top: -40px; left: -40px; width: 208px; height: 80px; background-color: #512d7c !important; transform: rotate(45deg); -webkit-print-color-adjust: exact !important; }
          .accent-block-2 { position: absolute; top: -20px; left: -20px; width: 208px; height: 16px; background-color: #f2b42c !important; transform: rotate(45deg); -webkit-print-color-adjust: exact !important; }
          .cert-header { display: flex; justify-content: space-between; align-items: center; padding-left: 64px; text-align: left; }
          .brand-logo-img { height: 96px !important; width: auto; object-fit: contain; }
          .brand-text-wrapper h4 { margin: 0; font-size: 16px; font-weight: 900; letter-spacing: 0.18em; color: #512d7c !important; }
          .brand-text-wrapper span { font-size: 11px; font-weight: 700; color: #64748b !important; display: block; margin-top: 4px; }
          .status-badge { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 6px; border: 1px solid #ebe7f4; background-color: #f8f7fc !important; color: #64748b !important; }
          .status-badge.verified { background-color: #e6f6f0 !important; color: #00875a !important; border-color: #b3f0db !important; }
          .cert-body { display: flex; flex-direction: column; justify-content: center; align-items: center; max-width: 800px; margin: 0 auto; gap: 16px; }
          .cert-main-title { margin: 0; font-size: 3rem; font-weight: 900; color: #512d7c !important; font-family: 'Playfair Display', Georgia, serif; font-style: italic; }
          .divider-line { height: 2px; background: #f2b42c !important; width: 192px; }
          .cert-sub-text { margin: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.22em; color: #64748b !important; }
          .student-name-container { padding: 8px 64px; border-bottom: 2px dashed #f2b42c; background-color: rgba(81, 45, 124, 0.02) !important; border-radius: 16px; width: fit-content; }
          .student-name-text { margin: 0; font-size: 1.95rem; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase; color: #512d7c !important; }
          .course-summary-text { margin: 0; font-size: 11px; font-weight: 500; color: #64748b !important; max-width: 650px; line-height: 1.6; }
          .course-title-badge { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; color: #512d7c !important; background-color: rgba(81, 45, 124, 0.04) !important; padding: 8px 24px; border-radius: 12px; }
          .ribbon-wrapper { position: absolute; right: 48px; top: 0; bottom: 0; width: 96px; display: flex; flex-direction: column; align-items: center; padding-top: 56px; }
          .ribbon-body { width: 44px; height: 130px; background-color: #512d7c !important; position: relative; display: flex; flex-direction: column; align-items: center; padding-top: 16px; -webkit-print-color-adjust: exact !important; }
          .ribbon-star { width: 24px; height: 24px; border-radius: 50%; background-color: #f2b42c !important; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #512d7c !important; }
          .ribbon-tail { position: absolute; bottom: 0; left: 0; right: 0; height: 12px; background-color: #ffffff !important; clip-path: polygon(0% 100%, 50% 0%, 100% 100%); }
          .cert-footer { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: end; border-top: 1px solid #ebe7f4; padding-right: 64px; padding-top: 16px; }
          .sign-block { display: flex; flex-direction: column; justify-content: flex-end; }
          .sign-line { border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; }
          .sign-name { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 0.95rem; font-weight: 900; color: #512d7c !important; }
          .sign-title { margin: 0; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b !important; }
          .seal-block { display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .seal-outer { width: 76px; height: 76px; border-radius: 50%; border: 4px double #512d7c; background-color: #ffffff !important; display: flex; align-items: center; justify-content: center; }
          .seal-inner { width: 100%; height: 100%; border-radius: 50%; border: 1px dashed #f2b42c; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 7px; font-weight: 900; color: #512d7c !important; line-height: 1.1; }
          .seal-badge { font-size: 5px; padding: 1px 4px; border-radius: 2px; border: 1px solid #b3f0db; background-color: #e6f6f0 !important; color: #00875a !important; margin: 2px 0; }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          <div class="cert-canvas-frame">${printContent}</div>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 400); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLogout = () => {
    toast.success("Logging out...");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbfe] text-[#1e1b4b] font-sans selection:bg-[#512d7c]/10">
      
      <style dangerouslySetInnerHTML={{__html: `
        .cert-canvas-frame {
          width: 1000px !important;
          height: 707px !important;
          background-color: #ffffff !important;
          border: 14px double #512d7c !important;
          padding: 48px !important;
          position: relative !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          text-align: center !important;
        }
        .cert-edge-accent {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 144px !important;
          height: 144px !important;
          pointer-events: none !important;
          overflow: hidden !important;
          z-index: 0 !important;
        }
        .accent-block-1 {
          position: absolute !important;
          top: -40px !important;
          left: -40px !important;
          width: 208px !important;
          height: 80px !important;
          background-color: #512d7c !important;
          transform: rotate(45deg) !important;
        }
        .accent-block-2 {
          position: absolute !important;
          top: -20px !important;
          left: -20px !important;
          width: 208px !important;
          height: 16px !important;
          background-color: #f2b42c !important;
          transform: rotate(45deg) !important;
        }
        .cert-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          position: relative !important;
          z-index: 10 !important;
          padding-left: 64px !important;
          text-align: left !important;
        }
        .brand-logo-block {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .brand-logo-img {
          height: 96px !important; /* Bolded / doubled logo display size */
          width: auto !important;
          object-fit: contain !important;
        }
        .brand-text-wrapper h4 {
          margin: 0 !important;
          font-size: 16px !important;
          font-weight: 900 !important;
          letter-spacing: 0.18em !important;
          color: #512d7c !important;
          line-height: 1 !important;
        }
        .brand-text-wrapper span {
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
          color: #64748b !important;
          display: block !important;
          margin-top: 4px !important;
          line-height: 1 !important;
        }
        .status-badge {
          font-size: 9px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 4px 12px !important;
          border-radius: 6px !important;
          border: 1px solid #ebe7f4 !important;
          background-color: #f8f7fc !important;
          color: #64748b !important;
        }
        .status-badge.verified {
          background-color: #e6f6f0 !important;
          color: #00875a !important;
          border-color: #b3f0db !important;
        }
        .cert-body {
          flex-grow: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          max-width: 768px !important;
          margin: 16px auto !important;
          gap: 14px !important;
          position: relative !important;
          z-index: 10 !important;
        }
        .cert-main-title {
          margin: 0 !important;
          font-size: 2.75rem !important;
          font-weight: 900 !important;
          color: #512d7c !important;
          font-family: 'Playfair Display', Georgia, serif !important;
          font-style: italic !important;
        }
        .divider-line {
          height: 2px !important;
          background: linear-gradient(to right, transparent, #f2b42c, transparent) !important;
          width: 192px !important;
        }
        .cert-sub-text {
          margin: 0 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.22em !important;
          color: #64748b !important;
        }
        .student-name-container {
          padding: 10px 56px !important;
          border-bottom: 2px dashed #f2b42c !important;
          background-color: rgba(81, 45, 124, 0.02) !important;
          border-radius: 16px !important;
          width: fit-content !important;
        }
        .student-name-text {
          margin: 0 !important;
          font-size: 1.85rem !important;
          font-weight: 900 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          color: #512d7c !important;
        }
        .course-summary-text {
          margin: 0 !important;
          font-size: 11px !important;
          font-weight: 500 !important;
          color: #64748b !important;
          max-width: 600px !important;
          line-height: 1.5 !important;
        }
        .course-title-badge {
          margin: 0 !important;
          font-size: 0.95rem !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          color: #512d7c !important;
          background-color: rgba(81, 45, 124, 0.04) !important;
          padding: 8px 24px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(81, 45, 124, 0.08) !important;
        }
        .ribbon-wrapper {
          position: absolute !important;
          right: 48px !important;
          top: 0 !important;
          bottom: 0 !important;
          width: 96px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          padding-top: 56px !important;
          pointer-events: none !important;
          z-index: 5 !important;
        }
        .ribbon-body {
          width: 44px !important;
          height: 130px !important;
          background-color: #512d7c !important;
          position: relative !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          padding-top: 16px !important;
        }
        .ribbon-star {
          width: 24px !important;
          height: 24px !important;
          border-radius: 50% !important;
          background-color: #f2b42c !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 10px !important;
          font-weight: bold !important;
          color: #512d7c !important;
        }
        .ribbon-tail {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 12px !important;
          background-color: #ffffff !important;
          clip-path: polygon(0% 100%, 50% 0%, 100% 1002%) !important;
        }
        .cert-footer {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 24px !important;
          align-items: end !important;
          padding-top: 16px !important;
          border-top: 1px solid #ebe7f4 !important;
          position: relative !important;
          z-index: 10 !important;
          padding-right: 64px !important;
        }
        .sign-block {
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-end !important;
          height: 100px !important;
          text-align: left !important;
        }
        .sign-line {
          border-bottom: 1px solid #cbd5e1 !important;
          padding-bottom: 4px !important;
          margin-bottom: 6px !important;
        }
        .sign-name {
          font-family: 'Playfair Display', Georgia, serif !important;
          font-style: italic !important;
          font-size: 0.95rem !important;
          font-weight: 900 !important;
          color: #512d7c !important;
        }
        .sign-title {
          margin: 0 !important;
          font-size: 9px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #64748b !important;
        }
        .seal-block {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .seal-outer {
          width: 76px !important;
          height: 76px !important;
          border-radius: 50% !important;
          border: 4px double #512d7c !important;
          background-color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .seal-inner {
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          border: 1px dashed #f2b42c !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 7px !important;
          font-weight: 900 !important;
          color: #512d7c !important;
          line-height: 1.1 !important;
        }
        .seal-badge {
          font-size: 5px !important;
          padding: 1px 4px !important;
          border-radius: 2px !important;
          border: 1px solid #b3f0db !important;
          margin: 2px 0 !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />

      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 w-full overflow-hidden flex flex-col">
        
        <div className="h-16 border-b border-[#ebe7f4] bg-white px-4 sm:px-8 flex items-center justify-between flex-shrink-0">
          <div className="relative max-w-md w-full hidden sm:block">
            <input 
              type="text" 
              placeholder="Search courses or users..." 
              className="w-full px-4 py-2 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-[#f2b42c] hover:bg-[#e0a31a] text-[#512d7c] font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 border-0 cursor-pointer"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          
          <div className="text-left">
            <h1 className="text-3xl font-black text-[#512d7c] tracking-tight">
              Admin Dashboard – Welcome, Admin!
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#64748b] mt-1">
              Construct high-fidelity landscape credentials and coordinate master registry data channels cleanly.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            
            <div className="xl:col-span-4 bg-white border border-[#ebe7f4] p-6 rounded-3xl shadow-xs space-y-6">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#512d7c] pb-3 border-b border-[#ebe7f4] flex items-center gap-2">
                <KeyRound size={16} /> Ledger Record Controls
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <User size={12} /> Participant Full Name
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <BookOpen size={12} /> Predefined Template Select
                  </label>
                  <select
                    value={template}
                    onChange={(e) => handleTemplateToggle(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  >
                    <option value="teen-tech">Teen-Tech Seasonal Program</option>
                    <option value="prep">8 Core Foundational DGG-Prep Program</option>
                    <option value="main">Advanced Course Certification</option>
                    <option value="custom">-- Custom System Track Entry --</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <FileText size={12} /> Custom Course Track Title
                  </label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <FileCode size={12} /> Course Scope Specifications
                  </label>
                  <textarea
                    value={inputScope}
                    onChange={(e) => setInputScope(e.target.value)}
                    rows={3}
                    style={{ resize: "none" }}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <Calendar size={12} /> Certified Log Date
                  </label>
                  <input
                    type="text"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                      <Award size={12} /> Score (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputScore}
                      onChange={(e) => setInputScore(e.target.value)}
                      className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                      <CheckCircle size={12} /> Attendance (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputAttendance}
                      onChange={(e) => setInputAttendance(e.target.value)}
                      className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2">
                    Weekly Attendance Breakdown Schedule
                  </label>
                  <input
                    type="text"
                    value={inputWeeklyBreakdown}
                    onChange={(e) => setInputWeeklyBreakdown(e.target.value)}
                    placeholder="e.g. Week 1: 5/5 | Week 2: 4/5..."
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <MessageSquare size={12} /> Discipline & Punctuality Review
                  </label>
                  <textarea
                    value={inputDiscipline}
                    onChange={(e) => setInputDiscipline(e.target.value)}
                    rows={2}
                    style={{ resize: "none" }}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <MessageSquare size={12} /> Teamwork & Collaboration Review
                  </label>
                  <textarea
                    value={inputTeamwork}
                    onChange={(e) => setInputTeamwork(e.target.value)}
                    rows={2}
                    style={{ resize: "none" }}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <MessageSquare size={12} /> Host / Instructor Engagement Comment
                  </label>
                  <textarea
                    value={inputHost}
                    onChange={(e) => setInputHost(e.target.value)}
                    rows={2}
                    style={{ resize: "none" }}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2 flex items-center gap-1">
                    <MessageSquare size={12} /> CEO / Founder Recommendation
                  </label>
                  <textarea
                    value={inputCeo}
                    onChange={(e) => setInputCeo(e.target.value)}
                    rows={2}
                    style={{ resize: "none" }}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2">
                    System Registry Credential ID
                  </label>
                  <input
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#512d7c] mb-2">
                    Verification Framework Status
                  </label>
                  <select
                    value={inputStatus}
                    onChange={(e) => setInputStatus(e.target.value)}
                    className="w-full p-3 bg-[#f8f7fc] border border-[#ebe7f4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] focus:bg-white transition"
                  >
                    <option value="verified">Verified System Credential</option>
                    <option value="specimen">Preview Specimen Template</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#ebe7f4]">
                <button
                  onClick={generateTrackingCode}
                  className="px-3 py-3 bg-[#f8f7fc] hover:bg-[#ebe7f4] border border-[#ebe7f4] text-[#512d7c] text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <KeyRound size={12} /> Auto Code
                </button>
                <button
                  onClick={resetConsoleForm}
                  className="px-3 py-3 bg-[#f8f7fc] hover:bg-[#ebe7f4] border border-[#ebe7f4] text-[#512d7c] text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={12} /> Clear Form
                </button>
                <button
                  onClick={pushRecordToSupabase}
                  disabled={isPushing}
                  className="col-span-2 px-4 py-3 bg-[#00875a] hover:bg-[#00704a] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer border-0"
                >
                  <Database size={12} /> {isPushing ? "Synchronizing..." : "Synchronize & Deploy to Database"}
                </button>
                <button
                  onClick={executeCertificatePrint}
                  className="col-span-2 px-4 py-3 bg-[#512d7c] hover:bg-[#412363] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border-0"
                >
                  <Printer size={12} /> Print Official Landscape PDF
                </button>
              </div>
            </div>

            <div className="xl:col-span-8 space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-[#512d7c] text-left">
                Live Landscape Print Preview (1414 x 1000 Ratio)
              </h2>
              
              <div className="w-full overflow-x-auto border border-[#ebe7f4] rounded-3xl bg-[#f8f7fc] p-6 shadow-inner custom-scrollbar">
                
                <div id="targetCertCanvas" className="cert-canvas-frame shadow-md">
                  
                  <div className="cert-edge-accent">
                    <div className="accent-block-1"></div>
                    <div className="accent-block-2"></div>
                  </div>

                  <div className="cert-header">
                    <div className="brand-logo-block">
                      {!logoError ? (
                        <img
                          src="/images/logo.png"
                          alt="D-Global Growthfield Academy Logo"
                          className="brand-logo-img"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <div className="brand-text-wrapper">
                          <h4>D-GLOBAL</h4>
                          <span>DGG ACADEMY</span>
                        </div>
                      )}
                    </div>
                    <div className={`status-badge ${inputStatus === "verified" ? "verified" : ""}`}>
                      {inputStatus === "verified" ? `VERIFIED CREDENTIAL | SCORE: ${inputScore}%` : "PREVIEW SPECIMEN TEMPLATE"}
                    </div>
                  </div>

                  <div className="cert-body">
                    <h1 className="cert-main-title">Certificate of Completion</h1>
                    <div className="divider-line"></div>
                    <p className="cert-sub-text">This institutional record certifies that the authorized participant</p>
                    
                    <div className="student-name-container">
                      <h2 className="student-name-text">{inputName || "[PARTICIPANT NAME]"}</h2>
                    </div>

                    <p className="cert-sub-text" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                      has cleared all required modular assessment targets, validated passing weight structures, and satisfied graduation paths for the learning track:
                    </p>
                    <h3 className="course-title-badge">{inputTitle || "[COURSE TRACK TITLE]"}</h3>
                    <p className="course-summary-text">{inputScope}</p>
                  </div>

                  <div className="ribbon-wrapper">
                    <div className="ribbon-body">
                      <div className="ribbon-star">★</div>
                      <div className="ribbon-tail"></div>
                    </div>
                  </div>

                  <div className="cert-footer">
                    <div className="sign-block">
                      <div className="sign-line">
                        <span className="sign-name">Scorefield Bello</span>
                      </div>
                      <p className="sign-title">Founder &amp; Executive CEO</p>
                    </div>
                    
                    <div className="seal-block">
                      <div className="seal-outer">
                        <div className="seal-inner">
                          <span className="opacity-40">DGG HUB</span>
                          <div className="seal-badge" style={{
                            backgroundColor: inputStatus === "verified" ? "#e6f6f0" : "#f1f5f9",
                            color: inputStatus === "verified" ? "#00875a" : "#64748b",
                            borderColor: inputStatus === "verified" ? "#b3f0db" : "#cbd5e1"
                          }}>
                            {inputStatus === "verified" ? "APPROVED" : "SPECIMEN"}
                          </div>
                          <span>2026</span>
                        </div>
                      </div>
                      <p className="sign-title font-bold text-[#512d7c]">Administrative Office</p>
                    </div>

                    <div className="sign-block" style={{ textAlign: "right" }}>
                      <div className="sign-line">
                        <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 900, color: "#334155" }}>
                          {inputId || "[CREDENTIAL ID]"}
                        </span>
                      </div>
                      <p className="sign-title">Log Date: {inputDate || "[LOG DATE]"}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}