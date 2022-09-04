import { Position } from "@shared/models/position";
import { Socket } from "socket.io-client";
import { GameKeyCode, InputHandler } from "../input-handler";
import { PlayerState, StandingDown, StandingLeft, StandingRight, StandingUp, WaitingForBattle, WalkingDown, WalkingLeft, WalkingRight, WalkingUp, } from "../player-state";
import { PlayerStateType } from "@shared/models/overworld-game-state";
import { Sprite } from "../sprite";
import { GameObject } from "./game-object";
import { DbPlayer } from "@shared/models/db-player";
import { SOCKET_EVENTS } from "@shared/constants/socket";
import { SpriteLoader } from "../sprite-loader";
import { CANVAS_HEIGHT, CANVAS_WIDTH, SCALED_SIZE } from "@shared/constants/environment";
import { ViewPort } from "../viewport";

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
      new WaitingForBattle(this),
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
      // TODO: add this functionality to UI controls
      // if (this.lastKeySend === 'PRESS_Enter') {
      //   // emit
      //   this.socket.emit(SOCKET_EVENTS.INVITE_TO_BATTLE, 'VO5lbxEBSIwPkr3p7LzC9PsNIDxz');
      // }
    }
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    super.render(ctx, delta);
    if (this.currentState.state === PlayerStateType.WAITING_FOR_BATTLE) {
      // TODO: create a reusable mechanism for actions and emotions etc
      ctx.drawImage(SpriteLoader.SPRITES.EX_MARK.image, 0, 0, 720, 720, Math.round(this.position.x - ViewPort.x + CANVAS_WIDTH * 0.5 - ViewPort.w * 0.5), Math.round((this.position.y - SCALED_SIZE) - ViewPort.y + CANVAS_HEIGHT * 0.5 - ViewPort.h * 0.5), SCALED_SIZE, SCALED_SIZE);
    }
  }
}
