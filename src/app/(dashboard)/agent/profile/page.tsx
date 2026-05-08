import { notFound } from "next/navigation";
import { AgentProfileManager } from "@/components/agent/agent-profile-manager";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AgentProfilePage() {
  const { profile } = await requireRole(["agent"]);
  const admin = createAdminClient();
  const { data: agent } = await admin
    .from("agents")
    .select("id, first_name, last_name, email, phone, state, npn, accepts_new_leads, max_active_leads, current_active_leads")
    .eq("profile_id", profile.id)
    .maybeSingle<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
      state: string | null;
      npn: string | null;
      accepts_new_leads: boolean;
      max_active_leads: number;
      current_active_leads: number;
    }>();

  if (!agent) {
    notFound();
  }

  const [{ data: licenses }, { data: carriers }, { data: contracts }] = await Promise.all([
    admin
      .from("agent_licenses")
      .select("id, state, license_number, expiration_date, license_status")
      .eq("agent_id", agent.id)
      .order("state"),
    admin.from("carriers").select("id, name").eq("active", true).order("name"),
    admin
      .from("agent_carrier_contracts")
      .select("id, carrier_id, writing_number, notes, carriers(name)")
      .eq("agent_id", agent.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AgentProfileManager
      agent={agent}
      licenses={licenses ?? []}
      carriers={carriers ?? []}
      contracts={contracts ?? []}
    />
  );
}
