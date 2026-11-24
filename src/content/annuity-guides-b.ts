import type { Guide } from "@/content/guides";

/**
 * Annuity library, batch B: bonuses, fees, how fixed and indexed rates are set, how to compare and lock in a rate, how
 * tax-deferred growth works, and how insurers earn money on annuities. Written from scratch for Rare Legacy under the rules at
 * the top of src/content/guides.ts: one question a guide, a short answer that stands on its own, a named licensed author, and no
 * carrier names, rates or guarantees. Every number below is a hypothetical illustration, labelled as such. Each ends on the quiz.
 * A new or changed guide, the tax passages above all, still goes past the advisors and compliance before it is merged.
 */

const FINRA = { label: "FINRA: Annuities", url: "https://www.finra.org/investors/investing/investment-products/annuities" };
const INVESTOR_GOV = {
  label: "Investor.gov: Annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/annuities",
};
const INVESTOR_GOV_VARIABLE = {
  label: "Investor.gov: Variable annuities",
  url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/insurance-products/variable-annuities",
};
const IRS_410 = { label: "IRS Topic No. 410: Pensions and annuities", url: "https://www.irs.gov/taxtopics/tc410" };
const IRS_575 = { label: "IRS Publication 575: Pension and Annuity Income", url: "https://www.irs.gov/publications/p575" };
const NAIC = { label: "NAIC: Consumer guide to annuities", url: "https://content.naic.org/consumer/annuities.htm" };
const NOLHGA = { label: "NOLHGA: State guaranty associations", url: "https://www.nolhga.com/" };
const FDIC = { label: "FDIC: Deposit insurance", url: "https://www.fdic.gov/resources/deposit-insurance" };

const base = {
  category: "Retirement & annuities",
  author: "christian-pennachietti",
  published: "2026-11-24",
  updated: "2026-11-24",
  cta: "quiz",
} as const;

