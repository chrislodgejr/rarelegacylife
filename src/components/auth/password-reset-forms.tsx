"use client";

import { useEffect, useRef, useState } from "react";
import { getAuthRedirectUrl } from "@/lib/auth/redirect-url";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthRedirectUrl("/reset-password"),
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("If an account exists, a password reset link has been sent.");
    }

    setIsLoading(false);
  }

  return (
    <form className="premium-card w-full max-w-md rounded-2xl p-6" onSubmit={handleSubmit}>
      <h1 className="font-premium text-2xl font-semibold text-[#050505]">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Enter your email and we will send a secure reset link.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-neutral-700">Email</span>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      <button
        className="gold-gradient-button mt-5 h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const preparedRef = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    if (preparedRef.current) {
      return;
    }

    preparedRef.current = true;

    async function prepareRecoverySession() {
      setError(null);

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError("This reset link could not be verified. Please request a fresh password reset link.");
          return;
        }

        window.history.replaceState(null, "", "/reset-password");
        setIsSessionReady(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsSessionReady(true);
      } else {
        setError("Open the password reset link from your email before choosing a new password.");
      }
    }

    void prepareRecoverySession();
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (!isSessionReady) {
      setError("Your secure reset session is not ready. Open the reset link from your email again.");
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message === "Auth session missing!" ? "Your reset session expired. Please request a new password reset link." : updateError.message);
    } else {
      setMessage("Your password has been updated. You can now sign in.");
    }

    setIsLoading(false);
  }

  return (
    <form className="premium-card w-full max-w-md rounded-2xl p-6" onSubmit={handleSubmit}>
      <h1 className="font-premium text-2xl font-semibold text-[#050505]">Choose a new password</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600">
        Use at least 8 characters. Keep it unique to this account.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-neutral-700">New password</span>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none focus:border-[#C9A227]"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={!isSessionReady || isLoading}
        />
      </label>
      {!isSessionReady && !error ? (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Verifying your secure reset link...
        </p>
      ) : null}
      {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      <button
        className="gold-gradient-button mt-5 h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading || !isSessionReady}
      >
        {isLoading ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
