/**
 * Token Light Source - Main Module
 * Adds a light source toggle button to the Token HUD.
 * Compatible with FoundryVTT v13+
 */

import {
  LIGHT_PRESETS,
  tokenHasLight,
  getCurrentPresetKey,
  getNextPresetKey,
  applyLightPreset
} from "./light-sources.js";

import {
  VISION_PRESETS,
  tokenHasVision,
  getCurrentVisionPresetKey,
  applyVisionPreset
} from "./vision-sources.js";

const MODULE_ID = "token-lightsource";

// ─── Settings Registration ───────────────────────────────────────────────────

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing Token Light Source module`);

  game.settings.register(MODULE_ID, "defaultPreset", {
    name: "TOKEN_LIGHTSOURCE.SETTING.defaultPreset.name",
    hint: "TOKEN_LIGHTSOURCE.SETTING.defaultPreset.hint",
    scope: "world",
    config: true,
    type: String,
    choices: Object.fromEntries(
      Object.entries(LIGHT_PRESETS)
        .filter(([k]) => k !== "none")
        .map(([k, v]) => [k, v.label])
    ),
    default: "torch"
  });

  game.settings.register(MODULE_ID, "gmOnly", {
    name: "TOKEN_LIGHTSOURCE.SETTING.gmOnly.name",
    hint: "TOKEN_LIGHTSOURCE.SETTING.gmOnly.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

// ─── Token HUD Hook ──────────────────────────────────────────────────────────

Hooks.on("renderTokenHUD", (hud, html, data) => {
  const token = hud.token ?? hud.object;
  if (!token) return;

  const gmOnly = game.settings.get(MODULE_ID, "gmOnly");
  if (gmOnly && !game.user.isGM) return;

  if (!token.document.canUserModify(game.user, "update")) return;

  // ─── Light button ─────────────────────────────────────────────────────────
  const hasLight = tokenHasLight(token);
  const currentKey = getCurrentPresetKey(token);

  const button = document.createElement("div");
  button.className = `control-icon tls-toggle${hasLight ? " active" : ""}`;
  button.title = game.i18n.localize("TOKEN_LIGHTSOURCE.HUD.toggle");
  button.dataset.preset = currentKey;
  // Icon markup is a hardcoded string — not user input
  button.innerHTML = `<i class="fas fa-fire"></i>`;

  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const cur = getCurrentPresetKey(token);
    const next = cur === "none"
      ? game.settings.get(MODULE_ID, "defaultPreset")
      : getNextPresetKey(cur);
    await applyLightPreset(token, next);
    hud.render();
  });

  button.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await showPresetDialog(token, hud);
  });

  // ─── Vision button ────────────────────────────────────────────────────────
  const hasVision = tokenHasVision(token);
  const currentVisionKey = getCurrentVisionPresetKey(token);

  const visionButton = document.createElement("div");
  visionButton.className = `control-icon tls-vision-toggle${hasVision ? " active" : ""}`;
  visionButton.title = game.i18n.localize("TOKEN_LIGHTSOURCE.HUD.toggleVision");
  visionButton.dataset.vision = currentVisionKey;
  visionButton.innerHTML = `<i class="fas fa-eye"></i>`;

  visionButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const cur = getCurrentVisionPresetKey(token);
    const next = cur === "none" ? "basic" : "none";
    await applyVisionPreset(token, next);
    hud.render();
  });

  visionButton.addEventListener("contextmenu", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await showVisionDialog(token, hud);
  });

  html.querySelector(".col.right").prepend(visionButton);
  html.querySelector(".col.right").prepend(button);
});

// ─── Preset Picker Dialogs ───────────────────────────────────────────────────

async function showPresetDialog(token, hud) {
  const currentKey = getCurrentPresetKey(token);

  await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize("TOKEN_LIGHTSOURCE.DIALOG.title") },
    rejectClose: false,
    buttons: Object.entries(LIGHT_PRESETS).map(([key, preset]) => ({
      action: key,
      icon: `<i class="${preset.icon}"></i>`,
      label: game.i18n.localize(preset.label),
      class: key === currentKey ? "active" : "",
      callback: async () => {
        await applyLightPreset(token, key);
        hud.render();
      }
    }))
  });
}

async function showVisionDialog(token, hud) {
  const currentKey = getCurrentVisionPresetKey(token);

  await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize("TOKEN_LIGHTSOURCE.VISION_DIALOG.title") },
    rejectClose: false,
    buttons: Object.entries(VISION_PRESETS).map(([key, preset]) => ({
      action: key,
      icon: `<i class="${preset.icon}"></i>`,
      label: game.i18n.localize(preset.label),
      class: key === currentKey ? "active" : "",
      callback: async () => {
        await applyVisionPreset(token, key);
        hud.render();
      }
    }))
  });
}
