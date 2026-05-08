import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/session";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole(["agent"]);

  return (
    <DashboardShell role="agent" profile={profile}>
      {children}
    </DashboardShell>
  );
}
