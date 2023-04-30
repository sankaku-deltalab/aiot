import {DefineDataSourceItem} from 'curtain-call3';

export type EnemyStats = DefineDataSourceItem<{
  id: string;
  health: number;
  gunId: string;
}>;

export const defaultEnemyStats: EnemyStats[] = [
  {
    id: 'alpha',
    health: 100,
    gunId: 'alpha',
  },
];
