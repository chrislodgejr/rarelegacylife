import Link from "next/link";
import { RetirementQuiz } from "@/components/forms/retirement-quiz";
import { PublicShell } from "@/components/layout/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Eyebrow, Section } from "@/components/ui/section";
import { GROWTH_RATES_AS_OF, GROWTH_TERMS } from "@/lib/estimates/income-estimate";
import { quizTracking } from "@/lib/quiz";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { RETIREMENT_ADVISOR } from "@/lib/site";

// A rates page that works when every product is different (Chris, 2026-11-24: "i didnt say i wouldnt advertise rates it just hard
// when every product is different. if you think there is a good way to do it then do it"). It shows a dated RANGE per guarantee
// period for one kind of product, the fixed multi-year guaranteed annuity, where a rate is a plain number. The ranges and their date
// are the ones the estimate already uses (GROWTH_TERMS and GROWTH_RATES_AS_OF in src/lib/estimates/income-estimate.ts, read from the
// rate card of the carrier the advisors use most), so there is one place to update and the page can never disagree with the texted
// estimate. No carrier is named. Indexed and income products get no rate here because theirs is not a single number.
// Approved to go live by Chris, 2026-11-24 ("no we are good"). Publishing a rate is an advertisement under state insurance rules:
// have compliance review any change to the ranges, their date or this wording.
export const metadata = pageMetadata({
  title: "Fixed Annuity Rates: Recent Ranges by Term | Rare Legacy Life Group",
  description:
    "Recent fixed annuity (MYGA) rate ranges by guarantee period, with the date they were read, what changes your rate, and a free estimate for your amount.",
  path: "/annuity-rates",
});

const asOf = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
  new Date(GROWTH_RATES_AS_OF),
);

// Two decimals on every rate, so the table's figures line up (5.80%, not 5.8%).
const formatRate = (rate: number) => `${(rate * 100).toFixed(2)}%`;

const faqs = [
  {
    question: "Are these rates guaranteed?",
    answer:
      "The ranges on this page are not an offer. Once a fixed multi-year guaranteed annuity is issued, its rate is guaranteed by the insurance company for the guarantee period in the contract. The rate you are offered depends on the carrier, the amount, your state and the day you apply.",
  },
  {
    question: "Why do you show a range instead of one rate?",
    answer:
      "Because one number would be wrong for most people. Rates differ by state and by how much you put in, and carriers change them often. A range with a date is the honest version.",
  },
  {
    question: "Why are there no rates for indexed or income annuities?",
    answer:
      "Their return is not a single rate. A fixed indexed annuity credits interest through caps and participation rates tied to an index, and an income annuity pays an amount based on your age and options. For those, the calculator gives a rough range and an advisor shows carrier illustrations.",
  },
  {
    question: "How is a fixed annuity rate different from a CD rate?",
    answer:
      "Both are a set rate for a set term. A CD is a bank deposit with FDIC insurance and its interest is taxed each year. A fixed annuity is an insurance contract backed by the insurer, its interest is tax-deferred until withdrawn, and early withdrawals can bring surrender charges.",
  },
];

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AnnuityRatesPage({ searchParams }: PageProps) {
  const tracking = quizTracking(await searchParams);

  return (
    <PublicShell>
      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Annuity rates", path: "/annuity-rates" },
          ]),
        ]}
      />
      <main>
        <section className="black-hero-bg px-4 pb-14 pt-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
            <div className="flex flex-col justify-center">
              <Eyebrow>Fixed annuity rates</Eyebrow>
              <h1 className="font-premium mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
                Recent fixed annuity rates, by term.
              </h1>
              <p className="mt-4 text-lg leading-8 text-white/80">
                Ranges for fixed multi-year guaranteed annuities from a highly rated carrier our advisors use often, as of{" "}
                <time dateTime={GROWTH_RATES_AS_OF}>{asOf}</time>.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Fixed annuity rate ranges by guarantee period</caption>
                  <thead className="bg-white/[0.06] text-white/70">
                    <tr>
                      <th className="px-4 py-3 font-semibold" scope="col">
                        Guarantee period
                      </th>
                      <th className="px-4 py-3 font-semibold" scope="col">
                        Yearly rate range
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {GROWTH_TERMS.map(([years, label, low, high]) => (
                      <tr key={years}>
                        <th className="px-4 py-4 font-semibold text-white" scope="row">
                          {label}
                        </th>
                        <td className="font-premium px-4 py-4 text-2xl font-semibold text-brand-cream-300">
                          {formatRate(low)} to {formatRate(high)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-5 text-white/55">
                Not an offer or a quote. Rates vary by carrier, state and amount, and can change without notice; the low end
                generally applies to smaller amounts. Withdrawals beyond the contract&apos;s free amount during the guarantee
                period can bring surrender charges and a market value adjustment. Guarantees depend on the issuing
                insurer&apos;s claims-paying ability. Annuities are not bank deposits and are not FDIC insured.
              </p>
            </div>
            <RetirementQuiz
              page="rates"
              tracking={tracking}
              goal="growth"
              title="See what your amount could grow to."
              intro="A few taps, then an estimate for your amount and term by text."
              advisor={RETIREMENT_ADVISOR}
            />
          </div>
        </section>

        <Section>
          <div className="mx-auto max-w-3xl">
            <Eyebrow tone="light">Reading the table</Eyebrow>
            <h2 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">What decides your rate.</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-7 text-neutral-700 marker:text-brand-cream-600">
              <li>
                <strong className="text-[#050505]">The term.</strong> Longer guarantee periods usually pay more, and your
                money is committed for that long.
              </li>
              <li>
                <strong className="text-[#050505]">The amount.</strong> Many carriers pay a higher rate above a set amount,
                often $100,000.
              </li>
              <li>
                <strong className="text-[#050505]">Your state.</strong> The same product can carry a different rate from one
                state to the next.
              </li>
              <li>
                <strong className="text-[#050505]">The day you apply.</strong> Carriers reprice as market interest rates
                move. Some let you lock a rate while your money transfers.
              </li>
            </ul>
            <p className="mt-6 leading-7 text-neutral-700">
              More on this:{" "}
              <Link className="font-semibold underline" href="/education/myga-fixed-annuity">
                how a fixed multi-year annuity works
              </Link>
              ,{" "}
              <Link className="font-semibold underline" href="/education/annuity-vs-cd">
                annuity vs. CD
              </Link>{" "}
              and{" "}
              <Link className="font-semibold underline" href="/education/annuity-surrender-charges">
                surrender charges
              </Link>
              .
            </p>
          </div>
        </Section>

        <Section className="bg-[#F7F5EF]">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-premium text-3xl font-semibold text-[#050505]">Rate questions</h2>
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
