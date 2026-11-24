import type { Guide } from "@/content/guides";

/**
 * Annuity library, batch D: the product types, how they compare, and the "should I buy one" questions. Written from scratch for
 * Rare Legacy under the rules at the top of src/content/guides.ts: one question a guide, a short answer that stands on its own, a
 * named licensed author, and no carrier names, rates or guarantees. Each ends on the quiz (cta "quiz").
 * A new or changed guide, the tax passages above all, still goes past the advisors and compliance before it is merged.
 */

const FINRA = { label: "FINRA: Annuities", url: "https://www.finra.org/investors/investing/investment-products/annuities" };
const INVESTOR_GOV = {
  label: "Investor.gov: Annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities",
};
const INVESTOR_GOV_VA = {
  label: "Investor.gov: Variable annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/variable-annuities",
};
const IRS_410 = { label: "IRS Topic No. 410: Pensions and annuities", url: "https://www.irs.gov/taxtopics/tc410" };
const IRS_575 = { label: "IRS Publication 575: Pension and Annuity Income", url: "https://www.irs.gov/publications/p575" };
const IRS_590B = {
  label: "IRS Publication 590-B: Distributions from Individual Retirement Arrangements",
  url: "https://www.irs.gov/publications/p590b",
};
const IRS_ROLLOVERS = {
  label: "IRS: Rollovers of retirement plan and IRA distributions",
  url: "https://www.irs.gov/retirement-plans/plan-participant-employee/rollovers-of-retirement-plan-and-ira-distributions",
};
const NAIC = { label: "NAIC: Annuities consumer guide", url: "https://content.naic.org/consumer/annuities.htm" };
const NOLHGA = { label: "NOLHGA: State guaranty associations", url: "https://www.nolhga.com/" };
const SSA = { label: "Social Security: Retirement benefits", url: "https://www.ssa.gov/benefits/retirement/" };

const base = {
  category: "Retirement & annuities",
  author: "christian-pennachietti",
  published: "2026-11-24",
  updated: "2026-11-24",
  cta: "quiz",
} as const;

