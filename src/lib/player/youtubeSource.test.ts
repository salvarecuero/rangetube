import { describe, it, expect, vi } from "vitest";
import { YouTubeSource, type YTPlayerLike } from "./youtubeSource";

function fakePlayer(overrides: Partial<YTPlayerLike> = {}): YTPlayerLike {
  return {
    getCurrentTime: vi.fn(() => 10),
    getDuration: vi.fn(() => 200),
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: vi.fn(() => 1),
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  };
}

describe("YouTubeSource", () => {
  it("reports speed/captions/volume capabilities", () => {
    const s = new YouTubeSource(fakePlayer());
    expect(s.capabilities).toEqual({ speed: true, captions: true, volume: true });
  });
  it("reads current time and duration from the player", () => {
    const s = new YouTubeSource(fakePlayer());
    expect(s.getCurrentTime()).toBe(10);
    expect(s.getDuration()).toBe(200);
  });
  it("seekTo calls player.seekTo with allowSeekAhead=true", () => {
    const p = fakePlayer();
    new YouTubeSource(p).seekTo(42);
    expect(p.seekTo).toHaveBeenCalledWith(42, true);
  });
  it("play/pause delegate to the player", () => {
    const p = fakePlayer();
    const s = new YouTubeSource(p);
    s.play();
    s.pause();
    expect(p.playVideo).toHaveBeenCalledOnce();
    expect(p.pauseVideo).toHaveBeenCalledOnce();
  });
  it("isPlaying is true only when player state is PLAYING (1)", () => {
    expect(new YouTubeSource(fakePlayer({ getPlayerState: () => 1 })).isPlaying()).toBe(true);
    expect(new YouTubeSource(fakePlayer({ getPlayerState: () => 2 })).isPlaying()).toBe(false);
  });
  it("setPlaybackRate delegates to the player", () => {
    const p = fakePlayer();
    new YouTubeSource(p).setPlaybackRate(1.5);
    expect(p.setPlaybackRate).toHaveBeenCalledWith(1.5);
  });
  it("destroy delegates to the player", () => {
    const p = fakePlayer();
    new YouTubeSource(p).destroy();
    expect(p.destroy).toHaveBeenCalledOnce();
  });
});
