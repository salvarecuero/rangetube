import { useEffect, useRef, useState } from "react";
import { parseVideoId } from "../lib/youtube/parseVideoId";
import { createPlayer } from "../lib/youtube/iframeApi";
import { YouTubeSource } from "../lib/player/youtubeSource";
import { LoopEngine } from "../lib/player/loopEngine";
import { startPortfolioReady } from "../lib/embed/portfolioEmbed";
import { formatTime } from "../lib/ui/formatTime";
import { useFocusMode, isTypingTarget } from "../lib/ui/useFocusMode";
import { usePlayhead } from "../lib/ui/usePlayhead";
import { HeroInput } from "./HeroInput";
import { Logo } from "./Logo";
import { PlayerStage, type StageError } from "./PlayerStage";
import { YouTubeFacade } from "./YouTubeFacade";
import { ControlDeck } from "./ControlDeck";
import { Compliance } from "./Compliance";

type Phase = "input" | "facade" | "active";
type Status = "idle" | "loading" | "ready" | "error";
const DEMO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export function Looper() {
  const [phase, setPhase] = useState<Phase>("input");
  const [status, setStatus] = useState<Status>("idle");
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stageError, setStageError] = useState<StageError | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [playing, setPlaying] = useState(false);
  const [source, setSource] = useState<YouTubeSource | null>(null);

  const playerHostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<YouTubeSource | null>(null);
  const engineRef = useRef<LoopEngine | null>(null);

  const { focus, toggle, exit } = useFocusMode();
  usePlayhead(trackRef, source, 0, duration, status === "ready");

  useEffect(() => startPortfolioReady(), []);
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key !== " " || !sourceRef.current) return;
      const t = e.target as HTMLElement | null;
      if (isTypingTarget(t) || t?.closest('button, [role="slider"]')) return;
      const s = sourceRef.current;
      if (s.isPlaying()) {
        s.pause();
      } else {
        s.play();
      }
      setPlaying(s.isPlaying());
    }
    document.addEventListener("keyup", onKeyUp);
    return () => document.removeEventListener("keyup", onKeyUp);
  }, []);
  useEffect(
    () => () => {
      engineRef.current?.stop();
      sourceRef.current?.destroy();
    },
    [],
  );

  function handleSubmit() {
    const id = parseVideoId(urlInput);
    if (!id) {
      setError(
        "That doesn't look like a YouTube link. Try copying it from the address bar or Share button.",
      );
      return;
    }
    setError(null);
    setVideoId(id);
    setPhase("facade");
  }

  function handleTryExample() {
    setUrlInput(DEMO_URL);
    const id = parseVideoId(DEMO_URL);
    if (id) {
      setError(null);
      setVideoId(id);
      setPhase("facade");
    }
  }

  async function handleActivate() {
    if (!videoId || !playerHostRef.current) return;
    setPhase("active");
    setStatus("loading");
    setStageError(null);
    const result = await createPlayer(playerHostRef.current, videoId);
    if (!result.ok) {
      setStatus("error");
      setStageError(
        result.kind === "timeout"
          ? {
              kind: "network",
              message: "Couldn't load the video. Check your connection and try again.",
            }
          : {
              kind: "unavailable",
              message: "This video can't be embedded — it may be private, removed, or restricted.",
            },
      );
      return;
    }
    const nextSource = new YouTubeSource(result.player);
    sourceRef.current = nextSource;
    setSource(nextSource);
    const dur = nextSource.getDuration();
    setDuration(dur);
    setRange([0, dur]);
    const engine = new LoopEngine({
      getCurrentTime: () => nextSource.getCurrentTime(),
      seekTo: (s) => nextSource.seekTo(s),
    });
    engine.setRange({ start: 0, end: dur });
    engine.start();
    engineRef.current = engine;
    setStatus("ready");
    setPlaying(true);
  }

  function commitRange(next: [number, number]) {
    setRange(next);
    engineRef.current?.setRange({ start: next[0], end: next[1] });
  }
  function previewRange(next: [number, number]) {
    setRange(next);
    sourceRef.current?.seekTo(next[0]);
  }

  function playPause() {
    const s = sourceRef.current;
    if (!s) return;
    if (s.isPlaying()) {
      s.pause();
    } else {
      s.play();
    }
    setPlaying(s.isPlaying());
  }
  function restartLoop() {
    sourceRef.current?.seekTo(range[0]);
  }

  const fmt = (s: number) => formatTime(s, true);

  return (
    <div
      data-focus={focus ? "true" : "false"}
      className="group/shell flex min-h-dvh flex-col transition-colors duration-500 data-[focus=true]:bg-focus-bg"
    >
      <div aria-live="polite" className="sr-only">
        {focus ? "Focus mode on" : "Focus mode off"}
        {status === "loading" ? "Loading video" : ""}
        {status === "ready" ? `Looping ${fmt(range[0])} to ${fmt(range[1])}` : ""}
      </div>

      {!focus && (
        <header className="mx-auto flex w-full max-w-5xl justify-center px-5 pb-2 pt-10">
          <Logo />
        </header>
      )}

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-6 px-5 py-6 transition-all duration-500 group-data-[focus=true]/shell:max-w-6xl">
        {phase === "input" && (
          <HeroInput
            value={urlInput}
            onChange={setUrlInput}
            onSubmit={handleSubmit}
            onTryExample={handleTryExample}
            error={error}
          />
        )}

        {phase !== "input" && (
          <>
            {phase === "facade" && videoId && (
              <div className="aspect-video w-full">
                <YouTubeFacade videoId={videoId} onActivate={handleActivate} />
              </div>
            )}
            {phase === "active" && (
              <PlayerStage
                status={status === "idle" ? "loading" : status}
                hostRef={playerHostRef}
                error={stageError}
                onRetry={handleActivate}
              />
            )}
          </>
        )}

        {phase === "active" && status === "ready" && duration > 0 && (
          <ControlDeck
            min={0}
            max={duration}
            range={range}
            playing={playing}
            trackRef={trackRef}
            onCommit={commitRange}
            onPreview={previewRange}
            onPlayPause={playPause}
            onRestart={restartLoop}
            onFocus={toggle}
            format={fmt}
            showFocusButton={!focus}
            variant={focus ? "dark" : "light"}
          />
        )}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-5 pb-6">
        <Compliance dark={focus} />
      </footer>

      {focus && (
        <button
          type="button"
          onClick={exit}
          className="fixed right-5 top-5 z-50 text-xs text-focus-muted hover:text-focus-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 focus-visible:rounded-sm"
        >
          Focus mode · Esc to exit
        </button>
      )}
    </div>
  );
}
