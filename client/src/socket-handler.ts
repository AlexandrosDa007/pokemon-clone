import { OverworldGameState } from "@shared/models/overworld-game-state";
import { io } from "socket.io-client";
import { Game } from "./game";
import { OtherPlayer } from "./models/other-player";
import { SpriteLoader } from "./sprite-loader";
import { SOCKET_EVENTS } from '@shared/constants/socket';

/**
 * The socket io handler
 */
export class SocketHandler {
  socket: any;
  constructor(game: Game, token: string, uid: string) {
    this.socket = io('ws://localhost:3000', {
      auth: {
        token: token,
      },
    });
    this.socket.on(SOCKET_EVENTS.STATE_CHANGE, (newState: OverworldGameState) => {
      // fix players
      const _players = newState.players ?? {};
      const arrayOfPlayers = Object.values(_players).filter(p => p.uid !== uid);

      const newPlayers = arrayOfPlayers.filter(item => !game.otherPlayers.find(i => i.playerUid === item.uid));
      game.otherPlayers.push(...newPlayers.map(p => new OtherPlayer(newState.players[p.uid], SpriteLoader.SPRITES.PLAYER_1.image, p.pos, p.uid)));
      game.gameState = newState;
    });

    this.socket.on(SOCKET_EVENTS.BATTLE_INVITES, (battleInvites: any) => {
      console.log({battleInvites});
      
    })
  }
}
