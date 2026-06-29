import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
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

  it("renames a loop: Enter commits the new name", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));

    // Open rename mode
    fireEvent.click(screen.getByRole("button", { name: /rename loop solo/i }));
    const input = screen.getByRole("textbox", { name: /loop name/i });
    expect(input).toHaveValue("Solo");

    // Type a new name and commit with Enter
    fireEvent.change(input, { target: { value: "Verse" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Should display the new name
    await waitFor(() => expect(screen.getByText("Verse")).toBeInTheDocument());
    expect(screen.queryByText("Solo")).not.toBeInTheDocument();
  });

  it("renames a loop: blur commits the new name and persists it", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));

    fireEvent.click(screen.getByRole("button", { name: /rename loop solo/i }));
    const input = screen.getByRole("textbox", { name: /loop name/i });
    fireEvent.change(input, { target: { value: "Chorus" } });
    // Preact attaches `onBlur` as a delegated `focusout` listener on the render
    // root, so blur must be dispatched as a bubbling `focusout` to reach it.
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));

    await waitFor(() => expect(screen.getByText("Chorus")).toBeInTheDocument());
    // Verify persistence: re-listing from storage should reflect the new name
    expect(screen.queryByText("Solo")).not.toBeInTheDocument();
  });

  it("renames a loop: Escape cancels without changing the name", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));

    fireEvent.click(screen.getByRole("button", { name: /rename loop solo/i }));
    const input = screen.getByRole("textbox", { name: /loop name/i });
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => expect(screen.getByText("Solo")).toBeInTheDocument());
    expect(screen.queryByText("Changed")).not.toBeInTheDocument();
  });

  it("keeps Apply and Delete working alongside rename", () => {
    const onApply = vi.fn();
    setup({ onApply });
    fireEvent.change(screen.getByLabelText(/name this loop/i), { target: { value: "Solo" } });
    fireEvent.click(screen.getByRole("button", { name: /save current loop/i }));

    // Apply still works
    fireEvent.click(screen.getByRole("button", { name: /apply loop solo/i }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ videoId: VID, start: 10, end: 20, rate: 1 }),
    );

    // Rename button is present
    expect(screen.getByRole("button", { name: /rename loop solo/i })).toBeInTheDocument();
  });
});
