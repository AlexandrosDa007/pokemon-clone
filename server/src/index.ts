require('module-alias/register');
import { Server } from 'socket.io';
import { OverworldGamePlayerState, OverworldGameState, PlayerDirection, PlayerSprite } from '@shared/models/overworld-game-state';
import { Player } from './models/player';
import { PlayerStateType } from './models/player-state';

const STATE: OverworldGameState = {
  players: {},
};

const io = new Server(3000, {
  cors: { origin: '*' }
});


console.log('Starting server');

class GameServer {
  ms = 1000 / 60;
  previousTick = Date.now();
  ticks = 0;
  players: Player[] = [];
  gameState: OverworldGameState;
  constructor(
    /**
     * TODO: Save this at times to a db
     */
    gameState: OverworldGameState,
  ) {
    this.gameState = gameState;
    io.on('connection', (socket) => {
      // create player
      const id = socket.id;
      console.log('new user', id);
      const playerState: OverworldGamePlayerState = {
        id,
        playerState: PlayerStateType.STANDING_DOWN,
        pos: {
          x: 4,
          y: 1,
        },
        sprite: PlayerSprite.FIRST,
      };
      gameState.players[id] = playerState;
      this.players.push(new Player(PlayerSprite.FIRST, socket, playerState));
      socket.emit('initializeGame', gameState);
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
    let stateChanged = false;
    this.players.forEach(p => {
      const newState = p.update();
      if (newState) {
        // emit
        this.gameState.players[p.socket.id] = newState;
        stateChanged = true;
      }
    });
    if (stateChanged) {
      io.emit('stateChange', this.gameState);
    }
  }

}

const gameServer = new GameServer(STATE);
