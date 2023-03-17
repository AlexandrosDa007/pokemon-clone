import { OverworldGameState } from '@shared/models/overworld-game-state';
import { io, Socket } from 'socket.io-client';
import { Game } from './game';
import { OtherPlayer } from './models/other-player';
import { SpriteLoader } from './sprite-loader';
import { SOCKET_EVENTS } from '@shared/constants/socket';
import { Encounter } from './models/encounter';
import { DbEncounter } from '@shared/models/db-encounter';
import { DbPlayer } from '@shared/models/db-player';
import { Player } from './models/player';

/**
 * The socket io handler
 */
export class SocketHandler {
  socket: Socket;
  constructor(game: Game, token: string, uid: string) {
    this.socket = io('ws://localhost:3000', {
      auth: {
        token: token,
      },
    });

    // TODO: send other players data as well
    this.socket.on(SOCKET_EVENTS.INITIAL_STATE, (initialState: DbPlayer) => {
      game.player = new Player(
        SpriteLoader.SPRITES.PLAYER_1.image,
        this.socket,
        initialState.pos,
        uid,
      );
      game.started = true;
      game.player.stateBuffer.addToBuffer(initialState);
    });

    this.socket.on(SOCKET_EVENTS.STATE_CHANGE, (newState: DbPlayer) => {
      if (newState.uid === uid) {
        // for this player
        game.player.stateBuffer.addToBuffer(newState);
        return;
      }
      const _p = game.otherPlayers.find(
        (item) => item.playerUid === newState.uid,
      );
      _p && _p.stateBuffer.addToBuffer(newState);
      if (!_p) {
        game.otherPlayers.push(
          new OtherPlayer(SpriteLoader.SPRITES.PLAYER_1.image, newState),
        );
      }
      // fix players
      // const _players = newState.players ?? {};
      // const arrayOfPlayers = Object.values(_players).filter(
      //   (p) => p.uid !== uid,
      // );

      // const newPlayers = arrayOfPlayers.filter(
      //   (item) => !game.otherPlayers.find((i) => i.playerUid === item.uid),
      // );
      // game.otherPlayers.push(
      //   ...newPlayers.map(
      //     (p) =>
      //       new OtherPlayer(
      //         newState.players[p.uid],
      //         SpriteLoader.SPRITES.PLAYER_1.image,
      //         p.pos,
      //         p.uid,
      //       ),
      //   ),
      // );
      // game.gameState = newState;
    });

    this.socket.on(SOCKET_EVENTS.BATTLE_INVITES, (battleInvites: unknown) => {
      console.log({ battleInvites });
    });
    this.socket.on(SOCKET_EVENTS.ENCOUNTER, (encounter: DbEncounter) => {
      if (!game.player.encounter) {
        game.player.encounter = new Encounter(encounter, this.socket);
      } else {
        game.player.encounter.setState(encounter);
      }
    });
  }
}
