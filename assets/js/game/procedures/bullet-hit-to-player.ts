import {BodiesHelper, BodyId, GameState, Im, OverlapsReducerProcedure, TImList, Vec2d} from 'curtain-call3';
import {DataDef} from '../data-def';
import {unit} from '../constants';
import {TEffect} from '../bodies/effect';

type Def = DataDef;

export class BulletHitToPlayer extends OverlapsReducerProcedure<Def, 'bullet', 'player'> {
  leftBodyType: 'bullet' = 'bullet';
  rightBodyType: 'player' = 'player';

  applyOverlaps(
    state: GameState<Def>,
    bulletId: BodyId<Def, 'bullet'>,
    playerId: BodyId<Def, 'player'>
  ): GameState<Def> {
    const maybeBullet = BodiesHelper.fetchBody(state, bulletId);
    const maybePlayer = BodiesHelper.fetchBody(state, playerId);

    if (maybeBullet.err || maybePlayer.err) return state;
    const [bullet, player] = [maybeBullet.val, maybePlayer.val];

    if (bullet.isPlayerSide) return state;
    if (bullet.isHit) return state;

    if (player.hitLog.size > 0) return state;
    if (player.isDead) return state;

    const newPlayer = Im.update(player, 'hitLog', log => TImList.push(log, {worldTimeMs: state.time.gameTimeMs}));
    const newBullet = Im.update(bullet, 'isHit', () => true);
    const newEffect = this.createPlayerHitEffectAttrs(player.pos);

    return Im.pipe(
      () => state,
      state => BodiesHelper.putBodies(state, [newPlayer, newBullet]),
      state => BodiesHelper.addBodyFromAttrsB(state, newEffect).state
    )();
  }

  private createPlayerHitEffectAttrs(posBase: Vec2d) {
    const pos = posBase;
    const angleRad = Math.random() * 2 * Math.PI;
    const lineLength = unit * 128;

    return TEffect.newPlayerHitAttrs({pos, angleRad, lineLength, lifeTimeMs: 100});
  }
}
