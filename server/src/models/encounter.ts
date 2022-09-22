import { SOCKET_EVENTS } from "@shared/constants/socket";
import { BattleState } from "@shared/models/battle-state";
import { DbEncounter, EncounterAction, EncounterTurn } from "@shared/models/db-encounter";
import { Attack, Pokemon } from "@shared/models/pokemon";
import { getRandomId } from "@shared/utils/get-random-id";
import { Socket } from "socket.io";
import io from "../io";
import { GameKeyCode } from "./player-state";




// TODO: Update this for each zone
function getRandomPokemon(): Pokemon {
    return {
        id: getRandomId('pok_'),
        name: 'Bulbasaur',
        hp: 100,
        maxHp: 100,
        moves: ['TACKLE', null, null, null],
        pp: [20, 0, 0, 0],
    }
}


export class Encounter {
    id: string;
    encounterState: DbEncounter;
    socket: Socket;
    lastTurnSent = 0;
    lastTurnAcknowledged = -1;

    constructor(uid: string, socket: Socket) {
        this.id = getRandomId('en_', 10);
        this.socket = socket;
        this.socket.on(SOCKET_EVENTS.ENCOUNTER_ACKNOWLEDGED, (turnAcknowledged: number) => {
            if (turnAcknowledged !== this.lastTurnSent) {
                throw new Error('User acknowledged wrong turn');
            }
            this.lastTurnAcknowledged = turnAcknowledged;
        });
        const pokemon = getRandomPokemon();
        this.encounterState = {
            pokemon,
            id: this.id,
            pokemonOut: { ...pokemon },
            turn: 0,
            message: `A wild ${pokemon.name} appears. What are you going to do?`,
            uid,
            action: null,
            turnIndex: 0,
        };
    }
    // action: EncounterAction, options?: { move: Attack }
    update(lastKey: GameKeyCode | null) {

        console.log({ lastKey });

        // TODO: fix last key sent break
        if (!lastKey || lastKey !== 'FIRST_ATTACK') {
            return;
        }

        if (this.lastTurnAcknowledged < this.lastTurnSent) {
            return;
        }

        // map key to action
        const action = lastKey === 'FIRST_ATTACK' ? EncounterAction.ATTACK : EncounterAction.RUN;
        const move: Attack | undefined = (() => {
            const map: Partial<Record<GameKeyCode, Attack>> = {
                FIRST_ATTACK: 'TACKLE',
                SECOND_ATTACK: 'EMBER',
                THIRD_ATTACK: 'FLAMETHROWER',
            };
            return map[lastKey];
        })();

        if (!move) {
            throw new Error('No move found');
        }

        if (this.encounterState.turn === EncounterTurn.PLAYER) {
            // player turn
            if (action === EncounterAction.RUN) {
                // END BATTLE
                this.end();
                return null;
            }

            if (action === EncounterAction.ATTACK) {
                const newState = HANDLE_ATTACK(this.encounterState, move);
                this.encounterState = newState;
                if (this.lastTurnSent < newState.turnIndex) {
                    io.to(this.socket.id).emit(SOCKET_EVENTS.ENCOUNTER, newState);
                    this.lastTurnSent = newState.turnIndex;
                }
            }


        } else if (this.encounterState.turn === EncounterTurn.POKEMON) {
            // wild pokemon turn
            const newState = HANDLE_ATTACK(this.encounterState, this.encounterState.pokemon.moves[0]);
            this.encounterState = newState;
            return newState;

        } else {
            throw new Error(`Incorrect turn`);
        }
    }

    end() {
        this.encounterState.message = 'Battle end';
    }

}

function HANDLE_ATTACK(encounterState: DbEncounter, attackId: Attack) {
    // TODO: create pure function for state change
    const turn = encounterState.turn;
    if (turn === EncounterTurn.PLAYER) {
        // TODO: make deep copy
        const moveIndex = encounterState.pokemon.moves.findIndex(item => item === attackId);
        if (moveIndex === -1) {
            throw new Error(`No such move`);
        }
        const newPokemonPP = encounterState.pokemon.pp.map((p, index) => index === moveIndex && !!p ? (p - 1) : p);
        return {
            ...encounterState,
            turnIndex: encounterState.turnIndex + 1,
            turn: encounterState.turn === EncounterTurn.PLAYER ? EncounterTurn.PLAYER : EncounterTurn.PLAYER,
            pokemon: { ...encounterState.pokemon, moves: [...encounterState.pokemon.moves], pp: newPokemonPP },
            pokemonOut: {
                ...encounterState.pokemonOut,
                moves: [...encounterState.pokemonOut.moves],
                pp: [...encounterState.pokemonOut.pp],
                hp: encounterState.pokemonOut.hp - 40,
            },
        } as DbEncounter
    }
    return encounterState;
}
