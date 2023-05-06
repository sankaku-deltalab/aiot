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
import {TBomb} from '../bodies/bomb';

type Def = DataDef;
type BT = 'bomb';
type Props = {};

export class BombMind implements Mind<Def, BT, Props> {
  calcProps(_state: GameState<Def>, _body: Body<Def, BT>): Props {
    return {};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, _props: Props): Body<Def, BT> {
    return Im.pipe(
      () => body,
      body => TBomb.updateElapsedMs(body, args.deltaMs),
      body => TBomb.updateSize(body, args.deltaMs)
    )();
  }

  mustDeleteSelf(body: Body<Def, BT>, _props: Props): boolean {
    return body.elapsedMs >= body.lifeTimeMs;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    return [this.generateMainGraphic(body, props)];
  }

  private generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def> {
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), body.size);
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
    const collisionSize = body.size;
    const rect = TAaRect2d.fromCenterAndSize(body.pos, collisionSize);
    const mainShape = CollisionHelper.createAaRectShape(rect);
    return CollisionHelper.createCollision({shapes: [mainShape], excess: false});
  }
}
