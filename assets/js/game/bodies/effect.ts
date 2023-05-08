import {Color, Enum, Im, TVec2d, Vec2d} from 'curtain-call3';
import {unit} from '../constants';

export type Effect = {
  id: ['effect', string];
  bodyType: 'effect';
  elapsedMs: number;
  lifeTimeMs: number;
  payload: EffectPayload;
};

export namespace CuttingEdgeEffect {
  export type T = {
    key: string;
    startTimeMs: number;
    lifeTimeMs: number;
    pos: Vec2d;
    color: Color;
    zIndex: number;
    angleRad: {start: number; end: number};
    lineLength: {start: number; end: number};
    thickness: {start: number; end: number};
  };

  export const newEdge = (ce: Omit<T, 'elapsedMs'>): T => {
    return {...ce};
  };

  export const endTime = (ce: T): number => {
    return ce.startTimeMs + ce.lifeTimeMs;
  };

  export const lifeRate = (ce: T, elapsedMs: number): number => {
    const lived = elapsedMs - ce.startTimeMs;
    return Math.max(0, Math.min(1, lived / endTime(ce)));
  };

  export const isAlive = (ce: T, elapsedMs: number): boolean => {
    console.log({elapsedMs, endTime: endTime(ce)});
    return elapsedMs < endTime(ce);
  };
}

export type EffectPayload =
  | {
      type: 'shot-hit';
      pos: Vec2d;
      angleRad: number;
      lineLength: number;
    }
  | {
      type: 'bomb-hit';
      edges: CuttingEdgeEffect.T[];
    }
  | {
      type: 'player-hit';
      pos: Vec2d;
      angleRad: number;
      lineLength: number;
    }
  | {
      type: 'player-death';
      pos: Vec2d;
      lines: PlayerDeathLine[];
    };

export type PlayerDeathLine = {
  spawnCount: number;
  posOffset: Vec2d;
  angleRad: number;
  spawnRate: number;
  startTimeMs: number;
  lifeTimeMs: number;
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

  export const newBombHitAttrs = (opt: {pos: Vec2d}): EffectAttrs => {
    const lifeTimeMs = 100;
    const main = newBombHitEdgeMain(opt, 'main');
    const sub = newBombHitEdgeSub(opt, 'sub');

    return {
      bodyType: 'effect',
      elapsedMs: 0,
      lifeTimeMs: lifeTimeMs,
      payload: {
        type: 'bomb-hit',
        edges: [main, sub],
      },
    };
  };

  const newBombHitEdgeMain = (opt: {pos: Vec2d}, key: string): CuttingEdgeEffect.T => {
    const asRange = (v: number) => ({start: v, end: v});
    const pos = opt.pos;
    const angleRad = asRange(Math.random() * 2 * Math.PI);
    const lineLength = asRange(unit * 128);
    const color = 0xffffff;
    const thickness = {start: unit / 8, end: 0};
    const lifeTimeMs = 100;
    const zIndex = 10;

    return CuttingEdgeEffect.newEdge({
      angleRad,
      color,
      key,
      lifeTimeMs,
      lineLength,
      pos,
      startTimeMs: 0,
      thickness,
      zIndex,
    });
  };

  const newBombHitEdgeSub = (opt: {pos: Vec2d}, key: string): CuttingEdgeEffect.T => {
    const asRange = (v: number) => ({start: v, end: v});
    const pos = opt.pos;
    const angleRad = asRange(Math.random() * 2 * Math.PI);
    const lineLength = asRange(unit * 128);
    const color = 0xffffff;
    const thickness = {start: unit / 16, end: 0};
    const lifeTimeMs = 100;
    const zIndex = 10;

    return CuttingEdgeEffect.newEdge({
      angleRad,
      color,
      key,
      lifeTimeMs,
      lineLength,
      pos,
      startTimeMs: 0,
      thickness,
      zIndex,
    });
  };

  export const newPlayerHitAttrs = (opt: {
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
        type: 'player-hit',
        pos: opt.pos,
        angleRad: opt.angleRad,
        lineLength: opt.lineLength,
      },
    };
  };

  export const newPlayerDeathAttrs = (opt: {pos: Vec2d; lifeTimeMs: number; lineLifeTimeMs: number}): EffectAttrs => {
    const lineSpawnDurationMs = opt.lifeTimeMs - opt.lineLifeTimeMs;
    const lineSpawnIntervalMs = 1000 / 600;
    const spawnCount = Math.floor(lineSpawnDurationMs / lineSpawnIntervalMs);

    const distanceMax = unit * 4;
    const distanceMin = unit / 2;

    const lines = Im.pipe(
      () => Im.range(0, spawnCount),
      is =>
        Enum.map(is, (i): PlayerDeathLine => {
          const rate = i / (spawnCount - 1);

          const distance = rate * distanceMax + (1 - rate) * distanceMin;
          const posOffset = TVec2d.fromRadians(Math.random() * 2 * Math.PI, distance);
          const angleRad = Math.random() * 2 * Math.PI;
          const startTimeMs = i * lineSpawnIntervalMs;
          const lifeTimeMs = opt.lineLifeTimeMs;

          return {spawnCount: i, posOffset, angleRad, spawnRate: rate, startTimeMs, lifeTimeMs};
        })
    )();
    return {
      bodyType: 'effect',
      elapsedMs: 0,
      lifeTimeMs: opt.lifeTimeMs,
      payload: {
        type: 'player-death',
        pos: opt.pos,
        lines,
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
