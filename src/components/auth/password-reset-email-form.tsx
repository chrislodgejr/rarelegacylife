"use client";

import { useActionState } from "react";
import { sendPasswordResetEmail, type PasswordResetEmailState } from "@/server/actions/password-reset-email";

const initialState: PasswordResetEmailState = { ok: false, message: "" };

export function PasswordResetEmailForm() {
  const [state, action, isPending] = useActionState(sendPasswordResetEmail, initialState);

  return (
    <form className="premium-card w-full max-w-md rounded-2xl p-6" action={action}>
      <h1 className="font-premium text-2xl font-semibold text-[#050505]">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Enter your email and we will send a secure reset link.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
          type="email"
          name="email"
          required
        />
      </label>
      {state.message ? (
        <p className={`mt-4 rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      ) : null}
      <button
        className="gold-gradient-button mt-5 h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
