import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig(
  globalIgnores(["dist/", "coverage/", "node_modules/"]),
  {
    // Foundry globals (game, ui, Hooks, Color, ...) are typed by fvtt-types and
    // types/declarations.d.ts; typescript-eslint disables no-undef for .ts files
    // so the TypeScript compiler is the single source of truth for them.
    files: ["**/*.{js,ts}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
  },
);
