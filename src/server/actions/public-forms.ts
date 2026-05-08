"use server";

import { createHmac, randomInt, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit";
import { COVERAGE_LABELS } from "@/lib/constants/options";
import { sendEmail } from "@/lib/email/provider";
import { findAgentForLead } from "@/lib/lead-assignment";
import { calculateLeadScore } from "@/lib/lead-scoring";
import {
  sendAgentApplicationNotification,
  sendContactMessageNotification,
  sendNewLeadNotification,
} from "@/lib/notifications";
import { createCrmNotification, notifyAdmins } from "@/lib/notifications/db";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  agentApplicationSchema,
  contactFormSchema,
  quoteFormSchema,
} from "@/lib/validation/forms";

export type FormState = {
  ok: boolean;
  message: string;
};

const defaultError = {
  ok: false,
  message: "Please check the form and try again.",
};

const quoteEmailSchema = z.string().trim().email("Enter a valid email").toLowerCase();
const quoteOtpSchema = z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code from your email.");
const QUOTE_OTP_COOKIE = "rll_quote_otp";
const QUOTE_VERIFIED_COOKIE = "rll_quote_verified";
const QUOTE_OTP_TTL_SECONDS = 10 * 60;
const QUOTE_VERIFIED_TTL_SECONDS = 30 * 60;

type QuoteOtpPayload = {
  email: string;
  codeHash: string;
  expiresAt: number;
};

type QuoteVerifiedPayload = {
  email: string;
  verifiedAt: number;
  expiresAt: number;
};

export async function sendQuoteOtpCode(email: string): Promise<FormState> {
  const parsedEmail = quoteEmailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return { ok: false, message: parsedEmail.error.issues[0]?.message ?? "Enter a valid email." };
  }

  const normalizedEmail = parsedEmail.data;
  const code = randomInt(100000, 1000000).toString();
  const expiresAt = Date.now() + QUOTE_OTP_TTL_SECONDS * 1000;

  try {
    const result = await sendEmail({
      to: normalizedEmail,
      subject: "Rare Legacy Life quote verification code",
      text: `Your Rare Legacy Life quote verification code is ${code}. This code expires in 10 minutes.`,
      html: `<p>Your Rare Legacy Life quote verification code is:</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${code}</p><p>This code expires in 10 minutes.</p>`,
    });

    if (result.skipped) {
      return {
        ok: false,
        message: "Quote verification email is not configured. Add RESEND_API_KEY and RESEND_FROM_EMAIL before using quote verification.",
      };
    }
  } catch (error) {
    console.error("Quote OTP email failed", error);
    return {
      ok: false,
      message: "We could not send the verification email right now. Please try again.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    QUOTE_OTP_COOKIE,
    signCookie<QuoteOtpPayload>({
      email: normalizedEmail,
      codeHash: hashOtp(normalizedEmail, code),
      expiresAt,
    }),
    secureCookieOptions(QUOTE_OTP_TTL_SECONDS),
  );
  cookieStore.delete(QUOTE_VERIFIED_COOKIE);

  return { ok: true, message: "Verification code sent. Check your email and enter the six-digit code below." };
}

export async function verifyQuoteOtpCode(email: string, code: string): Promise<FormState> {
  const parsedEmail = quoteEmailSchema.safeParse(email);
  const parsedCode = quoteOtpSchema.safeParse(code);

  if (!parsedEmail.success) {
    return { ok: false, message: parsedEmail.error.issues[0]?.message ?? "Enter a valid email." };
  }

  if (!parsedCode.success) {
    return { ok: false, message: parsedCode.error.issues[0]?.message ?? "Enter the six-digit code from your email." };
  }

  const normalizedEmail = parsedEmail.data;
  const cookieStore = await cookies();
  const payload = readSignedCookie<QuoteOtpPayload>(cookieStore.get(QUOTE_OTP_COOKIE)?.value);

  if (!payload || payload.email !== normalizedEmail || payload.expiresAt < Date.now()) {
    return { ok: false, message: "That verification code expired. Please request a new code." };
  }

  if (!safeEqual(payload.codeHash, hashOtp(normalizedEmail, parsedCode.data))) {
    return { ok: false, message: "That verification code is incorrect. Please try again." };
  }

  cookieStore.set(
    QUOTE_VERIFIED_COOKIE,
    signCookie<QuoteVerifiedPayload>({
      email: normalizedEmail,
      verifiedAt: Date.now(),
      expiresAt: Date.now() + QUOTE_VERIFIED_TTL_SECONDS * 1000,
    }),
    secureCookieOptions(QUOTE_VERIFIED_TTL_SECONDS),
  );
  cookieStore.delete(QUOTE_OTP_COOKIE);

  return { ok: true, message: "Email verified. You can now submit your quote request securely." };
}

