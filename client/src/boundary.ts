import { SCALED_SIZE } from "./constants/environment";
import { Settings } from "./settings";
import { denormalizeUnits } from "./utils/denormalize-units";
import { ViewPort } from "./viewport";

/**
 * Represents a boundry (collision box)
 */
export class Boundry {
  position: {
    x: number;
    y: number;
  };
  width = SCALED_SIZE;
  height = SCALED_SIZE;
  constructor(
    position: { x: number, y: number },
  ) {
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const denormalizePos = denormalizeUnits(this.position);
    ctx.strokeStyle = 'red';
    if (ViewPort.isInside(denormalizePos)) {
      ctx.strokeRect(Math.round(denormalizePos.x - ViewPort.x + Settings.CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round(denormalizePos.y - ViewPort.y + Settings.CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), this.width, this.height);
    }
  }
}
