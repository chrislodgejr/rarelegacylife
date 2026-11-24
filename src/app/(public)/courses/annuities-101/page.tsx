import Link from "next/link";
import { Clock, MessageSquareText, PlayCircle } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";
import { ANNUITY_COURSE } from "@/content/annuity-course";
import { COURSE_PATH } from "@/lib/course";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Annuities 101: A Free Course in Plain English | Rare Legacy Life",
  description: ANNUITY_COURSE.description,
  path: COURSE_PATH,
});

export default function CoursePage() {
  const first = ANNUITY_COURSE.lessons[0];

  return (
    <PublicShell>
      <Section>
        <Eyebrow>Free course</Eyebrow>
        <h1 className="font-premium mt-3 text-4xl font-semibold text-[#050505] sm:text-5xl">{ANNUITY_COURSE.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">{ANNUITY_COURSE.description}</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="order-2 lg:order-1">
            <ol className="space-y-3">
              {ANNUITY_COURSE.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`${COURSE_PATH}/${lesson.slug}`}
                    className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 hover:border-brand-black-500"
                  >
                    <span className="font-premium flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-cream-50 text-lg font-semibold text-[#050505]">
                      {lesson.number}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-[#050505]">{lesson.title}</span>
                      <span className="mt-1 block text-sm text-neutral-600">{lesson.summary}</span>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                        <Clock aria-hidden="true" className="h-3.5 w-3.5" /> About {lesson.minutes} minutes
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div id="start" className="order-1 scroll-mt-24 lg:sticky lg:top-24 lg:order-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-7">
              <h2 className="font-premium text-2xl font-semibold text-[#050505]">Free, no sign-up</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-600">Seven short lessons. Listen, read along, or both.</p>
              <Link
                href={`${COURSE_PATH}/${first.slug}`}
                className="gold-gradient-button mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold"
              >
                <PlayCircle aria-hidden="true" className="h-5 w-5" /> Start lesson 1
              </Link>
              <Link
                href="/retirement/quiz"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-[#050505] hover:border-brand-black-500"
              >
                <MessageSquareText aria-hidden="true" className="h-5 w-5" /> Or get your own estimate in 2 minutes
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-neutral-500">
              Lessons are narrated by a computer-generated voice. Educational only, not investment, tax or legal advice.
            </p>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
