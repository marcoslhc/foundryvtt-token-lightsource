import { AnimationType, TokenLightAnimation } from "../token_light_animation";
import { TokenLightSource } from "../token_light_source";

describe("TokenLightSource", () => {
  it.each([
    [
      {
        alpha: 1,
        bright: 1,
        color: "#ff0000",
        angle: 360,
        dim: 8,
        animation: TokenLightAnimation.fromData({
          speed: 5,
          intensity: 5,
          type: AnimationType.FAIRY,
        }),
      },
      {
        alpha: 1,
        bright: 1,
        color: "#ff0000",
        angle: 360,
        dim: 8,
        animation: TokenLightAnimation.fromData({
          speed: 5,
          intensity: 5,
          type: AnimationType.FAIRY,
        }),
      },
      true,
    ],
    [
      {
        alpha: 1,
        bright: 1,
        color: "#ff0000",
        angle: 360,
        dim: 8,
        animation: TokenLightAnimation.fromData({
          speed: 5,
          intensity: 5,
          type: AnimationType.FAIRY,
        }),
      },
      {
        alpha: 1,
        bright: 1,
        color: "#ff0000",
        angle: 360,
        dim: 8,
        animation: TokenLightAnimation.fromData({
          speed: 5,
          intensity: 5,
          type: AnimationType.TORCH,
        }),
      },
      false,
    ],
  ])(
    "should run is %p isEqual over %p and return %s",
    (first, second, expected) => {
      expect(TokenLightSource.fromData(first).isEqual(second)).toBe(true);
    },
  );
});
