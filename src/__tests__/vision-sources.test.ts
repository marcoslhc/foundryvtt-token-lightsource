import { jest } from "@jest/globals";
import {
  VISION_PRESETS,
  tokenHasVision,
  getCurrentVisionPresetKey,
  applyVisionPreset,
} from "../vision-sources.js";

function makeVisionToken(enabled: boolean, range = 0, visionMode = "basic") {
  return {
    document: {
      sight: { enabled, range, visionMode },
      canUserModify: jest.fn<() => boolean>().mockReturnValue(true),
      update: jest.fn<() => Promise<void>>(),
    },
  };
}

describe("tokenHasVision", () => {
  it("returns true when sight.enabled is true", () => {
    expect(tokenHasVision(makeVisionToken(true))).toBe(true);
  });

  it("returns false when sight.enabled is false", () => {
    expect(tokenHasVision(makeVisionToken(false))).toBe(false);
  });
});

describe("getCurrentVisionPresetKey", () => {
  it("returns 'none' when sight is disabled", () => {
    expect(getCurrentVisionPresetKey(makeVisionToken(false))).toBe("none");
  });

  it("returns 'basic' for enabled sight with range 0", () => {
    expect(getCurrentVisionPresetKey(makeVisionToken(true, 0, "basic"))).toBe(
      "basic",
    );
  });

  it("matches darkvision60 by range + visionMode", () => {
    const { range, visionMode } = VISION_PRESETS.darkvision60.sight;
    expect(
      getCurrentVisionPresetKey(makeVisionToken(true, range, visionMode)),
    ).toBe("darkvision60");
  });

  it("matches darkvision120 by range + visionMode", () => {
    const { range, visionMode } = VISION_PRESETS.darkvision120.sight;
    expect(
      getCurrentVisionPresetKey(makeVisionToken(true, range, visionMode)),
    ).toBe("darkvision120");
  });

  it("matches devilsSight", () => {
    const { range, visionMode } = VISION_PRESETS.devilsSight.sight;
    expect(
      getCurrentVisionPresetKey(makeVisionToken(true, range, visionMode)),
    ).toBe("devilsSight");
  });
});

describe("applyVisionPreset", () => {
  it("calls token.document.update with darkvision60 data", async () => {
    const token = makeVisionToken(false);
    await applyVisionPreset(token, "darkvision60");
    expect(token.document.update).toHaveBeenCalledWith(
      expect.objectContaining({
        "sight.enabled": true,
        "sight.range": 60,
        "sight.visionMode": "darkvision",
      }),
    );
  });

  it("skips update when preset is unknown", async () => {
    const token = makeVisionToken(false);
    await applyVisionPreset(token, "unknown");
    expect(token.document.update).not.toHaveBeenCalled();
  });

  it("skips update when user lacks modify permission", async () => {
    const token = makeVisionToken(false);
    (token.document.canUserModify as jest.Mock).mockReturnValue(false);
    await applyVisionPreset(token, "basic");
    expect(token.document.update).not.toHaveBeenCalled();
  });
});
