/**
 * Token Light Source - Main Module
 * Adds a light source toggle button to the Token HUD.
 * Compatible with FoundryVTT v10/v11/v12
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

  // Respect GM-only setting
  const gmOnly = game.settings.get(MODULE_ID, "gmOnly");
  if (gmOnly && !game.user.isGM) return;

  // Check basic update permission
  if (!token.document.canUserModify(game.user, "update")) return;

  const hasLight = tokenHasLight(token);
  const currentKey = getCurrentPresetKey(token);

  // Build the HUD button
  const button = $(`
    <div class="control-icon tls-toggle ${hasLight ? "active" : ""}"
         title="${game.i18n.localize("TOKEN_LIGHTSOURCE.HUD.toggle")}"
         data-preset="${currentKey}">
      <i class="fas fa-fire"></i>
    </div>
  `);

  // Left-click: cycle to next preset (respects defaultPreset when turning on from off)
  button.on("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const cur = getCurrentPresetKey(token);
    let next;
    if (cur === "none") {
      next = game.settings.get(MODULE_ID, "defaultPreset");
    } else {
      next = getNextPresetKey(cur);
    }
    await applyLightPreset(token, next);
    hud.render();
  });

  // Right-click: show preset picker dialog
  button.on("contextmenu", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await showPresetDialog(token, hud);
  });

  // ─── Vision button ──────────────────────────────────────────────────────────
  const hasVision = tokenHasVision(token);
  const currentVisionKey = getCurrentVisionPresetKey(token);

  const visionButton = $(`
    <div class="control-icon tls-vision-toggle ${hasVision ? "active" : ""}"
         title="${game.i18n.localize("TOKEN_LIGHTSOURCE.HUD.toggleVision")}"
         data-vision="${currentVisionKey}">
      <i class="fas fa-eye"></i>
    </div>
  `);

  // Left-click: toggle vision on (basic) / off
  visionButton.on("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const cur = getCurrentVisionPresetKey(token);
    const next = cur === "none" ? "basic" : "none";
    await applyVisionPreset(token, next);
    hud.render();
  });

  // Right-click: show vision picker dialog
  visionButton.on("contextmenu", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await showVisionDialog(token, hud);
  });

  // Inject both buttons into the right column
  html.find(".col.right").prepend(visionButton);
  html.find(".col.right").prepend(button);
});

// ─── Preset Picker Dialog ────────────────────────────────────────────────────

async function showVisionDialog(token, hud) {
  const currentKey = getCurrentVisionPresetKey(token);

  const presetOptions = Object.entries(VISION_PRESETS)
    .map(([key, preset]) => `
      <div class="tls-preset-option ${key === currentKey ? "active" : ""}" data-key="${key}">
        <i class="${preset.icon}"></i>
        <span>${game.i18n.localize(preset.label)}</span>
        ${preset.sight.range > 0 ? `<small>${preset.sight.range} ft</small>` : ""}
      </div>
    `).join("");

  const content = `<div class="tls-preset-picker">${presetOptions}</div>`;

  let dialog;
  dialog = new Dialog({
    title: game.i18n.localize("TOKEN_LIGHTSOURCE.VISION_DIALOG.title"),
    content,
    buttons: {
      close: {
        label: game.i18n.localize("TOKEN_LIGHTSOURCE.DIALOG.close"),
        callback: () => {}
      }
    },
    render: (dialogHtml) => {
      dialogHtml.find(".tls-preset-option").on("click", async (event) => {
        const key = $(event.currentTarget).data("key");
        await applyVisionPreset(token, key);
        dialog.close();
        hud.render();
      });
    },
    default: "close"
  });
  dialog.render(true);
}

async function showPresetDialog(token, hud) {
  const currentKey = getCurrentPresetKey(token);

  const presetOptions = Object.entries(LIGHT_PRESETS)
    .map(([key, preset]) => `
      <div class="tls-preset-option ${key === currentKey ? "active" : ""}" data-key="${key}">
        <i class="${preset.icon}"></i>
        <span>${game.i18n.localize(preset.label)}</span>
        ${key !== "none" ? `<small>${LIGHT_PRESETS[key].light.bright}/${LIGHT_PRESETS[key].light.dim} ft</small>` : ""}
      </div>
    `).join("");

  const content = `<div class="tls-preset-picker">${presetOptions}</div>`;

  let dialog;
  dialog = new Dialog({
    title: game.i18n.localize("TOKEN_LIGHTSOURCE.DIALOG.title"),
    content,
    buttons: {
      close: {
        label: game.i18n.localize("TOKEN_LIGHTSOURCE.DIALOG.close"),
        callback: () => {}
      }
    },
    render: (dialogHtml) => {
      dialogHtml.find(".tls-preset-option").on("click", async (event) => {
        const key = $(event.currentTarget).data("key");
        await applyLightPreset(token, key);
        dialog.close();
        hud.render();
      });
    },
    default: "close"
  });
  dialog.render(true);
}
