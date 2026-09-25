import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/session";

export default async function RetirementInbox({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireRole(["admin", "manager"]);
  const { q } = await searchParams;
  const search = q?.trim().replace(/[^\w@.+\-\s]/g, "").slice(0, 80);
  let query = createAdminClient().from("retirement_blueprint_requests")
    .select("id,first_name,last_name,email,phone,meeting_style,status,created_at,next_follow_up_at", { count: "exact" })
    .order("created_at", { ascending: false }).limit(100);
  if (search) query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  const { data, count, error } = await query;
  return <div className="space-y-5">
    <div><h1 className="font-premium text-3xl font-semibold">Retirement requests</h1><p className="mt-2 text-sm text-neutral-600">Mailer and website inquiries in your shared CRM inbox.</p></div>
    <form action="/admin/retirement"><input name="q" defaultValue={search ?? ""} placeholder="Search name, email or phone" aria-label="Search retirement requests" className="h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 sm:max-w-lg" /></form>
    {error ? <p role="alert">Could not load retirement requests.</p> : <p className="text-sm text-neutral-500">{count ?? 0} requests · showing the newest 100</p>}
    <div className="grid gap-3">{data?.map(row => <Link href={`/admin/retirement/${row.id}`} key={row.id} className="premium-card rounded-2xl p-4 transition hover:border-[#C9A227]">
      <div className="flex items-start justify-between gap-3"><strong>{row.first_name} {row.last_name}</strong><span className="rounded-full bg-[#F7F5EF] px-3 py-1 text-xs capitalize">{row.status}</span></div>
      <p className="mt-2 text-sm text-neutral-600">{row.email} · {row.phone}</p><p className="mt-2 text-xs text-neutral-500">{row.meeting_style} · Received {new Date(row.created_at).toLocaleDateString()} {row.next_follow_up_at ? `· Follow up ${new Date(row.next_follow_up_at).toLocaleDateString()}` : ""}</p>
    </Link>)}{!data?.length && !error ? <p className="rounded-xl bg-white p-5 text-sm text-neutral-600">No retirement requests found.</p> : null}</div>
  </div>;
}
