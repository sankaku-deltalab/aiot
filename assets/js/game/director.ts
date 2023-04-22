import {Director, GameState, TimeScaling, AnyTypeNotification, Representation} from 'curtain-call3';
import {DataDef} from './data-def';

type Def = DataDef;

export class AiotDirector implements Director<Def> {
  applyInput(state: GameState<Def>): GameState<Def> {
    return state;
  }

  update(state: GameState<Def>): GameState<Def> {
    return state;
  }

  getTimeScales(_state: GameState<Def>): TimeScaling<Def> {
    return {base: 1};
  }

  represent(_state: GameState<Def>): Representation<Def> {
    return {};
  }
}
