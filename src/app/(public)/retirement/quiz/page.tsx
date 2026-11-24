import { BadgeCheck, Landmark, ShieldCheck } from "lucide-react";
import { RetirementQuiz } from "@/components/forms/retirement-quiz";
import { LandingShell } from "@/components/layout/landing-shell";
import { Eyebrow } from "@/components/ui/section";
import { quizTracking } from "@/lib/quiz";
import { pageMetadata } from "@/lib/seo/metadata";
import { RETIREMENT_ADVISOR } from "@/lib/site";

// The retirement quiz on its own stripped page (Chris, 2026-11-24: "yes build it"). Like /protect it is for paid traffic and the
// site's own buttons, so it is not indexed and not in the sitemap, and it has no site navigation. /retirement (the QR code's page)
// and /protect (the live ad page and its test) are both unchanged. The Google tag is here so a request can be reported the way
// /protect's is once ads point at this page.
export const metadata = pageMetadata({
  title: "Retirement Quiz: See Your Options in 2 Minutes | Rare Legacy Life Group",
  description:
    "Answer a few quick questions and a licensed advisor will text you a rough estimate and compare options from highly rated carriers. Free, no obligation.",
  path: "/retirement/quiz",
  noIndex: true,
});

type QuizPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function RetirementQuizPage({ searchParams }: QuizPageProps) {
  const tracking = quizTracking(await searchParams);

  return (
    <LandingShell>
      <main className="black-hero-bg min-h-[80vh] px-4 pb-16 pt-8 text-white sm:px-6 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <Eyebrow>Free retirement savings review</Eyebrow>
            <h1 className="font-premium mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Find out which retirement options fit you.
            </h1>
          </div>
          <div className="mt-7">
            <RetirementQuiz
              page="quiz"
              tracking={tracking}
              title="A few quick questions. About two minutes."
              intro="Tap an answer to move on. There's nothing to type until the last step."
              advisor={RETIREMENT_ADVISOR}
            />
          </div>
          <ul className="mt-7 grid gap-3 text-sm text-white/80 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "Principal-protection options" },
              { icon: Landmark, label: "Independent: many carriers" },
              { icon: BadgeCheck, label: "Licensed advisors, 49 states" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center justify-center gap-2">
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-cream-500" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </LandingShell>
  );
}
