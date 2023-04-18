import {TTypedViewHook} from 'typed-phoenix-live-view-hook';
import {ClientSider} from './client-sider';

export const Hooks = {
  ClientSider: TTypedViewHook.createHookWithModifier(new ClientSider()),
};
