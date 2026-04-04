// Light source presets and manager for token-lightsource module

/**
 * Light source preset definitions.
 * Each preset defines the light properties to apply to a token.
 * Compatible with FoundryVTT v10+ token.document.update() API.
 */
export const LIGHT_PRESETS = {
  none: {
    label: "TOKEN_LIGHTSOURCE.PRESET.none",
    icon: "fas fa-times",
    light: {
      dim: 0,
      bright: 0,
      color: null,
      alpha: 0.5,
      animation: { type: "", speed: 5, intensity: 5 }
    }
  },
  candle: {
    label: "TOKEN_LIGHTSOURCE.PRESET.candle",
    icon: "fas fa-fire",
    light: {
      dim: 10,
      bright: 5,
      color: "#ff9329",
      alpha: 0.4,
      animation: { type: "torch", speed: 2, intensity: 2 }
    }
  },
  torch: {
    label: "TOKEN_LIGHTSOURCE.PRESET.torch",
    icon: "fas fa-fire",
    light: {
      dim: 40,
      bright: 20,
      color: "#f8c377",
      alpha: 0.4,
      animation: { type: "torch", speed: 5, intensity: 5 }
    }
  },
  lantern: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lantern",
    icon: "fas fa-lightbulb",
    light: {
      dim: 60,
      bright: 30,
      color: "#ffd27d",
      alpha: 0.4,
      animation: { type: "pulse", speed: 2, intensity: 2 }
    }
  },
  bullseye: {
    label: "TOKEN_LIGHTSOURCE.PRESET.bullseye",
    icon: "fas fa-dot-circle",
    light: {
      dim: 120,
      bright: 60,
      color: "#ffeedd",
      alpha: 0.5,
      angle: 52,
      animation: { type: "", speed: 5, intensity: 5 }
    }
  },
  dancingLights: {
    label: "TOKEN_LIGHTSOURCE.PRESET.dancingLights",
    icon: "fas fa-magic",
    light: {
      dim: 20,
      bright: 10,
      color: "#7ecbff",
      alpha: 0.35,
      animation: { type: "pulse", speed: 3, intensity: 3 }
    }
  },
  lightSpell: {
    label: "TOKEN_LIGHTSOURCE.PRESET.lightSpell",
    icon: "fas fa-star",
    light: {
      dim: 40,
      bright: 20,
      color: "#fffae0",
      alpha: 0.45,
      animation: { type: "pulse", speed: 3, intensity: 2 }
    }
  },
  daylight: {
    label: "TOKEN_LIGHTSOURCE.PRESET.daylight",
    icon: "fas fa-sun",
    light: {
      dim: 60,
      bright: 60,
      color: "#ffffff",
      alpha: 0.5,
      animation: { type: "", speed: 5, intensity: 5 }
    }
  }
};

// Ordered cycle for left-click toggling
export const PRESET_CYCLE = ["none", "candle", "torch", "lantern", "none"];

/**
 * Determines if a token currently has any light enabled.
 */
export function tokenHasLight(token) {
  const light = token.document.light;
  return (light.dim > 0 || light.bright > 0);
}

/**
 * Gets the key of the currently active preset on a token, or "none".
 */
export function getCurrentPresetKey(token) {
  const light = token.document.light;
  for (const [key, preset] of Object.entries(LIGHT_PRESETS)) {
    if (key === "none") continue;
    if (
      light.dim === preset.light.dim &&
      light.bright === preset.light.bright
    ) {
      return key;
    }
  }
  if (!tokenHasLight(token)) return "none";
  return "custom";
}

/**
 * Gets the next preset key in the cycle after the current one.
 */
export function getNextPresetKey(currentKey) {
  const idx = PRESET_CYCLE.indexOf(currentKey);
  if (idx === -1) return "none";
  return PRESET_CYCLE[(idx + 1) % PRESET_CYCLE.length];
}

/**
 * Applies a preset to a token using the FoundryVTT v10+ document update API.
 * @param {Token} token - The token placeable object
 * @param {string} presetKey - Key from LIGHT_PRESETS
 */
export async function applyLightPreset(token, presetKey) {
  const preset = LIGHT_PRESETS[presetKey];
  if (!preset) {
    console.warn(`token-lightsource | Unknown preset: ${presetKey}`);
    return;
  }

  // Check if user has permission to update this token
  if (!token.document.canUserModify(game.user, "update")) {
    ui.notifications.warn(game.i18n.localize("TOKEN_LIGHTSOURCE.WARN.noPermission"));
    return;
  }

  const updateData = {
    "light.dim": preset.light.dim ?? 0,
    "light.bright": preset.light.bright ?? 0,
    "light.color": preset.light.color ?? null,
    "light.alpha": preset.light.alpha ?? 0.5,
    "light.animation": preset.light.animation ?? { type: "", speed: 5, intensity: 5 }
  };

  // Apply angle only if preset defines it
  if (preset.light.angle !== undefined) {
    updateData["light.angle"] = preset.light.angle;
  }

  await token.document.update(updateData);
}
