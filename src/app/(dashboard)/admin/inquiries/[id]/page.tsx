import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { movePipelineItem } from "@/server/actions/pipeline";

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(["admin", "manager"]);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await createAdminClient().from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <div className="mx-auto max-w-3xl space-y-5"><Link href="/admin/contacts?type=inquiry" className="text-sm underline">← Contact form archive</Link>
    <section className="premium-card rounded-2xl p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-wider text-[#8A6A16]">Contact form · {data.inquiry_type.replaceAll("_", " ")}</p><h1 className="font-premium mt-2 text-3xl font-semibold">{data.name}</h1>
      <div className="mt-4 flex flex-wrap gap-4 text-sm"><a className="underline" href={`mailto:${data.email}`}>{data.email}</a>{data.phone && <a className="underline" href={`tel:${data.phone}`}>{data.phone}</a>}</div>
      <p className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-[#F7F5EF] p-4 text-sm">{data.message}</p><p className="mt-3 text-xs text-neutral-500">Received {new Date(data.created_at).toLocaleString()} · Status: {data.status.replaceAll("_", " ")}</p>
    </section>
    <form action={movePipelineItem} className="premium-card flex flex-wrap items-end gap-3 rounded-2xl p-5"><input type="hidden" name="kind" value="inquiry" /><input type="hidden" name="id" value={id} />
      <label className="grid flex-1 gap-1 text-sm font-medium">Pipeline stage<select name="status" defaultValue={data.status} className="h-11 rounded-xl border border-neutral-300 bg-white px-3">{["new", "contacted", "scheduled", "closed", "spam"].map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></label>
      <button className="gold-gradient-button h-11 rounded-xl px-5 font-semibold">Save stage</button>
    </form>
  </div>;
}
