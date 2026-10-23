import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/preact";
import { Looper } from "./Looper";
import { createPlayer } from "../lib/youtube/iframeApi";

vi.mock("../lib/youtube/iframeApi", () => ({ createPlayer: vi.fn() }));

const createPlayerMock = vi.mocked(createPlayer);

type YTStateListener = (event: { data: number }) => void;
let stateListeners: YTStateListener[] = [];

function fireNativeStateChange(data: number) {
  for (const listener of [...stateListeners]) listener({ data });
}

function makeMockPlayer() {
  return {
    getCurrentTime: vi.fn().mockReturnValue(0),
    getDuration: vi.fn().mockReturnValue(100),
    getVideoData: vi.fn().mockReturnValue({ isLive: false }),
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: () => 1, // YT "playing"
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
    addEventListener: vi.fn((_type: "onStateChange", listener: YTStateListener) => {
      stateListeners.push(listener);
    }),
    removeEventListener: vi.fn((_type: "onStateChange", listener: YTStateListener) => {
      stateListeners = stateListeners.filter((l) => l !== listener);
    }),
  };
}

/** Render the Looper and drive it to the ready/playing state.
 *  Returns the mock player object so callers can assert on its spies
 *  (e.g. `source.setPlaybackRate`, `source.seekTo`).
 */
async function renderPlaying() {
  const player = makeMockPlayer();
  createPlayerMock.mockResolvedValue({ ok: true, player });
  render(<Looper />);
  fireEvent.change(screen.getByPlaceholderText(/youtube link/i), {
    target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  });
  fireEvent.click(screen.getByRole("button", { name: /load video/i }));
  fireEvent.click(await screen.findByRole("button", { name: /play video/i }));
  await waitFor(() => expect(createPlayer).toHaveBeenCalled());
  // Wait for the ControlDeck to be rendered (status=ready + duration>0).
  await waitFor(() => expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument());
  return { source: player };
}

/** Load + activate a given mock player without waiting for the ControlDeck
 *  (live streams and upcoming premieres have no timeline yet at activation). */
async function renderActivated(player: ReturnType<typeof makeMockPlayer>) {
  createPlayerMock.mockResolvedValue({ ok: true, player });
  render(<Looper />);
  fireEvent.change(screen.getByPlaceholderText(/youtube link/i), {
    target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  });
  fireEvent.click(screen.getByRole("button", { name: /load video/i }));
  fireEvent.click(await screen.findByRole("button", { name: /play video/i }));
  await waitFor(() => expect(player.playVideo).toHaveBeenCalled());
}

/** Like renderPlaying(), but the videoId comes from the deep-link URL already
 *  set on window.location. Does NOT submit the URL input — instead clicks the
 *  facade's play affordance to trigger handleActivate.
 */
async function renderPlayingFromUrl() {
  const player = makeMockPlayer();
  createPlayerMock.mockResolvedValue({ ok: true, player });
  render(<Looper />);
  // The mount effect decodes the URL and moves us to the facade phase.
  fireEvent.click(await screen.findByRole("button", { name: /play video/i }));
  await waitFor(() => expect(createPlayer).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument());
  return { source: player };
}

