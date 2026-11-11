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
