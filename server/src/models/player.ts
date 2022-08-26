import { OverworldGamePlayerState, OverworldGameState, PlayerSprite } from "@shared/models/overworld-game-state";
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
import { Collider } from "@shared/models/collisions";

export class Player {
  overworldPlayerState: OverworldGamePlayerState;
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
    overworldPlayerState: OverworldGamePlayerState,
    uid: string
  ) {
    this.uid = uid;
    this.overworldPlayerState = overworldPlayerState;
    this.socket = socket;
    this.position = overworldPlayerState.pos;
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
    socket.on('key', (key) => {
      this.lastKey = key;
    });
  };

  setState(newState: PlayerStateType) {
    this.lastStandingState = TO_STANDING_STATE[newState];
    this.currentState = this.states[newState];
    this.currentState.enter();
    this.overworldPlayerState.playerState = this.currentState.state;
  }

  update() {
    const oldState = JSON.stringify(this.overworldPlayerState);
    const shouldMove = this.pixelsLeftToMove > 0 && this.currentState.state > 3;
    if (shouldMove) {
      const { x, y } = this.position;
      this.movePlayer();
    } else {
      this.pixelsLeftToMove = SCALED_SIZE;
      this.currentState.handleInput(this.lastKey);
    }
    // change state
    this.overworldPlayerState = {
      ...this.overworldPlayerState,
      pos: this.position,
    }
    this.collider.rect.x = this.overworldPlayerState.pos.x;
    this.collider.rect.y = this.overworldPlayerState.pos.y;
    // did position change
    if (oldState !== JSON.stringify(this.overworldPlayerState)) {
      // TODO: only emit changes
      // TODO: emit to a specific room
      return this.overworldPlayerState;
    }
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
