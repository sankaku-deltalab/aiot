import {BodiesHelper, BodiesReducerProcedure, Body, GameState, Im} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;
type BT = 'enemy';

export class KillEnemyIfShouldDie extends BodiesReducerProcedure<Def, 'enemy'> {
  type: 'enemy' = 'enemy';

  filterBody(_body: Body<Def, BT>, _state: GameState<Def>): boolean {
    return true;
  }

  applyBody(state: GameState<Def>, enemy: Body<Def, BT>): GameState<Def> {
    const shouldDie = enemy.health <= 0;
    if (!shouldDie) return state;

    return BodiesHelper.putBody(
      state,
      Im.update(enemy, 'isDead', () => true)
    );
  }
}
