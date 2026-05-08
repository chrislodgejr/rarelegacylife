import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

export default function ThankYouPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF] px-4 py-20 sm:px-6 lg:px-8">
        <section className="premium-card mx-auto max-w-3xl rounded-2xl p-8">
          <p className="gold-gradient-text text-sm font-semibold uppercase">
            Request received
          </p>
          <h1 className="font-premium mt-4 text-3xl font-semibold text-[#050505]">
            Thank you. Your request has been received.
          </h1>
          <p className="mt-4 text-base leading-8 text-neutral-700">
            A Rare Legacy Life advisor will review your information and contact you shortly.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Review", "We review your goals and coverage basics."],
              ["Match", "Your request is routed to an advisor when possible."],
              ["Follow up", "An advisor contacts you with next steps."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-xl border border-neutral-200 bg-[#F7F5EF] p-4">
                <h2 className="font-premium font-semibold text-[#050505]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
          <Link
            className="gold-gradient-button mt-8 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold"
            href="/education"
          >
            Learn more about life insurance
          </Link>
        </section>
      </main>
    </PublicShell>
  );
}
