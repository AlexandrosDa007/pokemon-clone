import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "@shared/constants/environment";
import { Position } from "@shared/models/position";
import { ANIMATION_FPS } from "./constants/environment";
import { GameObject } from "./game-object";
import { Settings } from "./settings";
import { ViewPort } from "./viewport";

/**
 * Sprite Class tailored to a
 * specific GameObject
 */
export class Sprite {
  sprite: HTMLImageElement;
  maxFrame: number;
  frameX: number;
  frameY: number;
  position: Position;
  private frameTimer = 0;
  private frameInterval = 1000 / ANIMATION_FPS;

  constructor(
    sprite: HTMLImageElement,
    initialPosition: Position,
    options: {
      maxFrame: number,
      frameX: number,
      frameY: number,
    }
  ) {
    this.sprite = sprite;
    this.position = initialPosition;
    const { frameX, frameY, maxFrame } = options;
    this.maxFrame = maxFrame;
    this.frameX = frameX;
    this.frameY = frameY;
  }

  update(gameObject: GameObject) {
    this.position = gameObject.position;
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      }
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += delta;
    }
    if (Settings.SHOW_BOUNDRIES) {
      ctx.strokeStyle = 'blue';
      ctx.strokeRect(Math.round(this.position.x - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round(this.position.y - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), SCALED_SIZE, SCALED_SIZE);
    }
    ctx.drawImage(this.sprite, this.frameX * 64, this.frameY * 64, 64, 64, Math.round(this.position.x - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round(this.position.y - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), SCALED_SIZE, SCALED_SIZE);
  }
}
