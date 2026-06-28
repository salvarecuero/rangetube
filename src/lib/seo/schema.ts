/** schema.org JSON-LD generators. */
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
