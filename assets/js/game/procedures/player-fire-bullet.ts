import {BodiesHelper, BodiesReducerProcedure, Body, DataSourceHelper, Enum, GameState, Im, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TBullet} from '../bodies/bullet';

type Def = DataDef;
type BT = 'player';

export class PlayerFireBullet extends BodiesReducerProcedure<Def, 'player'> {
  type: 'player' = 'player';

  filterBody(_body: Body<Def, BT>, _state: GameState<Def>): boolean {
    return true;
  }

  applyBody(state: GameState<Def>, player: Body<Def, BT>): GameState<Def> {
    const fires = player.shotFiring.requestingFires;
    const newPlayer = Im.updateIn2(player, ['shotFiring', 'requestingFires'], () => []);

    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const collisionSize = baseParams['player_bullet.collision_size'];
    const renderingSize = baseParams['player_bullet.rendering_size'];
    const speedMlt = baseParams['player_bullet.speed_mlt'];
    const damage = baseParams['player_bullet.damage'];

    const bulletAttrsArray = Enum.map(fires, fire => {
      const speed = fire.values.speed * speedMlt;
      const directionRad = fire.values.angleRad;
      const alreadyMoved = TVec2d.fromRadians(directionRad, speed * fire.elapsedTimeMs);
      const pos = TVec2d.add(alreadyMoved, fire.values.pos);
      return TBullet.newAttrs({
        pos,
        speed: speed,
        collisionSize,
        directionRad,
        renderingSize,
        isPlayerSide: true,
        damage,
      });
    });

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodiesFromAttrsB(state, bulletAttrsArray).state,
      state => BodiesHelper.putBody(state, newPlayer)
    )();
  }
}
