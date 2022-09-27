import { SOCKET_EVENTS } from '@shared/constants/socket';
import { DbPlayer } from '@shared/models/db-player';
import {
  OverworldGameState,
  PlayerSprite,
  PlayerStateType,
} from '@shared/models/overworld-game-state';
import { getPlayer } from './api/helpers/get-player';
import { savePlayer } from './api/helpers/save-player';
import { savePlayers } from './api/helpers/save-players';
import { MatchMakerManager } from './match-maker-manager';
import { Player } from './models/player';
import IO from './io';
import { Socket } from 'socket.io';

export class GameServer {
  static instance: GameServer | null = null;
  MS = 1000 / 60;
  previousTick = Date.now();
  ticks = 0;
  lastEmittionTimestamp = 0;
  GAME_STATE_BUFFER_TIME_MS = 50;
  players: Player[] = [];
  gameState: OverworldGameState;
  overworldGameStateChanged = false;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GameServer();
    }
    return this.instance;
  }

  private constructor() {
    MatchMakerManager.gameServer = this;
    this.gameState = { players: {} };
    IO.on(SOCKET_EVENTS.CONNECTION, async (socket: Socket) => {
      // create player
      const uid = (socket as unknown as { uid: string }).uid as string | null;

      if (!uid) {
        throw new Error('NO UID');
      }
      // TODO: send message to clients
      console.log(`Player ${uid} has joined`);
      try {
        const dbPlayer = await getPlayer(uid);
        const playerState: DbPlayer = dbPlayer ?? {
          uid,
          state: PlayerStateType.STANDING_DOWN,
          pos: {
            x: 0,
            y: 0,
          },
          sprite: PlayerSprite.FIRST,
        };
        this.gameState.players[uid] = playerState;
        const player = new Player(PlayerSprite.FIRST, socket, playerState, uid);
        this.players.push(player);
        IO.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
        socket.on(SOCKET_EVENTS.DISCONNECT, async (reason: string) => {
          const oldPlayerState = this.gameState.players[uid];
          const _newPlayers = this.players.filter((p) => p.uid !== uid);
          this.players = _newPlayers;
          this.gameState.players = this.players.reduce(
            (players, p) => ({ ...players, [p.uid]: p.dbPlayer }),
            {},
          );

          // TODO: check this again
          IO.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
          await savePlayer(oldPlayerState);
        });
        socket.on(SOCKET_EVENTS.INVITE_TO_BATTLE, (playerUid: string) => {
          console.log(`Player ${uid} has invited ${playerUid} to battle`);
          MatchMakerManager.sendInvitation(player, playerUid);
        });
      } catch (error) {
        console.error('SOMETHING WENT WRONG', error);
      }
    });
    this.loop.bind(this)().catch(console.error);
  }

  async loop() {
    const now = Date.now();
    this.ticks++;
    if (this.previousTick + this.MS <= now) {
      const delta = (now - this.previousTick) / 1000;
      this.previousTick = now;
      await this.update(delta);
      this.ticks = 0;
    }

    if (Date.now() - this.previousTick < this.MS - 16) {
      setTimeout(this.loop.bind(this));
    } else {
      setImmediate(this.loop.bind(this));
    }
  }

  async update(delta: number) {
    this.players.forEach((p) => {
      const newState = p.update();
      if (newState) {
        // Register new state
        this.gameState.players[p.uid] = newState;
        this.overworldGameStateChanged = true;
        // One and done operation
        // TODO: try to refactor this
        if (
          newState.state === PlayerStateType.WAITING_FOR_BATTLE &&
          !!p.encounter
        ) {
          // emit and change state
          IO.to(p.socket.id).emit(
            SOCKET_EVENTS.ENCOUNTER,
            p.encounter.encounterState,
          );
          // TODO: save to db
          p.setState(PlayerStateType.IN_BATTLE);
        }
      }
    });
    // Buffer state changes
    if (
      this.lastEmittionTimestamp <
      Date.now() - this.GAME_STATE_BUFFER_TIME_MS
    ) {
      if (this.overworldGameStateChanged) {
        IO.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
        // Save state in DB
        await savePlayers(this.gameState.players);
        this.overworldGameStateChanged = false;
      }
      this.lastEmittionTimestamp = Date.now();
    }
  }
}
