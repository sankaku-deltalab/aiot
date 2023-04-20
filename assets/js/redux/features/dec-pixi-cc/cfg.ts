import {CanvasLineGraphic, CanvasSpriteGraphic} from 'curtain-call3';
import {AnyDeclarationObject, DeclarativePixi, DefineConfig} from 'declarative-pixi';
import {Graphics, Sprite} from 'pixi.js';

export type DecPixiCfg = DefineConfig<{
  context: {};
  objects: {
    lines: {
      declaration: CanvasLineGraphic;
      pixiObj: Graphics;
    };
    sprite: {
      declaration: CanvasSpriteGraphic;
      pixiObj: Sprite;
    };
  };
}>;
