import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCrmItems, type CrmItem } from "@/lib/crm/data";
import { movePipelineItem } from "@/server/actions/pipeline";
import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/constants/options";

const lanes = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "scheduled", label: "Scheduled" },
  { status: "quoted", label: "Quoted" },
  { status: "application_started", label: "Application started" },
  { status: "application_submitted", label: "Application submitted" },
  { status: "underwriting", label: "Underwriting" },
  { status: "approved", label: "Approved" },
  { status: "placed", label: "Placed" },
  { status: "completed", label: "Review completed" },
  { status: "closed", label: "Closed" },
];
const closed = new Set(["lost", "not_qualified", "do_not_contact", "spam"]);
const stagesByKind = {
  quote: LEAD_STATUSES.map(value => ({ value, label: STATUS_LABELS[value] })).filter(({ value }) => value !== "assigned"),
  retirement: ["new", "contacted", "scheduled", "completed", "closed", "spam"].map(value => ({ value, label: value.replaceAll("_", " ") })),
  inquiry: ["new", "contacted", "scheduled", "closed", "spam"].map(value => ({ value, label: value.replaceAll("_", " ") })),
};

function PipelineCard({ item }: { item: CrmItem }) {
  return <article className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2"><Link href={item.href} className="font-semibold hover:underline">{item.name}</Link><span className="rounded-full bg-[#F7F5EF] px-2 py-1 text-[11px] capitalize">{item.kind}</span></div>
    <p className="mt-2 truncate text-xs text-neutral-500">{item.email}</p>
    <p className="mt-1 text-xs text-neutral-500">{item.detail.replaceAll("_", " ")} · {new Date(item.createdAt).toLocaleDateString()}</p>
    <form action={movePipelineItem} className="mt-3"><input type="hidden" name="id" value={item.id} /><input type="hidden" name="kind" value={item.kind} />
      <select name="status" defaultValue={item.status} aria-label={`Move ${item.name} to stage`} className="h-10 w-full rounded-xl border border-neutral-300 bg-white px-2 text-xs capitalize">
        {stagesByKind[item.kind].map(stage => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
      </select><button type="submit" className="mt-2 w-full rounded-xl border border-[#C9A227] px-3 py-2 text-xs font-semibold">Save stage</button>
    </form>
  </article>;
}

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ kind?: string; view?: string }> }) {
  await requireRole(["admin", "manager"]);
  const { kind, view } = await searchParams;
  const { items, errors } = await getCrmItems();
  const scope = ["quote", "retirement"].includes(kind ?? "") ? kind : "all";
  const filtered = items.filter(i => (scope === "all" ? i.kind !== "inquiry" : i.kind === scope) && (view === "closed" ? closed.has(i.status) : !closed.has(i.status)));
  return <div className="space-y-5">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16]">Work in progress</p><h1 className="font-premium mt-1 text-3xl font-semibold">Pipeline</h1><p className="mt-2 text-sm text-neutral-600">Move each inquiry through its own sales or review stages. Chris and Dan share the same pipeline.</p></div>
    <div className="flex flex-wrap gap-2 text-sm">{["all", "quote", "retirement"].map(value => <Link key={value} href={`/admin/pipeline?kind=${value}&view=${view ?? "open"}`} className={`rounded-full px-4 py-2 capitalize ${scope === value ? "bg-black text-white" : "border border-neutral-300 bg-white"}`}>{value === "all" ? "All verified" : value}</Link>)}<Link href={`/admin/pipeline?kind=${scope}&view=${view === "closed" ? "open" : "closed"}`} className="rounded-full border border-neutral-300 bg-white px-4 py-2">{view === "closed" ? "Open pipeline" : "Closed / lost"}</Link></div>
    {errors.length > 0 && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm">Some records could not be loaded: {errors.join(", ")}.</p>}
    <p className="text-sm text-neutral-500">{filtered.length} records</p>
    <div className="flex snap-x gap-4 overflow-x-auto pb-5" aria-label="Pipeline stages">
      {(view === "closed" ? [{ status: "closed", label: "Closed, lost or disqualified" }] : lanes).map(lane => {
        const matches = filtered.filter(i => view === "closed" || i.status === lane.status || (lane.status === "new" && i.status === "assigned"));
        if (!matches.length && view === "closed") return null;
        return <section key={lane.status} className="w-[min(82vw,320px)] shrink-0 snap-start rounded-2xl bg-[#EEEAE0] p-3 sm:w-72">
          <div className="flex items-center justify-between px-2 py-2"><h2 className="text-sm font-bold">{lane.label}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs">{matches.length}</span></div>
          <div className="mt-2 grid max-h-[65vh] gap-3 overflow-y-auto">{matches.map(item => <PipelineCard key={`${item.kind}:${item.id}`} item={item} />)}{!matches.length && <p className="px-2 py-5 text-xs text-neutral-500">No records</p>}</div>
        </section>;
      })}
    </div>
  </div>;
}
