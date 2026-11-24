// Builds the narrated audio for the free "Annuities 101" course (Chris, 2026-11-24: "yes build the free annuities course too ...
// can they be automated using a free voice"). For each lesson in src/content/annuity-course.ts it reads the narration aloud with
// Piper (an open-source, offline text-to-speech engine), one clip per slide, joins the clips into one MP3 in
// public/courses/annuities-101/, and writes src/content/annuity-course-media.ts with each lesson's file and the second each slide
// starts, so the lesson page can turn its slides in time with the voice. Change a lesson's text and run this again.
//
// The voice is Kokoro's "af_heart" (Chris, 2026-11-24, of four samples: "use new-1-heart-female ... but needs a little tweek to sound
// normal"), through scripts/tts-kokoro.py: Kokoro is open source (Apache 2.0), so commercial use is allowed. Needs python with
// kokoro-onnx and soundfile, the two Kokoro model files, and ffmpeg and ffprobe. Piper (--engine piper) still works but sounds robotic.
//
//   node scripts/build-course-audio.mjs --engine kokoro --kokoro-dir /path/to/kokoro [--voice af_heart] [--speed 1.0] [--only slug]

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const engine = flag("engine", "kokoro");
const model = flag("model");
const piper = flag("piper", "piper");
const python = flag("python", "python3");
const kokoroDir = flag("kokoro-dir");
const voiceName = flag("voice", "af_heart");
const speed = flag("speed", "1.0");
const only = flag("only");
if ((engine === "piper" && !model) || (engine === "kokoro" && !kokoroDir)) {
  console.error(
    "Usage: node scripts/build-course-audio.mjs --engine kokoro --kokoro-dir DIR [--voice af_heart] [--speed 1.0] [--python python3] [--only slug]\n" +
      "   or: node scripts/build-course-audio.mjs --engine piper --model /path/voice.onnx [--piper piper] [--only slug]",
  );
  process.exit(1);
}

const { ANNUITY_COURSE } = await import("../src/content/annuity-course.ts");
const outDir = join("public", "courses", ANNUITY_COURSE.slug);
mkdirSync(outDir, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "course-audio-"));

/** Spread the narration's paragraphs over the slides in order, so each slide is on screen while its part is read. */
export function paragraphsPerSlide(paragraphs, slideCount) {
  const groups = Array.from({ length: slideCount }, () => []);
  paragraphs.forEach((paragraph, index) => groups[Math.min(slideCount - 1, Math.floor((index * slideCount) / paragraphs.length))].push(paragraph));
  return groups;
}

const seconds = (file) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());

const media = {};
try {
  for (const lesson of ANNUITY_COURSE.lessons) {
    if (only && lesson.slug !== only) continue;
    const groups = paragraphsPerSlide(lesson.narration, lesson.slides.length);
    const clips = [];
    const slideStarts = [];
    let at = 0;
    groups.forEach((group, index) => {
      const wav = join(work, `${lesson.slug}-${index}.wav`);
      // A short pause between paragraphs and after each slide reads more naturally than one long run.
      if (engine === "kokoro") {
        execFileSync(python, ["scripts/tts-kokoro.py", "--model-dir", kokoroDir, "--voice", voiceName, "--speed", speed, "--out", wav], {
          input: group.join("\n\n"),
        });
      } else {
        execFileSync(piper, ["--model", model, "--output_file", wav, "--sentence_silence", "0.35"], { input: group.join("\n\n") });
      }
      const padded = join(work, `${lesson.slug}-${index}-p.wav`);
      execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", wav, "-af", "apad=pad_dur=0.8", padded]);
      slideStarts.push(Math.round(at * 10) / 10);
      at += seconds(padded);
      clips.push(padded);
    });
    const list = join(work, `${lesson.slug}.txt`);
    writeFileSync(list, clips.map((clip) => `file '${clip}'`).join("\n"));
    const mp3 = join(outDir, `${lesson.slug}.mp3`);
    // Mono speech at 48 kb/s: clear on a phone and about 2 MB for a five-minute lesson.
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-b:a", "48k", mp3]);
    media[lesson.slug] = { audio: `/courses/${ANNUITY_COURSE.slug}/${lesson.slug}.mp3`, seconds: Math.round(at), slideStarts };
    console.log(`${lesson.slug}: ${Math.round(at)}s, slides at ${slideStarts.join(", ")}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (!only) {
  const voice = engine === "kokoro" ? `kokoro-${voiceName}` : model.split("/").pop().replace(/\.onnx$/, "");
  const file = `// Written by scripts/build-course-audio.mjs (voice ${voice}). Do not edit by hand: change the lesson text and run the script.
export type LessonMedia = { audio: string; seconds: number; slideStarts: number[] };

export const COURSE_VOICE = ${JSON.stringify(voice)};

export const ANNUITY_COURSE_MEDIA: Record<string, LessonMedia> = ${JSON.stringify(media, null, 2)};
`;
  writeFileSync(join("src", "content", "annuity-course-media.ts"), file);
}
