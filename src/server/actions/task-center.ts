"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleQuoteTask(formData: FormData) {
  await requireRole(["admin", "manager"]);
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const admin = createAdminClient();
  const { data } = await admin.from("lead_tasks").select("lead_id,status").eq("id", id.data).maybeSingle();
  if (!data) return;
  const completed = data.status === "completed";
  const { error } = await admin.from("lead_tasks").update({ status: completed ? "open" : "completed", completed_at: completed ? null : new Date().toISOString() }).eq("id", id.data);
  if (error) { console.error("Task update failed", error); return; }
  revalidatePath("/admin/tasks");
  revalidatePath(`/admin/leads/${data.lead_id}`);
}
