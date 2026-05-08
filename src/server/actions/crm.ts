"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  assignmentSchema,
  internalChatMessageSchema,
  leadChatMessageSchema,
  leadEmailSchema,
  leadStatusSchema,
  noteSchema,
  taskSchema,
  userApprovalSchema,
} from "@/lib/validation/forms";
import { sendUserApprovedNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/email/provider";
import { createCrmNotification, notifyAdmins, notifyAssignedAgent } from "@/lib/notifications/db";
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

export async function assignLead(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager"]);
  const parsed = assignmentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid assignment." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const now = new Date().toISOString();
  await admin
    .from("lead_assignments")
    .update({ active: false, unassigned_at: now })
    .eq("lead_id", parsed.data.lead_id)
    .eq("active", true);

  const { error } = await admin
    .from("leads")
    .update({
      assigned_agent_id: parsed.data.agent_id,
      assigned_at: parsed.data.agent_id ? now : null,
      status: parsed.data.agent_id ? "assigned" : "new",
      last_activity_at: now,
    })
    .eq("id", parsed.data.lead_id);

  if (error) {
    return { ok: false, message: "Lead could not be assigned." };
  }

  if (parsed.data.agent_id) {
    await admin.from("lead_assignments").insert({
      lead_id: parsed.data.lead_id,
      agent_id: parsed.data.agent_id,
      assigned_by_user_id: profile.id,
      assignment_reason: "Manual dashboard assignment",
      assigned_at: now,
      active: true,
    });

    await admin.from("agents").update({ last_assigned_at: now }).eq("id", parsed.data.agent_id);

    const { data: agent } = await admin
      .from("agents")
      .select("profile_id")
      .eq("id", parsed.data.agent_id)
      .maybeSingle<{ profile_id: string | null }>();

    if (agent?.profile_id) {
      await createCrmNotification({
        profileId: agent.profile_id,
        actorProfileId: profile.id,
        leadId: parsed.data.lead_id,
        title: "Lead assigned to you",
        body: "A lead is ready in your pipeline.",
        notificationType: "lead_assigned",
        priority: "high",
      });
    }
  }

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "lead_assigned",
    description: parsed.data.agent_id ? "Lead assigned manually." : "Lead unassigned manually.",
    metadata: { assigned_agent_id: parsed.data.agent_id },
  });

  await createAuditLog({
    userId: profile.id,
    action: "lead_assigned",
    entityType: "lead",
    entityId: parsed.data.lead_id,
    description: "Lead assignment changed.",
    metadata: { assigned_agent_id: parsed.data.agent_id },
  });

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Assignment updated." };
}

export async function approveUser(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin"]);
  const parsed = userApprovalSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid user update." };
  }

  const admin = createAdminClient();
  const { data: updatedProfile, error } = await admin
    .from("profiles")
    .update({
      role: parsed.data.role,
      status: parsed.data.status,
      approved_by: profile.id,
      approved_at: parsed.data.status === "active" ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.profile_id)
    .select("email, role")
    .single<{ email: string; role: string }>();

  if (error || !updatedProfile) {
    return { ok: false, message: "User could not be updated." };
  }

  await createAuditLog({
    userId: profile.id,
    action: "user_role_changed",
    entityType: "profile",
    entityId: parsed.data.profile_id,
    description: `User set to ${parsed.data.role}/${parsed.data.status}.`,
  });

  if (parsed.data.status === "active") {
    try {
      await sendUserApprovedNotification({
        email: updatedProfile.email,
        role: updatedProfile.role,
      });
    } catch (error) {
      console.error("User approval email failed", error);
    }
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "User updated." };
}

export async function sendLeadEmail(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const parsed = leadEmailSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid email." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const { data: lead } = await admin
    .from("leads")
    .select("id, email, first_name, last_name")
    .eq("id", parsed.data.lead_id)
    .maybeSingle<Pick<Lead, "id" | "email" | "first_name" | "last_name">>();

  if (!lead) {
    return { ok: false, message: "Lead not found." };
  }

  try {
    await sendEmail({
      to: lead.email,
      subject: parsed.data.subject,
      text: parsed.data.body,
      html: parsed.data.body.replaceAll("\n", "<br />"),
    });
  } catch (error) {
    console.error("Lead email failed", error);
    return { ok: false, message: "Email could not be sent." };
  }

  await admin.from("communications").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    direction: "outbound",
    channel: "email",
    provider: "resend",
    subject: parsed.data.subject,
    body: parsed.data.body,
    status: "sent",
    sent_at: new Date().toISOString(),
  });

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "email_sent",
    description: `Email sent to ${lead.first_name} ${lead.last_name}.`,
    metadata: { subject: parsed.data.subject },
  });

  if (profile.role === "agent") {
    await notifyAdmins({
      actorProfileId: profile.id,
      leadId: parsed.data.lead_id,
      title: "Agent emailed a lead",
      body: `${profile.email} sent: ${parsed.data.subject}`,
      notificationType: "lead_email",
      priority: "medium",
    });
  } else {
    await notifyAssignedAgent({
      actorProfileId: profile.id,
      leadId: parsed.data.lead_id,
      title: "Lead email sent",
      body: parsed.data.subject,
      notificationType: "lead_email",
      priority: "medium",
    });
  }

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Email sent and logged." };
}

