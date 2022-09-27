import { PlayerStateType } from '@shared/models/overworld-game-state';
import { MatchMakerManager } from 'src/match-maker-manager';
import { Player } from './player';

type BattleKey =
  | 'FIRST_ATTACK'
  | 'SECOND_ATTACK'
  | 'THIRD_ATTACK'
  | 'FOURTH_ATTACK'
  | 'RUN';

type KeyType = 'ArrowDown' | 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'Enter';
type PressKey = `PRESS_${KeyType}`;
type ReleaseKey = `RELEASE_${KeyType}`;
export type GameKeyCode = PressKey | ReleaseKey | BattleKey;

// const VALID_KEYS: any = {
//   'ArrowDown': true,
//   'ArrowLeft': true,
//   'ArrowUp': true,
//   'ArrowRight': true,
//   'Enter': true,
// };

export const TO_STANDING_STATE: Record<PlayerStateType, PlayerStateType> = {
  [PlayerStateType.STANDING_DOWN]: PlayerStateType.STANDING_DOWN,
  [PlayerStateType.STANDING_LEFT]: PlayerStateType.STANDING_LEFT,
  [PlayerStateType.STANDING_RIGHT]: PlayerStateType.STANDING_RIGHT,
  [PlayerStateType.STANDING_UP]: PlayerStateType.STANDING_UP,
  [PlayerStateType.WALKING_DOWN]: PlayerStateType.STANDING_DOWN,
  [PlayerStateType.WALKING_LEFT]: PlayerStateType.STANDING_LEFT,
  [PlayerStateType.WALKING_RIGHT]: PlayerStateType.STANDING_RIGHT,
  [PlayerStateType.WALKING_UP]: PlayerStateType.STANDING_UP,
  [PlayerStateType.WAITING_FOR_BATTLE]: PlayerStateType.STANDING_RIGHT, // TODO: check this
  [PlayerStateType.IN_BATTLE]: PlayerStateType.STANDING_RIGHT, // TODO: check this
};

export abstract class PlayerState {
  state: PlayerStateType;
  isStanding?: boolean;
  constructor(state: PlayerStateType) {
    this.state = state;
  }
  enter() {}
  handleInput(lastKey: GameKeyCode | null) {}
}

export class StandingRight extends PlayerState {
  player: Player;
  isStanding = true;
  constructor(player: Player) {
    super(PlayerStateType.STANDING_RIGHT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
  }
  handleInput(lastKey: GameKeyCode | null) {
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
      case null: {
        this.player.setState(this.player.lastStandingState);
        break;
      }
    }
  }
}
export class StandingLeft extends PlayerState {
  player: Player;
  isStanding = true;
  constructor(player: Player) {
    super(PlayerStateType.STANDING_LEFT);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
  }
  handleInput(lastKey: GameKeyCode | null) {
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
      case null: {
        this.player.setState(this.player.lastStandingState);
        break;
      }
    }
  }
}
export class StandingDown extends PlayerState {
  player: Player;
  isStanding = true;
  constructor(player: Player) {
    super(PlayerStateType.STANDING_DOWN);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
  }
  handleInput(lastKey: GameKeyCode | null) {
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
      case null: {
        this.player.setState(this.player.lastStandingState);
        break;
      }
    }
  }
}
export class StandingUp extends PlayerState {
  player: Player;
  isStanding = true;
  constructor(player: Player) {
    super(PlayerStateType.STANDING_UP);
    this.player = player;
  }
  enter() {
    // select frames
    super.enter();
  }
  handleInput(lastKey: GameKeyCode | null) {
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
      case null: {
        this.player.setState(this.player.lastStandingState);
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
  }
  handleInput(lastKey: GameKeyCode | null) {
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
        case null: {
          this.player.setState(this.player.lastStandingState);
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
  }
  handleInput(lastKey: GameKeyCode | null) {
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
        case null: {
          this.player.setState(this.player.lastStandingState);
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
  }
  handleInput(lastKey: GameKeyCode | null) {
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
        case null: {
          this.player.setState(this.player.lastStandingState);
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
  }
  handleInput(lastKey: GameKeyCode | null) {
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
        case null: {
          this.player.setState(this.player.lastStandingState);
          break;
        }
      }
    }
  }
}

export class WaitingForBattle extends PlayerState {
  player: Player;
  constructor(player: Player) {
    super(PlayerStateType.WAITING_FOR_BATTLE);
    this.player = player;
  }

  enter() {
    // select frames
    super.enter();
  }

  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    // TODO: Do nothing while waiting. Server decides when we
    // will allow the player to move again
  }
}

export class InBattle extends PlayerState {
  player: Player;
  constructor(player: Player) {
    super(PlayerStateType.WAITING_FOR_BATTLE);
    this.player = player;
  }

  enter() {
    // select frames
    super.enter();
  }

  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    // TODO: Do nothing while waiting. Server decides when we
    // will allow the player to move again
  }
}
