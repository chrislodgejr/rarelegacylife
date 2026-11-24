"use client";

import { keepValuesOnSubmit } from "@/lib/forms/keep-values";
import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, MessageSquareText, PhoneCall } from "lucide-react";
import { SITE } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { reportFormSubmit } from "@/lib/google-ads";
import { formStepReporter, type FormStepReporter } from "@/lib/form-steps";
import {
  ESTIMATE_AGE_BANDS,
  GROWTH_TERMS,
  INDEXED_ASSUMED_CREDITS,
  INDEXED_TERMS,
  broadEstimate,
  formatDollars,
  formatRate,
  protectEstimate,
  type ProtectEstimate,
} from "@/lib/estimates/income-estimate";
import { PROTECT_AMOUNT_TIERS, PROTECT_CONSENT_TEXT } from "@/lib/validation/forms";
import { submitProtectRequest, type ProtectRequestState } from "@/server/actions/protect-request";
import { SubmitButton } from "@/components/forms/submit-button";

export type ProtectTracking = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
};

const initialState: ProtectRequestState = { ok: false, message: "" };
const CONTACT_FIELDS = ["full_name", "phone", "email", "zip_code"];

/**
 * The Google Ads page's one short form: the amount first (one tap) and an age band for a rough monthly income range (Chris,
 * 2026-11-10), or, for the two growth choices, a number of years for what the amount could grow to (2026-11-11); then how to reach you.
 * Test from 2026-11-22 (Chris: "Yes"): a broad range shows on the page and the closer estimate is still texted only. Before that,
 * from 2026-11-13, nothing showed (Chris, 2026-11-13, after 10 of 10 who saw it on the page left without their details: "require
 * people to click submit to get the quote ... lets just text them their estimate in that initial text ... That way entering a fake phone
 * number will not get you a estimate"): once the choices are in, a card says it is ready and the button reads "Text me my estimate".
 * The goal, age band and years are sent as hidden fields; the server works the estimate out again and Endless One texts it. The contact
 * step is name, phone, email and ZIP only (no best time) under a short consent.
 * Each step of a visit (Chris, 2026-11-12: "Is there a way to know if a person is filling it out and just not clicking submit") goes to
 * Endless One through /api/form-steps: opened, the goal, the amount tier, age or years picked, the estimate ready, the contact fields
 * started, consent, Submit pressed, the field the browser or the server stopped them on, sent. Never a typed value.
 * The contact step (Chris, 2026-11-24: "fix the form", after 131 ad visitors saw their estimate and only 14 started their details): when
 * the range first shows, the page scrolls it into view; the assumptions fold under "What this assumes"; the details sit under a "Last
 * step" heading with the phone first; and a tap-to-call link sits under the button for people who would rather talk now.
 */
