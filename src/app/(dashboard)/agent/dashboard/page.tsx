import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export default async function AgentDashboardPage() {
  const { profile } = await requireRole(["agent"]);
  const supabase = await createClient();
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle<{ id: string }>();

  const assignedAgentId = agent?.id ?? "00000000-0000-0000-0000-000000000000";
  const [newLeads, hotLeads, aLeads, contacted, scheduled, submitted, placed, lost, overdueTasks, overdueHot] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).in("status", ["new", "assigned"]),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("lead_temperature", "hot"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).in("lead_grade", ["A+", "A"]),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("status", "contacted"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("status", "scheduled"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("status", "application_submitted"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("status", "placed"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("assigned_agent_id", assignedAgentId).eq("status", "lost"),
    supabase.from("lead_tasks").select("*", { count: "exact", head: true }).eq("assigned_user_id", profile.id).eq("status", "overdue"),
    supabase.from("lead_tasks").select("lead_id, leads!inner(assigned_agent_id, lead_temperature)", { count: "exact", head: true }).eq("assigned_user_id", profile.id).eq("status", "overdue").eq("leads.assigned_agent_id", assignedAgentId).eq("leads.lead_temperature", "hot"),
  ]);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-premium text-3xl font-semibold text-[#050505]">Agent dashboard</h1>
          <p className="mt-2 text-sm text-neutral-600">Your assigned pipeline and follow-up workload.</p>
        </div>
        <Link className="gold-gradient-button inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold" href="/agent/leads">
          View my leads
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="New leads" value={newLeads.count ?? 0} />
        <Metric label="Hot leads" value={hotLeads.count ?? 0} />
        <Metric label="A/A+ leads" value={aLeads.count ?? 0} />
        <Metric label="Contacted" value={contacted.count ?? 0} />
        <Metric label="Scheduled" value={scheduled.count ?? 0} />
        <Metric label="Applications" value={submitted.count ?? 0} />
        <Metric label="Placed" value={placed.count ?? 0} />
        <Metric label="Lost" value={lost.count ?? 0} />
        <Metric label="Overdue tasks" value={overdueTasks.count ?? 0} />
        <Metric label="Overdue hot" value={overdueHot.count ?? 0} />
      </div>
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
