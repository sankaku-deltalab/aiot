import {
  BodiesHelper,
  BodyId,
  DataSourceHelper,
  GameState,
  Im,
  LevelHelper,
  OverlapsReducerProcedure,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TAiotLevel} from '../level';

type Def = DataDef;

export class BulletHitToEnemy extends OverlapsReducerProcedure<Def, 'bullet', 'enemy'> {
  leftBodyType: 'bullet' = 'bullet';
  rightBodyType: 'enemy' = 'enemy';

  applyOverlaps(state: GameState<Def>, bulletId: BodyId<Def, 'bullet'>, enemyId: BodyId<Def, 'enemy'>): GameState<Def> {
    const maybeBullet = BodiesHelper.fetchBody(state, bulletId);
    const maybeEnemy = BodiesHelper.fetchBody(state, enemyId);

    if (maybeBullet.err || maybeEnemy.err) return state;
    const [bullet, enemy] = [maybeBullet.val, maybeEnemy.val];

    if (!bullet.isPlayerSide) return state;
    if (bullet.isHit) return state;
    if (enemy.isDead) return state;

    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const addingScore = baseParams['score.score_when_bomb_hit_to_enemy'];

    const newEnemy = Im.update(enemy, 'health', h => h - bullet.damage);
    const newBullet = Im.update(bullet, 'isHit', () => true);
    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.addScore(lv, addingScore)),
      state => BodiesHelper.putBodies(state, [newEnemy, newBullet])
    )();
  }
}
