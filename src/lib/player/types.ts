/** What a given source can do; the UI hides controls a source lacks. */
export interface PlaybackCapabilities {
  speed: boolean;
  captions: boolean;
  volume: boolean;
}

/** Source-agnostic playback contract the LoopEngine and UI depend on. */
export interface SourcePlayer {
  readonly capabilities: PlaybackCapabilities;
  /** Current playback position, in seconds. */
  getCurrentTime(): number;
  /** Total media duration, in seconds (0 if unknown). */
  getDuration(): number;
  /** Seek to a position, in seconds. */
  seekTo(seconds: number): void;
  play(): void;
  pause(): void;
  isPlaying(): boolean;
  /** No-op if the source does not support speed. */
  setPlaybackRate(rate: number): void;
  /** Release the underlying player. */
  destroy(): void;
}
