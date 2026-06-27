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

/** Create a privacy-enhanced YT.Player mounted into `el`, resolving when ready. */
export async function createPlayer(el: HTMLElement, videoId: string): Promise<YTPlayerLike> {
  const YT = await loadIframeApi();
  return new Promise<YTPlayerLike>((resolve) => {
    new YT.Player(el, {
      videoId,
      host: "https://www.youtube-nocookie.com",
      playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
      events: { onReady: (e) => resolve(e.target) },
    });
  });
}
