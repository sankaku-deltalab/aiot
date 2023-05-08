import {
  BodiesHelper,
  BodyId,
  DataSourceHelper,
  GameState,
  HitStopHelper,
  Im,
  LevelHelper,
  OverlapsReducerProcedure,
  TVec2d,
  Vec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TAiotLevel} from '../level';
import {unit} from '../constants';
import {TEffect} from '../bodies/effect';

type Def = DataDef;

export class BombHitToEnemy extends OverlapsReducerProcedure<Def, 'bomb', 'enemy'> {
  leftBodyType: 'bomb' = 'bomb';
  rightBodyType: 'enemy' = 'enemy';

  applyOverlaps(state: GameState<Def>, bombId: BodyId<Def, 'bomb'>, enemyId: BodyId<Def, 'enemy'>): GameState<Def> {
    const maybeBomb = BodiesHelper.fetchBody(state, bombId);
    const maybeEnemy = BodiesHelper.fetchBody(state, enemyId);

    if (maybeBomb.err || maybeEnemy.err) return state;
    const [_bomb, enemy] = [maybeBomb.val, maybeEnemy.val];

    if (enemy.health <= 0) return state;
    if (enemy.isDead) return state;

    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const addingRank = baseParams['rank.rank_when_kill_enemy_by_bomb'];
    const addingScore = baseParams['score.score_when_bomb_hit_to_enemy'];

    const damage = 9_999_999;
    const newEnemy = Im.update(enemy, 'health', h => h - damage);
    const newEffect = this.createBombHitEffectAttrs(enemy.pos);

    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.addRank(lv, addingRank)),
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.addScore(lv, addingScore)),
      state => BodiesHelper.putBodies(state, [newEnemy]),
      state => BodiesHelper.addBodyFromAttrsB(state, newEffect).state,
      state =>
        HitStopHelper.addHitStop(state, {
          target: {type: 'whole-world'},
          props: {type: 'constant', engineTimeDurationMs: 125, gameTimeDurationMs: 0},
        })
    )();
  }

  private createBombHitEffectAttrs(posBase: Vec2d) {
    const pos = posBase;
    return TEffect.newBombHitAttrs({pos});

    // const pos = posBase;
    // const angleRad = Math.random() * 2 * Math.PI;
    // const lineLength = unit * 128;

    // return TEffect.newBombHitAttrs({pos, angleRad, lineLength, lifeTimeMs: 100});
  }
}
