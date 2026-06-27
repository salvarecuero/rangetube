import type { PlaybackCapabilities, SourcePlayer } from "./types";

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
}

const YT_STATE_PLAYING = 1;

export class YouTubeSource implements SourcePlayer {
  readonly capabilities: PlaybackCapabilities = {
    speed: true,
    captions: true,
    volume: true,
  };

  constructor(private readonly player: YTPlayerLike) {}

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
  destroy(): void {
    this.player.destroy();
  }
}
