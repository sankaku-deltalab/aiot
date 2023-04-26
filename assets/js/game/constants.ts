import {TVec2d} from 'curtain-call3';

export const unit = 256;
export const gameAreaSize = {x: unit * 6, y: unit * 6};
export const gameAreaSizeHalf = TVec2d.div(gameAreaSize, 2);
export const gameAreaRect = {nw: TVec2d.mlt(gameAreaSizeHalf, -1), se: gameAreaSizeHalf};
