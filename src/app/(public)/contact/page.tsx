import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center">
              <Eyebrow>Contact</Eyebrow>
              <h1 className="font-premium mt-3 text-5xl font-semibold leading-tight text-white">
                Tell us what you need.
              </h1>
              <p className="mt-5 text-base leading-8 text-white/72">
                Send a secure message about coverage, existing client support, partnerships, or
                agent opportunities.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
