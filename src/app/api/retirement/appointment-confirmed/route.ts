import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const appointmentSchema = z.object({
  request_id: z.string().uuid(),
  appointment_id: z.string().trim().min(1).max(200),
  scheduled_at: z.string().datetime({ offset: true }).optional(),
  meeting_style: z.enum(["virtual", "home", "office", "phone"]).optional(),
});

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.RETIREMENT_APPOINTMENT_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!configuredSecret) {
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 503 });
  }

  if (!suppliedSecret || !secretsMatch(configuredSecret, suppliedSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid appointment payload." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: updatedRequest, error: updateError } = await admin
    .from("retirement_blueprint_requests")
    .update({ status: "scheduled" })
    .eq("id", parsed.data.request_id)
    .select("id, meeting_style")
    .maybeSingle();

  if (updateError || !updatedRequest) {
    console.error("Retirement appointment request update failed", updateError);
    return NextResponse.json({ ok: false, error: "Request was not found." }, { status: 404 });
  }

  const { error: eventError } = await admin.from("retirement_landing_events").insert({
    request_id: updatedRequest.id,
    event_name: "successful_appointment",
    session_id: `server:${updatedRequest.id}`,
    meeting_style: parsed.data.meeting_style ?? updatedRequest.meeting_style,
    metadata: {
      appointment_id: parsed.data.appointment_id,
      scheduled_at: parsed.data.scheduled_at ?? null,
      source: "appointment_webhook",
    },
  });

  if (eventError) {
    console.error("Retirement successful appointment event insert failed", eventError);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function secretsMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
