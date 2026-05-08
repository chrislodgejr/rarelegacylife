import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [allLeads, hotLeads, aLeads, unassignedLeads, pendingUsers, openTasks, applications, placedPolicies] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("lead_temperature", "hot"),
    supabase.from("leads").select("*", { count: "exact", head: true }).in("lead_grade", ["A+", "A"]),
    supabase.from("leads").select("*", { count: "exact", head: true }).is("assigned_agent_id", null),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("lead_tasks").select("*", { count: "exact", head: true }).in("status", ["open", "in_progress", "overdue"]),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "application_submitted"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "placed"),
  ]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-premium text-3xl font-semibold text-[#050505]">Admin dashboard</h1>
          <p className="mt-2 text-sm text-neutral-600">Pipeline visibility for the first working CRM.</p>
        </div>
        <Link className="gold-gradient-button inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold" href="/admin/leads">
          View leads
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4 xl:grid-cols-8">
        <Metric label="Total leads" value={allLeads.count ?? 0} />
        <Metric label="Hot leads" value={hotLeads.count ?? 0} />
        <Metric label="A/A+ leads" value={aLeads.count ?? 0} />
        <Metric label="Unassigned" value={unassignedLeads.count ?? 0} />
        <Metric label="Pending users" value={pendingUsers.count ?? 0} />
        <Metric label="Open tasks" value={openTasks.count ?? 0} />
        <Metric label="Applications" value={applications.count ?? 0} />
        <Metric label="Placed" value={placedPolicies.count ?? 0} />
      </div>
      <section className="premium-card mt-8 rounded-xl p-6">
        <h2 className="font-premium text-xl font-semibold text-[#050505]">MVP workflow</h2>
        <div className="mt-4 grid gap-3 text-sm text-neutral-700 md:grid-cols-3">
          <p className="rounded-md bg-neutral-50 p-4">Quote form submissions are scored and stored with consent records.</p>
          <p className="rounded-md bg-neutral-50 p-4">Licensed active agents can receive state-matched assignments.</p>
          <p className="rounded-md bg-neutral-50 p-4">Admins can review leads, assignments, notes, tasks, and pending users.</p>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="premium-card overflow-hidden rounded-xl p-5">
      <div className="gold-divider -mx-5 -mt-5 mb-5" />
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#050505]">{value}</p>
    </div>
  );
}
