import Link from "next/link";
import { RetirementQuiz } from "@/components/forms/retirement-quiz";
import { PublicShell } from "@/components/layout/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, Section } from "@/components/ui/section";
import { quizTracking } from "@/lib/quiz";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { RETIREMENT_ADVISOR } from "@/lib/site";

// The annuity calculator (Chris, 2026-11-24: "yes build it"): the quiz under the heading people search for, on an indexed page
// with the explanation a calculator page owes its visitor. The numbers are the same rough ranges /protect shows and texts
// (src/lib/estimates/income-estimate.ts): illustrations, never a quote. Have compliance review wording before changing it.
export const metadata = pageMetadata({
  title: "Annuity Calculator: Estimate Your Income or Growth | Rare Legacy Life Group",
  description:
    "A free annuity calculator. Answer a few questions about lifetime income or growth and get your estimate by text from a licensed advisor.",
  path: "/annuity-calculator",
});

const factors = [
  ["Your age when income starts", "The later payments begin, the higher each one tends to be, because they are expected to be paid for fewer years."],
  ["How much you put in", "Payments and growth scale with the amount, and some carriers pay a little more on larger amounts."],
  ["One life or two", "Covering a spouse for as long as either of you lives lowers each payment in exchange for the longer guarantee."],
  ["Interest rates on the day you buy", "Insurers set payouts from the rates they can earn at that time, so the same contract pays differently from month to month."],
  ["The product and its options", "A guaranteed period, a refund feature or an income rider each changes the number, sometimes with a yearly charge."],
] as const;

const faqs = [
  {
    question: "Is this annuity calculator free?",
    answer: "Yes. The calculator and the estimate by text are free, and you are not committing to buy anything.",
  },
  {
    question: "How accurate is the estimate?",
    answer:
      "It is a rough illustration built from typical ranges, not a quote from an insurance company. A real figure depends on your exact age, state, the carrier and product, and the rates on the day you apply. An advisor can show you actual carrier illustrations.",
  },
  {
    question: "Why do you text the estimate instead of showing it?",
    answer:
      "The estimate goes by text so it reaches a real person who asked for it, along with a licensed advisor who can explain what is behind the number.",
  },
  {
    question: "Does using the calculator affect my credit or commit me to anything?",
    answer: "No. Nothing here is a credit check or an application. You can stop at any step.",
  },
];

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AnnuityCalculatorPage({ searchParams }: PageProps) {
  const tracking = quizTracking(await searchParams);

  return (
    <PublicShell>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Annuity calculator", path: "/annuity-calculator" },
          ]),
        ]}
      />
      <main>
        {/* The first question on a phone's first screen (2026-11-25 audit): below lg the hero is the label and headline only. */}
        <section className="light-hero-bg px-4 pb-14 pt-5 text-[#050505] sm:px-6 sm:pt-10 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
            <div className="flex flex-col justify-center">
              <Eyebrow>Free annuity calculator</Eyebrow>
              <h1 className="font-premium mt-2 text-3xl font-semibold leading-tight sm:mt-3 sm:text-5xl">
                What could your savings pay you?
              </h1>
              <div className="hidden lg:block">
                <p className="mt-4 text-lg leading-8 text-neutral-700">
                  Answer a few questions about guaranteed lifetime income, or what your money could grow to. A licensed advisor
                  texts you your estimate.
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Estimates are illustrations, not quotes or guarantees. Real figures depend on the carrier, the product, your
                  age and state, and the day you apply.
                </p>
              </div>
            </div>
            <div>
              <RetirementQuiz
                page="calculator"
                tracking={tracking}
                title="Start your estimate."
                intro="Tap an answer to move on. It takes about two minutes."
                advisor={RETIREMENT_ADVISOR}
              />
              <p className="mt-4 text-sm leading-6 text-neutral-600 lg:hidden">
                A licensed advisor texts you your estimate. Estimates are illustrations, not quotes or guarantees. Real figures
                depend on the carrier, the product, your age and state, and the day you apply.
              </p>
            </div>
          </div>
        </section>

        <Section>
          <div className="mx-auto max-w-3xl">
            <Eyebrow tone="light">How the estimate works</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">
              What moves an annuity&apos;s payout.
            </h2>
            <dl className="mt-8 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
              {factors.map(([term, detail]) => (
                <div key={term} className="p-5">
                  <dt className="font-semibold text-[#050505]">{term}</dt>
                  <dd className="mt-2 leading-7 text-neutral-700">{detail}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 leading-7 text-neutral-700">
              Want the background first? Read{" "}
              <Link className="font-semibold underline" href="/education/how-much-does-an-annuity-pay">
                how much an annuity pays
              </Link>
              ,{" "}
              <Link className="font-semibold underline" href="/education/income-annuity">
                how income annuities work
              </Link>{" "}
              or see{" "}
              <Link className="font-semibold underline" href="/annuity-rates">
                recent fixed annuity rates
              </Link>
              .
            </p>
          </div>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-premium text-3xl font-semibold text-[#050505]">Calculator questions</h2>
            <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-5">
                  <h3 className="font-semibold text-[#050505]">{faq.question}</h3>
                  <p className="mt-2 leading-7 text-neutral-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>
    </PublicShell>
  );
}