export async function sendLeadChatMessage(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const parsed = leadChatMessageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid message." };
  }

  const admin = createAdminClient();
  const canAccess = await canAccessLead(admin, parsed.data.lead_id, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to this lead." };
  }

  const threadId = await ensureLeadChatThread(admin, parsed.data.lead_id, profile.id);

  const { error } = await admin.from("chat_messages").insert({
    thread_id: threadId,
    sender_profile_id: profile.id,
    body: parsed.data.body,
    channel: "chat",
  });

  if (error) {
    return { ok: false, message: "Message could not be sent." };
  }

  await admin.from("communications").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    direction: "internal",
    channel: "chat",
    provider: "crm",
    body: parsed.data.body,
    status: "sent",
    sent_at: new Date().toISOString(),
  });

  await admin.from("lead_activity").insert({
    lead_id: parsed.data.lead_id,
    user_id: profile.id,
    activity_type: "chat_message_sent",
    description: "Internal lead chat message sent.",
  });

  if (profile.role === "agent") {
    await notifyAdmins({
      actorProfileId: profile.id,
      leadId: parsed.data.lead_id,
      title: "New lead chat message",
      body: `${profile.email} added an internal lead message.`,
      notificationType: "lead_chat",
      priority: "medium",
    });
  } else {
    await notifyAssignedAgent({
      actorProfileId: profile.id,
      leadId: parsed.data.lead_id,
      title: "New lead chat message",
      body: "A new internal message was added to one of your assigned leads.",
      notificationType: "lead_chat",
      priority: "medium",
    });
  }

  revalidateCrmPaths(parsed.data.lead_id);
  return { ok: true, message: "Message sent." };
}

export async function sendInternalChatMessage(_state: ActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent", "support"]);
  const parsed = internalChatMessageSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid message." };
  }

  const admin = createAdminClient();
  const { data: thread } = await admin
    .from("chat_threads")
    .select("id")
    .eq("id", parsed.data.thread_id)
    .eq("thread_type", "internal")
    .maybeSingle<{ id: string }>();

  if (!thread) {
    return { ok: false, message: "Chat thread not found." };
  }

  const { error } = await admin.from("chat_messages").insert({
    thread_id: parsed.data.thread_id,
    sender_profile_id: profile.id,
    body: parsed.data.body,
    channel: "chat",
  });

  if (error) {
    return { ok: false, message: "Message could not be sent." };
  }

  const { data: recipients } = await admin
    .from("profiles")
    .select("id")
    .eq("status", "active")
    .in("role", ["admin", "manager", "agent", "support"])
    .neq("id", profile.id);

  if (recipients?.length) {
    await Promise.all(
      recipients.map((recipient) =>
        createCrmNotification({
          profileId: recipient.id,
          actorProfileId: profile.id,
          title: "New internal chat message",
          body: parsed.data.body.slice(0, 140),
          notificationType: "internal_chat",
          priority: "medium",
          metadata: { thread_id: parsed.data.thread_id },
        }),
      ),
    );
  }

  revalidatePath("/admin/messages");
  revalidatePath("/agent/messages");
  return { ok: true, message: "Message sent." };
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
  revalidatePath("/agent/dashboard");
  revalidatePath("/agent/leads");
  revalidatePath(`/agent/leads/${leadId}`);
  revalidatePath("/agent/tasks");
}

async function ensureLeadChatThread(
  admin: ReturnType<typeof createAdminClient>,
  leadId: string,
  profileId: string,
) {
  const { data: existingThread } = await admin
    .from("chat_threads")
    .select("id")
    .eq("lead_id", leadId)
    .eq("thread_type", "lead")
    .maybeSingle<{ id: string }>();

  if (existingThread) {
    await admin.from("chat_participants").upsert(
      {
        thread_id: existingThread.id,
        profile_id: profileId,
      },
      { onConflict: "thread_id,profile_id" },
    );

    return existingThread.id;
  }

  const { data: thread, error } = await admin
    .from("chat_threads")
    .insert({
      lead_id: leadId,
      thread_type: "lead",
      visibility: "lead",
      created_by: profileId,
      active: true,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !thread) {
    throw new Error("Could not create lead chat thread.");
  }

  await admin.from("chat_participants").insert({
    thread_id: thread.id,
    profile_id: profileId,
  });

  const { data: lead } = await admin
    .from("leads")
    .select("assigned_agent_id, agents(profile_id)")
    .eq("id", leadId)
    .maybeSingle<{
      assigned_agent_id: string | null;
      agents: { profile_id: string | null } | null;
    }>();

  if (lead?.agents?.profile_id && lead.agents.profile_id !== profileId) {
    await admin.from("chat_participants").upsert(
      {
        thread_id: thread.id,
        profile_id: lead.agents.profile_id,
      },
      { onConflict: "thread_id,profile_id" },
    );
  }

  return thread.id;
}
