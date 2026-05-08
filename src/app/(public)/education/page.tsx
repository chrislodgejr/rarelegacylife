import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";

const educationSections = [
  {
    title: "What life insurance is really designed to do",
    copy:
      "Life insurance is a financial protection tool. When the insured person dies, the policy can pay a death benefit to the beneficiaries named on the policy. Families often use that money to replace income, keep a home, cover final expenses, pay debts, protect children, or create breathing room while they make decisions. The right policy is not just about the lowest monthly payment; it should match the responsibility you are trying to protect.",
  },
  {
    title: "Term life insurance",
    copy:
      "Term coverage is built for a set period of time, such as 10, 20, or 30 years. It is often used when the need is temporary but important: raising children, covering a mortgage, protecting income during working years, or securing business obligations. Term can be a strong fit when you need meaningful coverage at a practical cost, but it usually does not build cash value and may become more expensive or unavailable after the term ends.",
  },
  {
    title: "Permanent life insurance",
    copy:
      "Permanent coverage is designed to last beyond a fixed term when premiums are paid and the policy remains in force. Depending on the product, it may include cash value, long-term guarantees, or flexible planning features. Permanent insurance can support legacy planning, final expenses, long-range family protection, business planning, and wealth-transfer conversations. It is usually more expensive than term, so it should be matched carefully to the purpose.",
  },
  {
    title: "How much coverage to consider",
    copy:
      "A useful starting point is to add up income replacement, mortgage or rent obligations, debts, childcare, education goals, final expenses, and any business or family responsibilities that would continue after death. Then compare that total against existing savings, employer coverage, and current policies. Many people are underinsured because they only think about burial costs instead of the full financial gap their family would face.",
  },
  {
    title: "Young families and household protection",
    copy:
      "For parents, coverage often protects more than income. It can help a surviving spouse or guardian pay for housing, childcare, transportation, school costs, medical bills, and time away from work. Even a parent who does not earn outside income may need coverage because replacing their household labor can be expensive. The goal is to keep the family stable during a period when stability matters most.",
  },
  {
    title: "Business owners and key-person risk",
    copy:
      "Business owners may need coverage for buy-sell agreements, key-person risk, business loans, payroll continuity, partner protection, succession planning, or family liquidity. If a founder, operator, or revenue-producing partner dies, the company may need immediate cash to stabilize operations. Life insurance can be part of that continuity plan when it is structured intentionally.",
  },
  {
    title: "Health, underwriting, and approval factors",
    copy:
      "Insurance companies may review age, health history, prescriptions, tobacco use, height and weight, family history, driving history, finances, occupation, and hobbies. Some policies require medical underwriting, while others may offer simplified paths. Health history does matter, but it does not automatically mean you cannot qualify. The best next step is usually to understand the goal, then identify realistic carrier and product options.",
  },
  {
    title: "Common mistakes to avoid",
    copy:
      "The most common mistakes are waiting too long, relying only on employer coverage, choosing a policy without knowing the purpose, guessing at the coverage amount, or buying solely on price. Employer coverage can be valuable, but it is often tied to the job and may not be portable. A strong plan should answer three questions: who needs the money, how much would they need, and how long would the need last?",
  },
];

const planningQuestions = [
  "Who depends on your income, care, business role, or financial support?",
  "What debt, mortgage, rent, childcare, education, or final-expense obligations would remain?",
  "How long would your family or business need support if your income stopped?",
  "Do you need temporary protection, permanent protection, or a combination of both?",
  "What coverage do you already have through work or existing policies?",
  "What monthly budget can be sustained without putting pressure on the household?",
];

export default function EducationPage() {
  return (
    <PublicShell>
      <main>
        <Section className="black-hero-bg text-white">
          <div className="max-w-4xl">
            <Eyebrow>Life insurance education</Eyebrow>
            <h1 className="font-premium mt-4 text-4xl font-semibold text-white sm:text-6xl">
              Understand the protection before you choose the policy.
            </h1>
            <p className="mt-6 text-base leading-8 text-white/72">
              Life insurance is not one-size-fits-all. Your best path depends on your family,
              income, health, debt, business responsibilities, budget, and long-term goals. Use this
              guide to understand the core decisions before speaking with an advisor.
            </p>
          </div>
        </Section>

        <Section>
          <div className="grid gap-5 md:grid-cols-2">
            {educationSections.map((section) => (
              <article key={section.title} className="premium-card rounded-xl p-6">
                <h2 className="font-premium text-2xl font-semibold text-[#050505]">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{section.copy}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Eyebrow>Planning checklist</Eyebrow>
              <h2 className="font-premium mt-3 text-4xl font-semibold text-[#050505]">
                Questions to answer before comparing options.
              </h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                These questions help turn a quote request into a real protection strategy. You do
                not need perfect answers before starting, but the more clearly you define the need,
                the better the recommendation can be.
              </p>
            </div>
            <div className="grid gap-3">
              {planningQuestions.map((question) => (
                <div key={question} className="rounded-xl border border-neutral-200 bg-white p-4 text-sm font-medium leading-6 text-[#050505]">
                  {question}
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="black-section rounded-2xl p-6 text-white md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="font-premium text-3xl font-semibold">Ready to compare your options?</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
                  The quote form helps us understand your goals, verify your email securely, and
                  route your request for advisor guidance. You are not committing to buy a policy by
                  submitting a quote request.
                </p>
              </div>
              <Link
                className="gold-gradient-button inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
                href="/quote"
              >
                Get a quote
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}
