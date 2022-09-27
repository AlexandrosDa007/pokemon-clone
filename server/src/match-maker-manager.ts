import { SOCKET_EVENTS } from '@shared/constants/socket';
import { PlayerStateType } from '@shared/models/overworld-game-state';
import { GameServer } from './game-server';
import { Player } from './models/player';
import IO from './io';

const BATTLE_INVITATION_EXPIRE_MS = 5 * 60 * 1000;

export class MatchMakerManager {
  static gameServer: GameServer;
  static invitations: Record<
    string,
    {
      uid: string;
      playerName: string;
      timestamp: number;
      expiresAt: number;
    }[]
  > = {};

  /**
   *
   * @param player The player that sends the invitation
   * @param playerUid The player that receives the invitation
   */
  static sendInvitation(player: Player, playerUid: string) {
    const receiver = this.gameServer.players.find((p) => p.uid === playerUid);
    if (!receiver) {
      // TODO: figure out what to do here
      console.log('No receiver');

      return;
    }
    const receiverInvitations = this.invitations[receiver.uid] ?? [];

    const sendNotification = () => {
      this.invitations[receiver.uid] = receiverInvitations;
      player.setState(PlayerStateType.WAITING_FOR_BATTLE);
      IO.to(receiver.socket.id).emit(
        SOCKET_EVENTS.BATTLE_INVITES,
        receiverInvitations,
      );
      console.log(this.gameServer.gameState);
      const stateToEmit = {
        ...this.gameServer.gameState,
        players: {
          ...this.gameServer.gameState.players,
          [player.uid]: player.dbPlayer,
        },
      };
      IO.to(player.socket.id).emit(SOCKET_EVENTS.STATE_CHANGE, stateToEmit);
    };

    // Platyer already has invited this player (receiver)
    if (receiverInvitations.find((inv) => inv.uid === player.uid)) {
      receiverInvitations.find((inv) => inv.uid === player.uid)!.timestamp =
        Date.now();
      sendNotification();
      return;
    }

    receiverInvitations.push({
      // TODO: create username and user details
      playerName: 'Player name',
      uid: player.uid,
      timestamp: Date.now(),
      expiresAt: Date.now() + BATTLE_INVITATION_EXPIRE_MS,
    });

    sendNotification();

    return this.invitations[receiver.uid];
  }
}
