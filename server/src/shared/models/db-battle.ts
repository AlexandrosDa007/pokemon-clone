import { BattleState } from "./battle-state";

export interface DbBattle {
    id: string;
    uids: [string, string];
    turn: number;
    paused?: boolean;
    state: BattleState;
}