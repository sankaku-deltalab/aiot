import {
  Director,
  GameState,
  TimeScaling,
  Representation,
  DirectorUpdateArgs,
  LevelHelper,
  Im,
  BodiesHelper,
  TVec2d,
} from 'curtain-call3';
import {DataDef} from './data-def';
import {TPlayer} from './bodies/player';

type Def = DataDef;

export class AiotDirector implements Director<Def> {
  applyInput(state: GameState<Def>): GameState<Def> {
    return state;
  }

  update(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    return Im.pipe(
      () => state,
      state => this.maybeInit(state, args),
      state => this.updateElapsedTime(state, args)
    )();
  }

  private maybeInit(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    const isFirstUpdate = LevelHelper.getLevel(state).elapsedTimeMs === 0;
    if (!isFirstUpdate) return state;

    const player = TPlayer.newAttrs({pos: TVec2d.zero()});

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodyFromAttrsB(state, player).state
    )();
  }

  private updateElapsedTime(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => Im.update(lv, 'elapsedTimeMs', t => t + args.deltaMs))
    )();
  }

  getTimeScales(_state: GameState<Def>): TimeScaling<Def> {
    return {base: 1};
  }

  represent(state: GameState<Def>): Representation<Def> {
    const lv = LevelHelper.getLevel(state);
    const ended = lv.elapsedTimeMs >= 3000;
    return {
      status: ended ? {type: 'ended', finalScore: 0} : {type: 'playing'},
    };
  }
}
