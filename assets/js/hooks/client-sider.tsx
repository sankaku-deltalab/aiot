import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {DefineHookType, TypedViewHookModifier, TypedViewHook} from 'typed-phoenix-live-view-hook';
import {store} from '../redux/app/store';
import App from '../redux/App';
import {abortGame, startGame} from 'js/redux/features/game/thunk-actions';

export type ClientSiderDef = DefineHookType<{
  el: HTMLElement;
  c2sEvents: {
    end_game: {payload: {}; reply: {}};
  };
  s2cEvents: {
    startGame: {payload: {}};
    abortGame: {payload: {}};
  };
}>;

type Def = ClientSiderDef;

export class ClientSider implements TypedViewHookModifier<Def> {
  mounted(hook: TypedViewHook<Def>) {
    this.setupServerToClientHandling(hook);
    this.setupClientToClientHandling(hook);
    this.setupReact(hook);
  }

  private setupServerToClientHandling(hook: TypedViewHook<Def>): void {
    hook.handleEvent('startGame', ({}) => {
      store.dispatch(startGame({}));
    });
    hook.handleEvent('abortGame', payload => {
      store.dispatch(abortGame({}));
    });
  }

  private setupClientToClientHandling(hook: TypedViewHook<Def>): void {
    // Other DOM elements can emit them via `JS.dispatch`
    // https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.JS.html#module-custom-js-events-with-js-dispatch-1-and-window-addeventlistener
    // this.el.addEventListener('incEl', () => {
    //   store.dispatch(increment());
    // });
    // this.el.addEventListener('decEl', () => {
    //   store.dispatch(decrement());
    // });
    // this.el.addEventListener('incAmountEl', e => {
    //   const ev = e as Ev<{amount: number}>;
    //   store.dispatch(incrementByAmount(ev.detail.amount));
    // });
  }

  private setupReact(hook: TypedViewHook<Def>): void {
    const root = createRoot(hook.el);

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  }

  destroyed(hook: TypedViewHook<Def>) {
    const root = createRoot(hook.el);
    root.unmount();
  }
}
