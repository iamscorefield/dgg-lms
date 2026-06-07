import { createServer } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default async function PublicVerificationPage({ params }: VerifyPageProps) {
  const credentialId = params.id.toUpperCase();
  const supabase = await createServer();

  // Extract the shorthand database matching profile string sequence from the parameter input
  // e.g., if code is "DGG-PR-ABC12345", the segment parsed into the database query is "ABC12345"
  const userShortId = credentialId.split("-").pop() || "";

  // Query your profiles matrix to look for a matching student record entry
  const { data: student, error } = await supabase
    .from("profiles")
    .select("full_name, created_at, membership_status, role")
    .filter("id", "ilike", `${userShortId}%`)
    .maybeSingle();

  const isValid = student && student.role === "student";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-[#512d7c]/10 text-slate-800 font-sans">
      
      {/* Central Interactive Status Card Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 max-w-lg w-full text-center shadow-xl shadow-slate-100 relative overflow-hidden">
        
        {/* Decorative Top Accent Branding Trim Banner */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#512d7c] via-[#f2b42c] to-[#361d53]" />

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-8 mt-2">
          <div className="h-7 w-7 rounded-md bg-[#512d7c] flex items-center justify-center text-white font-black italic text-xs">
            D
          </div>
          <div className="flex flex-col text-left -space-y-1">
            <span className="font-black text-[12px] tracking-tight text-[#512d7c]">D-GLOBAL</span>
            <span className="font-bold text-[8px] text-[#f2b42c] tracking-widest uppercase">GROWTHFIELD</span>
          </div>
        </div>

        {isValid ? (
          /* ✅ VERIFIED DATA VIEW CARD MODULE */
          <div className="space-y-6">
            <div className="inline-flex h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full items-center justify-center text-2xl border border-emerald-100 shadow-sm animate-bounce [animation-duration:3s]">
              ✓
            </div>
            
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Verified Credential Authentic
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-3">
                {student.full_name}
              </h2>
              <p className="text-xs font-semibold text-slate-400 font-mono tracking-tight mt-1">
                Security Key Node: {credentialId}
              </p>
            </div>

            {/* Complete Informational Meta Details Ledger Section */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 text-xs space-y-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Issuing Body:</span>
                <span className="font-black text-slate-800">D-Global Growthfield Limited</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Program Clearance:</span>
                <span className="font-black text-[#512d7c] uppercase bg-purple-50 px-2 py-0.5 rounded border border-purple-100 text-[10px]">
                  {credentialId.includes("-PR-") ? "Foundational 8-Core Prep" : "Main Track Graduate"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Onboarding Genesis:</span>
                <span className="font-mono font-bold text-slate-700">
                  {student.created_at ? new Date(student.created_at).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-sm mx-auto italic">
              This digital record ledger page confirms the recipient has cleared all technical projects, code review validations, and curriculum requirements hosted inside DGG Academy.
            </p>
          </div>
        ) : (
          /* ❌ INVALID CREDENTIAL EXCEPTION NOTIFIER VIEW CARD */
          <div className="space-y-6 py-4">
            <div className="inline-flex h-16 w-16 bg-red-50 text-red-500 rounded-full items-center justify-center text-2xl border border-red-100 shadow-xs">
              ⚠️
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest border border-red-200 bg-red-50 px-2.5 py-0.5 rounded-full">
                Verification Failure
              </span>
              <h2 className="text-lg font-black text-slate-800 tracking-tight mt-3">
                Invalid Ledger Credential Code
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                The security key token reference string <span className="font-mono font-bold text-slate-700 break-all">{credentialId}</span> could not be authenticated against our active student registry database records.
              </p>
            </div>
          </div>
        )}

        {/* Footer Link Navigation Back to Headquarters website */}
        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
          <a 
            href="https://www.dglobalgrowthfield.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-black uppercase tracking-widest text-[#512d7c] hover:text-[#f2b42c] hover:underline transition-colors focus:outline-none"
          >
            ← Return to D-Global Growthfield
          </a>
        </div>

      </div>
    </div>
  );
}