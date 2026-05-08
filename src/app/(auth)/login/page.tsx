import Link from "next/link";
import { BrandLogo } from "@/components/brand/logo";
import { LoginForm } from "@/components/auth/login-form";
import { EntrySplash } from "@/components/ui/entry-splash";

export default function LoginPage() {
  return (
    <main className="black-hero-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-white">
      <EntrySplash storageKey="rare-legacy-crm-login-splash-v1" variant="agent" />
      <div className="signal-grid absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="absolute left-[-10rem] top-[-12rem] h-[26rem] w-[26rem] rounded-full border border-[#C9A227]/16" aria-hidden="true" />
      <div className="relative w-full max-w-5xl">
        <div className="flex justify-center">
          <Link aria-label="Rare Legacy Life home" href="/">
            <BrandLogo className="h-28 w-auto" lockup="stacked" variant="dark" />
          </Link>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
          <section className="hidden lg:block">
            <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.22em]">
              Agent and admin portal
            </p>
            <h2 className="font-premium mt-4 max-w-xl text-5xl font-semibold leading-tight text-white">
              Secure access for approved Rare Legacy Life team members.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
              Sign in to manage leads, team communication, follow-up tasks, agent activity, and CRM
              notifications. New account requests remain pending until an administrator approves
              portal access.
            </p>
          </section>
          <div className="mx-auto w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
