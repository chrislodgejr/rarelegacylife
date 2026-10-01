/**
 * Guide library ("answer pages"). Each guide answers ONE question people ask
 * Google and AI assistants. Structure rules (keep these when adding guides):
 *  - `answer` is a direct 40–70 word answer. It renders first and is what AI
 *    tools quote, so it must stand on its own.
 *  - One named licensed author per guide, plus a real `updated` date.
 *  - Educational only: no carrier names, rates, or guarantees without compliance review.
 */

export type GuideTable = { caption: string; headers: string[]; rows: string[][] };

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: GuideTable;
};

export type Guide = {
  slug: string;
  category: "Life insurance" | "Retirement & annuities" | "Business owners" | "Local";
  title: string;
  metaTitle: string;
  description: string;
  author: "daniel-pennachietti" | "christian-pennachietti";
  published: string;
  updated: string;
  readMinutes: number;
  answer: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  sources?: { label: string; url: string }[];
  related: string[];
  cta: "quote" | "retirement";
};

export const GUIDES: Guide[] = [
  {
    slug: "term-vs-whole-life-insurance",
    category: "Life insurance",
    title: "Term vs. whole life insurance: which one do you actually need?",
    metaTitle: "Term vs. Whole Life Insurance: Which Do You Need? | Rare Legacy Life",
    description:
      "A plain-language comparison of term and whole life insurance — cost, cash value, how long coverage lasts, and which situations fit each.",
    author: "daniel-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 6,
    answer:
      "Term life insurance covers you for a set period — usually 10, 20, or 30 years — and costs far less for the same death benefit. Whole life insurance covers you for life as long as premiums are paid and builds cash value, but costs more. Most families protecting income and a mortgage start with term; whole life fits lifelong needs like final expenses or leaving a legacy.",
    sections: [
      {
        heading: "The core difference",
        paragraphs: [
          "Both pay a tax-advantaged death benefit to your beneficiaries. The difference is how long the coverage lasts and whether the policy builds value you can use while you are alive.",
          "Term is protection for a window of time when people depend on your income. Whole life is permanent protection with a savings-like component that grows slowly on a guaranteed basis.",
        ],
      },
      {
        heading: "Side-by-side comparison",
        table: {
          caption: "Term vs. whole life at a glance",
          headers: ["", "Term life", "Whole life"],
          rows: [
            ["How long it lasts", "A set term (10–30 years)", "Your whole life, if premiums are paid"],
            ["Relative cost", "Lowest cost per dollar of coverage", "Often many times the cost of term for the same benefit"],
            ["Cash value", "None", "Yes — grows on a guaranteed schedule"],
            ["Premiums", "Level for the term, then rise sharply", "Typically level for life"],
            ["Best fit", "Income replacement, mortgage, raising kids", "Final expenses, legacy, lifelong dependents, estate needs"],
          ],
        },
      },
      {
        heading: "When term life is usually the better fit",
        bullets: [
          "You have young children or a spouse who relies on your paycheck.",
          "You want to cover a mortgage or other debt that will be paid off in a known number of years.",
          "Your budget is limited and you need a large amount of coverage now.",
          "You are building savings and retirement accounts that will reduce your need for insurance later.",
        ],
      },
      {
        heading: "When whole (permanent) life can make sense",
        bullets: [
          "You want coverage that will still be there in your 80s or 90s, such as for final expenses.",
          "You want to leave a guaranteed inheritance or equalize an inheritance between children.",
          "You support a dependent who will need help for life, such as a child with special needs.",
          "You have maxed out other savings options and value guarantees over growth.",
        ],
      },
      {
        heading: "You don't always have to choose one",
        paragraphs: [
          "Many households combine both: a larger term policy for the years the family is most financially exposed, plus a smaller permanent policy for lifelong needs. Many term policies can also be converted to permanent coverage later without a new medical exam, within the limits the policy sets — worth checking before you buy.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is whole life insurance a good investment?",
        answer:
          "Whole life is insurance first. Its cash value grows slowly and conservatively, so it rarely competes with long-term investing on returns. It can make sense when you value guarantees and lifelong coverage, not as a replacement for retirement savings.",
      },
      {
        question: "What happens when my term policy ends?",
        answer:
          "Coverage stops and no benefit is paid unless the policy is renewed or converted. Many policies offer renewal at much higher annual rates or a conversion option to permanent coverage without new medical underwriting, within a set window.",
      },
      {
        question: "How long should my term policy be?",
        answer:
          "Match the term to how long people will depend on your income — for example, until your youngest child is independent or your mortgage is paid off. Many families choose 20 or 30 years.",
      },
    ],
    related: ["how-much-life-insurance-do-i-need", "mortgage-protection-insurance", "final-expense-insurance"],
    cta: "quote",
  },
  {
    slug: "how-much-life-insurance-do-i-need",
    category: "Life insurance",
    title: "How much life insurance do I need?",
    metaTitle: "How Much Life Insurance Do I Need? A Simple Calculation | Rare Legacy Life",
    description:
      "A step-by-step way to estimate how much life insurance your family needs, using income, debt, mortgage, education, and existing coverage.",
    author: "daniel-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 7,
    answer:
      "Add up what your family would need if your income stopped — years of income replacement, your mortgage and other debts, future education costs, and final expenses — then subtract savings and any coverage you already have. A common shortcut is 10 to 12 times your annual income, but a needs-based calculation is more accurate for your situation.",
    sections: [
      {
        heading: "Step 1: Add up what would need to be covered",
        bullets: [
          "Income replacement: your yearly take-home pay multiplied by the number of years your family would need it.",
          "Mortgage or rent: the remaining mortgage balance, or several years of rent.",
          "Other debts: car loans, credit cards, student loans, personal or business loans.",
          "Children's costs: childcare and future education goals.",
          "Final expenses: funeral, burial or cremation, and end-of-life costs.",
        ],
      },
      {
        heading: "Step 2: Subtract what's already there",
        bullets: [
          "Savings and investments your family could use.",
          "Existing life insurance, including coverage through work.",
          "Other income your family would keep, such as a spouse's salary.",
        ],
        paragraphs: [
          "Be cautious about counting work coverage. It is often only one or two times salary, and it usually ends if you leave the job.",
        ],
      },
      {
        heading: "A worked example",
        table: {
          caption: "Example needs calculation (illustration only)",
          headers: ["Item", "Amount"],
          rows: [
            ["Income replacement ($60,000 × 10 years)", "$600,000"],
            ["Mortgage balance", "$220,000"],
            ["Car loan and credit cards", "$25,000"],
            ["Education fund for two children", "$100,000"],
            ["Final expenses", "$15,000"],
            ["Total need", "$960,000"],
            ["Minus savings", "−$40,000"],
            ["Minus work coverage (1× salary)", "−$60,000"],
            ["Estimated coverage gap", "$860,000"],
          ],
        },
        paragraphs: [
          "In this example a $750,000 to $1,000,000 term policy would close most of the gap. Your numbers will differ, and an advisor can help you test different assumptions.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Only planning for funeral costs instead of the full income gap.",
          "Relying entirely on employer coverage.",
          "Forgetting a stay-at-home parent — replacing childcare and household work is expensive.",
          "Never reviewing coverage after a new child, a new home, or a raise.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is 10 times my salary enough life insurance?",
        answer:
          "It is a reasonable starting point, but it can be too little if you have a large mortgage, several young children, or college goals — and more than needed if you have significant savings and few dependents. A needs-based calculation is more reliable.",
      },
      {
        question: "Does a stay-at-home parent need life insurance?",
        answer:
          "Usually yes. If that parent died, the family might need to pay for childcare, transportation, and household help while the working parent keeps earning. Coverage helps fund those costs.",
      },
      {
        question: "Should I buy coverage for my mortgage separately?",
        answer:
          "Not necessarily. A single term policy sized to include your mortgage balance usually covers the same need and gives your family flexibility in how the money is used.",
      },
    ],
    related: ["term-vs-whole-life-insurance", "mortgage-protection-insurance", "key-person-life-insurance"],
    cta: "quote",
  },
  {
    slug: "mortgage-protection-insurance",
    category: "Life insurance",
    title: "What is mortgage protection insurance, and is it worth it?",
    metaTitle: "Mortgage Protection Insurance Explained: Is It Worth It? | Rare Legacy Life",
    description:
      "How mortgage protection life insurance works, how it differs from PMI and term life, and how to decide whether it fits your family.",
    author: "daniel-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 5,
    answer:
      "Mortgage protection insurance is life insurance designed to pay off or cover your mortgage if you die, so your family can stay in the home. It is different from PMI, which protects the lender. Many homeowners get the same protection — with more flexibility — from a term life policy sized to their mortgage balance and length.",
    sections: [
      {
        heading: "How mortgage protection works",
        paragraphs: [
          "Coverage is typically matched to your loan amount and the years left on your mortgage. Some versions pay the lender directly; others pay your beneficiaries, who decide how to use the money. Some policies also include riders for disability or critical illness.",
        ],
      },
      {
        heading: "Mortgage protection vs. PMI vs. term life",
        table: {
          caption: "Three things homeowners often confuse",
          headers: ["", "Who it protects", "What it pays"],
          rows: [
            ["PMI (private mortgage insurance)", "The lender", "Covers the lender's loss if you default — nothing to your family"],
            ["Mortgage protection life insurance", "Your family", "A benefit tied to your mortgage if you die"],
            ["Term life insurance", "Your family", "A set benefit your beneficiaries can use for the mortgage or anything else"],
          ],
        },
      },
      {
        heading: "Questions to ask before you buy",
        bullets: [
          "Does the benefit go to my family or directly to the lender?",
          "Does the coverage amount decrease as my balance goes down, or stay level?",
          "Is there a medical exam, or is it simplified issue?",
          "Would a level term policy give me more coverage for the same premium?",
        ],
      },
    ],
    faqs: [
      {
        question: "Is mortgage protection insurance required?",
        answer:
          "No. Lenders may require PMI with a small down payment, but mortgage protection life insurance is optional.",
      },
      {
        question: "Is term life better than mortgage protection?",
        answer:
          "Often, because a level term policy keeps the same benefit while your mortgage balance shrinks and lets your family use the money however they need. Mortgage protection can still be useful if health history makes traditional term harder to qualify for.",
      },
    ],
    related: ["how-much-life-insurance-do-i-need", "term-vs-whole-life-insurance", "final-expense-insurance"],
    cta: "quote",
  },
  {
    slug: "final-expense-insurance",
    category: "Life insurance",
    title: "Final expense insurance: what it covers and who it's for",
    metaTitle: "Final Expense Insurance: What It Covers & Who Needs It | Rare Legacy Life",
    description:
      "How final expense (burial) insurance works, typical coverage amounts, health questions, waiting periods, and how it compares to other options.",
    author: "daniel-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 5,
    answer:
      "Final expense insurance is a small whole life policy — often $5,000 to $50,000 — meant to pay for a funeral, burial or cremation, and other end-of-life bills so family members aren't left with them. It usually has simple health questions instead of a medical exam, level premiums, and coverage that lasts for life.",
    sections: [
      {
        heading: "What final expense insurance pays for",
        paragraphs: [
          "The benefit goes to your beneficiary, who can use it for anything — but it is designed around funeral and burial or cremation costs, outstanding medical bills, and small debts. The National Funeral Directors Association has reported a national median funeral cost in the high thousands of dollars before cemetery costs, which is why many families choose a benefit in the $10,000 to $25,000 range.",
        ],
      },
      {
        heading: "How underwriting works",
        bullets: [
          "Simplified issue: a short health questionnaire, no exam, and coverage from day one if approved.",
          "Graded or modified benefit: for more serious health histories, the full benefit may only pay after a waiting period (often two years), with a partial payout or return of premiums before then.",
          "Guaranteed issue: no health questions, but smaller benefits, higher cost per dollar, and a waiting period.",
        ],
      },
      {
        heading: "Who it fits best",
        bullets: [
          "Adults roughly 50 to 85 who want lifelong coverage for end-of-life costs.",
          "People who don't need a large income-replacement policy anymore.",
          "Those whose health makes traditional coverage harder to get.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is final expense insurance the same as burial insurance?",
        answer: "Yes. The terms are used interchangeably for small whole life policies meant to cover end-of-life costs.",
      },
      {
        question: "Can I get final expense insurance with health problems?",
        answer:
          "Often yes. Simplified-issue policies ask a few health questions, and graded or guaranteed-issue options exist for more serious conditions, usually with a waiting period before the full benefit applies.",
      },
      {
        question: "Does the funeral home get the money directly?",
        answer:
          "Not usually. The benefit is paid to your named beneficiary, who then pays the funeral home and other bills. That gives your family flexibility.",
      },
    ],
    sources: [{ label: "National Funeral Directors Association — statistics", url: "https://nfda.org/news/statistics" }],
    related: ["term-vs-whole-life-insurance", "how-much-life-insurance-do-i-need", "how-do-annuities-work"],
    cta: "quote",
  },
  {
    slug: "how-do-annuities-work",
    category: "Retirement & annuities",
    title: "How do annuities work? A plain-language guide",
    metaTitle: "How Do Annuities Work? Types, Pros, Cons & Costs | Rare Legacy Life",
    description:
      "How fixed, fixed indexed, variable, and income annuities work — including surrender charges, guarantees, liquidity limits, and who they fit.",
    author: "christian-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 8,
    answer:
      "An annuity is a contract with an insurance company: you pay a lump sum or a series of payments, and the insurer credits interest or growth and can turn the money into guaranteed income, sometimes for life. Annuities can reduce the risk of outliving your savings, but they often limit access to your money for years and may carry surrender charges and fees.",
    sections: [
      {
        heading: "The main types of annuities",
        table: {
          caption: "Common annuity types",
          headers: ["Type", "How it grows", "Market risk to principal", "Typical use"],
          rows: [
            ["Fixed (MYGA)", "A declared interest rate for a set number of years", "No", "CD-like, tax-deferred growth"],
            ["Fixed indexed", "Interest linked to a market index, subject to caps or participation rates", "No (but credited interest can be zero)", "Growth potential with principal protection"],
            ["Variable", "Invested in subaccounts", "Yes — value can go down", "Growth with market exposure (a securities product)"],
            ["Immediate / income", "Converts a lump sum into payments that start right away", "No", "Turning savings into a paycheck"],
          ],
        },
      },
      {
        heading: "What you should understand before buying",
        bullets: [
          "Surrender period: withdrawing more than the free-withdrawal amount during the first several years usually triggers a surrender charge.",
          "Liquidity: money in an annuity is meant for the long term. Keep separate emergency savings.",
          "Fees and riders: income or death-benefit riders add cost. Ask what each one costs and what it guarantees.",
          "Guarantees: they depend on the financial strength and claims-paying ability of the issuing insurer.",
          "Taxes: growth is tax-deferred, but withdrawals of earnings are taxed as ordinary income, and withdrawals before age 59½ may face an additional IRS penalty.",
          "Free-look period: most states give you a window after purchase to cancel for a refund. Ask how long yours is.",
        ],
      },
      {
        heading: "Who annuities tend to fit",
        bullets: [
          "Pre-retirees and retirees who want part of their income guaranteed regardless of markets.",
          "People worried about outliving their savings.",
          "Savers who want tax-deferred growth and won't need the money for several years.",
        ],
        paragraphs: [
          "They are usually a poor fit for money you may need soon, or when the surrender schedule outlasts your time horizon.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can you lose money in an annuity?",
        answer:
          "In a fixed or fixed indexed annuity, your principal isn't exposed to market losses, but surrender charges can reduce what you receive if you withdraw early. In a variable annuity, the account value can fall with the market.",
      },
      {
        question: "What is a surrender charge?",
        answer:
          "A fee for withdrawing more than the allowed amount during the surrender period, often several years. It typically declines each year until it reaches zero.",
      },
      {
        question: "Are annuities FDIC insured?",
        answer:
          "No. Annuity guarantees are backed by the issuing insurance company's claims-paying ability. States also have guaranty associations that provide limited protection if an insurer fails.",
      },
    ],
    sources: [
      { label: "FINRA — Annuities", url: "https://www.finra.org/investors/investing/investment-products/annuities" },
      { label: "Investor.gov — Annuities", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities" },
    ],
    related: ["retirement-income-planning-pennsylvania", "final-expense-insurance", "term-vs-whole-life-insurance"],
    cta: "retirement",
  },
  {
    slug: "retirement-income-planning-pennsylvania",
    category: "Retirement & annuities",
    title: "Retirement income planning in Pennsylvania: what to know",
    metaTitle: "Retirement Income Planning in Pennsylvania | Rare Legacy Life",
    description:
      "How Pennsylvania retirees can organize Social Security, pensions, savings, and annuities into a reliable income plan — including PA tax basics.",
    author: "christian-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 7,
    answer:
      "A retirement income plan lines up your income sources — Social Security, pensions, savings, and any annuities — against your expenses year by year, then decides what to draw first and how to protect against market drops and living longer than expected. Pennsylvania generally doesn't tax Social Security or most retirement income for residents of retirement age, which can change which accounts you use first.",
    sections: [
      {
        heading: "Step 1: Map your income sources",
        bullets: [
          "Social Security: when you claim (as early as 62, up to 70) changes your monthly benefit for life.",
          "Pensions: lump sum vs. monthly payments, and survivor options for a spouse.",
          "Retirement accounts: 401(k), 403(b), 457, and IRAs, including required minimum distributions later in life.",
          "Other sources: part-time work, rental income, annuities.",
        ],
      },
      {
        heading: "Step 2: Match income to spending",
        paragraphs: [
          "Separate essential expenses (housing, food, healthcare, insurance) from flexible ones (travel, gifts). A common approach is to cover essentials with reliable income — Social Security, pensions, and guaranteed annuity income — and fund flexible spending from investments.",
        ],
      },
      {
        heading: "Step 3: Plan for the big risks",
        bullets: [
          "Longevity: savings may need to last 25 to 30 years or more.",
          "Sequence of returns: a market drop early in retirement can do outsized damage if you're withdrawing at the same time.",
          "Inflation: rising costs erode fixed income over time.",
          "Healthcare and long-term care costs.",
        ],
      },
      {
        heading: "Pennsylvania tax basics for retirees",
        paragraphs: [
          "For Pennsylvania personal income tax, Social Security benefits are not taxable, and qualifying pension and retirement plan distributions received after retirement age are generally not taxable either. Federal income tax still applies, and the rules have conditions, so confirm your situation with a tax professional or the Pennsylvania Department of Revenue. We provide education, not tax advice.",
        ],
      },
      {
        heading: "Where a Retirement Income Blueprint fits",
        paragraphs: [
          "Our complimentary review organizes these pieces into one picture: your income sources, timing choices, market-risk exposure, liquidity needs, and family or legacy goals — including whether an annuity belongs in the plan at all. There's no obligation to buy anything.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Pennsylvania tax retirement income?",
        answer:
          "Pennsylvania generally does not tax Social Security benefits or qualifying retirement income such as pensions and eligible retirement plan distributions received after retirement age. Federal taxes still apply. Check the PA Department of Revenue or a tax professional for your specific situation.",
      },
      {
        question: "When should I take Social Security?",
        answer:
          "It depends on your health, other income, and whether you're married. Claiming at 62 gives a permanently smaller check; waiting until 70 gives the largest. Coordinating the decision with a spouse matters.",
      },
      {
        question: "Do I need an annuity in retirement?",
        answer:
          "Not always. An annuity can make sense if your guaranteed income doesn't cover essential expenses and you want protection against outliving savings. It's one tool, not a requirement.",
      },
    ],
    sources: [
      { label: "Pennsylvania Department of Revenue — Personal income tax", url: "https://www.pa.gov/agencies/revenue" },
      { label: "Social Security Administration — Retirement benefits", url: "https://www.ssa.gov/retirement" },
    ],
    related: ["how-do-annuities-work", "life-insurance-montgomery-county-pa", "how-much-life-insurance-do-i-need"],
    cta: "retirement",
  },
  {
    slug: "key-person-life-insurance",
    category: "Business owners",
    title: "Key person and buy-sell life insurance for business owners",
    metaTitle: "Key Person & Buy-Sell Life Insurance for Business Owners | Rare Legacy Life",
    description:
      "How small businesses use key person and buy-sell life insurance to protect revenue, loans, partners, and family if an owner or key employee dies.",
    author: "daniel-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 6,
    answer:
      "Key person insurance is a policy the business owns on someone whose death would hurt revenue or operations; the payout helps the company cover lost income, debts, or hiring a replacement. Buy-sell insurance funds an agreement that lets surviving owners buy a deceased owner's share, so the business continues and the owner's family is paid fairly.",
    sections: [
      {
        heading: "Key person insurance",
        bullets: [
          "The business is the owner, payer, and beneficiary.",
          "Coverage is often sized to the revenue or profit at risk, loans the person guarantees, and the cost of finding a replacement.",
          "Common for founders, top salespeople, and anyone whose relationships or skills drive the business.",
        ],
      },
      {
        heading: "Buy-sell agreements funded with life insurance",
        table: {
          caption: "Two common structures",
          headers: ["Structure", "Who owns the policies", "Best for"],
          rows: [
            ["Cross-purchase", "Each owner owns a policy on the other owners", "Businesses with a small number of owners"],
            ["Entity redemption", "The business owns a policy on each owner", "Businesses with several owners"],
          ],
        },
        paragraphs: [
          "Your attorney drafts the agreement and your CPA advises on tax treatment; insurance funds it so cash is available when it's needed.",
        ],
      },
      {
        heading: "Other ways owners use life insurance",
        bullets: [
          "Covering business loans that you personally guarantee.",
          "Providing your family with liquidity while the business is sold or wound down.",
          "Executive benefit and retention plans for key employees.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are key person insurance premiums tax deductible?",
        answer:
          "Generally no when the business is the beneficiary, and the death benefit is generally received income-tax-free if notice-and-consent rules are met. Confirm with your CPA.",
      },
      {
        question: "How much key person insurance does a business need?",
        answer:
          "A common approach is to estimate the profit that would be lost while replacing the person, plus outstanding debts they guarantee and recruiting costs.",
      },
    ],
    related: ["how-much-life-insurance-do-i-need", "term-vs-whole-life-insurance", "life-insurance-montgomery-county-pa"],
    cta: "quote",
  },
  {
    slug: "life-insurance-montgomery-county-pa",
    category: "Local",
    title: "Life insurance and retirement guidance in Montgomery County, PA",
    metaTitle: "Life Insurance Agents in Montgomery County, PA (East Norriton) | Rare Legacy Life",
    description:
      "Meet with a licensed life insurance and annuity advisor in East Norriton, PA — at our office, at your home, by phone, or virtually.",
    author: "christian-pennachietti",
    published: "2026-10-01",
    updated: "2026-10-01",
    readMinutes: 4,
    answer:
      "Rare Legacy Life Group is a licensed life insurance and annuity agency at 59 W. Germantown Pike in East Norriton, serving Norristown, King of Prussia, Blue Bell, Plymouth Meeting, Lansdale, and the rest of Montgomery County. You can meet at our office, at your home, by phone, or by video — and we also help clients in 49 states remotely.",
    sections: [
      {
        heading: "What we help Montgomery County families with",
        bullets: [
          "Term and permanent life insurance to protect income and the family home.",
          "Mortgage protection and final expense coverage.",
          "Retirement Income Blueprint reviews for pre-retirees and retirees.",
          "Annuity education, including surrender periods, costs, and guarantees.",
          "Key person and buy-sell coverage for local business owners.",
        ],
      },
      {
        heading: "How meetings work",
        table: {
          caption: "Ways to meet with an advisor",
          headers: ["Option", "Details"],
          rows: [
            ["Our office", "59 W. Germantown Pike, East Norriton, PA 19403"],
            ["Your home", "We can meet at your home or another convenient local spot"],
            ["Phone", "Call (484) 430-4363 or request a call at a time you choose"],
            ["Video", "Secure virtual meetings from anywhere"],
          ],
        },
      },
      {
        heading: "Why work with a local advisor",
        paragraphs: [
          "A local advisor can sit down with you face to face, explain options in plain language, and stay available when you need to update beneficiaries, review coverage after a life change, or help your family with a claim.",
        ],
      },
    ],
    faqs: [
      {
        question: "Where is Rare Legacy Life Group located?",
        answer: "59 W. Germantown Pike, East Norriton, PA 19403. Call (484) 430-4363 to schedule.",
      },
      {
        question: "Do you only work with Pennsylvania residents?",
        answer:
          "No. We meet locally across Montgomery County and work with clients remotely in 49 states, excluding California, subject to licensing and product availability.",
      },
      {
        question: "Is the consultation free?",
        answer: "Yes. Quote reviews and Retirement Income Blueprint consultations are complimentary, with no obligation to buy.",
      },
    ],
    related: ["retirement-income-planning-pennsylvania", "term-vs-whole-life-insurance", "how-much-life-insurance-do-i-need"],
    cta: "quote",
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug);
}
