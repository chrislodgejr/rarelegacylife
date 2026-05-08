"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  sendUserPasswordReset,
  type UserPasswordResetState,
} from "@/server/actions/user-password-reset";

const initialState: UserPasswordResetState = { ok: false, message: "" };

export function UserPasswordResetForm({ email }: { email: string }) {
  const [state, action] = useActionState(sendUserPasswordReset, initialState);

  return (
    <form action={action} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
      <input name="email" type="hidden" value={email} />
      <p className="text-xs leading-5 text-neutral-500">
        Send this user a secure password reset email.
      </p>
      <SubmitButton>Send reset</SubmitButton>
      {state.message ? (
        <p className={`sm:col-span-2 text-sm ${state.ok ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
