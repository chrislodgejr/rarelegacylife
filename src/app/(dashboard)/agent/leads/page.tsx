import Link from "next/link";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/constants/options";
import { createClient } from "@/lib/supabase/server";
import { LeadGradeBadge } from "@/components/lead/lead-grade-badge";
import type { Lead, LeadGrade } from "@/types/domain";

const pageSize = 20;

type AgentLeadsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AgentLeadsPage({ searchParams }: AgentLeadsPageProps) {
  const params = await searchParams;
  const page = Math.max(Number(getParam(params.page) ?? "1"), 1);
  const status = getParam(params.status);
  const priority = getParam(params.priority);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("id, first_name, last_name, email, phone, state, status, lead_score, lead_grade, lead_temperature, next_follow_up_at, created_at", {
      count: "exact",
    })
    .order("lead_score", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status && LEAD_STATUSES.includes(status as Lead["status"])) {
    query = query.eq("status", status);
  }

  if (priority === "hot_only") {
    query = query.eq("lead_temperature", "hot");
  }

  if (priority === "a_leads") {
    query = query.in("lead_grade", ["A+", "A"]);
  }

  const { data: leads, count } = await query;
  const hasNext = count ? to + 1 < count : false;

  return (
    <div>
      <h1 className="font-premium text-3xl font-semibold text-[#050505]">My leads</h1>
      <p className="mt-2 text-sm text-neutral-600">Only leads assigned to you are visible here.</p>

      <form className="premium-card mt-6 grid max-w-2xl gap-3 rounded-xl p-4 sm:grid-cols-[1fr_150px_auto]" action="/agent/leads">
        <select className="h-10 flex-1 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={status ?? ""} name="status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((leadStatus) => (
            <option key={leadStatus} value={leadStatus}>
              {STATUS_LABELS[leadStatus]}
            </option>
          ))}
        </select>
        <select className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={priority ?? ""} name="priority">
          <option value="">Priority</option>
          <option value="hot_only">Hot only</option>
          <option value="a_leads">A/A+ leads</option>
        </select>
        <button className="gold-gradient-button h-10 rounded-full px-4 text-sm font-semibold" type="submit">
          Filter
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {(leads ?? []).map((lead) => (
          <Link key={lead.id} className={`premium-card rounded-xl p-5 transition hover:border-[#C9A227] ${lead.lead_temperature === "hot" ? "gold-border" : ""}`} href={`/agent/leads/${lead.id}`}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="font-semibold text-[#050505]">
                  {lead.first_name} {lead.last_name}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{lead.email} | {lead.phone}</p>
              </div>
              <div className="grid gap-2 text-sm text-neutral-600 sm:justify-items-end">
                <LeadGradeBadge grade={lead.lead_grade as LeadGrade} score={lead.lead_score} temperature={lead.lead_temperature} />
                <span>{STATUS_LABELS[lead.status as Lead["status"]]}</span>
                <span className="text-xs text-neutral-500">
                  {lead.next_follow_up_at ? `Next: ${new Date(lead.next_follow_up_at).toLocaleDateString()}` : "No follow-up set"}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {!leads?.length ? (
          <div className="premium-card rounded-xl p-6 text-sm text-neutral-500">
            No assigned leads found.
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-neutral-600">{count ?? 0} total</span>
        <div className="flex gap-2">
          {page > 1 ? <PageLink label="Previous" page={page - 1} status={status} priority={priority} /> : null}
          {hasNext ? <PageLink label="Next" page={page + 1} status={status} priority={priority} /> : null}
        </div>
      </div>
    </div>
  );
}

function PageLink({ label, page, status, priority }: { label: string; page: number; status?: string; priority?: string }) {
  const query = new URLSearchParams({ page: String(page) });
  if (status) {
    query.set("status", status);
  }
  if (priority) {
    query.set("priority", priority);
  }

  return (
    <Link className="rounded-full border border-neutral-300 bg-white px-3 py-2 font-medium text-[#050505] transition hover:border-[#C9A227]" href={`/agent/leads?${query.toString()}`}>
      {label}
    </Link>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
