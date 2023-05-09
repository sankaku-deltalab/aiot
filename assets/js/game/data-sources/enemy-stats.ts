import {DefineDataSourceItem} from 'curtain-call3';

export type EnemyStats = DefineDataSourceItem<{
  id: string;
  health: number;
  collision_size_unit_x: number;
  collision_size_unit_y: number;
  gunId: string;
}>;

export const defaultEnemyStats: EnemyStats[] = [
  {
    id: 'alpha',
    health: 30,
    collision_size_unit_x: 0.5,
    collision_size_unit_y: 0.5,
    gunId: 'alpha',
  },
  {
    id: 'beta_1',
    health: 50,
    collision_size_unit_x: 1,
    collision_size_unit_y: 0.75,
    gunId: 'beta_1',
  },
];
