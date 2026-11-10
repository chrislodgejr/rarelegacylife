import Link from "next/link";
import { Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema } from "@/lib/seo/schema";
import { SITE } from "@/lib/site";

/**
 * Stripped-down shell for paid-traffic landing pages (/protect). No site navigation, no quote CTA, no careers or login
 * links: the only ways off the page are the form, the phone number, and the legal pages Google Ads requires.
 */
export function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <JsonLd data={organizationSchema()} />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-black-950/92 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <BrandLogo className="h-12 w-auto sm:h-14" lockup="horizontal" priority variant="dark" />
          <a
            aria-label={`Call ${SITE.phone.display}`}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.055] px-4 text-sm font-semibold text-white/90 transition hover:border-brand-cream-500/70 hover:text-brand-cream-300"
            href={SITE.phone.href}
            data-track="phone_click"
          >
            <Phone aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
            <span>{SITE.phone.display}</span>
          </a>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/10 bg-brand-black-950 text-white">
        <div className="gold-divider" />
        <div className="mx-auto max-w-7xl px-4 py-8 text-xs leading-5 text-white/50 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between">
            <address className="not-italic">
              <span className="font-semibold text-white">{SITE.name}</span> · {SITE.address.street}, {SITE.address.city},{" "}
              {SITE.address.region} {SITE.address.postalCode} ·{" "}
              <a className="font-semibold text-brand-cream-300 hover:underline" href={SITE.phone.href} data-track="phone_click">
                {SITE.phone.display}
              </a>
            </address>
            <nav aria-label="Legal" className="flex gap-4">
              <Link className="hover:text-brand-cream-300" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-brand-cream-300" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-brand-cream-300" href="/disclosures">
                Disclosures
              </Link>
            </nav>
          </div>
          <p className="mt-5 max-w-6xl">
            Insurance products are offered through properly licensed insurance producers. Insurance services are available in 49
            states, excluding California, subject to individual producer licensing, carrier appointments, product approval,
            availability, and applicable law. Annuities are long-term insurance contracts and may involve surrender charges,
            withdrawal limitations, fees, market value adjustments, and tax consequences. Guarantees depend on the issuing
            insurer&apos;s claims-paying ability. Securities-related services, if offered, are offered only through appropriately
            registered representatives and their affiliated broker-dealer. Website content and complimentary reviews are
            educational and do not provide investment, tax, or legal advice.
          </p>
          <p className="mt-3">
            © {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
