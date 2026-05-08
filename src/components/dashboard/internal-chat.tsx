import { InternalChatForm } from "@/components/lead/communication-forms";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type MessageRow = {
  id: string;
  body: string;
  created_at: string;
  sender_profile_id: string | null;
  profiles: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
};

export async function InternalChat({ title }: { title: string }) {
  const threadId = await ensureInternalThread();
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("chat_messages")
    .select("id, body, created_at, sender_profile_id, profiles(full_name, email)")
    .eq("thread_id", threadId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold uppercase text-[#C9A227]">
              Internal group chat
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#050505]">{title}</h1>
            <p className="mt-2 text-sm text-neutral-600">
              Team coordination for lead follow-up, handoffs, and urgent updates.
            </p>
          </div>
          <div className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            Realtime-ready
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          {((messages ?? []) as unknown as MessageRow[]).map((message) => (
            <article key={message.id} className="rounded-lg bg-neutral-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#050505]">
                    {profileName(message.profiles)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                    {message.body}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-neutral-400">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
          {!messages?.length ? (
            <div className="rounded-lg bg-neutral-50 p-6 text-sm text-neutral-500">
              No internal messages yet.
            </div>
          ) : null}
        </div>
      </section>

      <aside>
        <InternalChatForm threadId={threadId} />
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-5 text-sm leading-6 text-neutral-600">
          Use this for internal coordination. Client-facing details should stay attached to the
          lead record through notes, email logs, and lead chat.
        </div>
      </aside>
    </div>
  );
}

async function ensureInternalThread() {
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("chat_threads")
    .select("id")
    .eq("thread_type", "internal")
    .eq("visibility", "company")
    .maybeSingle<{ id: string }>();

  if (existing) {
    return existing.id;
  }

  const { data: thread, error } = await admin
    .from("chat_threads")
    .insert({
      name: "Rare Legacy Life Internal",
      thread_type: "internal",
      visibility: "company",
      active: true,
      metadata: { purpose: "company_internal_chat" },
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !thread) {
    throw new Error("Could not create internal chat thread.");
  }

  return thread.id;
}

function profileName(
  profile: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null,
) {
  const normalized = Array.isArray(profile) ? profile[0] : profile;
  return normalized?.full_name ?? normalized?.email ?? "CRM user";
}
