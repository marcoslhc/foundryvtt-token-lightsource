<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-04-04 | Updated: 2026-04-04 -->

# styles/

## Purpose

CSS styling for the token-lightsource module's HUD buttons and preset picker dialog. Loaded globally by FoundryVTT for all pages when the module is active.

## Key Files

| File         | Description                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `module.css` | All module styles — HUD toggle buttons, active/hover states, flicker animation, vision button, and preset picker grid dialog |

## For AI Agents

### Working In This Directory

- All class names use the `tls-` prefix to avoid collisions with FoundryVTT core or other modules.
- The active light button uses the warm amber color `#f8c377` with a glow effect and a CSS `@keyframes tls-flicker` animation.
- The active vision button uses blue `#7ecbff` with a matching glow — intentionally different from the light button to visually distinguish the two controls.
- The preset picker is a 2-column CSS grid (`grid-template-columns: repeat(2, 1fr)`). If more presets are added, no layout change is needed — the grid reflows automatically.

### CSS Class Reference

| Class                       | Element                                    |
| --------------------------- | ------------------------------------------ |
| `.tls-toggle`               | Light source HUD button (base)             |
| `.tls-toggle.active`        | Light source button when light is on       |
| `.tls-vision-toggle`        | Vision HUD button (base)                   |
| `.tls-vision-toggle.active` | Vision button when vision is enabled       |
| `.tls-preset-picker`        | Container `<div>` inside the preset Dialog |
| `.tls-preset-option`        | Individual preset row in the picker        |
| `.tls-preset-option.active` | Currently selected preset in the picker    |

## Dependencies

### Internal

- Class names are referenced directly in HTML strings built in `scripts/main.js`

### External

- Font Awesome (FoundryVTT-bundled) for the `<i>` icons inside buttons

<!-- MANUAL: -->
