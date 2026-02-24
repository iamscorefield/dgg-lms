"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type StudentProfile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
  is_2fa_enabled: boolean;
  two_fa_enabled_at: string | null;
};

export default function StudentProfilePage() {
  const supabase = createBrowser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<StudentProfile>({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    avatar_url: "",
    created_at: "",
    is_2fa_enabled: false,
    two_fa_enabled_at: null,
  });

  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setSecurityError(null);
      setSecuritySuccess(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        redirect("/login");
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, email, phone, bio, avatar_url, created_at, is_2fa_enabled, two_fa_enabled_at"
        )
        .eq("id", session!.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      const safeProfile: StudentProfile = {
        full_name: data?.full_name ?? "",
        email: data?.email ?? session!.user.email ?? "",
        phone: data?.phone ?? "",
        bio: data?.bio ?? "",
        avatar_url: data?.avatar_url ?? "",
        created_at: data?.created_at ?? null,
        is_2fa_enabled: data?.is_2fa_enabled ?? false,
        two_fa_enabled_at: data?.two_fa_enabled_at ?? null,
      };

      setProfile(safeProfile);
      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      redirect("/login");
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
        .eq("id", session!.user.id);

      if (updateError) {
        console.error(updateError);
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // SECURITY: start 2FA setup (call API to enroll)
  async function handleStart2FA() {
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);
    setShow2FASetup(false);
    setQrCodeUrl(null);
    setVerifyCode("");

    try {
      const res = await fetch("/api/security/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enroll" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start 2FA setup");
      }

      setQrCodeUrl(data.qrCodeUrl || null);
      setShow2FASetup(true);
      setSecuritySuccess(
        "Scan the QR code with Google Authenticator or another app, then enter the 6-digit code to finish setup."
      );
    } catch (err: any) {
      setSecurityError(
        err?.message || "Could not start 2FA setup. Please try again."
      );
    } finally {
      setSecurityLoading(false);
    }
  }

  // SECURITY: verify code (call API to challenge+verify)
  async function handleVerify2FA(e: React.FormEvent) {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);

    try {
      if (!verifyCode || verifyCode.length < 6) {
        throw new Error("Enter the 6-digit code from your authenticator app.");
      }

      const res = await fetch("/api/security/totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: verifyCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not verify code. Try again.");
      }

      const now = new Date().toISOString();
      setProfile((p) => ({
        ...p,
        is_2fa_enabled: true,
        two_fa_enabled_at: now,
      }));
      setShow2FASetup(false);
      setQrCodeUrl(null);
      setVerifyCode("");
      setSecuritySuccess(
        data.message || "Two-factor authentication has been enabled."
      );
    } catch (err: any) {
      setSecurityError(err?.message || "Could not verify code. Try again.");
    } finally {
      setSecurityLoading(false);
    }
  }

  // SECURITY: disable 2FA (local only for now)
  async function handleDisable2FA() {
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);

    try {
      setProfile((p) => ({
        ...p,
        is_2fa_enabled: false,
        two_fa_enabled_at: null,
      }));
      setShow2FASetup(false);
      setQrCodeUrl(null);
      setVerifyCode("");
      setSecuritySuccess("Two-factor authentication has been turned off.");
    } catch (err: any) {
      setSecurityError(
        err?.message || "Could not disable 2FA. Please try again."
      );
    } finally {
      setSecurityLoading(false);
    }
  }

  const initials =
    (profile.full_name && profile.full_name.charAt(0).toUpperCase()) ||
    (profile.email && profile.email.charAt(0).toUpperCase()) ||
    "S";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">My Profile</h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              This is your student profile; you can update your details anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditing((prev) => !prev);
              setSuccess(null);
              setError(null);
            }}
            className={`px-4 py-2 text-xs sm:text-sm rounded-full border ${
              isEditing
                ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                : "border-[#512d7c] bg-[#512d7c] text-white hover:bg-[#3f2160]"
            }`}
          >
            {isEditing ? "Cancel edit" : "Edit profile"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start">
          {/* MAIN PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow p-6 max-w-xl space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* VIEW CARD */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#512d7c] text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-[#512d7c]">
                  {profile.full_name || "Student"}
                </p>
                <p className="text-sm text-gray-600">{profile.email}</p>
                {profile.created_at && (
                  <p className="text-xs text-gray-400 mt-1">
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700 border-t border-gray-100 pt-4">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-[#512d7c] shrink-0">
                  Full name
                </span>
                <span className="text-right flex-1">
                  {profile.full_name || "Not set"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-[#512d7c] shrink-0">
                  Email
                </span>
                <span className="text-right flex-1">{profile.email}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-[#512d7c] shrink-0">
                  Phone
                </span>
                <span className="text-right flex-1">
                  {profile.phone || "Not set"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#512d7c] mb-1">Short bio</p>
                <p className="text-sm text-gray-700">
                  {profile.bio || "No bio added yet."}
                </p>
              </div>
            </div>

            {/* EDIT FORM (TOGGLED) */}
            {isEditing && (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-sm border-t border-gray-100 pt-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="+234..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Short bio
                  </label>
                  <textarea
                    value={profile.bio ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    rows={3}
                    placeholder="Tell tutors a bit about your background and goals."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Avatar image URL
                  </label>
                  <input
                    type="url"
                    value={profile.avatar_url ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        avatar_url: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="https://.../avatar.jpg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 w-full py-2.5 bg-[#512d7c] text-xs sm:text-sm font-semibold text-white rounded-full hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            )}
          </div>

          {/* SECURITY CARD */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Security
                </h2>
                <p className="text-xs text-gray-600">
                  Protect your account with a 6‑digit code from an authenticator
                  app.
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  profile.is_2fa_enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {profile.is_2fa_enabled ? "2FA ON" : "2FA OFF"}
              </span>
            </div>

            {profile.two_fa_enabled_at && profile.is_2fa_enabled && (
              <p className="text-[11px] text-gray-500">
                Enabled on{" "}
                {new Date(
                  profile.two_fa_enabled_at
                ).toLocaleDateString()}
              </p>
            )}

            {securityError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {securityError}
              </div>
            )}
            {securitySuccess && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700">
                {securitySuccess}
              </div>
            )}

            {!profile.is_2fa_enabled && !show2FASetup && (
              <button
                type="button"
                onClick={handleStart2FA}
                disabled={securityLoading}
                className="w-full py-2.5 rounded-full bg-black text-xs sm:text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {securityLoading ? "Preparing setup..." : "Enable 2FA (Google Auth)"}
              </button>
            )}

            {profile.is_2fa_enabled && (
              <button
                type="button"
                onClick={handleDisable2FA}
                disabled={securityLoading}
                className="w-full py-2.5 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold text-gray-800 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {securityLoading ? "Working..." : "Turn off 2FA for this account"}
              </button>
            )}

            {/* Setup step UI */}
            {show2FASetup && (
              <form
                onSubmit={handleVerify2FA}
                className="mt-3 space-y-3 border-t border-gray-100 pt-3"
              >
                <p className="text-xs text-gray-600">
                  1. Open Google Authenticator (or any TOTP app).  
                  2. Add a new account.  
                  3. Scan the QR code below.  
                  4. Enter the 6‑digit code from your app.
                </p>

                {qrCodeUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="Scan this QR with your authenticator app"
                    className="mx-auto h-40 w-40 border border-gray-200 rounded-lg bg-white"
                  />
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    6‑digit code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 text-sm tracking-[0.4em] text-center focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="••••••"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={securityLoading}
                    className="flex-1 py-2.5 rounded-full bg-[#512d7c] text-xs sm:text-sm font-semibold text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {securityLoading ? "Verifying..." : "Confirm and enable 2FA"}
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
                    className="px-4 py-2.5 rounded-full border border-gray-300 text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
