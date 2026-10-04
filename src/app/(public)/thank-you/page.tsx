import Link from "next/link";
import { Phone } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { TrackOnMount } from "@/components/seo/track-on-mount";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request Received | Rare Legacy Life Group",
  description: "Thank you — a licensed Rare Legacy Life advisor will follow up shortly.",
  path: "/thank-you",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <PublicShell showMobileBar={false}>
      <TrackOnMount event="generate_lead" />
      <main className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <section className="premium-card mx-auto max-w-3xl rounded-2xl p-8">
          <p className="text-brand-black-500 text-sm font-semibold uppercase">Request received</p>
          <h1 className="font-premium mt-4 text-3xl font-semibold text-[#050505]">
            Thank you. Your request has been received.
          </h1>
          <p className="mt-4 text-base leading-8 text-neutral-700">
            A licensed Rare Legacy Life advisor will review your information and reach out using the
            contact method you chose. Want to talk sooner? Call us at{" "}
            <a className="font-semibold text-[#050505] underline" href={SITE.phone.href} data-track="phone_click">
              {SITE.phone.display}
            </a>
            .
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Review", "An advisor reviews your goals and coverage basics."],
              ["Options", "You'll get realistic options and price ranges, explained in plain language."],
              ["Decide", "Take your time. There's no obligation to buy."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-xl border border-neutral-200 bg-[#F7F5EF] p-4">
                <h2 className="font-premium font-semibold text-[#050505]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="gold-gradient-button inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold"
              href="/education"
            >
              Read our life insurance guides
            </Link>
            <a
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold"
              href={SITE.phone.href}
              data-track="phone_click"
            >
              <Phone aria-hidden="true" className="h-4 w-4 text-brand-black-500" />
              {SITE.phone.display}
            </a>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
