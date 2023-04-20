import * as React from 'react';
import {GameCanvas} from './features/game/page-components/game-canvas';
import {GameUI} from './features/game/page-components/game-ui';

const App: React.FC<{}> = ({}) => {
  // const handleClick = async () => {
  //   const el = document.getElementById(clientSiderId)!;
  //   const [reply, ref] = await TTypedViewHook.pushEventPromise<ClientSiderDef, 'end_game'>(el, 'end_game', {a: 'b'});
  //   console.log('end_game callback', reply, ref);
  // };
  // return <div onClick={handleClick}>This is react app</div>;
  return (
    <div className="static pointer-events-none">
      <div className="absolute">
        <GameCanvas widthClass="w-screen" heightClass="h-screen" declarations={[]} />
      </div>
      <div className="absolute">
        <GameUI />
      </div>
    </div>
  );
};

export default App;
