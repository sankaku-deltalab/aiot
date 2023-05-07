import {GameProcessingHelper} from 'curtain-call3';
import {TTypedViewHook} from 'typed-phoenix-live-view-hook';
import {AppThunk} from 'js/redux/app/store';
import {ClientSiderDef} from 'js/hooks/client-sider';
import {gameAborted, gameStarted, gameUpdated} from './gameSlice';
import {DataDef} from 'js/game/data-def';
import {processors} from 'js/game/processors';
import {createInitialSerializableState} from 'js/game/init';

const clientSiderId = 'cs';

export const startGame =
  (args: {}): AppThunk =>
  async (dispatch, getState) => {
    console.log('Server request startGame', args);

    const _sliceState = getState().game;
    const state = createInitialSerializableState();
    dispatch(gameStarted({newState: state}));
  };

export const abortGame =
  (args: {}): AppThunk =>
  async (dispatch, _getState) => {
    console.log('Server request abortGame', args);
    dispatch(gameAborted({}));
  };

export const updateGame =
  (args: {deltaMs: number}): AppThunk =>
  async (dispatch, getState) => {
    const sliceState = getState().game;

    const updatable = sliceState.playing && !sliceState.paused;
    if (!updatable) return;

    const {deltaMs} = args;
    const {canvasPointer, customInput, renderingState} = sliceState;
    const {state: newState, representation} = GameProcessingHelper.updateState(sliceState.state, processors, {
      canvasPointer,
      customInput,
      realWorldTimeDeltaMs: deltaMs,
      renderingState,
    });

    const ended = representation.status.type === 'ended';
    dispatch(gameUpdated({newState, ended, representation}));

    if (ended) {
      const el = document.getElementById(clientSiderId)!;
      const [reply, ref] = await TTypedViewHook.pushEventPromise<ClientSiderDef, 'end_game'>(el, 'end_game', {a: 'b'});
      console.log('end_game callback', reply, ref);
    }
  };
