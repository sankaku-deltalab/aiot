import {
  Body,
  Collision,
  CollisionHelper,
  GameState,
  Graphic,
  Im,
  InputHelper,
  Mind,
  MindArgs,
  TAaRect2d,
  TLineGraphic,
  TVec2d,
  Vec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {gameAreaRect, unit} from '../constants';

type Def = DataDef;
type BT = 'player';
type Props = {
  pointerDelta: Vec2d;
};

const playerSize = {x: unit / 2, y: unit / 2};

export class PlayerMind implements Mind<Def, BT, Props> {
  calcProps(state: GameState<Def>, _body: Body<Def, BT>): Props {
    const pointerDelta = InputHelper.pointerDeltaWhileDown(state);
    return {pointerDelta};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, props: Props): Body<Def, BT> {
    return Im.pipe(
      () => body,
      body => this.updatePos(body, args, props)
    )();
  }

  private updatePos(body: Body<Def, BT>, _args: MindArgs, props: Props): Body<Def, BT> {
    const movableArea = TAaRect2d.reduceArea(gameAreaRect, playerSize);
    return Im.pipe(
      () => body,
      body =>
        Im.update(body, 'pos', p =>
          Im.pipe(
            () => p,
            p => TVec2d.add(p, props.pointerDelta),
            p => TAaRect2d.clampPosition(p, movableArea)
          )()
        )
    )();
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    const corners = TAaRect2d.corners(gameAreaRect);
    const paths = [corners.nw, corners.se, corners.ne, corners.sw];

    return [
      this.generateMainGraphic(body, props),
      TLineGraphic.create({
        key: 'area',
        pos: TVec2d.zero(),
        color: 0x4444aa,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }

  private generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def> {
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), playerSize);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    return TLineGraphic.create({
      key: 'main',
      pos: body.pos,
      color: 0x4444aa,
      thickness: 10,
      zIndex: 0,
      paths,
      closed: true,
    });
  }

  generateCollision(_body: Body<Def, BT>, _props: Props): Collision {
    return CollisionHelper.createCollision({shapes: []});
  }
}
