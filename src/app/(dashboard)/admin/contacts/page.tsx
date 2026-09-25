import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getCrmItems, groupContacts } from "@/lib/crm/data";

type Params = { q?: string; type?: string; page?: string };
export default async function ContactsPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireRole(["admin", "manager"]);
  const params = await searchParams;
  const { items, errors } = await getCrmItems();
  const contacts = groupContacts(items);
  const q = params.q?.trim().toLowerCase().slice(0, 80) ?? "";
  const type = ["quote", "retirement", "inquiry"].includes(params.type ?? "") ? params.type : "";
  const filtered = contacts.filter(c => (!q || [c.name, c.email, c.phone].some(v => v?.toLowerCase().includes(q))) && (!type ? c.items.some(i => i.kind !== "inquiry") : c.items.some(i => i.kind === type)));
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageItems = filtered.slice((page - 1) * 30, page * 30);
  const pageUrl = (next: number) => `/admin/contacts?${new URLSearchParams({ q, type: type ?? "", page: String(next) })}`;
  return <div className="space-y-5">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A6A16]">People</p><h1 className="font-premium mt-1 text-3xl font-semibold">Contacts</h1><p className="mt-2 text-sm text-neutral-600">Quote and retirement contacts. Review older contact-form submissions separately before treating them as leads.</p></div>
    <form action="/admin/contacts" className="premium-card grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_180px_auto]">
      <input name="q" defaultValue={params.q ?? ""} placeholder="Search name, email, or phone" aria-label="Search contacts" className="h-12 rounded-xl border border-neutral-300 px-4" />
      <select name="type" defaultValue={type} aria-label="Filter by source" className="h-12 rounded-xl border border-neutral-300 bg-white px-4"><option value="">Quote and retirement</option><option value="quote">Quotes</option><option value="retirement">Retirement</option><option value="inquiry">Contact form archive</option></select>
      <button className="gold-gradient-button rounded-xl px-5 font-semibold">Search</button>
    </form>
    {errors.length > 0 && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm">Some records could not be loaded: {errors.join(", ")}.</p>}
    <p className="text-sm text-neutral-500">{filtered.length} contacts · {items.filter(i => type === "inquiry" ? i.kind === "inquiry" : i.kind !== "inquiry").length} linked records</p>
    <div className="grid gap-3">{pageItems.map(contact => <article key={contact.key} className="premium-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2"><h2 className="font-semibold">{contact.name}</h2><span className="text-xs text-neutral-500">Last activity {new Date(contact.lastSeen).toLocaleDateString()}</span></div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm"><a className="break-all text-[#8A6A16] underline" href={`mailto:${contact.email}`}>{contact.email}</a>{contact.phone && <a className="underline" href={`tel:${contact.phone}`}>{contact.phone}</a>}</div>
      <div className="mt-4 flex flex-wrap gap-2">{contact.items.filter(item => type === "inquiry" ? item.kind === "inquiry" : item.kind !== "inquiry").map(item => <Link key={`${item.kind}:${item.id}`} href={item.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold capitalize hover:border-[#C9A227]">{item.kind === "inquiry" ? `Contact form · ${item.detail.replaceAll("_", " ")}` : item.kind} · {item.status.replaceAll("_", " ")}</Link>)}</div>
      {type === "inquiry" && contact.items.filter(item => item.kind === "inquiry").map(item => <div key={item.id} className="mt-3 rounded-xl bg-[#F7F5EF] p-3 text-sm"><p className="text-xs text-neutral-500">Submitted {new Date(item.createdAt).toLocaleString()} · {item.detail.replaceAll("_", " ")}</p><p className="mt-1 whitespace-pre-wrap break-words text-neutral-700">{item.message?.slice(0, 240)}{(item.message?.length ?? 0) > 240 ? "…" : ""}</p><Link href={item.href} className="mt-2 inline-block font-semibold text-[#8A6A16] underline">Full submission</Link></div>)}
    </article>)}{!pageItems.length && <p className="rounded-xl bg-white p-5 text-sm text-neutral-500">No contacts match this search.</p>}</div>
    <div className="flex justify-between text-sm">{page > 1 ? <Link href={pageUrl(page - 1)} className="underline">Previous</Link> : <span />}{page * 30 < filtered.length && <Link href={pageUrl(page + 1)} className="underline">Next</Link>}</div>
  </div>;
}
