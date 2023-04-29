import {
  DefineDynamicSourceItem,
  DefineDynamicSourceProps,
  DynamicSourceFunction,
  DynamicSourceId,
  GameState,
  Vec2d,
} from 'curtain-call3';
import {PlayerGunTrain, playerGun} from '../bodies/player-components/player-gun';
import {DataDef} from '../data-def';

type Def = DataDef;
type Type = 'playerGuns';

export type PlayerGunProps = DefineDynamicSourceProps<{}>;
export type PlayerGunItem = DefineDynamicSourceItem<{
  id: string;
  gun: PlayerGunTrain;
}>;

export const playerGunDynamicSource: Record<DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>> = {
  default: (props: PlayerGunProps, state: GameState<Def>) => ({id: 'default', gun: playerGun}),
};
