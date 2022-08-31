import { SOCKET_EVENTS } from "@shared/constants/socket";
import { DbPlayer } from "@shared/models/db-player";
import { OverworldGameState, PlayerSprite, PlayerStateType } from "@shared/models/overworld-game-state";
import { Server } from "socket.io";
import { getPlayer } from "./api/helpers/get-player";
import { savePlayer } from "./api/helpers/save-player";
import { savePlayers } from "./api/helpers/save-players";
import { getAuth } from "./api/middleware/auth";
import { Player } from "./models/player";

const io = new Server(3000, {
    cors: { origin: '*' }
});

io.use(async (socket: any, next) => {
    const userToken = socket.handshake.auth.token;
    const uid = await getAuth(userToken);
    if (!uid) {
        return next(new Error('Invalid token'));
    }
    socket.uid = uid;
    next();
});

export class GameServer {
    MS = 1000 / 60;
    previousTick = Date.now();
    ticks = 0;
    lastEmittionTimestamp = 0;
    GAME_STATE_BUFFER_TIME_MS = 50;
    players: Player[] = [];
    gameState: OverworldGameState;
    overworldGameStateChanged = false;
    constructor() {
        this.gameState = { players: {} };
        io.on(SOCKET_EVENTS.CONNECTION, async (socket: any) => {
            // create player
            const uid = socket.uid;

            if (!uid) {
                throw new Error('NO UID');
            }
            // TODO: send message to clients
            console.log(`Player ${uid} has joined`);
            try {
                const dbPlayer = await getPlayer(uid);
                const playerState: DbPlayer = dbPlayer ?? {
                    uid,
                    state: PlayerStateType.STANDING_DOWN,
                    pos: {
                        x: 0,
                        y: 0,
                    },
                    sprite: PlayerSprite.FIRST,
                };
                this.gameState.players[uid] = playerState;
                this.players.push(new Player(PlayerSprite.FIRST, socket, playerState, uid));
                io.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
                socket.on(SOCKET_EVENTS.DISCONNECT, async (reason: string) => {
                    const oldPlayerState = this.gameState.players[uid];
                    let _newPlayers = this.players.filter(p => p.uid !== uid);
                    this.players = _newPlayers;
                    this.gameState.players = this.players.reduce((players, p) => ({ ...players, [p.uid]: p.dbPlayer }), {});

                    // TODO: check this again
                    io.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
                    await savePlayer(oldPlayerState);
                });
            } catch (error) {
                console.error('SOMETHING WENT WRONG', error);
            }
        });
        this.loop.bind(this)();
    }

    loop() {
        const now = Date.now();
        this.ticks++;
        if (this.previousTick + this.MS <= now) {
            const delta = (now - this.previousTick) / 1000;
            this.previousTick = now;
            this.update(delta);
            this.ticks = 0;
        }

        if (Date.now() - this.previousTick < this.MS - 16) {
            setTimeout(this.loop.bind(this));
        } else {
            setImmediate(this.loop.bind(this));
        }

    }

    async update(delta: number) {
        this.players.forEach(p => {
            const newState = p.update();
            if (newState) {

                // Register new state
                this.gameState.players[p.uid] = newState;
                this.overworldGameStateChanged = true;
            }
        });
        // Buffer state changes
        if (this.lastEmittionTimestamp < Date.now() - this.GAME_STATE_BUFFER_TIME_MS) {
            if (this.overworldGameStateChanged) {
                io.emit(SOCKET_EVENTS.STATE_CHANGE, this.gameState);
                // Save state in DB
                await savePlayers(this.gameState.players);
                this.overworldGameStateChanged = false;
            }
            this.lastEmittionTimestamp = Date.now();
        }
    }

}

