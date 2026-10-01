import Link from "next/link";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, personSchema } from "@/lib/seo/schema";
import { ADVISORS, SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Rare Legacy Life Group | Licensed Advisors in East Norriton, PA",
  description:
    "Meet the licensed life insurance and annuity advisors at Rare Legacy Life Group in East Norriton, PA — plain-language guidance with no pressure to buy.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PublicShell>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          ...ADVISORS.map((advisor) => ({ "@context": "https://schema.org", ...personSchema(advisor) })),
        ]}
      />
      <main>
        <Section className="black-hero-bg text-white">
          <div className="max-w-3xl">
            <Eyebrow>About Rare Legacy Life</Eyebrow>
            <h1 className="font-premium mt-4 text-4xl font-semibold sm:text-5xl">
              Life insurance without confusion or pressure.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/78">
              Rare Legacy Life Group is a licensed life insurance and annuity agency in East Norriton,
              Pennsylvania. We help families, business owners, and pre-retirees protect the people
              who depend on them and make confident decisions about coverage and retirement income.
            </p>
          </div>
        </Section>

        <Section>
          <Eyebrow>Your advisors</Eyebrow>
          <h2 className="font-premium mt-3 text-3xl font-semibold text-[#050505] sm:text-4xl">
            Licensed, local, and accountable to you.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {ADVISORS.map((advisor) => (
              <article key={advisor.slug} id={advisor.slug} className="premium-card scroll-mt-28 rounded-2xl p-7">
                <span className="gold-gradient-subtle flex h-12 w-12 items-center justify-center rounded-full text-black">
                  <BadgeCheck aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="font-premium mt-5 text-2xl font-semibold text-[#050505]">{advisor.name}</h3>
                <p className="text-sm font-medium text-[#8A6A16]">{advisor.title}</p>
                <p className="mt-1 text-xs text-neutral-500">{advisor.license}</p>
                <p className="mt-4 text-sm leading-6 text-neutral-700">{advisor.bio}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            You can verify an insurance producer&apos;s license using their NPN through the{" "}
            <a className="underline" href="https://nipr.com/" rel="noopener" target="_blank">
              National Insurance Producer Registry
            </a>
            .
          </p>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["Mission", "Make life insurance and retirement income decisions clear, personal, and easier to act on."],
              ["Who we serve", "Families, entrepreneurs, hospitality professionals, working-class earners, and pre-retirees."],
              ["Why it matters", "Protection gives loved ones time, options, and financial stability."],
              ["Our process", "We listen, review your goals, explain trade-offs in plain language, and let you decide."],
            ].map(([title, copy]) => (
              <div key={title} className="premium-card rounded-xl p-6">
                <h2 className="font-premium text-xl font-semibold text-[#050505]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <div className="black-section grid gap-6 rounded-2xl p-7 text-white md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <div>
              <h2 className="font-premium text-3xl font-semibold">Visit, call, or meet virtually.</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
                <MapPin aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/75">
                <Phone aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                <a className="font-semibold text-white hover:text-[#F5E7A3]" href={SITE.phone.href} data-track="phone_click">
                  {SITE.phone.display}
                </a>
              </p>
            </div>
            <Link
              className="gold-gradient-button inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold"
              href="/quote"
            >
              Get my free quote
            </Link>
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}
