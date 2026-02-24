"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type TutorProfile = {
  full_name: string | null;
  email: string | null;
  bio: string | null;
  expertise: string | null;
  avatar_url: string | null;
  website: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  created_at: string | null;
};

export default function TutorProfilePage() {
  const supabase = createBrowser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<TutorProfile>({
    full_name: "",
    email: "",
    bio: "",
    expertise: "",
    avatar_url: "",
    website: "",
    linkedin_url: "",
    twitter_url: "",
    created_at: "",
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        redirect("/login");
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "full_name, email, bio, expertise, avatar_url, website, linkedin_url, twitter_url, created_at"
        )
        .eq("id", session!.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setError("Failed to load profile");
        setLoading(false);
        return;
      }

      const safeProfile: TutorProfile = {
        full_name: data?.full_name ?? "",
        email: data?.email ?? session!.user.email ?? "",
        bio: data?.bio ?? "",
        expertise: data?.expertise ?? "",
        avatar_url: data?.avatar_url ?? "",
        website: data?.website ?? "",
        linkedin_url: data?.linkedin_url ?? "",
        twitter_url: data?.twitter_url ?? "",
        created_at: data?.created_at ?? null,
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
          bio: profile.bio || null,
          expertise: profile.expertise || null,
          avatar_url: profile.avatar_url || null,
          website: profile.website || null,
          linkedin_url: profile.linkedin_url || null,
          twitter_url: profile.twitter_url || null,
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

  const initials =
    (profile.full_name && profile.full_name.charAt(0).toUpperCase()) ||
    (profile.email && profile.email.charAt(0).toUpperCase()) ||
    "T";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="tutor" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">
              Tutor Profile
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              This is your public teaching profile students will see.
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

        <div className="bg-white rounded-2xl shadow p-6 max-w-2xl space-y-6">
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
                {profile.full_name || "Tutor"}
              </p>
              <p className="text-sm text-gray-600">{profile.email}</p>
              {profile.created_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Joined {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
            <div>
              <p className="font-semibold text-[#512d7c] mb-1">Bio</p>
              <p>{profile.bio || "No bio added yet."}</p>
            </div>
            <div>
              <p className="font-semibold text-[#512d7c] mb-1">Expertise</p>
              <p>{profile.expertise || "Not specified"}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-[#512d7c]">Website</span>
              <span className="text-sm text-gray-700 break-all">
                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#512d7c] hover:underline"
                  >
                    {profile.website}
                  </a>
                ) : (
                  "Not set"
                )}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-[#512d7c]">LinkedIn</span>
              <span className="text-sm text-gray-700 break-all">
                {profile.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#512d7c] hover:underline"
                  >
                    {profile.linkedin_url}
                  </a>
                ) : (
                  "Not set"
                )}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="font-semibold text-[#512d7c]">Twitter / X</span>
              <span className="text-sm text-gray-700 break-all">
                {profile.twitter_url ? (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#512d7c] hover:underline"
                  >
                    {profile.twitter_url}
                  </a>
                ) : (
                  "Not set"
                )}
              </span>
            </div>
          </div>

          {isEditing && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-sm border-t border-gray-100 pt-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
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
                    Website / portfolio
                  </label>
                  <input
                    type="url"
                    value={profile.website ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, website: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="https://your-site.com"
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
                  rows={4}
                  placeholder="Describe your teaching style, background, and who you love teaching."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Expertise (comma separated)
                </label>
                <input
                  type="text"
                  value={profile.expertise ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, expertise: e.target.value }))
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  placeholder="e.g. Next.js, Supabase, UI/UX"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin_url ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        linkedin_url: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Twitter / X URL
                  </label>
                  <input
                    type="url"
                    value={profile.twitter_url ?? ""}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        twitter_url: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full sm:w-auto px-6 py-2.5 bg-[#512d7c] text-xs sm:text-sm font-semibold text-white rounded-full hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
