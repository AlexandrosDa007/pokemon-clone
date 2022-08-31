import { OverworldGameState } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
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
} from "../player-state";
import { PlayerStateType } from "@shared/models/overworld-game-state";
import { Sprite } from "../sprite";
import { GameObject } from "./game-object";
import { GameKeyCode, InputHandler } from "../input-handler";
import { DbPlayer } from "@shared/models/db-player";

/**
 * Represents another player in the map
 */
export class OtherPlayer extends GameObject {
  playerUid: string;
  currentState: PlayerState;
  playerState: OverworldGameState['players'][''];
  states: PlayerState[];
  constructor(
    playerState: OverworldGameState['players'][''],
    sprite: HTMLImageElement,
    position: Position,
    uid: string,
  ) {
    super(new Sprite(sprite, position, { maxFrame: 0, frameX: 0, frameY: 0 }), position);
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

  }

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

  update(delta: number, input?: InputHandler): void {
    super.update(delta);
    // TODO: specific OtherPlayer updates
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    super.render(ctx, delta);
  }
}
