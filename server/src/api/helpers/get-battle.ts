import { DbBattle } from '@shared/models/db-battle';
import { rootRef } from '../../constants/db';

export async function getBattle(id: string): Promise<DbBattle | null> {
  const battleRef = rootRef.child(`battles/${id}`).get();
  const battle = await battleRef.then((snap) => snap.val() as DbBattle);
  return battle;
}
