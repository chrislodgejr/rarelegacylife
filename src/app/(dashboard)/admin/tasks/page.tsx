import { crmClock } from "@/lib/crm/time";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { toggleQuoteTask } from "@/server/actions/task-center";
import { toggleRetirementTask } from "@/server/actions/retirement-tasks";

export default async function TaskCenter({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireRole(["admin", "manager"]);
  const { view } = await searchParams;
  const admin = createAdminClient();
  const [quotes, retirement] = await Promise.all([
    admin.from("lead_tasks").select("id,lead_id,title,due_date,status,priority,created_at,leads(first_name,last_name)").order("due_date", { ascending: true, nullsFirst: false }).limit(200),
    admin.from("retirement_case_tasks").select("id,request_id,title,due_at,completed_at,created_at,retirement_blueprint_requests(first_name,last_name)").order("due_at", { ascending: true, nullsFirst: false }).limit(200),
  ]);
  const rows = [
    ...(quotes.data ?? []).map(t => ({ key: `q:${t.id}`, id: t.id, kind: "quote" as const, recordId: t.lead_id, title: t.title, dueAt: t.due_date, completed: t.status === "completed", contact: t.leads ? `${t.leads[0]?.first_name} ${t.leads[0]?.last_name}` : "Quote", href: `/admin/leads/${t.lead_id}` })),
    ...(retirement.data ?? []).map(t => ({ key: `r:${t.id}`, id: t.id, kind: "retirement" as const, recordId: t.request_id, title: t.title, dueAt: t.due_at, completed: Boolean(t.completed_at), contact: t.retirement_blueprint_requests ? `${t.retirement_blueprint_requests[0]?.first_name} ${t.retirement_blueprint_requests[0]?.last_name}` : "Retirement", href: `/admin/retirement/${t.request_id}` })),
  ].sort((a,b) => (a.dueAt ?? "9999").localeCompare(b.dueAt ?? "9999"));
  const visible = rows.filter(t => view === "completed" ? t.completed : !t.completed);
  const clock = crmClock();
  const overdue = visible.filter(t => t.dueAt && new Date(t.dueAt).getTime() < clock.now).length;
  return <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16]">Next actions</p><h1 className="font-premium mt-1 text-3xl font-semibold">Tasks</h1><p className="mt-2 text-sm text-neutral-600">{visible.length} {view === "completed" ? "completed" : "open"} · {view === "completed" ? "" : `${overdue} overdue`}</p></div>
    <div className="flex gap-2 text-sm"><Link href="/admin/tasks" className={`rounded-full px-4 py-2 ${view !== "completed" ? "bg-black text-white" : "border bg-white"}`}>Open</Link><Link href="/admin/tasks?view=completed" className={`rounded-full px-4 py-2 ${view === "completed" ? "bg-black text-white" : "border bg-white"}`}>Completed</Link></div>
    {quotes.error && <p role="alert" className="text-sm text-red-700">Quote tasks could not be loaded.</p>}
    <div className="grid gap-3">{visible.map(t => <article key={t.key} className="premium-card flex items-center gap-3 rounded-2xl p-4"><form action={t.kind === "quote" ? toggleQuoteTask : toggleRetirementTask}><input type="hidden" name="id" value={t.id} />{t.kind === "retirement" && <input type="hidden" name="request_id" value={t.recordId} />}<button aria-label={t.completed ? "Reopen task" : "Complete task"} className="h-10 w-10 rounded-full border border-[#C9A227] font-semibold">{t.completed ? "✓" : "○"}</button></form><div className="min-w-0 flex-1"><Link href={t.href} className="font-semibold hover:underline">{t.title}</Link><p className="mt-1 text-xs text-neutral-500">{t.contact} · {t.kind} {t.dueAt ? `· Due ${new Date(t.dueAt).toLocaleString()}` : ""}</p></div></article>)}{!visible.length && <p className="rounded-xl bg-white p-5 text-sm text-neutral-500">No tasks in this view.</p>}</div>
  </div>;
}
