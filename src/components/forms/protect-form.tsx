"use client";

import { MessageSquareText } from "lucide-react";

// Shared pieces of the retirement forms. /protect's own one-screen form was retired on 2026-11-24 (Chris: "it was suppose to be
// built out like the quiz ... not one single form"): /protect now carries the retirement quiz (src/components/forms/retirement-quiz.tsx).

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

/**
 * The estimate is worked out but never shown (Chris, 2026-11-24: "remove the on screen estimates. they need to enter information to
 * get the information"): the card says it is ready and that it goes by text, so a fake phone number gets no estimate.
 */
export function EstimateReadyCard() {
  return (
    <div className="rounded-xl bg-brand-cream-50 px-4 py-4">
      <p className="flex items-start gap-2 text-base font-semibold leading-6 text-[#050505]">
        <MessageSquareText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-black-500" />
        Your estimate is ready to text to you.
      </p>
      <p className="mt-1 text-sm leading-6 text-neutral-700">
        A licensed advisor sends it as soon as you enter your details. A rough illustration, not a quote or a guarantee.
      </p>
    </div>
  );
}

export function Field({
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
