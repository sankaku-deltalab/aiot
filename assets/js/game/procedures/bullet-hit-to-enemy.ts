import {BodiesHelper, BodyId, GameState, Im, OverlapsReducerProcedure, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;

export class BulletHitToEnemy extends OverlapsReducerProcedure<Def, 'bullet', 'enemy'> {
  leftBodyType: 'bullet' = 'bullet';
  rightBodyType: 'enemy' = 'enemy';

  applyOverlaps(state: GameState<Def>, bulletId: BodyId<Def, 'bullet'>, enemyId: BodyId<Def, 'enemy'>): GameState<Def> {
    console.log('hit');
    const maybeBullet = BodiesHelper.fetchBody(state, bulletId);
    const maybeEnemy = BodiesHelper.fetchBody(state, enemyId);

    if (maybeBullet.err || maybeEnemy.err) return state;
    const [bullet, enemy] = [maybeBullet.val, maybeEnemy.val];

    if (!bullet.isPlayerSide) return state;
    if (bullet.isHit) return state;
    if (enemy.isDead) return state;

    const newEnemy = Im.update(enemy, 'health', h => h - bullet.damage);
    const newBullet = Im.update(bullet, 'isHit', () => true);
    console.log('hit2', newEnemy, newBullet);
    return BodiesHelper.putBodies(state, [newEnemy, newBullet]);
  }
}
