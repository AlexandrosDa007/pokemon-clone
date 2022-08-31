import { PlayerSprite } from "@shared/models/overworld-game-state";
import { Position } from "@shared/models/position";
import { Socket } from "socket.io";
import { SCALED_SIZE } from '@shared/constants/environment';
import {
  PlayerState,
  StandingRight,
  GameKeyCode,
  PlayerStateType,
  StandingDown,
  StandingLeft,
  StandingUp,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
  TO_STANDING_STATE,
} from "./player-state";
import { Collider } from './collider';
import { SOCKET_EVENTS } from "@shared/constants/socket";
import { DbPlayer } from "@shared/models/db-player";

export class Player {
  dbPlayer: DbPlayer;
  socket: Socket;
  position: Position;
  sprite: PlayerSprite;;
  states: PlayerState[];
  currentState: PlayerState;
  pixelsLeftToMove = SCALED_SIZE;
  speed = 2;
  lastKey: GameKeyCode | null = null;
  collider: Collider;
  lastStandingState: PlayerStateType = PlayerStateType.STANDING_DOWN;
  uid: string
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
    this.collider = new Collider({ x: this.position.x, y: this.position.y, width: SCALED_SIZE, height: SCALED_SIZE });
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

  update() {
    const oldPosition = {
      x: this.position.x,
      y: this.position.y,
    };
    const oldState = this.dbPlayer.state;
    const shouldMove = this.pixelsLeftToMove > 0 && this.currentState.state > 3;
    if (shouldMove) {
      this.movePlayer();
    } else {
      this.pixelsLeftToMove = SCALED_SIZE;
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
        this.collider.rect.y += SCALED_SIZE;
        const willCollide = this.collider.checkCollision();
        if (willCollide) {
          this.collider.rect.y -= SCALED_SIZE;
          this.position.y -= this.speed;
          this.pixelsLeftToMove = 0;
        }
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.collider.rect.y -= SCALED_SIZE;
        const willCollide = this.collider.checkCollision();
        if (willCollide) {
          this.collider.rect.y += SCALED_SIZE;
          this.position.y += this.speed;
          this.pixelsLeftToMove = 0;
        }
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.collider.rect.x += SCALED_SIZE;
        const willCollide = this.collider.checkCollision();
        if (willCollide) {
          this.collider.rect.x -= SCALED_SIZE;
          this.position.x -= this.speed;
          this.pixelsLeftToMove = 0;
        }
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.collider.rect.x -= SCALED_SIZE;
        const willCollide = this.collider.checkCollision();
        if (willCollide) {
          this.collider.rect.x += SCALED_SIZE;
          this.position.x += this.speed;
          this.pixelsLeftToMove = 0;
        }
        break;
      }
    }
  }

  movePlayer() {
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += this.speed;
        this.pixelsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= this.speed;
        this.pixelsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x += this.speed;
        this.pixelsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x -= this.speed;
        this.pixelsLeftToMove -= this.speed;
        break;
      }
      default: {
        return;
      }
    }
    this.checkPlayerCollision();
  }

}
