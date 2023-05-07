import {PayloadAction, createSelector, createSlice} from '@reduxjs/toolkit';
import {
  SerializableState,
  RawCanvasPointerState,
  CanvasRenderingState,
  CustomInputs,
  Vec2d,
  Im,
  CanvasGraphic,
  GameProcessingHelper,
  Representation,
} from 'curtain-call3';
import {addRawReducers} from 'js/redux/patch-redux-toolkit';
import {DataDef} from 'js/game/data-def';
import {calcRenderingState, createInitialSerializableState} from 'js/game/init';
import {RootState} from 'js/redux/app/store';
import {processors} from 'js/game/processors';
import {AnyDeclarationObject} from 'declarative-pixi';
import {DecPixiCfg} from '../dec-pixi-cc/cfg';

export type GameSliceState = {
  // play
  playing: boolean;
  paused: boolean;
  // cc3
  state: SerializableState<DataDef>;
  representation?: Representation<DataDef>;
  canvasPointer: RawCanvasPointerState;
  renderingState: CanvasRenderingState;
  customInput: CustomInputs<DataDef>;
};

const initialState: GameSliceState = {
  // play
  playing: false,
  paused: false,
  // cc3
  state: createInitialSerializableState(),
  canvasPointer: {canvasPos: {x: 0, y: 0}, down: false},
  renderingState: calcRenderingState({x: 2, y: 2}),
  customInput: {},
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {}, // Use `addRawReducers`
});

const rawReducers = addRawReducers(gameSlice, {
  gameStarted: (sliceState, {payload}: PayloadAction<{newState: SerializableState<DataDef>}>) => {
    return {
      ...sliceState,
      playing: true,
      paused: false,
      state: payload.newState,
    };
  },
  gameAborted: (sliceState, {payload}: PayloadAction<{}>) => {
    return {
      ...sliceState,
      playing: false,
      paused: false,
    };
  },
  gameUpdated: (
    sliceState,
    {
      payload,
    }: PayloadAction<{ended: boolean; representation: Representation<DataDef>; newState: SerializableState<DataDef>}>
  ) => {
    return {
      ...sliceState,
      playing: !payload.ended,
      representation: payload.representation,
      state: payload.newState,
    };
  },
  canvasSizeUpdated: (sliceState, {payload}: PayloadAction<{canvasSize: Vec2d}>) => {
    const {canvasSize} = payload;

    return Im.update(sliceState, 'renderingState', () => calcRenderingState(canvasSize));
  },
  pointerDownedOrUpped: (sliceState, {payload}: PayloadAction<{down: boolean; canvasPos: Vec2d}>) => {
    const {down, canvasPos} = payload;

    return Im.update(sliceState, 'canvasPointer', () => ({canvasPos, down}));
  },
  pointerMovedTo: (sliceState, {payload}: PayloadAction<{canvasPos: Vec2d}>) => {
    const {canvasPos} = payload;

    return Im.update(sliceState, 'canvasPointer', p => ({...p, canvasPos}));
  },
  // pointerMoved: (sliceState, {payload}: PayloadAction<{canvasDelta: Vec2d}>) => {
  //   const {canvasDelta} = payload;
  //   const pos = TVec2d.add(canvasDelta, sliceState.canvasPointer.canvasPos);

  //   return Im.update(sliceState, 'canvasPointer', p => ({...p, canvasPos: pos}));
  // },
});

// export const {} = gameSlice.actions;
export const {gameStarted, gameAborted, gameUpdated, canvasSizeUpdated, pointerDownedOrUpped, pointerMovedTo} =
  rawReducers;

const selectGameSlice = (state: RootState) => state.game;

export const selectCanvasSize = createSelector<[typeof selectGameSlice], Vec2d>([selectGameSlice], state => {
  return state.renderingState.canvasSize;
});

const selectGraphics = createSelector<[typeof selectGameSlice], CanvasGraphic<DataDef>[]>(
  [selectGameSlice],
  sliceState => {
    const {canvasPointer, customInput, renderingState} = sliceState;
    return GameProcessingHelper.generateGraphics(sliceState.state, processors, {
      canvasPointer,
      customInput,
      realWorldTimeDeltaMs: 0,
      renderingState,
    });
  }
);

export const selectGraphicDeclarations = createSelector<[typeof selectGraphics], AnyDeclarationObject<DecPixiCfg>[]>(
  [selectGraphics],
  graphics => {
    return graphics.map(g => ({
      id: g.key,
      type: g.type,
      declaration: g,
    }));
  }
);

export const selectCurrentScore = createSelector<[typeof selectGameSlice], number>([selectGameSlice], sliceState => {
  const {representation} = sliceState;
  if (representation === undefined) return 0;
  return representation.score;
});

export const selectRemainingTimeMs = createSelector<[typeof selectGameSlice], number>([selectGameSlice], sliceState => {
  const {representation} = sliceState;
  if (representation === undefined) return 0;
  return representation.remainingTimeMs;
});

export default gameSlice.reducer;
