import Image from "next/image";
import {
  ArrowDown,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  ChevronDown,
  Handshake,
  Landmark,
  LineChart,
  PhoneCall,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { ProtectForm, type ProtectTracking } from "@/components/forms/protect-form";
import { LandingShell } from "@/components/layout/landing-shell";
import { Eyebrow } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
import { ADVISORS, SITE } from "@/lib/site";

// The Google Ads landing page (Chris, 2026-11-07). Not indexed and not in the sitemap: it exists for paid traffic. No rates are
// shown ("there's dozens of different products and they all have different rates"). /retirement, printed on a QR code, is
// separate and unchanged.
// v2 (2026-11-09): earns the form instead of opening on it — situations, what happens next, a plain-English explainer with
// honest tradeoffs, the advisors, an FAQ, and a stripped shell (no site nav) so paid clicks stay on the page. Copy is
// carrier-agnostic and makes no rate or return claims; have compliance review wording before changing it.
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

const FORM_ID = "review";

const situations = [
  {
    icon: CalendarClock,
    title: "My CD is maturing",
    copy: "Before it rolls over automatically, see how guaranteed options from many insurers compare for the next few years.",
  },
  {
    icon: Briefcase,
    title: "I have a 401(k) from an old job",
    copy: "Learn how a direct rollover works, what it can avoid, and whether protecting part of it makes sense for you.",
  },
  {
    icon: LineChart,
    title: "My savings ride the market",
    copy: "If a bad year close to retirement would hurt, look at ways to keep principal safe while it still has room to grow.",
  },
] as const;

const steps = [
  {
    icon: PhoneCall,
    title: "A short call with a licensed advisor",
    copy: "At the time you pick, we learn your goals, timeline, and what you need to keep liquid.",
  },
  {
    icon: Scale,
    title: "Your options, side by side",
    copy: "We compare guaranteed options across many highly rated carriers and lay out the terms, features, and tradeoffs of each.",
  },
  {
    icon: Handshake,
    title: "You decide, on your schedule",
    copy: "Take the comparison home, ask questions, or do nothing at all. There's no obligation and no pressure to move money.",
  },
] as const;

const faqs = [
  {
    q: "Is the review really free?",
    a: "Yes. The review and the comparison cost you nothing, and you're under no obligation to buy anything.",
  },
  {
    q: "Will I get pressured or called nonstop?",
    a: "No. One licensed advisor reaches out at the time you choose. If it isn't a fit, say so and we'll stop. Your information is never sold.",
  },
  {
    q: "Do I have to move my money?",
    a: "No. Many people keep everything where it is after a review. The point is to see your options clearly before a CD renews or a rollover deadline passes.",
  },
  {
    q: "How are you paid?",
    a: "If you choose a product, the advisor is typically paid a commission by the insurance company. Any fees, surrender charges, or limits are disclosed in writing before you decide.",
  },
  {
    q: "Why don't you list rates?",
    a: "Rates differ by carrier, product, term, and amount, and they change often. Rather than advertise a number that may not apply to you, we show you real options for your situation.",
  },
  {
    q: "Who can you help?",
    a: "Rare Legacy is based in East Norriton, PA and works with clients in 49 states (not California), subject to licensing and product availability.",
  },
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
    <LandingShell>
      <main className="bg-[#F7F5EF]">
        {/* Hero + form: people ready now never have to scroll. */}
        <section className="black-hero-bg px-4 pb-14 pt-8 text-white sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="flex flex-col justify-center">
              <Eyebrow>Free retirement savings review</Eyebrow>
              <h1 className="font-premium mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Protect what you&apos;ve built.
              </h1>
              <p className="mt-4 text-lg leading-8 text-white/80">
                Keep your principal safe from market drops, leave room for it to grow, and see your options from dozens of
                top-rated insurers side by side.
              </p>
              <p className="mt-3 text-base leading-7 text-white/65">
                One licensed local advisor. Free, and no obligation.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-white/80 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Principal-protection options" },
                  { icon: Landmark, label: "Independent: many carriers" },
                  { icon: BadgeCheck, label: "Serving 49 states" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-cream-500" />
                    {label}
                  </li>
                ))}
              </ul>
              <a
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-brand-cream-300"
                href="#how-it-works"
              >
                <ArrowDown aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
                Not ready yet? See how it works
              </a>
            </div>
            <div id={FORM_ID} className="scroll-mt-24">
              <ProtectForm tracking={tracking} />
            </div>
          </div>
        </section>

        {/* Which one sounds like you? */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Eyebrow tone="light">Which one sounds like you?</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">
              Most reviews start with one of these.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {situations.map(({ icon: Icon, title, copy }) => (
                <a
                  key={title}
                  className="premium-card group flex flex-col rounded-2xl p-6 transition hover:-translate-y-0.5"
                  href={`#${FORM_ID}`}
                  data-track="protect_situation_click"
                >
                  <span className="gold-gradient-subtle flex h-11 w-11 items-center justify-center rounded-full text-black">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#050505]">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-neutral-700">{copy}</p>
                  <span className="mt-4 text-sm font-semibold text-brand-black-500 group-hover:underline">
                    Start my free review →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* What happens after you submit */}
        <section id="how-it-works" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Eyebrow tone="light">How it works</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">
              What happens after you request a review.
            </h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {steps.map(({ icon: Icon, title, copy }, index) => (
                <li key={title} className="rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-premium text-3xl font-semibold text-brand-cream-600">{index + 1}</span>
                    <Icon aria-hidden="true" className="h-5 w-5 text-brand-black-500" />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[#050505]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Plain-English explainer, tradeoffs included */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow tone="light">In plain English</Eyebrow>
              <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">
                How guaranteed options work.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-7 text-neutral-700">
                <p>
                  <strong className="text-[#050505]">Fixed annuities</strong> work a lot like a CD from an insurance company:
                  a guaranteed rate for a set number of years.
                </p>
                <p>
                  <strong className="text-[#050505]">Fixed indexed annuities</strong> credit interest based partly on how a
                  market index performs, with a floor so a down market doesn&apos;t reduce your principal. In exchange, growth
                  is limited by caps or participation rates.
                </p>
                <p>
                  Neither one puts your money directly in the stock market, and the guarantees come from the insurance company
                  that issues the contract.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-black-950 p-7 text-white">
              <h3 className="text-lg font-semibold text-brand-cream-300">The tradeoffs we&apos;ll walk you through</h3>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-white/80">
                <li>
                  <span className="font-semibold text-white">Your money is committed for a term.</span> Most contracts run
                  several years, so they&apos;re for money you won&apos;t need right away.
                </li>
                <li>
                  <span className="font-semibold text-white">Early withdrawals can cost you.</span> Taking out more than the
                  contract allows during the surrender period can mean charges and tax consequences.
                </li>
                <li>
                  <span className="font-semibold text-white">Upside is limited.</span> Protection from losses comes with caps
                  on how much you can earn.
                </li>
                <li>
                  <span className="font-semibold text-white">Guarantees depend on the insurer.</span> That&apos;s why we compare
                  highly rated carriers, not just one.
                </li>
              </ul>
              <p className="mt-5 text-xs leading-5 text-white/50">
                Annuities aren&apos;t right for everyone. Part of the review is figuring out whether one fits you at all.
              </p>
            </div>
          </div>
        </section>

        {/* Who you'll talk to */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Eyebrow tone="light">Who you&apos;ll talk to</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">
              Licensed advisors, right here in Montgomery County.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {ADVISORS.map((advisor) => (
                <article key={advisor.slug} className="premium-card flex gap-5 rounded-2xl p-6">
                  {advisor.photo ? (
                    <Image
                      alt={`${advisor.name}, ${advisor.title}`}
                      className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-brand-cream-600/60 ring-offset-2 ring-offset-white"
                      height={160}
                      src={advisor.photo}
                      width={160}
                    />
                  ) : null}
                  <div>
                    <h3 className="text-lg font-semibold text-[#050505]">{advisor.name}</h3>
                    <p className="text-sm font-medium text-brand-black-500">{advisor.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">{advisor.license}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm text-neutral-600">
              {SITE.name} · {SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Eyebrow tone="light">Questions</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">Straight answers.</h2>
            <div className="mt-8 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#050505] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-neutral-500 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="black-hero-bg px-4 py-16 text-center text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-premium text-3xl font-semibold sm:text-4xl">See your options before you decide.</h2>
            <p className="mt-3 text-base leading-7 text-white/70">
              It takes about a minute to request, and the review is free.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                className="gold-gradient-button inline-flex h-12 items-center rounded-full px-7 text-sm font-bold"
                href={`#${FORM_ID}`}
                data-track="protect_bottom_cta"
              >
                Request my free review
              </a>
              <a
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white/85 hover:text-brand-cream-300"
                href={SITE.phone.href}
                data-track="phone_click"
              >
                <PhoneCall aria-hidden="true" className="h-4 w-4 text-brand-cream-500" />
                Call {SITE.phone.display}
              </a>
            </div>
          </div>
        </section>
      </main>
    </LandingShell>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
