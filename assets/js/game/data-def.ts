import {DefineDataDefinition} from 'curtain-call3';
import {Player} from './bodies/player';
import {AiotLevel} from './level';
import {Enemy} from './bodies/enemy';
import {Bullet} from './bodies/bullet';
import {Effect} from './bodies/effect';
import {PlayerGunItem, PlayerGunProps} from './dynamic-sources/player-guns';
import {BaseParams} from './data-sources/base-params';
import {EnemyGunItem, EnemyGunProps} from './dynamic-sources/enemy-guns';
import {EnemyStats} from './data-sources/enemy-stats';
import {Bomb} from './bodies/bomb';

export type DataDef = DefineDataDefinition<{
  level: AiotLevel;
  bodies: {
    player: Player;
    enemy: Enemy;
    bullet: Bullet;
    bomb: Bomb;
    effect: Effect;
  };
  dataSources: {
    baseParams: BaseParams;
    enemyStats: EnemyStats;
  };
  dynamicSources: {
    playerGuns: {
      props: PlayerGunProps;
      item: PlayerGunItem;
    };
    enemyGuns: {
      props: EnemyGunProps;
      item: EnemyGunItem;
    };
  };
  customInputs: {};
  notifications: {};
  representation: {
    status: {type: 'playing'} | {type: 'ended'; finalScore: number};
    rank: number;
  };
}>;
