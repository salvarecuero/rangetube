export const SITE_URL = "https://rangetube.salvarecuero.dev";
export const CONTACT_EMAIL = "contact@salvarecuero.dev";

export const NON_AFFILIATION =
  "RangeTube is an independent project and is not affiliated with, endorsed by, or sponsored by YouTube or Google LLC. YouTube is a trademark of Google LLC. All videos are hosted by YouTube and played via YouTube's official embeddable player.";

export const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** Footer "Made for" row targets. Must cover exactly the slugs in src/content/useCases.ts. */
export const USE_CASE_LINKS = [
  { href: "/for/musicians", label: "Musicians" },
  { href: "/for/language-learners", label: "Language learners" },
  { href: "/for/dancers", label: "Dancers" },
  { href: "/for/students", label: "Students" },
] as const;

/** Footer "Guides" row targets. Must cover exactly the slugs in src/content/howTos.ts. */
export const HOWTO_LINKS = [
  { href: "/how-to/loop-a-section-of-a-youtube-video", label: "Loop a section" },
  { href: "/how-to/ab-loop-youtube", label: "A-B loop" },
  { href: "/how-to/slow-down-a-youtube-video", label: "Slow down" },
  { href: "/how-to/loop-youtube-on-mobile", label: "On mobile" },
] as const;
