import { Phone, ShieldCheck, Landmark, Handshake } from "lucide-react";
import { ProtectForm, type ProtectTracking } from "@/components/forms/protect-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

// The Google Ads landing page (Chris, 2026-11-07). Not indexed and not in the sitemap: it exists for paid traffic. No rates are
// shown ("there's dozens of different products and they all have different rates"). /retirement, printed on a QR code, is
// separate and unchanged.
export const metadata = pageMetadata({
  title: "Free Retirement Savings Review | Rare Legacy Life Group",
  description:
    "Compare guaranteed options from dozens of top-rated carriers. A free, no-obligation review with a licensed Pennsylvania advisor.",
  path: "/protect",
  noIndex: true,
});

type ProtectPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const points = [
  { icon: ShieldCheck, title: "Protection from market losses", copy: "Explore options designed to keep your principal safe while it grows." },
  { icon: Landmark, title: "Dozens of carriers compared", copy: "We're independent, so we compare many highly rated insurers, not just one." },
  { icon: Handshake, title: "A licensed advisor, not a call center", copy: "One local advisor walks you through every option. No pressure, no obligation." },
] as const;

export default async function ProtectPage({ searchParams }: ProtectPageProps) {
  const params = await searchParams;
  const tracking: ProtectTracking = {
    utm_source: getParam(params.utm_source),
    utm_medium: getParam(params.utm_medium),
    utm_campaign: getParam(params.utm_campaign),
    utm_content: getParam(params.utm_content),
    utm_term: getParam(params.utm_term),
    gclid: getParam(params.gclid),
    gbraid: getParam(params.gbraid),
    wbraid: getParam(params.wbraid),
  };

  return (
    <PublicShell showMobileBar={false}>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 pb-14 pt-8 text-white sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="flex flex-col justify-center">
              <Eyebrow>Free retirement savings review</Eyebrow>
              <h1 className="font-premium mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Protect what you&apos;ve built.
              </h1>
              <p className="mt-4 text-base leading-7 text-white/75">
                CD maturing, 401(k) to roll over, or savings sitting in the market? Compare guaranteed options from dozens of
                top-rated carriers with a licensed advisor. Free, and no obligation.
              </p>
              <ul className="mt-6 space-y-4">
                {points.map(({ icon: Icon, title, copy }) => (
                  <li key={title} className="flex gap-3">
                    <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-cream-500" />
                    <span>
                      <span className="block text-sm font-semibold text-white">{title}</span>
                      <span className="block text-sm leading-6 text-white/70">{copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <a
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-brand-cream-300"
                href={SITE.phone.href}
                data-track="phone_click"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
                Rather talk it through? Call {SITE.phone.display}
              </a>
            </div>
            <ProtectForm tracking={tracking} />
          </div>
        </section>
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-4xl text-xs leading-5 text-neutral-500">
            Rare Legacy Life Group is an independent insurance agency. Guarantees are based on the claims-paying ability of the
            issuing insurance company. Annuities are long-term products; surrender charges may apply for early withdrawals. Not
            all products are available in all states. This is not investment, tax, or legal advice.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
