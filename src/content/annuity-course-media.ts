// Written by scripts/build-course-audio.mjs (voice en_US-kristin-medium). Do not edit by hand: change the lesson text and run the script.
export type LessonMedia = { audio: string; seconds: number; slideStarts: number[] };

export const COURSE_VOICE = "en_US-kristin-medium";

export const ANNUITY_COURSE_MEDIA: Record<string, LessonMedia> = {
  "what-is-an-annuity": {
    "audio": "/courses/annuities-101/what-is-an-annuity.mp3",
    "seconds": 236,
    "slideStarts": [
      0,
      41.5,
      94.7,
      159.3,
      209.3
    ]
  },
  "fixed-annuities-and-mygas": {
    "audio": "/courses/annuities-101/fixed-annuities-and-mygas.mp3",
    "seconds": 251,
    "slideStarts": [
      0,
      39.7,
      115.2,
      184.1,
      229.3
    ]
  },
  "fixed-indexed-annuities": {
    "audio": "/courses/annuities-101/fixed-indexed-annuities.mp3",
    "seconds": 241,
    "slideStarts": [
      0,
      59.9,
      99.3,
      144.8,
      221.6
    ]
  },
  "income-annuities": {
    "audio": "/courses/annuities-101/income-annuities.mp3",
    "seconds": 229,
    "slideStarts": [
      0,
      48.5,
      98.3,
      151.6,
      210.7
    ]
  },
  "variable-annuities": {
    "audio": "/courses/annuities-101/variable-annuities.mp3",
    "seconds": 241,
    "slideStarts": [
      0,
      30.3,
      86.9,
      171.1,
      205.3
    ]
  },
  "fees-surrender-charges-taxes-access": {
    "audio": "/courses/annuities-101/fees-surrender-charges-taxes-access.mp3",
    "seconds": 271,
    "slideStarts": [
      0,
      83.3,
      101.9,
      160,
      205.2,
      249.1
    ]
  },
  "is-an-annuity-right-for-you": {
    "audio": "/courses/annuities-101/is-an-annuity-right-for-you.mp3",
    "seconds": 243,
    "slideStarts": [
      0,
      45.3,
      100.8,
      152.3,
      195
    ]
  }
};
