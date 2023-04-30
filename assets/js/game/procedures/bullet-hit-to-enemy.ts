import {BodyId, GameState, OverlapsReducerProcedure} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;

export class BulletHitToEnemy extends OverlapsReducerProcedure<Def, 'bullet', 'enemy'> {
  leftBodyType: 'bullet' = 'bullet';
  rightBodyType: 'enemy' = 'enemy';

  applyOverlaps(state: GameState<Def>, bulletId: BodyId<Def, 'bullet'>, enemyId: BodyId<Def, 'enemy'>): GameState<Def> {
    return state;
  }
}
