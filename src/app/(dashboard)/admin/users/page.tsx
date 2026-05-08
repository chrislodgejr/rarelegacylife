import { UserApprovalForm } from "@/components/dashboard/user-approval-form";
import { requireRole } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/constants/options";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types/domain";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#050505]">Users</h1>
      <p className="mt-2 text-sm text-neutral-600">Approve pending users and assign portal roles.</p>

      <div className="mt-6 grid gap-4">
        {((profiles ?? []) as Profile[]).map((profile) => (
          <div key={profile.id} className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row">
              <div>
                <p className="font-semibold text-[#050505]">{profile.full_name ?? profile.email}</p>
                <p className="mt-1 text-sm text-neutral-600">{profile.email}</p>
              </div>
              <div className="text-sm text-neutral-600">
                {ROLE_LABELS[profile.role as AppRole]} | {profile.status}
              </div>
            </div>
            <UserApprovalForm
              currentRole={profile.role}
              currentStatus={profile.status}
              profileId={profile.id}
            />
          </div>
        ))}
        {!profiles?.length ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-500">
            No users found.
          </div>
        ) : null}
      </div>
    </div>
  );
}
