"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarCheck, CheckCircle2, Lock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { reportFormSubmit } from "@/lib/google-ads";
import { keepValuesOnSubmit } from "@/lib/forms/keep-values";
import {
  ESTIMATE_AGE_BANDS,
  GROWTH_TERMS,
  INDEXED_TERMS,
  protectEstimate,
  type EstimateGoal,
} from "@/lib/estimates/income-estimate";
import { QUIZ_MONEY_LOCATIONS, QUIZ_RETIRED, QUIZ_WORRIES, type QuizPage } from "@/lib/quiz";
import { RETIREMENT_SCHEDULER_URLS } from "@/lib/constants/retirement";
import { PROTECT_AMOUNT_TIERS, PROTECT_CONSENT_TEXT } from "@/lib/validation/forms";
import { submitProtectRequest, type ProtectRequestState } from "@/server/actions/protect-request";
import { Field, RangeCard, type ProtectTracking } from "@/components/forms/protect-form";
import { SubmitButton } from "@/components/forms/submit-button";

/**
 * The retirement quiz (Chris, 2026-11-24: "how the questions are laid out", then "yes build it"; src/lib/quiz.ts). One question a
 * screen, every answer a big tap that moves on by itself, a progress bar, and one line under each question, beside the advisor's photo, on why
 * it is asked. The last two screens are /protect's contact step, asking the same things under the same consent but split in two (name and
 * email, then phone and ZIP), a broad range on the page and the closer estimate by text (so a fake phone number gets no estimate). It submits through
 * /protect's action, which works the estimate out again on the server.
 * Steps are counted with trackEvent only (quiz_step, quiz_submit, quiz_error). They are not sent to Endless One's form-steps yet: that
 * feed is /protect's, and mixing the quiz into it would muddy its numbers until Endless One knows the quiz as its own page.
 */

type Choice = readonly [string, string, ...unknown[]];

const GOALS = [
  ["income", "Guaranteed income for life"],
  ["growth", "Growing my money at a fixed rate"],
  ["indexed", "Growing my money with no market losses"],
] as const;

type StepKey = "retired" | "worry" | "goal" | "money_location" | "amount_tier" | "age_or_term" | "contact" | "phone";
type QuestionKey = Exclude<StepKey, "contact" | "phone">;

const initialState: ProtectRequestState = { ok: false, message: "" };

