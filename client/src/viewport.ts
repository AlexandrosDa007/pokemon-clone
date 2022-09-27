import { Position } from '@shared/models/position';
import { SCALED_SIZE } from './constants/environment';
import { rectCollision } from '@shared/utils/rect-collision';
import { Settings } from './settings';

export class ViewPort {
  static x = 0;
  static y = 0;
  static w = Settings.CANVAS_WIDTH;
  static h = Settings.CANVAS_HEIGHT;

  static resize() {
    this.w = Settings.CANVAS_WIDTH;
    this.h = Settings.CANVAS_HEIGHT;
  }

  static scrollTo(x: number, y: number) {
    ViewPort.x = x * 32 - ViewPort.w * 0.5;
    ViewPort.y = y * 32 - ViewPort.h * 0.5;
  }

  static isInside({ x, y }: Position) {
    return rectCollision(
      { x, y, width: SCALED_SIZE, height: SCALED_SIZE },
      { x: ViewPort.x, y: ViewPort.y, width: ViewPort.w, height: ViewPort.h },
      true,
    );
  }
}
