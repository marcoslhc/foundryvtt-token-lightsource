// Light source presets and manager for token-lightsource module

interface LightSourceData {
  alpha: number;
  bright: number;
  color: string | null;
  angle: number;
  dim: number;

  // advanced
  coloration?: number;
  contrast?: number;
  attenuation?: number;
  luminosity?: number;
  saturation?: number;
  shadows?: number;
  vision?: boolean;
  priority?: number;
  rotation?: number;
  walls?: boolean;
}

interface AnimationOptions {
  type: AnimationType;
  speed: number;
  intensity: number;
  reverse?: boolean | null;
}

export enum AnimationType {
  NONE = "",
  FLAME = "flame",
  TORCH = "torch",
  REVOLVING = "revolving",
  SIREN = "siren",
  PULSE = "pulse",
  REACTIVE_PULSE = "reactivepulse",
  CHROMA = "chroma",
  WAVE = "wave",
  FOG = "fog",
  SUNBURST = "sunburst",
  DOME = "dome",
  EMANATION = "emanation",
  HEXA = "hexa",
  GHOST = "ghost",
  ENERGY = "energy",
  VORTEX = "vortex",
  WITCHWAVE = "witchwave",
  RAINBOW_SWIRL = "rainbowswirl",
  RADIAL_RAINBOW = "radialrainbow",
  FAIRY = "fairy",
  GRID = "grid",
  STARLIGHT = "starlight",
  SMOKEPATCH = "smokepatch",
}

/**
 * Light source preset definitions.
 * Each preset defines the light properties to apply to a token.
 * Compatible with FoundryVTT v13+
 */

export interface LightPreset {
  label: string;
  icon: string;
  light: LightSourceData & { animation: AnimationOptions };
}

export const PresetNames = [
  "none",
  "candle",
  "torch",
  "lantern",
  "bullseye",
  "dancingLights",
  "lightSpell",
  "daylight",
  "custom",
] as const;

export type PresetKeys = `${(typeof PresetNames)[number]}`;

export const LIGHT_PRESETS: Record<PresetKeys, LightPreset> = {
  none: {
    label: "TOKEN_LIGHTSOURCE.PRESET.none",
    icon: "fas fa-times",
    light: {
      dim: 0,
      bright: 0,
      color: null,
      alpha: 0.5,
      angle: 360,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    },
  },
  candle: {
    label: "TOKEN_LIGHTSOURCE.PRESET.candle",
    icon: "fas fa-fire",
    light: {
      dim: 10,
      bright: 0.5,
      attenuation: 1,
      color: "#ff9329",
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.TORCH, speed: 2, intensity: 2 },
    },
  },
  torch: {
    label: "TOKEN_LIGHTSOURCE.PRESET.torch",
    icon: "fas fa-fire",
    light: {
      dim: 40,
      bright: 0.7,
      attenuation: 1,
      color: "#f8c377",
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.FLAME, speed: 3, intensity: 4 },
    },
  },
  lantern: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lantern",
    icon: "fas fa-lightbulb",
    light: {
      dim: 60,
      bright: 0.7,
      attenuation: 1,
      color: "#ffd27d",
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.PULSE, speed: 2, intensity: 2 },
    },
  },
  bullseye: {
    label: "TOKEN_LIGHTSOURCE.PRESET.bullseye",
    icon: "fas fa-dot-circle",
    light: {
      dim: 120,
      bright: 1,
      attenuation: 0,
      color: "#ffeedd",
      alpha: 0.5,
      angle: 52,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    },
  },
  dancingLights: {
    label: "TOKEN_LIGHTSOURCE.PRESET.dancingLights",
    icon: "fas fa-magic",
    light: {
      dim: 20,
      bright: 0.7,
      attenuation: 1,
      color: "#7ecbff",
      alpha: 0.35,
      angle: 360,
      animation: { type: AnimationType.FAIRY, speed: 3, intensity: 3 },
    },
  },
  lightSpell: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lightSpell",
    icon: "fas fa-star",
    light: {
      dim: 40,
      bright: 0.5,
      attenuation: 1,
      color: "#fffae0",
      alpha: 0.45,
      angle: 360,
      animation: { type: AnimationType.PULSE, speed: 3, intensity: 2 },
    },
  },
  daylight: {
    label: "TOKEN_LIGHTSOURCE.PRESET.daylight",
    icon: "fas fa-sun",
    light: {
      dim: 60,
      bright: 1,
      attenuation: 0,
      color: "#ffffff",
      alpha: 0.5,
      angle: 360,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    },
  },
  custom: {
    label: "TOKEN_LIGHTSOURCE.PRESET.custom",
    icon: "fas fa-star",
    light: {
      dim: 0,
      bright: 0,
      color: null,
      alpha: 0.5,
      angle: 360,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    },
  },
};

