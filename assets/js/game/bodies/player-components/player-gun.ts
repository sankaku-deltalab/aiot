import {TVec2d, Vec2d} from 'curtain-call3';
import {TGunFactory, TGun, CompiledGun, GunTrainFire} from 'gun-train';
import {unit, unitPerSec} from 'js/game/constants';

// 1. Define gun type
type GT = {
  props: {basePos: Vec2d; baseAngleRad: number};
  values: {pos: Vec2d; angleRad: number; speed: number};
};
export type PlayerGunTrain = CompiledGun<GT>;
export type PlayerGunFire = GunTrainFire<GT>;

// 2. Build gun
const GF = TGunFactory;
// const Util = TGunTrainUtility;

const rawGun = GF.terminal<GT>({
  durationMs: 1000,
  calcFireTimes(_props) {
    return 20;
  },
  calcValues({baseAngleRad, basePos}, _args) {
    const angleRad = baseAngleRad;
    const positions = [TVec2d.add(basePos, {x: unit / 4, y: 0}), TVec2d.add(basePos, {x: -unit / 4, y: 0})];
    const speed = 2 * unitPerSec;

    return positions.map(p => ({
      values: {
        pos: p,
        angleRad,
        speed,
      },
    }));
  },
});

export const playerGun = TGun.compile(rawGun);

// // 3. Run Gun
// let state = TGunTrainState.new();
// const r = TGunTrainState.update(state, gun, {rank: 10}, {deltaMs: 1000 / 60});
// r.fires.forEach(fire => {
//   // do firing
// });
// state = r.state;
