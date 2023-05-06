import {AllProcessorsState} from 'curtain-call3';
import {DataDef} from './data-def';
import {AiotDirector} from './director';
import {PlayerMind} from './minds/player-mind';
import {EnemyMind} from './minds/enemy-mind';
import {BulletMind} from './minds/bullet-mind';
import {EffectMind} from './minds/effect-mind';
import {playerGunDynamicSource} from './dynamic-sources/player-guns';
import {PlayerFireBullet} from './procedures/player-fire-bullet';
import {enemyGunDynamicSource} from './dynamic-sources/enemy-guns';
import {BulletHitToEnemy} from './procedures/bullet-hit-to-enemy';
import {KillEnemyIfShouldDie} from './procedures/kill-enemy-if-should-die';
import {EnemyFireBullet} from './procedures/enemy-fire-bullet';
import {BulletHitToPlayer} from './procedures/bullet-hit-to-player';
import {KillPlayerIfShouldDie} from './procedures/kill-player-if-should-die';
import {BombMind} from './minds/bomb-mind';
import {PlayerFireBomb} from './procedures/player-fire-bomb';
import {BombHitToEnemy} from './procedures/bomb-hit-to-enemy';
import {BombHitToEnemyBullet} from './procedures/bomb-hit-to-enemy-bullet';

export const processors: AllProcessorsState<DataDef> = {
  director: {director: new AiotDirector()},
  dynamicSources: {
    dynamicSources: {
      playerGuns: playerGunDynamicSource,
      enemyGuns: enemyGunDynamicSource,
    },
  },
  minds: {
    minds: {
      player: new PlayerMind(),
      enemy: new EnemyMind(),
      bullet: new BulletMind(),
      bomb: new BombMind(),
      effect: new EffectMind(),
    },
  },
  procedures: {
    earlyProcedure: [],
    laterProcedure: [
      new PlayerFireBomb(),
      new BombHitToEnemy(),
      new BombHitToEnemyBullet(),
      new PlayerFireBullet(),
      new BulletHitToEnemy(),
      new KillEnemyIfShouldDie(),
      new EnemyFireBullet(),
      new BulletHitToPlayer(),
      new KillPlayerIfShouldDie(),
    ],
  },
};
