import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/", ".astro/", ".wrangler/", "node_modules/", ".design-lab/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // react-hooks v7 ships proper flat configs under configs.flat
  reactHooks.configs.flat["recommended-latest"],
  // jsx-a11y ships flat configs under flatConfigs
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
  },
  prettier,
);
