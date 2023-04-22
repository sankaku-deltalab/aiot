import {AllProcessorsState} from 'curtain-call3';
import {DataDef} from './data-def';
import {AiotDirector} from './director';
import {PlayerMind} from './minds/player-mind';
import {EnemyMind} from './minds/enemy-mind';
import {BulletMind} from './minds/bullet-mind';
import {EffectMind} from './minds/effect-mind';

export const processors: AllProcessorsState<DataDef> = {
  director: {director: new AiotDirector()},
  dynamicSources: {
    dynamicSources: {},
  },
  minds: {
    minds: {
      player: new PlayerMind(),
      enemy: new EnemyMind(),
      bullet: new BulletMind(),
      effect: new EffectMind(),
    },
  },
  procedures: {earlyProcedure: [], laterProcedure: []},
};
