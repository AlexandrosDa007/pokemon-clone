import { CANVAS_HEIGHT, CANVAS_WIDTH, COLUMS, ROWS, SCALED_SIZE, SPRITE_SIZE, TEST_COLLISION_DATA } from "./constants/environment";
import { Game } from "./game";
import { GameKeyCode } from "./input-handler";
import { PlayerState, PlayerStateType, StandingDown, StandingLeft, StandingRight, StandingUp, WalkingDown, WalkingLeft, WalkingRight, WalkingUp, } from "./player-state";
import { ViewPort } from "./viewport";
export class Player {
  position: {
    x: number;
    y: number;
  };
  sprite: HTMLImageElement;
  states: PlayerState[];
  currentState: PlayerState;
  frameX = 0;
  frameY = 0;
  maxFrame = 0;
  animationFps = 24;
  frameTimer = 0;
  frameInterval = 1000 / this.animationFps;
  positionProgress = SCALED_SIZE;
  isMoving = false;
  speed = 10;
  viewport: ViewPort;
  spritesheet: HTMLImageElement;
  constructor(sprite: HTMLImageElement, viewport: ViewPort, spritesheet: HTMLImageElement) {
    this.position = {
      x: 512,
      y: 512,
    }
    this.sprite = sprite;
    this.states = [
      new StandingRight(this),
      new StandingLeft(this),
      new StandingDown(this),
      new StandingUp(this),
      new WalkingRight(this),
      new WalkingLeft(this),
      new WalkingDown(this),
      new WalkingUp(this),
    ];
    this.currentState = this.states[0];
    this.viewport = viewport;
    this.spritesheet = spritesheet;
  };

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  update(gameKey?: GameKeyCode) {
    const shouldMove = this.positionProgress > 0 && this.currentState.state > 3;
    if (shouldMove) {
      // check collisions
      const { x, y } = this.position;
      
      this.movePlayer();
    } else {
      this.positionProgress = SCALED_SIZE;
      this.currentState.handleInput(gameKey);
    }
  }

  movePlayer() {
    const toAddOrRemove = 2;
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += toAddOrRemove;
        this.positionProgress -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= toAddOrRemove;
        this.positionProgress -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x += toAddOrRemove;
        this.positionProgress -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x -= toAddOrRemove;
        this.positionProgress -= toAddOrRemove;
        break;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      }
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    // 4 * 16 = number of tiles * sprite size
    ctx.drawImage(this.sprite, this.frameX * 64, this.frameY * 64, 64, 64, Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), SCALED_SIZE, SCALED_SIZE);
    // ctx.drawImage(this.sprite, SPRITE_SIZE * this.frameX, SPRITE_SIZE * this.frameY, SPRITE_SIZE, SPRITE_SIZE, this.position.x - this.viewport.x, this.position.y - this.viewport.y, 32, 32);
  }
}
