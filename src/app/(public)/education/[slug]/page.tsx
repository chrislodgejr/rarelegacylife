import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, Clock, Phone } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { GUIDES, getGuide, type GuideSection } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { advisorBySlug, SITE } from "@/lib/site";

type GuidePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return pageMetadata({
    title: guide.metaTitle,
    description: guide.description,
    path: `/education/${guide.slug}`,
    type: "article",
  });
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const author = advisorBySlug(guide.author);
  const path = `/education/${guide.slug}`;
  const related = guide.related
    .map((relatedSlug) => getGuide(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <PublicShell>
      <JsonLd
        data={[
          articleSchema({
            title: guide.title,
            description: guide.description,
            path,
            published: guide.published,
            updated: guide.updated,
            author,
          }),
          faqSchema(guide.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/education" },
            { name: guide.title, path },
          ]),
        ]}
      />
      <main className="bg-white">
        <header className="black-hero-bg px-4 pb-12 pt-10 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-xs text-white/55">
              <Link className="hover:text-[#F5E7A3]" href="/">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link className="hover:text-[#F5E7A3]" href="/education">
                Guides
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white/75">{guide.category}</span>
            </nav>
            <h1 className="font-premium mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{guide.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                <span>
                  By{" "}
                  <Link className="font-semibold text-white hover:text-[#F5E7A3]" href={`/about#${author.slug}`}>
                    {author.name}
                  </Link>
                  , {author.title}
                </span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                Updated <time dateTime={guide.updated}>{dateFormat.format(new Date(guide.updated))}</time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
                {guide.readMinutes} min read
              </span>
            </div>
          </div>
        </header>

        <article className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <section aria-labelledby="quick-answer" className="rounded-2xl border border-[#C9A227]/40 bg-[#F7F5EF] p-6">
              <h2 id="quick-answer" className="gold-gradient-text text-xs font-bold uppercase tracking-[0.18em]">
                The short answer
              </h2>
              <p className="mt-3 text-lg leading-8 text-[#050505]">{guide.answer}</p>
            </section>

            {guide.sections.map((section) => (
              <GuideBlock key={section.heading} section={section} />
            ))}

            <InlineCta kind={guide.cta} />

            <section className="mt-12" aria-labelledby="faq">
              <h2 id="faq" className="font-premium text-3xl font-semibold text-[#050505]">
                Frequently asked questions
              </h2>
              <div className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
                {guide.faqs.map((faq) => (
                  <div key={faq.question} className="p-5">
                    <h3 className="font-semibold text-[#050505]">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-neutral-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="mt-12 rounded-2xl border border-neutral-200 p-6" aria-label="About the author">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Written and reviewed by</p>
              <p className="font-premium mt-2 text-2xl font-semibold text-[#050505]">{author.name}</p>
              <p className="text-sm font-medium text-[#8A6A16]">{author.title}</p>
              <p className="mt-1 text-xs text-neutral-500">{author.license}</p>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{author.bio}</p>
            </aside>

            {guide.sources?.length ? (
              <section className="mt-8 text-sm text-neutral-600" aria-labelledby="sources">
                <h2 id="sources" className="font-semibold text-[#050505]">
                  Sources
                </h2>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {guide.sources.map((source) => (
                    <li key={source.url}>
                      <a className="underline hover:text-[#8A6A16]" href={source.url} rel="noopener" target="_blank">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="mt-8 text-xs leading-5 text-neutral-500">
              This guide is general education, not individual insurance, investment, tax, or legal advice.
              Product features, availability, and underwriting vary by insurer and state. See our{" "}
              <Link className="underline" href="/disclosures">
                disclosures
              </Link>
              .
            </p>

            {related.length ? (
              <section className="mt-12" aria-labelledby="related">
                <h2 id="related" className="font-premium text-2xl font-semibold text-[#050505]">
                  Related guides
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      className="premium-card group rounded-xl p-5 transition hover:-translate-y-0.5"
                      href={`/education/${item.slug}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A16]">{item.category}</p>
                      <p className="mt-2 font-semibold leading-6 text-[#050505] group-hover:underline">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </article>
      </main>
    </PublicShell>
  );
}

function GuideBlock({ section }: { section: GuideSection }) {
  return (
    <section className="mt-10">
      <h2 className="font-premium text-3xl font-semibold leading-tight text-[#050505]">{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="mt-4 text-base leading-8 text-neutral-700">
          {paragraph}
        </p>
      ))}
      {section.bullets ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700 marker:text-[#C9A227]">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? (
        <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">{section.table.caption}</caption>
            <thead className="bg-black text-white">
              <tr>
                {section.table.headers.map((header, index) => (
                  <th key={`${header}-${index}`} className="px-4 py-3 font-semibold" scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {section.table.rows.map((row) => (
                <tr key={row.join("|")} className="even:bg-[#F7F5EF]">
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={index} className="px-4 py-3 font-semibold text-[#050505]" scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={index} className="px-4 py-3 text-neutral-700">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

function InlineCta({ kind }: { kind: "quote" | "retirement" }) {
  const isRetirement = kind === "retirement";

  return (
    <section className="black-hero-bg mt-12 rounded-2xl p-7 text-white">
      <p className="gold-gradient-text text-xs font-bold uppercase tracking-[0.18em]">
        {isRetirement ? "Complimentary review" : "Free, no-pressure quote"}
      </p>
      <h2 className="font-premium mt-2 text-3xl font-semibold">
        {isRetirement ? "Get a Retirement Income Blueprint." : "See what coverage would cost you."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/72">
        {isRetirement
          ? "A licensed advisor organizes your income sources, timing, and annuity trade-offs into one clear picture. No obligation."
          : "Answer a few quick questions and a licensed advisor will follow up with options that fit your family and budget."}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          className="gold-gradient-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold"
          href={isRetirement ? "/retirement" : "/quote"}
        >
          {isRetirement ? "Request my Blueprint" : "Get my free quote"} <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <a
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold"
          href={SITE.phone.href}
          data-track="phone_click"
        >
          <Phone aria-hidden="true" className="h-4 w-4 text-[#C9A227]" />
          {SITE.phone.display}
        </a>
      </div>
    </section>
  );
}
