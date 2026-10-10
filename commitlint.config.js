export default {
  extends: ["@commitlint/config-conventional"],
  // `npm version` / `pnpm version` creates commits whose message is just the
  // version number (e.g. "1.2.2"), which is not a conventional commit.
  ignores: [(message) => /^v?\d+\.\d+\.\d+(-[\w.]+)?\s*$/.test(message)],
};
