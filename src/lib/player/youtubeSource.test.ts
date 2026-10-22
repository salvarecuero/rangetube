import { describe, it, expect, vi } from "vitest";
import { YouTubeSource, type YTPlayerLike } from "./youtubeSource";
import type { PlaybackState } from "./types";

type StateListener = (event: { data: number }) => void;

function fakePlayer(overrides: Partial<YTPlayerLike> = {}) {
  const stateListeners = new Set<StateListener>();
  const player: YTPlayerLike = {
    getCurrentTime: vi.fn(() => 10),
    getDuration: vi.fn(() => 200),
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: vi.fn(() => 1),
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
    addEventListener: vi.fn((_type: "onStateChange", listener: StateListener) => {
      stateListeners.add(listener);
    }),
    removeEventListener: vi.fn((_type: "onStateChange", listener: StateListener) => {
      stateListeners.delete(listener);
    }),
    ...overrides,
  };
  const fireStateChange = (data: number) => {
    for (const listener of [...stateListeners]) listener({ data });
  };
  return { player, fireStateChange };
}

describe("YouTubeSource", () => {
  it("reports speed/captions/volume capabilities", () => {
    const { player } = fakePlayer();
    const s = new YouTubeSource(player);
    expect(s.capabilities).toEqual({ speed: true, captions: true, volume: true });
  });
  it("reads current time and duration from the player", () => {
    const { player } = fakePlayer();
    const s = new YouTubeSource(player);
    expect(s.getCurrentTime()).toBe(10);
    expect(s.getDuration()).toBe(200);
  });
  it("seekTo calls player.seekTo with allowSeekAhead=true", () => {
    const { player } = fakePlayer();
    new YouTubeSource(player).seekTo(42);
    expect(player.seekTo).toHaveBeenCalledWith(42, true);
  });
  it("play/pause delegate to the player", () => {
    const { player } = fakePlayer();
    const s = new YouTubeSource(player);
    s.play();
    s.pause();
    expect(player.playVideo).toHaveBeenCalledOnce();
    expect(player.pauseVideo).toHaveBeenCalledOnce();
  });
  it("isLive reflects the player's video data, defaulting to false", () => {
    const live = fakePlayer({ getVideoData: () => ({ isLive: true }) }).player;
    const vod = fakePlayer({ getVideoData: () => ({ isLive: false }) }).player;
    expect(new YouTubeSource(live).isLive()).toBe(true);
    expect(new YouTubeSource(vod).isLive()).toBe(false);
    expect(new YouTubeSource(fakePlayer().player).isLive()).toBe(false);
  });
  it("isPlaying is true only when player state is PLAYING (1)", () => {
    expect(new YouTubeSource(fakePlayer({ getPlayerState: () => 1 }).player).isPlaying()).toBe(true);
    expect(new YouTubeSource(fakePlayer({ getPlayerState: () => 2 }).player).isPlaying()).toBe(false);
  });
  it("setPlaybackRate delegates to the player", () => {
    const { player } = fakePlayer();
    new YouTubeSource(player).setPlaybackRate(1.5);
    expect(player.setPlaybackRate).toHaveBeenCalledWith(1.5);
  });
  it("destroy delegates to the player", () => {
    const { player } = fakePlayer();
    new YouTubeSource(player).destroy();
    expect(player.destroy).toHaveBeenCalledOnce();
  });
});

