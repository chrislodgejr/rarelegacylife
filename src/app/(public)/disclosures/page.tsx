import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/public-shell";

export const metadata: Metadata = {
  title: "Disclosures | Rare Legacy Life Group",
  description: "Insurance, annuity, securities, licensing, and educational-use disclosures.",
};

export default function DisclosuresPage() {
  return (
    <PublicShell>
      <main className="bg-[#F7F5EF] px-4 py-14 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-6 shadow-xl sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8A6A16]">
            Important information
          </p>
          <h1 className="font-premium mt-3 text-4xl font-semibold text-[#19201F] sm:text-5xl">
            Insurance, retirement, and annuity disclosures
          </h1>
          <div className="mt-5 rounded-2xl border border-[#C6A66B]/45 bg-[#FBF9F4] p-5 text-sm leading-6 text-[#4A4F4E]">
            Please review these important limitations before requesting insurance, retirement, or
            annuity information. Product availability and required disclosures vary by state,
            professional, carrier, and product.
          </div>

          <div className="mt-10 space-y-8 text-sm leading-7 text-[#4A4F4E]">
            <Disclosure title="Licensing and availability">
              Insurance products are offered through properly licensed insurance producers.
              Insurance services are available in 49 states, excluding California, subject to the
              individual producer&apos;s license, carrier appointment, product approval, availability,
              and applicable law. Products and services may not be available in every jurisdiction
              or to every person. The professional working with you will confirm availability and
              provide applicable producer and licensing information before business is solicited or
              placed.
            </Disclosure>
            <Disclosure title="Annuity considerations">
              Annuities are long-term insurance contracts intended for retirement purposes. They may
              involve surrender charges, withdrawal limitations, fees, market value adjustments,
              tax consequences, and a federal tax penalty for certain withdrawals before age 59½.
              Contract terms vary. Guarantees, including optional benefit guarantees, depend solely
              on the issuing insurer&apos;s claims-paying ability and do not apply to the performance of
              variable investment options.
            </Disclosure>
            <Disclosure title="Securities-related services">
              Fixed annuities are insurance products. Variable annuities and registered index-linked
              annuities are securities. Securities-related services, if offered, are separate from
              insurance services and are offered only through appropriately registered
              representatives through their broker-dealer. The registered representative will
              provide applicable broker-dealer identification, relationship disclosures, and other
              required documents before a securities-related recommendation or transaction.
            </Disclosure>
            <Disclosure title="Educational use and no guarantees">
              Website content, retirement planning conversations, financial reviews, and
              complimentary consultations are educational and informational. They are not a promise
              of results or individualized investment, tax, accounting, or legal advice. Any product
              recommendation must consider the consumer&apos;s circumstances, applicable
              suitability/best-interest obligations, product disclosures, costs, liquidity needs,
              and available alternatives. Rare Legacy Life Group does not guarantee income, returns,
              tax treatment, savings, or investment performance.
            </Disclosure>
            <Disclosure title="Insurance and market risk">
              Insurance and annuity products are not bank deposits, are not FDIC or NCUA insured,
              are not guaranteed by any bank or credit union, and may lose value where market risk
              applies. Past performance does not guarantee future results. Replacing an existing
              insurance or annuity contract may create new surrender periods, costs, tax effects,
              or loss of existing benefits and requires careful comparison.
            </Disclosure>
          </div>
        </article>
      </main>
    </PublicShell>
  );
}

function Disclosure({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section>
      <h2 className="font-premium text-2xl font-semibold text-[#19201F]">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}
