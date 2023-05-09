import {GameProcessingHelper, Vec2d, CanvasRenderingState, TVec2d, Im} from 'curtain-call3';
import {DataDef} from './data-def';
import {gameAreaSize} from './constants';
import {defaultBaseParams} from './data-sources/base-params';
import {defaultEnemyStats} from './data-sources/enemy-stats';
import {TAiotLevel} from './level';

export const createInitialSerializableState = () => {
  return GameProcessingHelper.createSerializableState<DataDef>({
    cameraSize: gameAreaSize,
    dataSources: {
      baseParams: defaultBaseParams,
      enemyStats: defaultEnemyStats,
    },
    initialCustomInputs: {},
    level: TAiotLevel.new(),
  });
};

export const calcRenderingState = (canvasSize: Vec2d): CanvasRenderingState => {
  const scale = Im.pipe(
    () => TVec2d.broadcast({cam: gameAreaSize, can: canvasSize}, ({cam, can}) => can / cam),
    ({x, y}) => Math.min(x, y),
    scale => scale * 0.9
  )();

  const centerX = canvasSize.x / 2;
  const renderingSizeY = gameAreaSize.y * scale;
  const centerY = renderingSizeY / 2;

  return {
    canvasSize,
    center: {x: centerX, y: centerY},
    scale,
  };
};
