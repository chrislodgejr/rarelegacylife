"use server";

import { sendEmail } from "@/lib/email/provider";
import { createAdminClient } from "@/lib/supabase/admin";

export type PasswordResetEmailState = {
  ok: boolean;
  message: string;
};

export async function sendPasswordResetEmail(
  _state: PasswordResetEmailState,
  formData: FormData,
): Promise<PasswordResetEmailState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";

  if (!origin) {
    return { ok: false, message: "Password reset is missing the public site URL configuration." };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/reset-password` },
  });

  const recoveryToken = data?.properties?.hashed_token;

  if (error || !recoveryToken) {
    console.error("Password reset link generation failed", error);
    return { ok: false, message: "Password reset link could not be created." };
  }

  const resetLink = `${origin}/auth/reset?token_hash=${encodeURIComponent(recoveryToken)}&type=recovery`;

  try {
    const result = await sendEmail({
      to: email,
      subject: "Reset your Rare Legacy Life password",
      text: `Use this secure link to reset your Rare Legacy Life password: ${resetLink}`,
      html: `<p>Use the secure link below to reset your Rare Legacy Life password.</p><p><a href="${resetLink}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });

    if (result.skipped) {
      return { ok: false, message: "Password reset email is not configured. Check Resend settings." };
    }
  } catch (sendError) {
    console.error("Password reset email failed", sendError);
    return { ok: false, message: "Password reset email could not be sent." };
  }

  return { ok: true, message: "If an account exists, a password reset link has been sent." };
}
