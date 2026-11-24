// The /protect estimate by text (Chris, 2026-11-13): the server works the estimate out from the submitted choices, the form no longer
// asks for a best time, and the thank-you never shows a figure.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ESTIMATE_AGE_BANDS,
  ESTIMATE_GOALS,
  GROWTH_TERMS,
  INDEXED_TERMS,
  TIER_ESTIMATE_AMOUNTS,
  broadEstimate,
  growthEstimate,
  indexedBonusEstimate,
  monthlyIncomeEstimate,
  protectEstimate,
} from "@/lib/estimates/income-estimate";
import {
  PROTECT_BEST_TIME,
  PROTECT_CONSENT_TEXT,
  PROTECT_CONSENT_VERSION,
  protectRequestSchema,
  protectSuccessMessage,
} from "@/lib/validation/forms";

const contact = {
  full_name: "Pat Example",
  phone: "(215) 555-0134",
  email: "pat@example.com",
  zip_code: "19403",
  amount_tier: "250k_500k",
  consent_tcpa: "on",
  started_at: "1",
};

test("income: monthly dollars, years null, same as the card", () => {
  const estimate = protectEstimate("income", "250k_500k", "65_69", undefined);
  const card = monthlyIncomeEstimate("250k_500k", "65_69");
  assert.deepEqual(estimate, { goal: "income", amount: 375_000, low: card.low, high: card.high, years: null });
  assert.deepEqual(estimate, { goal: "income", amount: 375_000, low: 2050, high: 2350, years: null });
});

test("growth: total after the term, starting amount, years", () => {
  const card = growthEstimate("150k_250k", "7");
  assert.deepEqual(protectEstimate("growth", "150k_250k", "65_69", "7"), {
    goal: "growth",
    amount: 200_000,
    low: card.low,
    high: card.high,
    years: 7,
  });
});

test("indexed: total after the term with the bonus", () => {
  const card = indexedBonusEstimate("1m_plus", "10");
  const estimate = protectEstimate("indexed", "1m_plus", null, "10");
  assert.deepEqual(estimate, { goal: "indexed", amount: 1_000_000, low: card.low, high: card.high, years: 10 });
  for (const value of [estimate.amount, estimate.low, estimate.high]) assert.ok(Number.isInteger(value));
});

test("no estimate when a choice is missing or does not fit the goal", () => {
  assert.equal(protectEstimate("income", "250k_500k", null, "7"), null);
  assert.equal(protectEstimate("growth", "250k_500k", "65_69", null), null);
  assert.equal(protectEstimate("growth", "250k_500k", null, "10"), null); // 10 years is indexed only
  assert.equal(protectEstimate("indexed", "250k_500k", null, "5"), null); // 5 years is growth only
  assert.equal(protectEstimate(undefined, "250k_500k", "65_69", "7"), null);
  assert.equal(protectEstimate("income", undefined, "65_69", null), null);
});

test("schema: no best time needed, choices optional", () => {
  const parsed = protectRequestSchema.safeParse(contact);
  assert.equal(parsed.success, true, JSON.stringify(parsed.error?.issues));
  assert.equal(parsed.data.goal, undefined);
  assert.equal("best_time_to_contact" in parsed.data, false);
});

test("schema: accepts every choice the estimate lib offers", () => {
  for (const goal of ESTIMATE_GOALS) assert.equal(protectRequestSchema.safeParse({ ...contact, goal }).success, true, goal);
  for (const [age_band] of ESTIMATE_AGE_BANDS)
    assert.equal(protectRequestSchema.safeParse({ ...contact, age_band }).success, true, age_band);
  for (const [term_years] of [...GROWTH_TERMS, ...INDEXED_TERMS])
    assert.equal(protectRequestSchema.safeParse({ ...contact, term_years }).success, true, term_years);
  const parsed = protectRequestSchema.parse({ ...contact, goal: "indexed", term_years: "10", age_band: "" });
  assert.equal(parsed.age_band, undefined);
  assert.deepEqual(protectEstimate(parsed.goal, parsed.amount_tier, parsed.age_band, parsed.term_years)?.years, 10);
});

test("schema: rejects choices the lib does not know", () => {
  assert.equal(protectRequestSchema.safeParse({ ...contact, goal: "crypto" }).success, false);
  assert.equal(protectRequestSchema.safeParse({ ...contact, age_band: "40_44" }).success, false);
  assert.equal(protectRequestSchema.safeParse({ ...contact, term_years: "3" }).success, false);
});

test("Endless One still gets a best time, within its 160 characters", () => {
  assert.ok(PROTECT_BEST_TIME.length >= 2 && PROTECT_BEST_TIME.length <= 160);
});

