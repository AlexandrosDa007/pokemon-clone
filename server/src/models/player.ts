import { PlayerSprite, PlayerStateType } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
import { Socket } from "socket.io";
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
} from "./player-state";
import { Collider, CollisionEntry } from './collider';
import { SOCKET_EVENTS } from "@shared/constants/socket";
import { DbPlayer } from "@shared/models/db-player";
import io from "src/io";
import { Encounter } from "./encounter";
const MAX_UNITS_TO_MOVE = 1;

export class Player {
  dbPlayer: DbPlayer;
  socket: Socket;
  position: Position;
  sprite: PlayerSprite;;
  states: PlayerState[];
  currentState: PlayerState;
  unitsToMove = 1;
  speed = 2 / 32;
  lastKey: GameKeyCode | null = null;
  collider: Collider;
  lastStandingState: PlayerStateType = PlayerStateType.STANDING_DOWN;
  uid: string;
  encounter: Encounter | null = null;
  constructor(
    sprite: PlayerSprite,
    socket: Socket,
    dbPlayer: DbPlayer,
    uid: string
  ) {
    this.uid = uid;
    this.dbPlayer = dbPlayer;
    this.socket = socket;
    this.position = dbPlayer.pos;
    this.collider = new Collider({ x: this.position.x, y: this.position.y, width: MAX_UNITS_TO_MOVE, height: MAX_UNITS_TO_MOVE });
    this.sprite = sprite;
    this.states = [
      new StandingRight(this),
      new StandingLeft(this),
      new StandingDown(this),
      new StandingUp(this),
      new WalkingRight(this),
      new WalkingLeft(this),
      new WalkingDown(this),
      new WalkingUp(this),
      new WaitingForBattle(this),
      new InBattle(this),
    ];
    this.currentState = this.states[0];
    socket.on(SOCKET_EVENTS.KEY, (key) => {
      this.lastKey = key;
    });
  };

  setState(newState: PlayerStateType) {
    this.lastStandingState = TO_STANDING_STATE[newState];
    this.currentState = this.states[newState];
    this.currentState.enter();
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
    const waitingForPlayer = this.currentState.state === PlayerStateType.WAITING_FOR_BATTLE;
    if (shouldMove && !waitingForPlayer) {
      this.movePlayer();
    } else {
      this.unitsToMove = MAX_UNITS_TO_MOVE;
      this.currentState.handleInput(this.lastKey);
    }
    // change state
    this.dbPlayer = {
      ...this.dbPlayer,
      pos: this.position,
    }
    this.collider.rect.x = this.dbPlayer.pos.x;
    this.collider.rect.y = this.dbPlayer.pos.y;
    // did position change
    const isStateChanged = oldPosition.x !== this.dbPlayer.pos.x ||
      oldPosition.y !== this.dbPlayer.pos.y ||
      oldState !== this.dbPlayer.state;
    return isStateChanged ? this.dbPlayer : null;
  }

  checkPlayerCollision() {
    // move player rect to the next 32x32 block
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.collider.rect.y += MAX_UNITS_TO_MOVE;
        const collisionObject = this.collider.checkCollision();
        if (collisionObject === null) {
          break;
        }
        this.collider.rect.y -= MAX_UNITS_TO_MOVE;
        this.position.y -= this.speed;
        this.unitsToMove = 0;
        if (collisionObject === CollisionEntry.ENCOUNTER) {
          // trigger encounter
          this.setState(PlayerStateType.WAITING_FOR_BATTLE);
          this.triggerEncounter();
        }
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.collider.rect.y -= MAX_UNITS_TO_MOVE;
        const collisionObject = this.collider.checkCollision();
        if (collisionObject === null) {
          break;
        }
        this.collider.rect.y += MAX_UNITS_TO_MOVE;
        this.position.y += this.speed;
        this.unitsToMove = 0;
        if (collisionObject === CollisionEntry.ENCOUNTER) {
          // trigger encounter
          this.setState(PlayerStateType.WAITING_FOR_BATTLE);
          this.triggerEncounter();
        }
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.collider.rect.x += MAX_UNITS_TO_MOVE;
        const collisionObject = this.collider.checkCollision();
        if (collisionObject === null) {
          break;
        }
        this.collider.rect.x -= MAX_UNITS_TO_MOVE;
        this.position.x -= this.speed;
        this.unitsToMove = 0;
        if (collisionObject === CollisionEntry.ENCOUNTER) {
          // trigger encounter
          this.setState(PlayerStateType.WAITING_FOR_BATTLE);
          this.triggerEncounter();
        }
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.collider.rect.x -= MAX_UNITS_TO_MOVE;
        const collisionObject = this.collider.checkCollision();
        if (collisionObject === null) {
          break;
        }
        this.collider.rect.x += MAX_UNITS_TO_MOVE;
        this.position.x += this.speed;
        this.unitsToMove = 0;
        if (collisionObject === CollisionEntry.ENCOUNTER) {
          // trigger encounter
          this.setState(PlayerStateType.WAITING_FOR_BATTLE);
          this.triggerEncounter();
        }
        break;
      }
    }
  }

  movePlayer() {
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += this.speed;
        this.unitsToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= this.speed
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
    this.checkPlayerCollision();
  }

}
