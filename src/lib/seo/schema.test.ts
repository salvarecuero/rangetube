import { describe, it, expect } from "vitest";
import { webApplication, faqPage, breadcrumbList } from "./schema";

describe("webApplication", () => {
  const obj = webApplication("https://rangetube.salvarecuero.dev");

  it("is a free WebApplication with the canonical url", () => {
    expect(obj["@type"]).toBe("WebApplication");
    expect(obj.name).toBe("RangeTube");
    expect(obj.url).toBe("https://rangetube.salvarecuero.dev/");
    expect(obj.offers.price).toBe("0");
    expect(obj.offers.priceCurrency).toBe("USD");
  });

  it("lists features and has no fabricated rating", () => {
    expect(Array.isArray(obj.featureList)).toBe(true);
    expect(obj.featureList.length).toBeGreaterThan(0);
    expect("aggregateRating" in obj).toBe(false);
  });
});

describe("faqPage", () => {
  const obj = faqPage([
    { q: "Is it free?", a: "Yes, completely free." },
    { q: "Do I need an account?", a: "No account required." },
  ]);

  it("is a FAQPage with one Question/Answer per entry", () => {
    expect(obj["@type"]).toBe("FAQPage");
    expect(obj.mainEntity).toHaveLength(2);
    expect(obj.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Is it free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely free." },
    });
  });
});

describe("breadcrumbList", () => {
  const obj = breadcrumbList(
    [
      { name: "Home", path: "/" },
      { name: "Musicians", path: "/for/musicians" },
    ],
    "https://rangetube.salvarecuero.dev",
  );

  it("is an ordered BreadcrumbList with absolute item URLs", () => {
    expect(obj["@type"]).toBe("BreadcrumbList");
    expect(obj.itemListElement).toHaveLength(2);
    expect(obj.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://rangetube.salvarecuero.dev/",
    });
    expect(obj.itemListElement[1].position).toBe(2);
    expect(obj.itemListElement[1].item).toBe("https://rangetube.salvarecuero.dev/for/musicians");
  });
});
