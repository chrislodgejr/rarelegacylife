"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createCrmNotification, notifyAdmins } from "@/lib/notifications/db";
import { createAdminClient } from "@/lib/supabase/admin";

export type FeatureRequestState = {
  ok: boolean;
  message: string;
};

const validCategories = new Set(["crm", "leads", "agent_profile", "notifications", "reports", "mobile", "other"]);
const validPriorities = new Set(["low", "medium", "high", "urgent"]);

export async function submitFeatureRequest(_state: FeatureRequestState, formData: FormData) {
  const { profile } = await requireRole(["agent", "manager", "admin", "support"]);
  const title = cleanText(formData.get("title"), 140);
  const category = cleanText(formData.get("category"), 40) ?? "other";
  const priority = cleanText(formData.get("priority"), 20) ?? "medium";
  const description = cleanText(formData.get("description"), 2000);

  if (!title || !description) {
    return { ok: false, message: "Title and description are required." };
  }

  const safeCategory = validCategories.has(category) ? category : "other";
  const safePriority = validPriorities.has(priority) ? priority : "medium";
  const admin = createAdminClient();
  const { data: request, error } = await admin
    .from("feature_requests")
    .insert({
      submitted_by_profile_id: profile.id,
      title,
      category: safeCategory,
      priority: safePriority,
      description,
      status: "new",
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !request) {
    console.error("Feature request insert failed", error);
    return { ok: false, message: "Feature request could not be submitted." };
  }

  const threadId = await ensureInternalThread(admin);
  const messageBody = [
    "New feature request submitted",
    `From: ${profile.full_name ?? profile.email}`,
    `Priority: ${safePriority}`,
    `Category: ${safeCategory}`,
    `Title: ${title}`,
    "",
    description,
  ].join("\n");

  await admin.from("chat_messages").insert({
    thread_id: threadId,
    sender_profile_id: profile.id,
    body: messageBody,
    channel: "chat",
    metadata: {
      feature_request_id: request.id,
      feature_request: true,
      category: safeCategory,
      priority: safePriority,
    },
  });

  await notifyAdmins({
    actorProfileId: profile.id,
    title: "New feature request",
    body: `${profile.full_name ?? profile.email}: ${title}`,
    notificationType: "feature_request",
    priority: safePriority === "urgent" ? "urgent" : "medium",
    metadata: {
      feature_request_id: request.id,
      thread_id: threadId,
      category: safeCategory,
      priority: safePriority,
    },
  });

  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("status", "active")
    .in("role", ["admin", "manager"]);

  if (admins?.length) {
    await Promise.all(
      admins.map((adminProfile) =>
        createCrmNotification({
          profileId: adminProfile.id,
          actorProfileId: profile.id,
          title: "Feature request in Messages",
          body: title,
          notificationType: "feature_request",
          priority: safePriority === "urgent" ? "urgent" : "medium",
          metadata: {
            feature_request_id: request.id,
            thread_id: threadId,
          },
        }),
      ),
    );
  }

  revalidatePath("/agent/feature-requests");
  revalidatePath("/admin/messages");
  revalidatePath("/agent/messages");
  return { ok: true, message: "Feature request submitted. Admins can see it in Messages." };
}

async function ensureInternalThread(admin: ReturnType<typeof createAdminClient>) {
  const { data: existing } = await admin
    .from("chat_threads")
    .select("id")
    .eq("thread_type", "internal")
    .eq("visibility", "company")
    .maybeSingle<{ id: string }>();

  if (existing) {
    return existing.id;
  }

  const { data: thread, error } = await admin
    .from("chat_threads")
    .insert({
      name: "Rare Legacy Life Internal",
      thread_type: "internal",
      visibility: "company",
      active: true,
      metadata: { purpose: "company_internal_chat" },
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !thread) {
    throw new Error("Could not create internal chat thread.");
  }

  return thread.id;
}

function cleanText(value: FormDataEntryValue | null, max: number) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, max) : null;
}
