"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { submitContactForm, type FormState } from "@/server/actions/public-forms";

const initialState: FormState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action] = useActionState(submitContactForm, initialState);
  const [startedAt] = useState(() => Date.now());

  return (
    <form action={action} className="premium-card relative grid gap-4 rounded-2xl p-5 md:p-8">
      <input name="started_at" type="hidden" value={startedAt} />
      {/* Honeypot: invisible to people, bots fill it in and get silently dropped. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company website
          <input autoComplete="off" name="company_website" tabIndex={-1} type="text" />
        </label>
      </div>
      <TextField label="Name" name="name" required />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Phone" name="phone" type="tel" />
      <label>
        <span className="text-sm font-medium text-neutral-700">Inquiry type</span>
        <select
          className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-brand-black-500"
          name="inquiry_type"
          required
        >
          <option value="">Select</option>
          <option value="get_coverage">Get coverage</option>
          <option value="existing_client">Existing client</option>
          <option value="agent_opportunity">Agent opportunity</option>
          <option value="partnership">Partnership</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        <span className="text-sm font-medium text-neutral-700">Message</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-brand-black-500"
          name="message"
          required
        />
      </label>
      {state.message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}

function TextField({
  label,
  name,
  type = "text",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-brand-black-500"
        name={name}
        type={type}
        {...props}
      />
    </label>
  );
}
