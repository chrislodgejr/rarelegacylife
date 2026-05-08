"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export type LeadContactState = { ok: boolean; message: string };

export async function updateLeadContactInfo(_state: LeadContactState, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager", "agent"]);
  const admin = createAdminClient();
  const leadId = String(formData.get("lead_id") ?? "");

  if (!leadId) {
    return { ok: false, message: "Lead is required." };
  }

  const canAccess = await canEditLead(admin, leadId, profile.id, profile.role);

  if (!canAccess) {
    return { ok: false, message: "You do not have access to update this lead." };
  }

  const firstName = text(formData.get("first_name"), 80);
  const lastName = text(formData.get("last_name"), 80);
  const email = text(formData.get("email"), 160)?.toLowerCase();
  const phone = text(formData.get("phone"), 32);
  const state = text(formData.get("state"), 2)?.toUpperCase();
  const zipCode = text(formData.get("zip_code"), 12);
  const preferredContactMethod = text(formData.get("preferred_contact_method"), 20);
  const bestTimeToContact = optionalText(formData.get("best_time_to_contact"), 120);

  if (!firstName || !lastName || !email || !phone || !state || !zipCode) {
    return { ok: false, message: "Name, email, phone, state, and ZIP are required." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter a valid lead email." };
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    return { ok: false, message: "Enter a valid two-letter state." };
  }

  const now = new Date().toISOString();
  const { error } = await admin
    .from("leads")
    .update({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      state,
      zip_code: zipCode,
      preferred_contact_method: preferredContactMethod,
      best_time_to_contact: bestTimeToContact,
      last_activity_at: now,
      updated_at: now,
    })
    .eq("id", leadId);

  if (error) {
    console.error("Lead contact update failed", error);
    return { ok: false, message: "Lead contact info could not be updated." };
  }

  await admin.from("lead_activity").insert({
    lead_id: leadId,
    user_id: profile.id,
    activity_type: "contact_info_updated",
    description: "Lead contact information updated.",
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/agent/leads");
  revalidatePath(`/agent/leads/${leadId}`);

  return { ok: true, message: "Lead contact info updated." };
}

async function canEditLead(
  admin: ReturnType<typeof createAdminClient>,
  leadId: string,
  profileId: string,
  role: string,
) {
  if (role === "admin" || role === "manager") {
    return true;
  }

  const { data } = await admin
    .from("leads")
    .select("assigned_agent_id, agents!inner(profile_id)")
    .eq("id", leadId)
    .eq("agents.profile_id", profileId)
    .maybeSingle();

  return Boolean(data);
}

function text(value: FormDataEntryValue | null, max: number) {
  const cleaned = String(value ?? "").trim();
  return cleaned ? cleaned.slice(0, max) : null;
}

function optionalText(value: FormDataEntryValue | null, max: number) {
  return text(value, max);
}
