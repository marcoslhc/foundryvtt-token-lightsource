<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-04 | Updated: 2026-04-04 -->

# lang/

## Purpose

Localization string tables for the token-lightsource module. FoundryVTT loads these JSON files and makes the strings available via `game.i18n.localize(key)`.

## Key Files

| File      | Description                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `en.json` | English strings for all HUD tooltips, dialog titles, settings names/hints, preset labels, and warning messages |

## For AI Agents

### Working In This Directory

- Every user-visible string in `scripts/` must have a corresponding key here. Never hardcode display text in JS.
- Key naming convention: `TOKEN_LIGHTSOURCE.<CATEGORY>.<name>` — e.g., `TOKEN_LIGHTSOURCE.PRESET.torch`, `TOKEN_LIGHTSOURCE.SETTING.gmOnly.name`.
- When adding a new preset in `light-sources.js` or `vision-sources.js`, add its label key here simultaneously.
- To add a new language, create `<lang-code>.json` alongside `en.json` and register it in `module.json` under the `languages` array.

### Key Namespaces

| Prefix                              | Usage                          |
| ----------------------------------- | ------------------------------ |
| `TOKEN_LIGHTSOURCE.HUD.*`           | Button tooltip strings         |
| `TOKEN_LIGHTSOURCE.PRESET.*`        | Light preset display names     |
| `TOKEN_LIGHTSOURCE.VISION.*`        | Vision preset display names    |
| `TOKEN_LIGHTSOURCE.DIALOG.*`        | Light picker dialog strings    |
| `TOKEN_LIGHTSOURCE.VISION_DIALOG.*` | Vision picker dialog strings   |
| `TOKEN_LIGHTSOURCE.SETTING.*`       | Settings panel names and hints |
| `TOKEN_LIGHTSOURCE.WARN.*`          | Warning notification messages  |

## Dependencies

### Internal

- Consumed by `scripts/main.js`, `scripts/light-sources.js`, `scripts/vision-sources.js` via `game.i18n.localize()`

<!-- MANUAL: -->
