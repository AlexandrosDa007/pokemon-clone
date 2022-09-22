import { SOCKET_EVENTS } from "@shared/constants/socket";
import { DbEncounter } from "@shared/models/db-encounter";
import { Socket } from "socket.io-client";
import { EncounterAnimation } from "../animations/animation";
import { Settings } from "../settings";

export class Encounter {
    animation = new EncounterAnimation();
    lastTurnReceived = -1;
    constructor(
        public encounterState: DbEncounter,
        private socket: Socket,
    ) {
        this.animation.start();
        this.socket.emit(SOCKET_EVENTS.ENCOUNTER_ACKNOWLEDGED, this.lastTurnReceived);
        setTimeout(() => {
            socket.emit(SOCKET_EVENTS.KEY, 'FIRST_ATTACK');
        }, 3000);
    }

    receiveTurn() {
        this.lastTurnReceived = this.encounterState.turnIndex;
        this.socket.emit(SOCKET_EVENTS.ENCOUNTER_ACKNOWLEDGED, this.lastTurnReceived);
    }

    setState(newState: DbEncounter) {
        // TODO: handle logic
        this.encounterState = newState;
        console.log('SIMULATING ANIMATION');
        setTimeout(() => {
            this.receiveTurn();
        }, 5000);
    }

    update(delta: number) {
        if (this.animation.isVisible && !this.animation.done) {
            console.log('Playing animation');
            this.animation.update(delta);
        }
        console.log('Updating encounter');
    }

    render(ctx: CanvasRenderingContext2D) {
        if (this.animation.isVisible && !this.animation.done) {
            this.animation.render(ctx);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(50, 50, Settings.CANVAS_WIDTH, Settings.CANVAS_HEIGHT);
            ctx.font = '14px';
            ctx.strokeStyle = 'red';
            ctx.strokeText(this.encounterState.message, 0, 150);
        }
    }
}
