import {BodiesHelper, BodyAttrs, DataSourceHelper, DefineLevel, GameState, Im} from 'curtain-call3';
import {GameProgressAutomaton, GameProgressState} from './level-components/game-progress-automaton';
import {DataDef} from './data-def';
import {EnemySpawner, TEnemySpawner} from './level-components/enemy-spawner';
import {Enemy} from './bodies/enemy';

type Def = DataDef;

export type AiotLevel = DefineLevel<{
  state: GameProgressState;
  elapsedTimeMs: number;
  rank: number;
  enemySpawner: EnemySpawner;
  score: number;
}>;

export class TAiotLevel {
  static new(): AiotLevel {
    return {state: GameProgressAutomaton.new(), elapsedTimeMs: 0, rank: 0, enemySpawner: TEnemySpawner.new(), score: 0};
  }

  static update(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    return Im.pipe(
      () => level,
      level => this.updateElapsedMs(level, deltaMs),
      level => this.maybeEndIntro(level, deltaMs, state),
      level => this.maybeGameClear(level, deltaMs, state),
      level => this.maybeStartPlayerDeath(level, deltaMs, state),
      level => this.maybeEndPlayerDeath(level, deltaMs, state),
      level => this.updateEnemySpawningCharge(level, deltaMs, state)
    )();
  }

  private static updateElapsedMs(level: AiotLevel, deltaMs: number): AiotLevel {
    return Im.update(level, 'elapsedTimeMs', t => t + deltaMs);
  }

  private static maybeEndIntro(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    const introEndTime = DataSourceHelper.fetchB(state, 'baseParams', 'default')['game_progress.intro_time_ms'];
    const prevTime = level.elapsedTimeMs - deltaMs;
    if (prevTime < introEndTime && level.elapsedTimeMs >= introEndTime) {
      return Im.update(level, 'state', s => GameProgressAutomaton.emitEvent(s, {type: 'intro-ended'}));
    }
    return level;
  }

  private static maybeGameClear(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    const params = DataSourceHelper.fetchB(state, 'baseParams', 'default');
    const introEndTime = params['game_progress.intro_time_ms'];
    const gameClearTime = params['game_progress.game_time_up_duration_ms'] + introEndTime;
    if (level.elapsedTimeMs >= gameClearTime) {
      return Im.update(level, 'state', s =>
        GameProgressAutomaton.emitEvent(s, {type: 'game-time-up', finalScore: level.score})
      );
    }
    return level;
  }

  private static maybeStartPlayerDeath(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    const maybePlayer = BodiesHelper.getFirstBodyInType(state, 'player');
    if (maybePlayer.err) return level;

    const player = maybePlayer.val;
    const engineTimeMs = state.time.engineTimeMs;
    if (player.isDead) {
      return Im.update(level, 'state', s =>
        GameProgressAutomaton.emitEvent(s, {type: 'player-start-dying', engineTimeMs, finalScore: level.score})
      );
    }
    return level;
  }

  private static maybeEndPlayerDeath(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    if (level.state.type !== 'player-death-anim') return level;

    const engineTimeMs = state.time.engineTimeMs;
    const playerDeathAnimEngineTimeMs = DataSourceHelper.fetchB(state, 'baseParams', 'default')[
      'game_progress.player_death_slow_motion_duration_ms'
    ];

    const animEndTimeMs = level.state.startEngineTimeMs + playerDeathAnimEngineTimeMs;
    if (engineTimeMs >= animEndTimeMs) {
      return Im.update(level, 'state', s => GameProgressAutomaton.emitEvent(s, {type: 'player-completely-dead'}));
    }
    return level;
  }

  private static updateEnemySpawningCharge(level: AiotLevel, deltaMs: number, state: GameState<Def>): AiotLevel {
    if (level.state.type !== 'playing') return level;

    const chargeAmountPerSecAlpha = TEnemySpawner.getChargeAmountPerSecByTimeAlpha(state);
    const chargeAmountPerSecNotAlpha = TEnemySpawner.getChargeAmountPerSecByTimeNotAlpha(state);

    return Im.update(level, 'enemySpawner', es =>
      TEnemySpawner.chargeByTime(es, {chargeAmountPerSecAlpha, chargeAmountPerSecNotAlpha, deltaMs})
    );
  }

  static consumeEnemySpawning(level: AiotLevel, state: GameState<Def>): [AiotLevel, BodyAttrs<Def, 'enemy'>[]] {
    const [newSpawner, enemies] = TEnemySpawner.consumeSpawning(level.enemySpawner, state);
    return [Im.update(level, 'enemySpawner', () => newSpawner), enemies];
  }

  static chargeEnemySpawningByEnemyDeath(level: AiotLevel, deadEnemy: Enemy, state: GameState<Def>): AiotLevel {
    if (deadEnemy.statId === 'alpha') return level;
    if (BodiesHelper.getFirstBodyInType(state, 'bomb').ok) return level;

    const chargeAmount = TEnemySpawner.getChargeAmountByEnemyDeath(state);

    return Im.update(level, 'enemySpawner', es => TEnemySpawner.chargeByEnemyDeath(es, {chargeAmount}));
  }

  static addRank(level: AiotLevel, value: number): AiotLevel {
    return Im.update(level, 'rank', r => clamp(r + value, 0, 100));
  }

  static getRankRate(level: AiotLevel): number {
    return clamp(level.rank / 100, 0, 1);
  }

  static addScore(level: AiotLevel, value: number): AiotLevel {
    return Im.update(level, 'score', v => v + value);
  }
}

const clamp = (v: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, v));
};
