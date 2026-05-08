import type { SupabaseClient } from "@supabase/supabase-js";
import type { Agent } from "@/types/domain";

type AssignmentResult = {
  agent: Agent | null;
  reason: string;
};

export async function findAgentForLead(
  supabase: SupabaseClient,
  state: string,
): Promise<AssignmentResult> {
  const { data: licenses, error: licenseError } = await supabase
    .from("agent_licenses")
    .select("agent_id")
    .eq("state", state)
    .eq("license_status", "active");

  if (licenseError || !licenses?.length) {
    return { agent: null, reason: "No active licensed agent found for state" };
  }

  const agentIds = licenses.map((license) => license.agent_id).filter(Boolean);

  const { data: agents, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .in("id", agentIds)
    .eq("active", true)
    .eq("accepts_new_leads", true);

  if (agentError || !agents?.length) {
    return { agent: null, reason: "No active agent is accepting new leads for state" };
  }

  const eligibleAgents = (agents as Agent[])
    .filter((agent) => agent.current_active_leads < agent.max_active_leads)
    .sort((a, b) => {
      if (!a.last_assigned_at && b.last_assigned_at) return -1;
      if (a.last_assigned_at && !b.last_assigned_at) return 1;
      if (!a.last_assigned_at && !b.last_assigned_at) {
        return b.lead_weight - a.lead_weight;
      }

      return (
        new Date(a.last_assigned_at ?? 0).getTime() -
        new Date(b.last_assigned_at ?? 0).getTime()
      );
    });

  if (!eligibleAgents.length) {
    return { agent: null, reason: "Licensed agents are currently at capacity" };
  }

  return { agent: eligibleAgents[0], reason: "Matched by state license and round-robin" };
}
