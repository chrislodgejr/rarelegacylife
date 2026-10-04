import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { JsonLd } from "@/components/seo/json-ld";
import { PUBLIC_NAV } from "@/lib/constants/options";
import { organizationSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/site";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black-950/92 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          aria-label="Rare Legacy Life home"
          className="inline-flex shrink-0 items-center rounded-full transition duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
          href="/"
        >
          <BrandLogo className="h-14 w-auto sm:h-16" lockup="horizontal" priority variant="dark" />
        </Link>
        <nav
          aria-label="Main"
          className="hidden items-center rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm text-white/72 shadow-2xl shadow-black/20 backdrop-blur lg:flex"
        >
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              className="group relative overflow-hidden whitespace-nowrap rounded-full px-4 py-2 font-medium transition hover:bg-white/[0.075] hover:text-white"
              href={item.href}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="gold-gradient-subtle absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 rounded-full transition duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            aria-label={`Call ${SITE.phone.display}`}
            className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-white/85 transition hover:text-brand-cream-300 md:inline-flex"
            href={SITE.phone.href}
            data-track="phone_click"
          >
            <Phone aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
            <span className="lg:hidden xl:inline">{SITE.phone.display}</span>
          </a>
          <Link
            className="gold-gradient-button hidden h-10 items-center whitespace-nowrap rounded-full px-5 text-sm font-bold md:inline-flex"
            href="/quote"
          >
            Get My Free Quote
          </Link>
          <a
            aria-label={`Call ${SITE.phone.display}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.055] text-brand-cream-300 md:hidden"
            href={SITE.phone.href}
            data-track="phone_click"
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
          </a>
          <details className="group relative lg:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/[0.055] text-white transition hover:border-brand-cream-500/70 hover:text-brand-cream-300 [&::-webkit-details-marker]:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/12 bg-brand-black-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
              <nav aria-label="Mobile" className="grid gap-1 text-sm">
                <Link className="rounded-xl px-4 py-3 font-semibold text-white/76 transition hover:bg-white/[0.08] hover:text-brand-cream-300" href="/">
                  Home
                </Link>
                {PUBLIC_NAV.map((item) => (
                  <Link
                    key={item.href}
                    className="rounded-xl px-4 py-3 font-semibold text-white/76 transition hover:bg-white/[0.08] hover:text-brand-cream-300"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
                <a
                  className="rounded-xl border border-white/12 px-4 py-3 text-center text-sm font-semibold text-white/85 transition hover:border-brand-cream-500/70 hover:text-brand-cream-300"
                  href={SITE.phone.href}
                  data-track="phone_click"
                >
                  Call {SITE.phone.display}
                </a>
                <Link className="gold-gradient-button rounded-xl px-4 py-3 text-center text-sm font-bold" href="/quote">
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
    <footer className="border-t border-white/10 bg-brand-black-950 text-white">
      <div className="gold-divider" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-white/62 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <BrandLogo className="h-24 w-auto" lockup="stacked" variant="dark" />
          <p className="mt-3 max-w-md leading-6">
            Life insurance guidance, retirement income reviews, and annuity education for people
            protecting today while planning what comes next.
          </p>
          <address className="mt-4 not-italic leading-6">
            <span className="block font-semibold text-white">{SITE.name}</span>
            {SITE.address.street}
            <br />
            {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
            <br />
            <a className="font-semibold text-brand-cream-300 hover:underline" href={SITE.phone.href} data-track="phone_click">
              {SITE.phone.display}
            </a>
          </address>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <div className="mt-3 grid gap-2">
            <Link className="hover:text-brand-cream-300" href="/quote">
              Get a free quote
            </Link>
            {PUBLIC_NAV.map((item) => (
              <Link key={item.href} className="hover:text-brand-cream-300" href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Company</p>
          <div className="mt-3 grid gap-2">
            <Link className="hover:text-brand-cream-300" href="/apply-as-agent">
              Careers: apply as an agent
            </Link>
            <Link className="hover:text-brand-cream-300" href="/login">
              Advisor login
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Legal</p>
          <div className="mt-3 grid gap-2">
            <Link className="hover:text-brand-cream-300" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:text-brand-cream-300" href="/terms">
              Terms and Conditions
            </Link>
            <Link className="hover:text-brand-cream-300" href="/disclosures">
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
          <p className="mt-3">
            © {new Date().getFullYear()} {SITE.name} · {SITE.address.street}, {SITE.address.city},{" "}
            {SITE.address.region} {SITE.address.postalCode} · {SITE.phone.display}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Thumb-reach call + quote bar on phones. */
function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-black-950/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <a
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 text-sm font-semibold text-white"
          href={SITE.phone.href}
          data-track="phone_click"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
          Call now
        </a>
        <Link className="gold-gradient-button flex h-12 items-center justify-center rounded-full text-sm font-bold" href="/quote">
          Free quote
        </Link>
      </div>
    </div>
  );
}

export function PublicShell({
  children,
  showMobileBar = true,
}: {
  children: React.ReactNode;
  showMobileBar?: boolean;
}) {
  return (
    <div className={showMobileBar ? "pb-[76px] md:pb-0" : undefined}>
      <JsonLd data={organizationSchema()} />
      <PublicHeader />
      {children}
      <PublicFooter />
      {showMobileBar ? <MobileActionBar /> : null}
    </div>
  );
}
