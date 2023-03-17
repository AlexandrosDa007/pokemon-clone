import { Position } from '@shared/models/position';
import { Socket } from 'socket.io-client';
import { GameKeyCode, InputHandler } from '../input-handler';
import {
  PlayerState,
  StandingDown,
  StandingLeft,
  StandingRight,
  StandingUp,
  WaitingForBattle,
  WalkingDown,
  WalkingLeft,
  WalkingRight,
  WalkingUp,
} from '../player-state';
import { TO_STANDING_STATE } from '@shared/constants/player-state';
import { PlayerStateType } from '@shared/models/overworld-game-state';
import { Sprite } from '../sprite';
import { GameObject } from './game-object';
import { DbPlayer } from '@shared/models/db-player';
import { SOCKET_EVENTS } from '@shared/constants/socket';
import { SpriteLoader } from '../sprite-loader';
import { SCALED_SIZE } from '../constants/environment';
import { ViewPort } from '../viewport';
import { Settings } from '../settings';
import { UIManager } from '../guis/ui-manager';
import { denormalizeUnits } from '../utils/denormalize-units';
import { Encounter } from './encounter';
import { StateBuffer } from './state-buffer';
import _debounce from 'lodash.debounce';
import _throttle from 'lodash.throttle';

/**
 * The Player class representing the
 * current Player.
 */
export class Player extends GameObject {
  socket: Socket;
  states: PlayerState[];
  currentState: PlayerState;
  lastKeySend: GameKeyCode | null = null;
  encounter: Encounter | null = null;
  stateBuffer: StateBuffer;
  unitsLeftToMove = 32;
  speed = 1 / 32;
  currentStateFromBuffer: DbPlayer | null = null;
  constructor(
    sprite: HTMLImageElement,
    socket: Socket,
    position: Position,
    uid: string,
  ) {
    super(
      new Sprite(sprite, position, { maxFrame: 0, frameX: 0, frameY: 0 }),
      position,
    );
    this.socket = socket;
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
    ];
    this.currentState = this.states[0];
    this.stateBuffer = new StateBuffer(uid);
  }

  // changeGameState(gameState: DbPlayer) {
  //   this.position = gameState.pos;
  //   if (this.currentState.state !== gameState.state) {
  //     this.setState(gameState.state);
  //   }
  // }

  setState(newState: PlayerStateType) {
    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  update(delta: number, input: InputHandler) {
    super.update(delta, input);
    if (this.encounter) {
      this.encounter.update(delta);
      return;
    }
    const lastKey = input.presedKeys[input.presedKeys.length - 1] ?? null;
    console.log(lastKey);

    if (lastKey === 'PRESS_Escape') {
      // stop movement
      if (!UIManager.IS_MENU_ACTIVE) {
        this.socket.emit('key', null);
        this.lastKeySend = null;
      }
      UIManager.IS_MENU_ACTIVE = true;
      return;
    }
    if (lastKey !== this.lastKeySend && !UIManager.IS_MENU_ACTIVE) {
      // this.socket.emit('key', lastKey);
      // this.lastKeySend = lastKey;
      // TODO: add this functionality to UI controls
      // if (this.lastKeySend === 'PRESS_Enter') {
      //   // emit
      //   this.socket.emit(SOCKET_EVENTS.INVITE_TO_BATTLE, 'VO5lbxEBSIwPkr3p7LzC9PsNIDxz');
      // }
    }

    if (this.stateBuffer.rendering) {
      // handle rending of lastState
      const lastState = this.stateBuffer.lastStateRendered;
      if (!lastState) {
        throw new Error('wtf');
      }
      if (this.currentState.state !== lastState.state) {
        this.setState(lastState.state);
      }

      const shouldMove =
        lastState.pos.x !== this.position.x ||
        lastState.pos.y !== this.position.y;

      if (this.unitsLeftToMove > 0 && shouldMove) {
        this.movePlayer(lastState.pos);
        console.log('rendering state');
        return;
      }
      // after movement make player stand
      this.setState(TO_STANDING_STATE[lastState.state]);
      // this.unitsLeftToMove = 32;
      this.stateBuffer.rendering = false;
      if (!this.currentStateFromBuffer) {
        console.error('WTF');
      }
      this.stateBuffer.peek() !== null &&
        this.socket.emit(
          SOCKET_EVENTS.FINISH_MOVEMENT,
          this.currentStateFromBuffer?.id,
        );

      // this.lastKeySend = null;
    } else {
      const newState = this.stateBuffer.getNext();
      this.currentStateFromBuffer = newState;
      if (newState === null) {
        console.log('fml');
        if (this.lastKeySend === null && lastKey === null) {
          console.log('do nothing');

          return;
        }
        this.emitKey.call(this, lastKey);
      } else {
        console.log('new state received', newState);
      }
    }
  }

  emitKey = _throttle((key: GameKeyCode | null) => {
    if (!this.currentStateFromBuffer?.id) {
      this.socket.emit(SOCKET_EVENTS.KEY, key);
      this.lastKeySend = key;
    } else {
      console.log('something is wrong');
    }
  }, 50);

  movePlayer(to: Position) {
    switch (this.currentState.state) {
      case PlayerStateType.WALKING_DOWN: {
        this.position.y += this.speed;
        // this.unitsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_UP: {
        this.position.y -= this.speed;
        // this.unitsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_RIGHT: {
        this.position.x += this.speed;
        // this.unitsLeftToMove -= this.speed;
        break;
      }
      case PlayerStateType.WALKING_LEFT: {
        this.position.x -= this.speed;
        // this.unitsLeftToMove -= this.speed;
        break;
      }
      default: {
        this.position = { ...to };
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, delta: number) {
    super.render(ctx, delta);
    if (this.encounter) {
      this.encounter.render(ctx);
      return;
    }
    if (this.currentState.state === PlayerStateType.WAITING_FOR_BATTLE) {
      // TODO: create a reusable mechanism for actions and emotions etc

      const denormalizePos = denormalizeUnits(this.position);
      ctx.drawImage(
        SpriteLoader.SPRITES.EX_MARK.image,
        0,
        0,
        720,
        720,
        Math.round(
          denormalizePos.x -
            ViewPort.x +
            Settings.CANVAS_WIDTH * 0.5 -
            ViewPort.w * 0.5,
        ),
        Math.round(
          denormalizePos.y -
            SCALED_SIZE -
            ViewPort.y +
            Settings.CANVAS_HEIGHT * 0.5 -
            ViewPort.h * 0.5,
        ),
        SCALED_SIZE,
        SCALED_SIZE,
      );
    }
  }
}
