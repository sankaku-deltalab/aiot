import {DefineFuncmataDefinition, FuncmataEvent, EventHandler, Funcmata, FuncmataState} from 'funcmata';

// 1. Define config
type GameProgressDef = DefineFuncmataDefinition<{
  state:
    | {type: 'intro'}
    | {type: 'playing'}
    | {type: 'player-death-anim'; startEngineTimeMs: number}
    | {type: 'game-over'}
    | {type: 'clear'};
  event:
    | {type: 'intro-ended'}
    | {type: 'player-start-dying'; engineTimeMs: number}
    | {type: 'player-completely-dead'}
    | {type: 'game-time-up'};
}>;

type Def = GameProgressDef;

// 2. Create event handler
class Handler implements EventHandler<Def> {
  handleEvent(event: FuncmataEvent<Def>, state: FuncmataState<Def>): FuncmataState<Def> {
    // end intro
    if (event.type === 'intro-ended' && state.type === 'intro') {
      return {type: 'playing'};
    }
    // game clear
    if (event.type === 'game-time-up' && state.type === 'playing') {
      return {type: 'clear'};
    }
    // player start death
    if (event.type === 'player-start-dying' && state.type === 'playing') {
      return {type: 'player-death-anim', startEngineTimeMs: event.engineTimeMs};
    }
    // player end death
    if (event.type === 'player-completely-dead' && state.type === 'player-death-anim') {
      return {type: 'game-over'};
    }
    return state;
  }
}

export type GameProgressState = FuncmataState<Def>;
export type GameProgressEvent = FuncmataEvent<Def>;

export class GameProgressAutomaton {
  private static readonly handler = new Handler();

  static new(): GameProgressState {
    return Funcmata.new<Def>({type: 'intro'});
  }

  static emitEvent(state: GameProgressState, event: GameProgressEvent): GameProgressState {
    return Funcmata.emitEvent<Def>(state, event, this.handler);
  }
}
