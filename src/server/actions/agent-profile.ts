"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type AgentProfileActionState = {
  ok: boolean;
  message: string;
};

const initialError = { ok: false, message: "Profile could not be updated." };

export async function updateAgentProfile(_state: AgentProfileActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const agentId = String(formData.get("agent_id") ?? "");
  const targetAgent = await getEditableAgent(admin, agentId, profile.id, profile.role);

  if (!targetAgent) {
    return { ok: false, message: "Agent profile not found or access denied." };
  }

  const firstName = cleanText(formData.get("first_name"), 80);
  const lastName = cleanText(formData.get("last_name"), 80);
  const phone = cleanNullableText(formData.get("phone"), 32);
  const npn = cleanNullableText(formData.get("npn"), 32);
  const state = cleanNullableText(formData.get("state"), 2)?.toUpperCase() ?? null;
  const acceptsNewLeads = formData.get("accepts_new_leads") === "on";
  const maxActiveLeads = Number(formData.get("max_active_leads") ?? 50);

  if (!firstName || !lastName) {
    return { ok: false, message: "First and last name are required." };
  }

  const { error } = await admin
    .from("agents")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      npn,
      state,
      accepts_new_leads: acceptsNewLeads,
      max_active_leads: Number.isFinite(maxActiveLeads) ? Math.max(0, Math.round(maxActiveLeads)) : 50,
      updated_at: new Date().toISOString(),
    })
    .eq("id", targetAgent.id);

  if (error) {
    console.error("Agent profile update failed", error);
    return initialError;
  }

  revalidateAgentPaths(targetAgent.id);
  return { ok: true, message: "Agent profile updated." };
}

export async function addAgentLicense(_state: AgentProfileActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const agentId = String(formData.get("agent_id") ?? "");
  const targetAgent = await getEditableAgent(admin, agentId, profile.id, profile.role);

  if (!targetAgent) {
    return { ok: false, message: "Agent profile not found or access denied." };
  }

  const state = cleanText(formData.get("state"), 2)?.toUpperCase();
  const licenseNumber = cleanNullableText(formData.get("license_number"), 80);
  const expirationDate = cleanNullableText(formData.get("expiration_date"), 20);

  if (!state || !/^[A-Z]{2}$/.test(state)) {
    return { ok: false, message: "Select a valid licensed state." };
  }

  const { error } = await admin.from("agent_licenses").upsert(
    {
      agent_id: targetAgent.id,
      state,
      license_number: licenseNumber,
      expiration_date: expirationDate,
      license_status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "agent_id,state" },
  );

  if (error) {
    console.error("Agent license upsert failed", error);
    return { ok: false, message: "License could not be saved. The state may already exist without a unique index." };
  }

  revalidateAgentPaths(targetAgent.id);
  return { ok: true, message: "Licensed state saved." };
}

export async function removeAgentLicense(_state: AgentProfileActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const agentId = String(formData.get("agent_id") ?? "");
  const licenseId = String(formData.get("license_id") ?? "");
  const targetAgent = await getEditableAgent(admin, agentId, profile.id, profile.role);

  if (!targetAgent || !licenseId) {
    return { ok: false, message: "License could not be removed." };
  }

  await admin.from("agent_licenses").delete().eq("id", licenseId).eq("agent_id", targetAgent.id);
  revalidateAgentPaths(targetAgent.id);
  return { ok: true, message: "Licensed state removed." };
}

export async function saveCarrierContract(_state: AgentProfileActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const agentId = String(formData.get("agent_id") ?? "");
  const carrierId = String(formData.get("carrier_id") ?? "");
  const targetAgent = await getEditableAgent(admin, agentId, profile.id, profile.role);

  if (!targetAgent || !carrierId) {
    return { ok: false, message: "Carrier contract could not be saved." };
  }

  const writingNumber = cleanNullableText(formData.get("writing_number"), 120);
  const notes = cleanNullableText(formData.get("notes"), 500);

  const { error } = await admin.from("agent_carrier_contracts").upsert(
    {
      agent_id: targetAgent.id,
      carrier_id: carrierId,
      writing_number: writingNumber,
      contracted: true,
      notes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "agent_id,carrier_id" },
  );

  if (error) {
    console.error("Carrier contract save failed", error);
    return { ok: false, message: "Carrier contract could not be saved." };
  }

  revalidateAgentPaths(targetAgent.id);
  return { ok: true, message: "Carrier writing number saved." };
}

export async function removeCarrierContract(_state: AgentProfileActionState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const agentId = String(formData.get("agent_id") ?? "");
  const contractId = String(formData.get("contract_id") ?? "");
  const targetAgent = await getEditableAgent(admin, agentId, profile.id, profile.role);

  if (!targetAgent || !contractId) {
    return { ok: false, message: "Carrier contract could not be removed." };
  }

  await admin.from("agent_carrier_contracts").delete().eq("id", contractId).eq("agent_id", targetAgent.id);
  revalidateAgentPaths(targetAgent.id);
  return { ok: true, message: "Carrier contract removed." };
}

async function getEditableAgent(
  admin: ReturnType<typeof createAdminClient>,
  agentId: string,
  profileId: string,
  role: string,
) {
  if (role === "admin" || role === "manager") {
    const { data } = await admin.from("agents").select("id, profile_id").eq("id", agentId).maybeSingle<{ id: string; profile_id: string | null }>();
    return data;
  }

  const { data } = await admin
    .from("agents")
    .select("id, profile_id")
    .eq("id", agentId)
    .eq("profile_id", profileId)
    .maybeSingle<{ id: string; profile_id: string | null }>();

  return data;
}

function cleanText(value: FormDataEntryValue | null, max: number) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, max) : null;
}

function cleanNullableText(value: FormDataEntryValue | null, max: number) {
  return cleanText(value, max);
}

function revalidateAgentPaths(agentId: string) {
  revalidatePath("/agent/profile");
  revalidatePath("/admin/agents");
  revalidatePath(`/admin/agents/${agentId}`);
}
