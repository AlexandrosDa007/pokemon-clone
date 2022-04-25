import { Player } from "./player";
type KeyType = 'ArrowDown' | 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'Enter';
type PressKey = `PRESS_${KeyType}`;
type ReleaseKey = `RELEASE_${KeyType}`;
export type GameKeyCode = PressKey | ReleaseKey;

const VALID_KEYS: any = {
  'ArrowDown': true,
  'ArrowLeft': true,
  'ArrowUp': true,
  'ArrowRight': true,
  'Enter': true,
};
export enum PlayerStateType {
  STANDING_RIGHT = 0,
  STANDING_LEFT = 1,
  STANDING_DOWN = 2,
  STANDING_UP = 3,
  WALKING_RIGHT = 4,
  WALKING_LEFT = 5,
  WALKING_DOWN = 6,
  WALKING_UP = 7,
}


export abstract class PlayerState {
  state: PlayerStateType;
  constructor(state: PlayerStateType) {
    this.state = state;
  }
  enter() { }
  handleInput(lastKey?: GameKeyCode) { }
}


export class StandingRight extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    switch (lastKey) {
      case 'PRESS_ArrowRight': {
        this.player.setState(PlayerStateType.WALKING_RIGHT);
        break;
      }
      case 'PRESS_ArrowLeft': {
        this.player.setState(PlayerStateType.STANDING_LEFT);
        break;
      }
      case 'PRESS_ArrowDown': {
        this.player.setState(PlayerStateType.STANDING_DOWN);
        break;
      }
      case 'PRESS_ArrowUp': {
        this.player.setState(PlayerStateType.STANDING_UP);
        break;
      }
    }
  }
}
export class StandingLeft extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    switch (lastKey) {
      case 'PRESS_ArrowLeft': {
        this.player.setState(PlayerStateType.WALKING_LEFT);
        break;
      }
      case 'PRESS_ArrowRight': {
        this.player.setState(PlayerStateType.STANDING_RIGHT);
        break;
      }
      case 'PRESS_ArrowDown': {
        this.player.setState(PlayerStateType.STANDING_DOWN);
        break;
      }
      case 'PRESS_ArrowUp': {
        this.player.setState(PlayerStateType.STANDING_UP);
        break;
      }
    }

  }
}
export class StandingDown extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    switch (lastKey) {
      case 'PRESS_ArrowDown': {
        this.player.setState(PlayerStateType.WALKING_DOWN);
        break;
      }
      case 'PRESS_ArrowRight': {
        this.player.setState(PlayerStateType.STANDING_RIGHT);
        break;
      }
      case 'PRESS_ArrowLeft': {
        this.player.setState(PlayerStateType.STANDING_LEFT);
        break;
      }
      case 'PRESS_ArrowUp': {
        this.player.setState(PlayerStateType.STANDING_UP);
        break;
      }
    }
  }
}
export class StandingUp extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    switch (lastKey) {
      case 'PRESS_ArrowUp': {
        this.player.setState(PlayerStateType.WALKING_UP);
        break;
      }
      case 'PRESS_ArrowLeft': {
        this.player.setState(PlayerStateType.STANDING_LEFT);
        break;
      }
      case 'PRESS_ArrowRight': {
        this.player.setState(PlayerStateType.STANDING_RIGHT);
        break;
      }
      case 'PRESS_ArrowDown': {
        this.player.setState(PlayerStateType.STANDING_DOWN);
        break;
      }
    }
  }
}
export class WalkingRight extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      this.player.setState(PlayerStateType.STANDING_RIGHT);
    } else {
      switch (lastKey) {
        case 'PRESS_ArrowDown': {
          this.player.setState(PlayerStateType.WALKING_DOWN);
          break;
        }
        case 'PRESS_ArrowLeft': {
          this.player.setState(PlayerStateType.WALKING_LEFT);
          break;
        }
        case 'PRESS_ArrowUp': {
          this.player.setState(PlayerStateType.WALKING_UP);
          break;
        }
      }
    }
  }
}
export class WalkingLeft extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      this.player.setState(PlayerStateType.STANDING_LEFT);
    } else {
      switch (lastKey) {
        case 'PRESS_ArrowDown': {
          this.player.setState(PlayerStateType.WALKING_DOWN);
          break;
        }
        case 'PRESS_ArrowRight': {
          this.player.setState(PlayerStateType.WALKING_RIGHT);
          break;
        }
        case 'PRESS_ArrowUp': {
          this.player.setState(PlayerStateType.WALKING_UP);
          break;
        }
      }
    }
  }
}
export class WalkingUp extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      this.player.setState(PlayerStateType.STANDING_UP);
    } else {
      switch (lastKey) {
        case 'PRESS_ArrowDown': {
          this.player.setState(PlayerStateType.WALKING_DOWN);
          break;
        }
        case 'PRESS_ArrowRight': {
          this.player.setState(PlayerStateType.WALKING_RIGHT);
          break;
        }
        case 'PRESS_ArrowLeft': {
          this.player.setState(PlayerStateType.WALKING_LEFT);
          break;
        }
      }
    }
  }
}
export class WalkingDown extends PlayerState {
  player: Player;
  constructor(player: Player) {
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
  handleInput(lastKey?: GameKeyCode) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      this.player.setState(PlayerStateType.STANDING_DOWN);
    } else {
      switch (lastKey) {
        case 'PRESS_ArrowUp': {
          this.player.setState(PlayerStateType.WALKING_UP);
          break;
        }
        case 'PRESS_ArrowRight': {
          this.player.setState(PlayerStateType.WALKING_RIGHT);
          break;
        }
        case 'PRESS_ArrowLeft': {
          this.player.setState(PlayerStateType.WALKING_LEFT);
          break;
        }
      }
    }
  }
}
