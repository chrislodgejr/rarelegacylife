"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import { LEAD_STATUSES, STATUS_LABELS, TASK_PRIORITIES, TASK_TYPES } from "@/lib/constants/options";
import {
  addLeadNote,
  assignLead,
  createLeadTask,
  updateLeadStatus,
} from "@/server/actions/crm";
import type { Agent, LeadStatus } from "@/types/domain";

const initialState = { ok: false, message: "" };

export function LeadStatusForm({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [state, action] = useActionState(updateLeadStatus, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={leadId} />
      <label>
        <span className="text-sm font-medium text-neutral-700">Status</span>
        <select
          className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
          name="status"
          defaultValue={currentStatus}
        >
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
      <InlineState state={state} />
      <SubmitButton>Update status</SubmitButton>
    </form>
  );
}

export function LeadAssignmentForm({
  leadId,
  currentAgentId,
  agents,
}: {
  leadId: string;
  currentAgentId: string | null;
  agents: Agent[];
}) {
  const [state, action] = useActionState(assignLead, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={leadId} />
      <label>
        <span className="text-sm font-medium text-neutral-700">Assigned agent</span>
        <select
          className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
          name="agent_id"
          defaultValue={currentAgentId ?? ""}
        >
          <option value="">Unassigned</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.first_name} {agent.last_name} ({agent.state ?? "multi-state"})
            </option>
          ))}
        </select>
      </label>
      <InlineState state={state} />
      <SubmitButton>Save assignment</SubmitButton>
    </form>
  );
}

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(addLeadNote, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={leadId} />
      <label>
        <span className="text-sm font-medium text-neutral-700">Add note</span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-neutral-300 px-3 py-3 text-sm"
          name="note"
          required
        />
      </label>
      <InlineState state={state} />
      <SubmitButton>Add note</SubmitButton>
    </form>
  );
}

export function LeadTaskForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(createLeadTask, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={leadId} />
      <label>
        <span className="text-sm font-medium text-neutral-700">Task title</span>
        <input className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" name="title" required />
      </label>
      <label>
        <span className="text-sm font-medium text-neutral-700">Description</span>
        <textarea className="mt-2 min-h-20 w-full rounded-md border border-neutral-300 px-3 py-3 text-sm" name="description" />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label>
          <span className="text-sm font-medium text-neutral-700">Due date</span>
          <input className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm" name="due_date" type="datetime-local" />
        </label>
        <label>
          <span className="text-sm font-medium text-neutral-700">Priority</span>
          <select className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm" name="priority" defaultValue="medium">
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-sm font-medium text-neutral-700">Type</span>
          <select className="mt-2 h-11 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm" name="task_type" defaultValue="general_follow_up">
            {TASK_TYPES.map((taskType) => (
              <option key={taskType} value={taskType}>
                {taskType.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      <InlineState state={state} />
      <SubmitButton>Create task</SubmitButton>
    </form>
  );
}

function InlineState({ state }: { state: { ok: boolean; message: string } }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-md px-3 py-2 text-sm ${
        state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
      }`}
    >
      {state.message}
    </p>
  );
}
