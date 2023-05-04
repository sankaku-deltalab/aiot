import {
  Body,
  Collision,
  CollisionHelper,
  DataSourceHelper,
  DynamicSourceHelper,
  GameState,
  Graphic,
  Im,
  InputHelper,
  Mind,
  MindArgs,
  TAaRect2d,
  TImList,
  TLineGraphic,
  TVec2d,
  Vec2d,
} from 'curtain-call3';
import {DataDef} from '../data-def';
import {gameAreaRect, unit} from '../constants';
import {TPlayer} from '../bodies/player';
import {PlayerGunTrain} from '../bodies/player-components/player-gun';

type Def = DataDef;
type BT = 'player';
type Props = {
  pointerDelta: Vec2d;
  gun: PlayerGunTrain;
};

const playerSize = {x: unit / 2, y: unit / 2};
const collisionSize = {x: unit / 8, y: unit / 8};

export class PlayerMind implements Mind<Def, BT, Props> {
  calcProps(state: GameState<Def>, _body: Body<Def, BT>): Props {
    const pointerDelta = InputHelper.pointerDeltaWhileDown(state);
    const {gun} = DynamicSourceHelper.fetchB(state, 'playerGuns', 'default', {});
    return {pointerDelta, gun};
  }

  updateBody(body: Body<Def, BT>, args: MindArgs, props: Props): Body<Def, BT> {
    const {deltaMs} = args;
    const {pointerDelta, gun} = props;

    return Im.pipe(
      () => body,
      body => TPlayer.updateElapsedTime(body, deltaMs),
      body => TPlayer.updatePos(body, pointerDelta, deltaMs),
      body => TPlayer.maybeUpdateFireMode(body, deltaMs),
      body => TPlayer.maybeUpdateFiring(body, gun, deltaMs)
    )();
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    const corners = TAaRect2d.corners(gameAreaRect);
    const paths = [corners.nw, corners.se, corners.ne, corners.sw];

    return [
      this.generateMainGraphic(body, props),
      ...this.generateDeathGraphic(body, props),
      TLineGraphic.create({
        key: 'area',
        pos: TVec2d.zero(),
        color: 0x4444aa,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }

  private generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def> {
    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), playerSize);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color =
      body.fireMode === 'initial'
        ? 0xaaaaaa
        : body.fireMode === 'shot'
        ? 0x4444aa
        : body.fireMode === 'bomb'
        ? 0xaa4444
        : 0x444444;

    return TLineGraphic.create({
      key: 'main',
      pos: body.pos,
      color: color,
      thickness: 10,
      zIndex: 0,
      paths,
      closed: true,
    });
  }

  private generateDeathGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    if (body.hitLog.size <= 0) return [];

    const currentTime = body.elapsedMs;
    // TODO: should use body time not world time
    const lastHitTime = TImList.pop(body.hitLog, {worldTimeMs: currentTime})[0].worldTimeMs;
    if (currentTime <= lastHitTime) return [];
    const explosionTimeMs = 300;
    const finalTime = explosionTimeMs + lastHitTime;
    const rate = Math.max(0, (finalTime - currentTime) / explosionTimeMs);

    const explosionSizeMax = unit * 2;
    const explosionSize = TVec2d.mlt(TVec2d.one(), rate ** (1 / 4) * explosionSizeMax);

    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), explosionSize);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color =
      body.fireMode === 'initial'
        ? 0xaaaaaa
        : body.fireMode === 'shot'
        ? 0x4444aa
        : body.fireMode === 'bomb'
        ? 0xaa4444
        : 0x444444;

    return [
      TLineGraphic.create({
        key: 'main',
        pos: body.pos,
        color: color,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }

  generateCollision(body: Body<Def, BT>, _props: Props): Collision {
    const rect = TAaRect2d.fromCenterAndSize(body.pos, collisionSize);
    const mainShape = CollisionHelper.createAaRectShape(rect);
    return CollisionHelper.createCollision({shapes: [mainShape]});
  }
}
