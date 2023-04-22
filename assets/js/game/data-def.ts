import {DefineDataDefinition} from 'curtain-call3';
import {Player} from './bodies/player';
import {AiotLevel} from './level';

export type DataDef = DefineDataDefinition<{
  level: AiotLevel;
  bodies: {
    // player: Player;
  };
  dataSources: {};
  dynamicSources: {};
  customInputs: {};
  notifications: {};
  representation: {
    status: {type: 'playing'} | {type: 'ended'; finalScore: number};
  };
}>;
