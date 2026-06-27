import { describe, it, expect } from "vitest";
import { parseVideoId } from "./parseVideoId";

describe("parseVideoId", () => {
  it("parses a standard watch URL", () => {
    expect(parseVideoId("https://www.youtube.com/watch?v=OPf0YbXqDm0")).toBe("OPf0YbXqDm0");
  });
  it("parses a watch URL with extra params (timestamp)", () => {
    expect(parseVideoId("https://www.youtube.com/watch?v=OPf0YbXqDm0&t=30s")).toBe("OPf0YbXqDm0");
  });
  it("parses a youtu.be short link", () => {
    expect(parseVideoId("https://youtu.be/OPf0YbXqDm0?t=5")).toBe("OPf0YbXqDm0");
  });
  it("parses a /shorts/ URL", () => {
    expect(parseVideoId("https://www.youtube.com/shorts/OPf0YbXqDm0")).toBe("OPf0YbXqDm0");
  });
  it("parses an /embed/ URL", () => {
    expect(parseVideoId("https://www.youtube.com/embed/OPf0YbXqDm0")).toBe("OPf0YbXqDm0");
  });
  it("parses a bare 11-char id", () => {
    expect(parseVideoId("OPf0YbXqDm0")).toBe("OPf0YbXqDm0");
  });
  it("trims surrounding whitespace", () => {
    expect(parseVideoId("  https://youtu.be/OPf0YbXqDm0  ")).toBe("OPf0YbXqDm0");
  });
  it("returns null for a non-YouTube URL", () => {
    expect(parseVideoId("https://vimeo.com/12345")).toBeNull();
  });
  it("returns null for junk text", () => {
    expect(parseVideoId("not a url")).toBeNull();
  });
  it("returns null for empty input", () => {
    expect(parseVideoId("")).toBeNull();
  });
  it("returns null for a watch URL with no v param", () => {
    expect(parseVideoId("https://www.youtube.com/watch?list=abc")).toBeNull();
  });
});
