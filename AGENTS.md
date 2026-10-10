<!-- Generated: 2026-04-04 | Updated: 2026-04-04 -->

# foundryvtt-token-lightsource

## Purpose

A FoundryVTT module (id: `token-lightsource`) that adds light source and vision toggle buttons to the Token HUD. Players and GMs can cycle through light presets (candle, torch, lantern, etc.) and vision presets (darkvision, basic, devil's sight) directly from the token context menu, without opening the token sheet.

## Key Files

| File          | Description                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `module.json` | FoundryVTT module manifest — declares id, version, entry scripts, styles, languages, and compatibility range (v10–v12) |
| `README.md`   | User-facing documentation                                                                                              |

## Subdirectories

| Directory  | Purpose                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------- |
| `scripts/` | ES module source — main hook wiring, light presets, vision presets (see `scripts/AGENTS.md`) |
| `styles/`  | CSS for HUD buttons and preset picker dialog (see `styles/AGENTS.md`)                        |
| `lang/`    | Localization string tables (see `lang/AGENTS.md`)                                            |

## For AI Agents

### Working In This Directory

- `module.json` is the authoritative source of truth for module metadata. Keep `id`, `esmodules`, `styles`, and `languages` in sync with actual file paths.
- The module targets FoundryVTT v13+. The v13+ document API (`token.document.update()`) is used throughout — do not use the pre-v10 `token.update()` form.
- There is no build step. Files are served directly; edits are immediately effective after reloading FoundryVTT.
- No `node_modules`, no bundler, no TypeScript. Plain ES modules only.

### Testing Requirements

- Load the module in a live FoundryVTT instance (v10–v12).
- Open a scene with at least one token, right-click to open the Token HUD, and verify the fire (🔥) and eye (👁) buttons appear in the right column.
- Test left-click (cycle preset) and right-click (open picker dialog) for both buttons.
- Test with `gmOnly` setting enabled — non-GM users should not see the buttons.

### Common Patterns

- All user-facing strings are localization keys (e.g., `"TOKEN_LIGHTSOURCE.HUD.toggle"`). Never hardcode display text.
- Permission checks use `token.document.canUserModify(game.user, "update")` before any document update.
- HUD is re-rendered after applying a preset via `hud.render()`.

## Dependencies

### External

- FoundryVTT v10+ global APIs: `Hooks`, `game`, `Dialog`, `ui.notifications`
- Font Awesome icons (bundled with FoundryVTT): `fas fa-fire`, `fas fa-eye`, etc.
- jQuery (bundled with FoundryVTT): used for DOM manipulation in the HUD hook

<!-- MANUAL: -->
