import {BodiesHelper, BodiesReducerProcedure, Body, DataSourceHelper, GameState, Im, LevelHelper} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TPlayer} from '../bodies/player';
import {TBomb} from '../bodies/bomb';
import {unitPerSec} from '../constants';
import {TAiotLevel} from '../level';

type Def = DataDef;
type BT = 'player';

export class PlayerFireBomb extends BodiesReducerProcedure<Def, 'player'> {
  type: 'player' = 'player';

  filterBody(_body: Body<Def, BT>, _state: GameState<Def>): boolean {
    return true;
  }

  applyBody(state: GameState<Def>, player: Body<Def, BT>): GameState<Def> {
    if (player.firingState.type !== 'bomb-firing') return state;

    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const addingRank = baseParams['rank.rank_when_fire_bomb'];

    const newPlayer = TPlayer.bombFired(player);

    const lifeTimeMs = 500;
    const sizeUpSpeed = unitPerSec * 32;
    const bombAttrs = TBomb.newAttrs({pos: player.pos, sizeUpSpeed, lifeTimeMs});

    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.addRank(lv, addingRank)),
      state => BodiesHelper.addBodyFromAttrsB(state, bombAttrs).state,
      state => BodiesHelper.putBody(state, newPlayer)
    )();
  }
}
