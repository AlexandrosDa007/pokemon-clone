import {
  PlayerSprite,
  PlayerStateType,
} from '@shared/models/overworld-game-state';
import { Position } from '@shared/models/position';
import { Socket } from 'socket.io';
// import { SCALED_SIZE } from '@shared/constants/environment';
import {
  PlayerState,
  StandingRight,
  GameKeyCode,
  StandingDown,
  StandingLeft,
  StandingUp,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
  TO_STANDING_STATE,
  WaitingForBattle,
  InBattle,
} from './player-state';
import { Collider, CollisionEntry } from './collider';
import { SOCKET_EVENTS } from '@shared/constants/socket';
import { DbPlayer } from '@shared/models/db-player';
import io from 'src/io';
import { Encounter } from './encounter';
const MAX_UNITS_TO_MOVE = 1;

export class Player {
  dbPlayer: DbPlayer;
  socket: Socket;
  position: Position;
  sprite: PlayerSprite;
  states: PlayerState[];
  currentState: PlayerState;
  unitsToMove = 1;
  speed = 2 / 32;
  lastKey: GameKeyCode | null = null;
  collider: Collider;
  uid: string;
  encounter: Encounter | null = null;
  constructor(
    sprite: PlayerSprite,
    socket: Socket,
    dbPlayer: DbPlayer,
    uid: string,
  ) {
    this.uid = uid;
    this.dbPlayer = dbPlayer;
    this.socket = socket;
    this.position = dbPlayer.pos;
    this.collider = new Collider({
      x: this.position.x,
      y: this.position.y,
      width: MAX_UNITS_TO_MOVE,
      height: MAX_UNITS_TO_MOVE,
    });
    this.sprite = sprite;
    this.states = [
      new StandingRight(),
      new StandingLeft(),
      new StandingDown(),
      new StandingUp(),
      new WalkingRight(),
      new WalkingLeft(),
      new WalkingDown(),
      new WalkingUp(),
      new WaitingForBattle(),
      new InBattle(),
    ];
    this.currentState = this.states[0];
    socket.on(SOCKET_EVENTS.KEY, (key: GameKeyCode | null) => {
      this.lastKey = key;
    });
  }

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.dbPlayer.state = this.currentState.state;
  }

  triggerEncounter() {
    if (!this.encounter) {
      this.encounter = new Encounter(this.uid, this.socket);
    }
  }

  update() {
    if (this.encounter) {
      // stop doing other stuff;
      this.encounter.update(this.lastKey);
      return null;
    }
    const oldPosition = {
      x: this.position.x,
      y: this.position.y,
    };
    const oldState = this.dbPlayer.state;
    const shouldMove = this.unitsToMove > 0 && this.currentState.state > 3;
    const waitingForPlayer =
      this.currentState.state === PlayerStateType.WAITING_FOR_BATTLE;
    if (shouldMove && !waitingForPlayer) {
      this.movePlayer();
    } else {
      this.unitsToMove = MAX_UNITS_TO_MOVE;
      const newState = this.currentState.handleInput(this.lastKey);
      if (newState !== null) {
        this.setState(newState);
      }
    }
    // change state
    this.dbPlayer = {
      ...this.dbPlayer,
      pos: this.position,
    };
    this.collider.updateColliderPosition({ ...this.dbPlayer.pos });
    // did position change
    const isStateChanged =
      oldPosition.x !== this.dbPlayer.pos.x ||
      oldPosition.y !== this.dbPlayer.pos.y ||
      oldState !== this.dbPlayer.state;
    return isStateChanged ? this.dbPlayer : null;
  }

  // checkPlayerCollision() {
  //   // move player rect to the next 32x32 block
  //   switch (this.currentState.state) {
  //     case PlayerStateType.WALKING_DOWN: {
  //       this.collider.rect.y += MAX_UNITS_TO_MOVE;
  //       const collisionObject = this.collider.checkCollision();
  //       if (collisionObject === null) {
  //         break;
  //       }
  //       this.collider.rect.y -= MAX_UNITS_TO_MOVE;
  //       this.position.y -= this.speed;
  //       this.unitsToMove = 0;
  //       if (collisionObject === CollisionEntry.ENCOUNTER) {
  //         // trigger encounter
  //         this.setState(PlayerStateType.WAITING_FOR_BATTLE);
  //         this.triggerEncounter();
  //       }
  //       break;
  //     }
  //     case PlayerStateType.WALKING_UP: {
  //       this.collider.rect.y -= MAX_UNITS_TO_MOVE;
  //       const collisionObject = this.collider.checkCollision();
  //       if (collisionObject === null) {
  //         break;
  //       }
  //       this.collider.rect.y += MAX_UNITS_TO_MOVE;
  //       this.position.y += this.speed;
  //       this.unitsToMove = 0;
  //       if (collisionObject === CollisionEntry.ENCOUNTER) {
  //         // trigger encounter
  //         this.setState(PlayerStateType.WAITING_FOR_BATTLE);
  //         this.triggerEncounter();
  //       }
  //       break;
  //     }
  //     case PlayerStateType.WALKING_RIGHT: {
  //       this.collider.rect.x += MAX_UNITS_TO_MOVE;
  //       const collisionObject = this.collider.checkCollision();
  //       if (collisionObject === null) {
  //         break;
  //       }
  //       this.collider.rect.x -= MAX_UNITS_TO_MOVE;
  //       this.position.x -= this.speed;
  //       this.unitsToMove = 0;
  //       if (collisionObject === CollisionEntry.ENCOUNTER) {
  //         // trigger encounter
  //         this.setState(PlayerStateType.WAITING_FOR_BATTLE);
  //         this.triggerEncounter();
  //       }
  //       break;
  //     }
  //     case PlayerStateType.WALKING_LEFT: {
  //       this.collider.rect.x -= MAX_UNITS_TO_MOVE;
  //       const collisionObject = this.collider.checkCollision();
  //       if (collisionObject === null) {
  //         break;
  //       }
  //       this.collider.rect.x += MAX_UNITS_TO_MOVE;
  //       this.position.x += this.speed;
  //       this.unitsToMove = 0;
  //       if (collisionObject === CollisionEntry.ENCOUNTER) {
  //         // trigger encounter
  //         this.setState(PlayerStateType.WAITING_FOR_BATTLE);
  //         this.triggerEncounter();
  //       }
  //       break;
  //     }
  //   }
  // }

  movePlayer() {
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += this.speed;
        this.unitsToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= this.speed;
        this.unitsToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x += this.speed;
        this.unitsToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x -= this.speed;
        this.unitsToMove -= this.speed;
        break;
      }
      default: {
        return;
      }
    }
    // this.checkPlayerCollision();
  }
}
