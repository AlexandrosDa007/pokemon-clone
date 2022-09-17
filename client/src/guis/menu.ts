import debounce from "lodash.debounce";
import { SpriteLoader } from "../sprite-loader";
import { Settings } from "../settings";
import { UIControl, UIManager } from "./ui-manager";
import { UI_COLORS } from '../constants/ui';

const MENU_ITEMS = [
    {
        id: 'pokedex',
        name: 'Pokedex',
        action: () => console.log('Open pokedex'),
    },
    {
        id: 'pokemon',
        name: 'Pokemon',
        action: () => console.log('Open pokemon'),
    },
    {
        id: 'exit',
        name: 'Exit',
        action: () => UIManager.IS_MENU_ACTIVE = false,
    },
];
const MENU_ITEM_OFFSET_X = 32;

export class Menu extends UIControl {
    uiControls: UIControl[];
    cursor = 0;;
    constructor() {
        super('menu', true, null, 0.28, 0.8, Settings.CANVAS_WIDTH - (0.3 * Settings.CANVAS_WIDTH), 0, () => { });
        this.uiControls = MENU_ITEMS.map((item, index) => new MenuItem(item.id, item.name, this, item.action, index));

        window.addEventListener('keydown', (ev) => {
            if (ev.key === 'ArrowDown') {
                this.move(1);
            }
            if (ev.key === 'ArrowUp') {
                this.move(-1);
            }

            if (ev.key === 'Enter') {
                this.uiControls[this.cursor].action();
            }
        });
    }

    move = debounce((add: number) => {
        const newCursor = this.cursor + add;
        if (newCursor > MENU_ITEMS.length - 1) {
            this.cursor = 0;
            return;
        }
        if (newCursor < 0) {
            this.cursor = this.uiControls.length - 1;
            return;
        }
        this.cursor = newCursor;
    }, 100);

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
        ctx.fillStyle = UI_COLORS.MENU_BG;
        ctx.fillRect(this.x, this.y, this.width * Settings.CANVAS_WIDTH, this.height * Settings.CANVAS_HEIGHT);
        ctx.strokeStyle = UI_COLORS.MENU_BORDER;
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x, this.y, this.width * Settings.CANVAS_WIDTH, this.height * Settings.CANVAS_HEIGHT);
        ctx.lineWidth = 2;
        ctx.drawImage(SpriteLoader.SPRITES.ARROW_RIGHT.image, 0, 0, SpriteLoader.SPRITES.ARROW_RIGHT.width, SpriteLoader.SPRITES.ARROW_RIGHT.height, this.x, this.y + 16 + (this.cursor * 0.1 * Settings.CANVAS_HEIGHT), 32, 32);
        this.uiControls.forEach(control => control.draw(ctx));
    }
}

class MenuItem extends UIControl {
    parent: UIControl;
    name: string;
    constructor(ID: string, name: string, parent: UIControl, action: Function, index = 0) {
        super(ID, true, null, parent.width, 0.1, parent.x, index * (Settings.CANVAS_HEIGHT * 0.1), action);
        this.name = name;
        this.parent = parent;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);
        ctx.fillStyle = UI_COLORS.MENU_ITEM_BORDER;
        ctx.font = `${Settings.FONT_SIZE}px pixel`;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.parent.x + MENU_ITEM_OFFSET_X, this.y + (this.height / 2) * Settings.CANVAS_HEIGHT);
    }
}
