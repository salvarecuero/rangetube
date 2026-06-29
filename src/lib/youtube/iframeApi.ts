import type { YTPlayerLike } from "../player/youtubeSource";

interface YTNamespace {
  Player: new (
    el: HTMLElement | string,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YTPlayerLike }) => void;
        onError?: (e: { data: number }) => void;
      };
    },
  ) => YTPlayerLike;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Load the IFrame Player API exactly once. */
export function loadIframeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT as YTNamespace);
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

export type CreatePlayerResult =
  | { ok: true; player: YTPlayerLike }
  | { ok: false; kind: "unavailable" | "timeout"; code?: number };

/** Create a privacy-enhanced YT.Player mounted into `el`, resolving when ready or on error/timeout. */
export async function createPlayer(
  el: HTMLElement,
  videoId: string,
  opts: { timeoutMs?: number } = {},
): Promise<CreatePlayerResult> {
  const timeoutMs = opts.timeoutMs ?? 12000;
  const YT = await loadIframeApi();
  return new Promise<CreatePlayerResult>((resolve) => {
    let settled = false;
    const done = (r: CreatePlayerResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const timer = setTimeout(() => done({ ok: false, kind: "timeout" }), timeoutMs);
    new YT.Player(el, {
      videoId,
      host: "https://www.youtube-nocookie.com",
      playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: (e) => done({ ok: true, player: e.target }),
        onError: (e) => done({ ok: false, kind: "unavailable", code: e.data }),
      },
    });
  });
}
