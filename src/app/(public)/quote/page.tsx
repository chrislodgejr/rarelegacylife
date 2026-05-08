import { QuoteForm } from "@/components/forms/quote-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";

type QuotePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;
  const tracking = {
    utm_source: getParam(params.utm_source),
    utm_medium: getParam(params.utm_medium),
    utm_campaign: getParam(params.utm_campaign),
    utm_content: getParam(params.utm_content),
    utm_term: getParam(params.utm_term),
  };

  return (
    <PublicShell>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-center">
              <Eyebrow>Get a quote</Eyebrow>
              <h1 className="font-premium mt-3 text-5xl font-semibold leading-tight text-white">
                Check your coverage options.
              </h1>
              <p className="mt-5 text-base leading-8 text-white/72">
                Share the basics securely. We score and route each request so a licensed advisor can
                follow up with relevant next steps.
              </p>
              <div className="dark-premium-card mt-8 rounded-xl p-5 text-sm leading-6 text-white/70">
                Required consents are captured with timestamp, source page, IP address where
                available, and user agent for compliance tracking.
              </div>
            </div>
            <QuoteForm tracking={tracking} />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
