"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, Lock, TrendingUp } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  ESTIMATE_AGE_BANDS,
  GROWTH_TERMS,
  INDEXED_TERMS,
  formatDollars,
  formatRate,
  growthEstimate,
  indexedBonusEstimate,
  monthlyIncomeEstimate,
} from "@/lib/estimates/income-estimate";
import { PROTECT_AMOUNT_TIERS, PROTECT_BEST_TIMES } from "@/lib/validation/forms";
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

/**
 * The Google Ads page's one short form: the amount first (one tap) and an age band, which show a rough monthly income range right
 * away (Chris, 2026-11-10), or, for the two growth choices, a number of years and what the amount could grow to (2026-11-11); then how
 * to reach you for exact quotes. The goal, age band and period only drive the estimate and are never sent.
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
  const income = goal === "income" ? monthlyIncomeEstimate(tier, age) : null;
  const growth = goal === "growth" ? growthEstimate(tier, term) : null;
  const indexed = goal === "indexed" ? indexedBonusEstimate(tier, term) : null;
  const estimate = income ?? growth ?? indexed;
  const terms = goal === "indexed" ? INDEXED_TERMS : GROWTH_TERMS;
  const estimateShown = useRef(false);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    if (landingPageRef.current) landingPageRef.current.value = window.location.href;
    if (referrerRef.current) referrerRef.current.value = document.referrer;
    trackEvent("protect_start", {});
  }, []);

  useEffect(() => {
    if (!estimate || estimateShown.current) return;
    estimateShown.current = true;
    trackEvent("protect_estimate_view", { goal });
  }, [estimate, goal]);

  useEffect(() => {
    if (state.ok) trackEvent("protect_submit", {});
    else if (state.message) trackEvent("protect_error", {});
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
    <form action={action} className="space-y-5 rounded-2xl bg-white p-6 text-[#050505] shadow-xl sm:p-8">
      <label className="block">
        <span className="text-base font-semibold">What are you looking for?</span>
        <select
          className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none focus:border-brand-black-500 sm:text-sm"
          value={goal}
          onChange={(event) => {
            const next = event.target.value;
            setGoal(next === "growth" || next === "indexed" ? next : "income");
            setTerm(null);
          }}
          aria-describedby="protect-estimate"
        >
          <option value="income">Income for life</option>
          <option value="growth">Guaranteed fixed rate</option>
          <option value="indexed">Bonus + market growth</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-base font-semibold">About how much are you looking to protect?</legend>
        <p className="mt-1 text-sm text-neutral-600">
          {goal === "income"
            ? "Pick an amount and your age to see a rough monthly income range."
            : goal === "growth"
              ? "Pick an amount and how long to lock in a rate to see what it could grow to."
              : "Pick an amount and how many years to see the bonus added on day one."}
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
                onChange={() => setTier(value)}
              />
              {label}
            </label>
          ))}
        </div>
        {error("amount_tier")}
      </fieldset>

      {goal === "income" ? (
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Your age</span>
          <select
            className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none focus:border-brand-black-500 sm:text-sm"
            value={age ?? ""}
            onChange={(event) => setAge(event.target.value || null)}
            aria-describedby="protect-estimate"
          >
            <option value="">Select</option>
            {ESTIMATE_AGE_BANDS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">{goal === "indexed" ? "How many years" : "Lock in a rate for"}</span>
          <select
            className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none focus:border-brand-black-500 sm:text-sm"
            value={term ?? ""}
            onChange={(event) => setTerm(event.target.value || null)}
            aria-describedby="protect-estimate"
          >
            <option value="">Select</option>
            {terms.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div id="protect-estimate" aria-live="polite">
        {indexed ? (
          <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <TrendingUp aria-hidden="true" className="h-4 w-4 text-brand-black-500" />
              On about {formatDollars(indexed.amount)}, a {indexed.years}-year bonus could add roughly
            </p>
            <p className="font-premium mt-1 text-2xl font-semibold text-[#050505]">
              {formatDollars(indexed.low)} to {formatDollars(indexed.high)} on day one
            </p>
            <p className="mt-1 text-sm text-neutral-700">
              So your account could start near {formatDollars(indexed.startLow)} to {formatDollars(indexed.startHigh)}, then
              earn more in years the market index rises, and never lose value when it falls.
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-600">
              A rough illustration, not a quote or a guarantee. The bonus becomes fully yours over the {indexed.years} years, so
              leaving early can forfeit part of it and bring withdrawal charges, and the bonus version has a yearly charge of
              about 1%. Growth depends on the index and can be zero in a year. Bonus amounts vary by state and age. Leave your
              details below and an advisor will show you exact numbers.
            </p>
          </div>
        ) : growth ? (
          <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <TrendingUp aria-hidden="true" className="h-4 w-4 text-brand-black-500" />
              In {growth.years} years, about {formatDollars(growth.amount)} could grow to roughly
            </p>
            <p className="font-premium mt-1 text-2xl font-semibold text-[#050505]">
              {formatDollars(growth.low)} to {formatDollars(growth.high)}
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-600">
              A rough illustration, not a quote or a guarantee: a fixed multi-year annuity at about {formatRate(growth.lowRate)}{" "}
              to {formatRate(growth.highRate)} a year, compounded, with no withdrawals. Real rates depend on the carrier, the
              amount, and the day you buy, and taking money out early can mean surrender charges. Leave your details below and
              an advisor will show you exact rates.
            </p>
          </div>
        ) : income ? (
          <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <TrendingUp aria-hidden="true" className="h-4 w-4 text-brand-black-500" />
              On about {formatDollars(income.amount)}, guaranteed income for life could be roughly
            </p>
            <p className="font-premium mt-1 text-2xl font-semibold text-[#050505]">
              {formatDollars(income.low)} to {formatDollars(income.high)} a month
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-600">
              A rough illustration, not a quote or a guarantee: typical lifetime income for one person starting now. Your real
              amount depends on the carrier, the product, your age, and when income starts. Leave your details below and an
              advisor will show you exact quotes.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First and last name" name="full_name" autoComplete="name" required error={error("full_name")} />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={error("phone")} />
        <Field label="Email" name="email" type="email" autoComplete="email" required error={error("email")} />
        <Field label="ZIP code" name="zip_code" inputMode="numeric" autoComplete="postal-code" required error={error("zip_code")} />
      </div>

      <label className="block">
        <span className="text-sm font-medium text-neutral-700">Best time to reach you</span>
        <select
          className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base outline-none focus:border-brand-black-500 sm:text-sm"
          name="best_time_to_contact"
          required
          defaultValue=""
        >
          <option value="">Select</option>
          {PROTECT_BEST_TIMES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {error("best_time_to_contact")}
      </label>

      <label className="flex gap-3 text-xs leading-5 text-neutral-600">
        <input className="mt-0.5 h-4 w-4 shrink-0 accent-brand-black-500" name="consent_tcpa" type="checkbox" required />
        <span>
          I agree that Rare Legacy Life Group and its licensed professionals may call, email, or text me at the contact
          information I provide, including using automated technology, about my request and related insurance or retirement
          planning services. Message and data rates may apply. Consent is not a condition of purchasing any product or service.
        </span>
      </label>
      {error("consent_tcpa")}

      <input ref={startedAtRef} type="hidden" name="started_at" />
      <input ref={landingPageRef} type="hidden" name="landing_page" />
      <input ref={referrerRef} type="hidden" name="referrer" />
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

      <SubmitButton>{estimate ? "Get my exact quotes" : "Request my free review"}</SubmitButton>
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
