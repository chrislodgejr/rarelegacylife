"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  leadStatusSchema,
  noteSchema,
  taskSchema,
} from "@/lib/validation/forms";
import type { AppRole, Lead } from "@/types/domain";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function updateLeadStatus(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const parsed = leadStatusSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid status update." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const now = new Date().toISOString();
  const update: Record<string, string> = {
    status: parsed.data.status,
    last_activity_at: now,
  };

  if (parsed.data.status === "contacted") {
    update.last_contacted_at = now;
  }

  const { data: existingLead } = await admin
    .from("leads")
    .select("first_contacted_at")
    .eq("id", parsed.data.lead_id)
    .maybeSingle<Pick<Lead, "first_contacted_at">>();

  if (parsed.data.status === "contacted" && !existingLead?.first_contacted_at) {
    update.first_contacted_at = now;
  }

  const { error } = await admin.from("leads").update(update).eq("id", parsed.data.lead_id);

  if (error) {
    return { ok: false, message: "Status could not be updated." };
  }

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "status_changed",
    description: `Status changed to ${parsed.data.status}.`,
  });

  await createAuditLog({
    userId: profile.id,
    action: "lead_status_changed",
    entityType: "lead",
    entityId: parsed.data.lead_id,
    description: `Lead status changed to ${parsed.data.status}.`,
  });

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Status updated." };
}

export async function addLeadNote(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const parsed = noteSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid note." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const { error } = await admin.from("lead_notes").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    note: parsed.data.note,
  });

  if (error) {
    return { ok: false, message: "Note could not be added." };
  }

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "note_added",
    description: "Note added.",
  });

  await createAuditLog({
    userId: profile.id,
    action: "lead_note_added",
    entityType: "lead",
    entityId: parsed.data.lead_id,
    description: "Lead note added.",
  });

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Note added." };
}

export async function createLeadTask(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const parsed = taskSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid task." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const { error } = await admin.from("lead_tasks").insert({
    lead_id: parsed.data.lead_id,
    assigned_user_id: profile.id,
    title: parsed.data.title,
    description: parsed.data.description,
    due_date: parsed.data.due_date,
    priority: parsed.data.priority,
    task_type: parsed.data.task_type,
    status: "open",
  });

  if (error) {
    return { ok: false, message: "Task could not be created." };
  }

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "task_created",
    description: `Task created: ${parsed.data.title}.`,
  });

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Task created." };
}

async function canAccessLead(
  admin: ReturnType<typeof createAdminClient>,
  leadId: string,
  profileId: string,
  role: AppRole,
) {
  if (role === "admin") {
    return true;
  }

  const { data: lead } = await admin
    .from("leads")
    .select("assigned_agent_id")
    .eq("id", leadId)
    .maybeSingle<{ assigned_agent_id: string | null }>();

  if (!lead) {
    return false;
  }

  if (role === "agent") {
    const { data: agent } = await admin
      .from("agents")
      .select("id")
      .eq("profile_id", profileId)
      .maybeSingle<{ id: string }>();

    return Boolean(agent?.id && agent.id === lead.assigned_agent_id);
  }

  if (role === "manager") {
    const { data: agent } = await admin
      .from("agents")
      .select("id, teams!inner(manager_id)")
      .eq("id", lead.assigned_agent_id)
      .eq("teams.manager_id", profileId)
      .maybeSingle();

    return Boolean(agent);
  }

  return false;
}

function revalidateCrmPaths(leadId: string) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/tasks");
}
