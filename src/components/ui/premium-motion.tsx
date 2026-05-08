"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function MotionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function HeroReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGoldOrb({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.12, 0.96, 1],
              opacity: [0.22, 0.42, 0.24, 0.22],
            }
      }
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function FloatingQuoteCard() {
  const reduceMotion = useReducedMotion();
  const checklist = [
    ["Family income protection", "Priority"],
    ["Mortgage safety net", "Recommended"],
    ["Final expense planning", "Optional"],
  ];

  return (
    <motion.aside
      className="gold-border dark-premium-card relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-2xl backdrop-blur-xl"
      animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        aria-hidden="true"
        className="gold-gradient-subtle absolute left-0 top-0 h-px w-2/3"
        animate={reduceMotion ? undefined : { x: ["-40%", "140%"], opacity: [0, 1, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.22em]">
            Coverage Preview
          </p>
          <h2 className="font-premium mt-3 max-w-[17rem] text-3xl font-semibold leading-tight">
            Build your protection plan
          </h2>
        </div>
        <span className="gold-gradient-subtle inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold leading-none text-black shadow-[0_10px_28px_rgba(201,162,39,0.22)]">
          Guided Quote
        </span>
      </div>
      <div className="mt-7 grid gap-3">
        {checklist.map(([label, meta], index) => (
          <motion.div
            key={label}
            className="rounded-2xl border border-white/12 bg-white/[0.055] p-4"
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.35 + index * 0.12 }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <CheckCircle2 className="h-4 w-4 text-[#F5E7A3]" />
                {label}
              </span>
              <span className="text-xs text-white/50">{meta}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Estimated range</p>
        <p className="font-premium mt-2 text-4xl font-semibold">$250K-$1M</p>
      </div>
      <Link
        className="gold-gradient-button mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
        href="/quote"
      >
        Start the guided quote
        <ArrowRight className="h-4 w-4" />
      </Link>
      <div className="mt-5 flex items-center gap-2 text-xs text-white/55">
        <ShieldCheck className="h-4 w-4 text-[#F5E7A3]" />
        Private. Secure. Built around your goals.
      </div>
    </motion.aside>
  );
}
