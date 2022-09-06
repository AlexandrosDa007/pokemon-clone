import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "./constants/environment";
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
      ctx.strokeRect(Math.round(denormalizePos.x - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round(denormalizePos.y - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), this.width, this.height);
    }
  }
}
