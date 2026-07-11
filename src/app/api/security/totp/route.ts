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

    // --- ACTION 1: ENROLL ---
    if (action === "enroll") {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      // FIX 1: Cast f.status to string to safely find "unverified"
      const existingUnverified = factors?.totp?.filter(f => (f.status as string) === "unverified") || [];
      for (const factor of existingUnverified) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data: mfaEnroll, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "DGG Academy",
        friendlyName: "Google Authenticator Node"
      });

      if (enrollError) {
        return NextResponse.json({ error: enrollError.message }, { status: 400 });
      }

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

      // FIX 2: Cast f.status to string here as well to check for "unverified"
      const pendingFactor = factors.totp?.find(f => (f.status as string) === "unverified");
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