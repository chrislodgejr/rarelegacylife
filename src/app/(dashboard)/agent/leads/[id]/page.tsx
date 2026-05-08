import { notFound } from "next/navigation";
import { LeadChatForm, LeadEmailForm } from "@/components/lead/communication-forms";
import { LeadGradeBadge, ScoreReasonList } from "@/components/lead/lead-grade-badge";
import { LeadNoteForm, LeadStatusForm, LeadTaskForm } from "@/components/lead/lead-workflow-forms";
import { COVERAGE_LABELS, STATUS_LABELS } from "@/lib/constants/options";
import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadGrade } from "@/types/domain";

type AgentLeadDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AgentLeadDetailPage({ params }: AgentLeadDetailProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle<Lead>();

  if (!lead) {
    notFound();
  }

  const [notesResult, tasksResult, activityResult, communicationsResult, threadResult] = await Promise.all([
    supabase.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_tasks").select("*").eq("lead_id", id).order("due_date", { ascending: true }),
    supabase.from("lead_activity").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(30),
    supabase.from("communications").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("chat_threads").select("id").eq("lead_id", id).eq("thread_type", "lead").maybeSingle<{ id: string }>(),
  ]);
  const { data: chatMessages } = threadResult.data
    ? await supabase
        .from("chat_messages")
        .select("id, body, created_at, profiles(full_name, email)")
        .eq("thread_id", threadResult.data.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(25)
    : { data: [] };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="premium-card rounded-2xl p-6">
          <p className="text-sm font-semibold uppercase text-[#C9A227]">Assigned lead</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row">
            <h1 className="font-premium text-4xl font-semibold text-[#050505]">
              {lead.first_name} {lead.last_name}
            </h1>
            <LeadGradeBadge
              grade={lead.lead_grade as LeadGrade}
              score={lead.lead_score}
              size="lg"
              temperature={lead.lead_temperature}
            />
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            {lead.email} | {lead.phone}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Info label="Status" value={STATUS_LABELS[lead.status]} />
            <Info label="Grade" value={`${lead.lead_grade} / ${titleCase(lead.lead_temperature)}`} />
            <Info label="State" value={`${lead.state} ${lead.zip_code}`} />
            <Info label="Purpose" value={COVERAGE_LABELS[lead.coverage_purpose]} />
            <Info label="Health" value={lead.health_rating} />
            <Info label="Preferred contact" value={lead.preferred_contact_method} />
            <Info label="Quote email OTP" value={lead.quote_email_otp_verified ? "Verified" : "Not verified"} />
          </div>
          {lead.medical_conditions ? (
            <div className="mt-6 rounded-md bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
              <p className="font-semibold text-[#050505]">Medical conditions</p>
              <p className="mt-2">{lead.medical_conditions}</p>
            </div>
          ) : null}
        </section>
        <section className="premium-card rounded-2xl p-6">
          <h2 className="font-premium text-2xl font-semibold text-[#050505]">Why this lead is prioritized</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Score {lead.lead_score}/100 based on coverage intent, family details, health basics,
            and follow-up readiness.
          </p>
          <div className="mt-5">
            <ScoreReasonList breakdown={lead.lead_score_breakdown} />
          </div>
        </section>

        <Timeline title="Tasks" empty="No tasks yet." items={tasksResult.data ?? []} />
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#050505]">Lead chat</h2>
          <div className="mt-4 grid gap-3">
            {(chatMessages ?? []).map((message) => (
              <div key={message.id} className="rounded-md bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                <p className="font-semibold text-[#050505]">
                  {profileName(message.profiles)}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
                <p className="mt-2 text-xs text-neutral-500">{new Date(message.created_at).toLocaleString()}</p>
              </div>
            ))}
            {!chatMessages?.length ? <p className="text-sm text-neutral-500">No lead chat messages yet.</p> : null}
          </div>
          <div className="mt-5">
            <LeadChatForm leadId={lead.id} />
          </div>
        </section>
        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#050505]">Communication history</h2>
          <div className="mt-4 grid gap-3">
            {(communicationsResult.data ?? []).map((communication) => (
              <div key={communication.id} className="rounded-md bg-neutral-50 p-4 text-sm">
                <p className="font-semibold text-[#050505]">
                  {communication.channel} | {communication.direction}
                </p>
                {communication.subject ? (
                  <p className="mt-2 font-medium text-neutral-700">{communication.subject}</p>
                ) : null}
                <p className="mt-2 line-clamp-3 text-neutral-600">{communication.body ?? "No body logged"}</p>
                <p className="mt-2 text-xs text-neutral-500">{new Date(communication.created_at).toLocaleString()}</p>
              </div>
            ))}
            {!communicationsResult.data?.length ? <p className="text-sm text-neutral-500">No communications yet.</p> : null}
          </div>
        </section>
        <Timeline title="Notes" empty="No notes yet." items={notesResult.data ?? []} />
        <Timeline title="Activity" empty="No activity yet." items={activityResult.data ?? []} />
      </div>
      <aside className="space-y-4">
        <LeadStatusForm currentStatus={lead.status} leadId={lead.id} />
        <LeadEmailForm leadId={lead.id} />
        <LeadNoteForm leadId={lead.id} />
        <LeadTaskForm leadId={lead.id} />
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#050505]">{value}</p>
    </div>
  );
}

function Timeline({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: Record<string, string | null>[];
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-[#050505]">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item.id ?? `${title}-${item.created_at}`} className="rounded-md bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            {item.note ?? item.description ?? item.title}
            <p className="mt-2 text-xs text-neutral-500">
              {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
            </p>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-neutral-500">{empty}</p> : null}
      </div>
    </section>
  );
}

function profileName(profile: unknown) {
  const normalized = Array.isArray(profile) ? profile[0] : profile;

  if (!normalized || typeof normalized !== "object") {
    return "CRM user";
  }

  const value = normalized as { full_name?: string | null; email?: string | null };
  return value.full_name ?? value.email ?? "CRM user";
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
