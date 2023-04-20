import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {
  SerializableState,
  GameProcessingHelper,
  RawCanvasPointerState,
  CanvasRenderingState,
  CustomInputs,
  Vec2d,
  TVec2d,
  Im,
} from 'curtain-call3';
import {addRawReducers} from 'js/redux/patch-redux-toolkit';
import {DataDef} from 'js/game/data-def';

export type GameSliceState = {
  playing: boolean;
  paused: boolean;
  state: SerializableState<DataDef>;
  canvasPointer: RawCanvasPointerState;
  renderingState: CanvasRenderingState;
  customInput: CustomInputs<DataDef>;
};

const createInitialSerializableState = () => {
  return GameProcessingHelper.createSerializableState<DataDef>({
    cameraSize: {x: 2, y: 2},
    dataSources: {},
    initialCustomInputs: {},
    level: {},
  });
};

const initialState: GameSliceState = {
  // play
  playing: false,
  paused: false,
  // cc3
  state: createInitialSerializableState(),
  canvasPointer: {canvasPos: {x: 0, y: 0}, down: false},
  renderingState: {canvasSize: {x: 0, y: 0}, center: {x: 0, y: 0}, scale: 1},
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
  gameUpdated: (sliceState, {payload}: PayloadAction<{ended: boolean; newState: SerializableState<DataDef>}>) => {
    return {
      ...sliceState,
      playing: !payload.ended,
      state: payload.newState,
    };
  },
  canvasSizeUpdated: (sliceState, {payload}: PayloadAction<{canvasSize: Vec2d}>) => {
    const {canvasSize} = payload;

    return Im.update(sliceState, 'renderingState', () => ({
      canvasSize,
      center: TVec2d.div(canvasSize, 2),
      scale: 1,
    }));
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

export default gameSlice.reducer;