test("the short consent and its new version", () => {
  assert.equal(
    PROTECT_CONSENT_TEXT,
    "I agree Rare Legacy Life Group and its licensed agents may call and text me at this number, including automated texts, about my request. Consent isn't required to buy. Msg & data rates may apply. Reply STOP to opt out.",
  );
  assert.equal(PROTECT_CONSENT_VERSION, "protect-v2");
});

test("thank-you: by text and never a figure, or today's message without an estimate", () => {
  assert.equal(
    protectSuccessMessage("Pat", true),
    "Thanks, Pat. Your estimate is on its way by text. We text between 8 a.m. and 9 p.m. your time, so if it's late it will arrive in the morning.",
  );
  assert.match(protectSuccessMessage("", true), /^Thanks\. Your estimate is on its way by text\./);
  assert.match(protectSuccessMessage(null, true), /^Thanks\. /);
  assert.doesNotMatch(protectSuccessMessage("Pat", true), /\$|\d{3,}/);
  assert.equal(
    protectSuccessMessage("Pat", false),
    "Thank you. A licensed advisor will reach out shortly to set up your free review.",
  );
});

// 2026-11-14: a 9-digit number came through, so its estimate text could never arrive. The form now needs a full US number.
test("the phone must be a full US number: 10 digits, or 11 starting with 1", () => {
  for (const phone of ["(215) 555-0134", "215-555-0134", "+1 215 555 0134", "12155550134"])
    assert.equal(protectRequestSchema.safeParse({ ...contact, phone }).success, true, phone);
  for (const phone of ["215-555-013", "555-0134", "22155550134", "215-555-01345"]) {
    const parsed = protectRequestSchema.safeParse({ ...contact, phone });
    assert.equal(parsed.success, false, phone);
    assert.equal(parsed.error.issues[0].message, "Enter your full 10-digit phone number");
  }
});

// 2026-11-22: the page shows a broad range again. It may be looser than the text, never rosier.
test("the page's broad range: looser than the text, never higher, for every choice", () => {
  assert.deepEqual(broadEstimate(protectEstimate("income", "250k_500k", "65_69")), { low: 1800, high: 2300 });
  const choices = [
    ...ESTIMATE_AGE_BANDS.map(([age]) => ["income", age, null]),
    ...GROWTH_TERMS.map(([term]) => ["growth", null, term]),
    ...INDEXED_TERMS.map(([term]) => ["indexed", null, term]),
  ];
  for (const tier of Object.keys(TIER_ESTIMATE_AMOUNTS))
    for (const [goal, age, term] of choices) {
      const texted = protectEstimate(goal, tier, age, term);
      const shown = broadEstimate(texted);
      const name = [goal, tier, age ?? term].join(" ");
      assert.ok(shown.low < texted.low, `${name}: low`);
      assert.ok(shown.high <= texted.high, `${name}: high never above the text`);
      assert.ok(shown.high >= texted.low && shown.high > shown.low, `${name}: overlaps`);
    }
});

// The quiz pages (Chris, 2026-11-24): the same request with the quiz's taps and its page; a /protect request sends none of them.
test("quiz: the request takes the quiz's taps, and /protect's request is unchanged without them", async () => {
  const { QUIZ_PAGES, quizNote, quizTracking } = await import("@/lib/quiz");
  const plain = protectRequestSchema.parse({ ...contact, goal: "income", age_band: "65_69" });
  assert.equal(plain.quiz_page, undefined);
  assert.equal(quizNote(plain), null);

  const quiz = protectRequestSchema.parse({
    ...contact,
    goal: "growth",
    term_years: "5",
    quiz_page: "rates",
    retired: "within_5",
    worry: "market_loss",
    money_location: "cd_savings",
  });
  assert.equal(QUIZ_PAGES[quiz.quiz_page].path, "/annuity-rates");
  assert.equal(
    quizNote(quiz),
    "Quiz answers. Retired: Not yet, within 5 years. Biggest worry: Losing money in the market. Money is in: CDs or bank savings.",
  );
  // Empty hidden fields (a skipped question) mean not picked; an unknown page or answer is refused.
  assert.equal(protectRequestSchema.parse({ ...contact, retired: "", worry: "", money_location: "", quiz_page: "quiz" }).retired, undefined);
  assert.equal(protectRequestSchema.safeParse({ ...contact, quiz_page: "elsewhere" }).success, false);
  assert.deepEqual(quizTracking({ gclid: ["abc", "def"], utm_source: "google", other: "x", utm_term: "" }), { gclid: "abc", utm_source: "google" });
});

test("guides: every slug is unique and every related guide exists", async () => {
  const { GUIDES } = await import("@/content/guides");
  const slugs = GUIDES.map((guide) => guide.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const guide of GUIDES) {
    for (const related of guide.related) assert.ok(slugs.includes(related), `${guide.slug} links to missing guide ${related}`);
    const words = guide.answer.split(/\s+/).length;
    assert.ok(words >= 40 && words <= 75, `${guide.slug} short answer is ${words} words`);
  }
});
