import { Position } from '../models/position';
import { CANVAS_HEIGHT, CANVAS_WIDTH, COLUMS, ROWS, SCALED_SIZE, SPRITE_SIZE } from '../constants/environment';

export function normalizePosition(rawPosition: Position): Position {
  return {
    x: Math.floor(rawPosition.x / SCALED_SIZE),
    y: Math.floor(rawPosition.y / SPRITE_SIZE),
  };
}

export function denormalizePosition(position: Position): Position {
  return {
    x: position.x * SPRITE_SIZE,
    y: position.y * SPRITE_SIZE,
  };
}