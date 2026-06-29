import "@testing-library/jest-dom/vitest";

// jsdom lacks Pointer Capture; stub it so pointer-driven components don't throw.
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}
