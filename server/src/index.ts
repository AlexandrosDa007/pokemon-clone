require('module-alias/register');
import { Server, Socket } from 'socket.io';
import { OverworldGamePlayerState, OverworldGameState, PlayerDirection, PlayerSprite } from '@shared/models/overworld-game-state';
import { Player } from './models/player';
import { PlayerStateType } from './models/player-state';
import { MESSAGE_IDS } from '@shared/constants/message-ids';
import { createBattle } from './utils/create-battle';
import { Battle } from './models/battle';
import { createId } from './utils/create-id';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

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
  battles: Battle[] = [];
  connections: Record<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>> = {};
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
      this.connections[id] = socket;
      console.log('new user', id);
      const playerState: OverworldGamePlayerState = {
        id,
        playerState: PlayerStateType.STANDING_DOWN,
        pos: {
          x: 12 * 32,
          y: 8 * 32,
        },
        sprite: PlayerSprite.FIRST,
      };
      gameState.players[id] = playerState;
      this.players.push(new Player(PlayerSprite.FIRST, socket, playerState));
      socket.emit(MESSAGE_IDS.OVERWORLD_STATE, gameState);
      socket.on(MESSAGE_IDS.CREATE_BATTLE, ({ enemyUid }) => {
        this.createBattle.bind(this)(socket.id, enemyUid)
      });
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
      io.emit(MESSAGE_IDS.OVERWORLD_STATE, this.gameState);
    }
  }

  createBattle(uid: string, enemyUid: string) {
    // Check if battle is already happening
    const battleExists = !!this.battles.find(battle => battle.uids.some(id => id === uid || enemyUid === id));
    if (battleExists) {
      // send message to players with the battle info
      return;
    }
    // create new battle
    this.battles.push(new Battle([uid, enemyUid], { [uid]: this.connections[uid], [enemyUid]: this.connections[enemyUid] }));
  }

}

const gameServer = new GameServer(STATE);
