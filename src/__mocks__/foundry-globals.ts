// Minimal FoundryVTT global stubs for Jest — only the fields read by pure functions.

(globalThis as Record<string, unknown>).Hooks = {
  once: () => {},
  on: () => {},
};

(globalThis as Record<string, unknown>).game = {
  user: { isGM: true },
  settings: { get: () => undefined, register: () => {} },
  i18n: { localize: (key: string) => key },
};

(globalThis as Record<string, unknown>).ui = {
  notifications: { warn: () => {} },
};

(globalThis as Record<string, unknown>).foundry = {
  applications: { api: { DialogV2: { wait: async () => {} } } },
};

(globalThis as Record<string, unknown>).Color = {
  fromString: (color: string) => ({ r: 0, g: 0, b: 0, a: 1 }),
};

declare namespace Token {
  type Implementation = {};
}
