import {TGunFactory, TGun} from 'gun-train';
import {EnemyGunType} from '../enemy-gun';

type GT = EnemyGunType;

const GF = TGunFactory;
// const Util = TGunTrainUtility;

const rawGun = GF.terminal<GT>({
  durationMs: 10000,
  calcFireTimes({rank}) {
    return 10 + Math.floor((rank / 100) * 20);
  },
  calcValues({baseAngleRad, basePos, rank}, _args) {
    const angleRad = baseAngleRad;
    const speedMlt = 1 + 1.5 * (rank / 100);

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
