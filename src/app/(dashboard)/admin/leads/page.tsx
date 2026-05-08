import Link from "next/link";
import { COVERAGE_LABELS, STATUS_LABELS, LEAD_STATUSES } from "@/lib/constants/options";
import { createClient } from "@/lib/supabase/server";
import { LeadGradeBadge } from "@/components/lead/lead-grade-badge";
import type { Lead, LeadGrade } from "@/types/domain";

const pageSize = 20;

type LeadsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const page = Math.max(Number(getParam(params.page) ?? "1"), 1);
  const status = getParam(params.status);
  const state = getParam(params.state)?.toUpperCase();
  const grade = getParam(params.grade);
  const temperature = getParam(params.temperature);
  const priority = getParam(params.priority);
  const sort = getParam(params.sort) ?? "highest_score";
  const minScore = parseScore(getParam(params.min_score));
  const maxScore = parseScore(getParam(params.max_score));
  const search = sanitizeSearch(getParam(params.q));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("id, first_name, last_name, email, phone, state, coverage_purpose, status, lead_score, lead_grade, lead_temperature, assigned_agent_id, created_at, last_activity_at, next_follow_up_at", {
      count: "exact",
    })
    .range(from, to);

  if (status && LEAD_STATUSES.includes(status as Lead["status"])) {
    query = query.eq("status", status);
  }

  if (state) {
    query = query.eq("state", state);
  }

  if (isLeadGrade(grade)) {
    query = query.eq("lead_grade", grade);
  }

  if (temperature === "hot" || temperature === "warm" || temperature === "cold") {
    query = query.eq("lead_temperature", temperature);
  }

  if (Number.isFinite(minScore)) {
    query = query.gte("lead_score", minScore);
  }

  if (Number.isFinite(maxScore)) {
    query = query.lte("lead_score", maxScore);
  }

  if (priority === "hot_only") {
    query = query.eq("lead_temperature", "hot");
  }

  if (priority === "a_leads") {
    query = query.in("lead_grade", ["A+", "A"]);
  }

  if (priority === "low_quality") {
    query = query.in("lead_grade", ["D", "F"]);
  }

  if (priority === "unassigned_hot") {
    query = query.eq("lead_temperature", "hot").is("assigned_agent_id", null);
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  query = applySort(query, sort);

  const { data: leads, count } = await query;
  const agentIds = Array.from(new Set((leads ?? []).map((lead) => lead.assigned_agent_id).filter(Boolean)));
  const { data: agents } = agentIds.length
    ? await supabase.from("agents").select("id, first_name, last_name").in("id", agentIds)
    : { data: [] };
  const agentMap = new Map((agents ?? []).map((agent) => [agent.id, `${agent.first_name} ${agent.last_name}`]));
  const hasNext = count ? to + 1 < count : false;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-premium text-3xl font-semibold text-[#050505]">Leads</h1>
          <p className="mt-2 text-sm text-neutral-600">Paginated, server-filtered lead management.</p>
        </div>
      </div>

      <form className="premium-card mt-6 grid gap-3 rounded-xl p-4 md:grid-cols-[1fr_150px_110px_110px_140px_140px_auto]" action="/admin/leads">
        <input
          className="h-10 rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
          defaultValue={search ?? ""}
          name="q"
          placeholder="Search name, email, or phone"
        />
        <select className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={status ?? ""} name="status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((leadStatus) => (
            <option key={leadStatus} value={leadStatus}>
              {STATUS_LABELS[leadStatus]}
            </option>
          ))}
        </select>
        <input className="h-10 rounded-xl border border-neutral-300 px-3 text-sm uppercase outline-none focus:border-[#C9A227]" defaultValue={state ?? ""} maxLength={2} name="state" placeholder="State" />
        <select className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={grade ?? ""} name="grade">
          <option value="">Grade</option>
          {["A+", "A", "B", "C", "D", "F"].map((leadGrade) => (
            <option key={leadGrade} value={leadGrade}>{leadGrade}</option>
          ))}
        </select>
        <select className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={priority ?? ""} name="priority">
          <option value="">Priority</option>
          <option value="hot_only">Hot only</option>
          <option value="a_leads">A/A+ leads</option>
          <option value="unassigned_hot">Unassigned hot</option>
          <option value="low_quality">Low quality</option>
        </select>
        <select className="h-10 rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={sort} name="sort">
          <option value="highest_score">Highest score</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="last_activity">Last activity</option>
          <option value="next_follow_up">Next follow-up</option>
        </select>
        <button className="gold-gradient-button h-10 rounded-full px-4 text-sm font-semibold" type="submit">
          Filter
        </button>
      </form>
      <form className="mt-3 flex flex-wrap gap-3 text-sm" action="/admin/leads">
        <input type="hidden" name="q" value={search ?? ""} />
        <input type="hidden" name="status" value={status ?? ""} />
        <input type="hidden" name="state" value={state ?? ""} />
        <input type="hidden" name="grade" value={grade ?? ""} />
        <input type="hidden" name="priority" value={priority ?? ""} />
        <input type="hidden" name="sort" value={sort} />
        <input className="h-10 w-28 rounded-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={minScore ?? ""} name="min_score" placeholder="Min score" />
        <input className="h-10 w-28 rounded-full border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]" defaultValue={maxScore ?? ""} name="max_score" placeholder="Max score" />
        <button className="rounded-full border border-neutral-300 bg-white px-4 font-semibold text-[#050505] transition hover:border-[#C9A227]" type="submit">
          Apply score range
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3">Next</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {(leads ?? []).map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link className="font-semibold text-[#050505] hover:underline" href={`/admin/leads/${lead.id}`}>
                      {lead.first_name} {lead.last_name}
                    </Link>
                    <p className="mt-1 text-xs text-neutral-500">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3">{lead.state}</td>
                  <td className="px-4 py-3 text-neutral-600">{COVERAGE_LABELS[lead.coverage_purpose as Lead["coverage_purpose"]]}</td>
                  <td className="px-4 py-3">{STATUS_LABELS[lead.status as Lead["status"]]}</td>
                  <td className="px-4 py-3">
                    <LeadGradeBadge grade={lead.lead_grade as LeadGrade} score={lead.lead_score} temperature={lead.lead_temperature} />
                  </td>
                  <td className="px-4 py-3">{lead.assigned_agent_id ? agentMap.get(lead.assigned_agent_id) ?? "Assigned" : "Unassigned"}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleDateString() : "No follow-up"}</td>
                  <td className="px-4 py-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!leads?.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-neutral-500" colSpan={8}>
                    No leads found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-neutral-600">{count ?? 0} total</span>
        <div className="flex gap-2">
          {page > 1 ? <PageLink label="Previous" page={page - 1} params={params} /> : null}
          {hasNext ? <PageLink label="Next" page={page + 1} params={params} /> : null}
        </div>
      </div>
    </div>
  );
}

