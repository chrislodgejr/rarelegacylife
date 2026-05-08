"use server";

import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { z } from "zod";
import { sendEmail } from "@/lib/email/provider";
import { createAdminClient } from "@/lib/supabase/admin";

export type QuoteVerificationState = {
  ok: boolean;
  message: string;
  verificationId?: string;
};

const emailSchema = z.string().trim().email("Enter a valid email").toLowerCase();
const pinSchema = z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code from your email.");
const idSchema = z.string().uuid();
const ttlMinutes = 10;

export async function sendQuoteVerification(email: string): Promise<QuoteVerificationState> {
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return { ok: false, message: parsedEmail.error.issues[0]?.message ?? "Enter a valid email." };
  }

  const normalizedEmail = parsedEmail.data;
  const pin = randomInt(100000, 1000000).toString();
  const salt = randomBytes(16).toString("hex");
  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from("quote_email_verifications")
    .insert({
      email: normalizedEmail,
      code_hash: makeStoredValue(salt, pin),
      expires_at: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !row) {
    console.error("Quote verification record failed", error);
    return { ok: false, message: "We could not prepare email verification. Please try again." };
  }

  try {
    const result = await sendEmail({
      to: normalizedEmail,
      subject: "Rare Legacy Life quote verification code",
      text: `Your Rare Legacy Life quote verification code is ${pin}. This code expires in ${ttlMinutes} minutes.`,
      html: `<p>Your Rare Legacy Life quote verification code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${pin}</p><p>This code expires in ${ttlMinutes} minutes.</p>`,
    });

    if (result.skipped) {
      await admin.from("quote_email_verifications").delete().eq("id", row.id);
      return { ok: false, message: "Quote verification email is not configured. Add Resend settings before using quote verification." };
    }
  } catch (sendError) {
    await admin.from("quote_email_verifications").delete().eq("id", row.id);
    console.error("Quote verification email failed", sendError);
    return { ok: false, message: "We could not send the verification email right now. Please try again." };
  }

  return {
    ok: true,
    message: "Verification code sent. Check your email and enter the six-digit code below.",
    verificationId: row.id,
  };
}

export async function confirmQuoteVerification(
  verificationId: string,
  email: string,
  pin: string,
): Promise<QuoteVerificationState> {
  const parsedId = idSchema.safeParse(verificationId);
  const parsedEmail = emailSchema.safeParse(email);
  const parsedPin = pinSchema.safeParse(pin);

  if (!parsedId.success) {
    return { ok: false, message: "Please request a new verification code." };
  }

  if (!parsedEmail.success) {
    return { ok: false, message: parsedEmail.error.issues[0]?.message ?? "Enter a valid email." };
  }

  if (!parsedPin.success) {
    return { ok: false, message: parsedPin.error.issues[0]?.message ?? "Enter the six-digit code from your email." };
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("quote_email_verifications")
    .select("id, email, code_hash, attempts, verified_at, expires_at")
    .eq("id", parsedId.data)
    .maybeSingle<{
      id: string;
      email: string;
      code_hash: string;
      attempts: number;
      verified_at: string | null;
      expires_at: string;
    }>();

  if (!row || row.email !== parsedEmail.data || new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false, message: "That verification code expired. Please request a new code." };
  }

  if (row.verified_at) {
    return { ok: true, message: "Email verified. You can now submit your quote request securely.", verificationId: row.id };
  }

  if (row.attempts >= 5) {
    return { ok: false, message: "Too many incorrect attempts. Please request a new code." };
  }

  if (!matchesStoredValue(row.code_hash, parsedPin.data)) {
    await admin.from("quote_email_verifications").update({ attempts: row.attempts + 1 }).eq("id", row.id);
    return { ok: false, message: "That verification code is incorrect. Please try again." };
  }

  await admin.from("quote_email_verifications").update({ verified_at: new Date().toISOString() }).eq("id", row.id);
  return { ok: true, message: "Email verified. You can now submit your quote request securely.", verificationId: row.id };
}

export async function isQuoteVerificationApproved(verificationId: string, email: string) {
  const parsedId = idSchema.safeParse(verificationId);
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedId.success || !parsedEmail.success) {
    return false;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("quote_email_verifications")
    .select("id")
    .eq("id", parsedId.data)
    .eq("email", parsedEmail.data)
    .not("verified_at", "is", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle<{ id: string }>();

  return Boolean(data);
}

function makeStoredValue(salt: string, pin: string) {
  return `${salt}:${hashPin(salt, pin)}`;
}

function matchesStoredValue(storedValue: string, pin: string) {
  const [salt, storedHash] = storedValue.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const nextHash = hashPin(salt, pin);
  const left = Buffer.from(storedHash);
  const right = Buffer.from(nextHash);

  return left.length === right.length && timingSafeEqual(left, right);
}

function hashPin(salt: string, pin: string) {
  return createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}
