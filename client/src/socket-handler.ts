import { OverworldGameState } from "@shared/models/overworld-game-state";
import { io } from "socket.io-client";
import { Game } from "./game";
import { OtherPlayer } from "./other-player";
import { SpriteLoader } from "./sprite-loader";

/**
 * The socket io handler
 */
export class SocketHandler {
  socket: any;
  constructor(game: Game, token: string) {
    this.socket = io('ws://localhost:3000', {
      auth: {
        token: token,
      },

    });

    this.socket.on('stateChange', (newState: OverworldGameState) => {
      // fix players
      const _players = newState.players ?? {};
      const arrayOfPlayers = Object.values(_players).filter(p => p.id !== this.socket.id);

      const newPlayers = arrayOfPlayers.filter(item => !game.otherPlayers.find(i => i.playerUid === item.id));
      game.otherPlayers.push(...newPlayers.map(p => new OtherPlayer(newState.players[p.id], SpriteLoader.SPRITES.PLAYER_1.image, p.pos, p.id)));
      game.gameState = newState;
    });
  }
}
