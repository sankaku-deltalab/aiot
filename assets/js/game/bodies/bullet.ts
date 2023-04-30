import {TVec2d, Vec2d} from 'curtain-call3';

export type Bullet = {
  id: ['bullet', string];
  bodyType: 'bullet';
  // basic
  elapsedMs: number;
  pos: Vec2d;
  directionRad: number;
  speed: number;
  collisionSize: number;
  renderingSize: number;
  // damaging
  isPlayerSide: boolean;
  damage: number;
};

type BulletAttrs = Omit<Bullet, 'id'>;

export class TBullet {
  static newAttrs(opt: {
    pos: Vec2d;
    directionRad: number;
    speed: number;
    collisionSize: number;
    renderingSize: number;
    isPlayerSide: boolean;
    damage: number;
  }): BulletAttrs {
    return {
      bodyType: 'bullet',
      elapsedMs: 0,
      pos: opt.pos,
      directionRad: opt.directionRad,
      speed: opt.speed,
      collisionSize: opt.collisionSize,
      renderingSize: opt.renderingSize,
      isPlayerSide: opt.isPlayerSide,
      damage: opt.damage,
    };
  }

  static updatePos(body: Bullet, deltaMs: number): Bullet {
    const moveDelta = TVec2d.fromRadians(body.directionRad, body.speed * deltaMs);
    return {
      ...body,
      pos: TVec2d.add(body.pos, moveDelta),
    };
  }
}
