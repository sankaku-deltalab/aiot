import {
  Body,
  Collision,
  CollisionHelper,
  DataSourceHelper,
  DynamicSourceHelper,
  GameState,
  Graphic,
  Im,
  InputHelper,
  LevelHelper,
  Mind,
  MindArgs,
  TAaRect2d,
  Vec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {unit} from '../constants';
import {TPlayer} from '../bodies/player';
import {PlayerGunTrain} from '../bodies/player-components/player-gun';
import {PlayerMindGraphic} from './player-mind-components/player-mind-graphic';
import {TAiotLevel} from '../level';

type Def = DataDef;
type BT = 'player';
type Props = {
  pointerDelta: Vec2d;
  gun: PlayerGunTrain;
  bombChargeTimeMs: number;
};

const playerSize = {x: unit / 2, y: unit / 2};
const collisionSize = {x: unit / 8, y: unit / 8};

export class PlayerMind implements Mind<Def, BT, Props> {
  calcProps(state: GameState<Def>, _body: Body<Def, BT>): Props {
    const pointerDelta = InputHelper.pointerDeltaWhileDown(state);

    const {gun} = DynamicSourceHelper.fetchB(state, 'playerGuns', 'default', {});
    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');

    const rankRate = TAiotLevel.getRankRate(LevelHelper.getLevel(state));
    const bombChargeTimeMs =
      rankRate * baseParams['bomb.charge_time_ms_max'] + (1 - rankRate) * baseParams['bomb.charge_time_ms_min'];

    return {pointerDelta, gun, bombChargeTimeMs};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, props: Props): Body<Def, BT> {
    const {deltaMs} = args;
    const {pointerDelta, gun} = props;

    return Im.pipe(
      () => body,
      body => TPlayer.updateElapsedTime(body, deltaMs),
      body => TPlayer.updatePos(body, pointerDelta, deltaMs),
      body => TPlayer.updateFiringTrail(body),
      body => TPlayer.maybeUpdateFiring(body, gun, deltaMs),
      body => TPlayer.maybeChargeBomb(body, deltaMs, props.bombChargeTimeMs)
    )();
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    return PlayerMindGraphic.generateGraphics(body, props);
  }

  generateCollision(body: Body<Def, BT>, _props: Props): Collision {
    const rect = TAaRect2d.fromCenterAndSize(body.pos, collisionSize);
    const mainShape = CollisionHelper.createAaRectShape(rect);
    return CollisionHelper.createCollision({shapes: [mainShape]});
  }
}
