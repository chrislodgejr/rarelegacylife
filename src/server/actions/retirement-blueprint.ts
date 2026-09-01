"use server";

import { isIP } from "node:net";
import { headers } from "next/headers";
import { after } from "next/server";
import { RETIREMENT_SCHEDULER_URLS } from "@/lib/constants/retirement";
import { sendEmail } from "@/lib/email/provider";
import { getSiteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { retirementBlueprintSchema } from "@/lib/validation/forms";

export type RetirementBlueprintState = {
  ok: boolean;
  message: string;
  requestId?: string;
  fieldErrors?: Record<string, string>;
};

const successMessage =
  "Your request has been received and sent to Christian. Choose a convenient time below to complete your booking.";

const consentText =
  "I agree that Rare Legacy Life Group and its licensed professionals may call, email, or text me at the contact information I provide, including using automated technology, about my request and related insurance or retirement planning services. Message and data rates may apply. Consent is not a condition of purchasing any product or service.";

const meetingLabels = {
  virtual: "Virtual Meeting",
  home: "We Come to You",
  office: "Visit Our Office",
  phone: "Start by Phone",
} as const;

export async function submitRetirementBlueprint(
  _previousState: RetirementBlueprintState,
  formData: FormData,
): Promise<RetirementBlueprintState> {
  const parsed = retirementBlueprintSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }

    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
      fieldErrors,
    };
  }

  const input = parsed.data;

  // Honeypot submissions receive a neutral success response and are not stored.
  if (input.website) {
    return { ok: true, message: successMessage };
  }

  const startedAt = Number(input.started_at);
  const elapsed = Date.now() - startedAt;

  if (!Number.isFinite(startedAt) || elapsed < 1_500 || elapsed > 4 * 60 * 60 * 1_000) {
    return {
      ok: false,
      message: "Please refresh the page and try your request again.",
    };
  }

  const headerStore = await headers();
  const ipAddress = getIpAddress(headerStore);
  const userAgent = headerStore.get("user-agent");
  const now = new Date().toISOString();
  const admin = createAdminClient();

  const windowStart = new Date(Date.now() - 15 * 60 * 1_000).toISOString();
  const { count: recentCount, error: rateLimitError } = await admin
    .from("retirement_blueprint_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", input.email)
    .gte("created_at", windowStart);

  if (rateLimitError) {
    console.error("Retirement request rate-limit check failed", rateLimitError);
  }

  if ((recentCount ?? 0) >= 3) {
    return {
      ok: false,
      message: "We already received your request. Please allow our team a little time to respond.",
    };
  }

  const nameParts = input.full_name.split(/\s+/);
  const firstName = nameParts.shift() ?? input.full_name;
  const lastName = nameParts.join(" ");
  const specialist = await getConfiguredSpecialist(admin);
  const landingPage = input.landing_page ?? `${getSiteUrl()}/retirement`;

  const { data: request, error: insertError } = await admin
    .from("retirement_blueprint_requests")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email: input.email,
      phone: input.phone,
      zip_code: input.zip_code,
      meeting_style: input.meeting_style,
      best_time_to_contact: input.best_time_to_contact,
      question: input.question ?? null,
      status: "new",
      assigned_agent_id: specialist?.id ?? null,
      source: "retirement_blueprint_qr",
      consent_tcpa: input.consent_tcpa,
      consent_text: consentText,
      consent_version: "retirement-blueprint-v1-approved",
      consent_timestamp: now,
      consent_ip: ipAddress,
      consent_user_agent: userAgent,
      landing_page: landingPage,
      referrer: input.referrer ?? headerStore.get("referer"),
      utm_source: input.utm_source,
      utm_medium: input.utm_medium,
      utm_campaign: input.utm_campaign,
      utm_content: input.utm_content,
      utm_term: input.utm_term,
      gclid: input.gclid,
      fbclid: input.fbclid,
      msclkid: input.msclkid,
      qr_source: input.qr_source,
    })
    .select("id")
    .single();

  if (insertError || !request) {
    console.error("Retirement Blueprint request insert failed", insertError);
    return {
      ok: false,
      message: "We could not submit your request. Please try again or contact Rare Legacy directly.",
    };
  }

  after(async () => {
    const results = await Promise.allSettled([
      sendRetirementNotification({
        requestId: request.id,
        name: input.full_name,
        email: input.email,
        phone: input.phone,
        zipCode: input.zip_code,
        meetingStyle: input.meeting_style,
        bestTime: input.best_time_to_contact,
        question: input.question ?? null,
        specialistEmail: specialist?.email ?? null,
      }),
      sendRetirementConfirmation({
        email: input.email,
        firstName,
        meetingStyle: input.meeting_style,
      }),
      sendConfiguredWebhook({
        requestId: request.id,
        name: input.full_name,
        email: input.email,
        phone: input.phone,
        zipCode: input.zip_code,
        meetingStyle: input.meeting_style,
        bestTime: input.best_time_to_contact,
        question: input.question ?? null,
        assignedAgentId: specialist?.id ?? null,
        attribution: {
          utm_source: input.utm_source,
          utm_medium: input.utm_medium,
          utm_campaign: input.utm_campaign,
          utm_content: input.utm_content,
          utm_term: input.utm_term,
          qr_source: input.qr_source,
        },
        submittedAt: now,
      }),
    ]);

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Retirement Blueprint follow-up delivery failed", result.reason);
      }
    }
  });

  return { ok: true, message: successMessage, requestId: request.id };
}

