import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { Looper } from "./Looper";
import { createPlayer } from "../lib/youtube/iframeApi";

vi.mock("../lib/youtube/iframeApi", () => ({ createPlayer: vi.fn() }));

const createPlayerMock = vi.mocked(createPlayer);

function makeMockPlayer() {
  return {
    getCurrentTime: vi.fn().mockReturnValue(0),
    getDuration: () => 100,
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: () => 1, // YT "playing"
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
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
    fireEvent.click(screen.getByRole("button", { name: /focus mode/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /pause/i })).toHaveFocus());

    // Esc always exits, returning focus to the focus toggle (a sensible re-entry point).
    fireEvent.keyDown(document.body, { key: "Escape" });
    await waitFor(() => expect(screen.getByRole("button", { name: /focus mode/i })).toHaveFocus());
  });

  it("confirms before resetting via the logo while a video is playing", async () => {
    await renderPlaying();

    // Clicking the logo while playing opens a confirmation, not an immediate reset.
    fireEvent.click(screen.getByRole("button", { name: /back to start/i }));
    expect(await screen.findByRole("dialog")).toHaveTextContent(/leave this video/i);

    // Confirming returns to the hero input.
    fireEvent.click(screen.getByRole("button", { name: /^leave$/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByPlaceholderText(/youtube link/i)).toBeInTheDocument();
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
});
