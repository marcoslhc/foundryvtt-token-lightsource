// Vision preset definitions for token-lightsource module
// Compatible with FoundryVTT v13+

/**
 * Vision preset definitions.
 * Uses the FoundryVTT v10+ token sight document fields.
 * Note: "devilsSight" visionMode requires D&D 5e or a system that defines it.
 */

interface VisionPreset {
  label: string;
  icon: string;
  sight: {
    enabled: boolean;
    range: number;
    visionMode: string;
  };
}

export const VISION_PRESETS: Record<string, VisionPreset> = {
  none: {
    label: "TOKEN_LIGHTSOURCE.VISION.none",
    icon: "fas fa-eye-slash",
    sight: {
      enabled: false,
      range: 0,
      visionMode: "basic",
    },
  },
  basic: {
    label: "TOKEN_LIGHTSOURCE.VISION.basic",
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 0,
      visionMode: "basic",
    },
  },
  darkvision30: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision30",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 30,
      visionMode: "darkvision",
    },
  },
  darkvision60: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision60",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 60,
      visionMode: "darkvision",
    },
  },
  darkvision120: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision120",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 120,
      visionMode: "darkvision",
    },
  },
  devilsSight: {
    label: "TOKEN_LIGHTSOURCE.VISION.devilsSight",
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 120,
      visionMode: "devilsSight",
    },
  },
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

  const updateData: Record<string, unknown> = {
    "sight.enabled": preset.sight.enabled,
    "sight.range": preset.sight.range,
    "sight.visionMode": preset.sight.visionMode,
  };
  await token.document.update(updateData);
}
