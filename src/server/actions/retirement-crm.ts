"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "scheduled", "completed", "closed", "spam"]),
  next_follow_up_at: z.string().max(40),
  retirement_goal: z.string().max(2000),
  target_retirement_date: z.string().max(10),
  income_goal_monthly: z.string().max(20),
  available_assets_range: z.string().max(120),
  existing_annuity_notes: z.string().max(4000),
  liquidity_needs: z.string().max(4000),
  risk_tolerance_notes: z.string().max(4000),
  beneficiary_notes: z.string().max(4000),
  replacement_discussion: z.string().max(4000),
  case_notes: z.string().max(10000),
});

export async function updateRetirementCase(_state: { ok: boolean; message: string }, formData: FormData) {
  await requireRole(["admin", "manager"]);
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { ok: false, message: result.error.issues[0]?.message ?? "Check your entries." };
  const { id, next_follow_up_at, target_retirement_date, income_goal_monthly, ...fields } = result.data;
  const amount = income_goal_monthly ? Number(income_goal_monthly) : null;
  if ((amount !== null && (!Number.isFinite(amount) || amount < 0 || amount > 100000000)) ||
      (next_follow_up_at && Number.isNaN(Date.parse(next_follow_up_at))) ||
      (target_retirement_date && !/^\d{4}-\d{2}-\d{2}$/.test(target_retirement_date))) {
    return { ok: false, message: "Check the income, follow-up, and retirement dates." };
  }
  const admin = createAdminClient();
  const { error } = await admin.from("retirement_blueprint_requests").update({
    ...fields,
    next_follow_up_at: next_follow_up_at ? new Date(next_follow_up_at).toISOString() : null,
    target_retirement_date: target_retirement_date || null,
    income_goal_monthly: amount,
    ...(fields.status === "contacted" ? { last_contacted_at: new Date().toISOString() } : {}),
  }).eq("id", id);
  if (error) return { ok: false, message: "Could not save this retirement case." };
  revalidatePath("/admin/retirement");
  revalidatePath(`/admin/retirement/${id}`);
  return { ok: true, message: "Case saved." };
}
