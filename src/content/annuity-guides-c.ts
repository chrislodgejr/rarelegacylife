import type { Guide } from "@/content/guides";

/**
 * Annuity library, batch C: payout options, couples and survivors, beneficiaries and inheritance, estate planning,
 * non-qualified money, long-term care features, access to money and the free-look period. Written from scratch for Rare Legacy
 * under the rules at the top of src/content/guides.ts: one question a guide, a short answer that stands on its own, a named
 * licensed author, and no carrier names, rates or guarantees. Each ends on the quiz (cta "quiz").
 * The tax passages (inherited annuities, non-qualified annuities, beneficiary rules) go past the advisors and compliance before
 * they are merged.
 */

const FINRA = {
  label: "FINRA: Annuities",
  url: "https://www.finra.org/investors/investing/investment-products/annuities",
};
const INVESTOR_GOV = {
  label: "Investor.gov: Annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities",
};
const IRS_410 = {
  label: "IRS Topic No. 410: Pensions and annuities",
  url: "https://www.irs.gov/taxtopics/tc410",
};
const IRS_575 = {
  label: "IRS Publication 575: Pension and Annuity Income",
  url: "https://www.irs.gov/publications/p575",
};
const IRS_590B = {
  label:
    "IRS Publication 590-B: Distributions from Individual Retirement Arrangements",
  url: "https://www.irs.gov/publications/p590b",
};
const NAIC = {
  label: "NAIC: Consumer guide to annuities",
  url: "https://content.naic.org/consumer/annuities.htm",
};
const SSA = {
  label: "Social Security: Retirement benefits",
  url: "https://www.ssa.gov/benefits/retirement/",
};

const base = {
  category: "Retirement & annuities",
  author: "christian-pennachietti",
  published: "2026-11-24",
  updated: "2026-11-24",
  cta: "quiz",
} as const;

