"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CourseSlide } from "@/content/annuity-course";

/**
 * A narrated slide lesson: one audio file read by a text-to-speech voice, and the slides turning at the seconds the build script
 * measured (scripts/build-course-audio.mjs). Back and Next jump the voice to that slide.
 */
export function LessonPlayer({
  slides,
  audio,
  slideStarts,
  lessonLabel,
}: {
  slides: CourseSlide[];
  audio: string;
  slideStarts: number[];
  lessonLabel: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    const onTime = () => {
      let current = 0;
      slideStarts.forEach((start, slide) => {
        if (element.currentTime >= start) current = slide;
      });
      setIndex(current);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    element.addEventListener("timeupdate", onTime);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    return () => {
      element.removeEventListener("timeupdate", onTime);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
    };
  }, [slideStarts]);

  const goTo = (slide: number) => {
    const element = audioRef.current;
    const target = Math.max(0, Math.min(slides.length - 1, slide));
    setIndex(target);
    if (element) element.currentTime = slideStarts[target] ?? 0;
  };
  const toggle = () => {
    const element = audioRef.current;
    if (!element) return;
    if (element.paused) void element.play();
    else element.pause();
  };

  const slide = slides[index];
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-[#050505] shadow-lg ring-1 ring-black/10">
      <div className="light-hero-bg relative flex min-h-[18rem] flex-col justify-center px-6 pb-20 pt-8 sm:aspect-video sm:px-12 sm:pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-black-500">
          {lessonLabel} · Slide {index + 1} of {slides.length}
        </p>
        <h2 className="font-premium mt-3 text-2xl font-semibold leading-tight sm:text-4xl" aria-live="polite">
          {slide.heading}
        </h2>
        <ul className="mt-4 space-y-2 text-base leading-snug text-neutral-800 sm:mt-6 sm:text-xl">
          {slide.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cream-500" />
              {point}
            </li>
          ))}
        </ul>
        {!playing && index === 0 ? (
          <button
            type="button"
            onClick={toggle}
            className="gold-gradient-button absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
          >
            <Play aria-hidden="true" className="h-4 w-4" /> Play lesson
          </button>
        ) : null}
      </div>
      <div className="flex items-center gap-2 border-t border-neutral-200 px-3 py-3 sm:px-4">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-40" aria-label="Previous slide">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={toggle} className="rounded-full p-2 hover:bg-neutral-100" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button type="button" onClick={() => goTo(index + 1)} disabled={index === slides.length - 1} className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-40" aria-label="Next slide">
          <ChevronRight className="h-5 w-5" />
        </button>
        <audio ref={audioRef} src={audio} controls preload="metadata" className="ml-1 h-9 min-w-0 flex-1" />
      </div>
    </div>
  );
}
