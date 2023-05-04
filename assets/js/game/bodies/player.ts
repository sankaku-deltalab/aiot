import {Enum, Im, ImList, TAaRect2d, TImList, TVec2d, Vec2d} from 'curtain-call3';
import {GunTrainState, TGunTrainState} from 'gun-train';
import {PlayerGunFire, PlayerGunTrain} from './player-components/player-gun';
import {gameAreaRect, unit} from '../constants';

type BodyTimeMs = number;

const playerSize = {x: unit / 2, y: unit / 2};

export type Player = {
  id: ['player', string];
  bodyType: 'player';
  // basic
  elapsedMs: BodyTimeMs;
  pos: Vec2d;
  //   pos memory [timestamp_ms, pos][]
  moveTrail: [BodyTimeMs, Vec2d][];
  // damaging
  hitLog: ImList<{worldTimeMs: number}>;
  isDead: boolean;
  // fire mode
  fireMode: 'initial' | 'shot' | 'bomb' | 'afterBomb';
  shotFiring: {
    state: GunTrainState;
    requestingFires: PlayerGunFire[];
  };
};

type PlayerAttrs = Omit<Player, 'id'>;

export class TPlayer {
  static newAttrs(opt: {pos: Vec2d}): PlayerAttrs {
    return {
      bodyType: 'player',
      elapsedMs: 0,
      pos: opt.pos,
      moveTrail: [[0, opt.pos]],
      hitLog: TImList.new(),
      isDead: false,
      fireMode: 'initial',
      shotFiring: {
        state: TGunTrainState.new(),
        requestingFires: [],
      },
    };
  }

  static updateElapsedTime(body: Player, deltaMs: number): Player {
    return Im.update(body, 'elapsedMs', t => t + deltaMs);
  }

  /**
   * Update position and trail.
   */
  static updatePos(body: Player, moveDelta: Vec2d, deltaMs: number): Player {
    if (body.hitLog.size > 0) return body;
    if (body.isDead) return body;

    const pos = this.calcNewPos(body, moveDelta, deltaMs);
    const trail = this.calcNewTrail(body, pos, deltaMs);

    return {
      ...body,
      pos,
      moveTrail: trail,
    };
  }

  private static calcNewPos(body: Player, moveDelta: Vec2d, deltaMs: number): Vec2d {
    const movableArea = TAaRect2d.reduceArea(gameAreaRect, playerSize);

    return Im.pipe(
      () => body.pos,
      p => TVec2d.add(p, moveDelta),
      p => TAaRect2d.clampPosition(p, movableArea)
    )();
  }

  private static calcNewTrail(body: Player, newPos: Vec2d, deltaMs: number): [BodyTimeMs, Vec2d][] {
    const time = body.elapsedMs;
    const trailLifeTimeMs = 250;
    const trailAliveTimeMin = time - trailLifeTimeMs;
    const newPoint: [BodyTimeMs, Vec2d] = [time, newPos];

    return Im.pipe(
      () => body.moveTrail,
      trail => [...trail, newPoint],
      trail => Enum.filter(trail, ([t, _]) => t >= trailAliveTimeMin)
    )();
  }

  static maybeUpdateFireMode(body: Player, deltaMs: number): Player {
    if (body.moveTrail.length === 0) return body;

    const newTrail: [BodyTimeMs, Vec2d][] = [[body.elapsedMs, body.pos]];
    const posY = body.pos.y;
    const trailYs = body.moveTrail.map(([_, p]) => p.y);
    const thresholdDelta = unit / 2;
    const shotThresholdY = Math.max(...trailYs) - thresholdDelta;
    const bombThresholdY = Math.min(...trailYs) + thresholdDelta;
    const maybeShouldShot = posY < shotThresholdY;
    const maybeShouldBomb = posY > bombThresholdY;

    switch (body.fireMode) {
      case 'initial':
        if (maybeShouldShot) return {...body, fireMode: 'shot', moveTrail: newTrail};
        if (maybeShouldBomb) return {...body, fireMode: 'bomb', moveTrail: newTrail};
        break;
      case 'shot':
        if (maybeShouldBomb) return {...body, fireMode: 'bomb', moveTrail: newTrail};
        break;
      case 'bomb':
        if (maybeShouldShot) return {...body, fireMode: 'shot', moveTrail: newTrail};
        break;
      case 'afterBomb':
        if (maybeShouldShot) return {...body, fireMode: 'shot', moveTrail: newTrail};
        break;
    }
    return body;
  }

  static maybeUpdateFiring(body: Player, gun: PlayerGunTrain, deltaMs: number): Player {
    if (!this.shouldFire(body)) return body;

    const baseAngleRad = -Math.PI / 2;
    const basePos = body.pos;
    const r = TGunTrainState.update(body.shotFiring.state, gun, {baseAngleRad, basePos}, {deltaMs, loop: true});
    return {
      ...body,
      shotFiring: {
        state: r.state,
        requestingFires: r.fires,
      },
    };
  }

  private static shouldFire(body: Player): boolean {
    return body.fireMode === 'shot';
  }
}
