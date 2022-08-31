import { Position } from "@shared/models/position";
import { Socket } from "socket.io-client";
import { GameKeyCode, InputHandler } from "../input-handler";
import { PlayerState, StandingDown, StandingLeft, StandingRight, StandingUp, WalkingDown, WalkingLeft, WalkingRight, WalkingUp, } from "../player-state";
import { PlayerStateType } from "@shared/models/overworld-game-state";
import { Sprite } from "../sprite";
import { GameObject } from "./game-object";
import { DbPlayer } from "@shared/models/db-player";

/**
 * The Player class representing the
 * current Player.
 */
export class Player extends GameObject {
  socket: Socket;
  states: PlayerState[];
  currentState: PlayerState;
  lastKeySend: GameKeyCode | null = null;
  constructor(sprite: HTMLImageElement, socket: Socket, position: Position) {
    super(new Sprite(sprite, position, { maxFrame: 0, frameX: 0, frameY: 0 }), position);
    this.socket = socket;
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

  changeGameState(gameState: DbPlayer) {
    this.position = gameState.pos;
    if (this.currentState.state !== gameState.state) {
      this.setState(gameState.state);
    }
  }

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  update(delta: number, input: InputHandler) {
    super.update(delta, input);
    const lastKey = input.presedKeys[input.presedKeys.length - 1] ?? null;
    if (lastKey !== this.lastKeySend) {
      this.socket.emit('key', lastKey);
      this.lastKeySend = lastKey;
    }
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    super.render(ctx, delta);
  }
}
