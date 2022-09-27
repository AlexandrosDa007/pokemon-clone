import { Settings } from '../settings';
import _debounce from 'lodash.debounce';
import { UI_COLORS } from '../constants/ui';

export class UIManager {
  static UI_CONTROLS: UIControl[];
  static IS_MENU_ACTIVE = false;
  static OPEN_DELAY_MS = 150;

  static draw(ctx: CanvasRenderingContext2D) {
    if (UIManager.IS_MENU_ACTIVE) {
      UIManager.UI_CONTROLS.forEach((control) => control.draw(ctx));
    }
  }

  static toggleMenu = _debounce(() => {
    UIManager.IS_MENU_ACTIVE = !UIManager.IS_MENU_ACTIVE;
  }, 50);
}

export abstract class UIControl {
  ID: string;
  layer: number;
  visible: boolean;
  image: any = null;
  x: number;
  y: number;
  width = 0.2;
  height = 0.2;
  action: () => void;
  selected = false;
  parent?: UIControl;

  constructor(
    ID: string,
    visible: boolean,
    image: HTMLImageElement | null,
    width: number,
    height: number,
    x: number,
    y: number,
    action: () => void,
    layer = 0,
  ) {
    this.ID = ID;
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.visible = visible;
    this.image = image;
    this.width = width;
    this.height = height;
    this.action = action;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) {
      return;
    }
    if (this.image) {
      // draw image
      throw new Error('NOT IMPLEMENTED YET');
    }

    if (Settings.SHOW_UI_BOXES) {
      ctx.strokeStyle = UI_COLORS.DEBUG_BORDER;
      ctx.lineWidth = 8;
      ctx.strokeRect(
        this.x,
        this.y,
        this.width * Settings.CANVAS_WIDTH,
        this.height * Settings.CANVAS_HEIGHT,
      );
    }
  }
}
