import {AllProcessorsState} from 'curtain-call3';
import {DataDef} from './data-def';
import {AiotDirector} from './director';
import {PlayerMind} from './minds/player-mind';
import {EnemyMind} from './minds/enemy-mind';
import {BulletMind} from './minds/bullet-mind';
import {EffectMind} from './minds/effect-mind';
import {playerGunDynamicSource} from './dynamic-sources/player-guns';
import {PlayerFireBullet} from './procedures/player-fire-bullet';

export const processors: AllProcessorsState<DataDef> = {
  director: {director: new AiotDirector()},
  dynamicSources: {
    dynamicSources: {
      playerGuns: playerGunDynamicSource,
    },
  },
  minds: {
    minds: {
      player: new PlayerMind(),
      enemy: new EnemyMind(),
      bullet: new BulletMind(),
      effect: new EffectMind(),
    },
  },
  procedures: {earlyProcedure: [], laterProcedure: [new PlayerFireBullet()]},
};
