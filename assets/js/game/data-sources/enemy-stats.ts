import {DefineDataSourceItem, Vec2d} from 'curtain-call3';

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
    health: 100,
    collision_size_unit_x: 1,
    collision_size_unit_y: 1,
    gunId: 'alpha',
  },
];
