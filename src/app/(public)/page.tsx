import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, Phone, Shield, Sparkles, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { GUIDES } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { faqSchema, websiteSchema } from "@/lib/seo/schema";
import { ADVISORS, SITE } from "@/lib/site";
import { Section } from "@/components/ui/section";
import {
  GoldButton,
  GoldDivider,
  PremiumSectionHeader,
  StepCard,
  TrustBar,
} from "@/components/ui/premium";
import { FloatingQuoteCard, HeroReveal, MotionReveal } from "@/components/ui/premium-motion";

export const metadata = pageMetadata({
  title: "Life Insurance & Retirement Income Guidance in East Norriton, PA | Rare Legacy Life Group",
  description:
    "Free life insurance quotes and complimentary retirement income reviews from licensed advisors in East Norriton, PA. Term, whole life, mortgage protection, final expense, and annuities in 49 states.",
  path: "/",
});

const HOME_FAQS = [
  {
    question: "Do I need term or whole life insurance?",
    answer:
      "Most families protecting an income and a mortgage start with term life, which covers a set number of years at the lowest cost. Whole life lasts for life and builds cash value, so it fits lifelong needs like final expenses or leaving a legacy. Many people use a mix of both.",
  },
  {
    question: "How much life insurance do I need?",
    answer:
      "Add up the income your family would need, your mortgage and debts, future education costs, and final expenses, then subtract savings and existing coverage. A common shortcut is 10 to 12 times your income, but a needs-based estimate is more accurate.",
  },
  {
    question: "Will my health history matter?",
    answer:
      "Yes, insurers review health, prescriptions, and tobacco use, but a health condition doesn't automatically mean you can't get coverage. Simplified-issue and other options exist, and an advisor can point you toward realistic paths.",
  },
  {
    question: "Is the quote or retirement review really free?",
    answer:
      "Yes. Quote requests and Retirement Income Blueprint consultations are complimentary, and there is no obligation to buy anything.",
  },
  {
    question: "Where are you located, and do you work outside Pennsylvania?",
    answer:
      "Our office is at 59 W. Germantown Pike in East Norriton, PA. We meet locally across Montgomery County and work with clients remotely in 49 states, excluding California, subject to licensing and product availability.",
  },
  {
    question: "How quickly will someone contact me?",
    answer:
      "A licensed advisor reviews every request and follows up using the contact method you choose. To talk right away, call (484) 430-4363.",
  },
];

const FEATURED_GUIDES = [
  "term-vs-whole-life-insurance",
  "how-much-life-insurance-do-i-need",
  "how-do-annuities-work",
  "retirement-income-planning-pennsylvania",
];

