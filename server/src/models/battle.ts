import { BattleState } from "@shared/models/battle-state";
import { DbBattle } from "@shared/models/db-battle";
import { getBattle } from "src/api/helpers/get-battle";

export class Battle {
    dbBattle: DbBattle | null = null;
    BATTLE_ID: string;
    constructor(id: string) {
        this.BATTLE_ID = id;
    }

    async initBattle() {
        try {
            const battle = await getBattle(this.BATTLE_ID);
            this.dbBattle = battle;
        } catch (error) {
            console.error(error);
            throw new Error(`No battle was found`);
        }
    }

}
