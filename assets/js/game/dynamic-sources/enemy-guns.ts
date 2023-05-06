import {DefineDynamicSourceItem, DefineDynamicSourceProps, DynamicSourceFunction, DynamicSourceId} from 'curtain-call3';
import {DataDef} from '../data-def';
import {EnemyGunTrain} from '../bodies/enemy-components/enemy-gun';
import {enemyGunAlpha} from '../bodies/enemy-components/enemy-guns/enemy-gun-alpha';
import {enemyGunBeta1} from '../bodies/enemy-components/enemy-guns/enemy-gun-beta-1';

type Def = DataDef;
type Type = 'enemyGuns';

export type EnemyGunProps = DefineDynamicSourceProps<{}>;
export type EnemyGunItem = DefineDynamicSourceItem<{
  id: string;
  gun: EnemyGunTrain;
}>;

export const enemyGunDynamicSource: Record<DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>> = {
  alpha: (_props, _state) => ({id: 'alpha', gun: enemyGunAlpha}),
  beta_1: (_props, _state) => ({id: 'beta_1', gun: enemyGunBeta1}),
};
