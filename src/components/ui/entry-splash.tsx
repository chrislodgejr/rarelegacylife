"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/brand/logo";

type EntrySplashVariant = "consumer" | "agent";
const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

type EntrySplashProps = {
  variant: EntrySplashVariant;
  storageKey: string;
  durationMs?: number;
};

const splashContent: Record<
  EntrySplashVariant,
  {
    eyebrow: string;
    headline: string;
    subcopy: string;
    signature: string;
    chips: string[];
  }
> = {
  consumer: {
    eyebrow: "Rare Legacy Life",
    headline: "Legacy starts with protection.",
    subcopy:
      "Private guidance, serious coverage conversations, and a clearer way to protect the life you are building.",
    signature: "Preparing your protection experience",
    chips: ["Private", "Advisor-guided", "No pressure"],
  },
  agent: {
    eyebrow: "Rare Legacy CRM",
    headline: "Move with precision. Protect with purpose.",
    subcopy:
      "A premium command center for advisors who work fast, follow up cleanly, and build trust at every step.",
    signature: "Agent portal loading",
    chips: ["Lead focus", "Follow-up control", "Secure workflow"],
  },
};

export function EntrySplash({ variant, storageKey, durationMs = 2100 }: EntrySplashProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const reduceMotion = useReducedMotion();
  const content = splashContent[variant];

  const motionSettings = useMemo(
    () => ({
      entrance: reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 },
      initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 },
      exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 1.02 },
      transition: { duration: reduceMotion ? 0.18 : 0.75, ease: premiumEase },
    }),
    [reduceMotion],
  );

  useEffect(() => {
    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.sessionStorage.setItem(storageKey, "seen");

    const openTimer = window.setTimeout(() => setShouldShow(true), 0);
    const timer = window.setTimeout(
      () => setShouldShow(false),
      reduceMotion ? Math.min(durationMs, 900) : durationMs,
    );

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(timer);
    };
  }, [durationMs, reduceMotion, storageKey]);

  return (
    <AnimatePresence>
      {shouldShow ? (
        <motion.div
          aria-label={variant === "consumer" ? "Rare Legacy Life welcome screen" : "Rare Legacy CRM welcome screen"}
          aria-live="polite"
          className="fixed inset-0 z-[100] overflow-hidden bg-black text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.16 : 0.45 }}
        >
          <div className="signal-grid absolute inset-0 opacity-[0.16]" aria-hidden="true" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(245,231,163,0.16),transparent_28%),linear-gradient(180deg,#050505_0%,#000000_100%)]"
          />
          <div
            aria-hidden="true"
            className="gold-gradient-subtle absolute left-1/2 top-0 h-px w-[min(72rem,88vw)] -translate-x-1/2 opacity-80"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-10 left-1/2 h-px w-[min(48rem,78vw)] -translate-x-1/2 bg-white/12"
          />

          <motion.div
            className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-10 text-center"
            initial={motionSettings.initial}
            animate={motionSettings.entrance}
            exit={motionSettings.exit}
            transition={motionSettings.transition}
          >
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-x-[-2rem] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C9A227]/45 to-transparent"
              />
              <BrandLogo
                className={variant === "consumer" ? "relative h-28 w-auto sm:h-36" : "relative h-24 w-auto sm:h-32"}
                lockup="stacked"
                priority
                variant="dark"
              />
            </div>

            <motion.p
              className="gold-gradient-text mt-8 text-xs font-semibold uppercase tracking-[0.28em]"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
            >
              {content.eyebrow}
            </motion.p>
            <motion.h1
              className="font-premium mt-4 max-w-4xl text-4xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.65, ease: premiumEase }}
            >
              {content.headline}
            </motion.h1>
            <motion.p
              className="mt-5 max-w-2xl text-sm leading-7 text-white/66 sm:text-base"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
            >
              {content.subcopy}
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap justify-center gap-2"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ delay: 0.56, duration: 0.45 }}
            >
              {content.chips.map((chip) => (
                <span
                  className="rounded-full border border-white/12 bg-white/[0.045] px-3.5 py-1.5 text-xs font-semibold text-white/68 backdrop-blur"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="mt-9 w-full max-w-sm"
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.88 }}
              animate={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.68, duration: 0.45 }}
            >
              <div className="h-px overflow-hidden rounded-full bg-white/12">
                <motion.div
                  className="gold-gradient-subtle h-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduceMotion ? 0.35 : durationMs / 1000 - 0.25, ease: "easeOut" }}
                />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/38">{content.signature}</p>
            </motion.div>

            <button
              className="mt-8 rounded-full border border-white/12 px-4 py-2 text-xs font-semibold text-white/50 transition hover:border-[#C9A227]/70 hover:text-[#F5E7A3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227]"
              type="button"
              onClick={() => setShouldShow(false)}
            >
              Enter now
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
