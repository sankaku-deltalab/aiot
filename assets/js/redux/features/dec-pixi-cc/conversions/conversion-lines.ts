import {Context, Conversion, Declaration, DeclarationId, PixiObject} from 'declarative-pixi';
import {Graphics} from 'pixi.js';
import {DecPixiCfg} from '../cfg';

type Cfg = DecPixiCfg;
type CType = 'lines';

export class ConversionLines implements Conversion<Cfg, CType> {
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
    const [startPos, ...paths] = dec.paths;
    const {thickness, color, closed, zIndex} = dec;

    g.clear();
    g.lineStyle(thickness, color);
    g.moveTo(startPos.x, startPos.y);
    for (const p of paths) {
      g.lineTo(p.x, p.y);
    }
    if (closed) {
      g.closePath();
    }
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
