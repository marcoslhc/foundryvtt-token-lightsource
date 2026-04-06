export interface AnimationOptions {
  type: AnimationType;
  speed: number;
  intensity: number;
  reverse?: boolean | null;
}

export enum AnimationType {
  NONE = "",
  FLAME = "flame",
  TORCH = "torch",
  REVOLVING = "revolving",
  SIREN = "siren",
  PULSE = "pulse",
  REACTIVE_PULSE = "reactivepulse",
  CHROMA = "chroma",
  WAVE = "wave",
  FOG = "fog",
  SUNBURST = "sunburst",
  DOME = "dome",
  EMANATION = "emanation",
  HEXA = "hexa",
  GHOST = "ghost",
  ENERGY = "energy",
  VORTEX = "vortex",
  WITCHWAVE = "witchwave",
  RAINBOW_SWIRL = "rainbowswirl",
  RADIAL_RAINBOW = "radialrainbow",
  FAIRY = "fairy",
  GRID = "grid",
  STARLIGHT = "starlight",
  SMOKEPATCH = "smokepatch",
}

export class TokenLightAnimation {
  type: AnimationType;
  speed: number;
  intensity: number;
  reverse: boolean;
  constructor(data: AnimationOptions) {
    this.type = data.type;
    this.speed = data.speed;
    this.intensity = data.intensity;
    this.reverse = data.reverse ?? false;
  }
  static fromData(data: TokenLightAnimation | AnimationOptions) {
    return new TokenLightAnimation(data);
  }
  isEqual(other: TokenLightAnimation | AnimationOptions) {
    return (
      other.type == this.type &&
      other.speed == this.speed &&
      other.intensity == this.intensity &&
      other.reverse == this.reverse
    );
  }
}
