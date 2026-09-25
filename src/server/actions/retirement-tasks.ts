"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

const taskSchema = z.object({
  request_id: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  due_at: z.string().max(40),
});

export async function addRetirementTask(_state: { ok: boolean; message: string }, formData: FormData) {
  const { profile } = await requireRole(["admin", "manager"]);
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Enter a task title and valid date." };
  const { request_id, title, due_at } = parsed.data;
  if (due_at && Number.isNaN(Date.parse(due_at))) return { ok: false, message: "Enter a valid due date." };
  const admin = createAdminClient();
  const { data: request } = await admin.from("retirement_blueprint_requests").select("id").eq("id", request_id).maybeSingle();
  if (!request) return { ok: false, message: "Retirement request not found." };
  const { error } = await admin.from("retirement_case_tasks").insert({ request_id, title, due_at: due_at ? new Date(due_at).toISOString() : null, created_by: profile.id });
  if (error) return { ok: false, message: "Task could not be added." };
  revalidatePath(`/admin/retirement/${request_id}`);
  return { ok: true, message: "Task added." };
}

export async function toggleRetirementTask(formData: FormData) {
  await requireRole(["admin", "manager"]);
  const id = z.string().uuid().safeParse(formData.get("id"));
  const requestId = z.string().uuid().safeParse(formData.get("request_id"));
  if (!id.success || !requestId.success) return;
  const admin = createAdminClient();
  const { data } = await admin.from("retirement_case_tasks").select("completed_at").eq("id", id.data).eq("request_id", requestId.data).maybeSingle();
  if (!data) return;
  await admin.from("retirement_case_tasks").update({ completed_at: data.completed_at ? null : new Date().toISOString() }).eq("id", id.data).eq("request_id", requestId.data);
  revalidatePath(`/admin/retirement/${requestId.data}`);
}
