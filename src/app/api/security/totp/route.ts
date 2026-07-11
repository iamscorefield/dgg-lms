import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createServer();

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code } = body as { action?: "enroll" | "verify"; code?: string };

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // --- ACTION 1: ENROLL (WITH AUTOMATIC STALE FACTOR CLEANUP) ---
    if (action === "enroll") {
      // 1. Fetch any existing authenticator factors for this user first
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      // 2. If there are any stale "unverified" factors, delete them cleanly so they don't block us
      const existingUnverified = factors?.totp?.filter(f => f.status === "unverified") || [];
      for (const factor of existingUnverified) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      // 3. Now start a fresh enrollment session with zero conflicts
      const { data: mfaEnroll, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "DGG Academy",
        friendlyName: "Google Authenticator Node"
      });

      if (enrollError) {
        return NextResponse.json({ error: enrollError.message }, { status: 400 });
      }

      // Safely register the factor ID to your public profile tracking metadata
      await supabase
        .from("profiles")
        .update({ totp_secret: mfaEnroll.id })
        .eq("id", userId);

      return NextResponse.json({ 
        qrCodeUrl: mfaEnroll.totp.qr_code, 
        message: "Scan QR and input code." 
      }, { status: 200 });
    }

    // --- ACTION 2: VERIFY ---
    if (action === "verify") {
      if (!code) {
        return NextResponse.json({ error: "A 6-digit code is required." }, { status: 400 });
      }

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
        return NextResponse.json({ error: factorsError.message }, { status: 400 });
      }

      const pendingFactor = factors.totp?.find(f => f.status === "unverified");
      if (!pendingFactor) {
        return NextResponse.json({ error: "No active unverified enrollment session found." }, { status: 400 });
      }

      const { error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: pendingFactor.id,
        code: code.trim()
      });

      if (challengeError) {
        return NextResponse.json({ error: `Verification failed: ${challengeError.message}` }, { status: 400 });
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          is_2fa_enabled: true, 
          two_fa_enabled_at: new Date().toISOString() 
        })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json({ error: "Failed to commit local profile 2FA status flags." }, { status: 500 });
      }

      return NextResponse.json({ message: "Two-factor authentication enabled and fully verified successfully." }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid endpoint sequence route." }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: `Server Crash details: ${err?.message || "Unknown Exception"}` }, { status: 500 });
  }
}