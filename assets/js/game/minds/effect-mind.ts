import {
  Body,
  Collision,
  CollisionHelper,
  GameState,
  Graphic,
  Mind,
  MindArgs,
  TLineGraphic,
  TVec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {TEffect} from '../bodies/effect';
import {unit} from '../constants';

type Def = DataDef;
type BT = 'effect';
type Props = {};

export class EffectMind implements Mind<Def, BT, Props> {
  calcProps(_state: GameState<Def>, _body: Body<Def, BT>): Props {
    return {};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, _props: Props): Body<Def, BT> {
    return TEffect.updateElapsedTime(body, args.deltaMs);
  }

  mustDeleteSelf(body: Body<Def, BT>, _props: Props): boolean {
    return body.elapsedMs >= body.lifeTimeMs;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    switch (body.payload.type) {
      case 'shot-hit':
        return this.generateShotHitGraphics(body, props);
    }
    return [];
  }

  private generateShotHitGraphics(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    if (body.payload.type !== 'shot-hit') return [];
    const {pos, angleRad, lineLength} = body.payload;

    const offset = TVec2d.fromRadians(angleRad, lineLength / 2);
    const paths = [offset, TVec2d.mlt(offset, -1)];

    const thickness = (unit / 32) * (1 - TEffect.getLifeRate(body));
    const color = 0xffffff;

    return [
      TLineGraphic.create({
        key: 'main',
        pos,
        color: color,
        thickness,
        zIndex: 0,
        paths,
        closed: false,
      }),
    ];
  }

  generateCollision(_body: Body<Def, BT>, _props: Props): Collision {
    return CollisionHelper.createCollision({shapes: []});
  }
}
