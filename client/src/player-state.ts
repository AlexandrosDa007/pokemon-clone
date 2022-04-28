import { PlayerStateType } from '@shared/models/overworld-game-state';
import { GameKeyCode } from "./input-handler";
import { OtherPlayer } from "./other-player";
import { Player } from "./player";


export abstract class PlayerState {
  state: PlayerStateType;
  constructor(state: PlayerStateType) {
    this.state = state;
  }
  enter() {
    console.log('entering state', this.state);
    
   }
}


export class StandingRight extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_RIGHT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameX = 0;
    this.player.frameY = 2;
    this.player.maxFrame = 0;

  }
}
export class StandingLeft extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_LEFT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameX = 0;
    this.player.frameY = 1;
    this.player.maxFrame = 0;
  }
}
export class StandingDown extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_DOWN);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 0;
  }
}
export class StandingUp extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.STANDING_UP);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 3;
    this.player.frameX = 0;
    this.player.maxFrame = 0;
  }
}
export class WalkingRight extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_RIGHT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 2;
    this.player.maxFrame = 3;
    this.player.frameX = 0;
  }
}
export class WalkingLeft extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_LEFT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
  }
}
export class WalkingUp extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_UP);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 3;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
  }
}
export class WalkingDown extends PlayerState {
  player: Player | OtherPlayer;
  constructor(player: Player | OtherPlayer) {
    super(PlayerStateType.WALKING_DOWN);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
    this.player.frameY = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
  }
}
