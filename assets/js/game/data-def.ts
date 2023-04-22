import {DefineDataDefinition} from 'curtain-call3';
import {Player} from './bodies/player';

export type DataDef = DefineDataDefinition<{
  level: {};
  bodies: {
    // player: Player;
  };
  dataSources: {};
  dynamicSources: {};
  customInputs: {};
  notifications: {};
  representation: {};
}>;
