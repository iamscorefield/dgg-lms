// src/app/api/security/totp/route.ts
import { NextResponse } from "next/server";
import { createServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createServer();

  try {
    const body = await req.json().catch(() => ({}));
    const { action, code } = body as {
      action?: "enroll" | "verify";
      code?: string;
    };

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (action === "enroll") {
      // First check if a TOTP factor already exists for this user
      const factors = await supabase.auth.mfa.listFactors();

      if (factors.error) {
        console.error("MFA listFactors (enroll) error:", factors.error);
        return NextResponse.json(
          { error: factors.error.message || "Failed to list factors" },
          { status: 400 }
        );
      }

      const existingTotp = factors.data?.totp?.[0];

      // If already enrolled, just reuse that factor and its QR (if any)
      if (existingTotp) {
        return NextResponse.json(
          {
            factorId: existingTotp.id,
            factorType: existingTotp.factor_type,
            // We cannot re‑generate the QR code here; user should already have it in their app.
            qrCodeUrl: null,
            message:
              "TOTP already enrolled. Use the code from your authenticator app.",
          },
          { status: 200 }
        );
      }

      // No TOTP factor yet: enroll a new one
      const enroll = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Google Authenticator",
      });

      if (enroll.error || !enroll.data) {
        console.error("MFA enroll error:", enroll.error);
        return NextResponse.json(
          { error: enroll.error?.message || "Failed to start 2FA" },
          { status: 400 }
        );
      }

      const { id, type, totp } = enroll.data;
      const qrCodeUrl = totp?.qr_code || null;

      return NextResponse.json(
        {
          factorId: id,
          factorType: type,
          qrCodeUrl,
          message: "Scan QR code and enter the 6‑digit code.",
        },
        { status: 200 }
      );
    }

    if (action === "verify") {
      if (!code) {
        return NextResponse.json(
          { error: "Verification code is required" },
          { status: 400 }
        );
      }

      // Always read factors fresh before verifying
      const factors = await supabase.auth.mfa.listFactors();

      if (factors.error) {
        console.error("MFA listFactors (verify) error:", factors.error);
        return NextResponse.json(
          { error: factors.error.message || "Failed to list factors" },
          { status: 400 }
        );
      }

      const totpFactor = factors.data?.totp?.[0];

      if (!totpFactor) {
        // At this point, if you scanned the QR but the factor is not here,
        // it means enroll failed and you must restart enrollment.
        return NextResponse.json(
          { error: "No TOTP factor found. Please click Enable 2FA again." },
          { status: 400 }
        );
      }

      const challenge = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challenge.error || !challenge.data) {
        console.error("MFA challenge error:", challenge.error);
        return NextResponse.json(
          { error: challenge.error?.message || "Failed to challenge factor" },
          { status: 400 }
        );
      }

      const verify = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.data.id,
        code,
      });

      if (verify.error || !verify.data) {
        console.error("MFA verify error:", verify.error);
        return NextResponse.json(
          { error: verify.error?.message || "Invalid or expired code" },
          { status: 400 }
        );
      }

      // Mark 2FA as enabled in your profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          is_2fa_enabled: true,
          two_fa_enabled_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        return NextResponse.json(
          {
            error:
              "2FA verified but failed to update profile. Please try again.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Two-factor authentication enabled successfully." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("TOTP route fatal error:", err);
    return NextResponse.json(
      { error: "Unexpected error while handling 2FA." },
      { status: 500 }
    );
  }
}
