// Vision preset definitions for token-lightsource module
// Compatible with FoundryVTT v13+

/**
 * Vision preset definitions.
 * Uses the FoundryVTT v10+ token sight document fields.
 * Note: "devilsSight" visionMode requires D&D 5e or a system that defines it.
 */

enum VISION_PRESET_LABELS {
  NONE = "TOKEN_LIGHTSOURCE.VISION.none",
  BASIC = "TOKEN_LIGHTSOURCE.VISION.basic",
  DARKVISION30 = "TOKEN_LIGHTSOURCE.VISION.darkvision30",
  DARKVISION60 = "TOKEN_LIGHTSOURCE.VISION.darkvision60",
  DARKVISION120 = "TOKEN_LIGHTSOURCE.VISION.darkvision120",
  DEVILS_SIGHT = "TOKEN_LIGHTSOURCE.VISION.devilsSight",
}

enum VISION_MODES {
  BASIC = "basic",
  DARKVISION = "darkvision",
  DEVILS_SIGHT = "devilsSight",
}

interface SightPreset {
  enabled: boolean;
  range: number;
  visionMode: VISION_MODES;
}

interface VisionPreset {
  label: VISION_PRESET_LABELS;
  icon: string;
  sight: SightPreset;
}

class SightPresetImplementation implements SightPreset {
  enabled: boolean;
  range: number;
  visionMode: VISION_MODES;

  constructor(enabled: boolean, range: number, visionMode: VISION_MODES) {
    this.enabled = enabled;
    this.range = range;
    this.visionMode = visionMode;
  }

  static fromData(data: SightPreset): SightPresetImplementation {
    if (data instanceof SightPresetImplementation) return data;
    return new SightPresetImplementation(
      data.enabled,
      data.range,
      data.visionMode,
    );
  }
}

class VisionPresetImplementation implements VisionPreset {
  label: VISION_PRESET_LABELS;
  icon: string;
  sight: SightPreset;

  constructor(
    label: VISION_PRESET_LABELS,
    icon: string,
    sight: VisionPreset["sight"],
  ) {
    this.label = label;
    this.icon = icon;
    this.sight = sight;
  }

  static fromData(data: VisionPreset): VisionPresetImplementation {
    if (data instanceof VisionPresetImplementation) return data;
    return new VisionPresetImplementation(
      data.label,
      data.icon,
      SightPresetImplementation.fromData(data.sight),
    );
  }
}

export const VISION_PRESETS: Record<string, VisionPreset> = {
  none: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.NONE,
    icon: "fas fa-eye-slash",
    sight: {
      enabled: false,
      range: 0,
      visionMode: VISION_MODES.BASIC,
    },
  }),
  basic: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.BASIC,
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 0,
      visionMode: VISION_MODES.BASIC,
    },
  }),
  darkvision30: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.DARKVISION30,
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 30,
      visionMode: VISION_MODES.DARKVISION,
    },
  }),
  darkvision60: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.DARKVISION60,
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 60,
      visionMode: VISION_MODES.DARKVISION,
    },
  }),
  darkvision120: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.DARKVISION120,
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 120,
      visionMode: VISION_MODES.DARKVISION,
    },
  }),
  devilsSight: VisionPresetImplementation.fromData({
    label: VISION_PRESET_LABELS.DEVILS_SIGHT,
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 120,
      visionMode: VISION_MODES.DEVILS_SIGHT,
    },
  }),
};

/**
 * Returns true if the token currently has vision enabled.
 */
export function tokenHasVision(token: Token.Implementation): boolean {
  return token.document.sight?.enabled === true;
}

/**
 * Gets the key of the currently active vision preset, or "none".
 */
export function getCurrentVisionPresetKey(token: Token.Implementation): string {
  const sight = token.document.sight;
  if (!sight?.enabled) return "none";
  for (const [key, preset] of Object.entries(VISION_PRESETS)) {
    if (key === "none" || key === "basic") continue;
    if (
      sight.visionMode === preset.sight.visionMode &&
      sight.range === preset.sight.range
    ) {
      return key;
    }
  }
  if (sight.enabled && sight.range === 0) return "basic";
  return "basic";
}

/**
 * Applies a vision preset to a token.
 * @param token - The token placeable object
 * @param presetKey - Key from VISION_PRESETS
 */
export async function applyVisionPreset(
  token: Token.Implementation,
  presetKey: string,
): Promise<void> {
  const preset = VISION_PRESETS[presetKey];
  if (!preset) {
    console.warn(`token-lightsource | Unknown vision preset: ${presetKey}`);
    return;
  }

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

  const updatedData: Record<string, unknown> = {
    "sight.enabled": preset.sight.enabled,
    "sight.range": preset.sight.range,
    "sight.visionMode": preset.sight.visionMode,
  };
  await token.document.update(updatedData);
}
