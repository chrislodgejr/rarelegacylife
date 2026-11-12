import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FORM_STEP_DETAILS, FORM_STEPS_MAX, sendStepsToEndlessOne, type FormStep } from "@/lib/endless-one/intake";

export const runtime = "nodejs";

// The /protect page's steps (Chris, 2026-11-12: "Is there a way to know if a person is filling it out and just not clicking submit"):
// the browser posts each step of a visit here (src/lib/form-steps.ts), and this route passes it to Endless One, signed with the intake
// secret the browser never sees. Only the fixed steps and details in FORM_STEP_DETAILS get through: a field's name, never what was
// typed. Always answers 204, so the page never waits on it or learns anything from it.

const BODY_LIMIT = 4096;
const steps = Object.keys(FORM_STEP_DETAILS) as [FormStep, ...FormStep[]];
const schema = z
  .object({
    visitId: z.string().uuid(),
    fromAd: z.boolean(),
    mobile: z.boolean(),
    steps: z
      .array(z.object({ step: z.enum(steps), detail: z.string().max(40).default("") }).strict())
      .min(1)
      .max(FORM_STEPS_MAX),
  })
  .strict();

const done = () => new NextResponse(null, { status: 204, headers: { "cache-control": "no-store" } });

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return done();
  const raw = await request.text();
  if (raw.length > BODY_LIMIT) return done();

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return done();
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return done();
  const kept = parsed.data.steps.filter(({ step, detail }) => (FORM_STEP_DETAILS[step] as readonly string[]).includes(detail));
  if (!kept.length) return done();

  await sendStepsToEndlessOne({
    version: 1,
    form: "steps",
    page: "/protect",
    visitId: parsed.data.visitId.toLowerCase(),
    fromAd: parsed.data.fromAd,
    mobile: parsed.data.mobile,
    steps: kept,
  });
  return done();
}
