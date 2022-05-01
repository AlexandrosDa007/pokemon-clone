import { OverworldGamePlayerState, OverworldGameState } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "./constants/environment";
import {
  PlayerState,
  StandingRight,
  StandingDown,
  StandingLeft,
  StandingUp,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
} from "./player-state";
import { PlayerStateType } from "@shared/models/overworld-game-state";
import { ViewPort } from "./viewport";

export class OtherPlayer {
  playerUid: string;
  position: Position;
  frameX = 0;
  frameY = 0;
  currentState: PlayerState;
  animationFps = 24;
  frameTimer = 0;
  maxFrame = 0;
  frameInterval = 1000 / this.animationFps;
  playerState: OverworldGameState['players'][''];
  states: PlayerState[];
  sprite: HTMLImageElement;
  viewport: ViewPort;
  constructor(
    playerState: OverworldGameState['players'][''],
    sprite: HTMLImageElement,
    position: Position,
    uid: string,
    viewport: ViewPort,
  ) {
    this.viewport = viewport;
    this.sprite = sprite;
    this.playerUid = uid;
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
    this.playerState = playerState;
    this.position = position;
  }

  changeGameState(gameState: OverworldGamePlayerState) {
    this.position = gameState.pos;
    // change currentState
    if (this.currentState.state !== gameState.playerState) {
      this.setState(gameState.playerState);
    }
  }

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
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
    ctx.strokeRect(Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), SCALED_SIZE, SCALED_SIZE);

    ctx.drawImage(this.sprite, this.frameX * 64, this.frameY * 64, 64, 64, Math.round(this.position.x - this.viewport.x + CANVAS_WIDTH * 0.5 - this.viewport.w * 0.5), Math.round(this.position.y - this.viewport.y + CANVAS_HEIGHT * 0.5 - this.viewport.h * 0.5), SCALED_SIZE, SCALED_SIZE);
  }
}