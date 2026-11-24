// How the retirement guides are found (Chris, 2026-11-24: "guides are great but seems like someone would get lost or overwhelmed
// trying to figure out what to read"). The Education page shows a short "Start here" path, then the guides by topic. Every
// "Retirement & annuities" guide belongs to at least one topic; a test checks that, and that every slug here exists.

export const START_HERE = [
  "how-do-annuities-work",
  "3-types-of-annuities",
  "are-annuities-safe",
  "how-much-does-an-annuity-pay",
  "who-should-buy-an-annuity",
  "how-to-choose-an-annuity-advisor",
] as const;

export const RETIREMENT_TOPICS: { key: string; title: string; blurb: string; slugs: string[] }[] = [
  {
    key: "basics",
    title: "The basics",
    blurb: "What annuities are, who they fit, and when and where to buy one.",
    slugs: [
      "how-do-annuities-work", "3-types-of-annuities", "annuities-for-retirement", "immediate-vs-deferred-annuity",
      "are-annuities-a-good-investment", "who-should-buy-an-annuity", "best-age-to-buy-an-annuity", "where-to-buy-an-annuity",
      "how-insurance-companies-make-money-on-annuities",
    ],
  },
  {
    key: "types",
    title: "Types of annuities",
    blurb: "Fixed, indexed, income and variable, and how they compare with CDs and IRAs.",
    slugs: [
      "myga-fixed-annuity", "5-year-fixed-annuity", "fixed-indexed-annuity", "income-annuity", "single-premium-immediate-annuity",
      "deferred-annuity", "deferred-income-annuity", "myga-vs-fixed-indexed-annuity", "indexed-vs-fixed-annuity",
      "variable-vs-fixed-indexed-annuity", "annuity-vs-cd", "ira-vs-annuity", "non-qualified-annuity",
    ],
  },
  {
    key: "payouts",
    title: "How much an annuity pays",
    blurb: "What drives the monthly check, by amount, and how much to put in.",
    slugs: [
      "how-much-does-an-annuity-pay", "how-much-does-a-100000-annuity-pay-per-month", "how-much-does-a-200000-annuity-pay-per-month",
      "how-much-does-a-250000-annuity-pay-per-month", "how-much-does-a-300000-annuity-pay-per-month",
      "how-much-does-a-500000-annuity-pay-per-month", "how-much-does-a-1-million-annuity-pay-per-month", "annuity-payout-rates",
      "how-much-to-put-in-an-annuity", "how-much-do-i-need-to-retire", "life-only-vs-period-certain-vs-cash-refund",
      "annuity-calculator-guide", "life-annuity-calculator-explained",
    ],
  },
  {
    key: "rates-fees",
    title: "Rates, bonuses and fees",
    blurb: "How rates are set and compared, what bonuses really cost, and every fee to ask about.",
    slugs: [
      "fixed-index-annuity-rates-explained", "what-influences-fixed-annuity-rates", "how-to-compare-fixed-annuity-rates",
      "how-to-lock-in-a-better-annuity-rate", "how-fixed-deferred-annuities-grow", "annuity-bonus-explained",
      "premium-bonus-vs-income-rider-bonus", "annuity-bonus-vesting", "annuity-fees-explained", "annuity-surrender-charges",
    ],
  },
  {
    key: "taxes",
    title: "Taxes and moving money",
    blurb: "How annuities are taxed, rollovers and exchanges, and getting to your money.",
    slugs: [
      "how-annuities-are-taxed", "tax-deferred-annuity-guide", "401k-rollover-to-annuity", "1035-exchange-annuity",
      "roth-conversion-in-retirement", "annuity-liquidity-access", "annuity-free-look-period",
    ],
  },
  {
    key: "family",
    title: "Family, beneficiaries and estate",
    blurb: "Protecting a spouse, naming beneficiaries, and what heirs receive and owe.",
    slugs: [
      "what-happens-to-an-annuity-when-you-die", "annuity-death-benefits-explained", "annuity-beneficiary-rules",
      "annuity-owner-vs-annuitant-vs-beneficiary", "how-are-inherited-annuities-taxed", "annuity-estate-planning",
      "joint-and-survivor-annuity", "lifetime-income-for-couples", "how-to-protect-your-spouse-in-retirement", "annuity-long-term-care",
    ],
  },
  {
    key: "safety",
    title: "Safety and avoiding mistakes",
    blurb: "What backs the guarantee, warning signs, and how to choose an advisor.",
    slugs: [
      "are-annuities-safe", "can-you-lose-money-in-an-annuity", "how-annuities-protect-your-principal",
      "what-happens-if-an-annuity-company-goes-bankrupt", "annuity-company-warning-signs", "fixed-index-annuity-red-flags",
      "spia-mistakes-to-avoid", "how-to-choose-an-annuity-advisor",
    ],
  },
  {
    key: "planning",
    title: "Planning retirement income",
    blurb: "Building a paycheck for life, Social Security, market risk and pensions.",
    slugs: [
      "retirement-paycheck-strategy", "sequence-of-returns-risk", "protecting-retirement-from-market-risk", "social-security-and-annuities",
      "can-an-annuity-replace-a-pension", "why-retirees-choose-fixed-annuities", "retirement-income-planning-pennsylvania",
    ],
  },
];
