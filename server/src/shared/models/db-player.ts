import { PlayerSprite, PlayerStateType } from './overworld-game-state';
import { Position } from './position';

export interface DbPlayer {
  uid: string;
  pos: Position;
  sprite: PlayerSprite;
  state: PlayerStateType;
}
