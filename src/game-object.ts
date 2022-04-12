export class GameObject {
  state: BaseState;
  sprite: CanvasImageSource;
  constructor(s: BaseState, sprite: CanvasImageSource) {
    this.state = s;
    this.sprite = sprite;
  }

  update(nextState: any) {
    this.state = nextState;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.sprite, this.state.position.x, this.state.position.y);
  }
}


export interface BaseState {
  position: {
    x: number;
    y: number;
  };
}
