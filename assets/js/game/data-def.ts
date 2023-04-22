import {DefineDataDefinition} from 'curtain-call3';
import {Player} from './bodies/player';
import {AiotLevel} from './level';
import {Enemy} from './bodies/enemy';
import {Bullet} from './bodies/bullet';
import {Effect} from './bodies/effect';

export type DataDef = DefineDataDefinition<{
  level: AiotLevel;
  bodies: {
    player: Player;
    enemy: Enemy;
    bullet: Bullet;
    effect: Effect;
  };
  dataSources: {};
  dynamicSources: {};
  customInputs: {};
  notifications: {};
  representation: {
    status: {type: 'playing'} | {type: 'ended'; finalScore: number};
  };
}>;
