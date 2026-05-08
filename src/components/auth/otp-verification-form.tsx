"use client";

import { useEffect, useMemo, useState } from "react";
import { KeyRound, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const resendSeconds = 60;

export function OtpVerificationForm() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem("rll_otp_email") ?? "",
  );
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const normalizedCode = code.replace(/\D/g, "").slice(0, 6);
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || normalizedCode.length !== 6) {
      setError("Enter the email address and six-digit code.");
      setIsLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedCode,
      type: "email",
    });

    if (otpError) {
      setError("That code is invalid or expired. Please try again or request a new code.");
      setIsLoading(false);
      return;
    }

    setMessage("Verified. Redirecting you securely.");
    window.sessionStorage.removeItem("rll_otp_email");
    window.location.href = "/auth/landing";
  }

  async function resendCode() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || secondsLeft > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      setError("We could not send a new code right now. Please try again shortly.");
    } else {
      window.sessionStorage.setItem("rll_otp_email", normalizedEmail);
      setSecondsLeft(resendSeconds);
      setMessage("A new secure code has been sent.");
    }

    setIsLoading(false);
  }

  return (
    <form className="gold-border dark-premium-card rounded-[1.75rem] p-6 text-white backdrop-blur-xl" onSubmit={handleVerify}>
      <div className="gold-gradient-subtle flex h-12 w-12 items-center justify-center rounded-full text-black">
        <MailCheck className="h-6 w-6" />
      </div>
      <p className="gold-gradient-text mt-6 text-xs font-semibold uppercase tracking-[0.22em]">
        One-time verification
      </p>
      <h1 className="font-premium mt-2 text-3xl font-semibold">Check your email.</h1>
      <p className="mt-3 text-sm leading-6 text-white/62">
        Enter the one-time code we sent to your email to securely continue.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-white/78">Email</span>
        <input
          className="mt-2 h-11 w-full rounded-xl border border-white/[0.14] bg-black/30 px-3 text-sm text-white outline-none focus:border-[#C9A227]"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-white/78">Six-digit code</span>
        <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 focus-within:border-[#C9A227]">
          <KeyRound className="h-4 w-4 text-[#F5E7A3]" />
          <input
            className="h-13 w-full bg-transparent text-center font-mono text-2xl tracking-[0.3em] text-white outline-none placeholder:text-white/24"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            required
          />
        </span>
      </label>

      {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

      <button
        className="gold-gradient-button mt-6 h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <button
        className="mt-4 h-10 w-full rounded-full border border-white/[0.14] px-4 text-sm font-semibold text-white/72 transition hover:border-[#C9A227] hover:text-[#F5E7A3] disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        onClick={resendCode}
        disabled={secondsLeft > 0 || isLoading}
      >
        {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
      </button>
    </form>
  );
}
