import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/types/domain";

export default async function AdminAgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("*, agent_licenses(state, license_status)")
    .order("last_name");

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#050505]">Agents</h1>
      <p className="mt-2 text-sm text-neutral-600">Licensed-state routing and assignment readiness.</p>
      <div className="mt-6 grid gap-4">
        {((agents ?? []) as (Agent & { agent_licenses?: { state: string; license_status: string }[] })[]).map((agent) => (
          <div key={agent.id} className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <p className="font-semibold text-[#050505]">
                  {agent.first_name} {agent.last_name}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{agent.email}</p>
              </div>
              <div className="text-sm text-neutral-600">
                {agent.active ? "Active" : "Inactive"} |{" "}
                {agent.accepts_new_leads ? "Accepting leads" : "Not accepting leads"}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(agent.agent_licenses ?? []).map((license) => (
                <span key={license.state} className="rounded-full bg-[#F7F5EF] px-3 py-1 text-xs font-semibold text-[#050505]">
                  {license.state} {license.license_status}
                </span>
              ))}
              {!agent.agent_licenses?.length ? <span className="text-sm text-neutral-500">No licenses recorded.</span> : null}
            </div>
          </div>
        ))}
        {!agents?.length ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No agents yet. Add agents directly in Supabase for the MVP, then manage them here as the CRM expands.
          </div>
        ) : null}
      </div>
    </div>
  );
}