describe("YouTubeSource.onStateChange", () => {
  const cases: ReadonlyArray<readonly [number, PlaybackState]> = [
    [-1, "unstarted"],
    [0, "ended"],
    [1, "playing"],
    [2, "paused"],
    [3, "buffering"],
    [5, "cued"],
  ];
  it.each(cases)("maps YT state %i to %s", (data, expected) => {
    const { player, fireStateChange } = fakePlayer();
    const seen: PlaybackState[] = [];
    new YouTubeSource(player).onStateChange((state) => seen.push(state));
    fireStateChange(data);
    expect(seen).toEqual([expected]);
  });

  it("delivers native-initiated changes without any imperative play/pause call", () => {
    const { player, fireStateChange } = fakePlayer();
    const s = new YouTubeSource(player);
    const seen: PlaybackState[] = [];
    s.onStateChange((state) => seen.push(state));
    fireStateChange(1); // user pressed play on the native controls
    fireStateChange(2); // user pressed pause
    expect(seen).toEqual(["playing", "paused"]);
    expect(player.playVideo).not.toHaveBeenCalled();
    expect(player.pauseVideo).not.toHaveBeenCalled();
  });

  it("fans a single player listener out to every subscriber", () => {
    const { player, fireStateChange } = fakePlayer();
    const s = new YouTubeSource(player);
    const first: PlaybackState[] = [];
    const second: PlaybackState[] = [];
    s.onStateChange((state) => first.push(state));
    s.onStateChange((state) => second.push(state));
    fireStateChange(2);
    expect(first).toEqual(["paused"]);
    expect(second).toEqual(["paused"]);
    expect(player.addEventListener).toHaveBeenCalledOnce();
  });

  it("stops delivery after unsubscribe, and unsubscribing twice is safe", () => {
    const { player, fireStateChange } = fakePlayer();
    const s = new YouTubeSource(player);
    const seen: PlaybackState[] = [];
    const unsubscribe = s.onStateChange((state) => seen.push(state));
    fireStateChange(1);
    unsubscribe();
    unsubscribe();
    fireStateChange(2);
    expect(seen).toEqual(["playing"]);
  });

  it("keeps delivering to remaining subscribers when one unsubscribes", () => {
    const { player, fireStateChange } = fakePlayer();
    const s = new YouTubeSource(player);
    const dropped: PlaybackState[] = [];
    const kept: PlaybackState[] = [];
    const unsubscribe = s.onStateChange((state) => dropped.push(state));
    s.onStateChange((state) => kept.push(state));
    unsubscribe();
    fireStateChange(0);
    expect(dropped).toEqual([]);
    expect(kept).toEqual(["ended"]);
  });

  it("ignores unknown YT state codes", () => {
    const { player, fireStateChange } = fakePlayer();
    const seen: PlaybackState[] = [];
    new YouTubeSource(player).onStateChange((state) => seen.push(state));
    fireStateChange(99);
    expect(seen).toEqual([]);
  });

  it("destroy removes the internal listener from the player before player.destroy", () => {
    const order: string[] = [];
    const { player } = fakePlayer({
      removeEventListener: vi.fn(() => {
        order.push("removeEventListener");
      }),
      destroy: vi.fn(() => {
        order.push("destroy");
      }),
    });
    new YouTubeSource(player).destroy();
    expect(order).toEqual(["removeEventListener", "destroy"]);
  });

  it("destroy unregisters the exact listener it added and silences subscribers", () => {
    const { player, fireStateChange } = fakePlayer();
    const s = new YouTubeSource(player);
    const seen: PlaybackState[] = [];
    s.onStateChange((state) => seen.push(state));
    s.destroy();
    expect(player.removeEventListener).toHaveBeenCalledOnce();
    const added = vi.mocked(player.addEventListener).mock.calls[0]?.[1];
    const removed = vi.mocked(player.removeEventListener).mock.calls[0]?.[1];
    expect(removed).toBe(added);
    fireStateChange(1);
    expect(seen).toEqual([]);
  });

  it("ignores late events fired by the player after destroy", () => {
    const { player } = fakePlayer();
    const s = new YouTubeSource(player);
    const seen: PlaybackState[] = [];
    s.onStateChange((state) => seen.push(state));
    const internal = vi.mocked(player.addEventListener).mock.calls[0]?.[1];
    s.destroy();
    internal?.({ data: 1 });
    expect(seen).toEqual([]);
  });
});
