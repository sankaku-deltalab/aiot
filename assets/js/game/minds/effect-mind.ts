import {Body, Collision, CollisionHelper, GameState, Graphic, Mind, MindArgs} from 'curtain-call3';
import {DataDef} from '../data-def';

type Def = DataDef;
type BT = 'effect';
type Props = {};

export class EffectMind implements Mind<Def, BT, Props> {
  calcProps(_state: GameState<Def>, _body: Body<Def, BT>): Props {
    return {};
  }

  updateBody(body: Body<Def, BT>, _args: MindArgs, _props: Props): Body<Def, BT> {
    return body;
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(_body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    return [];
  }

  generateCollision(_body: Body<Def, BT>, _props: Props): Collision {
    return CollisionHelper.createCollision({shapes: []});
  }
}
