import { useEffect, useRef, useState } from "react";
import { parseVideoId } from "../lib/youtube/parseVideoId";
import { createPlayer } from "../lib/youtube/iframeApi";
import { YouTubeSource } from "../lib/player/youtubeSource";
import { LoopEngine } from "../lib/player/loopEngine";
import { startPortfolioReady } from "../lib/embed/portfolioEmbed";
import { YouTubeFacade } from "./YouTubeFacade";
import { RangeSlider } from "./RangeSlider";

type Phase = "input" | "facade" | "playing";

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function Looper() {
  const [phase, setPhase] = useState<Phase>("input");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<[number, number]>([0, 0]);

  const playerHostRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<YouTubeSource | null>(null);
  const engineRef = useRef<LoopEngine | null>(null);

  useEffect(() => {
    startPortfolioReady();
  }, []);

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key !== " " || !sourceRef.current) return;
      const s = sourceRef.current;
      s.isPlaying() ? s.pause() : s.play();
    }
    document.addEventListener("keyup", onKeyUp);
    return () => document.removeEventListener("keyup", onKeyUp);
  }, []);

  useEffect(() => {
    return () => {
      engineRef.current?.stop();
      sourceRef.current?.destroy();
    };
  }, []);

  function handleSubmit() {
    const id = parseVideoId(urlInput);
    if (!id) {
      setError("Please enter a valid YouTube video URL or ID.");
      return;
    }
    setError(null);
    setVideoId(id);
    setPhase("facade");
  }

  async function handleActivate() {
    if (!videoId || !playerHostRef.current) return;
    const player = await createPlayer(playerHostRef.current, videoId);
    const source = new YouTubeSource(player);
    sourceRef.current = source;
    const dur = source.getDuration();
    setDuration(dur);
    setRange([0, dur]);
    const engine = new LoopEngine({
      getCurrentTime: () => source.getCurrentTime(),
      seekTo: (s) => source.seekTo(s),
    });
    engine.setRange({ start: 0, end: dur });
    engine.start();
    engineRef.current = engine;
    setPhase("playing");
  }

  function handleRangeChange(next: [number, number]) {
    setRange(next);
    engineRef.current?.setRange({ start: next[0], end: next[1] });
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
      {phase === "input" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="yt-url" className="font-medium">
            YouTube video URL
          </label>
          <div className="flex gap-2">
            <input
              id="yt-url"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded border border-neutral-400 px-3 py-2"
            />
            <button type="submit" className="rounded bg-neutral-800 px-4 py-2 text-white">
              Load
            </button>
          </div>
          {error && (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          )}
        </form>
      )}

      {phase !== "input" && (
        <div className="aspect-video w-full">
          {phase === "facade" && videoId && (
            <YouTubeFacade videoId={videoId} onActivate={handleActivate} />
          )}
          <div ref={playerHostRef} className={phase === "playing" ? "h-full w-full" : "hidden"} />
        </div>
      )}

      {phase === "playing" && duration > 0 && (
        <RangeSlider
          min={0}
          max={duration}
          value={range}
          onChange={handleRangeChange}
          formatValueText={formatTime}
        />
      )}

      <p className="text-sm text-neutral-500">
        <a href="https://www.youtube.com" rel="noopener" className="underline">
          Developed with YouTube
        </a>{" "}
        · RangeTube is not affiliated with or endorsed by YouTube or Google.
      </p>
    </section>
  );
}
