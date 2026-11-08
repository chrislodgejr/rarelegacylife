"use server";

import { isIP } from "node:net";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdmins } from "@/lib/notifications/db";
import { clip, pageForIntake, phoneForIntake, sendToEndlessOne } from "@/lib/endless-one/intake";
import { PROTECT_AMOUNT_TIERS, protectRequestSchema } from "@/lib/validation/forms";

/**
 * The Google Ads page, /protect (Chris, 2026-11-07). Its own action: the /retirement form is printed on a QR code and never
 * changes. Endless One first (the lead, its amount tier and Google's click id, and the instant email and first text from there),
 * then the site's own copy in retirement_blueprint_requests under the same id, so no request is lost. Every tier is a lead;
 * Endless One counts only $150K and up for Google.
 */
export type ProtectRequestState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const successMessage = "Thank you. A licensed advisor will reach out shortly to set up your free review.";

const consentText =
  "I agree that Rare Legacy Life Group and its licensed professionals may call, email, or text me at the contact information I provide, including using automated technology, about my request and related insurance or retirement planning services. Message and data rates may apply. Consent is not a condition of purchasing any product or service.";
const consentVersion = "protect-v1";
const CLICK_ID = /^[A-Za-z0-9_-]{1,200}$/;

export async function submitProtectRequest(
  _previousState: ProtectRequestState,
  formData: FormData,
): Promise<ProtectRequestState> {
  const parsed = protectRequestSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form and try again.", fieldErrors };
  }

  const input = parsed.data;

  // Honeypot submissions receive a neutral success response and are not stored.
  if (input.website) return { ok: true, message: successMessage };

  const startedAt = Number(input.started_at);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 1_500 || elapsed > 4 * 60 * 60 * 1_000) {
    return { ok: false, message: "Please refresh the page and try your request again." };
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
  if (rateLimitError) console.error("Protect request rate-limit check failed", rateLimitError);
  if ((recentCount ?? 0) >= 3) {
    return { ok: false, message: "We already received your request. Please allow our team a little time to respond." };
  }

  const nameParts = input.full_name.split(/\s+/);
  const firstName = nameParts.shift() ?? input.full_name;
  const lastName = nameParts.join(" ");
  const landingPage = input.landing_page ?? `${getSiteUrl()}/protect`;
  const tierLabel = PROTECT_AMOUNT_TIERS.find(([value]) => value === input.amount_tier)?.[1] ?? input.amount_tier;
  const clickId = (value: string | null | undefined) => (value && CLICK_ID.test(value) ? value : null);

  const requestId = crypto.randomUUID();
  await sendToEndlessOne({
    version: 1,
    form: "retirement",
    submissionId: requestId,
    submittedAt: now,
    person: {
      firstName: clip(firstName, 100),
      lastName: clip(lastName, 100),
      email: input.email,
      phone: phoneForIntake(input.phone),
      postalCode: input.zip_code,
    },
    retirement: {
      meetingStyle: "phone",
      bestTimeToContact: input.best_time_to_contact,
      question: null,
      amountTier: input.amount_tier,
    },
    consents: [{ kind: "tcpa", given: input.consent_tcpa, text: consentText, version: consentVersion, at: now }],
    page: { url: pageForIntake(landingPage) },
    attribution: {
      source: clip(input.utm_source, 200),
      medium: clip(input.utm_medium, 200),
      campaign: clip(input.utm_campaign, 200),
      content: clip(input.utm_content, 200),
      term: clip(input.utm_term, 200),
      gclid: clickId(input.gclid),
      gbraid: clickId(input.gbraid),
      wbraid: clickId(input.wbraid),
    },
    client: { ip: ipAddress },
  });

  const { error: insertError } = await admin.from("retirement_blueprint_requests").insert({
    id: requestId,
    first_name: firstName,
    last_name: lastName,
    email: input.email,
    phone: input.phone,
    zip_code: input.zip_code,
    meeting_style: "phone",
    best_time_to_contact: input.best_time_to_contact,
    question: `Amount to protect: ${tierLabel}`,
    status: "new",
    assigned_agent_id: null,
    source: "google_ads_protect",
    consent_tcpa: input.consent_tcpa,
    consent_text: consentText,
    consent_version: consentVersion,
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
  });

  // Endless One already has the lead; the site's copy failing is logged, not shown as a failed request.
  if (insertError) console.error("Protect request site copy failed", insertError);

  await notifyAdmins({
    title: "New Google Ads request",
    body: `${input.full_name} requested a free retirement review.`,
    notificationType: "retirement_request",
    priority: "high",
    metadata: { request_id: requestId, path: `/admin/retirement/${requestId}` },
  }).catch((error: unknown) => console.error("Protect request admin notice failed", error));

  return { ok: true, message: successMessage };
}

function getIpAddress(headerStore: Headers) {
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate = forwardedFor ?? headerStore.get("x-real-ip");
  return candidate && isIP(candidate) ? candidate : null;
}
