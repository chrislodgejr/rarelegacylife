"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { submitFeatureRequest, type FeatureRequestState } from "@/server/actions/feature-request";

const initialState: FeatureRequestState = { ok: false, message: "" };

const categories = [
  ["crm", "CRM / workflow"],
  ["leads", "Leads"],
  ["agent_profile", "Agent profile"],
  ["notifications", "Notifications"],
  ["reports", "Reports"],
  ["mobile", "Mobile"],
  ["other", "Other"],
] as const;

const priorities = [
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
  ["urgent", "Urgent"],
] as const;

export function FeatureRequestForm() {
  const [state, action] = useActionState(submitFeatureRequest, initialState);

  return (
    <form action={action} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A16]">
          Product feedback
        </p>
        <h2 className="font-premium mt-2 text-2xl font-semibold text-[#050505]">
          Submit a feature request
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Use this for CRM improvements, lead workflow requests, profile updates, notification ideas,
          mobile fixes, reporting needs, or anything that would help agents work faster.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label>
          <span className="text-sm font-medium text-neutral-700">Title</span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
            name="title"
            maxLength={140}
            placeholder="Example: Add carrier filter to lead assignment"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-neutral-700">Category</span>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]"
              name="category"
              defaultValue="crm"
            >
              {categories.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-medium text-neutral-700">Priority</span>
            <select
              className="mt-2 h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#C9A227]"
              name="priority"
              defaultValue="medium"
            >
              {priorities.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span className="text-sm font-medium text-neutral-700">Request details</span>
          <textarea
            className="mt-2 min-h-36 w-full rounded-xl border border-neutral-300 px-3 py-3 text-sm outline-none focus:border-[#C9A227]"
            name="description"
            maxLength={2000}
            placeholder="Describe the problem, what you want added, and how it should work."
            required
          />
        </label>
      </div>

      {state.message ? (
        <p className={`mt-4 rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 max-w-xs">
        <SubmitButton>Submit request</SubmitButton>
      </div>
    </form>
  );
}
