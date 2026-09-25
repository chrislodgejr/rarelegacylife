import { NextResponse } from "next/server";
import { getCurrentUserAndProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

async function authorized() {
  const { profile } = await getCurrentUserAndProfile();
  return profile?.status === "active" && ["admin", "manager"].includes(profile.role) ? profile : null;
}

export async function POST(request: Request) {
  const profile = await authorized();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const endpoint = body?.endpoint;
  const keys = body?.keys;
  if (typeof endpoint !== "string" || endpoint.length > 2048 || !endpoint.startsWith("https://") ||
      typeof keys?.p256dh !== "string" || typeof keys?.auth !== "string" ||
      keys.p256dh.length > 255 || keys.auth.length > 255) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  const admin = createAdminClient();
  const { data: existing } = await admin.from("crm_push_subscriptions").select("profile_id").eq("endpoint", endpoint).maybeSingle();
  if (existing && existing.profile_id !== profile.id) return NextResponse.json({ error: "Subscription already registered" }, { status: 409 });
  const { error } = await admin.from("crm_push_subscriptions").upsert({
    profile_id: profile.id, endpoint, p256dh: keys.p256dh, auth_secret: keys.auth, updated_at: new Date().toISOString(),
  }, { onConflict: "endpoint" });
  return error ? NextResponse.json({ error: "Could not enable notifications" }, { status: 500 }) : NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const profile = await authorized();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (typeof body?.endpoint !== "string") return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  const { error } = await createAdminClient().from("crm_push_subscriptions").delete().eq("profile_id", profile.id).eq("endpoint", body.endpoint);
  return error ? NextResponse.json({ error: "Could not disable notifications" }, { status: 500 }) : NextResponse.json({ ok: true });
}
