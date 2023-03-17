import { SOCKET_EVENTS } from '@shared/constants/socket';
import { DbPlayer } from '@shared/models/db-player';
import {
  PlayerSprite,
  PlayerStateType,
} from '@shared/models/overworld-game-state';
import { getRandomId } from '@shared/utils/get-random-id';
import { Socket } from 'socket.io';
import { getPlayer } from '../api/helpers/get-player';
import IO from '../io';
import { ConnectedClient } from './connected-client';

export class WorldManager {
  static instance: WorldManager;
  static connectedClients: ConnectedClient[] = [];

  private constructor() {
    console.log('Creating World Manager');
    IO.on(SOCKET_EVENTS.CONNECTION, WorldManager.addClient.bind(this));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WorldManager();
    }
    return this.instance;
  }

  static async addClient(socket: Socket) {
    const uid = (socket as unknown as { uid: string }).uid as string | null;

    if (!uid) {
      throw new Error('NO UID');
    }
    console.log(`Player ${uid} has joined`);
    const dbPlayer = await getPlayer(uid);
    const clientData: DbPlayer = dbPlayer ?? {
      uid,
      state: PlayerStateType.STANDING_DOWN,
      pos: {
        x: 0,
        y: 0,
      },
      id: getRandomId('s_', 6),
      sprite: PlayerSprite.FIRST,
    };
    WorldManager.connectedClients.push(
      new ConnectedClient(clientData, socket, uid),
    );
    // TODO: send to others as well
    // WorldManager.broadcastPlayerNewPosition(clientData);
    WorldManager.sendInitialState(socket, clientData);
  }

  //   static broadcastToClients() {
  //     const obj = this.connectedClients.reduce(
  //       (_obj, c) => ({ ..._obj, [c.getUid()]: c.getState() }),
  //       {} as Record<string, DbPlayer>,
  //     );
  //     IO.emit(SOCKET_EVENTS.STATE_CHANGE, obj);
  //   }

  static sendInitialState(socket: Socket, data: DbPlayer) {
    IO.to(socket.id).emit(SOCKET_EVENTS.INITIAL_STATE, data);
  }

  static broadcastPlayerNewPosition(dbPlayer: DbPlayer) {
    setTimeout(() => {
      IO.emit(SOCKET_EVENTS.STATE_CHANGE, dbPlayer);
    }, 100);
  }
}
