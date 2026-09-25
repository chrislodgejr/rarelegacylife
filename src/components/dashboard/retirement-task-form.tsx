"use client";
import { useActionState } from "react";
import { addRetirementTask } from "@/server/actions/retirement-tasks";

export function RetirementTaskForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(addRetirementTask, { ok: false, message: "" });
  return <form action={action} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
    <input type="hidden" name="request_id" value={requestId} />
    <input name="title" required maxLength={160} placeholder="Next action" aria-label="Next action" className="h-11 rounded-xl border border-neutral-300 px-3" />
    <input name="due_at" type="datetime-local" aria-label="Due date" className="h-11 rounded-xl border border-neutral-300 px-3" />
    <button disabled={pending} className="gold-gradient-button rounded-xl px-4 font-semibold">Add task</button>
    {state.message && <p role="status" className="text-sm sm:col-span-3">{state.message}</p>}
  </form>;
}
