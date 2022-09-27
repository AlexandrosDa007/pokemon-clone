import { DbPlayer } from './db-player';

export enum PlayerDirection {
  UP = 0,
  RIGHT = 1,
  LEFT = 2,
  DOWN = 3,
}

export enum PlayerSprite {
  FIRST = 0,
  SECOND = 1,
}

export interface OverworldGameState {
  players: Record<string, DbPlayer>;
}

export enum PlayerStateType {
  STANDING_RIGHT = 0,
  STANDING_LEFT = 1,
  STANDING_DOWN = 2,
  STANDING_UP = 3,
  WALKING_RIGHT = 4,
  WALKING_LEFT = 5,
  WALKING_DOWN = 6,
  WALKING_UP = 7,
  WAITING_FOR_BATTLE = 8,
  IN_BATTLE = 9,
}
