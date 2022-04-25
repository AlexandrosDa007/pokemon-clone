import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "./constants/environment";
import { ViewPort } from "./viewport";

export class Boundry {
  position: {
    x: number;
    y: number;
  };
  width = SCALED_SIZE;
  height = SCALED_SIZE;
  viewport: ViewPort;
  constructor(
    position: { x: number, y: number },
    viewport: ViewPort,
  ) {
    this.viewport = viewport;
    this.position = position;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    // ctx.drawImage(this.sprite, this.frameX * 64, this.frameY * 64, 64, 64, Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), SCALED_SIZE, SCALED_SIZE);
    ctx.fillRect(Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), this.width, this.height);
  }
}
