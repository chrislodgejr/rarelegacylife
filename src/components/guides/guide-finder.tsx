"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type FinderGuide = { slug: string; title: string; description: string };
export type FinderTopic = { key: string; title: string; blurb: string; guides: FinderGuide[] };

/**
 * The retirement guides by topic, each topic a short list that opens on a tap, with a search box over every title and summary
 * (Chris, 2026-11-24: someone "would get lost or overwhelmed trying to figure out what to read").
 */
export function GuideFinder({ topics }: { topics: FinderTopic[] }) {
  const [query, setQuery] = useState("");
  const all = useMemo(() => {
    const seen = new Map<string, FinderGuide>();
    for (const topic of topics) for (const guide of topic.guides) seen.set(guide.slug, guide);
    return [...seen.values()];
  }, [topics]);
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = words.length
    ? all.filter((guide) => words.every((word) => `${guide.title} ${guide.description}`.toLowerCase().includes(word)))
    : [];

  return (
    <div>
      <label className="relative block max-w-xl">
        <span className="sr-only">Search the retirement guides</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the guides, for example “taxes” or “spouse”"
          className="h-12 w-full rounded-xl border border-neutral-300 bg-white pl-12 pr-4 text-base outline-none focus:border-brand-black-500"
        />
      </label>

      {words.length ? (
        <div className="mt-6" aria-live="polite">
          <p className="text-sm text-neutral-600">
            {results.length === 0 ? "No guide matches that yet. Try another word, or browse the topics below." : `${results.length} guide${results.length === 1 ? "" : "s"} found`}
          </p>
          <ul className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {results.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/education/${guide.slug}`} className="block px-5 py-4 hover:bg-neutral-50">
                  <span className="block font-semibold text-[#050505]">{guide.title}</span>
                  <span className="mt-1 block text-sm text-neutral-600">{guide.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 lg:grid-cols-2">
        {topics.map((topic) => (
          <details key={topic.key} id={topic.key} className="group scroll-mt-28 rounded-xl border border-neutral-200 bg-white open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="font-premium block text-xl font-semibold text-[#050505]">{topic.title}</span>
                <span className="mt-1 block text-sm text-neutral-600">{topic.blurb}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-black-500">
                {topic.guides.length}
                <ChevronDown aria-hidden="true" className="h-5 w-5 transition group-open:rotate-180" />
              </span>
            </summary>
            <ul className="border-t border-neutral-100 px-5 pb-4 pt-2">
              {topic.guides.map((guide) => (
                <li key={guide.slug}>
                  <Link href={`/education/${guide.slug}`} className="block rounded-lg py-2 text-[#050505] hover:underline">
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
