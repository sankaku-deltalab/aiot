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
import {unit} from '../constants';

type Def = DataDef;
type BT = 'player';
type Props = {
  pointerDelta: Vec2d;
};

export class PlayerMind implements Mind<Def, BT, Props> {
  calcProps(state: GameState<Def>, _body: Body<Def, BT>): Props {
    const pointerDelta = InputHelper.pointerDeltaWhileDown(state);
    return {pointerDelta};
  }

  updateBody(body: Body<Def, BT>, _args: MindArgs, props: Props): Body<Def, BT> {
    return Im.pipe(
      () => body,
      body => Im.update(body, 'pos', p => TVec2d.add(p, props.pointerDelta))
    )();
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    const size = {x: unit / 2, y: unit / 2};
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), size);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];
    return [
      TLineGraphic.create({
        key: 'main',
        pos: body.pos,
        color: 0x4444aa,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }

  generateCollision(_body: Body<Def, BT>, _props: Props): Collision {
    return CollisionHelper.createCollision({shapes: []});
  }
}
