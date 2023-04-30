import {
  DefineDynamicSourceItem,
  DefineDynamicSourceProps,
  DynamicSourceFunction,
  DynamicSourceId,
  GameState,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {EnemyGunTrain} from '../bodies/enemy-components/enemy-gun';
import {enemyGunAlpha} from '../bodies/enemy-components/enemy-guns/enemy-gun-alpha';

type Def = DataDef;
type Type = 'enemyGuns';

export type EnemyGunProps = DefineDynamicSourceProps<{}>;
export type EnemyGunItem = DefineDynamicSourceItem<{
  id: string;
  gun: EnemyGunTrain;
}>;

export const enemyGunDynamicSource: Record<DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>> = {
  alpha: (props: EnemyGunProps, state: GameState<Def>) => ({id: 'alpha', gun: enemyGunAlpha}),
};
