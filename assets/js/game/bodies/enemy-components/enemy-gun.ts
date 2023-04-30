import {Vec2d} from 'curtain-call3';
import {CompiledGun, GunTrainFire} from 'gun-train';

export type EnemyGunType = {
  props: {basePos: Vec2d; baseAngleRad: number; rank: number};
  values: {pos: Vec2d; angleRad: number; speedMlt: number};
};
type GT = EnemyGunType;
export type EnemyGunTrain = CompiledGun<GT>;
export type EnemyGunFire = GunTrainFire<GT>;
