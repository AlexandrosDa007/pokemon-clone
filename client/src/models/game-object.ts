import { Position } from "@shared/models/position";
import { GameKeyCode, InputHandler } from "../input-handler";
import { Sprite } from "../sprite";

/**
 * Generic game object implementation
 * 
 * Stores the sprite and the position of
 * a GameObject
 * TODO: keep state in the game object
 */
export abstract class GameObject {
  _sprite: Sprite;
  get sprite() {
    return this._sprite;
  }
  set sprite(newSprite: Sprite) {
    this._sprite = newSprite;
  }
  position: Position;
  state: any;
  constructor(
    sprite: Sprite,
    pos: Position,
  ) {
    this.position = pos;
    this._sprite = sprite;
  }

  /**
   * Up to the game object to implement
   * @param ctx The canvas rendering context 2D
   */
  render(ctx: CanvasRenderingContext2D, delta: number) {
    this.sprite.render(ctx, delta);
  }

  /**
   * Up to the game object to implement
   * @param delta Difference between 2 frames
   */
  update(delta: number, input?: InputHandler) {
    this.sprite.update(this);
  }
}
