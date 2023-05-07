import {GameProcessingHelper} from 'curtain-call3';
import {AppThunk} from 'js/redux/app/store';
import {ClientSiderApi} from 'js/hooks/client-sider';
import {gameAborted, gameStarted, gameUpdated} from './gameSlice';
import {processors} from 'js/game/processors';
import {createInitialSerializableState} from 'js/game/init';

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

    if (representation.status.type === 'ended') {
      const [reply, ref] = await ClientSiderApi.pushEventPromise('end_game', {
        final_score: Math.floor(representation.status.finalScore),
      });
      console.log('end_game callback', reply, ref);
    }
  };
