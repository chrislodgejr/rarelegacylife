"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { COVERAGE_LABELS, COVERAGE_PURPOSES, HEALTH_RATINGS, US_STATES } from "@/lib/constants/options";
import { trackEvent } from "@/lib/analytics";
import { submitQuoteForm, type FormState } from "@/server/actions/public-forms";
import { SubmitButton } from "@/components/forms/submit-button";

type TrackingDefaults = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const initialState: FormState = { ok: false, message: "" };

/**
 * Three short steps, easiest questions first and contact details last:
 * people who have already invested a few taps are far more likely to finish.
 */
const steps = [
  { title: "What do you want to protect?", copy: "Pick what matters most. You can change this with your advisor later." },
  { title: "A few quick basics", copy: "Age, state, and general health shape which options are realistic." },
  { title: "Where should we send your options?", copy: "A licensed advisor will follow up the way you prefer. No obligation." },
] as const;

const purposeHints: Record<(typeof COVERAGE_PURPOSES)[number], string> = {
  family_protection: "Replace income for people who depend on you",
  mortgage_protection: "Keep the home if something happens",
  final_expenses: "Cover funeral and end-of-life costs",
  business_protection: "Key person, buy-sell, or business loans",
  wealth_transfer: "Leave a legacy or inheritance",
  not_sure_yet: "Help me figure it out",
};