export default function HomePage() {
  const featuredGuides = GUIDES.filter((guide) => FEATURED_GUIDES.includes(guide.slug));

  return (
    <PublicShell>
      <JsonLd data={[websiteSchema(), faqSchema(HOME_FAQS)]} />
      <main>
        <section className="black-hero-bg relative overflow-hidden text-white">
          <div className="signal-grid absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="absolute right-[-12rem] top-12 h-[34rem] w-[34rem] rounded-full border border-[#C9A227]/[0.18]" aria-hidden="true" />
          <div className="absolute right-[-5rem] top-32 h-[21rem] w-[21rem] rounded-full border border-[#FFF2B8]/10" aria-hidden="true" />
          <div className="home-hero-grid relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_0.88fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <HeroReveal>
                <p className="gold-gradient-text text-sm font-semibold uppercase tracking-[0.28em]">
                  Life insurance &amp; retirement guidance
                </p>
              </HeroReveal>
              <HeroReveal delay={0.08}>
                <GoldDivider className="mt-4 w-24" />
              </HeroReveal>
              <HeroReveal delay={0.16}>
                <h1 className="home-hero-title font-premium mt-5 max-w-3xl text-5xl font-semibold leading-[0.94] sm:text-7xl lg:text-8xl">
                  Protect today. Plan what comes next.
                </h1>
              </HeroReveal>
              <HeroReveal delay={0.24}>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                  Licensed advisors in East Norriton, PA helping families nationwide with life
                  insurance, retirement income reviews, and annuity decisions—built around the
                  people, plans, and legacy that matter most.
                </p>
              </HeroReveal>
              <HeroReveal delay={0.32}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <GoldButton href="/quote">Get My Free Quote</GoldButton>
                  <Link
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition hover:border-[#F5E7A3] hover:text-[#F5E7A3]"
                    href="/retirement"
                  >
                    Explore Retirement Planning
                  </Link>
                </div>
              </HeroReveal>
              <HeroReveal delay={0.4}>
                <div className="mt-6">
                  <TrustBar items={["Licensed advisors", "Free quotes & reviews", "No-pressure guidance"]} />
                  <a
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#F5E7A3]"
                    href={SITE.phone.href}
                    data-track="phone_click"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                    Prefer to talk? Call {SITE.phone.display}
                  </a>
                </div>
              </HeroReveal>
              <HeroReveal delay={0.48}>
                <div className="home-hero-stats mt-8 grid max-w-lg grid-cols-3 gap-3">
                  {[
                    ["49", "States served"],
                    ["2 min", "Quote request"],
                    ["$0", "Consultation"],
                  ].map(([value, label]) => (
                    <div key={label} className="dark-premium-card rounded-2xl p-4">
                      <p className="font-premium text-2xl font-semibold">{value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
                    </div>
                  ))}
                </div>
              </HeroReveal>
            </div>
            <div className="relative flex items-center">
              <HeroReveal className="w-full" delay={0.28}>
                <FloatingQuoteCard />
              </HeroReveal>
            </div>
          </div>
        </section>

        <Section className="bg-white">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.14)] lg:aspect-[4/5]">
              <Image
                alt="A retired couple enjoying a walk together in a landscaped park"
                className="object-cover object-[center_40%]"
                fill
                sizes="(max-width: 1023px) 100vw, 40vw"
                src="https://images.pexels.com/photos/8972326/pexels-photo-8972326.jpeg?auto=compress&cs=tinysrgb&w=1200"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="font-premium absolute bottom-5 left-5 right-5 text-xl italic text-white">
                A clearer plan for what comes next.
              </p>
            </div>
            <div>
              <PremiumSectionHeader
                eyebrow="Retirement planning"
                title="Turn retirement questions into a clearer income plan."
                copy="A complimentary review can help organize income sources, timing, market risk, liquidity, family goals, and the trade-offs surrounding annuities—without promising outcomes or pressuring you to purchase."
              />
              <ul className="mt-7 grid gap-4">
                {[
                  [<CalendarDays key="i" />, "Retirement income review", "See how Social Security, pensions, savings, and other income sources may work together."],
                  [<Shield key="i" />, "Annuity education", "Understand contract features, surrender periods, liquidity limits, costs, and insurer-backed guarantees."],
                  [<Users key="i" />, "Family and legacy goals", "Connect retirement decisions with the people, priorities, and legacy your plan is meant to support."],
                ].map(([icon, title, copy]) => (
                  <li key={title as string} className="flex gap-4">
                    <span className="gold-gradient-subtle flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black [&>svg]:h-5 [&>svg]:w-5">
                      {icon}
                    </span>
                    <span>
                      <span className="block font-semibold text-black">{title}</span>
                      <span className="mt-1 block text-sm leading-6 text-[#737373]">{copy}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                className="gold-gradient-button mt-8 inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                href="/retirement"
              >
                Request a Retirement Income Blueprint
              </Link>
            </div>
          </MotionReveal>
        </Section>

        <Section className="black-section">
          <MotionReveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <PremiumSectionHeader
                dark
                eyebrow="Why it matters"
                title="Your coverage should match the life you are actually building."
                copy="Protection is not just a policy. It is income continuity, home stability, business resilience, and breathing room for the people who count on you."
              />
            </div>
            <div className="grid gap-4">
              {[
                "Protect income and family stability.",
                "Prepare for business and ownership responsibilities.",
                "Make legacy decisions before life forces them.",
              ].map((item) => (
                <div key={item} className="dark-premium-card rounded-xl p-5">
                  <div className="gold-divider mb-4 w-16" />
                  <p className="text-sm leading-6 text-white/76">{item}</p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-white">
          <MotionReveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <PremiumSectionHeader
                eyebrow="How it works"
                title="A smarter way to start the life insurance conversation."
                copy="No pressure. No confusion. Just clear guidance designed around the life you are protecting."
              />
            </div>
            <div className="grid gap-4">
              {[
                ["1", "Share the basics", "Answer a few quick questions about what you want to protect. It takes about two minutes."],
                ["2", "Talk with a licensed advisor", "An advisor reviews your goals and walks you through realistic coverage options and costs."],
                ["3", "Decide with clarity", "Choose what fits your family and budget, on your timeline. No pressure, no obligation."],
              ].map(([number, title, copy]) => (
                <StepCard key={number} step={number} title={title} copy={copy} />
              ))}
            </div>
          </MotionReveal>
        </Section>

        <Section className="black-section">
          <MotionReveal>
            <PremiumSectionHeader
              align="center"
              dark
              eyebrow="Coverage options"
              title="Simple guidance. Serious protection."
              copy="Start with what matters most, then refine the strategy with an advisor."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <DarkValue href="/education/how-much-life-insurance-do-i-need" icon={<Shield />} title="Family protection" copy="Income replacement and stability for the people who depend on you." />
              <DarkValue href="/education/mortgage-protection-insurance" icon={<Users />} title="Mortgage safety net" copy="Protection designed around home, debt, and long-term obligations." />
              <DarkValue href="/education/term-vs-whole-life-insurance" icon={<Sparkles />} title="Legacy planning" copy="Coverage conversations that can support wealth transfer and responsible planning." />
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-white">
          <MotionReveal>
            <PremiumSectionHeader
              eyebrow="Meet your advisors"
              title="Real, licensed people—not a call center."
              copy="When you reach out, you work directly with a licensed Rare Legacy Life advisor."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {ADVISORS.map((advisor) => (
                <Link
                  key={advisor.slug}
                  className="premium-card group flex items-center gap-5 rounded-2xl p-6 transition hover:-translate-y-0.5"
                  href={`/about#${advisor.slug}`}
                >
                  {advisor.photo ? (
                    <Image
                      alt={`${advisor.name}, ${advisor.title}`}
                      className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[#C9A227]/60 ring-offset-2 ring-offset-white"
                      height={160}
                      src={advisor.photo}
                      width={160}
                    />
                  ) : (
                    <span className="gold-gradient-subtle flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-black">
                      <BadgeCheck aria-hidden="true" className="h-6 w-6" />
                    </span>
                  )}
                  <span>
                    <span className="font-premium block text-2xl font-semibold text-black">{advisor.name}</span>
                    <span className="block text-sm font-medium text-[#8A6A16]">{advisor.title}</span>
                    <span className="mt-1 block text-xs text-[#737373]">{advisor.license}</span>
                  </span>
                </Link>
              ))}
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <MotionReveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <PremiumSectionHeader eyebrow="Guides" title="Get straight answers first." />
              <Link className="inline-flex items-center gap-1 text-sm font-semibold text-black hover:underline" href="/education">
                All guides <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  className="premium-card group rounded-xl p-5 transition hover:-translate-y-0.5"
                  href={`/education/${guide.slug}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#8A6A16]">{guide.category}</span>
                  <span className="mt-2 block font-semibold leading-6 text-black group-hover:underline">{guide.title}</span>
                </Link>
              ))}
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-white">
          <MotionReveal>
            <PremiumSectionHeader eyebrow="FAQ" title="Common first questions" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {HOME_FAQS.map((faq) => (
                <div key={faq.question} className="premium-card rounded-xl p-5">
                  <h3 className="font-semibold text-black">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#737373]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </MotionReveal>
        </Section>

        <Section className="black-section">
          <MotionReveal className="mx-auto max-w-3xl text-center">
            <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.22em]">Start with clarity</p>
            <h2 className="font-premium mt-4 text-4xl font-semibold leading-tight text-white">
              Secure your family. Build your legacy.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/66">
              A free, private quote request is the first step toward coverage that fits your life.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className="gold-gradient-button inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
                href="/quote"
              >
                Start My Quote
              </Link>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-sm font-semibold text-white hover:border-[#F5E7A3]"
                href={SITE.phone.href}
                data-track="phone_click"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                {SITE.phone.display}
              </a>
            </div>
          </MotionReveal>
        </Section>
      </main>
    </PublicShell>
  );
}

function DarkValue({
  href,
  icon,
  title,
  copy,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <Link
      className="dark-premium-card group block rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/70"
      href={href}
    >
      <div className="gold-gradient-subtle flex h-11 w-11 items-center justify-center rounded-full text-black">
        {icon}
      </div>
      <h3 className="font-premium mt-5 text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/72">{copy}</p>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#F5E7A3]">
        Learn more <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}
