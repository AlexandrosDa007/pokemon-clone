import { OverworldGamePlayerState, OverworldGameState, PlayerSprite } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
import { Socket } from "socket.io";
const SCALED_SIZE = 32;
import {
  PlayerState,
  StandingRight,
  GameKeyCode,
  PlayerStateType,
  StandingDown,
  StandingLeft,
  StandingUp,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
} from "./player-state";

export class Player {
  overworldPlayerState: OverworldGamePlayerState;
  socket: Socket;
  position: Position;
  sprite: PlayerSprite;;
  states: PlayerState[];
  currentState: PlayerState;
  frameX = 0;
  frameY = 0;
  maxFrame = 0;
  frameTimer = 0;
  pixelsLeftToMove = SCALED_SIZE;
  isMoving = false;
  speed = 10;
  lastKey?: GameKeyCode;
  constructor(
    sprite: PlayerSprite,
    socket: Socket,
    overworldPlayerState: OverworldGamePlayerState,
  ) {
    this.overworldPlayerState = overworldPlayerState;
    this.socket = socket;
    this.position = overworldPlayerState.pos;
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
    socket.on('key', (key) => {
      this.lastKey = key;
    });
  };

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
    this.overworldPlayerState.playerState = this.currentState.state;
  }

  update() {
    const oldState = JSON.stringify(this.overworldPlayerState);
    const shouldMove = this.pixelsLeftToMove > 0 && this.currentState.state > 3;
    if (shouldMove) {
      // check collisions
      const { x, y } = this.position;
      this.movePlayer();
      console.log('moving player ', this.pixelsLeftToMove, this.currentState.state);
    } else {
      this.pixelsLeftToMove = SCALED_SIZE;
      this.currentState.handleInput(this.lastKey);
    }
    // change state
    this.overworldPlayerState = {
      ...this.overworldPlayerState,
      pos: this.position,
    }
    // did position change
    if (oldState !== JSON.stringify(this.overworldPlayerState)) {
      // TODO: only emit changes
      // TODO: emit to a specific room
      return this.overworldPlayerState;
    }
  }

  // render(ctx: CanvasRenderingContext2D, deltaTime: number) {
  //   if (this.frameTimer > this.frameInterval) {
  //     if (this.frameX < this.maxFrame) {
  //       this.frameX++;
  //     }
  //     else this.frameX = 0;
  //     this.frameTimer = 0;
  //   } else {
  //     this.frameTimer += deltaTime;
  //   }
  //   // 4 * 16 = number of tiles * sprite size
  //   ctx.drawImage(this.sprite, this.frameX * 64, this.frameY * 64, 64, 64, Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), SCALED_SIZE, SCALED_SIZE);
  //   // ctx.drawImage(this.sprite, SPRITE_SIZE * this.frameX, SPRITE_SIZE * this.frameY, SPRITE_SIZE, SPRITE_SIZE, this.position.x - this.viewport.x, this.position.y - this.viewport.y, 32, 32);
  // }

  movePlayer() {
    const toAddOrRemove = 2 / 32;
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += toAddOrRemove;
        this.pixelsLeftToMove -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= toAddOrRemove;
        this.pixelsLeftToMove -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x += toAddOrRemove;
        this.pixelsLeftToMove -= toAddOrRemove;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x -= toAddOrRemove;
        this.pixelsLeftToMove -= toAddOrRemove;
        break;
      }
    }
  }
}
