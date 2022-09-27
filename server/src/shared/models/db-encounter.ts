import { Pokemon } from './pokemon';

export const enum EncounterAction {
  ATTACK = 0,
  POKEMON = 1,
  BAG = 3,
  RUN = 4,
}

export const enum EncounterTurn {
  PLAYER = 0,
  POKEMON = 1,
}

export interface DbEncounter {
  id: string;
  pokemon: Pokemon;
  message: string;
  pokemonOut: Pokemon;
  turn: EncounterTurn;
  uid: string;
  action: EncounterAction | null;
  turnIndex: number;
}
