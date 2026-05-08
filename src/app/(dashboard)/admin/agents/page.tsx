import { createAdminClient } from "@/lib/supabase/admin";
import type { Agent } from "@/types/domain";

type AgentWithLicenses = Agent & {
  agent_licenses?: { state: string; license_status: string }[];
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  state: string | null;
  created_at: string;
};

type DisplayAgent = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  state: string | null;
  active: boolean;
  acceptsNewLeads: boolean | null;
  source: "routing" | "profile";
  licenses: { state: string; license_status: string }[];
};

export default async function AdminAgentsPage() {
  const admin = createAdminClient();
  const [{ data: agents }, { data: profiles }] = await Promise.all([
    admin
      .from("agents")
      .select("*, agent_licenses(state, license_status)")
      .order("last_name"),
    admin
      .from("profiles")
      .select("id, full_name, email, role, status, phone, state, created_at")
      .in("role", ["agent", "manager", "admin", "support"])
      .order("full_name", { ascending: true }),
  ]);

  const displayAgents = mergeAgentRecords(
    (agents ?? []) as AgentWithLicenses[],
    (profiles ?? []) as ProfileRow[],
  );

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold text-[#050505]">Agents</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">
            Agent routing records plus approved CRM users. Profiles appear here even before a full
            routing record has been created, so the team list does not look empty during setup.
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
          {displayAgents.length} CRM user{displayAgents.length === 1 ? "" : "s"} visible
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {displayAgents.map((agent) => (
          <div key={`${agent.source}-${agent.id}`} className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[#050505]">{agent.name}</p>
                  <span className="rounded-full bg-[#F7F5EF] px-2.5 py-1 text-xs font-semibold capitalize text-neutral-700">
                    {agent.role}
                  </span>
                  <span className="rounded-full bg-[#F7F5EF] px-2.5 py-1 text-xs font-semibold capitalize text-neutral-700">
                    {agent.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">{agent.email}</p>
                {agent.phone ? <p className="mt-1 text-sm text-neutral-500">{agent.phone}</p> : null}
              </div>
              <div className="text-sm text-neutral-600 md:text-right">
                <p>{agent.active ? "Active" : "Inactive"}</p>
                {agent.acceptsNewLeads === null ? (
                  <p className="mt-1 text-amber-700">Profile only - add routing record for lead assignment</p>
                ) : (
                  <p className="mt-1">{agent.acceptsNewLeads ? "Accepting leads" : "Not accepting leads"}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.licenses.map((license) => (
                <span key={`${agent.id}-${license.state}`} className="rounded-full bg-[#F7F5EF] px-3 py-1 text-xs font-semibold text-[#050505]">
                  {license.state} {license.license_status}
                </span>
              ))}
              {!agent.licenses.length && agent.state ? (
                <span className="rounded-full bg-[#F7F5EF] px-3 py-1 text-xs font-semibold text-[#050505]">
                  Profile state: {agent.state}
                </span>
              ) : null}
              {!agent.licenses.length && !agent.state ? <span className="text-sm text-neutral-500">No licenses recorded.</span> : null}
            </div>
          </div>
        ))}
        {!displayAgents.length ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No CRM users or routing agents found yet. Create or approve users first, then add routing
            records as needed for lead assignment.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function mergeAgentRecords(agents: AgentWithLicenses[], profiles: ProfileRow[]) {
  const agentProfileIds = new Set(agents.map((agent) => agent.profile_id).filter(Boolean));
  const routingAgents: DisplayAgent[] = agents.map((agent) => ({
    id: agent.id,
    name: `${agent.first_name} ${agent.last_name}`.trim() || agent.email,
    email: agent.email,
    role: "agent",
    status: agent.active ? "active" : "inactive",
    phone: agent.phone,
    state: agent.state,
    active: agent.active,
    acceptsNewLeads: agent.accepts_new_leads,
    source: "routing",
    licenses: agent.agent_licenses ?? [],
  }));

  const profileOnlyAgents: DisplayAgent[] = profiles
    .filter((profile) => !agentProfileIds.has(profile.id))
    .map((profile) => ({
      id: profile.id,
      name: profile.full_name?.trim() || profile.email,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      phone: profile.phone,
      state: profile.state,
      active: profile.status === "active",
      acceptsNewLeads: null,
      source: "profile",
      licenses: [],
    }));

  return [...routingAgents, ...profileOnlyAgents].sort((a, b) => a.name.localeCompare(b.name));
}
