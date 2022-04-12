import { SPRITE_SIZE } from "./constants/environment";
import { GameKeyCode } from "./input-handler";
import { PlayerState, PlayerStateType, StandingDown, StandingLeft, StandingRight, StandingUp, WalkingDown, WalkingLeft, WalkingRight, WalkingUp, } from "./player-state";
const gridOffset = 32;
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
  fps = 10;
  frameTimer = 0;
  frameInterval = 1000 / this.fps;
  positionProgress = gridOffset;
  constructor(sprite: HTMLImageElement) {
    this.position = {
      x: 0,
      y: 0,
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
  };

  setState(newState: PlayerStateType) {
    console.log('Setting state', newState);

    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  update(gameKey?: GameKeyCode) {
    const shouldMove = this.positionProgress > 0 && this.currentState.state > 3;
    if (shouldMove) {
      console.log('moving', this.positionProgress);
      this.movePlayer();
    } else {
      this.positionProgress = gridOffset;
      this.currentState.handleInput(gameKey);
    }
  }

  movePlayer() {
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y++;
        this.positionProgress--;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y--;
        this.positionProgress--;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x++;
        this.positionProgress--;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x--;
        this.positionProgress--;
        break;
      }
      case PlayerStateType.STANDING_DOWN: {
        this.positionProgress = gridOffset;
        break;
      }
      case PlayerStateType.STANDING_LEFT: {
        this.positionProgress = gridOffset;
        break;
      }
      case PlayerStateType.STANDING_RIGHT: {
        this.positionProgress = gridOffset;
        break;
      }
      case PlayerStateType.STANDING_UP: {
        this.positionProgress = gridOffset;
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
    ctx.drawImage(this.sprite, SPRITE_SIZE * this.frameX, SPRITE_SIZE * this.frameY, SPRITE_SIZE, SPRITE_SIZE, this.position.x, this.position.y, 32, 32);
  }
}
