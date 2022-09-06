import { Position } from "@shared/models/position";
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "./constants/environment";
import { rectCollision } from '@shared/utils/rect-collision';

export class ViewPort {
  static x = 0;
  static y = 0;
  static w = CANVAS_WIDTH / 2;
  static h = CANVAS_HEIGHT / 2;

  static scrollTo(x: number, y: number) {
    ViewPort.x = (x * 32) - ViewPort.w * 0.5;
    ViewPort.y = (y * 32) - ViewPort.h * 0.5;
  }

  static isInside({ x, y }: Position) {
    return rectCollision(
      { x, y, width: SCALED_SIZE, height: SCALED_SIZE },
      { x: ViewPort.x, y: ViewPort.y, width: ViewPort.w, height: ViewPort.h },
      true
    );
  }
}
