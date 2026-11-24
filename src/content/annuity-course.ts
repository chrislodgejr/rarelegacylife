/**
 * "Annuities 101": a free seven-lesson course. Each lesson is a written page and a narrated slide video, so `narration` is
 * written for a text-to-speech voice: numbers and abbreviations are spelled the way they are said, with no symbols or URLs.
 * Written from scratch for Rare Legacy under the rules at the top of src/content/guides.ts: educational only, no carrier or
 * product names, no current rates, caps or payout figures, guarantees described as backed by the insurer's claims-paying
 * ability, and tax described as the general federal rule with a pointer to a tax professional.
 * A changed lesson, the tax passages above all, goes past the advisors and compliance before it is merged.
 */

export type CourseSlide = { heading: string; points: string[] };

export type CourseLesson = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
  narration: string[];
  slides: CourseSlide[];
  keyTakeaways: string[];
  related: string[];
};

const LESSONS: CourseLesson[] = [
  {
    slug: "what-is-an-annuity",
    number: 1,
    title: "What an annuity is (and is not)",
    summary: "An annuity is a contract with an insurance company that can grow savings, protect them, or turn them into income.",
    minutes: 4,
    narration: [
      "Welcome to lesson one of Annuities one oh one, where we look at what an annuity really is, and what it is not.",
      "Let's start with the plain definition. An annuity is a contract between you and an insurance company. You give the insurer money, either all at once or over time. In return, the insurer makes you promises, written into the contract. Depending on the kind of annuity, those promises might be a set interest rate, protection from market losses, a stream of income for as long as you live, or some mix of those.",
      "That's really the whole idea. Everything else is detail about which promises you get and what you give up in exchange for them.",
      "Most annuities have two phases. The first is the growth phase, sometimes called the accumulation phase. Your money sits in the contract and earns interest or investment returns. The second is the income phase, sometimes called the payout phase. That's when you start taking money out, either as withdrawals you choose or as regular payments the insurer sends you. Some annuities skip the growth phase and start paying right away. We'll cover those in lesson four.",
      "One feature people like is tax deferral. In general, under federal tax rules, the growth inside an annuity is not taxed until you take it out. That lets your earnings compound without a yearly tax bill. We'll come back to taxes in lesson six, and since everyone's situation is different, it's always worth confirming the details with a tax professional.",
      "Now, what an annuity is not. This part matters just as much.",
      "First, an annuity is not a bank account. It is not a savings account or a certificate of deposit, even when it looks and feels a lot like one. Annuities are not FDIC insured. The guarantees in an annuity are backed by the financial strength and claims-paying ability of the insurance company that issues it. That's why the insurer's financial strength is one of the first things worth checking. Each state also has a guaranty association that offers a layer of protection if an insurer fails, but the limits and rules vary by state, so it's not something to lean on as your main safety net.",
      "Second, an annuity is not a short-term place to park money. Most annuities come with a surrender period, which is a stretch of years when taking out more than a set amount brings a charge. So money that goes into an annuity should be money you won't need for a while. Most contracts do let you take out a portion each year without a charge, but the details vary from one contract to the next.",
      "Third, an annuity is not one single product. The word covers a whole family of contracts that behave very differently. A fixed annuity pays a set rate. A fixed indexed annuity ties its interest to a market index, with a floor that protects you from market drops. An income annuity turns a lump sum into a paycheck. A variable annuity invests in the market, and you can lose money in it. Lumping them all together is one of the biggest sources of confusion, which is why this course takes them one at a time.",
      "And fourth, an annuity is not right for everyone. It is a tool. For some people, in some situations, it does a job nothing else does as well. For others, it ties up money they would be better off keeping flexible. Our goal in this course is to help you tell the difference for yourself.",
      "So here's the short version to remember. An annuity is a contract with an insurer. It trades some flexibility for promises. Those promises are only as strong as the company behind them. And the right one, if any, depends on the job you need it to do.",
      "In lesson two, we'll look at the simplest kind of all: fixed annuities, including the multi-year guaranteed annuity, often called an M-Y-G-A.",
    ],
    slides: [
      {
        heading: "An annuity is a contract",
        points: ["You give an insurance company money", "The insurer makes written promises in return", "Promises vary by type of annuity"],
      },
      {
        heading: "Two phases",
        points: ["Growth phase: money earns interest or returns", "Income phase: withdrawals or regular payments", "Growth is generally tax-deferred until withdrawn"],
      },
      {
        heading: "What an annuity is not",
        points: [
          "Not a bank account, and not FDIC insured",
          "Guarantees rest on the insurer's claims-paying ability",
          "Not short-term money: surrender charges apply",
        ],
      },
      {
        heading: "A family, not one product",
        points: ["Fixed and multi-year guaranteed", "Fixed indexed", "Income annuities", "Variable annuities, which carry market risk"],
      },
      {
        heading: "The short version",
        points: ["You trade some flexibility for promises", "Check the strength of the insurer", "The right fit depends on the job"],
      },
    ],
    keyTakeaways: [
      "An annuity is a contract with an insurance company that trades some flexibility for written promises about growth, protection or income.",
      "Annuities are not bank products and are not FDIC insured; their guarantees are backed by the insurer's claims-paying ability.",
      "Most annuities have a surrender period, so they suit money you will not need for several years.",
    ],
    related: ["how-do-annuities-work", "3-types-of-annuities", "are-annuities-safe"],
  },
  {
    slug: "fixed-annuities-and-mygas",
    number: 2,
    title: "Fixed annuities and MYGAs",
    summary: "A fixed annuity credits a declared interest rate; a MYGA locks that rate in for a set number of years.",
    minutes: 5,
    narration: [
      "Welcome to lesson two, where we look at the most straightforward annuity there is: the fixed annuity.",
      "A fixed annuity works on a simple promise. You put in a sum of money, and the insurance company credits interest at a rate it declares. Your value does not go up and down with the stock market. It grows steadily, and interest that has been credited stays credited.",
      "There are two main flavors. In a traditional fixed annuity, the insurer may guarantee a rate for the first year or so, and then reset it each year after that. The contract will also state a minimum rate, so the reset can never drop below that floor.",
      "The second flavor is the multi-year guaranteed annuity, often called an M-Y-G-A. With an M-Y-G-A, the rate is locked in for the whole term you choose. Terms commonly run anywhere from about three years to ten. If you pick a five-year M-Y-G-A, you know on day one what rate you will earn every year for five years. That predictability is the main appeal.",
      "Many people compare an M-Y-G-A to a certificate of deposit, and the comparison is useful up to a point. Both pay a set rate for a set time. But there are real differences. A C-D is a bank deposit covered by FDIC insurance. An M-Y-G-A is an insurance contract, not FDIC insured, and its guarantee is backed by the claims-paying ability of the insurer. On the other hand, C-D interest is generally taxed every year, while M-Y-G-A interest generally grows tax-deferred until you withdraw it. Under federal rules, those withdrawals are taxed as ordinary income, and taking earnings before age fifty-nine and a half can bring an extra ten percent federal penalty on top of the regular tax. Rules have exceptions, so it's wise to confirm your own situation with a tax professional.",
      "Let's use a simple, made-up example to show how the guarantee works. Imagine someone puts one hundred thousand dollars into a five-year M-Y-G-A. Whatever the rate is, it stays the same each of those five years, and the interest compounds on top of itself. At the end, they know exactly what the contract will be worth, as long as they leave the money alone. That number is not tied to the stock market at all. Please treat this as an illustration only, not a quote.",
      "Now, about leaving the money alone. This is the main tradeoff. An M-Y-G-A comes with a surrender schedule that usually lines up with the term. If you take out more than the contract allows during that time, you pay a surrender charge, which typically starts higher and steps down each year. Many contracts let you take a portion out each year without a charge, such as the interest earned or a set percentage, but not all do. Some contracts also include something called a market value adjustment, which can raise or lower what you get back if you leave early, depending on how interest rates have moved since you bought it.",
      "So when you look at a fixed annuity or an M-Y-G-A, here's what to compare. The guaranteed rate and how long it lasts. The financial strength of the insurer. How much you can take out each year for free. The surrender schedule, year by year. Whether there's a market value adjustment. And what happens when the term ends.",
      "That last one is easy to overlook. When an M-Y-G-A term ends, there's usually a short window, often around thirty days, to decide what to do. You can typically take the money, renew, or move it to another annuity. If you do nothing, many contracts renew on their own, sometimes with a brand new surrender period. So mark that date on your calendar.",
      "A fixed annuity or M-Y-G-A tends to fit people who want a known rate, don't need the money for the term, and like the idea of deferring tax on the interest. It's often considered by people whose C-Ds are coming due.",
      "In lesson three, we'll look at the fixed indexed annuity, which adds a link to the stock market while keeping a floor under your money.",
    ],
    slides: [
      {
        heading: "How a fixed annuity works",
        points: ["Insurer credits a declared interest rate", "Value does not move with the market", "Contract states a minimum rate"],
      },
      {
        heading: "The MYGA",
        points: ["Rate locked for the whole term", "Terms often run about three to ten years", "Predictability is the main appeal"],
      },
      {
        heading: "MYGA versus CD",
        points: ["CD: bank deposit, FDIC insured, taxed yearly", "MYGA: insurer-backed, not FDIC insured", "MYGA interest generally grows tax-deferred"],
      },
      {
        heading: "The tradeoff: access",
        points: ["Surrender charges if you take too much early", "Some free withdrawal each year, in many contracts", "Watch for a market value adjustment"],
      },
      {
        heading: "When the term ends",
        points: ["Short window, often about thirty days", "Take the money, renew, or move it", "Doing nothing may restart a surrender period"],
      },
    ],
    keyTakeaways: [
      "A MYGA locks in one declared rate for the whole term, so you know your growth in advance, independent of the market.",
      "Unlike a CD, a MYGA is not FDIC insured; its rate is backed by the insurer's claims-paying ability, and interest is generally tax-deferred.",
      "Surrender charges, any market value adjustment and the end-of-term window are the details to read before you buy.",
    ],
    related: ["myga-fixed-annuity", "annuity-surrender-charges", "how-annuities-are-taxed"],
  },
  {
    slug: "fixed-indexed-annuities",
    number: 3,
    title: "Fixed indexed annuities",
    summary: "A fixed indexed annuity links interest to a market index, with a floor against market losses and a limit on gains.",
    minutes: 4,
    narration: [
      "Welcome to lesson three, where we unpack the fixed indexed annuity, one of the most talked about and most misunderstood kinds.",
      "A fixed indexed annuity is still a fixed annuity at heart. It's an insurance contract, not an investment account. What makes it different is how it earns interest. Instead of a set rate, the interest is based partly on how a market index, such as a well-known stock index, performs over a period of time, usually a year.",
      "Here's the most important thing to understand. Your money is not invested in the market. The insurer simply watches the index and uses its movement to work out how much interest to credit you. That's why a falling market does not reduce your value. If the index goes down over the period, you are typically credited zero for that period. Not a loss. Just zero. And interest that was credited in earlier years is locked in, so a bad year doesn't take it back.",
      "That protection is often called the floor. It's backed, like every annuity guarantee, by the claims-paying ability of the insurance company.",
      "Of course, that protection isn't free. In exchange for the floor, you give up some of the upside. The insurer limits how much of the index's gain you receive, using one or more tools. Let's go through them with clearly made-up round numbers, just to show the mechanics.",
      "The first is a cap. A cap is the most interest you can earn in a period. Say, just for illustration, the index rises ten percent and the cap is six percent. You'd be credited six.",
      "The second is a participation rate. That's the share of the index gain you get. If, hypothetically, the index rises ten percent and your participation rate is fifty percent, you'd be credited five.",
      "The third is a spread, sometimes called a margin. That's an amount subtracted from the gain. If the index rises ten percent and the spread is two percent, you'd be credited eight.",
      "Again, those numbers are only examples. Real caps, participation rates and spreads differ by contract, and the insurer can usually reset them at each renewal, within limits the contract spells out. Index returns used in these calculations also typically leave out dividends.",
      "So what does that mean in practice? In a strong market year, you'll earn less than someone who invested directly. In a down year, you'll do better, because you didn't lose. Over time, many people think of a fixed indexed annuity as aiming for growth somewhere between a traditional fixed annuity and the market, with protection from drops. Whether it actually does better than a fixed annuity depends on how the markets behave and how the contract's limits are set, so no one can promise that.",
      "Now for the cautions. Fixed indexed annuities usually have longer surrender periods than many M-Y-G-As, so your money is committed for several years. Withdrawals beyond the free amount bring surrender charges. Some contracts offer a premium bonus, an extra amount added at the start, but a bonus usually comes with a longer surrender period or lower caps, and it may only become fully yours over time. And optional riders, such as an income rider, add a yearly fee that can reduce your value, even in a year when the index credits zero.",
      "That's why the honest answer to the question, can I lose money, is this: the market can't reduce your value, but surrender charges, rider fees and early withdrawals can.",
      "A fixed indexed annuity tends to fit people who want part of their savings shielded from market drops, want a chance at more growth than a fixed rate, and won't need that money for several years.",
      "In lesson four, we'll turn from growth to income, and look at annuities designed to send you a paycheck.",
    ],
    slides: [
      {
        heading: "Interest linked to an index",
        points: ["Still an insurance contract, not an investment", "Interest based partly on an index", "Your money is not in the market"],
      },
      {
        heading: "The floor",
        points: ["Index down: typically credited zero", "Credited interest is locked in", "Backed by the insurer's claims-paying ability"],
      },
      {
        heading: "Limits on the upside",
        points: ["Cap: the most you can earn", "Participation rate: your share of the gain", "Spread: an amount subtracted from the gain"],
      },
      {
        heading: "Hypothetical example, ten percent index gain",
        points: ["Six percent cap: credited six", "Fifty percent participation: credited five", "Two percent spread: credited eight"],
      },
      {
        heading: "Cautions",
        points: ["Often longer surrender periods", "Bonuses usually carry tradeoffs", "Rider fees can lower value in flat years"],
      },
    ],
    keyTakeaways: [
      "A fixed indexed annuity credits interest based on an index, but your money is not invested in the market, so a down year typically credits zero rather than a loss.",
      "Caps, participation rates and spreads limit your share of gains, and insurers can usually reset them at renewal.",
      "Surrender charges, rider fees and early withdrawals can still reduce your value, so plan to leave the money for the full term.",
    ],
    related: ["fixed-indexed-annuity", "can-you-lose-money-in-an-annuity", "variable-vs-fixed-indexed-annuity"],
  },
  {
    slug: "income-annuities",
    number: 4,
    title: "Income annuities: immediate and deferred",
    summary: "An income annuity turns a lump sum into guaranteed payments, starting now or at a date you choose later.",
    minutes: 4,
    narration: [
      "Welcome to lesson four, where we look at annuities built for one job: turning savings into a paycheck.",
      "For many people, the hardest part of retirement isn't saving the money. It's knowing how much they can safely spend without running out. An income annuity is designed to take some of that worry off the table. You give an insurance company a lump sum, and in return, it promises to pay you a set amount on a regular schedule, often for the rest of your life.",
      "Think of it as creating your own pension. If you had a pension at work, you know the comfort of a check that arrives every month no matter what the market does. An income annuity can do something similar with part of your savings. And like every annuity guarantee, those payments are backed by the claims-paying ability of the insurer.",
      "There are two main types, and the difference is timing.",
      "The first is the immediate annuity, sometimes called a single premium immediate annuity. You pay one premium, and payments usually begin within a year, often within a month. It's for people who need income now, such as someone who has just retired and wants to cover basic bills.",
      "The second is the deferred income annuity. You pay now, but payments start later, at a date you choose, often several years or more down the road. Because the insurer holds your money longer before paying, each payment is generally larger than it would be from an immediate annuity bought with the same amount. People sometimes use a deferred income annuity to plan for later years, for example to make sure income keeps coming in their eighties and beyond.",
      "What decides how much you'll receive? A few things. Your age when payments begin, since older buyers are expected to collect for fewer years. Interest rates when you buy. Whether payments cover just you, or you and a spouse. And whether you add any guarantees for your heirs.",
      "That last point deserves a moment. With the simplest form, called life only, payments continue as long as you live and then stop. That pays the most each month, but if you pass away early, nothing goes to your family. Many people choose an option that guarantees payments for a minimum number of years, or one that returns any unpaid premium to a beneficiary. Those options lower the monthly amount, but they protect against that worry. A joint option keeps paying as long as either spouse is alive, which is often important for couples.",
      "Some contracts also offer payments that rise each year by a set amount, to help with rising costs over time. The starting payment is lower in exchange.",
      "Now, the big tradeoff. Once payments start, an income annuity is usually not something you can cash in. You've traded a lump sum for a stream of income, and in most contracts that decision is permanent. That's why it's wise to put in only the part of your savings meant to cover steady expenses, and keep other money available for emergencies and surprises.",
      "Taxes work differently depending on where the money came from. Under general federal rules, if you bought the annuity with money from an I-R-A or a workplace plan that was never taxed, the payments are generally fully taxable as income. If you used money that was already taxed, part of each payment is treated as a return of your own money and part as taxable earnings. Your tax situation is your own, so confirm the details with a tax professional.",
      "An income annuity tends to fit people who want reliable income for life, worry about outliving their savings, and are comfortable giving up access to that portion of their money.",
      "In lesson five, we'll look at variable annuities, and why they are a very different animal from everything we've covered so far.",
    ],
    slides: [
      {
        heading: "A paycheck from your savings",
        points: ["Lump sum in, regular payments out", "Payments can last your whole life", "Backed by the insurer's claims-paying ability"],
      },
      {
        heading: "Two types, different timing",
        points: ["Immediate: payments begin within a year", "Deferred: payments begin at a later date", "Waiting longer generally means larger payments"],
      },
      {
        heading: "What sets the payment",
        points: ["Your age when payments start", "Interest rates when you buy", "Single or joint, and any heir guarantees"],
      },
      {
        heading: "Payout choices",
        points: ["Life only pays most, nothing left after", "Period certain or refund protects heirs", "Joint keeps paying while either spouse lives"],
      },
      {
        heading: "The big tradeoff",
        points: ["Usually cannot cash in once started", "Use only money meant for steady bills", "Keep separate savings for emergencies"],
      },
    ],
    keyTakeaways: [
      "An income annuity trades a lump sum for regular payments, which can last for life and are backed by the insurer's claims-paying ability.",
      "Immediate annuities start paying within a year; deferred income annuities start later and generally pay more for the same premium.",
      "Once payments begin, the money is usually not accessible as a lump sum, so keep separate savings for emergencies.",
    ],
    related: ["income-annuity", "immediate-vs-deferred-annuity", "deferred-income-annuity"],
  },
  {
    slug: "variable-annuities",
    number: 5,
    title: "Variable annuities, and why they are different",
    summary: "A variable annuity is a security invested in the market, so it carries market risk and usually higher fees.",
    minutes: 4,
    narration: [
      "Welcome to lesson five, where we look at variable annuities and why they belong in a category of their own.",
      "Everything we've covered so far, fixed annuities, M-Y-G-As, fixed indexed annuities and income annuities, shares one thing. The market can't reduce your value. A variable annuity is different. With a variable annuity, your money really is invested in the market, and its value can go down as well as up. That includes losing part of the money you put in.",
      "Here's how it works. Inside a variable annuity, you choose from a menu of investment options called subaccounts. They work much like mutual funds, holding stocks, bonds or a mix. Your account value rises and falls with how those subaccounts perform. Like other annuities, growth is generally tax-deferred under federal rules until you take money out.",
      "Because your money is invested in the market, a variable annuity is a security, not just an insurance product. That has a few practical effects. It's regulated both by state insurance departments and by federal securities regulators. It comes with a document called a prospectus, which explains the investment options, the risks and every fee. And the person who sells it must hold a securities license, in addition to an insurance license. If someone offers you a variable annuity, it's fair to ask to see both.",
      "Now let's talk about fees, because this is where variable annuities differ most. A variable annuity often carries several layers of cost. There's usually a mortality and expense charge, which pays the insurer for the insurance guarantees and its costs. There are administrative fees. Each subaccount has its own investment management expenses, just like a mutual fund. And if you add optional riders, each one carries its own yearly charge. Added together, these costs are often higher than what you'd pay for many other annuities or for investing on your own. Fees reduce your returns every year, in good markets and bad, so it's worth adding them all up before you decide. The prospectus lists them.",
      "Why would anyone choose one, then? Some people want market growth, plus tax deferral, plus insurance features they can't get from an ordinary investment account. Many variable annuities offer a death benefit that can guarantee your heirs receive at least a certain amount, even if the market has fallen. Some offer optional living benefit riders that guarantee a level of lifetime withdrawals, no matter how the investments perform. These features can be valuable. Just remember that they cost extra, they come with rules about how much you can take out, and the guarantees are backed by the insurer's claims-paying ability.",
      "Variable annuities also have surrender periods, so taking out more than the free amount in the early years brings a charge, on top of any market losses.",
      "And here's a tax point worth knowing. Investments held in an ordinary taxable account may get favorable capital gains treatment. Under general federal rules, earnings taken out of a variable annuity are taxed as ordinary income instead. For some people that's a meaningful difference. As always, confirm your own situation with a tax professional.",
      "So when is a variable annuity worth a look? It may suit someone who has already used their other tax-advantaged accounts, wants market exposure, has a long time horizon, and values the specific guarantees enough to pay for them. It's usually a poor fit for someone who can't stomach losses, needs the money in the next several years, or is mainly looking for safety. For safety, the fixed options we covered earlier are generally the better match.",
      "In lesson six, we'll pull it all together and look closely at fees, surrender charges, taxes, and how you actually get to your money.",
    ],
    slides: [
      {
        heading: "Invested in the market",
        points: ["Money goes into subaccounts", "Value rises and falls with investments", "You can lose money, including principal"],
      },
      {
        heading: "A security, not just insurance",
        points: ["Regulated by insurance and securities regulators", "Comes with a prospectus", "Seller needs a securities license too"],
      },
      {
        heading: "Layers of fees",
        points: ["Mortality and expense charge", "Administrative fees", "Subaccount investment expenses", "Optional rider charges"],
      },
      {
        heading: "Why people choose one",
        points: ["Market growth with tax deferral", "Death benefit guarantees for heirs", "Optional lifetime withdrawal riders, at extra cost"],
      },
      {
        heading: "Fit check",
        points: ["Maybe: long horizon, wants market exposure", "Poor fit: needs safety or short-term access", "Earnings taxed as ordinary income"],
      },
    ],
    keyTakeaways: [
      "A variable annuity invests in market subaccounts, so its value can fall and you can lose money, including principal.",
      "It is a security sold with a prospectus by someone holding both insurance and securities licenses, and its layered fees are often higher than other annuities.",
      "Death benefit and living benefit riders add guarantees backed by the insurer's claims-paying ability, but each carries an extra charge.",
    ],
    related: ["variable-vs-fixed-indexed-annuity", "annuity-fees-explained", "can-you-lose-money-in-an-annuity"],
  },
  {
    slug: "fees-surrender-charges-taxes-access",
    number: 6,
    title: "Fees, surrender charges, taxes and getting to your money",
    summary: "What an annuity costs, what leaving early costs, how withdrawals are taxed, and the ways you can reach your money.",
    minutes: 5,
    narration: [
      "Welcome to lesson six, where we cover the practical side: what an annuity costs, how taxes work, and how you get to your money.",
      "Let's start with fees, because they vary a lot by type. A basic fixed annuity or M-Y-G-A usually has no yearly fee that you see. The insurer's costs are built into the rate it offers. A fixed indexed annuity is similar, unless you add an optional rider, such as an income rider, which carries a yearly charge. Variable annuities, as we saw in lesson five, usually have several layers of fees. Whatever the type, a good question to ask is simple: what will this contract cost me each year, in total, and what am I getting for it?",
      "Next, surrender charges. Nearly every deferred annuity has a surrender period, a number of years when taking out more than the allowed amount brings a charge. The charge is usually a percentage of the amount withdrawn, and it typically steps down each year until it reaches zero. Here's a simple made-up example. Imagine a contract with a seven-year schedule that starts at seven percent and drops by one point each year. In year one, an excess withdrawal would be charged seven percent. In year five, three percent. After year seven, nothing. Real schedules differ, so always read the one in your contract.",
      "Surrender charges exist because the insurer invests your money for the long term to back its promises. They're a reason to put in only money you're confident you won't need during that period.",
      "Now, the good news. You usually aren't locked out completely. Here are the common ways to reach your money.",
      "First, free withdrawals. Many contracts let you take out a portion each year without a surrender charge, often a set percentage of the value. Second, required minimum distributions. If your annuity is inside an I-R-A, most contracts let you take your required minimum distributions without a surrender charge. Third, hardship waivers. Many contracts waive surrender charges if you're confined to a nursing home or diagnosed with a terminal illness, under conditions the contract spells out. Fourth, the end of the surrender period, when the charges go away. And fifth, turning the contract into income.",
      "There's also a protection right at the start called the free look period. After you receive your contract, you have a set number of days, which varies by state and is often somewhere between ten and thirty, to cancel and get your money back. Use it to read the contract carefully.",
      "Now, taxes. Here's the general federal picture, and as always, confirm your own situation with a tax professional.",
      "If you bought your annuity with money that was already taxed, it's called non-qualified. The growth is tax-deferred. When you take withdrawals, the earnings are generally treated as coming out first, and they're taxed as ordinary income. Once the earnings are out, the rest is your own money coming back to you, which isn't taxed again.",
      "If your annuity is inside an I-R-A or came from a workplace plan like a four-oh-one-k, it's called qualified. Since that money was generally never taxed, withdrawals are generally fully taxable as income, and required minimum distributions apply.",
      "Either way, taking earnings before age fifty-nine and a half generally brings an extra ten percent federal penalty, on top of regular income tax, unless an exception applies.",
      "Two more tax points. First, the one oh three five exchange. That part of the tax code lets you move money from one annuity directly into another without paying tax on the gain at that moment. It can be useful, but a new contract may come with a new surrender period, so an exchange should clearly leave you better off. Second, when an annuity passes to a beneficiary, the gain is generally taxable to them as income. It doesn't get the step-up in cost basis that some other inherited assets receive.",
      "And finally, liquidity overall. Annuities are not as liquid as a bank account. That's by design. A sound plan keeps an emergency fund outside the annuity, so a surprise expense never forces you to pay a surrender charge.",
      "In our final lesson, we'll bring everything together and help you decide whether an annuity is right for you.",
    ],
    slides: [
      {
        heading: "What it costs",
        points: ["Fixed and MYGA: costs built into the rate", "Indexed: fees mainly from optional riders", "Variable: several layers of fees"],
      },
      {
        heading: "Surrender charges",
        points: ["Apply to excess withdrawals in early years", "Usually step down each year to zero", "Hypothetical: seven percent, falling one point yearly"],
      },
      {
        heading: "Ways to reach your money",
        points: ["Yearly free withdrawal amount", "Required minimum distributions from an IRA", "Nursing home and terminal illness waivers", "Free look period at the start"],
      },
      {
        heading: "General federal tax rules",
        points: ["Non-qualified: earnings come out first, taxed", "Qualified: withdrawals generally fully taxable", "Before fifty-nine and a half: possible penalty"],
      },
      {
        heading: "Exchanges and heirs",
        points: ["A 1035 exchange defers tax", "A new contract may restart surrender charges", "Heirs generally owe income tax on gains"],
      },
      {
        heading: "Keep an emergency fund",
        points: ["Annuities are less liquid by design", "Keep cash outside the annuity", "Confirm taxes with a tax professional"],
      },
    ],
    keyTakeaways: [
      "Surrender charges usually step down to zero over several years, and most contracts allow some free withdrawals, RMDs and hardship waivers along the way.",
      "Under general federal rules, annuity earnings are taxed as ordinary income, and withdrawals before age 59 and a half may add a 10 percent penalty; confirm with a tax professional.",
      "A 1035 exchange can move money between annuities without immediate tax, but check whether it restarts a surrender period.",
    ],
    related: ["annuity-surrender-charges", "how-annuities-are-taxed", "annuity-liquidity-access"],
  },
  {
    slug: "is-an-annuity-right-for-you",
    number: 7,
    title: "Is an annuity right for you?",
    summary: "Who annuities tend to fit, who they do not, the questions to ask, and how to check an advisor's license.",
    minutes: 4,
    narration: [
      "Welcome to lesson seven, the final lesson, where we help you decide whether an annuity belongs in your plan at all.",
      "Let's be honest from the start. An annuity is not a must-have. Plenty of people retire well without one. But for certain needs, it can do a job that's hard to do any other way. The key is matching the tool to the job.",
      "So who do annuities tend to fit? People who want part of their savings protected from market drops. People who worry about outliving their money and want income they can't outlive. People who want a known, guaranteed rate for a set number of years, often as an alternative when C-Ds come due. And people who have savings outside retirement accounts and would like to defer taxes on the growth.",
      "And who do they usually not fit? Anyone who might need the money in the next few years. Anyone without an emergency fund set aside. Anyone who wants full market returns and is comfortable riding out the ups and downs. And anyone who feels rushed or unsure. If you don't understand a contract, that alone is a good reason to wait.",
      "A useful way to think about it is by job. If the job is safety and a known rate, look at fixed annuities and M-Y-G-As. If the job is protection with a chance at more growth, look at fixed indexed annuities. If the job is lifetime income, look at income annuities. If the job is market growth with insurance features, and you accept the risk and fees, a variable annuity may be worth discussing. And for many people, the right answer is to use an annuity for only part of their savings, or not at all.",
      "Before you buy any annuity, here are questions worth asking out loud. What exactly is guaranteed, and what isn't? How strong is the insurance company? How long is the surrender period, and what are the charges each year? How much can I take out each year for free? What are all the fees, including riders? How will withdrawals be taxed in my situation? What happens to this money if I pass away? And how is the person recommending it paid? A good advisor will welcome every one of those questions and answer them plainly.",
      "If you're thinking of replacing an annuity you already own, add one more question. Will the new contract leave me clearly better off, after any surrender charges and a new surrender period? A replacement should benefit you, not just restart the clock.",
      "Next, check who you're working with. Anyone who sells an annuity must hold an insurance license in your state. You can confirm that through your state's insurance department, which usually offers a free license lookup online. The National Association of Insurance Commissioners also keeps a consumer tool for looking up agents. If someone is offering a variable annuity, they also need a securities license, and you can look that up with FINRA's free BrokerCheck tool. It only takes a few minutes, and it's worth doing every time.",
      "Then, use the free look period after you buy. Read the contract, and if it isn't what you expected, you can cancel within that window.",
      "If you'd like a second set of eyes, that's what we're here for. Rare Legacy Life Group is an independent insurance agency, with licensed advisors in forty-nine states. We're not able to serve California. Because we're independent, we can compare options from many insurers instead of just one. You can request a free review with a licensed Rare Legacy advisor using the link below this video. We'll listen to what you're trying to do, answer your questions, and tell you honestly if an annuity doesn't fit. There's no cost and no obligation, and no pressure to decide anything.",
      "Thank you for taking Annuities one oh one. We hope you feel more confident, and better prepared to ask good questions. Take care, and we'll be glad to help whenever you're ready.",
    ],
    slides: [
      {
        heading: "Who annuities tend to fit",
        points: ["Want protection from market drops", "Want income they cannot outlive", "Want a known rate for set years", "Want tax-deferred growth on savings"],
      },
      {
        heading: "Who they usually do not fit",
        points: ["May need the money soon", "No emergency fund yet", "Want full market returns", "Feel rushed or unsure"],
      },
      {
        heading: "Questions to ask",
        points: ["What is guaranteed, and what is not?", "Surrender period, charges and free withdrawals?", "All fees, taxes, and death benefit?", "How is the advisor paid?"],
      },
      {
        heading: "Check the license",
        points: ["State insurance department license lookup", "NAIC consumer agent lookup", "FINRA BrokerCheck for variable annuities"],
      },
      {
        heading: "A free, no-pressure review",
        points: ["Independent agency, advisors licensed in 49 states", "Not available in California", "Request a review below this video"],
      },
    ],
    keyTakeaways: [
      "Match the annuity to the job: safety, protected growth, lifetime income or market growth, or decide you do not need one.",
      "Ask about guarantees, surrender charges, free withdrawals, every fee, taxes, the death benefit and how the advisor is paid.",
      "Confirm an advisor's insurance license with your state insurance department, and check FINRA BrokerCheck for anyone selling variable annuities.",
    ],
    related: ["who-should-buy-an-annuity", "how-to-choose-an-annuity-advisor", "annuity-free-look-period"],
  },
];

export const ANNUITY_COURSE: { slug: string; title: string; description: string; lessons: CourseLesson[] } = {
  slug: "annuities-101",
  title: "Annuities 101",
  description:
    "A free seven-lesson course in plain English: how annuities work, the main types, fees, surrender charges and taxes, and how to tell if one fits you.",
  lessons: LESSONS,
};
