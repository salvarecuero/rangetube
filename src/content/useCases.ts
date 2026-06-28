export interface UseCaseFaq {
  q: string;
  a: string;
}

export interface UseCase {
  /** URL slug under /for/ — also the route param. */
  slug: "musicians" | "language-learners" | "dancers" | "students";
  /** Short audience label for nav/cross-links. */
  audience: string;
  /** The single page H1. */
  h1: string;
  /** <title> — keyword-bearing, no brand suffix. */
  metaTitle: string;
  /** Meta description — click-magnet sentence. */
  metaDescription: string;
  /** 1-2 sentence subhead under the H1. */
  subhead: string;
  /** 3-4 benefit bullets in this audience's vocabulary. */
  whyBullets: string[];
  /** 3 short "how to use it" steps. */
  steps: string[];
  /** 3-5 FAQ entries → rendered on-page AND emitted as FAQPage JSON-LD. */
  faq: UseCaseFaq[];
}

export const USE_CASES: UseCase[] = [
  {
    slug: "musicians",
    audience: "Musicians",
    h1: "Loop a Section of Any YouTube Video for Music Practice",
    metaTitle: "YouTube Looper for Musicians — Loop & Slow Down Passages",
    metaDescription:
      "Loop the exact bars you're practising and slow them down without changing pitch. Free A-B looper for guitar, piano, and any instrument — no sign-up.",
    subhead:
      "Drill a riff, solo, or tricky passage by repeating just that section of any YouTube lesson or performance — as slow as you need, as many times as it takes.",
    whyBullets: [
      "Set a tight A–B loop around a single lick or bar and repeat it until it's under your fingers.",
      "Slow playback down with YouTube's speed control to catch fast runs, then bring it back to tempo.",
      "No rewinding by hand — the section repeats automatically while you keep both hands on your instrument.",
      "Save loops per video, so your practice spots are still there next session.",
    ],
    steps: [
      "Paste the URL of the lesson, backing track, or performance you want to practise.",
      "Drag the start and end handles to frame the exact passage — a single bar, a phrase, or a whole section.",
      "Hit play; the passage loops on repeat. Use the speed control to slow it down while you learn it.",
    ],
    faq: [
      {
        q: "Can I slow down a YouTube video without changing the pitch?",
        a: "Yes. RangeTube uses YouTube's own player, which lowers the speed while keeping the pitch, so a slowed-down solo still sounds in the right key — ideal for transcribing or learning by ear.",
      },
      {
        q: "Can I loop just one bar or a few notes?",
        a: "Absolutely. Drag the start and end handles as close together as you like, or press the Mark-In ([) and Mark-Out (]) keys to set the loop while the video plays.",
      },
      {
        q: "Will my practice loops be saved?",
        a: "Yes — you can save named loops per video in your browser, so the exact spot you were drilling is waiting next time. Nothing is uploaded; saved loops stay on your device.",
      },
      {
        q: "Is RangeTube free for musicians?",
        a: "Completely free, with no account and no paywall. Some other loopers charge to save loops; RangeTube doesn't.",
      },
    ],
  },
  {
    slug: "language-learners",
    audience: "Language learners",
    h1: "Loop YouTube Videos for Language Learning and Shadowing",
    metaTitle: "YouTube Looper for Language Learning — Shadow & Repeat",
    metaDescription:
      "Repeat a phrase until you can say it, then shadow it at full speed. Free A-B looper for language learning with any YouTube video — no sign-up.",
    subhead:
      "Replay a single sentence as many times as you need, slow it down to catch every sound, and shadow native speakers from any YouTube video.",
    whyBullets: [
      "Loop one phrase or sentence and repeat it until the rhythm and pronunciation stick.",
      "Slow tricky speech down to hear each syllable, then return to natural speed to shadow it.",
      "Practise listening on real, native content — interviews, dramas, news, and songs.",
      "Set Mark-In and Mark-Out on the fly with [ and ] while you listen, no fiddly typing.",
    ],
    steps: [
      "Paste a YouTube link to native speech — a clip, song, interview, or lesson.",
      "Frame the sentence or phrase you want to master with the start and end handles.",
      "Loop it, slow it down to decode it, then shadow along at full speed.",
    ],
    faq: [
      {
        q: "What is shadowing, and how does looping help?",
        a: "Shadowing means repeating speech immediately after — or along with — a native speaker. Looping a single phrase lets you shadow it over and over until your pronunciation and intonation match, without rewinding by hand.",
      },
      {
        q: "Can I slow down speech to understand it better?",
        a: "Yes. YouTube's player can play at reduced speed while keeping the voice natural, so you can catch sounds that fly by at full speed, then speed back up as you improve.",
      },
      {
        q: "Can I repeat just one sentence?",
        a: "Yes — set a tight loop around a single sentence with the handles, or press [ and ] to mark the start and end while it plays.",
      },
      {
        q: "Does it work for songs?",
        a: "It does. Looping a line of a song is a fun, low-pressure way to pick up vocabulary and pronunciation.",
      },
    ],
  },
  {
    slug: "dancers",
    audience: "Dancers",
    h1: "Loop YouTube Videos for Dance Practice and Choreography",
    metaTitle: "YouTube Looper for Dancers — Loop & Slow Choreography",
    metaDescription:
      "Loop an 8-count, slow the choreography down, and drill the move until it's clean. Free A-B looper for dancers on desktop and mobile — no sign-up.",
    subhead:
      "Repeat a single 8-count or transition from any tutorial, slow it down to see the detail, and drill it until it's in your body.",
    whyBullets: [
      "Loop one 8-count or a tricky transition and run it on repeat while you practise.",
      "Slow the choreography down to catch footwork and timing, then bring it back to tempo.",
      "Works on your phone, so you can prop it up in the studio or at home.",
      "Mark the loop while the video plays with [ and ] — no need to stop and type timestamps.",
    ],
    steps: [
      "Paste the link to the tutorial or performance you're learning from.",
      "Set the start and end handles around the section — an 8-count, a combo, or a transition.",
      "Loop it, slow it down to learn the detail, then drill it up to speed.",
    ],
    faq: [
      {
        q: "Can I loop a single 8-count?",
        a: "Yes. Drag the start and end handles around just that section, or press [ and ] to mark it while the video plays, and it repeats on its own while you dance.",
      },
      {
        q: "Can I slow down the choreography?",
        a: "Yes — use the speed control to slow the video down so you can see exactly where the weight shifts and the feet land, then speed back up as you get it.",
      },
      {
        q: "Does it work on my phone?",
        a: "Yes. RangeTube runs in your mobile browser, so you can loop a section from the studio or living room with no app to install.",
      },
      {
        q: "Is it free?",
        a: "Yes, completely free with no account required.",
      },
    ],
  },
  {
    slug: "students",
    audience: "Students",
    h1: "Loop YouTube Videos to Re-Watch and Review Lectures",
    metaTitle: "YouTube Looper for Students — Replay Lecture Sections",
    metaDescription:
      "Re-watch the part of a lecture you didn't catch — loop it, slow it down, and review until it clicks. Free A-B looper for studying, no sign-up.",
    subhead:
      "Replay the exact explanation, proof, or worked example you need from any lecture or tutorial — as many times as it takes to understand it.",
    whyBullets: [
      "Loop the 30 seconds where the key concept is explained instead of scrubbing back and forth.",
      "Slow a fast explanation down so you can take notes without pausing constantly.",
      "Review a worked example or proof step by step, on repeat, until it makes sense.",
      "Save the spots you want to revisit before an exam, per video, in your browser.",
    ],
    steps: [
      "Paste the link to the lecture, tutorial, or explainer video.",
      "Frame the explanation or example you need to review with the start and end handles.",
      "Loop it, slow it down to take notes, and replay until the concept is clear.",
    ],
    faq: [
      {
        q: "Can I replay just the part of a lecture I didn't understand?",
        a: "Yes — set a loop around that section with the handles (or the [ and ] keys) and it repeats automatically, so you can focus on the one idea that didn't click.",
      },
      {
        q: "Can I slow down a fast lecture?",
        a: "Yes. Use the speed control to slow the video down while you take notes, then return to normal speed.",
      },
      {
        q: "Can I save sections to review before an exam?",
        a: "Yes. You can save named loops per video in your browser, so your review spots are ready when you come back. Saved loops stay on your device — nothing is uploaded.",
      },
      {
        q: "Is RangeTube free for students?",
        a: "Yes, it's free with no sign-up and no ads injected by us.",
      },
    ],
  },
];
