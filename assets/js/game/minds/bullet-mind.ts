import {
  Body,
  Collision,
  CollisionHelper,
  GameState,
  Graphic,
  Im,
  Mind,
  MindArgs,
  TAaRect2d,
  TLineGraphic,
  TVec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TBullet} from '../bodies/bullet';
import {gameAreaRect} from '../constants';

type Def = DataDef;
type BT = 'bullet';
type Props = {};

export class BulletMind implements Mind<Def, BT, Props> {
  calcProps(_state: GameState<Def>, _body: Body<Def, BT>): Props {
    return {};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, _props: Props): Body<Def, BT> {
    return Im.pipe(
      () => body,
      body => TBullet.updatePos(body, args.deltaMs)
    )();
  }

  mustDeleteSelf(body: Body<Def, BT>, _props: Props): boolean {
    const bulletSize = TVec2d.mlt({x: 1, y: 1}, body.renderingSize * 2);
    const bulletRect = TAaRect2d.fromCenterAndSize(body.pos, bulletSize);
    const lifeArea = TAaRect2d.reduceArea(gameAreaRect, bulletSize);
    const isNotInLifeArea = TAaRect2d.isOutOf(bulletRect, lifeArea);

    const isHit = body.isHit;
    return isNotInLifeArea || isHit;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    return [this.generateMainGraphic(body, props)];
  }

  private generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def> {
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), TVec2d.mlt({x: 1, y: 1}, body.renderingSize));
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color = 0xaaaaaa;

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
    const collisionSize = TVec2d.mlt({x: 1, y: 1}, body.collisionSize);
    const rect = TAaRect2d.fromCenterAndSize(body.pos, collisionSize);
    const mainShape = CollisionHelper.createAaRectShape(rect);
    return CollisionHelper.createCollision({shapes: [mainShape]});
  }
}
