import { SOCKET_EVENTS } from '@shared/constants/socket';
import { DbPlayer } from '@shared/models/db-player';
import {
  PlayerSprite,
  PlayerStateType,
} from '@shared/models/overworld-game-state';
import { Position } from '@shared/models/position';
import { getRandomId } from '@shared/utils/get-random-id';
import { Socket } from 'socket.io';
import { savePlayer } from '../api/helpers/save-player';
import { Collider } from './collider';
import {
  GameKeyCode,
  InBattle,
  StandingDown,
  StandingLeft,
  StandingRight,
  StandingUp,
  VALID_KEYS,
  WaitingForBattle,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
} from './player-state';
import { WorldManager } from './world-manager';

const KEY_OFFSET_TIME_MS = 100;

export class ConnectedClient {
  private collider = new Collider({
    x: this.clientData.pos.x,
    y: this.clientData.pos.y,
    width: 1,
    height: 1,
  });
  private sprite = PlayerSprite.FIRST; // TODO
  private states = [
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
  private currentState = this.states[0];
  private lastKey: GameKeyCode | null = null;
  private lastReceivedTimestamp = 0;
  private currentStateId = this.clientData.id;

  constructor(
    private clientData: DbPlayer,
    private socket: Socket,
    private uid: string,
  ) {
    this.socket.on(SOCKET_EVENTS.KEY, this.handleInput.bind(this));
    this.socket.on(SOCKET_EVENTS.DISCONNECT, this.onDisconnect.bind(this));
    this.socket.on(
      SOCKET_EVENTS.FINISH_MOVEMENT,
      ((stateId: string) => {
        // validate
        this.currentStateId = stateId;
      }).bind(this),
    );
  }

  public setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.clientData.state = this.currentState.state;
  }

  isNewStateTimeOk() {
    return (
      this.clientData.id === this.currentStateId &&
      this.lastReceivedTimestamp + KEY_OFFSET_TIME_MS > Date.now()
    );
    // if (
    //   this.clientData.id !== this.currentStateId ||
    //   this.lastReceivedTimestamp + KEY_OFFSET_TIME_MS > Date.now()
    // ) {
    //   return false;
    // }
    // return true;
  }

  handleInput(key: GameKeyCode | null) {
    if (key !== null && !VALID_KEYS[key]) {
      throw new Error('TODO: handle errors');
    }

    if (this.isNewStateTimeOk()) {
      console.log(
        this.clientData.id !== this.currentStateId ? 'wrong state' : 'Too soon',
      );
      return;
    }

    this.lastReceivedTimestamp = Date.now();
    this.lastKey = key;
    const currentPosition = { ...this.clientData.pos };
    const previousState = this.clientData.state;
    const newState = this.currentState.handleInput(this.lastKey);

    if (newState === null) {
      // handle this
      console.log('TODO');

      return;
    }
    const shouldMove = newState > 3 && newState < 8;
    this.setState(newState);
    if (shouldMove) {
      const newPosition = this.getNewPosition(currentPosition);
      this.collider.updateColliderPosition(newPosition);
      const willCollide = this.collider.checkCollision();
      if (!willCollide) {
        // all good
        this.clientData.pos = newPosition;
      } else {
        this.collider.updateColliderPosition(currentPosition);
        // can't move
      }
    }
    this.clientData.id = getRandomId('s_', 6);
    WorldManager.broadcastPlayerNewPosition(this.clientData);
  }

  private getNewPosition(pos: Position) {
    const _pos = { ...pos };
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        _pos.y++;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        _pos.y--;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        _pos.x++;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        _pos.x--;
        break;
      }
    }
    return _pos;
  }

  async onDisconnect(reason: string) {
    const latestState = this.clientData;
    WorldManager.broadcastPlayerNewPosition(latestState);
    await savePlayer(latestState);
  }
}