export function ProtectForm({ tracking }: { tracking: ProtectTracking }) {
  const [state, action] = useActionState(submitProtectRequest, initialState);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const landingPageRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);
  const [goal, setGoal] = useState<"income" | "growth" | "indexed">("income");
  const [term, setTerm] = useState<string | null>(null);
  // Shown only as a broad range; the server works the figures out again and Endless One texts them.
  const figures = protectEstimate(goal, tier, age, term);
  const estimate = figures !== null;
  const terms = goal === "indexed" ? INDEXED_TERMS : GROWTH_TERMS;
  const estimateShown = useRef(false);
  const estimateRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<FormStepReporter | null>(null);
  // Kept in memory only from Submit until Endless One answers, for the Google tag's enhanced conversion (src/lib/google-ads.ts).
  const contactRef = useRef<{ email: string; phone: string } | null>(null);
  const report: FormStepReporter = (step, detail) => reportRef.current?.(step, detail);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    if (landingPageRef.current) landingPageRef.current.value = window.location.href;
    if (referrerRef.current) referrerRef.current.value = document.referrer;
    trackEvent("protect_start", {});
    reportRef.current = formStepReporter(Boolean(tracking.gclid || tracking.gbraid || tracking.wbraid));
    reportRef.current("view");
    // Only on load: the click ids do not change during the visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!estimate || estimateShown.current) return;
    estimateShown.current = true;
    trackEvent("protect_estimate_view", { goal });
    reportRef.current?.("estimate", goal);
    // On a phone the range and the next step sat below the fold: bring them into view once, when the range first appears.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    estimateRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [estimate, goal]);

  useEffect(() => {
    if (state.ok) {
      trackEvent("protect_submit", {});
      if (contactRef.current) reportFormSubmit(contactRef.current);
      contactRef.current = null;
      reportRef.current?.("submitted");
    } else if (state.message) {
      trackEvent("protect_error", {});
      const fields = Object.keys(state.fieldErrors ?? {});
      for (const field of fields.length ? fields : ["form"]) reportRef.current?.("server_error", field);
    }
  }, [state]);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-white p-6 text-[#050505] shadow-xl sm:p-8" role="status">
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-brand-black-500" />
        <h2 className="font-premium mt-4 text-2xl font-semibold">Request received</h2>
        <p className="mt-2 text-base leading-7 text-neutral-700">{state.message}</p>
      </div>
    );
  }

  const error = (name: string) =>
    state.fieldErrors?.[name] ? <span className="mt-1 block text-xs text-red-700">{state.fieldErrors[name]}</span> : null;

  return (
    <form
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        contactRef.current = { email: String(data.get("email") ?? ""), phone: String(data.get("phone") ?? "") };
        keepValuesOnSubmit(action)(event);
      }}
      className="space-y-5 rounded-2xl bg-white p-6 text-[#050505] shadow-xl sm:p-8"
      onFocusCapture={(event) => {
        const name = (event.target as EventTarget as HTMLInputElement).name;
        if (CONTACT_FIELDS.includes(name)) report("contact_start");
      }}
      onClickCapture={(event) => {
        if ((event.target as HTMLElement).closest('button[type="submit"]')) report("submit_click");
      }}
      onInvalidCapture={(event) => {
        // The browser's own required check stops the submit without telling the server; keep which field, never its value.
        report("blocked", (event.target as EventTarget as HTMLInputElement).name || "form");
      }}
    >
      <label className="block">
        <span className="text-base font-semibold">What are you looking for?</span>
        <select
          className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none focus:border-brand-black-500 sm:text-sm"
          value={goal}
          onChange={(event) => {
            const next = event.target.value;
            setGoal(next === "growth" || next === "indexed" ? next : "income");
            setTerm(null);
            report("goal_change", next);
          }}
          aria-describedby="protect-estimate"
        >
          <option value="income">Income for life</option>
          <option value="growth">Guaranteed fixed rate</option>
          <option value="indexed">Market growth, no losses</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-base font-semibold">About how much are you looking to protect?</legend>
        <p className="mt-1 text-sm text-neutral-600">
          {goal === "income"
            ? "Pick an amount and your age for a rough monthly income range. We text you the closer estimate."
            : goal === "growth"
              ? "Pick an amount and how long to lock in a rate for a rough range of what it could grow to. We text you the closer estimate."
              : "Pick an amount and how many years for a rough range of what it could grow to. We text you the closer estimate."}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PROTECT_AMOUNT_TIERS.map(([value, label]) => (
            <label
              key={value}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium has-[:checked]:border-brand-black-500 has-[:checked]:bg-brand-cream-50"
            >
              <input
                className="h-4 w-4 accent-brand-black-500"
                type="radio"
                name="amount_tier"
                value={value}
                required
                onChange={() => {
                  setTier(value);
                  report("amount", value);
                }}
              />
              {label}
            </label>
          ))}
        </div>
        {error("amount_tier")}
      </fieldset>

      {goal === "income" ? (
        <TapChoices
          legend="Your age"
          choices={ESTIMATE_AGE_BANDS}
          value={age}
          onPick={(value) => {
            setAge(value);
            report("age_or_term");
          }}
        />
      ) : (
        <TapChoices
          legend={goal === "indexed" ? "How many years" : "Lock in a rate for"}
          choices={terms}
          value={term}
          onPick={(value) => {
            setTerm(value);
            report("age_or_term");
          }}
        />
      )}

      <div id="protect-estimate" ref={estimateRef} aria-live="polite" className="scroll-mt-4">
        {figures ? <RangeCard figures={figures} /> : null}
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold">
          {estimate ? "Last step: where should we text your closer estimate?" : "Last step: how can we reach you?"}
        </legend>
        <Field
          label="Mobile phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          hint={estimate ? "Your estimate comes by text, usually within minutes (8 a.m. to 9 p.m. your time)." : undefined}
          error={error("phone")}
        />
        <Field label="First and last name" name="full_name" autoComplete="name" required error={error("full_name")} />
        <div className="grid grid-cols-[1fr_8rem] gap-3">
          <Field label="Email" name="email" type="email" inputMode="email" autoComplete="email" required error={error("email")} />
          <Field label="ZIP code" name="zip_code" inputMode="numeric" autoComplete="postal-code" maxLength={10} pattern="\d{5}(-\d{4})?" title="5-digit ZIP code" required error={error("zip_code")} />
        </div>
      </fieldset>

      <label className="flex gap-3 text-xs leading-5 text-neutral-600">
        <input
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-black-500"
          name="consent_tcpa"
          type="checkbox"
          required
          onChange={(event) => {
            if (event.target.checked) report("consent");
          }}
        />
        <span>{PROTECT_CONSENT_TEXT}</span>
      </label>
      {error("consent_tcpa")}

      <input ref={startedAtRef} type="hidden" name="started_at" />
      <input ref={landingPageRef} type="hidden" name="landing_page" />
      <input ref={referrerRef} type="hidden" name="referrer" />
      <input type="hidden" name="goal" value={goal} />
      {goal === "income" && age ? <input type="hidden" name="age_band" value={age} /> : null}
      {goal !== "income" && term ? <input type="hidden" name="term_years" value={term} /> : null}
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

      <SubmitButton>{estimate ? "Text me my estimate" : "Request my free review"}</SubmitButton>
      <p className="flex items-center gap-2 text-xs text-neutral-500">
        <Lock aria-hidden="true" className="h-3.5 w-3.5" />
        Free and no obligation. Your information is never sold.
      </p>
      <p className="border-t border-neutral-200 pt-4 text-sm text-neutral-700">
        Rather talk now?{" "}
        <a
          className="inline-flex items-center gap-1.5 font-semibold text-[#050505] underline underline-offset-4"
          href={SITE.phone.href}
          data-track="protect_form_call"
          onClick={() => trackEvent("protect_form_call", {})}
        >
          <PhoneCall aria-hidden="true" className="h-4 w-4" />
          Call {SITE.phone.display}
        </a>
      </p>
    </form>
  );
}

