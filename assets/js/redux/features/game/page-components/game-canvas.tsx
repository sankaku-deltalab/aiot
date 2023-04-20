import React, {useEffect, useRef, useState} from 'react';
import {Application} from 'pixi.js';
import {DeclarativePixi, AnyDeclarationObject} from 'declarative-pixi';
import {Vec2d, Result, Res, TVec2d} from 'curtain-call3';
import {useAppDispatch} from 'js/redux/app/hooks';
import {DecPixiCfg} from '../../dec-pixi-cc/cfg';
import {ConversionLines} from '../../dec-pixi-cc/conversions/conversion-lines';
import {ConversionSprite} from '../../dec-pixi-cc/conversions/conversion-sprite';
import {canvasSizeUpdated, pointerDownedOrUpped, pointerMovedTo} from '../gameSlice';
import {PointerEvent} from 'react';
import {updateGame} from '../thunk-actions';

export type Props = {
  widthClass: string;
  heightClass: string;
  declarations: AnyDeclarationObject<DecPixiCfg>[];
};

export const GameCanvas: React.FC<Props> = props => {
  const dispatch = useAppDispatch();
  const [appDecPixi, setAppDecPixi] = useState<[Application, DeclarativePixi<DecPixiCfg>] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  const {declarations} = props;

  // Init rendering
  useEffect(() => {
    const resizer = resizerRef.current;
    const canvas = canvasRef.current;
    if (appDecPixi !== null) return;
    if (resizer === null) return;
    if (canvas === null) return;

    console.log('pixi init');
    const app = createPixiApplication(props, canvas, resizer);

    const ticking = () => {
      const deltaMs = app.ticker.deltaMS;
      const canvasSize = {x: canvas.width, y: canvas.height};
      dispatch(canvasSizeUpdated({canvasSize}));
      dispatch(updateGame({deltaMs}));
    };
    app.ticker.add(ticking);

    const dec = new DeclarativePixi<DecPixiCfg>({
      root: app.stage,
      conversions: {
        lines: new ConversionLines(),
        sprite: new ConversionSprite(),
      },
    });

    setAppDecPixi([app, dec]);

    return () => {
      console.log('pixi destroy');
      app.ticker.remove(ticking);
    };
  }, [canvasRef]);

  // update pointer
  const getCanvasPos = (clientPos: Vec2d): Result<Vec2d> => {
    if (canvasRef.current === null) return Res.err('canvas not found');
    const canvasNwPos = {
      x: canvasRef.current.offsetLeft,
      y: canvasRef.current.offsetTop,
    };
    return Res.ok(TVec2d.sub(clientPos, canvasNwPos));
  };

  const handlePointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos({x: e.clientX, y: e.clientY});
    if (Res.isOk(pos)) dispatch(pointerDownedOrUpped({down: true, canvasPos: pos.val}));
  };

  const handlePointerUp = (e: PointerEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos({x: e.clientX, y: e.clientY});
    if (Res.isOk(pos)) dispatch(pointerDownedOrUpped({down: false, canvasPos: pos.val}));
  };

  const handlePointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos({x: e.clientX, y: e.clientY});
    if (Res.isOk(pos)) dispatch(pointerMovedTo({canvasPos: pos.val}));
  };

  // Update graphic
  useEffect(() => {
    if (appDecPixi === null) return;
    const [_, dec] = appDecPixi;

    dec.update(declarations, {});
  }, [appDecPixi, declarations]);

  return (
    <div className={`${props.heightClass} ${props.widthClass}`} ref={resizerRef}>
      <canvas
        className="pointer-events-auto"
        // width={props.width}
        // height={props.height}
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
    </div>
  );
};

const createPixiApplication = (props: Props, canvas: HTMLCanvasElement, resizer: HTMLElement): Application => {
  const app = new Application({
    view: canvas,
    antialias: true,
    // backgroundColor: 0xff0000, // TODO:
    resizeTo: resizer,
    // width: props.width,
    // height: props.height,
    sharedTicker: true,
  });
  app.stage.sortableChildren = true;

  return app;
};

export default GameCanvas;
