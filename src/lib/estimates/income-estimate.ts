// The /protect instant estimate (Chris, 2026-11-10, after day one of ads: many searches ask "how much does a $100,000 annuity
// pay", and the page answered with a form). A rough range of guaranteed lifetime income for one person starting income now,
// shown before anyone gives contact details. Illustrative ranges, not carrier rates: keep them conservative, review them with
// compliance and the advisors when payout rates move, and never present them as a quote.

/** The amount each form tier stands for in the estimate. */
export const TIER_ESTIMATE_AMOUNTS = {
  under_150k: 100_000,
  "150k_250k": 200_000,
  "250k_500k": 375_000,
  "500k_1m": 750_000,
  "1m_plus": 1_000_000,
} as const;

export type EstimateTier = keyof typeof TIER_ESTIMATE_AMOUNTS;

/** Age bands and their yearly payout as a share of the amount, low to high. */
export const ESTIMATE_AGE_BANDS = [
  ["55_59", "55 to 59", 0.05, 0.06],
  ["60_64", "60 to 64", 0.055, 0.065],
  ["65_69", "65 to 69", 0.065, 0.075],
  ["70_74", "70 to 74", 0.075, 0.085],
  ["75_plus", "75 or older", 0.085, 0.1],
] as const;

export type EstimateAgeBand = (typeof ESTIMATE_AGE_BANDS)[number][0];

const roundTo50 = (value: number) => Math.round(value / 50) * 50;

/** The monthly range for a tier and age band, rounded to $50, or null when either is missing. */
export function monthlyIncomeEstimate(tier: string | null, age: string | null) {
  if (!tier || !age || !(tier in TIER_ESTIMATE_AMOUNTS)) return null;
  const band = ESTIMATE_AGE_BANDS.find(([value]) => value === age);
  if (!band) return null;
  const amount = TIER_ESTIMATE_AMOUNTS[tier as EstimateTier];
  return { amount, low: roundTo50((amount * band[2]) / 12), high: roundTo50((amount * band[3]) / 12) };
}

export const formatDollars = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// The growth estimate beside it (Chris, 2026-11-11: "what about an annuity that is just growth"): what the amount could grow
// to in a fixed multi-year guaranteed annuity (MYGA), for searchers comparing rates and CDs. Illustrative yearly rate ranges,
// not quotes: compounded yearly, updated when the carrier's rates move. The ranges are Athene MaxRate, the carrier the
// advisors use most (rate card 76048, as of October 14, 2026): lowest is under $100,000 in the PA/NJ/DE/OH/SC/TX group,
// highest is $100,000 and up elsewhere. The carrier is never named on the page.

/** Guarantee periods and their yearly rate, low to high. */
export const GROWTH_TERMS = [
  ["5", "5 years", 0.0575, 0.0605],
  ["7", "7 years", 0.058, 0.0615],
] as const;

export type GrowthTerm = (typeof GROWTH_TERMS)[number][0];

const roundTo1000 = (value: number) => Math.round(value / 1000) * 1000;

/** What the tier's amount could grow to over a term, rounded to $1,000, or null when either is missing. */
export function growthEstimate(tier: string | null, term: string | null) {
  if (!tier || !term || !(tier in TIER_ESTIMATE_AMOUNTS)) return null;
  const row = GROWTH_TERMS.find(([value]) => value === term);
  if (!row) return null;
  const amount = TIER_ESTIMATE_AMOUNTS[tier as EstimateTier];
  const years = Number(row[0]);
  return {
    amount,
    years,
    lowRate: row[2],
    highRate: row[3],
    low: roundTo1000(amount * (1 + row[2]) ** years),
    high: roundTo1000(amount * (1 + row[3]) ** years),
  };
}

export const formatRate = (rate: number) => `${(rate * 100).toFixed(2).replace(/\.?0+$/, "")}%`;

// The indexed option (Chris, 2026-11-11: "athene performance elite plus 10 ... the main 10 year we use", "performance elite 7
// year", "these have bonus's attached", then "provide a rough estimate where the annuity will be after the 10 year or 7 year
// with the bonus", the bonus itself "in the fine print"): a fixed indexed annuity with an up-front premium bonus, projected to
// the end of its term. Bonus ranges are the Plus versions' premium bonus in the states Rare Legacy is licensed in, from
// Athene's product guides (rates effective September 25, 2026): Performance Elite Plus 7 (68070) 5% to 6%; Performance Elite
// Plus 10 (68069) 21% to 25% for issue ages up to 75. Index credits are not guaranteed: the projection assumes 5.5% to 6.5% a
// year on average (Chris, 2026-11-11: "i think the average rate right now is 6.5%"), less the Plus rider's 0.95% a year.

/** Indexed terms and their up-front bonus, low to high. */
export const INDEXED_TERMS = [
  ["7", "7 years", 0.05, 0.06],
  ["10", "10 years", 0.21, 0.25],
] as const;

/** The yearly index credits the projection assumes, low to high, and the Plus rider's yearly charge. */
export const INDEXED_ASSUMED_CREDITS = [0.055, 0.065] as const;
export const INDEXED_RIDER_CHARGE = 0.0095;

/** What the tier's amount could be worth at the end of the term, bonus included, rounded to $1,000. */
export function indexedBonusEstimate(tier: string | null, term: string | null) {
  if (!tier || !term || !(tier in TIER_ESTIMATE_AMOUNTS)) return null;
  const row = INDEXED_TERMS.find(([value]) => value === term);
  if (!row) return null;
  const amount = TIER_ESTIMATE_AMOUNTS[tier as EstimateTier];
  const years = Number(row[0]);
  const grow = (bonus: number, credit: number) => amount * (1 + bonus) * (1 + credit - INDEXED_RIDER_CHARGE) ** years;
  return {
    amount,
    years,
    lowBonus: row[2],
    highBonus: row[3],
    low: roundTo1000(grow(row[2], INDEXED_ASSUMED_CREDITS[0])),
    high: roundTo1000(grow(row[3], INDEXED_ASSUMED_CREDITS[1])),
  };
}
