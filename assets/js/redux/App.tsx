import * as React from 'react';
import {GameCanvas} from './features/game/page-components/game-canvas';
import {GameUI} from './features/game/page-components/game-ui';
import {useAppSelector} from './app/hooks';
import {selectGraphicDeclarations} from './features/game/gameSlice';

const App: React.FC<{}> = ({}) => {
  const graphicDec = useAppSelector(selectGraphicDeclarations);

  return (
    <div className="static pointer-events-none">
      <div className="absolute">
        <GameCanvas widthClass="w-screen" heightClass="h-screen" declarations={graphicDec} />
      </div>
      <div className="absolute">
        <GameUI />
      </div>
    </div>
  );
};

export default App;
