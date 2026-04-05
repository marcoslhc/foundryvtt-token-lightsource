// Augments the LFD SettingConfig interface so game.settings.register/get
// accept "token-lightsource" as a valid namespace.
declare global {
  interface SettingConfig {
    "token-lightsource.defaultPreset": string;
    "token-lightsource.gmOnly": boolean;
  }
}

export {};
