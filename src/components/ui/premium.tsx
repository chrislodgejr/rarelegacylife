import Link from "next/link";

export function GoldText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`gold-gradient-text ${className}`}>{children}</span>;
}

export function GoldDivider({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`gold-divider block ${className}`} />;
}

export function PremiumCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`premium-card rounded-2xl ${className}`}>{children}</div>;
}

export function PremiumBadge({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "gold";
  className?: string;
}) {
  const toneClass =
    tone === "gold"
      ? "gold-gradient-subtle text-black"
      : tone === "dark"
        ? "border border-white/[0.14] bg-white/[0.06] text-white/78"
        : "border border-neutral-200 bg-white text-[#050505]";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClass} ${className}`}>
      {children}
    </span>
  );
}

export function GoldButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={`gold-gradient-button inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${className}`} href={href}>
      {children}
    </Link>
  );
}

export function PremiumSectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="gold-gradient-text text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</p>
      <h2 className={`font-premium mt-4 text-4xl font-semibold leading-tight sm:text-5xl ${dark ? "text-white" : "text-[#050505]"}`}>
        {title}
      </h2>
      {copy ? (
        <p className={`mt-5 text-base leading-8 ${dark ? "text-white/68" : "text-neutral-600"}`}>{copy}</p>
      ) : null}
    </div>
  );
}

export function CoverageCard({
  title,
  copy,
  meta,
}: {
  title: string;
  copy: string;
  meta: string;
}) {
  return (
    <PremiumCard className="group overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]">
      <GoldDivider className="-mx-6 -mt-6 mb-6" />
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A16]">{meta}</p>
      <h3 className="font-premium mt-3 text-2xl font-semibold text-[#050505]">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-neutral-600">{copy}</p>
    </PremiumCard>
  );
}

export function StepCard({
  step,
  title,
  copy,
}: {
  step: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="premium-card flex gap-4 rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]">
      <span className="gold-gradient-subtle flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black">
        {step}
      </span>
      <span>
        <span className="block font-semibold text-[#050505]">{title}</span>
        <span className="mt-2 block text-sm leading-6 text-neutral-600">{copy}</span>
      </span>
    </div>
  );
}

export function TrustBar({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <PremiumBadge key={item} tone="dark">
          {item}
        </PremiumBadge>
      ))}
    </div>
  );
}
