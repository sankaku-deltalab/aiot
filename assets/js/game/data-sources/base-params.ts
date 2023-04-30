import {DefineDataSourceItem} from 'curtain-call3';
import {unit} from '../constants';

export type BaseParams = DefineDataSourceItem<{
  id: string;
  // playerBullet
  'player_bullet.collision_size': number;
  'player_bullet.rendering_size': number;
  'player_bullet.speed_mlt': number;
  'player_bullet.damage': number;
}>;

export const defaultBaseParams: BaseParams[] = [
  {
    id: 'default',
    'player_bullet.collision_size': unit / 8,
    'player_bullet.rendering_size': unit / 4,
    'player_bullet.speed_mlt': 1,
    'player_bullet.damage': 10,
  },
];
