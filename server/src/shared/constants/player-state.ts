import { PlayerStateType } from '@shared/models/overworld-game-state';

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
