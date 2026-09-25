import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type CrmItem = {
  id: string;
  kind: "quote" | "retirement" | "inquiry";
  name: string;
  email: string;
  phone: string | null;
  status: string;
  source: string;
  createdAt: string;
  followUpAt: string | null;
  href: string;
  detail: string;
  message?: string;
};

export async function getCrmItems(): Promise<{ items: CrmItem[]; errors: string[] }> {
  const admin = createAdminClient();
  // Keep the shared inbox usable against the existing production schema.
  const [quotes, retirement, inquiries] = await Promise.all([
    admin.from("leads").select("id,first_name,last_name,email,phone,status,source,created_at,next_follow_up_at,coverage_purpose").order("created_at", { ascending: false }).limit(1000),
    admin.from("retirement_blueprint_requests").select("id,first_name,last_name,email,phone,status,source,created_at,meeting_style").order("created_at", { ascending: false }).limit(1000),
    admin.from("contact_messages").select("id,name,email,phone,status,inquiry_type,message,created_at").order("created_at", { ascending: false }).limit(1000),
  ]);
  const errors = [quotes.error && "quotes", retirement.error && "retirement", inquiries.error && "inquiries"].filter(Boolean) as string[];
  const items: CrmItem[] = [
    ...(quotes.data ?? []).map(row => ({
      id: row.id, kind: "quote" as const, name: `${row.first_name} ${row.last_name}`,
      email: row.email, phone: row.phone, status: row.status, source: row.source,
      createdAt: row.created_at, followUpAt: row.next_follow_up_at,
      href: `/admin/leads/${row.id}`, detail: String(row.coverage_purpose ?? "Life insurance"),
    })),
    ...(retirement.data ?? []).map(row => ({
      id: row.id, kind: "retirement" as const, name: `${row.first_name} ${row.last_name}`,
      email: row.email, phone: row.phone, status: row.status, source: row.source,
      createdAt: row.created_at, followUpAt: null,
      href: `/admin/retirement/${row.id}`, detail: String(row.meeting_style ?? "Retirement review"),
    })),
    ...(inquiries.data ?? []).map(row => ({
      id: row.id, kind: "inquiry" as const, name: row.name,
      email: row.email, phone: row.phone, status: row.status, source: "website_contact_form",
      createdAt: row.created_at, followUpAt: null,
      href: `/admin/inquiries/${row.id}`, detail: String(row.inquiry_type ?? "General inquiry"), message: row.message,
    })),
  ];
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { items, errors };
}

export function contactKey(item: Pick<CrmItem, "email" | "phone" | "id">) {
  return item.email.trim().toLowerCase() || item.phone?.replace(/\D/g, "") || item.id;
}

export function groupContacts(items: CrmItem[]) {
  const groups = new Map<string, { key: string; name: string; email: string; phone: string | null; items: CrmItem[]; lastSeen: string }>();
  for (const item of items) {
    const key = contactKey(item);
    const group = groups.get(key);
    if (group) {
      group.items.push(item);
      if (!group.phone && item.phone) group.phone = item.phone;
      if (group.name === group.email && item.name !== item.email) group.name = item.name;
    } else groups.set(key, { key, name: item.name, email: item.email, phone: item.phone, items: [item], lastSeen: item.createdAt });
  }
  return [...groups.values()];
}