function PageLink({
  label,
  page,
  params,
}: {
  label: string;
  page: number;
  params: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const param = getParam(value);
    if (param && key !== "page") {
      query.set(key, param);
    }
  }
  query.set("page", String(page));

  return (
    <Link className="rounded-full border border-neutral-300 bg-white px-3 py-2 font-medium text-[#050505] transition hover:border-[#C9A227]" href={`/admin/leads?${query.toString()}`}>
      {label}
    </Link>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function sanitizeSearch(value?: string) {
  return value?.trim().replace(/[^\w@.+\-\s]/g, "").slice(0, 80) || undefined;
}

function isLeadGrade(value?: string): value is LeadGrade {
  return value === "A+" || value === "A" || value === "B" || value === "C" || value === "D" || value === "F";
}

function parseScore(value?: string) {
  if (!value) {
    return undefined;
  }

  const score = Number(value);
  return Number.isFinite(score) ? score : undefined;
}

function applySort<T extends { order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => T }>(
  query: T,
  sort: string,
) {
  if (sort === "newest") {
    return query.order("created_at", { ascending: false });
  }

  if (sort === "oldest") {
    return query.order("created_at", { ascending: true });
  }

  if (sort === "last_activity") {
    return query.order("last_activity_at", { ascending: false, nullsFirst: false });
  }

  if (sort === "next_follow_up") {
    return query.order("next_follow_up_at", { ascending: true, nullsFirst: false });
  }

  return query.order("lead_score", { ascending: false }).order("created_at", { ascending: false });
}
