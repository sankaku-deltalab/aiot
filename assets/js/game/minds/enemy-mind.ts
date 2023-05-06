import {
  BodiesHelper,
  Body,
  Collision,
  CollisionHelper,
  DynamicSourceHelper,
  GameState,
  Graphic,
  Im,
  LevelHelper,
  Mind,
  MindArgs,
  Result,
  TAaRect2d,
  TLineGraphic,
  TVec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {EnemyGunTrain} from '../bodies/enemy-components/enemy-gun';
import {TEnemy} from '../bodies/enemy';
import {Player} from '../bodies/player';
import {unit} from '../constants';

type Def = DataDef;
type BT = 'enemy';
type Props = {
  rank: number;
  gun: EnemyGunTrain;
  target: Result<Player>;
};

export class EnemyMind implements Mind<Def, BT, Props> {
  calcProps(state: GameState<Def>, body: Body<Def, BT>): Props {
    const {rank} = LevelHelper.getLevel(state);
    const {gun} = DynamicSourceHelper.fetchB(state, 'enemyGuns', body.gunId, {});
    const target = this.searchTargetForProps(state, body);
    return {rank, gun, target};
  }

  private searchTargetForProps(state: GameState<Def>, _body: Body<Def, BT>): Result<Player> {
    // currently, using auto targeting.
    // const targetId = body.targetId;  // maybe should use it
    return BodiesHelper.getFirstBodyInType(state, 'player');
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, props: Props): Body<Def, BT> {
    const {deltaMs} = args;
    const {rank, gun, target} = props;

    return Im.pipe(
      () => body,
      body => TEnemy.updateElapsedTime(body, deltaMs),
      body => TEnemy.maybeUpdateFiring(body, {deltaMs, rank, gun, target})
    )();
  }

  mustDeleteSelf(body: Body<Def, BT>, _props: Props): boolean {
    return body.isDead;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    return [this.generateMainGraphic(body, props)];
  }

  private generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def> {
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), {x: unit / 2, y: unit / 2});
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color = 0x444444;

    return TLineGraphic.create({
      key: 'main',
      pos: body.pos,
      color: color,
      thickness: 10,
      zIndex: 0,
      paths,
      closed: true,
    });
  }

  generateCollision(body: Body<Def, BT>, _props: Props): Collision {
    const rect = TAaRect2d.fromCenterAndSize(body.pos, body.collisionSize);
    const mainShape = CollisionHelper.createAaRectShape(rect);
    return CollisionHelper.createCollision({shapes: [mainShape]});
  }
}
