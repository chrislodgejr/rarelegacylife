import { FeatureRequestForm } from "@/components/agent/feature-request-form";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AgentFeatureRequestsPage() {
  const { profile } = await requireRole(["agent", "manager", "admin", "support"]);
  const admin = createAdminClient();
  const { data: requests } = await admin
    .from("feature_requests")
    .select("id, title, category, priority, status, created_at")
    .eq("submitted_by_profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section>
        <FeatureRequestForm />
      </section>

      <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A16]">
          Recent requests
        </p>
        <h2 className="font-premium mt-2 text-2xl font-semibold text-[#050505]">
          Your submissions
        </h2>
        <div className="mt-5 grid gap-3">
          {(requests ?? []).map((request) => (
            <article key={request.id} className="rounded-xl bg-[#F7F5EF] p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[#050505]">{request.title}</p>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold capitalize text-neutral-600">
                  {request.status}
                </span>
              </div>
              <p className="mt-2 text-xs capitalize text-neutral-500">
                {request.category.replaceAll("_", " ")} | {request.priority}
              </p>
              <p className="mt-2 text-xs text-neutral-400">
                {new Date(request.created_at).toLocaleString()}
              </p>
            </article>
          ))}
          {!requests?.length ? (
            <p className="text-sm leading-6 text-neutral-500">
              No feature requests yet. Submit one and it will also appear in the internal Messages
              thread for admins.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
