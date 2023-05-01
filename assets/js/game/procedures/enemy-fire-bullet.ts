import {BodiesHelper, BodiesReducerProcedure, Body, DataSourceHelper, Enum, GameState, Im, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TBullet} from '../bodies/bullet';
import {unit, unitPerSec} from '../constants';

type Def = DataDef;
type BT = 'enemy';

export class EnemyFireBullet extends BodiesReducerProcedure<Def, 'enemy'> {
  type: 'enemy' = 'enemy';

  filterBody(_body: Body<Def, BT>, _state: GameState<Def>): boolean {
    return true;
  }

  applyBody(state: GameState<Def>, enemy: Body<Def, BT>): GameState<Def> {
    const fires = enemy.shotFiring.requestingFires;
    const newPlayer = Im.updateIn2(enemy, ['shotFiring', 'requestingFires'], () => []);

    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const collisionSize = baseParams['enemy_bullet.collision_size'];
    const renderingSize = baseParams['enemy_bullet.rendering_size'];
    const speedUnit = baseParams['enemy_bullet.speed_unit'];

    const bulletAttrsArray = Enum.map(fires, fire => {
      const speed = fire.values.speedMlt * speedUnit * unitPerSec;
      const directionRad = fire.values.angleRad;
      const alreadyMoved = TVec2d.fromRadians(directionRad, speed * fire.elapsedTimeMs);
      const pos = TVec2d.add(alreadyMoved, fire.values.pos);
      return TBullet.newAttrs({
        pos,
        speed: speed,
        collisionSize,
        directionRad,
        renderingSize,
        isPlayerSide: false,
        damage: 1,
      });
    });

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodiesFromAttrsB(state, bulletAttrsArray).state,
      state => BodiesHelper.putBody(state, newPlayer)
    )();
  }
}
