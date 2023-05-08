import {Context, Conversion, Declaration, DeclarationId, PixiObject} from 'declarative-pixi';
import {Graphics} from 'pixi.js';
import {DecPixiCfg} from '../cfg';
import {TAaRect2d} from 'curtain-call3';

type Cfg = DecPixiCfg;
type CType = 'canvas-rect';

export class ConversionRect implements Conversion<Cfg, CType> {
  createPixiObject(
    id: DeclarationId,
    declaration: Declaration<Cfg, CType>,
    context: Context<Cfg>
  ): PixiObject<Cfg, CType> {
    const pixiObj = new Graphics();
    // pixiObj.mask = context.mask;
    this.upd(declaration, pixiObj, context);
    return pixiObj;
  }

  shouldUpdate(
    id: DeclarationId,
    newDeclaration: Declaration<Cfg, CType>,
    oldDeclaration: Declaration<Cfg, CType>,
    pixiObj: PixiObject<Cfg, CType>,
    context: Context<Cfg>
  ): boolean {
    return !Object.is(newDeclaration, oldDeclaration);
  }

  update(
    id: DeclarationId,
    newDeclaration: Declaration<Cfg, CType>,
    oldDeclaration: Declaration<Cfg, CType>,
    pixiObj: PixiObject<Cfg, CType>,
    context: Context<Cfg>
  ): void {
    this.upd(newDeclaration, pixiObj, context);
  }

  private upd(dec: Declaration<Cfg, CType>, pixiObj: PixiObject<Cfg, CType>, context: Context<Cfg>): void {
    const g = pixiObj;
    const {area, color, zIndex} = dec;

    const nw = area.nw;
    const size = TAaRect2d.size(area);

    g.clear();
    g.beginFill(color);
    g.drawRect(nw.x, nw.y, size.x, size.y);
    g.zIndex = zIndex;
  }

  destroyed(
    id: DeclarationId,
    oldDeclaration: Declaration<Cfg, CType>,
    pixiObj: PixiObject<Cfg, CType>,
    context: Context<Cfg>
  ): void {
    pixiObj.destroy();
  }
}
