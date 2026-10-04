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

/** tone: "dark" for dark backgrounds (cream), "light" for light backgrounds (warm black). */
export function Eyebrow({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <p className={cn(tone === "dark" ? "gold-gradient-text" : "text-brand-black-500", "text-sm font-semibold uppercase")}>
      {children}
    </p>
  );
}
