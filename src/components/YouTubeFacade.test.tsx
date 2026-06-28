import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import { YouTubeFacade } from "./YouTubeFacade";

describe("YouTubeFacade", () => {
  it("shows the video thumbnail before activation", () => {
    render(<YouTubeFacade videoId="OPf0YbXqDm0" onActivate={() => {}} />);
    const img = screen.getByRole("img", { name: /video thumbnail/i }) as HTMLImageElement;
    expect(img.src).toContain("OPf0YbXqDm0");
  });

  it("calls onActivate when the play button is clicked", () => {
    const onActivate = vi.fn();
    render(<YouTubeFacade videoId="OPf0YbXqDm0" onActivate={onActivate} />);
    fireEvent.click(screen.getByRole("button", { name: /play/i }));
    expect(onActivate).toHaveBeenCalledOnce();
  });
});
