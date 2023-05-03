import {BodiesHelper, BodyId, GameState, HitStopHelper, Im, OverlapsReducerProcedure, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;

export class BulletHitToPlayer extends OverlapsReducerProcedure<Def, 'bullet', 'player'> {
  leftBodyType: 'bullet' = 'bullet';
  rightBodyType: 'player' = 'player';

  applyOverlaps(
    state: GameState<Def>,
    bulletId: BodyId<Def, 'bullet'>,
    playerId: BodyId<Def, 'player'>
  ): GameState<Def> {
    console.log('hit');
    const maybeBullet = BodiesHelper.fetchBody(state, bulletId);
    const maybePlayer = BodiesHelper.fetchBody(state, playerId);

    if (maybeBullet.err || maybePlayer.err) return state;
    const [bullet, player] = [maybeBullet.val, maybePlayer.val];

    if (bullet.isPlayerSide) return state;
    if (bullet.isHit) return state;
    if (player.isHit) return state;
    if (player.isDead) return state;

    console.log('hit2');

    const newPlayer = Im.update(player, 'isHit', () => true);
    const newBullet = Im.update(bullet, 'isHit', () => true);
    return Im.pipe(
      () => state,
      state => BodiesHelper.putBodies(state, [newPlayer, newBullet]),
      state =>
        HitStopHelper.addHitStop(state, {
          target: {type: 'whole-world'},
          props: {type: 'constant', engineTimeDurationMs: 1000, gameTimeDurationMs: 0},
        })
    )();
  }
}
