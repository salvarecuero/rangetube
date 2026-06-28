import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Looper } from "./Looper";

vi.mock("../lib/youtube/iframeApi", () => ({
  createPlayer: vi.fn(async () => ({
    getCurrentTime: () => 0,
    getDuration: () => 100,
    seekTo: vi.fn(),
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    getPlayerState: () => 1,
    setPlaybackRate: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe("Looper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the URL input on first load", () => {
    render(<Looper />);
    expect(screen.getByLabelText(/youtube video url/i)).toBeInTheDocument();
  });

  it("shows an error for an invalid URL on submit", () => {
    render(<Looper />);
    fireEvent.change(screen.getByLabelText(/youtube video url/i), {
      target: { value: "nonsense" },
    });
    fireEvent.click(screen.getByRole("button", { name: /load/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/valid youtube/i);
  });

  it("shows the facade after a valid URL is submitted", () => {
    render(<Looper />);
    fireEvent.change(screen.getByLabelText(/youtube video url/i), {
      target: { value: "https://youtu.be/OPf0YbXqDm0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /load/i }));
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });
});
