"use client";

import { useActionState } from "react";
import { updateRetirementCase } from "@/server/actions/retirement-crm";

type CaseData = Record<string, string | number | null>;
const fields: { name: string; label: string; multiline?: boolean }[] = [
  { name: "retirement_goal", label: "Retirement objective", multiline: true },
  { name: "available_assets_range", label: "Assets available for planning" },
  { name: "existing_annuity_notes", label: "Existing annuities and policies", multiline: true },
  { name: "liquidity_needs", label: "Liquidity needs and time horizon", multiline: true },
  { name: "risk_tolerance_notes", label: "Risk tolerance and income preferences", multiline: true },
  { name: "beneficiary_notes", label: "Beneficiary and legacy goals", multiline: true },
  { name: "replacement_discussion", label: "Replacement and surrender discussion", multiline: true },
  { name: "case_notes", label: "Internal case notes", multiline: true },
];

export function RetirementCaseForm({ request }: { request: CaseData }) {
  const [state, action, pending] = useActionState(updateRetirementCase, { ok: false, message: "" });
  return <form action={action} className="premium-card grid gap-4 rounded-2xl p-5 sm:p-7">
    <input type="hidden" name="id" value={String(request.id)} />
    <h2 className="font-premium text-2xl font-semibold">Retirement case review</h2>
    <p className="text-sm text-neutral-600">Record discovery and follow-up here. Confirm licensing, carrier requirements, suitability, and any recommendation in the applicable approved workflow.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium">Stage<select name="status" defaultValue={String(request.status)} className="h-11 rounded-xl border border-neutral-300 px-3">{["new", "contacted", "scheduled", "completed", "closed", "spam"].map(v => <option key={v} value={v}>{v.replaceAll("_", " ")}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium">Next follow-up<input type="datetime-local" name="next_follow_up_at" defaultValue={request.next_follow_up_at ? String(request.next_follow_up_at).slice(0,16) : ""} className="h-11 rounded-xl border border-neutral-300 px-3" /></label>
      <label className="grid gap-1 text-sm font-medium">Target retirement date<input type="date" name="target_retirement_date" defaultValue={String(request.target_retirement_date ?? "")} className="h-11 rounded-xl border border-neutral-300 px-3" /></label>
      <label className="grid gap-1 text-sm font-medium">Desired monthly income ($)<input type="number" min="0" max="100000000" step="0.01" name="income_goal_monthly" defaultValue={String(request.income_goal_monthly ?? "")} className="h-11 rounded-xl border border-neutral-300 px-3" /></label>
    </div>
    {fields.map(field => <label key={field.name} className="grid gap-1 text-sm font-medium">{field.label}{field.multiline ? <textarea name={field.name} defaultValue={String(request[field.name] ?? "")} rows={3} className="rounded-xl border border-neutral-300 p-3" /> : <input name={field.name} defaultValue={String(request[field.name] ?? "")} className="h-11 rounded-xl border border-neutral-300 px-3" />}</label>)}
    {state.message && <p role="status" className={state.ok ? "text-emerald-700" : "text-red-700"}>{state.message}</p>}
    <button type="submit" disabled={pending} className="gold-gradient-button h-12 rounded-full px-5 font-semibold disabled:opacity-50">{pending ? "Saving…" : "Save case"}</button>
  </form>;
}
