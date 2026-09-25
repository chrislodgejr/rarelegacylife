import { crmClock } from "@/lib/crm/time";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCrmItems } from "@/lib/crm/data";

export default async function ReportsPage() {
  await requireRole(["admin", "manager"]);
  const { items } = await getCrmItems();
  const count = (kind: string) => items.filter(item => item.kind === kind).length;
  const verified = items.filter(item => item.kind !== "inquiry");
  const open = verified.filter(item => !["closed", "lost", "not_qualified", "do_not_contact", "spam", "placed", "completed"].includes(item.status)).length;
  const clock = crmClock();
  const week = verified.filter(item => new Date(item.createdAt).getTime() >= clock.weekStart).length;
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16]">Performance</p><h1 className="font-premium mt-1 text-3xl font-semibold">Reports</h1><p className="mt-2 text-sm text-neutral-600">Current CRM activity, sourced from the saved intake records.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{[["Quote and retirement records",verified.length],["Open pipeline",open],["New this week",week],["Quote requests",count("quote")],["Retirement requests",count("retirement")],["Contact form archive (unreviewed)",count("inquiry")]].map(([label,value]) => <div key={label} className="premium-card rounded-2xl p-5"><p className="text-sm text-neutral-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div><Link href="/admin/pipeline" className="inline-flex rounded-full border border-[#C9A227] px-5 py-3 text-sm font-semibold">View pipeline →</Link>
  </div>;
}
