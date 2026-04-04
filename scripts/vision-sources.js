// Vision preset definitions for token-lightsource module
// Compatible with FoundryVTT v10+ sight API

/**
 * Vision preset definitions.
 * Uses the FoundryVTT v10+ token sight document fields.
 * Note: "devilsSight" visionMode requires D&D 5e or a system that defines it.
 */
export const VISION_PRESETS = {
  none: {
    label: "TOKEN_LIGHTSOURCE.VISION.none",
    icon: "fas fa-eye-slash",
    sight: {
      enabled: false,
      range: 0,
      visionMode: "basic"
    }
  },
  basic: {
    label: "TOKEN_LIGHTSOURCE.VISION.basic",
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 0,
      visionMode: "basic"
    }
  },
  darkvision30: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision30",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 30,
      visionMode: "darkvision"
    }
  },
  darkvision60: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision60",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 60,
      visionMode: "darkvision"
    }
  },
  darkvision120: {
    label: "TOKEN_LIGHTSOURCE.VISION.darkvision120",
    icon: "fas fa-moon",
    sight: {
      enabled: true,
      range: 120,
      visionMode: "darkvision"
    }
  },
  devilsSight: {
    label: "TOKEN_LIGHTSOURCE.VISION.devilsSight",
    icon: "fas fa-eye",
    sight: {
      enabled: true,
      range: 120,
      visionMode: "devilsSight"
    }
  }
};

/**
 * Returns true if the token currently has vision enabled.
 */
export function tokenHasVision(token) {
  return token.document.sight?.enabled === true;
}

/**
 * Gets the key of the currently active vision preset, or "none".
 */
export function getCurrentVisionPresetKey(token) {
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
  return "custom";
}

/**
 * Applies a vision preset to a token using the FoundryVTT v10+ document update API.
 * @param {Token} token - The token placeable object
 * @param {string} presetKey - Key from VISION_PRESETS
 */
export async function applyVisionPreset(token, presetKey) {
  const preset = VISION_PRESETS[presetKey];
  if (!preset) {
    console.warn(`token-lightsource | Unknown vision preset: ${presetKey}`);
    return;
  }

  if (!token.document.canUserModify(game.user, "update")) {
    ui.notifications.warn(game.i18n.localize("TOKEN_LIGHTSOURCE.WARN.noPermission"));
    return;
  }

  await token.document.update({
    "sight.enabled": preset.sight.enabled,
    "sight.range": preset.sight.range,
    "sight.visionMode": preset.sight.visionMode
  });
}
