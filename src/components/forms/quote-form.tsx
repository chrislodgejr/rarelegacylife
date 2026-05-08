"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { COVERAGE_LABELS, COVERAGE_PURPOSES, HEALTH_RATINGS, US_STATES } from "@/lib/constants/options";
import {
  sendQuoteOtpCode,
  submitQuoteForm,
  type FormState,
  verifyQuoteOtpCode,
} from "@/server/actions/public-forms";
import { SubmitButton } from "@/components/forms/submit-button";

type TrackingDefaults = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const initialState: FormState = { ok: false, message: "" };
const steps = [
  { eyebrow: "Step 1", title: "About You", copy: "Start with the essentials so we can identify you securely." },
  { eyebrow: "Step 2", title: "What Are You Protecting?", copy: "Your goals help shape the coverage conversation." },
  { eyebrow: "Step 3", title: "Coverage Fit", copy: "A few basics help your advisor understand potential paths." },
  { eyebrow: "Step 4", title: "Consent & Submit", copy: "Your information is private and used only for insurance-related guidance." },
] as const;

export function QuoteForm({ tracking }: { tracking: TrackingDefaults }) {
  const [state, action] = useActionState(submitQuoteForm, initialState);
  const [step, setStep] = useState(0);
  const [quoteEmail, setQuoteEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const progress = ((step + 1) / steps.length) * 100;
  const normalizedQuoteEmail = normalizeEmail(quoteEmail);
  const isQuoteEmailVerified = Boolean(verifiedEmail && verifiedEmail === normalizedQuoteEmail);

  useEffect(() => {
    if (resendIn <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  function goNext() {
    const fields = formRef.current?.querySelectorAll<HTMLElement>(`[data-step="${step}"] input, [data-step="${step}"] select, [data-step="${step}"] textarea`);
    const firstInvalid = Array.from(fields ?? []).find((field) => "checkValidity" in field && !(field as HTMLInputElement).checkValidity());

    if (firstInvalid && "reportValidity" in firstInvalid) {
      (firstInvalid as HTMLInputElement).reportValidity();
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function sendQuoteOtp() {
    setOtpError(null);
    setOtpMessage(null);

    if (!normalizedQuoteEmail || !/^\S+@\S+\.\S+$/.test(normalizedQuoteEmail)) {
      setOtpError("Enter a valid email in Step 1 before requesting a code.");
      return;
    }

    setIsOtpLoading(true);
    const result = await sendQuoteOtpCode(normalizedQuoteEmail);

    if (!result.ok) {
      setOtpError(result.message);
    } else {
      setOtpMessage(result.message);
      setOtpCode("");
      setResendIn(60);
    }

    setIsOtpLoading(false);
  }

  async function verifyQuoteOtp() {
    setOtpError(null);
    setOtpMessage(null);

    if (otpCode.length !== 6) {
      setOtpError("Enter the six-digit code from your email.");
      return;
    }

    setIsOtpLoading(true);
    const result = await verifyQuoteOtpCode(normalizedQuoteEmail, otpCode);

    if (!result.ok) {
      setOtpError(result.message);
    } else {
      setVerifiedEmail(normalizedQuoteEmail);
      setOtpMessage(result.message);
    }

    setIsOtpLoading(false);
  }

  return (
    <form ref={formRef} action={action} className="premium-card grid gap-6 rounded-2xl p-5 text-[#050505] md:p-8">
      <input name="utm_source" type="hidden" value={tracking.utm_source ?? ""} />
      <input name="utm_medium" type="hidden" value={tracking.utm_medium ?? ""} />
      <input name="utm_campaign" type="hidden" value={tracking.utm_campaign ?? ""} />
      <input name="utm_content" type="hidden" value={tracking.utm_content ?? ""} />
      <input name="utm_term" type="hidden" value={tracking.utm_term ?? ""} />

      <div className="rounded-2xl bg-black p-5 text-white">
        <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.18em]">
          Secure guided intake
        </p>
        <h2 className="font-premium mt-2 text-3xl font-semibold">Let&apos;s find coverage that fits your life.</h2>
        <p className="mt-2 text-sm leading-6 text-white/68">
          Answer a few quick questions so a Rare Legacy Life advisor can help identify coverage
          options that make sense for your goals.
        </p>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="gold-gradient-subtle h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {steps.map((item, index) => (
            <button
              key={item.title}
              className={`h-2 rounded-full transition ${index <= step ? "gold-gradient-subtle" : "bg-white/[0.14]"}`}
              type="button"
              aria-label={`Go to ${item.title}`}
              onClick={() => index <= step && setStep(index)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-[#F7F5EF] p-4">
        <p className="gold-gradient-text text-xs font-semibold uppercase">{steps[step].eyebrow}</p>
        <h3 className="font-premium mt-1 text-2xl font-semibold text-[#050505]">{steps[step].title}</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{steps[step].copy}</p>
      </div>

      <div data-step="0" className={step === 0 ? "block" : "hidden"}>
      <FormSection eyebrow="Step 1" title="About You">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="First name" name="first_name" required />
          <TextField label="Last name" name="last_name" required />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={quoteEmail}
            onChange={(event) => {
              const nextEmail = event.target.value;
              setQuoteEmail(nextEmail);
              if (verifiedEmail && normalizeEmail(nextEmail) !== verifiedEmail) {
                setVerifiedEmail(null);
                setOtpMessage(null);
              }
            }}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            type="tel"
            microcopy="We'll only use this to follow up about your quote request."
            required
          />
          <TextField label="Date of birth" name="date_of_birth" type="date" required />
          <SelectField label="State" name="state" options={US_STATES.map((stateCode) => [stateCode, stateCode])} required />
          <TextField label="ZIP code" name="zip_code" inputMode="numeric" required />
        </div>
      </FormSection>
      </div>

      <div data-step="1" className={step === 1 ? "block" : "hidden"}>
      <FormSection eyebrow="Step 2" title="What Are You Protecting?">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Marital status" name="marital_status" />
          <TextField label="Children or dependents" name="dependents" type="number" min="0" defaultValue="0" required />
          <SelectField
            label="Desired coverage amount"
            name="desired_coverage_amount"
            microcopy="Not sure? Choose your best estimate. An advisor can help refine this later."
            options={[
              ["100000", "$100,000"],
              ["250000", "$250,000"],
              ["500000", "$500,000"],
              ["750000", "$750,000"],
              ["1000000", "$1,000,000+"],
            ]}
            required
          />
          <SelectField
            label="Coverage purpose"
            name="coverage_purpose"
            options={COVERAGE_PURPOSES.map((purpose) => [purpose, COVERAGE_LABELS[purpose]])}
            required
          />
        </div>
      </FormSection>
      </div>

      <div data-step="2" className={step === 2 ? "block" : "hidden"}>
      <FormSection eyebrow="Step 3" title="Coverage Fit">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Tobacco use"
            name="tobacco_use"
            options={[
              ["no", "No"],
              ["yes", "Yes"],
            ]}
            required
          />
          <SelectField
            label="General health"
            name="health_rating"
            microcopy="This helps us understand potential coverage paths. You do not need to be perfect to qualify."
            options={HEALTH_RATINGS.map((rating) => [rating, titleCase(rating)])}
            required
          />
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-neutral-700">Major medical conditions</span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-[#050505] outline-none placeholder:text-neutral-400 focus:border-[#C9A227]"
              name="medical_conditions"
              placeholder="Share anything important. Do not include more detail than needed."
            />
          </label>
          <SelectField
            label="Current life insurance"
            name="current_coverage"
            options={[
              ["none", "None"],
              ["not_enough", "Some, but not enough"],
              ["through_work", "Through work"],
              ["not_sure", "Not sure"],
              ["yes", "Yes"],
            ]}
            required
          />
          <SelectField
            label="Preferred contact method"
            name="preferred_contact_method"
            options={[
              ["phone", "Phone"],
              ["sms", "Text message"],
              ["email", "Email"],
            ]}
            required
          />
          <TextField label="Best time to contact" name="best_time_to_contact" />
        </div>
      </FormSection>
      </div>

      <div data-step="3" className={step === 3 ? "block" : "hidden"}>
      <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.18em]">
              Quote email verification
            </p>
            <h3 className="font-premium mt-1 text-xl font-semibold text-[#050505]">
              Verify your email before submitting.
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              We email a six-digit Rare Legacy Life verification code through our secure mail
              provider. This confirms the quote request email only; it does not create portal access
              or expose CRM data.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
              isQuoteEmailVerified ? "gold-gradient-subtle text-black" : "border border-neutral-200 bg-[#F7F5EF] text-neutral-600"
            }`}
          >
            {isQuoteEmailVerified ? <MailCheck className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {isQuoteEmailVerified ? "Verified" : "Required"}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="rounded-xl border border-neutral-200 bg-[#F7F5EF] px-3 py-2 text-sm text-neutral-700">
            {normalizedQuoteEmail || "Enter your email in Step 1"}
          </div>
          <button
            className="h-11 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-[#050505] transition hover:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={sendQuoteOtp}
            disabled={isOtpLoading || resendIn > 0 || isQuoteEmailVerified}
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : isQuoteEmailVerified ? "Code verified" : "Send code"}
          </button>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
          <span className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 focus-within:border-[#C9A227]">
            <KeyRound className="h-4 w-4 text-[#8A6A16]" />
            <input
              className="h-11 w-full bg-transparent font-mono text-lg tracking-[0.28em] text-[#050505] outline-none placeholder:text-neutral-400"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              placeholder="000000"
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isQuoteEmailVerified}
            />
          </span>
          <button
            className="gold-gradient-button h-11 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={verifyQuoteOtp}
            disabled={isOtpLoading || isQuoteEmailVerified || otpCode.length !== 6}
          >
            {isOtpLoading ? "Checking..." : "Verify Code"}
          </button>
        </div>
        {otpError ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{otpError}</p> : null}
        {otpMessage ? <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{otpMessage}</p> : null}
      </div>
      <div className="space-y-3 rounded-xl border border-neutral-200 bg-[#F7F5EF] p-4">
        <p className="text-sm leading-6 text-neutral-700">
          Your information is private and will only be used to respond to your request and provide
          insurance-related guidance.
        </p>
        <CheckboxField
          name="consent_tcpa"
          label="I agree that Rare Legacy Life and its advisors may contact me about life insurance options using the information I provided."
          required
        />
        <CheckboxField
          name="consent_privacy"
          label="I agree to the privacy policy and consent to secure processing of my request."
          required
        />
        <CheckboxField name="consent_sms" label="I agree to receive text messages related to my quote request." />
        <CheckboxField name="consent_email_marketing" label="I agree to receive helpful email updates from Rare Legacy Life." />
      </div>
      </div>

      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          className="h-11 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-[#050505] transition hover:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button className="gold-gradient-button h-11 rounded-full px-6 text-sm font-semibold" type="button" onClick={goNext}>
            Continue Securely
          </button>
        ) : (
          <div className="sm:min-w-64">
            <SubmitButton disabled={!isQuoteEmailVerified}>Submit My Request</SubmitButton>
          </div>
        )}
      </div>
      <p className="text-xs leading-5 text-neutral-500">
        Your information is used to review coverage options and connect you with an advisor. Medical
        details are not sent in email notifications.
      </p>
    </form>
  );
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="gold-gradient-text text-xs font-semibold uppercase">{eyebrow}</p>
      <h2 className="font-premium mt-1 text-xl font-semibold text-[#050505]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
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
        className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-[#050505] outline-none placeholder:text-neutral-400 focus:border-[#C9A227]"
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
}: {
  label: string;
  name: string;
  options: readonly (readonly [string, string])[];
  required?: boolean;
  microcopy?: string;
}) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-[#050505] outline-none focus:border-[#C9A227]"
        name={name}
        required={required}
      >
        <option value="">Select</option>
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
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex gap-3 text-sm leading-6 text-neutral-700">
      <input className="mt-1 h-4 w-4 accent-[#C9A227]" name={name} type="checkbox" required={required} />
      <span>{label}</span>
    </label>
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
