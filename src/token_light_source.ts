import { TokenLightAnimation, AnimationOptions } from "./token_light_animation";
import { isEqual, merge } from "./utils";

export interface LightSourceData {
  alpha: number;
  bright: number;
  color: string | null;
  angle: number;
  dim: number;

  // advanced
  coloration?: number;
  contrast?: number;
  attenuation?: number;
  luminosity?: number;
  saturation?: number;
  shadows?: number;
  vision?: boolean;
  priority?: number;
  rotation?: number;
  walls?: boolean;
}

export class TokenLightSource {
  alpha: number;
  bright: number;
  color: string | null;
  angle: number;
  dim: number;
  animation: TokenLightAnimation;

  // advanced
  coloration?: number;
  contrast?: number;
  attenuation?: number;
  luminosity?: number;
  saturation?: number;
  shadows?: number;
  vision?: boolean;
  priority?: number;
  rotation?: number;
  walls?: boolean;

  constructor(
    data: LightSourceData & {
      animation: AnimationOptions | TokenLightAnimation;
    },
  ) {
    this.alpha = data.alpha ?? 0.5;
    this.bright = data.bright ?? 13;
    this.color = data.color ?? "#FE9C69";
    this.angle = data.angle ?? 360;
    this.dim = data.dim ?? 8;

    // advanced
    this.coloration = data.coloration ?? 0.5;
    this.contrast = data.contrast ?? 0.5;
    this.attenuation = data.attenuation ?? 1;
    this.luminosity = data.luminosity ?? 0.5;
    this.saturation = data.saturation ?? 0.5;
    this.shadows = data.shadows ?? 0.5;
    this.vision = data.vision ?? false;
    this.priority = data.priority ?? 0;
    this.rotation = data.rotation ?? 0;
    this.walls = data.walls ?? true;

    this.animation = TokenLightAnimation.fromData(data.animation);
  }
  static fromData(data: LightSourceData & { animation: AnimationOptions }) {
    return new TokenLightSource(data);
  }
  merge(other: TokenLightSource): TokenLightSource {
    return TokenLightSource.fromData(merge<TokenLightSource>(this, other));
  }

  isEqual(
    other:
      | (LightSourceData & { animation: AnimationOptions })
      | TokenLightSource,
  ) {
    return isEqual(this, other);
  }
}
