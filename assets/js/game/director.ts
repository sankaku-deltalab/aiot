import {Director, GameState, TimeScaling, Representation, DirectorUpdateArgs, LevelHelper, Im} from 'curtain-call3';
import {DataDef} from './data-def';

type Def = DataDef;

export class AiotDirector implements Director<Def> {
  applyInput(state: GameState<Def>): GameState<Def> {
    return state;
  }

  update(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
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
    const ended = lv.elapsedTimeMs >= 1000;
    return {
      status: ended ? {type: 'ended', finalScore: 0} : {type: 'playing'},
    };
  }
}
