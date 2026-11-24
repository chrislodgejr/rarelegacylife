import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Eyebrow, Section } from "@/components/ui/section";
import { ANNUITY_COURSE } from "@/content/annuity-course";
import { COURSE_PATH } from "@/lib/course";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Free Retirement Courses | Rare Legacy Life Group",
  description: "Free, short narrated courses on retirement topics from Rare Legacy Life Group. Start with Annuities 101: seven lessons, about four minutes each.",
  path: "/courses",
});

export default function CoursesPage() {
  const minutes = ANNUITY_COURSE.lessons.reduce((total, lesson) => total + lesson.minutes, 0);
  return (
    <PublicShell>
      <Section>
        <Eyebrow>Free courses</Eyebrow>
        <h1 className="font-premium mt-3 text-4xl font-semibold text-[#050505] sm:text-5xl">Learn before you decide.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">
          Short, narrated lessons in plain English. No sales pitch, no jargon you have to look up.
        </p>
        <Link
          href={COURSE_PATH}
          className="mt-10 block max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-brand-black-500"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-black-500">
            <Headphones aria-hidden="true" className="h-4 w-4" /> {ANNUITY_COURSE.lessons.length} lessons · about {minutes} minutes
          </span>
          <span className="font-premium mt-2 block text-2xl font-semibold text-[#050505]">{ANNUITY_COURSE.title}</span>
          <span className="mt-2 block text-neutral-700">{ANNUITY_COURSE.description}</span>
          <span className="mt-4 inline-flex items-center gap-2 font-semibold text-[#050505]">
            Start the free course <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </Link>
      </Section>
    </PublicShell>
  );
}
