import {BodiesHelper, BodiesReducerProcedure, Body, GameState, HitStopHelper, Im, Vec2d} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TEffect} from '../bodies/effect';

type Def = DataDef;
type BT = 'player';

export class KillPlayerIfShouldDie extends BodiesReducerProcedure<Def, 'player'> {
  type: 'player' = 'player';

  filterBody(_body: Body<Def, BT>, _state: GameState<Def>): boolean {
    return true;
  }

  applyBody(state: GameState<Def>, player: Body<Def, BT>): GameState<Def> {
    const shouldDie = player.hitLog.size > 0 && !player.isDead;
    if (!shouldDie) return state;

    const deathEffect = this.createPlayerDeathEffectAttrs(player.pos);

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodyFromAttrsB(state, deathEffect).state,
      state =>
        BodiesHelper.putBody(
          state,
          Im.update(player, 'isDead', () => true)
        ),
      state =>
        HitStopHelper.addHitStop(state, {
          target: {type: 'whole-world'},
          props: {type: 'constant', engineTimeDurationMs: 500, gameTimeDurationMs: 0},
        })
    )();
  }

  private createPlayerDeathEffectAttrs(posBase: Vec2d) {
    const pos = posBase;

    return TEffect.newPlayerDeathAttrs({pos, lifeTimeMs: 400, lineLifeTimeMs: 200});
  }
}
