import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// `react()` is typed against a different bundled Vite copy than Vitest's config
// (Astro/rolldown-vite vs. Vitest's vite), so its Plugin type is structurally
// incompatible here. This is a types-only mismatch — the plugin works correctly
// (JSX tests pass) — so we cast to silence it.
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [react() as any],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
