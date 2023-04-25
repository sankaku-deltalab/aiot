import {Context, Conversion, Declaration, DeclarationId, PixiObject} from 'declarative-pixi';
import {Sprite, Texture} from 'pixi.js';
import {DecPixiCfg} from '../cfg';

type Cfg = DecPixiCfg;
type CType = 'canvas-sprite';

export class ConversionSprite implements Conversion<Cfg, CType> {
  createPixiObject(
    id: DeclarationId,
    declaration: Declaration<Cfg, CType>,
    context: Context<Cfg>
  ): PixiObject<Cfg, CType> {
    const pixiObj = Sprite.from(declaration.imgKey);

    pixiObj.anchor.set(0.5);
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
    pixiObj.position.x = dec.pos.x;
    pixiObj.position.y = dec.pos.y;
    pixiObj.scale.x = dec.scale.x;
    pixiObj.scale.y = dec.scale.y;
    pixiObj.zIndex = dec.zIndex;
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
