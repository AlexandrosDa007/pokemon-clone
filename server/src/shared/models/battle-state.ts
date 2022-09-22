import { Pokemon } from "./pokemon";

export interface BattleState {
    pokemonOut: [Pokemon, Pokemon];
    messages: [string, string];
}
