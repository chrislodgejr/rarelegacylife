import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageSquareText, Phone } from "lucide-react";
import { LessonPlayer } from "@/components/course/lesson-player";
import { PublicShell } from "@/components/layout/public-shell";
import { Section } from "@/components/ui/section";
import { ANNUITY_COURSE } from "@/content/annuity-course";
import { ANNUITY_COURSE_MEDIA } from "@/content/annuity-course-media";
import { getGuide } from "@/content/guides";
import { COURSE_PATH } from "@/lib/course";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE } from "@/lib/site";

type LessonPageProps = { params: Promise<{ lesson: string }> };

const lessonBySlug = (slug: string) => ANNUITY_COURSE.lessons.find((lesson) => lesson.slug === slug);

export function generateStaticParams() {
  return ANNUITY_COURSE.lessons.map((lesson) => ({ lesson: lesson.slug }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const lesson = lessonBySlug((await params).lesson);
  if (!lesson) return {};
  return pageMetadata({
    title: `Lesson ${lesson.number}: ${lesson.title} | Annuities 101 | Rare Legacy Life`,
    description: lesson.summary,
    path: `${COURSE_PATH}/${lesson.slug}`,
  });
}

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = lessonBySlug((await params).lesson);
  const media = lesson ? ANNUITY_COURSE_MEDIA[lesson.slug] : undefined;
  if (!lesson || !media) notFound();
  const previous = ANNUITY_COURSE.lessons.find((item) => item.number === lesson.number - 1);
  const next = ANNUITY_COURSE.lessons.find((item) => item.number === lesson.number + 1);
  const related = lesson.related.map((slug) => getGuide(slug)).filter((guide) => guide !== undefined);

  return (
    <PublicShell>
      <Section>
        <div className="mx-auto max-w-3xl">
          <Link href={COURSE_PATH} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-black-500 hover:underline">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> {ANNUITY_COURSE.title}
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-black-500">
            Lesson {lesson.number} of {ANNUITY_COURSE.lessons.length} · About {lesson.minutes} minutes
          </p>
          <h1 className="font-premium mt-2 text-3xl font-semibold text-[#050505] sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 text-lg leading-8 text-neutral-700">{lesson.summary}</p>

          <div className="mt-8">
            <LessonPlayer
              slides={lesson.slides}
              audio={media.audio}
              slideStarts={media.slideStarts}
              lessonLabel={`Lesson ${lesson.number}`}
            />
            <p className="mt-3 text-xs text-neutral-500">Narrated by a computer-generated voice. Educational only, not investment, tax or legal advice.</p>
          </div>

          <h2 className="font-premium mt-10 text-2xl font-semibold text-[#050505]">Key takeaways</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-800">
            {lesson.keyTakeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>

          <details className="mt-8 rounded-xl border border-neutral-200 bg-white p-5">
              <summary className="cursor-pointer font-semibold text-[#050505]">Read the lesson</summary>
              <div className="mt-4 space-y-4 leading-7 text-neutral-800">
                {lesson.narration.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>

          {/* Every lesson ends on the two ways to go further: the quiz (a phone number for the estimate by text) and an advisor. */}
          <div className="black-hero-bg mt-10 rounded-2xl p-6 text-white sm:p-8">
            <h2 className="font-premium text-2xl font-semibold">Want to know what this means for you?</h2>
            <p className="mt-2 text-white/80">
              Answer a few quick questions and a licensed advisor will text you a personal estimate. Free, no obligation.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link href="/retirement/quiz" className="gold-gradient-button inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold">
                <MessageSquareText aria-hidden="true" className="h-5 w-5" /> Take the 2-minute quiz
              </Link>
              <a
                href={SITE.phone.href}
                data-track="phone_click"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 text-sm font-semibold hover:border-brand-cream-500"
              >
                <Phone aria-hidden="true" className="h-5 w-5" /> Talk to an advisor: {SITE.phone.display}
              </a>
            </div>
          </div>

          {related.length ? (
            <div className="mt-10">
              <h2 className="font-premium text-xl font-semibold text-[#050505]">Go deeper</h2>
              <ul className="mt-3 space-y-2">
                {related.map((guide) => (
                  <li key={guide.slug}>
                    <Link href={`/education/${guide.slug}`} className="font-semibold text-[#050505] underline">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6" aria-label="Lessons">
            {previous ? (
              <Link href={`${COURSE_PATH}/${previous.slug}`} className="inline-flex items-center gap-2 font-semibold text-[#050505]">
                <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Lesson {previous.number}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`${COURSE_PATH}/${next.slug}`} className="inline-flex items-center gap-2 font-semibold text-[#050505]">
                Lesson {next.number}: {next.title} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ) : (
              <Link href="/retirement/quiz" className="gold-gradient-button inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
                Take the 2-minute retirement quiz <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </nav>
        </div>
      </Section>
    </PublicShell>
  );
}
