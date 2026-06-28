import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// lucide-react's package.json sets `main` to a CommonJS build and only exposes
// the ESM build via `module`. Vitest resolves to the CJS entry, whose
// `require("react")` is loaded as a separate preact/compat instance from the
// ESM one the test renderer uses — two preact instances break preact's hook
// context lookup ("Cannot read properties of undefined (reading 'context')").
// Pin lucide-react to its ESM build so its `react` import flows through the same
// module graph and the `react -> preact/compat` alias below resolves to one
// shared instance.
const lucideEsm = require.resolve("lucide-react/dist/esm/lucide-react.mjs");

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [preact() as any],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
      "lucide-react": lucideEsm,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
