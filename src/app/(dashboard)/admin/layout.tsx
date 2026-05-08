import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole(["admin", "manager"]);

  return (
    <DashboardShell role={profile.role === "manager" ? "manager" : "admin"} profile={profile}>
      {children}
    </DashboardShell>
  );
}
