import { MapPin, Phone, Video } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Rare Legacy Life Group | East Norriton, PA | (484) 430-4363",
  description:
    "Call (484) 430-4363, visit us at 59 W. Germantown Pike in East Norriton, PA, or send a secure message about life insurance, retirement income, or annuities.",
  path: "/contact",
});

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.name}, ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
)}`;

export default function ContactPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF]">
        <section className="black-hero-bg px-4 py-14 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center">
              <Eyebrow>Contact</Eyebrow>
              <h1 className="font-premium mt-3 text-5xl font-semibold leading-tight text-white">
                Talk with a licensed advisor.
              </h1>
              <p className="mt-5 text-base leading-8 text-white/72">
                Call, stop by, or send a secure message about coverage, existing client support,
                partnerships, or agent opportunities.
              </p>
              <div className="mt-8 grid gap-3 text-sm">
                <a
                  className="dark-premium-card flex items-center gap-3 rounded-xl p-4 font-semibold text-white hover:border-[#C9A227]/70"
                  href={SITE.phone.href}
                  data-track="phone_click"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 text-[#C9A227]" />
                  {SITE.phone.display}
                </a>
                <a
                  className="dark-premium-card flex items-center gap-3 rounded-xl p-4 text-white/85 hover:border-[#C9A227]/70"
                  href={mapsUrl}
                  rel="noopener"
                  target="_blank"
                >
                  <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-[#C9A227]" />
                  <span>
                    {SITE.address.street}
                    <br />
                    {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                  </span>
                </a>
                <div className="dark-premium-card flex items-center gap-3 rounded-xl p-4 text-white/85">
                  <Video aria-hidden="true" className="h-5 w-5 text-[#C9A227]" />
                  Office, in-home, phone, or video meetings
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
