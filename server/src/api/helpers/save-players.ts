import { DbPlayer } from '@shared/models/db-player';
import { rootRef } from '../../constants/db';

export async function savePlayers(players: Record<string, DbPlayer>) {
  try {
    await rootRef.child('overworld/players').update(players);
    console.log('Saved players ', Date.now());
  } catch (error) {
    console.error('Could not save players', error);
  }
}
