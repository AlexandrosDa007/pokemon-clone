import { DbPlayer } from '@shared/models/db-player';
import { rootRef } from '../../constants/db';

export async function getPlayer(uid: string) {
  const playerRef = rootRef.child(`overworld/players/${uid}`);
  const player = await playerRef
    .get()
    .then((snap) => snap.val() as DbPlayer | null);
  return player;
}
