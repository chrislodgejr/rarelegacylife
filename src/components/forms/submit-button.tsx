"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="gold-gradient-button h-12 w-full rounded-xl px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={pending || disabled}
    >
      {pending ? "Submitting..." : children}
    </button>
  );
}