export const ANNUITY_GUIDES_C: Guide[] = [
  {
    ...base,
    slug: "life-only-vs-period-certain-vs-cash-refund",
    title:
      "Life only vs. period certain vs. cash refund: which annuity payout is right?",
    metaTitle:
      "Life Only vs. Period Certain vs. Cash Refund Annuity | Rare Legacy Life",
    description:
      "How life-only, period-certain, and cash or installment refund annuity payouts work, what each pays at death, and how to choose the right tradeoff.",
    readMinutes: 7,
    answer:
      "Life only pays the largest check for as long as you live, but payments stop at death with nothing left for heirs. Period certain pays for a set number of years, or for life with a guaranteed minimum period. Cash and installment refund options return any unpaid premium to your beneficiary. Each added protection lowers the monthly payment somewhat.",
    sections: [
      {
        heading: "The basic choice: more income or more protection",
        paragraphs: [
          "When you turn savings into income, the insurer asks how payments should work. Every option is a tradeoff between the size of each check and what happens if you die sooner than expected.",
          "The insurer prices each option using your age, life expectancy and interest rates on the day you buy. The more the insurer might have to pay after your death, the smaller each payment is while you are alive. Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
      },
      {
        heading: "How each option works",
        table: {
          caption: "Common payout options compared",
          headers: [
            "Option",
            "How long it pays",
            "What happens at death",
            "Relative payment size",
          ],
          rows: [
            [
              "Life only",
              "Your whole life",
              "Payments stop. Nothing goes to heirs.",
              "Highest",
            ],
            [
              "Life with period certain",
              "Your whole life, with a minimum number of years",
              "If you die early, your beneficiary receives payments for the rest of the guaranteed period",
              "A little lower",
            ],
            [
              "Period certain only",
              "A fixed number of years",
              "Your beneficiary receives the rest of the payments. Income ends after the period even if you are alive.",
              "Depends on the length chosen",
            ],
            [
              "Installment refund",
              "Your whole life",
              "Payments continue to your beneficiary until total payments equal what you paid in",
              "Lower than life only",
            ],
            [
              "Cash refund",
              "Your whole life",
              "Your beneficiary receives a lump sum equal to premium minus payments already made",
              "Usually a bit lower than installment refund",
            ],
          ],
        },
      },
      {
        heading: "A hypothetical example",
        paragraphs: [
          "Imagine someone puts $100,000 into an income annuity. Suppose, purely as a made-up illustration, life only would pay $600 a month, while a cash refund version would pay somewhat less. If that person dies after receiving $30,000 in payments, life only leaves nothing. The cash refund version sends the beneficiary the remaining $70,000. If the person lives for decades, life only pays the most in total.",
          "These numbers are not quotes. Real payments depend on your age, health class, the option you pick and rates on the day you buy.",
        ],
      },
      {
        heading: "How to choose",
        bullets: [
          "Choose life only if the goal is the most income possible and other assets will take care of heirs.",
          "Choose a period certain if you want income for life but dislike the idea of the payments ending after only a year or two.",
          "Choose a refund option if you want to be sure at least your premium comes back to your family, one way or another.",
          "Choose a period certain only if you need income to bridge a specific gap, such as the years before Social Security starts.",
          "If you are married, compare these with a joint and survivor payout, which keeps income going for a spouse.",
        ],
      },
      {
        heading: "Decide carefully, because the choice is usually permanent",
        paragraphs: [
          "Once payments begin, most income annuities cannot be changed or cashed in. Ask to see each option side by side before you sign. A licensed Rare Legacy advisor can compare options from several carriers so you can see what each protection costs in monthly income.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which payout option pays the most each month?",
        answer:
          "Life only, because the insurer owes nothing after your death. Every option that adds a guarantee for heirs lowers the payment to some degree.",
      },
      {
        question: "Can I change my payout option later?",
        answer:
          "Usually not once income payments have started. Some deferred contracts let you choose the option when you turn on income, so the decision can wait until then.",
      },
      {
        question: "Is period certain the same as a refund option?",
        answer:
          "No. Period certain guarantees a number of years of payments. A refund option guarantees that total payments at least equal your premium.",
      },
    ],
    sources: [INVESTOR_GOV, NAIC],
    related: [
      "income-annuity",
      "joint-and-survivor-annuity",
      "what-happens-to-an-annuity-when-you-die",
      "annuity-payout-rates",
    ],
  },
  {
    ...base,
    slug: "joint-and-survivor-annuity",
    title: "What is a joint and survivor annuity?",
    metaTitle:
      "Joint and Survivor Annuity: How It Works for Couples | Rare Legacy Life",
    description:
      "How a joint and survivor annuity pays income for two lives, what 100%, 75% and 50% survivor options mean, and how to decide if one fits your marriage.",
    readMinutes: 6,
    answer:
      "A joint and survivor annuity pays income for as long as either of two people is alive, usually a married couple. When the first person dies, payments continue to the survivor, either at the full amount or at a reduced share such as 75% or 50%. Because it may pay longer, each check is smaller than a single-life payout.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "Two people are named as annuitants, most often spouses.",
          "Income starts on the date you choose and continues while either person is alive.",
          "At the first death, the survivor keeps receiving payments at the percentage you picked.",
          "Payments stop at the second death unless you also added a period certain or refund feature.",
        ],
        paragraphs: [
          "You can buy a joint payout as an immediate income annuity, where payments begin within about a year, or choose it later when you turn on income from a deferred annuity. Some deferred annuities offer a joint version of a lifetime income rider instead, which pays for both lives while keeping an account value you can still see. Each design handles fees, access and death benefits differently, so compare them side by side.",
          "Guarantees are backed by the claims-paying ability of the issuing insurer, and annuities are not FDIC insured. State guaranty associations provide a further layer of protection up to limits that vary by state.",
        ],
      },
      {
        heading: "Choosing the survivor percentage",
        paragraphs: [
          "The survivor percentage is the share of income the surviving spouse keeps. A higher percentage protects the survivor more but lowers the payment you both receive while both are alive.",
        ],
        table: {
          caption: "Survivor options and what they mean",
          headers: [
            "Survivor option",
            "What the survivor keeps",
            "Effect on the starting payment",
          ],
          rows: [
            [
              "100% joint and survivor",
              "The full payment",
              "Lowest starting payment",
            ],
            [
              "75% joint and survivor",
              "Three quarters of the payment",
              "In between",
            ],
            [
              "50% joint and survivor",
              "Half of the payment",
              "Highest starting payment of the three",
            ],
          ],
        },
      },
      {
        heading: "Why couples consider it",
        paragraphs: [
          "When one spouse dies, household income often drops. One of the two Social Security checks goes away, and a pension may shrink or end. Many expenses, such as housing, insurance and property taxes, stay about the same. A joint payout is one way to keep a dependable check coming to the survivor.",
          "It can also remove a worry many couples share: what happens if the person who managed the money dies first. The survivor does not have to make investment decisions to keep the income.",
        ],
      },
      {
        heading: "The tradeoffs",
        bullets: [
          "Each payment is smaller than a single-life payout, because the insurer expects to pay for longer.",
          "The younger the second person, the lower the payment tends to be.",
          "Once income begins, the choice usually cannot be changed, even after a divorce.",
          "Money placed in an income annuity is generally no longer available as a lump sum.",
          "Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
      },
      {
        heading: "Questions to ask before choosing",
        bullets: [
          "How would the survivor's budget look on each survivor percentage?",
          "What other income would continue, such as Social Security survivor benefits or life insurance?",
          "Is there a big age or health difference between you?",
          "Would a period certain or refund feature on top of the joint payout give peace of mind?",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can compare options from several carriers and show the survivor percentages side by side.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does a joint annuity have to be with a spouse?",
        answer:
          "Most are, but many insurers allow another person, such as a partner or sibling. Rules for qualified money can limit the choice, so ask before you apply.",
      },
      {
        question: "What happens if both of us die early?",
        answer:
          "With a plain joint payout, payments stop at the second death. Adding a period certain or refund feature can send remaining value to your beneficiaries.",
      },
      {
        question: "Is 100% survivor always the best choice?",
        answer:
          "Not always. If the survivor would have enough other income, a lower survivor percentage pays you both more while you are both alive.",
      },
    ],
    sources: [INVESTOR_GOV, SSA],
    related: [
      "lifetime-income-for-couples",
      "how-to-protect-your-spouse-in-retirement",
      "life-only-vs-period-certain-vs-cash-refund",
      "income-annuity",
    ],
  },
  {
    ...base,
    slug: "annuity-owner-vs-annuitant-vs-beneficiary",
    title: "Annuity owner vs. annuitant vs. beneficiary: who is who?",
    metaTitle:
      "Annuity Owner vs. Annuitant vs. Beneficiary Explained | Rare Legacy Life",
    description:
      "The three roles on every annuity contract, who controls the money, whose life sets the payments, who gets paid at death, and setups that cause trouble.",
    readMinutes: 6,
    answer:
      "The owner controls the annuity: they pay the premium, make withdrawals, name beneficiaries and owe the tax. The annuitant is the person whose age and life expectancy set the income payments and, in many contracts, whose death triggers the death benefit. The beneficiary receives the money when that death occurs. One person is often both owner and annuitant.",
    sections: [
      {
        heading: "The three roles",
        table: {
          caption: "Who does what on an annuity contract",
          headers: ["Role", "What they do", "Can it be changed?"],
          rows: [
            [
              "Owner",
              "Controls the contract, makes decisions and is taxed on gains",
              "Ownership can sometimes be transferred, which may have tax effects",
            ],
            [
              "Annuitant",
              "The measuring life for income and often for the death benefit",
              "Usually set at purchase and hard or impossible to change",
            ],
            [
              "Beneficiary",
              "Receives the death benefit or remaining payments",
              "The owner can usually change it at any time",
            ],
          ],
        },
      },
      {
        heading: "The owner",
        paragraphs: [
          "The owner holds the rights. Only the owner can take withdrawals, surrender the contract, choose payout options and update beneficiaries. For tax purposes, gains are taxed to the owner when they are paid out. A contract can have joint owners, which is common for married couples with non-qualified money.",
          "For annuities inside an IRA, the IRA owner must be the owner and the annuitant, so the roles are fixed.",
        ],
      },
      {
        heading: "The annuitant",
        paragraphs: [
          "The annuitant does not have to be the owner, but must be a living person. The insurer uses the annuitant's age to work out income payments. Some contracts are annuitant-driven, meaning the death benefit is paid when the annuitant dies. Others are owner-driven, paying when the owner dies. Many contracts track both. Read which kind you have.",
          "Why would someone name a different annuitant? Sometimes a parent owns the contract and names an adult child as annuitant to stretch the time before income must start. Sometimes one spouse owns the money and the other is named for income purposes. These setups can work, but they need to be chosen on purpose, with a clear understanding of what happens at each death.",
          "Many contracts also have a maximum age at which income must begin, often tied to the annuitant's age. If the annuitant is older, that date can arrive sooner than you expect.",
        ],
      },
      {
        heading: "The beneficiary",
        bullets: [
          "Name a primary beneficiary and at least one contingent beneficiary.",
          "You can split the money among several people by percentage.",
          "Naming a living person usually keeps the money out of probate.",
          "Leaving the beneficiary blank, or naming your estate, can send the money through probate.",
          "The beneficiary form controls who is paid, ahead of your will.",
        ],
      },
      {
        heading: "Setups that can cause surprises",
        bullets: [
          "Owner and annuitant are different people, and the annuitant dies first: in an annuitant-driven contract, the money may go to the beneficiary when the owner did not expect it.",
          "Owner, annuitant and beneficiary are three different people: a death can create a taxable gift or unexpected tax for someone.",
          "A trust is the owner: trusts can lose tax deferral in some cases, so the trust's terms and the contract need review.",
        ],
        paragraphs: [
          "Rules vary by contract and the tax treatment can be complex, so confirm your setup with your advisor and a tax professional. A licensed Rare Legacy advisor can review how your roles are set up and compare options from several carriers.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can the owner and annuitant be different people?",
        answer:
          "Yes, for non-qualified annuities. It can be useful, but it can also cause unexpected payouts or taxes, so check how the contract handles each death.",
      },
      {
        question: "Can I change the annuitant?",
        answer:
          "Often not after the contract is issued. Some contracts allow it before income starts, but many do not. The beneficiary is much easier to change.",
      },
      {
        question: "Who pays the tax on annuity gains?",
        answer:
          "The owner pays tax on gains withdrawn during life. After death, the beneficiary generally owes ordinary income tax on the gains they receive.",
      },
    ],
    sources: [FINRA, IRS_575],
    related: [
      "annuity-beneficiary-rules",
      "what-happens-to-an-annuity-when-you-die",
      "annuity-estate-planning",
    ],
  },
  {
    ...base,
    slug: "how-are-inherited-annuities-taxed",
    title: "How are inherited annuities taxed?",
    metaTitle:
      "How Are Inherited Annuities Taxed? Spouse and Non-Spouse | Rare Legacy Life",
    description:
      "How beneficiaries are taxed on an inherited annuity: spouse vs. non-spouse options, qualified vs. non-qualified money, lump sums, stretch and the 10-year rule.",
    readMinutes: 8,
    answer:
      "When you inherit an annuity, the gains are generally taxed as ordinary income when you receive them, and there is no step-up in basis. For non-qualified annuities, the original owner's after-tax premium comes back tax-free. For annuities in an IRA or plan, nearly everything is taxable. Spouses usually have the most flexible options, and spreading payments can spread the tax.",
    sections: [
      {
        heading: "Two questions decide the tax",
        bullets: [
          "Was the annuity qualified (inside an IRA or employer plan) or non-qualified (bought with after-tax money)?",
          "Are you the surviving spouse or another beneficiary?",
        ],
        paragraphs: [
          "The answers decide how much is taxable and how quickly the money must come out. The 10% additional tax for withdrawals before age 59½ generally does not apply to payments made because of the owner's death.",
        ],
      },
      {
        heading: "Non-qualified annuities",
        paragraphs: [
          "The owner paid in after-tax dollars, called the cost basis. That part comes back to the beneficiary tax-free. The growth above it is taxed as ordinary income in the year it is received. Unlike stocks or a home, an annuity does not get a step-up in basis at death, so the deferred gains are still taxed.",
        ],
        table: {
          caption:
            "Common choices for a non-spouse beneficiary of a non-qualified annuity",
          headers: ["Choice", "How it works", "Tax effect"],
          rows: [
            [
              "Lump sum",
              "Take the whole value at once",
              "All gains taxed in one year, which can push you into a higher bracket",
            ],
            [
              "Five-year rule",
              "Take the money any time within about five years of the death",
              "Lets you choose which years to take income",
            ],
            [
              "Stretch over life expectancy",
              "Begin payments, generally within a year of the death, spread over your life expectancy",
              "Gains are taxed a little at a time as you receive them",
            ],
          ],
        },
      },
      {
        heading: "Qualified annuities in an IRA or plan",
        paragraphs: [
          "Money in a traditional IRA or plan usually went in before tax, so nearly every dollar a beneficiary takes out is taxable as ordinary income. Inherited Roth money can be tax-free if the Roth rules are met.",
          "Under current federal rules, most non-spouse beneficiaries must empty an inherited IRA or plan within ten years of the owner's death. In some cases, yearly withdrawals are also required during those ten years. Certain beneficiaries, such as a minor child of the owner, someone disabled or chronically ill, or someone not more than ten years younger than the owner, may have more time. These rules have changed in recent years, so confirm the details for your situation.",
        ],
      },
      {
        heading: "Options for a surviving spouse",
        bullets: [
          "Continue the contract as the new owner, keeping tax deferral until money is withdrawn. This is often called spousal continuation.",
          "For IRA money, treat the inherited IRA as your own or roll it into your own IRA, following the IRA rules.",
          "Take a lump sum or payments, with the same income tax rules as other beneficiaries.",
        ],
        paragraphs: [
          "Which choice is best depends on your age, your other income and whether you need the money now.",
        ],
      },
      {
        heading: "Before you decide",
        paragraphs: [
          "Choices made right after a death can be permanent, and a large lump sum can mean a large tax bill. Ask the insurer for every option in writing, and speak with a tax professional before you choose. Rules vary, and state taxes may also apply. A licensed Rare Legacy advisor can explain the options the contract offers.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Do I pay the 10% early withdrawal penalty on an inherited annuity?",
        answer:
          "Generally no. Payments made because of the owner's death are an exception to the 10% additional tax, even if you are under 59½. Regular income tax still applies to the gains.",
      },
      {
        question: "Does an inherited annuity get a step-up in basis?",
        answer:
          "No. The gains that built up during the owner's life are taxed as ordinary income to whoever receives them.",
      },
      {
        question: "Is the whole inherited annuity taxable?",
        answer:
          "For a non-qualified annuity, only the gains are taxable and the original premium comes back tax-free. For a traditional IRA or plan annuity, nearly all of it is usually taxable.",
      },
    ],
    sources: [IRS_575, IRS_590B, IRS_410],
    related: [
      "how-annuities-are-taxed",
      "what-happens-to-an-annuity-when-you-die",
      "annuity-beneficiary-rules",
      "non-qualified-annuity",
    ],
  },
  {
    ...base,
    slug: "annuity-beneficiary-rules",
    title: "Annuity beneficiary rules: what you need to know",
    metaTitle:
      "Annuity Beneficiary Rules: Naming and Payout Options | Rare Legacy Life",
    description:
      "How to name annuity beneficiaries, primary vs. contingent, what spouses and others can do, the time limits that apply, and the mistakes families make most.",
    readMinutes: 6,
    answer:
      "An annuity's beneficiary form decides who receives the money at death, ahead of your will. You can name primary and contingent beneficiaries and split shares by percentage. A surviving spouse can usually continue the contract. Other beneficiaries generally must take the money within set time limits, as a lump sum or spread over time. Keep the form current after life changes.",
    sections: [
      {
        heading: "Naming beneficiaries",
        bullets: [
          "Primary beneficiaries are first in line. You can name one or several and set each person's share.",
          "Contingent beneficiaries receive the money if no primary beneficiary is living.",
          "Use full legal names and enough detail to identify each person.",
          "Many forms let you choose whether a deceased beneficiary's share passes to their children or to the other beneficiaries.",
          "You can usually name a trust or a charity, though each has its own tax effects.",
        ],
      },
      {
        heading: "What different beneficiaries can do",
        table: {
          caption: "Typical options by type of beneficiary",
          headers: ["Beneficiary", "Common options", "Points to know"],
          rows: [
            [
              "Surviving spouse",
              "Continue the contract as owner, take payments or take a lump sum",
              "Continuation keeps tax deferral going",
            ],
            [
              "Child or other person",
              "Lump sum, take it within a set period, or spread it over time where allowed",
              "Time limits apply, and gains are taxed as ordinary income",
            ],
            [
              "Trust",
              "Depends on the trust terms and the contract",
              "Some options can be lost, so the trust needs careful drafting",
            ],
            [
              "Estate",
              "Paid to the estate",
              "Usually goes through probate and limits stretch options",
            ],
            [
              "Charity",
              "Lump sum",
              "A charity generally does not pay income tax on what it receives",
            ],
          ],
        },
      },
      {
        heading: "Time limits, in general terms",
        paragraphs: [
          "For non-qualified annuities, a non-spouse beneficiary generally must take the money within about five years of the death, or begin payments over their life expectancy, usually within a year. For annuities inside an IRA or plan, most non-spouse beneficiaries must empty the account within ten years, with some exceptions. Rules vary by contract and have changed in recent years, so confirm with a tax professional.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Never updating the form after a marriage, divorce, birth or death.",
          "Naming a minor directly, which can require a court-appointed guardian to manage the money.",
          "Naming the estate, or leaving the form blank, which can send the money through probate.",
          "Assuming a will or trust overrides the beneficiary form. It usually does not.",
          "Naming someone who receives needs-based government benefits without planning, which can affect their eligibility.",
        ],
      },
      {
        heading: "Review it regularly",
        paragraphs: [
          "A quick review every few years, and after any major life event, keeps the money going where you intend. A licensed Rare Legacy advisor can walk through your beneficiary setup with you, and an estate planning attorney can help with trusts and special situations.",
          "When the time comes, your beneficiaries will need a certified death certificate, the insurer's claim form and identification. Leaving a short note with your contract numbers and the insurers' phone numbers can save your family weeks of searching. If you are unsure which insurers hold your contracts, the NAIC offers a free life insurance and annuity policy locator service for families after a death.",
          "Tell your beneficiaries that they will have choices. A quick lump sum is not always the best option, because it can create a large tax bill in one year. Encourage them to speak with a tax professional before signing anything.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does my will override my annuity beneficiary?",
        answer:
          "Generally no. The beneficiary form on file with the insurer controls who is paid, which is why keeping it current matters.",
      },
      {
        question: "Can I name more than one beneficiary?",
        answer:
          "Yes. You can name several primary and contingent beneficiaries and give each a percentage share.",
      },
      {
        question: "What if no beneficiary is alive when I die?",
        answer:
          "The contract usually pays your estate, which can mean probate and fewer payout options for your heirs.",
      },
    ],
    sources: [IRS_575, IRS_590B],
    related: [
      "annuity-owner-vs-annuitant-vs-beneficiary",
      "how-are-inherited-annuities-taxed",
      "annuity-death-benefits-explained",
      "annuity-estate-planning",
    ],
  },
  {
    ...base,
    slug: "annuity-death-benefits-explained",
    title: "Annuity death benefits explained",
    metaTitle:
      "Annuity Death Benefits Explained: Standard and Enhanced | Rare Legacy Life",
    description:
      "What an annuity death benefit pays, how standard and enhanced death benefits differ, what riders cost, and how the benefit works before and after income starts.",
    readMinutes: 6,
    answer:
      "An annuity death benefit is the amount paid to your beneficiaries if you die before the contract is used up. During the savings phase, the standard benefit is usually the account value, often with surrender charges waived. Some contracts offer enhanced death benefits, for a yearly fee, that may pay more. After income starts, what remains depends on the payout option chosen.",
    sections: [
      {
        heading: "The standard death benefit",
        paragraphs: [
          "Most deferred annuities pay the account value to beneficiaries at death. Many also waive surrender charges at that point, so heirs are not penalized for an early death. Some contracts guarantee the greater of the account value or the premiums paid minus withdrawals, which matters most in variable annuities, where the value can fall with the market.",
          "For fixed and fixed indexed annuities, the account value does not drop with the market, so the standard benefit is usually the account value itself, including credited interest. Any premium bonus that has not yet vested may or may not be included, depending on the contract, so ask about that detail.",
          "Check whether your contract pays at the death of the owner, the annuitant, or either. When the owner and annuitant are the same person, this rarely matters. When they are different people, it can decide who gets paid and when.",
          "Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
      },
      {
        heading: "Enhanced death benefits",
        paragraphs: [
          "Some contracts offer optional riders that may pay more than the account value. They come with a yearly charge that reduces your value whether or not the benefit is ever used.",
        ],
        table: {
          caption: "Common types of enhanced death benefit",
          headers: ["Type", "How it works in general terms"],
          rows: [
            [
              "Return of premium",
              "Pays at least what you paid in, minus withdrawals",
            ],
            [
              "Highest anniversary value",
              "Locks in the highest account value on a contract anniversary",
            ],
            [
              "Roll-up",
              "Grows a separate death benefit value at a stated rate set in the contract",
            ],
            [
              "Earnings enhancement",
              "Adds a percentage of gains to help beneficiaries cover income tax",
            ],
          ],
        },
      },
      {
        heading: "How withdrawals affect the benefit",
        bullets: [
          "Withdrawals usually reduce the death benefit, sometimes more than dollar for dollar.",
          "A pro rata reduction lowers the benefit by the same percentage the withdrawal took from the account value.",
          "Ask how your contract treats withdrawals before you take one.",
        ],
      },
      {
        heading: "After income payments start",
        paragraphs: [
          "Once you turn the contract into income, the death benefit usually changes. A life-only payout has no death benefit. A period-certain payout continues payments for the rest of the guaranteed period. A refund option returns unpaid premium. A joint payout keeps income going to the survivor. Some income riders that leave the account intact still pay any remaining account value at death.",
        ],
      },
      {
        heading: "Is an enhanced death benefit worth it?",
        bullets: [
          "Consider the cost each year, over the years you expect to hold the contract.",
          "Compare it with life insurance, which may provide a larger benefit for heirs for a similar cost, depending on your health.",
          "Check age limits, as many riders can only be added before a certain age.",
          "Remember that beneficiaries owe ordinary income tax on gains they receive.",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can compare options from several carriers and weigh a death benefit rider against other ways to leave money to family.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are surrender charges waived when the owner dies?",
        answer:
          "In most contracts, yes. Check the contract, since a few apply charges in certain situations, such as when the annuitant and owner are different people.",
      },
      {
        question: "Is the death benefit taxable?",
        answer:
          "The portion that is gain is generally taxed as ordinary income to the beneficiary. Premiums paid with after-tax money in a non-qualified annuity come back tax-free.",
      },
      {
        question: "Can I add a death benefit rider later?",
        answer:
          "Usually riders must be chosen when you buy the contract. A few contracts allow additions within set windows, but that is less common.",
      },
    ],
    sources: [INVESTOR_GOV, FINRA],
    related: [
      "what-happens-to-an-annuity-when-you-die",
      "annuity-beneficiary-rules",
      "how-are-inherited-annuities-taxed",
      "annuity-fees-explained",
    ],
  },
  {
    ...base,
    slug: "annuity-estate-planning",
    title: "How do annuities fit into estate planning?",
    metaTitle:
      "Annuities in Estate Planning: Probate, Heirs and Taxes | Rare Legacy Life",
    description:
      "How annuities pass to heirs outside of probate, how they fit with wills and trusts, the tax points to know, and the simple steps that keep a plan working.",
    readMinutes: 6,
    answer:
      "Annuities can play a useful role in estate planning because a named beneficiary usually receives the money directly, without going through probate. They can protect a spouse with lifetime income and send remaining value to children. The main drawbacks are that heirs pay ordinary income tax on gains and that annuities do not receive a step-up in basis at death.",
    sections: [
      {
        heading: "Avoiding probate with a named beneficiary",
        paragraphs: [
          "Probate is the court process that settles an estate. It can take months and the records are often public. An annuity with a living, named beneficiary passes by contract, so the insurer pays the beneficiary directly once it receives a death certificate and a claim form.",
          "That only works if the beneficiary form is complete and current. If no beneficiary is named, or the estate is named, the money can end up in probate after all.",
          "Speed matters too. Families often need money soon after a death for funeral costs and household bills. Because a named beneficiary can claim directly from the insurer, the money is often available much sooner than assets that must wait for an estate to be settled. Claim timing varies by insurer and by how complete the paperwork is.",
        ],
      },
      {
        heading: "How annuities fit with wills and trusts",
        bullets: [
          "The beneficiary form controls the annuity, not your will.",
          "Naming a trust as beneficiary can add control, such as paying money to a child over time, but trusts can limit payout options and change the tax picture.",
          "Coordinate the annuity's beneficiaries with the rest of your plan so assets are split the way you intend.",
          "An estate planning attorney can help decide whether a trust makes sense.",
        ],
      },
      {
        heading: "Tax points to know",
        table: {
          caption: "Annuities compared with some other assets at death",
          headers: [
            "Asset",
            "Step-up in basis at death?",
            "How heirs are taxed in general",
          ],
          rows: [
            [
              "Non-qualified annuity",
              "No",
              "Gains taxed as ordinary income when received",
            ],
            [
              "Traditional IRA or plan",
              "No",
              "Withdrawals generally taxed as ordinary income",
            ],
            [
              "Stocks in a taxable account",
              "Generally yes",
              "Gains before death are generally not taxed to heirs",
            ],
            [
              "Life insurance death benefit",
              "Not applicable",
              "Generally received income-tax-free",
            ],
          ],
        },
        paragraphs: [
          "Annuity values also count toward the size of your estate for estate tax purposes, though most estates fall below the federal threshold. Rules vary, so confirm with a tax professional.",
          "Some people pair an annuity with life insurance for this reason. The annuity provides income during life, and a life insurance policy passes to heirs generally income-tax-free. Whether that makes sense depends on health, age and goals.",
        ],
      },
      {
        heading: "Ways annuities are used in a plan",
        bullets: [
          "Providing lifetime income for a surviving spouse through a joint payout.",
          "Guaranteeing that at least the premium passes to heirs through a refund or death benefit feature.",
          "Letting beneficiaries spread payments over time, where the contract and tax rules allow, so the tax is spread too.",
          "Freeing other assets for heirs by covering your own income needs with an annuity.",
        ],
      },
      {
        heading: "Keep the plan working",
        paragraphs: [
          "Review beneficiaries after marriage, divorce, births and deaths. Name contingent beneficiaries. Keep a list of your contracts where your family can find it. A licensed Rare Legacy advisor can review your annuities and compare options from several carriers, working alongside your attorney and tax professional.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do annuities avoid probate?",
        answer:
          "Generally yes, when a living beneficiary is named. If the estate is the beneficiary or none is named, the annuity can go through probate.",
      },
      {
        question:
          "Is an annuity or life insurance better for leaving money to heirs?",
        answer:
          "Life insurance usually passes income-tax-free and can leverage premiums, while annuity gains are taxable to heirs. Many plans use both for different goals.",
      },
      {
        question: "Can a trust own or inherit an annuity?",
        answer:
          "Yes, but trusts can lose tax deferral or payout options in some cases. Have the trust and the contract reviewed together.",
      },
    ],
    sources: [IRS_575, FINRA],
    related: [
      "what-happens-to-an-annuity-when-you-die",
      "annuity-beneficiary-rules",
      "how-are-inherited-annuities-taxed",
      "annuity-owner-vs-annuitant-vs-beneficiary",
    ],
  },
  {
    ...base,
    slug: "how-to-protect-your-spouse-in-retirement",
    title: "How to protect your spouse in retirement",
    metaTitle:
      "How to Protect Your Spouse in Retirement: Income Steps | Rare Legacy Life",
    description:
      "Practical steps to protect a spouse's income after one of you dies: Social Security timing, pension choices, joint annuities, life insurance and paperwork.",
    readMinutes: 7,
    answer:
      "Protecting your spouse means making sure income continues after the first death, when one Social Security check stops and expenses stay much the same. Common steps include delaying the higher earner's Social Security, choosing survivor options on pensions, using joint lifetime income, carrying life insurance where it fits, and keeping beneficiaries and paperwork current so the survivor is not left guessing.",
    sections: [
      {
        heading: "Why the survivor's income often drops",
        paragraphs: [
          "When one spouse dies, the household keeps only the larger of the two Social Security benefits. A pension may stop or shrink. Yet the house, the car, insurance and utilities cost about the same. The survivor may also move into a higher tax bracket by filing as a single person. Planning ahead can soften all of this.",
          "Consider a hypothetical couple receiving two Social Security checks and one pension. If the spouse with the pension dies first and the single-life pension option was chosen, the survivor could lose the pension and the smaller Social Security check at the same time. Their income might fall by far more than half while most bills stay the same. Small decisions made years earlier decide how hard that moment is.",
          "Women in particular often outlive their husbands and may spend many years as a survivor, so planning for the survivor is really planning for the most likely outcome for many couples.",
        ],
      },
      {
        heading: "Steps that help",
        table: {
          caption: "Ways to protect a surviving spouse",
          headers: ["Step", "How it helps"],
          rows: [
            [
              "Delay the higher earner's Social Security",
              "The survivor keeps the larger benefit, so a bigger check lasts longer",
            ],
            [
              "Pick a survivor option on a pension",
              "Keeps part or all of the pension going to the spouse",
            ],
            [
              "Use a joint and survivor annuity",
              "Provides income for as long as either spouse lives",
            ],
            [
              "Keep or buy life insurance where it fits",
              "Replaces lost income or pays off debts",
            ],
            [
              "Name each other as beneficiaries",
              "Lets accounts pass directly and quickly",
            ],
          ],
        },
      },
      {
        heading: "Social Security timing",
        paragraphs: [
          "Social Security benefits grow for each year you delay past full retirement age, up to age 70. Because the survivor keeps the larger of the two benefits, delaying the higher earner's claim can raise the survivor's income for life. Whether delaying makes sense depends on health, other savings and when you need income. The Social Security Administration has calculators that help.",
        ],
      },
      {
        heading: "Guaranteed lifetime income",
        paragraphs: [
          "A joint and survivor annuity turns part of your savings into income for both of your lives. The survivor does not have to manage investments or worry about outliving the money. Guarantees are backed by the claims-paying ability of the issuing insurer, and money in an income annuity is generally not available as a lump sum, so most people use only part of their savings.",
        ],
      },
      {
        heading: "Paperwork and practical steps",
        bullets: [
          "Make a list of every account, policy and annuity, with contact details.",
          "Check that beneficiaries on every account match your wishes.",
          "Make sure both spouses know how bills are paid and where documents are kept.",
          "Update wills, powers of attorney and health care directives.",
          "Talk through what the survivor's budget would look like.",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can review your income plan and compare joint income options from several carriers.",
        ],
      },
    ],
    faqs: [
      {
        question: "What happens to Social Security when a spouse dies?",
        answer:
          "The survivor generally keeps the larger of the two benefits, and the smaller one stops. Contact the Social Security Administration to report the death and ask about survivor benefits.",
      },
      {
        question:
          "Should I take the single-life pension for the higher payment?",
        answer:
          "Only if your spouse would have enough income without it, for example from savings or life insurance. Once chosen, pension options usually cannot be changed.",
      },
      {
        question: "Is life insurance still useful in retirement?",
        answer:
          "It can be, to replace income a survivor would lose, pay debts or leave money to heirs. Cost depends on age and health.",
      },
    ],
    sources: [SSA, INVESTOR_GOV],
    related: [
      "joint-and-survivor-annuity",
      "lifetime-income-for-couples",
      "income-annuity",
      "term-vs-whole-life-insurance",
    ],
  },
  {
    ...base,
    slug: "lifetime-income-for-couples",
    title: "How couples can create lifetime income in retirement",
    metaTitle:
      "Lifetime Income for Couples: Building a Joint Paycheck | Rare Legacy Life",
    description:
      "How married couples can build income that lasts both lifetimes: covering basics with guaranteed sources, joint annuity options, and planning for the survivor.",
    readMinutes: 6,
    answer:
      "Couples can build lifetime income by covering essential expenses with sources that last as long as either spouse lives: Social Security, pensions with survivor benefits, and joint lifetime annuities. Savings can then cover extras and emergencies. Planning for two lives matters because at least one spouse has a good chance of living well into their 90s.",
    sections: [
      {
        heading: "Why two lives change the math",
        paragraphs: [
          "Planning for a couple means planning for the longer of two lifetimes. Even if each of you has an average life expectancy, the chance that one of you lives a long time is higher than for either person alone. That stretches how long savings must last.",
          "It also adds questions a single person does not face. What if the spouse who handles the money dies first? What if one of you needs care at home or in a facility, while the other still needs to live on the same income? What happens to the household budget when only one Social Security check remains?",
          "A good plan answers those questions in writing before they come up. It shows where each dollar of income comes from, how long each source lasts, and which sources stop or shrink at the first death.",
        ],
      },
      {
        heading: "A simple way to organize it",
        bullets: [
          "List essential monthly expenses: housing, food, insurance, utilities, taxes and health care.",
          "List income that lasts for life: both Social Security benefits, any pensions and any lifetime annuity income.",
          "If lifetime income covers the essentials, savings can be used for travel, gifts and surprises.",
          "If there is a gap, consider how to fill it, and check what the gap would look like after the first death.",
          "Revisit the list every few years, since expenses, health and income sources change over time.",
        ],
      },
      {
        heading: "Joint income options",
        table: {
          caption: "Ways an annuity can pay income for two",
          headers: ["Option", "How it works", "Points to weigh"],
          rows: [
            [
              "Joint and survivor income annuity",
              "Pays while either spouse lives",
              "Smaller check than single life, and money is no longer a lump sum",
            ],
            [
              "Deferred annuity with a joint income rider",
              "Keeps an account value while paying joint lifetime withdrawals",
              "Rider fees and withdrawal rules apply",
            ],
            [
              "Deferred income annuity, joint",
              "Income starts at a future age you choose",
              "Money is locked up until income begins",
            ],
          ],
        },
        paragraphs: [
          "Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
      },
      {
        heading: "A hypothetical example",
        paragraphs: [
          "Picture a couple whose essential expenses are $5,000 a month. Their combined Social Security is $4,000, leaving a $1,000 gap. If one of them dies, the household keeps only the larger Social Security check, so the gap could grow. A joint lifetime income source that covers the gap for both lives would keep the basics paid either way. These figures are made up to show the reasoning, not to suggest what any product would pay.",
        ],
      },
      {
        heading: "Keep flexibility too",
        paragraphs: [
          "Most couples should not lock up everything. Keep emergency savings and money that can grow for later years. Surrender charges and limited access are part of most annuities, so match each dollar to its job. A licensed Rare Legacy advisor can compare joint income options from several carriers, and the quiz can send your own numbers by text.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should both spouses be named on an income annuity?",
        answer:
          "If you want income to continue to the survivor, a joint payout is the usual way. A single-life payout ends at the annuitant's death.",
      },
      {
        question: "How much of our savings should go into lifetime income?",
        answer:
          "There is no single answer. Many couples aim to cover essential expenses with lifetime income and keep the rest flexible.",
      },
      {
        question: "Is joint income worth the smaller payment?",
        answer:
          "For many couples, yes, because it protects the survivor. If the survivor has plenty of other income, a single-life payout plus life insurance is another approach.",
      },
    ],
    sources: [SSA, INVESTOR_GOV, NAIC],
    related: [
      "joint-and-survivor-annuity",
      "how-to-protect-your-spouse-in-retirement",
      "income-annuity",
      "how-much-do-i-need-to-retire",
    ],
  },
  {
    ...base,
    slug: "non-qualified-annuity",
    title: "What is a non-qualified annuity?",
    metaTitle:
      "Non-Qualified Annuity: Taxes, Rules and How It Works | Rare Legacy Life",
    description:
      "What a non-qualified annuity is, how it differs from an IRA annuity, how withdrawals and income are taxed, and the rules on early access and inheritance.",
    readMinutes: 7,
    answer:
      "A non-qualified annuity is one you buy with money that has already been taxed, such as savings or a CD, rather than money in an IRA or 401(k). Earnings grow tax-deferred, and only the earnings are taxed when withdrawn. There are no federal contribution limits and no required withdrawals during the owner's lifetime under current rules.",
    sections: [
      {
        heading: "Qualified vs. non-qualified",
        table: {
          caption: "How the two compare in general terms",
          headers: ["Feature", "Non-qualified", "Qualified (IRA or plan)"],
          rows: [
            [
              "Money used",
              "After-tax savings",
              "Pre-tax retirement money, in most cases",
            ],
            [
              "What is taxed at withdrawal",
              "Earnings only",
              "Usually the whole withdrawal",
            ],
            [
              "Contribution limits",
              "None at the federal level, though insurers set maximums",
              "Set by IRA or plan rules",
            ],
            [
              "Required minimum distributions",
              "None during the owner's life",
              "Required starting at the age the IRS sets",
            ],
          ],
        },
      },
      {
        heading: "How withdrawals are taxed",
        paragraphs: [
          "For most non-qualified annuities, withdrawals are treated as earnings first. That means early withdrawals are taxed as ordinary income until all the gain has come out. After that, you are getting your own premium back tax-free.",
          "Earnings withdrawn before age 59½ may also face a 10% additional federal tax, with some exceptions, such as death, disability or a series of substantially equal payments. Insurers may also charge surrender fees on withdrawals above the free amount during the surrender period.",
        ],
      },
      {
        heading: "How income payments are taxed",
        paragraphs: [
          "If you turn the annuity into regular income payments, each payment is split into two parts: a tax-free return of your premium and taxable earnings. The split is set by what is called an exclusion ratio. Once your full premium has been returned, later payments are generally fully taxable. The insurer reports the taxable amount each year.",
        ],
      },
      {
        heading: "Other rules to know",
        bullets: [
          "You can move one annuity to another without current tax through a 1035 exchange, if the rules are followed.",
          "Annuities owned by a trust or business may lose tax deferral in some cases.",
          "Beneficiaries pay ordinary income tax on gains and do not get a step-up in basis.",
          "Annuities are not FDIC insured. Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
        paragraphs: [
          "Tax rules vary with your situation and can change, so confirm the details with a tax professional.",
        ],
      },
      {
        heading: "Who it tends to fit",
        paragraphs: [
          "Non-qualified annuities often appeal to people who have already filled their IRA and workplace plan, who hold savings in taxable accounts and want tax deferral, or who want guaranteed lifetime income from savings. A licensed Rare Legacy advisor can compare options from several carriers.",
          "They are a weaker fit for money you may need in the next few years, because of surrender charges and the 10% additional tax on early earnings. They can also be less attractive for someone in a low tax bracket today who expects to be in a higher one later, since every dollar of gain will eventually be taxed as ordinary income.",
          "One more point: because there are no required withdrawals during your lifetime, a non-qualified annuity can keep growing tax-deferred well into your 80s or 90s, as long as the contract allows. That flexibility is one reason people use them for money they may never need to spend.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Do non-qualified annuities have required minimum distributions?",
        answer:
          "Not during the owner's lifetime under current federal rules. Beneficiaries do face time limits for taking the money after the owner dies.",
      },
      {
        question:
          "Can I put more than the IRA limit into a non-qualified annuity?",
        answer:
          "Yes. There is no federal contribution limit, though each insurer sets its own maximum premium.",
      },
      {
        question: "Is a non-qualified annuity better than a taxable account?",
        answer:
          "It depends. Tax deferral helps, but gains come out as ordinary income rather than at capital gains rates, and surrender charges limit access.",
      },
    ],
    sources: [IRS_575, IRS_410],
    related: [
      "how-annuities-are-taxed",
      "tax-deferred-annuity-guide",
      "how-are-inherited-annuities-taxed",
      "annuity-surrender-charges",
    ],
  },
  {
    ...base,
    slug: "annuity-long-term-care",
    title: "Can an annuity help pay for long-term care?",
    metaTitle:
      "Annuities and Long-Term Care: Riders, Hybrids, Waivers | Rare Legacy Life",
    description:
      "How annuities can help with long-term care costs: LTC riders, hybrid annuity and long-term care contracts, confinement waivers, and the limits to know.",
    readMinutes: 7,
    answer:
      "Some annuities can help with long-term care costs, though few are designed to cover them fully. Options include riders that increase income if you need care, hybrid contracts that combine an annuity with long-term care benefits, and waivers that remove surrender charges if you enter a nursing home. Each comes with conditions, waiting periods and costs to understand first.",
    sections: [
      {
        heading: "Why it comes up",
        paragraphs: [
          "Care at home, in assisted living or in a nursing home can be expensive, and Medicare generally covers only short-term skilled care. Traditional long-term care insurance can be hard to qualify for or afford. Some people look to annuities as a way to set aside money that can do double duty: provide income or growth, and help if care is needed.",
          "The appeal is that the money is not lost if care is never needed. With a traditional long-term care policy, premiums paid for years may never come back. With an annuity that has care features, the account value or income generally remains yours or your beneficiaries' either way, although the care benefit itself is usually smaller than a dedicated policy might provide for the same money.",
        ],
      },
      {
        heading: "Ways an annuity can help",
        table: {
          caption: "Long-term care features found in some annuities",
          headers: [
            "Feature",
            "How it works in general terms",
            "Points to check",
          ],
          rows: [
            [
              "Income rider with a care increase",
              "Raises lifetime income payments, for a time, if you cannot perform a set number of daily activities",
              "Rider fee, waiting periods and how long the increase lasts",
            ],
            [
              "Hybrid annuity with long-term care benefits",
              "Uses the annuity value plus an extra pool of benefits to pay for qualifying care",
              "Health questions, cost and what happens if care is never needed",
            ],
            [
              "Nursing home or confinement waiver",
              "Waives surrender charges if you are confined to a care facility for a set period",
              "Usually only after the contract has been in force for a while",
            ],
            [
              "Terminal illness waiver",
              "Waives surrender charges after a qualifying diagnosis",
              "Definitions vary by contract",
            ],
          ],
        },
      },
      {
        heading: "How confinement waivers work",
        paragraphs: [
          "A confinement waiver lets you take money out without a surrender charge if you enter a nursing home or similar facility. Most contracts require that you were not confined when you bought the contract, that the contract has been in force for a waiting period, often a year, and that you have been confined for a set number of days. Some states do not allow these waivers or change how they work. Read the exact terms.",
          "As a hypothetical example, imagine a contract with a one-year waiting period and a 90-day confinement requirement. If the owner entered a nursing home in the second contract year and stayed 90 days, they could then withdraw without a surrender charge. If they entered in the first month, the waiver might not apply at all. Income tax on any gains would still be due.",
        ],
      },
      {
        heading: "Tax and planning points",
        bullets: [
          "Under federal rules, benefits from qualifying combination annuity and long-term care contracts can receive favorable tax treatment.",
          "An existing annuity may sometimes be exchanged into a qualifying long-term care contract without current tax.",
          "Annuities and Medicaid planning is a specialized area with state rules. Speak with an elder law attorney before making moves for that purpose.",
          "Confirm tax effects with a tax professional, as rules vary.",
        ],
      },
      {
        heading: "Limits to understand",
        bullets: [
          "Most annuity features help pay for care but are not designed to cover every cost.",
          "Riders cost money each year, whether or not you ever use them.",
          "Benefits usually require that you cannot perform a set number of daily activities, or have a cognitive impairment, certified by a professional.",
          "Guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can compare annuities with care features from several carriers alongside traditional coverage.",
        ],
      },
    ],
    faqs: [
      {
        question:
          "Do I need to be healthy to buy an annuity with long-term care benefits?",
        answer:
          "Hybrid contracts often ask health questions. Many income riders with a care increase do not, but they usually have waiting periods.",
      },
      {
        question: "Does Medicare pay for long-term care?",
        answer:
          "Generally not for ongoing custodial care. Medicare may cover a limited period of skilled nursing care after a qualifying hospital stay.",
      },
      {
        question: "Can I use my existing annuity for care costs?",
        answer:
          "You can withdraw from it, but surrender charges and taxes may apply unless a waiver or a qualifying feature covers the situation.",
      },
    ],
    sources: [NAIC, FINRA],
    related: [
      "annuity-liquidity-access",
      "annuity-surrender-charges",
      "income-annuity",
      "how-to-protect-your-spouse-in-retirement",
    ],
  },
  {
    ...base,
    slug: "annuity-liquidity-access",
    title: "How can you get to your money in an annuity?",
    metaTitle:
      "Annuity Liquidity: Free Withdrawals, Waivers and MVAs | Rare Legacy Life",
    description:
      "The ways to reach money in an annuity: free withdrawal amounts, surrender charge waivers, market value adjustments, income options, and the taxes involved.",
    readMinutes: 6,
    answer:
      "Most deferred annuities let you withdraw a portion each year, often around 10% of the value, without a surrender charge. Taking more during the surrender period usually brings a charge and sometimes a market value adjustment. Many contracts waive charges for death, nursing home stays or terminal illness. Taxes, and a possible 10% additional tax before 59½, can apply too.",
    sections: [
      {
        heading: "Free withdrawals",
        paragraphs: [
          "Free withdrawals are the amount you can take each year without a surrender charge. The free amount is set by the contract. Common designs allow a percentage of the value, the interest earned, or a required minimum distribution for IRA annuities. Unused free amounts usually do not carry over to the next year.",
          "Some contracts let you take the free amount in the first year, while others make you wait until the first anniversary. Some figure the percentage from the premium, others from the current account value. These details sound small, but they decide how much you can reach in a pinch.",
          "Contracts with a lifetime income rider add another layer. Withdrawals within the rider's yearly income amount usually keep the guarantee intact, while larger withdrawals can reduce the future income permanently. Ask how both limits work together.",
        ],
      },
      {
        heading: "Ways to reach your money",
        table: {
          caption: "Access options in a typical deferred annuity",
          headers: ["Option", "Surrender charge?", "Points to know"],
          rows: [
            [
              "Free withdrawal",
              "No",
              "Limited to the amount the contract allows each year",
            ],
            [
              "Required minimum distributions",
              "Usually no",
              "For IRA annuities, most contracts allow these without a charge",
            ],
            [
              "Larger withdrawal or full surrender",
              "Yes, during the surrender period",
              "A market value adjustment may also apply",
            ],
            [
              "Waivers for death, confinement or terminal illness",
              "Waived when conditions are met",
              "Waiting periods and definitions apply",
            ],
            [
              "Turn on income",
              "Usually no",
              "Converts the value into payments, often permanently",
            ],
          ],
        },
      },
      {
        heading: "How a market value adjustment works",
        paragraphs: [
          "A market value adjustment, or MVA, changes what you receive on a large early withdrawal, based on how interest rates have moved since you bought the contract. If rates have risen, the adjustment usually reduces what you get. If rates have fallen, it may increase it.",
          "As a hypothetical example, suppose you surrender a contract with a $100,000 value. If rates have gone up since purchase, an MVA might subtract a few thousand dollars on top of any surrender charge. If rates have gone down, it might add some back. The adjustment goes away when the surrender period ends.",
        ],
      },
      {
        heading: "Taxes on withdrawals",
        bullets: [
          "Withdrawals of earnings are taxed as ordinary income.",
          "Earnings withdrawn before 59½ may face a 10% additional federal tax, with some exceptions.",
          "In non-qualified annuities, withdrawals generally come from earnings first.",
          "Rules vary, so confirm with a tax professional before a large withdrawal.",
        ],
      },
      {
        heading: "Plan your access before you buy",
        bullets: [
          "Keep emergency money in a bank account outside the annuity.",
          "Match the surrender period to when you might need the money.",
          "Ask how the free withdrawal amount is figured and which waivers are included.",
          "Remember that annuities are not FDIC insured, and that guarantees are backed by the claims-paying ability of the issuing insurer.",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can compare access features from several carriers so the contract fits how you may need your money.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I take all my money out of an annuity?",
        answer:
          "Yes, but during the surrender period you will usually pay a surrender charge, and possibly a market value adjustment, plus any taxes due.",
      },
      {
        question: "Do free withdrawals reduce income or death benefits?",
        answer:
          "Often yes. Withdrawals typically lower the account value and can reduce rider benefits, so ask how your contract handles them.",
      },
      {
        question: "Can I borrow from an annuity?",
        answer:
          "Most individual annuities do not offer loans. Some annuities inside employer plans do, under the plan's rules.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, IRS_575],
    related: [
      "annuity-surrender-charges",
      "annuity-long-term-care",
      "how-annuities-are-taxed",
      "annuity-free-look-period",
    ],
  },
  {
    ...base,
    slug: "annuity-free-look-period",
    title: "What is the annuity free-look period?",
    metaTitle:
      "Annuity Free-Look Period: How to Cancel and Get a Refund | Rare Legacy Life",
    description:
      "How the annuity free-look period lets you cancel a new contract for a refund, how long it lasts by state, what you get back, and what to check during it.",
    readMinutes: 4,
    answer:
      "The free-look period is a short window after you receive a new annuity contract when you can cancel it and get a refund without a surrender charge. The length is set by state law and typically runs from 10 to 30 days, sometimes longer for older buyers or replacements. Use it to read the contract and confirm it matches what you were told.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "The window usually starts when the contract is delivered to you, not when you apply.",
          "You cancel by sending written notice to the insurer or your agent within the window, following the steps in the contract.",
          "No surrender charge applies to a free-look cancellation.",
          "Keep proof of when the contract arrived and when you sent your notice.",
        ],
      },
      {
        heading: "How long it lasts",
        paragraphs: [
          "Each state sets its own minimum. Many use 10 days, some use 20 or 30, and many states give a longer window to older buyers or when the new annuity replaces an existing one. The exact period should be printed on the first page of your contract. If it is not clear, ask the insurer before the window closes.",
        ],
      },
      {
        heading: "What you get back",
        table: {
          caption: "What a refund usually includes",
          headers: ["Type of annuity", "Typical refund"],
          rows: [
            ["Fixed or fixed indexed", "Usually the premium you paid"],
            [
              "Variable",
              "In many states, the account value, which may be more or less than the premium. Some states require a premium refund.",
            ],
          ],
        },
        paragraphs: [
          "If the money came from an IRA or a 1035 exchange, ask how it will be returned so the tax treatment is protected.",
        ],
      },
      {
        heading: "If the new annuity replaces an old one",
        paragraphs: [
          "When a new annuity replaces an existing annuity or life policy, most states require extra disclosures and often a longer free-look window. Before you cancel during the free look, ask whether the old contract can be restored. Often it cannot, especially if it has already been surrendered. That is why it is important to compare the old and new contracts carefully before the exchange, and to use the free look as a final check rather than the first.",
          "If you decide to cancel, act early in the window. Mail can be slow, and the date the insurer receives your notice may be the date that counts. Sending your notice in a way that can be tracked gives you a record.",
          "Keep in mind that the free look is a safety net, not a substitute for understanding the contract before you sign. Ask questions during the sale, request the buyer's guide and disclosure documents, and take your time. A good advisor will welcome questions at every step.",
        ],
      },
      {
        heading: "What to check during the free look",
        bullets: [
          "The surrender charge schedule and how long it lasts.",
          "The free withdrawal amount and any waivers.",
          "Rider fees and what each rider actually provides.",
          "For indexed annuities, the caps, participation rates or spreads and how they can change.",
          "The owner, annuitant and beneficiary names.",
          "Whether the contract matches any illustration or summary you were shown.",
        ],
        paragraphs: [
          "A licensed Rare Legacy advisor can walk through a new contract with you during the free look and answer questions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I lose money if I cancel during the free look?",
        answer:
          "Usually no for fixed annuities, which generally refund the premium. With a variable annuity, some states return the account value, which can be lower.",
      },
      {
        question: "When does the free-look period start?",
        answer:
          "Generally when you receive the contract. Note the delivery date and check the contract for the exact rule in your state.",
      },
      {
        question: "Can I cancel after the free look ends?",
        answer:
          "Yes, but surrender charges and possibly a market value adjustment would apply during the surrender period.",
      },
    ],
    sources: [NAIC, FINRA],
    related: [
      "annuity-surrender-charges",
      "annuity-liquidity-access",
      "how-do-annuities-work",
    ],
  },
];
