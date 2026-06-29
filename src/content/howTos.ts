import type { UseCase } from "./useCases";

export type HowToSlug =
  | "loop-a-section-of-a-youtube-video"
  | "ab-loop-youtube"
  | "slow-down-a-youtube-video"
  | "loop-youtube-on-mobile";

export interface HowToStep {
  /** Short imperative step title, e.g. "Paste the link". */
  name: string;
  /** One-sentence step body. */
  text: string;
}

export interface HowTo {
  /** URL slug under /how-to/ — also the route param. */
  slug: HowToSlug;
  /** Short label for nav/cross-links/footer. */
  navLabel: string;
  /** The single page H1. */
  h1: string;
  /** <title> — keyword-bearing, no brand suffix. */
  metaTitle: string;
  /** Meta description — click-magnet sentence. */
  metaDescription: string;
  /** 1-2 sentence lead paragraph under the H1. */
  intro: string;
  /** 3-5 ordered steps → rendered on-page AND emitted as HowTo JSON-LD. */
  steps: HowToStep[];
  /** Optional short tips/notes bullets below the steps. */
  tips?: string[];
  /** Use-case pages this guide links to. Every slug must exist in USE_CASES. */
  relatedUseCases: UseCase["slug"][];
}

export const HOW_TOS: HowTo[] = [
  {
    slug: "loop-a-section-of-a-youtube-video",
    navLabel: "Loop a section",
    h1: "How to loop a section of a YouTube video",
    metaTitle: "How to Loop a Section of a YouTube Video (2026 Guide)",
    metaDescription:
      "Loop just one part of a YouTube video in 3 steps — set the start, set the end, and repeat. Works on desktop and mobile, with no software to install.",
    intro:
      "YouTube's built-in loop repeats the whole video. To repeat just one part — a chorus, a clip, a single explanation — you set a start and end point and loop only that range. Here's how, free and with no sign-up.",
    steps: [
      {
        name: "Paste the link",
        text: "Copy the YouTube video URL and paste it into RangeTube on the home page.",
      },
      {
        name: "Set the range",
        text: "Drag the start and end handles to the part you want, or press [ to mark the start and ] to mark the end while the video plays.",
      },
      {
        name: "Press play",
        text: "Hit play and only that section repeats, endlessly, until you change the range.",
      },
    ],
    tips: [
      "The range stays put when you reload — loops are saved per video in your browser, nothing is uploaded.",
      "Want it tighter? Use the numeric time inputs to set the start and end to the exact second.",
    ],
    relatedUseCases: ["musicians", "language-learners"],
  },
  {
    slug: "ab-loop-youtube",
    navLabel: "A-B loop",
    h1: "How to A-B loop a YouTube video",
    metaTitle: "How to A-B Loop a YouTube Video (Free, No Sign-Up)",
    metaDescription:
      "A-B loop means repeating the part between point A and point B. Set A, set B, and RangeTube loops just that segment endlessly — free, with no account.",
    intro:
      "An \"A-B loop\" repeats the part of a video between two points: A (the start) and B (the end). It's the term musicians and language learners use for drilling one passage. RangeTube does it on any YouTube video — here's how.",
    steps: [
      {
        name: "Paste the link",
        text: "Paste the YouTube URL into RangeTube on the home page.",
      },
      {
        name: "Set point A",
        text: "Play to where the passage starts and press [ (Mark-In) to drop point A there.",
      },
      {
        name: "Set point B",
        text: "Let it play to the end of the passage and press ] (Mark-Out) to drop point B.",
      },
      {
        name: "Loop A to B",
        text: "Press play — the video now repeats only between A and B, on a loop.",
      },
    ],
    tips: [
      "Fine-tune A and B with the numeric time inputs for a frame-tight loop.",
      "Slow the loop down with the speed control to learn a fast passage, then bring it back to tempo.",
    ],
    relatedUseCases: ["musicians", "language-learners"],
  },
  {
    slug: "slow-down-a-youtube-video",
    navLabel: "Slow down",
    h1: "How to slow down a YouTube video",
    metaTitle: "How to Slow Down a YouTube Video (Keep the Pitch)",
    metaDescription:
      "Slow a YouTube video to 0.5x without changing the pitch, and loop the tricky part to practise it. Free, no sign-up — for music, language, and dance.",
    intro:
      "Slowing a video down helps you catch fast speech, a quick lick, or detailed footwork. YouTube's player lowers the speed while keeping the pitch natural, so it still sounds right. Here's how to do it — and loop the slow part.",
    steps: [
      {
        name: "Paste the link",
        text: "Paste the YouTube URL into RangeTube on the home page.",
      },
      {
        name: "Lower the speed",
        text: "Open the speed control and pick a slower rate, like 0.5x or 0.75x — the pitch stays the same.",
      },
      {
        name: "Loop the tricky part",
        text: "Set the start and end handles around the section you're learning so it repeats slowly, then bring the speed back up as you get it.",
      },
    ],
    tips: [
      "Slowing down keeps the pitch, so a slowed-down solo is still in the right key — ideal for learning by ear.",
      "Combine slow speed with a tight A-B loop to drill one phrase until it's clean.",
    ],
    relatedUseCases: ["musicians", "language-learners", "dancers"],
  },
  {
    slug: "loop-youtube-on-mobile",
    navLabel: "On mobile",
    h1: "How to loop a YouTube video on mobile (iPhone & Android)",
    metaTitle: "Loop a YouTube Video on Mobile (iPhone & Android)",
    metaDescription:
      "Loop a section of a YouTube video on your phone — no app to install. Open RangeTube in your mobile browser, set the range, and tap play. Free, no sign-up.",
    intro:
      "You don't need an app to loop a YouTube video on your phone. RangeTube runs in any mobile browser on iPhone and Android, so you can repeat a section from the studio, the gym, or the couch. Here's how.",
    steps: [
      {
        name: "Open RangeTube in your browser",
        text: "On your phone, open RangeTube in Safari, Chrome, or any mobile browser — there's nothing to install.",
      },
      {
        name: "Paste the link",
        text: "Copy the YouTube link from the YouTube app's Share menu and paste it into RangeTube.",
      },
      {
        name: "Set the range",
        text: "Drag the start and end handles to the part you want, or use the time inputs to set it precisely.",
      },
      {
        name: "Tap play",
        text: "Tap play and the section loops on repeat — keep the tab open while you practise.",
      },
    ],
    tips: [
      "Looping works the same on iPhone and Android — it's just the browser, no app store needed.",
      "Prop your phone up and loop an 8-count or a phrase hands-free while you practise.",
    ],
    relatedUseCases: ["dancers", "students"],
  },
];
