import { OverworldGamePlayerState } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
import { Socket } from "socket.io-client";
import { GameKeyCode, InputHandler } from "./input-handler";
import { PlayerState, StandingDown, StandingLeft, StandingRight, StandingUp, WalkingDown, WalkingLeft, WalkingRight, WalkingUp, } from "./player-state";
import { PlayerStateType } from "@shared/models/overworld-game-state";
import { Sprite } from "./sprite";
import { GameObject } from "./game-object";
import { MESSAGE_IDS } from "@shared/constants/message-ids";
import { ViewPort } from "./viewport";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@shared/constants/environment";

/**
 * The Player class representing the
 * current Player.
 */
export class Player extends GameObject {
  socket: Socket;
  states: PlayerState[];
  currentState: PlayerState;
  lastKeySend: GameKeyCode | null = null;
  waitingForBattle?: boolean;
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

  changeGameState(gameState: OverworldGamePlayerState) {
    this.position = gameState.pos;
    if (this.currentState.state !== gameState.playerState) {
      this.setState(gameState.playerState);
    }
  }

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  update(delta: number, input: InputHandler) {
    super.update(delta, input);
    if (this.waitingForBattle) {
      return;
    }
    const lastKey = input.presedKeys[input.presedKeys.length - 1] ?? null;
    if (lastKey === 'PRESS_Enter') {
      // create test battle
      console.log('create battle');

      this.socket.emit(MESSAGE_IDS.CREATE_BATTLE, { userId: 'ENEMY_PLAER' });
      this.waitingForBattle = true;
      this.socket.emit(MESSAGE_IDS.KEY, null);
      return;
    } else {
      delete this.waitingForBattle;
    }
    if (lastKey !== this.lastKeySend) {
      this.socket.emit(MESSAGE_IDS.KEY, lastKey);
      this.lastKeySend = lastKey;
    }
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    super.render(ctx, delta);
    if (this.waitingForBattle) {
      ctx.strokeStyle = 'color: purple; width: 4px';
      ctx.lineWidth = 4;
      ctx.strokeRect((CANVAS_WIDTH / 2) - 128, (CANVAS_HEIGHT / 2) - 128, 256, 256);
      ctx.lineWidth = 1;
    }
  }
}
