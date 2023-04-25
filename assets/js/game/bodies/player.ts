import {BodyAttrs, Vec2d} from 'curtain-call3';

export type Player = {
  id: ['player', string];
  bodyType: 'player';
  pos: Vec2d;
};

type PlayerAttrs = Omit<Player, 'id'>;

export class TPlayer {
  static newAttrs(opt: {pos: Vec2d}): PlayerAttrs {
    return {
      bodyType: 'player',
      pos: opt.pos,
    };
  }
}
