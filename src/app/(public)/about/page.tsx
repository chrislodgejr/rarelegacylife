import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";

export default function AboutPage() {
  return (
    <PublicShell>
      <main>
        <Section className="black-hero-bg text-white">
          <div className="max-w-3xl">
            <Eyebrow>About Rare Legacy Life</Eyebrow>
            <h1 className="font-premium mt-4 text-4xl font-semibold sm:text-5xl">
              Life insurance without confusion or pressure.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/78">
              Rare Legacy Life exists to help people protect their families, build generational
              security, and make confident decisions about coverage.
            </p>
          </div>
        </Section>
        <Section>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              ["Mission", "Make life insurance clear, personal, and easier to act on."],
              ["Who we serve", "Families, entrepreneurs, hospitality professionals, and working-class earners."],
              ["Why it matters", "Protection gives loved ones time, options, and financial stability."],
              ["Our process", "We listen, review your goals, and connect you with practical next steps."],
            ].map(([title, copy]) => (
              <div key={title} className="premium-card rounded-xl p-6">
                <h2 className="font-premium text-xl font-semibold text-[#050505]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
          <Link
            className="gold-gradient-button mt-8 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold"
            href="/quote"
          >
            Get my quote
          </Link>
        </Section>
      </main>
    </PublicShell>
  );
}
