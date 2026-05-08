"use server";

import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type UserPasswordResetState = { ok: boolean; message: string };

export async function sendUserPasswordReset(_state: UserPasswordResetState, formData: FormData) {
  await requireRole(["admin"]);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Valid email is required." };
  }

  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset`,
  });

  if (error) {
    console.error("Admin reset email failed", error);
    return { ok: false, message: "Password reset email could not be sent." };
  }

  return { ok: true, message: "Password reset email sent." };
}
