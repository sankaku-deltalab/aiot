import {BodyAttrs, DataSourceHelper, Enum, GameState, Im, LevelHelper, TVec2d} from 'curtain-call3';
import {DataDef} from '../data-def';
import {gameAreaSize, unit} from '../constants';
import {TEnemy} from '../bodies/enemy';

type Def = DataDef;

export type EnemySpawner = {
  // 100 になったらアルファをスポーン
  spawnChargeAlpha: number;
  // 100 になったら非アルファをスポーン
  spawnChargeNotAlpha: number;
};

export class TEnemySpawner {
  static new(): EnemySpawner {
    return {
      spawnChargeAlpha: 0,
      spawnChargeNotAlpha: 0,
    };
  }

  static getChargeAmountPerSecByTimeAlpha(state: GameState<Def>): number {
    // TODO: この辺は DynamicSource でやるべきでは？
    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const min = baseParams['enemy_spawning.alpha.charge_amount_per_sec.min'];
    const max = baseParams['enemy_spawning.alpha.charge_amount_per_sec.max'];

    const {rank} = LevelHelper.getLevel(state);

    const rankRate = rank / 100;
    return rankRate * max + (1 - rankRate) * min;
  }

  static getChargeAmountPerSecByTimeNotAlpha(state: GameState<Def>): number {
    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const min = baseParams['enemy_spawning.not_alpha.charge_amount_per_sec.min'];
    const max = baseParams['enemy_spawning.not_alpha.charge_amount_per_sec.max'];

    const {rank} = LevelHelper.getLevel(state);

    const rankRate = rank / 100;
    return rankRate * max + (1 - rankRate) * min;
  }

  static getChargeAmountByEnemyDeath(state: GameState<Def>): number {
    const baseParams = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const min = baseParams['enemy_spawning.charge_amount_by_enemy_death.min'];
    const max = baseParams['enemy_spawning.charge_amount_by_enemy_death.max'];

    const {rank} = LevelHelper.getLevel(state);

    const rankRate = rank / 100;
    return rankRate * max + (1 - rankRate) * min;
  }

  static chargeByTime(
    state: EnemySpawner,
    opt: {chargeAmountPerSecAlpha: number; chargeAmountPerSecNotAlpha: number; deltaMs: number}
  ): EnemySpawner {
    const chargeAmountAlpha = (opt.chargeAmountPerSecAlpha / 1000) * opt.deltaMs;
    const chargeAmountNotAlpha = (opt.chargeAmountPerSecNotAlpha / 1000) * opt.deltaMs;

    return {
      ...state,
      spawnChargeAlpha: state.spawnChargeAlpha + chargeAmountAlpha,
      spawnChargeNotAlpha: state.spawnChargeNotAlpha + chargeAmountNotAlpha,
    };
  }

  static chargeByEnemyDeath(
    state: EnemySpawner,
    opt: {
      chargeAmount: number;
    }
  ): EnemySpawner {
    return Im.update(state, 'spawnChargeAlpha', c => c + opt.chargeAmount);
  }

  static consumeSpawning(spawner: EnemySpawner, state: GameState<Def>): [EnemySpawner, BodyAttrs<Def, 'enemy'>[]] {
    return Im.pipe(
      () => spawner,
      spawner => this.consumeSpawningAlpha(spawner, state),
      ([spawner, enemies]): [EnemySpawner, BodyAttrs<Def, 'enemy'>[]] => {
        const [sp, en] = this.consumeSpawningNotAlpha(spawner, state);
        return [sp, [...enemies, ...en]];
      }
    )();
  }

  private static consumeSpawningAlpha(
    spawner: EnemySpawner,
    state: GameState<Def>
  ): [EnemySpawner, BodyAttrs<Def, 'enemy'>[]] {
    const spawnCount = Math.floor(spawner.spawnChargeAlpha / 100);
    const newState = {
      ...spawner,
      spawnChargeAlpha: spawner.spawnChargeAlpha - spawnCount * 100,
    };

    const stats = DataSourceHelper.fetchB(state, 'enemyStats', 'alpha');
    const collisionSize = TVec2d.mlt({x: stats.collision_size_unit_x, y: stats.collision_size_unit_y}, unit);
    const enemiesAttrs = Enum.map(Im.range(0, spawnCount), () => {
      const rY = Math.random();
      const yStart = 0;
      const yEnd = -(gameAreaSize.y / 2 - unit);
      const spawnPos = {
        x: (Math.random() - 0.5) * (gameAreaSize.x - 2 * unit),
        y: rY * yEnd + (1 - rY) * yStart,
      };
      return TEnemy.newAttrs({
        pos: spawnPos,
        statId: stats.id,
        health: stats.health,
        collisionSize,
        gunId: stats.gunId,
        startFireDelayMs: 500,
      });
    });

    return [newState, enemiesAttrs];
  }

  private static consumeSpawningNotAlpha(
    spawner: EnemySpawner,
    state: GameState<Def>
  ): [EnemySpawner, BodyAttrs<Def, 'enemy'>[]] {
    const spawnCount = Math.floor(spawner.spawnChargeNotAlpha / 100);
    const newState = {
      ...spawner,
      spawnChargeNotAlpha: spawner.spawnChargeNotAlpha - spawnCount * 100,
    };

    const stats = DataSourceHelper.fetchB(state, 'enemyStats', 'beta_1');
    const collisionSize = TVec2d.mlt({x: stats.collision_size_unit_x, y: stats.collision_size_unit_y}, unit);
    const enemiesAttrs = Enum.map(Im.range(0, spawnCount), () => {
      const rY = Math.random();
      const yStart = 0;
      const yEnd = -(gameAreaSize.y / 2 - unit);
      const spawnPos = {
        x: (Math.random() - 0.5) * (gameAreaSize.x - 2 * unit),
        y: rY * yEnd + (1 - rY) * yStart,
      };
      return TEnemy.newAttrs({
        pos: spawnPos,
        statId: stats.id,
        health: stats.health,
        collisionSize,
        gunId: stats.gunId,
        startFireDelayMs: 500,
      });
    });

    return [newState, enemiesAttrs];
  }
}
