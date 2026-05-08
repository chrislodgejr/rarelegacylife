import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/types/domain";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  status: string;
  state: string | null;
};

export default async function AdminAgentsPage() {
  const supabase = await createClient();
  const [{ data: agents }, { data: profiles }] = await Promise.all([
    supabase
      .from("agents")
      .select("*, agent_licenses(state, license_status)")
      .order("last_name"),
    supabase
      .from("profiles")
      .select("id, full_name, email, role, status, state")
      .in("role", ["agent", "manager", "admin", "support"])
      .order("full_name"),
  ]);

  const agentRows = (agents ?? []) as (Agent & { agent_licenses?: { state: string; license_status: string }[] })[];
  const profileRows = (profiles ?? []) as ProfileRow[];

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#050505]">Agents</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Licensed-state routing, assignment readiness, and approved CRM user visibility.
      </p>
      <div className="mt-6 grid gap-4">
        {agentRows.map((agent) => (
          <Link key={agent.id} href={`/admin/agents/${agent.id}`} className="block rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-[#C9A227] hover:shadow-sm">
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
            <p className="mt-4 text-xs font-semibold text-[#8A6A16]">Open full profile</p>
          </Link>
        ))}

        {!agentRows.length && profileRows.map((profile) => (
          <div key={profile.id} className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <p className="font-semibold text-[#050505]">{profile.full_name || profile.email}</p>
                <p className="mt-1 text-sm text-neutral-600">{profile.email}</p>
              </div>
              <div className="text-sm text-neutral-600 capitalize">
                {profile.role} | {profile.status}
              </div>
            </div>
            <div className="mt-4 text-sm text-amber-700">
              CRM user profile found. Activate this user as admin, manager, or agent to create their routing profile.
            </div>
          </div>
        ))}

        {!agentRows.length && !profileRows.length ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No agents or CRM users found yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