export async function submitQuoteForm(_previousState: FormState, formData: FormData) {
  const parsed = quoteFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? defaultError.message,
    };
  }

  const input = parsed.data;
  const verifiedEmail = await getVerifiedQuoteEmail();

  if (verifiedEmail !== input.email) {
    return {
      ok: false,
      message: "Please verify the quote email with the one-time code before submitting.",
    };
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent");
  const ipAddress = getIpAddress(headerStore);
  const sourceUrl = input.landing_page ?? headerStore.get("referer");
  const admin = createAdminClient();
  const score = calculateLeadScore(input);
  const assignment = await findAgentForLead(admin, input.state);
  const now = new Date().toISOString();
  const staleAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .insert({
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      date_of_birth: input.date_of_birth,
      state: input.state,
      zip_code: input.zip_code,
      marital_status: input.marital_status,
      dependents: input.dependents,
      desired_coverage_amount: input.desired_coverage_amount ?? null,
      coverage_purpose: input.coverage_purpose,
      tobacco_use: input.tobacco_use,
      health_rating: input.health_rating,
      medical_conditions: input.medical_conditions,
      current_coverage: input.current_coverage,
      preferred_contact_method: input.preferred_contact_method,
      best_time_to_contact: input.best_time_to_contact,
      source: "website_quote_form",
      status: assignment.agent ? "assigned" : "new",
      lead_score: score.lead_score,
      lead_grade: score.lead_grade,
      lead_temperature: score.lead_temperature,
      lead_score_breakdown: score.lead_score_breakdown,
      quote_email_otp_verified: true,
      quote_email_otp_verified_at: now,
      quote_auth_user_id: null,
      assigned_agent_id: assignment.agent?.id ?? null,
      assigned_at: assignment.agent ? now : null,
      last_activity_at: now,
      stale_at: staleAt,
      consent_tcpa: input.consent_tcpa,
      consent_privacy: input.consent_privacy,
      consent_sms: input.consent_sms,
      consent_email_marketing: input.consent_email_marketing,
      consent_timestamp: now,
      consent_ip: ipAddress,
      consent_user_agent: userAgent,
      consent_source_url: sourceUrl,
      utm_source: input.utm_source,
      utm_medium: input.utm_medium,
      utm_campaign: input.utm_campaign,
      utm_content: input.utm_content,
      utm_term: input.utm_term,
      landing_page: sourceUrl,
      referrer: input.referrer ?? headerStore.get("referer"),
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (leadError || !lead) {
    console.error("Lead insert failed", leadError);
    return {
      ok: false,
      message: "We could not submit your request. Please try again.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.delete(QUOTE_VERIFIED_COOKIE);

  await admin.from("consent_records").insert([
    buildConsentRecord(lead.id, "tcpa", input.consent_tcpa, now, ipAddress, userAgent, sourceUrl),
    buildConsentRecord(lead.id, "privacy", input.consent_privacy, now, ipAddress, userAgent, sourceUrl),
    buildConsentRecord(lead.id, "sms", input.consent_sms, now, ipAddress, userAgent, sourceUrl),
    buildConsentRecord(
      lead.id,
      "email_marketing",
      input.consent_email_marketing,
      now,
      ipAddress,
      userAgent,
      sourceUrl,
    ),
  ]);

  if (assignment.agent) {
    await admin
      .from("agents")
      .update({
        current_active_leads: assignment.agent.current_active_leads + 1,
        last_assigned_at: now,
      })
      .eq("id", assignment.agent.id);

    await admin.from("lead_assignments").insert({
      lead_id: lead.id,
      agent_id: assignment.agent.id,
      assignment_reason: assignment.reason,
      assigned_at: now,
      active: true,
    });
  }

  await admin.from("lead_activity").insert([
    {
      lead_id: lead.id,
      activity_type: "lead_created",
      description: "Lead submitted through the public quote form.",
      metadata: {
        source: "website_quote_form",
        lead_score: score.lead_score,
        lead_grade: score.lead_grade,
        lead_temperature: score.lead_temperature,
        lead_score_breakdown: score.lead_score_breakdown,
        lead_score_reasons: score.lead_score_reasons,
        quote_email_otp_verified: true,
      },
    },
    {
      lead_id: lead.id,
      activity_type: "lead_graded",
      description: `Lead graded as ${score.lead_grade} / ${titleCase(score.lead_temperature)} with score ${score.lead_score}.`,
      metadata: {
        lead_score: score.lead_score,
        lead_grade: score.lead_grade,
        lead_temperature: score.lead_temperature,
        lead_score_breakdown: score.lead_score_breakdown,
        lead_score_reasons: score.lead_score_reasons,
      },
    },
    {
      lead_id: lead.id,
      activity_type: assignment.agent ? "lead_assigned" : "lead_unassigned",
      description: assignment.agent
        ? `Lead assigned to ${assignment.agent.first_name} ${assignment.agent.last_name}.`
        : "No active licensed agent was available for automatic assignment.",
      metadata: {
        reason: assignment.reason,
        assigned_agent_id: assignment.agent?.id ?? null,
      },
    },
  ]);

  await createAuditLog({
    action: "lead_created",
    entityType: "lead",
    entityId: lead.id,
    description: "Lead created from public quote form.",
    metadata: {
      assigned_agent_id: assignment.agent?.id ?? null,
      lead_score: score.lead_score,
      lead_grade: score.lead_grade,
      lead_temperature: score.lead_temperature,
      lead_score_breakdown: score.lead_score_breakdown,
    },
    ipAddress,
    userAgent,
  });

  try {
    await sendNewLeadNotification({
      leadId: lead.id,
      leadName: `${input.first_name} ${input.last_name}`,
      state: input.state,
      coveragePurpose: COVERAGE_LABELS[input.coverage_purpose],
      leadScore: score.lead_score,
      leadGrade: score.lead_grade,
      leadTemperature: score.lead_temperature,
      assignedAgentEmail: assignment.agent?.email,
    });
  } catch (error) {
    console.error("New lead notification failed", error);
  }

  await notifyAdmins({
    leadId: lead.id,
    title: assignment.agent ? `New ${score.lead_grade} lead assigned` : `New unassigned ${score.lead_grade} lead`,
    body: `${input.first_name} ${input.last_name} submitted a ${score.lead_temperature} quote request in ${input.state}.`,
    notificationType: "new_lead",
    priority: score.lead_temperature === "hot" ? "urgent" : "medium",
  });

  if (assignment.agent?.profile_id) {
    await createCrmNotification({
      profileId: assignment.agent.profile_id,
      leadId: lead.id,
      title: `New ${score.lead_grade} ${score.lead_temperature} lead assigned`,
      body: `${input.first_name} ${input.last_name} is ready for follow-up.`,
      notificationType: "lead_assigned",
      priority: score.lead_temperature === "hot" ? "urgent" : "medium",
    });
  }

  redirect("/thank-you");
}

export async function submitContactForm(_previousState: FormState, formData: FormData) {
  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? defaultError.message,
    };
  }

  const input = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone,
    inquiry_type: input.inquiry_type,
    message: input.message,
    status: "new",
  });

  if (error) {
    console.error("Contact insert failed", error);
    return { ok: false, message: "We could not send your message. Please try again." };
  }

  try {
    await sendContactMessageNotification({
      name: input.name,
      email: input.email,
      inquiryType: input.inquiry_type,
    });
  } catch (notificationError) {
    console.error("Contact notification failed", notificationError);
  }

  return { ok: true, message: "Thanks. Your message has been received." };
}

