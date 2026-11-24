// Written by scripts/build-course-audio.mjs (voice kokoro-af_heart). Do not edit by hand: change the lesson text and run the script.
export type LessonMedia = { audio: string; seconds: number; slideStarts: number[] };

export const COURSE_VOICE = "kokoro-af_heart";

export const ANNUITY_COURSE_MEDIA: Record<string, LessonMedia> = {
  "what-is-an-annuity": {
    "audio": "/courses/annuities-101/what-is-an-annuity.mp3",
    "seconds": 232,
    "slideStarts": [
      0,
      39.9,
      89.7,
      155.3,
      205.9
    ]
  },
  "fixed-annuities-and-mygas": {
    "audio": "/courses/annuities-101/fixed-annuities-and-mygas.mp3",
    "seconds": 240,
    "slideStarts": [
      0,
      38.2,
      111.2,
      175.6,
      217.4
    ]
  },
  "fixed-indexed-annuities": {
    "audio": "/courses/annuities-101/fixed-indexed-annuities.mp3",
    "seconds": 230,
    "slideStarts": [
      0,
      54.5,
      93.5,
      136.5,
      210.9
    ]
  },
  "income-annuities": {
    "audio": "/courses/annuities-101/income-annuities.mp3",
    "seconds": 227,
    "slideStarts": [
      0,
      48.7,
      97,
      148.7,
      207.5
    ]
  },
  "variable-annuities": {
    "audio": "/courses/annuities-101/variable-annuities.mp3",
    "seconds": 236,
    "slideStarts": [
      0,
      29.5,
      85.3,
      167.4,
      200.1
    ]
  },
  "fees-surrender-charges-taxes-access": {
    "audio": "/courses/annuities-101/fees-surrender-charges-taxes-access.mp3",
    "seconds": 266,
    "slideStarts": [
      0,
      80.6,
      99.8,
      155.8,
      200.2,
      244.3
    ]
  },
  "is-an-annuity-right-for-you": {
    "audio": "/courses/annuities-101/is-an-annuity-right-for-you.mp3",
    "seconds": 236,
    "slideStarts": [
      0,
      45.3,
      99,
      146.8,
      188.6
    ]
  }
};
