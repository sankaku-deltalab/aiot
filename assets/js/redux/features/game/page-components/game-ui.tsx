import {useAppSelector} from 'js/redux/app/hooks';
import React from 'react';
import {selectRemainingTimeMs, selectCurrentScore} from '../gameSlice';

export const GameUI: React.FC<{}> = () => {
  const score = useAppSelector(selectCurrentScore);
  const timeMs = useAppSelector(selectRemainingTimeMs);

  const timeSec = (timeMs / 1000).toFixed(2);

  const nwItems = (
    <div className="justify-self-start align-self-start">
      <div>Time: {timeSec}</div>
      <div>Score: {score}</div>
    </div>
  );
  return <div className="fixed flex w-screen h-screen bg-transparent pointer-events-none">{nwItems}</div>;
};

export default GameUI;
