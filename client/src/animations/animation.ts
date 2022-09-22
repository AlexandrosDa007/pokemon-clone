import { Settings } from "../settings";

export abstract class Animation {
    id: string;
    isVisible = false;
    done = false;
    started = false;
    constructor(id: string) {
        this.id = id;
    }

    start() {
        this.started = true;
        this.done = false;
        this.isVisible = true;
    }
    
    stop() {
        console.log('stop animation');
        this.isVisible = false;
        this.done = true;
    }

    abstract update(delta: number): true | null;

    abstract render(ctx: CanvasRenderingContext2D): void;


}

export class EncounterAnimation extends Animation {
    x = 0;
    constructor() {
        super('ENCOUNTER_1');
    }

    update(delta: number) {
        this.x += 8;
        if (this.x > Settings.CANVAS_WIDTH) {
            this.stop();
            return true;
        }
        return null;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.x, Settings.CANVAS_HEIGHT);
    }

}
