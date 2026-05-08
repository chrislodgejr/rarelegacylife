import { notFound } from "next/navigation";
import { LeadChatForm, LeadEmailForm } from "@/components/lead/communication-forms";
import { LeadContactForm } from "@/components/lead/lead-contact-form";
import { LeadGradeBadge, ScoreReasonList } from "@/components/lead/lead-grade-badge";
import {
  LeadAssignmentForm,
  LeadNoteForm,
  LeadStatusForm,
  LeadTaskForm,
} from "@/components/lead/lead-workflow-forms";
import { COVERAGE_LABELS, STATUS_LABELS } from "@/lib/constants/options";
import { createClient } from "@/lib/supabase/server";
import type { Agent, Lead, LeadGrade } from "@/types/domain";

type LeadDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminLeadDetailPage({ params }: LeadDetailProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle<Lead>();

  if (!lead) {
    notFound();
  }

  const [agentsResult, notesResult, tasksResult, activityResult, communicationsResult, threadResult] = await Promise.all([
    supabase.from("agents").select("*").eq("active", true).order("last_name"),
    supabase.from("lead_notes").select("id, note, created_at, profiles(full_name, email)").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_tasks").select("*").eq("lead_id", id).order("due_date", { ascending: true }),
    supabase.from("lead_activity").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(30),
    supabase.from("communications").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("chat_threads").select("id").eq("lead_id", id).eq("thread_type", "lead").maybeSingle<{ id: string }>(),
  ]);

  const agents = (agentsResult.data ?? []) as Agent[];
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
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase text-[#C9A227]">
                Lead detail
              </p>
              <h1 className="font-premium mt-2 text-4xl font-semibold text-[#050505]">
                {lead.first_name} {lead.last_name}
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                {lead.email} | {lead.phone}
              </p>
            </div>
            <div className="self-start">
              <LeadGradeBadge
                grade={lead.lead_grade as LeadGrade}
                score={lead.lead_score}
                size="lg"
                temperature={lead.lead_temperature}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Info label="Status" value={STATUS_LABELS[lead.status]} />
            <Info label="State" value={`${lead.state} ${lead.zip_code}`} />
            <Info label="Coverage purpose" value={COVERAGE_LABELS[lead.coverage_purpose]} />
            <Info label="Desired coverage" value={lead.desired_coverage_amount ? currency(lead.desired_coverage_amount) : "Not provided"} />
            <Info label="Dependents" value={String(lead.dependents)} />
            <Info label="Health" value={lead.health_rating} />
            <Info label="Tobacco" value={lead.tobacco_use ? "Yes" : "No"} />
            <Info label="Preferred contact" value={lead.preferred_contact_method} />
            <Info label="Best time" value={lead.best_time_to_contact ?? "Not provided"} />
            <Info label="Quote email OTP" value={lead.quote_email_otp_verified ? "Verified" : "Not verified"} />
            <Info label="Created" value={new Date(lead.created_at).toLocaleString()} />
          </div>

          {lead.medical_conditions ? (
            <div className="mt-6 rounded-md bg-neutral-50 p-4">
              <p className="text-sm font-semibold text-[#050505]">Medical conditions</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{lead.medical_conditions}</p>
            </div>
          ) : null}
        </section>

        <section className="premium-card rounded-2xl p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.18em]">
                Lead Grade
              </p>
              <h2 className="font-premium mt-2 text-2xl font-semibold text-[#050505]">
                {lead.lead_grade} / {titleCase(lead.lead_temperature)}
              </h2>
            </div>
            <p className="font-premium text-4xl font-semibold text-[#050505]">{lead.lead_score}/100</p>
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-[#050505]">Why this grade</p>
            <ScoreReasonList breakdown={lead.lead_score_breakdown} />
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#050505]">Tasks</h2>
          <div className="mt-4 grid gap-3">
            {(tasksResult.data ?? []).map((task) => (
              <div key={task.id} className="rounded-md bg-neutral-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <p className="font-semibold text-[#050505]">{task.title}</p>
                  <span className="text-neutral-500">{task.status}</span>
                </div>
                <p className="mt-2 text-neutral-600">{task.description ?? "No description"}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  Due {task.due_date ? new Date(task.due_date).toLocaleString() : "not set"} | {task.priority}
                </p>
              </div>
            ))}
            {!tasksResult.data?.length ? <p className="text-sm text-neutral-500">No tasks yet.</p> : null}
          </div>
        </section>

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
                <div className="flex justify-between gap-4">
                  <p className="font-semibold text-[#050505]">
                    {communication.channel} | {communication.direction}
                  </p>
                  <span className="text-xs text-neutral-500">{communication.status}</span>
                </div>
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

        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#050505]">Notes</h2>
          <div className="mt-4 grid gap-3">
            {(notesResult.data ?? []).map((note) => (
              <div key={note.id} className="rounded-md bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                {note.note}
                <p className="mt-2 text-xs text-neutral-500">{new Date(note.created_at).toLocaleString()}</p>
              </div>
            ))}
            {!notesResult.data?.length ? <p className="text-sm text-neutral-500">No notes yet.</p> : null}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[#050505]">Activity timeline</h2>
          <div className="mt-4 grid gap-3">
            {(activityResult.data ?? []).map((activity) => (
              <div key={activity.id} className="border-l-2 border-[#C9A227] pl-4 text-sm">
                <p className="font-semibold text-[#050505]">{activity.description}</p>
                <p className="mt-1 text-xs text-neutral-500">{new Date(activity.created_at).toLocaleString()}</p>
              </div>
            ))}
            {!activityResult.data?.length ? <p className="text-sm text-neutral-500">No activity yet.</p> : null}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <LeadContactForm lead={lead} />
        <LeadStatusForm currentStatus={lead.status} leadId={lead.id} />
        <LeadAssignmentForm agents={agents} currentAgentId={lead.assigned_agent_id} leadId={lead.id} />
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

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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
