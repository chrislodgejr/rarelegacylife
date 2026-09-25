import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

export async function sendCrmPush(profileIds: string[], payload: { title: string; body?: string | null; url: string }) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject || !profileIds.length) return;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  const admin = createAdminClient();
  const { data, error } = await admin.from("crm_push_subscriptions").select("id,endpoint,p256dh,auth_secret").in("profile_id", profileIds);
  if (error) { console.error("Push subscriptions unavailable", error); return; }
  await Promise.allSettled((data ?? []).map(async item => {
    try {
      await webpush.sendNotification({ endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth_secret } }, JSON.stringify({ ...payload, tag: "crm-update" }), { TTL: 3600 });
    } catch (error) {
      if (typeof error === "object" && error && "statusCode" in error && [404, 410].includes(Number(error.statusCode))) {
        await admin.from("crm_push_subscriptions").delete().eq("id", item.id);
      } else console.error("CRM push delivery failed", error);
    }
  }));
}
