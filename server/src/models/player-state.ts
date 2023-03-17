import { TO_STANDING_STATE } from '@shared/constants/player-state';
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
export type GameKeyCode = PressKey | ReleaseKey;

export const VALID_KEYS: Record<GameKeyCode, true> = {
  PRESS_ArrowDown: true,
  PRESS_ArrowLeft: true,
  PRESS_ArrowRight: true,
  PRESS_ArrowUp: true,
  PRESS_Enter: true,
  RELEASE_ArrowDown: true,
  RELEASE_ArrowLeft: true,
  RELEASE_ArrowRight: true,
  RELEASE_ArrowUp: true,
  RELEASE_Enter: true,
};

export abstract class PlayerState {
  isStanding?: boolean;
  protected lastStandingState: PlayerStateType = TO_STANDING_STATE[this.state];
  constructor(public state: PlayerStateType) {}
  abstract handleInput(lastKey: GameKeyCode | null): PlayerStateType | null;
}

export class StandingRight extends PlayerState {
  isStanding = true;
  constructor() {
    super(PlayerStateType.STANDING_RIGHT);
  }
  handleInput(lastKey: GameKeyCode | null) {
    switch (lastKey) {
      case 'PRESS_ArrowRight':
        return PlayerStateType.WALKING_RIGHT;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.STANDING_LEFT;
      case 'PRESS_ArrowDown':
        return PlayerStateType.STANDING_DOWN;
      case 'PRESS_ArrowUp':
        return PlayerStateType.STANDING_UP;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class StandingLeft extends PlayerState {
  isStanding = true;
  constructor() {
    super(PlayerStateType.STANDING_LEFT);
  }
  handleInput(lastKey: GameKeyCode | null) {
    switch (lastKey) {
      case 'PRESS_ArrowLeft':
        return PlayerStateType.WALKING_LEFT;
      case 'PRESS_ArrowRight':
        return PlayerStateType.STANDING_RIGHT;
      case 'PRESS_ArrowDown':
        return PlayerStateType.STANDING_DOWN;
      case 'PRESS_ArrowUp':
        return PlayerStateType.STANDING_UP;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class StandingDown extends PlayerState {
  isStanding = true;
  constructor() {
    super(PlayerStateType.STANDING_DOWN);
  }
  handleInput(lastKey: GameKeyCode | null) {
    switch (lastKey) {
      case 'PRESS_ArrowDown':
        return PlayerStateType.WALKING_DOWN;
      case 'PRESS_ArrowRight':
        return PlayerStateType.STANDING_RIGHT;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.STANDING_LEFT;
      case 'PRESS_ArrowUp':
        return PlayerStateType.STANDING_UP;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class StandingUp extends PlayerState {
  isStanding = true;
  constructor() {
    super(PlayerStateType.STANDING_UP);
  }
  handleInput(lastKey: GameKeyCode | null) {
    switch (lastKey) {
      case 'PRESS_ArrowUp':
        return PlayerStateType.WALKING_UP;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.STANDING_LEFT;
      case 'PRESS_ArrowRight':
        return PlayerStateType.STANDING_RIGHT;
      case 'PRESS_ArrowDown':
        return PlayerStateType.STANDING_DOWN;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class WalkingRight extends PlayerState {
  constructor() {
    super(PlayerStateType.WALKING_RIGHT);
  }
  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      return PlayerStateType.STANDING_RIGHT;
    }
    switch (lastKey) {
      case 'PRESS_ArrowDown':
        return PlayerStateType.WALKING_DOWN;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.WALKING_LEFT;
      case 'PRESS_ArrowUp':
        return PlayerStateType.WALKING_UP;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class WalkingLeft extends PlayerState {
  constructor() {
    super(PlayerStateType.WALKING_LEFT);
  }
  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      return PlayerStateType.STANDING_LEFT;
    }
    switch (lastKey) {
      case 'PRESS_ArrowDown':
        return PlayerStateType.WALKING_DOWN;
      case 'PRESS_ArrowRight':
        return PlayerStateType.WALKING_RIGHT;
      case 'PRESS_ArrowUp':
        return PlayerStateType.WALKING_UP;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class WalkingUp extends PlayerState {
  constructor() {
    super(PlayerStateType.WALKING_UP);
  }
  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      return PlayerStateType.STANDING_UP;
    }
    switch (lastKey) {
      case 'PRESS_ArrowDown':
        return PlayerStateType.WALKING_DOWN;
      case 'PRESS_ArrowRight':
        return PlayerStateType.WALKING_RIGHT;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.WALKING_LEFT;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class WalkingDown extends PlayerState {
  constructor() {
    super(PlayerStateType.WALKING_DOWN);
  }
  handleInput(lastKey: GameKeyCode | null) {
    // on every release
    if (lastKey?.startsWith('RELEASE')) {
      return PlayerStateType.STANDING_DOWN;
    }
    switch (lastKey) {
      case 'PRESS_ArrowUp':
        return PlayerStateType.WALKING_UP;
      case 'PRESS_ArrowRight':
        return PlayerStateType.WALKING_RIGHT;
      case 'PRESS_ArrowLeft':
        return PlayerStateType.WALKING_LEFT;
      case null:
        return this.lastStandingState;
      default:
        return null;
    }
  }
}

export class WaitingForBattle extends PlayerState {
  constructor() {
    super(PlayerStateType.WAITING_FOR_BATTLE);
  }

  handleInput(lastKey: GameKeyCode | null) {
    return null;
    // on every release
    // TODO: Do nothing while waiting. Server decides when we
    // will allow the player to move again
  }
}

export class InBattle extends PlayerState {
  constructor() {
    super(PlayerStateType.WAITING_FOR_BATTLE);
  }

  handleInput(lastKey: GameKeyCode | null) {
    return null;
    // on every release
    // TODO: Do nothing while waiting. Server decides when we
    // will allow the player to move again
  }
}