// Ordered cycle for left-click toggling (excludes "none" — turning on is handled via defaultPreset)
export const PRESET_CYCLE: PresetKeys[] = [
  "candle",
  "torch",
  "lantern",
  "none",
] as const;

/**
 * Determines if a token currently has any light enabled.
 */
export function tokenHasLight(token: Token): boolean {
  const light = token.document.light;
  return light.dim > 0 || light.bright > 0;
}

/**
 * Gets the key of the currently active preset on a token, or "none".
 */
export function getCurrentPresetKey(token: Token): PresetKeys {
  const light = token.document.light;
  for (const [key, preset] of Object.entries(LIGHT_PRESETS)) {
    if (key === "none") continue;
    if (
      light.dim === preset.light.dim &&
      light.bright === preset.light.bright
    ) {
      return key as PresetKeys;
    }
  }
  if (!tokenHasLight(token)) return "none";
  return "custom";
}

/**
 * Gets the next preset key in the cycle after the current one.
 */
export function getNextPresetKey(currentKey: PresetKeys): PresetKeys {
  const idx = PRESET_CYCLE.indexOf(currentKey);
  if (idx === -1) return "none";
  return PRESET_CYCLE[(idx + 1) % PRESET_CYCLE.length];
}

/**
 * Applies a preset to a token.
 * @param token - The token placeable object
 * @param presetKey - Key from LIGHT_PRESETS
 */
export async function applyLightPreset(
  token: Token,
  presetKey: PresetKeys,
): Promise<void> {
  const preset = LIGHT_PRESETS[presetKey];
  if (!preset) {
    console.warn(`token-lightsource | Unknown preset: ${presetKey}`);
    return;
  }

  // Check if user has permission to update this token
  if (!token.document.canUserModify(game.user!, "update")) {
    ui?.notifications?.warn(
      game.i18n?.localize("TOKEN_LIGHTSOURCE.WARN.noPermission") ?? "",
    );
    return;
  }

  const light = preset.light;
  const updateData = {
    light: {
      alpha: light.alpha,
      bright: light.bright,
      color: light.color,
      angle: light.angle,
      dim: light.dim,
      animation: { ...light.animation },
      ...(light.coloration !== undefined
        ? { coloration: light.coloration }
        : {}),
      ...(light.contrast !== undefined ? { contrast: light.contrast } : {}),
      ...(light.attenuation !== undefined
        ? { attenuation: light.attenuation }
        : {}),
      ...(light.luminosity !== undefined
        ? { luminosity: light.luminosity }
        : {}),
      ...(light.saturation !== undefined
        ? { saturation: light.saturation }
        : {}),
      ...(light.shadows !== undefined
        ? { shadows: Number(light.shadows) }
        : {}),
      ...(light.vision !== undefined ? { vision: light.vision } : {}),
      ...(light.priority !== undefined ? { priority: light.priority } : {}),
      ...(light.rotation !== undefined ? { rotation: light.rotation } : {}),
      ...(light.walls !== undefined ? { walls: light.walls } : {}),
    },
  };

  await token.document.update(updateData);
}
