import type { Guide } from "@/content/guides";

/**
 * The annuity library (Chris, 2026-11-24: "What about all retire wizards informational pages. we should build out a ton of sub
 * pages"). The first batch: four product guides and eight of the questions people ask before they buy. Written from scratch for
 * Rare Legacy under the rules at the top of src/content/guides.ts: one question a guide, a short answer that stands on its own, a
 * named licensed author, and no carrier names, rates or guarantees. Each ends on the quiz (cta "quiz").
 * NOT YET REVIEWED: the advisors and compliance should read these before they go live, tax passages above all.
 * To add a guide, add an entry here; the page, the sitemap and the guides index pick it up. Add its line to public/llms.txt too.
 */

const FINRA = { label: "FINRA: Annuities", url: "https://www.finra.org/investors/investing/investment-products/annuities" };
const INVESTOR_GOV = {
  label: "Investor.gov: Annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities",
};
const IRS_410 = { label: "IRS Topic No. 410: Pensions and annuities", url: "https://www.irs.gov/taxtopics/tc410" };
const IRS_575 = { label: "IRS Publication 575: Pension and Annuity Income", url: "https://www.irs.gov/publications/p575" };
const IRS_ROLLOVERS = {
  label: "IRS: Rollovers of retirement plan and IRA distributions",
  url: "https://www.irs.gov/retirement-plans/plan-participant-employee/rollovers-of-retirement-plan-and-ira-distributions",
};
const FDIC = { label: "FDIC: Deposit insurance", url: "https://www.fdic.gov/resources/deposit-insurance" };

const base = {
  category: "Retirement & annuities",
  author: "christian-pennachietti",
  published: "2026-11-24",
  updated: "2026-11-24",
  cta: "quiz",
} as const;

