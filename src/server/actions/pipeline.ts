"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { LEAD_STATUSES } from "@/lib/constants/options";

const inputSchema = z.object({
  kind: z.enum(["quote", "retirement", "inquiry"]),
  id: z.string().uuid(),
  status: z.string().min(1).max(40),
});
const retirementStages = ["new", "contacted", "scheduled", "completed", "closed", "spam"];
const inquiryStages = ["new", "contacted", "scheduled", "closed", "spam"];

export async function movePipelineItem(formData: FormData) {
  await requireRole(["admin", "manager"]);
  const parsed = inputSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { kind, id, status } = parsed.data;
  if (kind === "quote" && !LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return;
  if (kind === "retirement" && !retirementStages.includes(status)) return;
  if (kind === "inquiry" && !inquiryStages.includes(status)) return;
  const table = kind === "quote" ? "leads" : kind === "retirement" ? "retirement_blueprint_requests" : "contact_messages";
  const admin = createAdminClient();
  const { error } = await admin.from(table).update({ status }).eq("id", id);
  if (error) { console.error("CRM pipeline move failed", error); return; }
  if (kind === "quote") await admin.from("lead_activity").insert({ lead_id: id, activity_type: "status_changed", description: `Pipeline stage changed to ${status}.` });
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/contacts");
  revalidatePath(kind === "quote" ? `/admin/leads/${id}` : kind === "retirement" ? `/admin/retirement/${id}` : `/admin/inquiries/${id}`);
}
