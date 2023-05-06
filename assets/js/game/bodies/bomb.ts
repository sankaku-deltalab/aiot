import {Im, ImMap, TImMap, TVec2d, Vec2d} from 'curtain-call3';

export type Bomb = {
  id: ['bomb', string];
  bodyType: 'bomb';
  // basic
  elapsedMs: number;
  pos: Vec2d;
  size: Vec2d;
  sizeUpSpeed: number;
  lifeTimeMs: number;
  // damaging
  enemyHitLog: ImMap<string, {}>;
};

type BombAttrs = Omit<Bomb, 'id'>;

export class TBomb {
  static newAttrs(opt: {pos: Vec2d; sizeUpSpeed: number; lifeTimeMs: number}): BombAttrs {
    return {
      bodyType: 'bomb',
      elapsedMs: 0,
      pos: opt.pos,
      size: TVec2d.zero(),
      sizeUpSpeed: opt.sizeUpSpeed,
      lifeTimeMs: opt.lifeTimeMs,
      enemyHitLog: TImMap.new(),
    };
  }

  static updateElapsedMs(body: Bomb, deltaMs: number): Bomb {
    return Im.update(body, 'elapsedMs', t => t + deltaMs);
  }

  static updateSize(body: Bomb, deltaMs: number): Bomb {
    const sizeDelta = body.sizeUpSpeed * deltaMs;
    return Im.update(body, 'size', s => ({x: s.x + sizeDelta, y: s.y + sizeDelta}));
  }
}
