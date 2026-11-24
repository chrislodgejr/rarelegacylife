"use server";

import { isIP } from "node:net";
import { cookies, headers } from "next/headers";
import { getSiteUrl } from "@/lib/env";
import { COURSE_COOKIE, COURSE_COOKIE_DAYS, COURSE_NOTE, COURSE_PATH } from "@/lib/course";
import { clip, pageForIntake, sendToEndlessOne } from "@/lib/endless-one/intake";
import { courseSignupSchema, PROTECT_BEST_TIME } from "@/lib/validation/forms";

export type CourseSignupState = { ok: boolean; fieldErrors?: Partial<Record<"first_name" | "last_name" | "email", string>> };

const CLICK_ID = /^[A-Za-z0-9_-]{1,200}$/;

/**
 * Unlocks the free course and hands the person to Endless One as a prospect, the same way the quiz's name-and-email screen does
 * (src/server/actions/quiz-prospect.ts): marked `partial`, no phone and no consent, so Endless One keeps them and sends nothing. The
 * prospect goes only while the server-only QUIZ_PROSPECTS is "on"; the course opens either way. A failure to reach Endless One never
 * stops the course from opening.
 */
export async function signUpForCourse(_state: CourseSignupState, formData: FormData): Promise<CourseSignupState> {
  const parsed = courseSignupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fieldErrors: CourseSignupState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "first_name" || field === "last_name" || field === "email") && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, fieldErrors };
  }
  const input = parsed.data;
  const cookieStore = await cookies();
  cookieStore.set(COURSE_COOKIE, "1", {
    path: "/courses",
    maxAge: COURSE_COOKIE_DAYS * 24 * 60 * 60,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  // A filled hidden field or a form sent faster than a person can type: open the course, send nothing.
  const elapsed = Date.now() - Number(input.started_at);
  const looksHuman = !input.website && Number.isFinite(elapsed) && elapsed >= 1_500 && elapsed <= 4 * 60 * 60 * 1_000;
  if (!looksHuman || process.env.QUIZ_PROSPECTS?.trim().toLowerCase() !== "on") return { ok: true };

  try {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
    const candidate = forwardedFor ?? headerStore.get("x-real-ip");
    const clickId = (value: string | null | undefined) => (value && CLICK_ID.test(value) ? value : null);
    await sendToEndlessOne({
      version: 1,
      form: "retirement",
      submissionId: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      person: { firstName: clip(input.first_name, 100), lastName: clip(input.last_name, 100), email: input.email },
      retirement: { meetingStyle: "phone", bestTimeToContact: PROTECT_BEST_TIME, question: COURSE_NOTE, partial: true },
      consents: [],
      page: { url: pageForIntake(input.landing_page ?? `${getSiteUrl()}${COURSE_PATH}`) },
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
    console.error("Course prospect was not sent", error instanceof Error ? error.name : "UnknownError");
  }
  return { ok: true };
}
