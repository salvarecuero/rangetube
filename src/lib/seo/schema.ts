/** schema.org JSON-LD generators. */

/** A schema.org FAQPage built from question/answer pairs. */
export function faqPage(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** A schema.org BreadcrumbList; `path`s are resolved against `site` to absolute URLs. */
export function breadcrumbList(crumbs: { name: string; path: string }[], site: string | URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.path, site).toString(),
    })),
  };
}

export function webApplication(siteUrl: string) {
  const url = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "RangeTube",
    url,
    description:
      "Free tool to loop a specific section of any YouTube video. Set a start and end time and repeat only that part endlessly — for music practice, language learning, dance, and study.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Loop a custom section (A-B loop) of any YouTube video",
      "No sign-up required",
      "Works on desktop and mobile",
    ],
  };
}
