import { jest } from "@jest/globals";
import {
  LIGHT_PRESETS,
  LightPreset,
  PRESET_CYCLE,
  tokenHasLight,
  getCurrentPresetKey,
  getNextPresetKey,
  applyLightPreset,
} from "../light-sources.js";

// Helper: build a minimal Token-like object with only dim/bright set
function makeToken(dim: number, bright: number) {
  return {
    document: {
      light: { dim, bright },
      canUserModify: jest.fn<() => boolean>().mockReturnValue(true),
      update: jest.fn<() => Promise<void>>(),
    },
  } as unknown as Token.Implementation;
}

// Helper: build a Token-like object with a full light preset applied
function makeTokenWithLight(light: LightPreset["light"]) {
  return {
    document: {
      light,
      canUserModify: jest.fn<() => boolean>().mockReturnValue(true),
      update: jest.fn<() => Promise<void>>(),
    },
  } as unknown as Token.Implementation;
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
  it("matches torch preset", () => {
    expect(getCurrentPresetKey(makeTokenWithLight(LIGHT_PRESETS.torch.light))).toBe("torch");
  });

  it("matches candle preset", () => {
    expect(getCurrentPresetKey(makeTokenWithLight(LIGHT_PRESETS.candle.light))).toBe("candle");
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