export const ANNUITY_GUIDES_B: Guide[] = [
  {
    ...base,
    slug: "annuity-bonus-explained",
    title: "What is an annuity bonus, and is it free money?",
    metaTitle: "Annuity Bonus Explained: How It Works and What It Costs | Rare Legacy Life",
    description:
      "What an annuity bonus is, the two main kinds, how insurers pay for them, and the questions to ask before a bonus sways which contract you choose.",
    readMinutes: 6,
    answer:
      "An annuity bonus is an extra amount an insurer adds to your contract, usually a percentage of your premium or of an income value. It is not free money. Insurers typically pay for bonuses with longer surrender periods, lower caps or rates, or vesting schedules that take the bonus back if you leave early. Judge the whole contract, not the bonus alone.",
    sections: [
      {
        heading: "What a bonus is",
        paragraphs: [
          "Some fixed and fixed indexed annuities advertise a bonus, an amount the insurer adds on top of what you put in. A contract might add a hypothetical 7% to your first-year premium, so a $100,000 deposit starts with a credited value of $107,000.",
          "That sounds simple, but the word bonus covers two very different things. One adds to money you can actually withdraw. The other adds only to a number used to calculate future income. Knowing which one you are looking at is the first step.",
        ],
        table: {
          caption: "Two kinds of annuity bonus",
          headers: ["Type", "What it increases", "Can you withdraw it?"],
          rows: [
            ["Premium bonus", "Your contract's actual account value", "Often yes, once it vests and after surrender charges end"],
            ["Income-rider bonus", "A benefit base used only to figure lifetime income", "No. It is not cash and cannot be withdrawn as a lump sum"],
          ],
        },
      },
      {
        heading: "How insurers pay for a bonus",
        paragraphs: [
          "An insurer has to fund a bonus from somewhere. It usually does that by changing other terms of the contract, so the bonus is part of a trade.",
        ],
        bullets: [
          "A longer surrender period, which keeps your money committed for more years.",
          "Higher or longer-lasting surrender charges if you withdraw early.",
          "Lower caps, participation rates or fixed rates than a similar contract without a bonus.",
          "A vesting schedule, so the bonus becomes yours gradually and can be recaptured if you surrender early.",
          "For income-rider bonuses, a yearly rider charge taken from your account value.",
        ],
      },
      {
        heading: "When a bonus can make sense",
        paragraphs: [
          "A bonus is not bad in itself. If you are confident the money will stay put for the full surrender period, a bonus contract can compare well against a no-bonus contract. Some people also use a premium bonus to offset a surrender charge they pay when leaving an older contract, though that only helps if the new contract is a better fit on its own terms.",
          "The fair test is to compare projected values at the end of the surrender period, using the same assumptions, for a bonus contract and a no-bonus contract. Sometimes the no-bonus contract comes out ahead because its ongoing crediting is stronger.",
        ],
      },
      {
        heading: "Questions to ask before you buy",
        bullets: [
          "Is this a premium bonus or an income-rider bonus?",
          "Does the bonus vest, and on what schedule?",
          "How long is the surrender period compared with a similar contract with no bonus?",
          "Are caps, participation rates or fixed rates lower because of the bonus?",
          "Is there a rider fee, and is it charged on the account value or the benefit base?",
        ],
        paragraphs: [
          "Any guarantee in the contract, including a guaranteed bonus, is backed by the claims-paying ability of the issuing insurer. Annuities are not FDIC insured.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is an annuity bonus taxable when it is credited?",
        answer:
          "Inside a deferred annuity, credited amounts generally grow tax-deferred, so a bonus is not usually taxed when it is added. It is taxed as ordinary income when withdrawn as part of the gain. Confirm the details with a tax professional.",
      },
      {
        question: "Can I lose my bonus?",
        answer:
          "Yes. Many contracts recapture all or part of a premium bonus if you surrender early or withdraw more than the free amount. Income-rider bonuses are lost if you cash out instead of taking income.",
      },
      {
        question: "Is a bigger bonus always better?",
        answer:
          "No. A larger bonus often comes with a longer surrender period or weaker crediting. Compare total projected value over the same period, not the headline bonus.",
      },
    ],
    sources: [FINRA, NAIC],
    related: ["premium-bonus-vs-income-rider-bonus", "annuity-bonus-vesting", "annuity-surrender-charges", "fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "premium-bonus-vs-income-rider-bonus",
    title: "Premium bonus vs income-rider bonus: what is the difference?",
    metaTitle: "Premium Bonus vs Income Rider Bonus on Annuities | Rare Legacy Life",
    description:
      "A premium bonus adds to your account value. An income-rider bonus adds to a number used only for lifetime income. Here is how each works and who each fits.",
    readMinutes: 6,
    answer:
      "A premium bonus adds money to your annuity's account value, which you may be able to withdraw once it vests and surrender charges end. An income-rider bonus adds to a benefit base, a calculation number used only to set lifetime income payments. You cannot cash out a benefit base. The right one depends on whether you want growth and access or future guaranteed income.",
    sections: [
      {
        heading: "Premium bonus: added to real money",
        paragraphs: [
          "A premium bonus is credited to your account value, the actual money in the contract. It earns interest along with the rest of your balance. If you later surrender after the surrender period, the vested bonus and the interest it earned are part of what you receive.",
          "The catch is that premium bonuses usually come with a vesting schedule and a longer surrender period, and the contract's caps or rates may be lower than a comparable no-bonus product.",
        ],
      },
      {
        heading: "Income-rider bonus: added to a calculation",
        paragraphs: [
          "An income rider is an optional feature that guarantees a stream of lifetime withdrawals. It tracks a separate figure, often called the benefit base or income base. An income-rider bonus increases that figure, sometimes along with a yearly roll-up percentage.",
          "The benefit base is not money you can take as a lump sum. It is multiplied by a payout percentage, set by your age when income starts, to decide your yearly income. If you walk away from the contract, you get the account value, not the benefit base.",
        ],
      },
      {
        heading: "Side by side",
        table: {
          caption: "Comparing the two bonus types",
          headers: ["Question", "Premium bonus", "Income-rider bonus"],
          rows: [
            ["What grows", "Account value", "Benefit base (income calculation only)"],
            ["Can you withdraw it as cash?", "Yes, once vested and outside surrender charges", "No"],
            ["Extra cost", "Usually longer surrender period or lower crediting", "A yearly rider fee"],
            ["Best suited to", "Growth with eventual access", "Turning savings into lifetime income later"],
            ["Lost if", "You surrender before it vests", "You cash out instead of taking income"],
          ],
        },
      },
      {
        heading: "A hypothetical example",
        paragraphs: [
          "Suppose two people each put $200,000 into an annuity. The first chooses a contract with a hypothetical 5% premium bonus, so the account value starts at $210,000. The second chooses a contract with an income rider that adds a hypothetical 10% bonus to the benefit base, so the benefit base starts at $220,000 while the account value starts at $200,000.",
          "If the second person later decides to cash out, they receive the account value, less any surrender charges and rider fees, not $220,000. The bigger number only matters if they use it for lifetime income. These figures are made up to show the mechanics and are not quotes.",
        ],
      },
      {
        heading: "How to choose",
        bullets: [
          "If you expect to turn the money into income within a set time, an income rider may be worth studying, fee included.",
          "If you want growth and the option to take the money later, look at account-value features, with or without a premium bonus.",
          "Compare the guaranteed income, not the bonus percentage. A smaller bonus with a higher payout percentage can produce more income.",
          "Guarantees depend on the claims-paying ability of the issuing insurer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can a contract have both kinds of bonus?",
        answer:
          "Some do. Read the illustration carefully and track the account value and the benefit base separately, since only the account value is cash.",
      },
      {
        question: "Does a rider fee come out of the benefit base?",
        answer:
          "The fee is often calculated as a percentage of the benefit base but deducted from the account value. That means it can reduce your cash value even in a year with no interest credited.",
      },
      {
        question: "Why is the benefit base growing faster than my account?",
        answer:
          "The benefit base often grows by a guaranteed roll-up rate and bonus, while the account value grows only by credited interest minus fees. The gap between them is normal and is not withdrawable money.",
      },
    ],
    sources: [FINRA, NAIC],
    related: ["annuity-bonus-explained", "annuity-bonus-vesting", "income-annuity", "annuity-fees-explained"],
  },
  {
    ...base,
    slug: "annuity-bonus-vesting",
    title: "How does annuity bonus vesting work?",
    metaTitle: "Annuity Bonus Vesting Schedules Explained | Rare Legacy Life",
    description:
      "What a bonus vesting schedule is, how recapture works if you leave early, how vesting differs from surrender charges, and how to read it in a contract.",
    readMinutes: 5,
    answer:
      "Bonus vesting means an annuity bonus becomes fully yours over time rather than all at once. Under a typical schedule, a growing share of the bonus vests each contract year. If you surrender or withdraw too much before it fully vests, the insurer can take back the unvested part. Vesting is separate from surrender charges, and both can apply at the same time.",
    sections: [
      {
        heading: "What vesting means",
        paragraphs: [
          "When an insurer adds a premium bonus, it often does not let you keep the whole bonus right away. Instead, the bonus vests on a schedule written into the contract. Until it is fully vested, part of it can be recaptured, meaning taken back, if you leave early.",
          "Vesting protects the insurer from paying a bonus to someone who deposits money and then pulls it out quickly. It is one of the ways a bonus is paid for.",
        ],
      },
      {
        heading: "A hypothetical vesting schedule",
        paragraphs: [
          "Schedules vary by contract. The example below is made up to show the idea. Assume a $10,000 bonus on a contract with a ten-year schedule.",
        ],
        table: {
          caption: "Hypothetical bonus vesting schedule",
          headers: ["Contract year", "Share vested", "Bonus you keep if you surrender"],
          rows: [
            ["1", "0%", "$0"],
            ["3", "20%", "$2,000"],
            ["5", "40%", "$4,000"],
            ["8", "70%", "$7,000"],
            ["10 and later", "100%", "$10,000"],
          ],
        },
      },
      {
        heading: "Vesting vs surrender charges",
        bullets: [
          "A surrender charge is a percentage of the amount you withdraw above the free withdrawal limit.",
          "Bonus recapture takes back the unvested part of the bonus.",
          "Both can apply to the same early surrender, so the total cost of leaving early can be larger than the surrender charge alone.",
          "Some contracts recapture the bonus only on full surrender. Others recapture a share on partial withdrawals too.",
          "Many contracts waive recapture at death, and some waive it for qualifying nursing home or terminal illness events. Check the contract.",
        ],
      },
      {
        heading: "A hypothetical early exit",
        paragraphs: [
          "Suppose someone deposits $100,000, receives a hypothetical $10,000 bonus, and surrenders in year five under the schedule above. Only 40% of the bonus has vested, so $6,000 is recaptured. If the contract also has a hypothetical 5% surrender charge in year five on the amount above the free withdrawal, that charge is taken as well. The two costs together can be larger than the bonus that looked so attractive at the start.",
          "Now suppose the same person waits until year ten. The bonus is fully vested and, on many contracts, surrender charges have ended. The bonus has done its job only because the money stayed put. That is the honest way to think about any bonus: it rewards people who are confident they will hold the contract for the full term.",
        ],
      },
      {
        heading: "How to read it in your contract",
        paragraphs: [
          "Look for a section called bonus recapture, vesting or similar. It should state the vesting percentage for each contract year and say which events trigger recapture. Ask whether interest earned on the bonus is also recaptured, since some contracts take back both.",
          "If the vesting schedule runs as long as the surrender period, assume the bonus is only fully yours if you stay the full term. Make sure you have other savings for emergencies so you are not forced to surrender early. Any guaranteed bonus depends on the claims-paying ability of the issuing insurer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do free withdrawals affect bonus vesting?",
        answer:
          "It depends on the contract. Many allow a yearly free withdrawal, often around a tenth of the value, without recapture, but some reduce the bonus proportionally. Read the recapture section.",
      },
      {
        question: "Does an income-rider bonus vest?",
        answer:
          "Income-rider bonuses usually do not vest into cash at all. They only increase the benefit base used to calculate lifetime income.",
      },
      {
        question: "What happens to an unvested bonus if I die?",
        answer:
          "Many contracts pay the full account value, including the bonus, as a death benefit. Others do not. Confirm the death-benefit terms before you buy.",
      },
    ],
    sources: [FINRA, NAIC],
    related: ["annuity-bonus-explained", "premium-bonus-vs-income-rider-bonus", "annuity-surrender-charges"],
  },
  {
    ...base,
    slug: "annuity-fees-explained",
    title: "What fees do annuities charge?",
    metaTitle: "Annuity Fees Explained: What You Pay and What You Don't | Rare Legacy Life",
    description:
      "The fees annuities can charge, from mortality and expense charges to rider fees and surrender charges, and which fees fixed annuities do not usually have.",
    readMinutes: 7,
    answer:
      "Annuity fees depend on the type. Variable annuities often carry mortality and expense charges, administrative fees, fund expenses and optional rider fees, which can add up. Fixed and fixed indexed annuities usually have no yearly management fee. Their main costs are surrender charges for early withdrawals and fees for any optional riders you choose. Ask for every charge in writing before you buy.",
    sections: [
      {
        heading: "Fees on variable annuities",
        paragraphs: [
          "A variable annuity is a security that invests in subaccounts, similar to mutual funds. Because the insurer offers death benefits and administration on top of investment management, there are several layers of cost.",
        ],
        table: {
          caption: "Common variable annuity charges",
          headers: ["Charge", "What it pays for", "How it is taken"],
          rows: [
            ["Mortality and expense (M&E)", "Insurance guarantees such as the basic death benefit, plus insurer costs", "A yearly percentage of account value"],
            ["Administrative fee", "Record keeping and statements", "A flat yearly amount or a percentage"],
            ["Fund expenses", "Managing the subaccounts", "Built into each subaccount's returns"],
            ["Rider fees", "Optional living or enhanced death benefits", "A yearly percentage, often of a benefit base"],
            ["Surrender charge", "Early withdrawals during the surrender period", "A percentage of the amount withdrawn"],
          ],
        },
      },
      {
        heading: "What fixed and fixed indexed annuities charge",
        paragraphs: [
          "Fixed annuities, including multi-year guaranteed annuities, and fixed indexed annuities work differently. The insurer sets a rate, cap or participation rate that already reflects its costs. You generally do not see a separate yearly management or M&E fee.",
        ],
        bullets: [
          "Surrender charges apply if you withdraw more than the free amount during the surrender period.",
          "A market value adjustment, on some contracts, can raise or lower what you receive on an early surrender depending on interest rates.",
          "Optional income or enhanced death-benefit riders carry a yearly fee if you add them.",
          "Base fixed contracts with no riders often have no ongoing fee at all.",
        ],
      },
      {
        heading: "Fees you may not see as a line item",
        paragraphs: [
          "Some costs are built into the product rather than charged separately. On a fixed indexed annuity, a lower cap or participation rate is how the insurer covers costs and profit. On a fixed annuity, the rate offered is lower than what the insurer earns on its own investments, and that difference is how it is paid. That is normal, and it is disclosed through the rate itself.",
          "Advisors are typically paid a commission by the insurer when you buy a fixed or indexed annuity. The commission does not come out of your premium, but it is one reason surrender periods exist. You are entitled to ask how your advisor is paid.",
        ],
      },
      {
        heading: "A hypothetical cost comparison",
        paragraphs: [
          "Picture two $100,000 contracts. The first is a variable annuity with a hypothetical 1.25% M&E charge, 0.15% administrative fee, 0.75% average fund expense and a 1% income rider. That is 3.15% a year, or about $3,150 in the first year, whatever the market does. The second is a fixed indexed annuity with no rider. It has no yearly fee, but its cap limits what you can earn. Neither is right for everyone. The point is to know what you are paying for and whether you need it.",
        ],
      },
      {
        heading: "How to compare costs",
        bullets: [
          "Ask for the total yearly cost as a percentage, including every rider.",
          "Ask for the surrender charge schedule year by year.",
          "Ask whether there is a market value adjustment.",
          "Decide whether you need each rider. A rider you never use is a cost with no benefit.",
          "Remember that guarantees are backed by the claims-paying ability of the issuing insurer, and annuities are not FDIC insured.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do fixed annuities have hidden fees?",
        answer:
          "A base fixed annuity usually has no yearly fee. Its costs are built into the rate and shown through surrender charges, which are disclosed in the contract.",
      },
      {
        question: "What is an M&E charge?",
        answer:
          "A mortality and expense charge is a yearly fee on many variable annuities that pays for insurance guarantees and the insurer's costs. It is taken as a percentage of your account value.",
      },
      {
        question: "Can I avoid rider fees?",
        answer:
          "Yes, by not adding optional riders. Many fixed and indexed contracts can be bought without them. Only add a rider if its guarantee solves a real need.",
      },
    ],
    sources: [INVESTOR_GOV_VARIABLE, FINRA, NAIC],
    related: ["annuity-surrender-charges", "how-insurance-companies-make-money-on-annuities", "fixed-indexed-annuity", "variable-vs-fixed-indexed-annuity"],
  },
  {
    ...base,
    slug: "fixed-index-annuity-rates-explained",
    title: "How do fixed indexed annuity rates work? Caps, participation rates and spreads",
    metaTitle: "Fixed Index Annuity Rates: Caps, Par Rates, Spreads | Rare Legacy Life",
    description:
      "How caps, participation rates and spreads decide indexed interest, how crediting periods work, why insurers reset them, and how to compare the levers.",
    readMinutes: 7,
    answer:
      "A fixed indexed annuity does not pay one interest rate. It credits interest from an index's change over a period, limited by levers the insurer sets: a cap on the most you can earn, a participation rate that credits a share of the gain, or a spread subtracted from the gain. In a down period you typically earn zero, not a loss. Insurers can reset these levers at renewal.",
    sections: [
      {
        heading: "The three main levers",
        paragraphs: [
          "Each index option in a contract uses one or more of these levers. The numbers below are hypothetical and only show how the math works.",
        ],
        table: {
          caption: "How each lever changes credited interest (hypothetical)",
          headers: ["Lever", "Rule", "Index up 12%", "Index up 4%"],
          rows: [
            ["10% cap", "You earn the gain up to the cap", "10%", "4%"],
            ["50% participation", "You earn half of the gain", "6%", "2%"],
            ["3% spread", "You earn the gain minus 3%", "9%", "1%"],
            ["Any of the above", "Index down", "0%", "0%"],
          ],
        },
      },
      {
        heading: "Crediting periods and methods",
        bullets: [
          "Annual point-to-point compares the index value on one contract anniversary with the next.",
          "Monthly averaging or monthly point-to-point methods measure the index more often, which can smooth or limit results in different ways.",
          "Some options use a two-year or longer period with different caps or participation.",
          "Most contracts also offer a fixed account that pays a declared rate with no index link.",
          "Index returns used for crediting usually exclude dividends.",
        ],
      },
      {
        heading: "Why the levers change",
        paragraphs: [
          "The insurer buys options on the index to fund your potential interest, using the yield from its bond portfolio. When interest rates rise, it has more budget and can often offer higher caps or participation. When option prices rise, often during volatile markets, the same budget buys less.",
          "Because of this, most contracts guarantee a lever only for the current crediting period. At each renewal, the insurer can set new levers, but never below the minimums stated in the contract. Ask what those minimums are, and ask how the insurer's renewal rates have compared with its new-money rates over time.",
        ],
      },
      {
        heading: "A hypothetical three-year run",
        paragraphs: [
          "Say an account starts at $100,000 in an annual point-to-point option with a hypothetical 8% cap. In year one the index rises 12%, so the account is credited 8% and grows to $108,000. In year two the index falls 15%, so the credit is zero and the account stays at $108,000. In year three the index rises 5%, so the account is credited 5% and grows to $113,400.",
          "Someone invested directly in the index would have seen a larger gain in year one, a real loss in year two and the full gain in year three, plus dividends. The indexed annuity gave up some upside in exchange for never giving back credited interest. These figures are invented to show the mechanics and are not a projection.",
        ],
      },
      {
        heading: "How to compare indexed options fairly",
        bullets: [
          "Compare like with like: annual point-to-point caps with other annual point-to-point caps.",
          "Ask for the guaranteed minimum cap or participation rate, not only the current one.",
          "Be cautious with newer custom indexes that show only back-tested history. Back-tests are hypothetical.",
          "Look at the surrender period and any rider fees alongside the levers, since a fee can offset interest in a flat year.",
          "Remember the floor protects against index losses, not against surrender charges or fees, and guarantees depend on the claims-paying ability of the issuing insurer.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a higher participation rate always better than a cap?",
        answer:
          "Not always. A high participation rate on a volatile custom index may credit less on average than a cap on a broad index. Compare guaranteed minimums and the index used.",
      },
      {
        question: "Can my cap go down after I buy?",
        answer:
          "Yes. Most contracts allow the insurer to change caps and participation rates at each renewal, within the minimums written into the contract.",
      },
      {
        question: "Do I earn the index's full return?",
        answer:
          "No. Credited interest is limited by the levers and usually excludes dividends. The tradeoff is protection from index losses.",
      },
    ],
    sources: [FINRA, INVESTOR_GOV],
    related: ["fixed-indexed-annuity", "myga-vs-fixed-indexed-annuity", "can-you-lose-money-in-an-annuity", "what-influences-fixed-annuity-rates"],
  },
  {
    ...base,
    slug: "what-influences-fixed-annuity-rates",
    title: "What influences fixed annuity rates?",
    metaTitle: "What Moves Fixed Annuity Rates Up and Down | Rare Legacy Life",
    description:
      "Why fixed annuity rates rise and fall: bond yields, the term you choose, surrender length, the insurer's goals and the size of your deposit, in plain terms.",
    readMinutes: 6,
    answer:
      "Fixed annuity rates mostly follow the yields insurers can earn on high-quality bonds and other fixed-income investments. When those yields rise, new annuity rates tend to rise, and when they fall, rates tend to follow. Other factors include the guarantee term, the surrender period, contract features, the deposit size and how much new business the insurer wants. Rates change often, sometimes weekly.",
    sections: [
      {
        heading: "Bond yields come first",
        paragraphs: [
          "When you buy a fixed annuity, the insurer invests most of your premium in bonds and similar assets it holds for years. The rate it can offer you depends on what those investments yield, minus its costs, reserves and profit.",
          "That is why fixed annuity rates tend to move in the same direction as longer-term Treasury and corporate bond yields. Changes in the Federal Reserve's short-term rate matter indirectly, through their effect on those longer yields.",
          "There is often a lag. When bond yields jump, insurers may take a few weeks to raise their annuity rates, and when yields drop, they may cut rates quickly to avoid promising more than new investments can earn. Watching the general direction of longer-term bond yields gives you a rough sense of where annuity rates are heading, but not a reliable forecast.",
        ],
      },
      {
        heading: "Contract choices that change your rate",
        table: {
          caption: "Factors and their usual effect",
          headers: ["Factor", "Usual effect on the rate"],
          rows: [
            ["Longer guarantee term", "Often higher, though not always when yield curves are flat or inverted"],
            ["Longer surrender period", "Often higher, since the insurer can invest for longer"],
            ["Market value adjustment included", "Often higher, since some interest-rate risk is shared with you"],
            ["Return-of-premium or extra liquidity features", "Often lower"],
            ["Larger deposit", "Sometimes higher, at set premium bands"],
            ["Optional riders", "Usually no change to the rate, but a separate fee"],
          ],
        },
      },
      {
        heading: "Insurer factors",
        bullets: [
          "Each insurer has its own investment portfolio, costs and profit targets.",
          "Insurers sometimes raise rates for a period to attract new money, then lower them once they reach their goal.",
          "A higher rate from a weaker insurer may carry more risk. Look at independent financial strength ratings alongside the rate.",
          "Guarantees depend on the claims-paying ability of the issuing insurer, and state guaranty associations provide limited protection with limits that vary by state.",
        ],
      },
      {
        heading: "What this means for you",
        paragraphs: [
          "No one can reliably predict where rates will go. Waiting for a higher rate can pay off, or it can mean missing a rate that later disappears. Many people split the decision, placing part of their money now and part later, or using different terms so that not everything renews at once.",
          "Another approach is a ladder: splitting money across contracts with different terms, say three, five and seven years. Each time one matures, you can reinvest at the rates then available. A ladder does not guarantee a better result, but it spreads your exposure across different rate environments and gives you access to part of your money at regular points.",
          "Because rates change often, a quote is only good for a short time. A licensed Rare Legacy advisor can compare current options from several carriers, and the quiz is the quickest way to get numbers based on your situation sent to you by text.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do fixed annuity rates follow CD rates?",
        answer:
          "They often move in the same direction because both respond to interest rates, but annuity rates follow longer-term yields more closely. The two do not move in lockstep.",
      },
      {
        question: "Why does a 10-year rate sometimes pay less than a 5-year rate?",
        answer:
          "When longer-term yields are close to or below shorter-term yields, insurers may not pay more for a longer commitment. It reflects the bond market at the time.",
      },
      {
        question: "Will my rate change after I buy?",
        answer:
          "On a multi-year guaranteed annuity, the rate is fixed for the guarantee term. On contracts with a one-year rate, the insurer sets a renewal rate each year, subject to the contract minimum.",
      },
    ],
    sources: [FINRA, NAIC, NOLHGA],
    related: ["how-to-lock-in-a-better-annuity-rate", "how-to-compare-fixed-annuity-rates", "myga-fixed-annuity", "annuity-vs-cd"],
  },
  {
    ...base,
    slug: "how-to-lock-in-a-better-annuity-rate",
    title: "How to lock in a better annuity rate",
    metaTitle: "How to Lock In a Better Annuity Rate | Rare Legacy Life",
    description:
      "How annuity rates are locked: application dates, rate holds, transfers and rollovers, and the steps that help you keep a rate while your money moves over.",
    readMinutes: 6,
    answer:
      "To lock in an annuity rate, you usually need a signed application submitted before the insurer changes its rate. Many insurers hold the rate for a set window while money arrives from a bank, rollover or exchange, if the paperwork is in good order. Comparing several carriers, choosing the right term and moving funds promptly all help. Rate holds vary by insurer and are not guaranteed.",
    sections: [
      {
        heading: "When your rate is set",
        paragraphs: [
          "Insurers change fixed annuity rates often. The rate you get depends on the insurer's rules: some lock the rate on the date the application is received, others on the date the money arrives, and many use whichever is higher if both fall within a set window.",
          "If rates are about to drop, an application submitted before the change can protect the current rate, as long as the money follows within the hold period.",
        ],
      },
      {
        heading: "Rate holds and transfers",
        paragraphs: [
          "Money often comes from somewhere else: a bank account, a CD, a 401(k) rollover, an IRA transfer or a 1035 exchange from another annuity. Transfers between institutions can take days or weeks.",
        ],
        table: {
          caption: "Typical funding paths (timing varies)",
          headers: ["Source", "What has to happen", "Timing considerations"],
          rows: [
            ["Bank or check", "You send the premium with or after the application", "Usually the fastest"],
            ["IRA transfer", "The new insurer requests the money from the current custodian", "Depends on the current custodian"],
            ["401(k) rollover", "Your plan processes a direct rollover", "Plan paperwork and approvals can slow it"],
            ["1035 exchange", "The new insurer requests the old contract's value", "Old insurer may need forms and signatures"],
          ],
        },
      },
      {
        heading: "Steps that help",
        bullets: [
          "Compare several carriers at once, so you are not choosing from a single quote.",
          "Ask each insurer how long it holds a rate and what starts and ends the hold.",
          "Fill out the application completely. Missing signatures or forms can restart the clock.",
          "Start transfer paperwork with your current institution at the same time.",
          "Check for surrender charges, CD penalties or tax issues on the money you are moving before you move it.",
          "Consider staggering terms so that not all your money renews in the same rate environment.",
        ],
      },
      {
        heading: "Common reasons a rate is missed",
        bullets: [
          "An unsigned page or missing beneficiary detail sends the application back, and the hold expires while it is fixed.",
          "The current custodian needs its own form or a medallion signature guarantee, and nobody started that paperwork.",
          "A 401(k) plan only processes rollovers on certain days, which pushes the money past the hold window.",
          "The money arrives as a check made out to the wrong party and has to be reissued.",
          "The buyer waits a few extra weeks hoping for a higher rate, and the insurer lowers it instead.",
        ],
      },
      {
        heading: "What a locked rate does and does not mean",
        paragraphs: [
          "A locked rate on a multi-year guaranteed annuity applies for the guarantee term. It does not remove surrender charges, and it does not cover rates on future renewals. On an indexed annuity, caps and participation rates are usually locked only for the first crediting period.",
          "Every guarantee depends on the claims-paying ability of the issuing insurer, and annuities are not FDIC insured. A licensed Rare Legacy advisor can compare options from several carriers and help keep the paperwork moving.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I get the higher rate if rates go up after I apply?",
        answer:
          "Some insurers credit the higher rate if it rises before your contract is issued. Others do not. Ask how the insurer handles a rate increase during the hold.",
      },
      {
        question: "How long does a rate hold last?",
        answer:
          "It varies by insurer and by funding type. Transfers and exchanges sometimes get a longer window than direct payments. Confirm the window in writing.",
      },
      {
        question: "Should I wait for rates to rise?",
        answer:
          "No one can reliably predict rates. Some people put part of their money in now and part later to avoid betting everything on one moment.",
      },
    ],
    sources: [FINRA, NAIC],
    related: ["what-influences-fixed-annuity-rates", "how-to-compare-fixed-annuity-rates", "401k-rollover-to-annuity", "1035-exchange-annuity"],
  },
  {
    ...base,
    slug: "how-to-compare-fixed-annuity-rates",
    title: "How to compare fixed annuity rates fairly",
    metaTitle: "How to Compare Fixed Annuity Rates Fairly | Rare Legacy Life",
    description:
      "The highest rate is not always the best contract. How to weigh term, surrender length, renewal rates, insurer strength and market value adjustments.",
    readMinutes: 7,
    answer:
      "To compare fixed annuity rates fairly, line up contracts with the same guarantee term, then look past the headline rate. Check how long the rate is guaranteed, what happens at renewal, how long surrender charges last, whether there is a market value adjustment, what free withdrawals you get, and how financially strong the insurer is. A slightly lower rate can be the better contract.",
    sections: [
      {
        heading: "Start with matching terms",
        paragraphs: [
          "A five-year guarantee and a ten-year guarantee are different products. Compare five-year contracts with five-year contracts. Then check that the guarantee period matches the surrender period. If the rate is guaranteed for three years but surrender charges last seven, you face four years of unknown rates while still locked in.",
        ],
      },
      {
        heading: "What to line up for each contract",
        table: {
          caption: "A fair comparison checklist",
          headers: ["Item", "Why it matters"],
          rows: [
            ["Rate and how long it is guaranteed", "The headline rate may apply to the first year only"],
            ["First-year bonus rate", "A bonus rate can inflate year one, then drop"],
            ["Surrender period and charges", "Sets how long your money is committed and what leaving early costs"],
            ["Market value adjustment", "Can raise or lower an early surrender value as rates change"],
            ["Free withdrawals", "How much you can take each year without a charge"],
            ["Renewal rate history and minimum", "What you may earn if you stay past the guarantee"],
            ["Insurer financial strength", "Guarantees rely on the insurer's claims-paying ability"],
            ["Death benefit and waivers", "Whether charges are waived at death or for nursing home care"],
          ],
        },
      },
      {
        heading: "Renewal rates matter",
        paragraphs: [
          "On contracts with a one-year or short guarantee, the renewal rate decides most of what you earn. Some insurers renew close to their new-money rates. Others let renewal rates slide. Ask for the contract's guaranteed minimum and how the insurer has treated existing customers.",
          "On a multi-year guaranteed annuity, the rate is set for the full term, and at the end you usually get a window to renew, move the money or take it out without a surrender charge.",
        ],
      },
      {
        heading: "The market value adjustment",
        paragraphs: [
          "Many fixed annuities include a market value adjustment, or MVA. If you surrender early and interest rates have risen since you bought, the MVA usually reduces what you receive. If rates have fallen, it can increase it. The MVA generally applies only to withdrawals above the free amount during the surrender period.",
          "Contracts with an MVA often pay a slightly higher rate, because you share some of the insurer's interest-rate risk. If you plan to hold for the full term, the MVA may never apply.",
          "A hypothetical example: two five-year contracts, one paying 5.0% with an MVA and one paying 4.8% without. On $100,000 held the full five years, the 0.2% difference adds up to roughly $1,200 more for the MVA contract. If there is any real chance you will need to surrender early, the contract without an MVA may be worth that cost.",
        ],
      },
      {
        heading: "Weigh insurer strength",
        bullets: [
          "Look up independent financial strength ratings for each insurer.",
          "Treat state guaranty association coverage as a limited backstop, not a reason to pick a weaker insurer. Limits vary by state.",
          "Annuities are not FDIC insured.",
          "A licensed Rare Legacy advisor can compare options from several carriers side by side.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is the highest rate always the best choice?",
        answer:
          "No. A slightly higher rate may come with a longer surrender period, a weaker insurer or a first-year bonus that disappears. Compare the full contract.",
      },
      {
        question: "What is a bonus rate on a fixed annuity?",
        answer:
          "Some contracts add extra interest in the first year. After that the rate drops to the base rate, so compare the rate over the whole term.",
      },
      {
        question: "Does an MVA mean I can lose money?",
        answer:
          "An MVA can reduce an early surrender value when rates have risen, alongside any surrender charge. Many contracts limit how far it can reduce the value. Read the contract's MVA terms.",
      },
    ],
    sources: [NAIC, FINRA, NOLHGA],
    related: ["what-influences-fixed-annuity-rates", "myga-fixed-annuity", "annuity-surrender-charges", "are-annuities-safe"],
  },
  {
    ...base,
    slug: "5-year-fixed-annuity",
    title: "What is a 5-year fixed annuity?",
    metaTitle: "5-Year Fixed Annuity: How It Works and Who It Fits | Rare Legacy Life",
    description:
      "How a 5-year fixed annuity works, how it compares with a 5-year CD, what happens at the end of the term, and the access and tax rules to know first.",
    readMinutes: 6,
    answer:
      "A 5-year fixed annuity is an insurance contract that pays a set interest rate for five years, often called a five-year MYGA. Interest grows tax-deferred, and the rate does not change during the term. Most allow a limited free withdrawal each year, with surrender charges on larger withdrawals. When the five years end, you can usually renew, move the money or withdraw it.",
    sections: [
      {
        heading: "How it works",
        bullets: [
          "You make a single premium payment, often with a minimum deposit.",
          "The insurer guarantees a fixed rate for the five-year term, subject to its claims-paying ability.",
          "Interest compounds inside the contract and is not taxed until withdrawn.",
          "Many contracts let you take interest or a set percentage each year without a surrender charge.",
          "Surrender charges, and sometimes a market value adjustment, apply to larger withdrawals during the term.",
        ],
      },
      {
        heading: "A hypothetical example",
        paragraphs: [
          "Say you deposit $100,000 into a 5-year fixed annuity paying a hypothetical 5% a year, compounded yearly, and take nothing out. After five years the value would be about $127,600, before any taxes. If you withdrew it all at the end, about $27,600 would be taxable as ordinary income. These numbers are made up to show how it works. Your actual rate depends on the day you buy and the carrier.",
        ],
      },
      {
        heading: "5-year fixed annuity vs 5-year CD",
        table: {
          caption: "How they compare",
          headers: ["Feature", "5-year fixed annuity", "5-year CD"],
          rows: [
            ["Backed by", "The insurer's claims-paying ability, with state guaranty association limits", "FDIC insurance, within limits"],
            ["Taxes on interest", "Deferred until withdrawn", "Taxed each year as earned, outside retirement accounts"],
            ["Early access", "Free withdrawal allowance, then surrender charges", "Early withdrawal penalty, usually some interest"],
            ["Before age 59½", "Earnings withdrawn may face an additional 10% federal tax", "No additional tax"],
            ["At maturity", "Renew, move, withdraw or turn into income", "Renew or withdraw"],
          ],
        },
      },
      {
        heading: "What happens at the end of the term",
        paragraphs: [
          "Near the end of the five years, the insurer usually sends a notice. You then get a short window, often around 30 days, to decide. If you do nothing, many contracts renew automatically into a new term at the rate then offered, which may be higher or lower, and a new surrender schedule may start.",
          "Your options typically include renewing with the same insurer, moving to another annuity through a 1035 exchange to keep tax deferral, taking the money as a lump sum, or turning it into a stream of income. Put a reminder on your calendar so the window does not pass unnoticed.",
        ],
      },
      {
        heading: "Who it tends to fit",
        paragraphs: [
          "It tends to fit people who want a known rate on money they will not need for five years, especially if they would like to defer taxes on the interest. It is a poor fit for an emergency fund or for money you may need before age 59½. Tax rules vary, so confirm how they apply to you with a tax professional.",
          "Some people pair a five-year contract with shorter and longer terms, so that part of their money comes due every couple of years. A licensed Rare Legacy advisor can compare five-year options from several carriers, and the quiz is the quickest way to have numbers for your situation sent to you by text.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I add money to a 5-year fixed annuity later?",
        answer:
          "Most are single-premium contracts, so additional money usually goes into a new contract at the rate then offered.",
      },
      {
        question: "Is a 5-year fixed annuity FDIC insured?",
        answer:
          "No. It is backed by the issuing insurer's claims-paying ability, with limited protection from state guaranty associations if an insurer fails.",
      },
      {
        question: "Can I put IRA money into a 5-year fixed annuity?",
        answer:
          "Yes. It can be held inside an IRA. The IRA already defers taxes, so required minimum distribution rules apply once you reach the required age.",
      },
    ],
    sources: [FINRA, FDIC, NOLHGA],
    related: ["myga-fixed-annuity", "annuity-vs-cd", "how-to-compare-fixed-annuity-rates", "1035-exchange-annuity"],
  },
  {
    ...base,
    slug: "how-fixed-deferred-annuities-grow",
    title: "How do fixed deferred annuities grow?",
    metaTitle: "How Fixed Deferred Annuities Grow: Compounding & Tax Deferral | Rare Legacy Life",
    description:
      "How a fixed deferred annuity grows through credited interest, compounding and tax deferral, with a hypothetical example and the limits to keep in mind.",
    readMinutes: 6,
    answer:
      "A fixed deferred annuity grows as the insurer credits interest to your account at a declared or guaranteed rate. That interest compounds, meaning future interest is earned on past interest too. Because taxes are deferred until you withdraw, money that would otherwise go to yearly taxes keeps compounding. Growth is steady rather than market-linked, and early withdrawals can bring surrender charges.",
    sections: [
      {
        heading: "Credited interest",
        paragraphs: [
          "During the deferral phase, before income starts, the insurer credits interest to your account value. On a multi-year guaranteed annuity, the rate is set for the whole term. On a traditional fixed annuity, the rate may be guaranteed for one year and then reset each year, never below a contract minimum.",
          "Credited interest becomes part of your account value. It is not taken back by later market moves, because a fixed annuity is not tied to the market.",
          "Your statement will usually show two figures: the account value, which includes all credited interest, and the surrender value, which is what you would receive if you cashed out today after any surrender charge or market value adjustment. During the surrender period, the surrender value is lower. Once the period ends, the two figures match.",
        ],
      },
      {
        heading: "Compounding and tax deferral, in a hypothetical example",
        paragraphs: [
          "Compounding is simple to describe. In year one, $100,000 at a hypothetical 5% earns $5,000. In year two, the 5% applies to $105,000, so it earns $5,250. Each year the interest is a little larger, because it is earned on a bigger balance. Over long periods, that steady snowball does much of the work.",
          "Picture $100,000 earning a hypothetical 5% a year for ten years, compared with a taxable account earning the same 5% where the interest is taxed every year at a hypothetical 22%. The rates are made up and the comparison ignores fees and state taxes.",
        ],
        table: {
          caption: "Hypothetical growth of $100,000 at 5% a year",
          headers: ["Year", "Tax-deferred value", "Taxed-yearly value"],
          rows: [
            ["5", "$127,600", "$121,100"],
            ["10", "$162,900", "$146,600"],
          ],
        },
      },
      {
        heading: "What deferral does not do",
        bullets: [
          "Tax is deferred, not removed. Gains are taxed as ordinary income when withdrawn, not at capital gains rates.",
          "Withdrawals of earnings before age 59½ may face an additional 10% federal tax, with some exceptions.",
          "In the example above, the deferred account still owes tax on its gain when the money comes out. After that tax, the advantage is smaller than the table suggests, though it usually remains.",
          "Surrender charges apply to withdrawals above the free amount during the surrender period.",
          "Rules vary with your situation, so confirm them with a tax professional.",
        ],
      },
      {
        heading: "What can slow growth",
        bullets: [
          "Withdrawals, even free ones, reduce the balance that compounds.",
          "On contracts with one-year rates, renewal rates can be lower than the first-year rate.",
          "Optional rider fees, if you add them, are deducted from the account value.",
          "Inflation reduces what the money will buy, even while the balance grows.",
        ],
      },
      {
        heading: "From growth to income",
        paragraphs: [
          "When you are ready, you can take withdrawals, take the full value, move it to another annuity through a 1035 exchange, or annuitize, which turns the balance into guaranteed payments for a period or for life. Guarantees are backed by the claims-paying ability of the issuing insurer, and annuities are not FDIC insured.",
        ],
      },
    ],
    faqs: [
      {
        question: "How often is interest credited?",
        answer:
          "Many contracts compound interest daily or credit it yearly. The illustration in your contract shows how it is applied.",
      },
      {
        question: "Does a fixed deferred annuity grow faster than a CD?",
        answer:
          "Not necessarily. It depends on the rates offered. The difference is mostly tax deferral and the terms for access, not a guaranteed higher return.",
      },
      {
        question: "Is tax deferral useful inside an IRA?",
        answer:
          "An IRA already defers taxes, so an annuity adds no extra deferral there. People who use annuities in IRAs usually do so for the guaranteed rate or income features.",
      },
    ],
    sources: [IRS_575, INVESTOR_GOV, FINRA],
    related: ["tax-deferred-annuity-guide", "how-annuities-are-taxed", "myga-fixed-annuity", "deferred-annuity"],
  },
  {
    ...base,
    slug: "tax-deferred-annuity-guide",
    title: "What is a tax-deferred annuity?",
    metaTitle: "Tax-Deferred Annuity Guide: How Deferral Works | Rare Legacy Life",
    description:
      "How tax deferral works in an annuity, how qualified and non-qualified money differ, the 59½ rule, and how withdrawals and income payments are taxed.",
    readMinutes: 7,
    answer:
      "A tax-deferred annuity is one where earnings are not taxed each year as they grow. You pay federal income tax only when money comes out, and earnings are taxed as ordinary income. Withdrawals of earnings before age 59½ generally face an additional 10% federal tax, with exceptions. Unlike IRAs, non-qualified annuities have no federal contribution limit and no required minimum distributions during the owner's life.",
    sections: [
      {
        heading: "Qualified vs non-qualified",
        paragraphs: [
          "How an annuity is taxed depends first on where the money came from.",
        ],
        table: {
          caption: "Two ways to hold an annuity",
          headers: ["Feature", "Qualified (inside an IRA or plan)", "Non-qualified (after-tax savings)"],
          rows: [
            ["Money going in", "Usually pre-tax", "Already taxed"],
            ["What is taxable when withdrawn", "Usually the whole amount", "Only the earnings"],
            ["Contribution limits", "Set by the IRA or plan rules", "No federal limit, though insurers set maximums"],
            ["Required minimum distributions", "Yes, once you reach the required age", "Not during the owner's life"],
            ["Extra tax deferral from the annuity", "None, the account already defers", "Yes"],
          ],
        },
      },
      {
        heading: "How withdrawals are taxed",
        bullets: [
          "For non-qualified annuities, withdrawals are generally treated as coming from earnings first, so they are taxable until all the gain is out.",
          "Earnings are taxed as ordinary income, not at capital gains rates.",
          "Before age 59½, the taxable part of a withdrawal is generally subject to an additional 10% federal tax. Exceptions include death, disability and certain series of substantially equal payments.",
          "Insurers report distributions on Form 1099-R.",
        ],
      },
      {
        heading: "How income payments are taxed",
        paragraphs: [
          "If you annuitize a non-qualified annuity, turning it into regular payments, each payment is split into a tax-free return of your original premium and a taxable portion of earnings. The IRS calls the split the exclusion ratio. Once you have received back your full cost basis, the rest of each payment is taxable.",
          "Here is a hypothetical example. Someone pays $100,000 for a non-qualified income annuity and is expected, under IRS tables, to receive $150,000 in total. Their exclusion ratio is two thirds, so two thirds of each payment is a tax-free return of premium and one third is taxable. The numbers are made up to show the idea; the insurer calculates the actual split.",
          "For a qualified annuity bought with pre-tax money, payments are generally fully taxable as ordinary income.",
        ],
      },
      {
        heading: "Who benefits most from deferral",
        bullets: [
          "People who have already used their IRA and workplace plan limits and still want tax-deferred savings.",
          "People who expect to be in a lower tax bracket when they withdraw than they are today.",
          "People who can leave the money alone until after age 59½.",
          "It is less useful for money you may need soon, or inside an IRA where deferral already exists.",
        ],
      },
      {
        heading: "Keeping deferral when you move money",
        paragraphs: [
          "A 1035 exchange lets you move one annuity into another without triggering tax, as long as the rules are followed. Qualified money can move by direct rollover or trustee-to-trustee transfer. Both protect deferral, but the new contract may start a new surrender period.",
          "Tax rules change and depend on your situation. Confirm how they apply to you with a tax professional before acting. Annuity guarantees are backed by the claims-paying ability of the issuing insurer, and annuities are not FDIC insured.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is there a limit on how much I can put in a non-qualified annuity?",
        answer:
          "There is no federal contribution limit, but each insurer sets its own maximum premium and may require approval above it.",
      },
      {
        question: "What happens to the deferred taxes when I die?",
        answer:
          "Beneficiaries generally owe income tax on the earnings when they receive them. There is no step-up in basis for annuity gains.",
      },
      {
        question: "Can I avoid the 10% additional tax?",
        answer:
          "It generally does not apply after age 59½, at death or disability, or for certain equal periodic payments. A tax professional can confirm whether an exception fits you.",
      },
    ],
    sources: [IRS_575, IRS_410, INVESTOR_GOV],
    related: ["how-annuities-are-taxed", "how-fixed-deferred-annuities-grow", "non-qualified-annuity", "1035-exchange-annuity"],
  },
  {
    ...base,
    slug: "how-insurance-companies-make-money-on-annuities",
    title: "How do insurance companies make money on annuities?",
    metaTitle: "How Insurance Companies Make Money on Annuities | Rare Legacy Life",
    description:
      "How insurers earn money on annuities, mainly through the spread between what they earn and what they credit, plus fees and surrender charges, explained plainly.",
    readMinutes: 6,
    answer:
      "Insurance companies make most of their annuity profit from the spread: the difference between what they earn investing your premium, mostly in bonds, and what they credit to you. They also collect fees on variable annuities and optional riders, and surrender charges when people leave early. The spread is built into the rate you see, so it is disclosed through the rate rather than hidden.",
    sections: [
      {
        heading: "The spread",
        paragraphs: [
          "When you buy a fixed or fixed indexed annuity, the insurer invests your premium in its general account, mostly high-quality bonds and mortgages held for many years. Suppose, hypothetically, the portfolio earns 6% and the insurer credits you 4.5%. The 1.5% difference is the spread. It has to cover salaries, commissions, regulatory reserves and taxes before any of it is profit.",
          "The insurer also takes on risk in exchange for the spread. If its investments underperform, or if rates fall and bonds it holds are paid back early, it still owes you the guaranteed rate. That is why insurers are required to hold reserves and capital above what they expect to pay out.",
          "For a fixed indexed annuity, the insurer uses part of the earnings to buy options on the index. Those options fund your potential indexed interest. The caps and participation rates you see are set so that the cost of the options fits within the budget left after the spread.",
        ],
      },
      {
        heading: "Why the spread is not hidden from you",
        paragraphs: [
          "The spread is not a fee deducted from your account. It is built into the rate, cap or participation rate the insurer offers. You see the result, the rate you will earn, before you sign, and that rate is guaranteed in the contract for the period stated. You can compare it with other insurers and with alternatives like CDs or bonds.",
          "Banks work the same way with CDs. They lend your deposit at a higher rate than they pay you, and the difference covers their costs and profit.",
        ],
      },
      {
        heading: "Other ways insurers earn money",
        table: {
          caption: "Annuity revenue sources",
          headers: ["Source", "Where it applies", "What you can do"],
          rows: [
            ["Spread", "Fixed and fixed indexed annuities", "Compare rates and caps across carriers"],
            ["Mortality and expense and admin fees", "Variable annuities", "Ask for the total yearly cost"],
            ["Rider fees", "Optional income or death benefits", "Add only riders you need"],
            ["Surrender charges", "Early withdrawals", "Choose a term you can hold"],
            ["Longevity pooling", "Income annuities", "Understand payout options and refund features"],
          ],
        },
      },
      {
        heading: "Why surrender charges exist",
        paragraphs: [
          "Insurers invest for the long term and pay commissions up front. If many people left early, the insurer might have to sell bonds at a loss. Surrender charges help offset that. They usually decline each year and disappear at the end of the surrender period.",
        ],
      },
      {
        heading: "What it means for you",
        bullets: [
          "An insurer making a profit is part of what keeps it able to pay claims. Guarantees are backed by the claims-paying ability of the issuing insurer.",
          "Insurers are regulated by the states and must hold reserves. State guaranty associations offer limited additional protection.",
          "Annuities are not FDIC insured.",
          "Comparing several carriers is the most practical way to make sure the spread you accept is competitive. A licensed Rare Legacy advisor can do that for you.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I pay my advisor directly when I buy an annuity?",
        answer:
          "For most fixed and indexed annuities, the insurer pays the advisor a commission, and it does not come out of your premium. You can always ask how your advisor is paid.",
      },
      {
        question: "Can the insurer lower my rate to increase its profit?",
        answer:
          "During a guarantee period, no. After that, the insurer can set renewal rates or caps, but not below the minimums in the contract.",
      },
      {
        question: "Are fees on fixed annuities hidden in the fine print?",
        answer:
          "A base fixed annuity usually has no yearly fee. Its surrender charges and any rider fees must be disclosed in the contract and buyer's guide.",
      },
    ],
    sources: [NAIC, FINRA, NOLHGA],
    related: ["annuity-fees-explained", "what-influences-fixed-annuity-rates", "are-annuities-safe", "annuity-vs-cd"],
  },
];
