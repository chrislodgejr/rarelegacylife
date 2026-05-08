import { createAdminClient } from "@/lib/supabase/admin";

type NotificationPayload = {
  profileId: string;
  actorProfileId?: string | null;
  leadId?: string | null;
  title: string;
  body?: string | null;
  notificationType?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  metadata?: Record<string, unknown>;
};

export async function createCrmNotification(input: NotificationPayload) {
  const admin = createAdminClient();

  await admin.from("crm_notifications").insert({
    profile_id: input.profileId,
    actor_profile_id: input.actorProfileId ?? null,
    lead_id: input.leadId ?? null,
    title: input.title,
    body: input.body ?? null,
    notification_type: input.notificationType ?? "system",
    priority: input.priority ?? "medium",
    metadata: input.metadata ?? {},
  });
}

export async function notifyAdmins(input: Omit<NotificationPayload, "profileId">) {
  const admin = createAdminClient();
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .eq("status", "active")
    .in("role", ["admin", "manager"]);

  if (!admins?.length) {
    return;
  }

  await admin.from("crm_notifications").insert(
    admins.map((profile) => ({
      profile_id: profile.id,
      actor_profile_id: input.actorProfileId ?? null,
      lead_id: input.leadId ?? null,
      title: input.title,
      body: input.body ?? null,
      notification_type: input.notificationType ?? "system",
      priority: input.priority ?? "medium",
      metadata: input.metadata ?? {},
    })),
  );
}

export async function notifyAssignedAgent(input: Omit<NotificationPayload, "profileId">) {
  if (!input.leadId) {
    return;
  }

  const admin = createAdminClient();
  const { data: lead } = await admin
    .from("leads")
    .select("assigned_agent_id, agents(profile_id)")
    .eq("id", input.leadId)
    .maybeSingle<{
      assigned_agent_id: string | null;
      agents: { profile_id: string | null } | null;
    }>();

  const profileId = lead?.agents?.profile_id;

  if (!profileId) {
    return;
  }

  await createCrmNotification({
    profileId,
    ...input,
  });
}
