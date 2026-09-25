import Link from "next/link";
import { notFound } from "next/navigation";
import { RetirementTaskForm } from "@/components/dashboard/retirement-task-form";
import { movePipelineItem } from "@/server/actions/pipeline";
import { toggleRetirementTask } from "@/server/actions/retirement-tasks";
import { RetirementCaseForm } from "@/components/dashboard/retirement-case-form";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function RetirementCase({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin", "manager"]);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await createAdminClient().from("retirement_blueprint_requests").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const { data: tasks, error: tasksError } = await createAdminClient().from("retirement_case_tasks").select("id,title,due_at,completed_at").eq("request_id", id).order("created_at", { ascending: false });
  return <div className="space-y-5">
    <Link href="/admin/retirement" className="text-sm underline">← Retirement inbox</Link>
    <div className="premium-card rounded-2xl p-5 sm:p-7"><p className="text-xs uppercase tracking-wider text-[#8A6A16]">Retirement inquiry · {data.source}</p><h1 className="font-premium mt-2 text-3xl font-semibold">{data.first_name} {data.last_name}</h1>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><a href={`tel:${data.phone}`} className="underline">{data.phone}</a><a href={`mailto:${data.email}`} className="underline">{data.email}</a><p>ZIP: {data.zip_code}</p><p>Meeting: {data.meeting_style}</p><p>Best time: {data.best_time_to_contact}</p><p>Received: {new Date(data.created_at).toLocaleString()}</p></div>
      {data.question && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F7F5EF] p-4 text-sm">{data.question}</p>}
      <p className="mt-4 text-xs text-neutral-500">Consent recorded {data.consent_timestamp ? new Date(data.consent_timestamp).toLocaleString() : "—"} · Source: {data.landing_page ?? "website"}</p>
    </div>
    <form action={movePipelineItem} className="premium-card flex flex-wrap items-end gap-3 rounded-2xl p-5"><input type="hidden" name="kind" value="retirement" /><input type="hidden" name="id" value={id} /><label className="grid flex-1 gap-1 text-sm font-medium">Pipeline stage<select name="status" defaultValue={data.status} className="h-11 rounded-xl border border-neutral-300 bg-white px-3">{["new", "contacted", "scheduled", "completed", "closed", "spam"].map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></label><button className="gold-gradient-button h-11 rounded-xl px-5 font-semibold">Save stage</button></form>
    {!tasksError && <section className="premium-card rounded-2xl p-5 sm:p-7"><h2 className="font-premium text-2xl font-semibold">Follow-up tasks</h2>
      <div className="mt-4 grid gap-2">{tasks?.map(task => <form action={toggleRetirementTask} key={task.id} className="flex items-center gap-3 rounded-xl bg-[#F7F5EF] p-3 text-sm"><input type="hidden" name="id" value={task.id} /><input type="hidden" name="request_id" value={id} /><button type="submit" aria-label={task.completed_at ? "Reopen task" : "Complete task"} className="h-8 w-8 shrink-0 rounded-full border border-[#C9A227]">{task.completed_at ? "✓" : "○"}</button><span className={task.completed_at ? "line-through text-neutral-500" : ""}>{task.title}</span><span className="ml-auto text-xs text-neutral-500">{task.due_at ? new Date(task.due_at).toLocaleDateString() : ""}</span></form>)}{!tasks?.length && <p className="text-sm text-neutral-500">No tasks yet.</p>}</div>
      <RetirementTaskForm requestId={id} />
    </section>}
    {"case_notes" in data && <RetirementCaseForm request={data} />}
  </div>;
}
