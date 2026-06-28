import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeField } from "./TimeField";

function field(over: Partial<React.ComponentProps<typeof TimeField>> = {}) {
  return (
    <TimeField
      label="A"
      ariaLabel="Loop start"
      seconds={10}
      min={0}
      max={100}
      format={(s: number) => String(s)}
      onCommit={() => {}}
      {...over}
    />
  );
}

describe("TimeField", () => {
  it("renders the formatted value in a named textbox", () => {
    render(field());
    const input = screen.getByRole("textbox", { name: /loop start/i }) as HTMLInputElement;
    expect(input.value).toBe("10");
  });

  it("commits the parsed seconds on Enter", () => {
    const onCommit = vi.fn();
    render(field({ onCommit }));
    const input = screen.getByRole("textbox", { name: /loop start/i });
    fireEvent.change(input, { target: { value: "0:30" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith(30);
  });

  it("commits on blur", () => {
    const onCommit = vi.fn();
    render(field({ onCommit }));
    const input = screen.getByRole("textbox", { name: /loop start/i });
    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith(42);
  });

  it("clamps a value above max", () => {
    const onCommit = vi.fn();
    render(field({ onCommit, max: 100 }));
    const input = screen.getByRole("textbox", { name: /loop start/i });
    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).toHaveBeenCalledWith(100);
  });

  it("reverts invalid input without committing", () => {
    const onCommit = vi.fn();
    render(field({ onCommit }));
    const input = screen.getByRole("textbox", { name: /loop start/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "nonsense" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onCommit).not.toHaveBeenCalled();
    expect(input.value).toBe("10");
  });

  it("reverts to the original value on Escape", () => {
    const onCommit = vi.fn();
    render(field({ onCommit }));
    const input = screen.getByRole("textbox", { name: /loop start/i }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "55" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(onCommit).not.toHaveBeenCalled();
    expect(input.value).toBe("10");
  });

  it("syncs the displayed value when the seconds prop changes", () => {
    const { rerender } = render(field({ seconds: 10 }));
    const input = screen.getByRole("textbox", { name: /loop start/i }) as HTMLInputElement;
    expect(input.value).toBe("10");
    rerender(field({ seconds: 25 }));
    expect(input.value).toBe("25");
  });
});
