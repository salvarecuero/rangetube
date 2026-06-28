import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import type { StorageLike } from "../lib/loops/types";
import { SavedLoops } from "./SavedLoops";

function memStorage(): StorageLike {
  const map = new Map<string, string>();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
}

const VID = "dQw4w9WgXcQ";
let store: StorageLike;
beforeEach(() => {
  store = memStorage();
});

function setup(over = {}) {
  return render(
    <SavedLoops
      videoId={VID}
      current={{ videoId: VID, start: 10, end: 20, rate: 1 }}
      onApply={() => {}}
      storage={store}
      format={(s: number) => `${s}s`}
      {...over}
    />,
  );
}

describe("SavedLoops", () => {
  it("shows an empty hint when nothing is saved", () => {
    setup();
    expect(screen.getByText(/no saved loops/i)).toBeInTheDocument();
  });

  it("saves the current loop with a typed name and lists it", () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));
    expect(screen.getByText("Solo")).toBeInTheDocument();
  });

  it("applies a saved loop", () => {
    const onApply = vi.fn();
    setup({ onApply });
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));
    fireEvent.click(screen.getByRole("button", { name: /apply loop solo/i }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ videoId: VID, start: 10, end: 20, rate: 1 }),
    );
  });

  it("deletes a saved loop", () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete loop solo/i }));
    expect(screen.queryByText("Solo")).not.toBeInTheDocument();
  });
});
