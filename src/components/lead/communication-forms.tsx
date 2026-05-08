"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  sendInternalChatMessage,
  sendLeadChatMessage,
  sendLeadEmail,
} from "@/server/actions/crm";

const initialState = { ok: false, message: "" };

export function LeadEmailForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(sendLeadEmail, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5">
      <input name="lead_id" type="hidden" value={leadId} />
      <div>
        <p className="text-sm font-semibold uppercase text-[#C9A227]">
          Client email
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[#050505]">Send and log email</h2>
      </div>
      <label>
        <span className="text-sm font-medium text-neutral-700">Subject</span>
        <input
          className="mt-2 h-11 w-full rounded-md border border-neutral-300 px-3 text-sm"
          name="subject"
          required
        />
      </label>
      <label>
        <span className="text-sm font-medium text-neutral-700">Message</span>
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-neutral-300 px-3 py-3 text-sm"
          name="body"
          required
        />
      </label>
      <InlineState state={state} />
      <SubmitButton>Send email</SubmitButton>
    </form>
  );
}

export function LeadChatForm({ leadId }: { leadId: string }) {
  const [state, action] = useActionState(sendLeadChatMessage, initialState);

  return (
    <form action={action} className="grid gap-3">
      <input name="lead_id" type="hidden" value={leadId} />
      <label>
        <span className="sr-only">Lead chat message</span>
        <textarea
          className="min-h-24 w-full rounded-md border border-neutral-300 px-3 py-3 text-sm"
          name="body"
          placeholder="Add an internal message about this lead..."
          required
        />
      </label>
      <InlineState state={state} />
      <SubmitButton>Send lead chat</SubmitButton>
    </form>
  );
}

export function InternalChatForm({ threadId }: { threadId: string }) {
  const [state, action] = useActionState(sendInternalChatMessage, initialState);

  return (
    <form action={action} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4">
      <input name="thread_id" type="hidden" value={threadId} />
      <textarea
        className="min-h-24 w-full rounded-md border border-neutral-300 px-3 py-3 text-sm"
        name="body"
        placeholder="Message the internal team..."
        required
      />
      <InlineState state={state} />
      <SubmitButton>Send internal message</SubmitButton>
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
