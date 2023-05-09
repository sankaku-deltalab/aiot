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
  // bomb
  'bomb.charge_time_ms_min': number;
  'bomb.charge_time_ms_max': number;
  // enemy_bullet
  'enemy_bullet.collision_size': number;
  'enemy_bullet.rendering_size': number;
  'enemy_bullet.speed_unit': number;
  // enemy_spawning
  'enemy_spawning.alpha.charge_amount_per_sec.min': number;
  'enemy_spawning.alpha.charge_amount_per_sec.max': number;
  'enemy_spawning.not_alpha.charge_amount_per_sec.min': number;
  'enemy_spawning.not_alpha.charge_amount_per_sec.max': number;
  'enemy_spawning.charge_amount_by_enemy_death.min': number;
  'enemy_spawning.charge_amount_by_enemy_death.max': number;
  // rank
  'rank.rank_when_kill_enemy_by_bomb': number;
  'rank.rank_when_fire_bomb': number;
  // score
  'score.score_when_shot_hit_to_enemy': number;
  'score.score_when_bomb_hit_to_enemy': number;
}>;

export const defaultBaseParams: BaseParams[] = [
  {
    id: 'default',
    // game_progress
    'game_progress.intro_time_ms': 100,
    'game_progress.game_time_up_duration_ms': 60_000,
    'game_progress.player_death_hit_stop_duration_ms': 500,
    'game_progress.player_death_slow_motion_duration_ms': 2500,
    // player_bullet
    'player_bullet.collision_size': unit / 8,
    'player_bullet.rendering_size': unit / 4,
    'player_bullet.speed_mlt': 1.5,
    'player_bullet.damage': 5, // 100 damage per sec
    // bomb
    'bomb.charge_time_ms_min': 1000,
    'bomb.charge_time_ms_max': 5000,
    // enemy_bullet
    'enemy_bullet.collision_size': unit / 8,
    'enemy_bullet.rendering_size': unit / 4,
    'enemy_bullet.speed_unit': 2,
    // enemy_spawning
    'enemy_spawning.alpha.charge_amount_per_sec.min': 0,
    'enemy_spawning.alpha.charge_amount_per_sec.max': 50,
    'enemy_spawning.not_alpha.charge_amount_per_sec.min': 100,
    'enemy_spawning.not_alpha.charge_amount_per_sec.max': 120,
    'enemy_spawning.charge_amount_by_enemy_death.min': 100,
    'enemy_spawning.charge_amount_by_enemy_death.max': 200,
    // rank
    'rank.rank_when_kill_enemy_by_bomb': 2,
    'rank.rank_when_fire_bomb': 10,
    // score
    'score.score_when_shot_hit_to_enemy': 1,
    'score.score_when_bomb_hit_to_enemy': 100,
  },
];
