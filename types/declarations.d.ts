// Augments the LFD SettingConfig interface so game.settings.register/get
// accept "token-lightsource" as a valid namespace.
// Foundry runtime globals (game, ui, Hooks, foundry, Color, ...) are declared by
// @league-of-foundry-developers/foundry-vtt-types — don't redeclare them here.
declare global {
  interface SettingConfig {
    "token-lightsource.defaultPreset": string;
    "token-lightsource.gmOnly": boolean;
  }
}

export {};
