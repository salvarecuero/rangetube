import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { parseVideoId } from "../lib/youtube/parseVideoId";
import { createPlayer } from "../lib/youtube/iframeApi";
import { YouTubeSource } from "../lib/player/youtubeSource";
import { LoopEngine } from "../lib/player/loopEngine";
import { startPortfolioReady } from "../lib/embed/portfolioEmbed";
import { formatTime } from "../lib/ui/formatTime";
import { useFocusMode, isTypingTarget } from "../lib/ui/useFocusMode";
import { usePlayhead } from "../lib/ui/usePlayhead";
import type { TimeMode } from "../lib/ui/playhead";
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
  const [confirmReset, setConfirmReset] = useState(false);
  const [timeMode, setTimeMode] = useState<TimeMode>("video");

  const playerHostRef = useRef<HTMLDivElement>(null);
  const keepWatchingRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const sourceRef = useRef<YouTubeSource | null>(null);
  const engineRef = useRef<LoopEngine | null>(null);
  const scrubbing = useRef(false);
  const wasPlaying = useRef(false);

  const { focus, toggle, exit } = useFocusMode();
  usePlayhead(
    trackRef,
    source,
    0,
    duration,
    status === "ready",
    currentTimeRef,
    timeMode,
    range[0],
  );

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
  useEffect(() => {
    if (!confirmReset) return;
    keepWatchingRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setConfirmReset(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmReset]);

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

  function teardownPlayer() {
    engineRef.current?.stop();
    engineRef.current = null;
    sourceRef.current?.destroy();
    sourceRef.current = null;
    setSource(null);
    setPlaying(false);
    setStatus("idle");
    setStageError(null);
    setDuration(0);
    setRange([0, 0]);
  }

  function resetToStart() {
    teardownPlayer();
    setVideoId(null);
    setUrlInput("");
    setError(null);
    setPhase("input");
  }

  function requestHome() {
    if (sourceRef.current?.isPlaying()) {
      setConfirmReset(true);
    } else {
      resetToStart();
    }
  }

  function handleChangeVideo() {
    const id = parseVideoId(urlInput);
    if (!id) {
      setError(
        "That doesn't look like a YouTube link. Try copying it from the address bar or Share button.",
      );
      return;
    }
    if (id === videoId) return;
    setError(null);
    teardownPlayer();
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
    if (!videoId) return;
    setPhase("active");
    setStatus("loading");
    setStageError(null);
    // PlayerStage (which owns the host element) only mounts once we're in the
    // "active" phase, so wait a frame for the ref to attach before creating the player.
    const host = await new Promise<HTMLDivElement | null>((resolve) =>
      requestAnimationFrame(() => resolve(playerHostRef.current)),
    );
    if (!host) return;
    const result = await createPlayer(host, videoId);
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
    // Activation is user-initiated (the facade click), so kick off playback now —
    // YT's autoplay playerVar alone is unreliable when the player is API-created.
    nextSource.play();
    setStatus("ready");
    setPlaying(true);
  }

  // Dragging a thumb scrubs: pause playback (and the loop engine, so it doesn't
  // fight our preview seeks) and just show the frame at the dragged second.
  function startScrub() {
    const s = sourceRef.current;
    if (!s || scrubbing.current) return;
    scrubbing.current = true;
    wasPlaying.current = s.isPlaying();
    engineRef.current?.stop();
    if (wasPlaying.current) {
      s.pause();
      setPlaying(false);
    }
  }
  function previewRange(next: [number, number], scrubSeconds: number) {
    setRange(next);
    sourceRef.current?.seekTo(scrubSeconds);
  }
  function commitRange(next: [number, number]) {
    setRange(next);
    engineRef.current?.setRange({ start: next[0], end: next[1] });
    if (scrubbing.current) {
      scrubbing.current = false;
      engineRef.current?.start();
      if (wasPlaying.current) {
        sourceRef.current?.play();
        setPlaying(true);
      }
    }
  }
  function seekTo(seconds: number) {
    sourceRef.current?.seekTo(seconds);
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
        <header
          className={`flex justify-center px-5 transition-all duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${phase === "input" ? "pt-12 sm:pt-16" : "pt-4 sm:pt-5"}`}
        >
          <button
            type="button"
            onClick={requestHome}
            aria-label="RangeTube — back to start"
            className="rounded-xl transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
          >
            <Logo compact={phase !== "input"} />
          </button>
        </header>
      )}

      <main
        className={`mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 transition-all duration-500 group-data-[focus=true]/shell:max-w-6xl ${
          phase === "input" ? "pb-10" : "pb-4"
        }`}
      >
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
          <div className="rt-rise flex flex-1 flex-col justify-center gap-3 py-3">
            {!focus && (
              <div className="mx-auto w-full max-w-md">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangeVideo();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-line bg-white p-1.5 shadow-sm shadow-brand-900/5"
                >
                  <label htmlFor="change-url" className="sr-only">
                    Load a different YouTube video
                  </label>
                  <input
                    id="change-url"
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste another YouTube link"
                    className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-brand-700/40 focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
                  />
                  <button
                    type="submit"
                    aria-label="Load this video"
                    className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[image:var(--rt-grad)] p-2 text-brand-900 shadow transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </button>
                </form>
                {error && (
                  <p role="alert" className="mt-2 text-center text-sm font-medium text-rose-600">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Cap the stage width so its 16:9 height leaves room for the controls
                within the viewport (non-focus). Controls share the width to stay aligned. */}
            <div
              className="mx-auto flex w-full flex-col gap-3"
              style={
                focus ? undefined : { maxWidth: "min(64rem, calc((100dvh - 20rem) * 16 / 9))" }
              }
            >
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

              {phase === "active" && status === "ready" && duration > 0 && (
                <ControlDeck
                  min={0}
                  max={duration}
                  range={range}
                  playing={playing}
                  trackRef={trackRef}
                  onCommit={commitRange}
                  onPreview={previewRange}
                  onScrubStart={startScrub}
                  onSeek={seekTo}
                  currentTimeRef={currentTimeRef}
                  onPlayPause={playPause}
                  onRestart={restartLoop}
                  onFocus={toggle}
                  onToggleTimeMode={() => setTimeMode((m) => (m === "video" ? "loop" : "video"))}
                  timeMode={timeMode}
                  format={fmt}
                  showFocusButton={!focus}
                  variant={focus ? "dark" : "light"}
                />
              )}
            </div>
          </div>
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

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-reset-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-left shadow-xl"
          >
            <h2 id="confirm-reset-title" className="text-lg font-bold text-ink">
              Leave this video?
            </h2>
            <p className="mt-2 text-sm text-muted">
              It's still playing. Going back to the start will stop it and clear the player.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                ref={keepWatchingRef}
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Keep watching
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  resetToStart();
                }}
                className="rounded-xl bg-[image:var(--rt-grad)] px-4 py-2 text-sm font-semibold text-brand-900 shadow-md shadow-brand-500/30 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
