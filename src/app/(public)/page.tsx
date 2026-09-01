import Link from "next/link";
import { CalendarDays, CheckCircle2, Shield, Sparkles, Users } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Section } from "@/components/ui/section";
import {
  GoldButton,
  GoldDivider,
  PremiumBadge,
  PremiumSectionHeader,
  StepCard,
  TrustBar,
} from "@/components/ui/premium";
import { FloatingQuoteCard, HeroReveal, MotionReveal } from "@/components/ui/premium-motion";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="black-hero-bg relative overflow-hidden text-white">
          <div className="signal-grid absolute inset-0 opacity-25" aria-hidden="true" />
          <div className="absolute right-[-12rem] top-12 h-[34rem] w-[34rem] rounded-full border border-[#C9A227]/[0.18]" aria-hidden="true" />
          <div className="absolute right-[-5rem] top-32 h-[21rem] w-[21rem] rounded-full border border-[#FFF2B8]/10" aria-hidden="true" />
          <div className="home-hero-grid relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_0.88fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <HeroReveal>
                <p className="gold-gradient-text text-sm font-semibold uppercase tracking-[0.28em]">
                  Rare Legacy Life
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
                  Personal guidance for life insurance, retirement income reviews, and annuity
                  decisions—built around the people, plans, and legacy that matter most.
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
                  <TrustBar items={["Secure quote request", "Advisor-guided", "No-pressure guidance"]} />
                </div>
              </HeroReveal>
              <HeroReveal delay={0.48}>
                <div className="home-hero-stats mt-8 grid max-w-lg grid-cols-3 gap-3">
                  {[
                    ["100%", "Private"],
                    ["4", "Steps"],
                    ["0", "Pressure"],
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
          <MotionReveal>
            <PremiumSectionHeader
              align="center"
              eyebrow="Retirement planning"
              title="Turn retirement questions into a clearer income plan."
              copy="A complimentary review can help organize income sources, timing, market risk, liquidity, family goals, and the trade-offs surrounding annuities—without promising outcomes or pressuring you to purchase."
            />
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              <DarkValueLight icon={<CalendarDays />} title="Retirement income review" copy="See how Social Security, pensions, savings, and other income sources may work together." />
              <DarkValueLight icon={<Shield />} title="Annuity education" copy="Understand contract features, surrender periods, liquidity limits, costs, and insurer-backed guarantees." />
              <DarkValueLight icon={<Users />} title="Family and legacy goals" copy="Connect retirement decisions with the people, priorities, and legacy your plan is meant to support." />
            </div>
            <div className="mt-8 text-center">
              <Link className="gold-gradient-button inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold" href="/retirement">
                Request a Retirement Income Blueprint
              </Link>
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <MotionReveal>
            <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Clear guidance", "Plain-language help with term, permanent, and coverage amounts."],
              ["Private by design", "Your request is handled securely and shared only for coverage guidance."],
              ["Personal next steps", "An advisor can help you understand options that fit your family and budget."],
            ].map(([title, copy]) => (
              <div key={title} className="premium-card rounded-xl p-6">
                <span className="gold-gradient-subtle flex h-10 w-10 items-center justify-center rounded-full text-black">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#737373]">{copy}</p>
              </div>
            ))}
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
                ["1", "Share the basics", "Tell us what you want protected in the guided quote flow."],
                ["2", "Confirm your email", "Verify your quote email so your request stays private and secure."],
                ["3", "Move with clarity", "A Rare Legacy Life advisor helps identify practical coverage paths."],
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
              <DarkValue icon={<Shield />} title="Family protection" copy="Income replacement and stability for the people who depend on you." />
              <DarkValue icon={<Users />} title="Mortgage safety net" copy="Protection designed around home, debt, and long-term obligations." />
              <DarkValue icon={<Sparkles />} title="Legacy planning" copy="Coverage conversations that can support wealth transfer and responsible planning." />
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <MotionReveal className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <PremiumSectionHeader
                eyebrow="Guided quote"
                title="Let's find coverage that fits your life."
                copy="A few quick questions help us understand your goals and prepare a thoughtful coverage conversation."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {["Private intake", "Secure email check", "Advisor guidance"].map((item) => (
                  <PremiumBadge key={item} tone="light">{item}</PremiumBadge>
                ))}
              </div>
            </div>
            <div className="gold-border premium-card rounded-2xl p-6">
              <h3 className="font-premium text-2xl font-semibold text-black">Ready to check your options?</h3>
              <p className="mt-3 text-sm leading-6 text-[#737373]">
                Start with a secure quote request. We will review it and follow up with next steps.
              </p>
              <Link
                className="gold-gradient-button mt-5 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold"
                href="/quote"
              >
                Check My Coverage Options
              </Link>
            </div>
          </MotionReveal>
        </Section>

        <Section className="bg-white">
          <MotionReveal>
            <PremiumSectionHeader eyebrow="FAQ preview" title="Common first questions" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Do I need term or whole life?", "It depends on your goals, budget, timeline, and legacy planning needs."],
              ["How much coverage is enough?", "Start with income, debt, dependents, mortgage, final expenses, and future obligations."],
              ["Will health history matter?", "Yes, but options can still exist. Share only what is needed in the secure form."],
            ].map(([question, answer]) => (
              <div key={question} className="premium-card rounded-xl p-5">
                <h3 className="font-semibold text-black">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#737373]">{answer}</p>
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
              A private quote request is the first step toward coverage that fits your life.
            </p>
            <Link
              className="gold-gradient-button mt-7 inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
              href="/quote"
            >
              Start My Quote
            </Link>
          </MotionReveal>
        </Section>
      </main>
    </PublicShell>
  );
}

function DarkValueLight({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="premium-card rounded-2xl p-6">
      <div className="gold-gradient-subtle flex h-11 w-11 items-center justify-center rounded-full text-black">{icon}</div>
      <h2 className="font-premium mt-5 text-2xl font-semibold text-black">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#737373]">{copy}</p>
    </div>
  );
}

function DarkValue({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="dark-premium-card rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]/70">
      <div className="gold-gradient-subtle flex h-11 w-11 items-center justify-center rounded-full text-black">
        {icon}
      </div>
      <h2 className="font-premium mt-5 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/72">{copy}</p>
    </div>
  );
}
