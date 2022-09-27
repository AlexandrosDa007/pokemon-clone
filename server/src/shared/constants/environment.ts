import { Rect } from '../models/collisions';
export const COLUMNS = 64;
export const ROWS = 64;
import { MAP_DATA } from './map';

export const COLLISION_ID = 7995;
export const BATTLE_SPOT_ID = 400;

export const CHANCE_TO_ENCOUNTER = 0.3;

export const COLLISION_MAP = (() => {
  interface SuperRect extends Rect {
    value: number;
  }
  const _arr: SuperRect[][] = [];
  for (let i = 0; i < MAP_DATA.length; i += ROWS) {
    _arr.push(
      MAP_DATA.slice(i, 64 + i).map((v, j) => {
        return {
          x: Math.floor(i / ROWS) * 1,
          y: j * 1,
          height: 1,
          width: 1,
          value: v,
        };
      }),
    );
  }
  const obj = _arr.reduce((p, c) => {
    const onlyCols = c.filter((vv) => vv.value === COLLISION_ID);
    const _obj = onlyCols.reduce((pp, cc) => {
      return {
        ...pp,
        [`${cc.x}_${cc.y}`]: {
          x: cc.x,
          y: cc.y,
          width: cc.width,
          height: cc.height,
        },
      };
    }, {} as Record<string, Rect>);
    return {
      ...p,
      ..._obj,
    };
  }, {} as Record<string, Rect>);
  return obj;
})();

export const BATTLE_MAP = (() => {
  interface SuperRect extends Rect {
    value: number;
  }
  const _arr: SuperRect[][] = [];
  for (let i = 0; i < MAP_DATA.length; i += ROWS) {
    _arr.push(
      MAP_DATA.slice(i, 64 + i).map((v, j) => {
        return {
          x: Math.floor(i / ROWS) * 1,
          y: j * 1,
          height: 1,
          width: 1,
          value: v,
        };
      }),
    );
  }
  const obj = _arr.reduce((p, c) => {
    const onlyCols = c.filter((vv) => vv.value === BATTLE_SPOT_ID);
    const _obj = onlyCols.reduce((pp, cc) => {
      return {
        ...pp,
        [`${cc.x}_${cc.y}`]: {
          x: cc.x,
          y: cc.y,
          width: cc.width,
          height: cc.height,
        },
      };
    }, {} as Record<string, Rect>);
    return {
      ...p,
      ..._obj,
    };
  }, {} as Record<string, Rect>);
  return obj;
})();
console.log(BATTLE_MAP);
