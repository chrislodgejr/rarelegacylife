import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { EntrySplash } from "@/components/ui/entry-splash";
import { PUBLIC_NAV } from "@/lib/constants/options";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/92 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          aria-label="Rare Legacy Life home"
          className="inline-flex shrink-0 items-center rounded-full transition duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
          href="/"
        >
          <BrandLogo className="h-10 w-auto sm:h-12" lockup="horizontal" priority variant="dark" />
        </Link>
        <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm text-white/72 shadow-2xl shadow-black/20 backdrop-blur lg:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              className="group relative overflow-hidden rounded-full px-4 py-2 font-medium transition hover:bg-white/[0.075] hover:text-white"
              href={item.href}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="gold-gradient-subtle absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 rounded-full transition duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="hidden h-10 items-center rounded-full border border-white/12 bg-white/[0.035] px-4 text-sm font-semibold text-white/72 transition hover:border-[#C9A227]/70 hover:bg-white/[0.075] hover:text-[#F5E7A3] lg:inline-flex"
            href="/login"
          >
            Login
          </Link>
          <Link
            className="gold-gradient-button hidden h-10 items-center rounded-full px-5 text-sm font-bold md:inline-flex"
            href="/quote"
          >
            Get My Free Quote
          </Link>
          <details className="group relative lg:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/[0.055] text-white transition hover:border-[#C9A227]/70 hover:text-[#F5E7A3] [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/12 bg-black/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
              <nav className="grid gap-1 text-sm">
                {PUBLIC_NAV.map((item) => (
                  <Link
                    key={item.href}
                    className="rounded-xl px-4 py-3 font-semibold text-white/76 transition hover:bg-white/[0.08] hover:text-[#F5E7A3]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
                <Link
                  className="rounded-xl border border-white/12 px-4 py-3 text-center text-sm font-semibold text-white/76 transition hover:border-[#C9A227]/70 hover:text-[#F5E7A3]"
                  href="/login"
                >
                  Agent Login
                </Link>
                <Link
                  className="gold-gradient-button rounded-xl px-4 py-3 text-center text-sm font-bold"
                  href="/quote"
                >
                  Get My Free Quote
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="gold-divider" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-white/62 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <BrandLogo className="h-24 w-auto" lockup="stacked" variant="dark" />
          <p className="mt-3 max-w-md leading-6">
            Personal life insurance guidance, retirement income reviews, and annuity education for
            people protecting today while planning what comes next.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <div className="mt-3 grid gap-2">
            {PUBLIC_NAV.map((item) => (
              <Link key={item.href} className="hover:text-[#F5E7A3]" href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Secure portal</p>
          <div className="mt-3 grid gap-2">
            <Link className="hover:text-[#F5E7A3]" href="/login">
              Agent and admin login
            </Link>
            <Link className="hover:text-[#F5E7A3]" href="/quote">
              Start a quote
            </Link>
            <Link className="hover:text-[#F5E7A3]" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-[#F5E7A3]" href="/terms">
              Terms and Conditions
            </Link>
            <Link className="hover:text-[#F5E7A3]" href="/disclosures">
              Disclosures
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-7 text-xs leading-5 text-white/45 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="max-w-6xl">
            Insurance products are offered through properly licensed insurance producers. Insurance
            services are available in 49 states, excluding California, subject to individual producer
            licensing, carrier appointments, product approval, availability, and applicable law.
            Annuities are long-term insurance contracts and may involve surrender charges, withdrawal
            limitations, fees, market value adjustments, and tax consequences. Guarantees depend on
            the issuing insurer&apos;s claims-paying ability. Securities-related services, if offered,
            are offered only through appropriately registered representatives and their affiliated
            broker-dealer. Website content and complimentary reviews are educational and do not
            provide investment, tax, or legal advice. See the full disclosures for important
            limitations.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} Rare Legacy Life Group · 59 W. Germantown Pike, East Norriton, PA 19403</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EntrySplash storageKey="rare-legacy-consumer-splash-v1" variant="consumer" />
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}