export const ANNUITY_GUIDES: Guide[] = [
  {
    ...base,
    slug: "fixed-indexed-annuity",
    title: "What is a fixed indexed annuity, and how does it work?",
    metaTitle: "Fixed Indexed Annuity: How It Works, Pros & Cons | Rare Legacy Life",
    description:
      "How a fixed indexed annuity credits interest, what caps and participation rates mean, what the floor protects, and the tradeoffs to weigh first.",
    readMinutes: 7,
    answer:
      "A fixed indexed annuity is an insurance contract that credits interest based partly on how a market index performs. When the index rises, you earn interest up to a limit such as a cap or participation rate. When it falls, a floor keeps the market from reducing your value. The cost of that protection is limited upside and a multi-year commitment.",
    sections: [
      {
        heading: "How the interest is worked out",
        paragraphs: [
          "Your money is not invested in the index. The insurer measures the index over a period, usually a year, and uses the change to decide how much interest to credit. Three limits decide how much of a gain you keep.",
        ],
        table: {
          caption: "The limits on indexed interest",
          headers: ["Limit", "What it does", "Example"],
          rows: [
            ["Cap", "Sets the most interest you can earn in a period", "Index up 12%, cap 8%: you are credited 8%"],
            ["Participation rate", "Credits a share of the index's gain", "Index up 10%, 60% participation: you are credited 6%"],
            ["Spread", "Subtracts a set amount from the gain", "Index up 9%, 2% spread: you are credited 7%"],
          ],
        },
      },
      {
        heading: "What the floor does and does not protect",
        bullets: [
          "If the index is down for the period, you are typically credited zero for that period, not a loss.",
          "Interest already credited is locked in and is not taken back by a later down year.",
          "The floor does not protect against surrender charges if you withdraw early, or against rider fees, which can reduce your value in a flat year.",
          "Index returns used by the contract usually leave out dividends.",
        ],
      },
      {
        heading: "The tradeoffs",
        bullets: [
          "Your money is committed for the surrender period, often several years or more.",
          "Caps, participation rates and spreads can be reset by the insurer at renewal, within limits the contract states.",
          "In a strong market you will earn less than someone invested directly in it.",
          "Optional income or death-benefit riders add a yearly charge. Ask what each costs and what it guarantees.",
        ],
      },
      {
        heading: "Who it tends to fit",
        paragraphs: [
          "It tends to fit people within about ten years of retirement, or already retired, who want part of their savings shielded from market drops and will not need that part for several years. It is a poor fit for money you may need soon or for someone seeking full market returns.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a fixed indexed annuity lose money?",
        answer:
          "A falling market does not reduce your value. Your value can still go down from surrender charges on early withdrawals, from rider fees, and from withdrawals themselves.",
      },
      {
        question: "Is a fixed indexed annuity a security?",
        answer:
          "It is generally sold as an insurance product, not a security, and is regulated by state insurance departments. A variable annuity, by contrast, is a security.",
      },
      {
        question: "What is a bonus on an indexed annuity?",
        answer:
          "Some contracts add a percentage to your premium up front. A bonus usually comes with a longer surrender period or lower caps, and it may vest over time, so leaving early can forfeit part of it.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["myga-vs-fixed-indexed-annuity", "annuity-surrender-charges", "can-you-lose-money-in-an-annuity"],
  },
  {
    ...base,
    slug: "myga-fixed-annuity",
    title: "What is a MYGA? Fixed multi-year guaranteed annuities explained",
    metaTitle: "MYGA Explained: How a Fixed Multi-Year Annuity Works | Rare Legacy Life",
    description:
      "How a multi-year guaranteed annuity (MYGA) works: the guaranteed rate, the term, taxes, withdrawals, and what happens when the term ends.",
    readMinutes: 6,
    answer:
      "A multi-year guaranteed annuity, or MYGA, is an insurance contract that pays a fixed interest rate for a set number of years, commonly three to ten. It works much like a CD from an insurance company: the rate does not change during the term and interest grows tax-deferred. Withdrawing more than the contract allows before the term ends usually brings a surrender charge.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "You pay a single premium and choose a guarantee period.",
          "The insurer credits the same declared rate every year of that period.",
          "Interest compounds and is not taxed until you take it out.",
          "At the end of the term you can usually renew, move to another annuity, or take the money, within a short window.",
        ],
      },
      {
        heading: "Getting to your money during the term",
        paragraphs: [
          "Many MYGAs let you withdraw the interest earned or a set percentage each year without a charge, but not all do, and the more generous the access, the lower the rate tends to be. Withdrawals above the free amount bring a surrender charge and, in many contracts, a market value adjustment that can raise or lower what you receive depending on how interest rates have moved.",
        ],
      },
      {
        heading: "What to compare",
        bullets: [
          "The guaranteed rate and the length of the term.",
          "The insurer's financial strength ratings.",
          "Free-withdrawal terms and the surrender schedule.",
          "What happens at the end of the term, and how long the window is to act.",
          "Whether the rate differs by amount or by state.",
        ],
      },
      {
        heading: "Who it tends to fit",
        paragraphs: [
          "A MYGA tends to fit savers who want a known rate, do not need the money for the term, and would benefit from deferring tax on the interest. It is often compared with CDs by people whose CDs are maturing.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a MYGA the same as a CD?",
        answer:
          "No. Both pay a fixed rate for a term, but a CD is a bank deposit covered by FDIC insurance, while a MYGA is an insurance contract backed by the insurer. MYGA interest is tax-deferred; CD interest is taxed each year.",
      },
      {
        question: "What happens when a MYGA matures?",
        answer:
          "You typically get a window, often about 30 days, to withdraw, renew at the then-current rate, or exchange into another annuity. If you do nothing, many contracts renew automatically, sometimes with a new surrender period.",
      },
      {
        question: "Can I add money to a MYGA later?",
        answer: "Usually not. Most are single-premium contracts, so new money goes into a new contract.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["annuity-vs-cd", "myga-vs-fixed-indexed-annuity", "how-annuities-are-taxed"],
  },
  {
    ...base,
    slug: "income-annuity",
    title: "Income annuities: how to turn savings into a paycheck for life",
    metaTitle: "Income Annuities: Immediate vs. Deferred, Payout Options | Rare Legacy Life",
    description:
      "How immediate and deferred income annuities work, the payout options (life, joint, period certain, refund), and what you give up for guaranteed income.",
    readMinutes: 7,
    answer:
      "An income annuity converts a lump sum into guaranteed payments from an insurance company, for a set period or for as long as you live. An immediate annuity starts paying within a year; a deferred income annuity starts later and pays more for the wait. In exchange for income you cannot outlive, you generally give up access to the lump sum.",
    sections: [
      {
        heading: "Immediate or deferred",
        table: {
          caption: "Immediate and deferred income annuities",
          headers: ["Type", "When income starts", "Typical use"],
          rows: [
            ["Immediate (SPIA)", "Within 12 months of purchase", "Someone retiring now who wants a paycheck to cover fixed bills"],
            ["Deferred income (DIA)", "On a later date you choose, often years away", "Securing income for later in retirement at a higher payout"],
          ],
        },
      },
      {
        heading: "Payout options",
        bullets: [
          "Life only: the highest payment, and it stops when you die.",
          "Life with period certain: pays for life, and for at least a set number of years to a beneficiary if you die early.",
          "Joint and survivor: pays as long as either of two people is alive, at a lower amount.",
          "Cash or installment refund: if you die before receiving what you paid in, the difference goes to your beneficiary.",
          "Period certain only: pays for a fixed number of years, then ends.",
        ],
      },
      {
        heading: "What you give up",
        bullets: [
          "Liquidity: once payments begin, the decision usually cannot be reversed and the lump sum is no longer yours to withdraw.",
          "Inflation: a level payment buys less over time unless you choose an increasing-payment option, which starts lower.",
          "Legacy: with life-only income, nothing passes to heirs. Refund and period-certain options trade some income for that.",
        ],
      },
      {
        heading: "How it fits with Social Security and a pension",
        paragraphs: [
          "A common approach is to add up essential monthly expenses, subtract Social Security and any pension, and consider covering the gap with guaranteed income. The rest of your savings stays invested and available. Few people should put everything into an income annuity.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I outlive an income annuity?",
        answer:
          "Not if you choose a lifetime payout. Payments continue for as long as you live, however long that is. A period-certain-only payout does end.",
      },
      {
        question: "What happens to the money if I die early?",
        answer:
          "It depends on the option you chose. Life only ends with you. Period certain, refund and joint options continue payments or return the unpaid balance to a beneficiary.",
      },
      {
        question: "Is an income annuity the same as an income rider?",
        answer:
          "No. An income rider is an optional feature on a deferred annuity that guarantees lifetime withdrawals while you keep an account value. An income annuity exchanges the lump sum for the payments.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, IRS_575],
    related: ["how-much-does-an-annuity-pay", "what-happens-to-an-annuity-when-you-die", "how-annuities-are-taxed"],
  },
  {
    ...base,
    slug: "401k-rollover-to-annuity",
    title: "Can you roll a 401(k) into an annuity without paying taxes?",
    metaTitle: "401(k) Rollover to an Annuity: Rules, Taxes & Steps | Rare Legacy Life",
    description:
      "How a 401(k) or IRA can move into an annuity with no tax due, the difference between a direct and indirect rollover, and what to check before you move.",
    readMinutes: 6,
    answer:
      "Yes. Moving a 401(k) into an annuity held as an IRA is not taxable when it is done as a direct rollover, where the money goes straight from the plan to the insurance company. The money stays tax-deferred and is taxed as ordinary income only when you withdraw it. Taking a check yourself triggers withholding and a 60-day deadline.",
    sections: [
      {
        heading: "Direct and indirect rollovers",
        table: {
          caption: "Direct and indirect rollovers",
          headers: ["", "Direct rollover", "Indirect rollover"],
          rows: [
            ["Who receives the money", "The new account's custodian or insurer", "You"],
            ["Withholding", "None", "The plan generally withholds 20% for federal tax"],
            ["Deadline", "None to track", "60 days to deposit the full amount, including what was withheld"],
            ["Risk", "Low", "Missing the deadline makes it a taxable distribution"],
          ],
        },
      },
      {
        heading: "When you are allowed to move it",
        bullets: [
          "After leaving the employer, you can generally roll the balance over at any time.",
          "While still employed, many plans allow an in-service rollover once you reach age 59½. Your plan's rules decide.",
          "An existing IRA can be transferred to an IRA annuity at any time.",
        ],
      },
      {
        heading: "What to check before moving",
        bullets: [
          "Fees and investment options in your current plan compared with the annuity's terms.",
          "The annuity's surrender period: rolled-over money is committed for that long.",
          "Required minimum distributions still apply to money in an IRA annuity.",
          "Employer stock in the plan and outstanding plan loans have their own tax rules. Ask a tax professional first.",
          "You do not have to move all of it. Many people roll over part and leave the rest invested.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a penalty for rolling a 401(k) into an annuity?",
        answer:
          "A direct rollover has no tax and no IRS penalty. The annuity itself may have surrender charges if you withdraw early, and withdrawals before age 59½ can carry an additional 10% federal tax.",
      },
      {
        question: "How long does a rollover take?",
        answer:
          "Often two to four weeks, depending on how quickly the plan administrator processes the request and whether it sends funds electronically or by check.",
      },
      {
        question: "Can I roll over a Roth 401(k)?",
        answer:
          "Yes, into a Roth IRA, which can hold an annuity. The Roth rules on qualified withdrawals continue to apply.",
      },
    ],
    sources: [IRS_ROLLOVERS, FINRA],
    related: ["how-annuities-are-taxed", "fixed-indexed-annuity", "annuity-surrender-charges"],
  },
  {
    ...base,
    slug: "annuity-vs-cd",
    title: "Annuity vs. CD: which is better for money you want kept safe?",
    metaTitle: "Annuity vs. CD: Rates, Taxes, Safety & Access Compared | Rare Legacy Life",
    description:
      "A side-by-side comparison of fixed annuities and bank CDs: who backs them, how interest is taxed, access to your money, and when each fits.",
    readMinutes: 5,
    answer:
      "A CD and a fixed annuity both pay a set rate for a set term. A CD is a bank deposit with FDIC insurance, short terms and interest taxed every year. A fixed annuity is an insurance contract backed by the insurer, usually with longer terms, tax-deferred interest and surrender charges for early withdrawal. CDs suit short-term money; fixed annuities suit longer-term savings.",
    sections: [
      {
        heading: "Side by side",
        table: {
          caption: "Fixed annuity compared with a bank CD",
          headers: ["", "Bank CD", "Fixed annuity (MYGA)"],
          rows: [
            ["Issued by", "A bank or credit union", "An insurance company"],
            ["Backed by", "FDIC or NCUA insurance, within limits", "The insurer's claims-paying ability"],
            ["Typical terms", "Months to five years", "Three to ten years"],
            ["Tax on interest", "Taxed each year as earned", "Deferred until withdrawn"],
            ["Early withdrawal", "Loss of some interest", "Surrender charge, possibly a market value adjustment"],
            ["Before age 59½", "No extra federal tax", "Earnings withdrawn may face an additional 10% federal tax"],
          ],
        },
      },
      {
        heading: "When a CD is the better tool",
        bullets: [
          "The money may be needed within a few years.",
          "You want federal deposit insurance.",
          "You are under 59½ and may need the interest.",
        ],
      },
      {
        heading: "When a fixed annuity is worth a look",
        bullets: [
          "The money is for retirement and can stay put for the full term.",
          "Deferring tax on the interest matters to you, for example while you are still working.",
          "You may later want to turn the balance into guaranteed income.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are annuities FDIC insured?",
        answer:
          "No. An annuity is not a bank deposit. Its guarantees are backed by the insurance company that issues it, which is why the insurer's financial strength matters.",
      },
      {
        question: "Can I move a maturing CD into an annuity?",
        answer:
          "Yes. Once the CD matures you can use the proceeds to buy an annuity. If the CD is inside an IRA, it should move as a direct transfer so it stays tax-deferred.",
      },
    ],
    sources: [FDIC, FINRA],
    related: ["myga-fixed-annuity", "annuity-surrender-charges", "are-annuities-safe"],
  },
  {
    ...base,
    slug: "myga-vs-fixed-indexed-annuity",
    title: "MYGA vs. fixed indexed annuity: which one fits you?",
    metaTitle: "MYGA vs. Fixed Indexed Annuity: Key Differences | Rare Legacy Life",
    description:
      "The difference between a MYGA and a fixed indexed annuity: a known rate versus index-linked interest, typical terms, and how to choose between them.",
    readMinutes: 5,
    answer:
      "A MYGA pays one guaranteed rate for the whole term, so you know the outcome on day one. A fixed indexed annuity credits interest tied to a market index, with a floor against losses and limits on gains, so a year can pay more than a fixed rate or nothing. Choose a MYGA for certainty and an indexed annuity for more potential.",
    sections: [
      {
        heading: "The differences that matter",
        table: {
          caption: "MYGA compared with a fixed indexed annuity",
          headers: ["", "MYGA", "Fixed indexed annuity"],
          rows: [
            ["Interest", "A fixed, declared rate", "Linked to an index, within caps or participation rates"],
            ["Result in a down market", "The same fixed rate", "Typically zero for that period"],
            ["Result in a strong market", "The same fixed rate", "More, up to the contract's limits"],
            ["Typical term", "Three to ten years", "Often seven to ten years or more"],
            ["Complexity", "Simple", "More moving parts to understand"],
            ["Income riders", "Rare", "Commonly available, usually for a fee"],
          ],
        },
      },
      {
        heading: "How to choose",
        bullets: [
          "If you want to know exactly what you will have at the end, lean MYGA.",
          "If you can accept a zero year for the chance of better ones, and have a longer horizon, consider an indexed annuity.",
          "If lifetime income is the goal, compare an indexed annuity's income rider with an income annuity.",
          "Splitting money between the two is common.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which pays more, a MYGA or a fixed indexed annuity?",
        answer:
          "Neither reliably. A MYGA's return is known in advance. An indexed annuity's depends on the index and the contract's limits, so it can end up above or below a fixed rate over the same years.",
      },
      {
        question: "Are both protected from market losses?",
        answer:
          "Yes. Neither is invested directly in the market, and a market decline does not reduce the value of either. Surrender charges and fees still can.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["myga-fixed-annuity", "fixed-indexed-annuity", "annuity-vs-cd"],
  },
  {
    ...base,
    slug: "annuity-surrender-charges",
    title: "Annuity surrender charges: what they are and how to avoid them",
    metaTitle: "Annuity Surrender Charges Explained (and How to Avoid Them) | Rare Legacy Life",
    description:
      "How annuity surrender charges and surrender periods work, what a market value adjustment is, the usual free-withdrawal allowance, and common waivers.",
    readMinutes: 5,
    answer:
      "A surrender charge is a fee an insurer applies when you withdraw more than the contract allows during the surrender period, which usually lasts several years. The charge is a percentage of the excess withdrawal and typically steps down each year until it reaches zero. Most contracts let you take a limited amount each year without any charge.",
    sections: [
      {
        heading: "How the schedule works",
        paragraphs: [
          "Every contract prints its schedule. As an illustration only, a seven-year schedule might start at 7% of the amount withdrawn above the free allowance and fall by a point each year. After the last year, the money can be withdrawn or moved without a charge.",
        ],
      },
      {
        heading: "Ways to take money without a charge",
        bullets: [
          "Free-withdrawal allowance: many contracts allow about 10% of the value each year, or the interest earned.",
          "Required minimum distributions on IRA annuities are commonly allowed without a charge.",
          "Waivers: many contracts waive charges for nursing-home confinement or terminal illness, subject to conditions.",
          "Death: most contracts pay the beneficiary without surrender charges.",
          "Waiting: once the surrender period ends, so do the charges.",
        ],
      },
      {
        heading: "Market value adjustments",
        paragraphs: [
          "Some fixed annuities also apply a market value adjustment to withdrawals above the free amount. If interest rates have risen since you bought, the adjustment reduces what you receive; if they have fallen, it can increase it. It applies only during the surrender period.",
        ],
      },
      {
        heading: "Before you buy",
        bullets: [
          "Match the surrender period to how long you can leave the money alone.",
          "Keep emergency savings outside the annuity.",
          "Ask for the surrender schedule and free-withdrawal terms in writing.",
          "Remember the free-look period: after delivery you have a set number of days to cancel for a refund.",
        ],
      },
    ],
    faqs: [
      {
        question: "How long do surrender periods last?",
        answer:
          "It varies by contract, commonly from three to ten years. Contracts with bonuses or richer features often have longer periods.",
      },
      {
        question: "Are surrender charges the same as the IRS penalty?",
        answer:
          "No. A surrender charge is the insurer's contract fee. Separately, the IRS applies an additional 10% tax to taxable withdrawals before age 59½ in most cases. Both can apply to the same withdrawal.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["can-you-lose-money-in-an-annuity", "myga-fixed-annuity", "fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "how-annuities-are-taxed",
    title: "How are annuities taxed?",
    metaTitle: "How Annuities Are Taxed: Qualified vs. Non-Qualified | Rare Legacy Life",
    description:
      "How withdrawals and income payments from annuities are taxed, the difference between qualified and non-qualified money, and the rules before age 59½.",
    readMinutes: 6,
    answer:
      "Annuity growth is tax-deferred, and tax is due when money comes out. With an annuity bought with pre-tax retirement money, such as an IRA rollover, withdrawals are generally fully taxable. With one bought with after-tax money, only the earnings are taxed, and they are treated as coming out first. Taxable amounts are ordinary income, not capital gains.",
    sections: [
      {
        heading: "Qualified and non-qualified",
        table: {
          caption: "How qualified and non-qualified annuities are taxed",
          headers: ["", "Qualified (IRA, 401(k) rollover)", "Non-qualified (after-tax money)"],
          rows: [
            ["Money going in", "Pre-tax", "Already taxed"],
            ["Withdrawals", "Generally fully taxable", "Earnings taxable; your original premium is not"],
            ["Order of withdrawals", "Not applicable", "Earnings come out first"],
            ["Required minimum distributions", "Yes", "No, during the owner's life"],
          ],
        },
      },
      {
        heading: "Income payments",
        paragraphs: [
          "When a non-qualified annuity is converted to a stream of income payments, each payment is split: part is a tax-free return of what you paid in and part is taxable earnings. The split is fixed by a formula called the exclusion ratio. Once you have recovered everything you paid in, later payments are fully taxable.",
        ],
      },
      {
        heading: "Other rules worth knowing",
        bullets: [
          "Before age 59½, the taxable part of a withdrawal is generally subject to an additional 10% federal tax, with some exceptions.",
          "A 1035 exchange lets you move from one annuity to another without triggering tax.",
          "Beneficiaries owe income tax on gains they inherit; annuities do not get a step-up in basis at death.",
          "States tax annuity income differently. Pennsylvania, for example, has its own rules on retirement income.",
        ],
        paragraphs: [
          "Tax rules change and depend on your situation. Confirm how they apply to you with a tax professional before acting.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I pay taxes on an annuity every year?",
        answer:
          "Not on the growth. You report income only in years when you take a withdrawal or receive payments. The insurer sends Form 1099-R for those years.",
      },
      {
        question: "Is annuity income taxed as capital gains?",
        answer: "No. The taxable portion is taxed as ordinary income at your regular rate.",
      },
      {
        question: "Is a Roth IRA annuity taxed?",
        answer:
          "Qualified withdrawals from a Roth IRA are tax-free, including when the Roth IRA holds an annuity, provided the Roth holding-period and age rules are met.",
      },
    ],
    sources: [IRS_410, IRS_575],
    related: ["401k-rollover-to-annuity", "what-happens-to-an-annuity-when-you-die", "income-annuity"],
  },
  {
    ...base,
    slug: "can-you-lose-money-in-an-annuity",
    title: "Can you lose money in an annuity?",
    metaTitle: "Can You Lose Money in an Annuity? What to Know | Rare Legacy Life",
    description:
      "Which annuities can lose value and which cannot, and the four ways people actually come out behind: surrender charges, fees, inflation and insurer risk.",
    readMinutes: 5,
    answer:
      "It depends on the type. In a fixed or fixed indexed annuity, a falling market does not reduce your value. In a variable annuity it can, because the money is invested in the market. With any annuity you can still come out behind through surrender charges on early withdrawals, ongoing fees, inflation, or, rarely, the failure of the insurer.",
    sections: [
      {
        heading: "Market risk by type",
        table: {
          caption: "Market risk by annuity type",
          headers: ["Type", "Can the market reduce your value?"],
          rows: [
            ["Fixed (MYGA)", "No"],
            ["Fixed indexed", "No, though a period can credit zero interest"],
            ["Variable", "Yes"],
            ["Income annuity", "No; payments are set by the contract"],
          ],
        },
      },
      {
        heading: "The other ways to come out behind",
        bullets: [
          "Surrender charges: withdrawing too much too early can cost more than the interest you earned.",
          "Fees: rider charges are deducted whether or not interest is credited that year.",
          "Inflation: a fixed payment or rate buys less over time.",
          "Dying early with a life-only income annuity: payments stop, and less may have been paid out than you put in.",
          "Insurer failure: guarantees depend on the insurer's ability to pay claims. It is rare, and it is the reason to check financial strength ratings.",
        ],
      },
      {
        heading: "How to lower the risk",
        bullets: [
          "Only commit money you will not need during the surrender period.",
          "Compare insurers' financial strength ratings.",
          "Ask for every fee and what it buys.",
          "Read the contract during the free-look period.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is my principal guaranteed in a fixed annuity?",
        answer:
          "The insurer guarantees it under the contract, subject to its claims-paying ability, as long as you stay within the contract's withdrawal terms.",
      },
      {
        question: "What happens if I need the money early?",
        answer:
          "You can usually take the free-withdrawal amount each year without a charge. Beyond that, surrender charges and possibly a market value adjustment apply until the surrender period ends.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["annuity-surrender-charges", "are-annuities-safe", "fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "what-happens-to-an-annuity-when-you-die",
    title: "What happens to an annuity when you die?",
    metaTitle: "What Happens to an Annuity When You Die? Beneficiary Rules | Rare Legacy Life",
    description:
      "What beneficiaries receive from an annuity, how a spouse's options differ, how inherited annuities are taxed, and when payments simply stop.",
    readMinutes: 5,
    answer:
      "It depends on whether income payments have started and which options were chosen. Before payments start, the beneficiary generally receives the contract's value or its death benefit. After payments start, a life-only payout ends at death, while joint, period-certain and refund options keep paying or return the balance. A named beneficiary usually receives the money without probate.",
    sections: [
      {
        heading: "Before income payments begin",
        bullets: [
          "The named beneficiary receives the account value or a guaranteed death benefit, whichever the contract provides.",
          "Surrender charges are typically waived at death.",
          "A surviving spouse can usually continue the contract in their own name.",
          "Other beneficiaries generally must take the money within set time limits, as a lump sum or spread over time.",
        ],
      },
      {
        heading: "After income payments begin",
        table: {
          caption: "What continues after death, by payout option",
          headers: ["Payout option", "What happens at death"],
          rows: [
            ["Life only", "Payments stop"],
            ["Joint and survivor", "Payments continue to the surviving annuitant"],
            ["Life with period certain", "Payments continue to the beneficiary for the rest of the guaranteed period"],
            ["Cash or installment refund", "The unpaid balance of the premium goes to the beneficiary"],
          ],
        },
      },
      {
        heading: "Taxes for beneficiaries",
        bullets: [
          "Gains in an inherited annuity are taxed as ordinary income to the beneficiary when received.",
          "Annuities do not receive a step-up in basis at death.",
          "Inherited IRA annuities follow the IRA distribution rules, which for most non-spouse beneficiaries require the account to be emptied within ten years.",
          "Spreading payments out, where allowed, can spread the tax.",
        ],
        paragraphs: ["Beneficiaries should speak with a tax professional before choosing how to take the money."],
      },
      {
        heading: "Keep beneficiaries current",
        paragraphs: [
          "The beneficiary form controls who is paid, ahead of a will. Review it after a marriage, divorce, birth or death, and name a contingent beneficiary.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does an annuity go through probate?",
        answer:
          "Generally not when a living beneficiary is named. If no beneficiary is named, or the estate is the beneficiary, the proceeds can become part of the probate estate.",
      },
      {
        question: "Does the insurance company keep my money if I die?",
        answer:
          "Only in the specific case of a life-only income payout, where you chose the highest payment in exchange for payments ending at death. Deferred annuities and payouts with refund or period-certain features pay beneficiaries.",
      },
    ],
    sources: [IRS_575, FINRA],
    related: ["income-annuity", "how-annuities-are-taxed", "can-you-lose-money-in-an-annuity"],
  },
  {
    ...base,
    slug: "are-annuities-safe",
    title: "Are annuities safe? What actually backs the guarantee",
    metaTitle: "Are Annuities Safe? What Backs an Annuity Guarantee | Rare Legacy Life",
    description:
      "What stands behind an annuity's guarantees, how to read insurer financial strength ratings, how insurers are regulated, and the warning signs to watch for.",
    readMinutes: 5,
    answer:
      "Fixed annuities are considered among the more conservative places for retirement money, but their safety rests on the insurance company, not the government. Guarantees are backed by the insurer's assets and claims-paying ability, and insurers are regulated by the states and must hold reserves. The practical steps are to choose a financially strong insurer and understand the contract.",
    sections: [
      {
        heading: "What backs the guarantee",
        bullets: [
          "The insurer's general account: the bonds and other assets it holds to pay its obligations.",
          "State regulation: insurers must hold reserves and capital, file financial statements and submit to examinations.",
          "State guaranty associations exist in every state and provide limited protection if an insurer fails. Limits vary by state, and they are a backstop, not a reason to choose a weaker insurer.",
        ],
      },
      {
        heading: "Reading financial strength ratings",
        paragraphs: [
          "Independent agencies such as AM Best, S&P, Moody's and Fitch grade insurers on their ability to pay claims. Each uses its own scale, so compare the same agency across companies and look at more than one. Ratings are opinions and can change.",
        ],
      },
      {
        heading: "Warning signs",
        bullets: [
          "Pressure to decide the same day.",
          "A rate or bonus far above what comparable products offer, without a clear explanation of the tradeoff.",
          "Being told to move all of your savings into one contract.",
          "Reluctance to put surrender terms, fees or commissions in writing.",
          "Anyone describing an annuity as risk-free or as the same as a bank deposit.",
        ],
      },
      {
        heading: "How to check an advisor and a company",
        bullets: [
          "Confirm the agent's license with your state insurance department.",
          "Look up the insurer's ratings and complaint history.",
          "Use the free-look period to read the contract before the window closes.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are annuities insured by the FDIC?",
        answer: "No. Annuities are insurance contracts, not bank deposits, and are not covered by FDIC insurance.",
      },
      {
        question: "What happens if my annuity company fails?",
        answer:
          "State regulators step in, often transferring contracts to another insurer. State guaranty associations provide protection up to limits set by each state's law. Outcomes and timing vary, which is why insurer strength matters at the start.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["can-you-lose-money-in-an-annuity", "annuity-vs-cd", "annuity-surrender-charges"],
  },
  {
    ...base,
    slug: "how-much-does-an-annuity-pay",
    title: "How much does an annuity pay per month?",
    metaTitle: "How Much Does an Annuity Pay Per Month? What Sets It | Rare Legacy Life",
    description:
      "The factors that set an annuity's monthly payment: age, amount, start date, single or joint life, payout option and interest rates, with a free estimate.",
    readMinutes: 5,
    answer:
      "There is no single figure, because an annuity's monthly payment is set by your age when income starts, how much you put in, whether it covers one life or two, the payout option you choose, and interest rates on the day you buy. Older starting ages and life-only payouts pay more per month; joint coverage and refund features pay less.",
    sections: [
      {
        heading: "What sets the payment",
        table: {
          caption: "What raises or lowers an annuity's monthly payment",
          headers: ["Factor", "Effect on the monthly payment"],
          rows: [
            ["Starting later", "Higher: payments are expected to last fewer years"],
            ["A larger premium", "Higher, roughly in proportion"],
            ["Covering a spouse too", "Lower: payments last for two lifetimes"],
            ["Adding a refund or guaranteed period", "Lower: part of the payment funds the guarantee"],
            ["Higher interest rates when you buy", "Higher"],
            ["Payments that increase each year", "Lower at the start, higher later"],
          ],
        },
      },
      {
        heading: "Why two quotes for the same person differ",
        paragraphs: [
          "Insurers price the same contract differently, and they reprice often. Two carriers can quote noticeably different payments for the same age and amount on the same day, which is the practical argument for comparing several before deciding.",
        ],
      },
      {
        heading: "Getting a number for your situation",
        paragraphs: [
          "Our annuity calculator gives a rough range in about two minutes, and a licensed advisor follows up with a closer estimate. For a firm figure you need carrier illustrations based on your exact age, state and options.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the monthly payment guaranteed?",
        answer:
          "With an income annuity, the payment is set by the contract and guaranteed by the insurer for the period or lifetime you chose, subject to its claims-paying ability.",
      },
      {
        question: "Do men and women get the same payment?",
        answer:
          "Often not on non-qualified annuities: because women on average live longer, the same premium usually pays a woman slightly less per month. Some contracts and employer plans use unisex rates.",
      },
      {
        question: "Does the payment keep up with inflation?",
        answer:
          "Only if you choose an option that increases payments over time. That option starts with a lower payment than a level one.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["income-annuity", "how-annuities-are-taxed", "annuity-vs-cd"],
  },
];
