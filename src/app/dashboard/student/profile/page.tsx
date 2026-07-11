"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import { Award, Shield, User, Phone, Mail, Calendar, Key, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

type StudentProfile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
  tracking_id: string | null;
  is_2fa_enabled: boolean;
  two_fa_enabled_at: string | null;
};

export default function StudentProfilePage() {
  const supabase = createBrowser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    avatar_url: "",
    created_at: "",
    tracking_id: "",
    is_2fa_enabled: false,
    two_fa_enabled_at: null,
  });

  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [currentFactorId, setCurrentFactorId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setSecurityError(null);
      setSecuritySuccess(null);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, email, phone, bio, avatar_url, created_at, tracking_id, is_2fa_enabled, two_fa_enabled_at"
        )
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        setError("Failed to load profile details");
        setLoading(false);
        return;
      }

      const fallbackTrackingId = data?.tracking_id || session.user.id.slice(0, 8).toUpperCase();

      setProfile({
        full_name: data?.full_name ?? "",
        email: data?.email ?? session.user.email ?? "",
        phone: data?.phone ?? "",
        bio: data?.bio ?? "",
        avatar_url: data?.avatar_url ?? "",
        created_at: data?.created_at ?? null,
        tracking_id: fallbackTrackingId,
        is_2fa_enabled: data?.is_2fa_enabled ?? false,
        two_fa_enabled_at: data?.two_fa_enabled_at ?? null,
      });
      setLoading(false);
    }

    loadProfile();
  }, [supabase, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credential ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name || null,
          phone: profile.phone || null,
          bio: profile.bio || null,
          avatar_url: profile.avatar_url || null,
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setSuccess("Profile metrics synced successfully.");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile record.");
    } finally {
      setSaving(false);
    }
  }

  // NATIVE CLIENT-SIDE MFA FLOW
  async function handleStart2FA() {
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);

    try {
      // 1. Clean out any old hanging unverified factors first
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      // FIXED: Cast f.status to string to safely bypass type-strictness limitations
      const unverifiedFactors = factors?.totp?.filter(f => (f.status as string) === "unverified") || [];
      for (const f of unverifiedFactors) {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }

      // 2. Enroll directly on the browser client instance
      const { data, error: enrollErr } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "DGG Academy",
        friendlyName: "Google Authenticator Node"
      });

      if (enrollErr) throw enrollErr;

      setCurrentFactorId(data.id);
      setQrCodeUrl(data.totp.qr_code || null);
      setShow2FASetup(true);
      setSecuritySuccess("Scan the dynamic token QR graphic to bind verification records.");
    } catch (err: any) {
      setSecurityError(err.message || "MFA Initialization failed.");
    } finally {
      setSecurityLoading(false);
    }
  }

  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    if (!currentFactorId) return;
    
    setSecurityLoading(true);
    setSecurityError(null);

    try {
      // Challenge and verify directly in the browser
      const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
        factorId: currentFactorId,
        code: verifyCode.trim()
      });

      if (verifyErr) throw verifyErr;

      const { data: { session } } = await supabase.auth.getSession();
      const timestamp = new Date().toISOString();

      // Update your custom dashboard profiles schema 
      await supabase
        .from("profiles")
        .update({ is_2fa_enabled: true, two_fa_enabled_at: timestamp })
        .eq("id", session?.user.id);

      setProfile((p) => ({ ...p, is_2fa_enabled: true, two_fa_enabled_at: timestamp }));
      setShow2FASetup(false);
      setVerifyCode("");
      setSecuritySuccess("Two-factor authentication verified and enabled securely.");
      toast.success("MFA Activation Confirmed!");
    } catch (err: any) {
      setSecurityError(err.message || "Invalid authentication code validation.");
    } finally {
      setSecurityLoading(false);
    }
  }

  async function handleDisable2FA() {
    setSecurityLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      // FIXED: Cast f.status to string to check safely here too
      const activeFactor = factors?.totp?.find(f => (f.status as string) === "verified" || (f.status as string) === "unverified");
      
      if (activeFactor) {
        await supabase.auth.mfa.unenroll({ factorId: activeFactor.id });
      }

      await supabase
        .from("profiles")
        .update({ is_2fa_enabled: false, two_fa_enabled_at: null })
        .eq("id", session?.user.id);

      setProfile((p) => ({ ...p, is_2fa_enabled: false, two_fa_enabled_at: null }));
      setSecuritySuccess("Two-factor structural barriers turned off cleanly.");
    } catch (err: any) {
      setSecurityError("Failed to deactivate protection matrices.");
    } finally {
      setSecurityLoading(false);
    }
  }

  const initials = profile.full_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || "S";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#faf9fc]">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-10 font-mono text-xs uppercase tracking-widest text-[#512d7c] animate-pulse">
          Retrieving academic profile records...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf9fc] text-slate-800 font-sans antialiased">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 space-y-8 overflow-hidden">
        
        {/* Banner Title Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/60 text-left">
          <div>
            <h1 className="text-3xl font-black text-[#512d7c] tracking-tight">Student Workspace Profile</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-0.5">
              Manage your personal enrollment data fields and secure your certificate identification protocols.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              setSuccess(null);
              setError(null);
              setSecurityError(null);
              setSecuritySuccess(null);
            }}
            className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
              isEditing
                ? "border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                : "border-[#512d7c] bg-[#512d7c] text-white hover:bg-[#3f2160] shadow-xs"
            }`}
          >
            {isEditing ? "Cancel Edit" : "Modify Details"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* LEFT/MIDDLE PROFILE METRIC MANAGEMENT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 text-left">
              {error && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">{error}</div>}
              {success && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">{success}</div>}

              {/* View Layout Context Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                <div className="h-20 w-20 rounded-2xl bg-[#512d7c] text-white flex items-center justify-center text-3xl font-black overflow-hidden shadow-xs border-4 border-slate-50">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{profile.full_name || "DGG Academic Student"}</h2>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {profile.email}</p>
                  {profile.created_at && (
                    <p className="text-[10px] font-bold text-purple-400 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md mt-2 w-fit flex items-center gap-1">
                      <Calendar size={10} /> Matriculated on {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Read Only Properties Matrix */}
              <div className="space-y-4 text-xs font-medium text-slate-600">
                
                {/* THE CORE TRUST IDENTITY UNIFIED TRACKING STRING BLOCK */}
                <div className="p-4 bg-purple-50/40 border border-purple-100/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#512d7c] flex items-center gap-1">
                      <Award size={12} /> Master Account Verification Prefix
                    </span>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">
                      Primary cryptographic identifier powering your auto-generated PDF degree verification.
                    </p>
                  </div>
                  <div 
                    onClick={() => copyToClipboard(`DGG-MN-${profile.tracking_id}`)}
                    className="bg-white border border-purple-200/80 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer hover:border-[#512d7c] transition-all self-start sm:self-auto group shadow-2xs"
                  >
                    <span className="font-mono font-black text-[#512d7c] text-xs tracking-wider">
                      DGG-MN-{profile.tracking_id || "PENDING"}
                    </span>
                    {copied ? <Check size={13} className="text-emerald-600 animate-scale" /> : <Copy size={13} className="text-slate-400 group-hover:text-[#512d7c]" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><User size={12} /> Legal Full Name</span>
                    <p className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">{profile.full_name || "Not documented"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Phone size={12} /> Registered Telephone</span>
                    <p className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">{profile.phone || "Not linked"}</p>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Student Biography Profile Statement</span>
                  <p className="text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl leading-relaxed">
                    {profile.bio || "No workspace target biography written down yet."}
                  </p>
                </div>
              </div>

              {/* Edit Interactive Sheet UI Form Input Controls */}
              {isEditing && (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Full Name</label>
                      <input
                        type="text"
                        value={profile.full_name ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                        className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all bg-slate-50/30"
                        placeholder="First and last name mapping"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone ?? ""}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                        className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all bg-slate-50/30"
                        placeholder="+234..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Workspace Bio Profile Statement</label>
                    <textarea
                      value={profile.bio ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                      className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all bg-slate-50/30"
                      rows={3}
                      placeholder="Share your system background profile direction goals with mentors..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Avatar Image Path URL</label>
                    <input
                      type="url"
                      value={profile.avatar_url ?? ""}
                      onChange={(e) => setProfile((p) => ({ ...p, avatar_url: e.target.value }))}
                      className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all bg-slate-50/30"
                      placeholder="https://domain.com/avatar.jpg"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full mt-2 py-3 bg-[#512d7c] hover:bg-[#3f2160] text-xs font-black uppercase tracking-widest text-white rounded-xl transition-all disabled:opacity-50 cursor-pointer border-0 shadow-xs"
                  >
                    {saving ? "Syncing Fields..." : "Commit Parameter Updates"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT IDENTITY PROTECTION ACCOUNT SECURITY BAR */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <Shield size={14} className="text-[#512d7c]" /> Account Security
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 leading-normal">
                    Protect access paths using a multi-factor TOTP authenticator signature.
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-mono font-black ${
                  profile.is_2fa_enabled ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {profile.is_2fa_enabled ? "2FA SECURED" : "INACTIVE"}
                </span>
              </div>

              {profile.two_fa_enabled_at && profile.is_2fa_enabled && (
                <p className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit">
                  Activated Lock: {new Date(profile.two_fa_enabled_at).toLocaleDateString()}
                </p>
              )}

              {securityError && <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[11px] font-semibold text-red-600 leading-normal">{securityError}</div>}
              {securitySuccess && <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-[11px] font-semibold text-emerald-700 leading-normal">{securitySuccess}</div>}

              {!profile.is_2fa_enabled && !show2FASetup && (
                <button
                  type="button"
                  onClick={handleStart2FA}
                  disabled={securityLoading}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-950 font-black uppercase tracking-widest text-[10px] border-0 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {securityLoading ? "Fetching API mapping..." : "Initialize 2FA Integration"}
                </button>
              )}

              {profile.is_2fa_enabled && (
                <button
                  type="button"
                  onClick={handleDisable2FA}
                  disabled={securityLoading}
                  className="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] cursor-pointer shadow-2xs"
                >
                  {securityLoading ? "Processing drop..." : "Deactivate Protection Ledger"}
                </button>
              )}

              {/* Interactive TOTP Enrollment UI Block */}
              {show2FASetup && (
                <form onSubmit={handleVerify2FA} className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1.5 text-[11px] font-medium text-slate-500 leading-normal">
                    <p className="m-0 font-bold text-slate-700">Registration Steps:</p>
                    <p className="m-0">1. Scan the custom QR footprint below using standard authenticator keys (Google/Microsoft Auth).</p>
                    <p className="m-0">2. Input the generated 6-digit rolling numerical passphrase code into the entry field below to authenticate integration tokens.</p>
                  </div>

                  {qrCodeUrl && (
                    <div className="p-2 border border-slate-200 bg-white rounded-xl w-fit mx-auto shadow-2xs">
                      <img src={qrCodeUrl} alt="TOTP Secure QR Code Matrix" className="h-36 w-36 object-contain" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Key size={11} /> Multi-Factor Verification Pin</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                      className="block w-full rounded-xl border border-slate-200 px-4 py-2 text-center text-sm tracking-[0.5em] font-mono font-black focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] bg-slate-50/50 text-black"
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={securityLoading || verifyCode.length < 6}
                      className="flex-1 py-2.5 bg-[#512d7c] hover:bg-[#3f2160] font-black uppercase tracking-widest text-[10px] text-white rounded-xl border-0 cursor-pointer shadow-xs disabled:opacity-40"
                    >
                      {securityLoading ? "Validating..." : "Confirm Bind"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShow2FASetup(false);
                        setQrCodeUrl(null);
                        setVerifyCode("");
                        setSecurityError(null);
                        setSecuritySuccess(null);
                      }}
                      className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] rounded-xl cursor-pointer"
                    >
                      Abort
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}