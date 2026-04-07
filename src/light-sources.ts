import { LightSourceData, TokenLightSource } from "./token_light_source";
import { AnimationOptions, AnimationType } from "./token_light_animation";
// Light source presets and manager for token-lightsource module

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
] as const;

export type PresetKeys = `${(typeof PresetNames)[number]}`;

export const LIGHT_PRESETS: Record<PresetKeys, LightPreset> = {
  none: {
    label: "TOKEN_LIGHTSOURCE.PRESET.none",
    icon: "fas fa-times",
    light: TokenLightSource.fromData({
      dim: 0,
      bright: 0,
      color: null,
      alpha: 0.5,
      angle: 360,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    }),
  },
  candle: {
    label: "TOKEN_LIGHTSOURCE.PRESET.candle",
    icon: "fas fa-fire",
    light: TokenLightSource.fromData({
      dim: 10,
      bright: 0.5,
      attenuation: 1,
      color: Color.fromString("#ff9329"),
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.TORCH, speed: 2, intensity: 2 },
    }),
  },
  torch: {
    label: "TOKEN_LIGHTSOURCE.PRESET.torch",
    icon: "fas fa-fire",
    light: TokenLightSource.fromData({
      dim: 40,
      bright: 0.7,
      attenuation: 1,
      color: Color.fromString("#f8c377"),
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.FLAME, speed: 3, intensity: 4 },
    }),
  },
  lantern: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lantern",
    icon: "fas fa-lightbulb",
    light: TokenLightSource.fromData({
      dim: 60,
      bright: 0.7,
      attenuation: 1,
      color: Color.fromString("#ffd27d"),
      alpha: 0.4,
      angle: 360,
      animation: { type: AnimationType.PULSE, speed: 2, intensity: 2 },
    }),
  },
  bullseye: {
    label: "TOKEN_LIGHTSOURCE.PRESET.bullseye",
    icon: "fas fa-dot-circle",
    light: TokenLightSource.fromData({
      dim: 120,
      bright: 1,
      attenuation: 0,
      color: Color.fromString("#ffeedd"),
      alpha: 0.5,
      angle: 52,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    }),
  },
  dancingLights: {
    label: "TOKEN_LIGHTSOURCE.PRESET.dancingLights",
    icon: "fas fa-magic",
    light: TokenLightSource.fromData({
      dim: 20,
      bright: 0.7,
      attenuation: 1,
      color: Color.fromString("#7ecbff"),
      alpha: 0.35,
      angle: 360,
      animation: { type: AnimationType.FAIRY, speed: 3, intensity: 3 },
    }),
  },
  lightSpell: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lightSpell",
    icon: "fas fa-star",
    light: TokenLightSource.fromData({
      dim: 40,
      bright: 0.5,
      attenuation: 1,
      color: Color.fromString("#fffae0"),
      alpha: 0.45,
      angle: 360,
      animation: { type: AnimationType.PULSE, speed: 3, intensity: 2 },
    }),
  },
  daylight: {
    label: "TOKEN_LIGHTSOURCE.PRESET.daylight",
    icon: "fas fa-sun",
    light: TokenLightSource.fromData({
      dim: 60,
      bright: 1,
      attenuation: 0,
      color: Color.fromString("#ffffff"),
      alpha: 0.5,
      angle: 360,
      animation: { type: AnimationType.NONE, speed: 5, intensity: 5 },
    }),
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
export function tokenHasLight(token: Token.Implementation): boolean {
  const light = token.document.light;
  return light.dim > 0 || light.bright > 0;
}

/**
 * Gets the key of the currently active preset on a token, or "none".
 */
export function getCurrentPresetKey(token: Token.Implementation): PresetKeys {
  const light = TokenLightSource.fromData(
    token.document.light as LightSourceData & { animation: AnimationOptions },
  );
  for (const [k, v] of Object.entries(LIGHT_PRESETS)) {
    const key = k as PresetKeys;
    const preset = v as LightPreset;
    if (key === "none") continue;
    if (light.isEqual(preset.light)) return key;
  }
  if (!tokenHasLight(token)) return "none";
  return "none";
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
  token: Token.Implementation,
  presetKey: PresetKeys,
): Promise<void> {
  const preset = LIGHT_PRESETS[presetKey];
  if (!preset) {
    console.warn(`token-lightsource | Unknown preset: ${presetKey}`);
    return;
  }

  // Check if user has permission to update this token
  if (
    !token.document.canUserModify(
      game.user as User.Internal.Implementation,
      "update",
    )
  ) {
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

  await token.document.update(
    updateData as unknown as TokenDocument.UpdateData,
  );
}