async function getConfiguredSpecialist(admin: ReturnType<typeof createAdminClient>) {
  const specialistId = process.env.RETIREMENT_SPECIALIST_AGENT_ID?.trim();

  if (!specialistId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(specialistId)) {
    return null;
  }

  const { data, error } = await admin
    .from("agents")
    .select("id, email")
    .eq("id", specialistId)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    console.error("Configured retirement specialist lookup failed", error);
    return null;
  }

  return data;
}

async function sendRetirementNotification(input: {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  meetingStyle: keyof typeof meetingLabels;
  bestTime: string;
  question: string | null;
  specialistEmail: string | null;
}) {
  const configuredEmails = (
    process.env.RETIREMENT_LEAD_NOTIFICATION_EMAIL?.trim() || "christian@rarelegacylife.com"
  )
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  const recipients = [...new Set([input.specialistEmail, ...configuredEmails].filter(Boolean))] as string[];

  if (recipients.length === 0) {
    return;
  }

  const lines = [
    "New Retirement Income Blueprint request",
    `Request ID: ${input.requestId}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Mobile: ${input.phone}`,
    `ZIP: ${input.zipCode}`,
    `Meeting preference: ${meetingLabels[input.meetingStyle]}`,
    `Best day or time: ${input.bestTime}`,
    input.question ? `Question or concern: ${input.question}` : null,
  ].filter(Boolean) as string[];

  await sendEmail({
    to: recipients,
    subject: `Retirement Blueprint request: ${input.name}`,
    text: lines.join("\n"),
    html: emailShell(
      "New Retirement Income Blueprint request",
      lines.slice(1).map((line) => `<p style="margin:0 0 10px">${escapeHtml(line)}</p>`).join(""),
    ),
  });
}

async function sendRetirementConfirmation(input: {
  email: string;
  firstName: string;
  meetingStyle: keyof typeof meetingLabels;
}) {
  const businessPhone = process.env.BUSINESS_PHONE?.trim();
  const privacyUrl =
    process.env.RETIREMENT_PRIVACY_POLICY_URL?.trim() ?? `${getSiteUrl()}/privacy`;
  const schedulerUrl = RETIREMENT_SCHEDULER_URLS[input.meetingStyle];
  const text = [
    `Hi ${input.firstName},`,
    "Your Retirement Income Blueprint request has been received.",
    `Meeting preference: ${meetingLabels[input.meetingStyle]}`,
    "Choose a convenient time with Christian to complete your booking:",
    schedulerUrl,
    businessPhone ? `Rare Legacy Life Group: ${businessPhone}` : null,
    `Privacy: ${privacyUrl}`,
  ].filter(Boolean) as string[];

  await sendEmail({
    to: input.email,
    subject: "We received your Retirement Income Blueprint request",
    text: text.join("\n\n"),
    html: emailShell(
      `Thank you, ${escapeHtml(input.firstName)}.`,
      `<p style="margin:0 0 16px">Your Retirement Income Blueprint request has been received.</p>
       <p style="margin:0 0 16px"><strong>Meeting preference:</strong> ${escapeHtml(meetingLabels[input.meetingStyle])}</p>
       <p style="margin:0 0 16px">Choose a convenient time with Christian to complete your booking.</p>
       <p style="margin:0 0 22px"><a href="${escapeHtml(schedulerUrl)}" style="display:inline-block;background:#c6a66b;border-radius:999px;color:#19201f;font-weight:700;padding:12px 20px;text-decoration:none">Choose a meeting time</a></p>
       ${businessPhone ? `<p style="margin:0 0 16px"><strong>Rare Legacy Life Group:</strong> ${escapeHtml(businessPhone)}</p>` : ""}
       <p style="margin:24px 0 0;font-size:13px"><a href="${escapeHtml(privacyUrl)}" style="color:#806633">Privacy policy</a></p>`,
    ),
  });
}

async function sendConfiguredWebhook(payload: Record<string, unknown>) {
  const configuredUrl = process.env.RETIREMENT_CRM_WEBHOOK_URL?.trim();

  if (!configuredUrl) {
    return;
  }

  const url = new URL(configuredUrl);
  if (url.protocol !== "https:") {
    throw new Error("RETIREMENT_CRM_WEBHOOK_URL must use HTTPS.");
  }

  const token = process.env.RETIREMENT_CRM_WEBHOOK_BEARER_TOKEN?.trim();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ event: "retirement_blueprint.requested", ...payload }),
    cache: "no-store",
    signal: AbortSignal.timeout(7_500),
  });

  if (!response.ok) {
    throw new Error(`Retirement CRM webhook returned ${response.status}.`);
  }
}

function getIpAddress(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwardedFor ?? headerStore.get("x-real-ip");
  return candidate && isIP(candidate) ? candidate : null;
}

function emailShell(heading: string, body: string) {
  return `<!doctype html>
  <html lang="en"><body style="margin:0;background:#fbf9f4;color:#19201f;font-family:Arial,sans-serif">
  <div style="max-width:620px;margin:0 auto;padding:32px 20px">
    <div style="background:#19201f;border-top:4px solid #c6a66b;padding:26px 28px;color:#fff">
      <p style="margin:0 0 8px;color:#c6a66b;font-size:12px;letter-spacing:1.6px;text-transform:uppercase">Rare Legacy Life Group</p>
      <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:500">${heading}</h1>
    </div>
    <div style="background:#fff;border:1px solid #e6dfd2;border-top:0;padding:28px;line-height:1.6">${body}</div>
    <p style="margin:18px 0 0;color:#6b716f;font-size:12px;line-height:1.5">59 W. Germantown Pike, East Norriton, PA 19403</p>
  </div></body></html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}
