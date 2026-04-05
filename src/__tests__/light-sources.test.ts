import { jest } from "@jest/globals";
import {
  LIGHT_PRESETS,
  PRESET_CYCLE,
  tokenHasLight,
  getCurrentPresetKey,
  getNextPresetKey,
  applyLightPreset,
} from "../light-sources.js";

// Helper: build a minimal Token-like object
function makeToken(dim: number, bright: number) {
  return {
    document: {
      light: { dim, bright },
      canUserModify: jest.fn<() => boolean>().mockReturnValue(true),
      update: jest.fn<() => Promise<void>>(),
    },
  };
}

describe("tokenHasLight", () => {
  it("returns true when dim > 0", () => {
    expect(tokenHasLight(makeToken(10, 0))).toBe(true);
  });

  it("returns true when bright > 0", () => {
    expect(tokenHasLight(makeToken(0, 0.5))).toBe(true);
  });

  it("returns false when both are 0", () => {
    expect(tokenHasLight(makeToken(0, 0))).toBe(false);
  });
});

describe("getCurrentPresetKey", () => {
  // The "custom" preset has dim:0/bright:0, so it matches before the "none" fallback.
  it("returns 'custom' when dim and bright are 0", () => {
    expect(getCurrentPresetKey(makeToken(0, 0))).toBe("custom");
  });

  it("matches torch preset by dim+bright", () => {
    const { dim, bright } = LIGHT_PRESETS.torch.light;
    expect(getCurrentPresetKey(makeToken(dim, bright))).toBe("torch");
  });

  it("matches candle preset by dim+bright", () => {
    const { dim, bright } = LIGHT_PRESETS.candle.light;
    expect(getCurrentPresetKey(makeToken(dim, bright))).toBe("candle");
  });

  it("returns 'custom' for unknown light values", () => {
    // dim=99 matches no preset
    expect(getCurrentPresetKey(makeToken(99, 0.3))).toBe("custom");
  });
});

describe("getNextPresetKey", () => {
  it("cycles through PRESET_CYCLE in order", () => {
    for (let i = 0; i < PRESET_CYCLE.length - 1; i++) {
      expect(getNextPresetKey(PRESET_CYCLE[i])).toBe(PRESET_CYCLE[i + 1]);
    }
  });

  it("wraps from last item back to first", () => {
    const last = PRESET_CYCLE[PRESET_CYCLE.length - 1];
    expect(getNextPresetKey(last)).toBe(PRESET_CYCLE[0]);
  });

  it("returns 'none' for an unknown key", () => {
    expect(getNextPresetKey("custom")).toBe("none");
  });
});

describe("applyLightPreset", () => {
  it("calls token.document.update with torch light data", async () => {
    const token = makeToken(0, 0);
    await applyLightPreset(token, "torch");
    expect(token.document.update).toHaveBeenCalledWith(
      expect.objectContaining({
        light: expect.objectContaining({
          dim: LIGHT_PRESETS.torch.light.dim,
          bright: LIGHT_PRESETS.torch.light.bright,
        }),
      }),
    );
  });

  it("skips update when preset is unknown", async () => {
    const token = makeToken(0, 0);
    await applyLightPreset(token, "unknown" as never);
    expect(token.document.update).not.toHaveBeenCalled();
  });

  it("skips update when user lacks modify permission", async () => {
    const token = makeToken(0, 0);
    (token.document.canUserModify as jest.Mock).mockReturnValue(false);
    await applyLightPreset(token, "torch");
    expect(token.document.update).not.toHaveBeenCalled();
  });
});
