import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "@shared/constants/environment";
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
    ctx.strokeStyle = 'red';
    ctx.strokeRect(Math.round(this.position.x - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round(this.position.y - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), this.width, this.height);
  }
}
