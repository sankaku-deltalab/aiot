import {
  Director,
  GameState,
  TimeScaling,
  Representation,
  DirectorUpdateArgs,
  LevelHelper,
  Im,
  BodiesHelper,
  TVec2d,
  DataSourceHelper,
} from 'curtain-call3';
import {DataDef} from './data-def';
import {TPlayer} from './bodies/player';
import {gameAreaSize, unit} from './constants';
import {TEnemy} from './bodies/enemy';
import {TAiotLevel} from './level';

type Def = DataDef;

export class AiotDirector implements Director<Def> {
  applyInput(state: GameState<Def>): GameState<Def> {
    return state;
  }

  update(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    return Im.pipe(
      () => state,
      state => this.maybeInit(state, args),
      state => this.updateLevel(state, args),
      state => this.maybeSpawnEnemy(state, args)
    )();
  }

  private maybeInit(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    const isFirstUpdate = LevelHelper.getLevel(state).elapsedTimeMs === 0;
    if (!isFirstUpdate) return state;

    const player = TPlayer.newAttrs({pos: TVec2d.zero()});

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodyFromAttrsB(state, player).state
    )();
  }

  private updateLevel(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    return Im.pipe(
      () => state,
      state => LevelHelper.updateLevel(state, lv => TAiotLevel.update(lv, args.deltaMs, state))
    )();
  }

  private maybeSpawnEnemy(state: GameState<Def>, args: DirectorUpdateArgs): GameState<Def> {
    if (LevelHelper.getLevel(state).state.type !== 'playing') return state;
    if (args.deltaMs <= 0) return state;

    const shouldSpawn = Math.random() * 60 < 1;
    if (!shouldSpawn) return state;

    const spawnPos = {x: (Math.random() - 0.5) * gameAreaSize.x, y: Math.random() * -0.5 * gameAreaSize.y};
    const stats = DataSourceHelper.fetchB(state, 'enemyStats', 'alpha');
    const collisionSize = TVec2d.mlt({x: stats.collision_size_unit_x, y: stats.collision_size_unit_y}, unit);
    const enemy = TEnemy.newAttrs({
      pos: spawnPos,
      statId: stats.id,
      health: stats.health,
      collisionSize,
      gunId: stats.gunId,
      startFireDelayMs: 500,
    });

    return Im.pipe(
      () => state,
      state => BodiesHelper.addBodyFromAttrsB(state, enemy).state
    )();
  }

  getTimeScales(state: GameState<Def>): TimeScaling<Def> {
    const playingPlayerDeathAnim = LevelHelper.getLevel(state).state.type === 'player-death-anim';
    return {base: playingPlayerDeathAnim ? 0.2 : 1};
  }

  represent(state: GameState<Def>): Representation<Def> {
    const lv = LevelHelper.getLevel(state);
    const ended = lv.state.type === 'clear' || lv.state.type === 'game-over';
    return {
      status: ended ? {type: 'ended', finalScore: 0} : {type: 'playing'},
      rank: lv.rank,
    };
  }
}
