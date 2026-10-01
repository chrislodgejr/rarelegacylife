import { Phone } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Get a Free Life Insurance Quote | Rare Legacy Life Group",
  description:
    "Request a free, no-obligation life insurance quote in about two minutes. A licensed advisor reviews your goals and follows up with options that fit your budget.",
  path: "/quote",
});

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
    <PublicShell showMobileBar={false}>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 pb-14 pt-8 text-white sm:px-6 sm:pt-14 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8">
            <div className="flex flex-col justify-center">
              <Eyebrow>Free quote</Eyebrow>
              <h1 className="font-premium mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Check your coverage options.
              </h1>
              <p className="mt-4 text-base leading-7 text-white/72">
                About two minutes. No obligation. A licensed advisor reviews your answers and follows
                up with options that fit your family and budget.
              </p>
              <a
                className="mt-5 hidden items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#F5E7A3] lg:inline-flex"
                href={SITE.phone.href}
                data-track="phone_click"
              >
                <Phone aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                Rather talk it through? Call {SITE.phone.display}
              </a>
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