export const ANNUITY_GUIDES_D: Guide[] = [
  {
    ...base,
    slug: "3-types-of-annuities",
    title: "What are the three main types of annuities?",
    metaTitle: "The 3 Main Types of Annuities Explained | Rare Legacy Life",
    description:
      "Fixed, indexed and variable annuities explained in plain English: how each one grows, what risk you carry, and where income annuities fit in.",
    readMinutes: 6,
    answer:
      "The three main types of annuities are fixed, indexed and variable. A fixed annuity credits a declared interest rate. An indexed annuity credits interest tied to a market index, with a floor against losses and a limit on gains. A variable annuity invests in funds, so its value rises and falls with the market. Any of them can be used to create lifetime income.",
    sections: [
      {
        heading: "The three types side by side",
        paragraphs: [
          "All three are contracts with an insurance company. What sets them apart is how your money grows and who carries the market risk while it does.",
        ],
        table: {
          caption: "How the three main types compare",
          headers: ["Type", "How it grows", "Market risk to your value", "Regulated as"],
          rows: [
            ["Fixed", "A rate the insurer declares, often locked for a set term", "None from the market", "Insurance"],
            ["Indexed", "Interest based on an index, limited by a cap, participation rate or spread", "None from the market, but gains are limited", "Insurance"],
            ["Variable", "Returns of the funds you choose, called subaccounts", "Yes, you can lose money", "Insurance and a security"],
          ],
        },
      },
      {
        heading: "Fixed annuities",
        paragraphs: [
          "A fixed annuity is the simplest. The insurer credits a stated rate, and in a multi-year guaranteed annuity that rate holds for the whole term. You know what you will earn. The tradeoff is that the rate will not rise if markets do well, and leaving early usually brings a surrender charge.",
        ],
      },
      {
        heading: "Indexed annuities",
        paragraphs: [
          "An indexed annuity, also called a fixed indexed annuity, measures a market index over a period and credits interest based on the change. A cap, participation rate or spread limits how much of a gain you keep. In a down year you are typically credited zero rather than a loss. It suits people who want some growth potential without market losses, and who accept limited upside and a multi-year commitment.",
        ],
      },
      {
        heading: "Variable annuities",
        paragraphs: [
          "A variable annuity lets you invest in a menu of funds inside the contract. Your value can grow with the market and can fall with it. Because you carry investment risk, it is regulated as a security and sold with a prospectus. Fees are often higher, with mortality and expense charges, fund expenses and optional rider costs.",
        ],
      },
      {
        heading: "Where income annuities fit",
        bullets: [
          "An income annuity is less a fourth type than a use: you trade a lump sum for a stream of payments.",
          "An immediate annuity starts paying within about a year. A deferred income annuity starts later, at a date you choose.",
          "Fixed, indexed and variable annuities can also be turned into income later, through annuitization or an income rider.",
          "Any guarantee is backed by the claims-paying ability of the issuing insurer. Annuities are not FDIC insured.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which type of annuity is safest?",
        answer:
          "Fixed and indexed annuities do not lose value when the market falls, while variable annuities can. Their guarantees still depend on the insurer's claims-paying ability, so the company's financial strength matters too.",
      },
      {
        question: "Is a fixed indexed annuity the same as a variable annuity?",
        answer:
          "No. An indexed annuity tracks an index but is not invested in it, and it has a floor against market losses. A variable annuity is invested in funds and can lose value.",
      },
      {
        question: "Can I have more than one type?",
        answer:
          "Yes. Some people use a fixed annuity for a known rate, an indexed annuity for protected growth, and an income annuity for a paycheck. A licensed Rare Legacy advisor can compare options from several carriers.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, INVESTOR_GOV_VA],
    related: ["fixed-indexed-annuity", "myga-fixed-annuity", "income-annuity", "variable-vs-fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "immediate-vs-deferred-annuity",
    title: "Immediate vs. deferred annuity: what is the difference?",
    metaTitle: "Immediate vs. Deferred Annuity: Key Differences | Rare Legacy Life",
    description:
      "The difference between an immediate and a deferred annuity: when income starts, how each one grows, access to your money, and which situations suit each.",
    readMinutes: 6,
    answer:
      "The difference is timing. An immediate annuity turns a lump sum into income that starts within about a year of purchase. A deferred annuity lets your money grow for a period first, with income or withdrawals starting later. Immediate annuities suit people who need income now. Deferred annuities suit people still years from needing the money who want tax-deferred growth.",
    sections: [
      {
        heading: "How each one works",
        table: {
          caption: "Immediate and deferred annuities compared",
          headers: ["Feature", "Immediate annuity", "Deferred annuity"],
          rows: [
            ["When income starts", "Within about 12 months", "Years later, or when you choose"],
            ["How you pay", "Usually one lump sum", "A lump sum, or in some contracts several payments"],
            ["Growth phase", "None to speak of", "Grows tax-deferred until you take money out"],
            ["Access to money", "Usually little or none once income starts", "Often a free withdrawal amount each year, surrender charges above it"],
            ["Common types", "Single premium immediate annuity", "Fixed, indexed, variable, deferred income annuity"],
          ],
        },
      },
      {
        heading: "When an immediate annuity makes sense",
        bullets: [
          "You are retired or about to be and have a gap between your expenses and your guaranteed income.",
          "You value a predictable check more than keeping full access to the lump sum.",
          "You are comfortable that, with a life-only payout, payments stop at death unless you add a refund or period-certain feature.",
        ],
      },
      {
        heading: "When a deferred annuity makes sense",
        bullets: [
          "You are still working or several years from needing the money.",
          "You want growth that is not taxed until you withdraw it.",
          "You want the choice of taking income later, by annuitizing or through an income rider, or simply keeping the money as a protected reserve.",
          "You can leave the money in place through the surrender period, which often runs several years.",
        ],
      },
      {
        heading: "Taxes and timing",
        paragraphs: [
          "With either type, earnings are taxed as ordinary income when they come out. Withdrawals of earnings before age 59½ generally bring a 10% additional federal tax unless an exception applies. With an immediate annuity bought with after-tax money, part of each payment is treated as a return of your own premium and is not taxed. Rules vary, so confirm your situation with a tax professional.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a deferred annuity become an immediate one?",
        answer:
          "In effect, yes. Many deferred annuities can be annuitized into a payment stream, or you can take income through a rider, once the contract allows it.",
      },
      {
        question: "Which pays more income, immediate or deferred?",
        answer:
          "For the same premium, waiting usually means a higher payment, because the money grows longer and the insurer expects to pay for fewer years. Your own figure depends on age, payout option and rates on the day you buy.",
      },
      {
        question: "Are both types guaranteed?",
        answer:
          "Their guarantees are backed by the claims-paying ability of the issuing insurer. Neither is FDIC insured.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, IRS_575],
    related: ["single-premium-immediate-annuity", "deferred-annuity", "income-annuity", "how-annuities-are-taxed"],
  },
  {
    ...base,
    slug: "single-premium-immediate-annuity",
    title: "What is a single premium immediate annuity (SPIA)?",
    metaTitle: "Single Premium Immediate Annuity (SPIA) Explained | Rare Legacy Life",
    description:
      "How a single premium immediate annuity turns one payment into income for life or a set period, the payout options, the tradeoffs and how it is taxed.",
    readMinutes: 6,
    answer:
      "A single premium immediate annuity, or SPIA, is a contract where you pay an insurance company one lump sum and it starts paying you income within about a year. Payments can last for your lifetime, for two lives, or for a set number of years. In exchange you generally give up access to the lump sum. It is the simplest way to create a pension-like check.",
    sections: [
      {
        heading: "How a SPIA works",
        bullets: [
          "You pay one premium, from savings, a CD, or a rollover from a retirement plan.",
          "You choose a payout option and how often you are paid, such as monthly.",
          "The insurer sets the payment from your age, the option you chose and interest rates on the day you buy.",
          "Once the contract is issued and any free-look period ends, the payment amount and the choice are usually fixed for good.",
        ],
      },
      {
        heading: "The main payout options",
        table: {
          caption: "Common SPIA payout options",
          headers: ["Option", "How long it pays", "What happens at death"],
          rows: [
            ["Life only", "Your lifetime", "Payments stop. This option pays the most per month."],
            ["Life with period certain", "Your lifetime, with a minimum number of years", "If you die early, a beneficiary receives the rest of the period"],
            ["Cash or installment refund", "Your lifetime", "A beneficiary receives any premium not yet paid out"],
            ["Joint and survivor", "As long as either of two people lives", "Payments continue to the survivor, sometimes at a reduced amount"],
            ["Period certain only", "A set number of years", "A beneficiary receives the rest of the period"],
          ],
        },
      },
      {
        heading: "The tradeoffs to weigh",
        bullets: [
          "Liquidity: most SPIAs cannot be cashed in. Keep enough savings elsewhere for emergencies.",
          "Inflation: a level payment buys less over time. Some contracts offer a yearly increase in exchange for a lower starting payment.",
          "Early death: with life only, payments stop at death. Refund and period-certain options cost some monthly income but protect heirs.",
          "Insurer strength: the guarantee is backed by the claims-paying ability of the issuing insurer, so choose a financially strong company.",
        ],
      },
      {
        heading: "How SPIA income is taxed",
        paragraphs: [
          "If you buy a SPIA with after-tax money, each payment is split. The part that returns your premium is not taxed, and the part that is earnings is taxed as ordinary income, using what the IRS calls an exclusion ratio. If you buy it with IRA or 401(k) money, the whole payment is generally taxable. Confirm your own situation with a tax professional.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much income would a SPIA pay me?",
        answer:
          "It depends on your age, single or joint life, the payout option and rates on the purchase day. Take the quiz and a licensed advisor will text you your own figures.",
      },
      {
        question: "Can I use IRA money to buy a SPIA?",
        answer:
          "Yes. A SPIA can be held inside an IRA, and its payments can help satisfy required minimum distributions from that IRA.",
      },
      {
        question: "Can I change my mind after buying?",
        answer:
          "Most states give a free-look period, often 10 to 30 days, to cancel for a refund. After that, a SPIA usually cannot be undone.",
      },
    ],
    sources: [FINRA, IRS_575, IRS_410],
    related: ["income-annuity", "immediate-vs-deferred-annuity", "life-only-vs-period-certain-vs-cash-refund", "how-much-does-an-annuity-pay"],
  },
  {
    ...base,
    slug: "deferred-annuity",
    title: "What is a deferred annuity, and how does it work?",
    metaTitle: "Deferred Annuity: How It Works and Who It Fits | Rare Legacy Life",
    description:
      "How a deferred annuity grows tax-deferred, the accumulation and payout phases, how you can take money out, and the surrender charges and taxes to know.",
    readMinutes: 6,
    answer:
      "A deferred annuity is an insurance contract that lets your money grow for a period before you take income or withdrawals. Growth is tax-deferred, so you pay no tax on earnings until you take them out. Later you can take withdrawals, turn the value into lifetime income, or leave it to a beneficiary. Early withdrawals above the free amount usually bring surrender charges.",
    sections: [
      {
        heading: "The two phases",
        paragraphs: [
          "A deferred annuity has an accumulation phase, when the money grows, and a payout phase, when you start drawing on it. The accumulation phase can last a few years or a few decades. There is no rule that you must ever turn it into income, though the contract will have a maturity age.",
        ],
      },
      {
        heading: "How it can grow",
        table: {
          caption: "The kinds of deferred annuity",
          headers: ["Kind", "How the value grows"],
          rows: [
            ["Fixed or multi-year guaranteed", "A declared interest rate, often locked for the term"],
            ["Fixed indexed", "Interest based on a market index, with a floor and a limit on gains"],
            ["Variable", "The returns of funds you choose, which can rise or fall"],
            ["Deferred income", "No cash value growth in the usual sense. It buys future income that starts on a set date."],
          ],
        },
      },
      {
        heading: "Ways to take money out",
        bullets: [
          "Free withdrawals: many contracts let you take a set share, often around 10% of the value, each year without a surrender charge.",
          "Full surrender: you can cash out, but during the surrender period a charge applies and some contracts add a market value adjustment.",
          "Annuitization: you turn the value into a stream of payments for life or a set period.",
          "Income rider: an optional feature, for a yearly fee, that pays lifetime withdrawals while you keep a cash value.",
        ],
      },
      {
        heading: "Taxes to know",
        paragraphs: [
          "Earnings are taxed as ordinary income when withdrawn, and for a non-qualified contract, withdrawals are generally treated as earnings first. Taking earnings before age 59½ usually brings a 10% additional federal tax unless an exception applies. A deferred annuity held inside an IRA follows the IRA's rules instead. Rules vary, so check with a tax professional.",
        ],
      },
      {
        heading: "Who it tends to fit",
        paragraphs: [
          "It tends to fit people in their 50s and 60s who have money they will not need for several years, want it protected or growing without yearly taxes, and may want the option of income later. It is a poor fit for an emergency fund or money you will need in the next few years.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I have to annuitize a deferred annuity?",
        answer:
          "Usually not. You can take withdrawals, use an income rider, or leave the value to a beneficiary. Check the contract's maturity date and what happens then.",
      },
      {
        question: "Is a deferred annuity insured?",
        answer:
          "It is not FDIC insured. Guarantees are backed by the claims-paying ability of the insurer, and state guaranty associations provide some protection up to limits that vary by state.",
      },
      {
        question: "What happens if I die during the accumulation phase?",
        answer:
          "Your beneficiary usually receives the contract value or a stated death benefit. Taxes on the earnings pass to them.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, IRS_575],
    related: ["immediate-vs-deferred-annuity", "annuity-surrender-charges", "how-annuities-are-taxed", "how-fixed-deferred-annuities-grow"],
  },
  {
    ...base,
    slug: "deferred-income-annuity",
    title: "What is a deferred income annuity (DIA)?",
    metaTitle: "Deferred Income Annuity (DIA) and QLACs Explained | Rare Legacy Life",
    description:
      "How a deferred income annuity buys income that starts years from now, why waiting raises the payment, the tradeoffs, and how a QLAC works inside an IRA.",
    readMinutes: 7,
    answer:
      "A deferred income annuity, or DIA, is a contract where you pay a premium now and the insurer pays you income starting on a future date, often years away. Because the insurer holds your money longer, each payment is larger than the same premium would buy today. You generally give up access to the premium. A version held in an IRA, called a QLAC, can delay required distributions.",
    sections: [
      {
        heading: "How a DIA works",
        bullets: [
          "You pay a lump sum, or with some contracts a series of payments, before income starts.",
          "You pick a start date, which may be a few years away or in your 80s.",
          "Income then lasts for life, two lives, or a set period, depending on the option you choose.",
          "There is usually no cash value you can withdraw before income begins.",
        ],
      },
      {
        heading: "Why waiting raises the payment",
        paragraphs: [
          "Three things work in your favor when you wait. The premium earns interest for longer. The insurer expects to pay for fewer years. And some buyers will not live to collect, which helps fund the payments of those who do. This is why people sometimes call a DIA longevity insurance: it pays most when you live a long time.",
          "As a hypothetical illustration only, a 60-year-old who starts income at 70 can expect a noticeably larger check than one who starts at 60 with the same premium. Your own figure depends on your age, the start date, the payout option and rates on the day you buy.",
        ],
      },
      {
        heading: "QLACs in general terms",
        paragraphs: [
          "A qualified longevity annuity contract, or QLAC, is a DIA bought with money from an IRA or an employer plan such as a 401(k). The amount in a QLAC is left out when your required minimum distributions are figured, up to a dollar limit set by law and adjusted for inflation. Income must start no later than age 85. That can lower required withdrawals in your 70s and provide income later in life.",
          "QLACs must meet specific IRS rules, and they generally cannot have a cash value. Confirm the current limit and your own tax situation with a tax professional.",
        ],
      },
      {
        heading: "The tradeoffs",
        bullets: [
          "Your premium is committed. Most DIAs cannot be cashed in.",
          "If you die before income starts, a basic life-only contract may pay nothing. A return-of-premium death benefit costs some income but protects heirs.",
          "Inflation erodes a level payment, especially one that starts years from now.",
          "The guarantee is backed by the claims-paying ability of the issuing insurer, so financial strength matters.",
        ],
      },
    ],
    faqs: [
      {
        question: "How is a DIA different from a deferred annuity with an income rider?",
        answer:
          "A DIA trades access for a higher, simpler income promise. A deferred annuity with a rider keeps a cash value you can reach, at the cost of a yearly rider fee and usually a lower income for the same premium.",
      },
      {
        question: "Can I change the start date?",
        answer:
          "Some contracts allow you to move the start date within a range, but many do not. Ask before you buy.",
      },
      {
        question: "How is DIA income taxed?",
        answer:
          "Bought with after-tax money, part of each payment is a tax-free return of premium. Bought inside an IRA or as a QLAC, payments are generally fully taxable as ordinary income.",
      },
    ],
    sources: [FINRA, IRS_590B, IRS_575],
    related: ["income-annuity", "deferred-annuity", "single-premium-immediate-annuity", "how-annuities-are-taxed"],
  },
  {
    ...base,
    slug: "variable-vs-fixed-indexed-annuity",
    title: "Variable vs. fixed indexed annuity: which is right for you?",
    metaTitle: "Variable vs. Fixed Indexed Annuity Compared | Rare Legacy Life",
    description:
      "Variable and fixed indexed annuities compared: market risk, growth potential, fees, regulation and access, so you can see which tradeoff fits your goals.",
    readMinutes: 7,
    answer:
      "A variable annuity invests your money in funds, so it can grow with the market and can lose value. A fixed indexed annuity credits interest based on an index, with a floor that protects against market losses and a limit on how much you can gain. Variable annuities offer more upside and more risk, often with higher fees. Indexed annuities trade upside for protection.",
    sections: [
      {
        heading: "The core difference: who carries the market risk",
        paragraphs: [
          "In a variable annuity, you do. Your value moves with the funds you pick. In a fixed indexed annuity, the insurer does. Your value does not go down because the market went down, but you only keep part of the gains in up years.",
        ],
      },
      {
        heading: "Side by side",
        table: {
          caption: "Variable and fixed indexed annuities compared",
          headers: ["Feature", "Variable annuity", "Fixed indexed annuity"],
          rows: [
            ["How it grows", "Returns of subaccount funds you choose", "Interest tied to an index, limited by caps, participation rates or spreads"],
            ["Market losses", "Yes, value can fall", "No, a down year is typically credited zero"],
            ["Upside", "Full fund returns, less fees", "Limited by the crediting method"],
            ["Typical fees", "Mortality and expense charges, fund expenses, admin fees, rider fees", "Often no yearly fee unless you add a rider"],
            ["Regulation", "A security, sold with a prospectus by registered representatives", "An insurance product regulated by state insurance departments"],
            ["Surrender charges", "Common", "Common"],
          ],
        },
      },
      {
        heading: "A hypothetical year in each",
        paragraphs: [
          "Imagine, purely as an illustration, an index up 15% in one year and down 15% the next. A variable annuity invested in similar funds might rise about 15% less fees, then fall about 15% plus fees. An indexed annuity with a hypothetical 8% cap would be credited 8% in the first year and zero in the second, keeping the first year's gain.",
        ],
      },
      {
        heading: "How to choose",
        bullets: [
          "Choose a variable annuity if you want market growth, accept losses, have maxed out other tax-deferred accounts, and understand the fees.",
          "Choose a fixed indexed annuity if protecting what you have matters more than capturing every gain.",
          "Either can carry an income rider for lifetime withdrawals, at a yearly cost. Compare what the rider guarantees, not only its name.",
          "Read the prospectus for a variable annuity, and the contract and disclosure for an indexed one, before you sign.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which has higher fees?",
        answer:
          "Variable annuities usually do, because of fund expenses and insurance charges. Indexed annuities often have no yearly fee unless you add a rider, though their cost shows up as limited upside.",
      },
      {
        question: "Can I lose money in a fixed indexed annuity?",
        answer:
          "Not from a market drop. You can lose value from surrender charges on early withdrawals and from rider fees.",
      },
      {
        question: "Which is better for retirement income?",
        answer:
          "Either can carry an income rider. Compare what each rider guarantees and what it costs, because the rider, not the growth engine, usually decides the income.",
      },
    ],
    sources: [INVESTOR_GOV_VA, FINRA],
    related: ["fixed-indexed-annuity", "3-types-of-annuities", "indexed-vs-fixed-annuity", "can-you-lose-money-in-an-annuity"],
  },
  {
    ...base,
    slug: "indexed-vs-fixed-annuity",
    title: "Indexed vs. fixed annuity: what is the difference?",
    metaTitle: "Indexed vs. Fixed Annuity: How They Compare | Rare Legacy Life",
    description:
      "How a fixed indexed annuity and a traditional fixed annuity differ: how interest is credited, predictability, upside, fees and which fits which goals.",
    readMinutes: 6,
    answer:
      "A fixed annuity credits a declared interest rate, so you know what you will earn for the guarantee period. An indexed annuity credits interest based on a market index, within limits, and credits zero in a down year. Both protect your value from market losses. The fixed annuity gives certainty. The indexed annuity gives a chance at more in good years and less in flat ones.",
    sections: [
      {
        heading: "How each credits interest",
        table: {
          caption: "Fixed and indexed annuities compared",
          headers: ["Feature", "Fixed annuity", "Fixed indexed annuity"],
          rows: [
            ["Interest", "A stated rate, often locked for 3 to 10 years", "Based on an index's change, limited by a cap, participation rate or spread"],
            ["Predictability", "High: you know the rate in advance", "Lower: interest varies year to year"],
            ["Down market", "Rate still credited", "Typically zero for that period, no loss"],
            ["Strong market", "Rate still credited, no more", "May earn more than a fixed rate, up to the limit"],
            ["Riders", "Few", "Income and death-benefit riders are common, for a fee"],
          ],
        },
      },
      {
        heading: "A hypothetical comparison",
        paragraphs: [
          "Suppose, as a made-up example, a fixed annuity credits a hypothetical 5% every year. An indexed annuity with a hypothetical 9% cap might credit 9% in a strong year, 3% in a modest year and 0% in a down year. Over time the indexed annuity could come out ahead or behind. Nobody can tell you in advance which.",
        ],
      },
      {
        heading: "Which fits which goal",
        bullets: [
          "A fixed annuity fits people who want to know exactly what they will earn, such as someone moving money from maturing CDs.",
          "An indexed annuity fits people who want protection from losses and are willing to accept uneven returns for growth potential.",
          "An indexed annuity is often the vehicle for an income rider. If lifetime income is the goal, compare the rider's terms directly.",
          "Both have surrender periods. Match the term to when you may need the money.",
        ],
      },
      {
        heading: "What to ask before choosing",
        bullets: [
          "For a fixed annuity: the guaranteed rate, the term, free withdrawals and what happens at the end of the term.",
          "For an indexed annuity: the crediting method, whether limits can change at renewal and their stated minimums, and any rider costs.",
          "For both: the insurer's financial strength and the full surrender schedule.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an indexed annuity riskier than a fixed annuity?",
        answer:
          "Neither loses value from a market drop. The indexed annuity's risk is uneven interest, including years of zero, while a fixed annuity's risk is missing out when markets rise.",
      },
      {
        question: "Are both insurance products?",
        answer:
          "Yes. Both are insurance contracts regulated by state insurance departments. Their guarantees are backed by the claims-paying ability of the issuing insurer, and neither is FDIC insured.",
      },
      {
        question: "Can I split money between both?",
        answer:
          "Yes. Some people use a fixed annuity for a known return on part of their savings and an indexed annuity for protected growth on another part.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, NAIC],
    related: ["myga-vs-fixed-indexed-annuity", "fixed-indexed-annuity", "myga-fixed-annuity", "variable-vs-fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "ira-vs-annuity",
    title: "IRA vs. annuity: what is the difference, and can you have both?",
    metaTitle: "IRA vs. Annuity: Differences and Using Both | Rare Legacy Life",
    description:
      "An IRA is a tax account and an annuity is a contract. How they differ, how an annuity can sit inside an IRA, and why tax deferral does not double up.",
    readMinutes: 6,
    answer:
      "An IRA is a type of tax-advantaged account. An annuity is a contract with an insurance company. They are not opposites: an annuity can be held inside an IRA, just as funds or CDs can. An annuity in an IRA follows IRA tax rules and gets no extra tax deferral. The reason to use one there is for protection or lifetime income, not taxes.",
    sections: [
      {
        heading: "Account vs. product",
        paragraphs: [
          "Think of an IRA as a container with tax rules attached. What goes inside can be stocks, funds, CDs or an annuity. An annuity is one of the things you can put in the container, or you can own one outside an IRA with after-tax money, which is called a non-qualified annuity.",
        ],
        table: {
          caption: "IRA and annuity compared",
          headers: ["Feature", "IRA", "Annuity outside an IRA"],
          rows: [
            ["What it is", "A tax-advantaged account", "An insurance contract"],
            ["Contribution limits", "Yearly limits set by the IRS", "No IRS contribution limit, though insurers set maximums"],
            ["Tax on growth", "Deferred (traditional) or tax-free if rules are met (Roth)", "Deferred until withdrawn"],
            ["Required minimum distributions", "Yes for traditional IRAs", "No"],
            ["Guarantees", "None, unless what is inside has them", "Guarantees backed by the insurer"],
          ],
        },
      },
      {
        heading: "Tax deferral does not double",
        paragraphs: [
          "A traditional IRA already defers taxes. Putting an annuity inside it adds nothing on the tax side. FINRA and the SEC both point this out, because some buyers have been sold annuities in IRAs on the strength of tax deferral alone.",
          "There can still be good reasons to own an annuity in an IRA: protection from market losses, a guaranteed rate, or income you cannot outlive. Weigh those against any fees and the surrender period.",
        ],
      },
      {
        heading: "How the rules work inside an IRA",
        bullets: [
          "Withdrawals from a traditional IRA annuity are generally taxed as ordinary income.",
          "Withdrawals before age 59½ generally bring a 10% additional federal tax unless an exception applies.",
          "Required minimum distributions still apply. Annuity income or free withdrawals can often be used to meet them.",
          "Moving IRA money into an annuity should be done as a direct transfer or rollover to avoid tax. Check the IRS rollover rules.",
        ],
      },
      {
        heading: "When owning one outside an IRA makes sense",
        paragraphs: [
          "A non-qualified annuity can make sense for someone who has already used their IRA and workplace plan limits and has more savings they want to grow tax-deferred or turn into income. Earnings are still taxed as ordinary income when withdrawn. Confirm your situation with a tax professional.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I roll my IRA into an annuity?",
        answer:
          "Yes. You can move IRA money into an annuity held as an IRA, usually by direct transfer, without triggering tax. The annuity then follows IRA rules.",
      },
      {
        question: "Can a Roth IRA hold an annuity?",
        answer:
          "Yes. If Roth rules are met, qualified withdrawals are tax-free. The annuity adds protection or income, not extra tax benefits.",
      },
      {
        question: "Is an IRA annuity FDIC insured?",
        answer:
          "No. Annuities are not FDIC insured, wherever they are held. Their guarantees are backed by the claims-paying ability of the issuing insurer.",
      },
    ],
    sources: [FINRA, IRS_590B, IRS_ROLLOVERS],
    related: ["401k-rollover-to-annuity", "how-annuities-are-taxed", "non-qualified-annuity", "tax-deferred-annuity-guide"],
  },
  {
    ...base,
    slug: "1035-exchange-annuity",
    title: "What is a 1035 exchange for an annuity?",
    metaTitle: "1035 Exchange for Annuities: Rules and Pitfalls | Rare Legacy Life",
    description:
      "How a 1035 exchange moves one annuity or life policy into another without tax, the like-kind rules, and the surrender charges and lost benefits to check.",
    readMinutes: 7,
    answer:
      "A 1035 exchange, named for a section of the tax code, lets you move the value of one annuity or life insurance policy into a new annuity without paying tax on the gain at the time. The money must go directly from one insurer to the other. It can make sense to get a better rate or lower fees, but surrender charges and lost benefits can outweigh the gain.",
    sections: [
      {
        heading: "The like-kind rules in general",
        paragraphs: [
          "The exchange has to be like for like, or move toward a product the law allows. In general terms:",
        ],
        table: {
          caption: "Common exchanges allowed under Section 1035",
          headers: ["From", "To", "Generally allowed?"],
          rows: [
            ["Annuity", "Annuity", "Yes"],
            ["Life insurance", "Annuity", "Yes"],
            ["Life insurance", "Life insurance", "Yes"],
            ["Annuity or life insurance", "Qualified long-term care contract", "Yes"],
            ["Annuity", "Life insurance", "No"],
          ],
        },
      },
      {
        heading: "How the exchange is done",
        bullets: [
          "The owner, and usually the annuitant, generally need to stay the same on both contracts.",
          "The new insurer requests the money directly from the old one. If you take a check yourself, it is a taxable withdrawal, not an exchange.",
          "Your original cost basis carries over to the new contract, so the deferred gain is still taxed later when you withdraw it.",
          "Partial exchanges are possible, but follow extra IRS rules about later withdrawals. Confirm with a tax professional.",
          "IRA annuities move by trustee-to-trustee transfer under IRA rules rather than a 1035 exchange.",
        ],
      },
      {
        heading: "What to check before you exchange",
        bullets: [
          "Surrender charges on the old contract. Ask for the exact dollar charge today.",
          "A new surrender period on the new contract, which restarts the clock.",
          "Benefits you would give up, such as an income rider's built-up value, an enhanced death benefit, or a high guaranteed minimum rate on an older contract.",
          "Any bonus on the new contract, and what it costs in longer surrender terms or lower crediting.",
          "Fees on both contracts, side by side.",
        ],
      },
      {
        heading: "When an exchange tends to make sense",
        paragraphs: [
          "An exchange can be worth it when the old contract is out of its surrender period, pays a low renewal rate, has fees you no longer need, or does not meet a new goal such as lifetime income. It deserves a hard look when a salesperson recommends replacing a contract that is still in surrender. Many states require a replacement form that compares the two contracts. Read it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a 1035 exchange taxable?",
        answer:
          "Done correctly, no tax is due at the time of the exchange. The deferred gain carries into the new contract and is taxed when you later withdraw it.",
      },
      {
        question: "Can I exchange an annuity into life insurance?",
        answer:
          "Generally no. Section 1035 allows life insurance into an annuity, but not an annuity into life insurance.",
      },
      {
        question: "Do I lose my surrender period progress?",
        answer:
          "Usually yes. The new contract has its own surrender schedule that starts on the exchange date, and the old contract may charge you to leave.",
      },
    ],
    sources: [FINRA, IRS_575, NAIC],
    related: ["annuity-surrender-charges", "how-annuities-are-taxed", "annuity-bonus-explained", "how-to-choose-an-annuity-advisor"],
  },
  {
    ...base,
    slug: "where-to-buy-an-annuity",
    title: "Where can you buy an annuity?",
    metaTitle: "Where to Buy an Annuity: Agent, Advisor or Direct | Rare Legacy Life",
    description:
      "The main places to buy an annuity: independent agents, captive agents, banks, brokerages and insurers direct, and what to ask whichever route you choose.",
    readMinutes: 6,
    answer:
      "You can buy an annuity from an independent insurance agent, a captive agent who represents one company, a bank or brokerage, or in some cases directly from an insurer. An independent agent can compare contracts from several carriers. A captive agent offers one company's products. Wherever you buy, check the seller's license, the insurer's strength, and every fee and surrender charge.",
    sections: [
      {
        heading: "The main routes",
        table: {
          caption: "Where annuities are sold",
          headers: ["Where", "What you get", "What to watch"],
          rows: [
            ["Independent agent or agency", "Contracts from several insurers compared side by side", "Ask which carriers they represent and how they are paid"],
            ["Captive agent", "One insurer's products, often with deep product knowledge", "No comparison across companies"],
            ["Bank or credit union", "Convenience, often a limited menu", "Annuities sold at a bank are not FDIC insured"],
            ["Brokerage or financial advisor", "Variable annuities and some fixed products, sometimes fee-based versions", "Advisory fees on top of contract costs"],
            ["Direct from an insurer", "Some simple fixed or income annuities, sometimes online", "Little or no personal advice, a narrower choice"],
          ],
        },
      },
      {
        heading: "Why many people use an independent agent",
        paragraphs: [
          "Rates, caps, payout amounts and features differ from one insurer to the next, and they change often. An independent agent can shop several companies for the contract that fits your goal, whether that is a guaranteed rate, protected growth or lifetime income. A licensed Rare Legacy advisor can compare options from several carriers. Rare Legacy is licensed in 49 states, not including California.",
        ],
      },
      {
        heading: "How to check the seller",
        bullets: [
          "Look up the agent's insurance license with your state insurance department.",
          "For variable annuities, check the representative on FINRA BrokerCheck.",
          "Ask how they are paid. Most annuity agents are paid a commission by the insurer, built into the contract rather than charged to you separately.",
          "Ask whether the recommendation is in your best interest, which many states now require for annuity sales.",
        ],
      },
      {
        heading: "Questions to ask any seller",
        bullets: [
          "What is the insurer's financial strength rating?",
          "What is the surrender schedule, and how much can I withdraw each year without a charge?",
          "What fees apply, including riders?",
          "What happens to the contract when I die?",
          "Can I see the buyer's guide and disclosure, and how long is the free-look period?",
        ],
      },
    ],
    faqs: [
      {
        question: "Is it cheaper to buy an annuity directly from an insurer?",
        answer:
          "Not always. Many contracts have the same terms whether sold through an agent or not, because commissions are built in. Compare the actual rate, payout and surrender terms.",
      },
      {
        question: "Can I buy an annuity online?",
        answer:
          "Some simple contracts can be bought online. Most still involve a licensed agent completing the application and a suitability review.",
      },
      {
        question: "Does the place I buy affect how safe it is?",
        answer:
          "Safety depends on the issuing insurer, not the seller. Guarantees are backed by the insurer's claims-paying ability, with state guaranty association protection up to limits.",
      },
    ],
    sources: [NAIC, FINRA, NOLHGA],
    related: ["how-to-choose-an-annuity-advisor", "how-to-compare-fixed-annuity-rates", "are-annuities-safe", "annuity-fees-explained"],
  },
  {
    ...base,
    slug: "best-age-to-buy-an-annuity",
    title: "What is the best age to buy an annuity?",
    metaTitle: "Best Age to Buy an Annuity: How Timing Matters | Rare Legacy Life",
    description:
      "There is no single best age to buy an annuity. How your age, the type of annuity and your goal shape timing, with what tends to fit in your 50s, 60s and 70s.",
    readMinutes: 6,
    answer:
      "There is no single best age to buy an annuity. It depends on what you want it to do. Many people buy deferred annuities in their 50s and early 60s for protected growth, and income annuities in their mid-60s to 70s, when payments are higher because of age. Buying before 59½ means early withdrawals may carry a 10% additional federal tax.",
    sections: [
      {
        heading: "Timing depends on the goal",
        table: {
          caption: "How age and goal fit together",
          headers: ["Age range", "Common goal", "Annuity often considered"],
          rows: [
            ["50s", "Protect and grow savings for later", "Fixed or fixed indexed deferred annuity"],
            ["Early 60s", "Bridge to retirement or lock in protection near retirement", "Multi-year fixed, indexed annuity, deferred income annuity"],
            ["Mid-60s to 70s", "Turn savings into income", "Immediate annuity, or start income on a deferred contract"],
            ["70s and up", "Simple, higher income or longevity protection", "Immediate annuity, often with a refund feature"],
          ],
        },
      },
      {
        heading: "Why age changes income",
        paragraphs: [
          "For income annuities, the older you are when payments start, the higher each payment tends to be, because the insurer expects to pay for fewer years. That does not mean waiting is always better. Waiting means going without that income in the meantime, and rates on the day you buy matter too.",
        ],
      },
      {
        heading: "Age limits and tax lines to know",
        bullets: [
          "Before 59½: withdrawals of earnings generally bring a 10% additional federal tax, with some exceptions.",
          "Issue ages: many insurers stop selling certain contracts at a maximum age, often somewhere in the 80s.",
          "Required minimum distributions: for most people they now begin at 73. An IRA annuity's payments can help meet them.",
          "Surrender periods: the older you are, the more it matters that the surrender period ends while you still have time to use the money.",
          "Rules vary, so confirm your situation with a tax professional.",
        ],
      },
      {
        heading: "Signs the timing is right",
        bullets: [
          "You know roughly when you will need the money, and the surrender period ends before then.",
          "You have an emergency fund outside the annuity.",
          "You can name the job you want the annuity to do: protection, a known rate, or a paycheck.",
          "You have looked at your Social Security timing, since it is also a form of lifetime income.",
        ],
      },
    ],
    faqs: [
      {
        question: "Am I too old to buy an annuity at 80?",
        answer:
          "Not necessarily. Many insurers issue some annuities into the 80s, and an income annuity pays more at older ages. Keep surrender periods short and liquidity in mind.",
      },
      {
        question: "Is 50 too young?",
        answer:
          "Not for a deferred annuity meant to grow until retirement, as long as you will not need the money before 59½ and the surrender period ends.",
      },
      {
        question: "Should I wait for higher rates?",
        answer:
          "No one can time rates reliably. Some people split purchases over several years, a method often called laddering, to spread out rate timing.",
      },
    ],
    sources: [FINRA, IRS_590B, SSA],
    related: ["who-should-buy-an-annuity", "immediate-vs-deferred-annuity", "how-much-to-put-in-an-annuity", "social-security-and-annuities"],
  },
  {
    ...base,
    slug: "who-should-buy-an-annuity",
    title: "Who should buy an annuity, and who should not?",
    metaTitle: "Who Should Buy an Annuity (and Who Should Not) | Rare Legacy Life",
    description:
      "An honest look at who an annuity tends to fit and who it does not: income needs, risk comfort, liquidity, health, and the situations where to look elsewhere.",
    readMinutes: 6,
    answer:
      "An annuity tends to fit people near or in retirement who want protection from market losses, a guaranteed rate, or income they cannot outlive, and who can leave the money in place for years. It usually does not fit people who may need the money soon, have no emergency fund, carry high-interest debt, or want full market growth on everything they own.",
    sections: [
      {
        heading: "People an annuity often fits",
        bullets: [
          "Retirees whose Social Security and any pension do not cover their basic monthly bills.",
          "People who worry about outliving their savings, especially if long life runs in the family.",
          "Savers who lost sleep in past market drops and want part of their money protected.",
          "People moving money from maturing CDs who want a guaranteed rate for several years.",
          "Those who have already used their IRA and 401(k) limits and want more tax-deferred growth.",
          "A spouse who wants income to continue for the survivor.",
        ],
      },
      {
        heading: "People who should probably look elsewhere",
        bullets: [
          "Anyone who might need the money in the next few years. Surrender charges can be costly.",
          "Someone without an emergency fund. Keep several months of expenses liquid first.",
          "People carrying high-interest debt, which is usually better paid down.",
          "Younger savers who have not used workplace plans and IRAs, which come first for most people.",
          "People in poor health considering a life-only income annuity, which pays less in total if life is short. A refund option or another tool may fit better.",
          "Anyone being pressured to buy quickly or to replace a contract still in its surrender period.",
        ],
      },
      {
        heading: "Questions to ask yourself",
        table: {
          caption: "A quick self-check",
          headers: ["Question", "Leans toward an annuity", "Leans away"],
          rows: [
            ["Will I need this money within five years?", "No", "Yes"],
            ["Are my basic bills covered by guaranteed income?", "No, there is a gap", "Yes, fully"],
            ["How do I feel about market drops?", "I want part of my money protected", "I can ride them out"],
            ["Do I have savings outside this money?", "Yes", "No"],
          ],
        },
      },
      {
        heading: "Using only part of your savings",
        paragraphs: [
          "An annuity does not have to be all or nothing. Many people use it for part of their savings, enough to cover essential bills or protect a portion, and keep the rest invested and liquid. A licensed Rare Legacy advisor can compare options from several carriers and help you decide how much, if any, belongs in an annuity.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an annuity a good idea for someone with a pension?",
        answer:
          "Sometimes. If a pension and Social Security already cover your bills, you may need less guaranteed income, though an annuity could still protect savings or provide a known rate.",
      },
      {
        question: "Should I put all my savings in an annuity?",
        answer:
          "Rarely. Most people are better served by keeping an emergency fund and some liquid, growth-oriented savings alongside any annuity.",
      },
      {
        question: "What if I buy one and change my mind?",
        answer:
          "Most states give a free-look period, often 10 to 30 days, to cancel for a refund. After that, surrender charges usually apply.",
      },
    ],
    sources: [FINRA, NAIC, SSA],
    related: ["are-annuities-a-good-investment", "best-age-to-buy-an-annuity", "how-much-to-put-in-an-annuity", "annuity-free-look-period"],
  },
  {
    ...base,
    slug: "are-annuities-a-good-investment",
    title: "Are annuities a good investment?",
    metaTitle: "Are Annuities a Good Investment? Honest Pros & Cons | Rare Legacy Life",
    description:
      "An honest look at whether annuities are a good investment: what they do well, where they fall short, the costs, and how to tell if one fits your plan.",
    readMinutes: 7,
    answer:
      "Annuities are better thought of as insurance than as investments. They can be a good choice for protecting savings from market losses, earning a guaranteed rate, or creating income you cannot outlive. They are a poor choice for money you may need soon or for chasing the highest returns. Whether one is good for you depends on the job you need it to do.",
    sections: [
      {
        heading: "What annuities do well",
        bullets: [
          "Lifetime income: an income annuity or rider can pay as long as you live, which no ordinary investment promises.",
          "Protection: fixed and indexed annuities do not lose value when the market falls.",
          "Known rates: a multi-year fixed annuity locks a rate for the full term.",
          "Tax deferral: growth outside an IRA is not taxed until withdrawn.",
          "Peace of mind: a predictable check can make spending in retirement easier.",
        ],
      },
      {
        heading: "Where they fall short",
        bullets: [
          "Liquidity: surrender charges apply to withdrawals above the free amount during the surrender period, often several years.",
          "Limited upside: indexed annuities cap gains, and fixed annuities will not rise with markets.",
          "Costs: variable annuities and riders carry yearly fees that reduce returns.",
          "Taxes: earnings come out as ordinary income, not at capital gains rates, and withdrawals before 59½ generally bring a 10% additional federal tax.",
          "Complexity: crediting methods and riders can be hard to compare.",
          "Inflation: a level payment buys less over time.",
        ],
      },
      {
        heading: "Comparing an annuity to other choices",
        table: {
          caption: "How annuities compare with common alternatives",
          headers: ["Option", "Protection from loss", "Growth potential", "Access", "Lifetime income"],
          rows: [
            ["CD", "Yes, FDIC insured up to limits", "Low", "Penalty for early withdrawal", "No"],
            ["Stock and bond funds", "No", "Higher", "Generally high", "No"],
            ["Fixed annuity", "Yes, backed by the insurer", "Low to moderate", "Limited during surrender period", "Optional"],
            ["Indexed annuity", "Yes, backed by the insurer", "Moderate, capped", "Limited during surrender period", "Optional, often by rider"],
            ["Income annuity", "Yes, backed by the insurer", "None, it pays income", "Usually none", "Yes"],
          ],
        },
      },
      {
        heading: "How to judge one for yourself",
        paragraphs: [
          "Start with the job. If you want lifetime income or protection for part of your savings, an annuity may do that better than anything else. If you want the highest long-term growth, it probably will not. Then compare the specific contract: the insurer's strength, the surrender schedule, the fees and what is actually guaranteed. Guarantees are backed by the claims-paying ability of the issuing insurer, and annuities are not FDIC insured.",
          "Be wary of anyone who says annuities are always good or always bad. Both views skip the question of what you need.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do some financial writers dislike annuities?",
        answer:
          "Some contracts carry high fees, long surrender periods or complex terms, and some have been sold to people they did not fit. Simple, well-matched contracts avoid most of those problems.",
      },
      {
        question: "Do annuities beat the stock market?",
        answer:
          "Generally not over long periods, and they are not designed to. They trade some growth for protection, guarantees or income.",
      },
      {
        question: "Are annuities a scam?",
        answer:
          "No. They are regulated insurance contracts. Like any financial product, a specific contract can be a poor fit, so read the disclosure and buyer's guide before signing.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV, NAIC],
    related: ["who-should-buy-an-annuity", "can-you-lose-money-in-an-annuity", "annuity-fees-explained", "annuity-vs-cd"],
  },
  {
    ...base,
    slug: "can-an-annuity-replace-a-pension",
    title: "Can an annuity replace a pension?",
    metaTitle: "Can an Annuity Replace a Pension? How It Works | Rare Legacy Life",
    description:
      "How an income annuity can create a pension-like paycheck from savings, how it differs from a workplace pension, and what to weigh before you buy one.",
    readMinutes: 6,
    answer:
      "An income annuity can do much of what a pension does. You give an insurer a lump sum, and it pays you a set amount every month for life, or for two lives. That is why it is often called a do-it-yourself pension. The differences are that you fund it yourself, it is backed by an insurer rather than an employer, and inflation protection is usually optional.",
    sections: [
      {
        heading: "How an annuity creates pension-like income",
        paragraphs: [
          "A traditional pension pays a monthly check for life, often with an option to continue payments to a spouse. An immediate annuity, or a deferred income annuity that starts later, works the same way: you trade a lump sum for guaranteed income. Many people use part of their savings, or a 401(k) rollover, to fill the gap between Social Security and their basic bills.",
        ],
      },
      {
        heading: "Pension and annuity compared",
        table: {
          caption: "Workplace pension and income annuity",
          headers: ["Feature", "Workplace pension", "Income annuity"],
          rows: [
            ["Who funds it", "Your employer, sometimes with your contributions", "You, with a lump sum or rollover"],
            ["Who backs the payments", "The employer's plan, with federal insurance for many private plans", "The issuing insurer, with state guaranty associations up to limits"],
            ["Spouse protection", "Joint and survivor options", "Joint and survivor options"],
            ["Inflation adjustments", "Some plans", "Optional in some contracts, with a lower starting payment"],
            ["Access to the lump sum", "Usually none", "Usually none once income starts"],
          ],
        },
      },
      {
        heading: "Things to decide",
        bullets: [
          "How much income you need to cover essential bills after Social Security.",
          "Single life or joint life, if you have a spouse who depends on the income.",
          "Whether to add a refund or period-certain feature so heirs receive something if you die early.",
          "When income should start. Waiting usually means a larger check.",
          "Whether to add a yearly increase to help with inflation.",
        ],
      },
      {
        heading: "If you are offered a pension lump sum",
        paragraphs: [
          "Some employers offer a lump sum instead of the monthly pension. Compare carefully: the pension's monthly amount may be more than the same lump sum would buy in an annuity, or less, depending on your age and rates at the time. Moving a lump sum into an IRA or an annuity should be done as a direct rollover to avoid tax. Confirm the tax rules with a tax professional.",
          "A licensed Rare Legacy advisor can compare options from several carriers. Take the quiz, and we will text you your own figures.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an annuity as safe as a pension?",
        answer:
          "They are protected differently. Annuity guarantees are backed by the claims-paying ability of the issuing insurer, with state guaranty association coverage up to limits. Neither is FDIC insured.",
      },
      {
        question: "Should I take my pension as a lump sum and buy an annuity?",
        answer:
          "Sometimes the pension's monthly payment is the better deal, sometimes not. Compare the pension offer with annuity quotes before deciding, and keep survivor needs in mind.",
      },
      {
        question: "How is pension-style annuity income taxed?",
        answer:
          "Income from an annuity bought with pre-tax money is generally fully taxable. If bought with after-tax money, part of each payment is a tax-free return of premium.",
      },
    ],
    sources: [IRS_575, NOLHGA, SSA],
    related: ["income-annuity", "single-premium-immediate-annuity", "joint-and-survivor-annuity", "retirement-paycheck-strategy"],
  },
];
