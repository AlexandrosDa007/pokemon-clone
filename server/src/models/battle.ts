import { createId } from "../utils/create-id";
import { BattleState } from '@shared/models/battle';
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class Battle {
    id: string;
    uids: string[];
    history: any[] = [];
    turnIndex: number;
    battleState?: BattleState;
    connections: Record<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>;
    constructor(uids: string[], connections: Record<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>) {
        this.id = createId(10, 'b_');
        this.uids = uids;
        // TODO: make a more fair random generation here
        this.turnIndex = 0;
        this.connections = connections;
    }

    update() {

    }
}
