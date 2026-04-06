import { AnimationType, TokenLightAnimation } from "../token_light_animation";

describe("TokenLightAnimation", () => {
  it.each([
    [
      {
        type: AnimationType.FLAME,
        reverse: false,
        speed: 5,
        intensity: 5,
      },
      {
        type: AnimationType.FLAME,
        reverse: false,
        speed: 5,
        intensity: 5,
      },
      true,
    ],
    [
      {
        type: AnimationType.FLAME,
        reverse: false,
        speed: 5,
        intensity: 5,
      },
      {
        type: AnimationType.CHROMA,
        reverse: false,
        speed: 5,
        intensity: 5,
      },
      false,
    ],
  ])("should compare two equal", (first, second, expected) => {
    expect(TokenLightAnimation.fromData(first).isEqual(second)).toBe(expected);
  });
});
