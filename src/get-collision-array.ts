import { Boundry } from "./boundary";
import { ROWS, SCALED_SIZE } from "./constants/environment";
import { ViewPort } from "./viewport";

export function getCollisionArray(collisionData: number[], collisionNumber: number, viewport: ViewPort): Boundry[] {
  const boundries: Boundry[] = [];
  const _arr = [];
  for (let i = 0; i < collisionData.length; i += ROWS) {
    _arr.push(collisionData.slice(i, 70 + i));
  }

  _arr.forEach((row, i) => {
    row.filter(v => v === collisionNumber).forEach((_, j) => {
      boundries.push(new Boundry({
        x: j * SCALED_SIZE,
        y: i * SCALED_SIZE,
      }, viewport));
    });
  });
  return boundries;
}
