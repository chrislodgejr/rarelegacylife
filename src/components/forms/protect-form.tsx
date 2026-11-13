"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, MessageSquareText } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { formStepReporter, type FormStepReporter } from "@/lib/form-steps";
import { ESTIMATE_AGE_BANDS, GROWTH_TERMS, INDEXED_TERMS, protectEstimate } from "@/lib/estimates/income-estimate";
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
 * The estimate is texted, never shown (Chris, 2026-11-13, after 10 of 10 who saw it on the page left without their details: "require
 * people to click submit to get the quote ... lets just text them their estimate in that initial text ... That way entering a fake phone
 * number will not get you a estimate"): once the choices are in, a card says it is ready and the button reads "Text me my estimate".
 * The goal, age band and years are sent as hidden fields; the server works the estimate out again and Endless One texts it. The contact
 * step is name, phone, email and ZIP only (no best time) under a short consent.
 * Each step of a visit (Chris, 2026-11-12: "Is there a way to know if a person is filling it out and just not clicking submit") goes to
 * Endless One through /api/form-steps: opened, the goal, the amount tier, age or years picked, the estimate ready, the contact fields
 * started, consent, Submit pressed, the field the browser or the server stopped them on, sent. Never a typed value.
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
  // Only whether the estimate is ready: its figures are never shown, the server works them out again and Endless One texts them.
  const estimate = protectEstimate(goal, tier, age, term) !== null;
  const terms = goal === "indexed" ? INDEXED_TERMS : GROWTH_TERMS;
  const estimateShown = useRef(false);
  const reportRef = useRef<FormStepReporter | null>(null);
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
  }, [estimate, goal]);

  useEffect(() => {
    if (state.ok) {
      trackEvent("protect_submit", {});
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
      action={action}
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
            ? "Pick an amount and your age for a rough monthly income estimate, sent by text."
            : goal === "growth"
              ? "Pick an amount and how long to lock in a rate for an estimate of what it could grow to, sent by text."
              : "Pick an amount and how many years for an estimate of what it could grow to, sent by text."}
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

      <div id="protect-estimate" aria-live="polite">
        {estimate ? (
          <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
            <p className="font-premium flex items-center gap-2 text-lg font-semibold text-[#050505]">
              <MessageSquareText aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-black-500" />
              Your estimate is ready
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-700">We&apos;ll text it to you. Enter your details below.</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First and last name" name="full_name" autoComplete="name" required error={error("full_name")} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={error("phone")} />
        <Field label="Email" name="email" type="email" autoComplete="email" required error={error("email")} />
        <Field label="ZIP code" name="zip_code" inputMode="numeric" autoComplete="postal-code" required error={error("zip_code")} />
      </div>

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
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none placeholder:text-neutral-400 focus:border-brand-black-500 sm:text-sm"
        name={name}
        type={type}
        {...props}
      />
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
