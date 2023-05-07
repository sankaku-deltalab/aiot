import {
  BodiesHelper,
  BodyId,
  DataSourceHelper,
  GameState,
  Im,
  LevelHelper,
  OverlapsReducerProcedure,
  TVec2d,
  Vec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TAiotLevel} from '../level';
import {Effect, TEffect} from '../bodies/effect';
import {unit} from '../constants';

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

    const newEffect = this.createShotHitEffectAttrs(bullet.pos);

    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.addScore(lv, addingScore)),
      state => BodiesHelper.addBodyFromAttrsB(state, newEffect).state,
      state => BodiesHelper.putBodies(state, [newEnemy, newBullet])
    )();
  }

  private createShotHitEffectAttrs(posBase: Vec2d) {
    const posOffsetMax = unit / 8;
    const posOffset = {
      x: (Math.random() - 0.5) * 2 * posOffsetMax,
      y: (Math.random() - 0.5) * 2 * posOffsetMax,
    };
    const pos = TVec2d.add(posBase, posOffset);

    const angleRad = Math.random() * 2 * Math.PI;

    const lineLengthMax = unit * 4;
    const lineLengthMin = unit / 4;
    const lineLengthRate = Math.random() ** 2;
    const lineLength = lineLengthRate * lineLengthMax + (1 - lineLengthRate) * lineLengthMin;

    return TEffect.newShotHitAttrs({pos, angleRad, lineLength, lifeTimeMs: 100});
  }
}
