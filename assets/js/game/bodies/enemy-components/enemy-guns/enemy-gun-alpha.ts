import {TGunFactory, TGun} from 'gun-train';
import {EnemyGunType} from '../enemy-gun';

type GT = EnemyGunType;

const GF = TGunFactory;
// const Util = TGunTrainUtility;

const rawGun = GF.terminal<GT>({
  durationMs: 1000,
  calcFireTimes(_props) {
    return 20;
  },
  calcValues({baseAngleRad, basePos}, _args) {
    const angleRad = baseAngleRad;
    const speedMlt = 1;

    return [
      {
        values: {
          pos: basePos,
          angleRad,
          speedMlt,
        },
      },
    ];
  },
});

export const enemyGunAlpha = TGun.compile(rawGun);
