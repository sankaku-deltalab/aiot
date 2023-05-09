import {BodiesHelper, BodyId, GameState, HitStopHelper, Im, OverlapsReducerProcedure, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;

export class BombHitToEnemyBullet extends OverlapsReducerProcedure<Def, 'bomb', 'bullet'> {
  leftBodyType: 'bomb' = 'bomb';
  rightBodyType: 'bullet' = 'bullet';

  applyOverlaps(state: GameState<Def>, bombId: BodyId<Def, 'bomb'>, bulletId: BodyId<Def, 'bullet'>): GameState<Def> {
    const maybeBomb = BodiesHelper.fetchBody(state, bombId);
    const maybeBullet = BodiesHelper.fetchBody(state, bulletId);

    if (maybeBomb.err || maybeBullet.err) return state;
    const [bomb, bullet] = [maybeBomb.val, maybeBullet.val];

    if (bullet.isPlayerSide) return state;
    if (bullet.isHit) return state;

    const newBullet = Im.update(bullet, 'isHit', () => true);
    return Im.pipe(
      () => state,
      state => BodiesHelper.putBodies(state, [newBullet])
    )();
  }
}
