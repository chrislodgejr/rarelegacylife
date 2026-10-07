import "server-only";

import { createHmac, randomBytes } from "node:crypto";

// Sends each public form to Endless One, Rare Legacy's system of record (Endless One's docs/RARE-LEGACY-REBUILD.md Section 11,
// step RL-4). Only while ENDLESS_ONE_INTAKE_URL and ENDLESS_ONE_INTAKE_SECRET are both set; otherwise nothing is sent and the
// site works exactly as before.
//
// Every request is signed with the shared secret: "v1=" + hex(HMAC-SHA256(secret, "v1:{timestamp}:{nonce}:{body}")), with the Unix
// timestamp and a fresh one-use nonce in their own headers. Endless One refuses an unsigned, stale or replayed request.
//
// The caller sends first and then saves the site's own copy whatever the answer, so no submission is ever lost: a failure here is
// logged (form, status and error code only, never the person's details) and the site keeps the record. Both copies carry one id
// (the submission id is the site's own row id), so Endless One's later one-time copy of the site never doubles a record.

export type IntakeForm = "quote" | "retirement" | "contact";

export type IntakeConsent = {
  kind: "tcpa" | "privacy" | "sms" | "email_marketing";
  given: boolean;
  text: string;
  version?: string | null;
  at: string;
};

export type IntakePayload = {
  version: 1;
  form: IntakeForm;
  submissionId: string;
  submittedAt: string;
  person: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone?: string | null;
    state?: string | null;
    postalCode?: string | null;
    dateOfBirth?: string | null;
  };
  quote?: {
    coveragePurpose: string;
    desiredCoverageAmount: number | null;
    maritalStatus: string | null;
    dependents: number | null;
    currentCoverage: string | null;
    preferredContactMethod: string;
    bestTimeToContact: string | null;
    health: { tobaccoUse: boolean; healthRating: string; medicalConditions: string | null };
  };
  retirement?: { meetingStyle: string; bestTimeToContact: string; question: string | null };
  contact?: { inquiryType: string; message: string };
  consents: IntakeConsent[];
  page?: { url: string | null };
  attribution?: { source: string | null; medium: string | null; campaign: string | null };
  client?: { ip: string | null };
};

export type IntakeResult =
  | { sent: false }
  | { sent: true; ok: boolean; status: number; outcome: string | null; error: string | null };

const TIMEOUT_MS = 5_000;
// Answers that a second try cannot change: the switch is off, nothing is set up yet, or the underwriting key is missing.
const FINAL_ERRORS = new Set(["intake_off", "not_configured", "not_ready", "underwriting_key_missing", "underwriting_key_changed"]);

function configuration() {
  const url = process.env.ENDLESS_ONE_INTAKE_URL?.trim();
  const secret = process.env.ENDLESS_ONE_INTAKE_SECRET?.trim();
  if (!url || !secret) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { url, secret };
}

/** Whether the site sends its forms to Endless One. */
export function endlessOneIntakeConfigured() {
  return configuration() !== null;
}

/** The signature Endless One checks for one request. */
export function intakeSignature(secret: string, timestamp: string, nonce: string, body: string) {
  return `v1=${createHmac("sha256", secret).update(`v1:${timestamp}:${nonce}:${body}`).digest("hex")}`;
}

async function attempt(url: string, secret: string, raw: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = randomBytes(24).toString("base64url");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rl-intake-site": "rarelegacylife",
        "x-rl-intake-timestamp": timestamp,
        "x-rl-intake-nonce": nonce,
        "x-rl-intake-signature": intakeSignature(secret, timestamp, nonce, raw),
      },
      body: raw,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    let answer: { outcome?: unknown; error?: unknown } = {};
    try {
      answer = await response.json();
    } catch {
      answer = {};
    }
    return {
      status: response.status,
      ok: response.ok,
      outcome: typeof answer.outcome === "string" ? answer.outcome : null,
      error: typeof answer.error === "string" ? answer.error : null,
    };
  } catch (error) {
    return { status: 0, ok: false, outcome: null, error: error instanceof Error ? error.name : "network_error" };
  }
}

/**
 * Sends one submission to Endless One. Never throws. A network failure or a server error is tried once more (with a new nonce;
 * Endless One answers a repeat of the same submission without making a second lead).
 */
export async function sendToEndlessOne(payload: IntakePayload): Promise<IntakeResult> {
  const config = configuration();
  if (!config) return { sent: false };
  const raw = JSON.stringify(payload);
  let result = await attempt(config.url, config.secret, raw);
  if (!result.ok && (result.status === 0 || result.status >= 500) && !FINAL_ERRORS.has(result.error ?? "")) {
    result = await attempt(config.url, config.secret, raw);
  }
  if (!result.ok) {
    console.error("Endless One intake did not take the submission; the site keeps its own copy", {
      form: payload.form,
      status: result.status,
      error: result.error,
    });
  }
  return { sent: true, ...result };
}

// ---- Shaping the form's answers as Endless One checks them ----------------------------------------------------------

/** Text trimmed to Endless One's limit, or null when empty. */
export function clip(value: string | null | undefined, max: number) {
  const text = (value ?? "").trim();
  return text ? text.slice(0, max) : null;
}

/** A phone number with only the characters Endless One keeps (digits, +, parentheses, dots, dashes and spaces). */
export function phoneForIntake(value: string | null | undefined) {
  const text = (value ?? "").replace(/[^+0-9() .-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
  return text.replace(/\D/g, "").length >= 7 ? text : null;
}

/** A date of birth as YYYY-MM-DD. */
export function dayForIntake(value: string | null | undefined) {
  const text = (value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString().slice(0, 10);
}

/** The page the form was sent from, when it is a web address. */
export function pageForIntake(value: string | null | undefined) {
  const text = (value ?? "").trim();
  return /^https?:\/\/\S+$/.test(text) && text.length <= 2000 ? text : null;
}

/** A full name as first name and the rest. */
export function splitName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return { firstName: clip(parts[0], 100), lastName: clip(parts.slice(1).join(" "), 100) };
}
