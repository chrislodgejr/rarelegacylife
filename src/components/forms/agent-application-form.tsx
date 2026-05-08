"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { US_STATES } from "@/lib/constants/options";
import { submitAgentApplication, type FormState } from "@/server/actions/public-forms";

const initialState: FormState = { ok: false, message: "" };

export function AgentApplicationForm() {
  const [state, action] = useActionState(submitAgentApplication, initialState);

  return (
    <form action={action} className="premium-card grid gap-4 rounded-2xl p-5 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="First name" name="first_name" required />
        <TextField label="Last name" name="last_name" required />
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Phone" name="phone" type="tel" required />
        <label>
          <span className="text-sm font-medium text-neutral-700">State</span>
          <select
            className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]"
            name="state"
            required
          >
            <option value="">Select</option>
            {US_STATES.map((stateCode) => (
              <option key={stateCode} value={stateCode}>
                {stateCode}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-neutral-700">Licensed?</span>
          <select
            className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]"
            name="licensed"
            required
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <TextField label="License number" name="license_number" />
        <TextField label="Years of experience" name="years_experience" type="number" min="0" />
        <TextField label="Current agency or IMO" name="current_agency" />
      </div>
      <label>
        <span className="text-sm font-medium text-neutral-700">Why are you interested?</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#C9A227]"
          name="interest_reason"
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
      <SubmitButton>Submit agent application</SubmitButton>
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
