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
  const redirectTo = `${origin}/auth/reset`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (error || !data.properties?.action_link) {
    console.error("Password reset link generation failed", error);
    return { ok: false, message: "Password reset link could not be created." };
  }

  try {
    const result = await sendEmail({
      to: email,
      subject: "Reset your Rare Legacy Life password",
      text: `Use this secure link to reset your Rare Legacy Life password: ${data.properties.action_link}`,
      html: `<p>Use the secure link below to reset your Rare Legacy Life password.</p><p><a href="${data.properties.action_link}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
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
