import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";

const topics = [
  ["What is life insurance?", "A contract that can pay a benefit to loved ones when the insured person dies."],
  ["Term life vs whole life", "Term is often temporary and affordable. Whole life can include permanent protection and cash value."],
  ["How much coverage do I need?", "Consider income, debts, mortgage, dependents, final expenses, and future goals."],
  ["Young families", "Coverage can protect childcare, housing, education, and income replacement needs."],
  ["Business owners", "Policies can support buy-sell planning, key person risk, loans, and continuity."],
  ["Final expenses", "Coverage can help loved ones handle funeral costs and immediate bills."],
  ["Common myths", "Life insurance is not only for older people, parents, or high earners."],
];

export default function EducationPage() {
  return (
    <PublicShell>
      <main>
        <Section className="black-hero-bg text-white">
          <div className="max-w-3xl">
            <Eyebrow>Life insurance education</Eyebrow>
            <h1 className="font-premium mt-4 text-4xl font-semibold text-white sm:text-5xl">
              Understand the basics before you choose.
            </h1>
            <p className="mt-6 text-base leading-8 text-white/72">
              Use this as a starting point. The right answer depends on your family, health, budget,
              goals, and timeline.
            </p>
          </div>
        </Section>
        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {topics.map(([title, copy]) => (
              <article key={title} className="premium-card rounded-xl p-6">
                <h2 className="font-premium text-xl font-semibold text-[#050505]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{copy}</p>
              </article>
            ))}
          </div>
          <div className="black-section mt-10 rounded-2xl p-6 text-white">
            <h2 className="font-premium text-2xl font-semibold">Ready to compare your options?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
              The quote form helps us understand your goals and route your request to the right
              advisor.
            </p>
            <Link
              className="gold-gradient-button mt-5 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold"
              href="/quote"
            >
              Get a quote
            </Link>
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}
