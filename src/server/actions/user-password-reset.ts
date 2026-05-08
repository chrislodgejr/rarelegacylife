"use server";

import { requireRole } from "@/lib/auth/session";
import { sendPasswordResetEmail } from "@/server/actions/password-reset-email";

export type UserPasswordResetState = { ok: boolean; message: string };

export async function sendUserPasswordReset(_state: UserPasswordResetState, formData: FormData) {
  await requireRole(["admin"]);
  return sendPasswordResetEmail({ ok: false, message: "" }, formData);
}
