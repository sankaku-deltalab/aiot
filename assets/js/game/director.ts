import {Director, GameState, TimeScaling, AnyTypeNotification} from 'curtain-call3';
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

  generateNotification(_state: GameState<Def>): AnyTypeNotification<Def>[] {
    return [];
  }
}
