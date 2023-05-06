import {Body, Graphic, TAaRect2d, TImList, TLineGraphic, TVec2d, Vec2d} from 'curtain-call3';
import {DataDef} from '../../data-def';
import {gameAreaRect, unit} from '../../constants';
import {TPlayer} from '../../bodies/player';
import {PlayerGunTrain} from '../../bodies/player-components/player-gun';

type Def = DataDef;
type BT = 'player';
type Props = {
  pointerDelta: Vec2d;
  gun: PlayerGunTrain;
};

const playerSize = {x: unit / 2, y: unit / 2};

export class PlayerMindGraphic {
  static generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[] {
    const corners = TAaRect2d.corners(gameAreaRect);
    const paths = [corners.nw, corners.se, corners.ne, corners.sw];

    return [
      ...this.generateMainGraphic(body, props),
      ...this.generateDeathGraphic(body, props),
      ...this.generateBombChargeGraphic(body, props),
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

  private static generateMainGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    if (body.hitLog.size > 0) return [];

    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), playerSize);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color =
      body.firingState.type === 'initial'
        ? 0xaaaaaa
        : body.firingState.type === 'shot-firing'
        ? 0x4444aa
        : body.firingState.type === 'bomb-charging'
        ? 0xaa4444
        : body.firingState.type === 'bomb-firing'
        ? 0xaaaa44
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

  private static generateDeathGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
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

    const color = 0xaaaaaa;

    return [
      TLineGraphic.create({
        key: 'death-explosion',
        pos: body.pos,
        color: color,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }

  private static generateBombChargeGraphic(body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    if (body.firingState.type !== 'bomb-charging') return [];

    const bombChargeRate = TPlayer.getBombChargeRate(body);
    const rate = Math.max(0, Math.min(1, bombChargeRate)) ** 4;

    const chargeSizeMax = unit * 4;
    const chargeSizeMin = playerSize.x;
    const chargeSizeScaler = rate * chargeSizeMin + (1 - rate) * chargeSizeMax;
    const chargeSize = TVec2d.mlt(TVec2d.one(), chargeSizeScaler);

    const rect = TAaRect2d.fromCenterAndSize(TVec2d.zero(), chargeSize);
    const corners = TAaRect2d.corners(rect);
    const paths = [corners.nw, corners.ne, corners.se, corners.sw];

    const color = 0xaa4444;

    return [
      TLineGraphic.create({
        key: 'bomb-charge',
        pos: body.pos,
        color: color,
        thickness: 10,
        zIndex: 0,
        paths,
        closed: true,
      }),
    ];
  }
}