describe("Looper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    stateListeners = [];
  });
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("renders the hero input on first paint", () => {
    render(<Looper />);
    expect(screen.getByRole("button", { name: /load video/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/youtube link/i)).toBeInTheDocument();
  });

  it("always shows the compliance attribution", () => {
    render(<Looper />);
    expect(screen.getByRole("link", { name: /developed with youtube/i })).toBeInTheDocument();
  });

  it("moves focus to play/pause on entering focus mode and back to the focus toggle on exit", async () => {
    await renderPlaying();

    // Entering focus mode lands keyboard focus on the play/pause control.
    // Exact name: the deck toggle is "Focus mode"; the exit chip is "Exit focus mode".
    fireEvent.click(screen.getByRole("button", { name: "Focus mode" }));
    await waitFor(() => expect(screen.getByRole("button", { name: /pause/i })).toHaveFocus());

    // Esc always exits, returning focus to the focus toggle (a sensible re-entry point).
    fireEvent.keyDown(document.body, { key: "Escape" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Focus mode" })).toHaveFocus());
  });

  it("shows an explicit exit chip in focus mode that exits on click", async () => {
    await renderPlaying();
    fireEvent.click(screen.getByRole("button", { name: "Focus mode" }));

    const exitChip = await screen.findByRole("button", { name: /exit focus mode/i });
    fireEvent.click(exitChip);

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /exit focus mode/i })).not.toBeInTheDocument(),
    );
    // Back in the normal layout: the deck toggle is offered again, not pressed.
    expect(screen.getByRole("button", { name: "Focus mode" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("confirms before resetting via the logo while a video is playing", async () => {
    await renderPlaying();

    // Clicking the logo while playing opens a confirmation, not an immediate reset.
    fireEvent.click(screen.getByRole("link", { name: /back to start/i }));
    expect(await screen.findByRole("dialog")).toHaveTextContent(/leave this video/i);

    // Confirming returns to the hero input.
    fireEvent.click(screen.getByRole("button", { name: /^leave$/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByPlaceholderText(/youtube link/i)).toBeInTheDocument();
  });

  it("clears share params from the URL when leaving a video", async () => {
    await renderPlaying();
    // Activation writes the loop params into the URL (deep-link support).
    expect(window.location.search).toMatch(/v=dQw4w9WgXcQ/);

    fireEvent.click(screen.getByRole("link", { name: /back to start/i }));
    fireEvent.click(await screen.findByRole("button", { name: /^leave$/i }));

    // A reload after leaving must land on the empty looper, not the old video.
    await waitFor(() => expect(window.location.search).toBe(""));
  });

  it("does not intercept modified clicks on the logo (browser opens href natively)", async () => {
    await renderPlaying();

    // Ctrl+click must skip the preventDefault/requestHome path entirely:
    // no confirm dialog, no reset - the browser handles the navigation.
    fireEvent.click(screen.getByRole("link", { name: /back to start/i }), { ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // Still in the playing state: the pause control is still rendered.
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("syncs the play/pause toggle when the video is paused or played via the native controls", async () => {
    await renderPlaying();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();

    // User pauses inside YouTube's own control bar: our toggle must follow.
    act(() => fireNativeStateChange(2)); // YT.PlayerState.PAUSED
    await waitFor(() => expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument());

    // A transient buffering event (e.g. after a native seek) must not flip it.
    act(() => fireNativeStateChange(3)); // YT.PlayerState.BUFFERING
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();

    // User resumes natively.
    act(() => fireNativeStateChange(1)); // YT.PlayerState.PLAYING
    await waitFor(() => expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument());
  });

  it("stops listening for native state changes after teardown via the logo", async () => {
    const { source } = await renderPlaying();
    fireEvent.click(screen.getByRole("link", { name: /back to start/i }));
    fireEvent.click(await screen.findByRole("button", { name: /^leave$/i }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /play video/i })).not.toBeInTheDocument(),
    );

    // The destroyed source must have unsubscribed from the player: firing a
    // late event must not crash and must not resurrect any UI state.
    expect(() => act(() => fireNativeStateChange(2))).not.toThrow();
    expect(source.removeEventListener).toHaveBeenCalledWith(
      "onStateChange",
      source.addEventListener.mock.calls[0]?.[1],
    );
  });

  it("changes playback rate via the speed control", async () => {
    const { source } = await renderPlaying();
    fireEvent.click(screen.getByRole("button", { name: /faster/i }));
    expect(source.setPlaybackRate).toHaveBeenCalledWith(1.25);
  });

  it("marks A and B to the current playhead with [ and ]", async () => {
    const { source } = await renderPlaying();
    source.getCurrentTime.mockReturnValue(30);
    fireEvent.keyDown(document.body, { key: "[" });
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /loop start/i })).toHaveValue("0:30.0"),
    );

    source.getCurrentTime.mockReturnValue(45);
    fireEvent.keyDown(document.body, { key: "]" });
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /loop end/i })).toHaveValue("0:45.0"),
    );
  });

  it("writes the video into the URL as soon as it is loaded, before playing", async () => {
    render(<Looper />);
    fireEvent.change(screen.getByPlaceholderText(/youtube link/i), {
      target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });
    fireEvent.click(screen.getByRole("button", { name: /load video/i }));
    await screen.findByRole("button", { name: /play video/i });
    expect(window.location.search).toBe("?v=dQw4w9WgXcQ");
    expect(createPlayerMock).not.toHaveBeenCalled();
  });

  it("pre-loads the facade from a video-only link", async () => {
    window.history.replaceState(null, "", "/?v=dQw4w9WgXcQ");
    render(<Looper />);
    expect(await screen.findByRole("button", { name: /play video/i })).toBeInTheDocument();
  });

  it("pre-loads the facade from a deep link without instantiating the player", () => {
    window.history.replaceState(null, "", "/?v=dQw4w9WgXcQ&s=30&e=45&r=0.5");
    render(<Looper />);
    // The facade (click-to-load) is shown; the real player is NOT created yet.
    expect(createPlayerMock).not.toHaveBeenCalled();
  });

  it("applies the deep-link range and rate after the player loads", async () => {
    window.history.replaceState(null, "", "/?v=dQw4w9WgXcQ&s=30&e=45&r=0.5");
    const { source } = await renderPlayingFromUrl();
    expect(screen.getByRole("textbox", { name: /loop start/i })).toHaveValue("0:30.0");
    expect(screen.getByRole("textbox", { name: /loop end/i })).toHaveValue("0:45.0");
    expect(source.setPlaybackRate).toHaveBeenCalledWith(0.5);
  });

  it("syncs the URL on range commit", async () => {
    await renderPlaying();
    fireEvent.click(screen.getByRole("button", { name: /mark in/i }));
    expect(window.location.search).toMatch(/v=dQw4w9WgXcQ/);
    expect(window.location.search).toMatch(/s=\d/);
    expect(window.location.search).toMatch(/e=\d/);
  });

  it("applies a saved loop: sets range, rate and seeks without reloading", async () => {
    const { source } = await renderPlaying();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Bit" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));
    source.seekTo.mockClear();
    source.setPlaybackRate.mockClear();
    fireEvent.click(screen.getByRole("button", { name: /apply loop bit/i }));
    expect(source.seekTo).toHaveBeenCalled();
    expect(source.setPlaybackRate).toHaveBeenCalledWith(1); // saved loop captured rate=1
    // The saved loop was captured at start=0, end=100 (the initial full-duration range).
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /loop start/i })).toHaveValue("0:00.0"),
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: /loop end/i })).toHaveValue("1:40.0"),
    );
    expect(createPlayerMock).toHaveBeenCalledTimes(1); // player NOT recreated
  });

  it("hides saved loops in focus mode", async () => {
    await renderPlaying();
    expect(screen.getByRole("region", { name: /saved loops/i })).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: "f" });
    expect(screen.queryByRole("region", { name: /saved loops/i })).not.toBeInTheDocument();
  });

  describe("live streams", () => {
    // Fake only the live tick's clock. jsdom drives rAF off setInterval, so
    // route rAF through the (real) setTimeout instead.
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
      vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
        setTimeout(() => cb(performance.now()), 16),
      );
      vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
    });
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    });
    const tick = (ms = 1000) =>
      act(async () => {
        await vi.advanceTimersByTimeAsync(ms);
      });
    // Activation settles outside act(), so give Preact's rAF-scheduled effects
    // (the live tick's setInterval) a real frame to register.
    async function activate(player: ReturnType<typeof makeMockPlayer>) {
      await renderActivated(player);
      await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
    }
    const startThumb = () => screen.getByRole("slider", { name: /loop start/i });
    const endThumb = () => screen.getByRole("slider", { name: /loop end/i });

    function livePlayer(currentTime: number) {
      const player = makeMockPlayer();
      player.getVideoData.mockReturnValue({ isLive: true });
      player.getDuration.mockReturnValue(0);
      player.getCurrentTime.mockReturnValue(currentTime);
      return player;
    }

    it("does not loop while an upcoming premiere has no duration yet", async () => {
      const player = makeMockPlayer();
      player.getDuration.mockReturnValue(0);
      await activate(player);
      await tick(3000);
      expect(player.seekTo).not.toHaveBeenCalled();
      expect(screen.queryByRole("slider", { name: /loop start/i })).not.toBeInTheDocument();
    });

    it("waits for a stable duration before treating a non-live stream as a video", async () => {
      const player = makeMockPlayer();
      player.getDuration.mockReturnValue(0);
      await activate(player);
      player.getDuration.mockReturnValue(5);
      await tick();
      player.getDuration.mockReturnValue(6);
      await tick();
      expect(screen.queryByRole("slider", { name: /loop start/i })).not.toBeInTheDocument();
      await tick();
      expect(endThumb()).toHaveAttribute("aria-valuemax", "6");
    });

    it("follows the live edge without looping until a range is marked", async () => {
      const player = livePlayer(600);
      await activate(player);
      await tick();
      expect(startThumb()).toHaveAttribute("aria-valuemin", "0");
      expect(endThumb()).toHaveAttribute("aria-valuemax", "600");
      await tick(2000);
      expect(endThumb()).toHaveAttribute("aria-valuemax", "602");
      expect(endThumb()).toHaveAttribute("aria-valuenow", "602");
      expect(player.seekTo).not.toHaveBeenCalled();
    });

    it("marking A at the live edge keeps B following the edge until B is marked", async () => {
      const player = livePlayer(600);
      await activate(player);
      await tick();
      fireEvent.keyDown(document.body, { key: "[" });
      await tick(5000);
      expect(startThumb()).toHaveAttribute("aria-valuenow", "600");
      expect(endThumb()).toHaveAttribute("aria-valuenow", "605");
      expect(player.seekTo).not.toHaveBeenCalled();
      player.getCurrentTime.mockReturnValue(604);
      fireEvent.keyDown(document.body, { key: "]" });
      await tick(2000);
      expect(endThumb()).toHaveAttribute("aria-valuenow", "604");
    });

    it("reads time from the live edge by default and can switch to stream time", async () => {
      await activate(livePlayer(600));
      await tick();
      expect(screen.getByText(/from live/i)).toBeInTheDocument();
      const readout = screen.getByRole("button", { name: /switch time readout/i });
      fireEvent.click(readout);
      expect(screen.getByText(/in video/i)).toBeInTheDocument();
      fireEvent.click(readout);
      expect(screen.getByText(/in loop/i)).toBeInTheDocument();
      fireEvent.click(readout);
      expect(screen.getByText(/from live/i)).toBeInTheDocument();
    });

    it("limits a long stream's timeline to the trailing 12h DVR window", async () => {
      const player = livePlayer(100_000);
      await activate(player);
      await tick();
      expect(startThumb()).toHaveAttribute("aria-valuemin", String(100_000 - 12 * 3600));
    });

    it("stops following the edge once the user marks a range", async () => {
      const player = livePlayer(600);
      await activate(player);
      await tick();
      player.getCurrentTime.mockReturnValue(550);
      fireEvent.keyDown(document.body, { key: "[" });
      player.getCurrentTime.mockReturnValue(570);
      fireEvent.keyDown(document.body, { key: "]" });
      await tick(3000);
      expect(startThumb()).toHaveAttribute("aria-valuenow", "550");
      expect(endThumb()).toHaveAttribute("aria-valuenow", "570");
      expect(endThumb()).toHaveAttribute("aria-valuemax", "603");
    });

    it("keeps a marked A when the stream ends before B is marked", async () => {
      const player = livePlayer(600);
      await activate(player);
      await tick();
      fireEvent.keyDown(document.body, { key: "[" });
      player.getVideoData.mockReturnValue({ isLive: false });
      player.getDuration.mockReturnValue(900);
      await tick(2000);
      expect(startThumb()).toHaveAttribute("aria-valuenow", "600");
      expect(endThumb()).toHaveAttribute("aria-valuenow", "900");
      expect(endThumb()).toHaveAttribute("aria-valuemax", "900");
    });

    it("becomes a regular video when the stream ends", async () => {
      const player = livePlayer(600);
      await activate(player);
      await tick();
      player.getVideoData.mockReturnValue({ isLive: false });
      player.getDuration.mockReturnValue(900);
      await tick(2000);
      expect(startThumb()).toHaveAttribute("aria-valuemin", "0");
      expect(endThumb()).toHaveAttribute("aria-valuemax", "900");
      expect(endThumb()).toHaveAttribute("aria-valuenow", "900");
    });
  });
});
