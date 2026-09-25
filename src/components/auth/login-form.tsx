"use client";

import { useState } from "react";
import { KeyRound, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getAuthRedirectUrl } from "@/lib/auth/redirect-url";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [authTab, setAuthTab] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    window.location.href = "/auth/landing";
  }

  async function handleOtpRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: getAuthRedirectUrl("/auth/callback"),
        shouldCreateUser: false,
      },
    });

    if (otpError) {
      setError("We could not send a secure code right now. Please try again.");
      setIsLoading(false);
      return;
    }

    window.sessionStorage.setItem("rll_otp_email", normalizedEmail);
    window.location.href = "/otp-verify";
  }

  return (
    <motion.div
      className="gold-border dark-premium-card w-full max-w-md rounded-[1.75rem] p-6 text-white backdrop-blur-xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6">
        <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.22em]">
          Rare Legacy Life
        </p>
        <h1 className="font-premium mt-2 text-3xl font-semibold text-white">
          Secure portal access
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/62">
          Access is reserved for approved Rare Legacy Life agents, managers, and administrators.
          Sign in to manage leads, communication, tasks, and team activity.
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-full border border-white/12 bg-white/[0.04] p-1">
        {[
          ["password", "Sign in"],
          ["otp", "Email code"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`h-10 rounded-full text-sm font-semibold transition ${
              authTab === value ? "gold-gradient-subtle text-black" : "text-white/60 hover:text-white"
            }`}
            type="button"
            onClick={() => {
              setAuthTab(value as "password" | "otp");
              setError(null);
              setMessage(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {authTab === "password" ? (
      <form className="mt-5 space-y-4" onSubmit={handleEmailAuth}>
        <label className="block">
          <span className="text-sm font-medium text-white/78">Email</span>
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 focus-within:border-[#C9A227]">
            <Mail className="h-4 w-4 text-[#F5E7A3]" />
            <input
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-white/78">Password</span>
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 focus-within:border-[#C9A227]">
            <Lock className="h-4 w-4 text-[#F5E7A3]" />
            <input
              className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </span>
        </label>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}
        {message ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}

        <button
          className="gold-gradient-button h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Working..." : "Sign in"}
        </button>
      </form>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleOtpRequest}>
          <label className="block">
            <span className="text-sm font-medium text-white/78">Email</span>
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 focus-within:border-[#C9A227]">
              <KeyRound className="h-4 w-4 text-[#F5E7A3]" />
              <input
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </span>
          </label>
          <p className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-xs leading-5 text-white/58">
            We will email a one-time sign-in code. Only approved CRM users can request a sign-in code.
          </p>
          <button
            className="gold-gradient-button h-11 w-full rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Secure Code"}
          </button>
        </form>
      )}

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="text-white/58 underline-offset-4 hover:text-[#F5E7A3] hover:underline" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </motion.div>
  );
}
