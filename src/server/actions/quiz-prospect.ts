"use server";

import { isIP } from "node:net";
import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/env";
import { clip, pageForIntake, sendToEndlessOne } from "@/lib/endless-one/intake";
import { protectEstimate } from "@/lib/estimates/income-estimate";
import { QUIZ_PAGES, quizNote } from "@/lib/quiz";
import { PROTECT_BEST_TIME, quizProspectSchema } from "@/lib/validation/forms";

/**
 * A quiz prospect (Chris, 2026-11-24: "i think an email only drop off should be classified as a prospect"). When someone taps
 * Continue on the quiz's name and email screen, their name, email and quiz taps go to Endless One marked `partial`, under their own
 * id, with no phone, ZIP or consent. Endless One keeps them as a prospect and sends and counts nothing. If they go on to finish,
 * the finished request (src/server/actions/protect-request.ts, its own id) makes that prospect a lead like any new one.
 * OFF unless the server-only QUIZ_PROSPECTS is "on": Endless One must take a `partial` request first (its branch
 * feature/rl-quiz-prospects, runbook Part 3 item 3208); before that it would refuse every one of these.
 * The site keeps no copy of a prospect: its retirement table needs a phone and a consent. Never throws and tells the page nothing,
 * so the quiz never waits on it or shows an error for it.
 */
const CLICK_ID = /^[A-Za-z0-9_-]{1,200}$/;

export async function sendQuizProspect(formData: FormData): Promise<void> {
  try {
    if (process.env.QUIZ_PROSPECTS?.trim().toLowerCase() !== "on") return;
    const parsed = quizProspectSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return;
    const input = parsed.data;
    if (input.website) return;
    const elapsed = Date.now() - Number(input.started_at);
    if (!Number.isFinite(elapsed) || elapsed < 1_500 || elapsed > 4 * 60 * 60 * 1_000) return;

    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
    const candidate = forwardedFor ?? headerStore.get("x-real-ip");
    const page = QUIZ_PAGES[input.quiz_page];
    const estimate = protectEstimate(input.goal, input.amount_tier, input.age_band, input.term_years);
    const clickId = (value: string | null | undefined) => (value && CLICK_ID.test(value) ? value : null);

    await sendToEndlessOne({
      version: 1,
      form: "retirement",
      submissionId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      person: { firstName: clip(input.first_name, 100), lastName: clip(input.last_name, 100), email: input.email },
      retirement: {
        meetingStyle: "phone",
        bestTimeToContact: PROTECT_BEST_TIME,
        question: clip(quizNote(input), 2500),
        amountTier: input.amount_tier,
        partial: true,
        ...(estimate ? { estimate } : {}),
      },
      consents: [],
      page: { url: pageForIntake(input.landing_page ?? `${getSiteUrl()}${page.path}`) },
      attribution: {
        source: clip(input.utm_source, 200),
        medium: clip(input.utm_medium, 200),
        campaign: clip(input.utm_campaign, 200),
        content: clip(input.utm_content, 200),
        term: clip(input.utm_term, 200),
        gclid: clickId(input.gclid),
        gbraid: clickId(input.gbraid),
        wbraid: clickId(input.wbraid),
      },
      client: { ip: candidate && isIP(candidate) ? candidate : null },
    });
  } catch (error) {
    console.error("Quiz prospect was not sent", error instanceof Error ? error.name : "UnknownError");
  }
}
