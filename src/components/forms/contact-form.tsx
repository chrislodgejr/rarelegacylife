"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { submitContactForm, type FormState } from "@/server/actions/public-forms";

const initialState: FormState = { ok: false, message: "" };

export function ContactForm() {
  const [state, action] = useActionState(submitContactForm, initialState);

  return (
    <form action={action} className="premium-card grid gap-4 rounded-2xl p-5 md:p-8">
      <TextField label="Name" name="name" required />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Phone" name="phone" type="tel" />
      <label>
        <span className="text-sm font-medium text-neutral-700">Inquiry type</span>
        <select
          className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]"
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
          className="mt-2 min-h-32 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#C9A227]"
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
        className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
        name={name}
        type={type}
        {...props}
      />
    </label>
  );
}
