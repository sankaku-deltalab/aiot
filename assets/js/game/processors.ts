import {AllProcessorsState} from 'curtain-call3';
import {DataDef} from './data-def';
import {AiotDirector} from './director';

export const processors: AllProcessorsState<DataDef> = {
  director: {director: new AiotDirector()},
  dynamicSources: {
    dynamicSources: {},
  },
  minds: {
    minds: {},
  },
  procedures: {earlyProcedure: [], laterProcedure: []},
};