/** The broad range, with the disclaimers the on-page estimate carried, then the closer estimate by text. */
function RangeCard({ figures }: { figures: ProtectEstimate }) {
  const { goal, amount, years } = figures;
  const { low, high } = broadEstimate(figures);
  const bonus = goal === "indexed" ? INDEXED_TERMS.find(([value]) => value === String(years)) : undefined;
  const hasBonus = Boolean(bonus && bonus[3] > 0);
  return (
    <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
      <p className="text-sm font-medium text-neutral-700">
        {goal === "income"
          ? `On about ${formatDollars(amount)}, guaranteed income for life could be roughly`
          : `In ${years} years, about ${formatDollars(amount)} could grow to roughly`}
      </p>
      <p className="font-premium mt-1 text-2xl font-semibold text-[#050505]">
        {formatDollars(low)} to {formatDollars(high)}
        {goal === "income" ? " a month" : ""}
      </p>
      <p className="mt-2 flex items-start gap-2 text-sm font-medium leading-6 text-[#050505]">
        <MessageSquareText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-black-500" />
        Want a closer number? Enter your mobile below and we&apos;ll text your estimate.
      </p>
      <p className="mt-2 text-xs leading-5 text-neutral-600">A rough illustration, not a quote or a guarantee.</p>
      <details className="mt-1 text-xs leading-5 text-neutral-600">
        <summary className="cursor-pointer font-medium underline underline-offset-2">What this assumes</summary>
        <p className="mt-1">
        {goal === "income"
          ? "typical lifetime income for one person starting now. Your real amount depends on the carrier, the product, your age, and when income starts."
          : goal === "growth"
            ? "a fixed multi-year annuity, compounded, with no withdrawals. Real rates depend on the carrier, the amount, and the day you buy, and taking money out early can mean surrender charges."
            : `a fixed indexed annuity${
                hasBonus ? ` with an up-front bonus of about ${formatRate(bonus![2])} to ${formatRate(bonus![3])}` : ""
              }, assuming average index credits of up to ${formatRate(INDEXED_ASSUMED_CREDITS[1])} a year, with no withdrawals. Index credits are not guaranteed and can be zero in a year, though your value never drops because the market falls. ${
                hasBonus
                  ? `The bonus becomes fully yours over the ${years} years, so leaving early can forfeit part of it and bring withdrawal charges. Bonus amounts vary by state and age.`
                  : `Taking money out during the ${years} years beyond the yearly free amount can bring withdrawal charges.`
              }`}
        </p>
      </details>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  hint,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none placeholder:text-neutral-400 focus:border-brand-black-500 sm:text-sm"
        name={name}
        type={type}
        {...props}
      />
      {hint ? <span className="mt-1 block text-xs text-neutral-500">{hint}</span> : null}
      {error}
    </label>
  );
}

/**
 * Age or years as big tap buttons like the amounts (Chris, 2026-11-13: "Yes. Make the taps"): on phones 6 of the first 7 ad visitors who
 * picked an amount stopped at the old "Select" drop-down. Buttons, not radios; the form sends the pick as a hidden field (2026-11-13).
 */
function TapChoices({
  legend,
  choices,
  value,
  onPick,
}: {
  legend: string;
  choices: readonly (readonly [string, string, ...unknown[]])[];
  value: string | null;
  onPick: (value: string) => void;
}) {
  return (
    <fieldset aria-describedby="protect-estimate">
      <legend className="text-sm font-medium text-neutral-700">{legend}</legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {choices.map(([choice, label]) => (
          <button
            key={choice}
            type="button"
            aria-pressed={value === choice}
            onClick={() => onPick(choice)}
            className="flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 px-3 py-3 text-sm font-medium aria-pressed:border-brand-black-500 aria-pressed:bg-brand-cream-50"
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
