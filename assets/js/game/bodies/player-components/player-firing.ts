import {Enum, Im, Vec2d} from 'curtain-call3';
import {DefineFuncmataDefinition, FuncmataEvent, EventHandler, Funcmata, FuncmataState} from 'funcmata';
import {GunTrainState, TGunTrainState} from 'gun-train';
import {PlayerGunFire, PlayerGunTrain} from './player-gun';
import {unit} from 'js/game/constants';

type BodyTimeMs = number;

type PlayerFiringProgressDef = DefineFuncmataDefinition<{
  state: {moveTrail: [BodyTimeMs, Vec2d][]; shotFireState: GunTrainState} & (
    | {type: 'initial'}
    | {type: 'shot-firing'; requestingFires: PlayerGunFire[]}
    | {type: 'bomb-charging'; chargeTimeMs: number; chargeTimeMsMax?: number}
    | {type: 'bomb-firing'}
    | {type: 'after-bomb'}
  );
  event:
    | {type: 'player-moved'; bodyPos: Vec2d; bodyElapsedMs: number}
    | {type: 'process-shot-firing'; bodyPos: Vec2d; bodyDeltaMs: number; gun: PlayerGunTrain}
    | {type: 'charge-bomb'; bodyDeltaMs: number; chargeTimeMsMax: number}
    | {type: 'fires-consumed'}
    | {type: 'player-completely-dead'}
    | {type: 'game-time-up'};
}>;

type Def = PlayerFiringProgressDef;

class Handler implements EventHandler<Def> {
  handleEvent(event: PlayerFiringEvent, state: PlayerFiringState): PlayerFiringState {
    switch (event.type) {
      case 'player-moved': {
        return Im.pipe(
          () => state,
          state => this.updateTrail(state, event),
          state => this.maybeUpdateStateByMove(state, event)
        )();
      }
      case 'process-shot-firing': {
        return Im.pipe(
          () => state,
          state => this.maybeUpdateFiring(state, event)
        )();
      }
      case 'charge-bomb': {
        return Im.pipe(
          () => state,
          state => this.maybeChargeBomb(state, event)
        )();
      }
      // TODO: impl bomb
    }
    return state;
  }

  private updateTrail(state: PlayerFiringState, event: PlayerFiringEvent): PlayerFiringState {
    if (event.type !== 'player-moved') return state;

    const time = event.bodyElapsedMs;
    const trailLifeTimeMs = 250;
    const trailAliveTimeMin = time - trailLifeTimeMs;
    const newPoint: [BodyTimeMs, Vec2d] = [time, event.bodyPos];

    const newTrail = Im.pipe(
      () => state.moveTrail,
      trail => [...trail, newPoint],
      trail => Enum.filter(trail, ([t, _]) => t >= trailAliveTimeMin)
    )();
    return {
      ...state,
      moveTrail: newTrail,
    };
  }

  private maybeUpdateStateByMove(state: PlayerFiringState, event: PlayerFiringEvent): PlayerFiringState {
    if (event.type !== 'player-moved') return state;

    if (state.moveTrail.length === 0) return state;

    const newTrail: [BodyTimeMs, Vec2d][] = [[event.bodyElapsedMs, event.bodyPos]];
    const posY = event.bodyPos.y;
    const trailYs = state.moveTrail.map(([_, p]) => p.y);
    const thresholdDelta = unit / 2;
    const shotThresholdY = Math.max(...trailYs) - thresholdDelta;
    const bombThresholdY = Math.min(...trailYs) + thresholdDelta;
    const maybeShouldShot = posY < shotThresholdY;
    const maybeShouldBomb = posY > bombThresholdY;

    const commonState = {
      moveTrail: state.moveTrail,
      shotFireState: state.shotFireState,
    };
    switch (state.type) {
      case 'initial':
        if (maybeShouldShot) return {...commonState, type: 'shot-firing', moveTrail: newTrail, requestingFires: []};
        if (maybeShouldBomb) return {...state, type: 'bomb-charging', moveTrail: newTrail, chargeTimeMs: 0};
        break;
      case 'shot-firing':
        if (maybeShouldBomb) return {...state, type: 'bomb-charging', moveTrail: newTrail, chargeTimeMs: 0};
        break;
      case 'bomb-charging':
        if (maybeShouldShot) return {...commonState, type: 'shot-firing', moveTrail: newTrail, requestingFires: []};
        break;
      case 'after-bomb':
        if (maybeShouldShot) return {...commonState, type: 'shot-firing', moveTrail: newTrail, requestingFires: []};
        break;
    }
    return state;
  }

  private maybeUpdateFiring(
    state: PlayerFiringState,
    event: PlayerFiringEvent & {type: 'process-shot-firing'}
  ): PlayerFiringState {
    if (state.type !== 'shot-firing') return state;

    const baseAngleRad = -Math.PI / 2;
    const basePos = event.bodyPos;
    const deltaMs = event.bodyDeltaMs;
    const r = TGunTrainState.update(state.shotFireState, event.gun, {baseAngleRad, basePos}, {deltaMs, loop: true});
    return {
      ...state,
      type: 'shot-firing',
      requestingFires: [...r.fires, ...state.requestingFires],
      shotFireState: r.state,
    };
  }

  private maybeChargeBomb(
    state: PlayerFiringState,
    event: PlayerFiringEvent & {type: 'charge-bomb'}
  ): PlayerFiringState {
    if (state.type !== 'bomb-charging') return state;

    return {
      ...state,
      chargeTimeMs: state.chargeTimeMs + event.bodyDeltaMs,
      chargeTimeMsMax: event.chargeTimeMsMax,
    };
  }
}

export type PlayerFiringState = FuncmataState<Def>;
export type PlayerFiringEvent = FuncmataEvent<Def>;

export class PlayerFiringAutomaton {
  private static readonly handler = new Handler();

  static new(opt: {pos: Vec2d}): PlayerFiringState {
    return Funcmata.new<Def>({type: 'initial', moveTrail: [[0, opt.pos]], shotFireState: TGunTrainState.new()});
  }

  static emitEvent(state: PlayerFiringState, event: PlayerFiringEvent): PlayerFiringState {
    return Funcmata.emitEvent<Def>(state, event, this.handler);
  }

  static consumeFiring(state: PlayerFiringState): [PlayerFiringState, PlayerGunFire[]] {
    if (state.type !== 'shot-firing') return [state, []];

    const newState: PlayerFiringState = {
      ...state,
      requestingFires: [],
    };
    return [newState, state.requestingFires];
  }

  static getBombChargeRate(state: PlayerFiringState): number {
    if (state.type !== 'bomb-charging') return 0;
    if (state.chargeTimeMsMax === undefined) return 0;

    return state.chargeTimeMs / state.chargeTimeMsMax;
  }
}
