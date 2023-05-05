import {Im, ImList, TAaRect2d, TImList, TVec2d, Vec2d} from 'curtain-call3';
import {PlayerGunFire, PlayerGunTrain} from './player-components/player-gun';
import {gameAreaRect, unit} from '../constants';
import {PlayerFiringAutomaton, PlayerFiringState} from './player-components/player-firing';

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
  // firing
  firingState: PlayerFiringState;
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
      firingState: PlayerFiringAutomaton.new({pos: opt.pos}),
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

    const movableArea = TAaRect2d.reduceArea(gameAreaRect, playerSize);
    const newPos = Im.pipe(
      () => body.pos,
      p => TVec2d.add(p, moveDelta),
      p => TAaRect2d.clampPosition(p, movableArea)
    )();

    return {
      ...body,
      pos: newPos,
    };
  }

  static updateFiringTrail(body: Player): Player {
    if (body.hitLog.size > 0) return body;
    if (body.isDead) return body;

    return {
      ...body,
      firingState: PlayerFiringAutomaton.emitEvent(body.firingState, {
        type: 'player-moved',
        bodyElapsedMs: body.elapsedMs,
        bodyPos: body.pos,
      }),
    };
  }

  static maybeUpdateFiring(body: Player, gun: PlayerGunTrain, deltaMs: number): Player {
    return {
      ...body,
      firingState: PlayerFiringAutomaton.emitEvent(body.firingState, {
        type: 'process-shot-firing',
        bodyPos: body.pos,
        bodyDeltaMs: deltaMs,
        gun,
      }),
    };
  }

  static maybeChargeBomb(body: Player, deltaMs: number): Player {
    return {
      ...body,
      firingState: PlayerFiringAutomaton.emitEvent(body.firingState, {
        type: 'charge-bomb',
        bodyDeltaMs: deltaMs,
        chargeTimeMsMax: 1000,
      }),
    };
  }

  static consumeFires(body: Player): [Player, PlayerGunFire[]] {
    const [newFiringState, fires] = PlayerFiringAutomaton.consumeFiring(body.firingState);
    return [{...body, firingState: newFiringState}, fires];
  }

  static getBombChargeRate(body: Player): number {
    return PlayerFiringAutomaton.getBombChargeRate(body.firingState);
  }
}
