import { DbPlayer } from "@shared/models/db-player";
import { rootRef } from "../../constants/db";

export async function savePlayer(player: DbPlayer) {
    await rootRef.child(`overworld/players/${player.uid}`).update(player);
}