export function QuoteForm({ tracking }: { tracking: TrackingDefaults }) {
  const [state, action] = useActionState(submitQuoteForm, initialState);
  const [step, setStep] = useState(0);
  const submissionIdRef = useRef<HTMLInputElement>(null);
  const landingPageRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    // One ID per form session: a double tap or retry can never create two leads.
    if (submissionIdRef.current) submissionIdRef.current.value = crypto.randomUUID();
    if (landingPageRef.current) landingPageRef.current.value = window.location.href;
    if (referrerRef.current) referrerRef.current.value = document.referrer;
    trackEvent("quote_start", { step: 1 });
  }, []);

  useEffect(() => {
    if (state.message) trackEvent("quote_error", { step: step + 1 });
  }, [state, step]);

  function goTo(nextStep: number) {
    setStep(nextStep);
    trackEvent("quote_step", { step: nextStep + 1 });
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goNext() {
    const fields = formRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`,
    );
    const firstInvalid = Array.from(fields ?? []).find((field) => !field.checkValidity());

    if (firstInvalid) {
      firstInvalid.reportValidity();
      return;
    }

    goTo(Math.min(step + 1, steps.length - 1));
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={() => trackEvent("quote_submit", { step: steps.length })}
      className="premium-card grid scroll-mt-24 gap-6 rounded-2xl p-5 text-[#050505] md:p-8"
    >
      <input ref={submissionIdRef} name="submission_id" type="hidden" defaultValue="" />
      <input ref={landingPageRef} name="landing_page" type="hidden" defaultValue="" />
      <input ref={referrerRef} name="referrer" type="hidden" defaultValue="" />
      <input name="utm_source" type="hidden" value={tracking.utm_source ?? ""} />
      <input name="utm_medium" type="hidden" value={tracking.utm_medium ?? ""} />
      <input name="utm_campaign" type="hidden" value={tracking.utm_campaign ?? ""} />
      <input name="utm_content" type="hidden" value={tracking.utm_content ?? ""} />
      <input name="utm_term" type="hidden" value={tracking.utm_term ?? ""} />
      {/* Honeypot: invisible to people, bots fill it in and get silently dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company website
          <input autoComplete="off" name="company_website" tabIndex={-1} type="text" />
        </label>
      </div>

      <div ref={topRef} className="scroll-mt-28">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="gold-gradient-text">
            Step {step + 1} of {steps.length}
          </span>
          <span className="flex items-center gap-1 text-neutral-500">
            <Lock aria-hidden="true" className="h-3.5 w-3.5" /> Private &amp; secure
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200">
          <motion.div
            className="gold-gradient-subtle h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <h2 className="font-premium mt-5 text-2xl font-semibold text-[#050505] sm:text-3xl">{steps[step].title}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{steps[step].copy}</p>
      </div>

      <div data-step="0" className={step === 0 ? "grid gap-5" : "hidden"}>
        <fieldset>
          <legend className="text-sm font-medium text-neutral-700">Main reason for coverage</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {COVERAGE_PURPOSES.map((purpose, index) => (
              <label
                key={purpose}
                className="flex cursor-pointer gap-3 rounded-xl border border-neutral-300 bg-white p-3 transition has-[:checked]:border-[#C9A227] has-[:checked]:bg-[#FBF6E4]"
              >
                <input
                  className="mt-1 h-4 w-4 accent-[#C9A227]"
                  name="coverage_purpose"
                  required={index === 0}
                  type="radio"
                  value={purpose}
                />
                <span>
                  <span className="block text-sm font-semibold text-[#050505]">{COVERAGE_LABELS[purpose]}</span>
                  <span className="block text-xs leading-5 text-neutral-500">{purposeHints[purpose]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Coverage amount"
            name="desired_coverage_amount"
            placeholder="Not sure yet"
            options={[
              ["25000", "$25,000 or less"],
              ["100000", "$100,000"],
              ["250000", "$250,000"],
              ["500000", "$500,000"],
              ["750000", "$750,000"],
              ["1000000", "$1,000,000+"],
            ]}
          />
          <TextField label="Children or dependents" name="dependents" type="number" min="0" max="25" inputMode="numeric" defaultValue="0" required />
          <SelectField
            label="Current life insurance"
            name="current_coverage"
            required
            options={[
              ["none", "None"],
              ["through_work", "Through work only"],
              ["not_enough", "Some, but not enough"],
              ["yes", "Yes, reviewing it"],
              ["not_sure", "Not sure"],
            ]}
          />
        </div>
      </div>

      <div data-step="1" className={step === 1 ? "grid gap-4 md:grid-cols-2" : "hidden"}>
        <TextField label="Date of birth" name="date_of_birth" type="date" autoComplete="bday" required />
        <SelectField
          label="State"
          name="state"
          autoComplete="address-level1"
          options={US_STATES.filter((code) => code !== "CA").map((code) => [code, code])}
          required
        />
        <fieldset>
          <legend className="text-sm font-medium text-neutral-700">Used tobacco or nicotine in the last 12 months?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              ["no", "No"],
              ["yes", "Yes"],
            ].map(([value, label], index) => (
              <label
                key={value}
                className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white text-sm font-semibold transition has-[:checked]:border-[#C9A227] has-[:checked]:bg-[#FBF6E4]"
              >
                <input className="h-4 w-4 accent-[#C9A227]" name="tobacco_use" required={index === 0} type="radio" value={value} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <SelectField
          label="General health"
          name="health_rating"
          microcopy="You don't need perfect health to qualify."
          options={HEALTH_RATINGS.map((rating) => [rating, titleCase(rating)])}
          required
        />
        <details className="md:col-span-2">
          <summary className="cursor-pointer text-sm font-semibold text-[#8A6A16]">Add health details (optional)</summary>
          <textarea
            className="mt-2 min-h-24 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-[#050505] outline-none placeholder:text-neutral-400 focus:border-[#C9A227]"
            name="medical_conditions"
            placeholder="Major conditions only. Do not include more detail than needed."
          />
        </details>
      </div>

      <div data-step="2" className={step === 2 ? "grid gap-5" : "hidden"}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="First name" name="first_name" autoComplete="given-name" required />
          <TextField label="Last name" name="last_name" autoComplete="family-name" required />
          <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" required />
          <TextField label="Mobile phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
          <TextField
            label="ZIP code"
            name="zip_code"
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="\d{5}(-\d{4})?"
            title="5-digit ZIP code"
            required
          />
          <SelectField
            label="Best way to reach you"
            name="preferred_contact_method"
            defaultValue="phone"
            options={[
              ["phone", "Phone call"],
              ["sms", "Text message"],
              ["email", "Email"],
            ]}
            required
          />
        </div>
        <div className="space-y-3 rounded-xl border border-neutral-200 bg-[#F7F5EF] p-4">
          <CheckboxField
            name="consent_tcpa"
            label="I agree that Rare Legacy Life and its advisors may contact me about life insurance options using the information I provided."
            required
          />
          <CheckboxField
            name="consent_privacy"
            label={
              <>
                I agree to the{" "}
                <a className="underline" href="/privacy" target="_blank">
                  privacy policy
                </a>{" "}
                and consent to secure processing of my request.
              </>
            }
            required
          />
          <CheckboxField name="consent_sms" label="I agree to receive text messages related to my quote request." />
          <CheckboxField name="consent_email_marketing" label="I agree to receive helpful email updates from Rare Legacy Life." />
        </div>
      </div>

      {state.message ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button
            className="h-12 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-[#050505] transition hover:border-[#C9A227]"
            type="button"
            onClick={() => goTo(Math.max(step - 1, 0))}
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button className="gold-gradient-button h-12 rounded-full px-7 text-sm font-bold" type="button" onClick={goNext}>
            Continue
          </button>
        ) : (
          <div className="sm:min-w-64">
            <SubmitButton>Get My Free Quote</SubmitButton>
          </div>
        )}
      </div>
      <p className="text-xs leading-5 text-neutral-500">
        Requesting a quote is free and doesn&apos;t commit you to buy. Your consent choices are recorded
        for compliance, and medical details are never included in email notifications.
      </p>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  microcopy,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; microcopy?: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base text-[#050505] outline-none placeholder:text-neutral-400 focus:border-[#C9A227] sm:text-sm"
        name={name}
        type={type}
        {...props}
      />
      {microcopy ? <span className="mt-1 block text-xs leading-5 text-neutral-500">{microcopy}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  microcopy,
  placeholder = "Select",
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  options: readonly (readonly [string, string])[];
  required?: boolean;
  microcopy?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <select
        className="mt-2 h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base text-[#050505] outline-none focus:border-[#C9A227] sm:text-sm"
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        autoComplete={autoComplete}
      >
        <option value="">{placeholder}</option>
        {options.map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
      {microcopy ? <span className="mt-1 block text-xs leading-5 text-neutral-500">{microcopy}</span> : null}
    </label>
  );
}

function CheckboxField({
  name,
  label,
  required,
}: {
  name: string;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex gap-3 text-sm leading-6 text-neutral-700">
      <input className="mt-1 h-4 w-4 shrink-0 accent-[#C9A227]" name={name} type="checkbox" required={required} />
      <span>{label}</span>
    </label>
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
