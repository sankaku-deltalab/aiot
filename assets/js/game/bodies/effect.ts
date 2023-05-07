import {Im, Vec2d} from 'curtain-call3';

export type Effect = {
  id: ['effect', string];
  bodyType: 'effect';
  elapsedMs: number;
  lifeTimeMs: number;
  payload: EffectPayload;
};

export type EffectPayload =
  | {
      type: 'shot-hit';
      pos: Vec2d;
      angleRad: number;
      lineLength: number;
    }
  | {
      type: 'bomb-hit';
      pos: Vec2d;
      angleRad: number;
    }
  | {
      type: 'player-hit';
      pos: Vec2d;
      angleRad: number;
    }
  | {
      type: 'player-death';
      pos: Vec2d;
      angleRad: number;
    };

type EffectAttrs = Omit<Effect, 'id'>;

export namespace TEffect {
  export const newShotHitAttrs = (opt: {
    pos: Vec2d;
    angleRad: number;
    lifeTimeMs: number;
    lineLength: number;
  }): EffectAttrs => {
    return {
      bodyType: 'effect',
      elapsedMs: 0,
      lifeTimeMs: opt.lifeTimeMs,
      payload: {
        type: 'shot-hit',
        pos: opt.pos,
        angleRad: opt.angleRad,
        lineLength: opt.lineLength,
      },
    };
  };

  export const updateElapsedTime = (effect: Effect, deltaMs: number): Effect => {
    return Im.update(effect, 'elapsedMs', t => t + deltaMs);
  };

  export const getLifeRate = (effect: Effect): number => {
    return Math.max(0, Math.min(1, effect.elapsedMs / effect.lifeTimeMs));
  };
}
