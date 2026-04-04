# Token Light Source

A [Foundry VTT](https://foundryvtt.com/) module that adds light source and vision controls directly to the Token HUD, eliminating the need for macros.

**Compatible with:** FoundryVTT v10, v11, v12

---

## Features

### 🔥 Light Source Toggle (Token HUD)
- **Left-click** the flame icon to toggle light on/off. When turning on, applies your configured default preset (torch by default).
- **Right-click** to open a picker and choose any preset directly.
- The icon glows amber with a flicker animation when light is active.

### 👁 Vision Toggle (Token HUD)
- **Left-click** the eye icon to toggle basic vision on/off.
- **Right-click** to open a picker and choose a specific vision type.
- The icon glows blue when vision is active.

### Light Presets

| Preset | Bright | Dim | Notes |
|---|---|---|---|
| No Light | — | — | Turns off token light |
| Candle | 5 ft | 10 ft | Warm orange, subtle flicker |
| Torch | 20 ft | 40 ft | Classic torch with animation |
| Hooded Lantern | 30 ft | 60 ft | Warm white, gentle pulse |
| Bullseye Lantern | 60 ft | 120 ft | Bright cone (52° angle) |
| Light (Spell) | 20 ft | 40 ft | Neutral white, slow pulse |
| Dancing Lights | 10 ft | 20 ft | Blue-white, magical pulse |
| Daylight | 60 ft | 60 ft | Pure white, no animation |

### Vision Presets

| Preset | Range | Notes |
|---|---|---|
| No Vision | — | Disables token vision |
| Basic Vision | 0 ft | Normal sight, no special mode |
| Darkvision 30 ft | 30 ft | |
| Darkvision 60 ft | 60 ft | Most common |
| Darkvision 120 ft | 120 ft | |
| Devil's Sight | 120 ft | Requires D&D 5e or compatible system |

---

## Installation

1. In Foundry VTT, go to **Add-on Modules → Install Module**
2. Paste the manifest URL or install manually by placing this folder in your `Data/modules/` directory
3. Enable the module in **Game Settings → Manage Modules**

---

## Settings

| Setting | Default | Description |
|---|---|---|
| Default Light Preset | Torch | Preset applied when left-clicking the HUD flame icon from an unlit state |
| GM Only | Off | Restrict HUD controls to the GM only |

---

## Usage

1. Right-click any token on the canvas to open the Token HUD
2. The **flame icon** (🔥) controls light — left-click to toggle, right-click to pick a preset
3. The **eye icon** (👁) controls vision — left-click to toggle, right-click to pick a vision type

---

## Compatibility

This module uses the FoundryVTT v10+ document API (`token.document.update()`). It does **not** support FoundryVTT v9 or earlier.

The **Devil's Sight** vision mode requires a game system that defines it (e.g., D&D 5e via the `dnd5e` system).

---

## License

MIT
