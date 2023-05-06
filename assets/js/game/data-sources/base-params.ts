import {DefineDataSourceItem} from 'curtain-call3';
import {unit} from '../constants';

export type BaseParams = DefineDataSourceItem<{
  id: string;
  // game_progress
  'game_progress.intro_time_ms': number;
  'game_progress.game_time_up_duration_ms': number;
  'game_progress.player_death_hit_stop_duration_ms': number;
  'game_progress.player_death_slow_motion_duration_ms': number;
  // player_bullet
  'player_bullet.collision_size': number;
  'player_bullet.rendering_size': number;
  'player_bullet.speed_mlt': number;
  'player_bullet.damage': number;
  // enemy_bullet
  'enemy_bullet.collision_size': number;
  'enemy_bullet.rendering_size': number;
  'enemy_bullet.speed_unit': number;
  // rank
  'rank.rank_when_kill_enemy_by_bomb': number;
  'rank.rank_when_fire_bomb': number;
}>;

export const defaultBaseParams: BaseParams[] = [
  {
    id: 'default',
    // game_progress
    'game_progress.intro_time_ms': 1000,
    'game_progress.game_time_up_duration_ms': 10000,
    'game_progress.player_death_hit_stop_duration_ms': 500,
    'game_progress.player_death_slow_motion_duration_ms': 2500,
    // player_bullet
    'player_bullet.collision_size': unit / 8,
    'player_bullet.rendering_size': unit / 4,
    'player_bullet.speed_mlt': 1,
    'player_bullet.damage': 10,
    // enemy_bullet
    'enemy_bullet.collision_size': unit / 8,
    'enemy_bullet.rendering_size': unit / 4,
    'enemy_bullet.speed_unit': 2,
    // rank
    'rank.rank_when_kill_enemy_by_bomb': 2,
    'rank.rank_when_fire_bomb': 10,
  },
];
