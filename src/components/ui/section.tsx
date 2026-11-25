import { cn } from "@/lib/utils/cn";

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("px-4 py-16 sm:px-6 lg:px-8", className)}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

/** The small label above a heading. The site is light throughout (2026-11-25), so both tones are the warm bronze; `tone` is kept
 *  so existing callers need no change. */
export function Eyebrow({ children }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={cn("text-brand-black-500", "text-sm font-semibold uppercase")}>
      {children}
    </p>
  );
}