export async function submitAgentApplication(_previousState: FormState, formData: FormData) {
  const parsed = agentApplicationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? defaultError.message,
    };
  }

  const input = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from("agent_applications").insert({
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    phone: input.phone,
    state: input.state,
    licensed: input.licensed,
    license_number: input.license_number,
    years_experience: input.years_experience ?? null,
    current_agency: input.current_agency,
    interest_reason: input.interest_reason,
    status: "new",
  });

  if (error) {
    console.error("Agent application insert failed", error);
    return { ok: false, message: "We could not send your application. Please try again." };
  }

  try {
    await sendAgentApplicationNotification({
      name: `${input.first_name} ${input.last_name}`,
      email: input.email,
      state: input.state,
    });
  } catch (notificationError) {
    console.error("Agent application notification failed", notificationError);
  }

  return { ok: true, message: "Thanks. Your application has been received." };
}

function buildConsentRecord(
  leadId: string,
  consentType: "tcpa" | "privacy" | "sms" | "email_marketing",
  consentGiven: boolean,
  timestamp: string,
  ipAddress: string | null,
  userAgent: string | null,
  sourceUrl?: string | null,
) {
  const consentText: Record<typeof consentType, string> = {
    tcpa:
      "I agree that Rare Legacy Life and its advisors may contact me about life insurance options using the information I provided.",
    privacy: "I agree to the privacy policy and consent to the secure processing of my request.",
    sms: "I agree to receive text messages related to my quote request.",
    email_marketing: "I agree to receive helpful email updates from Rare Legacy Life.",
  };

  return {
    lead_id: leadId,
    consent_type: consentType,
    consent_given: consentGiven,
    consent_text: consentText[consentType],
    consent_timestamp: timestamp,
    ip_address: ipAddress,
    user_agent: userAgent,
    source_url: sourceUrl ?? null,
  };
}

async function getVerifiedQuoteEmail() {
  const cookieStore = await cookies();
  const payload = readSignedCookie<QuoteVerifiedPayload>(cookieStore.get(QUOTE_VERIFIED_COOKIE)?.value);

  if (!payload || payload.expiresAt < Date.now()) {
    return null;
  }

  return payload.email;
}

function hashOtp(email: string, code: string) {
  return hmac(`quote-otp:${email}:${code}`);
}

function signCookie<T>(payload: T) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${hmac(encoded)}`;
}

function readSignedCookie<T>(value?: string) {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");

  if (!encoded || !signature || !safeEqual(signature, hmac(encoded))) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

function hmac(value: string) {
  const secret =
    process.env.QUOTE_OTP_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.RESEND_API_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!secret) {
    throw new Error("Quote OTP secret is not configured.");
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function secureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function getIpAddress(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  const realIp = headerStore.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() ?? realIp ?? null;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
