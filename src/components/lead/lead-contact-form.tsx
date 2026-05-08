"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { CONTACT_METHODS, US_STATES } from "@/lib/constants/options";
import { updateLeadContactInfo, type LeadContactState } from "@/server/actions/lead-contact";
import type { Lead } from "@/types/domain";

const initialState: LeadContactState = { ok: false, message: "" };

export function LeadContactForm({ lead }: { lead: Lead }) {
  const [state, action] = useActionState(updateLeadContactInfo, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={lead.id} />
      <div>
        <h2 className="font-premium text-xl font-semibold text-[#050505]">Contact info</h2>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Update the lead&apos;s name, phone, email, state, ZIP, and contact preference.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="First name" name="first_name" defaultValue={lead.first_name} required />
        <Field label="Last name" name="last_name" defaultValue={lead.last_name} required />
      </div>
      <Field label="Email" name="email" type="email" defaultValue={lead.email} required />
      <Field label="Phone" name="phone" type="tel" defaultValue={lead.phone} required />
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="text-sm font-medium text-neutral-700">State</span>
          <select className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm" name="state" defaultValue={lead.state} required>
            {US_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>
        <Field label="ZIP" name="zip_code" defaultValue={lead.zip_code} required />
      </div>
      <label>
        <span className="text-sm font-medium text-neutral-700">Preferred contact</span>
        <select className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm" name="preferred_contact_method" defaultValue={lead.preferred_contact_method}>
          {CONTACT_METHODS.map((method) => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </label>
      <Field label="Best time to contact" name="best_time_to_contact" defaultValue={lead.best_time_to_contact ?? ""} />
      {state.message ? (
        <p className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <SubmitButton>Save contact info</SubmitButton>
    </form>
  );
}

function Field({ label, name, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" name={name} {...props} />
    </label>
  );
}
