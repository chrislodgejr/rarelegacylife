import { crmClock } from "@/lib/crm/time";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCrmItems, groupContacts } from "@/lib/crm/data";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminDashboardPage() {
  await requireRole(["admin", "manager"]);
  const [{ items, errors }, tasks] = await Promise.all([
    getCrmItems(),
    createAdminClient().from("lead_tasks").select("id,due_date,status").in("status", ["open", "in_progress", "overdue"]).limit(200),
  ]);
  const active = items.filter(item => !["closed", "lost", "not_qualified", "do_not_contact", "spam", "placed", "completed"].includes(item.status));
  const newRecords = active.filter(item => ["new", "assigned"].includes(item.status));
  const recent = items.slice(0, 8);
  const clock = crmClock();
  const overdue = (tasks.data ?? []).filter(task => task.due_date && new Date(task.due_date).getTime() < clock.now).length;
  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16]">Rare Legacy Life</p><h1 className="font-premium mt-1 text-3xl font-semibold sm:text-4xl">Your CRM</h1><p className="mt-2 text-sm text-neutral-600">One shared view of every person, inquiry, and next action.</p></div><Link href="/admin/pipeline" className="gold-gradient-button rounded-full px-5 py-3 text-sm font-semibold">Open pipeline</Link></div>
    {errors.length > 0 && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm">Some records could not be loaded: {errors.join(", ")}.</p>}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Metric label="Contacts" value={groupContacts(items).length} href="/admin/contacts" />
      <Metric label="Open pipeline" value={active.length} href="/admin/pipeline" />
      <Metric label="New inquiries" value={newRecords.length} href="/admin/pipeline?kind=all" />
      <Metric label="Overdue tasks" value={overdue} href="/admin/tasks" />
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <section className="premium-card rounded-2xl p-5 sm:p-6"><div className="flex items-center justify-between gap-2"><h2 className="font-premium text-2xl font-semibold">Recent activity</h2><Link href="/admin/contacts" className="text-sm text-[#8A6A16] underline">All contacts</Link></div><div className="mt-4 divide-y divide-neutral-100">{recent.map(item => <Link key={`${item.kind}:${item.id}`} href={item.href} className="flex items-center justify-between gap-3 py-3 hover:bg-neutral-50"><span className="min-w-0"><strong className="block truncate text-sm">{item.name}</strong><span className="text-xs capitalize text-neutral-500">{item.kind} · {item.status.replaceAll("_", " ")}</span></span><span className="shrink-0 text-xs text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span></Link>)}{!recent.length && <p className="py-4 text-sm text-neutral-500">No inquiries yet.</p>}</div></section>
      <section className="premium-card rounded-2xl p-5 sm:p-6"><h2 className="font-premium text-2xl font-semibold">Workspaces</h2><div className="mt-4 grid gap-3">
        <Workspace href="/admin/leads" label="Life insurance quotes" count={items.filter(i => i.kind === "quote").length} />
        <Workspace href="/admin/retirement" label="Retirement reviews" count={items.filter(i => i.kind === "retirement").length} />
        <Workspace href="/admin/contacts?type=website_lead" label="Website coverage leads" count={items.filter(i => i.kind === "inquiry" && i.detail === "get_coverage").length} />
        <Workspace href="/admin/contacts?type=inquiry" label="Other contact inquiries" count={items.filter(i => i.kind === "inquiry" && i.detail !== "get_coverage").length} />
        <Workspace href="/admin/tasks" label="Follow-up tasks" count={(tasks.data ?? []).length} />
      </div></section>
    </div>
  </div>;
}
function Metric({ label, value, href }: { label: string; value: number; href: string }) { return <Link href={href} className="premium-card rounded-2xl p-4 sm:p-5"><p className="text-xs text-neutral-500 sm:text-sm">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></Link>; }
function Workspace({ href, label, count }: { href: string; label: string; count: number }) { return <Link href={href} className="flex items-center justify-between rounded-xl bg-[#F7F5EF] p-4 text-sm font-semibold hover:bg-[#F1E8CB]"><span>{label}</span><span>{count} →</span></Link>; }
