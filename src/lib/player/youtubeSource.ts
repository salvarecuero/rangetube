import type { PlaybackCapabilities, PlaybackState, SourcePlayer } from "./types";

/** Structural subset of YT.Player we depend on (avoids needing @types/youtube). */
export interface YTPlayerLike {
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
  destroy(): void;
  addEventListener(type: "onStateChange", listener: (event: { data: number }) => void): void;
  removeEventListener(type: "onStateChange", listener: (event: { data: number }) => void): void;
}

const YT_STATE_UNSTARTED = -1;
const YT_STATE_ENDED = 0;
const YT_STATE_PLAYING = 1;
const YT_STATE_PAUSED = 2;
const YT_STATE_BUFFERING = 3;
const YT_STATE_CUED = 5;

function toPlaybackState(data: number): PlaybackState | undefined {
  switch (data) {
    case YT_STATE_UNSTARTED:
      return "unstarted";
    case YT_STATE_ENDED:
      return "ended";
    case YT_STATE_PLAYING:
      return "playing";
    case YT_STATE_PAUSED:
      return "paused";
    case YT_STATE_BUFFERING:
      return "buffering";
    case YT_STATE_CUED:
      return "cued";
    default:
      return undefined;
  }
}

type StateSubscriber = (state: PlaybackState) => void;

export class YouTubeSource implements SourcePlayer {
  readonly capabilities: PlaybackCapabilities = {
    speed: true,
    captions: true,
    volume: true,
  };

  private readonly subscribers = new Set<StateSubscriber>();

  private readonly handleStateEvent = (event: { data: number }): void => {
    const state = toPlaybackState(event.data);
    if (state === undefined) return;
    for (const subscriber of this.subscribers) subscriber(state);
  };

  constructor(private readonly player: YTPlayerLike) {
    this.player.addEventListener("onStateChange", this.handleStateEvent);
  }

  getCurrentTime(): number {
    return this.player.getCurrentTime();
  }
  getDuration(): number {
    return this.player.getDuration();
  }
  seekTo(seconds: number): void {
    this.player.seekTo(seconds, true);
  }
  play(): void {
    this.player.playVideo();
  }
  pause(): void {
    this.player.pauseVideo();
  }
  isPlaying(): boolean {
    return this.player.getPlayerState() === YT_STATE_PLAYING;
  }
  setPlaybackRate(rate: number): void {
    this.player.setPlaybackRate(rate);
  }
  onStateChange(subscriber: StateSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }
  destroy(): void {
    this.player.removeEventListener("onStateChange", this.handleStateEvent);
    this.subscribers.clear();
    this.player.destroy();
  }
}
