const ID_RE = /^[A-Za-z0-9_-]{11}$/;

function isValidId(id: string | null | undefined): id is string {
  return !!id && ID_RE.test(id);
}

const YT_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
]);

/** Extract an 11-char YouTube video id from a URL or bare id. Returns null if not found. */
export function parseVideoId(input: string): string | null {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;

  if (ID_RE.test(s)) return s;

  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return isValidId(id) ? id : null;
  }

  if (YT_HOSTS.has(host)) {
    if (url.pathname === "/watch") {
      const v = url.searchParams.get("v");
      return isValidId(v) ? v : null;
    }
    const m = url.pathname.match(/^\/(?:embed|shorts|v|live)\/([^/?#]+)/);
    if (m && isValidId(m[1])) return m[1];
  }

  return null;
}
