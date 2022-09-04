import { PlayerStateType } from '@shared/models/overworld-game-state';
import { OtherPlayer } from "./models/other-player";
import { Player } from "./models/player";

/**
 * Generic PlayerState class that keeps
 * the PlayerStateType
 */
export abstract class PlayerState {
  state: PlayerStateType;
  constructor(state: PlayerStateType) {
    this.state = state;
  }
  enter() { }
}

export class StandingRight extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_RIGHT);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameX = 0;
    this.player.sprite.frameY = 2;
    this.player.sprite.maxFrame = 0;

  }
}
export class StandingLeft extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_LEFT);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameX = 0;
    this.player.sprite.frameY = 1;
    this.player.sprite.maxFrame = 0;
  }
}
export class StandingDown extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_DOWN);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 0;
    this.player.sprite.frameX = 0;
    this.player.sprite.maxFrame = 0;
  }
}
export class StandingUp extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_UP);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 3;
    this.player.sprite.frameX = 0;
    this.player.sprite.maxFrame = 0;
  }
}
export class WalkingRight extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_RIGHT);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 2;
    this.player.sprite.maxFrame = 3;
    this.player.sprite.frameX = 0;
  }
}
export class WalkingLeft extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_LEFT);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 1;
    this.player.sprite.frameX = 0;
    this.player.sprite.maxFrame = 3;
  }
}
export class WalkingUp extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_UP);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 3;
    this.player.sprite.frameX = 0;
    this.player.sprite.maxFrame = 3;
  }
}
export class WalkingDown extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_DOWN);
    this.player = player;
  }
  enter() {
    super.enter();
    this.player.sprite.frameY = 0;
    this.player.sprite.frameX = 0;
    this.player.sprite.maxFrame = 3;
  }
}

export class WaitingForBattle extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WAITING_FOR_BATTLE);
    this.player = player;
  }
  enter(): void {
    super.enter();
    // TODO
    this.player.sprite.frameX = 0;
    this.player.sprite.frameY = 0;
    this.player.sprite.maxFrame = 3;
  }
}

/**
 * TODO: add more states
 * like running, cycling
 */
