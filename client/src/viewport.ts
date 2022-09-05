import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/environment";

export class ViewPort {
  static x = 0;
  static y = 0;
  static w = CANVAS_WIDTH;
  static h = CANVAS_HEIGHT;

  static scrollTo(x: number, y: number) {
    ViewPort.x = (x * 32) - ViewPort.w * 0.5;
    ViewPort.y = (y * 32) - ViewPort.h * 0.5;
  }

}
