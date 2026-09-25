import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { NotificationBar } from "@/components/dashboard/notification-bar";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/server/actions/auth";
import type { AppRole, CrmNotification, Profile } from "@/types/domain";

const adminNav = [
  { href: "/admin/dashboard", label: "Home" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/pipeline", label: "Pipeline" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/leads", label: "Quotes" },
  { href: "/admin/retirement", label: "Retirement" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export async function DashboardShell({
  role,
  profile,
  children,
}: {
  role: Extract<AppRole, "admin" | "manager">;
  profile: Profile;
  children: React.ReactNode;
}) {
  const nav = adminNav;
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("crm_notifications")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-[#F7F5EF] lg:flex">
      <aside className="border-b border-white/10 bg-black text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <Link aria-label="Rare Legacy Life dashboard" href="/admin/dashboard">
            <BrandLogo className="h-16 w-auto lg:h-20" lockup="stacked" variant="dark" />
          </Link>
          <div>
            <p className="mt-1 hidden text-xs uppercase tracking-[0.18em] text-white/45 lg:block">
              {role} portal
            </p>
          </div>
        </div>
        <nav className="hidden gap-2 overflow-x-auto px-4 pb-5 text-sm lg:grid lg:gap-1 lg:overflow-visible lg:px-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              className="shrink-0 rounded-md border-l-2 border-transparent px-3 py-2.5 font-medium text-white/68 transition hover:border-[#C9A227] hover:bg-white/[0.08] hover:text-[#F5E7A3]"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/92 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A16]">
                Rare Legacy CRM
              </p>
              <p className="mt-1 truncate text-sm text-neutral-600">Signed in as {profile.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBar
                initialNotifications={(notifications ?? []) as CrmNotification[]}
                portal="admin"
                profileId={profile.id}
              />
              <form action={signOut}>
                <button
                  className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-semibold text-[#050505] transition hover:border-[#C9A227]"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <nav aria-label="CRM mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur lg:hidden">
        {adminNav.slice(0, 4).map(item => (
          <Link key={item.href} href={item.href} className="flex min-h-14 items-center justify-center px-1 text-center text-xs font-semibold text-[#050505] active:bg-[#F5E7A3]">{item.label}</Link>
        ))}
      </nav>
    </div>
  );
}
