import {ExtendedHookConfig, HookBaseClass, HookConfig, PushKey, PushPayload} from './hook-base';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from '../redux/app/store';
import App from '../redux/App';

type Cfg = ExtendedHookConfig<{
  pushEvents: {
    countOver10: {payload: {count: number}};
    end_game: {payload: {}};
  };
  handleEvents: {
    startGame: {payload: {}};
    abortGame: {payload: {}};
  };
}>;

// type Ev<Payload extends Record<string, unknown>> = Event & {detail: Payload};
type PushEv<Key extends PushKey<Cfg>> = Event & {detail: {event: Key; payload: PushPayload<Cfg, Key>}};

const clientToServerEvName = 'c2s';

export class ClientSider extends HookBaseClass<Cfg> {
  mounted() {
    this.setupServerToClientHandling();
    this.setupClientToServerHandling();
    this.setupClientToClientHandling();
    this.setupReact();
  }

  private setupServerToClientHandling(): void {
    // this.handleEvent('event_s2c', ({}) => {
    //   // Do something
    // });
  }

  private setupClientToServerHandling(): void {
    this.el.addEventListener(clientToServerEvName, e => {
      const ev = e as PushEv<PushKey<Cfg>>;
      const {event, payload} = ev.detail;
      this.pushEvent(event, payload);
    });
  }

  private setupClientToClientHandling(): void {
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

  private setupReact(): void {
    const root = createRoot(this.el);

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  }

  destroyed() {
    const root = createRoot(this.el);
    root.unmount();
  }

  static sendMessageToServer<Key extends PushKey<Cfg>>(id: string, event: Key, payload: PushPayload<Cfg, Key>): void {
    // redux thunk action can call this function
    const detail = {event, payload};
    const ev = new CustomEvent(clientToServerEvName, {detail});
    const clientSiderElement = document.getElementById(id);
    if (clientSiderElement === null) throw new Error(`ClientSider element not found. Element id is "${id}"`);
    clientSiderElement.dispatchEvent(ev);
  }
}
