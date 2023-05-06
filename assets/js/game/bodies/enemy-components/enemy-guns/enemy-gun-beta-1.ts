import {TGunFactory, TGun, TGunTrainUtility} from 'gun-train';
import {EnemyGunType} from '../enemy-gun';
import {Enum} from 'curtain-call3';

type GT = EnemyGunType;

const GF = TGunFactory;
const Util = TGunTrainUtility;

const rawGun = GF.terminal<GT>({
  durationMs: 10_000,
  calcFireTimes({rank}) {
    return 10 + Math.floor((rank / 100) * 20);
  },
  calcValues({baseAngleRad, basePos, rank}, _args) {
    const speedMlt = Util.lerp(rank / 100, 1, 1.5);
    const nWayNum = 3 + 2 * Math.floor(3 * (rank / 100));
    const totalAngleRad = Util.toRadians(nWayNum * 5);
    const angles = Util.calcNWayAngles(nWayNum, totalAngleRad);

    return Enum.map(angles, angleDeltaRad => {
      return {
        values: {
          pos: basePos,
          angleRad: angleDeltaRad + baseAngleRad,
          speedMlt,
        },
      };
    });
  },
});

export const enemyGunBeta1 = TGun.compile(rawGun);
