import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { Looper } from "./Looper";
import { createPlayer } from "../lib/youtube/iframeApi";

vi.mock("../lib/youtube/iframeApi", () => ({ createPlayer: vi.fn() }));

/** Render the Looper and drive it to the ready/playing state.
 *  Returns the mock player object so callers can assert on its spies
 *  (e.g. `source.setPlaybackRate`, `source.seekTo`).
 */
async function renderPlaying() {
  const player = {
    getCurrentTime: () => 0,
    getDuration: () => 100,
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: () => 1, // YT "playing"
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
  };
  vi.mocked(createPlayer).mockResolvedValue({ ok: true, player });
  render(<Looper />);
  fireEvent.change(screen.getByPlaceholderText(/youtube link/i), {
    target: { value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  });
  fireEvent.click(screen.getByRole("button", { name: /load video/i }));
  fireEvent.click(await screen.findByRole("button", { name: /play video/i }));
  await waitFor(() => expect(createPlayer).toHaveBeenCalled());
  return { source: player };
}

describe("Looper", () => {
  beforeEach(() => vi.clearAllMocks());

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
    fireEvent.click(screen.getByRole("button", { name: /1\.25× speed/i }));
    expect(source.setPlaybackRate).toHaveBeenCalledWith(1.25);
  });
});
