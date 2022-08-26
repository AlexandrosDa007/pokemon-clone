require('module-alias/register');
import { Server } from 'socket.io';
import { OverworldGamePlayerState, OverworldGameState, PlayerSprite } from '@shared/models/overworld-game-state';
import { Player } from './models/player';
import { PlayerStateType } from './models/player-state';
import { getAuth } from './api/middleware/auth';

import API from './api/api';

const STATE: OverworldGameState = {
  players: {},
};

const io = new Server(3000, {
  cors: { origin: '*' }
});

io.use(async (socket: any, next) => {
  const userToken = socket.handshake.auth.token;
  const uid = await getAuth(userToken);
  if (!uid) {
    return next(new Error('Invalid token'));
  }
  socket.userId = uid;
  next();
});

console.log('Starting server');

export class GameServer {
  ms = 1000 / 60;
  previousTick = Date.now();
  ticks = 0;
  lastEmittionTimestamp = 0;
  GAME_STATE_BUFFER_TIME_MS = 50;
  players: Player[] = [];
  gameState: OverworldGameState;
  overworldGameStateChanged = false;
  constructor(
    /**
     * TODO: Save this at times to a db
     */
    gameState: OverworldGameState,
  ) {
    this.gameState = gameState;
    io.on('connection', (socket: any) => {
      // create player
      const uid = socket.userId;
      if (!uid) {
        throw new Error('NO UID');
      }
      console.log('new user', uid);
      const playerState: OverworldGamePlayerState = {
        id: uid,
        playerState: PlayerStateType.STANDING_DOWN,
        pos: {
          x: 12 * 32,
          y: 8 * 32,
        },
        sprite: PlayerSprite.FIRST,
      };
      gameState.players[uid] = playerState;
      this.players.push(new Player(PlayerSprite.FIRST, socket, playerState, uid));
      socket.emit('stateChange', gameState);
    });
    this.loop.bind(this)();
  }

  loop() {
    const now = Date.now();
    this.ticks++;
    if (this.previousTick + this.ms <= now) {
      const delta = (now - this.previousTick) / 1000;
      this.previousTick = now;
      this.update(delta);
      this.ticks = 0;
    }

    if (Date.now() - this.previousTick < this.ms - 16) {
      setTimeout(this.loop.bind(this));
    } else {
      setImmediate(this.loop.bind(this));
    }

  }

  update(delta: number) {
    this.players.forEach(p => {
      const newState = p.update();
      if (newState) {
        // Register new state
        this.gameState.players[p.uid] = newState;
        this.overworldGameStateChanged = true;
      }
    });
    // Buffer state changes
    if (this.lastEmittionTimestamp < Date.now() - this.GAME_STATE_BUFFER_TIME_MS) {
      if (this.overworldGameStateChanged) {
        io.emit('stateChange', this.gameState);
        this.overworldGameStateChanged = false;
      }
      this.lastEmittionTimestamp = Date.now();
    }
  }

}

const gameServer = new GameServer(STATE);
API(gameServer);