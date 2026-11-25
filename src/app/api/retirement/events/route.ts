import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const eventSchema = z.object({
  event_name: z.enum([
    "qr_landing_visit",
    "meeting_option_click",
    "form_start",
    "form_submission",
    "form_submission_success",
    "form_validation_error",
    "form_submission_error",
    "successful_appointment",
  ]),
  request_id: z.string().uuid().nullish(),
  session_id: z.string().min(8).max(160),
  meeting_style: z.enum(["virtual", "home", "office", "phone"]).nullish(),
  page_url: z.string().url().max(500).nullish(),
  referrer: z.string().max(500).nullish(),
  utm_source: z.string().max(500).nullish(),
  utm_medium: z.string().max(500).nullish(),
  utm_campaign: z.string().max(500).nullish(),
  utm_content: z.string().max(500).nullish(),
  utm_term: z.string().max(500).nullish(),
  qr_source: z.string().max(500).nullish(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

const eventWindows = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ipAddress)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (JSON.stringify(body).length > 5_000) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await createAdminClient().from("retirement_landing_events").insert({
    ...parsed.data,
    request_id: parsed.data.request_id ?? null,
    meeting_style: parsed.data.meeting_style ?? null,
  });

  if (error) {
    console.error("Retirement landing event insert failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = eventWindows.get(key);

  if (!current || current.resetAt <= now) {
    eventWindows.set(key, { count: 1, resetAt: now + 10 * 60 * 1_000 });
    return false;
  }

  current.count += 1;
  return current.count > 120;
}
