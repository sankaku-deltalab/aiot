import {BodyId, Im, Result, TVec2d, Vec2d} from 'curtain-call3';
import {GunTrainState, TGunTrainState} from 'gun-train';
import {EnemyGunFire, EnemyGunTrain} from './enemy-components/enemy-gun';
import {DataDef} from '../data-def';
import {Player} from './player';

type BodyTimeMs = number;

export type Enemy = {
  id: ['enemy', string];
  bodyType: 'enemy';
  // basic
  elapsedMs: BodyTimeMs;
  pos: Vec2d;
  // stat
  statId: string;
  // hit
  health: number;
  isDead: boolean;
  collisionSize: Vec2d;
  // fire
  gunId: string;
  startFireDelayMs: number;
  targetId?: BodyId<DataDef, 'player'>;
  shotFiring: {
    state: GunTrainState;
    requestingFires: EnemyGunFire[];
  };
};

type EnemyAttrs = Omit<Enemy, 'id'>;

type EnemyInitValues = {
  // basic
  pos: Vec2d;
  // stat
  statId: string;
  // hit
  health: number;
  collisionSize: Vec2d;
  // fire
  gunId: string;
  startFireDelayMs: number;
};

export class TEnemy {
  static newAttrs(opt: EnemyInitValues): EnemyAttrs {
    return {
      bodyType: 'enemy',
      statId: opt.statId,
      elapsedMs: 0,
      pos: opt.pos,
      health: opt.health,
      isDead: false,
      collisionSize: opt.collisionSize,
      gunId: opt.gunId,
      startFireDelayMs: opt.startFireDelayMs,
      shotFiring: {
        state: TGunTrainState.new(),
        requestingFires: [],
      },
    };
  }

  static updateElapsedTime(body: Enemy, deltaMs: number): Enemy {
    return Im.update(body, 'elapsedMs', t => t + deltaMs);
  }

  static maybeUpdateFiring(body: Enemy, opt: {deltaMs: number; gun: EnemyGunTrain; target: Result<Player>}): Enemy {
    const {deltaMs, gun, target} = opt;

    if (!this.shouldFire(body, target)) return body;

    const rank = 0; // TODO: get rank
    const basePos = body.pos;
    const baseAngleRad = this.calcFireAngleRad(body, target);
    const r = TGunTrainState.update(body.shotFiring.state, gun, {rank, baseAngleRad, basePos}, {deltaMs, loop: true});
    return {
      ...body,
      shotFiring: {
        state: r.state,
        requestingFires: r.fires,
      },
    };
  }

  private static shouldFire(body: Enemy, target: Result<Player>): boolean {
    if (target === undefined) return false;
    if (body.elapsedMs < body.startFireDelayMs) return false;
    return true;
  }

  private static calcFireAngleRad(body: Enemy, target: Result<Player>): number {
    if (target.err) return Math.PI / 2;

    const dirVec = TVec2d.sub(target.val.pos, body.pos);
    return Math.atan2(dirVec.y, dirVec.x);
  }
}