export function RetirementQuiz({
  page,
  tracking,
  title,
  intro,
  goal: fixedGoal,
  advisor,
}: {
  page: QuizPage;
  tracking: ProtectTracking;
  /** The heading above the first question; the page's own h1 sits elsewhere on pages that have one. */
  title: string;
  intro: string;
  /** When the page already answers "what matters most" (the rates page is about fixed rates), that question is skipped. */
  goal?: EstimateGoal;
  advisor: { name: string; title: string; photo?: string };
}) {
  const [state, action] = useActionState(submitProtectRequest, initialState);
  const [answers, setAnswers] = useState<Record<string, string>>(fixedGoal ? { goal: fixedGoal } : {});
  const [index, setIndex] = useState(0);
  // Read once in the browser when the quiz opens, and written into the form's hidden fields as it is sent.
  const meta = useRef({ started_at: "", landing_page: "", referrer: "" });
  const contactRef = useRef<{ email: string; phone: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const goal: EstimateGoal = answers.goal === "growth" || answers.goal === "indexed" ? answers.goal : "income";
  const order: StepKey[] = [
    "retired",
    "worry",
    ...(fixedGoal ? [] : (["goal"] as const)),
    "money_location",
    "amount_tier",
    "age_or_term",
    // Two contact screens (Chris, 2026-11-24: "i thought we were not going to ask for the email and phone in the same form"): name and
    // email first, then phone, ZIP and the consent. One form and one send, at the end of the second screen.
    "contact",
    "phone",
  ];
  const step = order[Math.min(index, order.length - 1)];
  const age = goal === "income" ? answers.age_or_term : undefined;
  const term = goal === "income" ? undefined : answers.age_or_term;
  const figures = protectEstimate(goal, answers.amount_tier, age, term);

  useEffect(() => {
    meta.current = { started_at: String(Date.now()), landing_page: window.location.href, referrer: document.referrer };
    trackEvent("quiz_start", { page });
  }, [page]);

  useEffect(() => {
    if (state.ok) {
      trackEvent("quiz_submit", { page });
      if (contactRef.current) reportFormSubmit(contactRef.current);
      contactRef.current = null;
    } else if (state.message) {
      trackEvent("quiz_error", { page });
    }
  }, [state, page]);

  const go = (next: number) => {
    setIndex(next);
    // Each screen replaces the last, so move focus to its question for screen readers and keyboards.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const pick = (key: QuestionKey, value: string) => {
    setAnswers((current) => {
      // A different goal asks a different last question (age, or years), so an old answer to it no longer fits.
      const next = { ...current, [key]: value };
      if (key === "goal" && current.goal !== value) delete next.age_or_term;
      return next;
    });
    trackEvent("quiz_step", { page, step: key });
    go(index + 1);
  };

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-white p-6 text-[#050505] shadow-xl sm:p-8" role="status">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-brand-black-500" />
        <h2 className="font-premium mt-4 text-2xl font-semibold">Request received</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">{state.message}</p>
        <p className="mt-4 text-sm leading-6 text-neutral-700">
          Want to pick the time yourself? Choose a slot on {advisor.name}&apos;s calendar and skip the back and forth.
        </p>
        <a
          className="gold-gradient-button mt-4 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold"
          href={RETIREMENT_SCHEDULER_URLS.phone}
          rel="noopener"
          target="_blank"
          data-track="quiz_schedule_click"
        >
          <CalendarCheck aria-hidden="true" className="h-4 w-4" />
          Pick a time for my call
        </a>
      </div>
    );
  }

  const error = (name: string) =>
    state.fieldErrors?.[name] ? <span className="mt-1 block text-xs text-red-700">{state.fieldErrors[name]}</span> : null;

  const questions: Record<QuestionKey, { question: string; why: string; choices: readonly Choice[] }> = {
    retired: {
      question: "Are you retired?",
      why: "Your timeline changes which options are worth comparing.",
      choices: QUIZ_RETIRED,
    },
    worry: {
      question: "What worries you most about retirement?",
      why: "There is no wrong answer. It tells us where to start the conversation.",
      choices: QUIZ_WORRIES,
    },
    goal: {
      question: "If you had to pick one, what matters most?",
      why: "Each of these points to a different kind of annuity.",
      choices: GOALS,
    },
    money_location: {
      question: "Where is the money you're thinking about right now?",
      why: "A rollover, a maturing CD and a transfer each work a little differently.",
      choices: QUIZ_MONEY_LOCATIONS,
    },
    amount_tier: {
      question: "About how much are you looking to protect?",
      why: "A rough figure is fine. Every amount gets a real answer.",
      choices: PROTECT_AMOUNT_TIERS,
    },
    age_or_term:
      goal === "income"
        ? {
            question: "How old are you?",
            why: "Lifetime income depends heavily on the age it starts.",
            choices: [["under_55", "Under 55"], ...ESTIMATE_AGE_BANDS],
          }
        : {
            question: goal === "indexed" ? "How many years could this money stay put?" : "How long would you lock in a rate?",
            why: "Longer terms usually pay more, but your money is committed for that long.",
            choices: goal === "indexed" ? INDEXED_TERMS : GROWTH_TERMS,
          },
  };

  const total = order.length;
  const current = step === "contact" || step === "phone" ? null : questions[step];
  const onPhone = step === "phone";

  return (
    <div className="rounded-2xl bg-white p-6 text-[#050505] shadow-xl sm:p-8">
      <div className="flex items-center gap-3">
        {index > 0 ? (
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:border-brand-black-500"
            aria-label="Back to the previous question"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          <div className="gold-gradient h-full rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
        <span className="shrink-0 text-xs font-medium text-neutral-500">
          {index + 1} of {total}
        </span>
      </div>

      {index === 0 ? (
        <div className="mt-6">
          <p className="font-premium text-2xl font-semibold leading-tight sm:text-3xl">{title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{intro}</p>
        </div>
      ) : null}

      {current ? (
        <fieldset className="mt-6">
          <legend className="w-full">
            <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold leading-snug outline-none sm:text-2xl">
              {current.question}
            </h2>
          </legend>
          <div className="mt-4 grid gap-2">
            {current.choices.map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={answers[step] === value}
                onClick={() => pick(step as QuestionKey, value)}
                className="flex min-h-14 items-center rounded-xl border border-neutral-300 px-4 py-3 text-left text-base font-medium transition hover:border-brand-black-500 aria-pressed:border-brand-black-500 aria-pressed:bg-brand-cream-50"
              >
                {label}
              </button>
            ))}
          </div>
          <AdvisorLine advisor={advisor} text={current.why} />
        </fieldset>
      ) : (
        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            for (const [name, value] of Object.entries(meta.current)) {
              const field = event.currentTarget.elements.namedItem(name);
              if (field instanceof HTMLInputElement) field.value = value;
            }
            const data = new FormData(event.currentTarget);
            contactRef.current = { email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? "") };
            keepValuesOnSubmit(action)(event);
          }}
        >
          <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold leading-snug outline-none sm:text-2xl">
            {onPhone
              ? figures
                ? "Last step. Where should we text your estimate?"
                : "Last step. What's the best number to reach you?"
              : figures
                ? "Your estimate is ready. Who should we send it to?"
                : "Almost done. Who should the advisor ask for?"}
          </h2>

          {/* Both screens stay in the form so nothing typed is lost going back and forth; only one shows at a time. */}
          <div className={onPhone ? "hidden" : "space-y-5"}>
            <div aria-live="polite">{figures ? <RangeCard figures={figures} /> : null}</div>
            <Field label="First and last name" name="full_name" autoComplete="name" required error={error("full_name")} />
            <Field label="Email" name="email" type="email" autoComplete="email" required error={error("email")} />
            <button
              type="button"
              className="gold-gradient-button h-12 w-full rounded-xl px-5 text-sm font-semibold"
              onClick={(event) => {
                // The browser's own checks on this screen's two fields, since the form is not sent yet.
                const form = event.currentTarget.form;
                const fields = ["full_name", "email"].map((name) => form?.elements.namedItem(name));
                for (const field of fields) if (field instanceof HTMLInputElement && !field.reportValidity()) return;
                trackEvent("quiz_step", { page, step: "contact" });
                go(index + 1);
              }}
            >
              Continue
            </button>
          </div>

          <div className={onPhone ? "space-y-5" : "hidden"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile phone" name="phone" type="tel" autoComplete="tel" required error={error("phone")} />
              <Field label="ZIP code" name="zip_code" inputMode="numeric" autoComplete="postal-code" pattern="\d{5}(-\d{4})?" title="5-digit ZIP code" required error={error("zip_code")} />
            </div>
            <label className="flex gap-3 text-xs leading-5 text-neutral-600">
              <input className="mt-0.5 h-4 w-4 shrink-0 accent-brand-black-500" name="consent_tcpa" type="checkbox" required />
              <span>{PROTECT_CONSENT_TEXT}</span>
            </label>
            {error("consent_tcpa")}
            {error("amount_tier")}
            {/* A name or email the server refuses is on the screen before this one, so its message shows here too (Back fixes it). */}
            {error("full_name")}
            {error("email")}
          </div>

          <input type="hidden" name="quiz_page" value={page} />
          <input type="hidden" name="started_at" />
          <input type="hidden" name="landing_page" />
          <input type="hidden" name="referrer" />
          <input type="hidden" name="goal" value={goal} />
          <input type="hidden" name="amount_tier" value={answers.amount_tier ?? ""} />
          <input type="hidden" name="retired" value={answers.retired ?? ""} />
          <input type="hidden" name="worry" value={answers.worry ?? ""} />
          <input type="hidden" name="money_location" value={answers.money_location ?? ""} />
          {/* "Under 55" is asked but is not one of the estimate's age bands, so it is not sent: the request simply has no estimate. */}
          {age && age !== "under_55" ? <input type="hidden" name="age_band" value={age} /> : null}
          {term ? <input type="hidden" name="term_years" value={term} /> : null}
          {Object.entries(tracking).map(([name, value]) => (value ? <input key={name} type="hidden" name={name} value={value} /> : null))}
          <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {state.message && !state.ok ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {state.message}
            </p>
          ) : null}

          <div className={onPhone ? "space-y-5" : "hidden"}>
            <SubmitButton>{figures ? "Text me my estimate" : "Request my free review"}</SubmitButton>
          </div>
          <p className="flex items-center gap-2 text-xs text-neutral-500">
            <Lock aria-hidden="true" className="h-3.5 w-3.5" />
            Free and no obligation. Your information is never sold.
          </p>
        </form>
      )}
    </div>
  );
}

function AdvisorLine({ advisor, text }: { advisor: { name: string; title: string; photo?: string }; text: string }) {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#F7F5EF] px-4 py-3">
      {advisor.photo ? (
        <Image
          alt={`${advisor.name}, ${advisor.title}`}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          height={80}
          src={advisor.photo}
          width={80}
        />
      ) : null}
      <p className="text-sm leading-5 text-neutral-700">{text}</p>
    </div>
  );
}
