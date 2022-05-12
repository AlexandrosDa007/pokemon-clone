export interface BattleState { 
    turnUid: string;
    lastMove: Move;
    sideEffects?: SideEffect[];
}

export interface Move {
    id: string;
    title: string;
    type: string;
}


export interface SideEffect {
    // TODO
}
