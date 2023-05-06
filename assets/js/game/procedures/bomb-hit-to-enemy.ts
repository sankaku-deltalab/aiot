import {BodiesHelper, BodyId, GameState, HitStopHelper, Im, OverlapsReducerProcedure, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;

export class BombHitToEnemy extends OverlapsReducerProcedure<Def, 'bomb', 'enemy'> {
  leftBodyType: 'bomb' = 'bomb';
  rightBodyType: 'enemy' = 'enemy';

  applyOverlaps(state: GameState<Def>, bombId: BodyId<Def, 'bomb'>, enemyId: BodyId<Def, 'enemy'>): GameState<Def> {
    const maybeBomb = BodiesHelper.fetchBody(state, bombId);
    const maybeEnemy = BodiesHelper.fetchBody(state, enemyId);

    console.log('BombHitToEnemy');

    if (maybeBomb.err || maybeEnemy.err) return state;
    const [bomb, enemy] = [maybeBomb.val, maybeEnemy.val];

    if (enemy.health <= 0) return state;
    if (enemy.isDead) return state;

    const damage = 9_999_999;
    const newEnemy = Im.update(enemy, 'health', h => h - damage);
    return Im.pipe(
      () => state,
      state => BodiesHelper.putBodies(state, [newEnemy]),
      state =>
        HitStopHelper.addHitStop(state, {
          target: {type: 'whole-world'},
          props: {type: 'constant', engineTimeDurationMs: 125, gameTimeDurationMs: 0},
        })
    )();
  }
}
