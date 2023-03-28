import {LiveSocket} from 'phoenix_live_view';

type Rec<V> = Record<string, V>;

export type HookConfig = {
  el: HTMLElement;
  pushEvents: Rec<{payload: Rec<unknown>}>;
  handleEvents: Rec<{payload: Rec<unknown>}>;
};

export type El<Cfg extends HookConfig> = Cfg['el'];

export type PushKey<Cfg extends HookConfig> = keyof Cfg['pushEvents'] & string;
export type PushPayload<Cfg extends HookConfig, Key extends PushKey<Cfg>> = Cfg['pushEvents'][Key]['payload'];

export type HandleKey<Cfg extends HookConfig> = keyof Cfg['handleEvents'] & string;
export type HandlePayload<Cfg extends HookConfig, Key extends HandleKey<Cfg>> = Cfg['handleEvents'][Key]['payload'];

export interface HookBase<Cfg extends HookConfig> {
  readonly el: El<Cfg>;
  readonly liveSocket: LiveSocket;
  readonly pushEvent: <Key extends PushKey<Cfg>>(
    event: Key,
    payload: PushPayload<Cfg, Key>,
    callback?: (reply: unknown, ref: unknown) => void
  ) => void;
  readonly pushEventTo: <Key extends PushKey<Cfg>>(
    selectorOrTarget: unknown,
    event: Key,
    payload: PushPayload<Cfg, Key>,
    callback?: (reply: unknown, ref: unknown) => void
  ) => void;
  readonly handleEvent: <Key extends HandleKey<Cfg>>(
    event: Key,
    callback: (payload: HandlePayload<Cfg, Key>) => void
  ) => void;
  readonly upload: (name: string, files: unknown) => void;
  readonly uploadTo: (selectorOrTarget: unknown, name: string, files: unknown) => void;

  mounted(): void;
  beforeUpdate(): void;
  updated(): void;
  destroyed(): void;
  disconnected(): void;
  recconected(): void;
}

export abstract class HookBaseClass<Cfg extends HookConfig = HookConfig> implements HookBase<Cfg> {
  readonly el!: El<Cfg>;
  readonly liveSocket!: LiveSocket;
  readonly pushEvent!: <Key extends PushKey<Cfg>>(
    event: Key,
    payload: PushPayload<Cfg, Key>,
    callback?: (reply: unknown, ref: unknown) => void
  ) => void;
  readonly pushEventTo!: <Key extends PushKey<Cfg>>(
    selectorOrTarget: unknown,
    event: Key,
    payload: PushPayload<Cfg, Key>,
    callback?: (reply: unknown, ref: unknown) => void
  ) => void;
  readonly handleEvent!: <Key extends HandleKey<Cfg>>(
    event: Key,
    callback: (payload: HandlePayload<Cfg, Key>) => void
  ) => void;
  readonly upload!: (name: string, files: unknown) => void;
  readonly uploadTo!: (selectorOrTarget: unknown, name: string, files: unknown) => void;

  mounted(): void {}
  beforeUpdate(): void {}
  updated(): void {}
  destroyed(): void {}
  disconnected(): void {}
  recconected(): void {}

  static asHook(): Object {
    const obj = this.prototype as Object;
    const names = Object.getOwnPropertyNames(obj);
    const entiries = names.map<[string, unknown]>(n => [n, (obj as Rec<unknown>)[n]]);
    return Object.fromEntries(entiries);
  }
}

type OverrideType<Base, Subset extends Partial<Base>> = Base & Subset;
type MinimumHookConfig = {
  el: HTMLElement;
  pushEvents: {};
  handleEvents: {};
};
export type ExtendedHookConfig<Subset extends Partial<HookConfig>> = OverrideType<MinimumHookConfig, Subset>;
