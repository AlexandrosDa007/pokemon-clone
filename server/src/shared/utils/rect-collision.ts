import { Rect } from '@shared/models/collisions';

export function rectCollision(rect1: Rect, rect2: Rect, useEquality = false) {
  if (useEquality) {
    if (
      rect1.x >= rect2.x + rect2.width ||
      rect1.x + rect1.width <= rect2.x ||
      rect1.y >= rect2.y + rect2.height ||
      rect1.y + rect1.height <= rect2.y
    ) {
      return false;
    }
    return true;
  }
  if (
    rect1.x > rect2.x + rect2.width ||
    rect1.x + rect1.width < rect2.x ||
    rect1.y > rect2.y + rect2.height ||
    rect1.y + rect1.height < rect2.y
  ) {
    return false;
  }
  return true;
}
