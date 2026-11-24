// The retirement quiz (Chris, 2026-11-24, after looking at how a matching site lays out its questions: "can we structure rare legacy
// to be like this with all the sub pages and how the questions are laid out", then "yes build it"). One question a screen, each a tap,
// then the same contact step and estimate by text as /protect. The quiz is the same request as /protect (src/server/actions/
// protect-request.ts): these are only its extra taps and the pages that carry it. /protect itself is unchanged.

/** The pages that carry the quiz, each with its address and the `source` its requests are saved under on the site. */
export const QUIZ_PAGES = {
  quiz: { path: "/retirement/quiz", source: "retirement_quiz" },
  // The QR code's page (Chris, 2026-11-24: "the retirement page can change. i just need it to be a live page because of a qr code
  // attached to it"): the quiz is the first thing under its hero, saved under its own source so QR scans can be counted apart.
  retirement: { path: "/retirement", source: "retirement_page" },
  // The Google Ads landing page, the quiz since 2026-11-24 (Chris: "it was suppose to be built out like the quiz ... not one single
  // form"). Its requests keep the source the ads have always used.
  protect: { path: "/protect", source: "google_ads_protect" },
  calculator: { path: "/annuity-calculator", source: "annuity_calculator" },
  rates: { path: "/annuity-rates", source: "annuity_rates" },
} as const;

export type QuizPage = keyof typeof QUIZ_PAGES;
export const QUIZ_PAGE_KEYS = ["quiz", "retirement", "protect", "calculator", "rates"] as const satisfies readonly QuizPage[];

export const QUIZ_RETIRED = [
  ["retired", "Yes, I'm retired"],
  ["within_5", "Not yet, within 5 years"],
  ["later", "Not yet, more than 5 years away"],
] as const;

export const QUIZ_WORRIES = [
  ["outliving", "Running out of money"],
  ["market_loss", "Losing money in the market"],
  ["inflation", "Rising prices"],
  ["health_costs", "Healthcare and long-term care costs"],
] as const;

/** Where the money sits now: it tells the advisor whether the first call is about a rollover, a maturing CD or a transfer. */
export const QUIZ_MONEY_LOCATIONS = [
  ["401k_ira", "401(k), 403(b) or IRA"],
  ["cd_savings", "CDs or bank savings"],
  ["brokerage", "Brokerage or investment account"],
  ["annuity", "An annuity I already own"],
  ["other", "Something else"],
] as const;

export const QUIZ_RETIRED_VALUES = ["retired", "within_5", "later"] as const;
export const QUIZ_WORRY_VALUES = ["outliving", "market_loss", "inflation", "health_costs"] as const;
export const QUIZ_MONEY_VALUES = ["401k_ira", "cd_savings", "brokerage", "annuity", "other"] as const;

type QuizAnswers = { retired?: string | null; worry?: string | null; money_location?: string | null };

const label = (choices: readonly (readonly [string, string])[], value: string | null | undefined) =>
  choices.find(([choice]) => choice === value)?.[1] ?? null;

/**
 * The quiz taps as one plain line for the advisor (it rides in the request's `question`, which Endless One already takes), or null
 * when none were picked. Fixed labels only: nothing here is typed by the visitor.
 */
export function quizNote(answers: QuizAnswers) {
  const parts = [
    ["Retired", label(QUIZ_RETIRED, answers.retired)],
    ["Biggest worry", label(QUIZ_WORRIES, answers.worry)],
    ["Money is in", label(QUIZ_MONEY_LOCATIONS, answers.money_location)],
  ].filter((part): part is [string, string] => part[1] !== null);
  return parts.length ? `Quiz answers. ${parts.map(([name, value]) => `${name}: ${value}`).join(". ")}.` : null;
}

type SearchParams = Record<string, string | string[] | undefined>;
const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid"] as const;

/** The campaign tags and Google click ids in a page's address, as the quiz's hidden fields carry them (the same ones /protect keeps). */
export function quizTracking(params: SearchParams) {
  const tracking: Partial<Record<(typeof TRACKING_KEYS)[number], string>> = {};
  for (const key of TRACKING_KEYS) {
    const value = params[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (first) tracking[key] = first;
  }
  return tracking;
}
